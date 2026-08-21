/**
 * Audit-vault endpoints.
 *
 *   POST /audit/append              — append a free-form audit row outside
 *                                     the rule pipeline (used by gefi-api
 *                                     for inference/training audit hashes).
 *
 *   GET  /audit/proof/:event_id     — return a Merkle inclusion proof.
 *
 *                                     The proof is computed against the
 *                                     *anchored batch* that covers this leaf.
 *                                     If no anchor exists yet for the day
 *                                     the event was written, we return the
 *                                     proof root from the full in-flight
 *                                     chain and set anchor.status = "pending"
 *                                     so the caller knows it is not yet
 *                                     on-chain.
 *
 *                                     Once an anchor lands for the day bucket,
 *                                     the proof root is stable and an
 *                                     independent auditor can verify it by:
 *                                       1. Fetching this endpoint.
 *                                       2. Recomputing the root from leaf+path.
 *                                       3. Fetching the Polygon TX and
 *                                          confirming it commits the same root.
 */

import { buildMerkle, computeEventHash, genesisHash, inclusionProof } from "@gefi/compliance-engine";
import type { Region, ComplianceEventKind, ComplianceSeverity } from "@gefi/shared-types";
import { fetchPrevChainState, insertAuditEvent, listAuditEvents } from "../lib/audit-store.js";
import type { Handler } from "../router.js";

interface AppendBody {
  tenantId: string;
  region: Region;
  modelId?: string;
  jurisdiction?: string;
  inputHash?: string;
  outputHash?: string;
  ts?: number;
}

export const auditAppendHandler: Handler = async ({ env, request }) => {
  let body: AppendBody;
  try {
    body = (await request.json()) as AppendBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || !body.tenantId || !body.region) {
    return Response.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
  }
  const ts = body.ts ?? Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();
  const payload: Record<string, unknown> = {
    eventId: id,
    kind: "audit_appended",
    tenantId: body.tenantId,
    region: body.region,
    ts,
    modelId: body.modelId ?? null,
    jurisdiction: body.jurisdiction ?? null,
    inputHash: body.inputHash ?? null,
    outputHash: body.outputHash ?? null,
  };
  const prev = await fetchPrevChainState(env.DB, body.region);
  const prevHash = prev?.lastHash ?? genesisHash();
  const eventHash = await computeEventHash(prevHash, payload);
  const chainIndex = (prev?.lastChainIndex ?? -1) + 1;
  const appended = await insertAuditEvent(env.DB, {
    id,
    tenantId: body.tenantId,
    userId: null,
    region: body.region,
    kind: "audit_appended" as ComplianceEventKind,
    severity: "info" as ComplianceSeverity,
    payload,
    prevHash,
    eventHash,
    chainIndex,
    createdAt: ts,
  });
  if (!appended) {
    return Response.json({ ok: false, error: "duplicate_audit_hash" }, { status: 409 });
  }
  return Response.json({ ok: true, id, eventHash, chainIndex });
};

export const auditProofHandler: Handler = async ({ env, params }) => {
  const eventId = params["event_id"];
  if (!eventId) {
    return Response.json({ ok: false, error: "event_id_required" }, { status: 400 });
  }
  const target = await env.DB.prepare(
    `SELECT id, region, event_hash AS eventHash, chain_index AS chainIndex, created_at AS createdAt
       FROM audit_events WHERE id = ?`,
  )
    .bind(eventId)
    .first<{ id: string; region: Region; eventHash: string; chainIndex: number; createdAt: number }>();
  if (!target) {
    return Response.json({ ok: false, error: "event_not_found" }, { status: 404 });
  }

  // Derive which UTC day bucket this event belongs to.
  const dayBucket = new Date(target.createdAt * 1000).toISOString().slice(0, 10);

  // Look for an anchor that covers this event's day bucket.
  const anchor = await env.DB.prepare(
    `SELECT id, region, day_bucket AS dayBucket,
            first_event_id AS firstEventId, last_event_id AS lastEventId,
            event_count AS eventCount,
            merkle_root AS merkleRoot,
            polygon_tx_hash AS polygonTxHash, polygon_block AS polygonBlock,
            status, anchored_at AS anchoredAt
       FROM audit_anchors
      WHERE region = ? AND day_bucket = ?
      ORDER BY created_at DESC
      LIMIT 1`,
  )
    .bind(target.region, dayBucket)
    .first<{
      id: string;
      region: Region;
      dayBucket: string;
      firstEventId: string;
      lastEventId: string;
      eventCount: number;
      merkleRoot: string;
      polygonTxHash: string | null;
      polygonBlock: number | null;
      status: "pending" | "anchored" | "failed";
      anchoredAt: number | null;
    }>();

  // Build the Merkle proof from the anchored batch when available, otherwise
  // from all events in the region (proof root will be "pending").
  let batchLeaves: string[];
  let proofRoot: string;
  let stableRoot: boolean;

  if (anchor) {
    // Fetch only the events that belong to this anchor's covered day.
    const batchStart = Math.floor(new Date(`${anchor.dayBucket}T00:00:00Z`).getTime() / 1000);
    const batchEnd = batchStart + 86400 - 1;
    const batchEvents = await listAuditEvents(env.DB, target.region);
    const dayEvents = batchEvents.filter((e) => e.createdAt >= batchStart && e.createdAt <= batchEnd);
    batchLeaves = dayEvents.map((e) => e.eventHash);
    // Confirm the stored root still matches (detects tampering).
    const { root } = await buildMerkle(batchLeaves);
    if (root !== anchor.merkleRoot) {
      return Response.json({
        ok: false,
        error: "anchor_root_mismatch",
        detail: "Recomputed Merkle root does not match stored anchor root. Chain may have been tampered.",
      }, { status: 500 });
    }
    proofRoot = root;
    stableRoot = true;
  } else {
    // No anchor yet — build proof over all events in the region so the caller
    // still gets a verifiable proof structure, just not yet committed on-chain.
    const all = await listAuditEvents(env.DB, target.region);
    batchLeaves = all.map((e) => e.eventHash);
    const { root } = await buildMerkle(batchLeaves);
    proofRoot = root;
    stableRoot = false;
  }

  const idx = batchLeaves.indexOf(target.eventHash);
  if (idx < 0) {
    return Response.json({ ok: false, error: "event_not_in_batch" }, { status: 500 });
  }
  const { path } = await inclusionProof(batchLeaves, idx);

  return Response.json({
    ok: true,
    eventId,
    leaf: target.eventHash,
    root: proofRoot,
    stableRoot,
    dayBucket,
    chainIndex: target.chainIndex,
    region: target.region,
    path,
    anchor: anchor
      ? {
          id: anchor.id,
          region: anchor.region,
          dayBucket: anchor.dayBucket,
          polygonTxHash: anchor.polygonTxHash,
          polygonBlock: anchor.polygonBlock,
          status: anchor.status,
          anchoredAt: anchor.anchoredAt,
        }
      : {
          id: null,
          region: target.region,
          dayBucket,
          polygonTxHash: null,
          polygonBlock: null,
          status: "pending" as const,
          anchoredAt: null,
        },
  });
};
