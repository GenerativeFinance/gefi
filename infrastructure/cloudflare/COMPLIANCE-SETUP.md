# Compliance engine setup (Task #4)

This document covers the operator-side bootstrap for the
`gefi-compliance` Worker, the audit ledger, the lawyer/auditor
directory, daily Polygon anchoring, and the data-residency surface.
Tasks #1–#3 must be deployed first — the compliance Worker depends on
the api Worker's Service binding and on the same Wrangler account.

## What ships in Task #4

- **`packages/compliance-rules`** — typed jurisdictional rule book
  covering 11 jurisdictions (SEC, FINRA, MiFID II, GDPR, CCPA, FCA,
  MAS, FINMA, DFSA, SAMA, AUSTRAC). Each rule cites its source statute.
- **`packages/compliance-engine`** — runtime: rule evaluator, Merkle
  hash-chain primitives, mailer / Polygon-anchor / DocuSign provider
  abstractions (each with a deterministic stub + a live HTTP impl
  guarded by secrets), lawyer/auditor directory + assignee picker,
  routing service.
- **`workers/compliance`** — refactored Worker with internal-token
  auth, the new endpoints (see below), and the `ComplianceCase`
  Durable Object (per-case state + SLA `alarm()` timer).
- **D1 migration `0001_init_compliance.sql`** — eight tables:
  `audit_events`, `audit_anchors`, `compliance_cases`, `case_actions`,
  `lawyer_directory`, `auditor_directory`, `tenant_assignments`,
  `data_residency_attestations`.
- **`gefi-api` trigger emitters** — `tenant_onboarded` (onboard),
  `kyc_declined` + `sanction_hit` (KYC webhook), `dsar_received`
  (`/v1/legal/dsar`), `subpoena_received` (`/v1/legal/subpoena`),
  plus the proxy `GET /v1/compliance/residency`.

## Endpoints exposed by `gefi-compliance`

All non-`/health` routes require `X-Gefi-Internal-Token:
$COMPLIANCE_INTERNAL_TOKEN`. The Worker has no public route — it is
only reachable via the `COMPLIANCE` Service binding from `gefi-api`.

| Method | Path                          | Purpose                                                                  |
|--------|-------------------------------|--------------------------------------------------------------------------|
| GET    | `/health`                     | D1/R2/KV smoke test. No auth.                                            |
| POST   | `/events`                     | Receive a platform event, evaluate rules, append audit, route cases.     |
| POST   | `/audit/append`               | Append a free-form audit row (used for inference/training audit hashes). |
| GET    | `/audit/proof/:event_id`      | Merkle inclusion proof for a leaf, plus the most-recent anchor row.      |
| GET    | `/cases?tenant_id=…&status=…` | List cases (D1 mirror).                                                  |
| GET    | `/cases/:id`                  | Case detail + actions log.                                               |
| PATCH  | `/cases/:id`                  | Acknowledge / sign / close (delegated to the `ComplianceCase` DO).       |
| GET    | `/residency/:tenant_id`       | Per-jurisdiction data-plane attestation for the tenant.                  |
| POST   | `/admin/anchor`               | Close out the day's chain into a Merkle root + Polygon anchor.           |
| POST   | `/admin/seed-directory`       | Seed `lawyer_directory` from the static directory in the engine package. |

## Bootstrap (one-time, per environment)

> All `wrangler` commands run from `infrastructure/cloudflare/workers/compliance/`.

```bash
# 1. Provision the compliance D1 database.
pnpm wrangler d1 create gefi-compliance-staging
pnpm wrangler d1 create gefi-compliance-prod
# Copy each `database_id` into `wrangler.jsonc` under env.staging / env.prod.

# 2. Apply the migration.
pnpm wrangler d1 migrations apply gefi-compliance-staging --env staging
pnpm wrangler d1 migrations apply gefi-compliance-prod --env prod

# 3. Mint + set the shared internal token.
INTERNAL=$(openssl rand -hex 32)
pnpm wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env staging <<< "$INTERNAL"
pnpm wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env prod    <<< "$INTERNAL"
# Set the SAME token on the api Worker so its Service binding can authenticate:
pnpm --filter @gefi/worker-api exec wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env staging <<< "$INTERNAL"
pnpm --filter @gefi/worker-api exec wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env prod    <<< "$INTERNAL"

# 4. Deploy.
pnpm wrangler deploy --env staging
pnpm wrangler deploy --env prod

# 5. Seed the lawyer directory (idempotent).
#    There is no public route for /admin/seed-directory — call it via
#    `wrangler` against the deployed compliance Worker:
pnpm wrangler dev --remote --env staging &
DEV_PID=$!
sleep 3
curl -X POST -H "X-Gefi-Internal-Token: $INTERNAL" \
  http://localhost:8787/admin/seed-directory
kill $DEV_PID
#    Or, more simply, run a one-shot script that re-uses the engine
#    package's directory.ts seed inserts directly via `wrangler d1
#    execute` — see `packages/compliance-engine/src/directory.ts`
#    for the canonical seed list.
```

## Optional secrets (live providers)

When unset, each provider falls back to a deterministic stub: emails
are recorded but never sent, anchors get a synthetic
`tx_hash=pending`, and DocuSign envelopes return a synthetic id. The
audit chain itself does **not** depend on any of these — it is fully
self-contained in D1.

```bash
# Mailer (MailChannels DKIM-signed outbound).
pnpm wrangler secret put MAILCHANNELS_DKIM_DOMAIN
pnpm wrangler secret put MAILCHANNELS_DKIM_SELECTOR
pnpm wrangler secret put MAILCHANNELS_DKIM_PRIVATE_KEY
pnpm wrangler secret put MAILCHANNELS_FROM_ADDRESS  # e.g. compliance@gefi.io

# Polygon anchoring.
pnpm wrangler secret put POLYGON_RPC_URL
pnpm wrangler secret put POLYGON_ANCHOR_ADDRESS
# Note: signing is performed by `scripts/anchor-once.ts` (an air-gapped
# relay), not the Worker itself — the private key never sits in a
# long-lived Worker secret.
pnpm wrangler secret put POLYGON_ANCHOR_PRIVATE_KEY  # only on the relay

# DocuSign (lawyer sign-off).
pnpm wrangler secret put DOCUSIGN_BASE_URL
pnpm wrangler secret put DOCUSIGN_INTEGRATION_KEY
pnpm wrangler secret put DOCUSIGN_USER_ID
pnpm wrangler secret put DOCUSIGN_RSA_PRIVATE_KEY
pnpm wrangler secret put DOCUSIGN_ACCOUNT_ID
```

## Audit ledger semantics

`audit_events` is the source-of-truth append-only log. Each row stores
`prev_hash` (= the previous row's `event_hash`) and `event_hash`
(= `sha256(prev_hash || canonical(payload))`). A regulator can re-walk
the chain and detect any tampering: a single forged or modified row
breaks every subsequent hash.

`chain_index` is a per-region monotonic counter — gaps are immediately
visible without scanning the table.

`audit_anchors` records daily Merkle roots + their on-chain Polygon
transaction. An auditor verifies an event by:

1. Calling `GET /audit/proof/:event_id` to obtain the leaf hash, the
   sibling hashes (the "path"), the Merkle root, and the anchor row.
2. Recomputing the root from the leaf + path.
3. Fetching the Polygon transaction at `polygon_tx_hash` and
   confirming it commits the same root on-chain.

## Trigger map (which event fires which rule)

| Event kind            | Triggers                                                                    | Source                              |
|-----------------------|-----------------------------------------------------------------------------|-------------------------------------|
| `tenant_onboarded`    | KYC tier confirmation; logs to audit chain.                                 | `auth/onboard.ts`                   |
| `kyc_declined`        | Warns + arms a 7-day customer-remediation window.                           | `kyc/webhook.ts`                    |
| `sanction_hit`        | Fires SAR (US) / OFSI (UK) / FATF case + suspends tenant.                   | `kyc/webhook.ts`                    |
| `model_listed`        | Securities-counsel review (SEC/FCA/MiFID-II) before listing goes live.      | (subsequent task, future emitter)   |
| `subscription_created`| Audit-only.                                                                 | (future emitter)                    |
| `data_breach`         | GDPR Art. 33 — 72-hour DPA notification, privacy-counsel sign-off.          | (future emitter)                    |
| `dsar_received`       | GDPR Art. 15 (30 days) / CCPA §1798.130 (45 days) data-subject SLA.         | `legal/dsar.ts`                     |
| `drift_exceeded`      | Model-risk review (institutional tenants only).                             | (future emitter)                    |
| `subpoena_received`   | 24-hour AUSTRAC / FINRA legal-hold case + admin-only filer gate.            | `legal/subpoena.ts`                 |
| `cross_border`        | Logs cross-region data movement; required by GDPR + CCPA SCC tracking.     | (future emitter)                    |

## Local development

`wrangler dev` works out of the box — without secrets, every live
provider falls back to its deterministic stub. The unit-test suite
(`pnpm test`) does not touch `wrangler dev` at all: it drives the
Worker via in-memory D1 / R2 / KV / DurableObject shims, so a tenant
can run the entire Task #4 surface from CI without any Cloudflare
account.

## Test coverage

- Rule book: 17 fixture matches across all 11 jurisdictions.
- Engine: 47 tests covering evaluate, Merkle build/proof/verify,
  routing (assignee resolution + email + envelope + idempotency).
- Worker: 11 end-to-end tests (`/events` → audit chain → `/audit/proof`
  Merkle proof; `/admin/anchor` idempotent; SEC `model_listed` opens
  a case; residency synthetic + cached; internal-token auth).
- Total Task #4 footprint: **~70** tests; the full repo runs **177**.

## Out of scope for Task #4 (deliberate)

- Real Polygon TX signing inside the Worker (kept on a separate relay
  Worker per the operator's air-gapped key requirement).
- Real DocuSign JWT-grant exchange (same — kept on a relay Worker).
- Daily anchoring cron — operator can call `POST /admin/anchor`
  manually or wire a Cloudflare Cron Trigger; the endpoint itself is
  idempotent.
- A second, EU-pinned compliance Worker — current shape stores all
  audit rows in a single D1; a follow-up task can shard the DB by
  region without touching the rule book.
