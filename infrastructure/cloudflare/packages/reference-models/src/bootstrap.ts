/**
 * Reference-model bootstrap: idempotently register the two flagship
 * models (`sentiment-from-filings`, `portfolio-optimiser`) into the
 * marketplace registry so they appear in `GET /v1/models`,
 * `GET /v1/models/:slug`, and can be invoked through the production
 * `POST /v1/models/:id/run` endpoint.
 *
 * Without this seed, the reference-model code only exists at the
 * package level (no model row → /v1/models lookups 404). The seed is
 * idempotent: re-running it skips any slug that's already present, so
 * platform admins can call the bootstrap endpoint without fear of
 * creating duplicate model rows or duplicate versions.
 */

import {
  approveVersion,
  createModel,
  publishVersion,
  type CreateModelInput,
  type Model,
  type RegistryDeps,
} from "@gefi/marketplace";
import type { Region } from "@gefi/shared-types";

export const REFERENCE_MODEL_SLUGS = [
  "sentiment-from-filings",
  "portfolio-optimiser",
] as const;
export type ReferenceModelSlug = (typeof REFERENCE_MODEL_SLUGS)[number];

export function isReferenceSlug(s: string): s is ReferenceModelSlug {
  return (REFERENCE_MODEL_SLUGS as readonly string[]).includes(s);
}

type SpecType = "string" | "number" | "boolean" | "object" | "array";

interface ReferenceDef {
  slug: ReferenceModelSlug;
  name: string;
  summary: string;
  category: CreateModelInput["category"];
  riskClass: CreateModelInput["riskClass"];
  longDescription: string;
  inputs: Array<{ name: string; type: SpecType; required: boolean; description: string }>;
  outputs: Array<{ name: string; type: SpecType; description: string }>;
  manifest: Record<string, unknown>;
}

export const REFERENCE_MODEL_DEFS: Record<ReferenceModelSlug, ReferenceDef> = {
  "sentiment-from-filings": {
    slug: "sentiment-from-filings",
    name: "Sentiment from Filings",
    summary:
      "RAG over SEC filings (10-K / 10-Q / 8-K). Returns a BULLISH | NEUTRAL | BEARISH label with cited evidence.",
    category: "sentiment",
    riskClass: "low",
    longDescription:
      "Retrieves the top-k most relevant excerpts from a fixture corpus of SEC filings, " +
      "assembles a prompt with citations, and returns a sentiment label backed by the " +
      "exact filing chunks used. The deterministic fallback maps positive/negative " +
      "language tokens to a label so replays are bit-exact.",
    inputs: [
      { name: "prompt", type: "string", required: true, description: "Free-form question, e.g. 'How is AAPL trending?'" },
      { name: "ticker", type: "string", required: false, description: "Optional ticker filter; restricts retrieval to that symbol." },
    ],
    outputs: [
      { name: "sentiment", type: "string", description: "BULLISH | NEUTRAL | BEARISH" },
      { name: "evidence", type: "array", description: "Filing chunk ids that informed the label." },
    ],
    manifest: {
      kind: "rag",
      retriever: "token-overlap",
      corpus: "sec-filings-fixture-v1",
      replay: "deterministic",
    },
  },
  "portfolio-optimiser": {
    slug: "portfolio-optimiser",
    name: "Portfolio Optimiser",
    summary:
      "Mean-variance long-only portfolio optimiser via gradient projection on the simplex. Bit-exact deterministic.",
    category: "optimisation",
    riskClass: "medium",
    longDescription:
      "Closed-form mean-variance objective minimised by gradient projection onto the " +
      "long-only simplex. Inputs: per-asset expected return + volatility, pairwise " +
      "correlation matrix, optional risk-aversion. Outputs: weights summing to 1, plus " +
      "expected return / volatility / Sharpe. Identical inputs always produce bit-exact " +
      "identical outputs (rounded to 6 decimals) so the replay endpoint matches.",
    inputs: [
      { name: "assets", type: "array", required: true, description: "{ symbol, expectedReturn, vol }[]" },
      { name: "correlation", type: "array", required: true, description: "n×n pairwise correlation matrix." },
      { name: "riskAversion", type: "number", required: false, description: "Higher = lower vol allocation; 0..5 typical." },
      { name: "longOnly", type: "boolean", required: false, description: "Restrict weights to ≥ 0. Defaults true." },
    ],
    outputs: [
      { name: "weights", type: "array", description: "Optimal allocation, sums to 1." },
      { name: "expectedReturn", type: "number", description: "Portfolio expected return." },
      { name: "volatility", type: "number", description: "Portfolio annualised volatility." },
      { name: "sharpe", type: "number", description: "expectedReturn / volatility (rf=0)." },
    ],
    manifest: {
      kind: "optimiser",
      method: "mean-variance-gradient-projection",
      replay: "deterministic",
    },
  },
};

export interface SeedReferenceOptions {
  /** Tenant id under which the reference models are owned. Required. */
  tenantId: string;
  /** Home jurisdiction for the model rows; metadata marks them visible in BOTH regions. */
  jurisdiction: Region;
  ts?: number;
}

export interface SeedReferenceResult {
  seeded: ReferenceModelSlug[];
  skipped: ReferenceModelSlug[];
  models: Model[];
}

/**
 * Seed the reference models into D1 + R2 + the on-chain anchor.
 * Idempotent: an existing slug is left in place. Returns the set of
 * seeded vs skipped slugs and the resulting `Model` rows so callers
 * (e.g. the admin handler) can return a structured response.
 */
export async function seedReferenceModels(
  deps: RegistryDeps,
  opts: SeedReferenceOptions,
): Promise<SeedReferenceResult> {
  const ts = opts.ts ?? Math.floor(Date.now() / 1000);
  const seeded: ReferenceModelSlug[] = [];
  const skipped: ReferenceModelSlug[] = [];
  const models: Model[] = [];

  for (const slug of REFERENCE_MODEL_SLUGS) {
    // Lookup direct via slug — registry's getModel accepts id-or-slug
    // but does an extra OR scan; this is the hot path for the
    // bootstrap endpoint, so go straight to the slug-only index.
    const existing = await deps.db
      .prepare("SELECT * FROM models WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first<Record<string, unknown>>();
    if (existing) {
      skipped.push(slug);
      models.push({
        id: String(existing.id),
        slug: String(existing.slug),
        developerTenantId: String(existing.developer_tenant_id),
        jurisdiction: existing.jurisdiction as Region,
        name: String(existing.name),
        summary: String(existing.summary ?? ""),
        category: existing.category as CreateModelInput["category"],
        riskClass: existing.risk_class as CreateModelInput["riskClass"],
        status: existing.status as Model["status"],
        visibility: existing.visibility as Model["visibility"],
        currentVersionId: existing.current_version_id ? String(existing.current_version_id) : null,
        monthlyPriceCents: Number(existing.monthly_price_cents ?? 0),
        developerShareBps: Number(existing.developer_share_bps ?? 7000),
        federationEnabled: Number(existing.federation_enabled ?? 0) === 1,
        createdAt: Number(existing.created_at),
        updatedAt: Number(existing.updated_at),
      });
      continue;
    }

    const def = REFERENCE_MODEL_DEFS[slug];
    const model = await createModel(deps, {
      developerTenantId: opts.tenantId,
      jurisdiction: opts.jurisdiction,
      slug: def.slug,
      name: def.name,
      summary: def.summary,
      category: def.category,
      riskClass: def.riskClass,
      // Reference models are FREE — they're documentation + onboarding
      // demos. Setting price to 0 keeps them out of the per-model
      // subscription gate (the run handler exempts price=0).
      monthlyPriceCents: 0,
      federationEnabled: false,
      visibility: "public",
      metadata: {
        longDescription: def.longDescription,
        inputs: def.inputs,
        outputs: def.outputs,
        metrics: {},
        risk: {},
        // Empty list means "all jurisdictions" — reference models are
        // policy-clean and intentionally cross-region.
        jurisdictionsSupported: [],
      },
      ts,
    });
    // Publish + approve a stub version. The artifact bytes are the
    // serialized manifest — the actual model logic lives in
    // `executeReferenceModel`, so the artifact is metadata only. Hashing
    // the manifest still gives us a stable sha256 + chain anchor.
    const artifactBytes = new TextEncoder().encode(JSON.stringify(def.manifest));
    // Pass the Uint8Array directly — `publishVersion` accepts
    // ArrayBuffer | Uint8Array, and going via .buffer.slice() on a
    // TextEncoder result triggers a SharedArrayBuffer-vs-ArrayBuffer
    // type narrowing failure under TS 5.6's stricter ArrayBufferLike
    // semantics.
    const version = await publishVersion(deps, {
      modelId: model.id,
      version: "1.0.0",
      artifact: artifactBytes,
      manifest: def.manifest,
      ts,
    });
    await approveVersion(deps, model.id, version.id, ts);
    seeded.push(slug);
    models.push({
      ...model,
      currentVersionId: version.id,
      status: "approved",
      updatedAt: ts,
    });
  }

  return { seeded, skipped, models };
}
