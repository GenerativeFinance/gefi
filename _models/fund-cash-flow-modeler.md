---
title: Fund Cash-Flow Modeler
slug: fund-cash-flow-modeler
category: Private Funds
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Capital-call and distribution projections with ending unfunded commitments, pacing charts, and LP-level allocation.
metrics:
  - { label: "Granularity",    value: "Monthly / quarterly / annual" }
  - { label: "Pacing benchmark", value: "By strategy + vintage" }
  - { label: "Recycling",      value: "Per LPA terms" }
  - { label: "Notices",        value: "Logged per LP" }
analytics: true
demo:
  output: curve
  cta: Project cash flows
  lead: Set commitments and pacing. The curve is net cash flow — the J-curve is a structural feature, not a performance signal.
  series_label: Net cash flow
  chart_label: Net cash flow by period
  x_labels: [Y1, Y10]
  fields:
    - name: commitments
      type: number
      label: Total commitments
      value: 250000000
      min: 0
      step: 5000000
      unit: USD
    - name: period
      type: select
      label: Granularity
      options: [Monthly, Quarterly, Annual]
      value: Quarterly
    - name: pace
      type: number
      label: Investment period
      value: 5
      min: 1
      max: 10
      unit: years
    - name: recycling
      type: checkbox
      label: Apply recycling provisions
      value: true
---

## What it does

Takes commitments, capital-call, and distribution assumptions and returns a
**cash-flow projection** at monthly, quarterly, or annual granularity, with
**ending unfunded commitments**, a capital-call **pacing chart**, and an
LP-level allocation breakdown.

## Unfunded commitment is the LP's real exposure

An LP who has committed $10M and been called $4M is not a $4M investor. They
carry an obligation to fund $6M more, on the GP's timing, largely outside
their control.

That obligation has to be held in liquid form, and the opportunity cost of
holding it is a genuine drag on the LP's returns that appears nowhere in the
fund's own performance figures. Projecting **ending unfunded commitment** — not
just calls to date — is what makes an LP's liquidity planning possible.

## Pacing is the assumption that drives everything

Call timing determines the J-curve's depth and duration, and pacing that
deviates from the plan cascades into every downstream number. Benchmarks are
maintained **by strategy and vintage**, since a buyout fund and an early-stage
venture fund call capital on entirely different schedules and comparing them
against a single pacing curve is meaningless.

## Recycling changes the arithmetic

Recycling provisions let a fund reinvest realisations rather than distribute
them, so total invested capital can exceed committed capital. This materially
affects both projected calls and the relationship between DPI and TVPI.

Terms vary between LPAs, so recycling rules are **edited per fund** rather than
assumed — a projection built on generic recycling assumptions can be wrong in
the direction that matters most to an LP planning liquidity.

Every capital-call notice is logged per LP.

## Pricing

**Pro** plan and above, at $199/month.
