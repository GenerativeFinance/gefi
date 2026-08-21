---
layout: page
title: Features
eyebrow: Platform
lead: GeFi is a marketplace, a federated training network, a compliance router, and an audit trail — in one platform.
permalink: /features/
---

## Marketplace

A curated catalogue of production AI models for finance. Filter by category
(investing, risk, fraud, compliance, trade finance, ESG), jurisdiction,
federated status, and risk class. Every model has a public scorecard with
self-reported metrics, a sample inference, and a price.

- **Stripe + onchain payments.** Pay by card, ACH, or wallet. Developers are paid out on rev-share or fixed-license terms.
- **Try before you buy.** Every model has a paper-trading sandbox and a 100-call free tier on the playground.
- **Versioning.** Subscribers pin to a specific model version. Authors can ship breaking changes without breaking subscribers.

## Federated learning

Train against private datasets that never leave their institution.
Contributors earn revenue every time their data improves a model.

- Aggregation runs on Cloudflare Workers + Durable Objects.
- Differential privacy budgets are tracked per dataset and surfaced in the dashboard.
- Contributors can revoke participation at any time and trigger a re-train without their gradients.

## Compliance routing

Every model declares the jurisdictions it covers (US/SEC, UK/FCA, EU/MiFID II, MAS, ADGM, FSRA, etc.). The platform routes:

- The customer's KYC / KYB to the appropriate provider and tier.
- Disclosure obligations to the right legal language.
- Material events to a per-jurisdiction lawyer + auditor directory.

You can ship to a new geography without ever talking to a separate compliance vendor.

## Audit log

Every inference is appended to a hash-chained log and Merkle-anchored daily.

- **Per-run proofs.** Anyone with a `run_id` can fetch a Merkle inclusion proof and verify it offline.
- **Per-tenant proofs.** Auditors can request the entire Merkle frontier for a date range.
- **Tamper-evident.** Any rewrite of the log breaks the chain — auditors detect it immediately.

## Risk surface

A single dashboard for everything you've subscribed to:

- Real-time **VaR** (1-day, 95% / 99%, parametric + historical).
- Daily **stress tests** against a configurable scenario library.
- **Exposure decomposition** by model, asset class, geography, and counterparty.
- Drawdown alerts piped to email, Slack, or webhook.

## Sovereign tenants

Enterprise customers can run a dedicated regional data plane on:

- **EU:** OVH SecNumCloud (SecNumCloud-qualified) or Infomaniak (Swiss, ISO 27001).
- **MENA:** AWS Bahrain or G42 Cloud (UAE).
- **US:** AWS GovCloud on request.

Data residency and retention policies are enforced at the platform layer, not by your team.

---

{% include cta.html
   title="Ready to see it on your data?"
   primary_label="Book a demo"
   primary_url="/contact/?topic=demo"
   secondary_label="See pricing"
   secondary_url="/pricing/" %}
