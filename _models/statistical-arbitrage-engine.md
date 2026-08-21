---
title: Statistical Arbitrage Engine
slug: statistical-arbitrage-engine
category: Trading / Arbitrage
featured: false
risk: medium
maturity: Beta
federated: true
price: 199
jurisdictions: [US, UK, EU]
lead: Cointegration-tested basket trades with a market-neutral beta confirmation, and a federated crowding score — stat-arb edges decay fast once crowded. Signals only.
metrics:
  - { label: "Cointegration test", value: "Engle-Granger / Johansen" }
  - { label: "Target beta",        value: "~0" }
  - { label: "Holding period",     value: "Hours to days" }
  - { label: "Crowding",           value: "Federated score" }
analytics: true
demo:
  output: table
  cta: Find baskets
  lead: Baskets pass a cointegration test before anything else. The crowding score matters as much as the edge — a great basket everyone runs is a mediocre basket.
  columns: [Basket, Test statistic, Net beta]
  row_labels: [Basket A, Basket B, Basket C, Basket D, Basket E]
  row_count: 5
  fields:
    - name: universe
      type: select
      label: Universe
      options: [US equities, EU equities, Sector ETFs, Global futures]
      value: US equities
    - name: test
      type: select
      label: Cointegration test
      options: [Engle-Granger, Johansen]
      value: Johansen
    - name: basket_size
      type: number
      label: Basket size
      value: 4
      min: 2
      max: 20
    - name: max_beta
      type: number
      label: Max residual beta
      value: 0.05
      min: 0
      max: 0.5
      step: 0.01
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**. Simulated results do not
> reflect actual trading, carry no guarantee, and are **not indicative of
> future returns**. Hypothetical results benefit from hindsight and exclude
> execution costs and slippage.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Constructs **cointegration-tested basket trades** — Engle-Granger or Johansen —
with a **target beta near zero**, an expected holding period of hours to days,
and a **federated crowding score** showing how many other subscribers run
correlated baskets.

## Crowding is disclosed because stat-arb decays fastest of anything here

Statistical arbitrage edges are typically small and short-lived, and they decay
specifically **because they are found and traded**. A basket that works is
discovered by more participants, spreads compress faster as more capital
chases the same mispricing, and the edge that justified the trade shrinks
toward the transaction cost of capturing it.

That makes crowding not a side detail but close to the whole risk. The
federated score is computed across participants running this model, and a
basket flagged as heavily crowded should be read as *approaching the end of
its useful life*, independent of how good its historical statistics look.

## The cointegration test is the gate, not a footnote

A basket only qualifies if it passes Engle-Granger or Johansen testing for a
stable long-run relationship. Correlation is not cointegration: two series can
correlate strongly while drifting apart permanently, and trading that
relationship as if it reverts is the most common way this strategy class
loses money on names that only *looked* related.

## Beta-neutrality is monitored, not assumed

The basket is constructed for near-zero net beta, and that neutrality is
**monitored continuously** rather than assumed to hold from construction.
Individual holdings' betas drift, and a basket that started market-neutral can
develop directional exposure it was never meant to carry — at which point it
is no longer the trade it was sized as.

## Pricing

**Pro** plan and above, at $199/month. Federated crowding data requires
participant onboarding.
