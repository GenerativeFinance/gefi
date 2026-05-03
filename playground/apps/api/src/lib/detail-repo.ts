/**
 * Detail/audits/reviews/favorites repository.
 *
 * Kept separate from `ModelsRepository` to avoid ballooning the catalog
 * repo: detail-page reads (versions+metrics+audits) and per-user writes
 * (reviews, favorites) have different access patterns. Same pattern:
 * D1-backed for prod, in-memory for tests (see test-helpers.ts).
 */

import type { ModelDTO, ModelRow } from "./models-repo.js";
import { rowToDto } from "./models-repo.js";

export interface AuditRow {
  id: string;
  model_slug: string;
  auditor: string;
  standard: string;
  audited_at: number;
  passed: number; // 0/1
  hash: string;
  created_at: number;
}

export interface ModelVersionRow {
  id: string;
  model_slug: string;
  version: string;
  version_label: string | null;
  metrics: string | null; // JSON-encoded MetricsBlob
  sha256: string | null;
  created_at: number;
}

export interface ReviewRow {
  id: string;
  model_slug: string;
  user_id: string;
  stars: number;
  comment: string;
  created_at: number;
  updated_at: number;
}

/** DTO returned to the client; user_id is omitted, an obfuscated handle is added. */
export interface ReviewDTO {
  id: string;
  stars: number;
  comment: string;
  reviewer: string;
  createdAt: number;
}

/** Stable, non-PII reviewer label derived from the user id. */
export function reviewerHandle(userId: string): string {
  return `user-${userId.slice(0, 6)}`;
}

export function reviewRowToDto(r: ReviewRow): ReviewDTO {
  return {
    id: r.id,
    stars: r.stars,
    comment: r.comment,
    reviewer: reviewerHandle(r.user_id),
    createdAt: r.created_at,
  };
}

export interface ModelDetailDTO extends ModelDTO {
  description: string | null;
  versions: { version: string; label: string | null; createdAt: number }[];
  /** Latest version's metrics blob, parsed. `null` when no version has metrics. */
  metrics: unknown | null;
  audits: {
    id: string;
    auditor: string;
    standard: string;
    auditedAt: number;
    passed: boolean;
    hash: string;
  }[];
  favoritedByMe: boolean;
}

export const REVIEWS_PAGE_SIZE = 20;

export interface ListReviewsResult {
  items: ReviewDTO[];
  next_cursor: string | null;
}

export interface DetailRepository {
  getModelRow(slug: string): Promise<ModelRow | null>;
  getModelDescription(slug: string): Promise<string | null>;
  listVersions(slug: string): Promise<ModelVersionRow[]>;
  listAudits(slug: string): Promise<AuditRow[]>;
  /** Cursor is the millisecond `created_at` of the last item on the previous page. */
  listReviews(slug: string, cursor: number | null, limit: number): Promise<ReviewRow[]>;
  /** Upserts a review and recomputes rating_avg/rating_count atomically. */
  upsertReview(args: {
    slug: string;
    userId: string;
    stars: number;
    comment: string;
    now: number;
    newId: () => string;
  }): Promise<{ review: ReviewRow; ratingAvg: number; ratingCount: number }>;
  isFavorited(userId: string, slug: string): Promise<boolean>;
  /** Returns the new state. */
  toggleFavorite(userId: string, slug: string, now: number): Promise<boolean>;
}

// ── Cursor (numeric created_at) ────────────────────────────────────────────
export function encodeReviewCursor(n: number): string {
  return btoa(String(n)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeReviewCursor(s: string | null | undefined): number | null {
  if (!s) return null;
  try {
    const padded = s.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const n = Number(atob(padded + pad));
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export async function buildModelDetail(
  repo: DetailRepository,
  slug: string,
  userId: string | null,
): Promise<ModelDetailDTO | null> {
  const row = await repo.getModelRow(slug);
  if (!row) return null;
  const [description, versions, audits, favorited] = await Promise.all([
    repo.getModelDescription(slug),
    repo.listVersions(slug),
    repo.listAudits(slug),
    userId ? repo.isFavorited(userId, slug) : Promise.resolve(false),
  ]);
  // Newest version first; metrics blob comes from that version.
  const sorted = versions.slice().sort((a, b) => b.created_at - a.created_at);
  const latest = sorted[0];
  let metrics: unknown | null = null;
  if (latest && latest.metrics) {
    try {
      metrics = JSON.parse(latest.metrics);
    } catch {
      metrics = null;
    }
  }
  return {
    ...rowToDto(row),
    description,
    versions: sorted.map((v) => ({
      version: v.version,
      label: v.version_label,
      createdAt: v.created_at,
    })),
    metrics,
    audits: audits.map((a) => ({
      id: a.id,
      auditor: a.auditor,
      standard: a.standard,
      auditedAt: a.audited_at,
      passed: a.passed === 1,
      hash: a.hash,
    })),
    favoritedByMe: favorited,
  };
}

export async function listReviewsPage(
  repo: DetailRepository,
  slug: string,
  cursorRaw: string | null | undefined,
  limit = REVIEWS_PAGE_SIZE,
): Promise<ListReviewsResult> {
  const cursor = decodeReviewCursor(cursorRaw);
  const rows = await repo.listReviews(slug, cursor, limit + 1);
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];
  return {
    items: page.map(reviewRowToDto),
    next_cursor: hasMore && last ? encodeReviewCursor(last.created_at) : null,
  };
}

// ── D1-backed implementation ───────────────────────────────────────────────
export class D1DetailRepository implements DetailRepository {
  constructor(private readonly db: D1Database) {}

  async getModelRow(slug: string): Promise<ModelRow | null> {
    const r = await this.db
      .prepare(
        `SELECT slug, name, summary, category_slug, subcategory_slug, developer, status,
                featured, risk_tier, maturity, price_cents, rating_avg, rating_count,
                trending_score, federated, thumbnail_url, created_at, updated_at
           FROM models WHERE slug = ?`,
      )
      .bind(slug)
      .first<ModelRow>();
    return r ?? null;
  }

  async getModelDescription(slug: string): Promise<string | null> {
    const r = await this.db
      .prepare("SELECT description FROM models WHERE slug = ?")
      .bind(slug)
      .first<{ description: string | null }>();
    return r?.description ?? null;
  }

  async listVersions(slug: string): Promise<ModelVersionRow[]> {
    const r = await this.db
      .prepare(
        `SELECT id, model_slug, version, version_label, metrics, sha256, created_at
           FROM model_versions WHERE model_slug = ? ORDER BY created_at DESC`,
      )
      .bind(slug)
      .all<ModelVersionRow>();
    return r.results ?? [];
  }

  async listAudits(slug: string): Promise<AuditRow[]> {
    const r = await this.db
      .prepare(
        `SELECT id, model_slug, auditor, standard, audited_at, passed, hash, created_at
           FROM model_audits WHERE model_slug = ? ORDER BY audited_at DESC`,
      )
      .bind(slug)
      .all<AuditRow>();
    return r.results ?? [];
  }

  async listReviews(slug: string, cursor: number | null, limit: number): Promise<ReviewRow[]> {
    if (cursor === null) {
      const r = await this.db
        .prepare(
          `SELECT id, model_slug, user_id, stars, comment, created_at, updated_at
             FROM reviews WHERE model_slug = ?
            ORDER BY created_at DESC, id DESC LIMIT ?`,
        )
        .bind(slug, limit)
        .all<ReviewRow>();
      return r.results ?? [];
    }
    const r = await this.db
      .prepare(
        `SELECT id, model_slug, user_id, stars, comment, created_at, updated_at
           FROM reviews WHERE model_slug = ? AND created_at < ?
          ORDER BY created_at DESC, id DESC LIMIT ?`,
      )
      .bind(slug, cursor, limit)
      .all<ReviewRow>();
    return r.results ?? [];
  }

  async upsertReview(args: {
    slug: string;
    userId: string;
    stars: number;
    comment: string;
    now: number;
    newId: () => string;
  }): Promise<{ review: ReviewRow; ratingAvg: number; ratingCount: number }> {
    const { slug, userId, stars, comment, now, newId } = args;
    // Try update first; if no row matched, insert.
    const existing = await this.db
      .prepare("SELECT id, created_at FROM reviews WHERE model_slug = ? AND user_id = ?")
      .bind(slug, userId)
      .first<{ id: string; created_at: number }>();

    let id: string;
    let createdAt: number;
    if (existing) {
      id = existing.id;
      createdAt = existing.created_at;
      await this.db
        .prepare("UPDATE reviews SET stars = ?, comment = ?, updated_at = ? WHERE id = ?")
        .bind(stars, comment, now, id)
        .run();
    } else {
      id = newId();
      createdAt = now;
      await this.db
        .prepare(
          `INSERT INTO reviews (id, model_slug, user_id, stars, comment, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(id, slug, userId, stars, comment, now, now)
        .run();
    }

    // Recompute aggregates in the same statement so the read-back is consistent.
    const agg = await this.db
      .prepare(
        `SELECT COUNT(*) AS n, COALESCE(AVG(stars), 0) AS avg
           FROM reviews WHERE model_slug = ?`,
      )
      .bind(slug)
      .first<{ n: number; avg: number }>();
    const ratingCount = agg?.n ?? 0;
    const ratingAvg = Math.round(((agg?.avg ?? 0) + Number.EPSILON) * 10) / 10;

    await this.db
      .prepare(
        "UPDATE models SET rating_avg = ?, rating_count = ?, updated_at = ? WHERE slug = ?",
      )
      .bind(ratingAvg, ratingCount, now, slug)
      .run();

    return {
      review: { id, model_slug: slug, user_id: userId, stars, comment, created_at: createdAt, updated_at: now },
      ratingAvg,
      ratingCount,
    };
  }

  async isFavorited(userId: string, slug: string): Promise<boolean> {
    const r = await this.db
      .prepare("SELECT 1 AS x FROM favorites WHERE user_id = ? AND model_slug = ?")
      .bind(userId, slug)
      .first<{ x: number }>();
    return !!r;
  }

  async toggleFavorite(userId: string, slug: string, now: number): Promise<boolean> {
    if (await this.isFavorited(userId, slug)) {
      await this.db
        .prepare("DELETE FROM favorites WHERE user_id = ? AND model_slug = ?")
        .bind(userId, slug)
        .run();
      return false;
    }
    await this.db
      .prepare("INSERT INTO favorites (user_id, model_slug, created_at) VALUES (?, ?, ?)")
      .bind(userId, slug, now)
      .run();
    return true;
  }
}
