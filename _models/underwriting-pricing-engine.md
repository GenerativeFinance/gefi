---
title: Underwriting Pricing Engine
slug: underwriting-pricing-engine
category: Insurance / Pricing
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Technical premium decomposed into expected loss, expenses and risk margin, with rate adequacy against the in-force book and filing status beside the price.
metrics:
  - { label: "Decomposition",   value: "Loss / expense / margin" }
  - { label: "Rate adequacy",   value: "vs in-force book" }
  - { label: "Filing status",   value: "NAIC / PRA, surfaced" }
  - { label: "Overrides",       value: "Monitored + costed" }
analytics: true
demo:
  output: table
  cta: Price the risk
  lead: The technical premium is decomposed, not blended — because when an underwriter departs from it, the record should show which component they disagreed with.
  columns: [Component, Amount, Share of premium]
  row_labels: [Expected loss, Expenses, Risk margin, Technical premium, Charged premium]
  row_count: 5
  fields:
    - name: line
      type: select
      label: Line of business
      options: [Commercial property, General liability, Professional lines, Motor fleet]
      value: Commercial property
    - name: sum_insured
      type: number
      label: Sum insured
      value: 8500000
      min: 0
      step: 100000
      unit: USD
    - name: jurisdiction
      type: select
      label: Filing jurisdiction
      options: [US (NAIC), UK (PRA), EU]
      value: US (NAIC)
    - name: tornado
      type: checkbox
      label: Show rating-factor sensitivity
      value: true
---

## What it does

Takes risk inputs and returns a **technical-premium decomposition** — expected
loss, expenses, risk margin — a **rate-adequacy comparison against the
in-force book**, a **per-rating-factor sensitivity tornado**, and the
**jurisdictional filing status** (NAIC / PRA) surfaced beside the price.

## The decomposition is what makes the price arguable

A blended premium can only be accepted or rejected. A decomposed one can be
*argued with precisely* — an underwriter who believes the risk is better than
modelled is disputing the expected-loss component, not the expense loading,
and the record should say so.

That is also why the **underwriter-override monitor** exists, and why it is
framed as measurement rather than enforcement: overrides are legitimate —
underwriters know things models do not — but a book where overrides run
consistently one direction and consistently cost money is a calibration
conversation someone should be having, and it only happens if departures from
technical price are tracked and costed.

## Rate adequacy is a portfolio question

A single risk priced adequately can still be written into an inadequate book.
The comparison against the **in-force book** shows whether this price
continues, improves, or degrades the portfolio's overall adequacy — the
question a pricing actuary actually asks, and one a per-risk view cannot
answer.

## Filing status sits beside the price, because it binds

In regulated lines a rate is not merely an actuarial output — it is a filed
artefact, and charging a rate that departs from the filing is a compliance
event, not a pricing choice. Surfacing NAIC/PRA filing status next to the
price keeps that constraint visible at the moment of quoting rather than
discovered at audit. Rate-filing packs generate per jurisdiction from the same
engine that priced the risk.

## Pricing

**Pro** plan and above, at $199/month.
