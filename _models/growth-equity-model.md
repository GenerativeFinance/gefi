---
title: Growth Equity Model
slug: growth-equity-model
category: Venture / Growth
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Dilution, growth-and-margin forecast, and investor IRR/MOIC across exit scenarios, with preferred terms modelled rather than assumed away.
metrics:
  - { label: "Preferred terms",  value: "Template library" }
  - { label: "Primary/secondary", value: "Split modelled" }
  - { label: "Downside library", value: "Team-shared" }
  - { label: "Export",           value: "IC-ready" }
analytics: true
demo:
  output: table
  cta: Model the round
  lead: Set entry and terms. Returns are shown per exit scenario — a liquidation preference changes the investor's outcome far more than the headline valuation does.
  columns: [Exit scenario, Investor MOIC, Founder proceeds]
  row_labels: [Downside, Base, Upside, Strong upside, Distressed]
  row_count: 5
  fields:
    - name: entry_val
      type: number
      label: Entry valuation
      value: 220000000
      min: 0
      step: 5000000
      unit: USD
    - name: check
      type: number
      label: Investment
      value: 45000000
      min: 0
      step: 1000000
      unit: USD
    - name: secondary_pct
      type: number
      label: Secondary share
      value: 30
      min: 0
      max: 100
      unit: "%"
    - name: pref
      type: select
      label: Liquidation preference
      options: [1x non-participating, 1x participating, 1.5x non-participating]
      value: 1x non-participating
---

## What it does

Takes entry valuation, the primary/secondary proceeds split, ownership, and
preferred terms, and returns a **dilution table**, a revenue-growth and
margin-expansion forecast, and **investor IRR and MOIC across exit-valuation
scenarios**, with a cap-table snapshot and an IC-ready summary.

## Preferred terms often matter more than price

A growth round is usually negotiated on valuation, but the investor's actual
return is determined jointly by valuation and the preference structure — and
in the scenarios that matter most, the structure dominates.

Under a 1x participating preference the investor takes their money back and
then shares in the remainder; under 1x non-participating they choose the better
of preference or conversion. At a strong exit the two converge. At a mediocre
one they diverge sharply, and that is precisely the range where most growth
investments actually land.

So preferences are modelled explicitly across the scenario set rather than
folded into an assumed return. A higher headline valuation with a heavier
preference can be worse for founders than a lower one clean, and the table is
built to make that visible on both sides.

## Primary and secondary are different transactions

Primary capital enters the company and funds growth. Secondary buys out
existing holders and does not. They dilute identically but have entirely
different effects on the forecast the investment case rests on.

The split is therefore an input, not an aggregate: a round that is largely
secondary should not be modelled as though the full cheque is fuelling the
revenue plan.

## Downside scenarios are shared, not per-deal

The stress library is maintained across the team rather than constructed per
deal, because a downside case invented alongside the investment case tends to
be calibrated to survive it. A shared library applies the same stress to every
deal and makes cross-deal comparison meaningful.

## Pricing

**Pro** plan and above, at $199/month.
