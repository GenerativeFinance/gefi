import { describe, expect, it } from "vitest";
import { seed, emitSeedSql } from "./seed.js";
import { StubD1 } from "../src/test-helpers.js";
import { CATEGORIES } from "../src/data/categories.js";
import { FEATURED_MODELS } from "../src/data/featured-models.js";

describe("seed", () => {
  it("inserts the 14 categories and 10 featured models", async () => {
    const db = new StubD1();
    const counts = await seed(db);
    expect(counts.categories).toBe(14);
    expect(counts.models).toBe(10);
    expect(Object.keys(db.categories)).toHaveLength(14);
    expect(Object.keys(db.models)).toHaveLength(10);
    expect(db.categories["sentiment-analysis"]?.name).toBe("Sentiment Analysis");
    expect(db.models["sentiment-from-filings"]?.featured).toBe(1);
    expect(db.models["sentiment-from-filings"]?.status).toBe("draft");
  });

  it("is idempotent — re-running does not duplicate", async () => {
    const db = new StubD1();
    await seed(db);
    await seed(db);
    expect(Object.keys(db.categories)).toHaveLength(14);
    expect(Object.keys(db.models)).toHaveLength(10);
  });

  it("data files match seed counts", () => {
    expect(CATEGORIES).toHaveLength(14);
    expect(FEATURED_MODELS).toHaveLength(10);
    const slugs = new Set(CATEGORIES.map((c) => c.slug));
    for (const m of FEATURED_MODELS) {
      expect(slugs.has(m.category_slug), `${m.slug} → ${m.category_slug}`).toBe(true);
    }
  });

  it("emitSeedSql produces an INSERT OR IGNORE script", () => {
    const sql = emitSeedSql(1234567890);
    expect(sql).toContain("BEGIN;");
    expect(sql).toContain("INSERT OR IGNORE INTO categories");
    expect(sql).toContain("INSERT OR IGNORE INTO models");
    expect(sql).toContain("'sentiment-from-filings'");
    expect(sql).toContain("COMMIT;");
  });
});
