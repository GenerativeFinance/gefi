/**
 * Catalog API tests — exercises filter combinations, cursor pagination,
 * empty-result handling, sort ordering, and limit caps via the in-memory
 * repository so we don't depend on miniflare D1.
 */
import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { modelsRoutes } from "./models.js";
import { InMemoryModelsRepository } from "../test-helpers.js";
import type { ModelRow } from "../lib/models-repo.js";

function row(overrides: Partial<ModelRow> = {}): ModelRow {
  return {
    slug: "m",
    name: "Model",
    summary: "summary",
    category_slug: "sentiment-analysis",
    subcategory_slug: null,
    developer: "GeFi Labs",
    status: "draft",
    featured: 0,
    risk_tier: "low",
    maturity: "production",
    price_cents: 1000,
    rating_avg: 4.0,
    rating_count: 10,
    trending_score: 0.5,
    federated: 0,
    thumbnail_url: null,
    created_at: 1_700_000_000,
    updated_at: 1_700_000_000,
    ...overrides,
  };
}

function makeApp(rows: ModelRow[]) {
  const repo = new InMemoryModelsRepository(rows);
  const app = new Hono();
  app.route("/api/models", modelsRoutes({ repository: repo }));
  return app;
}

async function fetchJson(app: Hono, path: string) {
  const res = await app.request(path);
  expect(res.status).toBe(200);
  return (await res.json()) as { items: { slug: string }[]; next_cursor: string | null };
}

describe("GET /api/models", () => {
  it("returns trending top-N by default", async () => {
    const app = makeApp([
      row({ slug: "a", trending_score: 0.1 }),
      row({ slug: "b", trending_score: 0.9 }),
      row({ slug: "c", trending_score: 0.5 }),
    ]);
    const body = await fetchJson(app, "/api/models");
    expect(body.items.map((m) => m.slug)).toEqual(["b", "c", "a"]);
    expect(body.next_cursor).toBeNull();
  });

  it("filters by category + risk + maturity together", async () => {
    const app = makeApp([
      row({ slug: "x", category_slug: "risk-assessment", risk_tier: "high", maturity: "production" }),
      row({ slug: "y", category_slug: "risk-assessment", risk_tier: "low", maturity: "production" }),
      row({ slug: "z", category_slug: "credit-scoring", risk_tier: "high", maturity: "production" }),
      row({ slug: "w", category_slug: "risk-assessment", risk_tier: "high", maturity: "beta" }),
    ]);
    const body = await fetchJson(
      app,
      "/api/models?category=risk-assessment&risk=high&maturity=production",
    );
    expect(body.items.map((m) => m.slug)).toEqual(["x"]);
  });

  it("filters by subcategory", async () => {
    const app = makeApp([
      row({ slug: "var-1", category_slug: "risk-assessment", subcategory_slug: "var" }),
      row({ slug: "var-2", category_slug: "risk-assessment", subcategory_slug: "var" }),
      row({ slug: "ttv", category_slug: "risk-assessment", subcategory_slug: "tail-risk" }),
    ]);
    const body = await fetchJson(app, "/api/models?subcategory=var");
    expect(body.items.map((m) => m.slug).sort()).toEqual(["var-1", "var-2"]);
  });

  it("supports the featured=1 filter for the marketplace home", async () => {
    const app = makeApp([
      row({ slug: "f1", featured: 1, trending_score: 0.9 }),
      row({ slug: "f2", featured: 1, trending_score: 0.7 }),
      row({ slug: "n1", featured: 0, trending_score: 0.99 }),
    ]);
    const body = await fetchJson(app, "/api/models?featured=1");
    expect(body.items.map((m) => m.slug)).toEqual(["f1", "f2"]);
  });

  it("free-text search hits both name and summary, case-insensitive", async () => {
    const app = makeApp([
      row({ slug: "credit-oracle", name: "Privacy-First Federated Credit Oracle", summary: "PD" }),
      row({ slug: "vol", name: "FX Volatility", summary: "credit-spread feature too" }),
      row({ slug: "other", name: "ESG", summary: "unrelated" }),
    ]);
    const body = await fetchJson(app, "/api/models?q=credit");
    expect(body.items.map((m) => m.slug).sort()).toEqual(["credit-oracle", "vol"]);
  });

  it("respects sort=price-asc and sort=price-desc", async () => {
    const rows = [
      row({ slug: "cheap", price_cents: 100 }),
      row({ slug: "mid", price_cents: 5000 }),
      row({ slug: "exp", price_cents: 99000 }),
    ];
    const app = makeApp(rows);
    const asc = await fetchJson(app, "/api/models?sort=price-asc");
    expect(asc.items.map((m) => m.slug)).toEqual(["cheap", "mid", "exp"]);
    const desc = await fetchJson(app, "/api/models?sort=price-desc");
    expect(desc.items.map((m) => m.slug)).toEqual(["exp", "mid", "cheap"]);
  });

  it("cursor pagination walks past page boundaries without gaps or duplicates", async () => {
    const rows = Array.from({ length: 30 }, (_, i) =>
      row({ slug: `m${String(i).padStart(2, "0")}`, trending_score: 1 - i * 0.01 }),
    );
    const app = makeApp(rows);
    const limit = 24;
    const page1 = await fetchJson(app, `/api/models?limit=${limit}`);
    expect(page1.items).toHaveLength(limit);
    expect(page1.next_cursor).toBeTruthy();

    const page2 = await fetchJson(
      app,
      `/api/models?limit=${limit}&cursor=${encodeURIComponent(page1.next_cursor!)}`,
    );
    expect(page2.items).toHaveLength(6);
    expect(page2.next_cursor).toBeNull();

    const seen = [...page1.items, ...page2.items].map((m) => m.slug);
    expect(new Set(seen).size).toBe(30);
  });

  it("returns empty items + null cursor when nothing matches", async () => {
    const app = makeApp([row({ slug: "a", category_slug: "sentiment-analysis" })]);
    const body = await fetchJson(app, "/api/models?category=does-not-exist");
    expect(body.items).toEqual([]);
    expect(body.next_cursor).toBeNull();
  });

  it("caps limit at the page-size ceiling", async () => {
    const rows = Array.from({ length: 30 }, (_, i) =>
      row({ slug: `m${String(i).padStart(2, "0")}`, trending_score: 1 - i * 0.01 }),
    );
    const app = makeApp(rows);
    const body = await fetchJson(app, "/api/models?limit=999");
    expect(body.items).toHaveLength(24);
  });

  it("falls back to the default sort on unknown sort values", async () => {
    const app = makeApp([
      row({ slug: "a", trending_score: 0.1 }),
      row({ slug: "b", trending_score: 0.9 }),
    ]);
    const body = await fetchJson(app, "/api/models?sort=banana");
    expect(body.items.map((m) => m.slug)).toEqual(["b", "a"]);
  });

  it("DTO maps DB columns to camelCase + boolean federated + href", async () => {
    const app = makeApp([
      row({
        slug: "credit-default-classifier",
        name: "Privacy-First Federated Credit Oracle",
        federated: 1,
        rating_avg: 4.8,
        rating_count: 211,
        price_cents: 14900,
      }),
    ]);
    const res = await app.request("/api/models");
    const body = (await res.json()) as {
      items: {
        slug: string;
        riskLevel: string;
        federated: boolean;
        rating: number;
        ratingCount: number;
        price: number;
        href: string;
      }[];
    };
    expect(body.items[0]).toMatchObject({
      slug: "credit-default-classifier",
      federated: true,
      rating: 4.8,
      ratingCount: 211,
      price: 14900,
      href: "/models/credit-default-classifier/",
    });
  });
});
