---
layout: page
title: Compliance & Trust
eyebrow: Trust portal
lead: How GeFi handles your data, your audits, and your regulators.
permalink: /compliance/
---

<ul class="card-grid" style="margin-bottom: var(--space-5); list-style: none; padding: 0;">
  <li style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5);">
    <p class="eyebrow">Live evidence</p>
    <h3 style="margin: var(--space-1) 0;"><a href="https://trust.gefi.io" rel="noopener" target="_blank">trust.gefi.io &rarr;</a></h3>
    <p class="muted" style="margin: 0;">Certifications, audit reports, security policies, and on-demand evidence packs for customers and prospects.</p>
  </li>
  <li style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5);">
    <p class="eyebrow">Uptime &amp; incidents</p>
    <h3 style="margin: var(--space-1) 0;"><a href="https://status.gefi.io" rel="noopener" target="_blank">status.gefi.io &rarr;</a></h3>
    <p class="muted" style="margin: 0;">Real-time platform status, scheduled maintenance, and historical incident post-mortems.</p>
  </li>
</ul>

## Compliance posture

<ul class="badge-row" style="margin-bottom: var(--space-5);">
  {% for badge in site.compliance_badges %}
    <li><span class="badge badge--compliance">{{ badge.label }}</span></li>
  {% endfor %}
</ul>

Live status of our certifications, audits, and policies is published on
[trust.gefi.io](https://trust.gefi.io). Customers on the Pro tier and above
can request a full evidence pack on demand from inside the dashboard.

## Subprocessors

We use a small, intentional set of subprocessors. Material changes are
announced on the [blog](/blog/) at least 30 days before they take effect.

<div class="prose">
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
</div>

## Data handling

- **Data residency.** US, EU, and MENA regional data planes. Enterprise tenants can pin all data to a single region.
- **Encryption.** TLS 1.3 in transit. AES-256 at rest. Per-tenant KMS-managed keys on the Enterprise tier.
- **Retention.** Audit logs are retained for the period required by each model's jurisdiction (typically 5–7 years). Other data is deleted within 30 days of account closure.
- **Access.** Role-based access control with MFA enforced for all human access to production. Just-in-time elevation for engineering.

## Audit log

Every inference call is appended to a hash-chained log and Merkle-anchored
daily. Anyone with a `run_id` can fetch a Merkle inclusion proof and verify
it offline against the published anchor — including auditors and regulators
who don't have an account.

The verification spec is on [GitHub](https://github.com/gefi-io/audit-spec).

<h2 id="counsel">Per-jurisdiction counsel</h2>

For each market we operate in, we maintain a directory of named local counsel
and qualified auditors. Customers on the Institutional and Enterprise tiers
get the full directory; everyone else gets a summary on request.

| Jurisdiction | Regulator(s)                  | Status                  |
|--------------|-------------------------------|-------------------------|
| US           | SEC, FINRA, FinCEN            | Counsel engaged         |
| UK           | FCA, PRA                      | Counsel engaged         |
| EU           | ESMA, national NCAs           | Counsel engaged (multi) |
| UAE          | ADGM FSRA, DFSA               | Counsel engaged         |
| Singapore    | MAS                           | Engagement in progress  |
| Switzerland  | FINMA                         | Engagement in progress  |

## Reporting a vulnerability

We run a coordinated disclosure programme.

- Email **security@gefi.io** with details and your PGP key (optional).
- We acknowledge within one business day and aim to triage within three.
- Public disclosure is coordinated; we don't sue researchers.

## Status & history

- [status.gefi.io](https://status.gefi.io) — current uptime and incidents.
- Quarterly security letter — published on the [blog](/blog/).
