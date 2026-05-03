-- ─────────────────────────────────────────────────────────────────────────────
-- GeFi Playground — Phase 2 catalog schema.
--
-- Adds filter/sort columns to models, a subcategories table, and renames
-- the "risk-modelling" category to "risk-assessment" (Phase 2 spec mandate
-- so /categories/risk-assessment/ shows VaR / Stress-Test / Volatility /
-- Tail-Risk subcategories as chips).
--
-- Re-runnable: ALTER TABLE ADD COLUMN with NOT NULL DEFAULT is safe to skip
-- via _migrations bookkeeping; UPDATEs are idempotent (no-op if already done).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Rename risk-modelling → risk-assessment ──────────────────────────────
-- Update child rows first to keep the FK constraint happy under any future
-- enforcement; the NOT EXISTS guard makes this a no-op on re-run.
UPDATE models
   SET category_slug = 'risk-assessment'
 WHERE category_slug = 'risk-modelling';

UPDATE categories
   SET slug = 'risk-assessment',
       name = 'Risk Assessment',
       description = 'VaR, stress tests, volatility, and tail-risk for portfolios and books.'
 WHERE slug = 'risk-modelling';

-- ── 2. Filter / sort columns on models ──────────────────────────────────────
ALTER TABLE models ADD COLUMN risk_tier        TEXT    NOT NULL DEFAULT 'medium';
ALTER TABLE models ADD COLUMN maturity         TEXT    NOT NULL DEFAULT 'experimental';
ALTER TABLE models ADD COLUMN price_cents      INTEGER NOT NULL DEFAULT 0;
ALTER TABLE models ADD COLUMN rating_avg       REAL    NOT NULL DEFAULT 0;
ALTER TABLE models ADD COLUMN rating_count     INTEGER NOT NULL DEFAULT 0;
ALTER TABLE models ADD COLUMN trending_score   REAL    NOT NULL DEFAULT 0;
ALTER TABLE models ADD COLUMN subcategory_slug TEXT;
ALTER TABLE models ADD COLUMN thumbnail_url    TEXT;
ALTER TABLE models ADD COLUMN federated        INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_models_risk_tier      ON models(risk_tier);
CREATE INDEX IF NOT EXISTS idx_models_maturity       ON models(maturity);
CREATE INDEX IF NOT EXISTS idx_models_subcategory    ON models(subcategory_slug);
CREATE INDEX IF NOT EXISTS idx_models_trending_score ON models(trending_score);
CREATE INDEX IF NOT EXISTS idx_models_price          ON models(price_cents);
CREATE INDEX IF NOT EXISTS idx_models_created_at     ON models(created_at);
CREATE INDEX IF NOT EXISTS idx_models_rating_avg     ON models(rating_avg);

-- ── 3. Subcategories table (chip rows on category landing pages) ────────────
CREATE TABLE IF NOT EXISTS subcategories (
  slug          TEXT PRIMARY KEY,
  category_slug TEXT NOT NULL REFERENCES categories(slug),
  name          TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_slug);

-- Mark this migration as applied (idempotent).
INSERT OR IGNORE INTO _migrations (id, applied_at) VALUES ('0002_catalog', strftime('%s','now'));
