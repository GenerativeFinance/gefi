/**
 * Marketplace model handlers.
 *
 *   POST   /v1/models                       — developer creates a draft model
 *   GET    /v1/models                       — list (tenant's own + public approved)
 *   GET    /v1/models/:idOrSlug             — model detail (model + metadata + versions)
 *   PUT    /v1/models/:id/metadata          — update metadata + status transitions
 *   POST   /v1/models/:id/versions          — publish a new version (artifact upload)
 *   POST   /v1/models/:id/approve           — admin: flip status to approved + push to index
 *   GET    /v1/models/search                — facet/keyword search via @gefi/search-index
 */

import {
  approveVersion,
  createModel,
  getMetadata,
  getModel,
  listModels,
  listVersions,
  modelToCard,
  publishVersion,
  resolveModelAnchor,
  setModelStatus,
  upsertMetadata,
  type Model,
  type ModelCategory,
  type ModelRiskClass,
  type ModelVisibility,
} from "@gefi/marketplace";
import { resolveIndex, type SearchDoc, type SearchFilters } from "@gefi/search-index";
import type { Region } from "@gefi/shared-types";
import { requireAuth } from "../../middleware/auth.js";
import { emitComplianceEvent } from "../../lib/compliance-client.js";
import type { Handler } from "../../router.js";

function deps(env: {
  DB: D1Database;
  ARTIFACTS: R2Bucket;
  POLYGON_RPC_URL?: string;
  POLYGON_ANCHOR_ADDRESS?: string;
  POLYGON_ANCHOR_PRIVATE_KEY?: string;
}) {
  return {
    db: env.DB,
    artifacts: env.ARTIFACTS,
    // Resolve from real env: when all three POLYGON_* secrets are set we
    // get RealModelAnchor (signs + broadcasts a tx); otherwise the stub
    // returns a deterministic synthetic hash for dev/tests.
    anchor: resolveModelAnchor({
      POLYGON_RPC_URL: env.POLYGON_RPC_URL,
      POLYGON_ANCHOR_ADDRESS: env.POLYGON_ANCHOR_ADDRESS,
      POLYGON_ANCHOR_PRIVATE_KEY: env.POLYGON_ANCHOR_PRIVATE_KEY,
    }),
  };
}

interface CreateBody {
  slug?: string;
  name?: string;
  summary?: string;
  category?: ModelCategory;
  risk_class?: ModelRiskClass;
  monthly_price_cents?: number;
  visibility?: ModelVisibility;
  federation_enabled?: boolean;
  long_description?: string;
  jurisdictions_supported?: Region[];
}

const ALLOWED_CATEGORIES: ModelCategory[] = [
  "sentiment",
  "optimisation",
  "forecasting",
  "risk",
  "classification",
  "rag",
  "other",
];
const ALLOWED_RISK: ModelRiskClass[] = ["low", "medium", "high"];

export const createModelHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["create", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;

  let body: CreateBody;
  try {
    body = (await rc.request.json()) as CreateBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (!body.slug || !body.name) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }
  if (!ALLOWED_CATEGORIES.includes(body.category as ModelCategory)) {
    return Response.json({ ok: false, error: "invalid_category" }, { status: 400 });
  }
  if (!ALLOWED_RISK.includes(body.risk_class as ModelRiskClass)) {
    return Response.json({ ok: false, error: "invalid_risk_class" }, { status: 400 });
  }
  const price = Number(body.monthly_price_cents ?? 0);
  if (!Number.isFinite(price) || price < 0 || price > 99_99_00) {
    return Response.json({ ok: false, error: "invalid_price" }, { status: 400 });
  }
  const model = await createModel(deps(rc.env), {
    developerTenantId: c.tenant_id,
    jurisdiction: c.jurisdiction,
    slug: body.slug.trim(),
    name: body.name.trim(),
    summary: (body.summary ?? "").trim(),
    category: body.category as ModelCategory,
    riskClass: body.risk_class as ModelRiskClass,
    monthlyPriceCents: price,
    visibility: body.visibility ?? "private",
    federationEnabled: body.federation_enabled === true,
    metadata: {
      longDescription: body.long_description ?? "",
      jurisdictionsSupported: body.jurisdictions_supported ?? [],
    },
  });
  return Response.json({ ok: true, model }, { status: 201 });
};

export const listModelsHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["list", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const url = new URL(rc.request.url);
  const visibility = url.searchParams.get("visibility") as ModelVisibility | null;
  const status = url.searchParams.get("status");
  const mine = url.searchParams.get("mine") === "true";

  const models = await listModels(deps(rc.env), {
    jurisdiction: rc.region,
    visibility: visibility ?? undefined,
    status: status === "approved" ? "approved" : undefined,
    developerTenantId: mine ? c.tenant_id : undefined,
    visibleTo: c.jurisdiction,
    limit: Number(url.searchParams.get("limit") ?? 50),
    offset: Number(url.searchParams.get("offset") ?? 0),
  });
  const cards = await Promise.all(models.map((m) => modelToCard(deps(rc.env), m)));
  return Response.json({ ok: true, models: cards });
};

export const getModelHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["read", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });
  const model = await getModel(deps(rc.env), id);
  if (!model) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  // Ownership / visibility guard.
  const isOwner = model.developerTenantId === c.tenant_id;
  if (!isOwner && (model.visibility === "private" || model.status !== "approved")) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const metadata = await getMetadata(deps(rc.env), model.id);
  // Jurisdiction visibility: list/search paths already pass `visibleTo`
  // to filter by `jurisdictionsSupported`, but a direct lookup by id
  // or slug must apply the same policy. Otherwise a caller who
  // discovers an EU-only model id (e.g. via a leaked link) could read
  // its full metadata + versions from a US tenant. Owners are exempt
  // so the developer can preview their own EU-only model from any
  // jurisdiction. An empty `jurisdictionsSupported` means "all".
  if (!isOwner) {
    const allowed = metadata?.jurisdictionsSupported ?? [];
    if (allowed.length > 0 && !allowed.includes(c.jurisdiction)) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    }
  }
  const versions = await listVersions(deps(rc.env), model.id);
  return Response.json({ ok: true, model, metadata, versions });
};

export const publishVersionHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["publish", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });
  const model = await getModel(deps(rc.env), id);
  if (!model) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  if (model.developerTenantId !== c.tenant_id) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const ct = rc.request.headers.get("content-type") ?? "";
  let version = "";
  let manifest: Record<string, unknown> = {};
  let artifact: ArrayBuffer;
  if (ct.includes("application/json")) {
    // JSON body for tests + small models: { version, manifest, artifact_base64 }
    let body: { version?: string; manifest?: Record<string, unknown>; artifact_base64?: string };
    try {
      body = (await rc.request.json()) as typeof body;
    } catch {
      return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
    }
    if (!body.version || !body.artifact_base64) {
      return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
    }
    version = body.version;
    manifest = body.manifest ?? {};
    const bin = Uint8Array.from(atob(body.artifact_base64), (ch) => ch.charCodeAt(0));
    artifact = bin.buffer;
  } else {
    // Streaming binary upload: Version + manifest in headers.
    version = rc.request.headers.get("X-Model-Version") ?? "";
    if (!version) return Response.json({ ok: false, error: "missing_version" }, { status: 400 });
    const manifestHeader = rc.request.headers.get("X-Model-Manifest");
    if (manifestHeader) {
      try {
        manifest = JSON.parse(manifestHeader);
      } catch {
        /* ignore */
      }
    }
    artifact = await rc.request.arrayBuffer();
    if (artifact.byteLength === 0) {
      return Response.json({ ok: false, error: "empty_artifact" }, { status: 400 });
    }
  }

  const v = await publishVersion(deps(rc.env), {
    modelId: model.id,
    version,
    artifact,
    manifest,
  });
  await setModelStatus(deps(rc.env), model.id, "pending_compliance");

  await emitComplianceEvent(rc.env, {
    kind: "model_listed",
    tenantId: c.tenant_id,
    region: c.jurisdiction,
    userId: c.sub,
    severity: "info",
    payload: {
      modelId: model.id,
      versionId: v.id,
      sha256: v.artifactSha256,
      riskClass: model.riskClass,
    },
  });

  return Response.json({ ok: true, version: v }, { status: 201 });
};

export const approveModelHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["update", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  if (!c.roles.includes("admin")) {
    return Response.json({ ok: false, error: "admin_required" }, { status: 403 });
  }
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });

  let body: { version_id?: string };
  try {
    body = (await rc.request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (!body.version_id) return Response.json({ ok: false, error: "missing_version_id" }, { status: 400 });

  const model = await getModel(deps(rc.env), id);
  if (!model) return Response.json({ ok: false, error: "not_found" }, { status: 404 });

  await approveVersion(deps(rc.env), model.id, body.version_id);

  // Push to the search index (LocalIndex in dev; Typesense in prod).
  const meta = await getMetadata(deps(rc.env), model.id);
  const index = resolveIndex(rc.env);
  const card = await modelToCard(deps(rc.env), model);
  const doc: SearchDoc = {
    id: card.id,
    slug: card.slug,
    name: card.name,
    summary: card.summary,
    category: card.category,
    riskClass: card.riskClass,
    jurisdiction: card.jurisdiction,
    jurisdictionsSupported: meta?.jurisdictionsSupported ?? [],
    monthlyPriceCents: card.monthlyPriceCents,
    metrics: meta?.metrics ?? {},
    federationEnabled: card.federationEnabled,
  };
  try {
    await index.upsert(doc);
  } catch (err) {
    console.warn("[gefi-api] search index upsert failed", err);
  }

  return Response.json({ ok: true, modelId: model.id, versionId: body.version_id });
};

export const updateMetadataHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["update", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });
  const model = await getModel(deps(rc.env), id);
  if (!model) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  if (model.developerTenantId !== c.tenant_id) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  let body: Partial<{
    long_description: string;
    inputs: Array<unknown>;
    outputs: Array<unknown>;
    metrics: Record<string, number>;
    risk: Record<string, number>;
    jurisdictions_supported: Region[];
  }>;
  try {
    body = (await rc.request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  await upsertMetadata(rc.env.DB, model.id, {
    longDescription: body.long_description,
    inputs: body.inputs as never,
    outputs: body.outputs as never,
    metrics: body.metrics as never,
    risk: body.risk as never,
    jurisdictionsSupported: body.jurisdictions_supported,
  }, Math.floor(Date.now() / 1000));
  return Response.json({ ok: true });
};

export const searchModelsHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["list", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const url = new URL(rc.request.url);

  // Build the search filters from query params. Restrict to approved
  // models visible in the caller's jurisdiction so the marketplace
  // browse page never leaks a draft.
  const filters: SearchFilters = {
    query: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    riskClass: (url.searchParams.get("risk_class") as "low" | "medium" | "high" | null) ?? undefined,
    jurisdiction: (url.searchParams.get("jurisdiction") as Region | null) ?? undefined,
    minPrice: url.searchParams.has("min_price") ? Number(url.searchParams.get("min_price")) : undefined,
    maxPrice: url.searchParams.has("max_price") ? Number(url.searchParams.get("max_price")) : undefined,
    minSharpe: url.searchParams.has("min_sharpe") ? Number(url.searchParams.get("min_sharpe")) : undefined,
    federationEnabled: url.searchParams.has("federation_enabled")
      ? url.searchParams.get("federation_enabled") === "true"
      : undefined,
    visibleTo: c.jurisdiction,
    limit: Number(url.searchParams.get("limit") ?? 24),
    offset: Number(url.searchParams.get("offset") ?? 0),
  };

  const index = resolveIndex(rc.env);
  // For the LocalIndex we hydrate from D1 each time — there's no separate
  // ingestion process in dev and the dataset is small.
  if (!index.live) {
    const approved = await listModels(deps(rc.env), {
      status: "approved",
      visibility: "public",
      visibleTo: c.jurisdiction,
      limit: 500,
    });
    const docs: SearchDoc[] = await Promise.all(
      approved.map(async (m: Model) => {
        const card = await modelToCard(deps(rc.env), m);
        const meta = await getMetadata(deps(rc.env), m.id);
        return {
          id: card.id,
          slug: card.slug,
          name: card.name,
          summary: card.summary,
          category: card.category,
          riskClass: card.riskClass,
          jurisdiction: card.jurisdiction,
          jurisdictionsSupported: meta?.jurisdictionsSupported ?? [],
          monthlyPriceCents: card.monthlyPriceCents,
          metrics: meta?.metrics ?? {},
          federationEnabled: card.federationEnabled,
        };
      }),
    );
    await index.bulkUpsert(docs);
  }
  const result = await index.search(filters);
  return Response.json({ ok: true, ...result });
};
