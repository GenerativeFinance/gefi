# GeFi Cloudflare backend

This is the Cloudflare-native backend for **GeFi.io**. It is a pnpm +
Turborepo monorepo containing three Workers and a small set of shared
packages. The Jekyll marketing site at the repo root (Task #1) talks to
this backend at `https://api.gefi.io`.

## Layout

```
infrastructure/cloudflare/
├── package.json                # workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── vitest.config.ts
├── packages/
│   ├── shared-types/           # Env / Region / DeployEnv types
│   ├── shared-headers/         # CSP, HSTS, COOP/COEP, Permissions-Policy
│   └── shared-router/          # pickRegion(cf.country) + internal JWT
└── workers/
    ├── web/                    # gefi-web   — edge headers + redirects
    ├── api/                    # gefi-api   — public REST + jurisdiction edge
    └── compliance/             # gefi-compliance — internal-only Service
```

## Worker map

| Worker            | Public hostnames                                     | Routing                                                    | Wrangler env  |
|-------------------|------------------------------------------------------|------------------------------------------------------------|---------------|
| `gefi-web`        | `gefi.io`, `www.gefi.io`                             | Header proxy in front of GH Pages (Pages binding optional) | `prod`        |
| `gefi-api`        | `api.gefi.io`                                        | Public edge: picks a region from `cf.country` and forwards | `prod`        |
| `gefi-api-eu`     | `eu.api.gefi.io`                                     | Regional sibling pinned to EU data plane                   | `eu`          |
| `gefi-api-us`     | `us.api.gefi.io`                                     | Regional sibling pinned to US data plane                   | `us`          |
| `gefi-compliance` | *(internal, Service binding only — no public route)* | Audit-log append + jurisdiction rule lookup                | `prod`        |

Staging mirrors prod under `staging.gefi.io` / `staging-api.gefi.io`.

## One-time bootstrap

These steps need an authenticated Cloudflare account. They are NOT runnable
from this Replit sandbox — perform them on your local machine.

### 0. Install + log in

```bash
cd infrastructure/cloudflare
pnpm install
pnpm wrangler login              # browser OAuth, saves token to ~/.wrangler
pnpm wrangler whoami             # confirms account + email
```

### 1. Create the bindings (D1, R2, KV, Vectorize)

Run once per environment (`staging`, `prod`). Repeat the regional ones
(`-eu`, `-us`) for the regional `gefi-api` deployments.

```bash
# D1 — primary OLTP store.
pnpm wrangler d1 create gefi-api-prod
pnpm wrangler d1 create gefi-api-prod-eu
pnpm wrangler d1 create gefi-api-prod-us
pnpm wrangler d1 create gefi-compliance-prod

# R2 — object storage.
pnpm wrangler r2 bucket create gefi-artifacts-prod
pnpm wrangler r2 bucket create gefi-artifacts-prod-eu
pnpm wrangler r2 bucket create gefi-artifacts-prod-us
pnpm wrangler r2 bucket create gefi-evidence-prod

# KV — hot cache + rate limit counters.
pnpm wrangler kv namespace create gefi-cache-prod
pnpm wrangler kv namespace create gefi-cache-prod-eu
pnpm wrangler kv namespace create gefi-cache-prod-us
pnpm wrangler kv namespace create gefi-compliance-cache-prod

# Vectorize — embeddings index.
pnpm wrangler vectorize create gefi-vectors-prod        --dimensions=768 --metric=cosine
pnpm wrangler vectorize create gefi-vectors-prod-eu     --dimensions=768 --metric=cosine
pnpm wrangler vectorize create gefi-vectors-prod-us     --dimensions=768 --metric=cosine
```

Each command prints an ID. Paste those IDs into the matching
`REPLACE_WITH_*` placeholders in:

- `workers/api/wrangler.jsonc`
- `workers/compliance/wrangler.jsonc`

### 2. Set Worker secrets

Run once per environment + Worker. **The same `INTERNAL_SIGNING_KEY` value
must be used for the public edge AND its regional siblings** — the edge
signs the JWT, the regionals verify it. Generate the key once
(`openssl rand -base64 48`) and paste the same string into all three
prompts:

```bash
KEY=$(openssl rand -base64 48)

# gefi-api: edge + EU sibling + US sibling, all sharing one secret.
echo "$KEY" | pnpm --filter @gefi/worker-api wrangler secret put INTERNAL_SIGNING_KEY --env prod
echo "$KEY" | pnpm --filter @gefi/worker-api wrangler secret put INTERNAL_SIGNING_KEY --env eu
echo "$KEY" | pnpm --filter @gefi/worker-api wrangler secret put INTERNAL_SIGNING_KEY --env us

# gefi-compliance.
echo "$KEY" | pnpm --filter @gefi/worker-compliance wrangler secret put INTERNAL_SIGNING_KEY --env prod

unset KEY
```

The regional siblings reject any non-`/health` request that arrives
without a valid edge-signed JWT — direct calls to `eu.api.gefi.io` /
`us.api.gefi.io` from a browser or `curl` will return `401`. This is
deliberate: it's how the jurisdiction edge enforces residency.

### 3. Configure DNS

In the Cloudflare zone for **`gefi.io`** (proxied = ON, orange-cloud, for
all of these):

| Type    | Name                | Target / Notes                                                                   |
|---------|---------------------|----------------------------------------------------------------------------------|
| `A`     | `gefi.io`           | Apex; same four GitHub Pages IPs documented in `docs/dns-setup.md`               |
| `CNAME` | `www.gefi.io`       | `<your-handle>.github.io`                                                        |
| `CNAME` | `api.gefi.io`       | `gefi-api.<your-cf-account>.workers.dev` *(or just attach via Worker Routes)*    |
| `CNAME` | `eu.api.gefi.io`    | `gefi-api-eu.<your-cf-account>.workers.dev`                                      |
| `CNAME` | `us.api.gefi.io`    | `gefi-api-us.<your-cf-account>.workers.dev`                                      |
| `CNAME` | `staging.gefi.io`   | `<your-handle>.github.io` *(separate Pages branch, optional)*                    |
| `CNAME` | `staging-api.gefi.io`| `gefi-api.<your-cf-account>.workers.dev`                                        |

In practice the simplest path for the Worker hostnames is to use Worker
Routes (already declared in each `wrangler.jsonc`) plus a stub DNS record
pointing at `100::` — Cloudflare's documented "no-op" for proxied-only
hostnames.

### 4. Deploy

Order matters — the public edge has Service bindings to the regional
siblings and to `gefi-compliance`, so those must exist first. The CI
workflow does it for you (`workflow_dispatch` only); to run it manually:

```bash
# From infrastructure/cloudflare:

# 1. Compliance (no dependencies).
pnpm --filter @gefi/worker-compliance exec wrangler deploy --env prod

# 2. Regional gefi-api siblings (only depend on gefi-compliance).
pnpm --filter @gefi/worker-api exec wrangler deploy --env eu
pnpm --filter @gefi/worker-api exec wrangler deploy --env us

# 3. Public edge gefi-api (depends on regional siblings + compliance).
pnpm --filter @gefi/worker-api exec wrangler deploy --env prod

# 4. Web header-proxy (independent).
pnpm --filter @gefi/worker-web exec wrangler deploy --env prod
```

Or trigger the GitHub Action — same order, fully scripted:

```bash
gh workflow run deploy-cloudflare.yml -f env=prod
```

### 5. Verify

```bash
# Public edge — should always be 200.
curl -fsS https://api.gefi.io/health | jq
# => { "ok": true, "worker": "gefi-api", "environment": "prod", "region": "us"|"eu", ... }

# Regional /health is open for monitoring.
curl -fsS https://eu.api.gefi.io/health | jq
curl -fsS https://us.api.gefi.io/health | jq

# Direct calls to a regional endpoint OTHER than /health must be 401 —
# this is the jurisdiction-routing gate. If you get a 200 here something
# is misconfigured (most likely INTERNAL_SIGNING_KEY isn't set).
curl -i -fsS https://eu.api.gefi.io/ ; echo
# => HTTP/2 401  …  {"ok":false,"error":"edge_jwt_required"}

# Web surface.
curl -fsS https://gefi.io/_health | jq
# => { "ok": true, "worker": "gefi-web", ... }
```

Then flip the Jekyll site over by editing `_config.yml` at the repo root:

```yaml
api:
  base_url: "https://api.gefi.io"
  newsletter_endpoint: "https://api.gefi.io/v1/forms/newsletter"
  contact_endpoint:    "https://api.gefi.io/v1/forms/contact"
  demo_endpoint:       "https://api.gefi.io/v1/forms/demo"
```

…and the marketing site forms POST real submissions on the next Pages deploy.

## Local development

```bash
cd infrastructure/cloudflare
pnpm install
pnpm test                                  # vitest, runs the unit tests
pnpm typecheck                             # turbo run typecheck across the graph
pnpm --filter @gefi/worker-api run dev     # wrangler dev, local D1/R2/KV emulation
```

Copy `.dev.vars.example` to `.dev.vars` in the Worker you're running and
fill in `INTERNAL_SIGNING_KEY`. `wrangler dev` reads it automatically.

## CI

`.github/workflows/deploy-cloudflare.yml` has two jobs:

- **`verify`** runs on every push that touches `infrastructure/cloudflare/**`.
  Typechecks + runs vitest + does a `wrangler deploy --dry-run` for each
  Worker. No Cloudflare credentials needed.
- **`deploy`** runs on `workflow_dispatch` *only* — i.e. you trigger it
  manually with `gh workflow run deploy-cloudflare.yml -f env=staging`.
  Deploys `gefi-compliance` → `gefi-api` (eu) → `gefi-api` (us) →
  `gefi-api` (edge) → `gefi-web` in that order, gated on the
  `cloudflare-{staging,prod}` Environment in repo settings.

The deploy job is intentionally manual so a fresh clone can land in `main`
without crashing CI on missing secrets / un-filled `REPLACE_WITH_*`
binding IDs. Once you've completed the bootstrap above, dispatch the
workflow.

Required repo Secrets:

- `CLOUDFLARE_API_TOKEN` — token with the **Workers Scripts: Edit**,
  **Workers KV Storage: Edit**, **Workers R2 Storage: Edit**,
  **D1: Edit**, and **Vectorize: Edit** scopes for the GeFi account.
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID.

## Auth, multi-tenancy & jurisdiction routing (Task #3)

Auth runs on Auth0 with RS256 access tokens. The `gefi-api` Worker
fetches the JWKS lazily (KV-cached for 1h), verifies every bearer
token at the edge, and rejects cross-region traffic at the regional
sibling. The full operator runbook is in [`AUTH0-SETUP.md`](./AUTH0-SETUP.md).

Surface area:

- `GET /v1/auth/me` — hydrated principal + tenant slice from D1.
- `POST /v1/auth/onboard` — first-time tenant + user + membership
  creation. Loose auth: accepts a token without GeFi custom claims.
- `POST/GET/DELETE /v1/api-keys[/:id]` — tenant-scoped API keys; the
  raw secret is shown once and stored as `sha256(secret)`.
- `POST /v1/kyc/start` — picks a provider for `(entity_type,
  jurisdiction)` and returns the hosted verification URL.
- `GET /v1/kyc/status` — current evidence + outstanding sanction hits.
- `POST /v1/kyc/webhook[/:provider]` — provider callback; on approve
  runs sanctions screening and either bumps `tenants.kyc_tier` or
  suspends the tenant on a hit.

Packages:

- [`packages/auth`](./packages/auth) — JWKS fetcher, RS256 verifier,
  CASL-style RBAC matrix (`canPerform()`), subscription→KYC tier map.
- [`packages/integrations`](./packages/integrations) — KYC + sanctions
  provider interfaces with stubs and real Onfido / OpenSanctions
  implementations. The factories fall back to stubs that **fail
  closed** when the live provider's secret is missing.

D1 schema: `workers/api/migrations/0001_init_auth.sql` creates
`tenants`, `users`, `memberships`, `api_keys`, `kyc_evidence`,
`sanction_hits`, `compliance_events`. Every row is keyed on
`tenant_id` + `jurisdiction`.

## Compliance engine (Task #4)

Adds a self-contained jurisdictional rule book + a hash-chained audit
ledger anchored to Polygon, served by the `gefi-compliance` Worker.
Operator runbook: [`COMPLIANCE-SETUP.md`](./COMPLIANCE-SETUP.md).

Surface area (internal — Service binding only, gated on
`COMPLIANCE_INTERNAL_TOKEN`):

- `POST /events` — receive a platform event, evaluate rules, append a
  hash-chained audit row, route any triggered cases to local counsel.
- `POST /audit/append` — append a free-form audit row (used by the
  inference / training pipelines for verifiable run hashes).
- `GET /audit/proof/:event_id` — Merkle inclusion proof + the latest
  anchor row, sufficient for an external auditor to verify on-chain.
- `GET /cases?tenant_id=…&status=…` + `GET/PATCH /cases/:id` — case
  lifecycle (open → acknowledged → signed → closed, mirrored by the
  `ComplianceCase` Durable Object's SLA `alarm()`).
- `GET /residency/:tenant_id` — per-tenant data-plane attestation
  (D1 / R2 / KV ids + applicable regulators).
- `POST /admin/anchor` — close out the day's chain into a Merkle root
  + Polygon transaction (idempotent on the same root).
- `POST /admin/seed-directory` — seed `lawyer_directory` from the
  static directory baked into the engine package.

`gefi-api` proxies the customer-facing slice:

- `POST /v1/legal/dsar` — public DSAR intake (anyone can file).
- `POST /v1/legal/subpoena` — `compliance_officer` / `admin` only.
- `GET /v1/compliance/residency` — tenant residency attestation.

Packages:

- [`packages/compliance-rules`](./packages/compliance-rules) — typed
  rule book, 11 jurisdictions, each rule citing its source statute.
- [`packages/compliance-engine`](./packages/compliance-engine) —
  evaluator, Merkle primitives, mailer / Polygon-anchor / DocuSign
  provider abstractions (deterministic stubs + live HTTP impls
  guarded by secrets), lawyer/auditor directory + assignee picker,
  routing service.

D1 schema: `workers/compliance/migrations/0001_init_compliance.sql`
creates `audit_events` (hash-chained), `audit_anchors` (Merkle root +
Polygon tx), `compliance_cases`, `case_actions`, `lawyer_directory`,
`auditor_directory`, `tenant_assignments`,
`data_residency_attestations`. Lives on its own D1, separate from
`gefi-api`.

The audit chain is fully self-contained: even with no MailChannels /
Polygon / DocuSign secrets configured, the chain still produces
verifiable Merkle proofs locally, and CI can run the full suite
without any Cloudflare account.

## What's NOT in this task

- Marketplace + Stripe + onchain billing → **Task #5**.
- Federated learning orchestrator → **Task #6**.
- Persona dashboards (`app.gefi.io`) → **Task #7**.
- TEE / sovereign cloud routing → later phases.
