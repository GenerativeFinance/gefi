---
title: Gradient-Boosted Alpha Engine
slug: gradient-boosted-alpha-engine
category: Trading / ML & Alt-Data
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Return-prediction scores with SHAP feature importance, and an out-of-sample chart that separates training fit from live performance. Signals only.
metrics:
  - { label: "Explanation",     value: "SHAP per prediction" }
  - { label: "Validation",      value: "Out-of-sample, shown" }
  - { label: "Retraining",      value: "Drift-triggered" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: score
  cta: Score the security
  lead: The score comes with its feature importances. A prediction whose reasoning you cannot see is a prediction you cannot know when to stop trusting.
  score_label: Alpha score
  drivers: [Price features, Fundamental features, Macro features, Interaction terms]
  fields:
    - name: ticker
      type: text
      label: Security
      value: MSFT
      placeholder: Ticker
    - name: features
      type: select
      label: Feature set
      options: [Price only, Price + fundamental, Full (price/fundamental/macro)]
      value: Full (price/fundamental/macro)
    - name: horizon
      type: number
      label: Prediction horizon
      value: 21
      min: 1
      max: 252
      unit: days
    - name: oos
      type: checkbox
      label: Show out-of-sample validation
      value: true
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**, not indicative of future
> returns.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

A gradient-boosted model over **price, fundamental, and macro features**
returns a return-prediction score per security, with **SHAP-style feature
importance** for every prediction and an **out-of-sample validation chart**
that separates training-period fit from live performance.

## In-sample fit is the number that lies

Gradient-boosted trees are powerful enough to fit almost anything, including
noise. A model of this class will essentially always look excellent on its
training period — that is a property of the model family, not evidence about
the future.

The validation chart therefore **separates training fit from out-of-sample
performance by construction**, and the honest expectation is a large gap
between them. A subscriber should evaluate this model on the out-of-sample
line alone; the training line is shown only so the gap itself is visible,
because the size of that gap is the overfitting estimate.

## Feature importance is how you know when to stop trusting it

SHAP charts show which inputs drive each prediction. This matters beyond
curiosity: ML alpha models fail by **quietly changing their reasoning** — a
model that ranked on fundamentals last quarter and momentum this quarter is a
different model wearing the same name, even if its accuracy has not yet moved.

The **feature-importance-stability dashboard** flags exactly that shift
between retrains, and retraining itself is drift-triggered rather than
calendar-only, so the model is refreshed when the data stops matching it
rather than on a schedule that ignores whether anything changed.

## Pricing

**Pro** plan and above, at $199/month.
