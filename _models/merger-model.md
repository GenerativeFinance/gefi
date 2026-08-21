---
title: Merger Model
slug: merger-model
category: M&A
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Pro forma combined statements from target and acquirer financials, consideration mix, financing and synergies — with every assumption change logged.
metrics:
  - { label: "Accounting rule sets", value: "US GAAP / IFRS" }
  - { label: "Assumption log",       value: "Author + timestamp" }
  - { label: "External share",       value: "Sign-off gated" }
  - { label: "Consideration",        value: "Cash / stock / debt" }
analytics: true
demo:
  output: table
  cta: Build the pro forma
  lead: Set the deal terms. The pro forma is only as good as the synergy and financing assumptions, so stress them and watch the leverage line.
  columns: [Metric, Standalone, Pro forma]
  row_labels: [Revenue, EBITDA, Net debt, Net debt / EBITDA, EPS]
  row_count: 5
  fields:
    - name: price
      type: number
      label: Purchase price
      value: 850000000
      min: 0
      step: 10000000
      unit: USD
    - name: cash_pct
      type: number
      label: Cash consideration
      value: 60
      min: 0
      max: 100
      unit: "%"
    - name: synergies
      type: number
      label: Run-rate synergies
      value: 45000000
      min: 0
      step: 1000000
      unit: USD
    - name: standard
      type: select
      label: Accounting standard
      options: [US GAAP, IFRS]
      value: US GAAP
---

## What it does

Takes target and acquirer financials, purchase price, consideration mix
(cash, stock, debt), financing, and synergies, and returns **pro forma
combined statements**, an ownership split, leverage-impact charts, and a
purchase-accounting summary. Synergies and financing mix stress live.

## Synergies are an assumption, not an output

The pro forma is arithmetic. The synergy number is a claim about the future,
and it is very often the number that makes a deal clear its hurdle.

So synergies are an explicit, stressable input rather than a line embedded in
the model, and the **assumption audit trail logs every change with author and
timestamp**. When a deal is reviewed later — by a board, an acquirer's own
post-mortem, or a regulator — the question is rarely what the model said. It
is when the synergy assumption moved and who moved it.

Leverage is shown alongside because it is the constraint that binds first: a
deal that clears on EPS accretion and breaches a covenant on net debt to
EBITDA is not a deal.

## Purchase accounting differs by standard

Goodwill, intangible recognition, and their subsequent treatment are not the
same under US GAAP and IFRS, and the difference flows straight into pro forma
earnings. The rule set is **version-controlled per jurisdiction**, so a model
states which standard produced it rather than leaving a reader to infer it.

## Sign-off before it leaves the building

A merger model shared with a counterparty is a representation. Sharing
externally is gated behind a **review-and-sign-off workflow**, so a draft with
provisional synergies does not reach the other side of a negotiation as though
it were settled.

## Pricing

**Enterprise** tier, at $499/month.
