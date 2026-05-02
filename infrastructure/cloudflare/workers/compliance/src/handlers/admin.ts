/**
 * Admin-only endpoints.
 *
 *   POST /admin/seed-directory   — populate `lawyer_directory` +
 *                                  `auditor_directory` from the static seeds
 *                                  in `@gefi/compliance-engine`. Idempotent.
 *
 *   POST /admin/anchor           — close out a day's audit chain into a
 *                                  Merkle tree, write the root to
 *                                  `audit_anchors`, and (if Polygon creds
 *                                  present) hand it to the on-chain anchor.
 *
 *                                  Body (JSON, optional):
 *                                    region : "us" | "eu"   (default: WORKER_REGION)
 *                                    day    : "YYYY-MM-DD"  (default: today UTC)
 *
 *                                  Idempotent: re-anchoring an unchanged range
 *                                  returns the existing anchor row without
 *                                  issuing a second Polygon TX.
 */

import { buildMerkle, resolveAnchor } from "@gefi/compliance-engine";
import type { Region } from "@gefi/shared-types";
import { listAuditEvents, seedAuditorDirectory, seedLawyerDirectory } from "../lib/audit-store.js";
import type { Handler } from "../router.js";

export const adminSeedDirectoryHandler: Handler = async ({ env }) => {
  const lawyer = await seedLawyerDirectory(env.DB);
  const auditor = await seedAuditorDirectory(env.DB);
  return Response.json({
    ok: true,
    lawyer,
    auditor,
    inserted: lawyer.inserted + auditor.inserted,
    skipped: lawyer.skipped + auditor.skipped,
  });
};

interface AnchorBody {
  region?: Region;
  /** UTC date string "YYYY-MM-DD". Defaults to today in UTC. */
  day?: string;
}

/** Convert "YYYY-MM-DD" to the start/end UNIX seconds for that UTC day. */
function dayBounds(day: string): { start: number; end: number } {
  const start = Math.floor(new Date(`${day}T00:00:00Z`).getTime() / 1000);
  const end = start + 86400 - 1; // inclusive last second of the day
  return { start, end };
}

/** Return today's UTC date as "YYYY-MM-DD". */
function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
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
  const day = body.day ?? todayUtc();

  // Validate day format.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return Response.json({ ok: false, error: "invalid_day_format", expected: "YYYY-MM-DD" }, { status: 400 });
  }
  const { start, end } = dayBounds(day);

  // Fetch only events that fall inside this UTC day window.
  // `listAuditEvents` now accepts an optional time range filter applied
  // via `chain_index` boundaries; we use `created_at` here via a separate
  // query so the returned events are scoped to the day bucket.
  const allEvents = await listAuditEvents(env.DB, region);
  const dayEvents = allEvents.filter((e) => e.createdAt >= start && e.createdAt <= end);

  if (dayEvents.length === 0) {
    return Response.json({ ok: true, region, day, anchored: false, reason: "no_events_for_day" });
  }

  const leaves = dayEvents.map((e) => e.eventHash);
  const { root } = await buildMerkle(leaves);

  // Idempotency: if an anchor already exists for this (region, day, root)
  // return it without issuing another TX.
  const existing = await env.DB.prepare(
    `SELECT id, polygon_tx_hash AS polygonTxHash, status
       FROM audit_anchors
      WHERE region = ? AND day_bucket = ? AND merkle_root = ?
      ORDER BY created_at DESC LIMIT 1`,
  )
    .bind(region, day, root)
    .first<{ id: string; polygonTxHash: string | null; status: string }>();

  if (existing) {
    return Response.json({
      ok: true,
      region,
      day,
      anchored: existing.status === "anchored",
      anchorId: existing.id,
      merkleRoot: root,
      polygonTxHash: existing.polygonTxHash,
      reason: "duplicate_root",
    });
  }

  const ts = Math.floor(Date.now() / 1000);
  const anchorId = crypto.randomUUID();
  const first = dayEvents[0]!;
  const last = dayEvents[dayEvents.length - 1]!;
  const anchor = resolveAnchor(env);
  const onChain = await anchor.anchor({ merkleRoot: root, ts });

  const status = onChain.onChain ? "anchored" : "pending";

  await env.DB.prepare(
    `INSERT INTO audit_anchors
       (id, region, day_bucket, first_event_id, last_event_id, event_count, merkle_root,
        polygon_tx_hash, polygon_block, status, created_at, anchored_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      anchorId,
      region,
      day,
      first.id,
      last.id,
      dayEvents.length,
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
    day,
    anchored: onChain.onChain,
    anchorId,
    merkleRoot: root,
    polygonTxHash: onChain.txHash,
    polygonBlock: onChain.block,
    eventCount: dayEvents.length,
    firstEventId: first.id,
    lastEventId: last.id,
  });
};
