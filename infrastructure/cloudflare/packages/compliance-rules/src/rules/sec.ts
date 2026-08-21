/**
 * U.S. Securities and Exchange Commission rules.
 *
 * Rules covered:
 *  - 17 CFR § 230.501–.508 (Reg D) for accredited-investor offerings — every
 *    `model_listed` event in the US data plane requires SEC review.
 *  - 17 CFR § 240.17a-4 record-retention — auditing the retention chain on
 *    every subpoena.
 */

import type { ComplianceRule } from "../types.js";

export const SEC_RULES: ComplianceRule[] = [
  {
    id: "sec.model-listing-review.v1",
    version: 1,
    jurisdiction: "sec",
    appliesTo: { regions: ["us"] },
    trigger: { eventKind: "model_listed" },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 72, params: { template: "sec-model-listing" } },
        { kind: "request_disclosure_form", params: { form: "Form-CRS-extract" } },
        { kind: "freeze_listing" },
        { kind: "audit_anchor" },
      ],
      slaHours: 72,
    },
    reviewer: "securities_counsel",
    statute: "17 CFR § 230.501–.508 (Regulation D); 15 USC § 78o (Investment Adviser registration)",
    rationale:
      "Every model offered to US investors is a 'security-like' instrument under SEC's broad investment-contract test (Howey). Ship freezes until counsel sign-off.",
  },
  {
    id: "sec.subpoena-record-retention.v1",
    version: 1,
    jurisdiction: "sec",
    appliesTo: { regions: ["us"] },
    trigger: { eventKind: "subpoena_received" },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 24, params: { template: "sec-subpoena" } },
        { kind: "request_docusign", params: { template: "subpoena-acknowledgement" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 24,
    },
    reviewer: "regulator_liaison",
    statute: "17 CFR § 240.17a-4 (record retention); 15 USC § 78u (subpoena power)",
    rationale: "SEC subpoenas demand 24-hour acknowledgement and a verifiable retention chain.",
  },
];
