/**
 * GET /api/health — touches every binding in parallel and reports status.
 *
 *   { status: "ok" | "degraded", services: { d1, r2, kv, vectorize, queue, ai, events, do } }
 *
 * The endpoint is intentionally cheap: each probe either reads a sentinel,
 * issues a tiny describe call, or writes a single Analytics Engine point.
 * Failures are isolated via Promise.allSettled so one broken binding doesn't
 * cascade.
 */
import type { Context } from "hono";
import type { Env, HonoVariables } from "../types.js";

type ServiceStatus = "ok" | "degraded" | "skipped";

interface ServiceResult {
  status: ServiceStatus;
  detail?: string;
}

async function probe(label: string, fn: () => Promise<unknown>): Promise<ServiceResult> {
  try {
    await fn();
    return { status: "ok" };
  } catch (err) {
    return {
      status: "degraded",
      detail: err instanceof Error ? `${label}: ${err.message}` : `${label}: unknown error`,
    };
  }
}

export async function healthHandler(
  c: Context<{ Bindings: Env; Variables: HonoVariables }>,
): Promise<Response> {
  const env = c.env;
  const sentinel = "_health_sentinel";

  const probes = {
    d1: probe("d1", () => env.DB.prepare("SELECT 1 AS ok").first()),
    sessions_kv: probe("sessions_kv", () => env.SESSIONS.get(sentinel)),
    rate_limits_kv: probe("rate_limits_kv", () => env.RATE_LIMITS.get(sentinel)),
    r2_models: probe("r2_models", () => env.MODELS.head(sentinel)),
    r2_datasets_public: probe("r2_datasets_public", () => env.DATASETS_PUBLIC.head(sentinel)),
    r2_datasets_licensed: probe("r2_datasets_licensed", () => env.DATASETS_LICENSED.head(sentinel)),
    r2_fed_updates: probe("r2_fed_updates", () => env.FED_UPDATES.head(sentinel)),
    r2_audit: probe("r2_audit", () => env.AUDIT.head(sentinel)),
    vectorize: probe("vectorize", () => env.SEARCH.describe()),
    queue: probe("queue", async () => {
      // In dev miniflare the producer always accepts; in prod this round-trips
      // to the queue control plane. We send a heartbeat and do not retry.
      await env.JOBS.send({ kind: "heartbeat", at: Date.now() });
    }),
    analytics: probe("analytics", async () => {
      env.EVENTS.writeDataPoint({
        blobs: ["health"],
        doubles: [Date.now()],
        indexes: [env.ENVIRONMENT],
      });
    }),
    durable_object: probe("durable_object", async () => {
      const id = env.ROUND.idFromName("health");
      const stub = env.ROUND.get(id);
      const res = await stub.fetch("https://do.local/status");
      if (!res.ok) throw new Error(`DO returned ${res.status}`);
    }),
    ai: env.AI
      ? probe("ai", async () => {
          // 1-token ping; the smallest, cheapest model we have available.
          await env.AI!.run("@cf/meta/llama-3.2-1b-instruct", {
            prompt: "ping",
            max_tokens: 1,
          });
        })
      : Promise.resolve<ServiceResult>({ status: "skipped", detail: "AI binding not configured" }),
  };

  const entries = await Promise.all(
    Object.entries(probes).map(async ([k, p]) => [k, await p] as const),
  );
  const services = Object.fromEntries(entries) as Record<string, ServiceResult>;

  const degraded = Object.values(services).some((s) => s.status === "degraded");
  return c.json(
    {
      status: degraded ? "degraded" : "ok",
      environment: env.ENVIRONMENT,
      timestamp: new Date().toISOString(),
      services,
    },
    degraded ? 503 : 200,
  );
}
