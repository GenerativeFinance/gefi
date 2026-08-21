---
title: Strategy Construction Engine
slug: strategy-construction-engine
category: Trading / Infrastructure
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: The pipeline the other trading models sit on — plug in any alpha signal, configure risk, cost and construction models, and get final position sizes. Signals only.
metrics:
  - { label: "Signal input",    value: "Yours or any GeFi model" }
  - { label: "Cost models",     value: "Flat / linear / piecewise / quadratic" }
  - { label: "Volatility",      value: "GARCH / EGARCH, live" }
  - { label: "Config history",  value: "Versioned" }
analytics: true
demo:
  output: table
  cta: Construct the portfolio
  lead: Same alpha signal, different cost model, different portfolio. The pipeline configuration matters as much as the signal it processes.
  columns: [Position, Raw signal, Final size]
  row_labels: [Position 1, Position 2, Position 3, Position 4, Position 5]
  row_count: 5
  fields:
    - name: signal
      type: select
      label: Alpha signal
      options: [Own signal (upload), Multifactor Ranking, Momentum Screener, Trend Following]
      value: Multifactor Ranking
    - name: cost_model
      type: select
      label: Transaction-cost model
      options: [Flat, Linear, Piecewise-linear, Quadratic]
      value: Piecewise-linear
    - name: gross_limit
      type: number
      label: Gross exposure limit
      value: 200
      min: 0
      max: 1000
      unit: "%"
    - name: vol_model
      type: select
      label: Volatility model
      options: [GARCH, EGARCH]
      value: EGARCH
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**, not indicative of future
> returns.

## Signals only

This model produces **position recommendations for the subscriber's own
execution**. GeFi does not place orders, route orders, or hold client assets.

## What it does

The pipeline every other trading model in the catalogue sits on top of. A
subscriber plugs in **any alpha signal** — their own, or another GeFi trading
model's output — then configures a **risk model** (exposure limits), a
**transaction-cost model** (flat, linear, piecewise-linear, or quadratic),
and a **portfolio-construction step**, and receives final position sizes.
**GARCH/EGARCH-estimated volatility** feeds the risk model live.

## The signal is half the strategy; this is the other half

A good alpha signal naively sized is routinely a losing strategy. The distance
between "this ranks securities well" and "this makes money after costs at the
size you can actually trade" is exactly the pipeline this engine implements —
and it is where a large share of quant effort actually goes, invisibly,
inside every firm that does this well.

Making the pipeline explicit and configurable does two things: it lets a
subscriber apply institutional-grade construction to their own signal, and it
makes visible how much the *construction choices* change the outcome. The
demo exists to show precisely that — the same signal through a quadratic cost
model versus a flat one produces materially different books, because the
quadratic model correctly punishes concentration in less-liquid names.

## Why the cost model has four shapes

Flat costs are honest only for small orders in liquid names. Linear captures
proportional spread costs. Piecewise-linear reflects tiered liquidity.
Quadratic models market impact that grows with participation — the right
choice at institutional size, and the difference between them is not academic:
the cost model determines how aggressively the optimiser trades the signal,
which is often the single biggest driver of realised-versus-backtested
performance.

## Every day's positions are auditable to their configuration

Pipeline configuration is **version-historied**, so a subscriber can audit
exactly which combination of risk, cost, and construction models produced a
given day's positions. "Why did the book look like that on Tuesday" is a
question with a recorded answer, not a reconstruction.

## Pricing

**Pro** plan and above, at $199/month.
