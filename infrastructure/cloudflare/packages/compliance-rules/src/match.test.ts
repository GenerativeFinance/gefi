import { describe, expect, it } from "vitest";
import type { ComplianceEvent } from "./types.js";
import { findRules, ruleMatches, severityRank } from "./match.js";
import { RULES } from "./rules/index.js";

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

describe("severityRank", () => {
  it("orders severities ascending", () => {
    expect(severityRank("info")).toBeLessThan(severityRank("warn"));
    expect(severityRank("warn")).toBeLessThan(severityRank("high"));
    expect(severityRank("high")).toBeLessThan(severityRank("critical"));
  });
});

describe("ruleMatches", () => {
  it("undefined match accepts everything", () => {
    expect(ruleMatches(evt({}), undefined)).toBe(true);
  });

  it("rejects below minSeverity", () => {
    expect(ruleMatches(evt({ severity: "warn" }), { minSeverity: "high" })).toBe(false);
  });

  it("accepts at minSeverity", () => {
    expect(ruleMatches(evt({ severity: "high" }), { minSeverity: "high" })).toBe(true);
  });

  it("rejects mismatched entityType", () => {
    const e = evt({ payload: { entityType: "retail" } });
    expect(ruleMatches(e, { entityType: "institutional" })).toBe(false);
  });

  it("matches one entityType in a list", () => {
    const e = evt({ payload: { entityType: "institutional" } });
    expect(ruleMatches(e, { entityType: ["retail", "institutional"] })).toBe(true);
  });

  it("rejects when payload key missing", () => {
    expect(ruleMatches(evt({ payload: {} }), { payload: { uk: true } })).toBe(false);
  });

  it("matches payload equality", () => {
    expect(ruleMatches(evt({ payload: { uk: true } }), { payload: { uk: true } })).toBe(true);
  });
});

describe("findRules", () => {
  it("EU model_listed fires MiFID II disclosure", () => {
    const rules = findRules(evt({ kind: "model_listed", region: "eu" }));
    expect(rules.find((r) => r.id === "mifid-ii.model-listing-disclosure.v1")).toBeDefined();
  });

  it("US model_listed fires SEC review (and not MiFID)", () => {
    const rules = findRules(evt({ kind: "model_listed", region: "us" }));
    expect(rules.find((r) => r.id === "sec.model-listing-review.v1")).toBeDefined();
    expect(rules.find((r) => r.jurisdiction === "mifid-ii")).toBeUndefined();
  });

  it("EU data_breach fires GDPR 72h notification", () => {
    const rules = findRules(
      evt({ kind: "data_breach", region: "eu", severity: "critical" }),
    );
    expect(rules.find((r) => r.id === "gdpr.breach-notification-72h.v1")).toBeDefined();
  });

  it("CCPA DSAR opens 45-day clock", () => {
    const rules = findRules(evt({ kind: "dsar_received", region: "us" }));
    const r = rules.find((r) => r.id === "ccpa.dsar-45d.v1");
    expect(r).toBeDefined();
    expect(r?.requires.actions.find((a) => a.kind === "open_dsar_clock")?.params?.days).toBe(45);
  });

  it("AUSTRAC SMR triggers within 24h on AU sanction hit", () => {
    const rules = findRules(
      evt({
        kind: "sanction_hit",
        region: "us",
        severity: "high",
        payload: { au: true },
      }),
    );
    const r = rules.find((r) => r.id === "austrac.smr-24h.v1");
    expect(r).toBeDefined();
    expect(r?.requires.slaHours).toBe(24);
  });

  it("MAS cyber-incident fires within 1 hour", () => {
    const rules = findRules(
      evt({
        kind: "data_breach",
        region: "us",
        severity: "high",
        payload: { sg: true },
      }),
    );
    const r = rules.find((r) => r.id === "mas.cyber-incident-1h.v1");
    expect(r).toBeDefined();
    expect(r?.requires.slaHours).toBe(1);
  });

  it("rule order is deterministic across calls", () => {
    const a = findRules(evt({ kind: "data_breach", region: "eu", severity: "high", payload: { uk: true } }));
    const b = findRules(evt({ kind: "data_breach", region: "eu", severity: "high", payload: { uk: true } }));
    expect(a.map((r) => r.id)).toEqual(b.map((r) => r.id));
  });

  it("RULES contains rules for all 11 jurisdictions", () => {
    const seen = new Set(RULES.map((r) => r.jurisdiction));
    expect(seen.size).toBe(11);
  });

  it("every rule id is unique", () => {
    const ids = RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
