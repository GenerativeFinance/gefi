---
title: Deposit Behavior Model
slug: deposit-behavior-model
category: Banking / ALM
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Pass-through beta by segment, decay and vintage curves, and a surge-deposit flag that separates transient balances from core.
metrics:
  - { label: "Segments modelled",  value: "Configurable" }
  - { label: "Surge flag",         value: "Explicit" }
  - { label: "Backtest",           value: "vs realized outflows" }
  - { label: "Divergence alert",   value: "On drift" }
analytics: true
demo:
  output: curve
  cta: Project balances
  lead: Load a deposit book and move rates. The projection separates core balances from surge — the distinction that decides whether the answer is right.
  series_label: Projected balance
  chart_label: Balance projection under rate scenario
  x_labels: [M0, M24]
  fields:
    - name: segment
      type: select
      label: Segment
      options: [Retail checking, Retail savings, Small business, Commercial operating]
      value: Retail savings
    - name: rate_move
      type: number
      label: Rate scenario
      value: 100
      min: -300
      max: 300
      step: 25
      unit: bp
    - name: beta
      type: number
      label: Assumed pass-through beta
      value: 45
      min: 0
      max: 100
      unit: "%"
    - name: exclude_surge
      type: checkbox
      label: Exclude surge deposits from core
      value: true
---

## What it does

Takes a deposit book and returns **pass-through beta estimates by segment**,
**decay and vintage curves**, and a rate-scenario projection of balances — with
surge deposits flagged separately from core.

## Treating surge as core is the classic ALM mistake

Deposit balances that arrived during an unusual period — pandemic-era stimulus,
a flight to safety, a one-off corporate event — behave nothing like balances a
bank has held through a cycle. They are rate-sensitive, they are often
relationship-thin, and they leave quickly.

A model that treats them as core produces a book that looks longer-duration and
stickier than it is. Every downstream number inherits the error: IRRBB
sensitivity, liquidity coverage, funding plans. The mistake is expensive
precisely because it flatters the balance sheet, so nobody goes looking for it
while it holds.

Surge is therefore flagged **explicitly and separately** rather than smoothed
into a blended beta. A user can run the projection both ways and see how much
of the book's apparent stability depends on the assumption.

## Beta is segment-specific and asymmetric

Pass-through beta differs sharply by segment — commercial operating balances
reprice far faster than retail checking — so a single book-level beta is an
average of things that do not behave alike.

Beta is also **asymmetric**: deposits reprice up more slowly than they reprice
down, and modelling one rate for both directions understates the cost of a
rising-rate environment.

## Calibration and drift

Recalibration runs against **realized outflows**, with backtest error tracked
over time, and a **divergence alert** fires when modelled decay drifts from
actuals.

That alert matters more than the initial fit. Deposit behaviour changes with
rate environment and competitive conditions, so a model calibrated in one
regime degrades in the next — and the degradation is invisible until someone
compares projection with outcome.

## Pricing

**Pro** plan and above, at $199/month.
