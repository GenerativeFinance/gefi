---
layout: page
title: Documentation
eyebrow: Build with GeFi
lead: API reference, SDKs, audit-log verification, and federated-learning guides.
permalink: /docs/
---

The full developer documentation lives at
[docs.gefi.io](https://docs.gefi.io). This page is a quick map.

## Quickstart

1. Create an account ([request access](/contact/?topic=sales) — the
   self-serve sign-up at `app.gefi.io` ships with Task #7) and complete the
   standard KYC.
2. Mint an API key in **Settings → API keys**.
3. Subscribe to a model from the [catalogue](/models/).
4. Call it:

```bash
curl https://api.gefi.io/v1/models/sentiment-from-filings/infer \
  -H "Authorization: Bearer $GEFI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Q3 results came in ahead of guidance..."}'
```

The response includes a `run_id` you can use to pull an audit proof later.

## Sections

- **Authentication** — API keys, OAuth, MFA, scoped tokens.
- **Inference API** — synchronous, streaming, and bulk modes.
- **Audit log** — fetching Merkle proofs, verifying offline.
- **Federated participation** — onboarding a private dataset, gradient submission, rev-share.
- **Compliance routing** — declaring jurisdictions, KYC tiers, lawyer directory.
- **Webhooks & events** — subscription lifecycle, model version changes, audit-anchor events.
- **SDKs** — TypeScript, Python, Go.

<h2 id="billing">Billing</h2>

- Inference calls are metered per-call.
- Bulk-mode requests bill per row.
- Streaming responses bill per emitted chunk.
- Failed requests (4xx with no model output) are not billed; failed requests with partial model output (5xx after first token) are billed for the tokens emitted.

## Status & changelog

- [status.gefi.io](https://status.gefi.io) — uptime, incidents.
- [changelog](/blog/) — model releases, breaking changes, migrations.

---

Looking for something specific? [Open an issue on GitHub](https://github.com/gefi-io/gefi/issues) or [email the team](mailto:hello@gefi.io).
