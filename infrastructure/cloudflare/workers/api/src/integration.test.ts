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
  selects?: Array<{ match: RegExp; row: unknown }>;
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
        for (const m of script.selects ?? []) if (m.match.test(sql)) return m.row as T;
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
    const body = (await res.json()) as { ok: boolean; tenant: { id: string; slug: string }; next: { kyc_required: boolean; mfa_required: boolean } };
    expect(body.ok).toBe(true);
    expect(body.tenant.slug.startsWith("acme-capital-")).toBe(true);
    expect(body.next.kyc_required).toBe(true);
    expect(body.next.mfa_required).toBe(true);

    // Three batched inserts: tenants, users, memberships.
    const inserts = fake.calls.filter((c) => /^INSERT INTO/.test(c.sql));
    const tables = inserts.map((c) => c.sql.split(/\s+/)[2]).sort();
    expect(tables).toEqual(["memberships", "tenants", "users"]);
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
