/**
 * AUSTRAC — Australian Transaction Reports and Analysis Centre.
 *
 * Subpoenas + cross-border movements of value trigger immediate reporting.
 * Suspicious Matter Reports under § 41 of the AML/CTF Act 2006 are due
 * within 24 hours of a high-severity sanction hit.
 */

import type { ComplianceRule } from "../types.js";

export const AUSTRAC_RULES: ComplianceRule[] = [
  {
    id: "austrac.subpoena.v1",
    version: 1,
    jurisdiction: "austrac",
    appliesTo: { regions: ["us"] },
    trigger: {
      eventKind: "subpoena_received",
      match: { payload: { au: true } },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 24, params: { template: "austrac-subpoena" } },
        { kind: "request_docusign", params: { template: "austrac-subpoena-ack" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 24,
    },
    reviewer: "regulator_liaison",
    statute: "Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth) § 49",
    rationale: "AUSTRAC subpoena/notice acknowledgements within 24 hours.",
  },
  {
    id: "austrac.smr-24h.v1",
    version: 1,
    jurisdiction: "austrac",
    appliesTo: { regions: ["us"] },
    trigger: {
      eventKind: "sanction_hit",
      match: { payload: { au: true }, minSeverity: "high" },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 24, params: { template: "austrac-smr" } },
        { kind: "notify_regulator", slaHours: 24, params: { regulator: "austrac", form: "SMR" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 24,
    },
    reviewer: "aml_officer",
    statute: "AML/CTF Act 2006 (Cth) § 41 (Suspicious Matter Reports)",
    rationale: "Suspicious-matter reports to AUSTRAC are due within 24 hours of a high-severity sanction hit.",
  },
];
