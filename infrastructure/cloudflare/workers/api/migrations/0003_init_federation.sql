-- 0003_init_federation.sql — Task #6 federated learning + feature store + on-chain rewards.
--
-- Applied via `wrangler d1 migrations apply gefi-api-<env>`. Tables follow the
-- same per-row jurisdiction discipline as the auth + marketplace schemas.
--
-- Threading model:
--   * `federation_rounds`           — one row per round, with state machine
--                                     init→invite→collect→aggregate→distribute→closed.
--   * `federation_participants`     — many participants per round; one row per
--                                     (round, tenant) pair. Tracks invite/accept/
--                                     submit/dropped state + the per-node attestation
--                                     quote captured at accept time.
--   * `federation_updates`          — opaque (model-update) payload uploaded by each
--                                     participant. Stored sha-256 + R2 key + per-update
--                                     mask sum (Bonawitz secure aggregation).
--   * `contribution_scores`         — per-(round, tenant) TMC-Shapley score. Fed into
--                                     reward_distributions when the orchestrator closes
--                                     the round.
--   * `feature_definitions`         — registered features (schema + owner + jurisdiction).
--   * `feature_lookups`             — every feature read for lineage tracking.
--   * `reward_distributions`        — per-tenant reward payouts. `chain_tx_hash` is the
--                                     RewardDistributor.sol on-chain transfer.
--   * `kyc_whitelist`               — per-tenant on-chain KYC entry. Mirror of
--                                     KYCRegistry.sol so the orchestrator can refuse
--                                     payouts to non-whitelisted addresses without an
--                                     RPC round-trip.

-- ----------------------------------------------------------------------------
-- federation_rounds: lifecycle of a single FedAvg / FedProx round.
-- The state machine is enforced by the orchestrator handler; the column is a
-- check-constrained enum so a malformed update can't poison the table.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS federation_rounds (
  id                      TEXT PRIMARY KEY,
  model_id                TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  jurisdiction            TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  round_number            INTEGER NOT NULL,
  status                  TEXT NOT NULL CHECK (status IN ('init','invite','collect','aggregate','distribute','closed','failed')),
  algorithm               TEXT NOT NULL DEFAULT 'fedavg' CHECK (algorithm IN ('fedavg','fedprox')),
  -- Differential-privacy noise multiplier σ (σ=0 disables DP). Pinned at round
  -- create time so every participant trains under the same DP guarantee.
  dp_noise_multiplier     REAL NOT NULL DEFAULT 0,
  dp_l2_clip              REAL NOT NULL DEFAULT 1.0,
  -- Bonawitz secure aggregation. Set to 1 if the orchestrator should require
  -- pairwise mask submissions before revealing the sum. When 0, raw updates
  -- are aggregated in plaintext (dev / single-tenant testing).
  secure_aggregation      INTEGER NOT NULL DEFAULT 1,
  min_participants        INTEGER NOT NULL DEFAULT 3,
  max_participants        INTEGER NOT NULL DEFAULT 100,
  target_version_id       TEXT REFERENCES model_versions(id) ON DELETE SET NULL, -- output version, populated post-aggregate
  baseline_version_id     TEXT REFERENCES model_versions(id) ON DELETE SET NULL, -- starting weights
  -- Aggregate fingerprint — sha-256 over the canonical aggregated weights.
  -- Anchored on-chain via the ContributionLedger so participants can verify
  -- the orchestrator didn't tamper with the aggregate.
  aggregate_sha256        TEXT,
  chain_tx_hash           TEXT,
  invited_at              INTEGER,
  collected_at            INTEGER,
  aggregated_at           INTEGER,
  distributed_at          INTEGER,
  closed_at               INTEGER,
  created_at              INTEGER NOT NULL,
  updated_at              INTEGER NOT NULL,
  UNIQUE (model_id, round_number)
);
CREATE INDEX IF NOT EXISTS idx_rounds_model ON federation_rounds(model_id);
CREATE INDEX IF NOT EXISTS idx_rounds_status ON federation_rounds(status);

-- ----------------------------------------------------------------------------
-- federation_participants: per-(round, tenant) participation row.
-- `attestation_quote` is the SGX/Nitro quote bytes (base64) captured at
-- accept-time so an auditor can later prove the update was produced inside
-- a TEE on a known measurement (mrenclave / pcrs).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS federation_participants (
  id                  TEXT PRIMARY KEY,
  round_id            TEXT NOT NULL REFERENCES federation_rounds(id) ON DELETE CASCADE,
  tenant_id           TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  jurisdiction        TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  status              TEXT NOT NULL CHECK (status IN ('invited','accepted','submitted','dropped','rejected')),
  attestation_kind    TEXT CHECK (attestation_kind IN ('stub','sgx','nitro')),
  attestation_quote   TEXT,
  attestation_mrenclave TEXT,
  invited_at          INTEGER NOT NULL,
  accepted_at         INTEGER,
  submitted_at        INTEGER,
  sample_count        INTEGER NOT NULL DEFAULT 0,
  UNIQUE (round_id, tenant_id)
);
CREATE INDEX IF NOT EXISTS idx_participants_round ON federation_participants(round_id);
CREATE INDEX IF NOT EXISTS idx_participants_tenant ON federation_participants(tenant_id);

-- ----------------------------------------------------------------------------
-- federation_updates: per-(round, participant) opaque update payload.
-- The actual gradient bytes live in R2 (`r2_key`); D1 holds the metadata so
-- the orchestrator can iterate updates without paying R2 GET latency on the
-- happy path. `mask_sum_sha256` is the fingerprint of the participant's
-- pairwise-mask-sum used for Bonawitz secure aggregation.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS federation_updates (
  id                TEXT PRIMARY KEY,
  round_id          TEXT NOT NULL REFERENCES federation_rounds(id) ON DELETE CASCADE,
  participant_id    TEXT NOT NULL REFERENCES federation_participants(id) ON DELETE CASCADE,
  tenant_id         TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  r2_key            TEXT NOT NULL,
  payload_sha256    TEXT NOT NULL,
  payload_size      INTEGER NOT NULL,
  mask_sum_sha256   TEXT,
  -- Per-update DP noise sigma actually applied (clients may raise σ above the
  -- round minimum but never lower it — the orchestrator rejects on submit).
  dp_noise_applied  REAL NOT NULL DEFAULT 0,
  sample_count      INTEGER NOT NULL DEFAULT 0,
  created_at        INTEGER NOT NULL,
  UNIQUE (round_id, participant_id)
);
CREATE INDEX IF NOT EXISTS idx_updates_round ON federation_updates(round_id);

-- ----------------------------------------------------------------------------
-- contribution_scores: TMC-Shapley score per (round, tenant). Range is
-- conventionally [-1, +1] but we don't constrain it (Shapley can exceed 1
-- if a player's marginal lift dominates). The reward distributor pays out
-- proportional to clamp(score, 0, 1) so non-helpful contributors earn
-- nothing but never owe anything either.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contribution_scores (
  round_id        TEXT NOT NULL REFERENCES federation_rounds(id) ON DELETE CASCADE,
  tenant_id       TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  score           REAL NOT NULL,
  -- How many TMC permutations contributed to the estimate. Higher = more
  -- precise but linearly more expensive.
  permutations    INTEGER NOT NULL DEFAULT 0,
  computed_at     INTEGER NOT NULL,
  PRIMARY KEY (round_id, tenant_id)
);
CREATE INDEX IF NOT EXISTS idx_contrib_tenant ON contribution_scores(tenant_id);

-- ----------------------------------------------------------------------------
-- feature_definitions: registered federated features. Owner is the developer
-- tenant. Each feature has a JSON schema and a target jurisdiction (so the
-- orchestrator never serves an EU-only feature from a US lookup).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feature_definitions (
  id                  TEXT PRIMARY KEY,
  slug                TEXT NOT NULL UNIQUE,
  owner_tenant_id     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  jurisdiction        TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  schema_json         TEXT NOT NULL DEFAULT '{}',
  default_ttl_seconds INTEGER NOT NULL DEFAULT 60,
  source_endpoint     TEXT NOT NULL,        -- node-agent feature server URL or stub://
  description         TEXT NOT NULL DEFAULT '',
  created_at          INTEGER NOT NULL,
  updated_at          INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_features_owner ON feature_definitions(owner_tenant_id);

-- ----------------------------------------------------------------------------
-- feature_lookups: lineage. Every successful lookup is logged so an auditor
-- can prove which features fed which inference run. Joined on `model_run_id`
-- back to `model_runs` for full provenance.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feature_lookups (
  id              TEXT PRIMARY KEY,
  feature_id      TEXT NOT NULL REFERENCES feature_definitions(id) ON DELETE CASCADE,
  tenant_id       TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  model_run_id    TEXT REFERENCES model_runs(id) ON DELETE SET NULL,
  lookup_key      TEXT NOT NULL,
  result_sha256   TEXT NOT NULL,                   -- sha-256 of canonical result
  cached          INTEGER NOT NULL DEFAULT 0,      -- 1 if served from regional cache
  latency_ms      INTEGER NOT NULL DEFAULT 0,
  created_at      INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_lookups_feature ON feature_lookups(feature_id);
CREATE INDEX IF NOT EXISTS idx_lookups_run ON feature_lookups(model_run_id);

-- ----------------------------------------------------------------------------
-- reward_distributions: per-tenant payouts against a closed round. The
-- on-chain `chain_tx_hash` is populated when the RewardDistributor.sol
-- transfer broadcasts. `wei_amount` is stored as a decimal string because
-- D1's REAL is a float and can't precisely represent 256-bit ints.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reward_distributions (
  id                TEXT PRIMARY KEY,
  round_id          TEXT NOT NULL REFERENCES federation_rounds(id) ON DELETE CASCADE,
  tenant_id         TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  recipient_address TEXT NOT NULL,                  -- 0x-prefixed Base address
  wei_amount        TEXT NOT NULL,                  -- decimal string, fits 256-bit
  contribution_score REAL NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('pending','broadcast','confirmed','failed')),
  chain_tx_hash     TEXT,
  failure_reason    TEXT,
  created_at        INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL,
  UNIQUE (round_id, tenant_id)
);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON reward_distributions(status);
CREATE INDEX IF NOT EXISTS idx_rewards_tenant ON reward_distributions(tenant_id);

-- ----------------------------------------------------------------------------
-- kyc_whitelist: mirror of the on-chain KYCRegistry. The reward distributor
-- refuses payout to any tenant whose `recipient_address` is not present here,
-- regardless of contribution score. The on-chain copy is the source of truth;
-- this table is the read-side cache so the gateway doesn't pay an RPC
-- round-trip on every distribute call.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kyc_whitelist (
  tenant_id         TEXT PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  recipient_address TEXT NOT NULL UNIQUE,           -- 0x-prefixed Base address
  jurisdiction      TEXT NOT NULL CHECK (jurisdiction IN ('eu','us')),
  expires_at        INTEGER,                        -- unix seconds; null = never
  chain_tx_hash     TEXT,                           -- KYCRegistry.add() tx
  added_by          TEXT NOT NULL,                  -- admin user_id
  created_at        INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL
);
