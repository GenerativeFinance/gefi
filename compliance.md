---
layout: page
title: Compliance & Trust
eyebrow: Trust portal
lead: How GeFi handles your data, your audits, and your regulators.
permalink: /compliance/
wide: true
---

<div class="trust-evidence">
  <a class="trust-card" href="https://trust.gefi.io" rel="noopener" target="_blank">
    <p class="trust-card__eyebrow"><span class="live-dot" aria-hidden="true"></span> Live evidence</p>
    <h2>trust.gefi.io</h2>
    <p class="muted">Certifications, audit reports, security policies, and on-demand evidence packs for customers and prospects.</p>
    <span class="trust-card__cta">Open the trust center &rarr;</span>
  </a>
  <a class="trust-card" href="https://status.gefi.io" rel="noopener" target="_blank">
    <p class="trust-card__eyebrow"><span class="live-dot" aria-hidden="true"></span> Uptime &amp; incidents</p>
    <h2>status.gefi.io</h2>
    <p class="muted">Real-time platform status, scheduled maintenance, and historical incident post-mortems.</p>
    <span class="trust-card__cta">Open the status page &rarr;</span>
  </a>
</div>

<div class="trust-layout">
  <nav class="trust-nav" aria-label="Page sections">
    <a href="#posture">Posture</a>
    <a href="#subprocessors">Subprocessors</a>
    <a href="#data-handling">Data handling</a>
    <a href="#audit-log">Audit log</a>
    <a href="#counsel">Counsel</a>
    <a href="#vulnerability">Report a vulnerability</a>
  </nav>

  <div class="trust-sections">

<section id="posture" class="trust-section" markdown="1">

## Compliance posture

<ul class="badge-row">
  {% for badge in site.compliance_badges %}
    <li><span class="badge badge--compliance">{{ badge.label }}</span></li>
  {% endfor %}
</ul>

Live status of our certifications, audits, and policies is published on
[trust.gefi.io](https://trust.gefi.io). Customers on the Pro tier and above
can request a full evidence pack on demand from inside the dashboard.

</section>

<section id="subprocessors" class="trust-section" markdown="1">

## Subprocessors

We use a small, intentional set of subprocessors. Material changes are
announced on the [blog](/blog/) at least 30 days before they take effect.

<table>
  <thead>
    <tr><th>Subprocessor</th><th>Purpose</th></tr>
  </thead>
  <tbody>
    {% for sp in site.subprocessors %}
      <tr>
        <td><strong>{{ sp.name }}</strong></td>
        <td>{{ sp.purpose }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>

</section>

<section id="data-handling" class="trust-section" markdown="1">

## Data handling

- **Data residency.** US, EU, and MENA regional data planes. Enterprise tenants can pin all data to a single region.
- **Encryption.** TLS 1.3 in transit. AES-256 at rest. Per-tenant KMS-managed keys on the Enterprise tier.
- **Retention.** Audit logs are retained for the period required by each model's jurisdiction (typically 5–7 years). Other data is deleted within 30 days of account closure.
- **Access.** Role-based access control with MFA enforced for all human access to production. Just-in-time elevation for engineering.

</section>

<section id="audit-log" class="trust-section">
      <h2>Audit log</h2>
      <div class="audit-module">
        <svg class="hash-chain" viewBox="0 0 560 96" role="img" aria-label="Hash chain: each run's hash links to the next, ending in a daily Merkle anchor">
          <g class="hash-chain__block"><rect x="4"   y="24" width="112" height="48" rx="8"/><text x="60"  y="44">run 1041</text><text x="60" y="62" class="hash-chain__hash">9f2c…a1</text></g>
          <g class="hash-chain__block"><rect x="152" y="24" width="112" height="48" rx="8"/><text x="208" y="44">run 1042</text><text x="208" y="62" class="hash-chain__hash">4b7d…e9</text></g>
          <g class="hash-chain__block"><rect x="300" y="24" width="112" height="48" rx="8"/><text x="356" y="44">run 1043</text><text x="356" y="62" class="hash-chain__hash">c31a…f4</text></g>
          <g class="hash-chain__block hash-chain__block--anchor"><rect x="448" y="24" width="108" height="48" rx="8"/><text x="502" y="44">Merkle</text><text x="502" y="62" class="hash-chain__hash">anchor</text></g>
          <path class="hash-chain__link" d="M116 48 H152"/>
          <path class="hash-chain__link" d="M264 48 H300"/>
          <path class="hash-chain__link" d="M412 48 H448"/>
        </svg>
        <p>
          Every inference call is appended to a hash-chained log and Merkle-anchored
          daily. Anyone with a <code>run_id</code> can fetch an inclusion proof and verify
          it offline against the published anchor — including auditors and regulators
          who don't have an account. The verification spec is on
          <a href="https://github.com/gefi-io/audit-spec">GitHub</a>.
        </p>
        <form class="verify-form" data-verify-form data-verifier-endpoint="{{ site.api.verifier_endpoint | default: '' }}">
          <label class="sr-only" for="verify-run-id">Run id</label>
          <input type="text" id="verify-run-id" name="run_id" placeholder="Paste a run_id to verify, e.g. run_9f2c81aa" autocomplete="off" spellcheck="false">
          <button type="submit" class="btn btn-primary">Verify</button>
        </form>
        <div class="verify-result" data-verify-result hidden></div>
        <aside class="trust-callout">
          <p class="trust-callout__head">How it works</p>
          <p>The full design — why a CSV is not an audit trail, the hash-chain
          and daily Merkle anchor, and how offline verification stays honest —
          is written up as a methodology piece:
          <a href="/research/audit-log-design/">How the GeFi audit log works</a>.</p>
        </aside>
      </div>
</section>

<section id="counsel" class="trust-section">
      <h2>Per-jurisdiction counsel</h2>
      <p>
        For each market we operate in, we maintain a directory of named local counsel
        and qualified auditors. Customers on the Institutional and Enterprise tiers
        get the full directory; everyone else gets a summary on request.
      </p>
      <ul class="status-board" role="list">
        <li><span class="status-board__where">US</span><span class="status-board__who muted">SEC, FINRA, FinCEN</span><span class="status-pill status-pill--ok">Counsel engaged</span></li>
        <li><span class="status-board__where">UK</span><span class="status-board__who muted">FCA, PRA</span><span class="status-pill status-pill--ok">Counsel engaged</span></li>
        <li><span class="status-board__where">EU</span><span class="status-board__who muted">ESMA, national NCAs</span><span class="status-pill status-pill--ok">Counsel engaged (multi)</span></li>
        <li><span class="status-board__where">UAE</span><span class="status-board__who muted">ADGM FSRA, DFSA</span><span class="status-pill status-pill--ok">Counsel engaged</span></li>
        <li><span class="status-board__where">Singapore</span><span class="status-board__who muted">MAS</span><span class="status-pill status-pill--progress">Engagement in progress</span></li>
        <li><span class="status-board__where">Switzerland</span><span class="status-board__who muted">FINMA</span><span class="status-pill status-pill--progress">Engagement in progress</span></li>
      </ul>
</section>

<section id="vulnerability" class="trust-section" markdown="1">

## Reporting a vulnerability

We run a coordinated disclosure programme. Full scope, safe-harbour
terms, PGP key, and rules of engagement are on the
[**security & vulnerability disclosure page**](/security/).

- Email **security@gefi.io** with details and your PGP key (optional).
- We acknowledge within one business day and aim to triage within three.
- Public disclosure is coordinated; we don't sue researchers.
- Tooling can discover us via [`/.well-known/security.txt`](/.well-known/security.txt) (RFC 9116).

### Status & history

- [status.gefi.io](https://status.gefi.io) — current uptime and incidents.
- Quarterly security letter — published on the [blog](/blog/).

</section>

  </div>
</div>

<script src="{{ '/assets/js/audit-verify.js' | relative_url }}" defer></script>
