-- 0001_init_auth.sql — Task #3 base schema.
--
-- Applied via `wrangler d1 migrations apply gefi-api-<env>` from inside
-- infrastructure/cloudflare/workers/api/. Every table declares tenant_id +
-- jurisdiction columns from day one so Task #4's compliance routing has the
-- per-row residency signal it needs without backfills.
--
-- D1 = SQLite (libSQL); we stay within the SQLite-supported dialect (no
-- ALTER COLUMN, no foreign-key DEFERRABLE) so subsequent migrations can
-- target dev / staging / prod uniformly.

-- ----------------------------------------------------------------------------
-- tenants: one row per organisation. The owning tenant a user belongs to
-- defines their data residency until they switch tenant.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
  id                TEXT PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,
  display_name      TEXT NOT NULL,
  jurisdiction      TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  entity_type       TEXT NOT NULL CHECK (entity_type IN ('retail','professional','institutional','data_provider')),
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free','starter','pro','enterprise')),
  kyc_tier          TEXT NOT NULL DEFAULT 'none'  CHECK (kyc_tier IN ('none','basic','standard','enhanced')),
  status            TEXT NOT NULL DEFAULT 'pending_kyc' CHECK (status IN ('pending_kyc','active','suspended','closed')),
  created_at        INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tenants_jurisdiction ON tenants(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

-- ----------------------------------------------------------------------------
-- users: identity-provider-backed (auth0_sub is unique). A user can belong
-- to multiple tenants via memberships, but exactly one is their primary.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                  TEXT PRIMARY KEY,
  auth0_sub           TEXT NOT NULL UNIQUE,
  email               TEXT NOT NULL,
  email_verified      INTEGER NOT NULL DEFAULT 0,  -- 0/1 boolean
  primary_tenant_id   TEXT REFERENCES tenants(id),
  jurisdiction        TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  mfa_enrolled        INTEGER NOT NULL DEFAULT 0,
  passkey_count       INTEGER NOT NULL DEFAULT 0,
  created_at          INTEGER NOT NULL,
  last_seen_at        INTEGER
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_primary_tenant ON users(primary_tenant_id);

-- ----------------------------------------------------------------------------
-- memberships: user ↔ tenant ↔ role(s). roles is a JSON array of personas.
-- The composite PK enforces at most one membership per (tenant, user).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memberships (
  tenant_id    TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id      TEXT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  -- Denormalised from `tenants(jurisdiction)` so jurisdiction-scoped
  -- queries (the regional siblings only ever look at one) don't need
  -- to JOIN. Kept consistent at write-time by the onboard handler.
  jurisdiction TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  roles_json   TEXT NOT NULL,   -- JSON: ["admin","developer"]
  created_at   INTEGER NOT NULL,
  PRIMARY KEY (tenant_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_jurisdiction ON memberships(jurisdiction);

-- ----------------------------------------------------------------------------
-- api_keys: tenant-scoped API tokens, hashed at rest. Listing only ever
-- returns a key prefix + label — the full secret is shown once at creation.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
  id            TEXT PRIMARY KEY,
  tenant_id     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  jurisdiction  TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  label         TEXT NOT NULL,
  prefix        TEXT NOT NULL,             -- first 8 chars, shown in listings
  hashed_key    TEXT NOT NULL UNIQUE,      -- sha-256(secret), 64 hex chars
  scopes_json   TEXT NOT NULL DEFAULT '[]',
  created_by    TEXT REFERENCES users(id),
  created_at    INTEGER NOT NULL,
  last_used_at  INTEGER,
  revoked_at    INTEGER
);
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant ON api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(prefix);

-- ----------------------------------------------------------------------------
-- kyc_evidence: one row per KYC session, evolving from `pending` → terminal.
-- Evidence files (selfies, passport scans) live in R2; we store the key.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kyc_evidence (
  id                    TEXT PRIMARY KEY,
  tenant_id             TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id               TEXT REFERENCES users(id)            ON DELETE SET NULL,
  jurisdiction          TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  provider              TEXT NOT NULL,
  provider_session_id   TEXT NOT NULL UNIQUE,
  requested_tier        TEXT NOT NULL CHECK (requested_tier IN ('basic','standard','enhanced')),
  achieved_tier         TEXT          CHECK (achieved_tier IN ('none','basic','standard','enhanced')),
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined','review','expired')),
  evidence_r2_key       TEXT,
  reason_codes_json     TEXT NOT NULL DEFAULT '[]',
  raw_payload_json      TEXT,
  -- Provider-issued hosted-flow URL the user is redirected to. Stored
  -- so a resuming user can pick the same session back up via
  -- /v1/kyc/start without forcing the provider to mint a new applicant.
  hosted_url            TEXT,
  -- UNIX seconds; the provider's stated lifetime of `hosted_url`. The
  -- /v1/kyc/start reuse path treats rows with `expires_at <= now()` as
  -- stale and creates a fresh session instead.
  expires_at            INTEGER,
  created_at            INTEGER NOT NULL,
  updated_at            INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_kyc_tenant ON kyc_evidence(tenant_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_evidence(status);

-- ----------------------------------------------------------------------------
-- sanction_hits: one row per matching list-hit. Onboarding blocks while at
-- least one row exists in `pending` / `confirmed` for the tenant.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sanction_hits (
  id              TEXT PRIMARY KEY,
  tenant_id       TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id         TEXT REFERENCES users(id),
  jurisdiction    TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  source          TEXT NOT NULL,      -- e.g. "opensanctions"
  list_name       TEXT NOT NULL,      -- e.g. "OFAC SDN"
  match_score     REAL NOT NULL,
  matched_name    TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','dismissed')),
  payload_json    TEXT NOT NULL,
  created_at      INTEGER NOT NULL,
  reviewed_at     INTEGER
);
CREATE INDEX IF NOT EXISTS idx_sanction_tenant_status ON sanction_hits(tenant_id, status);

-- ----------------------------------------------------------------------------
-- compliance_events: append-only stream of compliance-relevant facts. Task
-- #4 will consume this and route to lawyers. Task #3 just writes into it.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS compliance_events (
  id              TEXT PRIMARY KEY,
  tenant_id       TEXT REFERENCES tenants(id),
  user_id         TEXT REFERENCES users(id),
  jurisdiction    TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  kind            TEXT NOT NULL,      -- e.g. "sanction_hit","kyc_declined"
  severity        TEXT NOT NULL CHECK (severity IN ('info','warn','high','critical')),
  payload_json    TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','acknowledged','resolved')),
  created_at      INTEGER NOT NULL,
  resolved_at     INTEGER
);
CREATE INDEX IF NOT EXISTS idx_compliance_tenant_status ON compliance_events(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_compliance_jurisdiction_kind ON compliance_events(jurisdiction, kind);
