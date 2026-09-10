export * from "./schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Db = ReturnType<typeof createDb>;

export function createDb(connectionString: string) {
  const client = postgres(connectionString, { max: 10 });
  return drizzle(client, { schema });
}

export type MemoryOrg = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
};

export type MemoryModel = {
  id: string;
  organizationId: string;
  name: string;
  version: number;
  status: string;
  contentHash: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MemoryScenario = {
  id: string;
  modelId: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

export type MemoryCalculation = {
  id: string;
  modelId: string;
  scenarioId: string;
  version: number;
  engine: string;
  metrics: Record<string, number>;
  series: unknown;
  warnings: string[];
  artifactUri: string | null;
  createdAt: Date;
};

export type MemoryRound = {
  id: string;
  modelId: string;
  modelVersionHash: string;
  status: string;
  protocolVersion: string;
  minCohortSize: number;
  privacy: Record<string, unknown>;
  createdAt: Date;
  completedAt: Date | null;
};

export type MemoryClientUpdate = {
  id: string;
  roundId: string;
  participantId: string;
  maskedUpdateUri: string | null;
  updateCommitment: string;
  datasetSnapshotCommitment: string;
  clipped: true;
  dpApplied: boolean;
  signature: string;
  createdAt: Date;
};

export type MemoryProof = {
  id: string;
  roundId: string;
  kind: string;
  prover: string;
  proofUri: string;
  publicInputsHash: string;
  verified: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
};

export type MemoryAudit = {
  id: string;
  organizationId: string | null;
  actorId: string | null;
  kind: string;
  subjectType: string;
  subjectId: string;
  payload: Record<string, unknown>;
  createdAt: Date;
};

export type MemoryStore = {
  organizations: MemoryOrg[];
  models: MemoryModel[];
  scenarios: MemoryScenario[];
  assumptions: unknown[];
  calculations: MemoryCalculation[];
  trainingRounds: MemoryRound[];
  clientUpdates: MemoryClientUpdate[];
  privacyBudgets: unknown[];
  proofArtifacts: MemoryProof[];
  auditEvents: MemoryAudit[];
  participants: unknown[];
};

export function createMemoryStore(): MemoryStore {
  return {
    organizations: [],
    models: [],
    scenarios: [],
    assumptions: [],
    calculations: [],
    trainingRounds: [],
    clientUpdates: [],
    privacyBudgets: [],
    proofArtifacts: [],
    auditEvents: [],
    participants: [],
  };
}
