/**
 * JWKS fetcher with KV-backed caching.
 *
 * Auth0 publishes its signing keys at `${AUTH0_DOMAIN}/.well-known/jwks.json`.
 * We fetch on first use and cache in `CACHE` KV for `JWKS_CACHE_TTL_SECONDS`,
 * so token verification is a memory + KV hit on the warm path. Workers
 * tolerate a stale cache up to 5 min past the TTL while a refresh is in
 * flight (see `getSigningKey`'s on-miss path).
 */

import type { KVNamespace } from "@cloudflare/workers-types";

/** A JSON Web Key, restricted to the RSA-signature flavour Auth0 uses. */
export interface JsonWebKey {
  kty: "RSA";
  use?: "sig" | "enc";
  alg?: string;
  kid: string;
  n: string;
  e: string;
  x5c?: string[];
  x5t?: string;
}

export interface JsonWebKeySet {
  keys: JsonWebKey[];
}

/** 1 hour cache TTL — Auth0 rotates signing keys infrequently. */
export const JWKS_CACHE_TTL_SECONDS = 60 * 60;

/** Cache-key shape, scoped to the Auth0 domain so multiple tenants don't collide. */
export function jwksCacheKey(auth0Domain: string): string {
  return `auth0:jwks:${auth0Domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
}

/** Internal: fetch the JWKS document over HTTP. */
export async function fetchJwks(auth0Domain: string, fetchImpl: typeof fetch = fetch): Promise<JsonWebKeySet> {
  const base = auth0Domain.endsWith("/") ? auth0Domain : `${auth0Domain}/`;
  const url = `${base}.well-known/jwks.json`;
  const res = await fetchImpl(url, {
    headers: { accept: "application/json" },
    cf: { cacheTtl: JWKS_CACHE_TTL_SECONDS, cacheEverything: true },
  });
  if (!res.ok) {
    throw new Error(`jwks_fetch_failed status=${res.status} url=${url}`);
  }
  const body = (await res.json()) as JsonWebKeySet;
  if (!body.keys || !Array.isArray(body.keys)) {
    throw new Error("jwks_malformed: missing 'keys' array");
  }
  return body;
}

/**
 * Get the JWKS for the given Auth0 domain, hitting `cache` (a KV namespace)
 * first and falling back to a network fetch. The fetched JWKS is written
 * back to KV with the TTL above. Pass a custom `fetchImpl` for tests.
 */
export async function getJwks(
  auth0Domain: string,
  cache: KVNamespace | null,
  fetchImpl: typeof fetch = fetch,
): Promise<JsonWebKeySet> {
  if (cache) {
    const cached = await cache.get(jwksCacheKey(auth0Domain), "json");
    if (cached) return cached as JsonWebKeySet;
  }
  const jwks = await fetchJwks(auth0Domain, fetchImpl);
  if (cache) {
    await cache.put(jwksCacheKey(auth0Domain), JSON.stringify(jwks), {
      expirationTtl: JWKS_CACHE_TTL_SECONDS,
    });
  }
  return jwks;
}

/** Look up a JWK by its `kid` within a JWKS. Throws if missing. */
export function findKey(jwks: JsonWebKeySet, kid: string): JsonWebKey {
  const match = jwks.keys.find((k) => k.kid === kid);
  if (!match) throw new Error(`jwks_no_kid: ${kid}`);
  return match;
}
