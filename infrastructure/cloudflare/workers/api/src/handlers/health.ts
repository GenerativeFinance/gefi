/**
 * `GET /health` — liveness + bindings smoke test.
 *
 * Returns 200 with `{ ok: true, ... }` if every required binding answers a
 * trivial probe. Returns 503 with `{ ok: false, failed: [...] }` otherwise,
 * so external probes can distinguish "Worker is up but D1 is down" from
 * "Worker is fully healthy".
 *
 * The probes are intentionally cheap — the goal is to detect missing /
 * misconfigured bindings, not to load-test the platform.
 */

import type { Handler } from "../router.js";

export const healthHandler: Handler = async ({ env, region }) => {
  const failed: string[] = [];

  // D1: a no-op SELECT that succeeds whenever the binding is wired up.
  try {
    await env.DB.prepare("SELECT 1").first();
  } catch {
    failed.push("d1");
  }

  // KV: a list-with-limit-1 is the cheapest read we can do.
  try {
    await env.CACHE.list({ limit: 1 });
  } catch {
    failed.push("kv");
  }

  // R2: head an object that almost certainly doesn't exist. A successful
  // "404" response means the binding works.
  try {
    await env.ARTIFACTS.head("__health_probe__");
  } catch {
    failed.push("r2");
  }

  // Vectorize: describe is a metadata-only call.
  try {
    await env.VECTORS.describe();
  } catch {
    failed.push("vectorize");
  }

  // Compliance Service binding: a self-described /health on the sibling.
  // Not all environments have it bound (dev local can skip), so a missing
  // binding is *not* an error — only an actual failure is.
  if (env.COMPLIANCE) {
    try {
      const res = await env.COMPLIANCE.fetch("https://gefi-compliance.internal/health");
      if (!res.ok) failed.push("compliance");
    } catch {
      failed.push("compliance");
    }
  }

  const ok = failed.length === 0;
  return Response.json(
    {
      ok,
      worker: "gefi-api",
      environment: env.ENVIRONMENT,
      region,
      failed: ok ? undefined : failed,
      ts: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 },
  );
};
