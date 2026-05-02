/**
 * The evaluator: given an event, produce the deterministic list of required
 * actions across every triggered rule.
 *
 * Determinism is essential. The audit log ends up storing the actions
 * emitted here, so re-evaluating the same event later (e.g. during a
 * regulator inspection) MUST produce byte-identical output. We achieve
 * that by:
 *
 *   1. Iterating `RULES` in its committed order.
 *   2. Sorting actions inside each rule by `kind` (alphabetical), then by
 *      a stable JSON encoding of `params`, so the action ordering is
 *      independent of whatever order the rule author happened to write.
 *   3. De-duplicating the cross-rule action list by (kind, sorted params).
 *      If two rules both ask for the same action with the same params, we
 *      keep the *strictest* SLA (smallest `slaHours`).
 */

import { findRules, RULES } from "@gefi/compliance-rules";
import type { ComplianceEvent, ComplianceRule, EvaluationResult, RequiredAction, TriggeredRule } from "./types.js";

const ACTION_ORDER: Record<string, number> = {
  // Anchor first so even on a partial failure the audit row is recorded.
  audit_anchor: 0,
  create_case: 1,
  freeze_listing: 2,
  block_cross_border: 3,
  open_dsar_clock: 4,
  request_disclosure_form: 5,
  request_docusign: 6,
  notify_regulator: 7,
  route_to_reviewer: 8,
};

function actionRank(a: RequiredAction): number {
  return ACTION_ORDER[a.kind] ?? 99;
}

function paramsKey(a: RequiredAction): string {
  if (!a.params) return "";
  const keys = Object.keys(a.params).sort();
  return keys.map((k) => `${k}=${String(a.params![k])}`).join("|");
}

function dedupeKey(a: RequiredAction): string {
  return `${a.kind}::${paramsKey(a)}`;
}

/** Stable sort of one rule's actions. */
function sortActions(actions: readonly RequiredAction[]): RequiredAction[] {
  return [...actions].sort((a, b) => {
    const ra = actionRank(a);
    const rb = actionRank(b);
    if (ra !== rb) return ra - rb;
    return paramsKey(a).localeCompare(paramsKey(b));
  });
}

/**
 * Merge `incoming` into `existing` keeping the strictest SLA per dedupe key.
 * Returns the merged list pre-sorted.
 */
function mergeActions(existing: RequiredAction[], incoming: readonly RequiredAction[]): RequiredAction[] {
  const map = new Map<string, RequiredAction>();
  for (const a of existing) map.set(dedupeKey(a), a);
  for (const a of incoming) {
    const k = dedupeKey(a);
    const prev = map.get(k);
    if (!prev) {
      map.set(k, a);
      continue;
    }
    // Keep the strictest SLA (smallest slaHours). Undefined slaHours
    // is treated as "no rule-specific SLA" (= weakest) so any concrete
    // value beats it.
    const prevSla = prev.slaHours ?? Number.POSITIVE_INFINITY;
    const nextSla = a.slaHours ?? Number.POSITIVE_INFINITY;
    map.set(k, nextSla < prevSla ? { ...prev, slaHours: a.slaHours, params: a.params ?? prev.params } : prev);
  }
  return sortActions([...map.values()]);
}

/**
 * Evaluate an event against the rule book. Pure function — no I/O.
 */
export function evaluate(event: ComplianceEvent, rules: readonly ComplianceRule[] = RULES): EvaluationResult {
  const matchedRules = findRules(event, rules);
  const triggered: TriggeredRule[] = [];
  let actions: RequiredAction[] = [];
  let minSlaHours: number | null = null;

  for (const rule of matchedRules) {
    const sorted = sortActions(rule.requires.actions);
    triggered.push({ rule, actions: sorted });
    actions = mergeActions(actions, sorted);
    if (minSlaHours === null || rule.requires.slaHours < minSlaHours) {
      minSlaHours = rule.requires.slaHours;
    }
  }

  return {
    triggered,
    actions,
    slaDeadlineSec: minSlaHours === null ? null : event.ts + minSlaHours * 3600,
  };
}
