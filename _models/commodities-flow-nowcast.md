---
title: Commodities Flow Nowcast
slug: commodities-flow-nowcast
category: Macro
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU, UAE, SG]
lead: Nowcasts physical commodity flows across energy, metals, and agriculture from satellite, AIS, and customs-manifest data, with a price-impact estimate per corridor.
metrics:
  - { label: "Live corridors",      value: "84" }
  - { label: "Median data age",     value: "6 h" }
  - { label: "Flow RMSE (vs realized)", value: "7.4%" }
  - { label: "Regions",             value: "US, UK, EU, UAE, SG" }
analytics: true
demo:
  output: curve
  cta: Nowcast the flow
  lead: Pick a commodity class and corridor. The curve is the flow nowcast; freshness and price impact are reported alongside because a stale flow estimate is worse than none.
  series_label: Flow nowcast
  chart_label: Nowcast flow by week
  x_labels: [12w ago, latest]
  fields:
    - name: commodity
      type: select
      label: Commodity class
      options: [Energy, Metals, Agriculture]
      value: Energy
    - name: corridor
      type: select
      label: Corridor
      options: [Arabian Gulf → Singapore, US Gulf → NW Europe, Brazil → China, Australia → East Asia]
      value: Arabian Gulf → Singapore
    - name: weeks
      type: number
      label: Window
      value: 12
      min: 4
      max: 52
      unit: weeks
    - name: price_impact
      type: checkbox
      label: Include price-impact estimate
      value: true
---

## What it does

Nowcasts physical commodity flows — energy, metals, agriculture — across live
shipping corridors spanning the US, UK, EU, UAE, and Singapore. Inputs are
satellite imagery, AIS vessel tracking, and customs manifests.

Each nowcast carries a **price-impact estimate**: the flow number on its own
is an observation, and what a desk actually needs is what that observation
implies for price.

## Data freshness is part of the output

Satellite revisit intervals and AIS coverage vary by corridor, so a nowcast
for one route may be six hours old while another is three days old. The
**freshness indicator is shown with every figure** rather than buried in
documentation.

This matters more than overall accuracy. A stale flow estimate presented as
current is worse than no estimate, because it looks actionable. Corridors
where coverage has degraded are marked as such rather than quietly
interpolated.

## Reconciliation

Once realized flows are confirmed through customs data, each nowcast is
reconciled against the actual figure and the result enters the published
track record. Reporting nowcast accuracy without that reconciliation would
be reporting a model's confidence in itself.

## Coverage and corridors

Live corridors are published as a coverage map. New corridors enter through
an onboarding pipeline — adding one is a data-acquisition problem (imagery
licensing, AIS coverage, customs access) rather than a modelling one, so
coverage expands deliberately rather than on request.

Analysts annotate flow spikes with **geopolitical event tags**, so a
discontinuity in the series is explained in the record rather than left as an
unexplained jump for a future reader to misinterpret as model error.

## Pricing

**Pro** plan and above, at $199/month. Corridor coverage varies by
subscription; the coverage map reflects what your plan includes.
