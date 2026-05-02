/**
 * Differential-privacy primitives for federated rounds.
 *
 * Two operations:
 *
 *   1. **L2-clip** every per-example gradient before averaging. Bounds
 *      the sensitivity Δ of the per-participant update to `clipNorm`,
 *      regardless of how outlier-y a single training example was.
 *
 *   2. **Add Gaussian noise** of stddev `noiseMultiplier * clipNorm`
 *      to the clipped, summed gradients. Per the moments accountant
 *      (Abadi et al. 2016), this gives an (ε, δ)-DP guarantee with ε
 *      growing roughly as σ^-1 √T for T rounds.
 *
 * The noise PRNG is seeded so the 3-node consortium test is bitwise
 * reproducible. In production the node-agent reseeds from
 * `crypto.getRandomValues` every call and the seed is never persisted.
 */

import { gaussianFactory, mulberry32 } from "./prng.js";

/**
 * Clip a vector to L2 norm `<= clipNorm`. If `clipNorm <= 0`, returns the
 * input unchanged (used to disable clipping in tests).
 */
export function l2Clip(v: Float64Array, clipNorm: number): Float64Array {
  if (clipNorm <= 0) return v;
  let sq = 0;
  for (let i = 0; i < v.length; i++) sq += v[i]! * v[i]!;
  const norm = Math.sqrt(sq);
  if (norm <= clipNorm) return v;
  const scale = clipNorm / norm;
  const out = new Float64Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i]! * scale;
  return out;
}

export interface AddNoiseInput {
  vector: Float64Array;
  noiseMultiplier: number;
  clipNorm: number;
  /** Seed for the deterministic Gaussian PRNG. */
  seed: number;
}

/**
 * Add per-element Gaussian noise N(0, σ * clipNorm). When `noiseMultiplier`
 * is 0 the input is returned untouched (DP disabled).
 */
export function addGaussianNoise(input: AddNoiseInput): Float64Array {
  const { vector, noiseMultiplier, clipNorm, seed } = input;
  if (noiseMultiplier <= 0) return vector;
  const stddev = noiseMultiplier * clipNorm;
  const gauss = gaussianFactory(mulberry32(seed));
  const out = new Float64Array(vector.length);
  for (let i = 0; i < vector.length; i++) out[i] = vector[i]! + gauss() * stddev;
  return out;
}

/**
 * Apply DP-SGD to a per-participant update: clip, then add noise. The
 * orchestrator stamps the round's `(noiseMultiplier, clipNorm)` and the
 * node-agent calls this with its participant-id-derived seed so each
 * participant's noise is independent.
 */
export function applyDpSgd(
  update: Float64Array,
  noiseMultiplier: number,
  clipNorm: number,
  seed: number,
): Float64Array {
  return addGaussianNoise({
    vector: l2Clip(update, clipNorm),
    noiseMultiplier,
    clipNorm,
    seed,
  });
}

/**
 * Estimate (ε, δ) for `T` rounds at noise multiplier σ and sampling rate q.
 *
 * This is a *first-order* RDP→(ε,δ) conversion that's good enough for the
 * UI banner ("Round will spend ε ≈ 1.4"). For the actual privacy-budget
 * accounting that gates whether the round can run, the orchestrator
 * delegates to a full moments accountant in the compliance Worker.
 *
 * Formula: ε ≈ q √(2 T log(1/δ)) / σ. (Tight RDP composition is in the
 * compliance Worker; this is the bound we surface in the round-create
 * response so the developer doesn't have to model the accountant
 * themselves.)
 */
export function estimateEpsilon(
  noiseMultiplier: number,
  rounds: number,
  delta: number,
  samplingRate: number,
): number {
  if (noiseMultiplier <= 0) return Infinity;
  if (delta <= 0 || delta >= 1) throw new Error("delta_out_of_range");
  return (samplingRate * Math.sqrt(2 * rounds * Math.log(1 / delta))) / noiseMultiplier;
}
