---
title: RE Acquisition Underwriter
slug: re-acquisition-underwriter
category: Real Estate
featured: false
risk: low
maturity: GA
federated: true
price: 99
jurisdictions: [US, UK, EU]
lead: Cap rate, NOI, cash-on-cash and IRR at property and investor level, with a federated comps benchmark from the same submarket.
metrics:
  - { label: "Levels",        value: "Property + investor" }
  - { label: "Comps",         value: "Federated, submarket" }
  - { label: "Pipeline",      value: "Screened → closed" }
  - { label: "Refresh",       value: "Scheduled" }
analytics: true
demo:
  output: table
  cta: Underwrite
  lead: Enter the deal. Returns are shown at both levels — the property's return and the investor's are different numbers once leverage and fees are applied.
  columns: [Metric, Property, Investor]
  row_labels: [Cap rate, Cash-on-cash, IRR, Equity multiple, Breakeven occupancy]
  row_count: 5
  fields:
    - name: price
      type: number
      label: Purchase price
      value: 24500000
      min: 0
      step: 100000
      unit: USD
    - name: noi
      type: number
      label: Year-1 NOI
      value: 1420000
      min: 0
      step: 10000
      unit: USD
    - name: ltv
      type: number
      label: LTV
      value: 65
      min: 0
      max: 95
      unit: "%"
    - name: exit_cap
      type: number
      label: Exit cap rate
      value: 5.75
      min: 1
      max: 15
      step: 0.05
      unit: "%"
---

## What it does

Takes purchase price, rent roll, and financing and returns **cap rate, NOI,
cash-on-cash return, and IRR/equity multiple at both property and investor
level**, with a **federated comps benchmark** against anonymised recent
transactions in the same submarket.

## Exit cap is the assumption that decides the deal

A large share of a real estate return typically comes from the exit, and the
exit value is NOI divided by the exit cap rate. Moving the exit cap by 50 basis
points moves the return more than most operational assumptions in the model.

Assuming exit cap equals entry cap is the industry's most common convenient
assumption — it implies selling into the same conditions you bought in, after a
hold that usually spans a rate cycle. The model surfaces exit cap as a primary
input rather than a default, and the sensitivity is where underwriting
discipline actually lives.

**Breakeven occupancy** sits in the same table for the same reason: it states
how much of the rent roll can disappear before the deal stops covering debt
service, which is the downside question a cap rate cannot answer.

## Property and investor returns are different

The property produces an unlevered return. The investor receives a levered one,
net of fees and promote structures. Leverage amplifies both directions, and
quoting the property-level IRR to an investor overstates what they receive in
the good case and understates their risk in the bad one.

Both are shown side by side.

## Comps from the submarket, not the market

Real estate is local to a degree that defeats broad averages. A citywide cap
rate is close to useless for underwriting a specific asset in a specific
submarket, which is why the federated benchmark is **submarket-scoped** and
draws on participating brokers and owners rather than published aggregates —
recent transactions being both more current and more granular than anything
published.

## Pricing

**Starter** plan and above, at $99/month. Federated comps require data-partner
onboarding.
