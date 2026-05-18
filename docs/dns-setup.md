# DNS setup for Cloudflare Pages on `gefi.io`

This site is deployed to the Cloudflare Pages project named `gefi`
(subdomain `gefi-1ns.pages.dev`) and served from the apex custom domain
`gefi.io` and from `www.gefi.io`.

Two deploy paths exist:

1. **Cloudflare Pages GitHub App (default, in use today).** The Pages
   project is connected to `AxalNetwork/gefi`, production branch =
   `main`. Every push to `main` triggers a Cloudflare-side build and
   deploy; every PR gets its own `*.pages.dev` preview URL. No local
   command, no token in your shell. Build settings are in section 2.
2. **Direct Upload via wrangler (fallback).** `npm run deploy` runs
   `wrangler pages deploy _site --project-name=gefi --branch=main`. Use
   only for emergency out-of-band pushes (Pages GitHub App outage,
   hotfix from a non-`main` branch).

The `gefi.io` zone is on Cloudflare nameservers
(`carter.ns.cloudflare.com` + `joan.ns.cloudflare.com`), so all DNS
lives in the same Cloudflare account as the Pages project — no
third-party DNS provider in the loop.

## 1. DNS records (managed by Cloudflare automatically)

When you add a custom domain to a Pages project on a zone in the same
Cloudflare account, Cloudflare creates the records for you. Verify in
dash → **DNS → Records**:

| Type   | Name | Value                  | Proxied | Notes                                            |
|--------|------|------------------------|---------|--------------------------------------------------|
| CNAME  | @    | `gefi-1ns.pages.dev`   | Yes     | CNAME-flattened to apex (Cloudflare-only feature)|
| CNAME  | www  | `gefi-1ns.pages.dev`   | Yes     | Standard CNAME                                   |

> The Pages subdomain is **`gefi-1ns.pages.dev`** (not `gefi.pages.dev`
> — that name was already taken when the project was created). If you
> recreate the project under a different name, substitute
> `<project-subdomain>.pages.dev` here.

Keep them **proxied** (orange cloud) so Cloudflare's CDN + WAF sit in
front of the Pages origin.

### Records that must NOT be present (legacy GitHub Pages)

If any of the following still exist in the zone, **delete them** —
they fight the new Pages records and will keep the broken raw-Markdown
site live for some visitors:

| Type | Value                                                     |
|------|-----------------------------------------------------------|
| A    | 185.199.108.153 / 109.153 / 110.153 / 111.153             |
| AAAA | 2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153   |
| CNAME| `<org>.github.io` on `www`                                |

## 2. Cloudflare Pages project settings

Recorded here so an operator can re-create the project from scratch
without guessing:

| Field                  | Value |
|------------------------|-------|
| Project name           | `gefi` |
| Production branch      | `main` |
| Framework preset       | None |
| Build command (Git path) | `bundle install && bundle exec jekyll build` |
| Build output directory | `_site` |
| Root directory         | `/` |
| Env: `RUBY_VERSION`    | `3.2.2` |
| Env: `JEKYLL_ENV`      | `production` |
| Env: `BUNDLE_WITHOUT`  | `development:test` |
| Custom domains         | `gefi.io`, `www.gefi.io` |

The `Jekyll` framework preset is intentionally **not** used — it pins
Jekyll 3.x. Bundler resolves `~> 4.3` from `Gemfile.lock` to 4.4.1
when `Framework preset = None`.

## 3. Subdomains used by the platform (separate pipeline)

These are managed by `.github/workflows/deploy-cloudflare.yml`
(Workers + D1 + R2 + KV), **not** by the Pages project:

| Subdomain          | Eventual target          |
|--------------------|--------------------------|
| `api.gefi.io`      | Cloudflare Worker        |
| `eu.api.gefi.io`   | Cloudflare Worker (EU)   |
| `us.api.gefi.io`   | Cloudflare Worker (US)   |
| `app.gefi.io`      | App surface              |
| `docs.gefi.io`     | Public docs              |
| `status.gefi.io`   | Status page              |
| `trust.gefi.io`    | Trust portal             |

## 4. Verify

After DNS propagates (usually under 60 seconds when DNS is on the same
Cloudflare account):

```bash
dig +short gefi.io                # Cloudflare anycast IP (NOT 185.199.x.153)
dig +short www.gefi.io            # gefi-1ns.pages.dev (or a Cloudflare anycast IP)
curl -I https://gefi.io           # 200, server: cloudflare
curl -I https://www.gefi.io       # 200, server: cloudflare
```

The TLS cert is issued automatically by Cloudflare (Universal SSL),
not Let's Encrypt via GitHub.

## 5. Troubleshooting

### "Build failed" in dash → Pages → Deployments

- **Bundler version mismatch** — `Gemfile.lock` is pinned to Bundler
  2.4.10. Cloudflare auto-installs the matching version; if the build
  log shows `Bundler X is running, but your lockfile was generated
  with 2.4.10`, it will self-correct on the next line. Not a fatal
  error.
- **Wrong Ruby version** — confirm `RUBY_VERSION` env var is `3.2.2`
  exactly. Cloudflare's default is 3.4.x and Jekyll 4.4.1 needs 3.2.x
  (the post-merge log proves this is the working version).
- **`npx bundle ...` in the build command** — someone changed the
  Pages "Deploy command" to `npx wrangler deploy`. Wrangler 4.x's
  Workers auto-config rewrites scripts to prefix Ruby commands with
  `npx`, which fails because `bundle` is a Ruby gem, not an npm
  package. Restore the build command to the value in section 2.

### "Domain pending" in dash → Pages → Custom domains

- Wait up to 5 minutes for the CNAME-flattened record to settle. If it
  persists, delete and re-add the custom domain.

### "SSL pending"

- Cloudflare issues Universal SSL within 1-15 minutes once the custom
  domain is verified. If pending > 15 minutes, dash → SSL/TLS → Edge
  Certificates → toggle Universal SSL off then back on.

### Site still serves the raw-Markdown "wall of text"

- DNS still points at GitHub Pages. Run `dig +short gefi.io` — if you
  see any `185.199.10[8-9].153` or `185.199.11[0-1].153`, those A
  records are still in the zone. Delete them in dash → DNS → Records.
- Or your browser cached the old IP. Hard-refresh and re-curl from a
  shell.

### A push to `main` did NOT trigger a new build

- The Cloudflare Pages GitHub App lost authorisation for the repo. Go
  to github.com → Settings → Applications → **Cloudflare Pages** →
  re-grant access to `AxalNetwork/gefi`. Then dash → Workers & Pages →
  `gefi` → Settings → Builds & deployments → confirm the Git source
  still shows `AxalNetwork/gefi` (production branch = `main`).
- Verify the build wasn't skipped by a `[skip ci]` / `[skip-deploy]`
  marker in the commit message.
- As an out-of-band fallback while you fix the App, run `bundle exec
  jekyll build && npm run deploy` to push manually.

### `npm run deploy` fails with "Authentication error [code: 10000]"

- The `CLOUDFLARE_API_TOKEN` is missing the `Account → Cloudflare Pages
  → Edit` permission, or `CLOUDFLARE_ACCOUNT_ID` isn't set (wrangler
  falls back to `/memberships`, which most scoped tokens can't read).
  Set both env vars and ensure the token's permission set includes
  Pages:Edit + Account:Read.
