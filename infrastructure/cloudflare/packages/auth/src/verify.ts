/**
 * Auth0 user-token verifier (RS256).
 *
 * `verifyAuth0Token()` is the single entry point. Given a raw Bearer token
 * it:
 *
 *   1. parses + validates the JWT structure
 *   2. resolves the signing key from JWKS (via the `getJwks` helper, which
 *      is KV-cached)
 *   3. verifies the RS256 signature over the protected header + payload
 *   4. checks `iss`, `aud`, and `exp`
 *   5. flattens namespaced GeFi claims (`https://gefi.io/jurisdiction`, etc.)
 *      into the unnamespaced shape declared in `GefiAuthClaims`.
 *
 * It throws on any failure, with a small set of stable error codes the
 * middleware in `gefi-api` maps to HTTP 401/403:
 *
 *   - `auth_token_malformed`         400-bucket: bad shape
 *   - `auth_token_signature_invalid` 401: signature doesn't verify
 *   - `auth_token_expired`           401: exp in the past
 *   - `auth_token_issuer_mismatch`   401: iss not our Auth0 tenant
 *   - `auth_token_audience_mismatch` 401: aud not our API identifier
 *   - `auth_token_claims_missing`    403: required custom claim absent
 *
 * `peekJurisdiction()` is a separate, signature-IGNORING helper that lets
 * the public edge route a forwarded request to the right region BEFORE the
 * regional sibling verifies the token. Forwarding a token to the wrong
 * region is safe — the regional sibling will reject it.
 */

import type { KVNamespace } from "@cloudflare/workers-types";
import type { Region, EntityType, KycTier, Persona, SubscriptionTier } from "@gefi/shared-types";
import { findKey, getJwks, type JsonWebKey } from "./jwks.js";
import { GEFI_CLAIM_NS, type GefiAuthClaims } from "./types.js";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const bin = atob(padded + "=".repeat(padLen));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

interface JwtParts {
  header: { alg: string; typ?: string; kid?: string };
  payload: Record<string, unknown>;
  headerB64: string;
  payloadB64: string;
  signatureBytes: Uint8Array;
}

function parseJwt(token: string): JwtParts {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("auth_token_malformed");
  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];
  let header: JwtParts["header"];
  let payload: JwtParts["payload"];
  try {
    header = JSON.parse(decoder.decode(base64UrlDecode(headerB64)));
    payload = JSON.parse(decoder.decode(base64UrlDecode(payloadB64)));
  } catch {
    throw new Error("auth_token_malformed");
  }
  return {
    header,
    payload,
    headerB64,
    payloadB64,
    signatureBytes: base64UrlDecode(sigB64),
  };
}

async function importRsaJwk(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    jwk as unknown as JsonWebKey & { ext?: boolean },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
}

function flattenCustomClaims(payload: Record<string, unknown>): Partial<GefiAuthClaims> {
  const ns = GEFI_CLAIM_NS;
  const out: Partial<GefiAuthClaims> = {};
  // Standard claims (already unnamespaced).
  if (typeof payload.iss === "string") out.iss = payload.iss;
  if (typeof payload.sub === "string") out.sub = payload.sub;
  if (Array.isArray(payload.aud) || typeof payload.aud === "string") {
    out.aud = payload.aud as string | string[];
  }
  if (typeof payload.exp === "number") out.exp = payload.exp;
  if (typeof payload.iat === "number") out.iat = payload.iat;
  if (typeof payload.azp === "string") out.azp = payload.azp;
  if (typeof payload.scope === "string") out.scope = payload.scope;

  // Custom claims, accepted both namespaced (production Auth0) and
  // unnamespaced (test-only / dev shortcut).
  const j = (payload[`${ns}jurisdiction`] ?? payload.jurisdiction) as Region | undefined;
  const e = (payload[`${ns}entity_type`] ?? payload.entity_type) as EntityType | undefined;
  const t = (payload[`${ns}tenant_id`] ?? payload.tenant_id) as string | undefined;
  const r = (payload[`${ns}roles`] ?? payload.roles) as Persona[] | undefined;
  const kt = (payload[`${ns}kyc_tier`] ?? payload.kyc_tier) as KycTier | undefined;
  const st = (payload[`${ns}subscription_tier`] ?? payload.subscription_tier) as SubscriptionTier | undefined;
  const em = (payload[`${ns}email`] ?? payload.email) as string | undefined;
  const ev = (payload[`${ns}email_verified`] ?? payload.email_verified) as boolean | undefined;

  if (j !== undefined) out.jurisdiction = j;
  if (e !== undefined) out.entity_type = e;
  if (t !== undefined) out.tenant_id = t;
  if (r !== undefined) out.roles = r;
  if (kt !== undefined) out.kyc_tier = kt;
  if (st !== undefined) out.subscription_tier = st;
  if (em !== undefined) out.email = em;
  if (ev !== undefined) out.email_verified = ev;
  return out;
}

function audienceContains(aud: string | string[], expected: string): boolean {
  return typeof aud === "string" ? aud === expected : aud.includes(expected);
}

export interface VerifyAuth0Options {
  auth0Domain: string;
  audience: string;
  cache?: KVNamespace | null;
  /** Override `Date.now()` for deterministic tests. */
  now?: () => number;
  /** Override `fetch` so tests can serve the JWKS in-process. */
  fetchImpl?: typeof fetch;
  /** Skip JWKS lookup and use this key directly (test-only escape hatch). */
  signingKey?: JsonWebKey;
}

/**
 * A successfully signature-validated token whose GeFi custom claims may
 * not yet be populated (e.g. a freshly signed-up user calling
 * `/v1/auth/onboard` before they have a tenant). Used as the return type
 * of {@link verifyAuth0TokenLoose}; promoted to `GefiAuthClaims` by
 * {@link verifyAuth0Token} after asserting the custom claims are present.
 */
export type LooseAuthClaims = StandardClaimsType & Partial<Omit<GefiAuthClaims, keyof StandardClaimsType>>;
type StandardClaimsType = Pick<GefiAuthClaims, "iss" | "sub" | "aud" | "exp" | "iat" | "azp" | "scope">;

/**
 * Verify a raw Bearer token (no `Bearer ` prefix), returning the
 * standard claims plus whatever GeFi custom claims happen to be
 * present. Custom claims are NOT required.
 *
 * Used by the onboarding handler. Throws on any signature / iss / aud
 * / exp failure — the only difference from `verifyAuth0Token` is that
 * it does not require `tenant_id`/`jurisdiction`/`entity_type`/`roles`.
 */
export async function verifyAuth0TokenLoose(
  token: string,
  opts: VerifyAuth0Options,
): Promise<LooseAuthClaims> {
  const now = opts.now ?? (() => Math.floor(Date.now() / 1000));
  const fetchImpl = opts.fetchImpl ?? fetch;

  const parsed = parseJwt(token);
  if (parsed.header.alg !== "RS256") throw new Error("auth_token_malformed");

  // Resolve signing key.
  let jwk: JsonWebKey;
  if (opts.signingKey) {
    jwk = opts.signingKey;
  } else {
    if (!parsed.header.kid) throw new Error("auth_token_malformed");
    const jwks = await getJwks(opts.auth0Domain, opts.cache ?? null, fetchImpl);
    jwk = findKey(jwks, parsed.header.kid);
  }
  const key = await importRsaJwk(jwk);

  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    parsed.signatureBytes,
    encoder.encode(`${parsed.headerB64}.${parsed.payloadB64}`),
  );
  if (!ok) throw new Error("auth_token_signature_invalid");

  // Standard claim checks.
  const expectedIss = opts.auth0Domain.endsWith("/") ? opts.auth0Domain : `${opts.auth0Domain}/`;
  if (parsed.payload.iss !== expectedIss) throw new Error("auth_token_issuer_mismatch");
  if (
    !parsed.payload.aud ||
    !audienceContains(parsed.payload.aud as string | string[], opts.audience)
  ) {
    throw new Error("auth_token_audience_mismatch");
  }
  if (typeof parsed.payload.exp !== "number" || parsed.payload.exp <= now()) {
    throw new Error("auth_token_expired");
  }

  const flat = flattenCustomClaims(parsed.payload);
  if (!flat.iss || !flat.sub || !flat.aud || !flat.exp || !flat.iat) {
    throw new Error("auth_token_claims_missing");
  }
  return flat as LooseAuthClaims;
}

/**
 * Strict verifier — the standard path used by every protected handler.
 * Wraps {@link verifyAuth0TokenLoose} and additionally asserts that the
 * GeFi custom claims (`tenant_id`, `jurisdiction`, `entity_type`,
 * `roles`) are present. Onboarding is the *only* endpoint that should
 * use the loose form.
 */
export async function verifyAuth0Token(
  token: string,
  opts: VerifyAuth0Options,
): Promise<GefiAuthClaims> {
  const loose = await verifyAuth0TokenLoose(token, opts);
  if (!loose.jurisdiction || !loose.tenant_id || !loose.entity_type || !loose.roles) {
    throw new Error("auth_token_claims_missing");
  }
  return loose as GefiAuthClaims;
}

/**
 * Inspect the *unverified* `jurisdiction` claim on a token, used at the
 * public edge to pick a region before forwarding. Returns null on any
 * parse failure or missing claim — callers should fall back to
 * `cf.country`-based routing in that case.
 *
 * SAFETY: this does NOT verify the signature. Forwarding to the wrong
 * region is safe because the regional sibling re-verifies and rejects
 * mismatches. Never use this output for authorisation decisions.
 */
export function peekJurisdiction(token: string): Region | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(decoder.decode(base64UrlDecode(parts[1] as string))) as Record<string, unknown>;
    const j = (payload[`${GEFI_CLAIM_NS}jurisdiction`] ?? payload.jurisdiction) as unknown;
    return j === "eu" || j === "us" ? j : null;
  } catch {
    return null;
  }
}

/** Pull a Bearer token off an Authorization header. Returns null if absent. */
export function extractBearer(header: string | null | undefined): string | null {
  if (!header) return null;
  const m = /^Bearer\s+(.+)$/i.exec(header.trim());
  return m && m[1] ? m[1].trim() : null;
}
