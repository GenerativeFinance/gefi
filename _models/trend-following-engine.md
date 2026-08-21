---
title: Trend Following Engine
slug: trend-following-engine
category: Trading / Directional
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Moving-average crossover and breakout trend signals with a live equity curve and per-instrument signal strength. Signals only — GeFi does not place or route orders.
metrics:
  - { label: "Realistic Sharpe",  value: "0.5 – 1.0" }
  - { label: "Signal decay",      value: "Monitored" }
  - { label: "Crowding",          value: "Flagged" }
  - { label: "Execution",         value: "Yours, not ours" }
analytics: true
demo:
  output: curve
  cta: Generate signals
  lead: Move the lookback and the equity curve redraws. Note how much the result depends on a parameter with no theoretically correct value.
  series_label: Equity curve
  chart_label: Hypothetical equity curve — simulated
  x_labels: [Start, Latest]
  fields:
    - name: universe
      type: select
      label: Universe
      options: [Global futures, US equities, FX majors, Commodities]
      value: Global futures
    - name: lookback
      type: number
      label: Lookback window
      value: 120
      min: 10
      max: 400
      unit: days
    - name: signal
      type: select
      label: Signal type
      options: [MA crossover, Breakout, Both]
      value: MA crossover
    - name: vol_target
      type: number
      label: Volatility target
      value: 12
      min: 1
      max: 40
      unit: "%"
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, equity curve, and
> return figure on this page is **simulated and hypothetical**. Simulated
> results do not reflect actual trading, carry no guarantee, and are **not
> indicative of future returns**. Hypothetical results benefit from hindsight
> and do not account for execution costs, slippage, or the discipline required
> to follow a system through drawdown.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, hold client assets, or exercise discretion over
any account. What you do with a signal is entirely yours.

## What it does

Takes an instrument or universe and returns **moving-average crossover and
breakout trend signals**, with a live equity curve, a **signal-strength gauge**
per instrument, and a lookback slider.

## The honest Sharpe range is 0.5 – 1.0

That range is published deliberately. Trend following is a real and durable
premium with decades of evidence behind it, and it produces **modest**
risk-adjusted returns punctuated by long, deep drawdowns.

Any presentation of trend following with a Sharpe above roughly 1.0 is almost
certainly overfitted, ignoring costs, or backtested on a period selected after
the fact. Publishing the realistic range is more useful than publishing an
impressive one, because a subscriber who expects 2.0 abandons the system during
the drawdown that a 0.7 strategy inevitably delivers — and abandoning it in
drawdown is how trend followers lose money.

## The lookback slider is a warning as much as a feature

There is no theoretically correct lookback. Moving the slider changes the
equity curve substantially, and picking the window that produces the best
backtest is the textbook overfit.

Making it interactive shows how much of any backtest is parameter selection.
The right use is to check that a strategy works across a *range* of lookbacks;
a strategy that only works at 120 days and fails at 100 and 140 has found noise.

## Decay and crowding

Signal decay is monitored as **Sharpe drift against the backtest baseline** per
instrument class. The **crowding indicator** flags when many subscribers run
correlated parameter sets on the same universe — a crowded trend signal has
worse fills and sharper reversals, and that is a cost borne by the people
running it.

## Pricing

**Pro** plan and above, at $199/month.
