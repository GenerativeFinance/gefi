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

- **Production hosting:** GitHub Pages, custom domain `gefi.io`.
- **CI:** `.github/workflows/deploy-pages.yml` (Ruby 3.2 + Bundler + Jekyll 4.3).
- **Replit hosting:** **none.** The Replit workflow is a local-preview
  developer convenience only — it runs `bundle exec jekyll serve` on port 5000.
- **No Replit `[deployment]` in `.replit`.** Do not add one. Do not suggest
  "deploy via Replit". The user has explicitly excluded it.

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
| `.nojekyll`                   | Tells Pages we're using Actions, not classic build |
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
| `.github/workflows/deploy-pages.yml` | GitHub Actions Pages deploy                 |
| `docs/dns-setup.md`           | DNS + Pages one-time setup                         |
| `infrastructure/cloudflare/`  | Cloudflare backend monorepo (Task #2). pnpm + Turborepo. Three Workers (`gefi-web`, `gefi-api`, `gefi-compliance`) + shared packages. Self-contained — own `package.json`, `pnpm-lock.yaml`, `tsconfig.base.json`. **Never** hoist node_modules from here to the repo root. |
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
| 4  | Compliance routing + audit log + trust portal                      | Pending        |
| 5  | Marketplace + payments (Stripe + onchain)                          | Pending        |
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
  RBAC matrix (`rbac.ts`), subscription→KYC tier map (`kyc-tiers.ts`).
- `packages/integrations` — `KycProvider` + `SanctionsProvider`
  interfaces, with `StubKycProvider`, `OnfidoKycProvider`,
  `StubSanctionsProvider`, `OpenSanctionsProvider`. Factories fall
  back to stubs that fail-closed when secrets are missing.

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

- Compliance rule engine + Merkle audit anchoring → **Task #4**.
- Marketplace + Stripe + onchain billing → **Task #5**.
- Federated learning orchestrator → **Task #6**.
- Persona dashboards on `app.gefi.io` → **Task #7**.

## How to preview locally

```bash
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 5000 --livereload
```

Or just hit "Run" — the configured workflow does the same thing.
