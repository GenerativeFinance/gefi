---
layout: pricing
title: Pricing
eyebrow: Plans
lead: Start free. Upgrade when you go to production. Talk to us when you have a regulator.
permalink: /pricing/
---

## Frequently asked questions

### What counts as an "inference call"?

A single request to a model — whether from the dashboard, the API, or the
playground. Bulk-mode and streaming calls are billed per row / per chunk; see
the [docs](/docs/#billing) for the exact rules.

### Can I switch plans mid-month?

Yes. Upgrades are pro-rated immediately. Downgrades take effect at the end of
the current billing period.

### Do you support onchain payments?

Yes. Subscriptions can be paid by card, ACH, or wallet (USDC on Base,
Arbitrum, and Optimism). Developer payouts can be in fiat or USDC.

### What about VAT and indirect tax?

Stripe Tax is enabled for all paid tiers. Invoices include the appropriate
VAT/GST registration numbers per jurisdiction.

### Is the Free tier rate-limited?

Yes — 100 inference calls per day, soft cap. We don't kill in-flight requests;
we just queue you behind paying tenants once you cross.

### What happens to my data if I cancel?

We retain your audit logs for the period required by the model's jurisdiction
(typically 5 or 7 years), then purge. All other data is deleted within 30 days
of cancellation. See the [privacy policy](/legal/privacy/).
