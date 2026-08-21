/**
 * Phase 6 public model-prediction route.
 *
 *   POST /v1/models/:slug/predict
 *
 * Wraps the same dispatch / quota / audit pipeline as the playground route
 * but enforces authentication (Bearer API key OR session cookie) and
 * marks rows with `is_playground=0` so billing aggregation can split
 * playground evals from real usage.
 *
 * The route is mounted alongside `/api/playground/:slug/run` in `index.ts`.
 * Both paths converge on the same `MODEL_HANDLERS` registry, so adding a
 * new model only requires a new handler file plus a registry entry.
 */
import { Hono } from "hono";
import type { Env, HonoVariables } from "../types.js";
import { uuid } from "../lib/random.js";
import { verifyJwt } from "../lib/jwt.js";
import { SESSION_COOKIE, readCookie } from "../lib/cookie.js";
import { checkRateLimit } from "../lib/rate-limit.js";
import { validateAgainstSchema } from "../lib/schema-validate.js";
import type { JsonSchema } from "../data/playground-mocks.js";
import {
  D1PlaygroundRepository,
  canonicalInputHash,
  type PlaygroundRepository,
} from "../lib/playground-repo.js";
import { MODEL_HANDLERS, type ModelHandler } from "../models/index.js";
import { sha256Hex } from "../models/_shared.js";
import { resolveBearerUserId } from "../lib/api-keys.js";
import { getTier, TIER_DAILY_QUOTA, type SubscriptionTier } from "../lib/subscriptions.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export interface V1RoutesOptions {
  repository?: PlaygroundRepository;
  handlers?: ReadonlyMap<string, ModelHandler>;
  resolveUserId?: (req: Request) => string | null | Promise<string | null>;
  getTier?: (userId: string) => Promise<SubscriptionTier>;
  now?: () => number;
  newId?: () => string;
  rateLimit?: boolean;
}

export function v1Routes(opts: V1RoutesOptions = {}) {
  const router = new Hono<{ Bindings: Env; Variables: HonoVariables }>();
  const now = opts.now ?? (() => Math.floor(Date.now() / 1000));
  const newId = opts.newId ?? uuid;
  const handlers = opts.handlers ?? MODEL_HANDLERS;
  const repoOf = (env: Env): PlaygroundRepository =>
    opts.repository ?? new D1PlaygroundRepository(env.DB);

  router.post("/models/:slug/predict", async (c) => {
    const slug = c.req.param("slug");
    const repo = repoOf(c.env);

    const model = await repo.getModel(slug);
    if (!model) return c.json({ error: "not_found" }, 404);
    if (model.status !== "approved" && model.status !== "draft") {
      return c.json({ error: "model_unavailable", status: model.status }, 410);
    }

    const handler = handlers.get(slug);
    if (!handler) return c.json({ error: "no_runtime" }, 501);
    const version = await repo.getLatestVersion(slug);

    const inputSchema: JsonSchema = version?.input_schema
      ? (safeJson(version.input_schema) ?? handler.inputSchema)
      : handler.inputSchema;
    const outputSchema: JsonSchema = version?.output_schema
      ? (safeJson(version.output_schema) ?? handler.outputSchema)
      : handler.outputSchema;

    // ── Auth: Bearer or cookie. v1 requires SOME identity. ───────────────
    const userId = opts.resolveUserId
      ? await opts.resolveUserId(c.req.raw)
      : await resolveCallerId(c);
    if (!userId) return c.json({ error: "unauthenticated" }, 401);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "invalid_json" }, 400);
    }

    const valid = validateAgainstSchema(body, inputSchema);
    if (!valid.valid) {
      return c.json({ error: "invalid_input", details: valid.errors }, 422);
    }

    // ── Quota enforcement ────────────────────────────────────────────────
    const rateLimit = opts.rateLimit ?? true;
    if (rateLimit) {
      const tier = opts.getTier ? await opts.getTier(userId) : await getTier(c.env.DB, userId);
      // Shared key with /api/playground so a user's per-day quota is
      // enforced across BOTH entry points, not per-route.
      const r = await checkRateLimit(
        c.env.RATE_LIMITS,
        `quota:user:${userId}`,
        TIER_DAILY_QUOTA[tier],
        ONE_DAY_MS,
      );
      if (!r.allowed) {
        return c.json(
          { error: "rate_limited", remaining: 0, reset_ms: r.resetMs, tier },
          429,
          { "retry-after": Math.ceil(r.resetMs / 1000).toString() },
        );
      }
    }

    // ── Dispatch ─────────────────────────────────────────────────────────
    // Runtime is DB-authoritative — the persisted `model_versions.runtime`
    // value wins over the handler's declared default, so a runtime swap can
    // be staged via a SQL UPDATE without redeploying the worker.
    const runtime = version?.runtime ?? handler.runtime;
    const start = Date.now();
    const inputHash = await canonicalInputHash(body);
    let output: Record<string, unknown>;
    try {
      output = await handler.predict(body as Record<string, unknown>, {
        seed: inputHash,
        ai: c.env.AI,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "runtime_error";
      return c.json({ error: "runtime_error", message }, 502, { "retry-after": "5" });
    }
    const latencyMs = Math.max(1, Date.now() - start);

    // Validate the handler's output against the declared output_schema so a
    // regression can't ship schema-invalid data downstream.
    const ov = validateAgainstSchema(output, outputSchema);
    if (!ov.valid) {
      return c.json(
        { error: "output_invalid", details: ov.errors },
        502,
        { "retry-after": "5" },
      );
    }

    const outputHash = await sha256Hex(JSON.stringify(output));

    await repo.insertInferenceCall({
      id: newId(),
      model_slug: slug,
      user_id: userId,
      input_hash: inputHash,
      latency_ms: latencyMs,
      is_playground: false, // real call, not a playground eval
      mock: false,
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
      version: version?.version ?? null,
      runtime,
      output_schema: outputSchema,
    });
  });

  return router;

  async function resolveCallerId(c: {
    req: { header: (n: string) => string | undefined };
    env: Env;
  }): Promise<string | null> {
    const bearer = await resolveBearerUserId(c.env.DB, c.req.header("authorization"), now() * 1000);
    if (bearer) return bearer;
    const token = readCookie(c.req.header("cookie"), SESSION_COOKIE);
    if (!token) return null;
    const payload = await verifyJwt(token, c.env.JWT_PK);
    return payload?.sub ?? null;
  }
}

function safeJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
