---
layout: page
title: Documentation
eyebrow: Build with GeFi
lead: API reference, SDKs, audit-log verification, and federated-learning guides.
permalink: /docs/
wide: true
---

The full developer documentation lives at
[docs.gefi.io](https://docs.gefi.io). This page gets you to a working call.

<section class="docs-quickstart" markdown="0">
<h2 id="quickstart">Quickstart</h2>
<ol class="docs-steps">
<li>Create an account (<a href="/contact/?topic=sales">request access</a>) and complete the standard KYC.</li>
<li>Mint an API key in <strong>Settings &rarr; API keys</strong>.</li>
<li>Subscribe to a model from the <a href="/models/">catalogue</a>.</li>
<li>Call it:</li>
</ol>

<div class="code-tabs" data-code-tabs>
<div class="code-tabs__bar" role="tablist" aria-label="Language">
<button type="button" role="tab" class="code-tabs__tab is-active" aria-selected="true" data-code-tab="curl">cURL</button>
<button type="button" role="tab" class="code-tabs__tab" aria-selected="false" data-code-tab="python">Python</button>
<button type="button" role="tab" class="code-tabs__tab" aria-selected="false" data-code-tab="js">JavaScript</button>
</div>

<div class="code-tabs__panel is-active" role="tabpanel" data-code-panel="curl">
<p class="code-tabs__nojs-label">cURL</p>
<pre class="docs-code"><code>curl -X POST https://api.gefi.io/v1/models/credit-oracle/run \
  -H <span class="tok-s">"Authorization: Bearer $GEFI_API_KEY"</span> \
  -H <span class="tok-s">"Content-Type: application/json"</span> \
  -d <span class="tok-s">'{"inputs": {"revenue": 2400000, "sector": "Manufacturing", "amount": 350000}}'</span></code></pre>
</div>

<div class="code-tabs__panel" role="tabpanel" data-code-panel="python">
<p class="code-tabs__nojs-label">Python</p>
<pre class="docs-code"><code><span class="tok-k">import</span> requests

r = requests.post(
    <span class="tok-s">"https://api.gefi.io/v1/models/credit-oracle/run"</span>,
    headers={<span class="tok-s">"Authorization"</span>: <span class="tok-s">f"Bearer {GEFI_API_KEY}"</span>},
    json={<span class="tok-s">"inputs"</span>: {<span class="tok-s">"revenue"</span>: 2400000, <span class="tok-s">"sector"</span>: <span class="tok-s">"Manufacturing"</span>, <span class="tok-s">"amount"</span>: 350000}},
)
run = r.json()</code></pre>
</div>

<div class="code-tabs__panel" role="tabpanel" data-code-panel="js">
<p class="code-tabs__nojs-label">JavaScript</p>
<pre class="docs-code"><code><span class="tok-k">const</span> r = <span class="tok-k">await</span> fetch(<span class="tok-s">"https://api.gefi.io/v1/models/credit-oracle/run"</span>, {
  method: <span class="tok-s">"POST"</span>,
  headers: {
    Authorization: <span class="tok-s">`Bearer ${GEFI_API_KEY}`</span>,
    <span class="tok-s">"Content-Type"</span>: <span class="tok-s">"application/json"</span>,
  },
  body: JSON.stringify({ inputs: { revenue: 2400000, sector: <span class="tok-s">"Manufacturing"</span>, amount: 350000 } }),
});
<span class="tok-k">const</span> run = <span class="tok-k">await</span> r.json();</code></pre>
</div>
</div>

<p class="docs-response-label">Response</p>
<pre class="docs-code docs-code--response"><code>{
  <span class="tok-s">"run_id"</span>: <span class="tok-s">"run_9f2c81aa"</span>,
  <span class="tok-s">"model"</span>: <span class="tok-s">"credit-oracle"</span>,
  <span class="tok-s">"result"</span>: {
    <span class="tok-s">"kind"</span>: <span class="tok-s">"score"</span>,
    <span class="tok-s">"value"</span>: 0.238,
    <span class="tok-s">"drivers"</span>: [{ <span class="tok-s">"name"</span>: <span class="tok-s">"Sector risk"</span>, <span class="tok-s">"weight"</span>: 0.064 }]
  },
  <span class="tok-s">"audit"</span>: { <span class="tok-s">"anchored"</span>: <span class="tok-k">false</span>, <span class="tok-s">"proof_available_after"</span>: <span class="tok-s">"2026-08-22T00:00:00Z"</span> }
}</code></pre>
<p class="muted small">Every response carries a <code>run_id</code>; once the daily anchor lands you can pull a Merkle inclusion proof and <a href="/compliance/#audit-log">verify it offline</a>.</p>
</section>

<section class="docs-auth" markdown="1">

## Authentication & rate limits

API keys are minted per environment in **Settings → API keys** and sent as a
`Bearer` header. Keys are scoped — a key minted for inference cannot read
billing, and read-only keys cannot run models. Rotate keys from the dashboard;
old keys keep working for 24 hours after rotation so deploys don't race.

| Plan | Sustained | Burst | Bulk rows / day |
|---|---|---|---|
| Starter | 5 rps | 20 rps | 50k |
| Pro | 25 rps | 100 rps | 1M |
| Enterprise | Custom | Custom | Custom |

Requests over the limit return `429` with a `Retry-After` header — back off and
retry rather than hammering; sustained abuse suspends the key, not the account.

</section>

<h2 id="model-reference">Model reference</h2>

<p class="muted">Every model exposes the same contract — <code>POST /v1/models/{slug}/run</code> — with per-model input schemas. Featured references below; all 92 are in the <a href="/models/">catalogue</a>.</p>

{% assign docs_models = site.models | where: "featured", true | sort: "title" %}
<div class="card-grid">
{% for m in docs_models %}
<a class="model-card docs-card" href="{{ m.url | relative_url }}">
<p class="eyebrow">{{ m.category }}</p>
<h3>{{ m.title }}</h3>
{% if m.lead %}<p class="muted">{{ m.lead | truncate: 110 }}</p>{% endif %}
<p class="docs-card__endpoint">POST /v1/models/{{ m.slug }}/run</p>
<span class="model-card__cta" aria-hidden="true">Reference &rarr;</span>
</a>
{% endfor %}
</div>

<section markdown="1">

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

</section>

<script src="{{ '/assets/js/code-tabs.js' | relative_url }}" defer></script>
