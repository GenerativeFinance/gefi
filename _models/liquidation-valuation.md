---
title: Liquidation Valuation
slug: liquidation-valuation
category: Valuation
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Asset-by-asset recovery under orderly and distressed sale, with a priority-claims waterfall showing what each stakeholder class actually gets.
metrics:
  - { label: "Scenarios",         value: "Base / down / severe" }
  - { label: "Benchmark library", value: "By asset class" }
  - { label: "Overrides",         value: "Audit-trailed" }
  - { label: "Waterfall",         value: "Priority-ordered" }
analytics: true
demo:
  output: table
  cta: Value the estate
  lead: Load a balance sheet and pick a scenario. Recovery is estimated per asset class, then run through the claims waterfall in priority order.
  columns: [Claim class, Recovery, "% of claim"]
  row_labels: [Secured — senior, Secured — junior, Administrative, Unsecured trade, Equity]
  row_count: 5
  fields:
    - name: scenario
      type: select
      label: Scenario
      options: [Base, Downside, Severe stress]
      value: Downside
    - name: sale
      type: select
      label: Sale type
      options: [Orderly, Distressed]
      value: Distressed
    - name: assets
      type: number
      label: Gross book assets
      value: 42000000
      min: 0
      step: 100000
      unit: USD
    - name: months
      type: number
      label: Liquidation timeline
      value: 9
      min: 1
      max: 60
      unit: months
---

## What it does

Takes a balance sheet and returns **recovery estimates asset by asset** under
orderly and distressed sale, a **sale-cost and priority-claims waterfall**,
secured-versus-unsecured stakeholder recovery, and a liquidation timeline.
Toggling base, downside, or severe stress redraws the stakeholder waterfall.

## Book value is not recovery

The gap between what an asset is carried at and what it fetches in a forced
sale is the entire subject. Receivables collect at a discount that widens once
counterparties learn the seller is winding down. Specialised plant has a thin
buyer pool. Intangibles frequently recover nothing.

Recovery rates come from a **benchmark library by asset class**, maintained by
the risk team rather than assumed, and orderly versus distressed is a real
distinction rather than a haircut applied uniformly: time is the variable that
separates them, which is why the timeline is an input rather than a footnote.

## The waterfall is where the answer lives

Total recovery tells a creditor almost nothing. What matters is recovery
**against their own claim's position** in the priority order, and the waterfall
is deeply non-linear: a modest change in gross recovery can move unsecured
creditors between full payment and nothing while secured recovery does not
move at all.

That is why the scenario toggle redraws the whole waterfall rather than
scaling one number. Sale costs and administrative claims come out first, and
they are large enough in a distressed process to consume the margin junior
classes were counting on.

## Overrides are recorded

Analysts adjust recovery percentages — they know the assets. Every adjustment
is **audit-trailed with its author**, because a liquidation valuation is often
read later by people testing whether the estimate was reached honestly or
reverse-engineered from a desired outcome.

Scenario templates are version-controlled, and engagements link into the
compliance case system.

## Pricing

**Pro** plan and above, at $199/month.
