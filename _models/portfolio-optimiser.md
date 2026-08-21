---
title: Portfolio Optimiser
slug: portfolio-optimiser
category: Optimisation / Investing
featured: true
risk: medium
maturity: GA
federated: true
price: 199
jurisdictions: [US, UK, EU, UAE]
lead: Mean-variance + Black-Litterman + risk-parity optimiser with federated views from anonymised institutional positioning data.
metrics:
  - { label: "Universe size",      value: "10,000+" }
  - { label: "Median solve time",  value: "240 ms" }
  - { label: "Backtest CAGR (60/40)", value: "+1.8 pp" }
  - { label: "Federated participants", value: "27" }
analytics: true
demo:
  output: table
  cta: Solve
  lead: Choose a regime and constraints, then solve. The allocation below is the optimiser's output — weights and risk contribution per sleeve.
  columns: [Sleeve, Weight %, Risk contribution %]
  row_labels: [Global equity, Government bonds, Credit, Real assets, Cash]
  row_count: 5
  fields:
    - name: regime
      type: select
      label: Regime
      options: [Mean-variance, Black-Litterman, Risk-parity]
      value: Black-Litterman
    - name: mandate
      type: select
      label: Mandate
      options: [Long-only, Long-short]
      value: Long-only
    - name: turnover
      type: number
      label: Turnover cap
      value: 15
      min: 0
      max: 100
      unit: "%"
    - name: cardinality
      type: number
      label: Max positions
      value: 40
      min: 5
      max: 500
    - name: federated
      type: checkbox
      label: Use the federated prior
      value: true
---

## What it does

A unified optimiser that supports three regimes — mean-variance,
Black-Litterman, and risk-parity — across an asset universe of 10,000+
instruments. Federated participants contribute anonymised positioning data
which improves the prior; their gradients never leave their institution.

Median solve time is **240 ms**, which is the number that decides whether an
optimiser is usable interactively or is a batch job people run overnight and
stop iterating on.

## Constraints supported

- Long-only / long-short
- Sector, country, factor, ESG, and counterparty caps
- Turnover and transaction-cost penalties
- Cardinality constraints (top-N positions)

Constraints are part of the solve, not a filter applied afterwards. A
turnover cap changes which portfolio is optimal rather than trimming an
optimal portfolio into compliance.

## Federated upside

Subscribers see a measurable lift over the public-data baseline because the
prior is informed by real institutional positioning. The published backtest
figure is **+1.8 pp CAGR against a 60/40 benchmark** — the comparison worth
making, since 60/40 is what the mandate is usually measured against.

Federated contributors earn a **rev-share proportional to gradient impact**,
scored by Shapley value rather than by data volume. Contributing more data
does not earn more; contributing data that measurably improves the prior does.
Prior quality is tracked over time, so a contribution's value is assessed
against what it actually adds rather than what it added when onboarded.

Participation is opt-in and separable: a subscriber can use the optimiser
without contributing, and a contributor can withdraw without losing access.

## Operational transparency

Solver p95 and timeout rates are monitored and published to participants — an
optimiser that is fast on average and occasionally times out on the hard
problems is a different product from one that is reliably fast, and the
distinction only shows up in the tail.

## Pricing

**Pro** plan and above, at $199/month. Federated participation requires
institutional onboarding and a signed data-sharing agreement; onboarding
status is tracked per institution.
