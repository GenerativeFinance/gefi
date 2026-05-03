/**
 * Playground / v1 model-prediction route — Phase 6.
 *
 *   POST /api/playground/:slug/run     — playground caller (cookie auth, mock=0)
 *
 * Flow:
 *   1. Look up `models` row → 404 if unknown.
 *   2. Look up latest `model_versions` row for input/output schema + runtime.
 *   3. Validate the JSON body against `input_schema`. 422 on schema fail
 *      (Phase 6 spec; Phase 4 returned 400 — kept the `invalid_input` error
 *      code so existing clients still recognise it).
 *   4. Resolve caller: Bearer API key → cookie session → anonymous.
 *   5. Apply KV rate limit:
 *        - Anonymous: 20/day per IP.
 *        - Authenticated: per-tier daily quota from `subscriptions`
 *          (free=100, pro=10k, enterprise=1M).
 *   6. Dispatch to the per-model handler from `MODEL_HANDLERS`. Handler
 *      crashes / unregistered slugs fall back to the Phase 4 canned mock so
 *      the playground stays alive.
 *   7. Write `inference_calls` (billing) + `audit_log` (immutable record).
 *   8. Return `{ output, latency_ms, mock, version, runtime, output_schema }`.
 */
import { Hono } from "hono";
import type { Env, HonoVariables } from "../types.js";
import { uuid } from "../lib/random.js";
import { verifyJwt } from "../lib/jwt.js";
import { SESSION_COOKIE, readCookie } from "../lib/cookie.js";
import { checkRateLimit } from "../lib/rate-limit.js";
import { validateAgainstSchema } from "../lib/schema-validate.js";
import {
  PLAYGROUND_MOCKS_BY_SLUG,
  type JsonSchema,
  type PlaygroundMock,
} from "../data/playground-mocks.js";
import {
  D1PlaygroundRepository,
  canonicalInputHash,
  type PlaygroundRepository,
} from "../lib/playground-repo.js";
import { MODEL_HANDLERS, type ModelHandler } from "../models/index.js";
import { sha256Hex } from "../models/_shared.js";
import { resolveBearerUserId } from "../lib/api-keys.js";
import { getTier, TIER_DAILY_QUOTA } from "../lib/subscriptions.js";

const RATE_LIMIT_ANON = 20;             // requests per IP per day
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export interface PlaygroundRoutesOptions {
  repository?: PlaygroundRepository;
  /** Override mocks for tests (defaults to the seeded `PLAYGROUND_MOCKS_BY_SLUG`). */
  mocks?: ReadonlyMap<string, PlaygroundMock>;
  /** Override per-slug handlers for tests (defaults to `MODEL_HANDLERS`). */
  handlers?: ReadonlyMap<string, ModelHandler>;
  /** Override user resolution for tests. */
  resolveUserId?: (req: Request) => string | null | Promise<string | null>;
  /** Override per-user tier lookup for tests (defaults to free if unspecified). */
  getTier?: (userId: string) => Promise<"free" | "pro" | "enterprise">;
  /** Inject clock (epoch seconds for DB, used as ms*1000 elsewhere). */
  now?: () => number;
  /** Inject id generator. */
  newId?: () => string;
  /** Skip rate limiting in tests when explicitly disabled. */
  rateLimit?: boolean;
}

export function playgroundRoutes(opts: PlaygroundRoutesOptions = {}) {
  const router = new Hono<{ Bindings: Env; Variables: HonoVariables }>();
  const now = opts.now ?? (() => Math.floor(Date.now() / 1000));
  const newId = opts.newId ?? uuid;
  const mocks = opts.mocks ?? PLAYGROUND_MOCKS_BY_SLUG;
  const handlers = opts.handlers ?? MODEL_HANDLERS;
  const repoOf = (env: Env): PlaygroundRepository =>
    opts.repository ?? new D1PlaygroundRepository(env.DB);

  async function defaultResolveUserId(c: {
    req: { header: (n: string) => string | undefined };
    env: Env;
  }): Promise<string | null> {
    // 1. Bearer API key takes precedence (used by curl / SDK callers).
    const bearer = await resolveBearerUserId(c.env.DB, c.req.header("authorization"), now() * 1000);
    if (bearer) return bearer;
    // 2. Fall back to the playground browser session cookie.
    const token = readCookie(c.req.header("cookie"), SESSION_COOKIE);
    if (!token) return null;
    const payload = await verifyJwt(token, c.env.JWT_PK);
    return payload?.sub ?? null;
  }

  router.post("/:slug/run", async (c) => {
    const slug = c.req.param("slug");
    const repo = repoOf(c.env);

    const model = await repo.getModel(slug);
    if (!model) return c.json({ error: "not_found" }, 404);
    if (model.status !== "approved" && model.status !== "draft") {
      return c.json({ error: "model_unavailable", status: model.status }, 410);
    }

    const version = await repo.getLatestVersion(slug);
    const handler = handlers.get(slug);
    const mock = mocks.get(slug);

    // Schema resolution: prefer the version row, fall back to the handler /
    // mock catalog. This keeps both the production path (D1-backed) and
    // unit-test path (handler-only) working with the same route.
    const inputSchema: JsonSchema | null = version?.input_schema
      ? safeJson(version.input_schema)
      : (handler?.inputSchema ?? mock?.inputSchema ?? null);
    const outputSchema: JsonSchema | null = version?.output_schema
      ? safeJson(version.output_schema)
      : (handler?.outputSchema ?? mock?.outputSchema ?? null);

    if (!inputSchema) {
      return c.json({ error: "schema_missing" }, 503);
    }

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "invalid_json" }, 400);
    }

    const v = validateAgainstSchema(body, inputSchema);
    if (!v.valid) return c.json({ error: "invalid_input", details: v.errors }, 422);

    if (!handler && !mock) {
      return c.json({ error: "no_runtime", message: "No backend registered for this slug" }, 501);
    }

    // ── Auth + rate limiting ────────────────────────────────────────────
    const userId = opts.resolveUserId
      ? await opts.resolveUserId(c.req.raw)
      : await defaultResolveUserId(c);
    const rateLimit = opts.rateLimit ?? true;
    if (rateLimit) {
      const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for") ?? "unknown";
      let limit: number;
      let key: string;
      if (userId) {
        const tier = opts.getTier
          ? await opts.getTier(userId)
          : await getTier(c.env.DB, userId);
        limit = TIER_DAILY_QUOTA[tier];
        key = `pg:run:user:${userId}`;
      } else {
        limit = RATE_LIMIT_ANON;
        key = `pg:run:ip:${ip}`;
      }
      const r = await checkRateLimit(c.env.RATE_LIMITS, key, limit, ONE_DAY_MS);
      if (!r.allowed) {
        return c.json(
          { error: "rate_limited", remaining: 0, reset_ms: r.resetMs },
          429,
          { "retry-after": Math.ceil(r.resetMs / 1000).toString() },
        );
      }
    }

    // ── Dispatch ────────────────────────────────────────────────────────
    const start = Date.now();
    let output: Record<string, unknown>;
    let usedMock = false;
    let runtime = handler?.runtime ?? "synthetic";
    const inputHash = await canonicalInputHash(body);
    try {
      if (handler) {
        output = await handler.predict(
          body as Record<string, unknown>,
          { seed: inputHash, ai: c.env.AI },
        );
      } else {
        output = mock!.mockOutput(body as Record<string, unknown>);
        usedMock = true;
      }
    } catch (err) {
      // Handler crashed — fall back to the canned mock if available; otherwise
      // surface a 502 with retry-after per the Phase 6 contract.
      if (mock) {
        output = mock.mockOutput(body as Record<string, unknown>);
        usedMock = true;
        runtime = "synthetic";
      } else {
        const message = err instanceof Error ? err.message : "runtime_error";
        return c.json(
          { error: "runtime_error", message },
          502,
          { "retry-after": "5" },
        );
      }
    }
    const latencyMs = Math.max(1, Date.now() - start);

    // ── Persistence: billing + audit ───────────────────────────────────
    const outputHash = await sha256Hex(JSON.stringify(output));
    await repo.insertInferenceCall({
      id: newId(),
      model_slug: slug,
      user_id: userId,
      input_hash: inputHash,
      latency_ms: latencyMs,
      is_playground: true,
      mock: usedMock,
      now: now(),
    });
    await repo.insertAuditLog({
      id: newId(),
      model_slug: slug,
      model_version: version?.version ?? null,
      user_id: userId,
      input_hash: inputHash,
      output_hash: outputHash,
      runtime,
      now: now(),
    });

    return c.json({
      output,
      latency_ms: latencyMs,
      mock: usedMock,
      version: version?.version ?? null,
      runtime,
      output_schema: outputSchema,
    });
  });

  return router;
}

function safeJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
