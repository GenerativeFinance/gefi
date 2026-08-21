import { describe, expect, it } from "vitest";
import type { Jurisdiction, ReviewerRole, TriggeredRule } from "@gefi/compliance-rules";
import { evaluate } from "./evaluate.js";
import { StubAnchor } from "./anchor.js";
import { StubDocuSign } from "./docusign.js";
import { StubMailer } from "./mailer.js";
import { pickDefaultLawyer, type LawyerSeed } from "./directory.js";
import {
  routeEvent,
  type CaseActionInsert,
  type CaseInsert,
  type RoutingDb,
} from "./routing.js";

class MemoryDb implements RoutingDb {
  cases: CaseInsert[] = [];
  actions: CaseActionInsert[] = [];
  async insertCase(c: CaseInsert) { this.cases.push(c); }
  async insertCaseAction(a: CaseActionInsert) { this.actions.push(a); }
  async resolveAssignee(_t: string, jurisdiction: Jurisdiction, role: ReviewerRole): Promise<LawyerSeed | null> {
    return pickDefaultLawyer(jurisdiction, role) ?? null;
  }
}

describe("routeEvent", () => {
  it("routes a MiFID model-listing event end-to-end via stubs", async () => {
    const db = new MemoryDb();
    const mailer = new StubMailer();
    const docusign = new StubDocuSign();
    const anchor = new StubAnchor();

    const evaluation = evaluate({
      id: "evt-mi-1",
      kind: "model_listed",
      tenantId: "tenant-eu",
      region: "eu",
      ts: 1_700_000_000,
      severity: "info",
      payload: {},
    });
    expect(evaluation.triggered.length).toBe(1);

    const result = await routeEvent(
      {
        eventId: "evt-mi-1",
        tenantId: "tenant-eu",
        region: "eu",
        ts: 1_700_000_000,
        triggered: evaluation.triggered as readonly TriggeredRule[],
      },
      { db, mailer, docusign, anchor },
    );

    expect(result.errors).toEqual([]);
    expect(result.caseIds.length).toBe(1);
    expect(result.emailsSent).toBe(1);
    expect(mailer.sent[0]?.to).toBe("compliance+mifid@gefi.io");
    expect(mailer.sent[0]?.headers?.["X-Gefi-Tenant-Id"]).toBe("tenant-eu");
    expect(db.cases[0]?.jurisdiction).toBe("mifid-ii");
    expect(db.cases[0]?.slaDeadline).toBe(1_700_000_000 + 72 * 3600);
    expect(db.actions.find((a) => a.kind === "rule_triggered")).toBeDefined();
    expect(db.actions.find((a) => a.kind === "route_to_reviewer")?.status).toBe("succeeded");
  });

  it("routes a GDPR data_breach to privacy counsel + 72h regulator notify", async () => {
    const db = new MemoryDb();
    const mailer = new StubMailer();
    const docusign = new StubDocuSign();

    const evaluation = evaluate({
      id: "evt-gd-1",
      kind: "data_breach",
      tenantId: "tenant-eu",
      region: "eu",
      ts: 1_700_000_000,
      severity: "critical",
      payload: {},
    });

    const result = await routeEvent(
      {
        eventId: "evt-gd-1",
        tenantId: "tenant-eu",
        region: "eu",
        ts: 1_700_000_000,
        triggered: evaluation.triggered as readonly TriggeredRule[],
      },
      { db, mailer, docusign },
    );

    expect(result.errors).toEqual([]);
    expect(mailer.sent[0]?.to).toBe("privacy+gdpr@gefi.io");
    // GDPR rule contains a request_docusign action.
    expect(result.envelopesCreated).toBe(1);
    expect(docusign.envelopes[0]?.templateId).toBe("gdpr-72h-attestation");
  });

  it("opens one case per triggered rule when multiple jurisdictions match", async () => {
    const db = new MemoryDb();
    const mailer = new StubMailer();
    const docusign = new StubDocuSign();

    const evaluation = evaluate({
      id: "evt-uk-1",
      kind: "data_breach",
      tenantId: "tenant-uk",
      region: "eu",
      ts: 1_700_000_000,
      severity: "high",
      payload: { uk: true },
    });

    const result = await routeEvent(
      {
        eventId: "evt-uk-1",
        tenantId: "tenant-uk",
        region: "eu",
        ts: 1_700_000_000,
        triggered: evaluation.triggered as readonly TriggeredRule[],
      },
      { db, mailer, docusign },
    );

    // GDPR + FCA both fire.
    expect(result.caseIds.length).toBe(2);
    const juris = db.cases.map((c) => c.jurisdiction).sort();
    expect(juris).toEqual(["fca", "gdpr"]);
  });

  it("records a failed action when the mailer throws", async () => {
    const broken = {
      async send() {
        throw new Error("smtp_down");
      },
    };
    const db = new MemoryDb();
    const mailer = broken;
    const docusign = new StubDocuSign();
    const evaluation = evaluate({
      id: "evt-x", kind: "model_listed", tenantId: "t", region: "us", ts: 1_700_000_000, severity: "info", payload: {},
    });
    const result = await routeEvent(
      { eventId: "evt-x", tenantId: "t", region: "us", ts: 1_700_000_000, triggered: evaluation.triggered as readonly TriggeredRule[] },
      { db, mailer, docusign },
    );
    expect(result.errors.length).toBeGreaterThan(0);
    const failed = db.actions.find((a) => a.kind === "route_to_reviewer");
    expect(failed?.status).toBe("failed");
  });
});
