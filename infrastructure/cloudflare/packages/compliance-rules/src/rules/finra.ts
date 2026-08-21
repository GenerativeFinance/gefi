/**
 * Financial Industry Regulatory Authority rules.
 *
 * FINRA Rule 3310 (AML programme) drives our subscription_created flow for
 * institutional accounts; Rule 4530 governs reporting of disciplinary or
 * compliance-impacting events.
 */

import type { ComplianceRule } from "../types.js";

export const FINRA_RULES: ComplianceRule[] = [
  {
    id: "finra.institutional-subscription-aml.v1",
    version: 1,
    jurisdiction: "finra",
    appliesTo: { regions: ["us"] },
    trigger: {
      eventKind: "subscription_created",
      match: { entityType: "institutional" },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 48, params: { template: "finra-aml-review" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 48,
    },
    reviewer: "aml_officer",
    statute: "FINRA Rule 3310 (Anti-Money Laundering Compliance Program)",
    rationale: "Institutional onboarding triggers AML review independent of automated KYC.",
  },
  {
    id: "finra.reportable-event.v1",
    version: 1,
    jurisdiction: "finra",
    appliesTo: { regions: ["us"] },
    trigger: {
      eventKind: "sanction_hit",
      match: { minSeverity: "high" },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 72, params: { template: "finra-4530" } },
        { kind: "notify_regulator", params: { regulator: "finra", form: "4530" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 72,
    },
    reviewer: "regulator_liaison",
    statute: "FINRA Rule 4530 (Reporting Requirements)",
    rationale: "Sanctioned-party hits qualify as 4530-reportable events.",
  },
];
