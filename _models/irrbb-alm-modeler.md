---
title: IRRBB / ALM Modeler
slug: irrbb-alm-modeler
category: Banking / ALM
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: EVE and NII sensitivity across the six Basel IRRBB shocks, with a repricing-gap table and live behavioural-assumption toggles.
metrics:
  - { label: "Basel shocks",      value: "6" }
  - { label: "Metrics",           value: "EVE + NII" }
  - { label: "Outlier test",      value: "Flagged live" }
  - { label: "Disclosure export", value: "Standardised" }
analytics: true
demo:
  output: curve
  cta: Run the shocks
  lead: Pick a shock and adjust behavioural assumptions. EVE and NII move in opposite directions under most shocks — that tension is the whole discipline.
  series_label: EVE sensitivity
  chart_label: EVE sensitivity by repricing bucket
  x_labels: [O/N, 20y+]
  fields:
    - name: shock
      type: select
      label: Basel shock scenario
      options: [Parallel up, Parallel down, Steepener, Flattener, Short rate up, Short rate down]
      value: Parallel up
    - name: metric
      type: select
      label: Metric
      options: [EVE, NII]
      value: EVE
    - name: nmd_beta
      type: number
      label: Non-maturity deposit beta
      value: 45
      min: 0
      max: 100
      unit: "%"
    - name: prepay
      type: number
      label: Prepayment speed
      value: 8
      min: 0
      max: 60
      unit: "% CPR"
---

## What it does

Takes a balance sheet and returns **EVE and NII sensitivity** under all six
Basel IRRBB shock scenarios, a **repricing-gap table by bucket**, and
behavioural-assumption toggles that redraw both metrics live against the
regulatory outlier thresholds.

## EVE and NII pull against each other

Economic value of equity is a present-value measure over the whole balance
sheet. Net interest income is an earnings measure over a short horizon. Under
most shocks they move in **opposite directions**, and a bank can only optimise
one at the expense of the other.

Lengthening asset duration protects NII when rates fall and damages EVE when
they rise. Reporting a single interest-rate-risk number would hide precisely
the trade-off the ALCO exists to make, which is why both are shown together
and shown under every shock rather than a chosen one.

## Behavioural assumptions dominate the answer

The largest source of variation in an IRRBB result is not the shock. It is the
**behavioural assumptions**: how much of a rate move passes through to
non-maturity deposits, and how prepayment responds.

Those assumptions are estimates about customer behaviour, and moving deposit
beta a few points moves EVE more than switching shock scenario does. So they
are exposed as live controls rather than buried in configuration: anyone
reading the output can see how sensitive it is to a judgement, and the outlier
test is applied to the result as adjusted.

Behavioural models are recalibrated against realized data rather than
carried forward on their original fit.

## Keeping aligned

The shock-scenario library tracks Basel and EBA updates, and results export to
the standardised IRRBB disclosure template supervisors expect.

## Pricing

**Enterprise** tier, at $499/month.
