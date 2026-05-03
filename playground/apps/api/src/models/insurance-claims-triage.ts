/**
 * Insurance-claims-triage — also serves the Phase 6 spec entry for the
 * generative-claims-forecaster (count + severity forecasts + drivers +
 * reserve adequacy traffic light).
 *
 * Runtime: `simulator`. Per-claim severity / fraud scoring, plus a
 * deterministic 12-month forward forecast for claim counts and severities
 * given the input loss type.
 *
 * Backwards-compatible Phase 5 keys (`severity`, `fraud_risk`, `queue`)
 * preserved; spec extension keys (`count_forecast`, `severity_forecast`,
 * `top_drivers`, `reserve_adequacy`) added alongside.
 */
import { type ModelHandler, makeRng, gaussian, round } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "insurance-claims-triage";
const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

const LOSS_BASE: Record<string, { count: number; severity: number }> = {
  auto: { count: 120, severity: 4500 },
  property: { count: 60, severity: 12_000 },
  liability: { count: 35, severity: 25_000 },
  "workers-comp": { count: 90, severity: 9_500 },
};

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "simulator",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  predict(input, ctx) {
    const amt = Number(input.claim_amount ?? 0);
    const lossType = String(input.loss_type ?? "auto");
    const priors = Number(input.prior_claims ?? 0);

    // Per-claim triage.
    const sev = amt > 50_000 ? "high" : amt > 5_000 ? "medium" : "low";
    const fraud = round(
      Math.min(1, priors * 0.15 + (amt > 25_000 ? 0.3 : 0) + (amt % 1000 === 0 && amt > 0 ? 0.05 : 0)),
      3,
    );
    const queue =
      sev === "high" ? "complex-loss" :
      fraud > 0.4 ? "fraud-investigation" : "fast-track";

    // 12-month forecast — Holt–Winters-style additive with seeded noise.
    const base = LOSS_BASE[lossType] ?? LOSS_BASE.auto!;
    const rng = makeRng(ctx.seed);
    const SEASON = [1.0, 0.9, 0.95, 1.05, 1.1, 1.15, 1.2, 1.15, 1.05, 1.0, 0.95, 0.9];
    const count_forecast = SEASON.map((s, i) => ({
      month: i + 1,
      count: Math.round(base.count * s * (1 + (rng() - 0.5) * 0.1)),
    }));
    const severity_forecast = SEASON.map((s, i) => ({
      month: i + 1,
      severity: round(base.severity * (0.95 + i * 0.005) * (1 + (gaussian(rng) * 0.05)), 0),
    }));

    const top_drivers = [
      { feature: "loss_type", value: lossType, impact: round(base.severity / 10_000, 3) },
      { feature: "prior_claims", value: priors, impact: round(priors * 0.15, 3) },
      { feature: "claim_amount", value: amt, impact: round(amt / 50_000, 3) },
    ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    // Reserve adequacy traffic light: green if expected loss < 80% of reserve
    // proxy (12 × monthly expected severity × count).
    const expected = count_forecast.reduce((s, c, i) => s + c.count * severity_forecast[i]!.severity, 0);
    const reserveProxy = base.count * base.severity * 12 * 1.1;
    const ratio = expected / reserveProxy;
    const reserve_adequacy = {
      rating: ratio < 0.85 ? "green" : ratio < 1.0 ? "amber" : "red",
      rationale: `Projected losses are ${round(ratio * 100, 1)}% of carried reserves.`,
    };

    return {
      // Phase 5 backwards-compat keys.
      severity: sev,
      fraud_risk: fraud,
      queue,
      // Phase 6 extensions — generative claims forecaster surface.
      count_forecast,
      severity_forecast,
      top_drivers,
      reserve_adequacy,
    };
  },
};
