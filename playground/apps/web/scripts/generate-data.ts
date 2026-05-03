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

import { Hono } from "hono";
import { CATEGORIES } from "../../api/src/data/categories.ts";
import { SUBCATEGORIES } from "../../api/src/data/subcategories.ts";
import { FEATURED_MODELS } from "../../api/src/data/featured-models.ts";
import { type ModelRow } from "../../api/src/lib/models-repo.ts";
import {
  InMemoryModelsRepository,
  InMemoryDetailRepository,
} from "../../api/src/test-helpers.ts";
import { modelsRoutes } from "../../api/src/routes/models.ts";
import { detailRoutes } from "../../api/src/routes/detail.ts";

import { AUDITS } from "../../api/src/data/audits.ts";
import { METRICS } from "../../api/src/data/metrics.ts";

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(here, "..");
const dataDir = join(webRoot, "_data");
const collectionDir = join(webRoot, "_categories");
const modelsCollectionDir = join(webRoot, "_models");
const modelsDataDir = join(dataDir, "models");

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
  await mkdir(modelsCollectionDir, { recursive: true });
  await mkdir(modelsDataDir, { recursive: true });

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

  // Stand up an in-process copy of the Worker so the generator consumes the
  // exact `/api/models?…` endpoints the browser hits at runtime. Routes are
  // registered in the same order as `apps/api/src/index.ts` (detail before
  // catalog) so `/api/models/:slug` resolves to the detail handler. Using
  // `app.request(...)` exercises Hono's full middleware + routing stack.
  const rows = FEATURED_MODELS.map(toRow);
  const modelsRepo = new InMemoryModelsRepository(rows);
  const detailRepo = new InMemoryDetailRepository({
    models: rows,
    versions: METRICS.map((m) => ({
      model_slug: m.model_slug,
      version: m.version,
      version_label: m.version_label,
      metrics: JSON.stringify(m.metrics),
      created_at: 1730_000_000,
    })),
    audits: AUDITS.map((a) => ({
      id: a.id,
      model_slug: a.model_slug,
      auditor: a.auditor,
      standard: a.standard,
      audited_at: a.audited_at,
      passed: a.passed ? 1 : 0,
      hash: a.hash,
    })),
  });
  const app = new Hono();
  app.route(
    "/api/models",
    detailRoutes({ repository: detailRepo, resolveUserId: () => null }),
  );
  app.route("/api/models", modelsRoutes({ repository: modelsRepo }));

  async function apiJson<T>(path: string): Promise<T> {
    const res = await app.request(path);
    if (!res.ok) throw new Error(`api ${path} → ${res.status}`);
    return (await res.json()) as T;
  }

  // Featured rail (same call the home page makes at runtime).
  const featuredResp = await apiJson<{
    items: { slug: string; name: string; category: string }[];
  }>("/api/models?featured=1&limit=10");
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

  // Per-model detail data + collection stub. Sourced from the live
  // `GET /api/models?all=1` + `GET /api/models/:slug` endpoints so the
  // catalog, detail JSON, and runtime API responses stay byte-identical.
  // `favoritedByMe` is necessarily `false` here (no auth at build time);
  // model-actions.js re-fetches /api/models/:slug with credentials on load
  // to rehydrate the watchlist heart for signed-in users.
  const allResp = await apiJson<{
    items: { slug: string; name: string; summary: string; category: string; riskLevel: string }[];
  }>("/api/models?all=1");

  for (const m of allResp.items) {
    const detail = await apiJson<Record<string, unknown>>(
      `/api/models/${encodeURIComponent(m.slug)}`,
    );
    await writeFile(
      join(modelsDataDir, `${m.slug}.json`),
      JSON.stringify(detail, null, 2) + "\n",
    );
    const md = [
      "---",
      `slug: ${m.slug}`,
      `name: ${JSON.stringify(m.name)}`,
      `summary: ${JSON.stringify(m.summary)}`,
      `category: ${m.category}`,
      `risk_level: ${m.riskLevel}`,
      `permalink: /models/${m.slug}/`,
      `layout: model`,
      "---",
      "",
    ].join("\n");
    await writeFile(join(modelsCollectionDir, `${m.slug}.md`), md);
  }

  process.stdout.write(
    `[generate-data] wrote ${categories.length} categories, ${subcategories.length} subcategories, ${featured.length} featured models, ${allResp.items.length} model detail pages (sourced via in-process /api/models)\n`,
  );
}

void main();
