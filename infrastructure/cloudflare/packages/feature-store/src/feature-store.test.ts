import { describe, expect, it } from "vitest";
import { MemoryFeatureCache, cacheKeyFor } from "./cache.js";
import { lookupFeature, StubFeatureNodeClient } from "./lookup.js";
import type { FeatureRegistry } from "./registry.js";
import type { FeatureDefinition, FeatureLookup } from "./types.js";

class FakeRegistry {
  defs = new Map<string, FeatureDefinition>();
  lookups: FeatureLookup[] = [];
  private nextId = 1;

  put(def: FeatureDefinition): void {
    this.defs.set(def.slug, def);
  }
  async findBySlug(slug: string): Promise<FeatureDefinition | null> {
    return this.defs.get(slug) ?? null;
  }
  async findById(id: string): Promise<FeatureDefinition | null> {
    for (const d of this.defs.values()) if (d.id === id) return d;
    return null;
  }
  async list(): Promise<FeatureDefinition[]> {
    return [...this.defs.values()];
  }
  async recordLookup(input: {
    featureId: string;
    tenantId: string;
    modelRunId?: string | null;
    lookupKey: string;
    resultSha256: string;
    cached: boolean;
    latencyMs: number;
    ts?: number;
  }): Promise<FeatureLookup> {
    const l: FeatureLookup = {
      id: `fl_${this.nextId++}`,
      featureId: input.featureId,
      tenantId: input.tenantId,
      modelRunId: input.modelRunId ?? null,
      lookupKey: input.lookupKey,
      resultSha256: input.resultSha256,
      cached: input.cached,
      latencyMs: input.latencyMs,
      createdAt: input.ts ?? 0,
    };
    this.lookups.push(l);
    return l;
  }
}

function makeDef(overrides: Partial<FeatureDefinition> = {}): FeatureDefinition {
  return {
    id: "ft_test",
    slug: "price_volatility",
    ownerTenantId: "t_owner",
    jurisdiction: "us",
    schemaJson: "{}",
    defaultTtlSeconds: 60,
    sourceEndpoint: "stub://demo",
    description: "",
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

describe("feature-store / cache", () => {
  it("returns null for missing keys", async () => {
    const c = new MemoryFeatureCache(() => 1000);
    expect(await c.get("k")).toBeNull();
  });

  it("expires entries after TTL", async () => {
    let now = 1000;
    const c = new MemoryFeatureCache(() => now);
    await c.put("k", "v", 5);
    expect(await c.get("k")).toBe("v");
    now = 1010;
    expect(await c.get("k")).toBeNull();
  });

  it("delete removes entry", async () => {
    const c = new MemoryFeatureCache(() => 1000);
    await c.put("k", "v", 100);
    await c.delete("k");
    expect(await c.get("k")).toBeNull();
  });

  it("cacheKeyFor stable shape", () => {
    expect(cacheKeyFor("foo", "bar")).toBe("foo:bar");
  });
});

describe("feature-store / lookup", () => {
  it("rejects cross-jurisdiction call", async () => {
    const reg = new FakeRegistry();
    reg.put(makeDef({ jurisdiction: "eu" }));
    const cache = new MemoryFeatureCache();
    const client = new StubFeatureNodeClient();
    const r = await lookupFeature(
      { registry: reg as unknown as FeatureRegistry, cache, client, callerRegion: "us" },
      { tenantId: "t1", feature: "price_volatility", key: "AAPL" },
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("cross_jurisdiction");
  });

  it("returns feature_not_found when no def", async () => {
    const reg = new FakeRegistry();
    const r = await lookupFeature(
      { registry: reg as unknown as FeatureRegistry, cache: new MemoryFeatureCache(), client: new StubFeatureNodeClient(), callerRegion: "us" },
      { tenantId: "t", feature: "nope", key: "x" },
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("feature_not_found");
  });

  it("fetches from node on cache miss + records lineage", async () => {
    const reg = new FakeRegistry();
    reg.put(makeDef());
    const cache = new MemoryFeatureCache();
    const client = new StubFeatureNodeClient();
    client.put("price_volatility", "AAPL", 0.32, "v3");
    const r = await lookupFeature(
      { registry: reg as unknown as FeatureRegistry, cache, client, callerRegion: "us" },
      { tenantId: "t1", feature: "price_volatility", key: "AAPL" },
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toBe(0.32);
      expect(r.cached).toBe(false);
      expect(r.schemaVersion).toBe("v3");
      expect(r.resultSha256).toMatch(/^[0-9a-f]{64}$/);
    }
    expect(reg.lookups.length).toBe(1);
    expect(reg.lookups[0]!.cached).toBe(false);
  });

  it("serves cached value on second call", async () => {
    const reg = new FakeRegistry();
    reg.put(makeDef());
    const cache = new MemoryFeatureCache();
    const client = new StubFeatureNodeClient();
    client.put("price_volatility", "AAPL", { vol: 0.4 });
    await lookupFeature(
      { registry: reg as unknown as FeatureRegistry, cache, client, callerRegion: "us" },
      { tenantId: "t1", feature: "price_volatility", key: "AAPL" },
    );
    const r = await lookupFeature(
      { registry: reg as unknown as FeatureRegistry, cache, client, callerRegion: "us" },
      { tenantId: "t1", feature: "price_volatility", key: "AAPL" },
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.cached).toBe(true);
    expect(reg.lookups.length).toBe(2);
    expect(reg.lookups[1]!.cached).toBe(true);
  });

  it("returns fetch_failed when node throws", async () => {
    const reg = new FakeRegistry();
    reg.put(makeDef());
    const r = await lookupFeature(
      { registry: reg as unknown as FeatureRegistry, cache: new MemoryFeatureCache(), client: new StubFeatureNodeClient(), callerRegion: "us" },
      { tenantId: "t1", feature: "price_volatility", key: "MISSING" },
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.startsWith("fetch_failed:")).toBe(true);
  });

  it("identical inputs produce identical resultSha256", async () => {
    const reg = new FakeRegistry();
    reg.put(makeDef());
    const cache1 = new MemoryFeatureCache();
    const cache2 = new MemoryFeatureCache();
    const c1 = new StubFeatureNodeClient();
    c1.put("price_volatility", "AAPL", { x: 1 });
    const c2 = new StubFeatureNodeClient();
    c2.put("price_volatility", "AAPL", { x: 1 });
    const r1 = await lookupFeature({ registry: reg as unknown as FeatureRegistry, cache: cache1, client: c1, callerRegion: "us" }, { tenantId: "t", feature: "price_volatility", key: "AAPL" });
    const r2 = await lookupFeature({ registry: reg as unknown as FeatureRegistry, cache: cache2, client: c2, callerRegion: "us" }, { tenantId: "t", feature: "price_volatility", key: "AAPL" });
    expect(r1.ok && r2.ok).toBe(true);
    if (r1.ok && r2.ok) expect(r1.resultSha256).toBe(r2.resultSha256);
  });
});
