---
title: Renewable Project Modeler
slug: renewable-project-modeler
category: Project Finance
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Generation forecast with degradation, DSCR and project/equity IRR, and tax credits shown as their own waterfall step.
metrics:
  - { label: "Degradation",     value: "Modelled" }
  - { label: "Tax credits",     value: "Separate step" }
  - { label: "Resource feeds",  value: "Health-monitored" }
  - { label: "Reconciliation",  value: "Post-COD vs forecast" }
analytics: true
demo:
  output: curve
  cta: Model the project
  lead: Set capacity, resource, and PPA price. The curve is generation with degradation applied — a flat generation assumption overstates late-life coverage.
  series_label: Annual generation
  chart_label: Generation over project life
  x_labels: [Y1, Y25]
  fields:
    - name: capacity
      type: number
      label: Installed capacity
      value: 180
      min: 1
      max: 2000
      unit: MW
    - name: capacity_factor
      type: number
      label: Capacity factor
      value: 31
      min: 1
      max: 70
      unit: "%"
    - name: ppa_price
      type: number
      label: PPA price
      value: 42
      min: 0
      max: 300
      unit: USD/MWh
    - name: degradation
      type: number
      label: Annual degradation
      value: 0.5
      min: 0
      max: 5
      step: 0.1
      unit: "%"
---

## What it does

Takes installed capacity, resource assumptions, and PPA price and returns a
**generation-profile forecast with degradation**, **DSCR and project/equity
IRR**, and production/price sensitivity — with **tax-credit impact as a
distinct waterfall step**.

## Degradation matters most exactly where the model is thinnest

Panels and turbines produce less each year. At half a percent annually the
effect is invisible early and substantial by year twenty — and year twenty is
where debt is still being serviced under a long tenor.

A flat generation assumption therefore overstates late-life DSCR, which is
precisely the period where coverage is tightest and where a model is least
scrutinised. Degradation is an explicit input rather than a haircut folded into
the capacity factor.

## Tax credits are their own step, deliberately

Renewable project economics frequently depend on tax credits, and their value
is contingent in ways ordinary revenue is not: on the project qualifying, on
the sponsor having tax capacity to use them, on rules that change with
legislative cycles, and on structures that monetise them for sponsors who
cannot.

Blending them into project revenue makes a project look like it works on
merchant economics when it works on policy. Showing them as a separate
waterfall step keeps the two sources of value distinguishable — which matters
when the rules change.

The tax-credit rule library is maintained per jurisdiction.

## Resource data quality is the foundation

Everything rests on irradiance or wind resource estimates. Feed health is
monitored per provider, and once a project reaches commercial operation,
**actual production is reconciled against forecast**.

That reconciliation is what keeps resource assumptions honest across a
portfolio: a developer whose projects consistently underproduce their forecasts
has a systematic estimation problem, and it only becomes visible by comparing
against outcomes.

## Pricing

**Pro** plan and above, at $199/month.
