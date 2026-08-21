/**
 * Rule matching primitives. Pure functions; no I/O. Keep simple — the
 * compliance engine composes these into the higher-level evaluator.
 */

import type { ComplianceSeverity } from "@gefi/shared-types";
import type { ComplianceEvent, ComplianceRule, RuleMatch } from "./types.js";
import { RULES } from "./rules/index.js";

const SEVERITY_RANK: Record<ComplianceSeverity, number> = {
  info: 0,
  warn: 1,
  high: 2,
  critical: 3,
};

/** Numeric rank for a severity (higher = more severe). */
export function severityRank(s: ComplianceSeverity): number {
  return SEVERITY_RANK[s];
}

/**
 * True iff the event satisfies every clause in the match. Missing clauses
 * mean "match anything"; an empty/undefined match always returns true.
 */
export function ruleMatches(event: ComplianceEvent, match: RuleMatch | undefined): boolean {
  if (!match) return true;

  if (match.minSeverity !== undefined) {
    if (severityRank(event.severity) < severityRank(match.minSeverity)) return false;
  }

  if (match.entityType !== undefined) {
    const types = Array.isArray(match.entityType) ? match.entityType : [match.entityType];
    const eventEntity = event.payload?.entityType;
    if (!eventEntity || !types.includes(eventEntity as never)) return false;
  }

  if (match.subscriptionTier !== undefined) {
    const tiers = Array.isArray(match.subscriptionTier)
      ? match.subscriptionTier
      : [match.subscriptionTier];
    const eventTier = event.payload?.subscriptionTier;
    if (!eventTier || !tiers.includes(eventTier as never)) return false;
  }

  if (match.payload) {
    for (const [key, want] of Object.entries(match.payload)) {
      const got = event.payload?.[key];
      if (got !== want) return false;
    }
  }

  return true;
}

/**
 * Find every rule that fires for `event`, in canonical order. The order is
 * stable across calls so the engine's emitted action list is deterministic
 * (= the audit log records the same sequence regardless of when the rule
 * book was loaded).
 */
export function findRules(event: ComplianceEvent, rules: readonly ComplianceRule[] = RULES): ComplianceRule[] {
  const out: ComplianceRule[] = [];
  for (const rule of rules) {
    if (rule.trigger.eventKind !== event.kind) continue;
    if (!rule.appliesTo.regions.includes(event.region)) continue;
    if (!ruleMatches(event, rule.trigger.match)) continue;
    out.push(rule);
  }
  return out;
}
