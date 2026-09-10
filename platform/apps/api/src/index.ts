import { Hono } from "hono";
import { cors } from "hono/cors";
import { randomUUID, createHash } from "node:crypto";
import { CalculationRequestSchema, PUBLIC_PRIVACY_CLAIM } from "@gefi/schemas";
import { runRunwayCalculation, validateModelAssumptions } from "@gefi/calc";
import { invokeTool, ToolNameSchema } from "@gefi/ai-tools";
import { createMemoryStore, type MemoryStore } from "@gefi/db";
import {
  canSpend,
  spendEpsilon,
  createBudget,
  type PrivacyBudgetState,
} from "./privacy-budget.js";
import { verifyClientUpdateProof, verifyAggregationProof } from "./zk-verify-client.js";

export type AppEnv = {
  Variables: {
    store: MemoryStore;
    budgets: Map<string, PrivacyBudgetState>;
  };
};

export function createApp(store: MemoryStore = createMemoryStore()) {
  const budgets = new Map<string, PrivacyBudgetState>();
  const app = new Hono<AppEnv>();

  app.use("*", cors({ origin: ["http://localhost:3000", "https://gefi.io", "https://app.gefi.io"] }));
  app.use("*", async (c, next) => {
    c.set("store", store);
    c.set("budgets", budgets);
    await next();
  });

  app.get("/health", (c) => c.json({ ok: true, service: "gefi-api", privacyClaim: PUBLIC_PRIVACY_CLAIM }));

  // --- Auth stub (Phase 1: bearer demo token; gefi-auth Worker replaces this) ---
  app.get("/v1/auth/me", (c) => {
    const auth = c.req.header("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return c.json({ error: "unauthorized" }, 401);
    }
    return c.json({
      userId: "00000000-0000-4000-8000-000000000001",
      email: "demo@gefi.io",
      organizationId: "00000000-0000-4000-8000-000000000010",
      roles: ["analyst", "developer"],
    });
  });

  // --- Organizations / models ---
  app.post("/v1/organizations", async (c) => {
    const body = await c.req.json<{ name: string; slug: string }>();
    const org = {
      id: randomUUID(),
      name: body.name,
      slug: body.slug,
      createdAt: new Date(),
    };
    store.organizations.push(org);
    store.auditEvents.push({
      id: randomUUID(),
      organizationId: org.id,
      actorId: "system",
      kind: "organization.created",
      subjectType: "organization",
      subjectId: org.id,
      payload: { name: org.name },
      createdAt: new Date(),
    });
    return c.json(org, 201);
  });

  app.post("/v1/models", async (c) => {
    const body = await c.req.json<{ organizationId: string; name: string }>();
    const model = {
      id: randomUUID(),
      organizationId: body.organizationId,
      name: body.name,
      version: 1,
      status: "draft",
      contentHash: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.models.push(model);
    budgets.set(model.id, createBudget(model.id, 4.0, 1e-5));
    return c.json(model, 201);
  });

  app.get("/v1/models", (c) => c.json({ items: store.models }));

  app.post("/v1/models/:modelId/scenarios", async (c) => {
    const modelId = c.req.param("modelId");
    const body = await c.req.json<{ name: string; description?: string }>();
    const scenario = {
      id: randomUUID(),
      modelId,
      name: body.name,
      description: body.description ?? null,
      createdAt: new Date(),
    };
    store.scenarios.push(scenario);
    return c.json(scenario, 201);
  });

  // --- Calculations (Track A) ---
  app.post("/v1/models/:modelId/calculations", async (c) => {
    const modelId = c.req.param("modelId");
    const raw = await c.req.json();
    const parsed = CalculationRequestSchema.safeParse({ ...raw, modelId });
    if (!parsed.success) {
      return c.json({ error: "validation_failed", details: parsed.error.flatten() }, 400);
    }
    const warnings = validateModelAssumptions(parsed.data);
    const result = runRunwayCalculation(parsed.data);
    result.warnings = [...warnings, ...result.warnings];
    store.calculations.push({
      id: result.calculationId,
      modelId: result.modelId,
      scenarioId: result.scenarioId,
      version: result.version,
      engine: result.engine,
      metrics: result.metrics,
      series: result.series ?? null,
      warnings: result.warnings,
      artifactUri: null,
      createdAt: new Date(result.createdAt),
    });
    return c.json(result, 201);
  });

  app.get("/v1/calculations/:calculationId", (c) => {
    const hit = store.calculations.find((x) => x.id === c.req.param("calculationId"));
    if (!hit) return c.json({ error: "not_found" }, 404);
    return c.json(hit);
  });

  app.post("/v1/models/:modelId/validations", async (c) => {
    const modelId = c.req.param("modelId");
    const raw = await c.req.json();
    const parsed = CalculationRequestSchema.safeParse({ ...raw, modelId });
    if (!parsed.success) {
      return c.json({ error: "validation_failed", details: parsed.error.flatten() }, 400);
    }
    return c.json({ warnings: validateModelAssumptions(parsed.data) });
  });

  // --- AI tools ---
  app.post("/v1/ai/tools/:tool", async (c) => {
    const toolParse = ToolNameSchema.safeParse(c.req.param("tool"));
    if (!toolParse.success) return c.json({ error: "unknown_tool" }, 404);
    const args = await c.req.json<Record<string, unknown>>();
    const result = invokeTool(toolParse.data, args);
    store.auditEvents.push({
      id: randomUUID(),
      organizationId: null,
      actorId: "ai-orchestrator",
      kind: `ai.tool.${toolParse.data}`,
      subjectType: "tool_call",
      subjectId: result.audit.toolCallId,
      payload: { ok: result.ok, error: result.error ?? null },
      createdAt: new Date(),
    });
    return c.json(result, result.ok ? 200 : 400);
  });

  // --- Federated learning control plane ---
  app.post("/v1/federation/rounds", async (c) => {
    const body = await c.req.json<{
      modelId: string;
      modelVersionHash: string;
      minCohortSize?: number;
      epsilonPerRound?: number;
    }>();
    if (!/^[a-f0-9]{64}$/.test(body.modelVersionHash ?? "")) {
      return c.json({ error: "invalid_model_version_hash" }, 400);
    }
    const budget = budgets.get(body.modelId) ?? createBudget(body.modelId, 4.0, 1e-5);
    budgets.set(body.modelId, budget);
    const eps = body.epsilonPerRound ?? 0.5;
    if (!canSpend(budget, eps)) {
      return c.json({ error: "privacy_budget_exhausted", budget }, 403);
    }
    const round = {
      id: randomUUID(),
      modelId: body.modelId,
      modelVersionHash: body.modelVersionHash,
      status: "enrolling",
      protocolVersion: "gefi-fl-v0.1",
      minCohortSize: body.minCohortSize ?? 3,
      privacy: {
        clipNorm: 1.0,
        noiseMultiplier: 1.1,
        samplingRate: 1.0,
        roundNumber: store.trainingRounds.filter((r) => r.modelId === body.modelId).length,
        delta: budget.delta,
        epsilonSpent: budget.epsilonSpent,
        epsilonTotal: budget.epsilonTotal,
        accountantVersion: budget.accountantVersion,
      },
      createdAt: new Date(),
      completedAt: null,
    };
    store.trainingRounds.push(round);
    return c.json(round, 201);
  });

  app.get("/v1/federation/rounds/:roundId", (c) => {
    const round = store.trainingRounds.find((r) => r.id === c.req.param("roundId"));
    if (!round) return c.json({ error: "not_found" }, 404);
    const updates = store.clientUpdates.filter((u) => u.roundId === round.id);
    const proofs = store.proofArtifacts.filter((p) => p.roundId === round.id);
    return c.json({ round, updates, proofs, privacyClaim: PUBLIC_PRIVACY_CLAIM });
  });

  app.post("/v1/federation/rounds/:roundId/updates", async (c) => {
    const roundId = c.req.param("roundId");
    const round = store.trainingRounds.find((r) => r.id === roundId);
    if (!round) return c.json({ error: "not_found" }, 404);
    const body = await c.req.json<{
      participantId: string;
      updateCommitment: string;
      datasetSnapshotCommitment: string;
      maskedUpdateUri?: string;
      signature: string;
      dpApplied: boolean;
    }>();

    // Invariant: never accept unmasked gradient payloads
    const rawBody = body as Record<string, unknown>;
    if ("gradients" in rawBody || "unmaskedUpdate" in rawBody) {
      return c.json({ error: "raw_update_forbidden" }, 400);
    }

    const update = {
      id: randomUUID(),
      roundId,
      participantId: body.participantId,
      maskedUpdateUri: body.maskedUpdateUri ?? null,
      updateCommitment: body.updateCommitment,
      datasetSnapshotCommitment: body.datasetSnapshotCommitment,
      clipped: true as const,
      dpApplied: body.dpApplied,
      signature: body.signature,
      createdAt: new Date(),
    };
    store.clientUpdates.push(update);
    return c.json(update, 201);
  });

  app.post("/v1/federation/rounds/:roundId/aggregate", async (c) => {
    const roundId = c.req.param("roundId");
    const round = store.trainingRounds.find((r) => r.id === roundId);
    if (!round) return c.json({ error: "not_found" }, 404);
    const updates = store.clientUpdates.filter((u) => u.roundId === roundId);
    if (updates.length < round.minCohortSize) {
      return c.json(
        {
          error: "cohort_too_small",
          cohortSize: updates.length,
          minCohortSize: round.minCohortSize,
        },
        409,
      );
    }

    const budget = budgets.get(round.modelId);
    if (!budget) return c.json({ error: "budget_missing" }, 500);
    const eps = 0.5;
    if (!canSpend(budget, eps)) {
      return c.json({ error: "privacy_budget_exhausted" }, 403);
    }
    spendEpsilon(budget, eps);

    const participantSetHash = createHash("sha256")
      .update(updates.map((u) => u.participantId).sort().join("|"))
      .digest("hex");
    const aggregateCommitment = createHash("sha256")
      .update(updates.map((u) => u.updateCommitment).sort().join("|"))
      .digest("hex");

    const aggProof = await verifyAggregationProof({
      roundId,
      aggregateCommitment,
      cohortSize: updates.length,
      minCohortSize: round.minCohortSize,
      modelVersionHash: round.modelVersionHash,
    });

    const proof = {
      id: randomUUID(),
      roundId,
      kind: "aggregation",
      prover: aggProof.prover,
      proofUri: aggProof.proofUri,
      publicInputsHash: aggregateCommitment.slice(0, 32),
      verified: aggProof.verified,
      verifiedAt: new Date(),
      createdAt: new Date(),
    };
    store.proofArtifacts.push(proof);

    round.status = "completed";
    round.completedAt = new Date();
    round.privacy = {
      ...round.privacy,
      epsilonSpent: budget.epsilonSpent,
    };

    store.auditEvents.push({
      id: randomUUID(),
      organizationId: null,
      actorId: "coordinator",
      kind: "federation.round.aggregated",
      subjectType: "training_round",
      subjectId: roundId,
      payload: {
        cohortSize: updates.length,
        aggregateCommitment,
        participantSetHash,
        epsilonSpent: budget.epsilonSpent,
      },
      createdAt: new Date(),
    });

    return c.json({
      round,
      aggregateCommitment,
      participantSetHash,
      proof,
      privacyClaim: PUBLIC_PRIVACY_CLAIM,
    });
  });

  app.post("/v1/federation/rounds/:roundId/proofs/verify", async (c) => {
    const roundId = c.req.param("roundId");
    const body = await c.req.json<{
      kind: "client_update" | "aggregation";
      publicInputsHash: string;
      proofUri: string;
    }>();
    const result =
      body.kind === "client_update"
        ? await verifyClientUpdateProof(body)
        : await verifyAggregationProof({
            roundId,
            aggregateCommitment: body.publicInputsHash,
            cohortSize: 0,
            minCohortSize: 0,
            modelVersionHash: "0".repeat(64),
            proofUri: body.proofUri,
          });
    return c.json(result);
  });

  app.get("/v1/models/:modelId/privacy-budget", (c) => {
    const budget = budgets.get(c.req.param("modelId"));
    if (!budget) return c.json({ error: "not_found" }, 404);
    return c.json(budget);
  });

  app.get("/v1/audit", (c) => c.json({ items: store.auditEvents.slice(-100) }));

  return app;
}

export default createApp;
