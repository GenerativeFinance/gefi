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
import { AUDITS } from "../src/data/audits.js";
import { METRICS } from "../src/data/metrics.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../src/data/playground-mocks.js";
import { MODEL_HANDLERS } from "../src/models/index.js";

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

  for (const m of METRICS) {
    await db
      .prepare(
        `INSERT OR IGNORE INTO model_versions
         (id, model_slug, version, version_label, artifact_key, sha256, metrics, created_at)
         VALUES (?, ?, ?, ?, NULL, ?, ?, ?)`,
      )
      .bind(
        `mv_${m.model_slug}_${m.version}`,
        m.model_slug,
        m.version,
        m.version_label,
        `sha256-stub-${m.model_slug}`,
        JSON.stringify(m.metrics),
        now,
      )
      .run();
  }

  for (const a of AUDITS) {
    await db
      .prepare(
        `INSERT OR IGNORE INTO model_audits
         (id, model_slug, auditor, standard, audited_at, passed, hash, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        a.id,
        a.model_slug,
        a.auditor,
        a.standard,
        a.audited_at,
        a.passed ? 1 : 0,
        a.hash,
        now,
      )
      .run();
  }

  // ── Phase 4: write playground input/output schemas + training flag ──────
  // Re-runnable: UPDATEs are idempotent. We update *all* versions for a
  // slug, but each seed writes exactly one version per model so this is a
  // 1:1 update in practice.
  for (const m of PLAYGROUND_MOCKS_BY_SLUG.values()) {
    await db
      .prepare(`UPDATE models SET training_enabled = ?, updated_at = ? WHERE slug = ?`)
      .bind(m.trainingEnabled ? 1 : 0, now, m.slug)
      .run();
    await db
      .prepare(
        `UPDATE model_versions SET input_schema = ?, output_schema = ? WHERE model_slug = ?`,
      )
      .bind(JSON.stringify(m.inputSchema), JSON.stringify(m.outputSchema), m.slug)
      .run();
  }

  // ── Phase 6: write runtime selector per real handler ───────────────────
  for (const [slug, h] of MODEL_HANDLERS) {
    await db
      .prepare(`UPDATE model_versions SET runtime = ? WHERE model_slug = ?`)
      .bind(h.runtime, slug)
      .run();
  }

  return {
    categories: CATEGORIES.length,
    subcategories: SUBCATEGORIES.length,
    models: FEATURED_MODELS.length,
    audits: AUDITS.length,
    metrics: METRICS.length,
    playgroundMocks: PLAYGROUND_MOCKS_BY_SLUG.size,
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

  for (const m of METRICS) {
    lines.push(
      `INSERT OR IGNORE INTO model_versions (id, model_slug, version, version_label, artifact_key, sha256, metrics, created_at) VALUES (${sqlValue("mv_" + m.model_slug + "_" + m.version)}, ${sqlValue(m.model_slug)}, ${sqlValue(m.version)}, ${sqlValue(m.version_label)}, NULL, ${sqlValue("sha256-stub-" + m.model_slug)}, ${sqlValue(JSON.stringify(m.metrics))}, ${now});`,
    );
  }

  for (const a of AUDITS) {
    lines.push(
      `INSERT OR IGNORE INTO model_audits (id, model_slug, auditor, standard, audited_at, passed, hash, created_at) VALUES (${sqlValue(a.id)}, ${sqlValue(a.model_slug)}, ${sqlValue(a.auditor)}, ${sqlValue(a.standard)}, ${a.audited_at}, ${a.passed ? 1 : 0}, ${sqlValue(a.hash)}, ${now});`,
    );
  }

  // Phase 4: training-enabled flag + per-version JSON schemas.
  for (const m of PLAYGROUND_MOCKS_BY_SLUG.values()) {
    lines.push(
      `UPDATE models SET training_enabled = ${m.trainingEnabled ? 1 : 0}, updated_at = ${now} WHERE slug = ${sqlValue(m.slug)};`,
    );
    lines.push(
      `UPDATE model_versions SET input_schema = ${sqlValue(JSON.stringify(m.inputSchema))}, output_schema = ${sqlValue(JSON.stringify(m.outputSchema))} WHERE model_slug = ${sqlValue(m.slug)};`,
    );
  }

  // Phase 6: per-handler runtime selector.
  for (const [slug, h] of MODEL_HANDLERS) {
    lines.push(
      `UPDATE model_versions SET runtime = ${sqlValue(h.runtime)} WHERE model_slug = ${sqlValue(slug)};`,
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
