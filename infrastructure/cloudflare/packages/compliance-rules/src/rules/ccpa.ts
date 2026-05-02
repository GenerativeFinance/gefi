/**
 * California Consumer Privacy Act (CCPA), as amended by CPRA.
 *
 * Headline rule: 45-day response clock to consumer requests (right to know,
 * right to delete, right to correct).
 */

import type { ComplianceRule } from "../types.js";

export const CCPA_RULES: ComplianceRule[] = [
  {
    id: "ccpa.dsar-45d.v1",
    version: 1,
    jurisdiction: "ccpa",
    appliesTo: { regions: ["us"] },
    trigger: { eventKind: "dsar_received" },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "open_dsar_clock", params: { regime: "ccpa", days: 45 } },
        { kind: "route_to_reviewer", slaHours: 72, params: { template: "ccpa-dsar" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 72,
    },
    reviewer: "privacy_counsel",
    statute: "California Civil Code § 1798.130(a)(2)(A) (verifiable consumer request response time)",
    rationale: "CCPA verifiable-consumer-request response clock is 45 calendar days; 90 days with extension.",
  },
  {
    id: "ccpa.breach-notification.v1",
    version: 1,
    jurisdiction: "ccpa",
    appliesTo: { regions: ["us"] },
    trigger: { eventKind: "data_breach", match: { minSeverity: "high" } },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 48, params: { template: "ccpa-breach" } },
        { kind: "notify_regulator", params: { regulator: "ca-ag", form: "data-breach-notice" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 48,
    },
    reviewer: "privacy_counsel",
    statute: "California Civil Code § 1798.82 (breach notification)",
    rationale: "California AG must be notified for breaches affecting >500 California residents.",
  },
];
