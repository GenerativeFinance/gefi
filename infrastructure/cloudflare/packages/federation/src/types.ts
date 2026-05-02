/**
 * Federation round + update + score types. Mirrors the D1 schema in
 * `workers/api/migrations/0003_init_federation.sql`.
 *
 * Vector representation choice: `Float64Array`. We deliberately avoid
 * `Float32Array` — TMC-Shapley needs to subtract two large model
 * losses to recover a small marginal contribution, and float32 chops
 * off the bottom 5 mantissa bits we'd then re-multiply by sample
 * count. The whole pipeline is in float64; downcast at the wire if
 * a customer needs to send fp16.
 */

import type { Region } from "@gefi/shared-types";

export type RoundStatus =
  | "init"
  | "invite"
  | "collect"
  | "aggregate"
  | "distribute"
  | "closed"
  | "failed";

export type RoundAlgorithm = "fedavg" | "fedprox";

export type ParticipantStatus =
  | "invited"
  | "accepted"
  | "submitted"
  | "dropped"
  | "rejected";

export type AttestationKind = "stub" | "sgx" | "nitro";

export interface FederationRound {
  id: string;
  modelId: string;
  jurisdiction: Region;
  roundNumber: number;
  status: RoundStatus;
  algorithm: RoundAlgorithm;
  /** Differential-privacy noise multiplier σ. 0 disables DP. */
  dpNoiseMultiplier: number;
  dpL2Clip: number;
  /** True iff the orchestrator demands Bonawitz pairwise masks. */
  secureAggregation: boolean;
  minParticipants: number;
  maxParticipants: number;
  baselineVersionId: string | null;
  targetVersionId: string | null;
  aggregateSha256: string | null;
  chainTxHash: string | null;
  invitedAt: number | null;
  collectedAt: number | null;
  aggregatedAt: number | null;
  distributedAt: number | null;
  closedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface FederationParticipant {
  id: string;
  roundId: string;
  tenantId: string;
  jurisdiction: Region;
  status: ParticipantStatus;
  attestationKind: AttestationKind | null;
  attestationQuote: string | null;
  attestationMrenclave: string | null;
  invitedAt: number;
  acceptedAt: number | null;
  submittedAt: number | null;
  sampleCount: number;
  /** sha256(hex) of the participant-bound bearer; null for legacy rows. */
  nodeTokenHash: string | null;
}

export interface FederationUpdate {
  id: string;
  roundId: string;
  participantId: string;
  tenantId: string;
  /** R2 key. Bytes are NOT D1 columns — we ship hashes only. */
  r2Key: string;
  payloadSha256: string;
  payloadSize: number;
  /** Bonawitz mask-sum fingerprint. Null if `secureAggregation = false`. */
  maskSumSha256: string | null;
  dpNoiseApplied: number;
  sampleCount: number;
  createdAt: number;
}

export interface ContributionScore {
  roundId: string;
  tenantId: string;
  /** Raw TMC-Shapley value. Conventionally [-1, 1] but unbounded. */
  score: number;
  permutations: number;
  computedAt: number;
}

/**
 * In-memory representation of a participant's *plaintext* update —
 * gradient or weight delta. Production ships fp16 over R2; the round
 * pipeline upcasts to fp64 at aggregation time.
 */
export interface PlaintextUpdate {
  participantId: string;
  tenantId: string;
  vector: Float64Array;
  sampleCount: number;
}

/**
 * A participant's *masked* update, ready for Bonawitz secure aggregation.
 * `mask` is the sum of pairwise masks shared with every other participant
 * (negated for indices > self). When all participants submit, the masks
 * cancel exactly and `Σ masked = Σ plaintext`.
 */
export interface MaskedUpdate {
  participantId: string;
  tenantId: string;
  masked: Float64Array;
  /** sha-256 of canonical mask payload, used as a tamper anchor. */
  maskSumSha256: string;
  sampleCount: number;
}
