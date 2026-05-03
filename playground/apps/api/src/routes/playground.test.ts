import { describe, expect, it, beforeEach } from "vitest";
import { Hono } from "hono";
import { playgroundRoutes } from "./playground.js";
import { InMemoryPlaygroundRepository, StubKV } from "../test-helpers.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";
import type { ModelRow } from "../lib/models-repo.js";

function model(slug: string, training = 0): ModelRow {
  return {
    slug,
    name: slug,
    summary: "x",
    category_slug: "test",
    subcategory_slug: null,
    developer: "GeFi",
    status: "approved",
    featured: 1,
    risk_tier: "low",
    maturity: "production",
    price_cents: 0,
    rating_avg: 0,
    rating_count: 0,
    trending_score: 0,
    federated: 0,
    thumbnail_url: null,
    created_at: 0,
    updated_at: 0,
    training_enabled: training,
  } as ModelRow;
}

function envFor(kv: StubKV) {
  // Only the bindings the route actually touches.
  return { RATE_LIMITS: kv } as unknown as Parameters<Hono["request"]>[1];
}

function makeApp(repo: InMemoryPlaygroundRepository, opts: Parameters<typeof playgroundRoutes>[0] = {}) {
  const app = new Hono();
  app.route("/api/playground", playgroundRoutes({ repository: repo, ...opts }));
  return app;
}

describe("POST /api/playground/:slug/run", () => {
  let kv: StubKV;
  beforeEach(() => {
    kv = new StubKV();
  });

  it("returns 404 for unknown model", async () => {
    const repo = new InMemoryPlaygroundRepository();
    const app = makeApp(repo);
    const res = await app.request("/api/playground/nope/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }, envFor(kv));
    expect(res.status).toBe(404);
  });

  it("validates body against the input_schema", async () => {
    const repo = new InMemoryPlaygroundRepository({
      models: [model("portfolio-optimiser")],
    });
    const app = makeApp(repo);
    // Missing required `tickers` and `risk_aversion`.
    const res = await app.request(
      "/api/playground/portfolio-optimiser/run",
      { method: "POST", headers: { "content-type": "application/json" }, body: "{}" },
      envFor(kv),
    );
    expect(res.status).toBe(400);
    const j = (await res.json()) as { error: string; details: { path: string }[] };
    expect(j.error).toBe("invalid_input");
    expect(j.details.length).toBeGreaterThan(0);
  });

  it("returns the canned mock + writes an inference_calls row", async () => {
    const repo = new InMemoryPlaygroundRepository({
      models: [model("sentiment-from-filings")],
    });
    const app = makeApp(repo, { newId: () => "id-1", now: () => 1700 });
    const body = PLAYGROUND_MOCKS_BY_SLUG.get("sentiment-from-filings")!.defaultInput;
    const res = await app.request(
      "/api/playground/sentiment-from-filings/run",
      { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) },
      envFor(kv),
    );
    expect(res.status).toBe(200);
    const j = (await res.json()) as { output: { sentiment: string }; mock: boolean; latency_ms: number };
    expect(j.mock).toBe(true);
    expect(["positive", "neutral", "negative"]).toContain(j.output.sentiment);
    expect(j.latency_ms).toBeGreaterThan(0);
    expect(repo.inferenceCalls).toHaveLength(1);
    expect(repo.inferenceCalls[0]!.model_slug).toBe("sentiment-from-filings");
    expect(repo.inferenceCalls[0]!.is_playground).toBe(true);
    expect(repo.inferenceCalls[0]!.mock).toBe(true);
    expect(repo.inferenceCalls[0]!.input_hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("rate limits anonymous callers at 20/day per IP", async () => {
    const repo = new InMemoryPlaygroundRepository({
      models: [model("sentiment-from-filings")],
    });
    const app = makeApp(repo);
    const body = JSON.stringify(PLAYGROUND_MOCKS_BY_SLUG.get("sentiment-from-filings")!.defaultInput);
    const headers = { "content-type": "application/json", "cf-connecting-ip": "9.9.9.9" };
    let last: Response | null = null;
    for (let i = 0; i < 21; i++) {
      last = await app.request(
        "/api/playground/sentiment-from-filings/run",
        { method: "POST", headers, body },
        envFor(kv),
      );
    }
    expect(last!.status).toBe(429);
    const j = (await last!.json()) as { error: string };
    expect(j.error).toBe("rate_limited");
  });

  it("rate limits authed users at 200/day per user", async () => {
    const repo = new InMemoryPlaygroundRepository({
      models: [model("sentiment-from-filings")],
    });
    const app = makeApp(repo, { resolveUserId: () => "u-1" });
    const body = JSON.stringify(PLAYGROUND_MOCKS_BY_SLUG.get("sentiment-from-filings")!.defaultInput);
    let last: Response | null = null;
    for (let i = 0; i < 25; i++) {
      last = await app.request(
        "/api/playground/sentiment-from-filings/run",
        { method: "POST", headers: { "content-type": "application/json" }, body },
        envFor(kv),
      );
    }
    // 25 < 200 → all should still succeed.
    expect(last!.status).toBe(200);
  });

  it("rejects invalid JSON body", async () => {
    const repo = new InMemoryPlaygroundRepository({
      models: [model("sentiment-from-filings")],
    });
    const app = makeApp(repo);
    const res = await app.request(
      "/api/playground/sentiment-from-filings/run",
      { method: "POST", headers: { "content-type": "application/json" }, body: "{not json" },
      envFor(kv),
    );
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toBe("invalid_json");
  });
});
