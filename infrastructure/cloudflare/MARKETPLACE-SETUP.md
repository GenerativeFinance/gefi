# Marketplace, billing & model gateway — operator runbook

This is the runbook for everything Task #5 added to `gefi-api`:

- Model registry (`POST /v1/models`, `POST /v1/models/:id/versions`,
  `POST /v1/models/:id/approve`, `GET /v1/models/search`).
- Subscription billing (`POST /v1/billing/subscriptions`,
  `GET /v1/billing/portal`, `POST /v1/billing/connect/onboarding`,
  `POST /v1/billing/webhook`, `GET /v1/entitlements`).
- Model gateway with a region-aware provider chain (Workers AI →
  OpenAI → Anthropic → Together → deterministic echo) plus
  `POST /v1/runs/:runId/replay` for byte-identical re-execution.
- Reference models (`@gefi/reference-models`):
  `sentiment-from-filings` (RAG over a fixture corpus) and
  `portfolio-optimiser` (mean-variance, deterministic).

The same code paths run in dev, staging, and prod. The behaviour
toggle is the presence of the relevant secrets — without them the
code falls back to deterministic stubs that exercise the full handler
graph but never make a network call. Production deployments **must**
configure every secret listed below or the corresponding endpoint
will refuse to serve real traffic.

---

## 1. D1 schema

A second migration sits next to `0001_init_auth.sql`:

```bash
cd infrastructure/cloudflare/workers/api
wrangler d1 migrations apply gefi-api-prod --remote      # public edge DB
wrangler d1 migrations apply gefi-api-prod-eu --remote   # EU regional sibling
wrangler d1 migrations apply gefi-api-prod-us --remote   # US regional sibling
```

`migrations/0002_init_marketplace.sql` adds these tables (every
table has `tenant_id` + `jurisdiction` so the same query pattern
that's used for `users` / `tenants` continues to work):

| Table             | Purpose                                                                  |
|-------------------|--------------------------------------------------------------------------|
| `models`          | Header for each listing (slug, owner tenant, status, monthly price).     |
| `model_versions`  | Immutable version rows pointing at an R2 artifact + sha-256 + chain hash.|
| `model_metadata`  | Long description, inputs / outputs, metrics, risk profile.               |
| `model_runs`      | One row per inference. Persists `input_sha`, `output_sha`, full I/O JSON. Used by `/v1/runs/:id/replay`. |
| `subscriptions`   | Per-tenant Stripe subscriptions (tier or per-model).                     |
| `entitlements`    | Quota counters keyed by `(tenant_id, feature)`. KV-cached on read path.  |
| `model_reviews`   | Investor reviews (rating + body).                                        |
| `paper_trades`    | The paper-trading sandbox tied to a model + run.                         |
| `billing_events`  | Stripe webhook events for idempotency.                                   |

R2: artifacts are written under `models/{model_id}/versions/{version_id}/artifact.bin`.
Use a per-jurisdiction bucket (`gefi-artifacts-prod-eu` /
`gefi-artifacts-prod-us`) — the artifact never leaves the bucket
that matches the tenant's jurisdiction.

---

## 2. Stripe

GeFi uses one Stripe account with two purposes:

1. **Customer billing** — tier subscriptions and per-model subscriptions.
2. **Stripe Connect Express** — paying out the developer's 70 % share.

### 2.1 Pricing tiers

The catalog is hard-coded in `packages/billing/src/tiers.ts`. The
operator creates one **Price** per tier per environment in the
Stripe dashboard and notes the IDs:

| Tier         | Monthly price | Stripe price id env var      |
|--------------|---------------|------------------------------|
| Free         | $0            | _none — no Stripe price_     |
| Starter      | $99           | `STRIPE_PRICE_STARTER`       |
| Pro          | $499          | `STRIPE_PRICE_PRO`           |
| Enterprise   | $2 499        | `STRIPE_PRICE_ENTERPRISE`    |

The handler synthesises `price_tier_<tier>` when a price id is
missing (the StubStripe path) so dev / tests don't need real Stripe
prices configured.

### 2.2 Required secrets (production)

Set with `wrangler secret put` against `gefi-api`, `gefi-api-eu`,
and `gefi-api-us`:

```bash
wrangler secret put STRIPE_SECRET_KEY            # sk_live_...
wrangler secret put STRIPE_PUBLISHABLE_KEY       # pk_live_... (read-only, for the JS pricing widget)
wrangler secret put STRIPE_WEBHOOK_SECRET        # whsec_...
wrangler secret put STRIPE_RETURN_URL            # e.g. https://gefi.io/billing
wrangler secret put STRIPE_CONNECT_CLIENT_ID     # ca_... (Connect Express)
wrangler secret put STRIPE_PRICE_STARTER         # price_... (per-env)
wrangler secret put STRIPE_PRICE_PRO
wrangler secret put STRIPE_PRICE_ENTERPRISE
```

Without `STRIPE_SECRET_KEY` the Worker uses `StubStripe` which
returns deterministic synthetic IDs. This is correct for dev /
staging — the webhook + entitlement codepaths still execute.

### 2.3 Webhook

Stripe → `POST https://api.gefi.io/v1/billing/webhook` (or the
regional variants). The handler is on the **open path** list — the
edge JWT and user JWT checks are skipped. Authentication is the
HMAC-SHA256 `Stripe-Signature` header. The verifier:

- Parses the `t=…,v1=…` header (300 s tolerance).
- Recomputes HMAC-SHA256 over `${ts}.${payload}` with constant-time
  comparison.
- Persists the event id to `billing_events` for idempotency before
  applying any state change.

Subscribed events:

- `checkout.session.completed` → flip the matching subscription to active.
- `customer.subscription.created` / `customer.subscription.updated`
  → mirror status + `current_period_end`.
- `customer.subscription.deleted` → set status to `canceled`.
- `invoice.payment_failed` → set status to `past_due` + send a
  dunning email through the Resend mailer (see §3).

If `STRIPE_WEBHOOK_SECRET` is unset, the handler returns 503 in
prod and accepts unsigned bodies in dev (intentional — dev curl
testing).

### 2.4 Stripe Connect onboarding

`POST /v1/billing/connect/onboarding` (developer role required)
creates a Connect Express account and an onboarding link. Without
`STRIPE_CONNECT_CLIENT_ID` the handler returns a 400 with
`stripe_connect_not_configured`.

---

## 3. Mailer (Resend)

Dunning emails on failed invoices use Resend. Optional secret:

```bash
wrangler secret put RESEND_API_KEY            # re_...
wrangler secret put RESEND_FROM_ADDRESS       # billing@gefi.io
```

Without `RESEND_API_KEY` the Worker uses `StubMailer` which logs
the message instead of sending it.

---

## 4. AI provider chain

The model gateway tries each configured provider in order and
falls through on `RegionRefused` (region mismatch) or any error
that isn't a 4xx classification mistake. The last entry is always
`DeterministicProvider`, so a request always returns *something*.

### 4.1 Workers AI binding (preferred when the user is on the
   Cloudflare data plane)

Add to `wrangler.jsonc` env block(s):

```jsonc
"ai": { "binding": "AI" }
```

This is **not** in the dev block by default — Workers AI only
exists on the Cloudflare runtime. Add it in `prod`, `eu`, and `us`.

### 4.2 OpenAI / Anthropic / Together (region-keyed secrets)

```bash
wrangler secret put OPENAI_API_KEY_EU         # only used by the EU sibling
wrangler secret put OPENAI_API_KEY_US         # only used by the US sibling
wrangler secret put ANTHROPIC_API_KEY_EU
wrangler secret put ANTHROPIC_API_KEY_US
wrangler secret put TOGETHER_API_KEY          # no region restriction
```

Why region-keyed: OpenAI EU residency and Anthropic EU contracts
are separate from their US counterparts. The provider chain reads
the matching secret for the request's `jurisdiction` and skips
the provider entirely if the key is missing.

### 4.3 Replay

`POST /v1/runs/:runId/replay` always uses `DeterministicProvider`
regardless of what produced the original output. The endpoint
returns `{ inputShaMatches, outputShaMatches }` so an auditor can
verify byte-exact reproducibility from the `input_sha` recorded
on the original run.

---

## 5. Search index

`@gefi/search-index` exposes a `LocalIndex` (in-process, faceted)
and a `TypesenseIndex` (real HTTP). The resolver picks Typesense
when all three secrets are present:

```bash
wrangler secret put TYPESENSE_HOST        # https://typesense.gefi.io
wrangler secret put TYPESENSE_API_KEY
wrangler secret put TYPESENSE_COLLECTION  # "models"
```

Otherwise the resolver returns `LocalIndex`, which `gefi-api`
hydrates from D1 on every search request. This is fine for dev
(<200 docs) but is the bottleneck above ~5 k models — provision
Typesense before scaling beyond that.

The collection schema:

```json
{
  "name": "models",
  "fields": [
    { "name": "name",                    "type": "string"   },
    { "name": "summary",                 "type": "string"   },
    { "name": "category",                "type": "string", "facet": true },
    { "name": "riskClass",               "type": "string", "facet": true },
    { "name": "jurisdiction",            "type": "string", "facet": true },
    { "name": "jurisdictionsSupported",  "type": "string[]" },
    { "name": "monthlyPriceCents",       "type": "int32"    },
    { "name": "metrics.sharpe",          "type": "float", "optional": true },
    { "name": "federationEnabled",       "type": "bool"     }
  ],
  "default_sorting_field": "monthlyPriceCents"
}
```

`POST /v1/models/:id/approve` upserts the doc; the search handler
queries with the caller's `jurisdiction` so EU users never see a
US-only listing.

---

## 6. Entitlements + quotas

Every tier seeds three rows in `entitlements`:

- `requests_per_day` — daily window (resets at next UTC midnight)
- `inferences_per_month` — monthly window
- `tokens_per_month` — monthly window, charged after the run

`consume()` is the budget check: it returns `{allowed, remaining, reason}`.
The handler stack calls it three times per `POST /v1/models/:id/run`:
once for requests, once for inferences before the call, once for
tokens after. KV (`CACHE`) is the read cache; D1 is the source of
truth on writes.

Tier seeding is automatic on `POST /v1/billing/subscriptions`
(kind=tier). Manual reseed:

```sql
DELETE FROM entitlements WHERE tenant_id = '<id>';
-- then have the tenant re-subscribe, or seed manually:
INSERT INTO entitlements (tenant_id, feature, limit_value, used_value, period, resets_at, updated_at)
VALUES ('<id>', 'requests_per_day', 1000, 0, 'day', strftime('%s','now','+1 day'), strftime('%s','now'));
```

---

## 7. Compliance triggers

The handler stack emits two new event kinds to `gefi-compliance`
through the existing service binding:

- `model_listed` — fired by `publishVersion`. Carries
  `{ modelId, versionId, sha256, riskClass }`. The SEC rule book
  routes high-risk listings to FINRA-licensed counsel and opens
  a `ComplianceCase`.
- `subscription_created` — fired by `createSubscription`. Carries
  `{ kind, tier, modelId, monthlyCents }`. Used by the GDPR /
  CCPA rule books to attach a data-processing agreement.

Both events are best-effort. A compliance Worker outage logs a
warning but never blocks the primary marketplace flow.

---

## 8. Local dev recipe

```bash
cd infrastructure/cloudflare
pnpm install
pnpm test                     # 249 tests across 24 files
pnpm typecheck                # turbo run typecheck across the graph
pnpm --filter @gefi/worker-api run dev   # wrangler dev w/ local D1+R2+KV
```

Sample curl flow against `wrangler dev` (port 8787) — the dev
worker is on the open path for everything except the user-JWT
gate, and the StubStripe / DeterministicProvider chain means no
external secrets are required:

```bash
# 1. Sign an internal edge JWT for testing (or use the dev token).
EDGE=$(node -e 'import("./packages/shared-router/dist/jwt.js").then(m => m.signInternalJwt("us", process.env.SECRET).then(t => console.log(t)))')

# 2. Create a model.
curl -X POST http://localhost:8787/v1/models \
  -H "Authorization: Bearer $USER_JWT" \
  -H "X-Gefi-Edge-JWT: $EDGE" \
  -H "Content-Type: application/json" \
  -d '{"slug":"alpha-edge","name":"Alpha Edge","summary":"x","category":"forecasting","risk_class":"medium","monthly_price_cents":19900}'

# 3. Publish a version (small JSON body for tests).
curl -X POST http://localhost:8787/v1/models/<id>/versions \
  -H "Authorization: Bearer $USER_JWT" -H "X-Gefi-Edge-JWT: $EDGE" \
  -H "Content-Type: application/json" \
  -d "{\"version\":\"0.1.0\",\"manifest\":{},\"artifact_base64\":\"$(printf 'hello' | base64)\"}"

# 4. Admin approves.
curl -X POST http://localhost:8787/v1/models/<id>/approve \
  -H "Authorization: Bearer $ADMIN_JWT" -H "X-Gefi-Edge-JWT: $EDGE" \
  -H "Content-Type: application/json" \
  -d '{"version_id":"<vid>"}'

# 5. Investor runs the model (SSE).
curl -N -X POST http://localhost:8787/v1/models/<id>/run \
  -H "Authorization: Bearer $INVESTOR_JWT" -H "X-Gefi-Edge-JWT: $EDGE" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Q4 outlook for Apple"}'
```

---

## 9. Production checklist

Before flipping the marketplace pages on the public site:

- [ ] D1 migration `0002_init_marketplace.sql` applied to all three
      databases (`gefi-api-prod`, `gefi-api-prod-eu`,
      `gefi-api-prod-us`).
- [ ] R2 buckets `gefi-artifacts-prod-eu` + `gefi-artifacts-prod-us`
      exist and are bound in the regional `wrangler.jsonc` envs.
- [ ] Stripe Live mode prices created and `STRIPE_PRICE_*` secrets set.
- [ ] `STRIPE_WEBHOOK_SECRET` matches the endpoint registered in
      Stripe → Developers → Webhooks (`https://api.gefi.io/v1/billing/webhook`).
- [ ] At least one of: Workers AI binding, OpenAI keys, Anthropic
      keys, or Together key is configured per region. Without
      this, every `/v1/models/:id/run` falls through to
      `DeterministicProvider` — fine for soft launch, not for paying
      customers.
- [ ] `RESEND_API_KEY` set so dunning mail actually goes out.
- [ ] Typesense provisioned + `TYPESENSE_*` secrets set if the catalog
      will exceed ~5 k models.
- [ ] Smoke test the four critical paths in §8 against
      `staging-api.gefi.io` first.
