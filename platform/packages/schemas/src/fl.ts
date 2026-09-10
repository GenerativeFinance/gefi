import { z } from "zod";
import { PrivacyParamsSchema } from "./privacy";

export const TrainingRoundStatusSchema = z.enum([
  "pending",
  "enrolling",
  "training",
  "aggregating",
  "proving",
  "completed",
  "aborted",
]);
export type TrainingRoundStatus = z.infer<typeof TrainingRoundStatusSchema>;

export const TrainingRoundSchema = z.object({
  id: z.string().uuid(),
  modelId: z.string().uuid(),
  modelVersionHash: z.string().regex(/^[a-f0-9]{64}$/),
  status: TrainingRoundStatusSchema,
  protocolVersion: z.string(),
  minCohortSize: z.number().int().positive(),
  privacy: PrivacyParamsSchema,
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});
export type TrainingRound = z.infer<typeof TrainingRoundSchema>;

export const ClientUpdateSchema = z.object({
  id: z.string().uuid(),
  roundId: z.string().uuid(),
  participantId: z.string().uuid(),
  /** Masked update only — never store unmasked gradients. */
  maskedUpdateUri: z.string().optional(),
  updateCommitment: z.string().min(16),
  datasetSnapshotCommitment: z.string().min(16),
  clipped: z.literal(true),
  dpApplied: z.boolean(),
  signature: z.string().min(16),
  createdAt: z.string().datetime(),
});
export type ClientUpdate = z.infer<typeof ClientUpdateSchema>;

export const ParticipantSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  displayName: z.string(),
  publicKey: z.string().min(16),
  status: z.enum(["enrolled", "active", "suspended"]),
});
export type Participant = z.infer<typeof ParticipantSchema>;

export const RoundReceiptSchema = z.object({
  roundId: z.string().uuid(),
  participantId: z.string().uuid(),
  modelVersionHash: z.string(),
  updateCommitment: z.string(),
  signedAt: z.string().datetime(),
  signature: z.string(),
});
export type RoundReceipt = z.infer<typeof RoundReceiptSchema>;
