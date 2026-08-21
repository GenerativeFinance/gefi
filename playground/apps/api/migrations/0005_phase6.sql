-- ─────────────────────────────────────────────────────────────────────────────
-- GeFi Playground — Phase 6 per-model backends.
--
-- Adds:
--   - model_versions.runtime              (synthetic | simulator | onnx-edge | workers-ai | external-llm)
--   - audit_log                            (one row per real prediction call)
--   - subscriptions                        (tier per user → per-day quota)
--   - api_keys                             (Bearer-token auth for /v1/models)
--
-- Re-runnable via the _migrations bookkeeping row at the bottom.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Per-version runtime selector ────────────────────────────────────────
ALTER TABLE model_versions ADD COLUMN runtime TEXT NOT NULL DEFAULT 'synthetic'
  CHECK (runtime IN ('synthetic', 'simulator', 'onnx-edge', 'workers-ai', 'external-llm'));

-- ── 2. Audit log — every real prediction appends one immutable row ─────────
-- Distinct from `inference_calls`, which is a billing/telemetry row. The
-- audit log includes the SHA-256 of the *output* in addition to the input
-- so a future verifier can replay against the model artifact.
CREATE TABLE IF NOT EXISTS audit_log (
  id            TEXT PRIMARY KEY,
  model_slug    TEXT NOT NULL REFERENCES models(slug),
  model_version TEXT,
  user_id       TEXT REFERENCES users(id),
  input_hash    TEXT NOT NULL,
  output_hash   TEXT NOT NULL,
  runtime       TEXT NOT NULL,
  created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_log_slug ON audit_log(model_slug);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_at   ON audit_log(created_at);

-- ── 3. Subscriptions — per-user tier drives daily quota ────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id    TEXT PRIMARY KEY REFERENCES users(id),
  tier       TEXT NOT NULL DEFAULT 'free'
              CHECK (tier IN ('free', 'pro', 'enterprise')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- ── 4. API keys — Bearer-token authentication for /v1/models/:slug/predict ─
-- The plaintext key is shown to the user once at creation; only the SHA-256
-- digest is stored. `prefix` is the first 8 chars of the plaintext (e.g.
-- "gefi_aBcD"), shown in dashboards so users can identify which key is which.
CREATE TABLE IF NOT EXISTS api_keys (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  key_hash      TEXT NOT NULL UNIQUE,
  prefix        TEXT NOT NULL,
  name          TEXT,
  created_at    INTEGER NOT NULL,
  last_used_at  INTEGER,
  revoked_at    INTEGER
);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);

INSERT OR IGNORE INTO _migrations (id, applied_at) VALUES ('0005_phase6', strftime('%s','now'));
