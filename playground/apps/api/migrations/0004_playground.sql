-- ─────────────────────────────────────────────────────────────────────────────
-- GeFi Playground — Phase 4 generic playground shell.
--
-- Adds the columns + table the generic playground needs:
--   - model_versions.input_schema  / output_schema (JSON text)
--   - models.training_enabled                       (0/1)
--   - inference_calls                                (audit trail of runs)
--
-- Re-runnable: ALTER TABLE ADD COLUMN is naturally idempotent in SQLite only
-- if the column doesn't already exist; we gate by recording in _migrations
-- and let `wrangler d1 migrations apply` skip the file once recorded.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Versions: input/output JSON Schemas the SchemaForm hydrates from ────
ALTER TABLE model_versions ADD COLUMN input_schema  TEXT;
ALTER TABLE model_versions ADD COLUMN output_schema TEXT;

-- ── 2. Models: training-enabled flag drives the Train tab UI ───────────────
ALTER TABLE models ADD COLUMN training_enabled INTEGER NOT NULL DEFAULT 0
  CHECK (training_enabled IN (0, 1));

-- ── 3. Inference calls — every Playground run inserts one row ──────────────
CREATE TABLE IF NOT EXISTS inference_calls (
  id              TEXT PRIMARY KEY,
  model_slug      TEXT NOT NULL REFERENCES models(slug),
  user_id         TEXT REFERENCES users(id),    -- NULL for anonymous
  input_hash      TEXT NOT NULL,                -- sha256 of canonical input JSON
  latency_ms      INTEGER NOT NULL,
  is_playground   INTEGER NOT NULL DEFAULT 1 CHECK (is_playground IN (0, 1)),
  mock            INTEGER NOT NULL DEFAULT 1 CHECK (mock IN (0, 1)),
  created_at      INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_inference_calls_model ON inference_calls(model_slug);
CREATE INDEX IF NOT EXISTS idx_inference_calls_user  ON inference_calls(user_id);
CREATE INDEX IF NOT EXISTS idx_inference_calls_at    ON inference_calls(created_at);

INSERT OR IGNORE INTO _migrations (id, applied_at) VALUES ('0004_playground', strftime('%s','now'));
