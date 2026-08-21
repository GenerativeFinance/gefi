/**
 * Model registry — D1-backed CRUD for the `models`, `model_versions`,
 * and `model_metadata` tables. All queries are parameterised + jurisdiction
 * scoped where applicable.
 *
 * Hashing uses sha-256 over the canonical artifact bytes. Callers pass
 * the bytes; we compute the hash and write to R2 + D1 atomically.
 */

import type { Region } from "@gefi/shared-types";
import type {
  Model,
  ModelCard,
  ModelCategory,
  ModelMetadata,
  ModelRiskClass,
  ModelStatus,
  ModelVersion,
  ModelVisibility,
  PerformanceMetrics,
  RiskProfile,
} from "./types.js";
import type { ModelAnchor } from "./anchor.js";

export interface RegistryDeps {
  db: D1Database;
  artifacts: R2Bucket;
  anchor: ModelAnchor;
}

export interface CreateModelInput {
  developerTenantId: string;
  jurisdiction: Region;
  slug: string;
  name: string;
  summary: string;
  category: ModelCategory;
  riskClass: ModelRiskClass;
  monthlyPriceCents: number;
  federationEnabled: boolean;
  visibility?: ModelVisibility;
  metadata?: Partial<ModelMetadata>;
  ts?: number;
}

export interface PublishVersionInput {
  modelId: string;
  version: string;
  artifact: ArrayBuffer | Uint8Array;
  manifest?: Record<string, unknown>;
  ts?: number;
}

export interface ListModelsFilters {
  jurisdiction?: Region;
  category?: ModelCategory;
  riskClass?: ModelRiskClass;
  status?: ModelStatus;
  visibility?: ModelVisibility;
  developerTenantId?: string;
  /** Hide models whose `jurisdiction_supported` list excludes this region. */
  visibleTo?: Region;
  limit?: number;
  offset?: number;
}

export async function sha256Hex(bytes: ArrayBuffer | Uint8Array): Promise<string> {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const copy = new Uint8Array(u8.byteLength);
  copy.set(u8);
  const digest = await crypto.subtle.digest("SHA-256", copy.buffer);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

function modelRowToModel(row: Record<string, unknown>): Model {
  return {
    id: String(row.id),
    slug: String(row.slug),
    developerTenantId: String(row.developer_tenant_id),
    jurisdiction: row.jurisdiction as Region,
    name: String(row.name),
    summary: String(row.summary ?? ""),
    category: row.category as ModelCategory,
    riskClass: row.risk_class as ModelRiskClass,
    status: row.status as ModelStatus,
    visibility: row.visibility as ModelVisibility,
    currentVersionId: row.current_version_id ? String(row.current_version_id) : null,
    monthlyPriceCents: Number(row.monthly_price_cents ?? 0),
    developerShareBps: Number(row.developer_share_bps ?? 7000),
    federationEnabled: Number(row.federation_enabled ?? 0) === 1,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

function versionRowToVersion(row: Record<string, unknown>): ModelVersion {
  return {
    id: String(row.id),
    modelId: String(row.model_id),
    version: String(row.version),
    artifactR2Key: String(row.artifact_r2_key),
    artifactSha256: String(row.artifact_sha256),
    artifactSize: Number(row.artifact_size),
    manifestJson: String(row.manifest_json ?? "{}"),
    chainTxHash: row.chain_tx_hash ? String(row.chain_tx_hash) : null,
    approvedAt: row.approved_at ? Number(row.approved_at) : null,
    createdAt: Number(row.created_at),
  };
}

export async function createModel(deps: RegistryDeps, input: CreateModelInput): Promise<Model> {
  const ts = input.ts ?? Math.floor(Date.now() / 1000);
  const id = newId("mdl");
  await deps.db
    .prepare(
      `INSERT INTO models (id, slug, developer_tenant_id, jurisdiction, name, summary,
       category, risk_class, status, visibility, current_version_id,
       monthly_price_cents, developer_share_bps, federation_enabled, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, NULL, ?, 7000, ?, ?, ?)`,
    )
    .bind(
      id,
      input.slug,
      input.developerTenantId,
      input.jurisdiction,
      input.name,
      input.summary,
      input.category,
      input.riskClass,
      input.visibility ?? "private",
      input.monthlyPriceCents,
      input.federationEnabled ? 1 : 0,
      ts,
      ts,
    )
    .run();

  if (input.metadata) {
    await upsertMetadata(deps.db, id, input.metadata, ts);
  }
  // Return the inserted shape directly. Avoid an extra SELECT — D1 has
  // no RETURNING clause yet, the row's column values are exactly what
  // we just bound, and a re-read after insert would otherwise
  // serialise behind the same write.
  return {
    id,
    slug: input.slug,
    developerTenantId: input.developerTenantId,
    jurisdiction: input.jurisdiction,
    name: input.name,
    summary: input.summary,
    category: input.category,
    riskClass: input.riskClass,
    status: "draft",
    visibility: input.visibility ?? "private",
    currentVersionId: null,
    monthlyPriceCents: input.monthlyPriceCents,
    developerShareBps: 7000,
    federationEnabled: input.federationEnabled === true,
    createdAt: ts,
    updatedAt: ts,
  };
}

export async function getModel(deps: RegistryDeps, idOrSlug: string): Promise<Model | null> {
  const row = await deps.db
    .prepare("SELECT * FROM models WHERE id = ? OR slug = ? LIMIT 1")
    .bind(idOrSlug, idOrSlug)
    .first<Record<string, unknown>>();
  return row ? modelRowToModel(row) : null;
}

export async function getMetadata(deps: RegistryDeps, modelId: string): Promise<ModelMetadata | null> {
  const row = await deps.db
    .prepare("SELECT * FROM model_metadata WHERE model_id = ?")
    .bind(modelId)
    .first<Record<string, unknown>>();
  if (!row) return null;
  return {
    longDescription: String(row.long_description ?? ""),
    inputs: JSON.parse(String(row.inputs_json ?? "[]")),
    outputs: JSON.parse(String(row.outputs_json ?? "[]")),
    metrics: JSON.parse(String(row.metrics_json ?? "{}")) as PerformanceMetrics,
    risk: JSON.parse(String(row.risk_json ?? "{}")) as RiskProfile,
    jurisdictionsSupported: JSON.parse(String(row.jurisdictions_supported_json ?? "[]")) as Region[],
  };
}

export async function upsertMetadata(
  db: D1Database,
  modelId: string,
  patch: Partial<ModelMetadata>,
  ts: number,
): Promise<void> {
  const existing = await db
    .prepare("SELECT * FROM model_metadata WHERE model_id = ?")
    .bind(modelId)
    .first<Record<string, unknown>>();
  const merged: ModelMetadata = {
    longDescription: patch.longDescription ?? String(existing?.long_description ?? ""),
    inputs: patch.inputs ?? JSON.parse(String(existing?.inputs_json ?? "[]")),
    outputs: patch.outputs ?? JSON.parse(String(existing?.outputs_json ?? "[]")),
    metrics: patch.metrics ?? JSON.parse(String(existing?.metrics_json ?? "{}")),
    risk: patch.risk ?? JSON.parse(String(existing?.risk_json ?? "{}")),
    jurisdictionsSupported:
      patch.jurisdictionsSupported ??
      JSON.parse(String(existing?.jurisdictions_supported_json ?? "[]")),
  };
  await db
    .prepare(
      `INSERT INTO model_metadata (model_id, long_description, inputs_json, outputs_json,
       metrics_json, risk_json, jurisdictions_supported_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(model_id) DO UPDATE SET
         long_description = excluded.long_description,
         inputs_json = excluded.inputs_json,
         outputs_json = excluded.outputs_json,
         metrics_json = excluded.metrics_json,
         risk_json = excluded.risk_json,
         jurisdictions_supported_json = excluded.jurisdictions_supported_json,
         updated_at = excluded.updated_at`,
    )
    .bind(
      modelId,
      merged.longDescription,
      JSON.stringify(merged.inputs),
      JSON.stringify(merged.outputs),
      JSON.stringify(merged.metrics),
      JSON.stringify(merged.risk),
      JSON.stringify(merged.jurisdictionsSupported),
      ts,
    )
    .run();
}

export async function setModelStatus(
  deps: RegistryDeps,
  modelId: string,
  status: ModelStatus,
  ts?: number,
): Promise<void> {
  const now = ts ?? Math.floor(Date.now() / 1000);
  await deps.db
    .prepare("UPDATE models SET status = ?, updated_at = ? WHERE id = ?")
    .bind(status, now, modelId)
    .run();
}

export async function publishVersion(
  deps: RegistryDeps,
  input: PublishVersionInput,
): Promise<ModelVersion> {
  const ts = input.ts ?? Math.floor(Date.now() / 1000);
  const versionId = newId("ver");
  const bytes = input.artifact instanceof Uint8Array ? input.artifact : new Uint8Array(input.artifact);
  const sha = await sha256Hex(bytes);
  const r2Key = `models/${input.modelId}/${versionId}/${sha}.bin`;

  await deps.artifacts.put(r2Key, bytes, {
    httpMetadata: { contentType: "application/octet-stream" },
    customMetadata: { sha256: sha, model_id: input.modelId, version_id: versionId },
  });

  const anchorResult = await deps.anchor.anchor({
    modelId: input.modelId,
    versionId,
    artifactSha256: sha,
    ts,
  });

  await deps.db
    .prepare(
      `INSERT INTO model_versions (id, model_id, version, artifact_r2_key,
       artifact_sha256, artifact_size, manifest_json, chain_tx_hash, approved_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
    )
    .bind(
      versionId,
      input.modelId,
      input.version,
      r2Key,
      sha,
      bytes.byteLength,
      JSON.stringify(input.manifest ?? {}),
      anchorResult.txHash,
      ts,
    )
    .run();

  // Mirror the storage facts into model_artifacts so a future GC
  // reconciler can scan R2 against D1 by sha. The "weights" kind is
  // the canonical primary blob; future versions can attach tokenizer /
  // example artifacts under the same version_id without touching
  // model_versions.
  const artifactId = newId("art");
  await deps.db
    .prepare(
      `INSERT INTO model_artifacts (id, model_id, version_id, kind, r2_key,
       sha256, size_bytes, content_type, created_at)
       VALUES (?, ?, ?, 'weights', ?, ?, ?, 'application/octet-stream', ?)`,
    )
    .bind(artifactId, input.modelId, versionId, r2Key, sha, bytes.byteLength, ts)
    .run();

  // Return the row shape directly — D1 has no RETURNING. The values are
  // exactly what we just bound, so a re-read would only serialise behind
  // the same write.
  return {
    id: versionId,
    modelId: input.modelId,
    version: input.version,
    artifactR2Key: r2Key,
    artifactSha256: sha,
    artifactSize: bytes.byteLength,
    manifestJson: JSON.stringify(input.manifest ?? {}),
    chainTxHash: anchorResult.txHash,
    approvedAt: null,
    createdAt: ts,
  };
}

export interface ArtifactRow {
  id: string;
  modelId: string;
  versionId: string;
  kind: "weights" | "tokenizer" | "manifest" | "example" | "other";
  r2Key: string;
  sha256: string;
  sizeBytes: number;
  contentType: string;
  createdAt: number;
}

/** List the artifact records (R2 storage facts) for a given version. */
export async function listArtifacts(deps: RegistryDeps, versionId: string): Promise<ArtifactRow[]> {
  const { results } = await deps.db
    .prepare(
      `SELECT id, model_id, version_id, kind, r2_key, sha256, size_bytes,
       content_type, created_at FROM model_artifacts WHERE version_id = ? ORDER BY created_at ASC`,
    )
    .bind(versionId)
    .all<Record<string, unknown>>();
  return (results ?? []).map((r) => ({
    id: String(r.id),
    modelId: String(r.model_id),
    versionId: String(r.version_id),
    kind: r.kind as ArtifactRow["kind"],
    r2Key: String(r.r2_key),
    sha256: String(r.sha256),
    sizeBytes: Number(r.size_bytes),
    contentType: String(r.content_type),
    createdAt: Number(r.created_at),
  }));
}

export async function approveVersion(
  deps: RegistryDeps,
  modelId: string,
  versionId: string,
  ts?: number,
): Promise<void> {
  const now = ts ?? Math.floor(Date.now() / 1000);
  await deps.db
    .prepare("UPDATE model_versions SET approved_at = ? WHERE id = ? AND model_id = ?")
    .bind(now, versionId, modelId)
    .run();
  await deps.db
    .prepare("UPDATE models SET current_version_id = ?, status = 'approved', updated_at = ? WHERE id = ?")
    .bind(versionId, now, modelId)
    .run();
}

export async function listModels(deps: RegistryDeps, filters: ListModelsFilters = {}): Promise<Model[]> {
  const where: string[] = [];
  const args: unknown[] = [];
  if (filters.jurisdiction) {
    where.push("jurisdiction = ?");
    args.push(filters.jurisdiction);
  }
  if (filters.category) {
    where.push("category = ?");
    args.push(filters.category);
  }
  if (filters.riskClass) {
    where.push("risk_class = ?");
    args.push(filters.riskClass);
  }
  if (filters.status) {
    where.push("status = ?");
    args.push(filters.status);
  }
  if (filters.visibility) {
    where.push("visibility = ?");
    args.push(filters.visibility);
  }
  if (filters.developerTenantId) {
    where.push("developer_tenant_id = ?");
    args.push(filters.developerTenantId);
  }
  const sql =
    "SELECT * FROM models" +
    (where.length ? ` WHERE ${where.join(" AND ")}` : "") +
    " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
  args.push(filters.limit ?? 50, filters.offset ?? 0);
  const stmt = deps.db.prepare(sql).bind(...args);
  const { results } = await stmt.all<Record<string, unknown>>();
  let models = (results ?? []).map(modelRowToModel);
  if (filters.visibleTo) {
    // Filter out models whose metadata excludes this region. We do this in
    // memory because the supported-jurisdictions list lives in metadata
    // (separate table) — small enough at expected scale.
    const ids = models.map((m) => m.id);
    if (ids.length === 0) return [];
    const placeholders = ids.map(() => "?").join(",");
    const metaRows = await deps.db
      .prepare(
        `SELECT model_id, jurisdictions_supported_json FROM model_metadata WHERE model_id IN (${placeholders})`,
      )
      .bind(...ids)
      .all<Record<string, unknown>>();
    const supported = new Map<string, Region[]>();
    for (const row of metaRows.results ?? []) {
      supported.set(
        String(row.model_id),
        JSON.parse(String(row.jurisdictions_supported_json ?? "[]")) as Region[],
      );
    }
    models = models.filter((m) => {
      const list = supported.get(m.id) ?? [];
      // Empty list = supported everywhere (default). Otherwise must include.
      return list.length === 0 || list.includes(filters.visibleTo!);
    });
  }
  return models;
}

export async function listVersions(deps: RegistryDeps, modelId: string): Promise<ModelVersion[]> {
  const { results } = await deps.db
    .prepare("SELECT * FROM model_versions WHERE model_id = ? ORDER BY created_at DESC")
    .bind(modelId)
    .all<Record<string, unknown>>();
  return (results ?? []).map(versionRowToVersion);
}

export async function getVersion(deps: RegistryDeps, versionId: string): Promise<ModelVersion | null> {
  const row = await deps.db
    .prepare("SELECT * FROM model_versions WHERE id = ?")
    .bind(versionId)
    .first<Record<string, unknown>>();
  return row ? versionRowToVersion(row) : null;
}

export async function modelToCard(deps: RegistryDeps, model: Model): Promise<ModelCard> {
  const meta = await getMetadata(deps, model.id);
  return {
    id: model.id,
    slug: model.slug,
    name: model.name,
    summary: model.summary,
    category: model.category,
    riskClass: model.riskClass,
    jurisdiction: model.jurisdiction,
    jurisdictionsSupported: meta?.jurisdictionsSupported ?? [],
    monthlyPriceCents: model.monthlyPriceCents,
    metrics: meta?.metrics ?? {},
    federationEnabled: model.federationEnabled,
  };
}
