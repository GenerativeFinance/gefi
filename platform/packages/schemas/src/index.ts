export * from "./model-graph";
export * from "./privacy";
export * from "./fl";

import { z } from "zod";

export const AuditEventSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid().optional(),
  actorId: z.string().optional(),
  kind: z.string(),
  subjectType: z.string(),
  subjectId: z.string(),
  payload: z.record(z.unknown()),
  createdAt: z.string().datetime(),
});
export type AuditEvent = z.infer<typeof AuditEventSchema>;

/** Public-facing privacy claim — never claim absolute privacy. */
export const PUBLIC_PRIVACY_CLAIM =
  "Raw training data remains within each participant's environment. " +
  "Individual updates are protected through secure aggregation. " +
  "The released model is subject to an explicitly tracked (ε,δ)-differential " +
  "privacy guarantee under the documented threat model. Zero-knowledge proofs " +
  "attest to protocol compliance; they do not by themselves make underlying data private.";
