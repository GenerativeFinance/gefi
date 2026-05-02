/**
 * `@gefi/compliance-rules` — typed compliance rule definitions covering
 * 11 jurisdictions. See `README.md` for the rule schema and the YAML
 * mirror.
 */

export type {
  ComplianceEvent,
  ComplianceRule,
  Jurisdiction,
  RequiredAction,
  RequiredActionKind,
  ReviewerRole,
  RuleMatch,
  TriggeredRule,
} from "./types.js";
export { JURISDICTION_LABEL } from "./types.js";
export { RULES } from "./rules/index.js";
export { findRules, ruleMatches, severityRank } from "./match.js";
