# GeFi.io — marketing & content site

This repository is the **public marketing and content site** for GeFi
(`https://gefi.io`). It is a static [Jekyll](https://jekyllrb.com/) site,
built and deployed by **Cloudflare Pages** on the apex custom domain
`gefi.io`.

It is **not** the GeFi platform itself. The platform (APIs, dashboards,
inference, federated training, audit log, compliance routing) lives on
Cloudflare and is implemented across separate subdomains:

| Surface             | Where it lives                                | Repo / Task                                  |
|---------------------|-----------------------------------------------|----------------------------------------------|
| Marketing site      | Cloudflare Pages, `https://gefi.io`           | **This repo (Task #1).**                     |
| API                 | Cloudflare Workers, `https://api.gefi.io`     | Task #2 — Cloudflare backend foundation.     |
| App / dashboard     | Cloudflare Pages, `https://app.gefi.io`       | Tasks #3, #7 — auth & dashboards.            |
| Trust portal        | Cloudflare Pages, `https://trust.gefi.io`     | Task #4 — compliance.                        |
| Docs                | Jekyll, `https://docs.gefi.io`                | Task #1 follow-up.                           |
| Status page         | External SaaS, `https://status.gefi.io`       | Task #8 — production hardening.              |

The previous monolithic React + Express + Drizzle prototype that used to
live in this repo has been moved to [`legacy/`](./legacy/README.md) for
reference while the new platform is built.

## Project layout

```
.
├── _config.yml              # Jekyll site config
├── Gemfile                  # Ruby gem dependencies
├── .ruby-version            # Pins Ruby 3.2.2 for Cloudflare Pages
├── 404.html                 # Custom 404
├── robots.txt               # Crawler directives + sitemap pointer
├── package.json             # Wrangler-CLI fallback: `npm run deploy`
├── wrangler.jsonc           # Pages config for the wrangler-CLI fallback
│
├── index.html               # Home page
├── features.md              # /features/
├── pricing.md               # /pricing/
├── models.md                # /models/  (catalogue index, lists _models)
├── research.md              # /research/ (lists _research)
├── docs.md                  # /docs/    (developer entry point)
├── blog.md                  # /blog/    (lists _posts)
├── about.md                 # /about/
├── compliance.md            # /compliance/  (trust portal)
├── contact.md               # /contact/
├── legal/
│   ├── privacy.md           # /legal/privacy/
│   └── terms.md             # /legal/terms/
│
├── _layouts/                # default, page, post, model, pricing
├── _includes/               # head, header, footer, hero, feature-grid,
│                            # pricing-table, model-card, research-card,
│                            # blog-list, cta, newsletter, seo, config-script
├── assets/
│   ├── css/main.css         # Hand-rolled CSS — no Tailwind, no SCSS
│   ├── js/forms.js          # Tiny vanilla JS for nav + form submissions
│   └── img/                 # logo.svg, favicon.svg, OG images
│
├── _models/                 # Marketplace catalogue (collection)
├── _research/               # Research notes (collection)
├── _posts/                  # Blog posts
│
├── docs/
│   └── dns-setup.md         # DNS + Pages setup instructions
│
├── infrastructure/
│   └── cloudflare/          # Cloudflare backend monorepo (Task #2):
│                            # gefi-web, gefi-api, gefi-compliance Workers
│                            # plus shared-headers / shared-router / shared-types
│
└── legacy/                  # Archived React/Express prototype (reference)
```

The Cloudflare backend lives under [`infrastructure/cloudflare/`](./infrastructure/cloudflare/README.md)
as a self-contained pnpm + Turborepo workspace — separate `package.json`,
`pnpm-lock.yaml`, and `tsconfig.base.json` so the Jekyll site at the repo
root never sees Node tooling. See that README for deploy instructions, DNS
records, and Cloudflare bindings (D1, R2, KV, Vectorize).

## Local development

You need Ruby 3.x and Bundler installed.

```bash
bundle install
bundle exec jekyll serve --livereload
```

Open `http://localhost:4000`.

### On Replit

A "Start application" workflow is configured to run `bundle install` +
`bundle exec jekyll serve` on port 5000. Open the preview pane after the
workflow signals "Server running".

> Replit is a developer convenience only. Production serving is
> Cloudflare Pages — see below.

## Deployment

Production lives on **Cloudflare Pages** (project name `gefi`,
subdomain `gefi-1ns.pages.dev`, custom domains `gefi.io` + `www.gefi.io`).

**Default path: Direct Upload via wrangler.** Build locally and push:

```bash
bundle install && bundle exec jekyll build
npm install --no-save wrangler@4   # one-time, if not already
CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… npm run deploy
```

`npm run deploy` runs `wrangler pages deploy _site --project-name=gefi
--branch=main`. The token needs `Account → Cloudflare Pages: Edit`,
`Account → Account Settings: Read`, and (for first-time DNS work)
`Zone → DNS: Edit` on the `gefi.io` zone.

**Optional: Git auto-deploy.** dash.cloudflare.com → Workers & Pages →
`gefi` → Settings → Builds & deployments → "Connect to Git" → authorise
the Cloudflare Pages GitHub App on `AxalNetwork/gefi`. Build command:
`bundle install && bundle exec jekyll build`. Output dir: `_site`. Env
vars: `RUBY_VERSION=3.2.2`, `JEKYLL_ENV=production`,
`BUNDLE_WITHOUT=development:test`. Once connected, every push to `main`
builds + deploys, and PRs get their own `*.pages.dev` preview URL.

`bundle exec htmlproofer ./_site --disable-external --allow-hash-href`
is the recommended pre-deploy link/image audit but is not run by the
default deploy script — invoke it manually before `npm run deploy` if
you want a build-time check.

For the DNS + Pages configuration reference, see
[`docs/dns-setup.md`](./docs/dns-setup.md).

## Adding content

### A blog post

Add `_posts/YYYY-MM-DD-slug.md`:

```yaml
---
title: "My new post"
date: 2026-05-15
author: Your Name
lead: One-line teaser shown in lists and SEO.
---

Markdown body…
```

### A model

Add `_models/<slug>.md` and it'll appear at `/models/<slug>/`. See an
existing entry like [`_models/sentiment-from-filings.md`](./_models/sentiment-from-filings.md)
for the front-matter shape (category, risk, maturity, federated, price,
jurisdictions, metrics, lead).

Set `featured: true` to surface it on the home page's "Featured models"
section.

### A research note

Add `_research/<slug>.md` and it'll appear at `/research/<slug>/`. See
[`_research/audit-log-design.md`](./_research/audit-log-design.md) for
the front-matter shape.

## Forms

The newsletter and contact forms POST JSON to the endpoints configured
under `api:` in `_config.yml`:

```yaml
api:
  newsletter_endpoint: "https://api.gefi.io/v1/newsletter/subscribe"
  contact_endpoint:    "https://api.gefi.io/v1/contact"
  demo_endpoint:       "https://api.gefi.io/v1/demo"
```

Until those Cloudflare endpoints exist and DNS is live, submissions log
to the console and surface a friendly success message — no data is sent
anywhere. Once the backend (`infrastructure/cloudflare/`) is deployed and
`api.gefi.io` resolves, fill in the URLs in `_config.yml` and the Jekyll
site will start posting real submissions on the next Pages deploy.

## What's intentionally **not** here

- **No JavaScript framework.** No React, no Vue, no client-side router.
  The marketing site is HTML + a small slice of vanilla JS.
- **No Tailwind / SCSS.** One hand-rolled CSS file with CSS variables.
  Easier to audit, smaller payload, no build step beyond Jekyll itself.
- **No backend.** All backend functionality (auth, payments, inference,
  audit log, federation) lives on Cloudflare under `api.gefi.io`.
- **No Replit hosting in production.** Cloudflare Pages is canonical.

## License

To be confirmed before public launch. Treat the repository as
all-rights-reserved until then.
