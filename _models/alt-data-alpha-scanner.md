---
title: Alternative Data Alpha Scanner
slug: alt-data-alpha-scanner
category: Trading / ML & Alt-Data
featured: false
risk: medium
maturity: Beta
federated: true
price: 199
jurisdictions: [US, UK, EU]
lead: Alpha scores from satellite foot traffic, card-spend panels, and web trends, with per-source contribution and aggregate-only federated pooling. Signals only.
metrics:
  - { label: "Sources",         value: "Satellite / card / web" }
  - { label: "Contribution",    value: "Per source" }
  - { label: "Federation",      value: "Aggregate-only, audited" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: score
  cta: Scan the ticker
  lead: The score decomposes by source. Alt-data signals decay as coverage spreads — the per-source decay tracker is what tells you which inputs still carry information.
  score_label: Alpha score
  drivers: [Satellite foot traffic, Card-spend panel, Web traffic, Source freshness]
  fields:
    - name: ticker
      type: text
      label: Security
      value: SBUX
      placeholder: Ticker
    - name: sector
      type: select
      label: Sector
      options: [Consumer / retail, Industrials, Energy, Real estate]
      value: Consumer / retail
    - name: sources
      type: select
      label: Sources
      options: [All available, Satellite only, Card spend only, Web only]
      value: All available
    - name: federated
      type: checkbox
      label: Include federated coverage
      value: true
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**, not indicative of future
> returns.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Builds an **alpha score** from non-traditional inputs — satellite-imagery foot
traffic, aggregated card-spend panels, web-traffic trends — with a
**per-source contribution breakdown** and a federated coverage badge showing
which sources are pooled across subscribers.

## The federation is aggregate-only, and that is audited

Alt-data is licensed data, and the raw feeds carry both contractual and
privacy constraints. The federation pools **anonymised aggregates only** —
raw alt-data never leaves its provider, and an **aggregation-anonymisation
audit** confirms that continuously rather than asserting it once.

What pooling buys is **signal density**: a single subscriber's card-spend
panel covers a slice of consumer activity; pooled aggregate coverage across
subscribers covers meaningfully more, without any participant seeing another's
underlying data. Licensing status is monitored per provider, since an
alt-data signal built on a lapsed licence is a compliance problem wearing an
alpha label.

## Alt-data decays in a specific, trackable way

Every alt-data source follows the same lifecycle: novel and informative,
then increasingly well-known, then priced in. Satellite parking-lot counts
were once genuine edge; today they are broadly available and mostly reflected
in prices within hours of release.

The **per-source decay tracker** measures this directly — how much predictive
power each source retains as its coverage becomes widely known — so the
contribution breakdown reflects what a source is worth *now* rather than what
it was worth when the marketing deck was written. A source whose decay curve
has flattened to zero is disclosed as such, not quietly retained for the
length of its contract.

## Pricing

**Pro** plan and above, at $199/month. Federated coverage requires
participant onboarding.
