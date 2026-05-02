import { describe, expect, it } from "vitest";
import { tierOrThrow, TIERS } from "./tiers.js";
import { resolveStripe, signStripePayload, StubStripe, verifyStripeSignature } from "./stripe.js";
import { consume, getEntitlement, listEntitlements, seedTierEntitlements } from "./entitlements.js";
import { buildDunningEmail, resolveMailer, StubMailer } from "./mailer.js";

function memDb() {
  const rows: Array<Record<string, unknown>> = [];
  function prepare(sql: string) {
    let bindings: unknown[] = [];
    return {
      bind(...args: unknown[]) {
        bindings = args;
        return this;
      },
      async first<T>(): Promise<T | null> {
        if (/SELECT \* FROM entitlements WHERE tenant_id = \? AND feature = \?/.test(sql)) {
          // Return a *snapshot* (shallow clone) so callers can't observe
          // subsequent in-place mutations of the in-memory row. Real D1
          // returns a fresh row object on every read.
          const found = rows.find((r) => r.tenant_id === bindings[0] && r.feature === bindings[1]);
          return (found ? { ...found } : null) as T | null;
        }
        return null;
      },
      async all<T>() {
        const matches = rows.filter((r) => r.tenant_id === bindings[0]).map((r) => ({ ...r }));
        return { results: matches as T[], success: true } as never;
      },
      async run() {
        if (/^INSERT INTO entitlements/.test(sql)) {
          const ix = rows.findIndex((r) => r.tenant_id === bindings[0] && r.feature === bindings[1]);
          const row = {
            tenant_id: bindings[0],
            feature: bindings[1],
            limit_value: bindings[2],
            used_value: 0,
            period: bindings[3],
            resets_at: bindings[4],
            updated_at: bindings[5],
          };
          if (ix >= 0) {
            const existing = rows[ix]!;
            rows[ix] = {
              ...existing,
              limit_value: bindings[2],
              period: bindings[3],
              resets_at: bindings[4],
              updated_at: bindings[5],
            };
          } else {
            rows.push(row);
          }
          return { meta: { changes: 1 }, success: true } as never;
        }
        if (/^UPDATE entitlements/.test(sql)) {
          // Mirror the conditional UPDATE the production consume() emits:
          // bind order = [now, n, n, now, nextReset, now, tenantId, feature, now, n, n].
          const now = Number(bindings[0]);
          const n = Number(bindings[1]);
          const nextReset = bindings[4] as number | null;
          const tenantId = bindings[6];
          const feature = bindings[7];
          const r = rows.find((row) => row.tenant_id === tenantId && row.feature === feature);
          if (!r) return { meta: { changes: 0 }, success: true } as never;
          const resetsAt = r.resets_at as number | null;
          const expired = resetsAt !== null && now >= resetsAt;
          const newUsed = expired ? n : Number(r.used_value) + n;
          const newResets = expired ? nextReset : resetsAt;
          const limit = Number(r.limit_value);
          if (limit !== 0 && newUsed > limit) {
            return { meta: { changes: 0 }, success: true } as never;
          }
          r.used_value = newUsed;
          r.resets_at = newResets;
          r.updated_at = now;
          return { meta: { changes: 1 }, success: true } as never;
        }
        return { meta: { changes: 0 }, success: true } as never;
      },
    };
  }
  return { prepare, batch: async () => [], exec: async () => ({ count: 0, duration: 0 }) } as unknown as D1Database;
}

describe("@gefi/billing tiers", () => {
  it("has all four tiers with monotonically increasing prices", () => {
    expect(TIERS.free.monthlyCents).toBe(0);
    expect(TIERS.starter.monthlyCents).toBe(9900);
    expect(TIERS.pro.monthlyCents).toBe(49900);
    expect(TIERS.enterprise.monthlyCents).toBe(249900);
  });
  it("throws on unknown tier", () => {
    expect(() => tierOrThrow("bogus")).toThrowError(/unknown_tier/);
  });
});

describe("@gefi/billing stripe stub", () => {
  it("falls back to StubStripe without STRIPE_SECRET_KEY", () => {
    const s = resolveStripe({});
    expect(s).toBeInstanceOf(StubStripe);
    expect(s.live).toBe(false);
  });
  it("creates a synthetic checkout session deterministically", async () => {
    const s = new StubStripe();
    const a = await s.createCheckoutSession({
      customerEmail: "x@y.com",
      tenantId: "t1",
      priceId: "price_pro",
      successUrl: "https://gefi.io/ok",
      cancelUrl: "https://gefi.io/no",
    });
    const b = await s.createCheckoutSession({
      customerEmail: "x@y.com",
      tenantId: "t1",
      priceId: "price_pro",
      successUrl: "https://gefi.io/ok",
      cancelUrl: "https://gefi.io/no",
    });
    expect(a.id).toBe(b.id);
    expect(a.customerId.startsWith("cus_")).toBe(true);
  });
});

describe("@gefi/billing webhook signature", () => {
  const secret = "whsec_test_value";
  const payload = JSON.stringify({ id: "evt_1", type: "checkout.session.completed" });

  it("verifies a valid signature within the tolerance", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const header = await signStripePayload(payload, secret, ts);
    const ok = await verifyStripeSignature({ payload, header, secret, nowSec: ts });
    expect(ok).toBe(true);
  });

  it("rejects an old timestamp beyond the tolerance", async () => {
    const ts = Math.floor(Date.now() / 1000) - 10000;
    const header = await signStripePayload(payload, secret, ts);
    const ok = await verifyStripeSignature({
      payload,
      header,
      secret,
      nowSec: Math.floor(Date.now() / 1000),
    });
    expect(ok).toBe(false);
  });

  it("rejects a tampered payload", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const header = await signStripePayload(payload, secret, ts);
    const ok = await verifyStripeSignature({
      payload: payload + "x",
      header,
      secret,
      nowSec: ts,
    });
    expect(ok).toBe(false);
  });

  it("rejects a malformed header", async () => {
    const ok = await verifyStripeSignature({ payload, header: "garbage", secret });
    expect(ok).toBe(false);
  });

  it("rejects when the secret differs", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const header = await signStripePayload(payload, secret, ts);
    const ok = await verifyStripeSignature({ payload, header, secret: "different", nowSec: ts });
    expect(ok).toBe(false);
  });
});

describe("@gefi/billing entitlements", () => {
  it("seeds tier entitlements and consumes within limit", async () => {
    const db = memDb();
    const tier = tierOrThrow("starter");
    await seedTierEntitlements({ db }, "tenant-1", tier, 1_700_000_000);
    const ent = await getEntitlement({ db }, "tenant-1", "requests_per_day");
    expect(ent?.limitValue).toBe(tier.requestsPerDay);
    const r1 = await consume({ db }, "tenant-1", "requests_per_day", 5);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(tier.requestsPerDay - 5);
  });
  it("denies when the limit is exceeded", async () => {
    const db = memDb();
    await seedTierEntitlements({ db }, "tenant-2", tierOrThrow("free"), 1_700_000_000);
    const free = tierOrThrow("free");
    const big = await consume({ db }, "tenant-2", "requests_per_day", free.requestsPerDay + 1);
    expect(big.allowed).toBe(false);
    expect(big.reason).toBe("limit_exceeded");
  });
  it("treats limit=0 as unlimited", async () => {
    const db = memDb();
    await seedTierEntitlements({ db }, "tenant-3", tierOrThrow("enterprise"), 1_700_000_000);
    const r = await consume({ db }, "tenant-3", "requests_per_day", 1_000_000);
    expect(r.allowed).toBe(true);
  });
  it("returns no_entitlement when the row is missing", async () => {
    const db = memDb();
    const r = await consume({ db }, "tenant-x", "missing_feature", 1);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("no_entitlement");
  });
  it("listEntitlements returns the seeded rows", async () => {
    const db = memDb();
    await seedTierEntitlements({ db }, "tenant-z", tierOrThrow("pro"), 1_700_000_000);
    const all = await listEntitlements({ db }, "tenant-z");
    expect(all.map((e) => e.feature).sort()).toEqual([
      "inferences_per_month",
      "requests_per_day",
      "tokens_per_month",
    ]);
  });
});

describe("@gefi/billing mailer", () => {
  it("falls back to StubMailer without RESEND_API_KEY", () => {
    expect(resolveMailer({})).toBeInstanceOf(StubMailer);
  });
  it("buildDunningEmail formats the amount correctly", () => {
    const e = buildDunningEmail({ tenantName: "Acme", amountCents: 12345, retryUrl: "https://x" });
    expect(e.text).toContain("$123.45");
    expect(e.subject).toMatch(/Payment failed/);
  });
});
