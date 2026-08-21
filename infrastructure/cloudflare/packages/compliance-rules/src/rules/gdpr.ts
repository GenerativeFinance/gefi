/**
 * GDPR — General Data Protection Regulation.
 *
 * The 72-hour breach notification (Art. 33) is the headline rule. DSAR-receipt
 * starts a 30-day response clock (Art. 12). Cross-border flows require a
 * Schrems-II-compliant transfer mechanism (Art. 44).
 */

import type { ComplianceRule } from "../types.js";

export const GDPR_RULES: ComplianceRule[] = [
  {
    id: "gdpr.breach-notification-72h.v1",
    version: 1,
    jurisdiction: "gdpr",
    appliesTo: { regions: ["eu"] },
    trigger: { eventKind: "data_breach" },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 24, params: { template: "gdpr-breach" } },
        { kind: "notify_regulator", slaHours: 72, params: { regulator: "edpb", form: "breach-notification" } },
        { kind: "request_docusign", params: { template: "gdpr-72h-attestation" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 72,
    },
    reviewer: "privacy_counsel",
    statute: "GDPR, Regulation (EU) 2016/679, Art. 33 (notification of personal data breach)",
    rationale: "72-hour clock to supervisory authority starts at breach awareness.",
  },
  {
    id: "gdpr.dsar-30d.v1",
    version: 1,
    jurisdiction: "gdpr",
    appliesTo: { regions: ["eu"] },
    trigger: { eventKind: "dsar_received" },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "open_dsar_clock", params: { regime: "gdpr", days: 30 } },
        { kind: "route_to_reviewer", slaHours: 48, params: { template: "gdpr-dsar" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 48,
    },
    reviewer: "privacy_counsel",
    statute: "GDPR Art. 12(3) (response to data subject request within one month)",
    rationale: "DSARs ack inside 48 hours; substantive response inside 30 days.",
  },
  {
    id: "gdpr.cross-border-transfer.v1",
    version: 1,
    jurisdiction: "gdpr",
    appliesTo: { regions: ["eu"] },
    trigger: { eventKind: "cross_border" },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "block_cross_border" },
        { kind: "route_to_reviewer", slaHours: 24, params: { template: "gdpr-schrems" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 24,
    },
    reviewer: "privacy_counsel",
    statute: "GDPR Chapter V (Art. 44–50, transfers to third countries); Schrems II (Case C-311/18)",
    rationale: "EU→US flows are blocked until SCC + TIA are signed.",
  },
];
