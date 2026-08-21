---
title: Infrastructure Investment Modeler
slug: infrastructure-investment-modeler
category: Project Finance
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU, UAE]
lead: Investor returns across delay, cost-overrun, and low-utilisation downsides as a tornado chart, over a concession timeline from construction to hand-back.
metrics:
  - { label: "Downside cases",   value: "Delay / overrun / utilisation" }
  - { label: "Concession",       value: "To hand-back" }
  - { label: "Benchmarks",       value: "Comparable projects" }
  - { label: "Milestones",       value: "Case-system tracked" }
analytics: true
demo:
  output: table
  cta: Stress the concession
  lead: Each row is a downside applied singly. The tornado ranks them by impact — which risk deserves mitigation spend is the output, not the base-case IRR.
  columns: [Scenario, Equity IRR, Delta vs base]
  row_labels: [Base case, 12-month delay, 20% cost overrun, Utilisation −25%, Combined stress]
  row_count: 5
  fields:
    - name: capex
      type: number
      label: Capital cost
      value: 1200000000
      min: 0
      step: 50000000
      unit: USD
    - name: concession
      type: number
      label: Concession period
      value: 30
      min: 5
      max: 99
      unit: years
    - name: construction
      type: number
      label: Construction period
      value: 4
      min: 1
      max: 15
      unit: years
    - name: tariff_growth
      type: number
      label: Tariff escalation
      value: 2.5
      min: -5
      max: 15
      step: 0.1
      unit: "% p.a."
---

## What it does

Takes construction schedule, tariff or user-fee assumptions, and concession
period, and returns **investor returns under base, delay, cost-overrun, and
lower-utilisation cases** as a tornado chart — across a concession timeline
running from construction through hand-back.

## The tornado is the deliverable, not the base case

Everyone models a base case and everyone's base case works. The question worth
answering is **which risk hurts most**, because that determines where
mitigation spend, contractual protection, and negotiation effort should go.

Applying each downside singly and ranking by impact is what makes that visible.
Infrastructure projects fail on specific, identifiable risks rather than on
general pessimism, and a tornado points at them.

## Delay compounds worse than overrun

A cost overrun is a one-time increase in capital. A construction delay pushes
back the entire revenue stream while interest continues to accrue during
construction — and under a fixed concession period, **a year of delay is a year
of revenue permanently lost**, not deferred. The asset reverts on the original
date regardless.

That asymmetry is why the two are modelled separately rather than as a blended
"things go badly" case. They are different magnitudes of harm from
superficially similar events.

## Utilisation is the assumption with the worst track record

Traffic, passenger, and throughput forecasts for greenfield infrastructure have
a long and well-documented history of optimism. Benchmarks come from
**comparable completed projects** rather than from the promoter's forecast, so
the downside case is anchored in what actually happened elsewhere.

## Hand-back is part of the model

A concession ends. Residual-value obligations, hand-back condition
requirements, and late-life capex to meet them fall in the years when the
asset is least glamorous and most easily ignored in a model that stops at
year 20 of a 30-year term.

Contract milestones feed the compliance case system for regulator-facing
deals.

## Pricing

**Enterprise** tier, at $499/month.
