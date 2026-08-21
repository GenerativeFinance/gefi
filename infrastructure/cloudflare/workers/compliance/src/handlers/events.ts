/**
 * `POST /events` — receive a platform event from `gefi-api`, evaluate it
 * against the rule book, append a hash-chained audit row, and route any
 * triggered cases to lawyers/auditors.
 *
 * The audit append is *unconditional* — every event lands in the chain
 * even if no rules fire. This guarantees an external auditor can prove
 * every event the platform ever generated for a given tenant.
 *
 * Routing is best-effort and idempotent: a double-fire of the same event
 * id is detected via the `audit_events` UNIQUE(event_hash) constraint and
 * we return 200 with `duplicate: true` so callers can safely retry.
 *
 * Special handling for `tenant_onboarded`:
 *   After the audit row is written, `seedTenantAssignments` populates
 *   `tenant_assignments` so the new tenant's cases are immediately routable
 *   without a manual setup step.
 */

import {
  computeEventHash,
  evaluate,
  genesisHash,
  resolveDocuSign,
  resolveMailer,
  routeEvent,
} from "@gefi/compliance-engine";
import type { ComplianceEvent, Jurisdiction, ReviewerRole } from "@gefi/compliance-rules";
import type { ComplianceEventKind, ComplianceSeverity, Region } from "@gefi/shared-types";
import { d1RoutingDb, fetchPrevChainState, insertAuditEvent, seedTenantAssignments } from "../lib/audit-store.js";
import type { Handler } from "../router.js";

interface IncomingEvent {
  id?: string;
  kind: ComplianceEventKind;
  tenantId: string;
  userId?: string;
  region: Region;
  ts?: number;
  severity?: ComplianceSeverity;
  payload?: Record<string, string | number | boolean>;
}

export const eventsHandler: Handler = async ({ env, request }) => {
  let body: IncomingEvent;
  try {
    body = (await request.json()) as IncomingEvent;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || !body.kind || !body.tenantId || !body.region) {
    return Response.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
  }

  const event: ComplianceEvent = {
    id: body.id ?? crypto.randomUUID(),
    kind: body.kind,
    tenantId: body.tenantId,
    userId: body.userId,
    region: body.region,
    ts: body.ts ?? Math.floor(Date.now() / 1000),
    severity: body.severity ?? "info",
    payload: body.payload ?? {},
  };

  // 1) Evaluate rules.
  const evaluation = evaluate(event);

  // 2) Append to the hash chain. Audit append is the single source of
  //    cryptographic truth — if it fails, we MUST NOT route further.
  const prev = await fetchPrevChainState(env.DB, event.region);
  const auditPayload = {
    eventId: event.id,
    kind: event.kind,
    tenantId: event.tenantId,
    userId: event.userId ?? null,
    region: event.region,
    ts: event.ts,
    severity: event.severity,
    payload: event.payload,
    triggeredRuleIds: evaluation.triggered.map((t) => t.rule.id),
    actionKinds: evaluation.actions.map((a) => a.kind),
  };
  const prevHash = prev?.lastHash ?? genesisHash();
  const eventHash = await computeEventHash(prevHash, auditPayload);
  const chainIndex = (prev?.lastChainIndex ?? -1) + 1;
  let appended = false;
  try {
    appended = await insertAuditEvent(env.DB, {
      id: event.id,
      tenantId: event.tenantId,
      userId: event.userId ?? null,
      region: event.region,
      kind: event.kind,
      severity: event.severity,
      payload: auditPayload,
      prevHash,
      eventHash,
      chainIndex,
      createdAt: event.ts,
    });
  } catch (err) {
    console.error("[gefi-compliance] audit append failed", err);
    return Response.json({ ok: false, error: "audit_append_failed" }, { status: 502 });
  }

  if (!appended) {
    // Duplicate event_hash → idempotent re-fire.
    return Response.json({
      ok: true,
      duplicate: true,
      eventId: event.id,
      eventHash,
    });
  }

  // 3) For `tenant_onboarded` — seed default tenant assignments so the
  //    new tenant is immediately routable. Errors here are non-fatal;
  //    the audit row is already committed.
  if (event.kind === "tenant_onboarded") {
    try {
      await seedTenantAssignments(env.DB, event.tenantId, event.region);
    } catch (err) {
      console.error("[gefi-compliance] seedTenantAssignments failed", err);
    }
  }

  // 4) Route triggered cases. Errors here are non-fatal — they are
  //    surfaced in the response so the caller can retry the routing
  //    layer without re-appending the audit row.
  const mailer = resolveMailer(env);
  const docusign = resolveDocuSign(env);
  const routing = await routeEvent(
    {
      eventId: event.id,
      tenantId: event.tenantId,
      region: event.region,
      ts: event.ts,
      triggered: evaluation.triggered,
    },
    { db: d1RoutingDb(env.DB), mailer, docusign },
  );

  // 5) Hand each opened case to its Durable Object so the SLA timer is
  //    armed via DO `alarm()`. The DO is the source of truth for the
  //    actively-ticking timer; the D1 row is the dashboard mirror.
  for (let i = 0; i < routing.caseIds.length; i++) {
    const caseId = routing.caseIds[i];
    const triggered = evaluation.triggered[i];
    if (!caseId || !triggered) continue;
    const id = env.CASE_DO.idFromName(caseId);
    const stub = env.CASE_DO.get(id);
    await stub.fetch("https://case.internal/init", {
      method: "POST",
      body: JSON.stringify({
        caseId,
        tenantId: event.tenantId,
        region: event.region,
        jurisdiction: triggered.rule.jurisdiction,
        ruleId: triggered.rule.id,
        eventId: event.id,
        slaDeadline: event.ts + triggered.rule.requires.slaHours * 3600,
        reviewerRole: triggered.rule.reviewer,
      }),
      headers: { "content-type": "application/json" },
    });
  }

  return Response.json({
    ok: true,
    eventId: event.id,
    eventHash,
    chainIndex,
    triggered: evaluation.triggered.map((t) => ({
      ruleId: t.rule.id,
      jurisdiction: t.rule.jurisdiction as Jurisdiction,
      reviewer: t.rule.reviewer as ReviewerRole,
      slaHours: t.rule.requires.slaHours,
    })),
    actions: evaluation.actions.map((a) => ({ kind: a.kind, slaHours: a.slaHours ?? null, params: a.params ?? null })),
    slaDeadlineSec: evaluation.slaDeadlineSec,
    cases: routing.caseIds,
    emailsSent: routing.emailsSent,
    envelopesCreated: routing.envelopesCreated,
    routingErrors: routing.errors,
  });
};
