---
title: Pairs Trading Engine
slug: pairs-trading-engine
category: Trading / Arbitrage
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Cointegration-tested pairs with a live spread z-score against entry/exit bands, and a signal when the spread crosses threshold. Signals only.
metrics:
  - { label: "Cointegration test", value: "Engle-Granger / Johansen" }
  - { label: "Half-life",          value: "Monitored" }
  - { label: "Discovery",          value: "Continuous scan" }
  - { label: "Execution",          value: "Yours, not ours" }
analytics: true
demo:
  output: curve
  cta: Analyse the pair
  lead: The curve is the spread against its mean, with entry and exit bands. The trade is the deviation, not either leg alone.
  series_label: Spread z-score
  chart_label: Spread vs mean, in std deviations
  x_labels: [60d ago, Today]
  fields:
    - name: pair
      type: text
      label: Pair
      value: KO / PEP
      placeholder: e.g. KO / PEP
    - name: lookback
      type: number
      label: Lookback
      value: 90
      min: 20
      max: 500
      unit: days
    - name: entry_z
      type: number
      label: Entry threshold
      value: 2.0
      min: 0.5
      max: 4
      step: 0.1
      unit: "z"
    - name: exit_z
      type: number
      label: Exit threshold
      value: 0.5
      min: 0
      max: 2
      step: 0.1
      unit: "z"
---

> **Hypothetical performance.** Every backtest, z-score history, and return
> figure on this page is **simulated and hypothetical**. Simulated results do
> not reflect actual trading, carry no guarantee, and are **not indicative of
> future returns**.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Tests a sector or security pair for **cointegration**, tracks the current
spread against its historical mean as a **z-score**, and signals long/short
when the spread crosses an entry threshold — with entry and exit bands
overlaid on the spread chart.

## The trade is the spread, not either name

The chart plots the spread, not the two prices, because the spread is the
actual position: long one leg, short the other, and the P&L depends only on
their relationship converging, not on either moving in absolute terms. A trader
reading two overlaid price lines tends to reason about direction; the spread
chart forces the correct frame, which is relative value.

Entry and exit bands are shown explicitly rather than implied by a rule buried
in documentation, because the discipline of a pairs trade is almost entirely in
respecting the exit — closing near the mean rather than holding for a bigger
reversion that may not come.

## Half-life tells you if the relationship still works

**Reversion half-life** is monitored per pair, because cointegration found
historically is not guaranteed to persist — a merger, a business-model
divergence, or a structural change in either company can permanently break a
relationship that reverted reliably for years.

A pair whose half-life has been drifting longer is flagged, since a slowing
reversion is usually the earliest sign the relationship is weakening before it
fails a cointegration test outright.

## New pairs are found continuously

The **discovery job** scans the universe on a schedule rather than relying on
a static, manually curated pair list. Relationships that qualify today did not
necessarily qualify a year ago, and a fixed list ages out of relevance as
industries and capital structures change.

## Pricing

**Pro** plan and above, at $199/month.
