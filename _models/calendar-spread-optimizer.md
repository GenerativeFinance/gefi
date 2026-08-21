---
title: Calendar Spread Optimizer
slug: calendar-spread-optimizer
category: Trading / Arbitrage
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Near/far expiration price differential with a roll-yield estimate and the term-structure regime shown, so the spread's economic driver is visible, not just its value. Signals only.
metrics:
  - { label: "Roll yield",       value: "Estimated" }
  - { label: "Regime",           value: "Contango / backwardation" }
  - { label: "Feed health",      value: "Per underlying" }
  - { label: "Execution",        value: "Yours, not ours" }
analytics: true
demo:
  output: curve
  cta: Analyse the term structure
  lead: The curve is the term structure. Whether the spread is a good trade depends on why it's shaped this way, not just what it currently pays.
  series_label: Futures price
  chart_label: Term structure across expirations
  x_labels: [Front month, Back month]
  fields:
    - name: underlying
      type: text
      label: Underlying
      value: WTI Crude
      placeholder: e.g. WTI Crude
    - name: near_month
      type: number
      label: Near-dated contract
      value: 1
      min: 1
      max: 24
      unit: months out
    - name: far_month
      type: number
      label: Far-dated contract
      value: 6
      min: 2
      max: 36
      unit: months out
    - name: contract_type
      type: select
      label: Contract type
      options: [Futures, Options]
      value: Futures
---

> **Hypothetical performance.** Every roll-yield figure and backtest on this
> page is **simulated and hypothetical** and not indicative of future returns.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Returns the **price differential between near- and far-dated expirations**, a
**roll-yield estimate**, and a **term-structure chart** showing whether the
market is in contango or backwardation.

## The current spread value is not the point — its driver is

Two calendar spreads can trade at an identical differential for entirely
different reasons, and those reasons determine whether the spread is likely to
persist, widen, or collapse.

**Contango** — far months priced above near — typically reflects storage cost
and financing carry in a physical commodity, and is the normal state for many
markets. **Backwardation** — near months priced above far — often reflects
near-term scarcity or supply stress, and tends to be less stable, since acute
tightness resolves.

Trading calendar spreads without distinguishing these is trading the number
without understanding the mechanism producing it. The term-structure chart
exists specifically to make the regime visible, and a classifier tags it
automatically so a subscriber does not have to infer contango versus
backwardation by eye from a wobbly curve.

## Roll yield is the return the differential implies

Roll yield estimates the return earned (or paid) from rolling a position
forward as contracts approach expiry — the actual economic consequence of
holding a spread through time rather than the differential's snapshot value.
It is where the calendar spread's carry actually shows up in realised P&L, and
the backtest library evaluates it historically rather than only at the current
spread value.

## Pricing

**Pro** plan and above, at $199/month.
