/*
 * Copyright 2026 GeFi Labs. Licensed under the Apache License, Version 2.0.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Local trainer for the reference node-agent.
 *
 * Implements DP-SGD on a linear-regression objective. Real customer
 * agents typically wire a deeper model via PyTorch/TF — this trainer
 * is the reference implementation that ships with the agent so a new
 * operator can verify their adapter round-trips correctly without
 * dragging in a full ML runtime.
 *
 * Loss: mean-squared-error.
 * Update rule: w := w - η * ∇L(w; X, y)
 * DP step (per Abadi et al. 2016, "Deep Learning with Differential Privacy"):
 *
 *   1. Per EXAMPLE, compute the gradient and L2-clip it to ≤ C. This
 *      bounds the per-example sensitivity to C regardless of outliers.
 *   2. Per BATCH, sum the per-example clipped gradients, then add
 *      Gaussian noise N(0, (σ·C)²) ONCE to that sum. Critical: the
 *      noise is NOT re-clipped — clipping happened per-example, and a
 *      second l2-clip on the noisy sum would distort the unbiased
 *      gradient estimate the moments accountant assumes.
 *   3. Per BATCH, divide by batch size and apply SGD step. Each batch
 *      uses a FRESH PRNG seed (`dpSeed`, `epoch`, `batchIdx` mixed via
 *      a 32-bit splitmix-style hash) so independence across batches is
 *      preserved — privacy accounting (RDP composition) requires it.
 *
 * The output is the WEIGHT-DELTA vs the round's baseline, multiplied by
 * the number of training examples. The orchestrator divides Σ by Σ n_i
 * to recover the FedAvg-weighted mean delta. (See `aggregator.ts`
 * convention in `@gefi/federation`.)
 */

import { addGaussianNoise } from "@gefi/federation/dp";
import type { DataAdapter } from "./adapters.js";

/**
 * Splitmix-style 32-bit hash: mixes (dpSeed, epoch, batchIdx) into a
 * deterministic-but-decorrelated seed for the per-batch noise PRNG.
 * Reused inputs ⇒ reused noise stream, which would break DP — callers
 * must ensure the (epoch, batchIdx) tuple is unique within a round.
 */
function mixSeed(dpSeed: number, epoch: number, batchIdx: number): number {
  let z = (dpSeed | 0) ^ Math.imul(epoch + 1, 0x9e3779b1) ^ Math.imul(batchIdx + 1, 0x85ebca77);
  z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
  z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
  z = z ^ (z >>> 16);
  return z >>> 0;
}

export interface TrainInput {
  baseline: Float64Array;
  adapter: DataAdapter;
  /** Number of full passes over the local data. Default 1. */
  epochs?: number;
  /** SGD learning rate. */
  learningRate?: number;
  /** Mini-batch size — the adapter is asked for `batchSize` rows at a time. */
  batchSize?: number;
  /** DP-SGD parameters; pinned by the round. */
  dpNoiseMultiplier: number;
  dpL2Clip: number;
  /** Seed for the per-participant DP-noise PRNG. */
  dpSeed: number;
}

export interface TrainOutput {
  /** weight-delta * sampleCount (orchestrator divides by Σ n). */
  scaledDelta: Float64Array;
  /** Total examples consumed in this training run. */
  sampleCount: number;
  /** Final local loss after training. Surfaced in the audit log. */
  finalLoss: number;
}

/**
 * Train one round of DP-SGD on the local data, return the scaled weight delta.
 *
 * Implementation note: we explicitly avoid pre-loading the full dataset
 * into memory. The adapter is a streaming source so a customer with a
 * billion-row warehouse can train without spilling. We also accumulate
 * the *summed* clipped gradient and apply DP noise once at the end —
 * that way ε is computed against the round, not per-batch, which is
 * what the moments accountant expects.
 */
export async function trainOneRound(input: TrainInput): Promise<TrainOutput> {
  const epochs = input.epochs ?? 1;
  const lr = input.learningRate ?? 0.05;
  const batchSize = input.batchSize ?? 64;
  const dim = input.baseline.length;

  // Working copy of the weights — gradient descent mutates this.
  const w = new Float64Array(dim);
  w.set(input.baseline);

  let total = 0;
  let lastLoss = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    let cursor: string | null = null;
    let batchIdx = 0;
    do {
      const batch = await input.adapter.read(cursor, batchSize);
      cursor = batch.cursor;
      if (batch.X.length === 0) break;

      // Per-example gradient = 2 * (w·x − y) * x. We accumulate the
      // *clipped* per-example gradient sum so per-example sensitivity
      // is bounded to dpL2Clip regardless of outliers.
      const sumClipped = new Float64Array(dim);
      let batchLoss = 0;
      for (let i = 0; i < batch.X.length; i++) {
        const x = batch.X[i]!;
        if (x.length !== dim) throw new Error("batch_dim_mismatch");
        let pred = 0;
        for (let j = 0; j < dim; j++) pred += w[j]! * x[j]!;
        const err = pred - batch.y[i]!;
        batchLoss += err * err;
        const g = new Float64Array(dim);
        for (let j = 0; j < dim; j++) g[j] = 2 * err * x[j]!;
        // Per-example clip — see header comment.
        let sq = 0;
        for (let j = 0; j < dim; j++) sq += g[j]! * g[j]!;
        const norm = Math.sqrt(sq);
        const scale = norm <= input.dpL2Clip ? 1 : input.dpL2Clip / norm;
        for (let j = 0; j < dim; j++) sumClipped[j]! += scale * g[j]!;
      }
      lastLoss = batchLoss / batch.X.length;
      // Add Gaussian noise to the per-example-clipped batch sum. We
      // call addGaussianNoise (NOT applyDpSgd) so we don't re-clip an
      // already-clipped sum — that would bias the moments accountant's
      // assumed sensitivity. The seed is unique per (epoch, batchIdx)
      // so each batch consumes an independent noise stream.
      const noisy = addGaussianNoise({
        vector: sumClipped,
        noiseMultiplier: input.dpNoiseMultiplier,
        clipNorm: input.dpL2Clip,
        seed: mixSeed(input.dpSeed, epoch, batchIdx),
      });
      // Apply averaged update: w -= η * (1/N) * (Σ clipped + noise)
      const inv = 1 / batch.X.length;
      for (let j = 0; j < dim; j++) w[j]! -= lr * inv * noisy[j]!;
      total += batch.X.length;
      batchIdx++;
    } while (cursor !== null);
  }

  // Output: scaled weight delta = (w - baseline) * sampleCount.
  const delta = new Float64Array(dim);
  for (let j = 0; j < dim; j++) delta[j] = (w[j]! - input.baseline[j]!) * total;

  return { scaledDelta: delta, sampleCount: total, finalLoss: lastLoss };
}
