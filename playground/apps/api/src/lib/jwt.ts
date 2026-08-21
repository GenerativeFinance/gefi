/**
 * Minimal Ed25519 JWS (compact) implementation using Web Crypto.
 *
 * Keys are stored as JSON-stringified JWKs in env vars (JWT_SK / JWT_PK).
 * Generate a fresh keypair with `pnpm --filter @gefi-playground/api run keygen`.
 */
import { base64UrlDecode, base64UrlEncode } from "./random.js";

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

const HEADER = { alg: "EdDSA", typ: "JWT" } as const;
const HEADER_B64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(HEADER)));

async function importPrivateJwk(jwkJson: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkJson) as JsonWebKey;
  return crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, false, ["sign"]);
}

async function importPublicJwk(jwkJson: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkJson) as JsonWebKey;
  return crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, false, ["verify"]);
}

/** Sign an Ed25519 JWT. `expSeconds` defaults to 24h. */
export async function signJwt(
  payload: Omit<JwtPayload, "iat" | "exp">,
  privateJwk: string,
  expSeconds = 60 * 60 * 24,
  now = Math.floor(Date.now() / 1000),
): Promise<string> {
  const full: JwtPayload = { ...payload, iat: now, exp: now + expSeconds };
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(full)));
  const signingInput = `${HEADER_B64}.${payloadB64}`;
  const key = await importPrivateJwk(privateJwk);
  const sig = await crypto.subtle.sign(
    "Ed25519",
    key,
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${base64UrlEncode(sig)}`;
}

/** Verify and return payload, or null on any failure (bad sig, expired, malformed). */
export async function verifyJwt(
  token: string,
  publicJwk: string,
  now = Math.floor(Date.now() / 1000),
): Promise<JwtPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [h, p, s] = parts as [string, string, string];
    const headerJson = JSON.parse(new TextDecoder().decode(base64UrlDecode(h)));
    if (headerJson.alg !== "EdDSA") return null;
    const key = await importPublicJwk(publicJwk);
    const ok = await crypto.subtle.verify(
      "Ed25519",
      key,
      base64UrlDecode(s) as BufferSource,
      new TextEncoder().encode(`${h}.${p}`) as BufferSource,
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(p))) as JwtPayload;
    if (typeof payload.exp !== "number" || payload.exp <= now) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Generate a fresh Ed25519 keypair as a pair of JWK JSON strings. */
export async function generateKeypair(): Promise<{ privateJwk: string; publicJwk: string }> {
  const kp = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  const [priv, pub] = await Promise.all([
    crypto.subtle.exportKey("jwk", kp.privateKey),
    crypto.subtle.exportKey("jwk", kp.publicKey),
  ]);
  return { privateJwk: JSON.stringify(priv), publicJwk: JSON.stringify(pub) };
}
