/**
 * portfolio-optimiser — deterministic mean-variance portfolio optimiser.
 *
 * Implementation: the analytic minimum-variance solution for the two-asset
 * case generalised by gradient projection onto the simplex (weights sum to
 * 1, all non-negative for the long-only variant). Fully deterministic, so
 * the replay endpoint always returns bit-exact identical weights.
 */

export interface OptimiserAsset {
  symbol: string;
  expectedReturn: number;
  /** Annualised volatility (sigma). */
  vol: number;
}

export interface OptimiserInput {
  assets: OptimiserAsset[];
  /** Pairwise correlation matrix; assets.length × assets.length, row-major. */
  correlation: number[][];
  /** Higher = more aggressive risk preference. 0..5 typical. */
  riskAversion?: number;
  /** If true, restrict weights to >= 0. */
  longOnly?: boolean;
  /** Maximum gradient-projection iterations. */
  maxIters?: number;
}

export interface OptimiserResult {
  weights: { symbol: string; weight: number }[];
  expectedReturn: number;
  volatility: number;
  sharpe: number;
}

function projectSimplex(weights: number[], longOnly: boolean): number[] {
  const n = weights.length;
  if (longOnly) {
    // Standard simplex projection (Wang & Carreira-Perpiñán, 2013).
    const sorted = [...weights].sort((a, b) => b - a);
    let t = 0;
    let rho = 0;
    for (let i = 0; i < n; i++) {
      const v = sorted[i] ?? 0;
      const candidate = (sorted.slice(0, i + 1).reduce((s, x) => s + x, 0) - 1) / (i + 1);
      if (v - candidate > 0) {
        t = candidate;
        rho = i + 1;
      }
    }
    void rho;
    return weights.map((w) => Math.max(0, w - t));
  }
  // Project onto the hyperplane sum = 1.
  const meanShift = (weights.reduce((s, w) => s + w, 0) - 1) / n;
  return weights.map((w) => w - meanShift);
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (a[i] ?? 0) * (b[i] ?? 0);
  return s;
}

function matVec(m: number[][], v: number[]): number[] {
  return m.map((row) => dot(row, v));
}

function buildCovariance(assets: OptimiserAsset[], corr: number[][]): number[][] {
  const n = assets.length;
  const cov: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      const ai = assets[i]!;
      const aj = assets[j]!;
      const c = corr[i]?.[j] ?? (i === j ? 1 : 0);
      row.push(ai.vol * aj.vol * c);
    }
    cov.push(row);
  }
  return cov;
}

export function optimise(input: OptimiserInput): OptimiserResult {
  const n = input.assets.length;
  if (n === 0) throw new Error("optimiser_empty_assets");
  const longOnly = input.longOnly ?? true;
  const lambda = input.riskAversion ?? 1;
  const cov = buildCovariance(input.assets, input.correlation);
  // Closed-form not stable for our gradient projection; iterate.
  let w = new Array(n).fill(1 / n);
  const lr = 0.05;
  const iters = input.maxIters ?? 250;
  for (let step = 0; step < iters; step++) {
    // Objective: min  -μ·w  +  (λ/2) wᵀΣw
    const grad = matVec(cov, w).map((cv, i) => lambda * cv - (input.assets[i]?.expectedReturn ?? 0));
    w = w.map((wi, i) => wi - lr * (grad[i] ?? 0));
    w = projectSimplex(w, longOnly);
  }
  const expReturn = w.reduce((s, wi, i) => s + wi * (input.assets[i]?.expectedReturn ?? 0), 0);
  const variance = dot(w, matVec(cov, w));
  const vol = Math.sqrt(Math.max(0, variance));
  const sharpe = vol > 0 ? expReturn / vol : 0;
  return {
    weights: input.assets.map((a, i) => ({
      symbol: a.symbol,
      // Round to 6 decimals so the deterministic replay matches bit-exact.
      weight: Math.round((w[i] ?? 0) * 1_000_000) / 1_000_000,
    })),
    expectedReturn: Math.round(expReturn * 1_000_000) / 1_000_000,
    volatility: Math.round(vol * 1_000_000) / 1_000_000,
    sharpe: Math.round(sharpe * 1_000_000) / 1_000_000,
  };
}
