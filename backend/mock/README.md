# GeFi mock API server (task 301)

Zero-dependency Node server that implements **every** contract in
`api/openapi/` from the same deterministic dataset the UI ships.

```
node backend/mock/server.js        # http://localhost:8788/v1
bash backend/mock/smoke.sh         # one check per service + envelope checks
```

## How it stays honest

- **Coverage by construction** — at startup the server scans
  `api/openapi/*.yaml` for every `method + path` pair and refuses to boot
  if any contract route lacks a handler (or any handler lacks a contract
  route). Adding a path to a contract without implementing it fails fast.
- **Same data as the UI** — `assets/js/dashboard.js` (GeFi.MODELS, seed,
  formatters) and `assets/js/app-demo-data.js` (GeFi.DEMO) are loaded via a
  `vm` shim, so mock responses agree with what the pages render offline.
- **Envelope** — every response carries `X-GeFi-Sample: true` and
  `X-Request-Id`; errors use the shared `{code, message, details[],
  request_id}` object; lists paginate with `limit`/`cursor` → `next_cursor`;
  mutating POSTs require `Idempotency-Key` (missing → 422-style
  `validation_failed`; repeated → replayed response with
  `X-GeFi-Idempotent-Replay: true`).
- **SSE** — `/v1/market-data/stream`, `/v1/backtests/{id}/events`,
  `/v1/dev/training-jobs/{id}/logs`, `/v1/zkml/verifications/{id}/events`
  emit named events with monotonic ids plus `: ping` heartbeats, per the
  envelope convention.
- **CORS** — localhost origins only.
- **State** — mutations (orders, contributions, claims, resolves, …) are
  in-memory and reset on restart. Nothing is written to disk.
