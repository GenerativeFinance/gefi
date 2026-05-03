/**
 * Yield-curve-predictor.
 *
 * Runtime: `simulator`. Nelson–Siegel parameterisation per curve family,
 * with deterministic horizon-month drift (level shift + slope tilt).
 *
 * Backwards-compatible Phase 5 keys (`tenors_years`, `yields_pct`) preserved;
 * spec extension keys (`scenario`, `level`, `slope`, `curvature`) added.
 */
import { type ModelHandler, makeRng, round } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "yield-curve-predictor";
const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

const TENORS = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30];

interface NS { beta0: number; beta1: number; beta2: number; tau: number }
const FAMILY: Record<string, NS> = {
  UST:  { beta0: 4.0, beta1: -1.2, beta2: 1.5, tau: 2.0 },
  BUND: { beta0: 2.6, beta1: -1.0, beta2: 1.2, tau: 2.0 },
  GILT: { beta0: 4.2, beta1: -0.9, beta2: 1.0, tau: 2.0 },
  JGB:  { beta0: 0.7, beta1: -0.5, beta2: 0.8, tau: 2.0 },
};

function nelsonSiegel(t: number, p: NS): number {
  const x = t / p.tau;
  const ex = Math.exp(-x);
  const term = (1 - ex) / Math.max(1e-9, x);
  return p.beta0 + p.beta1 * term + p.beta2 * (term - ex);
}

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "simulator",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  predict(input, ctx) {
    const curve = String(input.curve ?? "UST");
    const horizon = Math.max(1, Math.min(60, Number(input.horizon_months ?? 12)));
    const base = FAMILY[curve] ?? FAMILY.UST!;

    // Horizon shifts: deterministic small drift + per-call noise.
    const rng = makeRng(ctx.seed);
    const levelShift = (horizon / 60) * 0.5 + (rng() - 0.5) * 0.2;
    const slopeShift = (rng() - 0.5) * 0.4;
    const projected: NS = {
      beta0: base.beta0 + levelShift,
      beta1: base.beta1 + slopeShift,
      beta2: base.beta2,
      tau: base.tau,
    };

    const yields = TENORS.map((t) => round(nelsonSiegel(t, projected), 3));

    // Scenario classification — short-2y vs long-30y spread.
    const short = yields[3]!; // 2y
    const long = yields[8]!;  // 20y
    const spread = long - short;
    const scenario =
      spread < -0.25 ? "inverted" :
      spread < 0.5 ? "flattening" : "steepening";

    return {
      // Phase 5 backwards-compat keys.
      tenors_years: TENORS,
      yields_pct: yields,
      // Phase 6 extensions.
      scenario,
      level: round(projected.beta0, 3),
      slope: round(projected.beta1, 3),
      curvature: round(projected.beta2, 3),
    };
  },
};
