---
title: Global Macro Signal Engine
slug: global-macro-signal-engine
category: Trading / Directional
featured: false
risk: medium
maturity: Beta
federated: true
price: 199
jurisdictions: [US, UK, EU, SG]
lead: Theme-driven position signals across currencies, rates and indices with macro-data citations, benchmarked against federated consensus positioning. Signals only.
metrics:
  - { label: "Themes",        value: "Growth / inflation / policy" }
  - { label: "Citations",     value: "Per signal" }
  - { label: "Consensus",     value: "Federated positioning" }
  - { label: "Execution",     value: "Yours, not ours" }
analytics: true
demo:
  output: table
  cta: Generate signals
  lead: Signals are grouped by theme with the macro data behind each. The consensus column matters most when you disagree with it.
  columns: [Theme, Signal, vs consensus]
  row_labels: [Growth divergence, Inflation surprise, Policy divergence, Terms of trade, Risk sentiment]
  row_count: 5
  fields:
    - name: asset
      type: select
      label: Asset class
      options: [FX majors, Rates, Equity indices]
      value: FX majors
    - name: horizon
      type: select
      label: Horizon
      options: [1 month, 3 months, 6 months]
      value: 3 months
    - name: theme
      type: select
      label: Primary theme
      options: [Growth, Inflation, Policy divergence, All]
      value: All
    - name: consensus
      type: checkbox
      label: Show federated consensus positioning
      value: true
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**. Simulated results do not
> reflect actual trading, carry no guarantee, and are **not indicative of
> future returns**. Hypothetical results benefit from hindsight and exclude
> execution costs and slippage.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Returns **macro-view-driven position signals** across currencies, rates, and
indices, organised by theme — growth, inflation, policy divergence — with
**supporting macro-data citations** for each, plus a **federated positioning
benchmark** against anonymised consensus.

## Every signal cites its data

A macro signal without its evidence is an opinion with a number attached. Each
signal links to the macro releases and data behind it, so a subscriber can
check whether they read the same data the same way.

That matters more in macro than elsewhere: the same inflation print supports
opposite trades depending on what was already priced, and a signal is only
usable if you can see which interpretation it took.

## Consensus is most useful when you disagree with it

The federated benchmark shows how a view compares with anonymised positioning
across participants. The naive reading is confirmation — comfort that others
agree.

The more valuable reading is the opposite. **Crowded positioning is fragile
positioning.** A trade everyone already holds has limited marginal buyers and
violent unwinds when the thesis is questioned, and consensus is often most
extreme immediately before it breaks.

So consensus is presented as context on positioning risk rather than as
validation. A signal that agrees with heavy consensus is not thereby a better
trade; it is a more crowded one.

## Themes rather than instruments

Signals are grouped by **theme** because macro trades express a view, and the
same view can be expressed through several instruments with different carry,
liquidity, and convexity. Grouping by theme keeps the thesis and its
expression separable — a subscriber who agrees with the view but not the
instrument can act on the first without the second.

## Pricing

**Pro** plan and above, at $199/month. Federated positioning requires
participant onboarding.
