/**
 * Compliance-case dashboards endpoints. The Durable Object owns the live
 * SLA timer; D1 is the queryable mirror.
 *
 *   GET   /cases?tenant_id=…&status=…   list cases
 *   GET   /cases/:id                    case detail (D1 mirror + DO state)
 *   PATCH /cases/:id                    ack / sign / close (delegated to DO)
 */

import type { Handler } from "../router.js";

export const casesListHandler: Handler = async ({ env, request }) => {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get("tenant_id");
  const status = url.searchParams.get("status");

  const clauses: string[] = [];
  const binds: (string | number)[] = [];
  if (tenantId) {
    clauses.push("tenant_id = ?");
    binds.push(tenantId);
  }
  if (status) {
    clauses.push("status = ?");
    binds.push(status);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const res = await env.DB.prepare(
    `SELECT id, tenant_id AS tenantId, region, jurisdiction, rule_id AS ruleId,
            event_id AS eventId, reviewer_role AS reviewerRole, reviewer_id AS reviewerId,
            status, sla_deadline AS slaDeadline, created_at AS createdAt,
            acknowledged_at AS acknowledgedAt, signed_at AS signedAt, closed_at AS closedAt
       FROM compliance_cases
       ${where}
   ORDER BY created_at DESC
      LIMIT 200`,
  )
    .bind(...binds)
    .all();
  return Response.json({ ok: true, cases: res.results });
};

export const casesGetHandler: Handler = async ({ env, params }) => {
  const id = params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });

  const row = await env.DB.prepare(
    `SELECT id, tenant_id AS tenantId, region, jurisdiction, rule_id AS ruleId,
            event_id AS eventId, reviewer_role AS reviewerRole, reviewer_id AS reviewerId,
            status, sla_deadline AS slaDeadline, signed_envelope_id AS signedEnvelopeId,
            created_at AS createdAt, acknowledged_at AS acknowledgedAt,
            signed_at AS signedAt, closed_at AS closedAt
       FROM compliance_cases WHERE id = ?`,
  )
    .bind(id)
    .first();
  if (!row) return Response.json({ ok: false, error: "case_not_found" }, { status: 404 });

  const actions = await env.DB.prepare(
    `SELECT id, kind, status, payload_json AS payloadJson, result_json AS resultJson,
            created_at AS createdAt, completed_at AS completedAt
       FROM case_actions WHERE case_id = ? ORDER BY created_at ASC`,
  )
    .bind(id)
    .all();

  return Response.json({ ok: true, case: row, actions: actions.results });
};

interface PatchBody {
  action: "acknowledge" | "sign" | "close";
  envelopeId?: string;
}

export const casesPatchHandler: Handler = async ({ env, params, request }) => {
  const id = params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body.action) {
    return Response.json({ ok: false, error: "action_required" }, { status: 400 });
  }

  const doId = env.CASE_DO.idFromName(id);
  const stub = env.CASE_DO.get(doId);
  const res = await stub.fetch("https://case.internal/transition", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ caseId: id, ...body }),
  });
  const json = await res.json();
  return Response.json(json, { status: res.status });
};
