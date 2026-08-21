/**
 * Bearer-token + jurisdiction-peek helpers.
 *
 * The Auth0 RS256 verifier (`verifyAuth0Token`, `verifyAuth0TokenLoose`,
 * JWKS fetcher, M2M client) was removed when GeFi pivoted off Auth0.
 * Token verification is the responsibility of the upcoming `gefi-auth`
 * Cloudflare Worker (D1 + KV + Workers crypto).
 *
 * Two helpers survive here because they are JWT-vendor-agnostic:
 *
 *   - `extractBearer()` parses the `Authorization: Bearer …` header.
 *   - `peekJurisdiction()` decodes a token's payload WITHOUT verifying
 *     the signature, returning the GeFi jurisdiction claim if present.
 *     Used at the public edge to pick a region before forwarding;
 *     unsafe for any authorisation decision.
 *
 * `LooseAuthClaims` is re-exported here for the same reason — the
 * middleware + router still need a stable shape for "authenticated
 * principal whose tenant claims may not yet be populated".
 */

import type { Region, EntityType, KycTier, Persona, SubscriptionTier } from "@gefi/shared-types";
import { GEFI_CLAIM_NS } from "./types.js";

const decoder = new TextDecoder();

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const bin = atob(padded + "=".repeat(padLen));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Standard JWT claims plus optional GeFi custom claims. Matches the
 * shape `verifyAuth0TokenLoose` used to return; preserved so callers
 * (the middleware, the router, the onboard handler) keep compiling
 * once the new `gefi-auth` Worker ships and re-populates this type
 * from its own verifier.
 */
export interface LooseAuthClaims {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  azp?: string;
  scope?: string;
  jurisdiction?: Region;
  entity_type?: EntityType;
  tenant_id?: string;
  roles?: Persona[];
  kyc_tier?: KycTier;
  subscription_tier?: SubscriptionTier;
  email?: string;
  email_verified?: boolean;
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
