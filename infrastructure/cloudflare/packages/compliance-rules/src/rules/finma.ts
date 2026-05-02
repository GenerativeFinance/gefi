/**
 * FINMA — Swiss Financial Market Supervisory Authority.
 *
 * FINMA Circular 2018/3 (outsourcing) + 2023/1 (operational risks /
 * resilience) drive listing review and incident notification for
 * Swiss-targeted offerings.
 */

import type { ComplianceRule } from "../types.js";

export const FINMA_RULES: ComplianceRule[] = [
  {
    id: "finma.fidleg-listing.v1",
    version: 1,
    jurisdiction: "finma",
    appliesTo: { regions: ["eu"] },
    trigger: {
      eventKind: "model_listed",
      match: { payload: { ch: true } },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "request_disclosure_form", params: { form: "FIDLEG-KID" } },
        { kind: "route_to_reviewer", slaHours: 96, params: { template: "finma-listing" } },
        { kind: "freeze_listing" },
        { kind: "audit_anchor" },
      ],
      slaHours: 96,
    },
    reviewer: "securities_counsel",
    statute: "FIDLEG Art. 8 (Key Information Document); FINMA Circular 2018/3",
    rationale: "Swiss retail-targeted instruments require a KID before publication.",
  },
  {
    id: "finma.incident-notification.v1",
    version: 1,
    jurisdiction: "finma",
    appliesTo: { regions: ["eu"] },
    trigger: {
      eventKind: "data_breach",
      match: { payload: { ch: true } },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 24, params: { template: "finma-incident" } },
        { kind: "notify_regulator", slaHours: 24, params: { regulator: "finma", form: "operational-incident" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 24,
    },
    reviewer: "regulator_liaison",
    statute: "FINMA Circular 2023/1 (Operational risks and resilience banks)",
    rationale: "FINMA-supervised entities must report critical operational incidents within 24h.",
  },
];
