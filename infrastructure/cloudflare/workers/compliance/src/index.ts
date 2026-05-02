/**
 * `gefi-compliance` — internal Worker reachable only via Service binding
 * from `gefi-api`. Owns:
 *
 *   - the audit vault (hash-chained `audit_events` + Merkle anchors)
 *   - the lawyer/auditor directory + per-tenant assignments
 *   - the ComplianceCase Durable Object (per-case state + SLA alarms)
 *   - the data-residency attestation surface
 *
 * Internal-token auth gates every non-/health endpoint. The token is
 * minted by `gefi-api` and passed in `X-Gefi-Internal-Token`. Public
 * routes never go through Cloudflare (`workers_dev: false` + no public
 * route).
 */

import { applyHeaders } from "@gefi/shared-headers";
import type { ComplianceEnv } from "@gefi/shared-types";
import { auditAppendHandler, auditProofHandler } from "./handlers/audit.js";
import { adminAnchorHandler, adminSeedDirectoryHandler } from "./handlers/admin.js";
import { casesGetHandler, casesListHandler, casesPatchHandler } from "./handlers/cases.js";
import { eventsHandler } from "./handlers/events.js";
import { residencyHandler } from "./handlers/residency.js";
import { requireInternalToken } from "./middleware.js";
import { Router, type RouteContext } from "./router.js";

export { ComplianceCase } from "./case-do.js";

const router = new Router()
  .get("/health", healthHandler)
  .get("/_health", healthHandler)
  .post("/events", eventsHandler)
  .post("/audit/append", auditAppendHandler)
  .get("/audit/proof/:event_id", auditProofHandler)
  .get("/cases", casesListHandler)
  .get("/cases/:id", casesGetHandler)
  .patch("/cases/:id", casesPatchHandler)
  .get("/residency/:tenant_id", residencyHandler)
  .post("/admin/anchor", adminAnchorHandler)
  .post("/admin/seed-directory", adminSeedDirectoryHandler);

async function healthHandler({ env }: RouteContext): Promise<Response> {
  const failed: string[] = [];
  try {
    await env.DB.prepare("SELECT 1").first();
  } catch {
    failed.push("d1");
  }
  try {
    await env.CACHE.list({ limit: 1 });
  } catch {
    failed.push("kv");
  }
  try {
    await env.EVIDENCE.head("__health_probe__");
  } catch {
    failed.push("r2");
  }
  const ok = failed.length === 0;
  return Response.json(
    {
      ok,
      worker: "gefi-compliance",
      environment: env.ENVIRONMENT,
      region: env.WORKER_REGION,
      failed: ok ? undefined : failed,
      ts: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 },
  );
}

export default {
  async fetch(request: Request, env: ComplianceEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const gate = requireInternalToken(request, env);
    if (gate) return applyHeaders(gate, "api", env);

    const match = router.match(request.method, url);
    if (!match) {
      return applyHeaders(
        Response.json({ ok: false, error: "not_found", path: url.pathname }, { status: 404 }),
        "api",
        env,
      );
    }
    const [handler, params] = match;
    const rc: RouteContext = { request, env, ctx, params };
    try {
      const response = await handler(rc);
      return applyHeaders(response, "api", env);
    } catch (err) {
      console.error("[gefi-compliance] handler threw", err);
      return applyHeaders(
        Response.json({ ok: false, error: "internal_error" }, { status: 500 }),
        "api",
        env,
      );
    }
  },
} satisfies ExportedHandler<ComplianceEnv>;
