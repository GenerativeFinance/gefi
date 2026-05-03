# GeFi.io — agent project notes

This file is the canonical agent-facing context for the GeFi.io project.
Keep it short, opinionated, and current.

## What this repo is

A **static Jekyll site** for GeFi's public marketing and content surface.
It is hosted on **GitHub Pages** at the apex domain **`gefi.io`** and built
by `.github/workflows/deploy-pages.yml` on every push to `main`.

It is **not** the GeFi platform itself. The platform (APIs, dashboards,
auth, inference, federated training, audit log, compliance routing) is a
**separate Cloudflare-based stack** built across subsequent tasks (`api.gefi.io`,
`app.gefi.io`, `trust.gefi.io`, etc.).

The previous **React + Vite + Express + Drizzle** monolith that used to
live in this repo has been moved into [`legacy/`](./legacy/README.md) and is
referenced — never deployed.

## Hosting model (do not get this wrong)

- **Production hosting:** **GitHub Pages** at the apex domain `gefi.io`.
  DNS A records on the apex point at the four GitHub Pages IPs (see
  `docs/dns-setup.md`). The `CNAME` file at the repo root pins the
  custom domain.
- **How the site reaches Pages:** `.github/workflows/deploy-pages.yml`
  runs on every push to `main`. It builds the site with Bundler-pinned
  Jekyll 4.4.1 (matching `Gemfile.lock` exactly), runs `htmlproofer`
  against the build, and publishes `_site/` via `actions/deploy-pages`.
  The `.nojekyll` file at the repo root tells GitHub Pages NOT to
  re-process the artifact — Pages serves the uploaded `_site/` verbatim.
- **One-time GitHub setting:** Repo Settings → Pages → Build and deployment
  → Source must be set to **"GitHub Actions"** (not "Deploy from a branch").
  If this is left on the branch-source default, GH Pages falls back to its
  built-in Jekyll 3.10.x processor — which honours `.nojekyll` and serves
  raw `*.md` source as plain text. That's the "wall of text" symptom that
  bit the live site before this workflow existed. **Do not delete `.nojekyll`**
  as a workaround — that will switch GH Pages back to its built-in Jekyll
  3.x processor and break Jekyll 4-only features (`_config.yml` keys,
  newer Liquid filters, etc.).
- **Cloudflare Pages:** **not used in production.** The repo still carries
  `wrangler.jsonc` and a `package.json` `npm run deploy` script (`wrangler
  pages deploy _site --project-name=gefi --branch=main`) so an operator can
  cut over to Cloudflare Pages later without rewriting the deploy plumbing.
  If you do migrate, switch DNS off the GH Pages IPs and either delete
  `.github/workflows/deploy-pages.yml` or gate it on a branch other than
  `main` so the two hosts don't fight.
- **Cloudflare backend:** the Workers under `infrastructure/cloudflare/`
  ARE in production (api.gefi.io). They are deployed by
  `.github/workflows/deploy-cloudflare.yml` — separate from the Pages site.
- **Replit hosting:** **none.** The Replit workflow runs
  `bundle exec jekyll serve` on port 5000 for local preview only.
- **No Replit `[deployment]` in `.replit`.** Do not add one.

## Tech stack

- **Site generator:** Jekyll 4.3
- **Plugins:** `jekyll-feed`, `jekyll-sitemap`, `jekyll-seo-tag`, `jekyll-redirect-from`
- **Markup:** Markdown + Liquid + plain HTML in layouts
- **CSS:** one hand-rolled `assets/css/main.css` with CSS variables. No
  Tailwind. No SCSS pipeline.
- **JS:** one tiny `assets/js/forms.js` for the mobile nav + form POSTs.
  No framework, no bundler, no NPM in this repo.
- **Fonts:** Inter (UI) + JetBrains Mono (numerics) loaded from Google Fonts.

## Repository layout

| Path                          | Purpose                                            |
|-------------------------------|----------------------------------------------------|
| `_config.yml`                 | Site config: title, URL, nav, API endpoints, collections, exclusions |
| `Gemfile`                     | Ruby gems                                          |
| `CNAME`                       | `gefi.io`                                          |
| `.nojekyll`                   | Tells GitHub Pages NOT to re-process the artifact uploaded by `deploy-pages.yml` — required, do not delete |
| `.github/workflows/deploy-pages.yml` | Builds Jekyll 4.4.1 with Bundler and publishes `_site/` to GitHub Pages on every push to `main` |
| `package.json` / `wrangler.jsonc` | Optional Cloudflare Pages deploy plumbing — not currently used (production is GH Pages) |
| `index.html`                  | Home                                               |
| `features.md` / `pricing.md` / `models.md` / `research.md` / `docs.md` / `blog.md` / `about.md` / `compliance.md` / `contact.md` | Top-level marketing pages |
| `legal/privacy.md`, `legal/terms.md` | Placeholder legal pages                     |
| `404.html`, `robots.txt`      | Standard utility pages                             |
| `_layouts/`                   | `default`, `page`, `post`, `model`, `pricing`      |
| `_includes/`                  | `head`, `header`, `footer`, `seo`, `hero`, `feature-grid`, `pricing-table`, `model-card`, `research-card`, `blog-list`, `cta`, `newsletter`, `config-script` |
| `assets/css/main.css`         | The whole stylesheet                               |
| `assets/js/forms.js`          | Nav toggle + generic form POST handler             |
| `assets/img/*`                | Logo + favicon (SVG)                               |
| `_models/*.md`                | Marketplace catalogue entries (collection)         |
| `_research/*.md`              | Research notes (collection)                        |
| `_posts/*.md`                 | Blog posts                                         |
| `.github/workflows/deploy-cloudflare.yml` | Cloudflare Workers backend deploy (not the marketing site) |
| `docs/dns-setup.md`           | DNS + Pages one-time setup                         |
| `infrastructure/cloudflare/`  | Cloudflare backend monorepo (Task #2). pnpm + Turborepo. Three Workers (`gefi-web`, `gefi-api`, `gefi-compliance`) + shared packages. Self-contained — own `package.json`, `pnpm-lock.yaml`, `tsconfig.base.json`. **Never** hoist node_modules from here to the repo root. **All secrets** live in `wrangler secret put` (Workers) or GitHub Environment secrets (CI). The full inventory + exact `wrangler secret put` commands are in `infrastructure/cloudflare/SECRETS.md` — keep it in sync with `packages/shared-types/src/env.ts`. **Never** commit a real secret value to this repo. |
| `legacy/`                     | Archived React/Express prototype + its `README.md` |

## Branding tokens (used throughout the site)

```
--color-bg:      #FAFBFF;   --color-surface: #FFFFFF;
--color-text:    #0B0E1A;   --color-muted:   #6B7280;
--color-brand:   #6D5BFF;   --color-accent:  #22D3EE;
--color-profit:  #16A34A;   --color-loss:    #DC2626;
font-sans: "Inter";  font-mono: "JetBrains Mono";
```

Match these everywhere. The same palette is mirrored in the playground
spec (`.local/tasks/`) so the marketing site and app surface feel
continuous.

## Two big config switches in `_config.yml`

These two blocks decide whether the site looks "pre-launch" or "live":

```yaml
api:
  newsletter_endpoint: ""   # empty -> JS shows simulated success
  contact_endpoint: ""
  demo_endpoint: ""

app:
  enabled: false            # false -> Sign in / Get started / Subscribe -> /contact/
  signin_url: "https://app.gefi.io/sign-in"
  signup_url: "https://app.gefi.io/sign-up"
  fallback_url: "/contact/?topic=sales"
```

- **`api.*_endpoint`**: `assets/js/forms.js` only `fetch()`s when the endpoint
  is a non-empty string. While they're empty, every form acknowledges with
  "Thanks! We'll be in touch shortly." and logs the payload to the console —
  no network call, no false error states. The Cloudflare backend (Task #2)
  is now built — once it's deployed and DNS for `api.gefi.io` resolves, set:
  ```yaml
  api:
    base_url: "https://api.gefi.io"
    newsletter_endpoint: "https://api.gefi.io/v1/forms/newsletter"
    contact_endpoint:    "https://api.gefi.io/v1/forms/contact"
    demo_endpoint:       "https://api.gefi.io/v1/forms/demo"
  ```
  No JS code changes needed. The Worker accepts any JSON body and persists
  it to D1; CORS is allow-listed to `https://gefi.io` + `https://www.gefi.io`.
- **`app.enabled`**: when `false`, every "Sign in" / "Get started" / "Subscribe"
  CTA across `_includes/header.html`, `_includes/cta.html`,
  `_includes/pricing-table.html`, and `_layouts/model.html` routes to
  `app.fallback_url` instead of `app.signin_url` / `app.signup_url`. Flip to
  `true` once Task #7 (the dashboards on `app.gefi.io`) is live.

Both flags exist so the marketing site can ship to the apex domain BEFORE the
backend / dashboards exist, without any dead links or console errors.

## Working on this repo

- **Never** add `package.json` or run `npm install` at the root. Node was
  intentionally removed from this surface. The Cloudflare backend lives
  under `infrastructure/cloudflare/` and has its own `package.json` /
  `pnpm-lock.yaml` / `node_modules` — keep it that way.
- **Never** install Tailwind, SCSS, or any JS bundler at the root. Hand-write
  CSS in `assets/css/main.css`.
- **Never** add a Replit `[deployment]` block to `.replit`.
- **Never** un-commit `Gemfile.lock` *or* `infrastructure/cloudflare/pnpm-lock.yaml`.
  Deterministic builds are non-negotiable for both the Pages and Workers CI.
- **Always** keep `CNAME` set to `gefi.io`.
- **Always** put new pages with a permalink (`permalink: /thing/`) so URLs
  stay clean.
- **Always** route any new app/auth CTA through `site.app.enabled` — see
  `_includes/header.html` for the canonical pattern.
- **Always** update this file when adding a new page type, layout, include,
  collection, or major content section.

## Progressive enhancement contract

- The page works without JavaScript. The `<html class="no-js">` is swapped to
  `class="js"` by an inline script in `_layouts/default.html`. CSS keys mobile-nav
  behaviour off `.js` vs `.no-js` so no-JS visitors get a stacked, always-visible
  nav instead of a permanently-hidden menu. Forms fall back to a `<noscript>`
  block pointing at `mailto:hello@gefi.io`.
- Don't break this. If you add a feature that needs JS, give it a no-JS path
  too.

## Project tasks (parent backlog at the time of writing)

| #  | Title                                                              | State          |
|----|--------------------------------------------------------------------|----------------|
| 1  | Static Jekyll site on GitHub Pages                                 | **In progress (this task).** |
| 2  | Cloudflare backend foundation (Workers + D1 + R2 + KV + Vectorize) | **In progress (this task).** |
| 3  | Auth (Auth0 + JWT) + tenancy                                       | Pending        |
| 4  | Compliance routing + audit log + trust portal                      | **Done.**      |
| 5  | Marketplace + payments (Stripe + onchain)                          | **Done.**      |
| 6  | Federated learning network                                         | Pending        |
| 7  | App / dashboards (`app.gefi.io`)                                   | Pending        |
| 8  | Production hardening + status page + observability                 | Pending        |
| 9–17 | Playground 8-phase parallel track                                | Pending        |

If a future task contradicts the rules above, the rules above are wrong —
update this file in the same change.

## Cloudflare backend (`infrastructure/cloudflare/`)

A pnpm + Turborepo workspace. Three Workers + three shared packages.

```
infrastructure/cloudflare/
├── packages/
│   ├── shared-types/     # Env / Region / DeployEnv interfaces
│   ├── shared-headers/   # CSP, HSTS, COOP/COEP, Permissions-Policy
│   └── shared-router/    # pickRegion(cf.country) + internal HS256 JWT
└── workers/
    ├── web/              # gefi-web   — edge headers + redirects on gefi.io
    ├── api/              # gefi-api   — public REST + jurisdiction edge on api.gefi.io
    └── compliance/       # gefi-compliance — internal Service binding only
```

Public hostnames: `api.gefi.io` (edge) → forwards to `eu.api.gefi.io` /
`us.api.gefi.io` (regional siblings, same code, pinned `WORKER_REGION`).
DNS, secrets, D1/R2/KV/Vectorize bootstrap commands, and verification
steps are documented in `infrastructure/cloudflare/README.md`.

CI: `.github/workflows/deploy-cloudflare.yml`. Requires repo Secrets
`CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` and the
`cloudflare-staging` / `cloudflare-prod` Environments configured in
repo settings.

Local dev:
```bash
cd infrastructure/cloudflare
pnpm install
pnpm test          # vitest, runs the unit tests (33+ tests across 5 files)
pnpm typecheck     # turbo run typecheck across the graph
pnpm --filter @gefi/worker-api run dev    # wrangler dev with local D1/R2/KV emulation
```

## Task #3 — Auth, multi-tenancy & jurisdiction routing (DONE)

Auth runs on Auth0 with RS256 tokens. The operator runbook is
`infrastructure/cloudflare/AUTH0-SETUP.md`. Required env vars:
`AUTH0_DOMAIN`, `AUTH0_AUDIENCE` (in `wrangler.jsonc`) and the secret
`AUTH0_M2M_CLIENT_SECRET` (via `wrangler secret put`).

New packages:
- `packages/auth` — JWKS cache (`jwks.ts`), RS256 verifier (`verify.ts`
  with both strict and `verifyAuth0TokenLoose` variants), 7-persona
  RBAC matrix (`rbac.ts`), subscription→KYC tier map (`kyc-tiers.ts`),
  Auth0 Management M2M client (`management.ts`) for writing
  `app_metadata.gefi` after onboarding.
- `packages/integrations` — `KycProvider` + `SanctionsProvider`
  interfaces, with `StubKycProvider`, `OnfidoKycProvider` (HMAC-SHA256
  `X-SHA2-Signature`), `SumsubKycProvider` (HMAC-SHA256
  `X-Payload-Digest`, KYB level mapping for institutional /
  data_provider), `StubSanctionsProvider`, `OpenSanctionsProvider`.
  Factories are **fail-closed in production**: in `prod` they throw
  `KycProviderNotConfiguredError` /
  `SanctionsProviderNotConfiguredError` rather than falling back to
  the stub, and the handlers translate the throw to 503. Dev /
  staging keep the stub fallback for local iteration and tests.
- `assets/js/role-gate.js` — client-side RBAC primitive. Exports
  `canPerform()` and a `<role-gate action subject>` web component
  for plain Jekyll pages; the Task #7 React dashboards will import
  the same module. A vitest sync test
  (`packages/auth/src/role-gate-sync.test.ts`) fails the build if
  this client mirror drifts from the server-side `rbac.ts`.

D1: `workers/api/migrations/0001_init_auth.sql` creates `tenants`,
`users`, `memberships`, `api_keys`, `kyc_evidence`, `sanction_hits`,
`compliance_events`. Every table has `tenant_id` + `jurisdiction`.

Endpoints (in `gefi-api`):
- `GET /v1/auth/me`, `POST /v1/auth/onboard`,
  `POST/GET/DELETE /v1/api-keys[/:id]`,
- `POST /v1/kyc/start`, `GET /v1/kyc/status`,
  `POST /v1/kyc/webhook[/:provider]`.

Cross-region rejection: regional siblings drop traffic whose JWT
`jurisdiction` claim doesn't match `WORKER_REGION`. The public edge
forwards based on the JWT's `jurisdiction` (else `cf.country`).

Jekyll onboarding: `onboarding/index.html` (jurisdiction) →
`/onboarding/entity/` → `/onboarding/identity/` → `/onboarding/security/`,
gated on `site.app.enabled`. `assets/js/onboarding.js` posts to
`/v1/auth/onboard` then `/v1/kyc/start`.

Tests: 100/100 (`packages/auth` 34, `packages/integrations` 18,
`workers/api` 18 incl. integration, `workers/web` 2, `shared-router`
17, `shared-types` 0, `shared-headers` 0). Run `pnpm test` from
`infrastructure/cloudflare/`.

What's NOT here yet (each lives in a downstream task):

- Marketplace + Stripe + onchain billing → **Task #5**.
- Federated learning orchestrator → **Task #6**.
- Persona dashboards on `app.gefi.io` → **Task #7**.

## Task #4 — Compliance engine + audit vault (DONE)

The `gefi-compliance` Worker is now a real service: typed
jurisdictional rule book, evaluator, Merkle hash-chained audit
ledger, daily Polygon anchoring, lawyer/auditor directory + case
routing, and per-tenant data-residency attestations. Operator
runbook: `infrastructure/cloudflare/COMPLIANCE-SETUP.md`.

New packages:

- `packages/compliance-rules` — typed rules covering SEC, FINRA,
  MiFID II, GDPR, CCPA, FCA, MAS, FINMA, DFSA, SAMA, AUSTRAC. Each
  rule cites its source statute.
- `packages/compliance-engine` — `evaluate()`, Merkle build /
  proof / verify, mailer (MailChannels DKIM-signed) + Polygon
  anchor + DocuSign provider abstractions with deterministic stubs
  used in dev / tests, and the lawyer/auditor directory + routing
  service that opens cases against local counsel.

D1: `workers/compliance/migrations/0001_init_compliance.sql` adds
`audit_events`, `audit_anchors`, `compliance_cases`, `case_actions`,
`lawyer_directory`, `auditor_directory`, `tenant_assignments`,
`data_residency_attestations`. Fresh DB — separate from `gefi-api`.

Internal Worker endpoints (`COMPLIANCE_INTERNAL_TOKEN`-gated): `POST
/events`, `POST /audit/append`, `GET /audit/proof/:id`, `GET/PATCH
/cases[/:id]`, `GET /residency/:tenant_id`, `POST /admin/anchor`,
`POST /admin/seed-directory`. Customer-facing routes on `gefi-api`:
`POST /v1/legal/dsar`, `POST /v1/legal/subpoena`, `GET
/v1/compliance/residency`. The `gefi-api` handlers for onboard +
KYC webhook now emit `tenant_onboarded`, `kyc_declined`, and
`sanction_hit` events to the compliance Worker (best-effort —
failures are warned, never block the primary flow).

`ComplianceCase` Durable Object owns per-case state (open →
acknowledged → signed → closed) and SLA enforcement via `alarm()`,
mirroring transitions back to D1 so the read-side `/cases` queries
hit a normal index.

Tests: 177/177 passing across 18 files (engine 47, rules 17,
compliance worker 11 end-to-end including SEC `model_listed`
routing, GDPR / CCPA fixtures, Merkle proof roundtrip, anchor
idempotency, internal-token auth). `pnpm --filter
@gefi/worker-compliance run build` (wrangler dry-run) succeeds with
the new `CASE_DO` Durable Object binding.

## Task #5 — Marketplace, billing & model gateway (DONE)

The `gefi-api` Worker now serves the full marketplace surface:
listing, version publish + R2-stored artifacts, admin approval,
faceted search, Stripe-backed subscriptions + Connect payouts, a
region-aware AI provider chain, deterministic replay, and the
paper-trading sandbox. Operator runbook:
`infrastructure/cloudflare/MARKETPLACE-SETUP.md`.

New packages:

- `packages/marketplace` — registry CRUD over D1, R2 artifact upload
  with sha-256 + Polygon `ModelAnchor` (StubModelAnchor in dev,
  real Polygon in prod via `POLYGON_*` secrets).
- `packages/billing` — tier catalog (Free / Starter $99 / Pro $499 /
  Enterprise $2 499), `StubStripe` + `RealStripe` (REST), HMAC-SHA256
  webhook signature verify with constant-time compare + 300 s
  tolerance, KV-cached entitlement counters with month / day
  windows, dunning email builder, `StubMailer` + `RealMailer`
  (Resend).
- `packages/model-gateway` — provider abstraction (WorkersAi →
  OpenAI → Anthropic → Together → Deterministic) with region-keyed
  secrets, canonical input hashing for replay, SSE response
  streaming, byte-identical `replayRun()` against the deterministic
  provider.
- `packages/search-index` — `LocalIndex` (in-process, faceted) +
  `TypesenseIndex` (real HTTP). Jurisdiction-aware filter so the
  EU edge never returns US-only listings.
- `packages/reference-models` — two end-to-end examples:
  `sentiment-from-filings` (RAG over a fixture corpus + deterministic
  fallback label) and `portfolio-optimiser` (deterministic
  mean-variance with risk aversion + long-only modes).

D1: `workers/api/migrations/0002_init_marketplace.sql` adds
`models`, `model_versions`, `model_metadata`, `model_runs`,
`subscriptions`, `entitlements`, `model_reviews`, `paper_trades`,
and `billing_events`. Every table is `tenant_id` + `jurisdiction`
keyed.

New endpoints (`gefi-api`):
- Registry: `POST/GET /v1/models`, `GET /v1/models/:id`,
  `PUT /v1/models/:id/metadata`, `POST /v1/models/:id/versions`,
  `POST /v1/models/:id/approve`, `GET /v1/models/search`.
- Gateway: `POST /v1/models/:id/run` (SSE),
  `POST /v1/runs/:runId/replay`, `POST /v1/models/:id/paper-trade`.
- Billing: `POST /v1/billing/subscriptions`, `GET /v1/billing/portal`,
  `POST /v1/billing/connect/onboarding`,
  `POST /v1/billing/webhook` (open path — HMAC auth),
  `GET /v1/entitlements`.

Compliance triggers: `publishVersion` emits `model_listed`,
`createSubscription` emits `subscription_created`. Both reuse the
existing `gefi-compliance` service binding.

Tests: 249 / 249 passing across 24 files (marketplace 6, billing
16, model-gateway 14, search-index 8, reference-models 10, plus 6
new integration tests in `workers/api/src/integration.test.ts` and
the pre-existing 189). `pnpm --filter @gefi/worker-api run build`
(wrangler dry-run) succeeds with the new D1 / R2 bindings unchanged.

What's NOT here yet:
- Persona dashboards on `app.gefi.io` → **Task #7**.

## Task #6 — Federated learning infrastructure

End-to-end federated-learning stack lives in `infrastructure/cloudflare/`
(TS packages + worker handlers) and `infrastructure/contracts/` (Solidity).
Production-shaped code with deterministic stubs because the sandbox
cannot reach Base testnet, run Foundry, or stand up SGX/Nitro nodes.

**Packages**
- `@gefi/federation` — `FederationStore` (D1 CRUD over 4 tables), FedAvg
  + FedProx weighted aggregation, Bonawitz pairwise-mask secure
  aggregation (deterministic mulberry32 PRNG so masks cancel exactly),
  DP-SGD Gaussian noise via seeded Box-Muller, TMC-Shapley contribution
  scorer with truncation.
- `@gefi/node-agent` — Apache-2.0 licensed open-source contract: SQL /
  NoSQL / Kafka adapter interfaces with stubs, synthetic linear DP-SGD
  trainer, `StubAttestation` / `SgxAttestation` / `NitroAttestation`,
  Merkle hash-chain audit log over canonical JSON, in-process feature
  server.
- `@gefi/feature-store` — `FeatureDefinition` registry, KV-backed +
  in-memory regional caches with TTL, jurisdiction-enforced
  `lookupFeature(...)` writing a `feature_lookups` lineage row per call,
  Stub + HTTP `FeatureNodeClient`.
- `@gefi/onchain-federation` — Stub + Real Base clients for the four
  Solidity contracts, sharing a single legacy-tx broadcaster
  (`broadcastBaseTx`). `computeRewards(...)` splits a wei pool by
  Shapley score with deterministic floor-rounding (remainder poured
  into the largest allocation so Σ payouts == pool exactly).

**Contracts (`infrastructure/contracts/`)**
- `foundry.toml`, `README.md` (forge build/test instructions), and
  `src/{Ownable,ModelRegistry,ContributionLedger,RewardDistributor,
  KYCRegistry}.sol` + 4 `.t.sol` test suites + `script/Deploy.s.sol`.
- Sandbox cannot run forge; operator runs in CI.

**API + worker wiring**
- `0003_init_federation.sql` adds 8 tables: `federation_rounds`,
  `federation_participants`, `federation_updates`, `contribution_scores`,
  `feature_definitions`, `feature_lookups`, `reward_distributions`,
  `kyc_whitelist`.
- `ApiEnv` extended with `BASE_RPC_URL`, `BASE_CHAIN_ID`,
  `BASE_FEDERATION_*_ADDRESS`, `BASE_REWARD_PRIVATE_KEY`,
  `FEDERATION_INTERNAL_TOKEN`, `FEATURE_STORE_REGION_PREFIX`.
- `workers/api/src/handlers/federation/{rounds,features,rewards}.ts`:
  10 routes — round CRUD (admin), node-signed `submit-update` (bearer
  = `FEDERATION_INTERNAL_TOKEN`), aggregate + on-chain commit (admin),
  feature lookup / definition, reward distribute (KYC-gated),
  contributions read, KYC whitelist add. Vector payloads stored in R2
  under `federation/rounds/<id>/updates/<participant>.f64`.

**Tests / build**
- **546 tests passing** across all suites:
  - Root workspace (31 test files): **393 tests**
  - `apps/dashboard`: **34 tests** (34/34 — all passing incl. Onboarding,
    InvestorDashboard, DeveloperPortal)
  - `packages/ui`: **41 tests**
  - `packages/federation`: **31 tests** (incl. 1-test integration suite)
  - `packages/onchain-federation`: **15 tests**
  - `packages/node-agent`: **19 tests**
  - `packages/feature-store`: **13 tests**
- Integration test (`packages/federation/src/integration.test.ts`): 3-node
  consortium FedAvg with Bonawitz masking, verifies masked aggregate equals
  plaintext FedAvg to ~1e-9, scores TMC-Shapley, splits a 1 ETH pool, and
  asserts `StubRewardDistributor` recorded the right calls.
- `pnpm -r typecheck` green across all 21 packages. Fixes included:
  - `Button`: add `target`/`rel` props; cast anchor spread via `as any`.
  - `Card`: `Omit<HTMLAttributes, "title">` to avoid `ReactNode` vs `string` conflict.
  - `ModelQueue`: explicit `QueueStatus` union incl. `"violation"`.
  - Dashboard `tsconfig.json`: added `"vite/client"` types + `"@gefi/ui/*"` path alias.
  - Dashboard `vite.config.ts`: anchored-regex aliases (no prefix collisions);
    `.js`-stripping wildcard so Vite resolves `@gefi/ui/Button.js` → `Button.tsx`.
  - All dashboard source files: relative `../../../../packages/ui/src/` imports
    converted to `@gefi/ui/` workspace-alias imports.
- `pnpm --filter @gefi/worker-api run build` (wrangler dry-run) green.

**Docs**
- `infrastructure/cloudflare/FEDERATION-SETUP.md` — operator runbook
  (env vars, migrations, deploy, round lifecycle, node-agent, feature
  store, KYC, test surface, failure modes, sandbox limitations).

What's NOT here yet:
- Persona dashboards on `app.gefi.io` → **Task #7**.

## How to preview locally

```bash
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 5000 --livereload
```

Or just hit "Run" — the configured workflow does the same thing.
