/**
 * Bridge that turns the API's catalog source data (single source of truth in
 * `apps/api/src/data/*.ts`) into Jekyll-consumable artifacts:
 *
 *   _data/categories.json    — array, used by category grid + nav
 *   _data/subcategories.json — array
 *   _data/featured.json      — array, used by featured carousel at build time
 *   _categories/<slug>.md    — one Markdown stub per category for the
 *                              `/categories/<slug>/` Jekyll collection page
 *
 * The featured list is built from the same `/api/models?featured=1` code
 * path the Worker serves at runtime — we point `listModels(...)` at an
 * `InMemoryModelsRepository` seeded with `FEATURED_MODELS`, so the carousel
 * shape and ordering match the API byte-for-byte.
 *
 * Runs first via the `predev`/`prebuild` npm hooks so data + collection
 * files are always in sync with the API. Existing `_categories/` files are
 * overwritten on every run (frontmatter is the source of truth).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

import { CATEGORIES } from "../../api/src/data/categories.ts";
import { SUBCATEGORIES } from "../../api/src/data/subcategories.ts";
import { FEATURED_MODELS } from "../../api/src/data/featured-models.ts";
import {
  listModels,
  parseListQuery,
  type ModelRow,
} from "../../api/src/lib/models-repo.ts";
import { InMemoryModelsRepository } from "../../api/src/test-helpers.ts";

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(here, "..");
const dataDir = join(webRoot, "_data");
const collectionDir = join(webRoot, "_categories");

function toRow(m: (typeof FEATURED_MODELS)[number]): ModelRow {
  const now = Math.floor(Date.now() / 1000);
  return {
    slug: m.slug,
    name: m.name,
    summary: m.summary,
    category_slug: m.category_slug,
    subcategory_slug: m.subcategory_slug ?? null,
    developer: m.developer,
    status: "approved",
    featured: 1,
    risk_tier: m.risk_tier,
    maturity: m.maturity,
    price_cents: m.price_cents,
    rating_avg: m.rating_avg,
    rating_count: m.rating_count,
    trending_score: m.trending_score,
    federated: m.federated ? 1 : 0,
    thumbnail_url: m.thumbnail_url ?? null,
    created_at: now,
    updated_at: now,
  };
}

async function main(): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await mkdir(collectionDir, { recursive: true });

  const categories = CATEGORIES.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    icon: c.icon,
    risk_tier: c.risk_tier,
    sort_order: i,
    subcategories: SUBCATEGORIES.filter((s) => s.category_slug === c.slug).map((s) => ({
      slug: s.slug,
      name: s.name,
    })),
  }));

  const subcategories = SUBCATEGORIES.map((s) => ({
    slug: s.slug,
    category_slug: s.category_slug,
    name: s.name,
  }));

  // Build the featured rail through the same listModels orchestration the
  // API uses at runtime — same DTO shape, same default sort (trending).
  const repo = new InMemoryModelsRepository(FEATURED_MODELS.map(toRow));
  const featuredResp = await listModels(
    repo,
    parseListQuery(new URLSearchParams("featured=1&limit=10")),
  );
  const featured = featuredResp.items;

  await writeFile(join(dataDir, "categories.json"), JSON.stringify(categories, null, 2) + "\n");
  await writeFile(
    join(dataDir, "subcategories.json"),
    JSON.stringify(subcategories, null, 2) + "\n",
  );
  await writeFile(join(dataDir, "featured.json"), JSON.stringify(featured, null, 2) + "\n");

  for (const c of categories) {
    const md = [
      "---",
      `slug: ${c.slug}`,
      `name: ${JSON.stringify(c.name)}`,
      `description: ${JSON.stringify(c.description)}`,
      `icon: ${c.icon}`,
      `risk_tier: ${c.risk_tier}`,
      `permalink: /categories/${c.slug}/`,
      `layout: category`,
      `subcategories:`,
      ...c.subcategories.map((s) => `  - { slug: ${s.slug}, name: ${JSON.stringify(s.name)} }`),
      "---",
      "",
    ].join("\n");
    await writeFile(join(collectionDir, `${c.slug}.md`), md);
  }

  process.stdout.write(
    `[generate-data] wrote ${categories.length} categories, ${subcategories.length} subcategories, ${featured.length} featured models\n`,
  );
}

void main();
