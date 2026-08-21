/**
 * D1-backed CRUD for `feature_definitions` + `feature_lookups`.
 */

import type { Region } from "@gefi/shared-types";
import type { FeatureDefinition, FeatureLookup } from "./types.js";

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

function mapDef(row: Record<string, unknown>): FeatureDefinition {
  return {
    id: row.id as string,
    slug: row.slug as string,
    ownerTenantId: row.owner_tenant_id as string,
    jurisdiction: row.jurisdiction as Region,
    schemaJson: row.schema_json as string,
    defaultTtlSeconds: Number(row.default_ttl_seconds),
    sourceEndpoint: row.source_endpoint as string,
    description: row.description as string,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

function mapLookup(row: Record<string, unknown>): FeatureLookup {
  return {
    id: row.id as string,
    featureId: row.feature_id as string,
    tenantId: row.tenant_id as string,
    modelRunId: (row.model_run_id as string | null) ?? null,
    lookupKey: row.lookup_key as string,
    resultSha256: row.result_sha256 as string,
    cached: Number(row.cached) === 1,
    latencyMs: Number(row.latency_ms),
    createdAt: Number(row.created_at),
  };
}

export interface CreateDefinitionInput {
  slug: string;
  ownerTenantId: string;
  jurisdiction: Region;
  schemaJson?: string;
  defaultTtlSeconds?: number;
  sourceEndpoint: string;
  description?: string;
  ts?: number;
}

export class FeatureRegistry {
  constructor(private readonly db: D1Database) {}

  async create(input: CreateDefinitionInput): Promise<FeatureDefinition> {
    const ts = input.ts ?? Math.floor(Date.now() / 1000);
    const id = newId("ft");
    await this.db
      .prepare(
        `INSERT INTO feature_definitions (
          id, slug, owner_tenant_id, jurisdiction, schema_json,
          default_ttl_seconds, source_endpoint, description, created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        id,
        input.slug,
        input.ownerTenantId,
        input.jurisdiction,
        input.schemaJson ?? "{}",
        input.defaultTtlSeconds ?? 60,
        input.sourceEndpoint,
        input.description ?? "",
        ts,
        ts,
      )
      .run();
    const r = await this.findBySlug(input.slug);
    if (!r) throw new Error("definition_create_failed");
    return r;
  }

  async findBySlug(slug: string): Promise<FeatureDefinition | null> {
    const r = await this.db
      .prepare(`SELECT * FROM feature_definitions WHERE slug = ?`)
      .bind(slug)
      .first<Record<string, unknown>>();
    return r ? mapDef(r) : null;
  }

  async findById(id: string): Promise<FeatureDefinition | null> {
    const r = await this.db
      .prepare(`SELECT * FROM feature_definitions WHERE id = ?`)
      .bind(id)
      .first<Record<string, unknown>>();
    return r ? mapDef(r) : null;
  }

  async list(filters: { jurisdiction?: Region; ownerTenantId?: string; limit?: number } = {}): Promise<FeatureDefinition[]> {
    const where: string[] = [];
    const args: unknown[] = [];
    if (filters.jurisdiction) {
      where.push(`jurisdiction = ?`);
      args.push(filters.jurisdiction);
    }
    if (filters.ownerTenantId) {
      where.push(`owner_tenant_id = ?`);
      args.push(filters.ownerTenantId);
    }
    const limit = filters.limit ?? 100;
    args.push(limit);
    const r = await this.db
      .prepare(`SELECT * FROM feature_definitions ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY created_at DESC LIMIT ?`)
      .bind(...args)
      .all<Record<string, unknown>>();
    return (r.results ?? []).map(mapDef);
  }

  async recordLookup(input: {
    featureId: string;
    tenantId: string;
    modelRunId?: string | null;
    lookupKey: string;
    resultSha256: string;
    cached: boolean;
    latencyMs: number;
    ts?: number;
  }): Promise<FeatureLookup> {
    const ts = input.ts ?? Math.floor(Date.now() / 1000);
    const id = newId("fl");
    await this.db
      .prepare(
        `INSERT INTO feature_lookups (
          id, feature_id, tenant_id, model_run_id, lookup_key,
          result_sha256, cached, latency_ms, created_at
        ) VALUES (?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        id,
        input.featureId,
        input.tenantId,
        input.modelRunId ?? null,
        input.lookupKey,
        input.resultSha256,
        input.cached ? 1 : 0,
        input.latencyMs,
        ts,
      )
      .run();
    const r = await this.db
      .prepare(`SELECT * FROM feature_lookups WHERE id = ?`)
      .bind(id)
      .first<Record<string, unknown>>();
    if (!r) throw new Error("lookup_record_failed");
    return mapLookup(r);
  }

  async listLookups(featureId: string, limit = 100): Promise<FeatureLookup[]> {
    const r = await this.db
      .prepare(`SELECT * FROM feature_lookups WHERE feature_id = ? ORDER BY created_at DESC LIMIT ?`)
      .bind(featureId, limit)
      .all<Record<string, unknown>>();
    return (r.results ?? []).map(mapLookup);
  }
}
