---
title: RL Execution Agent
slug: rl-execution-agent
category: Trading / ML & Alt-Data
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Reinforcement-learned execution schedules for order slicing, with simulated slippage savings vs TWAP. It schedules slicing — it does not route or execute orders.
metrics:
  - { label: "Scope",           value: "Scheduling, not autonomy" }
  - { label: "Baseline",        value: "vs naive TWAP" }
  - { label: "Audit trail",     value: "Every recommendation" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: curve
  cta: Schedule the order
  lead: The curve is the recommended participation schedule. Slippage savings are simulated against a TWAP baseline — simulated is the operative word.
  series_label: Participation rate
  chart_label: Recommended execution schedule
  x_labels: [Open, Close]
  fields:
    - name: order_size
      type: number
      label: Order size
      value: 250000
      min: 100
      step: 1000
      unit: shares
    - name: adv_pct
      type: number
      label: Order as % of ADV
      value: 8
      min: 0.1
      max: 100
      step: 0.1
      unit: "%"
    - name: urgency
      type: select
      label: Urgency
      options: [Low, Medium, High]
      value: Medium
    - name: benchmark
      type: select
      label: Benchmark
      options: [VWAP, Arrival price, TWAP]
      value: VWAP
---

> **Hypothetical performance.** Every slippage-savings figure and backtest on
> this page is **simulated and hypothetical**, not indicative of future
> results, and comes from a simulated market-impact model — real impact
> depends on conditions no simulation fully captures.

## This schedules order slicing. It does not route or execute orders.

Stated first because the boundary is the product. The agent recommends an
**execution schedule** — how to slice a parent order through the day relative
to VWAP. It does not touch a venue, does not route, does not execute, and has
no autonomy beyond the schedule it prints. The subscriber's own execution
infrastructure acts on the recommendation or ignores it.

This is deliberately **not** full trading-strategy autonomy, and the scope is
narrow on purpose: optimal execution is the one part of the trade lifecycle
where reinforcement learning has a well-posed objective (minimise
implementation cost for a decided trade) rather than an open-ended one.

## What it does

Takes order size and urgency and returns a **recommended execution schedule**
with a **simulated slippage-savings estimate against a naive TWAP baseline**.

## Why the baseline is TWAP, and why "simulated" is doing real work

TWAP — slicing evenly through time — is the honest naive baseline: it is what
you get with no model at all. Beating it is the minimum claim worth making,
and the savings estimate is expressed against it rather than against a
strawman.

But the estimate comes from a **simulated market-impact model**, and market
impact is notoriously hard to simulate: real impact depends on liquidity
conditions, on who else is trading, and on the market's reaction to your own
flow — none of which a simulator fully reproduces. The savings figure is a
model of a model, and the page says so rather than presenting simulated
savings as if they were measured.

## The reward function is a policy choice, exposed as one

The slippage-versus-urgency trade-off is the reward function, and it is
configured per engagement from a library rather than hardcoded — an agent
tuned for patient cost-minimisation produces dangerous schedules for a desk
that actually needs urgency, and vice versa.

Every recommendation writes to an **audit trail**, because this is the model
in the catalogue closest to actual order behaviour, and the standard for
records is set by what the output influences, not by what the model itself
touches.

## Pricing

**Enterprise** tier, at $499/month.
