# GeFi API contracts

Contract-first backend workspace for the 300-series ledger tasks
(`tasks/UI-FOLLOWUP-LEDGER.md`). Nothing under `api/` or `backend/` is
published to the site — both are excluded in `_config.yml`.

## Layout

- `openapi/_envelope.yaml` — the shared conventions, fixed once (task 300):
  bearer + API-key auth schemes, cursor pagination (`limit`/`cursor` →
  `next_cursor`), the uniform error object (`code`, `message`, `details[]`,
  `request_id`), the required `Idempotency-Key` header on every mutating
  POST, `X-GeFi-Sample: true` semantics for sample-served responses, and
  the SSE framing convention (named `<resource>.<verb>` events, monotonic
  ids for `Last-Event-ID` resume, `: ping` heartbeats).
- `openapi/<service>.yaml` — one skeleton per service (18 services mapped
  from the design-system-v2 §7 gap analysis). Skeletons pin the resource
  paths and reference the envelope; request/response schemas land with each
  owning 300-series task.

## The contract-first flow

1. **Contract** (here): the path exists in the service YAML before any code.
2. **Mock** (task 301): a mock server implements every contract from the
   canonical `GeFi.DEMO` dataset and stamps `X-GeFi-Sample: true`.
3. **Client** (task 302): `assets/js/app/api.js` is the ONE data layer app
   pages call.
4. **Real service** (tasks 303+): replaces the mock behind the same
   contract; the UI does not change.

## The live-with-fallback rule (binding on all app pages)

Every data read/write goes through the client data layer, which calls the
documented endpoint when `site.api.base_url` responds and falls back to the
deterministic `GeFi.DEMO` dataset when it doesn't — the same live/fallback
pattern the model demo harness already uses. Sample data is always labelled
as sample (`X-GeFi-Sample`, or the existing UI labels when offline).
