# GeFi secret inventory

Canonical, single-source list of every Cloudflare Worker secret the GeFi
backend reads, with the exact `wrangler secret put` commands to provision
them. The TypeScript source of truth is
`infrastructure/cloudflare/packages/shared-types/src/env.ts`; this
document mirrors that file in operator-friendly form.

> **No secret values are committed anywhere in this repository.**
> Every credential is either typed as `env.X` (read from a Worker secret
> at runtime) or referenced via `${VAR}` shell interpolation in
> developer-only configs. The audit notes at the bottom of this file
> document the scan methodology.

---

## Where secrets live

| Surface | Mechanism | Files |
|---|---|---|
| Cloudflare Workers (`gefi-api`, `gefi-compliance`) | `wrangler secret put NAME --env <env>` | runtime only — never on disk |
| Local `wrangler dev` | `infrastructure/cloudflare/.dev.vars` (each Worker dir) | gitignored; copy from `.dev.vars.example` |
| GitHub Actions (`deploy-cloudflare.yml`) | Repo → Settings → Environments → `cloudflare-staging` / `cloudflare-prod` → Environment secrets | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` only |
| Foundry contract deploys | Operator shell env: `BASE_RPC_URL`, `BASE_SEPOLIA_RPC_URL`, `BASESCAN_API_KEY`, `DEPLOY_KEY` | never on disk; referenced via `${VAR}` in `infrastructure/contracts/foundry.toml` |
| Marketing site (Jekyll, Cloudflare Pages) | **none** — static HTML, no runtime secrets | n/a |
| Legacy React/Express prototype (`legacy/`) | `process.env.X` | not deployed; archived |

`gefi-web` has zero secrets — it only reads public `vars` from
`wrangler.jsonc`.

---

## Required vs optional, by Worker

The codebase fails closed in `prod` when a required secret is missing.
In `dev` / `staging` the resolver substitutes a deterministic stub.

### `gefi-api` — required in prod

| Secret | Purpose | Required envs |
|---|---|---|
| `INTERNAL_SIGNING_KEY` | HS256 signing for the edge → regional JWT. **Must be the same value across `prod`, `eu`, and `us`.** | prod, eu, us, staging |
| `AUTH0_M2M_CLIENT_ID` | Auth0 Management API client id (writes `app_metadata.gefi`) | staging, prod, eu, us |
| `AUTH0_M2M_CLIENT_SECRET` | Paired secret for the M2M client | staging, prod, eu, us |
| `STRIPE_SECRET_KEY` | Stripe REST API key for subscriptions + Connect | staging, prod |
| `STRIPE_WEBHOOK_SECRET` | Verifies `Stripe-Signature` on `/v1/billing/webhook` | staging, prod |
| `STRIPE_PRICE_STARTER` | Price id for the Starter tier | staging, prod |
| `STRIPE_PRICE_PRO` | Price id for the Pro tier | staging, prod |
| `STRIPE_PRICE_ENTERPRISE` | Price id for the Enterprise tier | staging, prod |
| `OPENSANCTIONS_API_KEY` | OFAC/EU/UK sanctions screening | staging, prod, eu, us |
| `SUMSUB_APP_TOKEN` + `SUMSUB_SECRET_KEY` | KYB for institutional / data_provider tenants. `SUMSUB_SECRET_KEY` doubles as the webhook HMAC. | prod, eu, us *(at minimum one KYC provider per region)* |
| `COMPLIANCE_INTERNAL_TOKEN` | Verified by `gefi-compliance` on every Service-binding call | prod, eu, us, staging |

### `gefi-api` — optional in prod

Set these to switch the corresponding subsystem from stub to live.

| Secret | Subsystem |
|---|---|
| `STRIPE_PUBLISHABLE_KEY` | Frontend Stripe.js (only used if you ever embed Elements; safe to omit) |
| `STRIPE_CONNECT_CLIENT_ID` | Stripe Connect (developer payouts) |
| `STRIPE_TAX_ENABLED` | "true"/"false" — toggles Stripe Tax line items |
| `STRIPE_RETURN_URL` | Override for the post-Checkout redirect |
| `ONFIDO_API_TOKEN` + `ONFIDO_WEBHOOK_SECRET` | Individual KYC (preferred for retail/professional) |
| `PERSONA_API_KEY` + `PERSONA_WEBHOOK_SECRET` | Alt KYC provider (Persona) |
| `MIDDESK_API_KEY` | Alt business-verification (Middesk) |
| `RESEND_API_KEY` + `RESEND_FROM_ADDRESS` | Transactional email (dunning + receipts) |
| `OPENAI_API_KEY_US` / `OPENAI_API_KEY_EU` | Model gateway → OpenAI per region |
| `ANTHROPIC_API_KEY_US` / `ANTHROPIC_API_KEY_EU` | Model gateway → Anthropic per region |
| `TOGETHER_API_KEY` | Together.ai fallback |
| `TYPESENSE_HOST` + `TYPESENSE_API_KEY` + `TYPESENSE_COLLECTION` | Search index host (else LocalIndex) |
| `POLYGON_RPC_URL` + `POLYGON_ANCHOR_ADDRESS` + `POLYGON_ANCHOR_PRIVATE_KEY` | Daily Merkle root anchoring |
| `BASE_RPC_URL` + `BASE_CHAIN_ID` + `BASE_REWARD_PRIVATE_KEY` + `BASE_FEDERATION_*_ADDRESS` (4) | On-chain federation contracts on Base. **`BASE_REWARD_PRIVATE_KEY` is the operator key that signs payouts — generate via a hardware-backed signer if possible.** |
| `FEDERATION_INTERNAL_TOKEN` | Bearer the node-agent presents on `POST /v1/federation/rounds/:id/updates` |
| `FEATURE_STORE_REGION_PREFIX` | Override KV key prefix for the regional feature cache |
| `FEATURE_STORE_STUB_FIXTURES` | JSON map of fake feature lookups (dev/test only) |

### `gefi-compliance` — required in prod

| Secret | Purpose | Required envs |
|---|---|---|
| `INTERNAL_SIGNING_KEY` | Verifies edge-signed JWT (shares value with gefi-api) | prod, staging |
| `COMPLIANCE_INTERNAL_TOKEN` | Verified on every Service-binding call from gefi-api | prod, staging |

### `gefi-compliance` — optional

| Secret | Subsystem |
|---|---|
| `MAILCHANNELS_DKIM_DOMAIN` + `MAILCHANNELS_DKIM_SELECTOR` + `MAILCHANNELS_DKIM_PRIVATE_KEY` + `MAILCHANNELS_FROM_ADDRESS` | DKIM-signed lawyer-routing emails |
| `POLYGON_RPC_URL` + `POLYGON_ANCHOR_ADDRESS` + `POLYGON_ANCHOR_PRIVATE_KEY` | Audit-log Merkle anchoring |
| `DOCUSIGN_BASE_URL` + `DOCUSIGN_INTEGRATION_KEY` + `DOCUSIGN_USER_ID` + `DOCUSIGN_RSA_PRIVATE_KEY` + `DOCUSIGN_ACCOUNT_ID` | Lawyer / auditor sign-off envelopes |

### `gefi-web` — required

None. `gefi-web` is a header-injecting proxy in front of Cloudflare
Pages; it reads only public `vars` from `wrangler.jsonc`.

---

## `wrangler secret put` commands

Run each block from `infrastructure/cloudflare/`. You'll be prompted for
the value — paste it and press Enter. To pipe a value non-interactively:
`echo "$VAL" | pnpm --filter @gefi/worker-api exec wrangler secret put NAME --env <env>`.

### One-time bootstrap (do these first)

```bash
# Same value across all three gefi-api environments + gefi-compliance.
KEY=$(openssl rand -base64 48)
echo "$KEY" | pnpm --filter @gefi/worker-api        exec wrangler secret put INTERNAL_SIGNING_KEY --env staging
echo "$KEY" | pnpm --filter @gefi/worker-api        exec wrangler secret put INTERNAL_SIGNING_KEY --env prod
echo "$KEY" | pnpm --filter @gefi/worker-api        exec wrangler secret put INTERNAL_SIGNING_KEY --env eu
echo "$KEY" | pnpm --filter @gefi/worker-api        exec wrangler secret put INTERNAL_SIGNING_KEY --env us
echo "$KEY" | pnpm --filter @gefi/worker-compliance exec wrangler secret put INTERNAL_SIGNING_KEY --env staging
echo "$KEY" | pnpm --filter @gefi/worker-compliance exec wrangler secret put INTERNAL_SIGNING_KEY --env prod
unset KEY

# Different value, same shape — verifies every Service-binding hop.
TOK=$(openssl rand -base64 48)
echo "$TOK" | pnpm --filter @gefi/worker-api        exec wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env staging
echo "$TOK" | pnpm --filter @gefi/worker-api        exec wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env prod
echo "$TOK" | pnpm --filter @gefi/worker-api        exec wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env eu
echo "$TOK" | pnpm --filter @gefi/worker-api        exec wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env us
echo "$TOK" | pnpm --filter @gefi/worker-compliance exec wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env staging
echo "$TOK" | pnpm --filter @gefi/worker-compliance exec wrangler secret put COMPLIANCE_INTERNAL_TOKEN --env prod
unset TOK
```

### Auth0 — staging

```bash
pnpm --filter @gefi/worker-api exec wrangler secret put AUTH0_M2M_CLIENT_ID     --env staging
pnpm --filter @gefi/worker-api exec wrangler secret put AUTH0_M2M_CLIENT_SECRET --env staging
```

### Auth0 — prod (edge + both regional siblings)

```bash
for E in prod eu us; do
  pnpm --filter @gefi/worker-api exec wrangler secret put AUTH0_M2M_CLIENT_ID     --env "$E"
  pnpm --filter @gefi/worker-api exec wrangler secret put AUTH0_M2M_CLIENT_SECRET --env "$E"
done
```

### Stripe — staging (test-mode keys)

```bash
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_SECRET_KEY        --env staging
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_WEBHOOK_SECRET    --env staging
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_PRICE_STARTER     --env staging
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_PRICE_PRO         --env staging
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_PRICE_ENTERPRISE  --env staging
# Optional:
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_CONNECT_CLIENT_ID --env staging
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_RETURN_URL        --env staging
```

### Stripe — prod (live keys)

```bash
# Stripe lives on the public edge only — regional siblings forward billing
# back to the edge so they don't need their own Stripe keys.
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_SECRET_KEY        --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_WEBHOOK_SECRET    --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_PRICE_STARTER     --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_PRICE_PRO         --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_PRICE_ENTERPRISE  --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_CONNECT_CLIENT_ID --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_RETURN_URL        --env prod
```

### KYC + sanctions — staging + each prod region

```bash
for E in staging prod eu us; do
  # Sumsub is required for institutional / data_provider tenants.
  pnpm --filter @gefi/worker-api exec wrangler secret put SUMSUB_APP_TOKEN     --env "$E"
  pnpm --filter @gefi/worker-api exec wrangler secret put SUMSUB_SECRET_KEY    --env "$E"

  # Onfido is preferred for retail / professional individuals.
  pnpm --filter @gefi/worker-api exec wrangler secret put ONFIDO_API_TOKEN     --env "$E"
  pnpm --filter @gefi/worker-api exec wrangler secret put ONFIDO_WEBHOOK_SECRET --env "$E"

  # Sanctions screening (OFAC / EU / UK / PEPs).
  pnpm --filter @gefi/worker-api exec wrangler secret put OPENSANCTIONS_API_KEY --env "$E"
done
```

### Resend (transactional email)

```bash
for E in staging prod; do
  pnpm --filter @gefi/worker-api exec wrangler secret put RESEND_API_KEY      --env "$E"
  pnpm --filter @gefi/worker-api exec wrangler secret put RESEND_FROM_ADDRESS --env "$E"
done
```

### AI providers (optional, per-region split)

```bash
# Edge gets US keys; explicit regional siblings get region-pinned keys
# so an EU-tenant request never hits a US AI endpoint.
pnpm --filter @gefi/worker-api exec wrangler secret put OPENAI_API_KEY_US     --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put OPENAI_API_KEY_EU     --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put ANTHROPIC_API_KEY_US  --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put ANTHROPIC_API_KEY_EU  --env prod
pnpm --filter @gefi/worker-api exec wrangler secret put TOGETHER_API_KEY      --env prod

pnpm --filter @gefi/worker-api exec wrangler secret put OPENAI_API_KEY_EU     --env eu
pnpm --filter @gefi/worker-api exec wrangler secret put ANTHROPIC_API_KEY_EU  --env eu

pnpm --filter @gefi/worker-api exec wrangler secret put OPENAI_API_KEY_US     --env us
pnpm --filter @gefi/worker-api exec wrangler secret put ANTHROPIC_API_KEY_US  --env us
```

### On-chain (Base L2) federation contracts

```bash
for E in prod eu us; do
  pnpm --filter @gefi/worker-api exec wrangler secret put BASE_RPC_URL                        --env "$E"
  pnpm --filter @gefi/worker-api exec wrangler secret put BASE_CHAIN_ID                       --env "$E"   # 8453 mainnet
  pnpm --filter @gefi/worker-api exec wrangler secret put BASE_FEDERATION_REGISTRY_ADDRESS    --env "$E"
  pnpm --filter @gefi/worker-api exec wrangler secret put BASE_FEDERATION_LEDGER_ADDRESS      --env "$E"
  pnpm --filter @gefi/worker-api exec wrangler secret put BASE_FEDERATION_REWARDS_ADDRESS    --env "$E"
  pnpm --filter @gefi/worker-api exec wrangler secret put BASE_FEDERATION_KYC_ADDRESS        --env "$E"
  # Operator signing key — generate via hardware signer or KMS, never paste from a clipboard manager.
  pnpm --filter @gefi/worker-api exec wrangler secret put BASE_REWARD_PRIVATE_KEY            --env "$E"
done
```

### Federation node-agent token

```bash
TOK=$(openssl rand -base64 48)
for E in staging prod eu us; do
  echo "$TOK" | pnpm --filter @gefi/worker-api exec wrangler secret put FEDERATION_INTERNAL_TOKEN --env "$E"
done
unset TOK
```

### Compliance Worker — optional integrations

```bash
# Polygon anchoring (audit-log Merkle root commits).
for E in staging prod; do
  pnpm --filter @gefi/worker-compliance exec wrangler secret put POLYGON_RPC_URL              --env "$E"
  pnpm --filter @gefi/worker-compliance exec wrangler secret put POLYGON_ANCHOR_ADDRESS       --env "$E"
  pnpm --filter @gefi/worker-compliance exec wrangler secret put POLYGON_ANCHOR_PRIVATE_KEY   --env "$E"
done

# MailChannels DKIM for compliance / lawyer-routing emails.
for E in staging prod; do
  pnpm --filter @gefi/worker-compliance exec wrangler secret put MAILCHANNELS_DKIM_DOMAIN     --env "$E"
  pnpm --filter @gefi/worker-compliance exec wrangler secret put MAILCHANNELS_DKIM_SELECTOR   --env "$E"
  pnpm --filter @gefi/worker-compliance exec wrangler secret put MAILCHANNELS_DKIM_PRIVATE_KEY --env "$E"
  pnpm --filter @gefi/worker-compliance exec wrangler secret put MAILCHANNELS_FROM_ADDRESS    --env "$E"
done

# DocuSign for lawyer / auditor sign-off envelopes.
for E in staging prod; do
  pnpm --filter @gefi/worker-compliance exec wrangler secret put DOCUSIGN_BASE_URL            --env "$E"
  pnpm --filter @gefi/worker-compliance exec wrangler secret put DOCUSIGN_INTEGRATION_KEY     --env "$E"
  pnpm --filter @gefi/worker-compliance exec wrangler secret put DOCUSIGN_USER_ID             --env "$E"
  pnpm --filter @gefi/worker-compliance exec wrangler secret put DOCUSIGN_RSA_PRIVATE_KEY     --env "$E"
  pnpm --filter @gefi/worker-compliance exec wrangler secret put DOCUSIGN_ACCOUNT_ID          --env "$E"
done
```

### GitHub Actions secrets (the deploy pipeline)

These are **GitHub Environment secrets**, not Worker secrets. Set them in
the GitHub repo:

> Settings → Environments → `cloudflare-staging` → Add secret
> Settings → Environments → `cloudflare-prod`    → Add secret

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with **Workers Scripts:Edit**, **Workers KV Storage:Edit**, **Workers R2 Storage:Edit**, **D1:Edit**, **Workers AI:Read**, **Account Settings:Read** |
| `CLOUDFLARE_ACCOUNT_ID` | The Cloudflare account ID (visible in any zone's right rail) |

The token in `cloudflare-prod` should be a **separate** token from
`cloudflare-staging` so a leaked staging token can't deploy to prod.

### Foundry deploys (operator's local shell, not committed)

```bash
export BASE_RPC_URL='https://mainnet.base.org'                 # or your private RPC
export BASE_SEPOLIA_RPC_URL='https://sepolia.base.org'
export BASESCAN_API_KEY='…'
export DEPLOY_KEY='0x…'                                        # short-lived deploy key
forge script script/Deploy.s.sol --rpc-url "$BASE_RPC_URL" --private-key "$DEPLOY_KEY" --broadcast --verify
```

`infrastructure/contracts/foundry.toml` references these via `${VAR}`
interpolation — no values are stored in the repo.

---

## Listing / rotating / removing secrets

```bash
# List the secret names currently set on a Worker (values aren't shown).
pnpm --filter @gefi/worker-api exec wrangler secret list --env prod

# Rotate by overwriting (keep the binding, change the value).
echo "$NEW_VALUE" | pnpm --filter @gefi/worker-api exec wrangler secret put STRIPE_SECRET_KEY --env prod

# Delete a secret entirely.
pnpm --filter @gefi/worker-api exec wrangler secret delete STRIPE_SECRET_KEY --env prod
```

After rotation, re-deploy is **not** required — Cloudflare propagates new
secret values to running Worker instances within seconds.

---

## Audit results (May 2026)

Methodology — exhaustive ripgrep sweep across every committed file
(excluding `_site/`, `vendor/`, `node_modules/`, and `*.lock`) for:

- Vendor token formats: `sk_live_*`, `sk_test_*`, `pk_live_*`, `whsec_*`,
  `ghp_*`, `github_pat_*`, `gho_*`, `AKIA*`, `AIza*`, `xox[baprs]-*`,
  `sk-*` (OpenAI), `sk-ant-*` (Anthropic), three-segment JWTs,
  `-----BEGIN PRIVATE KEY-----`.
- Generic patterns: `(api_key|secret|token|password|webhook_secret|client_secret|private_key|access_key|auth_token|bearer)`
  across `.yml`, `.toml`, `.json`, `.js`, `.ts`, `.md`, `.html`, `.rb`.
- Assignment-style hardcoded values: `(api_key|secret|token|...)\s*[:=]\s*"…"`.
- Runtime leaks: `console.log(env|secret|token|…)` and
  `JSON.stringify(env|…)` across worker source.

**Result: zero exposed secrets.** Findings broken down:

| Location | Hits | Verdict |
|---|---|---|
| `infrastructure/cloudflare/workers/**/*.ts`, `packages/**/*.ts` (production code) | All env reads via `env.X` (typed `ApiEnv` / `ComplianceEnv`) | ✅ correct |
| `infrastructure/cloudflare/workers/api/src/integration.test.ts` | `sk_test_dummy`, `whsec_integration_test`, `whsec_cs`, `whsec_coerce`, `whsec_activate`, `whsec_dup`, `whsec_real`, `whsec_account_updated` | ✅ test fixtures — never real values, no rotation needed |
| `infrastructure/cloudflare/packages/billing/src/billing.test.ts` | `sk_test_dummy`, `whsec_test_value` | ✅ test fixtures |
| `infrastructure/cloudflare/.dev.vars.example` | `INTERNAL_SIGNING_KEY="dev-only-key-please-change-me-32+chars-locally"` | ✅ explicitly-marked placeholder; real `.dev.vars` is gitignored |
| `infrastructure/contracts/foundry.toml` | `${BASE_RPC_URL}`, `${BASE_SEPOLIA_RPC_URL}`, `${BASESCAN_API_KEY}` | ✅ shell env interpolation — no values stored |
| `.github/workflows/deploy-cloudflare.yml` | `${{ secrets.CLOUDFLARE_API_TOKEN }}`, `${{ secrets.CLOUDFLARE_ACCOUNT_ID }}` | ✅ GitHub Environment secrets — no values committed |
| `_config.yml` (Jekyll site config) | `"1 API key"`, `"10 API keys"` (marketing copy on the pricing page) | ✅ false positive — these are plan-feature strings, not credentials |
| `_includes/config-script.html` (window.GEFI_CONFIG) | `apiBaseUrl`, three endpoint URLs | ✅ public values only |
| `assets/js/onboarding.js` | Reads access token from `sessionStorage["gefi:auth:access_token"]` (set by Auth0 SDK at login) | ✅ no hardcoded value |
| `assets/js/role-gate.js` | `"api_key"` appears as an Auth0 RBAC permission/resource string | ✅ false positive — RBAC vocabulary, not a credential |
| `legacy/server/**/*.ts` (archived Express prototype, not deployed) | All credential reads via `process.env.X`; no hardcoded fallback values | ✅ correct, and the directory is excluded from the Jekyll build (`_config.yml` `exclude: [legacy/, infrastructure/, …]`) and not deployed anywhere |
| `legacy/package-lock.json` | npm package `integrity` hashes that look like `sha512-…` | ✅ false positive — these are subresource integrity hashes, not secrets |
| `legacy/server/web3Service.ts:251` | `0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063` | ✅ public DAI contract address on Ethereum mainnet, not a secret |

**Frontend exposure: clean.** No API keys, no tokens, no JWTs, no
webhook secrets are emitted into any `_site/` HTML, JS, or JSON. The only
runtime credential the browser ever holds is the user's Auth0 access
token, which is set by the Auth0 hosted login redirect and stored in
`sessionStorage` — not in source.

**Logs: clean.** Worker code never `console.log`s `env`, `env.X` for any
secret-typed binding, or `JSON.stringify(env)`.

**No rotation required at this time.** Re-run this audit:

```bash
# From repo root.
rg -nP -i \
  -e 'sk_(live|test)_[A-Za-z0-9]{20,}' -e 'whsec_[A-Za-z0-9]{20,}' \
  -e 'ghp_[A-Za-z0-9]{36}' -e 'AKIA[0-9A-Z]{16}' -e 'AIza[A-Za-z0-9_-]{35}' \
  -e 'sk-[A-Za-z0-9]{40,}' -e 'sk-ant-[A-Za-z0-9_-]{20,}' \
  -e '-----BEGIN.*PRIVATE KEY' \
  --glob '!*.lock' --glob '!_site' --glob '!vendor' --glob '!node_modules'
```

Schedule: re-run before every prod deploy and as part of any SOC 2 /
ISO 27001 evidence-gathering cycle.
