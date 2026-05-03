# DNS setup for Cloudflare Pages on `gefi.io`

This site is built and deployed by the **Cloudflare Pages GitHub App**
to the `gefi` Pages project, served from the apex custom domain `gefi.io`
and from `www.gefi.io`.

The `gefi.io` zone is on Cloudflare nameservers
(`carter.ns.cloudflare.com` + `joan.ns.cloudflare.com`), so all DNS
lives in the same Cloudflare account as the Pages project — no
third-party DNS provider in the loop.

## 1. DNS records (managed by Cloudflare automatically)

When you add a custom domain to a Pages project on a zone in the same
Cloudflare account, Cloudflare creates the records for you. Verify in
dash → **DNS → Records**:

| Type   | Name | Value             | Proxied | Notes                                            |
|--------|------|-------------------|---------|--------------------------------------------------|
| CNAME  | @    | `gefi.pages.dev`  | Yes     | CNAME-flattened to apex (Cloudflare-only feature)|
| CNAME  | www  | `gefi.pages.dev`  | Yes     | Standard CNAME                                   |

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
| Build command          | `bundle install && bundle exec jekyll build && bundle exec htmlproofer ./_site --disable-external --allow-hash-href` |
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
dig +short gefi.io                # NOT 185.199.x.153
dig +short www.gefi.io            # gefi.pages.dev (or a Cloudflare anycast IP)
curl -I https://gefi.io           # 200, server: cloudflare
curl -I https://www.gefi.io       # 200 or 301 to apex
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

- Cloudflare Pages GitHub App lost authorisation for the repo. Go to
  github.com → Settings → Applications → **Cloudflare Pages** →
  re-grant access to `AxalNetwork/gefi`.
