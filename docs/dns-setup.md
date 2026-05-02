# DNS setup for GitHub Pages on `gefi.io`

This site is built and deployed by `.github/workflows/deploy-pages.yml` to
GitHub Pages and served from the apex custom domain `gefi.io` (see `CNAME`).

You need to do two things in your DNS provider (Cloudflare, Route53, etc.) and
one thing in the GitHub repo settings.

## 1. DNS records

### Apex domain (`gefi.io`)

Add the four GitHub Pages `A` records, plus the four `AAAA` records for IPv6:

| Type | Name | Value           |
|------|------|-----------------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |
| AAAA | @    | 2606:50c0:8000::153 |
| AAAA | @    | 2606:50c0:8001::153 |
| AAAA | @    | 2606:50c0:8002::153 |
| AAAA | @    | 2606:50c0:8003::153 |

### `www` subdomain (recommended redirect)

Either add a `CNAME` for `www` pointing at `<your-org>.github.io`, or set up a
redirect rule in your DNS provider that 301s `www.gefi.io` → `https://gefi.io/`.

| Type  | Name | Value                    |
|-------|------|--------------------------|
| CNAME | www  | `<your-org>.github.io`   |

### Subdomains used by the platform (later phases)

These are placeholders for Task #2 (Cloudflare backend) and the future app
surface — do not point them anywhere yet, but reserve them in your DNS plan:

| Subdomain          | Eventual target          |
|--------------------|--------------------------|
| `api.gefi.io`      | Cloudflare Worker        |
| `eu.api.gefi.io`   | Cloudflare Worker (EU)   |
| `us.api.gefi.io`   | Cloudflare Worker (US)   |
| `app.gefi.io`      | App surface              |
| `docs.gefi.io`     | Public docs              |
| `status.gefi.io`   | Status page              |
| `trust.gefi.io`    | Trust portal             |

## 2. GitHub repo settings

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Under **Custom domain**, enter `gefi.io` and click **Save**.
4. Tick **Enforce HTTPS** once the certificate is issued (can take a few
   minutes after DNS propagates).

GitHub will check your `CNAME` file matches the configured custom domain.

## 3. Verify

After DNS propagates (usually under 15 minutes):

```bash
dig +short gefi.io
curl -I https://gefi.io
```

You should see the GitHub Pages IPs above and a `200 OK` from `https://gefi.io`.

## Cloudflare-specific notes

If you use Cloudflare DNS:

- Set the `A` / `AAAA` records to **DNS only** (grey cloud) for the apex
  while you verify GitHub Pages issues the TLS certificate. After it's issued
  you can switch to **Proxied** (orange cloud) if you want Cloudflare's CDN
  in front of GitHub Pages.
- If you turn on the orange cloud, set SSL/TLS mode to **Full** (not Flexible)
  to avoid redirect loops.
