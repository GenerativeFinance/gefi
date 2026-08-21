/**
 * FedAvg + FedProx weighted aggregation.
 *
 * `fedAvg`: simple weighted mean over participant updates, weighted by
 * `sampleCount` (participants with more training data have more
 * influence — McMahan et al. 2017).
 *
 * `fedProx`: same shape but the participant updates are pre-pulled toward
 * the baseline by µ; the proximal term is applied at the participant
 * (it's a regularisation on the local objective), so this aggregator
 * looks identical. We keep `fedProx` as an alias so the call sites can
 * pin which algorithm a round was aggregated under without branching
 * on a string at runtime.
 */

import type { PlaintextUpdate, MaskedUpdate } from "./types.js";
import { aggregateMaskedUpdates } from "./secure-agg.js";

const enc = new TextEncoder();

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  const b = new Uint8Array(buf);
  let h = "";
  for (let i = 0; i < b.length; i++) h += b[i]!.toString(16).padStart(2, "0");
  return h;
}

/**
 * Weighted mean over `updates`, weighted by sample count.
 *
 * Σ_i (n_i / Σ n) * update_i
 *
 * Throws if the input is empty or any update has a different dimension.
 * Returns a fresh Float64Array so callers can mutate without aliasing.
 */
export function fedAvg(updates: PlaintextUpdate[]): Float64Array {
  if (updates.length === 0) throw new Error("no_updates");
  const dim = updates[0]!.vector.length;
  let total = 0;
  for (const u of updates) {
    if (u.vector.length !== dim) throw new Error("dim_mismatch");
    if (u.sampleCount < 0) throw new Error("negative_sample_count");
    total += u.sampleCount;
  }
  if (total === 0) {
    // Edge case: all participants reported zero samples (e.g. cold-start
    // round). Fall back to uniform mean so the round can still produce
    // a well-formed aggregate rather than NaN.
    const w = 1 / updates.length;
    const out = new Float64Array(dim);
    for (const u of updates) {
      for (let i = 0; i < dim; i++) out[i]! += w * u.vector[i]!;
    }
    return out;
  }
  const out = new Float64Array(dim);
  for (const u of updates) {
    const w = u.sampleCount / total;
    for (let i = 0; i < dim; i++) out[i]! += w * u.vector[i]!;
  }
  return out;
}

/** Alias for fedAvg — the proximal regularisation is applied client-side. */
export const fedProx = fedAvg;

/**
 * Aggregate Bonawitz-masked updates. The masks cancel iff every cohort
 * member submitted; if any didn't, callers must run `unmaskWithRecovery`
 * before this. The result is a *sum* — to recover the FedAvg weighted
 * mean we have to divide by Σ samples, which is supplied separately
 * because the masked updates carry the per-participant counts in a
 * non-aggregated channel.
 */
export function aggregateAndAverage(
  masked: MaskedUpdate[],
): { aggregate: Float64Array; totalSamples: number } {
  if (masked.length === 0) throw new Error("no_updates");
  // Production: each masked vector is the participant's *(update_i * n_i)*
  // pre-multiplied by their sample count. The orchestrator divides the
  // summed result by Σ n_i to recover the FedAvg weighted mean. We
  // operate on the same convention here.
  const sum = aggregateMaskedUpdates(masked.map((m) => m.masked));
  let total = 0;
  for (const m of masked) total += m.sampleCount;
  if (total === 0) {
    // Same edge-case as fedAvg above: return the unscaled sum.
    return { aggregate: sum, totalSamples: 0 };
  }
  const out = new Float64Array(sum.length);
  for (let i = 0; i < sum.length; i++) out[i] = sum[i]! / total;
  return { aggregate: out, totalSamples: total };
}

/**
 * Hash an aggregate to its canonical fingerprint. The fingerprint is what
 * the orchestrator anchors via the on-chain `ContributionLedger`, so a
 * customer auditing a round can re-aggregate from updates and verify
 * the chain commitment matches.
 *
 * Canonicalisation: serialise the float64 buffer in little-endian, hash
 * the raw bytes. This is *the* commit format and may not change.
 */
export async function aggregateFingerprint(aggregate: Float64Array): Promise<string> {
  const u8 = new Uint8Array(aggregate.buffer, aggregate.byteOffset, aggregate.byteLength);
  return sha256Hex(u8);
}

/**
 * Helper for tests + the local trainer: compute the loss of a linear
 * model `w` on a synthetic dataset (X, y). Mean-squared-error.
 *
 * Used by `shapley.ts` as the utility function fed into TMC sampling.
 */
export function linearMseLoss(
  weights: Float64Array,
  X: Float64Array[],
  y: Float64Array,
): number {
  if (X.length === 0) return 0;
  if (X.length !== y.length) throw new Error("xy_length_mismatch");
  let total = 0;
  for (let r = 0; r < X.length; r++) {
    const row = X[r]!;
    if (row.length !== weights.length) throw new Error("dim_mismatch");
    let pred = 0;
    for (let c = 0; c < row.length; c++) pred += row[c]! * weights[c]!;
    const e = pred - y[r]!;
    total += e * e;
  }
  return total / X.length;
}

// Suppress unused-var on `enc` — kept exported in case downstream
// consumers want to canonicalise the aggregate via a string round-trip.
void enc;
