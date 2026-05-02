/**
 * End-to-end integration tests for the gefi-api Worker.
 *
 * These exercise the full handler stack — auth middleware, cross-region
 * rejection, KYC webhook → sanctions screening → tenant suspension —
 * by signing real RS256 tokens and pre-seeding the JWKS in an in-memory
 * KV. The D1 binding is faked with a scripted prepared-statement mock
 * that lets each test return canned rows for specific SELECTs and
 * record the INSERT / UPDATE statements that fall out the other end.
 *
 * Unit-level tests for `verifyAuth0Token` / `canPerform` /
 * `subscriptionToKycTier` live in their respective package test files;
 * this file is for the wiring between them.
 */

import { beforeAll, describe, expect, it } from "vitest";
import worker from "./index.js";
import { signInternalJwt } from "@gefi/shared-router";
import { jwksCacheKey } from "@gefi/auth/jwks";
import { GEFI_CLAIM_NS } from "@gefi/auth/types";
import type { ApiEnv } from "@gefi/shared-types";

const EDGE_SECRET = "test-internal-signing-key-32-chars-minimum-please-1234";
const AUTH0_DOMAIN = "https://gefi-test.auth0.com/";
const AUDIENCE = "https://api.gefi.io";
const KID = "integration-test-kid";

const ctx = {
  waitUntil: () => undefined,
  passThroughOnException: () => undefined,
  props: {},
} as unknown as ExecutionContext;

let signingKey: CryptoKey;
let publicJwk: { kty: string; use: string; alg: string; kid: string; n: string; e: string };

beforeAll(async () => {
  const pair = (await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;
  signingKey = pair.privateKey;
  const raw = (await crypto.subtle.exportKey("jwk", pair.publicKey)) as unknown as { n: string; e: string };
  publicJwk = { kty: "RSA", use: "sig", alg: "RS256", kid: KID, n: raw.n, e: raw.e };
});

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i] ?? 0);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function b64urlString(s: string): string {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signUserToken(claims: Record<string, unknown>): Promise<string> {
  const header = b64urlString(JSON.stringify({ alg: "RS256", typ: "JWT", kid: KID }));
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: AUTH0_DOMAIN,
    aud: AUDIENCE,
    sub: claims["sub"] ?? "auth0|integration-user",
    iat: now,
    exp: now + 600,
    ...claims,
  };
  const body = b64urlString(JSON.stringify(payload));
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    signingKey,
    new TextEncoder().encode(`${header}.${body}`),
  );
  return `${header}.${body}.${b64url(sig)}`;
}

function memKv(initial: Record<string, string> = {}): KVNamespace {
  const store = new Map<string, string>(Object.entries(initial));
  // The full KVNamespace surface is large and most of it is unused in
  // these tests; cast through `unknown` to skip the verbose overload
  // table while still exposing a real `get` / `put`.
  return {
    get: async (k: string, type?: string) => {
      const v = store.get(k);
      if (v == null) return null;
      return type === "json" ? JSON.parse(v) : v;
    },
    put: async (k: string, v: string) => {
      store.set(k, v);
    },
    delete: async (k: string) => {
      store.delete(k);
    },
    list: async () => ({ keys: [], list_complete: true, cacheStatus: null }),
    getWithMetadata: async () => ({ value: null, metadata: null, cacheStatus: null }),
  } as unknown as KVNamespace;
}

/** Scripted D1: routes prepared SQL by regex to canned rows; otherwise records and returns success. */
interface D1Script {
  selects?: Array<{ match: RegExp; row: unknown | ((bindings: unknown[]) => unknown) }>;
}
interface ScriptedD1 {
  db: D1Database;
  calls: Array<{ sql: string; bindings: unknown[]; verb: "first" | "all" | "run" }>;
}
function scriptedD1(script: D1Script = {}): ScriptedD1 {
  const calls: ScriptedD1["calls"] = [];
  const prepare = (sql: string) => {
    let bindings: unknown[] = [];
    const stmt = {
      bind: (...args: unknown[]) => {
        bindings = args;
        return stmt;
      },
      first: async <T,>() => {
        calls.push({ sql, bindings, verb: "first" });
        for (const m of script.selects ?? []) {
          if (m.match.test(sql)) {
            const row = typeof m.row === "function" ? (m.row as (b: unknown[]) => unknown)(bindings) : m.row;
            return row as T;
          }
        }
        return null as unknown as T;
      },
      all: async <T,>() => {
        calls.push({ sql, bindings, verb: "all" });
        return { results: [] as T[], meta: {}, success: true } as never;
      },
      run: async () => {
        calls.push({ sql, bindings, verb: "run" });
        return { meta: { changes: 1 }, success: true } as never;
      },
    };
    return stmt as unknown as D1PreparedStatement;
  };
  const db = {
    prepare,
    batch: async (stmts: D1PreparedStatement[]) => {
      const results = [];
      for (const s of stmts) results.push(await (s as unknown as { run: () => Promise<unknown> }).run());
      return results as never;
    },
    exec: async () => ({ count: 0, duration: 0 }) as never,
  } as unknown as D1Database;
  return { db, calls };
}

function regionalEnv(opts: {
  region: "eu" | "us";
  db?: D1Database;
  cache?: KVNamespace;
  environment?: "dev" | "staging" | "prod";
}): ApiEnv {
  return {
    // Default to "dev" so the integration tests exercise the stub
    // KYC + sanctions providers. The dedicated "fail-closed in prod"
    // tests below override this to "prod" and assert 503s.
    ENVIRONMENT: opts.environment ?? "dev",
    WORKER_REGION: opts.region,
    API_PUBLIC_URL: `https://${opts.region}.api.gefi.io`,
    SITE_PUBLIC_URL: "https://gefi.io",
    AUTH0_DOMAIN,
    AUTH0_AUDIENCE: AUDIENCE,
    INTERNAL_SIGNING_KEY: EDGE_SECRET,
    DB: opts.db ?? scriptedD1().db,
    ARTIFACTS: { head: async () => null } as unknown as R2Bucket,
    CACHE: opts.cache ?? memKv({ [jwksCacheKey(AUTH0_DOMAIN)]: JSON.stringify({ keys: [publicJwk] }) }),
    VECTORS: { describe: async () => ({}) } as unknown as VectorizeIndex,
    COMPLIANCE: { fetch: async () => new Response("ok", { status: 200 }) } as unknown as Fetcher,
  };
}

describe("Cross-region rejection", () => {
  it("rejects an EU-jurisdiction user token reaching the US regional sibling", async () => {
    const env = regionalEnv({ region: "us" });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const userToken = await signUserToken({
      [`${GEFI_CLAIM_NS}jurisdiction`]: "eu",
      [`${GEFI_CLAIM_NS}tenant_id`]: "tenant-eu-1",
      [`${GEFI_CLAIM_NS}entity_type`]: "professional",
      [`${GEFI_CLAIM_NS}roles`]: ["admin"],
    });
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/auth/me", {
        headers: { "X-Gefi-Edge-JWT": edge, Authorization: `Bearer ${userToken}` },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(403);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("cross_region_denied");
  });

  it("accepts a same-region user token", async () => {
    const env = regionalEnv({
      region: "us",
      db: scriptedD1({
        selects: [
          {
            match: /FROM tenants WHERE id/,
            row: { id: "tenant-us-1", slug: "acme", display_name: "Acme", status: "active", subscription_tier: "pro", kyc_tier: "standard" },
          },
        ],
      }).db,
    });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const userToken = await signUserToken({
      [`${GEFI_CLAIM_NS}jurisdiction`]: "us",
      [`${GEFI_CLAIM_NS}tenant_id`]: "tenant-us-1",
      [`${GEFI_CLAIM_NS}entity_type`]: "professional",
      [`${GEFI_CLAIM_NS}roles`]: ["admin"],
      [`${GEFI_CLAIM_NS}subscription_tier`]: "pro",
      [`${GEFI_CLAIM_NS}kyc_tier`]: "standard",
    });
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/auth/me", {
        headers: { "X-Gefi-Edge-JWT": edge, Authorization: `Bearer ${userToken}` },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { user: { tenant_id: string }; tenant: { display_name: string } };
    expect(body.user.tenant_id).toBe("tenant-us-1");
    expect(body.tenant.display_name).toBe("Acme");
  });
});

describe("Onboarding (loose auth)", () => {
  it("creates tenant + user + membership rows on first onboard", async () => {
    const fake = scriptedD1({ selects: [] });
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const userToken = await signUserToken({
      sub: "auth0|user-fresh-001",
      email: "founder@acme.example",
      email_verified: true,
    });
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/auth/onboard", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, Authorization: `Bearer ${userToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          jurisdiction: "us",
          entity_type: "professional",
          display_name: "Acme Capital",
          subscription_tier: "pro",
        }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as {
      ok: boolean;
      tenant: { id: string; slug: string };
      next: { kyc_required: boolean; mfa_required: boolean };
      requires_token_refresh: boolean;
      app_metadata_written: boolean;
    };
    expect(body.ok).toBe(true);
    expect(body.tenant.slug.startsWith("acme-capital-")).toBe(true);
    expect(body.next.kyc_required).toBe(true);
    expect(body.next.mfa_required).toBe(true);
    // The current token was issued before the tenant existed, so the
    // client must refresh before calling /v1/kyc/start.
    expect(body.requires_token_refresh).toBe(true);
    // Without M2M secrets configured in this dev test env, the
    // app_metadata write path is skipped (the post-login Action
    // still hydrates claims on next login).
    expect(body.app_metadata_written).toBe(false);

    // Three batched inserts: tenants, users, memberships.
    const inserts = fake.calls.filter((c) => /^INSERT INTO/.test(c.sql));
    const tables = inserts.map((c) => c.sql.split(/\s+/)[2]).sort();
    expect(tables).toEqual(["memberships", "tenants", "users"]);
    // memberships INSERT now persists jurisdiction (denormalised
    // from tenants for jurisdiction-scoped queries).
    const membershipsInsert = inserts.find((c) => c.sql.includes("memberships"));
    expect(membershipsInsert?.bindings).toContain("us");
  });

  it("public edge forwards /v1/auth/onboard to the region from ?region= even when cf.country disagrees", async () => {
    // Why: a freshly-signed-up user has NO `jurisdiction` claim yet
    // (their tenant doesn't exist), so the edge cannot route from
    // the JWT. If we relied on `cf.country` we'd land an EU-selecting
    // user on the US data plane simply because their IP geolocates
    // to the US — a data-residency breach. The `?region=` query
    // param is the explicit signal the onboarding form sends, and
    // `pickRegion` in `@gefi/shared-router` lets the override beat
    // both the JWT claim and `cf.country`.
    const captured: Array<{ url: string; edgeJwt: string | null }> = [];
    const euBinding: Fetcher = {
      fetch: async (req: Request) => {
        captured.push({ url: req.url, edgeJwt: req.headers.get("X-Gefi-Edge-JWT") });
        return new Response(JSON.stringify({ ok: true, forwarded: "eu" }), {
          status: 201,
          headers: { "content-type": "application/json" },
        });
      },
    } as unknown as Fetcher;
    const usBinding: Fetcher = {
      fetch: async () => {
        throw new Error("US binding must NOT be called when ?region=eu wins over cf.country");
      },
    } as unknown as Fetcher;

    // Edge worker: API_PUBLIC_URL is the un-prefixed host so
    // `isRegionalSibling` returns false and forwarding is enabled.
    const edgeEnv: ApiEnv = {
      ENVIRONMENT: "prod",
      WORKER_REGION: "us",
      API_PUBLIC_URL: "https://api.gefi.io",
      SITE_PUBLIC_URL: "https://gefi.io",
      AUTH0_DOMAIN,
      AUTH0_AUDIENCE: AUDIENCE,
      INTERNAL_SIGNING_KEY: EDGE_SECRET,
      DB: scriptedD1().db,
      ARTIFACTS: { head: async () => null } as unknown as R2Bucket,
      CACHE: memKv({ [jwksCacheKey(AUTH0_DOMAIN)]: JSON.stringify({ keys: [publicJwk] }) }),
      VECTORS: { describe: async () => ({}) } as unknown as VectorizeIndex,
      COMPLIANCE: { fetch: async () => new Response("ok", { status: 200 }) } as unknown as Fetcher,
      REGIONAL_EU: euBinding,
      REGIONAL_US: usBinding,
    } as ApiEnv;

    // No GeFi claims yet — this is a fresh signup.
    const userToken = await signUserToken({ sub: "auth0|fresh", email: "eu-user@example.com" });
    // Cf.country is `US` (geolocation says US) but the user picked
    // EU on the form, so the request URL carries `?region=eu`.
    const req = new Request("https://api.gefi.io/v1/auth/onboard?region=eu", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ jurisdiction: "eu", entity_type: "retail", display_name: "Berlin Co" }),
    });
    Object.defineProperty(req, "cf", { value: { country: "US" } });

    const res = await worker.fetch(req, edgeEnv, ctx);
    expect(res.status).toBe(201);
    const body = (await res.json()) as { ok: boolean; forwarded: string };
    expect(body.forwarded).toBe("eu");
    // Forwarded exactly once — to EU, never to US.
    expect(captured).toHaveLength(1);
    expect(captured[0]?.edgeJwt).toBeTruthy();
    // The X-Gefi-Region response header is set by the edge.
    expect(res.headers.get("X-Gefi-Region")).toBe("eu");
  });

  it("rejects an onboard whose jurisdiction != WORKER_REGION on a regional sibling", async () => {
    const env = regionalEnv({ region: "us" });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const userToken = await signUserToken({ sub: "auth0|user-fresh-002", email: "x@y.example" });
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/auth/onboard", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, Authorization: `Bearer ${userToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ jurisdiction: "eu", entity_type: "retail", display_name: "Wrong" }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string; expected: string };
    expect(body.error).toBe("wrong_region_for_onboarding");
    expect(body.expected).toBe("us");
  });
});

describe("KYC webhook → sanctions hit blocks tenant", () => {
  it("inserts sanction_hits + suspends tenant when sanctions provider returns a hit", async () => {
    const fake = scriptedD1({
      selects: [
        {
          match: /FROM kyc_evidence WHERE provider_session_id/,
          row: { id: "evidence-1", tenant_id: "tenant-block-1", jurisdiction: "us", requested_tier: "standard" },
        },
        {
          // The display name "Specially Designated National" is the
          // deterministic hit-pattern in the StubSanctionsProvider's
          // SAMPLE_HIT_NAMES list.
          match: /FROM tenants WHERE id/,
          row: { id: "tenant-block-1", entity_type: "professional", kyc_tier: "none", status: "pending_kyc", display_name: "Specially Designated National" },
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);

    const stubBody = JSON.stringify({
      providerSessionId: "stub_session_xyz",
      outcome: "approved",
      achievedTier: "standard",
      reasonCodes: [],
    });
    // The StubKycProvider's parseWebhook accepts the literal signature "stub-ok".
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/kyc/webhook/stub", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          "Content-Type": "application/json",
          "X-Stub-Signature": "stub-ok",
        },
        body: stubBody,
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { outcome: string };
    expect(body.outcome).toBe("blocked_by_sanctions");

    const sanctionInserts = fake.calls.filter((c) => /^INSERT INTO sanction_hits/.test(c.sql));
    expect(sanctionInserts.length).toBeGreaterThanOrEqual(1);
    const eventInserts = fake.calls.filter((c) => /^INSERT INTO compliance_events/.test(c.sql));
    expect(eventInserts.length).toBe(1);
    const tenantUpdates = fake.calls.filter((c) => /^UPDATE tenants SET status = 'suspended'/.test(c.sql));
    expect(tenantUpdates.length).toBe(1);
  });

  it("approves + bumps kyc_tier when sanctions are clean", async () => {
    const fake = scriptedD1({
      selects: [
        {
          match: /FROM kyc_evidence WHERE provider_session_id/,
          row: { id: "evidence-2", tenant_id: "tenant-clean-1", jurisdiction: "us", requested_tier: "standard" },
        },
        {
          match: /FROM tenants WHERE id/,
          row: { id: "tenant-clean-1", entity_type: "professional", kyc_tier: "basic", status: "pending_kyc", display_name: "Innocent Founder" },
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const stubBody = JSON.stringify({
      providerSessionId: "stub_session_clean",
      outcome: "approved",
      achievedTier: "standard",
      reasonCodes: [],
    });
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/kyc/webhook/stub", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, "Content-Type": "application/json", "X-Stub-Signature": "stub-ok" },
        body: stubBody,
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { outcome: string; kycTier: string };
    expect(body.outcome).toBe("approved");
    expect(body.kycTier).toBe("standard");

    const sanctionInserts = fake.calls.filter((c) => /^INSERT INTO sanction_hits/.test(c.sql));
    expect(sanctionInserts.length).toBe(0);
    const tenantPromotes = fake.calls.filter((c) => /^UPDATE tenants SET kyc_tier/.test(c.sql));
    expect(tenantPromotes.length).toBe(1);
  });
});

describe("Production fail-closed when no real provider is configured", () => {
  it("returns 503 from /v1/kyc/webhook in prod with no Onfido / Sumsub / OpenSanctions secrets", async () => {
    const env = regionalEnv({
      environment: "prod",
      region: "us",
      db: scriptedD1({
        selects: [
          {
            match: /FROM kyc_evidence WHERE provider_session_id/,
            row: { id: "evidence-x", tenant_id: "tenant-x", jurisdiction: "us", requested_tier: "standard" },
          },
          {
            match: /FROM tenants WHERE id/,
            row: { id: "tenant-x", entity_type: "professional", kyc_tier: "none", status: "pending_kyc", display_name: "Test" },
          },
        ],
      }).db,
    });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/kyc/webhook/stub", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, "Content-Type": "application/json", "X-Stub-Signature": "stub-ok" },
        body: JSON.stringify({ providerSessionId: "stub_x", outcome: "approved", achievedTier: "standard", reasonCodes: [] }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(503);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("kyc_provider_not_configured");
  });
});

describe("Marketplace + billing endpoints", () => {
  async function devToken(): Promise<string> {
    return signUserToken({
      sub: "auth0|developer-1",
      email: "dev@gefi.io",
      [`${GEFI_CLAIM_NS}jurisdiction`]: "us",
      [`${GEFI_CLAIM_NS}tenant_id`]: "tenant-dev-1",
      [`${GEFI_CLAIM_NS}entity_type`]: "professional",
      [`${GEFI_CLAIM_NS}roles`]: ["developer"],
      [`${GEFI_CLAIM_NS}subscription_tier`]: "pro",
      [`${GEFI_CLAIM_NS}kyc_tier`]: "standard",
    });
  }
  async function adminToken(): Promise<string> {
    return signUserToken({
      sub: "auth0|admin-1",
      email: "admin@gefi.io",
      [`${GEFI_CLAIM_NS}jurisdiction`]: "us",
      [`${GEFI_CLAIM_NS}tenant_id`]: "tenant-admin-1",
      [`${GEFI_CLAIM_NS}entity_type`]: "professional",
      [`${GEFI_CLAIM_NS}roles`]: ["admin"],
      [`${GEFI_CLAIM_NS}subscription_tier`]: "enterprise",
      [`${GEFI_CLAIM_NS}kyc_tier`]: "advanced",
    });
  }
  async function investorToken(): Promise<string> {
    return signUserToken({
      sub: "auth0|inv-1",
      email: "inv@gefi.io",
      [`${GEFI_CLAIM_NS}jurisdiction`]: "us",
      [`${GEFI_CLAIM_NS}tenant_id`]: "tenant-inv-1",
      [`${GEFI_CLAIM_NS}entity_type`]: "professional",
      [`${GEFI_CLAIM_NS}roles`]: ["investor"],
      [`${GEFI_CLAIM_NS}subscription_tier`]: "starter",
      [`${GEFI_CLAIM_NS}kyc_tier`]: "standard",
    });
  }

  it("POST /v1/models creates a draft model (developer + create:model)", async () => {
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const token = await devToken();
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/models", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: "alpha-edge",
          name: "Alpha Edge",
          summary: "Quant alpha for US equities",
          category: "forecasting",
          risk_class: "medium",
          monthly_price_cents: 19900,
          visibility: "private",
          long_description: "Forecasts US equity returns from filings + price.",
          jurisdictions_supported: ["us", "eu"],
        }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as { ok: boolean; model: { id: string; slug: string; status: string } };
    expect(body.model.slug).toBe("alpha-edge");
    expect(body.model.status).toBe("draft");
    const modelInsert = fake.calls.find((c) => /^INSERT INTO models /.test(c.sql));
    expect(modelInsert).toBeTruthy();
    const metaInsert = fake.calls.find((c) => /^INSERT INTO model_metadata /.test(c.sql));
    expect(metaInsert).toBeTruthy();
  });

  it("POST /v1/models rejects an investor (no create:model)", async () => {
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const token = await investorToken();
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/models", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: "x",
          name: "x",
          category: "forecasting",
          risk_class: "low",
          monthly_price_cents: 0,
        }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(403);
  });

  it("POST /v1/billing/webhook accepts a valid Stripe-Signature and is idempotent", async () => {
    const { signStripePayload } = await import("@gefi/billing");
    const secret = "whsec_integration_test";
    const eventBody = JSON.stringify({
      id: "evt_int_1",
      type: "checkout.session.completed",
      data: { object: { id: "cs_1", customer: "cus_1", metadata: { tenant_id: "tenant-x" } } },
    });
    const ts = Math.floor(Date.now() / 1000);
    const sig = await signStripePayload(eventBody, secret, ts);
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_WEBHOOK_SECRET?: string }).STRIPE_WEBHOOK_SECRET = secret;
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/webhook", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          "Content-Type": "application/json",
          "Stripe-Signature": sig,
        },
        body: eventBody,
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const billingInsert = fake.calls.find((c) => /^INSERT INTO billing_events/.test(c.sql));
    expect(billingInsert).toBeTruthy();
  });

  it("POST /v1/billing/webhook handles checkout.session.completed (status='complete', subscription on .subscription)", async () => {
    // Regression: the previous handler treated checkout.session.completed
    // identically to customer.subscription.* — it wrote `obj.id` into
    // stripe_subscription_id (a `cs_...` id, not `sub_...`) and
    // `obj.status` into subscriptions.status (`'complete'` is NOT in
    // the CHECK constraint, so the UPDATE would fail with a 500).
    const { signStripePayload } = await import("@gefi/billing");
    const secret = "whsec_cs";
    const eventBody = JSON.stringify({
      id: "evt_cs_1",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_session_xyz",                  // ← session id, NOT sub id
          object: "checkout.session",
          status: "complete",                    // ← invalid for our CHECK
          subscription: "sub_real_xyz",          // ← the actual sub id
          customer: "cus_xyz",
          // The handler embeds `subscription_id` in Checkout Session
          // metadata at create time; the webhook reads it back as the
          // correlation key so concurrent checkouts can't cross-talk.
          metadata: { tenant_id: "tenant-cs", subscription_id: "sub_local_xyz" },
        },
      },
    });
    const ts = Math.floor(Date.now() / 1000);
    const sig = await signStripePayload(eventBody, secret, ts);
    const fake = scriptedD1({
      selects: [
        // Correlation-key lookup: handler issues this with bindings=[localSubId].
        {
          match: /FROM subscriptions WHERE id = \? LIMIT 1/,
          row: (bindings: unknown[]) =>
            bindings[0] === "sub_local_xyz"
              ? { id: "sub_local_xyz", kind: "tier", tier: "starter" }
              : null,
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_WEBHOOK_SECRET?: string }).STRIPE_WEBHOOK_SECRET = secret;
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/webhook", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, "Content-Type": "application/json", "Stripe-Signature": sig },
        body: eventBody,
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    // The UPDATE must bind a status from the CHECK-constraint set and
    // the actual subscription id from `obj.subscription`.
    const subUpdate = fake.calls.find((c) =>
      /^UPDATE subscriptions SET status = 'active'/.test(c.sql) ||
      (/^UPDATE subscriptions SET status = \?/.test(c.sql) && c.bindings[0] === "active"),
    );
    expect(subUpdate).toBeTruthy();
    // Find the bound stripe_subscription_id value — must be sub_..., never cs_...
    const allSubUpdates = fake.calls.filter((c) => /^UPDATE subscriptions/.test(c.sql));
    const wroteSessionIdAsSubId = allSubUpdates.some((c) =>
      c.bindings.some((b) => typeof b === "string" && b.startsWith("cs_")),
    );
    expect(wroteSessionIdAsSubId).toBe(false);
    const wroteRealSubId = allSubUpdates.some((c) =>
      c.bindings.some((b) => b === "sub_real_xyz"),
    );
    expect(wroteRealSubId).toBe(true);
    // Correlation-key contract: the UPDATE WHERE clause must bind the
    // local subscription id from metadata, NOT use the legacy
    // "latest by tenant" subselect. We assert the bound id and that
    // no UPDATE issued the old `ORDER BY created_at DESC LIMIT 1`
    // subselect.
    const wroteLocalSubId = allSubUpdates.some((c) =>
      c.bindings.some((b) => b === "sub_local_xyz"),
    );
    expect(wroteLocalSubId).toBe(true);
    const usedLatestByTenantSubselect = allSubUpdates.some((c) =>
      /ORDER BY created_at DESC LIMIT 1/.test(c.sql),
    );
    expect(usedLatestByTenantSubselect).toBe(false);
  });

  it("POST /v1/billing/webhook coerces non-canonical subscription statuses", async () => {
    // Stripe sends `incomplete_expired` and `unpaid` which our CHECK
    // constraint forbids; the handler must coerce to allowed values.
    const { signStripePayload } = await import("@gefi/billing");
    const secret = "whsec_coerce";
    const eventBody = JSON.stringify({
      id: "evt_coerce_1",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_coerce",
          object: "subscription",
          status: "incomplete_expired",
          metadata: { tenant_id: "tenant-coerce", subscription_id: "sub_local_coerce" },
        },
      },
    });
    const ts = Math.floor(Date.now() / 1000);
    const sig = await signStripePayload(eventBody, secret, ts);
    const fake = scriptedD1({
      selects: [
        {
          match: /FROM subscriptions WHERE id = \? LIMIT 1/,
          row: (bindings: unknown[]) =>
            bindings[0] === "sub_local_coerce"
              ? { id: "sub_local_coerce", kind: "tier", tier: "pro" }
              : null,
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_WEBHOOK_SECRET?: string }).STRIPE_WEBHOOK_SECRET = secret;
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/webhook", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, "Content-Type": "application/json", "Stripe-Signature": sig },
        body: eventBody,
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const subUpdate = fake.calls.find((c) => /^UPDATE subscriptions SET status = \?/.test(c.sql));
    expect(subUpdate).toBeTruthy();
    expect(subUpdate!.bindings[0]).toBe("incomplete");
    // `incomplete` is NOT an activation — entitlements MUST NOT be
    // seeded here. This is the inverse of the activation test below.
    const seedCalls = fake.calls.filter((c) => /^INSERT INTO entitlements/.test(c.sql));
    expect(seedCalls).toHaveLength(0);
  });

  it("POST /v1/billing/subscriptions does NOT seed tier entitlements before payment confirmation", async () => {
    // Regression: previously, createSubscriptionHandler called
    // seedTierEntitlements at INSERT time with status='incomplete' —
    // i.e. before any Stripe webhook had confirmed payment. That
    // granted full paid-tier quotas to a tenant who could (a) abandon
    // the checkout, (b) fail the card, or (c) never pay at all. The
    // fix moves seeding into the webhook activation paths
    // (checkout.session.completed and customer.subscription.* with
    // status in {active, trialing}). For paid tiers, the create
    // endpoint must issue an INSERT INTO subscriptions (status
    // 'incomplete') and NOTHING into entitlements.
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kind: "tier", tier: "pro" }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(201);
    const subInsert = fake.calls.find((c) => /^INSERT INTO subscriptions/.test(c.sql));
    expect(subInsert).toBeTruthy();
    // Paid-tier INSERT hardcodes 'incomplete' in the SQL (so a bug
    // in binding order can't ever ship 'active' as the initial status).
    expect(/'incomplete'/.test(subInsert!.sql)).toBe(true);
    expect(/'active'/.test(subInsert!.sql)).toBe(false);
    const entInserts = fake.calls.filter((c) => /^INSERT INTO entitlements/.test(c.sql));
    expect(entInserts).toHaveLength(0);
  });

  it("POST /v1/billing/subscriptions seeds free-tier entitlements at create time (no Stripe payment)", async () => {
    // The free tier doesn't go through Stripe at all — there's no
    // webhook to wait for. The handler must seed entitlements at
    // create time AND mark the row 'active' so quota lookups work
    // immediately. (The 3 INSERTs are requests_per_day,
    // tokens_per_month, inferences_per_month.)
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kind: "tier", tier: "free" }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as { ok: boolean; checkout_url: string | null };
    // No Stripe checkout for free tier — the response carries no URL.
    expect(body.checkout_url).toBeNull();
    // The free-tier INSERT hardcodes status='active' in SQL (not as a
    // bound parameter) so we assert against the SQL text.
    const subInsert = fake.calls.find((c) => /^INSERT INTO subscriptions/.test(c.sql));
    expect(subInsert).toBeTruthy();
    expect(/'active'/.test(subInsert!.sql)).toBe(true);
    expect(/'free'/.test(subInsert!.sql)).toBe(true);
    const entInserts = fake.calls.filter((c) => /^INSERT INTO entitlements/.test(c.sql));
    expect(entInserts.length).toBeGreaterThanOrEqual(3);
  });

  it("POST /v1/billing/subscriptions kind=tier tier=free does NOT call Stripe even when STRIPE_SECRET_KEY is set", async () => {
    // Regression: previously the handler called createCheckoutSession
    // for ALL tiers including free. Once a real STRIPE_SECRET_KEY is
    // configured, that route through RealStripe.createCheckoutSession
    // would issue a network POST to api.stripe.com/v1/checkout/sessions
    // with a synthetic `price_tier_free` price id — Stripe would reject
    // it as an unknown price and free-tier onboarding would fail in
    // production. The free-tier path must short-circuit BEFORE
    // touching Stripe at all.
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_SECRET_KEY?: string }).STRIPE_SECRET_KEY = "sk_test_dummy";
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const originalFetch = globalThis.fetch;
    const fetchCalls: string[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      fetchCalls.push(url);
      return originalFetch(input as Parameters<typeof originalFetch>[0], init);
    }) as typeof fetch;
    try {
      const res = await worker.fetch(
        new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
          method: "POST",
          headers: {
            "X-Gefi-Edge-JWT": edge,
            Authorization: `Bearer ${await devToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kind: "tier", tier: "free" }),
        }),
        env,
        ctx,
      );
      expect(res.status).toBe(201);
      const body = (await res.json()) as { ok: boolean; checkout_url: string | null };
      expect(body.ok).toBe(true);
      expect(body.checkout_url).toBeNull();
      // Critical: no outbound HTTP to Stripe.
      const stripeCalls = fetchCalls.filter((u) => /api\.stripe\.com/.test(u));
      expect(stripeCalls).toHaveLength(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("POST /v1/billing/subscriptions kind=model 503s in live mode without an explicit price_id", async () => {
    // Symmetric to the tier guard: synthetic `price_model_<id>` is
    // not a real Stripe price, so live Stripe would reject it. The
    // handler must refuse with `model_price_not_configured` BEFORE
    // creating a checkout session — otherwise we'd ship a confusing
    // 400 back to the caller from upstream Stripe.
    const fake = scriptedD1({
      selects: [{ match: /FROM models WHERE id/, row: { id: "mdl-x", monthly_price_cents: 4900 } }],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_SECRET_KEY?: string }).STRIPE_SECRET_KEY = "sk_test_dummy";
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const originalFetch = globalThis.fetch;
    const fetchCalls: string[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      fetchCalls.push(url);
      return originalFetch(input as Parameters<typeof originalFetch>[0], init);
    }) as typeof fetch;
    try {
      const res = await worker.fetch(
        new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
          method: "POST",
          headers: {
            "X-Gefi-Edge-JWT": edge,
            Authorization: `Bearer ${await devToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kind: "model", model_id: "mdl-x" }),
        }),
        env,
        ctx,
      );
      expect(res.status).toBe(503);
      const body = (await res.json()) as { ok: boolean; error: string; model_id: string };
      expect(body.ok).toBe(false);
      expect(body.error).toBe("model_price_not_configured");
      expect(body.model_id).toBe("mdl-x");
      // No outbound HTTP to Stripe — we refused before checkout.
      const stripeCalls = fetchCalls.filter((u) => /api\.stripe\.com/.test(u));
      expect(stripeCalls).toHaveLength(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("POST /v1/billing/subscriptions kind=model accepts an explicit price_id in live mode", async () => {
    // The escape hatch: callers (typically the model author's
    // onboarding flow) can pass a real Stripe price id that they
    // configured on their Connect account. The handler must accept
    // it and forward it verbatim to checkout — no synthetic id is
    // substituted.
    const fake = scriptedD1({
      selects: [{ match: /FROM models WHERE id/, row: { id: "mdl-y", monthly_price_cents: 9900 } }],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    // Note: STRIPE_SECRET_KEY left unset so the StubStripe path is
    // exercised — we only care that the handler accepted the price
    // and recorded it on the subscription row.
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "model",
          model_id: "mdl-y",
          price_id: "price_1Qabc_real_stripe_id",
        }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as { ok: boolean; checkout_url: string | null };
    expect(body.ok).toBe(true);
    expect(body.checkout_url).toBeTruthy();
  });

  it("POST /v1/billing/webhook seeds tier entitlements ONLY when status flips to active", async () => {
    // The activation half of the deferred-seed contract: when Stripe
    // confirms payment via customer.subscription.updated with
    // status=active, the webhook must look up the local row's tier
    // and provision the tier-shaped entitlements. The handler reads
    // `tier` from the local row (NOT from Stripe metadata) so a
    // forged metadata.tier can't escalate quotas.
    const { signStripePayload } = await import("@gefi/billing");
    const secret = "whsec_activate";
    const eventBody = JSON.stringify({
      id: "evt_activate_1",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_stripe_activate",
          object: "subscription",
          status: "active",
          current_period_end: 1_900_000_000,
          metadata: { tenant_id: "tenant-activate", subscription_id: "sub_local_activate" },
        },
      },
    });
    const ts = Math.floor(Date.now() / 1000);
    const sig = await signStripePayload(eventBody, secret, ts);
    const fake = scriptedD1({
      selects: [
        {
          match: /FROM subscriptions WHERE id = \? LIMIT 1/,
          row: (bindings: unknown[]) =>
            bindings[0] === "sub_local_activate"
              ? { id: "sub_local_activate", kind: "tier", tier: "pro" }
              : null,
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_WEBHOOK_SECRET?: string }).STRIPE_WEBHOOK_SECRET = secret;
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/webhook", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, "Content-Type": "application/json", "Stripe-Signature": sig },
        body: eventBody,
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    // 1) UPDATE was scoped to the exact local id (correlation key),
    //    not the legacy latest-by-tenant subselect.
    const subUpdate = fake.calls.find((c) => /^UPDATE subscriptions SET status = \?/.test(c.sql));
    expect(subUpdate).toBeTruthy();
    expect(subUpdate!.bindings[0]).toBe("active");
    expect(subUpdate!.bindings.includes("sub_local_activate")).toBe(true);
    expect(/ORDER BY created_at DESC LIMIT 1/.test(subUpdate!.sql)).toBe(false);
    // 2) Entitlements were seeded — 3 INSERT INTO entitlements rows
    //    (requests_per_day, tokens_per_month, inferences_per_month).
    const entInserts = fake.calls.filter((c) => /^INSERT INTO entitlements/.test(c.sql));
    expect(entInserts.length).toBeGreaterThanOrEqual(3);
    const features = entInserts.map((c) => c.bindings[1]);
    expect(features).toContain("requests_per_day");
    expect(features).toContain("tokens_per_month");
    expect(features).toContain("inferences_per_month");
  });

  it("POST /v1/models/:id/run returns 402 when caller has no active subscription to a paid model", async () => {
    // Per-model entitlement gate: tenant quotas (requests/tokens/
    // inferences) are tenant-wide and DO NOT prove the caller has
    // paid for THIS model. Without this check, any tenant on any
    // tier could run any paid public model just by passing generic
    // quota checks. Free models (monthlyPriceCents == 0) bypass;
    // owners bypass; everyone else needs an active or trialing
    // subscription row of kind='model' for this model.
    const m = marketplaceD1({
      model: {
        id: "mdl-paid",
        slug: "mdl-paid",
        developer_tenant_id: "tenant-other-1",   // ← caller is "tenant-inv-1"
        name: "Paid Model",
        slug_canonical: "mdl-paid",
        summary: "x",
        category: "research",
        risk_class: "low",
        jurisdiction: "us",
        status: "approved",
        visibility: "public",
        current_version_id: "ver-paid",
        monthly_price_cents: 9900,                // ← non-zero ⇒ gate engages
        developer_share_bps: 7000,
        federation_enabled: 0,
        created_at: 0,
        updated_at: 0,
      },
      version: { id: "ver-paid", model_id: "mdl-paid", version: "1.0.0", artifact_r2_key: "x", artifact_sha256: "y", manifest_json: "{}", chain_tx_hash: null, created_at: 0 },
      metadata: { long_description: "", inputs_json: "[]", outputs_json: "[]", metrics_json: "{}", risk_json: "{}", jurisdictions_supported_json: "[]" },
      entitlements: [
        // Caller has wide-open tenant quotas — proves the 402 is the
        // model gate, not a quota denial.
        { tenant_id: "tenant-inv-1", feature: "requests_per_day",     limit_value: 1000, used_value: 0, period: "day",   resets_at: null },
        { tenant_id: "tenant-inv-1", feature: "tokens_per_month",     limit_value: 0,    used_value: 0, period: "month", resets_at: null },
        { tenant_id: "tenant-inv-1", feature: "inferences_per_month", limit_value: 1000, used_value: 0, period: "month", resets_at: null },
      ],
    });
    const env = regionalEnv({ region: "us", db: m.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/models/mdl-paid/run", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, Authorization: `Bearer ${await investorToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "hello", max_tokens: 32, no_stream: true }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(402);
    const body = (await res.json()) as { ok: boolean; error: string; model_id: string; monthly_price_cents: number };
    expect(body.ok).toBe(false);
    expect(body.error).toBe("model_subscription_required");
    expect(body.model_id).toBe("mdl-paid");
    expect(body.monthly_price_cents).toBe(9900);
  });

  it("POST /v1/billing/webhook is idempotent across duplicate deliveries", async () => {
    const { signStripePayload } = await import("@gefi/billing");
    const secret = "whsec_dup";
    const eventBody = JSON.stringify({
      id: "evt_dup_1",
      type: "checkout.session.completed",
      data: { object: { id: "cs_dup", customer: "cus_dup", metadata: { tenant_id: "tenant-dup" } } },
    });
    const ts = Math.floor(Date.now() / 1000);
    const sig = await signStripePayload(eventBody, secret, ts);
    // The handler does:
    //   1) SELECT id FROM billing_events WHERE id = ?  (idempotency check)
    //   2) INSERT INTO billing_events ...              (only if first miss)
    //   3) UPDATE subscriptions ...                    (apply state change)
    // We script the SELECT to look back at fake.calls — once an
    // INSERT INTO billing_events with the same id has been recorded,
    // the SELECT returns a hit so the second delivery short-circuits.
    let fake!: ScriptedD1;
    fake = scriptedD1({
      selects: [
        {
          match: /FROM billing_events WHERE id/,
          row: (bindings: unknown[]) => {
            const id = bindings[0];
            const inserted = fake.calls.some(
              (c) => /^INSERT INTO billing_events/.test(c.sql) && c.bindings[0] === id,
            );
            return inserted ? { id } : null;
          },
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_WEBHOOK_SECRET?: string }).STRIPE_WEBHOOK_SECRET = secret;
    const edge = await signInternalJwt("us", EDGE_SECRET);

    // First delivery — handler runs the full path, persists the event.
    const r1 = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/webhook", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, "Content-Type": "application/json", "Stripe-Signature": sig },
        body: eventBody,
      }),
      env,
      ctx,
    );
    expect(r1.status).toBe(200);
    const inserts1 = fake.calls.filter((c) => /^INSERT INTO billing_events/.test(c.sql));
    expect(inserts1).toHaveLength(1);

    // Second delivery — same payload, same signature: handler must
    // short-circuit on the idempotency check, not insert again, not
    // re-apply any subscription update.
    const r2 = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/webhook", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, "Content-Type": "application/json", "Stripe-Signature": sig },
        body: eventBody,
      }),
      env,
      ctx,
    );
    expect(r2.status).toBe(200);
    const body2 = (await r2.json()) as { ok: boolean; idempotent?: boolean };
    expect(body2.idempotent).toBe(true);
    const inserts2 = fake.calls.filter((c) => /^INSERT INTO billing_events/.test(c.sql));
    expect(inserts2).toHaveLength(1); // still 1 — no duplicate insert
  });

  it("POST /v1/billing/webhook rejects an invalid signature", async () => {
    const env = regionalEnv({ region: "us" });
    (env as { STRIPE_WEBHOOK_SECRET?: string }).STRIPE_WEBHOOK_SECRET = "whsec_real";
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/webhook", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          "Content-Type": "application/json",
          "Stripe-Signature": "t=1,v1=abadc0de",
        },
        body: JSON.stringify({ id: "evt_2", type: "checkout.session.completed" }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("invalid_signature");
  });

  it("POST /v1/models/:id/approve requires admin role", async () => {
    const fake = scriptedD1({
      selects: [
        {
          match: /FROM models WHERE id/,
          row: {
            id: "mdl-x",
            slug: "x",
            developer_tenant_id: "tenant-dev-1",
            jurisdiction: "us",
            name: "X",
            summary: "",
            category: "risk",
            risk_class: "low",
            status: "pending_compliance",
            visibility: "private",
            current_version_id: null,
            monthly_price_cents: 0,
            developer_share_bps: 7000,
            federation_enabled: 0,
            created_at: 1,
            updated_at: 1,
          },
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);

    // Developer cannot approve.
    const devRes = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/models/mdl-x/approve", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ version_id: "ver-x" }),
      }),
      env,
      ctx,
    );
    expect([403, 404]).toContain(devRes.status);

    // Admin approves.
    const adminRes = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/models/mdl-x/approve", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await adminToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ version_id: "ver-x" }),
      }),
      env,
      ctx,
    );
    expect(adminRes.status).toBe(200);
  });

  it("GET /v1/entitlements returns the seeded rows for the caller's tenant", async () => {
    const fake = scriptedD1({
      selects: [
        {
          match: /SELECT \* FROM entitlements WHERE tenant_id/,
          row: null,
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/entitlements", {
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await investorToken()}`,
        },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; entitlements: unknown[] };
    expect(body.ok).toBe(true);
  });

  it("POST /v1/billing/subscriptions maps tier → STRIPE_PRICE_* env var", async () => {
    // Stub-Stripe path (no STRIPE_SECRET_KEY) so we don't make a network
    // call. We assert that the Checkout session row written to D1 carries
    // the env-configured price id, not the legacy synthetic `price_tier_*`
    // fallback. The stub deterministically derives `cs_*` from
    // `${tenantId}:${priceId}`, so a different priceId yields a
    // different session id — that lets us prove the env var is what was
    // wired through to Stripe.
    const fakeWithEnv = scriptedD1();
    const envWithEnv = regionalEnv({ region: "us", db: fakeWithEnv.db });
    (envWithEnv as { STRIPE_PRICE_PRO?: string }).STRIPE_PRICE_PRO = "price_real_pro_xyz";
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const resWithEnv = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kind: "tier", tier: "pro" }),
      }),
      envWithEnv,
      ctx,
    );
    expect(resWithEnv.status).toBe(201);
    const bodyWithEnv = (await resWithEnv.json()) as { checkout_url: string };

    // Same call WITHOUT the env var → stub falls back to synthetic id,
    // producing a different checkout URL. This proves the env-mapped
    // path actually flows through to the Stripe client.
    const fakeNoEnv = scriptedD1();
    const envNoEnv = regionalEnv({ region: "us", db: fakeNoEnv.db });
    const resNoEnv = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kind: "tier", tier: "pro" }),
      }),
      envNoEnv,
      ctx,
    );
    expect(resNoEnv.status).toBe(201);
    const bodyNoEnv = (await resNoEnv.json()) as { checkout_url: string };
    expect(bodyWithEnv.checkout_url).not.toBe(bodyNoEnv.checkout_url);
  });

  /**
   * Build a D1 mock that knows enough about the marketplace + billing
   * tables to drive `runModelHandler` end-to-end:
   *   - models / model_versions / model_metadata SELECTs return seeded rows
   *   - entitlements + api_key_quotas are stateful (mirror the production
   *     conditional-UPDATE semantics in `consume()` so cap enforcement
   *     actually fires)
   *   - INSERT INTO model_runs is a no-op (we only assert HTTP behavior)
   */
  function marketplaceD1(opts: {
    model: Record<string, unknown>;
    version: Record<string, unknown>;
    metadata: Record<string, unknown> | null;
    entitlements: Array<{ tenant_id: string; feature: string; limit_value: number; used_value: number; period: string; resets_at: number | null; updated_at?: number }>;
  }): { db: D1Database; entitlements: Array<{ tenant_id: string; feature: string; limit_value: number; used_value: number; period: string; resets_at: number | null; updated_at?: number }> } {
    const ents = opts.entitlements.map((e) => ({ ...e }));
    const prepare = (sql: string) => {
      let bindings: unknown[] = [];
      const stmt = {
        bind(...args: unknown[]) { bindings = args; return stmt; },
        async first<T>() {
          if (/SELECT \* FROM models WHERE id = \? OR slug = \?/.test(sql)) {
            return ((bindings[0] === opts.model.id || bindings[0] === opts.model.slug) ? { ...opts.model } : null) as T;
          }
          if (/SELECT \* FROM model_versions WHERE id = \?/.test(sql)) {
            return (bindings[0] === opts.version.id ? { ...opts.version } : null) as T;
          }
          if (/SELECT \* FROM model_metadata WHERE model_id = \?/.test(sql)) {
            return (opts.metadata ? { ...opts.metadata } : null) as T;
          }
          if (/SELECT \* FROM entitlements WHERE tenant_id = \? AND feature = \?/.test(sql)) {
            const r = ents.find((x) => x.tenant_id === bindings[0] && x.feature === bindings[1]);
            return (r ? { ...r } : null) as T;
          }
          if (/SELECT \* FROM api_key_quotas WHERE api_key_id = \? AND feature = \?/.test(sql)) {
            return null as T;
          }
          if (/FROM tenants WHERE id/.test(sql)) {
            return null as T;
          }
          return null as T;
        },
        async all<T>() {
          if (/FROM model_versions WHERE model_id = \?/.test(sql)) return { results: [{ ...opts.version }] as T[], success: true } as never;
          return { results: [] as T[], success: true } as never;
        },
        async run() {
          if (/^UPDATE entitlements/.test(sql)) {
            // Mirror production conditional UPDATE so cap enforcement
            // is real. Bind shape:
            //   [now, n, n, now, nextReset, now, tenantId, feature, now, n, n]
            const now = Number(bindings[0]);
            const n = Number(bindings[1]);
            const tenantId = bindings[6];
            const feature = bindings[7];
            const r = ents.find((x) => x.tenant_id === tenantId && x.feature === feature);
            if (!r) return { meta: { changes: 0 }, success: true } as never;
            const expired = r.resets_at !== null && now >= r.resets_at;
            const newUsed = expired ? n : r.used_value + n;
            if (r.limit_value !== 0 && newUsed > r.limit_value) {
              return { meta: { changes: 0 }, success: true } as never;
            }
            r.used_value = newUsed;
            r.updated_at = now;
            return { meta: { changes: 1 }, success: true } as never;
          }
          return { meta: { changes: 1 }, success: true } as never;
        },
      };
      return stmt as unknown as D1PreparedStatement;
    };
    const db = {
      prepare,
      batch: async (s: D1PreparedStatement[]) => { const r = []; for (const x of s) r.push(await (x as unknown as { run(): Promise<unknown> }).run()); return r as never; },
      exec: async () => ({ count: 0, duration: 0 }) as never,
    } as unknown as D1Database;
    return { db, entitlements: ents };
  }

  it("POST /v1/models/:id/run hard-fails (429) when actual tokens exceed the cap, even if preflight passed", async () => {
    // Regression: the previous handler returned a successful response
    // with `X-Token-Overage: 1` when the post-run top-up was denied.
    // That meant a caller could bypass `tokens_per_month` entirely by
    // setting a tiny `max_tokens` and relying on the provider emitting
    // more — directly contradicting the entitlement guarantee.
    // Now we fail closed with 429 and surface the run id for audit.
    const m = marketplaceD1({
      model: {
        id: "mdl-cap",
        slug: "mdl-cap",
        developer_tenant_id: "tenant-other-1",
        name: "Cap Test",
        slug_canonical: "mdl-cap",
        summary: "x",
        category: "research",
        risk_class: "low",
        jurisdiction: "us",
        status: "approved",
        visibility: "public",
        current_version_id: "ver-cap",
        monthly_price_cents: 0,
        developer_share_bps: 7000,
        federation_enabled: 0,
        created_at: 0,
        updated_at: 0,
      },
      version: { id: "ver-cap", model_id: "mdl-cap", version: "1.0.0", artifact_r2_key: "x", artifact_sha256: "y", manifest_json: "{}", chain_tx_hash: null, created_at: 0 },
      metadata: { long_description: "", inputs_json: "[]", outputs_json: "[]", metrics_json: "{}", risk_json: "{}", jurisdictions_supported_json: "[]" },
      entitlements: [
        { tenant_id: "tenant-inv-1", feature: "requests_per_day",     limit_value: 1000, used_value: 0, period: "day",   resets_at: null },
        { tenant_id: "tenant-inv-1", feature: "tokens_per_month",     limit_value: 50,   used_value: 0, period: "month", resets_at: null },
        { tenant_id: "tenant-inv-1", feature: "inferences_per_month", limit_value: 1000, used_value: 0, period: "month", resets_at: null },
      ],
    });
    const env = regionalEnv({ region: "us", db: m.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const token = await investorToken();
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/models/mdl-cap/run", {
        method: "POST",
        headers: { "X-Gefi-Edge-JWT": edge, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        // max_tokens=50 burns the entire 50-token budget at preflight.
        // The deterministic provider's tokensIn = ceil(prompt_len/4)
        // and tokensOut = ceil(("[deterministic] " + prompt[:240]).length/4).
        // A 250-char prompt → ~63 in + ~64 out = ~127 actual, blowing
        // the 50-token cap and forcing the top-up to deny.
        body: JSON.stringify({
          prompt: "Q3 filing summary: ".concat("revenue grew steadily across the period and operating margins expanded driven by SaaS mix shift, while free cash flow conversion improved on lower capex and disciplined working capital. Guidance was maintained for the year and "),
          max_tokens: 50,
          no_stream: true,
        }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(429);
    const body = (await res.json()) as { ok: boolean; error: string; feature: string; runId: string; actualTokens: number; preTokens: number };
    expect(body.ok).toBe(false);
    expect(body.error).toBe("quota_exceeded");
    expect(body.feature).toBe("tokens_per_month");
    expect(body.runId).toMatch(/^run_/);
    expect(body.actualTokens).toBeGreaterThan(body.preTokens);
    // The response MUST NOT include the model output. The previous
    // overage-header path leaked the text; the fail-closed path
    // withholds it.
    expect(body).not.toHaveProperty("response");
  });

  it("GET /v1/models/:id returns 404 to non-owners whose jurisdiction is not in jurisdictionsSupported", async () => {
    // Regression: list/search applied `visibleTo` jurisdiction filtering
    // but the direct lookup did not. A US tenant who happened to know
    // the id of an EU-only model could read its full metadata + version
    // list. Owners are still allowed (so a developer can preview their
    // own model from any jurisdiction); non-owners get a flat 404.
    const m = marketplaceD1({
      model: {
        id: "mdl-eu-only",
        slug: "mdl-eu-only",
        developer_tenant_id: "tenant-other-1",   // ← caller is "tenant-inv-1"
        name: "EU Only",
        slug_canonical: "mdl-eu-only",
        summary: "x",
        category: "research",
        risk_class: "low",
        jurisdiction: "eu",
        status: "approved",
        visibility: "public",
        current_version_id: "ver-eu",
        monthly_price_cents: 0,
        developer_share_bps: 7000,
        federation_enabled: 0,
        created_at: 0,
        updated_at: 0,
      },
      version: { id: "ver-eu", model_id: "mdl-eu-only", version: "1.0.0", artifact_r2_key: "x", artifact_sha256: "y", manifest_json: "{}", chain_tx_hash: null, created_at: 0 },
      metadata: { long_description: "", inputs_json: "[]", outputs_json: "[]", metrics_json: "{}", risk_json: "{}", jurisdictions_supported_json: JSON.stringify(["eu"]) },
      entitlements: [],
    });
    const env = regionalEnv({ region: "us", db: m.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const token = await investorToken(); // jurisdiction=us
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/models/mdl-eu-only", {
        headers: { "X-Gefi-Edge-JWT": edge, Authorization: `Bearer ${token}` },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(404);
    const body = (await res.json()) as { ok: boolean; error: string };
    expect(body.ok).toBe(false);
    expect(body.error).toBe("not_found");
  });

  it("POST /v1/billing/subscriptions returns 503 in prod when tier price is not configured", async () => {
    // With a real STRIPE_SECRET_KEY but no STRIPE_PRICE_* set, the
    // handler must refuse rather than ship a synthetic id to live
    // Stripe. Synthetic ids exist only for the StubStripe path.
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_SECRET_KEY?: string }).STRIPE_SECRET_KEY = "sk_test_dummy";
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kind: "tier", tier: "starter" }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(503);
    const body = (await res.json()) as { error: string; tier: string };
    expect(body.error).toBe("tier_price_not_configured");
    expect(body.tier).toBe("starter");
  });
});

describe("Marketplace Connect + reference-model wiring", () => {
  async function devToken(): Promise<string> {
    return signUserToken({
      sub: "auth0|developer-2",
      email: "dev2@gefi.io",
      [`${GEFI_CLAIM_NS}jurisdiction`]: "us",
      [`${GEFI_CLAIM_NS}tenant_id`]: "tenant-dev-2",
      [`${GEFI_CLAIM_NS}entity_type`]: "professional",
      [`${GEFI_CLAIM_NS}roles`]: ["developer"],
      [`${GEFI_CLAIM_NS}subscription_tier`]: "pro",
      [`${GEFI_CLAIM_NS}kyc_tier`]: "standard",
    });
  }
  async function adminToken(): Promise<string> {
    return signUserToken({
      sub: "auth0|admin-2",
      email: "admin2@gefi.io",
      [`${GEFI_CLAIM_NS}jurisdiction`]: "us",
      [`${GEFI_CLAIM_NS}tenant_id`]: "tenant-admin-2",
      [`${GEFI_CLAIM_NS}entity_type`]: "professional",
      [`${GEFI_CLAIM_NS}roles`]: ["admin"],
      [`${GEFI_CLAIM_NS}subscription_tier`]: "enterprise",
      [`${GEFI_CLAIM_NS}kyc_tier`]: "advanced",
    });
  }

  it("POST /v1/billing/subscriptions kind=model in live mode refuses 503 when developer_payouts row is missing", async () => {
    // Live-mode safety: we will not collect money for a model whose
    // developer hasn't been onboarded into Connect — there's no
    // payout destination, so the platform would silently keep 100%
    // until reconciliation. Refuse the checkout with a precise error.
    const fake = scriptedD1({
      selects: [
        {
          match: /FROM models WHERE id/,
          row: {
            id: "mdl-conn",
            developer_tenant_id: "tenant-dev-2",
            monthly_price_cents: 9900,
            developer_share_bps: 7000,
          },
        },
        // No developer_payouts row — getDeveloperPayout returns null.
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_SECRET_KEY?: string }).STRIPE_SECRET_KEY = "sk_test_dummy";
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "model",
          model_id: "mdl-conn",
          price_id: "price_real_dev_supplied",
        }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(503);
    const body = (await res.json()) as { ok: boolean; error: string };
    expect(body.error).toBe("developer_payouts_not_configured");
  });

  it("POST /v1/billing/subscriptions kind=model in live mode refuses 503 when charges_enabled=0", async () => {
    // The developer started onboarding but Stripe has not yet flipped
    // `charges_enabled` (KYC pending). We MUST refuse — collecting
    // money before charges are enabled is a regulator-visible failure.
    const fake = scriptedD1({
      selects: [
        {
          match: /FROM models WHERE id/,
          row: {
            id: "mdl-conn-2",
            developer_tenant_id: "tenant-dev-2",
            monthly_price_cents: 9900,
            developer_share_bps: 7000,
          },
        },
        {
          match: /FROM developer_payouts WHERE tenant_id/,
          row: {
            tenant_id: "tenant-dev-2",
            stripe_account_id: "acct_pending",
            charges_enabled: 0,
            payouts_enabled: 0,
            details_submitted: 1,
            default_currency: "usd",
            created_at: 0,
            updated_at: 0,
          },
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_SECRET_KEY?: string }).STRIPE_SECRET_KEY = "sk_test_dummy";
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/subscriptions", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "model",
          model_id: "mdl-conn-2",
          price_id: "price_real_dev_supplied",
        }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(503);
    const body = (await res.json()) as { ok: boolean; error: string };
    expect(body.error).toBe("developer_payouts_not_ready");
  });

  it("POST /v1/billing/connect/onboarding upserts a developer_payouts row", async () => {
    // The onboarding handler must persist the Connect account id so
    // the kind=model path can find it on the next subscription
    // request. Without this, the gate above would refuse forever.
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/connect/onboarding", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; accountId: string; url: string };
    expect(body.ok).toBe(true);
    expect(body.accountId).toMatch(/^acct_/);
    const insert = fake.calls.find((c) => /^INSERT INTO developer_payouts/.test(c.sql));
    expect(insert).toBeTruthy();
    // Initial flags MUST be all-zero — Stripe only flips them via
    // account.updated webhook after KYC + payout-method verify.
    expect(insert!.bindings[2]).toBe(0);
    expect(insert!.bindings[3]).toBe(0);
    expect(insert!.bindings[4]).toBe(0);
  });

  it("POST /v1/billing/webhook account.updated updates the developer_payouts row", async () => {
    const { signStripePayload } = await import("@gefi/billing");
    const secret = "whsec_account_updated";
    const eventBody = JSON.stringify({
      id: "evt_acct_1",
      type: "account.updated",
      data: {
        object: {
          id: "acct_real_xyz",
          object: "account",
          charges_enabled: true,
          payouts_enabled: true,
          details_submitted: true,
          default_currency: "usd",
        },
      },
    });
    const ts = Math.floor(Date.now() / 1000);
    const sig = await signStripePayload(eventBody, secret, ts);
    const fake = scriptedD1({
      selects: [
        {
          match: /FROM developer_payouts WHERE stripe_account_id/,
          row: (bindings: unknown[]) =>
            bindings[0] === "acct_real_xyz"
              ? {
                  tenant_id: "tenant-dev-2",
                  stripe_account_id: "acct_real_xyz",
                  charges_enabled: 0,
                  payouts_enabled: 0,
                  details_submitted: 0,
                  default_currency: null,
                  created_at: 0,
                  updated_at: 0,
                }
              : null,
        },
      ],
    });
    const env = regionalEnv({ region: "us", db: fake.db });
    (env as { STRIPE_WEBHOOK_SECRET?: string }).STRIPE_WEBHOOK_SECRET = secret;
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/billing/webhook", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          "Content-Type": "application/json",
          "Stripe-Signature": sig,
        },
        body: eventBody,
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const update = fake.calls.find((c) => /^UPDATE developer_payouts/.test(c.sql));
    expect(update).toBeTruthy();
    // Bind shape: [chargesEnabled, payoutsEnabled, detailsSubmitted,
    //              defaultCurrency, ts, accountId]
    expect(update!.bindings[0]).toBe(1);
    expect(update!.bindings[1]).toBe(1);
    expect(update!.bindings[2]).toBe(1);
    expect(update!.bindings[3]).toBe("usd");
    expect(update!.bindings[5]).toBe("acct_real_xyz");
  });

  it("GET /v1/models/:id returns reviews + subscriber_count + compliance_proof", async () => {
    // Detail-page enrichment regression. The list endpoint returns
    // ModelCards; the detail endpoint must additionally surface the
    // trust signals investors evaluate before subscribing.
    // Inline scripted DB so we control both .first() and .all() — the
    // shared scriptedD1 helper has empty .all() returns by default.
    const calls: Array<{ sql: string; bindings: unknown[] }> = [];
    const modelRow = {
      id: "mdl-detail",
      slug: "alpha-detail",
      developer_tenant_id: "tenant-dev-2",
      jurisdiction: "us",
      name: "Alpha Detail",
      summary: "x",
      long_description: "x",
      category: "forecasting",
      risk_class: "medium",
      status: "approved",
      visibility: "public",
      current_version_id: "ver-detail",
      monthly_price_cents: 9900,
      developer_share_bps: 7000,
      federation_enabled: 0,
      created_at: 0,
      updated_at: 0,
    };
    const versionRow = {
      id: "ver-detail",
      model_id: "mdl-detail",
      version: "1.0.0",
      artifact_r2_key: "k",
      artifact_sha256: "sha-detail-abcdef",
      artifact_size: 100,
      manifest_json: "{}",
      chain_tx_hash: "0xdeadbeef",
      approved_at: 1700000000,
      created_at: 0,
    };
    const metaRow = {
      long_description: "details",
      inputs_json: "[]",
      outputs_json: "[]",
      metrics_json: "{}",
      risk_json: "{}",
      jurisdictions_supported_json: '["us","eu"]',
    };
    const reviewRows = [
      { id: "rev1", tenant_id: "tenant-inv-A", rating: 5, body: "great", created_at: 100 },
      { id: "rev2", tenant_id: "tenant-inv-B", rating: 3, body: "ok",    created_at: 90 },
    ];
    const prepare = (sql: string) => {
      let bindings: unknown[] = [];
      const stmt = {
        bind(...args: unknown[]) { bindings = args; return stmt; },
        async first<T>() {
          calls.push({ sql, bindings });
          if (/SELECT \* FROM models WHERE id = \? OR slug = \?/.test(sql)) {
            return ((bindings[0] === modelRow.id || bindings[0] === modelRow.slug) ? { ...modelRow } : null) as T;
          }
          if (/SELECT \* FROM model_versions WHERE id = \?/.test(sql)) {
            return (bindings[0] === versionRow.id ? { ...versionRow } : null) as T;
          }
          if (/FROM model_metadata WHERE model_id/.test(sql)) {
            return { ...metaRow } as T;
          }
          if (/COUNT\(\*\)\s+AS\s+n\s+FROM\s+subscriptions/.test(sql)) {
            return { n: 42 } as T;
          }
          if (/AVG\(rating\)/.test(sql)) {
            return { avg: 4, n: 2 } as T;
          }
          return null as T;
        },
        async all<T>() {
          calls.push({ sql, bindings });
          if (/FROM\s+model_versions\s+WHERE\s+model_id/.test(sql)) {
            return { results: [{ ...versionRow }] as T[], success: true } as never;
          }
          if (/FROM\s+model_reviews\s+WHERE\s+model_id/.test(sql)) {
            return { results: reviewRows.map((r) => ({ ...r })) as T[], success: true } as never;
          }
          return { results: [] as T[], success: true } as never;
        },
        async run() { return { meta: { changes: 1 }, success: true } as never; },
      };
      return stmt as unknown as D1PreparedStatement;
    };
    const wrapped = {
      prepare,
      batch: async (s: D1PreparedStatement[]) => {
        const r = []; for (const x of s) r.push(await (x as unknown as { run(): Promise<unknown> }).run()); return r as never;
      },
      exec: async () => ({ count: 0, duration: 0 }) as never,
    } as unknown as D1Database;
    const env = regionalEnv({ region: "us", db: wrapped });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/models/mdl-detail", {
        method: "GET",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
        },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      model: { id: string };
      reviews: Array<{ rating: number }>;
      avg_rating: number | null;
      subscriber_count: number;
      compliance_proof: { artifactSha256: string; chainTxHash: string | null; approvedAt: number | null };
    };
    expect(body.ok).toBe(true);
    expect(body.reviews).toHaveLength(2);
    expect(body.avg_rating).toBe(4);
    expect(body.subscriber_count).toBe(42);
    expect(body.compliance_proof.artifactSha256).toBe("sha-detail-abcdef");
    expect(body.compliance_proof.chainTxHash).toBe("0xdeadbeef");
    expect(body.compliance_proof.approvedAt).toBe(1700000000);
  });

  it("POST /v1/admin/reference-models/seed requires admin role", async () => {
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/admin/reference-models/seed", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await devToken()}`,
          "Content-Type": "application/json",
        },
        body: "{}",
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(403);
    const body = (await res.json()) as { ok: boolean; error: string };
    expect(body.error).toBe("admin_required");
  });

  it("POST /v1/admin/reference-models/seed seeds both flagship slugs as an admin", async () => {
    // Default scriptedD1 returns null for all SELECTs, so the seeder
    // sees both slugs as missing and creates them. We assert two
    // INSERT INTO models statements and two INSERT INTO model_versions
    // statements + two UPDATE models for the approve step.
    const fake = scriptedD1();
    const env = regionalEnv({ region: "us", db: fake.db });
    // Provide a stub R2 ARTIFACTS bucket with `put` since publishVersion
    // writes the manifest bytes to R2. The default regionalEnv mock
    // only stubs `head`.
    (env as { ARTIFACTS?: R2Bucket }).ARTIFACTS = {
      head: async () => null,
      put: async () => ({ key: "stub", size: 0, etag: "stub" }),
      get: async () => null,
    } as unknown as R2Bucket;
    const edge = await signInternalJwt("us", EDGE_SECRET);
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/admin/reference-models/seed", {
        method: "POST",
        headers: {
          "X-Gefi-Edge-JWT": edge,
          Authorization: `Bearer ${await adminToken()}`,
          "Content-Type": "application/json",
        },
        body: "{}",
      }),
      env,
      ctx,
    );
    if (res.status !== 200) {
      // Pull error info into the assertion message for fast debugging.
      const errBody = await res.text();
      throw new Error(`seed failed: status=${res.status} body=${errBody}`);
    }
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      seeded: string[];
      skipped: string[];
      models: Array<{ slug: string; status: string }>;
    };
    expect(body.ok).toBe(true);
    expect(body.seeded).toContain("sentiment-from-filings");
    expect(body.seeded).toContain("portfolio-optimiser");
    expect(body.skipped).toEqual([]);
    expect(body.models).toHaveLength(2);
    const modelInserts = fake.calls.filter((c) => /^INSERT INTO models /.test(c.sql));
    expect(modelInserts).toHaveLength(2);
  });
});

describe("/v1/auth/me requires fully-onboarded claims", () => {
  it("returns 403 when the token is signature-valid but missing GeFi custom claims", async () => {
    const env = regionalEnv({ region: "us" });
    const edge = await signInternalJwt("us", EDGE_SECRET);
    // Signed token, no GeFi custom claims (i.e. user hasn't onboarded).
    const userToken = await signUserToken({ sub: "auth0|halfway", email: "halfway@example.com" });
    const res = await worker.fetch(
      new Request("https://us.api.gefi.io/v1/auth/me", {
        headers: { "X-Gefi-Edge-JWT": edge, Authorization: `Bearer ${userToken}` },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(403);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("auth_onboarding_incomplete");
  });
});
