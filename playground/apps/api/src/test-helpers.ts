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
import type {
  AuditRow,
  DetailRepository,
  ModelVersionRow,
  ReviewRow,
} from "./lib/detail-repo.js";

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
  models: Record<string, { slug: string; name: string; summary: string; category_slug: string; subcategory_slug: string | null; developer: string; status: string; featured: number; risk_tier: string; maturity: string; price_cents: number; rating_avg: number; rating_count: number; trending_score: number; federated: number; thumbnail_url: string | null; training_enabled?: number; created_at: number; updated_at: number }> = {};
  model_versions: Record<string, { id: string; model_slug: string; version: string; version_label: string | null; sha256: string | null; metrics: string | null; input_schema?: string | null; output_schema?: string | null; created_at: number }> = {};
  model_audits: Record<string, { id: string; model_slug: string; auditor: string; standard: string; audited_at: number; passed: number; hash: string; created_at: number }> = {};

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
          if (q.startsWith("INSERT OR IGNORE INTO model_versions")) {
            const [id, model_slug, version, version_label, sha256, metrics, created_at] =
              vals as [string, string, string, string | null, string | null, string | null, number];
            if (!this.model_versions[id]) {
              this.model_versions[id] = {
                id,
                model_slug,
                version,
                version_label,
                sha256,
                metrics,
                created_at,
              };
            }
            return { success: true };
          }
          if (q.startsWith("UPDATE models SET training_enabled")) {
            const [training_enabled, updated_at, slug] = vals as [number, number, string];
            const m = this.models[slug];
            if (m) {
              m.training_enabled = training_enabled;
              m.updated_at = updated_at;
            }
            return { success: true };
          }
          if (q.startsWith("UPDATE model_versions SET input_schema")) {
            const [input_schema, output_schema, model_slug] = vals as [string, string, string];
            for (const v of Object.values(this.model_versions)) {
              if (v.model_slug === model_slug) {
                v.input_schema = input_schema;
                v.output_schema = output_schema;
              }
            }
            return { success: true };
          }
          if (q.startsWith("INSERT OR IGNORE INTO model_audits")) {
            const [id, model_slug, auditor, standard, audited_at, passed, hash, created_at] =
              vals as [string, string, string, string, number, number, string, number];
            if (!this.model_audits[id]) {
              this.model_audits[id] = {
                id,
                model_slug,
                auditor,
                standard,
                audited_at,
                passed,
                hash,
                created_at,
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

/**
 * In-memory `DetailRepository` for the model-detail / favorites / reviews
 * route tests. Keeps the same orchestration semantics as `D1DetailRepository`
 * so the route layer is exercised identically.
 */
export class InMemoryDetailRepository implements DetailRepository {
  models: ModelRow[] = [];
  descriptions = new Map<string, string>();
  versions: ModelVersionRow[] = [];
  audits: AuditRow[] = [];
  reviews: ReviewRow[] = [];
  favorites = new Set<string>(); // `${userId}|${slug}`

  constructor(seed?: { models?: ModelRow[]; versions?: ModelVersionRow[]; audits?: AuditRow[] }) {
    if (seed?.models) this.models = seed.models;
    if (seed?.versions) this.versions = seed.versions;
    if (seed?.audits) this.audits = seed.audits;
  }

  async getModelRow(slug: string): Promise<ModelRow | null> {
    return this.models.find((m) => m.slug === slug) ?? null;
  }
  async getModelDescription(slug: string): Promise<string | null> {
    return this.descriptions.get(slug) ?? null;
  }
  async listVersions(slug: string): Promise<ModelVersionRow[]> {
    return this.versions
      .filter((v) => v.model_slug === slug)
      .slice()
      .sort((a, b) => b.created_at - a.created_at);
  }
  async listAudits(slug: string): Promise<AuditRow[]> {
    return this.audits
      .filter((a) => a.model_slug === slug)
      .slice()
      .sort((a, b) => b.audited_at - a.audited_at);
  }
  async listReviews(slug: string, cursor: number | null, limit: number): Promise<ReviewRow[]> {
    let list = this.reviews
      .filter((r) => r.model_slug === slug)
      .slice()
      .sort((a, b) => b.created_at - a.created_at || (b.id < a.id ? -1 : b.id > a.id ? 1 : 0));
    if (cursor !== null) list = list.filter((r) => r.created_at < cursor);
    return list.slice(0, limit);
  }
  async upsertReview(args: {
    slug: string;
    userId: string;
    stars: number;
    comment: string;
    now: number;
    newId: () => string;
  }): Promise<{ review: ReviewRow; ratingAvg: number; ratingCount: number }> {
    const existing = this.reviews.find(
      (r) => r.model_slug === args.slug && r.user_id === args.userId,
    );
    let review: ReviewRow;
    if (existing) {
      existing.stars = args.stars;
      existing.comment = args.comment;
      existing.updated_at = args.now;
      review = existing;
    } else {
      review = {
        id: args.newId(),
        model_slug: args.slug,
        user_id: args.userId,
        stars: args.stars,
        comment: args.comment,
        created_at: args.now,
        updated_at: args.now,
      };
      this.reviews.push(review);
    }
    const all = this.reviews.filter((r) => r.model_slug === args.slug);
    const ratingCount = all.length;
    const avg = ratingCount === 0 ? 0 : all.reduce((s, r) => s + r.stars, 0) / ratingCount;
    const ratingAvg = Math.round((avg + Number.EPSILON) * 10) / 10;
    const m = this.models.find((mm) => mm.slug === args.slug);
    if (m) {
      m.rating_avg = ratingAvg;
      m.rating_count = ratingCount;
      m.updated_at = args.now;
    }
    return { review, ratingAvg, ratingCount };
  }
  async isFavorited(userId: string, slug: string): Promise<boolean> {
    return this.favorites.has(`${userId}|${slug}`);
  }
  async toggleFavorite(userId: string, slug: string, _now: number): Promise<boolean> {
    const key = `${userId}|${slug}`;
    if (this.favorites.has(key)) {
      this.favorites.delete(key);
      return false;
    }
    this.favorites.add(key);
    return true;
  }
}

/**
 * In-memory `PlaygroundRepository` for the playground run-endpoint tests.
 * Mirrors `D1PlaygroundRepository` semantics: returns latest version by
 * `created_at` and appends inference rows in insertion order.
 */
import type {
  InferenceCallInsert,
  PlaygroundRepository,
  PlaygroundVersionRow,
} from "./lib/playground-repo.js";

export class InMemoryPlaygroundRepository implements PlaygroundRepository {
  models: ModelRow[] = [];
  versions: PlaygroundVersionRow[] = [];
  inferenceCalls: InferenceCallInsert[] = [];

  constructor(seed?: { models?: ModelRow[]; versions?: PlaygroundVersionRow[] }) {
    if (seed?.models) this.models = seed.models;
    if (seed?.versions) this.versions = seed.versions;
  }
  async getModel(slug: string): Promise<ModelRow | null> {
    return this.models.find((m) => m.slug === slug) ?? null;
  }
  async getLatestVersion(slug: string): Promise<PlaygroundVersionRow | null> {
    const list = this.versions
      .filter((v) => v.model_slug === slug)
      .slice()
      .sort((a, b) => b.created_at - a.created_at);
    return list[0] ?? null;
  }
  async insertInferenceCall(row: InferenceCallInsert): Promise<void> {
    this.inferenceCalls.push(row);
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
