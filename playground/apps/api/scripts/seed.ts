/**
 * Seed script — idempotent inserts for the 14 categories, ~35 subcategories,
 * and the 10 featured models with full Phase 2 catalog metadata.
 *
 * Two modes:
 *   1. **CLI mode** (`pnpm run db:seed:emit`): prints SQL to stdout so you
 *      can pipe it into `wrangler d1 execute gefi --env <env> --file=…`.
 *   2. **Programmatic mode** (`seed(db)`): runs against a D1Database binding;
 *      used by Vitest tests with a stub D1.
 *
 * Both use `INSERT OR IGNORE` so re-running is a no-op once seeded. The
 * UPDATE statements at the top of `0002_catalog.sql` (rename
 * risk-modelling → risk-assessment) are also idempotent.
 */
import { CATEGORIES } from "../src/data/categories.js";
import { FEATURED_MODELS } from "../src/data/featured-models.js";
import { SUBCATEGORIES } from "../src/data/subcategories.js";

interface MinimalD1 {
  prepare(query: string): {
    bind(...values: unknown[]): { run(): Promise<unknown> };
  };
}

export async function seed(
  db: MinimalD1,
  now = Math.floor(Date.now() / 1000),
): Promise<{ categories: number; subcategories: number; models: number }> {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i]!;
    await db
      .prepare(
        "INSERT OR IGNORE INTO categories (slug, name, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(c.slug, c.name, c.description, c.icon, i)
      .run();
  }

  // Group subcategories by category for stable per-category ordering.
  const byCategory = new Map<string, number>();
  for (const s of SUBCATEGORIES) {
    const order = byCategory.get(s.category_slug) ?? 0;
    byCategory.set(s.category_slug, order + 1);
    await db
      .prepare(
        "INSERT OR IGNORE INTO subcategories (slug, category_slug, name, sort_order) VALUES (?, ?, ?, ?)",
      )
      .bind(s.slug, s.category_slug, s.name, order)
      .run();
  }

  for (const m of FEATURED_MODELS) {
    await db
      .prepare(
        `INSERT OR IGNORE INTO models
         (slug, name, summary, category_slug, subcategory_slug, developer, status, featured,
          risk_tier, maturity, price_cents, rating_avg, rating_count, trending_score, federated,
          thumbnail_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'draft', 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        m.slug,
        m.name,
        m.summary,
        m.category_slug,
        m.subcategory_slug ?? null,
        m.developer,
        m.risk_tier,
        m.maturity,
        m.price_cents,
        m.rating_avg,
        m.rating_count,
        m.trending_score,
        m.federated ? 1 : 0,
        m.thumbnail_url ?? null,
        now,
        now,
      )
      .run();
  }

  return {
    categories: CATEGORIES.length,
    subcategories: SUBCATEGORIES.length,
    models: FEATURED_MODELS.length,
  };
}

/** Emit a self-contained SQL file equivalent to `seed(db)`. */
export function emitSeedSql(now = Math.floor(Date.now() / 1000)): string {
  const escape = (s: string) => s.replace(/'/g, "''");
  const sqlValue = (v: string | number | null) =>
    v === null ? "NULL" : typeof v === "number" ? String(v) : `'${escape(v)}'`;
  const lines: string[] = ["BEGIN;"];

  CATEGORIES.forEach((c, i) => {
    lines.push(
      `INSERT OR IGNORE INTO categories (slug, name, description, icon, sort_order) VALUES (${sqlValue(c.slug)}, ${sqlValue(c.name)}, ${sqlValue(c.description)}, ${sqlValue(c.icon)}, ${i});`,
    );
  });

  const byCategory = new Map<string, number>();
  for (const s of SUBCATEGORIES) {
    const order = byCategory.get(s.category_slug) ?? 0;
    byCategory.set(s.category_slug, order + 1);
    lines.push(
      `INSERT OR IGNORE INTO subcategories (slug, category_slug, name, sort_order) VALUES (${sqlValue(s.slug)}, ${sqlValue(s.category_slug)}, ${sqlValue(s.name)}, ${order});`,
    );
  }

  for (const m of FEATURED_MODELS) {
    lines.push(
      `INSERT OR IGNORE INTO models (slug, name, summary, category_slug, subcategory_slug, developer, status, featured, risk_tier, maturity, price_cents, rating_avg, rating_count, trending_score, federated, thumbnail_url, created_at, updated_at) VALUES (${sqlValue(m.slug)}, ${sqlValue(m.name)}, ${sqlValue(m.summary)}, ${sqlValue(m.category_slug)}, ${sqlValue(m.subcategory_slug ?? null)}, ${sqlValue(m.developer)}, 'draft', 1, ${sqlValue(m.risk_tier)}, ${sqlValue(m.maturity)}, ${m.price_cents}, ${m.rating_avg}, ${m.rating_count}, ${m.trending_score}, ${m.federated ? 1 : 0}, ${sqlValue(m.thumbnail_url ?? null)}, ${now}, ${now});`,
    );
  }

  lines.push("COMMIT;");
  return lines.join("\n") + "\n";
}

// CLI entry: `node --experimental-strip-types scripts/seed.ts` (or via tsx).
const isCli =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  /seed\.(ts|js|mjs)$/.test(process.argv[1]);
if (isCli) {
  process.stdout.write(emitSeedSql());
}
