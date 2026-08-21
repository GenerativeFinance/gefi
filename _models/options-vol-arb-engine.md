---
title: Options Volatility Arbitrage Engine
slug: options-vol-arb-engine
category: Trading / Arbitrage
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Full implied-vol surface with model fits overlaid, a mispricing heatmap by strike and tenor, and Greeks shown alongside every flagged mispricing. Signals only.
metrics:
  - { label: "Models",          value: "Black-Scholes / SABR / Heston" }
  - { label: "Mispricing view", value: "Heatmap by strike/tenor" }
  - { label: "Greeks",          value: "Shown with every flag" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: table
  cta: Scan the surface
  lead: A mispricing without its Greeks is a number you cannot size. Both are shown together, always.
  columns: [Strike / tenor, Mispricing, Vega exposure]
  row_labels: [25-delta put, ATM, 25-delta call, 10-delta put, 10-delta call]
  row_count: 5
  fields:
    - name: underlying
      type: text
      label: Underlying
      value: SPX
      placeholder: Ticker
    - name: expiry
      type: number
      label: Expiry
      value: 45
      min: 1
      max: 730
      unit: days
    - name: model
      type: select
      label: Model fit
      options: [Black-Scholes, SABR, Heston]
      value: SABR
    - name: threshold
      type: number
      label: Mispricing threshold
      value: 1.5
      min: 0.1
      max: 10
      step: 0.1
      unit: "vol pts"
---

> **Hypothetical performance.** Every backtest, mispricing statistic, and
> return figure on this page is **simulated and hypothetical**, not indicative
> of future returns, and excludes hedging costs, bid-ask crossing, and pin
> risk at expiry.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Renders the full **implied-volatility surface** for an underlying and expiry
with **Black-Scholes, SABR, and Heston** fits overlaid, a **mispricing
heatmap** by strike and tenor, and a **Greeks panel** — delta, vega, gamma —
for any flagged mispricing.

## An opportunity without its Greeks is not tradeable

This is why the Greeks panel is not a separate tool a subscriber visits
afterward — it is shown **with every flagged mispricing**, because a vol
"opportunity" is meaningless without knowing how to hedge it and what residual
risk remains after hedging.

A rich vega exposure at a strike nobody wants to be short of gamma into is a
different risk than a small, cleanly hedgeable one, even if both show the same
mispricing in vol points. Presenting the mispricing alone invites sizing it as
though the Greeks do not matter, which is precisely how vol arbitrage
positions turn into unwanted directional or gamma risk.

## Why three models, not one

Black-Scholes assumes constant volatility and is included as the reference
surface everyone already understands. SABR fits skew well at a single expiry.
Heston is a genuine stochastic-volatility process with dynamics across the
whole surface, at the cost of harder calibration.

Where the three models disagree is often more informative than where any one
model flags a mispricing, because model disagreement at a given strike and
tenor is itself a signal about how much confidence to place in that specific
flag. Fit quality — SABR versus Heston versus local-vol residuals — is
monitored continuously, and recalibration triggers when fit degrades rather
than waiting for a scheduled refresh.

## Exposure is aggregated across the whole book

The Greeks-exposure dashboard aggregates across everything a tenant has
modelled, not one position at a time, because vol arbitrage risk compounds at
the book level — several individually small vega positions in the same
underlying can add up to a concentration nobody sized deliberately.

## Pricing

**Enterprise** tier, at $499/month.
