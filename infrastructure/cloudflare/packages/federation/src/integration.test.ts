/**
 * 3-node consortium integration test.
 *
 * Runs a full FedAvg round end-to-end:
 *
 *   1. Three nodes generate deterministic update vectors.
 *   2. Bonawitz pairwise masks (DeterministicMaskSource) are applied so
 *      no plaintext leaves a participant's boundary.
 *   3. Orchestrator aggregates the masked updates and verifies the
 *      result matches plaintext FedAvg to ~1e-9.
 *   4. TMC-Shapley scores are computed against a synthetic test set.
 *   5. computeRewards splits a 1 ETH pool by Shapley contribution.
 *   6. StubRewardDistributor records the per-recipient payouts and we
 *      assert Σ payouts == pool exactly when at least one positive
 *      allocation exists.
 *
 * This is the contract test for the whole federation stack.
 */

import { describe, expect, it } from "vitest";
import {
  aggregateAndAverage,
  aggregateFingerprint,
  fedAvg,
  type MaskedUpdate,
  type PlaintextUpdate,
} from "./index.js";
import { DeterministicMaskSource, maskUpdate } from "./secure-agg.js";
import { tmcShapley } from "./shapley.js";
import { computeRewards, StubRewardDistributor } from "@gefi/onchain-federation";

const DIM = 8;

function rawUpdate(seed: number): Float64Array {
  const v = new Float64Array(DIM);
  for (let i = 0; i < DIM; i++) v[i] = Math.sin(seed * 0.7 + i * 0.3) * 0.5;
  return v;
}

function preWeighted(seed: number, n: number): Float64Array {
  const v = rawUpdate(seed);
  for (let i = 0; i < DIM; i++) v[i]! *= n;
  return v;
}

describe("3-node consortium round", () => {
  it("masked aggregate equals plaintext FedAvg + Shapley + rewards", async () => {
    const roundId = "round_1";
    const nodes = [
      { participantId: "p1", tenantId: "t_a", recipientAddress: "0x" + "11".repeat(20), sampleCount: 100 },
      { participantId: "p2", tenantId: "t_b", recipientAddress: "0x" + "22".repeat(20), sampleCount: 200 },
      { participantId: "p3", tenantId: "t_c", recipientAddress: "0x" + "33".repeat(20), sampleCount: 300 },
    ];
    const cohort = nodes.map((n) => n.participantId);
    const totalSamples = nodes.reduce((s, n) => s + n.sampleCount, 0);

    // Plaintext FedAvg reference (raw, unweighted vectors).
    const plaintext: PlaintextUpdate[] = nodes.map((n, i) => ({
      participantId: n.participantId,
      tenantId: n.tenantId,
      vector: rawUpdate(i + 1),
      sampleCount: n.sampleCount,
    }));
    const plaintextAgg = fedAvg(plaintext);

    // Masked path. The aggregateAndAverage convention is "vector pre-multiplied
    // by sample count" — sum then divide by Σ samples.
    const source = new DeterministicMaskSource();
    const masked: MaskedUpdate[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]!;
      const out = await maskUpdate(
        { roundId, participantId: n.participantId, cohort, update: preWeighted(i + 1, n.sampleCount) },
        source,
      );
      masked.push({
        participantId: n.participantId,
        tenantId: n.tenantId,
        masked: out.masked,
        maskSumSha256: out.maskSumSha256,
        sampleCount: n.sampleCount,
      });
    }
    const { aggregate: maskedAgg, totalSamples: ts2 } = aggregateAndAverage(masked);
    expect(ts2).toBe(totalSamples);
    for (let i = 0; i < DIM; i++) {
      expect(Math.abs(maskedAgg[i]! - plaintextAgg[i]!)).toBeLessThan(1e-9);
    }

    // Aggregate fingerprint is well-formed sha256.
    const sha = await aggregateFingerprint(maskedAgg);
    expect(sha).toMatch(/^[0-9a-f]{64}$/);

    // TMC-Shapley over a synthetic linear test set.
    const X: Float64Array[] = [];
    const y = new Float64Array(20);
    for (let r = 0; r < 20; r++) {
      const row = new Float64Array(DIM);
      for (let c = 0; c < DIM; c++) row[c] = Math.cos(r + c * 0.5);
      X.push(row);
      y[r] = Math.sin(r) * 0.2;
    }
    const shap = tmcShapley({ participants: plaintext, X, y, permutations: 6 });
    expect(shap.scores).toHaveLength(3);
    expect(shap.permutationsSampled).toBe(6);

    // Rewards: split 1 ETH by Shapley score, clamping negatives to zero.
    const allocations = computeRewards({
      totalPoolWei: 1_000_000_000_000_000_000n,
      contributions: shap.scores.map((score, i) => ({
        tenantId: nodes[i]!.tenantId,
        recipientAddress: nodes[i]!.recipientAddress,
        score,
      })),
    });
    const totalAllocated = allocations.reduce((s, a) => s + a.amountWei, 0n);
    if (totalAllocated > 0n) {
      // Σ allocations equals pool exactly (rounding remainder poured into the largest).
      expect(totalAllocated).toBe(1_000_000_000_000_000_000n);
    }

    // Distribute via the stub — only positive allocations go on-chain.
    const distributor = new StubRewardDistributor();
    const positive = allocations.filter((a) => a.amountWei > 0n);
    for (const a of positive) {
      await distributor.distribute({ recipient: a.recipientAddress, amountWei: a.amountWei, roundId });
    }
    expect(distributor.calls.length).toBe(positive.length);
    for (let i = 0; i < positive.length; i++) {
      expect(distributor.calls[i]!.amountWei).toBe(positive[i]!.amountWei);
    }
  });
});
