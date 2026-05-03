/**
 * Repository abstraction for the Phase-4 playground run endpoint.
 *
 * Reads the latest `model_versions` row for a given slug (so the route can
 * pull the input/output schema and version label) and writes one
 * `inference_calls` row per `POST /run`.
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

export interface PlaygroundRepository {
  getModel(slug: string): Promise<ModelRow | null>;
  getLatestVersion(slug: string): Promise<PlaygroundVersionRow | null>;
  insertInferenceCall(row: InferenceCallInsert): Promise<void>;
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
        `SELECT model_slug, version, version_label, input_schema, output_schema, created_at
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
