import { describe, expect, it } from "vitest";
import { LocalIndex, resolveIndex, TypesenseIndex, type SearchDoc } from "./index.js";

function doc(id: string, overrides: Partial<SearchDoc> = {}): SearchDoc {
  return {
    id,
    slug: id,
    name: `Model ${id}`,
    summary: `Summary for ${id}`,
    category: "forecasting",
    riskClass: "medium",
    jurisdiction: "us",
    jurisdictionsSupported: ["us", "eu"],
    monthlyPriceCents: 9900,
    metrics: { sharpe: 1.2 },
    federationEnabled: false,
    ...overrides,
  };
}

describe("@gefi/search-index LocalIndex", () => {
  it("upserts and searches by name", async () => {
    const idx = new LocalIndex();
    await idx.bulkUpsert([
      doc("a", { name: "Alpha Sentiment" }),
      doc("b", { name: "Bravo Optimiser" }),
    ]);
    const r = await idx.search({ query: "alpha" });
    expect(r.hits.map((h) => h.id)).toEqual(["a"]);
  });

  it("filters by category + risk + price + sharpe", async () => {
    const idx = new LocalIndex();
    await idx.bulkUpsert([
      doc("a", { category: "sentiment", riskClass: "low", monthlyPriceCents: 0, metrics: { sharpe: 0.5 } }),
      doc("b", { category: "forecasting", riskClass: "high", monthlyPriceCents: 49900, metrics: { sharpe: 2.5 } }),
    ]);
    const r = await idx.search({
      category: "forecasting",
      riskClass: "high",
      minPrice: 10_000,
      maxPrice: 100_000,
      minSharpe: 2,
    });
    expect(r.hits.map((h) => h.id)).toEqual(["b"]);
  });

  it("hides docs whose jurisdictionsSupported excludes the visibleTo region", async () => {
    const idx = new LocalIndex();
    await idx.bulkUpsert([
      doc("us-only", { jurisdictionsSupported: ["us"] }),
      doc("eu-only", { jurisdictionsSupported: ["eu"] }),
      doc("global", { jurisdictionsSupported: [] }), // empty = global
    ]);
    const r = await idx.search({ visibleTo: "us" });
    expect(r.hits.map((h) => h.id).sort()).toEqual(["global", "us-only"]);
  });

  it("returns facet counts", async () => {
    const idx = new LocalIndex();
    await idx.bulkUpsert([
      doc("a", { category: "sentiment", riskClass: "low" }),
      doc("b", { category: "sentiment", riskClass: "high" }),
      doc("c", { category: "risk", riskClass: "low" }),
    ]);
    const r = await idx.search({});
    expect(r.facets.category?.sentiment).toBe(2);
    expect(r.facets.riskClass?.low).toBe(2);
  });

  it("removes a doc by id", async () => {
    const idx = new LocalIndex();
    await idx.upsert(doc("a"));
    await idx.upsert(doc("b"));
    await idx.remove("a");
    const r = await idx.search({});
    expect(r.hits.map((h) => h.id)).toEqual(["b"]);
  });

  it("paginates correctly", async () => {
    const idx = new LocalIndex();
    await idx.bulkUpsert([doc("a"), doc("b"), doc("c"), doc("d")]);
    const r = await idx.search({ limit: 2, offset: 1 });
    expect(r.hits).toHaveLength(2);
    expect(r.total).toBe(4);
  });
});

describe("@gefi/search-index resolver", () => {
  it("returns LocalIndex when no Typesense host", () => {
    expect(resolveIndex({})).toBeInstanceOf(LocalIndex);
  });
  it("returns TypesenseIndex when host + key + collection are set", () => {
    expect(
      resolveIndex({
        TYPESENSE_HOST: "https://typesense.example",
        TYPESENSE_API_KEY: "k",
        TYPESENSE_COLLECTION: "models",
      }),
    ).toBeInstanceOf(TypesenseIndex);
  });
});
