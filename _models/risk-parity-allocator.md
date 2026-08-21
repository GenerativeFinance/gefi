---
title: Risk Parity Allocator
slug: risk-parity-allocator
category: Trading / Factor
featured: false
risk: medium
maturity: Beta
federated: true
price: 199
jurisdictions: [US, UK, EU]
lead: Asset-class-level allocation where each class contributes equal risk, not equal dollar weight — with the leverage this typically requires disclosed plainly. Signals only.
metrics:
  - { label: "Level",           value: "Asset class, not security" }
  - { label: "Allocation basis", value: "Equal risk contribution" }
  - { label: "Leverage",        value: "Indicator shown" }
  - { label: "Benchmark",       value: "Federated peer allocations" }
analytics: true
demo:
  output: table
  cta: Allocate by risk
  lead: Equal risk, not equal dollars. Bonds typically need leverage to contribute as much risk as equities — that's shown explicitly below, not left implicit.
  columns: [Asset class, Dollar weight %, Risk contribution %]
  row_labels: [Equities, Bonds, Commodities, Currencies, Cash]
  row_count: 5
  fields:
    - name: target_vol
      type: number
      label: Target portfolio volatility
      value: 8
      min: 2
      max: 25
      unit: "%"
    - name: bond_leverage
      type: checkbox
      label: Allow bond-sleeve leverage
      value: true
    - name: rebalance
      type: select
      label: Rebalance frequency
      options: [Monthly, Quarterly]
      value: Monthly
    - name: benchmark
      type: checkbox
      label: Show federated peer benchmark
      value: true
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**, not indicative of future
> returns.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## Asset classes, not securities — a different problem from Portfolio Optimiser

Where the Portfolio Optimiser allocates across a universe of individual
instruments, this model operates one level up: across **equities, bonds,
commodities, and currencies** as whole asset classes, returning a
risk-budgeted allocation where each class contributes **equal risk** rather
than equal dollar weight.

## Equal risk, not equal dollars — and why that changes everything

A traditional 60/40 portfolio is not risk-balanced at all: equities are so
much more volatile than bonds that they typically supply 85–90% of the
portfolio's total risk despite being 60% of its dollar allocation. The bond
sleeve is along for the ride rather than contributing meaningfully to
diversification.

Risk parity inverts the construction: size each asset class so it contributes
**equal risk** to the total, which for bonds usually means a dollar allocation
well above the equity sleeve's.

## The leverage that follows from that, disclosed plainly

Achieving equal risk contribution from bonds against equities' much higher
volatility typically requires **leveraging the bond sleeve** — borrowing to
hold more bonds than unlevered capital would otherwise allow. This is the
mechanism, not a side effect, and the **leverage-required indicator** states it
directly rather than letting an allocation percentage imply an unlevered
portfolio when it is not one.

Leverage means the strategy carries financing cost and margin-call risk that
an unlevered 60/40 does not, and it is precisely why risk parity portfolios
suffered when both equities and bonds sold off together and financing
tightened at the same time — a scenario a purely risk-balanced construction
does not protect against by design.

## Federated benchmark

The peer allocation benchmark is drawn from anonymised participant
allocations, showing where a given risk-parity construction sits relative to
how other institutions running similar mandates are actually positioned.

## Pricing

**Pro** plan and above, at $199/month. Federated benchmarking requires
participant onboarding.
