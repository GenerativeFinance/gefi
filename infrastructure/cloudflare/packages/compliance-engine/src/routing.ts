/**
 * Routing service: composes the individual provider abstractions into the
 * end-to-end "rule fired → case opened → reviewer notified" pipeline.
 *
 * Pure orchestration; the real I/O is delegated to the injected providers.
 * Tests pass `StubMailer` / `StubAnchor` / `StubDocuSign` instances and a
 * tiny in-memory D1 adapter to assert wiring without touching the network.
 */

import type { Jurisdiction, RequiredAction, ReviewerRole, TriggeredRule } from "@gefi/compliance-rules";
import { JURISDICTION_LABEL } from "@gefi/compliance-rules";
import type { Region } from "@gefi/shared-types";
import type { Anchor } from "./anchor.js";
import type { DocuSign } from "./docusign.js";
import type { Mailer } from "./mailer.js";
import { pickDefaultLawyer, type LawyerSeed } from "./directory.js";

/** Minimal D1 surface the routing service needs. Lets us inject an in-memory adapter in tests. */
export interface RoutingDb {
  /** Insert a new compliance case. */
  insertCase(input: CaseInsert): Promise<void>;
  /** Insert a per-case action log row. */
  insertCaseAction(input: CaseActionInsert): Promise<void>;
  /** Lookup the assigned lawyer for (tenant, jurisdiction, role); falls back to the seed default. */
  resolveAssignee(tenantId: string, jurisdiction: Jurisdiction, role: ReviewerRole): Promise<LawyerSeed | null>;
}

export interface CaseInsert {
  id: string;
  tenantId: string;
  region: Region;
  jurisdiction: Jurisdiction;
  ruleId: string;
  eventId: string;
  reviewerRole: ReviewerRole;
  reviewerId: string | null;
  slaDeadline: number;
  createdAt: number;
}

export interface CaseActionInsert {
  id: string;
  caseId: string;
  kind: string;
  status: "pending" | "succeeded" | "failed";
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  createdAt: number;
  completedAt?: number;
}

export interface RoutingInput {
  /** The fired event's id (= audit chain id once anchored). */
  eventId: string;
  tenantId: string;
  region: Region;
  ts: number;
  triggered: readonly TriggeredRule[];
}

export interface RoutingResult {
  caseIds: string[];
  emailsSent: number;
  envelopesCreated: number;
  errors: string[];
}

/**
 * Run the routing pipeline for a single event. One ComplianceCase is opened
 * per triggered rule (so each regulator/auditor gets its own ticket).
 *
 * The orchestration is sequential per-case but the per-case steps tolerate
 * partial failure — if the mailer call throws we still record the case in
 * D1 and surface the error in `errors[]` so the caller can retry.
 */
export async function routeEvent(
  input: RoutingInput,
  deps: { db: RoutingDb; mailer: Mailer; docusign: DocuSign; anchor?: Anchor },
): Promise<RoutingResult> {
  const out: RoutingResult = { caseIds: [], emailsSent: 0, envelopesCreated: 0, errors: [] };

  for (const tr of input.triggered) {
    const rule = tr.rule;
    const slaSec = input.ts + rule.requires.slaHours * 3600;
    const lawyer = await deps.db.resolveAssignee(input.tenantId, rule.jurisdiction, rule.reviewer);
    const caseId = crypto.randomUUID();

    await deps.db.insertCase({
      id: caseId,
      tenantId: input.tenantId,
      region: input.region,
      jurisdiction: rule.jurisdiction,
      ruleId: rule.id,
      eventId: input.eventId,
      reviewerRole: rule.reviewer,
      reviewerId: lawyer?.id ?? null,
      slaDeadline: slaSec,
      createdAt: input.ts,
    });
    out.caseIds.push(caseId);

    // Record the rule-trigger itself as a case action for traceability.
    await deps.db.insertCaseAction({
      id: crypto.randomUUID(),
      caseId,
      kind: "rule_triggered",
      status: "succeeded",
      payload: { ruleId: rule.id, version: rule.version, statute: rule.statute },
      createdAt: input.ts,
      completedAt: input.ts,
    });

    // Walk the rule's actions in canonical order.
    for (const action of tr.actions) {
      if (action.kind === "audit_anchor") continue; // Already done by the audit writer.
      try {
        const result = await runAction({ action, caseId, lawyer, rule, input }, deps);
        if (result?.kind === "email_sent") out.emailsSent += 1;
        if (result?.kind === "envelope_created") out.envelopesCreated += 1;
        await deps.db.insertCaseAction({
          id: crypto.randomUUID(),
          caseId,
          kind: action.kind,
          status: "succeeded",
          payload: { params: action.params ?? {} },
          result: result?.result ?? {},
          createdAt: input.ts,
          completedAt: input.ts,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        out.errors.push(`${rule.id}/${action.kind}: ${msg}`);
        await deps.db.insertCaseAction({
          id: crypto.randomUUID(),
          caseId,
          kind: action.kind,
          status: "failed",
          payload: { params: action.params ?? {} },
          result: { error: msg },
          createdAt: input.ts,
          completedAt: input.ts,
        });
      }
    }
  }
  return out;
}

interface ActionContext {
  action: RequiredAction;
  caseId: string;
  lawyer: LawyerSeed | null;
  rule: TriggeredRule["rule"];
  input: RoutingInput;
}

async function runAction(
  ctx: ActionContext,
  deps: { mailer: Mailer; docusign: DocuSign },
): Promise<{ kind: "email_sent" | "envelope_created" | "noop"; result: Record<string, unknown> } | null> {
  const { action, caseId, lawyer, rule, input } = ctx;
  switch (action.kind) {
    case "route_to_reviewer": {
      const target = lawyer?.email ?? fallbackEmail(rule.jurisdiction, rule.reviewer);
      const sent = await deps.mailer.send({
        to: target,
        pgpFingerprint: lawyer?.pgpFingerprint,
        subject: `[GeFi Compliance] ${rule.id} — case ${caseId.slice(0, 8)}`,
        body: routingEmailBody({ rule, caseId, lawyer, input }),
        headers: {
          "X-Gefi-Case-Id": caseId,
          "X-Gefi-Rule-Id": rule.id,
          "X-Gefi-Tenant-Id": input.tenantId,
        },
      });
      return { kind: "email_sent", result: { messageId: sent.messageId, delivered: sent.delivered } };
    }
    case "request_docusign": {
      const envelope = await deps.docusign.createEnvelope({
        caseId,
        recipientEmail: lawyer?.email ?? fallbackEmail(rule.jurisdiction, rule.reviewer),
        recipientName: lawyer?.displayName ?? "GeFi Compliance",
        templateId: String(action.params?.template ?? "default-template"),
        fields: { caseId, ruleId: rule.id, tenantId: input.tenantId },
      });
      return {
        kind: "envelope_created",
        result: { envelopeId: envelope.envelopeId, status: envelope.status, signingUrl: envelope.signingUrl ?? "" },
      };
    }
    case "request_disclosure_form":
    case "freeze_listing":
    case "open_dsar_clock":
    case "block_cross_border":
    case "notify_regulator":
    case "create_case":
      // These are recorded as case actions but have no synchronous side
      // effect from the routing service's point of view — downstream
      // consumers (gefi-api handlers, dashboards) read the case actions
      // and react.
      return { kind: "noop", result: {} };
    case "audit_anchor":
      return { kind: "noop", result: {} };
  }
}

function fallbackEmail(jurisdiction: Jurisdiction, role: ReviewerRole): string {
  const seed = pickDefaultLawyer(jurisdiction, role);
  return seed?.email ?? `compliance+${jurisdiction}@gefi.io`;
}

function routingEmailBody(args: {
  rule: TriggeredRule["rule"];
  caseId: string;
  lawyer: LawyerSeed | null;
  input: RoutingInput;
}): string {
  const reg = JURISDICTION_LABEL[args.rule.jurisdiction];
  const lines = [
    `A compliance event has been routed to you for review.`,
    ``,
    `Rule:        ${args.rule.id} (v${args.rule.version})`,
    `Jurisdiction: ${reg}`,
    `Statute:     ${args.rule.statute}`,
    `Tenant:      ${args.input.tenantId}`,
    `Region:      ${args.input.region}`,
    `Event:       ${args.input.eventId}`,
    `Case:        ${args.caseId}`,
    `SLA:         ${args.rule.requires.slaHours} hours`,
    ``,
    `Reviewer:    ${args.lawyer?.displayName ?? "(unassigned — falling back to seed)"}`,
    ``,
    `This message is delivered by the GeFi Compliance Engine. Sign off`,
    `via the linked DocuSign envelope, or by responding to this thread.`,
  ];
  return lines.join("\n");
}
