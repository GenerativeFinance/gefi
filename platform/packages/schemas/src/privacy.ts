import { z } from "zod";

export const PrivacyParamsSchema = z.object({
  clipNorm: z.number().positive(),
  noiseMultiplier: z.number().nonnegative(),
  samplingRate: z.number().min(0).max(1),
  roundNumber: z.number().int().nonnegative(),
  delta: z.number().positive(),
  epsilonSpent: z.number().nonnegative(),
  epsilonTotal: z.number().positive(),
  accountantVersion: z.string(),
});
export type PrivacyParams = z.infer<typeof PrivacyParamsSchema>;

export const UpdateCommitmentSchema = z.object({
  roundId: z.string().uuid(),
  participantId: z.string().uuid(),
  modelVersionHash: z.string().regex(/^[a-f0-9]{64}$/),
  updateCommitment: z.string().min(16),
  datasetSnapshotCommitment: z.string().min(16),
  protocolVersion: z.string(),
  createdAt: z.string().datetime(),
});
export type UpdateCommitment = z.infer<typeof UpdateCommitmentSchema>;

export const AggregationCommitmentSchema = z.object({
  roundId: z.string().uuid(),
  modelVersionHash: z.string().regex(/^[a-f0-9]{64}$/),
  participantSetHash: z.string().min(16),
  aggregateCommitment: z.string().min(16),
  cohortSize: z.number().int().positive(),
  minCohortSize: z.number().int().positive(),
  createdAt: z.string().datetime(),
});
export type AggregationCommitment = z.infer<typeof AggregationCommitmentSchema>;

export const ProofArtifactSchema = z.object({
  id: z.string().uuid(),
  roundId: z.string().uuid(),
  kind: z.enum(["client_update", "aggregation", "evaluation"]),
  prover: z.enum(["ezkl", "halo2", "risc0", "sp1", "deterministic_stub"]),
  proofUri: z.string().url().or(z.string().startsWith("r2://")),
  publicInputsHash: z.string().min(16),
  verified: z.boolean(),
  verifiedAt: z.string().datetime().optional(),
});
export type ProofArtifact = z.infer<typeof ProofArtifactSchema>;
