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
// Reads tenant + jurisdiction + entity_type from `user.app_metadata`
// (set by the onboarding API once the user finishes onboarding) and
// pushes them into both the access token and ID token under the
// `https://gefi.io/` namespace. Forces MFA on Pro/Enterprise tenants.
exports.onExecutePostLogin = async (event, api) => {
  const NS = "https://gefi.io/";
  const meta = event.user.app_metadata || {};
  const claims = {
    tenant_id: meta.tenant_id || null,
    jurisdiction: meta.jurisdiction || null,   // "eu" | "us"
    entity_type: meta.entity_type || null,     // retail | professional | institutional | data_provider
    subscription_tier: meta.subscription_tier || "free",
    kyc_tier: meta.kyc_tier || "none",
    roles: meta.roles || ["member"],           // see RBAC matrix
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
wrangler secret put AUTH0_M2M_CLIENT_SECRET --env staging   # paste M2M secret
wrangler secret put AUTH0_M2M_CLIENT_SECRET --env prod
wrangler secret put AUTH0_M2M_CLIENT_SECRET --env eu
wrangler secret put AUTH0_M2M_CLIENT_SECRET --env us
```

The Worker code reads `AUTH0_DOMAIN` to fetch JWKS at
`${AUTH0_DOMAIN}.well-known/jwks.json` (KV-cached for an hour) and
`AUTH0_AUDIENCE` to verify the `aud` claim.

## 7. KYC and sanctions providers

KYC is provider-agnostic; pick one per region & entity-type
combination. The recommended defaults:

* Retail / professional → **Onfido** (EU + US).
* Institutional / data provider (KYB) → **Persona** or **Sumsub**.
* Sanctions screening → **OpenSanctions** for the open list,
  optionally **Refinitiv** or **Dow Jones** for the commercial list.

For each provider create an account and store the API token + webhook
secret as Wrangler secrets:

```bash
wrangler secret put ONFIDO_API_TOKEN_EU --env eu
wrangler secret put ONFIDO_WEBHOOK_SECRET_EU --env eu
wrangler secret put OPENSANCTIONS_API_KEY --env eu
# … and the same for `us`.
```

The provider factories in `packages/integrations/src` resolve at
request time based on `(entity_type, jurisdiction)`. If a secret is
missing the factory falls back to `StubKycProvider` /
`StubSanctionsProvider` and **fails closed** — verifying users always
returns "review", so production must have the real secrets in place.

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
