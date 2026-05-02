/**
 * Financial Conduct Authority (UK).
 *
 * Post-Brexit the UK enforces an onshored MiFID-equivalent regime; we layer
 * FCA rules on top of MiFID II for tenants whose payload identifies a UK
 * connection.
 */

import type { ComplianceRule } from "../types.js";

export const FCA_RULES: ComplianceRule[] = [
  {
    id: "fca.consumer-duty-listing.v1",
    version: 1,
    jurisdiction: "fca",
    appliesTo: { regions: ["eu"] },
    trigger: {
      eventKind: "model_listed",
      match: { payload: { uk: true } },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "request_disclosure_form", params: { form: "FCA-Consumer-Duty" } },
        { kind: "route_to_reviewer", slaHours: 72, params: { template: "fca-listing" } },
        { kind: "freeze_listing" },
        { kind: "audit_anchor" },
      ],
      slaHours: 72,
    },
    reviewer: "securities_counsel",
    statute: "FCA Handbook PRIN 2A (Consumer Duty); SYSC 6.1 (Compliance)",
    rationale: "FCA Consumer Duty requires good outcomes evidenced before listing.",
  },
  {
    id: "fca.breach-st1.v1",
    version: 1,
    jurisdiction: "fca",
    appliesTo: { regions: ["eu"] },
    trigger: {
      eventKind: "data_breach",
      match: { payload: { uk: true }, minSeverity: "high" },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 24, params: { template: "fca-breach" } },
        { kind: "notify_regulator", params: { regulator: "fca", form: "ST1" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 24,
    },
    reviewer: "regulator_liaison",
    statute: "FCA Handbook SUP 15.3 (Notifications to the FCA)",
    rationale: "Material operational/security incidents must be notified to the FCA without delay.",
  },
];
