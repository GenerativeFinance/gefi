import { describe, expect, it } from "vitest";
import { assemblePrompt, deterministicSentiment, FIXTURE_FILINGS, retrieve } from "./sentiment.js";
import { optimise } from "./optimiser.js";

describe("@gefi/reference-models sentiment", () => {
  it("retrieves filings filtered by ticker", () => {
    const out = retrieve({ query: "iphone revenue", ticker: "AAPL" });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((c) => c.ticker === "AAPL")).toBe(true);
  });
  it("returns empty when no overlap", () => {
    const out = retrieve({ query: "completely unrelated zzzqqq" });
    expect(out).toHaveLength(0);
  });
  it("assemblePrompt encodes context with ids", () => {
    const top = retrieve({ query: "revenue grew", topK: 2 });
    const p = assemblePrompt("Sentiment?", top);
    expect(p.system).toContain("BULLISH | NEUTRAL | BEARISH");
    expect(p.context.length).toBe(top.length);
    expect(p.prompt).toContain("Excerpts:");
  });
  it("deterministicSentiment maps positive language to BULLISH", () => {
    const positive = FIXTURE_FILINGS.filter((c) => c.ticker === "MSFT").map((c) => ({
      ...c,
      score: 1,
    }));
    expect(deterministicSentiment(positive)).toBe("BULLISH");
  });
  it("deterministicSentiment maps negative language to BEARISH", () => {
    const negative = [
      {
        id: "X-10Q-1",
        ticker: "X",
        filing: "10-Q",
        filed_at: 1,
        text: "Revenue declined and margins fell amid persistent softness; outlook remains conservative.",
        score: 1,
      },
    ];
    expect(deterministicSentiment(negative as never)).toBe("BEARISH");
  });
});

describe("@gefi/reference-models optimiser", () => {
  it("returns weights that sum to ~1", () => {
    const r = optimise({
      assets: [
        { symbol: "A", expectedReturn: 0.1, vol: 0.2 },
        { symbol: "B", expectedReturn: 0.05, vol: 0.1 },
      ],
      correlation: [
        [1, 0.2],
        [0.2, 1],
      ],
    });
    const sum = r.weights.reduce((s, w) => s + w.weight, 0);
    expect(sum).toBeGreaterThan(0.99);
    expect(sum).toBeLessThan(1.01);
  });

  it("is deterministic across runs", () => {
    const inp = {
      assets: [
        { symbol: "A", expectedReturn: 0.12, vol: 0.25 },
        { symbol: "B", expectedReturn: 0.06, vol: 0.15 },
        { symbol: "C", expectedReturn: 0.04, vol: 0.08 },
      ],
      correlation: [
        [1, 0.3, 0.1],
        [0.3, 1, 0.2],
        [0.1, 0.2, 1],
      ],
    };
    const a = optimise(inp);
    const b = optimise(inp);
    expect(a).toEqual(b);
  });

  it("higher risk aversion → less concentration in high-vol asset", () => {
    const assets = [
      { symbol: "RISKY", expectedReturn: 0.2, vol: 0.5 },
      { symbol: "SAFE", expectedReturn: 0.05, vol: 0.05 },
    ];
    const corr = [
      [1, 0],
      [0, 1],
    ];
    const lo = optimise({ assets, correlation: corr, riskAversion: 0.5 });
    const hi = optimise({ assets, correlation: corr, riskAversion: 5 });
    const wRiskyLo = lo.weights.find((w) => w.symbol === "RISKY")!.weight;
    const wRiskySafe = hi.weights.find((w) => w.symbol === "RISKY")!.weight;
    expect(wRiskySafe).toBeLessThan(wRiskyLo);
  });

  it("long-only mode keeps all weights ≥ 0", () => {
    const r = optimise({
      assets: [
        { symbol: "A", expectedReturn: -0.1, vol: 0.4 },
        { symbol: "B", expectedReturn: 0.2, vol: 0.1 },
      ],
      correlation: [
        [1, 0.5],
        [0.5, 1],
      ],
      longOnly: true,
      riskAversion: 1,
    });
    expect(r.weights.every((w) => w.weight >= 0)).toBe(true);
  });

  it("throws on empty assets", () => {
    expect(() =>
      optimise({ assets: [], correlation: [] }),
    ).toThrowError(/optimiser_empty_assets/);
  });
});
