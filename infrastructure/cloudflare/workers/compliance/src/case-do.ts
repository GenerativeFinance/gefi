/**
 * `ComplianceCase` Durable Object — owns per-case lifecycle + SLA timer.
 *
 * One DO instance per case (id = caseId). Two routes:
 *
 *   POST /init        — bootstrap the case state from the routing payload
 *                       and arm an `alarm()` for the SLA deadline.
 *
 *   POST /transition  — process an `acknowledge` | `sign` | `close` action.
 *                       Mirrors the new status to D1 so the dashboard stays
 *                       in sync. Cancels the alarm on terminal transitions.
 *
 *   alarm()           — fires once when the SLA deadline passes if no
 *                       reviewer has acknowledged. Marks the case
 *                       `breached` and writes a high-severity audit
 *                       event so the breach itself is anchored.
 */

import { computeEventHash, genesisHash } from "@gefi/compliance-engine";
import type { Jurisdiction, ReviewerRole } from "@gefi/compliance-rules";
import type { ComplianceEnv, Region } from "@gefi/shared-types";
import { fetchPrevChainState, insertAuditEvent } from "./lib/audit-store.js";

interface CaseState {
  caseId: string;
  tenantId: string;
  region: Region;
  jurisdiction: Jurisdiction;
  ruleId: string;
  eventId: string;
  reviewerRole: ReviewerRole;
  slaDeadline: number;
  status: "open" | "acknowledged" | "signed" | "closed" | "breached";
  acknowledgedAt: number | null;
  signedAt: number | null;
  closedAt: number | null;
  signedEnvelopeId: string | null;
}

interface InitBody {
  caseId: string;
  tenantId: string;
  region: Region;
  jurisdiction: Jurisdiction;
  ruleId: string;
  eventId: string;
  reviewerRole: ReviewerRole;
  slaDeadline: number;
}

interface TransitionBody {
  caseId: string;
  action: "acknowledge" | "sign" | "close";
  envelopeId?: string;
}

export class ComplianceCase {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: ComplianceEnv,
  ) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/init" && request.method === "POST") {
      return this.handleInit(request);
    }
    if (url.pathname === "/transition" && request.method === "POST") {
      return this.handleTransition(request);
    }
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  private async loadState(): Promise<CaseState | null> {
    return (await this.state.storage.get<CaseState>("state")) ?? null;
  }

  private async saveState(s: CaseState): Promise<void> {
    await this.state.storage.put("state", s);
  }

  private async handleInit(request: Request): Promise<Response> {
    const body = (await request.json()) as InitBody;
    const existing = await this.loadState();
    if (existing) {
      return Response.json({ ok: true, state: existing, idempotent: true });
    }
    const next: CaseState = {
      caseId: body.caseId,
      tenantId: body.tenantId,
      region: body.region,
      jurisdiction: body.jurisdiction,
      ruleId: body.ruleId,
      eventId: body.eventId,
      reviewerRole: body.reviewerRole,
      slaDeadline: body.slaDeadline,
      status: "open",
      acknowledgedAt: null,
      signedAt: null,
      closedAt: null,
      signedEnvelopeId: null,
    };
    await this.saveState(next);
    // Arm the SLA alarm. Durable Object alarms are wall-clock ms.
    await this.state.storage.setAlarm(next.slaDeadline * 1000);
    return Response.json({ ok: true, state: next });
  }

  private async handleTransition(request: Request): Promise<Response> {
    const body = (await request.json()) as TransitionBody;
    const state = await this.loadState();
    if (!state) {
      return Response.json({ ok: false, error: "case_not_initialised" }, { status: 404 });
    }
    if (state.status === "closed" || state.status === "breached") {
      return Response.json({ ok: false, error: "case_terminal", status: state.status }, { status: 409 });
    }
    const now = Math.floor(Date.now() / 1000);

    switch (body.action) {
      case "acknowledge":
        if (state.status !== "open") {
          return Response.json({ ok: false, error: "invalid_transition" }, { status: 409 });
        }
        state.status = "acknowledged";
        state.acknowledgedAt = now;
        break;
      case "sign":
        if (state.status !== "acknowledged" && state.status !== "open") {
          return Response.json({ ok: false, error: "invalid_transition" }, { status: 409 });
        }
        state.status = "signed";
        state.signedAt = now;
        state.signedEnvelopeId = body.envelopeId ?? state.signedEnvelopeId;
        break;
      case "close":
        state.status = "closed";
        state.closedAt = now;
        await this.state.storage.deleteAlarm();
        break;
      default:
        return Response.json({ ok: false, error: "unknown_action" }, { status: 400 });
    }

    await this.saveState(state);
    await this.mirrorToD1(state);
    return Response.json({ ok: true, state });
  }

  /** alarm() fires when the SLA deadline passes with no terminal action. */
  async alarm(): Promise<void> {
    const state = await this.loadState();
    if (!state) return;
    if (state.status === "closed" || state.status === "signed" || state.status === "breached") {
      return;
    }
    state.status = "breached";
    await this.saveState(state);
    await this.mirrorToD1(state);
    await this.appendBreachAudit(state);
  }

  private async mirrorToD1(s: CaseState): Promise<void> {
    await this.env.DB.prepare(
      `UPDATE compliance_cases
          SET status = ?, acknowledged_at = ?, signed_at = ?, closed_at = ?, signed_envelope_id = ?
        WHERE id = ?`,
    )
      .bind(s.status, s.acknowledgedAt, s.signedAt, s.closedAt, s.signedEnvelopeId, s.caseId)
      .run();
  }

  private async appendBreachAudit(s: CaseState): Promise<void> {
    const ts = Math.floor(Date.now() / 1000);
    const id = crypto.randomUUID();
    const payload: Record<string, unknown> = {
      kind: "case_status_changed",
      caseId: s.caseId,
      tenantId: s.tenantId,
      ruleId: s.ruleId,
      jurisdiction: s.jurisdiction,
      previousStatus: "open",
      nextStatus: "breached",
      slaDeadline: s.slaDeadline,
      ts,
    };
    const prev = await fetchPrevChainState(this.env.DB, s.region);
    const prevHash = prev?.lastHash ?? genesisHash();
    const eventHash = await computeEventHash(prevHash, payload);
    const chainIndex = (prev?.lastChainIndex ?? -1) + 1;
    try {
      await insertAuditEvent(this.env.DB, {
        id,
        tenantId: s.tenantId,
        userId: null,
        region: s.region,
        kind: "case_status_changed",
        severity: "high",
        payload,
        prevHash,
        eventHash,
        chainIndex,
        createdAt: ts,
      });
    } catch (err) {
      console.error("[ComplianceCase] failed to append breach audit", err);
    }
  }
}
