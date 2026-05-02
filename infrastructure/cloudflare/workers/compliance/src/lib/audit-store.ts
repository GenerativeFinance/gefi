/**
 * D1-backed adapters for the audit ledger + routing-DB needed by
 * `@gefi/compliance-engine.routeEvent`.
 *
 * Kept in `workers/compliance` rather than the engine package so the engine
 * stays runtime-agnostic (= unit-testable with in-memory adapters).
 */

import { canonicalJson } from "@gefi/compliance-engine";
import type { CaseActionInsert, CaseInsert, RoutingDb, LawyerSeed } from "@gefi/compliance-engine";
import { AUDITOR_SEED, LAWYER_SEED, pickDefaultLawyer } from "@gefi/compliance-engine";
import type { Jurisdiction, ReviewerRole } from "@gefi/compliance-rules";
import type { ComplianceEventKind, ComplianceSeverity, Region } from "@gefi/shared-types";

export interface AuditChainState {
  lastHash: string;
  lastChainIndex: number;
}

/** Read the most-recent (event_hash, chain_index) for the given region. */
export async function fetchPrevChainState(db: D1Database, region: Region): Promise<AuditChainState | null> {
  const row = await db
    .prepare(
      `SELECT event_hash AS eventHash, chain_index AS chainIndex
         FROM audit_events
        WHERE region = ?
        ORDER BY chain_index DESC
        LIMIT 1`,
    )
    .bind(region)
    .first<{ eventHash: string; chainIndex: number }>();
  if (!row) return null;
  return { lastHash: row.eventHash, lastChainIndex: row.chainIndex };
}

export interface AuditInsert {
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

/**
 * Insert an audit event. Returns false on the UNIQUE(event_hash) collision
 * (= duplicate fire of the same event), true on a fresh insert. Any other
 * D1 error throws.
 */
export async function insertAuditEvent(db: D1Database, evt: AuditInsert): Promise<boolean> {
  try {
    await db
      .prepare(
        `INSERT INTO audit_events
          (id, tenant_id, user_id, region, kind, severity, payload_json, prev_hash, event_hash, chain_index, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        evt.id,
        evt.tenantId,
        evt.userId,
        evt.region,
        evt.kind,
        evt.severity,
        canonicalJson(evt.payload),
        evt.prevHash,
        evt.eventHash,
        evt.chainIndex,
        evt.createdAt,
      )
      .run();
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("UNIQUE") || msg.includes("constraint")) return false;
    throw err;
  }
}

/** Read every audit row for `region` ordered by chain index ASC. */
export async function listAuditEvents(db: D1Database, region: Region): Promise<{
  id: string;
  eventHash: string;
  prevHash: string;
  chainIndex: number;
  region: Region;
  createdAt: number;
}[]> {
  const res = await db
    .prepare(
      `SELECT id, event_hash AS eventHash, prev_hash AS prevHash, chain_index AS chainIndex, region, created_at AS createdAt
         FROM audit_events
        WHERE region = ?
        ORDER BY chain_index ASC`,
    )
    .bind(region)
    .all<{
      id: string;
      eventHash: string;
      prevHash: string;
      chainIndex: number;
      region: Region;
      createdAt: number;
    }>();
  return res.results;
}

/**
 * RoutingDb impl backed by D1. Resolves assignees from the
 * `tenant_assignments` table when set, else falls back to the seed
 * defaults so newly-onboarded tenants are routable from day one.
 */
export function d1RoutingDb(db: D1Database): RoutingDb {
  return {
    async insertCase(c: CaseInsert): Promise<void> {
      await db
        .prepare(
          `INSERT INTO compliance_cases
            (id, tenant_id, region, jurisdiction, rule_id, event_id, reviewer_role, reviewer_id, status, sla_deadline, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)`,
        )
        .bind(c.id, c.tenantId, c.region, c.jurisdiction, c.ruleId, c.eventId, c.reviewerRole, c.reviewerId, c.slaDeadline, c.createdAt)
        .run();
    },

    async insertCaseAction(a: CaseActionInsert): Promise<void> {
      await db
        .prepare(
          `INSERT INTO case_actions
            (id, case_id, kind, status, payload_json, result_json, created_at, completed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          a.id,
          a.caseId,
          a.kind,
          a.status,
          canonicalJson(a.payload),
          a.result ? canonicalJson(a.result) : null,
          a.createdAt,
          a.completedAt ?? null,
        )
        .run();
    },

    async resolveAssignee(tenantId: string, jurisdiction: Jurisdiction, role: ReviewerRole): Promise<LawyerSeed | null> {
      // Prefer per-tenant assignment.
      const row = await db
        .prepare(
          `SELECT l.id AS id, l.jurisdiction AS jurisdiction, l.region AS region, l.role AS role,
                  l.display_name AS displayName, l.firm AS firm, l.email AS email,
                  l.pgp_fingerprint AS pgpFingerprint, l.sla_ack_hours AS slaAckHours
             FROM tenant_assignments t
        INNER JOIN lawyer_directory l ON l.id = t.lawyer_id
            WHERE t.tenant_id = ? AND t.jurisdiction = ? AND t.role = ?`,
        )
        .bind(tenantId, jurisdiction, role)
        .first<LawyerSeed>();
      if (row) return row;
      // Fall back to seed.
      return pickDefaultLawyer(jurisdiction, role) ?? null;
    },
  };
}

/**
 * Idempotent seed of `auditor_directory` from the static `AUDITOR_SEED`.
 * Behaviour mirrors `seedLawyerDirectory`.
 */
export async function seedAuditorDirectory(db: D1Database): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;
  const now = Math.floor(Date.now() / 1000);
  for (const a of AUDITOR_SEED) {
    // The schema only stores `sla_ack_hours` for auditors (the
    // counter-sign window doubles as the auditor's ack SLA). Convert
    // `slaSignDays * 24` so the on-disk units match the lawyer table.
    const res = await db
      .prepare(
        `INSERT OR IGNORE INTO auditor_directory
          (id, jurisdiction, region, display_name, firm, email, pgp_fingerprint, sla_ack_hours, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      )
      .bind(
        a.id,
        a.jurisdiction,
        a.region,
        a.displayName,
        a.firm,
        a.email,
        a.pgpFingerprint ?? null,
        a.slaSignDays * 24,
        now,
      )
      .run();
    const changes = (res.meta as { changes?: number } | undefined)?.changes ?? 0;
    if (changes > 0) inserted += 1;
    else skipped += 1;
  }
  return { inserted, skipped };
}

/**
 * Idempotent seed of `lawyer_directory` from the static `LAWYER_SEED`. Safe
 * to call repeatedly — uses INSERT OR IGNORE so an operator updating the
 * directory by hand isn't clobbered.
 */
export async function seedLawyerDirectory(db: D1Database): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;
  const now = Math.floor(Date.now() / 1000);
  for (const l of LAWYER_SEED) {
    const res = await db
      .prepare(
        `INSERT OR IGNORE INTO lawyer_directory
          (id, jurisdiction, region, role, display_name, firm, email, pgp_fingerprint, sla_ack_hours, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      )
      .bind(
        l.id,
        l.jurisdiction,
        l.region,
        l.role,
        l.displayName,
        l.firm,
        l.email,
        l.pgpFingerprint ?? null,
        l.slaAckHours,
        now,
      )
      .run();
    const changes = (res.meta as { changes?: number } | undefined)?.changes ?? 0;
    if (changes > 0) inserted += 1;
    else skipped += 1;
  }
  return { inserted, skipped };
}
