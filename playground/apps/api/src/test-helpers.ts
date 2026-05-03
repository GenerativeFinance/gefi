/**
 * Lightweight in-memory stubs for Worker bindings, used by Vitest tests.
 *
 * Not a full miniflare emulator — just enough surface area for the routes
 * and probes we exercise in unit tests. Anything we don't implement throws
 * loudly so missing test coverage is obvious.
 */
import type { Env } from "./types.js";
import { generateKeypair } from "./lib/jwt.js";
import {
  type ListModelsQuery,
  type ModelRow,
  type ModelsRepository,
  sortValueOf,
  sortDirection,
} from "./lib/models-repo.js";

export class StubKV implements Pick<KVNamespace, "get" | "put" | "delete"> {
  store = new Map<string, string>();

  get = (async (key: string, type?: "text" | "json"): Promise<unknown> => {
    const v = this.store.get(key);
    if (v === undefined) return null;
    return type === "json" ? JSON.parse(v) : v;
  }) as KVNamespace["get"];

  put: KVNamespace["put"] = async (key, value) => {
    this.store.set(key, String(value));
  };

  delete: KVNamespace["delete"] = async (key) => {
    this.store.delete(key);
  };
}

export class StubR2 {
  store = new Map<string, ArrayBuffer>();
  head = async () => null;
  get = async () => null;
  put = async (k: string, v: ArrayBuffer) => {
    this.store.set(k, v);
  };
  delete = async () => {};
}

export class StubVectorize {
  describe = async () => ({
    dimensions: 768,
    vectorsCount: 0,
    processedUpToMutation: "",
    processedUpToDatetime: "",
  });
}

export class StubQueue {
  sent: unknown[] = [];
  send = async (msg: unknown) => {
    this.sent.push(msg);
  };
  sendBatch = async (msgs: { body: unknown }[]) => {
    for (const m of msgs) this.sent.push(m.body);
  };
}

export class StubAnalytics {
  points: AnalyticsEngineDataPoint[] = [];
  writeDataPoint = (p: AnalyticsEngineDataPoint) => {
    this.points.push(p);
  };
}

export class StubDO {
  idFromName = (name: string) => ({
    toString: () => `do-${name}`,
    equals: () => false,
    name,
  });
  get = () => ({
    fetch: async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
  });
}

/** Tiny D1 stub backed by JS objects. Supports just the queries auth/seed use. */
export class StubD1 {
  users: Record<string, { id: string; email: string; created_at: number; updated_at: number; last_login_at: number | null }> = {};
  categories: Record<string, { slug: string; name: string; description: string; icon: string; sort_order: number }> = {};
  subcategories: Record<string, { slug: string; category_slug: string; name: string; sort_order: number }> = {};
  models: Record<string, { slug: string; name: string; summary: string; category_slug: string; subcategory_slug: string | null; developer: string; status: string; featured: number; risk_tier: string; maturity: string; price_cents: number; rating_avg: number; rating_count: number; trending_score: number; federated: number; thumbnail_url: string | null; created_at: number; updated_at: number }> = {};

  prepare(query: string) {
    const q = query.replace(/\s+/g, " ").trim();
    return {
      bind: (...vals: unknown[]) => ({
        first: async () => {
          if (q === "SELECT 1 AS ok") return { ok: 1 };
          if (q === "SELECT id, email FROM users WHERE email = ?") {
            const u = Object.values(this.users).find((x) => x.email === vals[0]);
            return u ? { id: u.id, email: u.email } : null;
          }
          throw new Error(`StubD1: unsupported first() query: ${q}`);
        },
        run: async () => {
          if (q.startsWith("UPDATE users SET last_login_at")) {
            const id = vals[2] as string;
            const u = this.users[id];
            if (u) {
              u.last_login_at = vals[0] as number;
              u.updated_at = vals[1] as number;
            }
            return { success: true };
          }
          if (q.startsWith("INSERT INTO users")) {
            const [id, email, created_at, updated_at, last_login_at] = vals as [
              string,
              string,
              number,
              number,
              number,
            ];
            this.users[id] = { id, email, created_at, updated_at, last_login_at };
            return { success: true };
          }
          if (q.startsWith("INSERT OR IGNORE INTO categories")) {
            const [slug, name, description, icon, sort_order] = vals as [
              string,
              string,
              string,
              string,
              number,
            ];
            if (!this.categories[slug]) {
              this.categories[slug] = { slug, name, description, icon, sort_order };
            }
            return { success: true };
          }
          if (q.startsWith("INSERT OR IGNORE INTO subcategories")) {
            const [slug, category_slug, name, sort_order] = vals as [
              string,
              string,
              string,
              number,
            ];
            if (!this.subcategories[slug]) {
              this.subcategories[slug] = { slug, category_slug, name, sort_order };
            }
            return { success: true };
          }
          if (q.startsWith("INSERT OR IGNORE INTO models")) {
            // Phase 2 column order: slug, name, summary, category_slug,
            // subcategory_slug, developer, risk_tier, maturity, price_cents,
            // rating_avg, rating_count, trending_score, federated,
            // thumbnail_url, created_at, updated_at.
            const [
              slug,
              name,
              summary,
              category_slug,
              subcategory_slug,
              developer,
              risk_tier,
              maturity,
              price_cents,
              rating_avg,
              rating_count,
              trending_score,
              federated,
              thumbnail_url,
              created_at,
              updated_at,
            ] = vals as [
              string,
              string,
              string,
              string,
              string | null,
              string,
              string,
              string,
              number,
              number,
              number,
              number,
              number,
              string | null,
              number,
              number,
            ];
            if (!this.models[slug]) {
              this.models[slug] = {
                slug,
                name,
                summary,
                category_slug,
                subcategory_slug,
                developer,
                status: "draft",
                featured: 1,
                risk_tier,
                maturity,
                price_cents,
                rating_avg,
                rating_count,
                trending_score,
                federated,
                thumbnail_url,
                created_at,
                updated_at,
              };
            }
            return { success: true };
          }
          throw new Error(`StubD1: unsupported run() query: ${q}`);
        },
      }),
      first: async () => {
        if (q === "SELECT 1 AS ok") return { ok: 1 };
        throw new Error(`StubD1: unsupported first() (no bind): ${q}`);
      },
    };
  }
}

export interface BuildEnvOptions {
  jwt?: { privateJwk: string; publicJwk: string };
  environment?: "dev" | "staging" | "production";
  resendApiKey?: string;
}

export async function buildStubEnv(opts: BuildEnvOptions = {}): Promise<{
  env: Env;
  bindings: {
    db: StubD1;
    sessions: StubKV;
    rateLimits: StubKV;
    queue: StubQueue;
    analytics: StubAnalytics;
    keys: { privateJwk: string; publicJwk: string };
  };
}> {
  const keys = opts.jwt ?? (await generateKeypair());
  const db = new StubD1();
  const sessions = new StubKV();
  const rateLimits = new StubKV();
  const r2 = new StubR2();
  const vec = new StubVectorize();
  const queue = new StubQueue();
  const analytics = new StubAnalytics();
  const dobj = new StubDO();
  const env = {
    DB: db as unknown as D1Database,
    MODELS: r2 as unknown as R2Bucket,
    DATASETS_PUBLIC: r2 as unknown as R2Bucket,
    DATASETS_LICENSED: r2 as unknown as R2Bucket,
    FED_UPDATES: r2 as unknown as R2Bucket,
    AUDIT: r2 as unknown as R2Bucket,
    SESSIONS: sessions as unknown as KVNamespace,
    RATE_LIMITS: rateLimits as unknown as KVNamespace,
    SEARCH: vec as unknown as VectorizeIndex,
    JOBS: queue as unknown as Queue<unknown>,
    EVENTS: analytics as unknown as AnalyticsEngineDataset,
    ROUND: dobj as unknown as DurableObjectNamespace,
    ENVIRONMENT: opts.environment ?? "dev",
    APP_BASE_URL: "http://localhost:8787",
    EMAIL_FROM: "GeFi Test <noreply@test>",
    JWT_SK: keys.privateJwk,
    JWT_PK: keys.publicJwk,
    STRIPE_SK: "sk_test_stub",
    RESEND_API_KEY: opts.resendApiKey ?? "",
  } satisfies Env;
  return { env, bindings: { db, sessions, rateLimits, queue, analytics, keys } };
}

/**
 * In-memory implementation of `ModelsRepository` used by the catalog tests.
 *
 * Mirrors the SQL behaviour of `D1ModelsRepository`: filter → sort → cursor
 * → take limit+1. Keeping this in lock-step with the D1 SQL is the whole
 * point of having a single `listModels(...)` orchestration upstream.
 */
export class InMemoryModelsRepository implements ModelsRepository {
  constructor(public rows: ModelRow[] = []) {}

  async list(query: ListModelsQuery): Promise<ModelRow[]> {
    let filtered = this.rows.slice();
    if (query.category) filtered = filtered.filter((r) => r.category_slug === query.category);
    if (query.subcategory)
      filtered = filtered.filter((r) => r.subcategory_slug === query.subcategory);
    if (query.risk) filtered = filtered.filter((r) => r.risk_tier === query.risk);
    if (query.maturity) filtered = filtered.filter((r) => r.maturity === query.maturity);
    if (query.featured !== undefined) {
      const want = query.featured ? 1 : 0;
      filtered = filtered.filter((r) => r.featured === want);
    }
    if (query.q) {
      const needle = query.q.toLowerCase();
      filtered = filtered.filter(
        (r) => r.name.toLowerCase().includes(needle) || r.summary.toLowerCase().includes(needle),
      );
    }

    const dir = sortDirection(query.sort);
    filtered.sort((a, b) => {
      const av = sortValueOf(a, query.sort);
      const bv = sortValueOf(b, query.sort);
      if (av !== bv) return dir === "DESC" ? bv - av : av - bv;
      return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
    });

    if (query.cursor) {
      const c = query.cursor;
      filtered = filtered.filter((r) => {
        const v = sortValueOf(r, query.sort);
        if (dir === "DESC") return v < c.sortValue || (v === c.sortValue && r.slug > c.slug);
        return v > c.sortValue || (v === c.sortValue && r.slug > c.slug);
      });
    }

    return filtered.slice(0, query.limit + 1);
  }
}

/** Captures emails sent during a test instead of calling Resend. */
export class CapturingEmailSender {
  sent: { to: string; subject: string; html: string }[] = [];
  send = async (args: { from: string; to: string; subject: string; html: string }) => {
    this.sent.push({ to: args.to, subject: args.subject, html: args.html });
    return { id: "test-msg-id", stubbed: false };
  };
}
