# Auth0 setup runbook

Authentication for GeFi runs on **Auth0** with RS256 access tokens, a
custom-claim namespace (`https://gefi.io/`) and an Action that
synchronises tenant / jurisdiction / role claims into every token. The
backend is jurisdiction-aware: the EU and US data planes are separate
Workers and a token issued for one jurisdiction is rejected at the
other (`cross_region_denied`).

This runbook walks the operator (you) through configuring Auth0 the
first time. Everything described here is **one-off setup**; the GeFi
codebase is already wired against the contract documented below.

## 0. Prerequisites

* Two Auth0 tenants — one staging, one production (Auth0's
  recommended pattern).
* Cloudflare account with deploy access to the four Workers
  (`gefi-edge`, `gefi-api`, `gefi-compliance`, `gefi-web`).
* `wrangler` CLI, `pnpm`, and the `gefi.io` zone delegated to
  Cloudflare.

## 1. Create the API in Auth0

1. **Applications → APIs → Create API**.
2. Name: `GeFi API`.
3. Identifier (audience): `https://api.gefi.io`. **This is the value
   stored in `AUTH0_AUDIENCE` and must not change** — every issued
   token carries it as `aud`.
4. Signing algorithm: **RS256**.
5. Enable **RBAC** and **Add Permissions in the Access Token**.
6. Add the following permissions (these match the resources in
   `packages/auth/src/rbac.ts`):

   * `read:user`, `update:user`, `delete:user`
   * `read:tenant`, `update:tenant`
   * `create:api_key`, `list:api_key`, `delete:api_key`
   * `read:kyc_evidence`, `create:kyc_evidence`
   * `read:audit_log`
   * `read:model`, `create:model`, `update:model`, `delete:model`,
     `subscribe:model`
   * `read:subscription`, `create:subscription`,
     `update:subscription`, `delete:subscription`

   The RBAC matrix decides which persona gets which permission; this
   list is just the catalogue Auth0 needs.

## 2. Create the Single-Page Application

1. **Applications → Applications → Create Application** → Single Page
   App, named `GeFi Dashboard`.
2. Allowed Callback URLs:
   * Production: `https://app.gefi.io/auth/callback`
   * Staging: `https://staging.app.gefi.io/auth/callback`
   * Local dev: `http://localhost:5000/auth/callback`
3. Allowed Logout URLs: same hosts, root.
4. Allowed Web Origins: same hosts, root.
5. Refresh Token Rotation: **enabled**, absolute lifetime 30 days.
6. Note the `client_id`. The dashboards need it; the backend does not.

## 3. Create the Machine-to-Machine Application (token introspection)

1. **Applications → Applications → Create Application** → M2M, named
   `GeFi API M2M`.
2. Authorise it for the GeFi API created in step 1.
3. Grant the `read:users`, `read:user_idp_tokens`, `update:users`
   scopes (used by the back-office tools to update user_metadata when
   onboarding finishes).
4. Note the `client_id` and `client_secret`. The secret is stored as
   `AUTH0_M2M_CLIENT_SECRET` in `wrangler secret put`.

## 4. Database connection + MFA

1. Enable the **Username-Password-Authentication** database connection
   for both the SPA and M2M apps.
2. **Security → Multi-factor Auth** → enable **WebAuthn with security
   keys**, **WebAuthn with platform authenticators**, and **OTP**.
3. Under the GeFi API in step 1, set **Enforce MFA** to *adaptive*. We
   trigger MFA from the Action in step 5 based on `subscription_tier`.

## 5. The "GeFi tenant + RBAC" Action

In **Actions → Library → Create Action → Login / Post-Login**, paste
the script below. This is the single point of truth for what's in a
GeFi access token.

```javascript
// GeFi: hydrate custom claims + adaptive MFA.
//
// Reads tenant + jurisdiction + entity_type from
// `event.user.app_metadata.gefi` — the SAME shape the gefi-api
// Worker writes via the Management API after `/v1/auth/onboard`
// (see `packages/auth/src/management.ts > GefiAppMetadata`). The
// values are pushed into both the access token and ID token under
// the `https://gefi.io/` namespace, which is what
// `verifyAuth0Token` in `packages/auth/src/verify.ts` reads on the
// Worker side. Forces MFA on Pro/Enterprise tenants.
//
// CONTRACT: keep this read-path aligned with the WRITE-path in
// `Auth0Management.updateAppMetadata`. The two are versioned
// together — if you ever rename a key, change BOTH or refreshed
// tokens silently lose claims and protected endpoints start
// returning `auth_onboarding_incomplete`.
exports.onExecutePostLogin = async (event, api) => {
  const NS = "https://gefi.io/";
  const gefi = (event.user.app_metadata && event.user.app_metadata.gefi) || {};
  const claims = {
    tenant_id: gefi.tenant_id || null,
    jurisdiction: gefi.jurisdiction || null,   // "eu" | "us"
    entity_type: gefi.entity_type || null,     // retail | professional | institutional | data_provider
    subscription_tier: gefi.subscription_tier || "free",
    kyc_tier: gefi.kyc_tier || "none",
    roles: gefi.roles || ["member"],           // see RBAC matrix
  };
  for (const [k, v] of Object.entries(claims)) {
    api.accessToken.setCustomClaim(`${NS}${k}`, v);
    api.idToken.setCustomClaim(`${NS}${k}`, v);
  }
  // Adaptive MFA on Pro / Enterprise.
  if (claims.subscription_tier === "pro" || claims.subscription_tier === "enterprise") {
    api.multifactor.enable("any", { allowRememberBrowser: true });
  }
};
```

When `gefi` is absent (a brand-new user who hasn't completed
`/v1/auth/onboard` yet) all claims are `null` and the user lands on
the loose-auth onboarding endpoints only. Once onboarding writes
`app_metadata.gefi` and the user refreshes their token, this Action
populates the namespaced claims and protected endpoints (KYC, API
keys, models) start working. There is no D1 fall-back here — the
Action is purely a mirror of `app_metadata.gefi`, which is itself
written by the API directly from D1 at onboard time.

Drag this Action into the **Login** flow.

## 6. Wrangler env vars and secrets

For each `wrangler` env (`staging`, `prod`, `eu`, `us`):

```bash
# Vars (in wrangler.jsonc — already committed).
AUTH0_DOMAIN     = https://gefi-staging.eu.auth0.com/   # staging
AUTH0_DOMAIN     = https://gefi.eu.auth0.com/           # prod / eu / us
AUTH0_AUDIENCE   = https://staging-api.gefi.io          # staging
AUTH0_AUDIENCE   = https://api.gefi.io                  # prod / eu / us

# Secrets.
# AUTH0_M2M_CLIENT_ID is a *var*, not a secret (it's safe to log) but the
# secret half of the pair must be set per env.
wrangler secret put AUTH0_M2M_CLIENT_ID     --env staging   # paste M2M client id
wrangler secret put AUTH0_M2M_CLIENT_SECRET --env staging   # paste M2M secret
wrangler secret put AUTH0_M2M_CLIENT_ID     --env prod
wrangler secret put AUTH0_M2M_CLIENT_SECRET --env prod
wrangler secret put AUTH0_M2M_CLIENT_ID     --env eu
wrangler secret put AUTH0_M2M_CLIENT_SECRET --env eu
wrangler secret put AUTH0_M2M_CLIENT_ID     --env us
wrangler secret put AUTH0_M2M_CLIENT_SECRET --env us
```

The M2M application authorises the **Auth0 Management API** (audience
`https://{tenant}.auth0.com/api/v2/`) with the scopes
`read:users` and `update:users_app_metadata`. After
`/v1/auth/onboard` writes the new tenant to D1, the API uses these
credentials to PATCH the user's `app_metadata.gefi` so the post-login
Action (§5) can mirror those values onto the next access token. The
M2M token itself is cached in the `CACHE` KV namespace at
`auth0:m2m:{client_id}` for half its `expires_in` window.

If `AUTH0_M2M_CLIENT_ID` / `AUTH0_M2M_CLIENT_SECRET` are missing in
dev/staging, `/v1/auth/onboard` logs a warning and skips the
Management API write. The user's tenant still lives in D1 (source
of truth) but their Auth0 user has no `app_metadata.gefi`, so
post-login token claims will stay `null` and protected endpoints
will keep returning `auth_onboarding_incomplete` until the operator
either backfills `app_metadata.gefi` manually (Auth0 dashboard →
Users → User Details → Metadata) or wires the M2M secrets and
re-runs onboarding. In prod the warning is escalated to an error;
configure these secrets before opening signups.

The Worker code reads `AUTH0_DOMAIN` to fetch JWKS at
`${AUTH0_DOMAIN}.well-known/jwks.json` (KV-cached for an hour) and
`AUTH0_AUDIENCE` to verify the `aud` claim.

## 7. KYC and sanctions providers

KYC is provider-agnostic; the factory in `packages/integrations` picks
a real provider based on `(entity_type, jurisdiction)` plus the
secrets you've configured:

* **Individual KYC** (`retail`, `professional`) →
  - First choice: **Onfido** if `ONFIDO_API_TOKEN` +
    `ONFIDO_WEBHOOK_SECRET` are set.
  - Fallback: **Sumsub** if `SUMSUB_APP_TOKEN` + `SUMSUB_SECRET_KEY`
    are set (Sumsub also covers individuals).
* **Business KYB** (`institutional`, `data_provider`) →
  - **Sumsub** if `SUMSUB_APP_TOKEN` + `SUMSUB_SECRET_KEY` are set.
  - There is **no Onfido fallback for KYB** — Onfido does not do
    company verification. A prod deploy with only Onfido configured
    will refuse to serve `/v1/kyc/start` for institutional / data
    provider tenants (503 `kyc_provider_not_configured`).
* **Sanctions screening** → **OpenSanctions** if
  `OPENSANCTIONS_API_KEY` is set; covers OFAC SDN, EU CFSP, UK HMT,
  and PEPs through one API.

### Fail-closed in production

The factory checks `env.ENVIRONMENT`:

* In `dev` / `staging`, missing secrets → deterministic stub providers
  (useful for local development and tests).
* In `prod`, missing secrets → the factory **throws**
  `KycProviderNotConfiguredError` /
  `SanctionsProviderNotConfiguredError`. The handlers
  (`/v1/kyc/start` and `/v1/kyc/webhook`) catch the error and return
  503 with `kyc_provider_not_configured` /
  `sanctions_provider_not_configured`.

This is on purpose. Falling back to the stub in prod would silently
approve every applicant (the stub honours the outcome the caller
sends). A misconfigured prod deploy must fail closed: the request
fails until the operator fixes the secret rather than letting people
slip through onboarding without real verification.

### Wrangler secret commands

For each region:

```bash
# Individual KYC — Onfido (preferred for retail/professional).
wrangler secret put ONFIDO_API_TOKEN --env eu
wrangler secret put ONFIDO_WEBHOOK_SECRET --env eu

# Business KYB — Sumsub. Required for institutional / data_provider.
# `SUMSUB_SECRET_KEY` is used both for outbound HMAC headers and for
# verifying Sumsub's `X-Payload-Digest` webhook signature.
wrangler secret put SUMSUB_APP_TOKEN --env eu
wrangler secret put SUMSUB_SECRET_KEY --env eu

# Sanctions.
wrangler secret put OPENSANCTIONS_API_KEY --env eu

# Repeat for --env us, --env staging.
```

### Onboarding region-routing contract

The first call a fresh user makes is `POST /v1/auth/onboard`. By
definition that user has no `jurisdiction` claim yet (their tenant
doesn't exist), so the edge router cannot use the JWT to route. Two
explicit overrides take precedence over `cf.country` geolocation:

1. The `?region=eu` (or `us`) **query parameter** on the URL.
2. The JWT's `jurisdiction` claim once `app_metadata.gefi` is
   written.

The Jekyll onboarding flow (`assets/js/onboarding.js`) sends
`?region=` on every `/v1/auth/onboard` and `/v1/kyc/start` call so
data-residency is governed by the user's deliberate selection
*before* claims exist. A regional sibling that receives an
`/v1/auth/onboard` whose body `jurisdiction` doesn't match its
`WORKER_REGION` returns `400 wrong_region_for_onboarding`, so a
crafted-URL attack can't slip a user past the data plane they
chose.

### Webhook URLs to configure in each provider dashboard

* Onfido: `https://api.gefi.io/v1/kyc/webhook/onfido` (HMAC-SHA256 of
  the body, sent as `X-SHA2-Signature: sha256=<hex>`).
* Sumsub: `https://api.gefi.io/v1/kyc/webhook/sumsub` (HMAC-SHA256 of
  the body using `SUMSUB_SECRET_KEY`, sent as `X-Payload-Digest:
  <hex>` with `X-Payload-Digest-Alg: HMAC_SHA256_HEX`).

## 8. Smoke test

```bash
# Get an access token from Auth0 (use the M2M client for a test user
# you've onboarded manually).
curl -X POST https://gefi.eu.auth0.com/oauth/token \
  -H 'Content-Type: application/json' \
  -d '{"client_id":"…","client_secret":"…","audience":"https://api.gefi.io","grant_type":"client_credentials"}'

# Use it against the API.
curl https://api.gefi.io/v1/auth/me -H "Authorization: Bearer $TOKEN"
```

Expected: `{"ok":true,"user":{"tenant_id":"…","jurisdiction":"eu", …}}`.

## 9. Rotating signing keys

Auth0 rotates RSA signing keys roughly once a year. The Worker caches
JWKS for one hour in KV; on a verification miss it refetches. No
operator action is required during rotation — the next request after
the cache expires picks up the new key automatically.

If you need to force a refresh (e.g. after a manual key rotation on
Auth0's side):

```bash
wrangler kv:key delete --binding=CACHE "auth0:jwks:gefi.eu.auth0.com" --env prod
```
