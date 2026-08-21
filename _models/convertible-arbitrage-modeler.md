---
title: Convertible Arbitrage Modeler
slug: convertible-arbitrage-modeler
category: Trading / Arbitrage
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: The implied-vol gap between a convertible's embedded option and the equity options market, a delta-hedge ratio, and credit-spread sensitivity. Signals only.
metrics:
  - { label: "Vol gap",         value: "Embedded vs listed" }
  - { label: "Hedge ratio",     value: "Delta-calculated" }
  - { label: "Credit sensitivity", value: "Charted" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: table
  cta: Model the convertible
  lead: The vol gap is the trade. The credit sensitivity is the risk that gap ignores if the position isn't hedged for it too.
  columns: [Driver, Sensitivity, Contribution]
  row_labels: [Implied vol gap, Delta hedge slippage, Credit spread, Interest rate, Call risk]
  row_count: 5
  fields:
    - name: conversion_price
      type: number
      label: Conversion price
      value: 42
      min: 0
      step: 0.5
      unit: USD
    - name: coupon
      type: number
      label: Coupon
      value: 2.25
      min: 0
      max: 15
      step: 0.05
      unit: "%"
    - name: credit_spread
      type: number
      label: Credit spread
      value: 340
      min: 0
      max: 2000
      step: 10
      unit: bp
    - name: hedge_ratio
      type: number
      label: Delta hedge ratio
      value: 0.55
      min: 0
      max: 1
      step: 0.01
---

> **Hypothetical performance.** Every backtest, sensitivity figure, and return
> number on this page is **simulated and hypothetical**, not indicative of
> future returns, and excludes execution costs and financing costs on the
> hedge.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Takes a convertible bond and returns the **implied-volatility gap** between
its embedded option and the underlying equity or listed-options market, a
**delta-hedge ratio**, and a **credit-spread sensitivity chart**.

## Convertible arb depends on credit as much as volatility

This is the single most important thing to understand about the strategy, and
it is stated directly on the page rather than assumed.

The classic version of the trade — long the convertible, short delta-hedged
equity — captures the vol gap only if the bond's credit risk is separately
managed. When an issuer's credit deteriorates, the bond falls in ways an equity
hedge does not offset at all, because credit risk and equity-option risk are
different exposures that happen to sit in the same instrument.

That is precisely the mechanism that produced the strategy's worst historical
periods: credit spreads widening sharply while equity vol hedges did their job
perfectly and still left the position underwater. The credit-spread
sensitivity chart is there specifically so the position's credit exposure is
visible, not implied by the vol trade looking clean.

## The hedge ratio needs constant recalculation

Delta is not static. As the underlying moves, the hedge ratio drifts, and a
convertible's delta is additionally nonlinear near the conversion price in a
way a straight option is not, because the bond floor changes what the
convertible behaves like at different equity levels.

Hedge recalculation is scheduled rather than left to be noticed, since a stale
hedge in a fast-moving name is a directionally exposed position wearing the
label of a hedged one.

## Terms and credit events

Conversion ratio, call protection, and credit terms come from a maintained
**terms database**, and a credit-event alert feed covers issuers in the tracked
universe — the trigger for exactly the risk described above.

## Pricing

**Pro** plan and above, at $199/month.
