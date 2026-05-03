/**
 * Lightweight in-memory stubs for Worker bindings, used by Vitest tests.
 *
 * Not a full miniflare emulator — just enough surface area for the routes
 * and probes we exercise in unit tests. Anything we don't implement throws
 * loudly so missing test coverage is obvious.
 */
import type { Env } from "./types.js";
import { generateKeypair } from "./lib/jwt.js";

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
  models: Record<string, { slug: string; name: string; summary: string; category_slug: string; developer: string; status: string; featured: number; created_at: number; updated_at: number }> = {};

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
          if (q.startsWith("INSERT OR IGNORE INTO models")) {
            const [slug, name, summary, category_slug, developer] = vals as [
              string,
              string,
              string,
              string,
              string,
            ];
            const created_at = vals[5] as number;
            const updated_at = vals[6] as number;
            if (!this.models[slug]) {
              this.models[slug] = {
                slug,
                name,
                summary,
                category_slug,
                developer,
                status: "draft",
                featured: 1,
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

/** Captures emails sent during a test instead of calling Resend. */
export class CapturingEmailSender {
  sent: { to: string; subject: string; html: string }[] = [];
  send = async (args: { from: string; to: string; subject: string; html: string }) => {
    this.sent.push({ to: args.to, subject: args.subject, html: args.html });
    return { id: "test-msg-id", stubbed: false };
  };
}
