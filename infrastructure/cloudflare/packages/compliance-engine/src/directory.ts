/**
 * Lawyer + auditor directory data + per-tenant assignment helpers.
 *
 * The seed data here is committed alongside code so that a freshly-deployed
 * compliance worker can populate its directory tables idempotently via
 * `POST /admin/seed-directory`. Operator updates (adding a new lawyer,
 * rotating contact details) replace the seed atomically.
 *
 * Real-world contracts are separately filed and DocuSign-signed; this
 * directory is the routable index, not the legal contract record.
 */

import type { Jurisdiction, ReviewerRole } from "@gefi/compliance-rules";
import type { Region } from "@gefi/shared-types";

export interface LawyerSeed {
  id: string;
  jurisdiction: Jurisdiction;
  region: Region;
  role: ReviewerRole;
  displayName: string;
  firm: string;
  email: string;
  pgpFingerprint?: string;
  slaAckHours: number;
}

/**
 * Default-assignee table per jurisdiction. Real lawyers / auditors are
 * onboarded by the operator post-launch; the seed below provisions
 * placeholder mailboxes (`compliance+<juris>@gefi.io`) so the routing
 * pipeline is testable and works on day-one without breaking when a real
 * counsel hasn't been wired up yet.
 *
 * Each row is keyed by `id` so tenant_assignments can refer to it stably
 * across redeploys.
 */
export const LAWYER_SEED: readonly LawyerSeed[] = [
  // SEC + FINRA — US securities counsel.
  { id: "sec-default", jurisdiction: "sec", region: "us", role: "securities_counsel", displayName: "Default SEC counsel", firm: "GeFi Counsel Network", email: "compliance+sec@gefi.io", slaAckHours: 24 },
  { id: "sec-liaison", jurisdiction: "sec", region: "us", role: "regulator_liaison", displayName: "Default SEC liaison", firm: "GeFi Counsel Network", email: "compliance+sec-liaison@gefi.io", slaAckHours: 12 },
  { id: "finra-aml", jurisdiction: "finra", region: "us", role: "aml_officer", displayName: "Default FINRA AML officer", firm: "GeFi Counsel Network", email: "compliance+finra-aml@gefi.io", slaAckHours: 24 },
  { id: "finra-liaison", jurisdiction: "finra", region: "us", role: "regulator_liaison", displayName: "Default FINRA liaison", firm: "GeFi Counsel Network", email: "compliance+finra-liaison@gefi.io", slaAckHours: 24 },

  // MiFID II — EU securities counsel.
  { id: "mifid-default", jurisdiction: "mifid-ii", region: "eu", role: "securities_counsel", displayName: "Default MiFID counsel", firm: "GeFi Counsel Network", email: "compliance+mifid@gefi.io", slaAckHours: 24 },

  // GDPR — privacy counsel.
  { id: "gdpr-privacy", jurisdiction: "gdpr", region: "eu", role: "privacy_counsel", displayName: "Default GDPR DPO", firm: "GeFi Privacy Office", email: "privacy+gdpr@gefi.io", slaAckHours: 24 },

  // CCPA — privacy counsel.
  { id: "ccpa-privacy", jurisdiction: "ccpa", region: "us", role: "privacy_counsel", displayName: "Default CCPA counsel", firm: "GeFi Privacy Office", email: "privacy+ccpa@gefi.io", slaAckHours: 48 },

  // FCA — UK regulator liaison + securities.
  { id: "fca-securities", jurisdiction: "fca", region: "eu", role: "securities_counsel", displayName: "Default FCA counsel", firm: "GeFi UK Counsel", email: "compliance+fca@gefi.io", slaAckHours: 24 },
  { id: "fca-liaison", jurisdiction: "fca", region: "eu", role: "regulator_liaison", displayName: "Default FCA liaison", firm: "GeFi UK Counsel", email: "compliance+fca-liaison@gefi.io", slaAckHours: 12 },

  // MAS — Singapore.
  { id: "mas-securities", jurisdiction: "mas", region: "us", role: "securities_counsel", displayName: "Default MAS counsel", firm: "GeFi APAC Counsel", email: "compliance+mas@gefi.io", slaAckHours: 24 },
  { id: "mas-liaison", jurisdiction: "mas", region: "us", role: "regulator_liaison", displayName: "Default MAS liaison", firm: "GeFi APAC Counsel", email: "compliance+mas-liaison@gefi.io", slaAckHours: 1 },

  // FINMA — Switzerland.
  { id: "finma-securities", jurisdiction: "finma", region: "eu", role: "securities_counsel", displayName: "Default FINMA counsel", firm: "GeFi Swiss Counsel", email: "compliance+finma@gefi.io", slaAckHours: 24 },
  { id: "finma-liaison", jurisdiction: "finma", region: "eu", role: "regulator_liaison", displayName: "Default FINMA liaison", firm: "GeFi Swiss Counsel", email: "compliance+finma-liaison@gefi.io", slaAckHours: 24 },

  // DFSA — Dubai.
  { id: "dfsa-securities", jurisdiction: "dfsa", region: "eu", role: "securities_counsel", displayName: "Default DFSA counsel", firm: "GeFi MENA Counsel", email: "compliance+dfsa@gefi.io", slaAckHours: 24 },
  { id: "dfsa-aml", jurisdiction: "dfsa", region: "eu", role: "aml_officer", displayName: "Default DFSA AML officer", firm: "GeFi MENA Counsel", email: "compliance+dfsa-aml@gefi.io", slaAckHours: 24 },

  // SAMA — Saudi.
  { id: "sama-aml", jurisdiction: "sama", region: "eu", role: "aml_officer", displayName: "Default SAMA AML officer", firm: "GeFi MENA Counsel", email: "compliance+sama-aml@gefi.io", slaAckHours: 24 },
  { id: "sama-liaison", jurisdiction: "sama", region: "eu", role: "regulator_liaison", displayName: "Default SAMA liaison", firm: "GeFi MENA Counsel", email: "compliance+sama-liaison@gefi.io", slaAckHours: 12 },

  // AUSTRAC — Australia.
  { id: "austrac-aml", jurisdiction: "austrac", region: "us", role: "aml_officer", displayName: "Default AUSTRAC AML officer", firm: "GeFi APAC Counsel", email: "compliance+austrac-aml@gefi.io", slaAckHours: 24 },
  { id: "austrac-liaison", jurisdiction: "austrac", region: "us", role: "regulator_liaison", displayName: "Default AUSTRAC liaison", firm: "GeFi APAC Counsel", email: "compliance+austrac-liaison@gefi.io", slaAckHours: 12 },
];

/** Subset of `LAWYER_SEED` matching the requested role on the given jurisdiction. */
export function pickDefaultLawyer(
  jurisdiction: Jurisdiction,
  role: ReviewerRole,
): LawyerSeed | undefined {
  return LAWYER_SEED.find((l) => l.jurisdiction === jurisdiction && l.role === role);
}

/**
 * External-auditor seed. Distinct from `LAWYER_SEED` (which routes
 * regulator-facing legal counsel) — auditors are independent SOC2 / ISO
 * 27001 / AMS-style attestors who sign off on the audit chain itself.
 *
 * The `audit_anchor` action implicitly invokes an external auditor for
 * every event; the routing service uses this seed to attach a default
 * auditor to every audit event so the chain is verifiable from day one
 * without per-tenant configuration.
 */
export interface AuditorSeed {
  id: string;
  jurisdiction: Jurisdiction;
  region: Region;
  /** Hard-coded to `external_auditor` so the directory query is uniform. */
  role: "external_auditor";
  displayName: string;
  firm: string;
  email: string;
  pgpFingerprint?: string;
  /** Number of business days the auditor has to counter-sign an anchor. */
  slaSignDays: number;
}

export const AUDITOR_SEED: readonly AuditorSeed[] = [
  // US data plane — SEC, FINRA, CCPA, MAS (APAC desk), AUSTRAC (APAC desk).
  { id: "auditor-us-soc2", jurisdiction: "sec", region: "us", role: "external_auditor", displayName: "Default US auditor", firm: "GeFi External Audit", email: "auditor+us@gefi.io", slaSignDays: 5 },
  { id: "auditor-finra-soc2", jurisdiction: "finra", region: "us", role: "external_auditor", displayName: "Default FINRA auditor", firm: "GeFi External Audit", email: "auditor+finra@gefi.io", slaSignDays: 5 },
  { id: "auditor-ccpa-privacy", jurisdiction: "ccpa", region: "us", role: "external_auditor", displayName: "Default CCPA privacy auditor", firm: "GeFi External Audit", email: "auditor+ccpa@gefi.io", slaSignDays: 5 },
  { id: "auditor-mas-soc2", jurisdiction: "mas", region: "us", role: "external_auditor", displayName: "Default MAS auditor", firm: "GeFi APAC Audit", email: "auditor+mas@gefi.io", slaSignDays: 5 },
  { id: "auditor-austrac-soc2", jurisdiction: "austrac", region: "us", role: "external_auditor", displayName: "Default AUSTRAC auditor", firm: "GeFi APAC Audit", email: "auditor+austrac@gefi.io", slaSignDays: 5 },

  // EU data plane — MiFID II, GDPR, FCA, FINMA, DFSA, SAMA.
  { id: "auditor-mifid-soc2", jurisdiction: "mifid-ii", region: "eu", role: "external_auditor", displayName: "Default MiFID auditor", firm: "GeFi EU Audit", email: "auditor+mifid@gefi.io", slaSignDays: 5 },
  { id: "auditor-gdpr-iso27701", jurisdiction: "gdpr", region: "eu", role: "external_auditor", displayName: "Default GDPR ISO-27701 auditor", firm: "GeFi EU Audit", email: "auditor+gdpr@gefi.io", slaSignDays: 5 },
  { id: "auditor-fca-soc2", jurisdiction: "fca", region: "eu", role: "external_auditor", displayName: "Default FCA auditor", firm: "GeFi UK Audit", email: "auditor+fca@gefi.io", slaSignDays: 5 },
  { id: "auditor-finma-soc2", jurisdiction: "finma", region: "eu", role: "external_auditor", displayName: "Default FINMA auditor", firm: "GeFi Swiss Audit", email: "auditor+finma@gefi.io", slaSignDays: 5 },
  { id: "auditor-dfsa-soc2", jurisdiction: "dfsa", region: "eu", role: "external_auditor", displayName: "Default DFSA auditor", firm: "GeFi MENA Audit", email: "auditor+dfsa@gefi.io", slaSignDays: 5 },
  { id: "auditor-sama-soc2", jurisdiction: "sama", region: "eu", role: "external_auditor", displayName: "Default SAMA auditor", firm: "GeFi MENA Audit", email: "auditor+sama@gefi.io", slaSignDays: 5 },
];

/** Pick the default auditor for the given jurisdiction. */
export function pickDefaultAuditor(jurisdiction: Jurisdiction): AuditorSeed | undefined {
  return AUDITOR_SEED.find((a) => a.jurisdiction === jurisdiction);
}
