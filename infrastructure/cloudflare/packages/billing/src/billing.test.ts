import { describe, expect, it } from "vitest";
import { tierOrThrow, TIERS } from "./tiers.js";
import { RealStripe, resolveStripe, signStripePayload, StubStripe, verifyStripeSignature } from "./stripe.js";
import {
  consume,
  consumeApiKey,
  getEntitlement,
  listApiKeyQuotas,
  listEntitlements,
  seedTierEntitlements,
  setApiKeyQuota,
} from "./entitlements.js";
import { buildDunningEmail, resolveMailer, StubMailer } from "./mailer.js";

function memDb() {
  const rows: Array<Record<string, unknown>> = [];
  const keyRows: Array<Record<string, unknown>> = [];
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
        if (/SELECT \* FROM api_key_quotas WHERE api_key_id = \? AND feature = \?/.test(sql)) {
          const found = keyRows.find(
            (r) => r.api_key_id === bindings[0] && r.feature === bindings[1],
          );
          return (found ? { ...found } : null) as T | null;
        }
        return null;
      },
      async all<T>() {
        if (/^SELECT \* FROM api_key_quotas WHERE api_key_id = \?/.test(sql)) {
          const matches = keyRows.filter((r) => r.api_key_id === bindings[0]).map((r) => ({ ...r }));
          return { results: matches as T[], success: true } as never;
        }
        const matches = rows.filter((r) => r.tenant_id === bindings[0]).map((r) => ({ ...r }));
        return { results: matches as T[], success: true } as never;
      },
      async run() {
        if (/^INSERT INTO api_key_quotas/.test(sql)) {
          // ON CONFLICT(api_key_id, feature) DO UPDATE — bind shape is
          // [api_key_id, feature, limit_value, period, resets_at, updated_at].
          const ix = keyRows.findIndex(
            (r) => r.api_key_id === bindings[0] && r.feature === bindings[1],
          );
          if (ix >= 0) {
            const existing = keyRows[ix]!;
            keyRows[ix] = {
              ...existing,
              limit_value: bindings[2],
              period: bindings[3],
              resets_at: bindings[4],
              updated_at: bindings[5],
            };
          } else {
            keyRows.push({
              api_key_id: bindings[0],
              feature: bindings[1],
              limit_value: bindings[2],
              used_value: 0,
              period: bindings[3],
              resets_at: bindings[4],
              updated_at: bindings[5],
            });
          }
          return { meta: { changes: 1 }, success: true } as never;
        }
        if (/^UPDATE api_key_quotas/.test(sql)) {
          // Bind order mirrors entitlements UPDATE:
          //   [now, n, n, now, nextReset, now, apiKeyId, feature, now, n, n].
          const now = Number(bindings[0]);
          const n = Number(bindings[1]);
          const nextReset = bindings[4] as number | null;
          const apiKeyId = bindings[6];
          const feature = bindings[7];
          const r = keyRows.find((row) => row.api_key_id === apiKeyId && row.feature === feature);
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

describe("@gefi/billing RealStripe wire format", () => {
  // Capture the outgoing form-encoded body so we can assert Stripe-side
  // field names. We never let the live `fetch` escape the test — every
  // call is intercepted and given a synthetic Stripe response.
  function captureFetch() {
    const calls: Array<{ url: string; body: string }> = [];
    const fetchImpl = (async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      calls.push({ url, body: String(init?.body ?? "") });
      const synth =
        url.endsWith("/checkout/sessions")
          ? { id: "cs_live_1", url: "https://stripe.test/cs", customer: "cus_live_1" }
          : { id: "synth", url: "https://stripe.test/x" };
      return new Response(JSON.stringify(synth), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as unknown as typeof fetch;
    return { calls, fetchImpl };
  }

  it("encodes automatic_tax with the nested-bracket form Stripe expects", async () => {
    const { calls, fetchImpl } = captureFetch();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchImpl;
    try {
      const stripe = new RealStripe({
        STRIPE_SECRET_KEY: "sk_test_dummy",
        STRIPE_TAX_ENABLED: "true",
      });
      await stripe.createCheckoutSession({
        customerEmail: "x@y.com",
        tenantId: "tenant-A",
        priceId: "price_real",
        successUrl: "https://gefi.io/ok",
        cancelUrl: "https://gefi.io/no",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
    expect(calls).toHaveLength(1);
    // The bug was sending `automatic_tax_enabled=true` (silently
    // ignored by Stripe). Assert the bracket form is used and the
    // legacy underscore form is NOT present.
    const params = new URLSearchParams(calls[0]!.body);
    expect(params.get("automatic_tax[enabled]")).toBe("true");
    expect(params.get("automatic_tax_enabled")).toBeNull();
    expect(params.get("line_items[0][price]")).toBe("price_real");
    expect(params.get("metadata[tenant_id]")).toBe("tenant-A");
  });

  it("does not enable Stripe Tax when STRIPE_TAX_ENABLED is unset", async () => {
    const { calls, fetchImpl } = captureFetch();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchImpl;
    try {
      const stripe = new RealStripe({ STRIPE_SECRET_KEY: "sk_test_dummy" });
      await stripe.createCheckoutSession({
        customerEmail: "x@y.com",
        tenantId: "tenant-B",
        priceId: "price_real",
        successUrl: "https://gefi.io/ok",
        cancelUrl: "https://gefi.io/no",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
    const params = new URLSearchParams(calls[0]!.body);
    expect(params.get("automatic_tax[enabled]")).toBe("false");
  });
});

describe("@gefi/billing RealStripe Connect destination charges", () => {
  // Reuses the same fetch-capture scaffold as the Connect-less wire
  // format tests above. Asserts the Stripe form-encoded params for
  // `subscription_data[transfer_data][destination]` and the matching
  // `application_fee_percent` are sent ONLY when connectAccountId is
  // supplied — never when checkout is for a platform-direct charge.
  function captureFetch() {
    const calls: Array<{ url: string; body: string }> = [];
    const fetchImpl = (async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      calls.push({ url, body: String(init?.body ?? "") });
      return new Response(
        JSON.stringify({ id: "cs_live_1", url: "https://stripe.test/cs", customer: "cus_live_1" }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as unknown as typeof fetch;
    return { calls, fetchImpl };
  }

  it("forwards transfer_data[destination] and application_fee_percent on subscription_data", async () => {
    const { calls, fetchImpl } = captureFetch();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchImpl;
    try {
      const stripe = new RealStripe({ STRIPE_SECRET_KEY: "sk_test_dummy" });
      await stripe.createCheckoutSession({
        customerEmail: "buyer@example.com",
        tenantId: "tenant-buyer-1",
        priceId: "price_real_for_model",
        successUrl: "https://gefi.io/ok",
        cancelUrl: "https://gefi.io/no",
        connectAccountId: "acct_live_dev",
        applicationFeePercent: 30,
        metadata: { subscription_id: "sub_local_1", model_id: "mdl-1" },
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
    expect(calls).toHaveLength(1);
    const params = new URLSearchParams(calls[0]!.body);
    // The destination + fee MUST attach to subscription_data so they
    // apply to every recurring invoice — not just the first one.
    expect(params.get("subscription_data[transfer_data][destination]")).toBe("acct_live_dev");
    expect(params.get("subscription_data[application_fee_percent]")).toBe("30");
    // And the Session-level transfer_data form must NOT be present —
    // that variant is for *one-time* payments and Stripe rejects it
    // when paired with subscription_data.
    expect(params.get("transfer_data[destination]")).toBeNull();
    expect(params.get("application_fee_percent")).toBeNull();
  });

  it("does not forward Connect fields when connectAccountId is omitted", async () => {
    const { calls, fetchImpl } = captureFetch();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchImpl;
    try {
      const stripe = new RealStripe({ STRIPE_SECRET_KEY: "sk_test_dummy" });
      await stripe.createCheckoutSession({
        customerEmail: "buyer@example.com",
        tenantId: "tenant-buyer-1",
        priceId: "price_platform_direct",
        successUrl: "https://gefi.io/ok",
        cancelUrl: "https://gefi.io/no",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
    const params = new URLSearchParams(calls[0]!.body);
    expect(params.get("subscription_data[transfer_data][destination]")).toBeNull();
    expect(params.get("subscription_data[application_fee_percent]")).toBeNull();
  });

  it("forwards Idempotency-Key when provided so retries collapse on Stripe", async () => {
    const calls: Array<{ url: string; headers: Record<string, string>; body: string }> = [];
    const fetchImpl = (async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      const headers: Record<string, string> = {};
      const h = init?.headers;
      if (h && typeof h === "object") {
        for (const [k, v] of Object.entries(h as Record<string, string>)) headers[k] = v;
      }
      calls.push({ url, headers, body: String(init?.body ?? "") });
      return new Response(
        JSON.stringify({ id: "cs_idem_1", url: "https://stripe.test/cs", customer: "cus_1" }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as unknown as typeof fetch;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchImpl;
    try {
      const stripe = new RealStripe({ STRIPE_SECRET_KEY: "sk_test_dummy" });
      await stripe.createCheckoutSession({
        customerEmail: "buyer@example.com",
        tenantId: "tenant-buyer-1",
        priceId: "price_real",
        successUrl: "https://gefi.io/ok",
        cancelUrl: "https://gefi.io/no",
        idempotencyKey: "sub:sub_local_1",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
    expect(calls).toHaveLength(1);
    expect(calls[0]!.headers["Idempotency-Key"]).toBe("sub:sub_local_1");
  });

  it("does not send Idempotency-Key when none is provided", async () => {
    const calls: Array<{ headers: Record<string, string> }> = [];
    const fetchImpl = (async (input: RequestInfo, init?: RequestInit) => {
      const headers: Record<string, string> = {};
      const h = init?.headers;
      if (h && typeof h === "object") {
        for (const [k, v] of Object.entries(h as Record<string, string>)) headers[k] = v;
      }
      calls.push({ headers });
      return new Response(
        JSON.stringify({ id: "cs_no_idem", url: "https://stripe.test/cs", customer: "cus_1" }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as unknown as typeof fetch;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchImpl;
    try {
      const stripe = new RealStripe({ STRIPE_SECRET_KEY: "sk_test_dummy" });
      await stripe.createCheckoutSession({
        customerEmail: "x@example.com",
        tenantId: "t",
        priceId: "price_x",
        successUrl: "https://gefi.io/ok",
        cancelUrl: "https://gefi.io/no",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
    expect(calls[0]!.headers["Idempotency-Key"]).toBeUndefined();
  });

  it("clamps applicationFeePercent above 100 to 100 at the wire boundary", async () => {
    // A direct caller (test, fuzzer, or future code path) might send a
    // computed value above 100. Stripe rejects that with HTTP 400; we
    // clamp at the sink so the request remains valid regardless of
    // upstream callers.
    const { calls, fetchImpl } = captureFetch();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchImpl;
    try {
      const stripe = new RealStripe({ STRIPE_SECRET_KEY: "sk_test_dummy" });
      await stripe.createCheckoutSession({
        customerEmail: "buyer@example.com",
        tenantId: "tenant-buyer-1",
        priceId: "price_real",
        successUrl: "https://gefi.io/ok",
        cancelUrl: "https://gefi.io/no",
        connectAccountId: "acct_dev",
        applicationFeePercent: 250,
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
    const params = new URLSearchParams(calls[0]!.body);
    expect(params.get("subscription_data[application_fee_percent]")).toBe("100");
  });

  it("clamps applicationFeePercent: invalid values are dropped", async () => {
    const { calls, fetchImpl } = captureFetch();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchImpl;
    try {
      const stripe = new RealStripe({ STRIPE_SECRET_KEY: "sk_test_dummy" });
      await stripe.createCheckoutSession({
        customerEmail: "buyer@example.com",
        tenantId: "tenant-buyer-1",
        priceId: "price_real",
        successUrl: "https://gefi.io/ok",
        cancelUrl: "https://gefi.io/no",
        connectAccountId: "acct_dev",
        // NaN must NOT be sent — Stripe rejects with 400 invalid_request.
        applicationFeePercent: Number.NaN,
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
    const params = new URLSearchParams(calls[0]!.body);
    expect(params.get("subscription_data[transfer_data][destination]")).toBe("acct_dev");
    expect(params.get("subscription_data[application_fee_percent]")).toBeNull();
  });
});

describe("@gefi/billing applicationFeePercentFromBps", () => {
  it("computes the platform fee from a developer-share basis-points value", async () => {
    const { applicationFeePercentFromBps } = await import("./connect.js");
    // 70% to the developer ⇒ 30% to the platform.
    expect(applicationFeePercentFromBps(7000)).toBe(30);
    // 90% developer ⇒ 10% platform.
    expect(applicationFeePercentFromBps(9000)).toBe(10);
    // 100% developer ⇒ 0% platform.
    expect(applicationFeePercentFromBps(10000)).toBe(0);
    // Out-of-range / corrupt DB values are clamped to [0, 100].
    expect(applicationFeePercentFromBps(-100)).toBe(100);
    expect(applicationFeePercentFromBps(20000)).toBe(0);
    expect(applicationFeePercentFromBps(Number.NaN)).toBe(30); // NaN ⇒ default 7000 bps
  });
});

describe("@gefi/billing developer_payouts CRUD", () => {
  // Minimal scripted D1 just for these tests — independent of the
  // worker integration scaffold so a billing-package change can be
  // validated in isolation.
  function payoutsD1(initialRow: Record<string, unknown> | null = null) {
    let row: Record<string, unknown> | null = initialRow;
    const calls: Array<{ sql: string; bindings: unknown[]; verb: "first" | "run" }> = [];
    const prepare = (sql: string) => {
      let bindings: unknown[] = [];
      const stmt = {
        bind(...args: unknown[]) { bindings = args; return stmt; },
        async first<T>() {
          calls.push({ sql, bindings, verb: "first" });
          if (/FROM developer_payouts WHERE tenant_id/.test(sql)) {
            return (row && row.tenant_id === bindings[0] ? { ...row } : null) as T;
          }
          if (/FROM developer_payouts WHERE stripe_account_id/.test(sql)) {
            return (row && row.stripe_account_id === bindings[0] ? { ...row } : null) as T;
          }
          return null as T;
        },
        async run() {
          calls.push({ sql, bindings, verb: "run" });
          if (/^INSERT INTO developer_payouts/.test(sql)) {
            row = {
              tenant_id: bindings[0],
              stripe_account_id: bindings[1],
              charges_enabled: bindings[2],
              payouts_enabled: bindings[3],
              details_submitted: bindings[4],
              default_currency: bindings[5],
              created_at: bindings[6],
              updated_at: bindings[7],
            };
          } else if (/^UPDATE developer_payouts/.test(sql)) {
            if (row && row.stripe_account_id === bindings[5]) {
              row.charges_enabled = bindings[0];
              row.payouts_enabled = bindings[1];
              row.details_submitted = bindings[2];
              row.default_currency = bindings[3];
              row.updated_at = bindings[4];
            }
          }
          return { meta: { changes: 1 }, success: true } as never;
        },
      };
      return stmt as unknown as D1PreparedStatement;
    };
    return {
      db: { prepare } as unknown as D1Database,
      get row() { return row; },
      calls,
    };
  }

  it("upsertDeveloperPayout writes a fresh row with all-zero flags", async () => {
    const { upsertDeveloperPayout, getDeveloperPayout } = await import("./connect.js");
    const d = payoutsD1();
    await upsertDeveloperPayout({ db: d.db }, {
      tenantId: "t1",
      stripeAccountId: "acct_1",
      ts: 1700000000,
    });
    const r = await getDeveloperPayout({ db: d.db }, "t1");
    expect(r).not.toBeNull();
    expect(r!.stripeAccountId).toBe("acct_1");
    expect(r!.chargesEnabled).toBe(false);
    expect(r!.payoutsEnabled).toBe(false);
    expect(r!.detailsSubmitted).toBe(false);
  });

  it("applyAccountUpdate flips flags ONLY when the account id matches an existing row", async () => {
    const { applyAccountUpdate } = await import("./connect.js");
    const seeded = payoutsD1({
      tenant_id: "t1",
      stripe_account_id: "acct_1",
      charges_enabled: 0,
      payouts_enabled: 0,
      details_submitted: 0,
      default_currency: null,
      created_at: 1,
      updated_at: 1,
    });
    const updated = await applyAccountUpdate({ db: seeded.db }, {
      accountId: "acct_1",
      chargesEnabled: true,
      payoutsEnabled: true,
      detailsSubmitted: true,
      defaultCurrency: "usd",
      ts: 2,
    });
    expect(updated).not.toBeNull();
    expect(updated!.chargesEnabled).toBe(true);
    expect(updated!.payoutsEnabled).toBe(true);
    expect(updated!.detailsSubmitted).toBe(true);
    expect(seeded.row!.charges_enabled).toBe(1);

    // Unknown account id ⇒ null, no UPDATE issued.
    const empty = payoutsD1();
    const result = await applyAccountUpdate({ db: empty.db }, {
      accountId: "acct_unknown",
      chargesEnabled: true,
      payoutsEnabled: true,
      detailsSubmitted: true,
    });
    expect(result).toBeNull();
    expect(empty.calls.some((c) => c.verb === "run")).toBe(false);
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

describe("@gefi/billing per-API-key quotas", () => {
  it("consumeApiKey returns allowed=true when no row exists (inherits tenant cap)", async () => {
    const db = memDb();
    const r = await consumeApiKey({ db }, "key-abc", "requests_per_day", 1);
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("setApiKeyQuota provisions a row and consumeApiKey enforces it atomically", async () => {
    const db = memDb();
    await setApiKeyQuota({ db }, "key-1", "requests_per_day", 3, "day", 1_700_000_000);
    const ok1 = await consumeApiKey({ db }, "key-1", "requests_per_day", 2, 1_700_000_001);
    expect(ok1.allowed).toBe(true);
    expect(ok1.remaining).toBe(1);
    const ok2 = await consumeApiKey({ db }, "key-1", "requests_per_day", 1, 1_700_000_002);
    expect(ok2.allowed).toBe(true);
    expect(ok2.remaining).toBe(0);
    const denied = await consumeApiKey({ db }, "key-1", "requests_per_day", 1, 1_700_000_003);
    expect(denied.allowed).toBe(false);
    expect(denied.reason).toBe("limit_exceeded");
  });

  it("consumeApiKey rolls over the period at the reset boundary", async () => {
    const db = memDb();
    // Seed at t=0, period=day → resets_at = start of next day.
    const t0 = 1_700_000_000;
    await setApiKeyQuota({ db }, "key-roll", "requests_per_day", 2, "day", t0);
    const burn = await consumeApiKey({ db }, "key-roll", "requests_per_day", 2, t0 + 1);
    expect(burn.allowed).toBe(true);
    const denied = await consumeApiKey({ db }, "key-roll", "requests_per_day", 1, t0 + 2);
    expect(denied.allowed).toBe(false);
    // Jump 2 days → counter resets, allowed again.
    const after = await consumeApiKey({ db }, "key-roll", "requests_per_day", 1, t0 + 86400 * 2);
    expect(after.allowed).toBe(true);
  });

  it("setApiKeyQuota updates the cap without resetting the counter", async () => {
    const db = memDb();
    const t0 = 1_700_000_000;
    await setApiKeyQuota({ db }, "key-up", "requests_per_day", 2, "day", t0);
    await consumeApiKey({ db }, "key-up", "requests_per_day", 2, t0 + 1);
    // Raise to 5 — used_value (=2) preserved → 3 remaining.
    await setApiKeyQuota({ db }, "key-up", "requests_per_day", 5, "day", t0 + 2);
    const r = await consumeApiKey({ db }, "key-up", "requests_per_day", 1, t0 + 3);
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(2);
  });

  it("listApiKeyQuotas returns provisioned rows", async () => {
    const db = memDb();
    await setApiKeyQuota({ db }, "key-l", "requests_per_day", 100, "day", 1_700_000_000);
    await setApiKeyQuota({ db }, "key-l", "tokens_per_month", 10_000, "month", 1_700_000_000);
    const all = await listApiKeyQuotas({ db }, "key-l");
    expect(all.map((q) => q.feature).sort()).toEqual(["requests_per_day", "tokens_per_month"]);
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
