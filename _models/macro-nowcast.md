---
title: Macro Nowcast
slug: macro-nowcast
category: Macro / Investing
featured: true
risk: medium
maturity: Beta
federated: false
price: 149
jurisdictions: [US, UK, EU]
lead: Real-time nowcast of US, UK, and EU GDP, CPI, and unemployment from high-frequency alternative data.
metrics:
  - { label: "GDP RMSE (vs final)", value: "0.32 pp" }
  - { label: "CPI RMSE (vs final)", value: "0.21 pp" }
  - { label: "Median refresh",      value: "15 min" }
  - { label: "Geographies",         value: "US, UK, EU" }
analytics: true
demo:
  output: curve
  live: true
  refreshed: true
  cta: Run the nowcast
  lead: Pick a geography and indicator — the nowcast line re-renders as you switch, against the last confirmed print. The timestamp shows the refresh cadence the real-time claim rests on.
  series_label: Nowcast
  chart_label: Nowcast vs last confirmed print
  x_labels: [12 refreshes ago, latest]
  reference:
    label: Last confirmed print
    field: vs_print
  fields:
    - name: geography
      type: select
      label: Geography
      options: [US, UK, EU]
      value: US
    - name: indicator
      type: select
      label: Indicator
      options: [GDP, CPI, Unemployment]
      value: GDP
    - name: window
      type: number
      label: Refresh window
      value: 12
      min: 4
      max: 48
      unit: refreshes
    - name: vs_print
      type: checkbox
      label: Overlay last confirmed print
      value: true
---

## What it does

Produces a rolling estimate of the next print of GDP, CPI, and unemployment
for the US, UK, and EU, built from card spend, payroll, web-scraped pricing,
and energy demand. The estimate refreshes every 15 minutes, so the figure you
act on is minutes old rather than weeks old.

Pick a geography and indicator and the nowcast renders against the **last
confirmed print**, so the gap between the model's current estimate and the
last official number is visible rather than inferred.

## Methodology

Each indicator is nowcast from a distinct feed mix, weighted by how well that
feed has tracked the official series historically rather than by how current
it is. A fast feed that has never predicted anything is worth less than a
slower one that has.

The feeds are:

- **Card spend** — consumption proxy, strongest signal for GDP and retail-heavy
  CPI baskets.
- **Payroll** — employment and wage proxy, the primary input to unemployment.
- **Web-scraped pricing** — goods-price proxy for CPI, refreshed continuously.
- **Energy demand** — industrial-activity proxy, a leading input to GDP.

Every feed carries last-successful-pull timestamps, and a stale feed degrades
its own weight rather than silently propagating an old reading into a current
estimate.

## Track record

The published metric is **RMSE against the final print**, not against the first
release — first releases are themselves revised, and scoring against them
flatters a nowcast. Once an official release lands, each nowcast is reconciled
against the actual print and the result is added to the track record.

Because revisions are part of the record, a model that tracks first releases
closely but final prints poorly is visible as such.

## Data-source attribution

Alternative-data feeds are licensed, and per-feed attribution is published with
each nowcast so a user can see which sources are behind a given estimate.
Additional geographies and indicators enter through a request backlog, which is
prioritised rather than served first-come.

## Pricing

**Pro** plan and above, at $149/month. Enterprise customers can request
additional geographies and indicators on a custom basis.
