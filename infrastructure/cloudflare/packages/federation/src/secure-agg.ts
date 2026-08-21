/**
 * Bonawitz pairwise-mask secure aggregation, deterministic seeded variant.
 *
 * Protocol sketch (production):
 *
 *   1. Every pair (i, j) of participants performs an ECDH key exchange
 *      and derives a shared 256-bit secret s_ij = s_ji.
 *   2. Each participant i samples a per-element mask m_ij from a CSPRNG
 *      seeded by s_ij. By convention, when i < j, i adds m_ij to its
 *      update and j subtracts the same m_ij. So Σ mask_i = 0 across all
 *      participants, regardless of which subset of pairs cooperated.
 *   3. Each participant submits update_i + Σ_j sign(i,j) * m_ij to the
 *      orchestrator. The orchestrator sums the submissions; masks cancel
 *      and the orchestrator recovers Σ update_i WITHOUT seeing any
 *      individual update_i.
 *   4. To survive dropouts (a participant that masks but doesn't submit
 *      leaves an unbalanced mask), Bonawitz adds a Shamir secret-sharing
 *      step over each s_ij so the surviving participants can reconstruct
 *      the missing masks. We implement that recovery in `unmaskWithRecovery`.
 *
 * For tests + reference, we replace the ECDH+CSPRNG step with a seeded
 * mulberry32: `seed_ij = hash(roundId || sorted(i, j))`. This is bit-for-bit
 * reproducible across nodes, which is what we want for the 3-node consortium
 * test. The production node-agent ships a real ECDH derivation behind the
 * same `PairwiseMaskSource` interface.
 */

import { mulberry32, seedFromString } from "./prng.js";

const enc = new TextEncoder();

/** sha-256 helper that returns 64-hex. */
async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  const b = new Uint8Array(buf);
  let h = "";
  for (let i = 0; i < b.length; i++) h += b[i]!.toString(16).padStart(2, "0");
  return h;
}

/** Deterministic JSON canonicaliser (matches compliance-engine/merkle). */
function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  const keys = Object.keys(value as Record<string, unknown>).sort();
  const obj = value as Record<string, unknown>;
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalJson(obj[k])).join(",") + "}";
}

export interface PairwiseMaskSource {
  /**
   * Generate a length-d mask for a pair `(self, peer)`. By contract:
   *   - The same pair, regardless of who asks, must yield the same mask.
   *   - Identity convention: `self < peer` adds; `self > peer` subtracts.
   * The implementation handles the sign internally based on lexical order.
   */
  pairwiseMask(roundId: string, self: string, peer: string, dim: number): Float64Array;
}

/**
 * Deterministic mask source — reproducible across all participants given
 * the same `roundId` + the same pair. Reference implementation; production
 * uses an ECDH-derived seed.
 */
export class DeterministicMaskSource implements PairwiseMaskSource {
  pairwiseMask(roundId: string, self: string, peer: string, dim: number): Float64Array {
    if (self === peer) throw new Error("pairwise_mask_self_peer_equal");
    const [lo, hi] = self < peer ? [self, peer] : [peer, self];
    const sign = self === lo ? 1 : -1;
    const seed = seedFromString(`${roundId}|${lo}|${hi}`);
    const rand = mulberry32(seed);
    const out = new Float64Array(dim);
    for (let i = 0; i < dim; i++) {
      // Centred uniform draws scale-matched to the gradient magnitudes a
      // typical FedAvg round operates at (≈ 1e-2). Real Bonawitz uses
      // much wider Z_q masks; we deliberately keep the magnitude small
      // so unit tests can sanity-check without floating-point flakes.
      out[i] = sign * (rand() - 0.5) * 0.01;
    }
    return out;
  }
}

export interface MaskInput {
  roundId: string;
  participantId: string;
  /** Sorted, deduplicated set of all participants in this round. */
  cohort: string[];
  /** The plaintext update to mask. */
  update: Float64Array;
}

export interface MaskOutput {
  masked: Float64Array;
  /** sha-256(canonical(roundId, participantId, peers)) — tamper anchor. */
  maskSumSha256: string;
}

/**
 * Apply the sum of pairwise masks across `cohort \ {self}` to the update.
 * Returns the masked update and a fingerprint over the (roundId, self, peers)
 * tuple so the orchestrator can verify the participant computed masks
 * against the cohort it was told about.
 */
export async function maskUpdate(
  input: MaskInput,
  source: PairwiseMaskSource = new DeterministicMaskSource(),
): Promise<MaskOutput> {
  const { roundId, participantId, cohort, update } = input;
  if (!cohort.includes(participantId)) throw new Error("self_not_in_cohort");
  if (cohort.length < 2) throw new Error("cohort_too_small");
  const dim = update.length;
  const masked = new Float64Array(dim);
  masked.set(update);
  const peers = cohort.filter((p) => p !== participantId).sort();
  for (const peer of peers) {
    const m = source.pairwiseMask(roundId, participantId, peer, dim);
    for (let i = 0; i < dim; i++) masked[i]! += m[i]!;
  }
  const maskSumSha256 = await sha256Hex(
    canonicalJson({ roundId, self: participantId, peers }),
  );
  return { masked, maskSumSha256 };
}

/**
 * Sum a list of masked updates. If every cohort member submitted, the
 * pairwise masks cancel exactly and the result equals Σ plaintext_update.
 * Returns the SUM, not the average — the FedAvg weighted-mean is computed
 * downstream in `aggregator.ts` because it needs sample counts.
 */
export function aggregateMaskedUpdates(updates: Float64Array[]): Float64Array {
  if (updates.length === 0) throw new Error("no_updates");
  const dim = updates[0]!.length;
  const out = new Float64Array(dim);
  for (const u of updates) {
    if (u.length !== dim) throw new Error("dim_mismatch");
    for (let i = 0; i < dim; i++) out[i]! += u[i]!;
  }
  return out;
}

/**
 * Dropout recovery. If a participant masked but didn't submit, their
 * pairwise masks are stuck in the aggregate. The surviving participants
 * each contribute the masks they shared with the dropout, signed
 * appropriately, so the orchestrator can subtract them out.
 *
 * Inputs:
 *   - `aggregate` — sum over the surviving submissions.
 *   - `dropouts`  — participant ids that masked-but-didn't-submit.
 *   - `survivors` — participant ids that submitted.
 *   - `roundId`   — round seed.
 * Returns the de-masked aggregate (Σ over the survivors' plaintext updates).
 *
 * Note this only works because masks are pairwise: each pairwise mask
 * appears in exactly one survivor's submission and must be subtracted
 * exactly once. We sum (survivor, dropout) masks across all such pairs.
 */
export function unmaskWithRecovery(
  aggregate: Float64Array,
  roundId: string,
  survivors: string[],
  dropouts: string[],
  source: PairwiseMaskSource = new DeterministicMaskSource(),
): Float64Array {
  const out = new Float64Array(aggregate.length);
  out.set(aggregate);
  for (const s of survivors) {
    for (const d of dropouts) {
      // The survivor's submission carries +mask(s, d); subtract it so
      // the dropout's missing -mask(d, s) doesn't unbalance the sum.
      const m = source.pairwiseMask(roundId, s, d, aggregate.length);
      for (let i = 0; i < aggregate.length; i++) out[i]! -= m[i]!;
    }
  }
  return out;
}
