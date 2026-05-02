-- 0002_init_marketplace.sql — Task #5 marketplace + billing + gateway schema.
--
-- Applied via `wrangler d1 migrations apply gefi-api-<env>`. Tables follow
-- the same per-row jurisdiction discipline as the auth schema so the
-- Task #4 residency surface continues to apply at the row level.

-- ----------------------------------------------------------------------------
-- models: developer-published model registry. One row per *model identity*;
-- versions live in `model_versions`. The current_version_id pointer is
-- updated atomically when a new version is approved.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS models (
  id                  TEXT PRIMARY KEY,
  slug                TEXT NOT NULL UNIQUE,
  developer_tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  jurisdiction        TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  name                TEXT NOT NULL,
  summary             TEXT NOT NULL DEFAULT '',
  category            TEXT NOT NULL CHECK (category IN ('sentiment','optimisation','forecasting','risk','classification','rag','other')),
  risk_class          TEXT NOT NULL CHECK (risk_class IN ('low','medium','high')),
  status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_compliance','approved','suspended','retired')),
  visibility          TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','public')),
  current_version_id  TEXT,                    -- nullable until first approved version
  monthly_price_cents INTEGER NOT NULL DEFAULT 0,
  developer_share_bps INTEGER NOT NULL DEFAULT 7000,  -- 70 % default to dev
  federation_enabled  INTEGER NOT NULL DEFAULT 0,
  created_at          INTEGER NOT NULL,
  updated_at          INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_models_developer ON models(developer_tenant_id);
CREATE INDEX IF NOT EXISTS idx_models_status ON models(status);
CREATE INDEX IF NOT EXISTS idx_models_jurisdiction ON models(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_models_category ON models(category);

-- ----------------------------------------------------------------------------
-- model_versions: immutable version rows. The artifact lives in R2 keyed by
-- `artifact_r2_key`; `artifact_sha256` is the content hash. `chain_tx_hash`
-- is the synthetic Polygon-anchor TX hash returned by the marketplace
-- anchor (see `@gefi/marketplace/anchor.ts`).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_versions (
  id              TEXT PRIMARY KEY,
  model_id        TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  version         TEXT NOT NULL,                 -- semver, e.g. "1.4.0"
  artifact_r2_key TEXT NOT NULL,
  artifact_sha256 TEXT NOT NULL,                 -- 64-hex content hash
  artifact_size   INTEGER NOT NULL,
  manifest_json   TEXT NOT NULL DEFAULT '{}',
  chain_tx_hash   TEXT,                          -- Polygon anchor (synthetic in dev)
  approved_at     INTEGER,                       -- null until compliance approves
  created_at      INTEGER NOT NULL,
  UNIQUE (model_id, version)
);
CREATE INDEX IF NOT EXISTS idx_versions_model ON model_versions(model_id);

-- ----------------------------------------------------------------------------
-- model_artifacts: one row per uploaded artifact blob. A `model_versions`
-- row is canonical for "the version a developer published"; this side
-- table records the storage facts (R2 key, size, sha-256, content-type)
-- so we can reconcile R2 garbage / orphaned objects against D1, and so
-- a single version can later carry multiple linked artifacts (eg. weights
-- + tokenizer) without bloating the versions row.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_artifacts (
  id              TEXT PRIMARY KEY,
  model_id        TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  version_id      TEXT NOT NULL REFERENCES model_versions(id) ON DELETE CASCADE,
  kind            TEXT NOT NULL DEFAULT 'weights' CHECK (kind IN ('weights','tokenizer','manifest','example','other')),
  r2_key          TEXT NOT NULL,
  sha256          TEXT NOT NULL,                 -- 64-hex content hash
  size_bytes      INTEGER NOT NULL,
  content_type    TEXT NOT NULL DEFAULT 'application/octet-stream',
  created_at      INTEGER NOT NULL,
  UNIQUE (version_id, kind, sha256)
);
CREATE INDEX IF NOT EXISTS idx_artifacts_version ON model_artifacts(version_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_sha ON model_artifacts(sha256);

-- ----------------------------------------------------------------------------
-- model_metadata: extended descriptive payload. Kept in a side table so the
-- hot list query against `models` stays narrow.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_metadata (
  model_id        TEXT PRIMARY KEY REFERENCES models(id) ON DELETE CASCADE,
  long_description TEXT NOT NULL DEFAULT '',
  inputs_json     TEXT NOT NULL DEFAULT '[]',
  outputs_json    TEXT NOT NULL DEFAULT '[]',
  metrics_json    TEXT NOT NULL DEFAULT '{}',  -- {total_return, sharpe, max_dd, win_rate, sortino}
  risk_json       TEXT NOT NULL DEFAULT '{}',  -- {var, beta, vol}
  jurisdictions_supported_json TEXT NOT NULL DEFAULT '[]',
  updated_at      INTEGER NOT NULL
);

-- ----------------------------------------------------------------------------
-- model_runs: every gateway invocation. `input_sha` + `output_sha` make
-- replay deterministic. `provider`+`model_string` are recorded so the
-- replay endpoint can re-target the same backend.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_runs (
  id            TEXT PRIMARY KEY,
  model_id      TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  version_id    TEXT NOT NULL REFERENCES model_versions(id) ON DELETE CASCADE,
  tenant_id     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id       TEXT REFERENCES users(id) ON DELETE SET NULL,
  jurisdiction  TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  provider      TEXT NOT NULL,                  -- workers_ai|openai|anthropic|together|deterministic
  model_string  TEXT NOT NULL,
  input_sha     TEXT NOT NULL,                  -- sha-256 of canonical request body
  output_sha    TEXT NOT NULL,
  input_json    TEXT NOT NULL,                  -- canonical request body, retained for replay
  output_json   TEXT NOT NULL,                  -- final output (post-stream)
  tokens_in     INTEGER NOT NULL DEFAULT 0,
  tokens_out    INTEGER NOT NULL DEFAULT 0,
  latency_ms    INTEGER NOT NULL DEFAULT 0,
  is_paper      INTEGER NOT NULL DEFAULT 0,     -- 1 if paper-trading sandbox
  created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_runs_tenant ON model_runs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_runs_model ON model_runs(model_id);
CREATE INDEX IF NOT EXISTS idx_runs_input_sha ON model_runs(input_sha);

-- ----------------------------------------------------------------------------
-- subscriptions: tenant-tier subscriptions. `stripe_subscription_id` is the
-- canonical Stripe id; null for free / stub subscriptions.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id                     TEXT PRIMARY KEY,
  tenant_id              TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  jurisdiction           TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  kind                   TEXT NOT NULL CHECK (kind IN ('tier','model')),
  tier                   TEXT,                                    -- starter|pro|enterprise (null for kind='model')
  model_id               TEXT REFERENCES models(id) ON DELETE SET NULL,
  status                 TEXT NOT NULL CHECK (status IN ('trialing','active','past_due','canceled','incomplete')),
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT UNIQUE,
  trial_ends_at          INTEGER,
  current_period_end     INTEGER,
  monthly_price_cents    INTEGER NOT NULL DEFAULT 0,
  created_at             INTEGER NOT NULL,
  updated_at             INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_subs_tenant ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subs_model ON subscriptions(model_id);
CREATE INDEX IF NOT EXISTS idx_subs_status ON subscriptions(status);

-- ----------------------------------------------------------------------------
-- entitlements: KV-cached, but the source of truth lives here so the cache
-- can be rebuilt on demand. One row per (tenant, feature).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entitlements (
  tenant_id     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature       TEXT NOT NULL,                  -- e.g. 'requests_per_day','tokens_per_month','model:<id>'
  limit_value   INTEGER NOT NULL DEFAULT 0,     -- 0 = unlimited (for paid tiers)
  used_value    INTEGER NOT NULL DEFAULT 0,
  period        TEXT NOT NULL CHECK (period IN ('day','month','total')),
  resets_at     INTEGER,                        -- unix seconds; null for total
  updated_at    INTEGER NOT NULL,
  PRIMARY KEY (tenant_id, feature)
);

-- ----------------------------------------------------------------------------
-- api_key_quotas: per-API-key counters. The `entitlements` table is
-- tenant-scoped; this one is *key*-scoped so a developer can hand out a
-- read-only key with a 1k/day cap without raising the tenant ceiling.
-- Mirrors the entitlements column shape so `consume()` semantics are
-- identical (atomic conditional UPDATE, period reset, KV cache).
-- The api_key_id column is unconstrained (no FK) so per-key quotas keep
-- working after rotation deletes the parent key — auditors care about
-- historical counters more than referential integrity here.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_key_quotas (
  api_key_id    TEXT NOT NULL,
  feature       TEXT NOT NULL,
  limit_value   INTEGER NOT NULL DEFAULT 0,     -- 0 = inherit tenant cap (no per-key check)
  used_value    INTEGER NOT NULL DEFAULT 0,
  period        TEXT NOT NULL CHECK (period IN ('day','month','total')),
  resets_at     INTEGER,
  updated_at    INTEGER NOT NULL,
  PRIMARY KEY (api_key_id, feature)
);

-- ----------------------------------------------------------------------------
-- model_reviews: investor-written reviews on a model.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS model_reviews (
  id           TEXT PRIMARY KEY,
  model_id     TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  tenant_id    TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body         TEXT NOT NULL DEFAULT '',
  created_at   INTEGER NOT NULL,
  UNIQUE (model_id, tenant_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_model ON model_reviews(model_id);

-- ----------------------------------------------------------------------------
-- paper_trades: tracks paper-vs-live performance for the trial sandbox.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper_trades (
  id            TEXT PRIMARY KEY,
  tenant_id     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  model_id      TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  run_id        TEXT REFERENCES model_runs(id) ON DELETE SET NULL,
  symbol        TEXT NOT NULL,
  side          TEXT NOT NULL CHECK (side IN ('long','short')),
  qty           REAL NOT NULL,
  entry_price   REAL NOT NULL,
  exit_price    REAL,
  pnl_cents     INTEGER,
  opened_at     INTEGER NOT NULL,
  closed_at     INTEGER
);
CREATE INDEX IF NOT EXISTS idx_paper_tenant ON paper_trades(tenant_id);
CREATE INDEX IF NOT EXISTS idx_paper_model ON paper_trades(model_id);

-- ----------------------------------------------------------------------------
-- billing_events: idempotent record of Stripe webhook deliveries.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing_events (
  id              TEXT PRIMARY KEY,           -- Stripe event id
  type            TEXT NOT NULL,
  tenant_id       TEXT REFERENCES tenants(id) ON DELETE SET NULL,
  payload_json    TEXT NOT NULL,
  processed_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_billing_events_type ON billing_events(type);
