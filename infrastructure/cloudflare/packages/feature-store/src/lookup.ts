/**
 * Federated feature-store lookup pipeline.
 *
 *   request → cache check → node-client fetch → cache write → lineage
 *
 * The pipeline is structured so each step is replaceable:
 *
 *   - `FeatureNodeClient` abstracts the HTTPS hop to the data provider's
 *     node-agent feature server. A `StubFeatureNodeClient` is used in
 *     tests + when `sourceEndpoint` is `stub://`.
 *
 *   - `FeatureCache` abstracts the storage. Production uses KV
 *     regionally; tests use a `Map` so we can advance time without
 *     waiting on real TTL expiration.
 *
 *   - `FeatureRegistry` handles definition-lookup + lineage logging.
 *
 * Calls are *strictly* jurisdiction-scoped: if the calling tenant's
 * region doesn't match the feature's `jurisdiction`, the lookup is
 * refused with `cross_jurisdiction`. This is non-negotiable — a US
 * tenant accidentally reading EU-resident features is exactly the
 * residency violation that Task #4 was built to prevent.
 */

import type { Region } from "@gefi/shared-types";
import type { FeatureRegistry } from "./registry.js";
import { cacheKeyFor, type FeatureCache } from "./cache.js";
import type { LookupError, LookupRequest, LookupResult } from "./types.js";

const enc = new TextEncoder();
async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  const b = new Uint8Array(buf);
  let h = "";
  for (let i = 0; i < b.length; i++) h += b[i]!.toString(16).padStart(2, "0");
  return h;
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  const keys = Object.keys(value as Record<string, unknown>).sort();
  const obj = value as Record<string, unknown>;
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalJson(obj[k])).join(",") + "}";
}

export interface NodeFetchResult {
  value: unknown;
  schemaVersion: string;
}

export interface FeatureNodeClient {
  fetch(endpoint: string, feature: string, key: string): Promise<NodeFetchResult>;
}

/**
 * Production HTTPS client — POSTs to the data provider's feature-server
 * endpoint with a signed bearer token. Constructor takes the bearer the
 * orchestrator was issued at federation-setup time.
 */
export class HttpFeatureNodeClient implements FeatureNodeClient {
  constructor(
    private readonly bearer: string,
    private readonly fetchImpl: typeof fetch = fetch,
    private readonly allowInsecureForTests: boolean = false,
  ) {}
  async fetch(endpoint: string, feature: string, key: string): Promise<NodeFetchResult> {
    // Encrypted-transport gate: feature data crosses tenant boundaries
    // and must travel over TLS. Plaintext `http://` endpoints are
    // refused outright; `stub://` is handled by `StubFeatureNodeClient`,
    // never this path. The test override exists only so unit tests can
    // point at an in-process loopback fixture.
    if (!this.allowInsecureForTests && !endpoint.startsWith("https://")) {
      throw new Error(`feature_endpoint_not_https: ${endpoint.slice(0, 16)}…`);
    }
    const res = await this.fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.bearer}` },
      body: JSON.stringify({ feature, key }),
    });
    if (!res.ok) throw new Error(`node_http_${res.status}`);
    const body = (await res.json()) as { ok: boolean; value?: unknown; schemaVersion?: string; error?: string };
    if (!body.ok || body.value === undefined) {
      throw new Error(body.error ?? "node_returned_error");
    }
    return { value: body.value, schemaVersion: body.schemaVersion ?? "v0" };
  }
}

/** Stub client used in tests + dev — value comes from a pre-seeded map. */
export class StubFeatureNodeClient implements FeatureNodeClient {
  constructor(private readonly store: Map<string, NodeFetchResult> = new Map()) {}
  put(feature: string, key: string, value: unknown, schemaVersion = "v1"): void {
    this.store.set(`${feature}:${key}`, { value, schemaVersion });
  }
  async fetch(_endpoint: string, feature: string, key: string): Promise<NodeFetchResult> {
    const v = this.store.get(`${feature}:${key}`);
    if (!v) throw new Error("key_not_found");
    return v;
  }
}

export interface LookupDeps {
  registry: FeatureRegistry;
  cache: FeatureCache;
  client: FeatureNodeClient;
  /** Caller's region — must match the feature's jurisdiction. */
  callerRegion: Region;
  /** True when the caller is a global admin (bypasses owner ACL). */
  callerIsAdmin?: boolean;
  /** Optional clock override for tests. */
  nowFn?: () => number;
}

export async function lookupFeature(
  deps: LookupDeps,
  req: LookupRequest,
): Promise<LookupResult | LookupError> {
  const now = deps.nowFn ?? (() => Math.floor(Date.now() / 1000));
  const def = await deps.registry.findBySlug(req.feature);
  if (!def) return { ok: false, error: "feature_not_found" };
  if (def.jurisdiction !== deps.callerRegion) {
    return { ok: false, error: "cross_jurisdiction" };
  }
  // Tenant-ACL: only the feature's owner tenant (or a global admin)
  // may read it. Cross-tenant sharing is intentionally not in v1 — it
  // would need an explicit `feature_share_grants` table and consent
  // workflow. Without this gate, any authenticated tenant in the same
  // region could read any feature slug, which violates multi-tenant
  // data isolation.
  if (!deps.callerIsAdmin && def.ownerTenantId !== req.tenantId) {
    return { ok: false, error: "feature_forbidden" };
  }
  const cacheKey = cacheKeyFor(req.feature, req.key);
  const t0 = Date.now();

  // Cache fast-path. We persist the canonical JSON of `{value,schemaVersion}`
  // so a single GET round-trip recovers everything we need.
  const cached = await deps.cache.get(cacheKey);
  if (cached !== null) {
    try {
      const parsed = JSON.parse(cached) as NodeFetchResult;
      const sha = await sha256Hex(canonicalJson(parsed.value));
      const latencyMs = Date.now() - t0;
      await deps.registry.recordLookup({
        featureId: def.id,
        tenantId: req.tenantId,
        modelRunId: req.modelRunId ?? null,
        lookupKey: req.key,
        resultSha256: sha,
        cached: true,
        latencyMs,
        ts: now(),
      });
      return {
        ok: true,
        value: parsed.value,
        cached: true,
        schemaVersion: parsed.schemaVersion,
        latencyMs,
        resultSha256: sha,
      };
    } catch {
      // Corrupt cache entry — fall through to a fresh fetch and let
      // the cache write below clobber it.
    }
  }

  // Cache miss — fetch from the data-provider node.
  let fetched: NodeFetchResult;
  try {
    fetched = await deps.client.fetch(def.sourceEndpoint, req.feature, req.key);
  } catch (err) {
    return { ok: false, error: `fetch_failed: ${err instanceof Error ? err.message : "unknown"}` };
  }
  const sha = await sha256Hex(canonicalJson(fetched.value));
  await deps.cache.put(cacheKey, JSON.stringify(fetched), def.defaultTtlSeconds);
  const latencyMs = Date.now() - t0;
  await deps.registry.recordLookup({
    featureId: def.id,
    tenantId: req.tenantId,
    modelRunId: req.modelRunId ?? null,
    lookupKey: req.key,
    resultSha256: sha,
    cached: false,
    latencyMs,
    ts: now(),
  });
  return {
    ok: true,
    value: fetched.value,
    cached: false,
    schemaVersion: fetched.schemaVersion,
    latencyMs,
    resultSha256: sha,
  };
}
