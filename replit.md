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
  no network call, no false error states. When Task #2 (the Cloudflare backend)
  ships, fill in the URLs and redeploy. No code changes needed.
- **`app.enabled`**: when `false`, every "Sign in" / "Get started" / "Subscribe"
  CTA across `_includes/header.html`, `_includes/cta.html`,
  `_includes/pricing-table.html`, and `_layouts/model.html` routes to
  `app.fallback_url` instead of `app.signin_url` / `app.signup_url`. Flip to
  `true` once Task #7 (the dashboards on `app.gefi.io`) is live.

Both flags exist so the marketing site can ship to the apex domain BEFORE the
backend / dashboards exist, without any dead links or console errors.

## Working on this repo

- **Never** add `package.json` or run `npm install` at the root. Node was
  intentionally removed from this surface.
- **Never** install Tailwind, SCSS, or any JS bundler at the root. Hand-write
  CSS in `assets/css/main.css`.
- **Never** add a Replit `[deployment]` block to `.replit`.
- **Never** un-commit `Gemfile.lock`. Deterministic builds are non-negotiable
  for the deploy CI.
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
| 2  | Cloudflare backend foundation (Workers + D1 + R2 + KV + Vectorize) | Pending        |
| 3  | Auth (Auth0 + JWT) + tenancy                                       | Pending        |
| 4  | Compliance routing + audit log + trust portal                      | Pending        |
| 5  | Marketplace + payments (Stripe + onchain)                          | Pending        |
| 6  | Federated learning network                                         | Pending        |
| 7  | App / dashboards (`app.gefi.io`)                                   | Pending        |
| 8  | Production hardening + status page + observability                 | Pending        |
| 9–17 | Playground 8-phase parallel track                                | Pending        |

If a future task contradicts the rules above, the rules above are wrong —
update this file in the same change.

## How to preview locally

```bash
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 5000 --livereload
```

Or just hit "Run" — the configured workflow does the same thing.
