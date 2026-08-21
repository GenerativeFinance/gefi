---
title: Carry Trade Optimizer
slug: carry-trade-optimizer
category: Trading / Directional
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU, SG]
lead: Rate and yield differentials scored against volatility, with crash risk shown as a warning panel rather than a footnote. Signals only.
metrics:
  - { label: "Carry score",    value: "Volatility-adjusted" }
  - { label: "Crash risk",     value: "Prominent, not footnoted" }
  - { label: "Sizing",         value: "Guardrail library" }
  - { label: "Execution",      value: "Yours, not ours" }
analytics: true
demo:
  output: score
  cta: Score the carry
  lead: The score is carry adjusted for volatility. Read it next to the crash-risk driver — raw carry is the number that gets people hurt.
  score_label: Adjusted carry
  drivers: [Rate differential, Realised volatility, Crash risk, Liquidity]
  fields:
    - name: pair
      type: select
      label: Pair
      options: [AUD/JPY, NZD/JPY, USD/TRY, MXN/JPY, EUR/CHF]
      value: AUD/JPY
    - name: horizon
      type: number
      label: Horizon
      value: 3
      min: 1
      max: 24
      unit: months
    - name: leverage
      type: number
      label: Leverage
      value: 3
      min: 1
      max: 20
      unit: x
    - name: hedged
      type: checkbox
      label: Tail-hedged
      value: false
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**. Simulated results do not
> reflect actual trading, carry no guarantee, and are **not indicative of
> future returns**. Hypothetical results benefit from hindsight and exclude
> execution costs and slippage — and backtested carry strategies are especially
> flattered by periods that exclude a major unwind.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## Carry trades unwind violently

This is the warning panel, and it is deliberately not a footnote.

Carry works by borrowing in a low-yielding currency and holding a high-yielding
one, collecting the differential. It produces small, steady, extremely
consistent gains — and it is one of the most reliably profitable trades in
markets **right up until it is not**.

The return distribution is severely negatively skewed: many small wins, then an
occasional loss that erases years of them within days. Risk-off events cause
simultaneous unwinding across everyone holding the same crowded position, and
the exit is narrow because everyone reaches it at once.

A carry backtest that does not contain a major unwind is not evidence. It is a
sample of the periods between unwinds, and it will show a beautiful Sharpe
ratio that describes nothing about the trade's actual risk.

## Why the score is volatility-adjusted

Raw differential is the number that gets people hurt. The currencies offering
the widest carry generally offer it *because* they carry meaningful risk —
inflation, political instability, capital-flight potential — and that risk is
priced into the rate.

The score therefore divides carry by the volatility being accepted for it, and
the **crash-risk driver** sits alongside because volatility alone understates
tail risk in a negatively-skewed distribution. Two pairs with identical
realised volatility can have very different crash profiles.

## Sizing guardrails, and leverage

Leverage is available in the demo because carry is almost always run levered —
the unlevered differential is small. That is exactly what converts a
manageable drawdown into a wipeout during an unwind.

Position-sizing guardrails are maintained as a library rather than left to the
subscriber's judgement in the moment, and the crash-risk model is recalibrated
after major risk-off events.

## Pricing

**Pro** plan and above, at $199/month.
