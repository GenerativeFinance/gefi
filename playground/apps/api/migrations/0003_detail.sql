-- ─────────────────────────────────────────────────────────────────────────────
-- GeFi Playground — Phase 3 model detail schema.
--
-- Adds the tables the model detail page hydrates:
--   - model_versions extensions (version label + metrics blob)
--   - model_audits   (Compliance tab + Verify ZKP stub)
--   - reviews        (Reviews tab; UNIQUE per (user_id, model_slug))
--   - favorites      (right-rail watchlist heart, requires auth)
--
-- Re-runnable. ALTER TABLE ADD COLUMN is idempotent only via the _migrations
-- bookkeeping at the bottom; CREATE TABLE / CREATE INDEX use IF NOT EXISTS.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Versions: metrics JSON blob (equity curve, accuracy, latency) ────────
ALTER TABLE model_versions ADD COLUMN metrics       TEXT;
ALTER TABLE model_versions ADD COLUMN version_label TEXT;

-- ── 2. Audits ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS model_audits (
  id          TEXT PRIMARY KEY,
  model_slug  TEXT NOT NULL REFERENCES models(slug),
  auditor     TEXT NOT NULL,
  standard    TEXT NOT NULL,
  audited_at  INTEGER NOT NULL,
  passed      INTEGER NOT NULL CHECK (passed IN (0, 1)),
  hash        TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_model_audits_model ON model_audits(model_slug);

-- ── 3. Reviews (one per user per model) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          TEXT PRIMARY KEY,
  model_slug  TEXT NOT NULL REFERENCES models(slug),
  user_id     TEXT NOT NULL REFERENCES users(id),
  stars       INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment     TEXT NOT NULL DEFAULT '',
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL,
  UNIQUE (model_slug, user_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_model    ON reviews(model_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_model_at ON reviews(model_slug, created_at);

-- ── 4. Favorites ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  user_id     TEXT NOT NULL REFERENCES users(id),
  model_slug  TEXT NOT NULL REFERENCES models(slug),
  created_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, model_slug)
);
CREATE INDEX IF NOT EXISTS idx_favorites_model ON favorites(model_slug);

INSERT OR IGNORE INTO _migrations (id, applied_at) VALUES ('0003_detail', strftime('%s','now'));
