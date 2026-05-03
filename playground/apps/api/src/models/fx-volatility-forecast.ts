/**
 * FX-volatility-forecast.
 *
 * Runtime: `simulator`. Per-pair baseline annualised vol plus deterministic
 * mean-reverting forward path. Confidence band is ±15% (1σ-style envelope).
 * Worst-case is the 95th percentile of the simulated forecast horizon.
 *
 * Backwards-compatible Phase 5 keys (`forecast_vol`, `confidence_lo`,
 * `confidence_hi`) preserved; spec extension keys (`worst_case`,
 * `mean_reverts_at`) added alongside.
 */
import { type ModelHandler, makeRng, round } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "fx-volatility-forecast";
const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

const BASE_VOL: Record<string, number> = {
  EURUSD: 0.07,
  USDJPY: 0.085,
  GBPUSD: 0.09,
  USDCHF: 0.075,
  AUDUSD: 0.10,
};

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "simulator",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  predict(input, ctx) {
    const pair = String(input.pair ?? "EURUSD");
    const horizon = Math.max(1, Math.min(90, Number(input.horizon_days ?? 10)));
    const long = BASE_VOL[pair] ?? 0.08;

    // Start from 1.2× long-run vol then mean-revert with Ornstein–Uhlenbeck.
    const rng = makeRng(ctx.seed);
    const kappa = 0.15; // reversion speed
    const noise = 0.005;
    let v = long * 1.2;
    const forecast: number[] = [];
    let revertsAt: number | null = null;
    for (let i = 0; i < horizon; i++) {
      v = v + kappa * (long - v) + (rng() - 0.5) * noise;
      v = Math.max(0.01, v);
      forecast.push(round(v, 4));
      if (revertsAt === null && Math.abs(v - long) < long * 0.05) revertsAt = i + 1;
    }
    const lo = forecast.map((x) => round(x * 0.85, 4));
    const hi = forecast.map((x) => round(x * 1.15, 4));
    const sortedHi = hi.slice().sort((a, b) => b - a);
    const worstCase = sortedHi[Math.max(0, Math.floor(sortedHi.length * 0.05))]!;

    return {
      // Phase 5 backwards-compat keys.
      forecast_vol: forecast,
      confidence_lo: lo,
      confidence_hi: hi,
      // Phase 6 extensions.
      worst_case: round(worstCase, 4),
      mean_reverts_at: revertsAt,
    };
  },
};
