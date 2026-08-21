---
title: Breakout Signal Engine
slug: breakout-signal-engine
category: Trading / Directional
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Support and resistance levels with a volume-and-follow-through confirmation score, and the false-breakout rate published alongside. Signals only.
metrics:
  - { label: "False-breakout rate", value: "Published" }
  - { label: "Confirmation",        value: "Volume + follow-through" }
  - { label: "Monitored by",        value: "Instrument + vol regime" }
  - { label: "Execution",           value: "Yours, not ours" }
analytics: true
demo:
  output: score
  cta: Score the breakout
  lead: Enter an instrument. The confirmation score is the useful number — a level being broken is common, a break that holds is not.
  score_label: Confirmation
  drivers: [Volume expansion, Follow-through, Level significance, Volatility regime]
  fields:
    - name: instrument
      type: text
      label: Instrument
      value: ES
      placeholder: Ticker or contract
    - name: lookback
      type: number
      label: Level lookback
      value: 60
      min: 5
      max: 400
      unit: days
    - name: vol_mult
      type: number
      label: Volume threshold
      value: 1.8
      min: 1
      max: 10
      step: 0.1
      unit: x average
    - name: regime
      type: select
      label: Volatility regime
      options: [Low, Normal, Elevated]
      value: Normal
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, hit rate, and
> return figure on this page is **simulated and hypothetical**. Simulated
> results do not reflect actual trading, carry no guarantee, and are **not
> indicative of future returns**. Hypothetical results benefit from hindsight
> and exclude execution costs and slippage.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Detects **support and resistance levels** with a live price overlay, scores
**breakout confirmation** from volume and follow-through, and publishes the
**false-breakout rate**.

## The false-breakout rate is published on purpose

Breakout strategies typically have a **hit rate well below 50%**. They work,
when they work, because the winners run much further than the losers cost —
positive expectancy from asymmetric payoff, not from being right often.

Presenting average win size without the hit rate makes the strategy look like
something it is not, and a subscriber who expects to be right most of the time
will abandon it after a normal run of failed breakouts. Publishing the false-
breakout rate up front is the only presentation that sets a usable expectation.

The rate is monitored **by instrument and volatility regime**, because it is
not stable: in elevated volatility, levels break and reverse far more often,
and the same signal has materially different reliability.

## Confirmation is the whole edge

A price crossing a level is common and nearly meaningless on its own. What
distinguishes a breakout that continues is participation — volume expansion
confirming that the move has real flow behind it — and follow-through in the
periods immediately after.

Which is why confirmation is the headline score rather than the level itself,
and why the driver bars separate volume from follow-through: a break on
expanded volume that immediately stalls is a different situation from a quiet
break that keeps grinding.

## Pricing

**Pro** plan and above, at $199/month.
