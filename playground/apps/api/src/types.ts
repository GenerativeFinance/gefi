/**
 * Worker environment bindings + vars + secrets.
 *
 * Mirrors apps/api/wrangler.toml. Treat this file as the source of truth
 * for what the Worker needs to function and update both files in lockstep.
 */
export interface Env {
  // ── D1 ──────────────────────────────────────────────────────────────────
  DB: D1Database;

  // ── R2 ──────────────────────────────────────────────────────────────────
  MODELS: R2Bucket;
  DATASETS_PUBLIC: R2Bucket;
  DATASETS_LICENSED: R2Bucket;
  FED_UPDATES: R2Bucket;
  AUDIT: R2Bucket;

  // ── KV ──────────────────────────────────────────────────────────────────
  SESSIONS: KVNamespace;
  RATE_LIMITS: KVNamespace;

  // ── Vectorize ───────────────────────────────────────────────────────────
  SEARCH: VectorizeIndex;

  // ── Queue ───────────────────────────────────────────────────────────────
  JOBS: Queue<unknown>;

  // ── Analytics Engine ────────────────────────────────────────────────────
  EVENTS: AnalyticsEngineDataset;

  // ── Durable Object ──────────────────────────────────────────────────────
  ROUND: DurableObjectNamespace;

  // ── Workers AI (optional in dev) ────────────────────────────────────────
  AI?: Ai;

  // ── Vars (committed) ────────────────────────────────────────────────────
  ENVIRONMENT: "dev" | "staging" | "production";
  APP_BASE_URL: string;
  EMAIL_FROM: string;

  // ── Secrets (NEVER committed; set via `wrangler secret put`) ────────────
  JWT_SK: string; // JSON-stringified Ed25519 private JWK
  JWT_PK: string; // JSON-stringified Ed25519 public JWK
  STRIPE_SK: string;
  RESEND_API_KEY: string;
}

/**
 * Authenticated user attached to the Hono context by `requireAuth`.
 */
export interface SessionUser {
  id: string;
  email: string;
}

/**
 * Hono variables map for typed `c.get/c.set`.
 */
export interface HonoVariables {
  user: SessionUser;
}
