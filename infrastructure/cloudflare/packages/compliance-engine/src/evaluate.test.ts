import { describe, expect, it } from "vitest";
import type { ComplianceEvent } from "@gefi/compliance-rules";
import { evaluate } from "./evaluate.js";

function evt(overrides: Partial<ComplianceEvent>): ComplianceEvent {
  return {
    id: "evt-1",
    kind: "model_listed",
    tenantId: "t-1",
    region: "eu",
    ts: 1_700_000_000,
    severity: "info",
    payload: {},
    ...overrides,
  };
}

describe("evaluate", () => {
  it("returns no triggered rules + null deadline when nothing matches", () => {
    const r = evaluate(evt({ kind: "tenant_onboarded" }));
    expect(r.triggered).toEqual([]);
    expect(r.actions).toEqual([]);
    expect(r.slaDeadlineSec).toBeNull();
  });

  it("MiFID model_listed in EU triggers freeze + disclosure + audit_anchor", () => {
    const r = evaluate(evt({ kind: "model_listed", region: "eu" }));
    const kinds = r.actions.map((a) => a.kind);
    expect(kinds).toContain("freeze_listing");
    expect(kinds).toContain("request_disclosure_form");
    expect(kinds).toContain("audit_anchor");
    // 72h MiFID SLA → deadline = ts + 259200.
    expect(r.slaDeadlineSec).toBe(1_700_000_000 + 72 * 3600);
  });

  it("SEC model_listed in US triggers SEC review with 72h SLA", () => {
    const r = evaluate(evt({ kind: "model_listed", region: "us" }));
    const ids = r.triggered.map((t) => t.rule.id);
    expect(ids).toContain("sec.model-listing-review.v1");
    expect(r.slaDeadlineSec).toBe(1_700_000_000 + 72 * 3600);
  });

  it("data_breach in EU triggers GDPR 72h notification", () => {
    const r = evaluate(
      evt({ kind: "data_breach", region: "eu", severity: "critical" }),
    );
    const action = r.actions.find((a) => a.kind === "notify_regulator");
    expect(action).toBeDefined();
    expect(action?.params?.regulator).toBe("edpb");
    expect(action?.slaHours).toBe(72);
  });

  it("UK data_breach high severity triggers FCA 24h alongside GDPR 72h, deadline=24h", () => {
    const r = evaluate(
      evt({ kind: "data_breach", region: "eu", severity: "high", payload: { uk: true } }),
    );
    const ids = r.triggered.map((t) => t.rule.id);
    expect(ids).toContain("gdpr.breach-notification-72h.v1");
    expect(ids).toContain("fca.breach-st1.v1");
    // Min SLA = 24h
    expect(r.slaDeadlineSec).toBe(1_700_000_000 + 24 * 3600);
  });

  it("actions are de-duplicated across rules", () => {
    const r = evaluate(
      evt({ kind: "data_breach", region: "eu", severity: "high", payload: { uk: true } }),
    );
    const auditAnchorCount = r.actions.filter((a) => a.kind === "audit_anchor").length;
    expect(auditAnchorCount).toBe(1);
  });

  it("action ordering is canonical and stable across calls", () => {
    const a = evaluate(evt({ kind: "model_listed", region: "eu" }));
    const b = evaluate(evt({ kind: "model_listed", region: "eu" }));
    expect(a.actions.map((x) => x.kind)).toEqual(b.actions.map((x) => x.kind));
    // audit_anchor first in canonical order
    expect(a.actions[0]?.kind).toBe("audit_anchor");
  });

  it("CCPA DSAR opens 45-day clock; GDPR DSAR opens 30-day clock", () => {
    const us = evaluate(evt({ kind: "dsar_received", region: "us" }));
    const eu = evaluate(evt({ kind: "dsar_received", region: "eu" }));
    const usClock = us.actions.find((a) => a.kind === "open_dsar_clock");
    const euClock = eu.actions.find((a) => a.kind === "open_dsar_clock");
    expect(usClock?.params?.days).toBe(45);
    expect(euClock?.params?.days).toBe(30);
  });

  it("AUSTRAC SMR is the strictest SLA among AU sanction-hit triggers", () => {
    const r = evaluate(
      evt({
        kind: "sanction_hit",
        region: "us",
        severity: "high",
        payload: { au: true },
      }),
    );
    expect(r.slaDeadlineSec).toBe(1_700_000_000 + 24 * 3600);
  });
});
