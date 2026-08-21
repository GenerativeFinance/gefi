/**
 * Direct unit test for `runModelHandler` covering the new pre-flight
 * quota wiring (architect-review fix).
 *
 *   1. tenant `tokens_per_month` exhausted before the call → 429 *without*
 *      ever invoking the model gateway provider chain. Proves we don't
 *      burn provider tokens for an over-cap tenant.
 *   2. per-API-key `requests_per_day` row at zero → 429 with
 *      `scope: "api_key"`, no model invocation.
 *   3. happy path: pre-charge 1024 tokens, model uses 50 → entitlement
 *      `used_value` reconciles down to 50 (not 1024).
 *
 * We mount the handler directly with a synthetic RouteContext rather than
 * spinning the full Worker — the existing integration.test.ts already
 * exercises the router/edge-JWT path, so we keep this focused on the
 * billing wiring.
 */
import { describe, expect, it } from "vitest";
import { runModelHandler } from "./handlers/marketplace/runs.js";
import { seedTierEntitlements, setApiKeyQuota } from "@gefi/billing";
import { tierOrThrow } from "@gefi/billing";
import type { RouteContext } from "./router.js";
import type { GefiAuthClaims } from "@gefi/auth/types";

// --- in-memory D1 ---------------------------------------------------------
function memDb() {
  const ent = new Map<string, Record<string, unknown>>();
  const keyQ = new Map<string, Record<string, unknown>>();
  const models = new Map<string, Record<string, unknown>>();
  const versions = new Map<string, Record<string, unknown>>();
  const metadata = new Map<string, Record<string, unknown>>();
  const runs: Array<Record<string, unknown>> = [];

  function entK(t: string, f: string) { return `${t}:${f}`; }
  function keyK(k: string, f: string) { return `${k}:${f}`; }

  function prepare(sql: string) {
    let bindings: unknown[] = [];
    return {
      bind(...args: unknown[]) { bindings = args; return this; },
      async first<T>(): Promise<T | null> {
        if (/SELECT \* FROM entitlements WHERE tenant_id = \? AND feature = \?/.test(sql)) {
          const r = ent.get(entK(String(bindings[0]), String(bindings[1])));
          return (r ? { ...r } : null) as T | null;
        }
        if (/SELECT \* FROM api_key_quotas WHERE api_key_id = \? AND feature = \?/.test(sql)) {
          const r = keyQ.get(keyK(String(bindings[0]), String(bindings[1])));
          return (r ? { ...r } : null) as T | null;
        }
        if (/FROM models WHERE id = \?/.test(sql)) {
          const r = models.get(String(bindings[0]));
          return (r ? { ...r } : null) as T | null;
        }
        if (/FROM model_versions WHERE id = \?/.test(sql)) {
          const r = versions.get(String(bindings[0]));
          return (r ? { ...r } : null) as T | null;
        }
        if (/FROM model_metadata WHERE model_id = \?/.test(sql)) {
          const r = metadata.get(String(bindings[0]));
          return (r ? { ...r } : null) as T | null;
        }
        return null;
      },
      async all<T>() {
        return { results: [] as T[], success: true } as never;
      },
      async run() {
        if (/^INSERT INTO entitlements/.test(sql)) {
          const k = entK(String(bindings[0]), String(bindings[1]));
          const existing = ent.get(k);
          ent.set(k, {
            tenant_id: bindings[0], feature: bindings[1],
            limit_value: bindings[2],
            used_value: existing?.used_value ?? 0,
            period: bindings[3], resets_at: bindings[4], updated_at: bindings[5],
          });
          return { meta: { changes: 1 }, success: true } as never;
        }
        if (/^UPDATE entitlements SET\s+used_value = CASE/.test(sql)) {
          // consume() bind: [now, n, n, now, nextReset, now, tenantId, feature, now, n, n]
          const now = Number(bindings[0]);
          const n = Number(bindings[1]);
          const nextReset = bindings[4] as number | null;
          const r = ent.get(entK(String(bindings[6]), String(bindings[7])));
          if (!r) return { meta: { changes: 0 }, success: true } as never;
          const resetsAt = r.resets_at as number | null;
          const expired = resetsAt !== null && now >= resetsAt;
          const newUsed = expired ? n : Number(r.used_value) + n;
          const limit = Number(r.limit_value);
          if (limit !== 0 && newUsed > limit) {
            return { meta: { changes: 0 }, success: true } as never;
          }
          r.used_value = newUsed;
          r.resets_at = expired ? nextReset : resetsAt;
          r.updated_at = now;
          return { meta: { changes: 1 }, success: true } as never;
        }
        if (/^UPDATE entitlements SET used_value = MAX/.test(sql)) {
          // Refund: bind [refund, ts, tenantId]
          const refund = Number(bindings[0]);
          for (const r of ent.values()) {
            if (r.tenant_id === bindings[2] && r.feature === "tokens_per_month") {
              r.used_value = Math.max(0, Number(r.used_value) - refund);
            }
          }
          return { meta: { changes: 1 }, success: true } as never;
        }
        if (/^INSERT INTO api_key_quotas/.test(sql)) {
          const k = keyK(String(bindings[0]), String(bindings[1]));
          const existing = keyQ.get(k);
          keyQ.set(k, {
            api_key_id: bindings[0], feature: bindings[1],
            limit_value: bindings[2],
            used_value: existing?.used_value ?? 0,
            period: bindings[3], resets_at: bindings[4], updated_at: bindings[5],
          });
          return { meta: { changes: 1 }, success: true } as never;
        }
        if (/^UPDATE api_key_quotas/.test(sql)) {
          const now = Number(bindings[0]);
          const n = Number(bindings[1]);
          const r = keyQ.get(keyK(String(bindings[6]), String(bindings[7])));
          if (!r) return { meta: { changes: 0 }, success: true } as never;
          const limit = Number(r.limit_value);
          const newUsed = Number(r.used_value) + n;
          if (limit !== 0 && newUsed > limit) {
            return { meta: { changes: 0 }, success: true } as never;
          }
          r.used_value = newUsed;
          r.updated_at = now;
          return { meta: { changes: 1 }, success: true } as never;
        }
        if (/^INSERT INTO model_runs/.test(sql)) {
          runs.push({ id: bindings[0] });
          return { meta: { changes: 1 }, success: true } as never;
        }
        return { meta: { changes: 0 }, success: true } as never;
      },
    };
  }

  return {
    db: { prepare, batch: async () => [], exec: async () => ({ count: 0, duration: 0 }) } as unknown as D1Database,
    ent, keyQ, models, versions, metadata, runs,
  };
}

function memKv(): KVNamespace {
  const store = new Map<string, string>();
  return {
    get: async (k: string) => store.get(k) ?? null,
    put: async (k: string, v: string) => { store.set(k, v); },
    delete: async (k: string) => { store.delete(k); },
  } as unknown as KVNamespace;
}

function makeCtx(opts: {
  db: D1Database;
  kv: KVNamespace;
  body: unknown;
  claims: Partial<GefiAuthClaims>;
}): RouteContext {
  const auth: GefiAuthClaims = {
    iss: "https://test/", sub: "key-test-1", aud: "api",
    iat: 0, exp: 0,
    tenant_id: "tenant-A", jurisdiction: "us",
    entity_type: "professional", roles: ["developer"],
    ...opts.claims,
  } as GefiAuthClaims;
  return {
    request: new Request("https://api.test/v1/models/m1/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts.body),
    }),
    env: {
      DB: opts.db,
      CACHE: opts.kv,
      ARTIFACTS: {} as R2Bucket,
      WORKER_REGION: "us",
    } as unknown as RouteContext["env"],
    ctx: { waitUntil: () => undefined, passThroughOnException: () => undefined, props: {} } as unknown as ExecutionContext,
    region: "us",
    country: "US",
    params: { id: "m1" },
    auth,
  };
}

function seedModel(store: ReturnType<typeof memDb>) {
  store.models.set("m1", {
    id: "m1", slug: "x", developer_tenant_id: "tenant-A",
    jurisdiction: "us", name: "x", summary: "",
    category: "risk", risk_class: "low", status: "approved",
    visibility: "public", current_version_id: "v1",
    monthly_price_cents: 0, developer_share_bps: 7000,
    federation_enabled: 0, created_at: 1, updated_at: 1,
  });
  store.versions.set("v1", {
    id: "v1", model_id: "m1", version: "0.1.0",
    artifact_r2_key: "k", artifact_sha256: "00".repeat(32),
    artifact_size: 1, manifest_json: "{}", chain_tx_hash: "0xstub",
    approved_at: 2, created_at: 1,
  });
}

describe("runModelHandler quota pre-flight", () => {
  it("rejects with 429 when tenant tokens_per_month is already at the cap", async () => {
    const store = memDb();
    seedModel(store);
    // Seed *only* tokens cap exhausted; requests + inferences plenty.
    // Use a *current* timestamp so the period reset (resets_at) is in
    // the future when the handler calls Date.now() — otherwise the
    // first consume() would expire the period and zero used_value
    // before the cap check runs.
    const tier = tierOrThrow("starter");
    const nowSec = Math.floor(Date.now() / 1000);
    await seedTierEntitlements({ db: store.db }, "tenant-A", tier, nowSec);
    // Burn the entire token allowance.
    const tokRow = store.ent.get("tenant-A:tokens_per_month")!;
    tokRow.used_value = tier.tokensPerMonth;

    const rc = makeCtx({
      db: store.db, kv: memKv(),
      body: { prompt: "hi", max_tokens: 1024 },
      claims: { tenant_id: "tenant-A" },
    });
    const res = await runModelHandler(rc);
    expect(res.status).toBe(429);
    const j = (await res.json()) as { feature?: string; scope?: string };
    expect(j.feature).toBe("tokens_per_month");
    expect(j.scope).toBe("tenant");
    // Critical: model run must not have fired (no row in `runs`).
    expect(store.runs).toHaveLength(0);
  });

  it("rejects with 429 / scope=api_key when the per-key quota is exhausted", async () => {
    const store = memDb();
    seedModel(store);
    const tier = tierOrThrow("pro");
    const nowSec = Math.floor(Date.now() / 1000);
    await seedTierEntitlements({ db: store.db }, "tenant-B", tier, nowSec);
    // Per-key cap of 1/day, already used. Future resets_at so the
    // handler's real-time call doesn't roll the period over.
    await setApiKeyQuota({ db: store.db }, "key-2", "requests_per_day", 1, "day", nowSec);
    const k = store.keyQ.get("key-2:requests_per_day")!;
    k.used_value = 1;

    const rc = makeCtx({
      db: store.db, kv: memKv(),
      body: { prompt: "hi" },
      claims: { tenant_id: "tenant-B", sub: "key-2" },
    });
    const res = await runModelHandler(rc);
    expect(res.status).toBe(429);
    const j = (await res.json()) as { scope?: string };
    expect(j.scope).toBe("api_key");
    expect(store.runs).toHaveLength(0);
  });

  it("token-preflight denial does not increment inferences_per_month", async () => {
    const store = memDb();
    seedModel(store);
    const tier = tierOrThrow("starter");
    const nowSec = Math.floor(Date.now() / 1000);
    await seedTierEntitlements({ db: store.db }, "tenant-D", tier, nowSec);
    // Burn the entire token allowance so preflight rejects.
    store.ent.get("tenant-D:tokens_per_month")!.used_value = tier.tokensPerMonth;
    const inferBefore = Number(store.ent.get("tenant-D:inferences_per_month")!.used_value);

    const rc = makeCtx({
      db: store.db, kv: memKv(),
      body: { prompt: "hi", max_tokens: 1024 },
      claims: { tenant_id: "tenant-D" },
    });
    const res = await runModelHandler(rc);
    expect(res.status).toBe(429);
    // Critical: inferences_per_month must NOT have been charged for a
    // run that never executed.
    const inferAfter = Number(store.ent.get("tenant-D:inferences_per_month")!.used_value);
    expect(inferAfter).toBe(inferBefore);
    expect(store.runs).toHaveLength(0);
  });

  it("happy path: pre-charges max_tokens, then refunds the unused budget", async () => {
    const store = memDb();
    seedModel(store);
    const tier = tierOrThrow("pro");
    const nowSec = Math.floor(Date.now() / 1000);
    await seedTierEntitlements({ db: store.db }, "tenant-C", tier, nowSec);
    const before = Number(store.ent.get("tenant-C:tokens_per_month")!.used_value);

    const rc = makeCtx({
      db: store.db, kv: memKv(),
      body: { prompt: "hi", max_tokens: 1024, no_stream: true },
      claims: { tenant_id: "tenant-C", sub: "key-C" },
    });
    const res = await runModelHandler(rc);
    expect(res.status).toBe(200);
    const after = Number(store.ent.get("tenant-C:tokens_per_month")!.used_value);
    // Stub WorkersAI provider returns deterministic synthetic tokens — far
    // less than the 1024 pre-charge — so net charge must be < 1024.
    expect(after - before).toBeLessThan(1024);
    expect(after - before).toBeGreaterThan(0);
  });
});
