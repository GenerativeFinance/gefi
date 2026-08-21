---
title: RE Development Modeler
slug: re-development-modeler
category: Real Estate
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Monthly draw schedule and construction-to-exit cash flow with developer profit, IRR and equity multiple, plus unit-mix and absorption editing.
metrics:
  - { label: "Draw schedule",   value: "Monthly" }
  - { label: "Cost benchmarks", value: "Per market + type" }
  - { label: "Reconciliation",  value: "Draw vs actual" }
  - { label: "Milestones",      value: "Permit / entitlement" }
analytics: true
demo:
  output: curve
  cta: Model the development
  lead: Set costs and pace. The curve is cumulative cash — the trough is the peak equity requirement, which is the number that has to be funded.
  series_label: Cumulative cash flow
  chart_label: Construction to exit
  x_labels: [Start, Exit]
  fields:
    - name: land
      type: number
      label: Land cost
      value: 8500000
      min: 0
      step: 100000
      unit: USD
    - name: hard_cost
      type: number
      label: Hard cost / sq ft
      value: 245
      min: 0
      step: 5
      unit: USD
    - name: units
      type: number
      label: Units
      value: 180
      min: 1
      max: 5000
    - name: absorption
      type: number
      label: Absorption pace
      value: 12
      min: 1
      max: 200
      unit: units/mo
---

## What it does

Takes land, construction, and soft-cost inputs and returns a **monthly draw
schedule**, a **construction-to-exit cash-flow timeline**, and developer
profit, IRR, and equity multiple — with a unit-mix and absorption editor for
residential and a leasing-assumption editor for commercial.

## The trough is the number that has to be funded

Development cash flow is deeply negative before it is positive. The **peak
equity requirement** — the trough of cumulative cash — is what the sponsor must
actually fund, and it is a different and larger number than total equity in the
capital stack, because timing matters.

A project that pencils on total sources and uses can still fail because the
trough exceeds what the sponsor can put up when it is needed. Plotting
cumulative cash rather than a summary table is what makes that visible.

## Absorption pace does more damage than price

Developers stress sale price and under-stress absorption. Slower absorption
extends the holding period, which means more interest carry, more property tax,
more insurance, and more of everything else that accrues monthly regardless of
whether units are selling.

A 10% price reduction is a one-time hit to revenue. Absorption at half the
assumed pace can double the carry, and carry compounds against a balance that
is not being paid down. The absorption editor is prominent for that reason.

## Costs benchmarked, draws reconciled

Construction cost per square foot comes from a **benchmark library by market
and asset type**, since costs vary enormously by geography and cannot be
carried across markets. Draws are **reconciled against actuals** as the project
proceeds — a draw schedule running ahead of plan is the earliest quantitative
signal of a budget problem.

Permit and entitlement milestones are tracked, because in most markets they
gate everything and slip more often than construction does.

## Pricing

**Pro** plan and above, at $199/month.
