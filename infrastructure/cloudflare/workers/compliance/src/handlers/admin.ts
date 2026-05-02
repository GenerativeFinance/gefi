/**
 * Admin-only endpoints.
 *
 *   POST /admin/seed-directory   — populate `lawyer_directory` from the
 *                                  static seed in `@gefi/compliance-engine`.
 *
 *   POST /admin/anchor           — close out the day's audit chain into a
 *                                  Merkle tree, write the root to
 *                                  `audit_anchors`, and (if creds present)
 *                                  hand it to the on-chain anchor.
 *                                  Idempotent: re-anchoring an unchanged
 *                                  range returns the existing anchor row.
 */

import { buildMerkle, resolveAnchor } from "@gefi/compliance-engine";
import type { Region } from "@gefi/shared-types";
import { listAuditEvents, seedAuditorDirectory, seedLawyerDirectory } from "../lib/audit-store.js";
import type { Handler } from "../router.js";

export const adminSeedDirectoryHandler: Handler = async ({ env }) => {
  // Seed both directories. Lawyer directory routes regulator-facing
  // counsel; auditor directory routes external attestors who counter-
  // sign the audit chain itself. Both are idempotent.
  const lawyer = await seedLawyerDirectory(env.DB);
  const auditor = await seedAuditorDirectory(env.DB);
  return Response.json({
    ok: true,
    lawyer,
    auditor,
    // Aggregated counts retained for API back-compat with the test
    // harness, which asserts on `inserted`/`skipped`.
    inserted: lawyer.inserted + auditor.inserted,
    skipped: lawyer.skipped + auditor.skipped,
  });
};

interface AnchorBody {
  region?: Region;
}

export const adminAnchorHandler: Handler = async ({ env, request }) => {
  let body: AnchorBody = {};
  if (request.headers.get("content-length") !== "0") {
    try {
      body = (await request.json()) as AnchorBody;
    } catch {
      // Allow bodyless calls.
    }
  }
  const region: Region = body.region ?? env.WORKER_REGION;

  const events = await listAuditEvents(env.DB, region);
  if (events.length === 0) {
    return Response.json({ ok: true, region, anchored: false, reason: "no_events" });
  }

  const leaves = events.map((e) => e.eventHash);
  const { root } = await buildMerkle(leaves);

  const existing = await env.DB.prepare(
    `SELECT id, polygon_tx_hash AS polygonTxHash, status FROM audit_anchors
      WHERE region = ? AND merkle_root = ?
      ORDER BY created_at DESC LIMIT 1`,
  )
    .bind(region, root)
    .first<{ id: string; polygonTxHash: string | null; status: string }>();
  if (existing) {
    return Response.json({
      ok: true,
      region,
      anchored: existing.status === "anchored",
      anchorId: existing.id,
      merkleRoot: root,
      polygonTxHash: existing.polygonTxHash,
      reason: "duplicate_root",
    });
  }

  const ts = Math.floor(Date.now() / 1000);
  const anchorId = crypto.randomUUID();
  const first = events[0]!;
  const last = events[events.length - 1]!;
  const anchor = resolveAnchor(env);
  const onChain = await anchor.anchor({ merkleRoot: root, ts });

  const status = onChain.onChain ? "anchored" : "pending";

  await env.DB.prepare(
    `INSERT INTO audit_anchors
       (id, region, first_event_id, last_event_id, event_count, merkle_root,
        polygon_tx_hash, polygon_block, status, created_at, anchored_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      anchorId,
      region,
      first.id,
      last.id,
      events.length,
      root,
      onChain.txHash,
      onChain.block,
      status,
      ts,
      onChain.onChain ? ts : null,
    )
    .run();

  return Response.json({
    ok: true,
    region,
    anchored: onChain.onChain,
    anchorId,
    merkleRoot: root,
    polygonTxHash: onChain.txHash,
    polygonBlock: onChain.block,
    eventCount: events.length,
    firstEventId: first.id,
    lastEventId: last.id,
  });
};
