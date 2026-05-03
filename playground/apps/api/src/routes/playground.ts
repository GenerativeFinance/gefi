/**
 * Phase 4 — Generic Playground run endpoint.
 *
 *   POST /api/playground/:slug/run
 *
 * Flow:
 *   1. Look up `models` row → 404 if unknown.
 *   2. Look up latest `model_versions` row for `input_schema/output_schema`.
 *   3. Validate the JSON body against `input_schema` (`schema-validate.ts`).
 *   4. Apply KV rate limit:
 *        - 200/day per authenticated user, OR
 *        - 20/day per IP for anonymous callers.
 *   5. Dispatch to the canned mock for the slug (`PLAYGROUND_MOCKS_BY_SLUG`).
 *   6. Write a single `inference_calls` row (is_playground=1, mock=1).
 *   7. Return `{ output, latency_ms, mock: true, version }`.
 *
 * Phase 6 swaps step 5 for a real per-model dispatch and flips `mock` to 0.
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

const RATE_LIMIT_AUTHED = 200;        // requests per user per day
const RATE_LIMIT_ANON = 20;           // requests per IP per day
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export interface PlaygroundRoutesOptions {
  repository?: PlaygroundRepository;
  /** Override mocks for tests (defaults to the seeded `PLAYGROUND_MOCKS_BY_SLUG`). */
  mocks?: ReadonlyMap<string, PlaygroundMock>;
  /** Override user resolution for tests. */
  resolveUserId?: (req: Request) => string | null | Promise<string | null>;
  /** Inject clock (epoch seconds for DB, used as ms*1000 elsewhere). */
  now?: () => number;
  /** Inject id generator. */
  newId?: () => string;
  /** Skip rate limiting in tests by default. */
  rateLimit?: boolean;
}

export function playgroundRoutes(opts: PlaygroundRoutesOptions = {}) {
  const router = new Hono<{ Bindings: Env; Variables: HonoVariables }>();
  const now = opts.now ?? (() => Math.floor(Date.now() / 1000));
  const newId = opts.newId ?? uuid;
  const mocks = opts.mocks ?? PLAYGROUND_MOCKS_BY_SLUG;
  const repoOf = (env: Env): PlaygroundRepository =>
    opts.repository ?? new D1PlaygroundRepository(env.DB);

  async function defaultResolveUserId(c: {
    req: { header: (n: string) => string | undefined };
    env: Env;
  }): Promise<string | null> {
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
      // deprecated models are not callable
      return c.json({ error: "model_unavailable", status: model.status }, 410);
    }

    const version = await repo.getLatestVersion(slug);

    // Resolve schema: prefer the DB row, fall back to the in-process mocks
    // catalog. The seed currently writes the mocks' schemas into D1, but the
    // route stays useful in tests where only one or the other is populated.
    const mock = mocks.get(slug);
    const inputSchema: JsonSchema | null = version?.input_schema
      ? safeJson(version.input_schema)
      : (mock?.inputSchema ?? null);
    const outputSchema: JsonSchema | null = version?.output_schema
      ? safeJson(version.output_schema)
      : (mock?.outputSchema ?? null);

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
    if (!v.valid) return c.json({ error: "invalid_input", details: v.errors }, 400);

    if (!mock) {
      // No backend wired and no mock to fall back to.
      return c.json({ error: "no_runtime", message: "Per-model backend lands in Phase 6" }, 501);
    }

    // ── Rate limiting ────────────────────────────────────────────────────
    const userId = opts.resolveUserId
      ? await opts.resolveUserId(c.req.raw)
      : await defaultResolveUserId(c);
    const rateLimit = opts.rateLimit ?? true;
    if (rateLimit) {
      const ip = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for") ?? "unknown";
      const key = userId ? `pg:run:user:${userId}` : `pg:run:ip:${ip}`;
      const limit = userId ? RATE_LIMIT_AUTHED : RATE_LIMIT_ANON;
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
    const output = mock.mockOutput(body as Record<string, unknown>);
    const latencyMs = Math.max(1, Date.now() - start);

    // ── Audit trail ─────────────────────────────────────────────────────
    const inputHash = await canonicalInputHash(body);
    await repo.insertInferenceCall({
      id: newId(),
      model_slug: slug,
      user_id: userId,
      input_hash: inputHash,
      latency_ms: latencyMs,
      is_playground: true,
      mock: true,
      now: now(),
    });

    return c.json({
      output,
      latency_ms: latencyMs,
      mock: true,
      version: version?.version ?? null,
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
