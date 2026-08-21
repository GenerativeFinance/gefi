/**
 * MiFID II — Markets in Financial Instruments Directive II.
 *
 * Triggers a disclosure form on every model listing in the EU data plane,
 * and a costs-and-charges disclosure on every subscription.
 */

import type { ComplianceRule } from "../types.js";

export const MIFID_II_RULES: ComplianceRule[] = [
  {
    id: "mifid-ii.model-listing-disclosure.v1",
    version: 1,
    jurisdiction: "mifid-ii",
    appliesTo: { regions: ["eu"] },
    trigger: { eventKind: "model_listed" },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "request_disclosure_form", params: { form: "MiFID-MFI-3" } },
        { kind: "route_to_reviewer", slaHours: 72, params: { template: "mifid-listing" } },
        { kind: "freeze_listing" },
        { kind: "audit_anchor" },
      ],
      slaHours: 72,
    },
    reviewer: "securities_counsel",
    statute: "MiFID II, Directive 2014/65/EU, Art. 24(4) (information to clients)",
    rationale:
      "Every investable model listed to EU investors needs MiFID II disclosure (target market, costs, risks) before trading begins.",
  },
  {
    id: "mifid-ii.costs-disclosure.v1",
    version: 1,
    jurisdiction: "mifid-ii",
    appliesTo: { regions: ["eu"] },
    trigger: {
      eventKind: "subscription_created",
      match: { subscriptionTier: ["pro", "enterprise"] },
    },
    requires: {
      actions: [
        { kind: "create_case" },
        { kind: "request_disclosure_form", params: { form: "MiFID-Costs-Charges" } },
        { kind: "route_to_reviewer", slaHours: 96, params: { template: "mifid-costs" } },
        { kind: "audit_anchor" },
      ],
      slaHours: 96,
    },
    reviewer: "securities_counsel",
    statute: "MiFID II Delegated Regulation (EU) 2017/565, Art. 50 (costs and charges)",
    rationale: "Pro/Enterprise EU subscriptions need ex-ante costs disclosure.",
  },
];
