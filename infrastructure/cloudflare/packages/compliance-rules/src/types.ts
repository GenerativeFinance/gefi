/**
 * Type definitions for the compliance rules DSL.
 *
 * A `ComplianceRule` is a static, declarative description of "when this event
 * happens in this jurisdiction, do these things and notify this kind of
 * reviewer within this SLA". Rules are composed by the compliance engine
 * (`@gefi/compliance-engine`) into concrete `RequiredAction[]` lists.
 */

import type { ComplianceEventKind, ComplianceSeverity, EntityType, Region, SubscriptionTier } from "@gefi/shared-types";

/**
 * The eleven regulators we codify rules for. The engine maps incoming
 * platform events to a *set* of these — e.g. an EU event evaluates against
 * MiFID II, GDPR, and (where applicable) FCA / FINMA rules in parallel.
 */
export type Jurisdiction =
  | "sec"
  | "finra"
  | "mifid-ii"
  | "gdpr"
  | "ccpa"
  | "fca"
  | "mas"
  | "finma"
  | "dfsa"
  | "sama"
  | "austrac";

/** Pretty-print labels used in routing emails + auditor proofs. */
export const JURISDICTION_LABEL: Record<Jurisdiction, string> = {
  sec: "U.S. Securities and Exchange Commission",
  finra: "Financial Industry Regulatory Authority",
  "mifid-ii": "Markets in Financial Instruments Directive II",
  gdpr: "General Data Protection Regulation",
  ccpa: "California Consumer Privacy Act",
  fca: "Financial Conduct Authority (UK)",
  mas: "Monetary Authority of Singapore",
  finma: "Swiss Financial Market Supervisory Authority",
  dfsa: "Dubai Financial Services Authority",
  sama: "Saudi Central Bank",
  austrac: "Australian Transaction Reports and Analysis Centre",
};

/**
 * Roles the rule expects on the lawyer/auditor directory. The routing
 * service uses this to pick an assignee.
 *
 * - `securities_counsel` — admitted to practise in the relevant securities
 *   regime (e.g. SEC-registered attorney, FCA-authorised compliance advisor).
 * - `privacy_counsel` — DPO-equivalent for GDPR/CCPA breaches + DSARs.
 * - `aml_officer` — designated AML/CTF reporting officer (FINRA, AUSTRAC,
 *   SAMA reporting flows).
 * - `external_auditor` — independent auditor signing off SOC2/ISO/AMS-style
 *   compliance evidence.
 * - `regulator_liaison` — operator-side legal contact who corresponds with
 *   the regulator directly (subpoenas, supervisory letters).
 */
export type ReviewerRole =
  | "securities_counsel"
  | "privacy_counsel"
  | "aml_officer"
  | "external_auditor"
  | "regulator_liaison";

/**
 * Atomic action a rule can require. The engine produces a stable, sorted
 * list of these for every triggered event so the audit log records the same
 * actions in the same order regardless of the order rules were evaluated.
 */
export type RequiredActionKind =
  | "create_case"               // Open a ComplianceCase Durable Object.
  | "route_to_reviewer"         // PGP-signed email + dashboard task.
  | "request_disclosure_form"   // Generate disclosure questionnaire (MiFID/SEC).
  | "freeze_listing"            // Suspend `model.status` until reviewer signs off.
  | "notify_regulator"          // 72h GDPR / 24h AUSTRAC notification.
  | "audit_anchor"              // Always — every event lands in the audit vault.
  | "request_docusign"          // External sign-off envelope.
  | "block_cross_border"        // Reject cross-region data flow.
  | "open_dsar_clock";          // Start GDPR-30d / CCPA-45d response clock.

/**
 * Match clause supported by `trigger.match`. Every key is optional; missing
 * keys mean "match anything". Matchers are AND-ed together.
 *
 * The matcher *is intentionally simple* — no regex, no nested expressions.
 * If a rule needs richer matching it's a sign the rule should be split.
 */
export interface RuleMatch {
  entityType?: EntityType | EntityType[];
  subscriptionTier?: SubscriptionTier | SubscriptionTier[];
  /** Free-form payload field equality, e.g. `{"region":"eu"}`. */
  payload?: Record<string, string | number | boolean>;
  /** Severity threshold; rule only fires if `event.severity >= severities` (in ['info','warn','high','critical'] order). */
  minSeverity?: ComplianceSeverity;
}

/** Required action shape produced by the evaluator. */
export interface RequiredAction {
  kind: RequiredActionKind;
  /** SLA deadline in hours, scoped to this action; max(rule.requires.slaHours) wins. */
  slaHours?: number;
  /**
   * Free-form parameters the engine forwards to the action implementation
   * (e.g. `{ form: "MiFID-MFI-3" }` for `request_disclosure_form`).
   */
  params?: Record<string, string | number | boolean>;
}

/** A single declarative rule. */
export interface ComplianceRule {
  id: string;
  version: number;
  jurisdiction: Jurisdiction;
  appliesTo: { regions: Region[] };
  trigger: { eventKind: ComplianceEventKind; match?: RuleMatch };
  requires: {
    actions: RequiredAction[];
    /** Deadline for case ack/sign-off in hours. */
    slaHours: number;
  };
  reviewer: ReviewerRole;
  /** Statute citation (e.g. "MiFID II, Art. 24(4)"). */
  statute: string;
  /** Plain-English rationale for engineers. */
  rationale: string;
}

/**
 * Shape of an event flowing into the engine. This is the canonical envelope
 * `gefi-api` produces and `gefi-compliance` consumes — keep stable.
 */
export interface ComplianceEvent {
  id: string;
  kind: ComplianceEventKind;
  tenantId: string;
  userId?: string;
  /** Region the event was generated in (data plane). */
  region: Region;
  /** Wall-clock timestamp in UNIX seconds. */
  ts: number;
  severity: ComplianceSeverity;
  /** Free-form payload the engine forwards into action params. */
  payload?: Record<string, string | number | boolean>;
}

/** A rule that matched plus the actions it contributed. */
export interface TriggeredRule {
  rule: ComplianceRule;
  actions: RequiredAction[];
}
