---
title: Fixed Income Arbitrage Engine
slug: fixed-income-arbitrage-engine
category: Trading / Arbitrage
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Mispricing signals across on-the-run/off-the-run, swap spreads, and curve relative value, with leverage disclosed explicitly rather than understated. Signals only.
metrics:
  - { label: "Signal types",     value: "OTR/OFR, swap spread, curve RV" }
  - { label: "Leverage",         value: "Disclosed, not assumed" }
  - { label: "Repo stress",      value: "Scenario library" }
  - { label: "Execution",        value: "Yours, not ours" }
analytics: true
demo:
  output: table
  cta: Find mispricings
  lead: Each signal is a small edge. The leverage panel exists because small edges only become returns worth having when levered — and levered is where the risk lives.
  columns: [Signal, Basis, Assumed leverage]
  row_labels: [OTR / OFR basis, 2y10y swap spread, Curve butterfly, Repo special, Cross-currency basis]
  row_count: 5
  fields:
    - name: universe
      type: select
      label: Universe
      options: [US Treasuries, UK Gilts, EU sovereigns]
      value: US Treasuries
    - name: strategy
      type: select
      label: Strategy type
      options: [OTR/OFR basis, Swap spread, Curve relative value]
      value: Swap spread
    - name: leverage
      type: number
      label: Assumed leverage
      value: 8
      min: 1
      max: 40
      unit: x
    - name: repo_stress
      type: checkbox
      label: Apply repo-market stress scenario
      value: false
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**, not indicative of future
> returns, and excludes financing costs, repo specialness, and the funding
> risk that this strategy class is most exposed to.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## Leverage disclosure is not a footnote here

Fixed income arbitrage trades individually tiny mispricings — a few basis
points on an OTR/OFR basis, a curve relative-value kink — that are only worth
trading when levered substantially. That leverage is the defining
characteristic of the strategy class, and this page does not understate it.

**Every signal states its assumed leverage explicitly**, because the return an
unlevered mispricing implies is not the return the strategy actually targets,
and presenting the unlevered number would materially misrepresent both the
opportunity and the risk.

## What it does

Scans a bond universe for mispricing across related instruments — on-the-
run versus off-the-run, swap-spread relationships, curve relative value — and
returns signals with their basis and assumed leverage.

## This is where funding risk lives, not market risk

The historical failures of this strategy class share a pattern: the trades
were directionally correct and the positions were still destroyed, because
funding — the repo market, prime broker terms, margin requirements — moved
against the position faster than the mispricing converged.

A trade can be right and still fail if it cannot be held long enough to be
right, and being levered is what removes the ability to simply wait it out.
The **repo-market stress scenario library** exists to make that funding risk
visible before it is realised, not to predict when it will occur.

## Leverage is monitored across the whole book, not per trade

The exposure monitor aggregates leverage across everything a tenant has
modelled, because funding stress does not discriminate between individually
small positions — it hits a book's aggregate financing need all at once, and a
tenant looking at any single trade in isolation cannot see that.

## Pricing

**Enterprise** tier, at $499/month.
