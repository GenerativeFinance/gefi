---
layout: pricing
title: Pricing
eyebrow: Plans
lead: Start free. Upgrade when you go to production. Talk to us when you have a regulator.
permalink: /pricing/
---

<p class="payment-methods-note">{{ site.pricing.payment_methods_note }}</p>

## Frequently asked questions

<div class="faq">

<details class="faq-item" markdown="1">
<summary>What counts as an "inference call"?</summary>

A single request to a model — whether from the dashboard, the API, or the
playground. Bulk-mode and streaming calls are billed per row / per chunk; see
the [docs](/docs/#billing) for the exact rules.

</details>

<details class="faq-item" markdown="1">
<summary>Can I switch plans mid-month?</summary>

Yes. Upgrades are pro-rated immediately. Downgrades take effect at the end of
the current billing period.

</details>

<details class="faq-item" markdown="1">
<summary>Do you support onchain payments?</summary>

Yes. Subscriptions can be paid by card, ACH, or wallet (USDC on Base,
Arbitrum, and Optimism). Developer payouts can be in fiat or USDC.

</details>

<details class="faq-item" markdown="1">
<summary>What about VAT and indirect tax?</summary>

Stripe Tax is enabled for all paid tiers. Invoices include the appropriate
VAT/GST registration numbers per jurisdiction.

</details>

<details class="faq-item" markdown="1">
<summary>Is the Free tier rate-limited?</summary>

Yes — 100 inference calls per day, soft cap. We don't kill in-flight requests;
we just queue you behind paying tenants once you cross.

</details>

<details class="faq-item" markdown="1">
<summary>What happens to my data if I cancel?</summary>

We retain your audit logs for the period required by the model's jurisdiction
(typically 5 or 7 years), then purge. All other data is deleted within 30 days
of cancellation. See the [privacy policy](/legal/privacy/).

</details>

</div>
