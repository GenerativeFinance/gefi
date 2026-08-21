-- ─────────────────────────────────────────────────────────────────────────────
-- GeFi Playground — initial D1 schema (Phase 1).
--
-- Re-runnable: every CREATE uses IF NOT EXISTS. The _migrations table tracks
-- applied migrations so the migrate script (or `wrangler d1 migrations apply`)
-- can skip already-applied files.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS _migrations (
  id          TEXT PRIMARY KEY,
  applied_at  INTEGER NOT NULL
);

-- ── Users (created on first magic-link verify) ──────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             TEXT PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL,
  last_login_at  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ── Categories (seeded from src/data/categories.ts) ─────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  slug         TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  icon         TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

-- ── Models (seeded from src/data/featured-models.ts) ────────────────────────
CREATE TABLE IF NOT EXISTS models (
  slug           TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  summary        TEXT NOT NULL,
  description    TEXT,
  category_slug  TEXT NOT NULL REFERENCES categories(slug),
  developer      TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','deprecated')),
  featured       INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0,1)),
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_models_category ON models(category_slug);
CREATE INDEX IF NOT EXISTS idx_models_status   ON models(status);
CREATE INDEX IF NOT EXISTS idx_models_featured ON models(featured);

-- ── Model versions (placeholder; real lifecycle lands in Phase 5/6) ─────────
CREATE TABLE IF NOT EXISTS model_versions (
  id           TEXT PRIMARY KEY,
  model_slug   TEXT NOT NULL REFERENCES models(slug),
  version      TEXT NOT NULL,
  artifact_key TEXT,
  sha256       TEXT,
  created_at   INTEGER NOT NULL,
  UNIQUE (model_slug, version)
);
CREATE INDEX IF NOT EXISTS idx_model_versions_model ON model_versions(model_slug);

-- Mark this migration as applied (idempotent).
INSERT OR IGNORE INTO _migrations (id, applied_at) VALUES ('0001_init', strftime('%s','now'));
