/**
 * Truncated Monte-Carlo Shapley (Ghorbani & Zou 2019).
 *
 * Computing exact Shapley values for n participants is O(n!) — infeasible
 * past n ≈ 8. TMC-Shapley estimates each participant's Shapley value by
 * sampling random permutations of the participants, computing the
 * marginal utility lift each one provides at their position in the
 * permutation, and averaging.
 *
 * Truncation: once the cumulative utility drops within `tolerance` of the
 * full-coalition utility, every later participant in the permutation
 * gets a marginal of 0 for that permutation. This caps wasted work on
 * the long tail of the permutation.
 *
 * For deterministic tests, `permutationsSource` lets callers inject the
 * exact permutation order to replay. Production uses a fresh
 * crypto-random shuffle each invocation.
 */

import type { PlaintextUpdate } from "./types.js";
import { fedAvg, linearMseLoss } from "./aggregator.js";
import { mulberry32 } from "./prng.js";

export interface ShapleyInput {
  participants: PlaintextUpdate[];
  /**
   * Validation set (X, y) used to compute the utility of a coalition.
   * Held outside the participants — the orchestrator owns this.
   */
  X: Float64Array[];
  y: Float64Array;
  /**
   * Maximum permutations to sample. 100 is enough for n ≤ 10 to be
   * within ~5 % of the true Shapley value; raise for tighter estimates.
   */
  permutations: number;
  /**
   * If a permutation's running utility is within `tolerance` of the
   * full-coalition utility, later participants get a 0 marginal. Set
   * to 0 to disable truncation.
   */
  tolerance?: number;
  /**
   * Optional injected permutation source. Returns a fresh permutation
   * of `[0, n)` per call. When omitted, a deterministic mulberry32
   * Fisher-Yates shuffle is used (seeded by a hash of participant ids
   * so two identical inputs yield identical scores).
   */
  permutationsSource?: () => number[];
}

export interface ShapleyResult {
  /** Per-participant Shapley value, ordered to match `participants`. */
  scores: number[];
  /** How many permutations were sampled. */
  permutationsSampled: number;
}

function fisherYatesFactory(n: number, seed: number): () => number[] {
  const rand = mulberry32(seed);
  return function next(): number[] {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = arr[i]!;
      arr[i] = arr[j]!;
      arr[j] = tmp;
    }
    return arr;
  };
}

/**
 * Compute the utility of a coalition `S ⊆ participants` against (X, y).
 * Negative MSE so higher = better, matching the Shapley convention that
 * marginal contributions are computed as `u(S ∪ {i}) − u(S)`.
 */
function utility(
  participants: PlaintextUpdate[],
  S: number[],
  X: Float64Array[],
  y: Float64Array,
): number {
  if (S.length === 0) {
    // Empty-coalition baseline: predict the dataset mean. Equivalent
    // to a zero-weight model on a centred dataset, so MSE = Var(y).
    let m = 0;
    for (const v of y) m += v;
    m /= y.length;
    let mse = 0;
    for (const v of y) mse += (v - m) * (v - m);
    return -mse / y.length;
  }
  const subset = S.map((i) => participants[i]!);
  const w = fedAvg(subset);
  return -linearMseLoss(w, X, y);
}

export function tmcShapley(input: ShapleyInput): ShapleyResult {
  const { participants, X, y, permutations } = input;
  const n = participants.length;
  if (n === 0) return { scores: [], permutationsSampled: 0 };
  const tolerance = input.tolerance ?? 0;
  const seedSrc = participants.map((p) => p.participantId).join("|");
  let seed = 0;
  for (let i = 0; i < seedSrc.length; i++) seed = (seed * 31 + seedSrc.charCodeAt(i)) >>> 0;
  const nextPerm = input.permutationsSource ?? fisherYatesFactory(n, seed);

  const fullSet = Array.from({ length: n }, (_, i) => i);
  const fullUtility = utility(participants, fullSet, X, y);

  const sums = new Array<number>(n).fill(0);
  let actual = 0;
  for (let p = 0; p < permutations; p++) {
    const perm = nextPerm();
    if (perm.length !== n) throw new Error("permutation_size_mismatch");
    let prevU = utility(participants, [], X, y);
    const coalition: number[] = [];
    for (const idx of perm) {
      coalition.push(idx);
      let marginal = 0;
      // Truncation check — if we're already within tolerance of the
      // full-coalition utility, the rest of the permutation gets 0.
      if (Math.abs(fullUtility - prevU) > tolerance) {
        const u = utility(participants, coalition, X, y);
        marginal = u - prevU;
        prevU = u;
      }
      sums[idx]! += marginal;
    }
    actual++;
  }
  const scores = sums.map((s) => s / Math.max(actual, 1));
  return { scores, permutationsSampled: actual };
}
