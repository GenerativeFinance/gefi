/**
 * Repository for the playground / v1 model-prediction routes.
 *
 *   - `getModel(slug)`           — model row, used for status / risk_tier checks.
 *   - `getLatestVersion(slug)`   — pulls the version row including
 *                                   `input_schema`, `output_schema`, and the
 *                                   Phase 6 `runtime` column.
 *   - `insertInferenceCall(row)` — billing/telemetry row (Phase 4 surface).
 *   - `insertAuditLog(row)`      — immutable audit row with input + output
 *                                   hashes (Phase 6 surface).
 *
 * `D1PlaygroundRepository` talks to D1 in production; the tests inject an
 * `InMemoryPlaygroundRepository` from `test-helpers.ts`.
 */
import type { ModelRow } from "./models-repo.js";

export interface PlaygroundVersionRow {
  model_slug: string;
  version: string;
  version_label: string | null;
  input_schema: string | null;  // JSON text
  output_schema: string | null; // JSON text
  /** Phase 6: runtime selector — synthetic | simulator | onnx-edge | … */
  runtime: string | null;
  created_at: number;
}

export interface InferenceCallInsert {
  id: string;
  model_slug: string;
  user_id: string | null;
  input_hash: string;
  latency_ms: number;
  is_playground: boolean;
  mock: boolean;
  now: number;
}

export interface AuditLogInsert {
  id: string;
  model_slug: string;
  model_version: string | null;
  user_id: string | null;
  input_hash: string;
  output_hash: string;
  runtime: string;
  now: number;
}

export interface PlaygroundRepository {
  getModel(slug: string): Promise<ModelRow | null>;
  getLatestVersion(slug: string): Promise<PlaygroundVersionRow | null>;
  insertInferenceCall(row: InferenceCallInsert): Promise<void>;
  insertAuditLog(row: AuditLogInsert): Promise<void>;
}

export class D1PlaygroundRepository implements PlaygroundRepository {
  constructor(private readonly db: D1Database) {}

  async getModel(slug: string): Promise<ModelRow | null> {
    const r = await this.db
      .prepare("SELECT * FROM models WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first<ModelRow>();
    return r ?? null;
  }

  async getLatestVersion(slug: string): Promise<PlaygroundVersionRow | null> {
    const r = await this.db
      .prepare(
        `SELECT model_slug, version, version_label, input_schema, output_schema, runtime, created_at
           FROM model_versions
          WHERE model_slug = ?
          ORDER BY created_at DESC
          LIMIT 1`,
      )
      .bind(slug)
      .first<PlaygroundVersionRow>();
    return r ?? null;
  }

  async insertInferenceCall(row: InferenceCallInsert): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO inference_calls
           (id, model_slug, user_id, input_hash, latency_ms, is_playground, mock, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        row.id,
        row.model_slug,
        row.user_id,
        row.input_hash,
        row.latency_ms,
        row.is_playground ? 1 : 0,
        row.mock ? 1 : 0,
        row.now,
      )
      .run();
  }

  async insertAuditLog(row: AuditLogInsert): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO audit_log
           (id, model_slug, model_version, user_id, input_hash, output_hash, runtime, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        row.id,
        row.model_slug,
        row.model_version,
        row.user_id,
        row.input_hash,
        row.output_hash,
        row.runtime,
        row.now,
      )
      .run();
  }
}

/**
 * Canonical-JSON sha-256 hash of a value. Stable across key ordering so the
 * same logical input always hashes the same — useful for replay debugging.
 */
export async function canonicalInputHash(value: unknown): Promise<string> {
  const text = canonicalize(value);
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function canonicalize(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonicalize).join(",")}]`;
  const keys = Object.keys(v as Record<string, unknown>).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize((v as Record<string, unknown>)[k])}`).join(",")}}`;
}
