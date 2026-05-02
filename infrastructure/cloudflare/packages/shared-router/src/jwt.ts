/**
 * Internal HS256 JWT helpers used by the public `gefi-api` Worker to
 * authenticate forwarded requests to a regional `gefi-api` deployment.
 *
 * These are *internal* tokens — they are NOT user auth (that's Task #3,
 * Auth0 + RS256). They exist only to prove that a request reached a regional
 * Worker via the public router and not by direct DNS bypass.
 *
 * Token shape:
 *   header  = { "alg": "HS256", "typ": "JWT" }
 *   payload = { iss: "gefi-api", aud: "gefi-api-<region>",
 *               sub: "internal-edge", region, exp, iat, jti }
 *
 * Tokens are short-lived (60 s default) and never persisted. Replay is
 * mitigated by the short TTL plus a `jti` that downstream Workers may
 * de-duplicate via KV if they want extra defence in depth.
 */

import type { Region } from "@gefi/shared-types";

export interface InternalJwtClaims {
  iss: "gefi-api";
  aud: `gefi-api-${Region}`;
  sub: "internal-edge";
  region: Region;
  iat: number;
  exp: number;
  jti: string;
}

const encoder = new TextEncoder();

function base64UrlEncode(input: ArrayBuffer | Uint8Array | string): string {
  const bytes =
    typeof input === "string"
      ? encoder.encode(input)
      : input instanceof Uint8Array
      ? input
      : new Uint8Array(input);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    const code = bytes[i];
    if (code !== undefined) bin += String.fromCharCode(code);
  }
  return btoa(bin).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const bin = atob(padded + "=".repeat(padLen));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(secret: string, usage: KeyUsage): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

/** Mint a fresh internal JWT for `region`. */
export async function signInternalJwt(
  region: Region,
  secret: string,
  ttlSeconds = 60,
  now: () => number = () => Math.floor(Date.now() / 1000),
): Promise<string> {
  const iat = now();
  const claims: InternalJwtClaims = {
    iss: "gefi-api",
    aud: `gefi-api-${region}`,
    sub: "internal-edge",
    region,
    iat,
    exp: iat + ttlSeconds,
    jti: crypto.randomUUID(),
  };
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify(claims));
  const signingInput = `${header}.${payload}`;
  const key = await importKey(secret, "sign");
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(signingInput));
  return `${signingInput}.${base64UrlEncode(sig)}`;
}

/**
 * Verify a token signed by `signInternalJwt`. Returns the parsed claims if
 * the signature is valid AND `exp` is in the future. Throws otherwise.
 */
export async function verifyInternalJwt(
  token: string,
  secret: string,
  expectedRegion: Region,
  now: () => number = () => Math.floor(Date.now() / 1000),
): Promise<InternalJwtClaims> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("malformed token");
  const [header, payload, sig] = parts as [string, string, string];

  const key = await importKey(secret, "verify");
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(sig),
    encoder.encode(`${header}.${payload}`),
  );
  if (!ok) throw new Error("invalid signature");

  let claims: InternalJwtClaims;
  try {
    claims = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))) as InternalJwtClaims;
  } catch {
    throw new Error("malformed payload");
  }

  if (claims.iss !== "gefi-api") throw new Error("bad issuer");
  if (claims.sub !== "internal-edge") throw new Error("bad subject");
  if (claims.region !== expectedRegion) throw new Error("region mismatch");
  if (claims.aud !== `gefi-api-${expectedRegion}`) throw new Error("audience mismatch");
  if (claims.exp <= now()) throw new Error("token expired");
  return claims;
}
