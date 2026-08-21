/**
 * Portfolio optimiser — generative portfolio simulator.
 *
 * Runtime: `simulator`. Mean-variance allocation per Markowitz with seeded
 * lognormal forward simulation:
 *   - 1,000 paths × 24 months (kept small for the worker-CPU budget)
 *   - returns drawn from N(μ, σ) calibrated per ticker hash
 *   - per-month P5 / P50 / P95 quantiles produce the Phase-5 fan chart
 *   - efficient frontier sampled at 5 risk-aversion points
 *
 * Backwards-compatible Phase 5 keys (`weights`, `expected_return`,
 * `expected_vol`) are preserved; spec extension keys (`scenarios`,
 * `frontier`, `drawdown`, `stats`) are added alongside.
 */
import { type ModelHandler, makeRng, gaussian, quantile, round } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "portfolio-optimiser";
const PATHS = 1_000;
const MONTHS = 24;

const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

function tickerStats(ticker: string): { mu: number; sigma: number } {
  // Deterministic per-ticker drift / vol — ~6–14% annual return, 12–28% vol.
  const rng = makeRng("stats:" + ticker);
  return {
    mu: 0.06 + rng() * 0.08,
    sigma: 0.12 + rng() * 0.16,
  };
}

function meanVarianceWeights(
  tickers: string[],
  riskAversion: number,
  longOnly: boolean,
): number[] {
  // Closed-form approximation: w_i ∝ μ_i / (λ · σ_i²). Then renormalise.
  const stats = tickers.map(tickerStats);
  const raw = stats.map((s) => s.mu / Math.max(0.001, riskAversion * s.sigma * s.sigma));
  const adjusted = longOnly ? raw.map((w) => Math.max(0, w)) : raw;
  const sum = adjusted.reduce((a, b) => a + b, 0) || 1;
  return adjusted.map((w) => round(w / sum, 4));
}

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "simulator",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  predict(input, ctx) {
    const tickers = (input.tickers as string[]) ?? [];
    const lambda = Number(input.risk_aversion ?? 2.5);
    const longOnly = Boolean(input.long_only ?? true);

    const weights = meanVarianceWeights(tickers, lambda, longOnly);
    const stats = tickers.map(tickerStats);

    // Portfolio expected return / vol in annualised terms.
    const expRet = weights.reduce((s, w, i) => s + w * stats[i]!.mu, 0);
    const expVol = Math.sqrt(
      weights.reduce((s, w, i) => s + w * w * stats[i]!.sigma * stats[i]!.sigma, 0),
    );

    // Monte Carlo forward paths.
    const rng = makeRng(ctx.seed);
    const monthlyMu = expRet / 12;
    const monthlyVol = expVol / Math.sqrt(12);
    const paths: number[][] = [];
    for (let p = 0; p < PATHS; p++) {
      const series: number[] = [1];
      for (let m = 1; m <= MONTHS; m++) {
        const r = gaussian(rng, monthlyMu, monthlyVol);
        series.push(series[m - 1]! * (1 + r));
      }
      paths.push(series);
    }
    const scenarios = [];
    for (let m = 1; m <= MONTHS; m++) {
      const slice = paths.map((p) => p[m]!).sort((a, b) => a - b);
      scenarios.push({
        month: m,
        p5: round(quantile(slice, 0.05), 4),
        p50: round(quantile(slice, 0.5), 4),
        p95: round(quantile(slice, 0.95), 4),
      });
    }

    // Per-path drawdown — feeds the spec's `drawdown` and `stats.max_dd`.
    const drawdowns = paths.map((path) => {
      let peak = path[0]!;
      let maxDd = 0;
      for (const v of path) {
        if (v > peak) peak = v;
        const dd = (v - peak) / peak;
        if (dd < maxDd) maxDd = dd;
      }
      return maxDd;
    });
    drawdowns.sort((a, b) => a - b);

    // Sharpe / Sortino at the path level, then median.
    const finals = paths.map((p) => p[MONTHS]! - 1);
    const sortedFinals = finals.slice().sort((a, b) => a - b);
    const medFinal = quantile(sortedFinals, 0.5);
    const sharpe = expVol > 0 ? expRet / expVol : 0;
    const downside = Math.sqrt(
      finals.filter((r) => r < 0).reduce((s, r) => s + r * r, 0) / Math.max(1, finals.length),
    );
    const sortino = downside > 0 ? medFinal / downside : sharpe;

    // Efficient frontier sample — 5 risk-aversion points.
    const frontier = [0.5, 1, 2.5, 5, 10].map((lam) => {
      const w = meanVarianceWeights(tickers, lam, longOnly);
      const r = w.reduce((s, ww, i) => s + ww * stats[i]!.mu, 0);
      const v = Math.sqrt(w.reduce((s, ww, i) => s + ww * ww * stats[i]!.sigma * stats[i]!.sigma, 0));
      return { risk: round(v, 4), return: round(r, 4), label: lam === lambda ? "current" : `λ=${lam}` };
    });

    return {
      // Phase 5 backwards-compat keys.
      weights,
      expected_return: round(expRet, 4),
      expected_vol: round(expVol, 4),
      // Phase 6 extensions.
      scenarios,
      frontier,
      drawdown: drawdowns.slice(0, 50).map((d) => round(d, 4)),
      stats: {
        sharpe: round(sharpe, 3),
        sortino: round(sortino, 3),
        max_dd: round(quantile(drawdowns, 0.05), 4),
      },
    };
  },
};
