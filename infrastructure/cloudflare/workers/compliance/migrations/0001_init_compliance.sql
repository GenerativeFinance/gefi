-- 0001_init_compliance.sql — Task #4 schema for `gefi-compliance`.
--
-- Applied via `wrangler d1 migrations apply gefi-compliance-<env>` from inside
-- infrastructure/cloudflare/workers/compliance/. Replaces the inline-CREATE
-- bootstrap that lived in the stub Worker. Lives on a *separate* D1 database
-- from `gefi-api` so subpoenas can be served against the compliance store
-- without exposing tenant operational data.
--
-- D1 = SQLite; we stay within SQLite-compatible dialect.

-- ----------------------------------------------------------------------------
-- audit_events: append-only, hash-chained event ledger.
--
-- Each row stores `prev_hash` = the previous row's `event_hash`, and
-- `event_hash` = sha256(prev_hash || canonical_payload). Tampering with any
-- row breaks the chain and is detectable by re-walking from row N+1.
--
-- `chain_index` is a strictly-monotonic per-region integer so a regulator
-- can spot gaps without scanning the whole table. The UNIQUE index on
-- (region, chain_index) is the guard against concurrent append races —
-- a second writer that computed the same index will get a constraint error,
-- not silently overwrite the chain.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_events (
  id              TEXT PRIMARY KEY,
  tenant_id       TEXT,
  user_id         TEXT,
  region          TEXT NOT NULL CHECK (region IN ('eu','us')),
  kind            TEXT NOT NULL,
  severity        TEXT NOT NULL CHECK (severity IN ('info','warn','high','critical')),
  payload_json    TEXT NOT NULL,
  prev_hash       TEXT NOT NULL,                -- hex(sha-256), 64 chars; '0'*64 for genesis
  event_hash      TEXT NOT NULL UNIQUE,         -- hex(sha-256), 64 chars
  chain_index     INTEGER NOT NULL,
  created_at      INTEGER NOT NULL              -- UNIX seconds UTC
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_audit_region_index ON audit_events(region, chain_index);
CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_events(tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_kind ON audit_events(kind, region, created_at);
-- Day-bucket index allows O(1) scoping of daily anchoring queries.
CREATE INDEX IF NOT EXISTS idx_audit_region_day ON audit_events(region, created_at);

-- ----------------------------------------------------------------------------
-- audit_anchors: daily Merkle root + on-chain anchor reference.
--
-- One anchor row per (region, day_bucket). `day_bucket` is the UTC date
-- string "YYYY-MM-DD" that partitions events into daily batches. The
-- anchor covers only the events whose `created_at` falls within that UTC day.
--
-- An external auditor verifies a leaf by:
--   1. GET /audit/proof/:event_id → leaf hash, sibling path, Merkle root,
--      anchor.polygonTxHash.
--   2. Recompute the root from leaf + path.
--   3. Fetch the Polygon TX at polygonTxHash and confirm `data` commits the
--      same root.
--
-- `polygon_tx_hash` is NULL until the off-Worker relay confirms the TX.
-- The relay updates (polygon_tx_hash, polygon_block, status, anchored_at)
-- once the TX is included in a finalized block.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_anchors (
  id                  TEXT PRIMARY KEY,
  region              TEXT NOT NULL CHECK (region IN ('eu','us')),
  day_bucket          TEXT NOT NULL,            -- "YYYY-MM-DD" UTC
  -- Inclusive event-id range covered by this anchor (ordered by chain_index).
  first_event_id      TEXT NOT NULL,
  last_event_id       TEXT NOT NULL,
  event_count         INTEGER NOT NULL,
  merkle_root         TEXT NOT NULL,            -- hex(sha-256)
  polygon_tx_hash     TEXT,                     -- NULL until relay confirms
  polygon_block       INTEGER,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','anchored','failed')),
  created_at          INTEGER NOT NULL,
  anchored_at         INTEGER
);
-- One anchor per (region, day, root) — prevents duplicate inserts.
CREATE UNIQUE INDEX IF NOT EXISTS idx_anchors_region_day_root ON audit_anchors(region, day_bucket, merkle_root);
CREATE INDEX IF NOT EXISTS idx_anchors_region_day ON audit_anchors(region, day_bucket, created_at);
CREATE INDEX IF NOT EXISTS idx_anchors_status ON audit_anchors(status, created_at);

-- ----------------------------------------------------------------------------
-- lawyer_directory + auditor_directory: vetted local counsel per jurisdiction.
--
-- Seeded by `POST /admin/seed-directory`. Email is the routing target; the
-- PGP fingerprint is used by the mailer to encrypt outbound notifications.
-- `sla_ack_hours` is the contractual response SLA for this counsel.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lawyer_directory (
  id                TEXT PRIMARY KEY,
  jurisdiction      TEXT NOT NULL,
  region            TEXT NOT NULL CHECK (region IN ('eu','us')),
  role              TEXT NOT NULL CHECK (role IN ('securities_counsel','privacy_counsel','aml_officer','external_auditor','regulator_liaison')),
  display_name      TEXT NOT NULL,
  firm              TEXT NOT NULL,
  email             TEXT NOT NULL,
  pgp_fingerprint   TEXT,
  sla_ack_hours     INTEGER NOT NULL DEFAULT 24,
  active            INTEGER NOT NULL DEFAULT 1,
  created_at        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_lawyer_juris_role ON lawyer_directory(jurisdiction, role, active);

CREATE TABLE IF NOT EXISTS auditor_directory (
  id                TEXT PRIMARY KEY,
  jurisdiction      TEXT NOT NULL,
  region            TEXT NOT NULL CHECK (region IN ('eu','us')),
  display_name      TEXT NOT NULL,
  firm              TEXT NOT NULL,
  email             TEXT NOT NULL,
  pgp_fingerprint   TEXT,
  sla_ack_hours     INTEGER NOT NULL DEFAULT 48,
  active            INTEGER NOT NULL DEFAULT 1,
  created_at        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auditor_juris ON auditor_directory(jurisdiction, active);

-- ----------------------------------------------------------------------------
-- tenant_assignments: per-tenant default lawyer per (jurisdiction, role).
--
-- Populated on `tenant_onboarded` by `seedTenantAssignments()` so every new
-- tenant is immediately routable without a manual setup step. Operators can
-- override individual rows via direct D1 edits or a future admin API.
-- INSERT OR IGNORE semantics mean re-onboarding never clobbers overrides.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenant_assignments (
  tenant_id     TEXT NOT NULL,
  jurisdiction  TEXT NOT NULL,
  role          TEXT NOT NULL,
  lawyer_id     TEXT NOT NULL REFERENCES lawyer_directory(id),
  assigned_at   INTEGER NOT NULL,
  PRIMARY KEY (tenant_id, jurisdiction, role)
);
CREATE INDEX IF NOT EXISTS idx_tenant_assignments_tenant ON tenant_assignments(tenant_id);

-- ----------------------------------------------------------------------------
-- compliance_cases: one row per ComplianceCase Durable Object. Operational
-- mirror of the DO state so dashboards can list cases without spinning up
-- every DO. The DO is the source of truth for the *active* SLA timer.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS compliance_cases (
  id              TEXT PRIMARY KEY,
  tenant_id       TEXT NOT NULL,
  region          TEXT NOT NULL CHECK (region IN ('eu','us')),
  jurisdiction    TEXT NOT NULL,
  rule_id         TEXT NOT NULL,
  event_id        TEXT NOT NULL,
  reviewer_role   TEXT NOT NULL,
  reviewer_id     TEXT,
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','acknowledged','signed','closed','breached')),
  sla_deadline    INTEGER NOT NULL,
  signed_envelope_id TEXT,
  created_at      INTEGER NOT NULL,
  acknowledged_at INTEGER,
  signed_at       INTEGER,
  closed_at       INTEGER
);
CREATE INDEX IF NOT EXISTS idx_cases_tenant ON compliance_cases(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_cases_reviewer ON compliance_cases(reviewer_id, status);
CREATE INDEX IF NOT EXISTS idx_cases_status_deadline ON compliance_cases(status, sla_deadline);

-- ----------------------------------------------------------------------------
-- case_actions: per-case action log (mailer attempts, DocuSign envelope
-- IDs, regulator-notification receipts).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS case_actions (
  id            TEXT PRIMARY KEY,
  case_id       TEXT NOT NULL REFERENCES compliance_cases(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('pending','succeeded','failed')),
  payload_json  TEXT NOT NULL,
  result_json   TEXT,
  created_at    INTEGER NOT NULL,
  completed_at  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_case_actions_case ON case_actions(case_id);

-- ----------------------------------------------------------------------------
-- data_residency_attestations: per-tenant snapshot of the data planes
-- their data lives in. Refreshed nightly; surfaced via `/residency/:tenant`.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS data_residency_attestations (
  tenant_id           TEXT PRIMARY KEY,
  region              TEXT NOT NULL CHECK (region IN ('eu','us')),
  d1_database         TEXT NOT NULL,
  r2_bucket           TEXT NOT NULL,
  kv_namespace        TEXT NOT NULL,
  regulators_json     TEXT NOT NULL,
  -- Last time the engine confirmed all the planes returned a 200.
  last_verified_at    INTEGER NOT NULL,
  attestation_hash    TEXT NOT NULL
);
