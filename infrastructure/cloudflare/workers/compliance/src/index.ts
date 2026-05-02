/**
 * gefi-compliance — internal Worker. Reachable only via Service binding
 * from `gefi-api`. The full compliance engine lands in Task #4; this
 * foundation ships /health plus a stub `/audit/append` so the Service
 * binding contract is locked.
 */

import { applyHeaders } from "@gefi/shared-headers";
import type { ComplianceEnv } from "@gefi/shared-types";

interface AuditAppendRequest {
  tenantId: string;
  modelId: string;
  jurisdiction: string;
  inputHash: string;
  outputHash: string;
  ts: string;
}

async function appendAudit(env: ComplianceEnv, evt: AuditAppendRequest): Promise<{ id: string }> {
  // Idempotent schema bootstrap; the migrations system lands in Task #3.
  await env.DB.exec(
    "CREATE TABLE IF NOT EXISTS audit_log (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, model_id TEXT NOT NULL, jurisdiction TEXT NOT NULL, input_hash TEXT NOT NULL, output_hash TEXT NOT NULL, ts TEXT NOT NULL)",
  );
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO audit_log (id, tenant_id, model_id, jurisdiction, input_hash, output_hash, ts) VALUES (?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(id, evt.tenantId, evt.modelId, evt.jurisdiction, evt.inputHash, evt.outputHash, evt.ts)
    .run();
  return { id };
}

export default {
  async fetch(request: Request, env: ComplianceEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health" || url.pathname === "/_health") {
      let dbOk = true;
      try {
        await env.DB.prepare("SELECT 1").first();
      } catch {
        dbOk = false;
      }
      return applyHeaders(
        Response.json(
          {
            ok: dbOk,
            worker: "gefi-compliance",
            environment: env.ENVIRONMENT,
            region: env.WORKER_REGION,
          },
          { status: dbOk ? 200 : 503 },
        ),
        "api",
        env,
      );
    }

    if (url.pathname === "/audit/append" && request.method === "POST") {
      let body: AuditAppendRequest;
      try {
        body = (await request.json()) as AuditAppendRequest;
      } catch {
        return applyHeaders(
          Response.json({ ok: false, error: "invalid_json" }, { status: 400 }),
          "api",
          env,
        );
      }
      try {
        const result = await appendAudit(env, body);
        return applyHeaders(Response.json({ ok: true, ...result }, { status: 201 }), "api", env);
      } catch (err) {
        console.error("[gefi-compliance] append failed", err);
        return applyHeaders(
          Response.json({ ok: false, error: "storage_failed" }, { status: 502 }),
          "api",
          env,
        );
      }
    }

    return applyHeaders(
      Response.json({ ok: false, error: "not_found" }, { status: 404 }),
      "api",
      env,
    );
  },
} satisfies ExportedHandler<ComplianceEnv>;
