/**
 * Seed script — idempotent inserts for the 14 categories + 10 featured models.
 *
 * Two modes:
 *   1. **CLI mode** (`pnpm run db:seed:emit`): prints the SQL to stdout so you
 *      can pipe it into `wrangler d1 execute gefi --env <env> --file=…`.
 *   2. **Programmatic mode** (`seed(db)`): runs against a D1Database binding;
 *      used by Vitest tests with a stub D1.
 *
 * Both use `INSERT OR IGNORE` so re-running is a no-op once seeded.
 */
import { CATEGORIES } from "../src/data/categories.js";
import { FEATURED_MODELS } from "../src/data/featured-models.js";

interface MinimalD1 {
  prepare(query: string): {
    bind(...values: unknown[]): { run(): Promise<unknown> };
  };
}

export async function seed(db: MinimalD1, now = Math.floor(Date.now() / 1000)): Promise<{
  categories: number;
  models: number;
}> {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await db
      .prepare(
        "INSERT OR IGNORE INTO categories (slug, name, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(c.slug, c.name, c.description, c.icon, i)
      .run();
  }
  for (const m of FEATURED_MODELS) {
    await db
      .prepare(
        "INSERT OR IGNORE INTO models (slug, name, summary, category_slug, developer, status, featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'draft', 1, ?, ?)",
      )
      .bind(m.slug, m.name, m.summary, m.category_slug, m.developer, now, now)
      .run();
  }
  return { categories: CATEGORIES.length, models: FEATURED_MODELS.length };
}

/** Emit a self-contained SQL file equivalent to `seed(db)`. */
export function emitSeedSql(now = Math.floor(Date.now() / 1000)): string {
  const escape = (s: string) => s.replace(/'/g, "''");
  const lines: string[] = ["BEGIN;"];
  CATEGORIES.forEach((c, i) => {
    lines.push(
      `INSERT OR IGNORE INTO categories (slug, name, description, icon, sort_order) VALUES ('${escape(c.slug)}', '${escape(c.name)}', '${escape(c.description)}', '${escape(c.icon)}', ${i});`,
    );
  });
  for (const m of FEATURED_MODELS) {
    lines.push(
      `INSERT OR IGNORE INTO models (slug, name, summary, category_slug, developer, status, featured, created_at, updated_at) VALUES ('${escape(m.slug)}', '${escape(m.name)}', '${escape(m.summary)}', '${escape(m.category_slug)}', '${escape(m.developer)}', 'draft', 1, ${now}, ${now});`,
    );
  }
  lines.push("COMMIT;");
  return lines.join("\n") + "\n";
}

// CLI entry: `node --experimental-strip-types scripts/seed.ts`
const isCli =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  /seed\.(ts|js|mjs)$/.test(process.argv[1]);
if (isCli) {
  process.stdout.write(emitSeedSql());
}
