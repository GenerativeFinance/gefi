---
title: Multifactor Ranking Engine
slug: multifactor-ranking-engine
category: Trading / Factor
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU]
lead: A composite score blending value, momentum, quality, size and low-volatility factors, with per-factor contribution bars and live-adjustable weights. Signals only.
metrics:
  - { label: "Framework",       value: "Fama-French 3/5-factor" }
  - { label: "Attribution",     value: "Per-factor bars" }
  - { label: "Crowding",        value: "Monitored" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: score
  cta: Rank the security
  lead: The score is a weighted blend. Move a weight and the ranking changes — the bars show exactly which factor is doing the work.
  score_label: Composite score
  drivers: [Value, Momentum, Quality, Size, Low volatility]
  fields:
    - name: universe
      type: select
      label: Universe
      options: [US large-cap, US small-cap, EU equities, UK equities]
      value: US large-cap
    - name: value_weight
      type: number
      label: Value weight
      value: 25
      min: 0
      max: 100
      unit: "%"
    - name: momentum_weight
      type: number
      label: Momentum weight
      value: 25
      min: 0
      max: 100
      unit: "%"
    - name: quality_weight
      type: number
      label: Quality weight
      value: 25
      min: 0
      max: 100
      unit: "%"
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**, not indicative of future
> returns.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Blends **value, momentum, quality, size, and low-volatility** factors — the
Fama-French three- and five-factor framework — into a composite ranking, with
per-factor **contribution bars** and live-adjustable weights that re-rank the
universe as they move.

## Attribution is the deliverable, not the ranking

A rank position on its own is close to useless: it says a security scored
well without saying why, and "why" is what determines whether the ranking
still applies once conditions change. A security ranked highly on momentum
alone behaves completely differently going into a reversal than one ranked
highly on quality alone.

The contribution bars decompose every score into its factor sources, so a
subscriber can see whether a top-ranked name got there on one dominant factor
or a broad blend — and weight adjustment lets them build the specific tilt
they actually want rather than accept a fixed factor mix someone else chose.

## Crowding is what turns a factor into a risk

Factors are not free lunches. A factor's edge exists because it is compensated
risk or a persistent behavioural bias, and **both erode when too much capital
chases the same signal at once** — which is exactly what happened to several
well-known factors after they became widely known and widely implemented.

The crowding monitor tracks how correlated the factor's recent return is to
the broad quant-fund universe. A factor showing strong recent performance
alongside high crowding correlation is a different proposition than the same
performance with low correlation — the first looks like it is being arbitraged
away in real time.

## Pricing

**Starter** plan, at $99/month.
