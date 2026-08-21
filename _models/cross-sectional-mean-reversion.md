---
title: Cross-Sectional Mean Reversion
slug: cross-sectional-mean-reversion
category: Trading / Directional
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Securities ranked by short-term overreaction with a reversion half-life per name. Signals only — GeFi does not place or route orders.
metrics:
  - { label: "Ranking",         value: "Overreaction score" }
  - { label: "Half-life",       value: "Per name" }
  - { label: "Regime monitor",  value: "Trending vs reverting" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: table
  cta: Rank the universe
  lead: Names ranked by deviation from mean, with an estimated half-life. A wide deviation with a long half-life is a slow trade, not a good one.
  columns: [Security, Deviation, Half-life]
  row_labels: [Name A, Name B, Name C, Name D, Name E]
  row_count: 5
  fields:
    - name: universe
      type: select
      label: Universe
      options: [S&P 500, Russell 2000, STOXX 600, FTSE 350]
      value: S&P 500
    - name: lookback
      type: number
      label: Deviation window
      value: 5
      min: 1
      max: 60
      unit: days
    - name: holding
      type: number
      label: Holding period
      value: 5
      min: 1
      max: 60
      unit: days
    - name: neutral
      type: checkbox
      label: Sector-neutralise
      value: true
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**. Simulated results do not
> reflect actual trading, carry no guarantee, and are **not indicative of
> future returns**. Hypothetical results benefit from hindsight and exclude
> execution costs and slippage, which fall especially heavily on short-holding-
> period strategies like this one.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Returns a **ranked table of securities by short-term overreaction score**, with
a **reversion half-life estimate** per name and a scatter of recent deviation
against historical mean, plus a holding-period control.

## Half-life is what makes the ranking usable

Deviation alone identifies what has moved. It does not say whether it will come
back, or when.

**Half-life** estimates how quickly a name has historically reverted. A large
deviation with a two-day half-life is a fast, capital-efficient trade. The same
deviation with a thirty-day half-life ties up capital for six times as long for
the same expected move — and over thirty days the assumption that nothing
fundamental has changed becomes much weaker.

Ranking on deviation alone systematically selects into the slow, unreliable
half of the opportunity set, which is why both are shown together.

## The known drawdown profile — stated plainly

**This strategy drags badly in trending regimes.** Mean reversion is a bet that
moves overshoot and come back. When a market trends persistently, that bet is
wrong repeatedly and in the same direction, and losses accumulate rather than
offsetting.

That is not a tail risk or an edge case; it is the strategy's normal behaviour
in a regime that occurs regularly. The **regime monitor** flags shifts from
mean-reverting to trending, which is the single most useful piece of
information for anyone running this — but it detects the shift after it has
begun, not before.

Anyone deploying this should size it expecting extended losing periods in
trending markets.

## Costs matter more here than almost anywhere

A five-day holding period means roughly fifty round trips a year per position.
At that turnover, transaction costs and slippage consume a large share of gross
return, and a backtest ignoring them is describing a strategy nobody can run.

## Pricing

**Pro** plan and above, at $199/month.
