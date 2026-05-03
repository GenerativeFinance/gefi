/**
 * Models catalog repository.
 *
 * The API route (`GET /api/models`) talks to a `ModelsRepository` interface,
 * not D1 directly, so tests can use an in-memory implementation. Two
 * implementations live alongside each other:
 *
 *   - `D1ModelsRepository`        — production / staging / dev (this file)
 *   - `InMemoryModelsRepository`  — tests (test-helpers.ts)
 *
 * Pagination uses an opaque cursor (`base64url(JSON({sortValue, slug}))`)
 * that pins the last row's sort key + slug, so the next page consumer just
 * passes it back. Pages are stable across inserts as long as the sort key
 * + slug pair never changes.
 */

export type Sort =
  | "trending"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export type Risk = "low" | "medium" | "high";
export type Maturity = "experimental" | "beta" | "staging" | "production";

export const VALID_SORTS: ReadonlySet<Sort> = new Set([
  "trending",
  "newest",
  "price-asc",
  "price-desc",
  "rating",
]);
export const VALID_RISKS: ReadonlySet<Risk> = new Set(["low", "medium", "high"]);
export const VALID_MATURITIES: ReadonlySet<Maturity> = new Set([
  "experimental",
  "beta",
  "staging",
  "production",
]);

export const PAGE_SIZE = 24;

export interface ModelRow {
  slug: string;
  name: string;
  summary: string;
  category_slug: string;
  subcategory_slug: string | null;
  developer: string;
  status: "draft" | "approved" | "deprecated";
  featured: number;
  risk_tier: Risk;
  maturity: Maturity;
  price_cents: number;
  rating_avg: number;
  rating_count: number;
  trending_score: number;
  federated: number;
  thumbnail_url: string | null;
  created_at: number;
  updated_at: number;
}

export interface ModelDTO {
  slug: string;
  name: string;
  summary: string;
  category: string;
  subcategory: string | null;
  developer: string;
  riskLevel: Risk;
  maturity: Maturity;
  price: number;
  rating: number;
  ratingCount: number;
  federated: boolean;
  thumbnailUrl: string | null;
  href: string;
}

export function rowToDto(row: ModelRow): ModelDTO {
  return {
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    category: row.category_slug,
    subcategory: row.subcategory_slug,
    developer: row.developer,
    riskLevel: row.risk_tier,
    maturity: row.maturity,
    price: row.price_cents,
    rating: row.rating_avg,
    ratingCount: row.rating_count,
    federated: row.federated === 1,
    thumbnailUrl: row.thumbnail_url,
    href: `/models/${row.slug}/`,
  };
}

export interface ListModelsQuery {
  category?: string;
  subcategory?: string;
  q?: string;
  risk?: Risk;
  maturity?: Maturity;
  featured?: boolean;
  sort: Sort;
  limit: number;
  cursor?: { sortValue: number; slug: string };
}

export interface ModelsRepository {
  /** Returns up to `query.limit + 1` rows so the caller can detect a next page. */
  list(query: ListModelsQuery): Promise<ModelRow[]>;
}

export interface ListModelsResponse {
  items: ModelDTO[];
  next_cursor: string | null;
}

// ── Cursor encoding ────────────────────────────────────────────────────────
function b64UrlEncode(s: string): string {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function b64UrlDecode(s: string): string {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return atob(padded + pad);
}

export function encodeCursor(row: ModelRow, sort: Sort): string {
  const sortValue = sortValueOf(row, sort);
  return b64UrlEncode(JSON.stringify({ s: sortValue, k: row.slug }));
}

export function decodeCursor(s: string | null | undefined): { sortValue: number; slug: string } | null {
  if (!s) return null;
  try {
    const parsed = JSON.parse(b64UrlDecode(s)) as { s?: unknown; k?: unknown };
    if (typeof parsed.s !== "number" || typeof parsed.k !== "string") return null;
    return { sortValue: parsed.s, slug: parsed.k };
  } catch {
    return null;
  }
}

export function sortValueOf(row: ModelRow, sort: Sort): number {
  switch (sort) {
    case "trending":
      return row.trending_score;
    case "newest":
      return row.created_at;
    case "price-asc":
    case "price-desc":
      return row.price_cents;
    case "rating":
      return row.rating_avg;
  }
}

/** Returns "DESC" for sorts where bigger values come first. */
export function sortDirection(sort: Sort): "ASC" | "DESC" {
  return sort === "price-asc" ? "ASC" : "DESC";
}

/**
 * Orchestrates a list call: the repo returns up to limit+1 rows; we slice to
 * `limit`, build the next cursor from the last surviving row, and DTO-map.
 */
export async function listModels(
  repo: ModelsRepository,
  query: ListModelsQuery,
): Promise<ListModelsResponse> {
  const rows = await repo.list(query);
  const hasMore = rows.length > query.limit;
  const page = hasMore ? rows.slice(0, query.limit) : rows;
  const last = page[page.length - 1];
  const next_cursor = hasMore && last ? encodeCursor(last, query.sort) : null;
  return { items: page.map(rowToDto), next_cursor };
}

// ── Parse + validate query string for the route ────────────────────────────
export function parseListQuery(searchParams: URLSearchParams): ListModelsQuery {
  const sortRaw = searchParams.get("sort");
  const sort: Sort =
    sortRaw && (VALID_SORTS as Set<string>).has(sortRaw) ? (sortRaw as Sort) : "trending";

  const riskRaw = searchParams.get("risk");
  const risk =
    riskRaw && (VALID_RISKS as Set<string>).has(riskRaw) ? (riskRaw as Risk) : undefined;

  const maturityRaw = searchParams.get("maturity");
  const maturity =
    maturityRaw && (VALID_MATURITIES as Set<string>).has(maturityRaw)
      ? (maturityRaw as Maturity)
      : undefined;

  const limitRaw = Number(searchParams.get("limit"));
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, PAGE_SIZE) : PAGE_SIZE;

  const featuredRaw = searchParams.get("featured");
  const featured =
    featuredRaw === "1" || featuredRaw === "true"
      ? true
      : featuredRaw === "0" || featuredRaw === "false"
        ? false
        : undefined;

  const q = searchParams.get("q")?.trim() || undefined;
  const category = searchParams.get("category")?.trim() || undefined;
  const subcategory = searchParams.get("subcategory")?.trim() || undefined;
  const cursor = decodeCursor(searchParams.get("cursor")) ?? undefined;

  return { category, subcategory, q, risk, maturity, featured, sort, limit, cursor };
}

// ── D1-backed implementation ───────────────────────────────────────────────
export class D1ModelsRepository implements ModelsRepository {
  constructor(private readonly db: D1Database) {}

  async list(query: ListModelsQuery): Promise<ModelRow[]> {
    const wheres: string[] = [];
    const binds: unknown[] = [];

    if (query.category) {
      wheres.push("category_slug = ?");
      binds.push(query.category);
    }
    if (query.subcategory) {
      wheres.push("subcategory_slug = ?");
      binds.push(query.subcategory);
    }
    if (query.risk) {
      wheres.push("risk_tier = ?");
      binds.push(query.risk);
    }
    if (query.maturity) {
      wheres.push("maturity = ?");
      binds.push(query.maturity);
    }
    if (query.featured !== undefined) {
      wheres.push("featured = ?");
      binds.push(query.featured ? 1 : 0);
    }
    if (query.q) {
      wheres.push("(LOWER(name) LIKE ? OR LOWER(summary) LIKE ?)");
      const needle = `%${query.q.toLowerCase()}%`;
      binds.push(needle, needle);
    }

    const sortColumn = sortColumnFor(query.sort);
    const dir = sortDirection(query.sort);

    if (query.cursor) {
      // Tuple comparison: (sort, slug) strictly after cursor in chosen direction.
      // For DESC: sort < c.sort OR (sort = c.sort AND slug > c.slug)
      // For ASC : sort > c.sort OR (sort = c.sort AND slug > c.slug)
      const op = dir === "DESC" ? "<" : ">";
      wheres.push(`(${sortColumn} ${op} ? OR (${sortColumn} = ? AND slug > ?))`);
      binds.push(query.cursor.sortValue, query.cursor.sortValue, query.cursor.slug);
    }

    const whereSql = wheres.length === 0 ? "" : `WHERE ${wheres.join(" AND ")}`;
    const sql = `
      SELECT slug, name, summary, category_slug, subcategory_slug, developer, status,
             featured, risk_tier, maturity, price_cents, rating_avg, rating_count,
             trending_score, federated, thumbnail_url, created_at, updated_at
        FROM models
        ${whereSql}
       ORDER BY ${sortColumn} ${dir}, slug ASC
       LIMIT ?
    `;
    binds.push(query.limit + 1);

    const stmt = this.db.prepare(sql).bind(...binds);
    const result = await stmt.all<ModelRow>();
    return result.results ?? [];
  }
}

function sortColumnFor(sort: Sort): string {
  switch (sort) {
    case "trending":
      return "trending_score";
    case "newest":
      return "created_at";
    case "price-asc":
    case "price-desc":
      return "price_cents";
    case "rating":
      return "rating_avg";
  }
}
