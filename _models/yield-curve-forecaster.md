---
title: Yield-Curve Forecaster
slug: yield-curve-forecaster
category: Investing
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU]
lead: Ensemble forecast of the US, UK, and EU government yield curves, shown against the forward-implied curve with per-tenor error history.
metrics:
  - { label: "2y forecast RMSE",  value: "14 bp" }
  - { label: "10y forecast RMSE", value: "21 bp" }
  - { label: "Horizons",          value: "1–12 months" }
  - { label: "Geographies",       value: "US, UK, EU" }
analytics: true
demo:
  output: curve
  cta: Forecast the curve
  lead: Pick a geography and horizon. The curve is the forecast; the benchmark to judge it against is the forward-implied curve, not today's spot.
  series_label: Forecast
  chart_label: Forecast vs forward-implied
  x_labels: [3m, 30y]
  fields:
    - name: geography
      type: select
      label: Geography
      options: [US, UK, EU]
      value: US
    - name: horizon
      type: number
      label: Forecast horizon
      value: 6
      min: 1
      max: 12
      unit: months
    - name: overlay
      type: select
      label: Overlay
      options: [Forward-implied curve, Current spot curve, Both]
      value: Forward-implied curve
    - name: attribution
      type: checkbox
      label: Show macro-driver attribution
      value: true
---

## What it does

Forecasts the government yield curve for the US, UK, and EU across horizons of
one to twelve months, and plots the forecast **against the forward-implied
curve** on a single chart.

That comparison is the point. Forwards already embed the market's expected
path, so a forecast that merely reproduces them adds nothing. The chart is
built to make the difference between the two visible, because the difference
is the only part with information in it.

## Forecast error by tenor

Accuracy is not uniform across the curve, and a single headline error number
hides that. The **per-tenor error strip** reports historical forecast error
separately at each tenor, so a user can see where the model has been reliable
and where it has not.

Short-tenor forecasts track policy expectations and are comparatively easy;
long-tenor forecasts carry term-premium uncertainty and are not. Reporting one
average across both would flatter the model.

## Macro-driver attribution

Each forecast comes with an attribution panel showing which inputs moved the
curve — policy-rate expectations, inflation prints, growth surprises, issuance.
A forecast that shifts without a driver behind it is a signal to check the
model, not to trade.

Internally the forecast is an **ensemble**, and the weights across sub-models
are visible rather than hidden: a forecast driven by one sub-model that has
recently drifted is a different proposition from a consensus across several.

## Operations

Yield-data feeds are health-monitored per geography, and sustained forecast
error triggers a retrain rather than waiting for a scheduled cycle. New
geographies enter through a prioritised request backlog.

## Pricing

**Starter** plan and above, at $99/month. Additional geographies on request.
