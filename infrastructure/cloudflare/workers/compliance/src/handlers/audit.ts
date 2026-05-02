/**
 * Audit-vault endpoints.
 *
 *   POST /audit/append              — append a free-form audit row outside
 *                                     the rule pipeline (used by gefi-api
 *                                     for inference/training audit hashes).
 *
 *   GET  /audit/proof/:event_id     — return a Merkle inclusion proof. The
 *                                     proof is computed against the current
 *                                     in-memory tree of the row's region;
 *                                     once a daily anchor lands, the proof
 *                                     also references the on-chain anchor
 *                                     row.
 */

import { computeEventHash, genesisHash, inclusionProof } from "@gefi/compliance-engine";
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
    `SELECT id, region, event_hash AS eventHash, chain_index AS chainIndex
       FROM audit_events WHERE id = ?`,
  )
    .bind(eventId)
    .first<{ id: string; region: Region; eventHash: string; chainIndex: number }>();
  if (!target) {
    return Response.json({ ok: false, error: "event_not_found" }, { status: 404 });
  }

  const all = await listAuditEvents(env.DB, target.region);
  const leaves = all.map((r) => r.eventHash);
  const idx = all.findIndex((r) => r.id === target.id);
  if (idx < 0) {
    return Response.json({ ok: false, error: "event_index_lost" }, { status: 500 });
  }
  const { path, root } = await inclusionProof(leaves, idx);

  // Look up the most-recent anchor that covers this leaf, if any.
  const anchor = await env.DB.prepare(
    `SELECT id, region, polygon_tx_hash AS polygonTxHash, polygon_block AS polygonBlock,
            status, anchored_at AS anchoredAt, first_event_id AS firstEventId, last_event_id AS lastEventId
       FROM audit_anchors
      WHERE region = ?
        AND merkle_root = ?
      ORDER BY created_at DESC
      LIMIT 1`,
  )
    .bind(target.region, root)
    .first<{
      id: string;
      region: Region;
      polygonTxHash: string | null;
      polygonBlock: number | null;
      status: "pending" | "anchored" | "failed";
      anchoredAt: number | null;
      firstEventId: string;
      lastEventId: string;
    }>();

  return Response.json({
    ok: true,
    eventId,
    leaf: target.eventHash,
    root,
    chainIndex: target.chainIndex,
    region: target.region,
    path,
    anchor: anchor
      ? {
          id: anchor.id,
          region: anchor.region,
          polygonTxHash: anchor.polygonTxHash,
          polygonBlock: anchor.polygonBlock,
          status: anchor.status,
          anchoredAt: anchor.anchoredAt,
        }
      : { id: null, region: target.region, polygonTxHash: null, polygonBlock: null, status: "pending", anchoredAt: null },
  });
};
