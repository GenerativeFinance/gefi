/**
 * Engine-internal types. Re-exports the rule DSL types and adds the
 * runtime shapes the engine produces (evaluation results, audit chain
 * rows, Merkle proof envelopes).
 */

import type { ComplianceEvent, ComplianceRule, RequiredAction, TriggeredRule } from "@gefi/compliance-rules";
import type { ComplianceEventKind, ComplianceSeverity, Region } from "@gefi/shared-types";

export type { ComplianceEvent, ComplianceRule, RequiredAction, TriggeredRule };

/**
 * Result of evaluating a single event against the rule book. `actions` is
 * the de-duplicated, sorted union of every triggered rule's actions —
 * stable across calls (= deterministic audit). `slaDeadlineSec` is the
 * earliest deadline across all triggered rules.
 */
export interface EvaluationResult {
  triggered: TriggeredRule[];
  actions: RequiredAction[];
  /** UNIX seconds; `event.ts + min(slaHours)*3600` if any rules trigger, else null. */
  slaDeadlineSec: number | null;
}

/**
 * One row of the hash-chained audit ledger. The schema mirrors the D1
 * `audit_events` table; the engine's append-only writer enforces:
 *   prev_hash = previous row's event_hash (or 64-char zero string for genesis)
 *   event_hash = sha256(prev_hash || canonicalJson(payload))
 */
export interface AuditEventRow {
  id: string;
  tenantId: string | null;
  userId: string | null;
  region: Region;
  kind: ComplianceEventKind | "audit_appended" | "case_status_changed";
  severity: ComplianceSeverity;
  payload: Record<string, unknown>;
  prevHash: string;
  eventHash: string;
  chainIndex: number;
  createdAt: number;
}

/** Inclusion proof returned by `GET /audit/proof/:event_id`. */
export interface MerkleInclusionProof {
  /** Hex sha-256 of the leaf (= event_hash). */
  leaf: string;
  /** Hex sha-256 root the leaf is included under. */
  root: string;
  /**
   * Sibling hashes, root-side last. Each entry is an object so the verifier
   * knows whether to hash `(sibling || acc)` or `(acc || sibling)`.
   */
  path: { sibling: string; position: "left" | "right" }[];
  /** Anchor row (region, day, polygon tx) the root was committed via. */
  anchor: {
    id: string;
    region: Region;
    polygonTxHash: string | null;
    polygonBlock: number | null;
    status: "pending" | "anchored" | "failed";
    anchoredAt: number | null;
  };
}
