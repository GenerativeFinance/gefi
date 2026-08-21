/**
 * Regional feature cache.
 *
 * Production: Cloudflare KV namespace, prefixed by `${WORKER_REGION}:` so
 * the EU edge can never read a US-cached value. Cache hits short-circuit
 * the lookup pipeline before the data-provider HTTP hop.
 *
 * The TTL on each entry is the feature definition's `defaultTtlSeconds`;
 * downstream consumers can override per-call. The cache key is
 * `${prefix}${featureSlug}:${key}` so an operator can flush a single
 * feature with a `kv list --prefix=feat:eu:price_volatility:` sweep.
 */

export interface FeatureCache {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class KvFeatureCache implements FeatureCache {
  constructor(private readonly kv: KVNamespace, private readonly prefix: string) {}
  private k(key: string): string {
    return `${this.prefix}${key}`;
  }
  async get(key: string): Promise<string | null> {
    return this.kv.get(this.k(key));
  }
  async put(key: string, value: string, ttlSeconds: number): Promise<void> {
    // KV minimum TTL is 60s — clamp upward without surfacing the error
    // (callers don't care that we honoured exactly their TTL).
    const ttl = Math.max(60, ttlSeconds);
    await this.kv.put(this.k(key), value, { expirationTtl: ttl });
  }
  async delete(key: string): Promise<void> {
    await this.kv.delete(this.k(key));
  }
}

interface MemoryEntry {
  value: string;
  expiresAt: number;
}

export class MemoryFeatureCache implements FeatureCache {
  private readonly store = new Map<string, MemoryEntry>();
  constructor(private readonly nowFn: () => number = () => Math.floor(Date.now() / 1000)) {}
  async get(key: string): Promise<string | null> {
    const e = this.store.get(key);
    if (!e) return null;
    if (e.expiresAt <= this.nowFn()) {
      this.store.delete(key);
      return null;
    }
    return e.value;
  }
  async put(key: string, value: string, ttlSeconds: number): Promise<void> {
    this.store.set(key, { value, expiresAt: this.nowFn() + Math.max(1, ttlSeconds) });
  }
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

/** Build the canonical cache key. Exported so tests can pre-seed entries. */
export function cacheKeyFor(featureSlug: string, key: string): string {
  return `${featureSlug}:${key}`;
}
