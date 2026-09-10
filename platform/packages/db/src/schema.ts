import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  doublePrecision,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Tenancy */
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull(), // owner | admin | analyst | developer | regulator
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("membership_org_user").on(t.organizationId, t.userId)],
);

/** Track A — calculation graph */
export const models = pgTable("models", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  name: text("name").notNull(),
  version: integer("version").notNull().default(1),
  status: text("status").notNull().default("draft"),
  contentHash: text("content_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const scenarios = pgTable("scenarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .notNull()
    .references(() => models.id),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assumptions = pgTable("assumptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .notNull()
    .references(() => models.id),
  scenarioId: uuid("scenario_id")
    .notNull()
    .references(() => scenarios.id),
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  unit: text("unit").notNull(),
  source: text("source"),
  confidence: doublePrecision("confidence"),
  effectiveFrom: timestamp("effective_from", { withTimezone: true }).notNull(),
});

export const calculations = pgTable("calculations", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .notNull()
    .references(() => models.id),
  scenarioId: uuid("scenario_id")
    .notNull()
    .references(() => scenarios.id),
  version: integer("version").notNull(),
  engine: text("engine").notNull(), // typescript | python
  metrics: jsonb("metrics").notNull(),
  series: jsonb("series"),
  warnings: jsonb("warnings").notNull().default([]),
  artifactUri: text("artifact_uri"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Track B — federated learning governance */
export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  displayName: text("display_name").notNull(),
  publicKey: text("public_key").notNull(),
  status: text("status").notNull().default("enrolled"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const modelVersions = pgTable("model_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .notNull()
    .references(() => models.id),
  version: integer("version").notNull(),
  contentHash: text("content_hash").notNull(),
  artifactUri: text("artifact_uri"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const trainingRounds = pgTable("training_rounds", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .notNull()
    .references(() => models.id),
  modelVersionHash: text("model_version_hash").notNull(),
  status: text("status").notNull().default("pending"),
  protocolVersion: text("protocol_version").notNull(),
  minCohortSize: integer("min_cohort_size").notNull().default(3),
  privacy: jsonb("privacy").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const clientUpdates = pgTable("client_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  roundId: uuid("round_id")
    .notNull()
    .references(() => trainingRounds.id),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id),
  /** Masked update URI only — never store unmasked gradients. */
  maskedUpdateUri: text("masked_update_uri"),
  updateCommitment: text("update_commitment").notNull(),
  datasetSnapshotCommitment: text("dataset_snapshot_commitment").notNull(),
  clipped: boolean("clipped").notNull().default(true),
  dpApplied: boolean("dp_applied").notNull(),
  signature: text("signature").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const updateCommitments = pgTable("update_commitments", {
  id: uuid("id").primaryKey().defaultRandom(),
  roundId: uuid("round_id")
    .notNull()
    .references(() => trainingRounds.id),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id),
  modelVersionHash: text("model_version_hash").notNull(),
  updateCommitment: text("update_commitment").notNull(),
  datasetSnapshotCommitment: text("dataset_snapshot_commitment").notNull(),
  protocolVersion: text("protocol_version").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aggregationCommitments = pgTable("aggregation_commitments", {
  id: uuid("id").primaryKey().defaultRandom(),
  roundId: uuid("round_id")
    .notNull()
    .references(() => trainingRounds.id),
  modelVersionHash: text("model_version_hash").notNull(),
  participantSetHash: text("participant_set_hash").notNull(),
  aggregateCommitment: text("aggregate_commitment").notNull(),
  cohortSize: integer("cohort_size").notNull(),
  minCohortSize: integer("min_cohort_size").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const proofArtifacts = pgTable("proof_artifacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  roundId: uuid("round_id")
    .notNull()
    .references(() => trainingRounds.id),
  kind: text("kind").notNull(),
  prover: text("prover").notNull(),
  proofUri: text("proof_uri").notNull(),
  publicInputsHash: text("public_inputs_hash").notNull(),
  verified: boolean("verified").notNull().default(false),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const privacyBudgets = pgTable("privacy_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .notNull()
    .references(() => models.id),
  epsilonTotal: doublePrecision("epsilon_total").notNull(),
  epsilonSpent: doublePrecision("epsilon_spent").notNull().default(0),
  delta: doublePrecision("delta").notNull(),
  accountantVersion: text("accountant_version").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  actorId: text("actor_id"),
  kind: text("kind").notNull(),
  subjectType: text("subject_type").notNull(),
  subjectId: text("subject_id").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
