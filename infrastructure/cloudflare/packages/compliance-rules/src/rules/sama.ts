/**
 * SAMA — Saudi Central Bank (formerly the Saudi Arabian Monetary Authority).
 *
 * SAMA's cyber-security framework + AML/CFT rules govern cross-border data
 * flows and breach notification for KSA-connected tenants.
 */

import type { ComplianceRule } from "../types.js";

export const SAMA_RULES: ComplianceRule[] = [
  {
    id: "sama.cross-border.v1",
    version: 1,
    jurisdiction: "sama",
    appliesTo: { regions: ["eu"] },
    trigger: {
      eventKind: "cross_border",
      match: { payload: { sa: true } },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "block_cross_border" },
        { kind: "route_to_reviewer", slaHours: 24, params: { template: "sama-cross-border" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 24,
    },
    reviewer: "regulator_liaison",
    statute: "SAMA Cyber Security Framework v1.0 § 3.3.6 (Cross-Border Data Transfers)",
    rationale: "KSA personal data must not leave the kingdom without explicit SAMA approval.",
  },
  {
    id: "sama.aml-subscription.v1",
    version: 1,
    jurisdiction: "sama",
    appliesTo: { regions: ["eu"] },
    trigger: {
      eventKind: "subscription_created",
      match: { entityType: "institutional", payload: { sa: true } },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "route_to_reviewer", slaHours: 72, params: { template: "sama-aml" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 72,
    },
    reviewer: "aml_officer",
    statute: "SAMA Anti-Money Laundering and Counter-Terrorism Financing Rules (2018)",
    rationale: "Saudi institutional onboarding requires SAMA-approved AML review.",
  },
];
