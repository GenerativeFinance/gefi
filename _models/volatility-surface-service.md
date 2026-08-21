---
title: Volatility Surface Service
slug: volatility-surface-service
category: Primitives / Volatility
featured: false
risk: medium
maturity: GA
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Fitted implied-volatility surfaces with SABR, Heston, and GARCH-family toggles, term-structure and skew slices, and per-model fit quality.
metrics:
  - { label: "Models",          value: "SABR, Heston, GARCH" }
  - { label: "Fit quality",     value: "Per underlying" }
  - { label: "Refit trigger",   value: "On degradation" }
  - { label: "Export",          value: "API" }
analytics: true
demo:
  output: curve
  cta: Fit the surface
  lead: Pick an underlying and a model. The slice below is one cut through the fitted surface — fit quality is reported per model per underlying, because no single model wins everywhere.
  series_label: Implied vol
  chart_label: Volatility term structure
  x_labels: [1w, 2y]
  fields:
    - name: underlying
      type: text
      label: Underlying
      value: SPX
      placeholder: Ticker
    - name: model
      type: select
      label: Model
      options: [SABR, Heston, GARCH-family]
      value: SABR
    - name: slice
      type: select
      label: Slice
      options: [Term structure, Skew, Full surface]
      value: Term structure
    - name: moneyness
      type: number
      label: Moneyness
      value: 100
      min: 50
      max: 150
      unit: "%"
---

## What it does

Renders the fitted implied-volatility surface for an underlying, with model
toggles across **SABR**, **Heston**, and **GARCH-family** fits, term-structure
and skew slices, and API export.

These are the same surfaces the Options Vol-Arb Engine and Strategy
Construction Engine consume internally.

## No single model wins everywhere

SABR fits skew well at a given expiry and is a poor description of term
structure. Heston is a genuine stochastic-volatility process with dynamics
across the whole surface, and pays for it in calibration stability.
GARCH-family models describe realized-volatility dynamics rather than the
implied surface directly.

They are different tools, so the surface is offered under all three with
**fit quality reported per model per underlying**. Choosing a model without
seeing how it fits *this* underlying is choosing on reputation.

## Calibration degrades between refits

A fitted surface is a snapshot. Markets move, and a surface calibrated this
morning may describe this afternoon poorly — especially through an event.

Calibration runs on a schedule and **refits are triggered by fit
degradation** rather than only by the clock, because the moments when a
surface goes stale fastest are exactly the moments when someone is most likely
to be trading on it.

## Knowing who consumes a surface

A **consumer registry** records which models and tenants subscribe to which
surfaces. A primitive with unknown consumers cannot be changed safely, and a
recalibration that silently alters a downstream model's pricing is a failure
mode worth engineering against.

## Pricing

**Pro** plan and above, at $199/month.
