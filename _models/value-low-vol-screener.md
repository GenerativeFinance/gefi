---
title: Value & Low-Volatility Screener
slug: value-low-vol-screener
category: Trading / Factor
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU]
lead: Securities ranked by book-to-price and realised/implied volatility, with an overlay showing where the two anomalies agree or conflict. Signals only.
metrics:
  - { label: "Anomalies",       value: "Value + low-volatility" }
  - { label: "Data quality",    value: "Restatement-monitored" }
  - { label: "Refresh",         value: "Quarterly" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: table
  cta: Screen the universe
  lead: Both anomalies ranked side by side. Agreement between them is a stronger case than either alone.
  columns: [Security, Book-to-price, Realised vol]
  row_labels: [Rank 1, Rank 2, Rank 3, Rank 4, Rank 5]
  row_count: 5
  fields:
    - name: universe
      type: select
      label: Universe
      options: [US large-cap, US small-cap, EU equities, UK equities]
      value: US large-cap
    - name: vol_type
      type: select
      label: Volatility measure
      options: [Realised, Implied]
      value: Realised
    - name: min_bp
      type: number
      label: Minimum book-to-price
      value: 0.8
      min: 0
      max: 5
      step: 0.05
    - name: overlay
      type: checkbox
      label: Show combined overlay
      value: true
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**, not indicative of future
> returns.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## What it does

Ranks securities by **book-to-price** and by **realised or implied
volatility**, with a historical risk-adjusted-outperformance chart for each
anomaly separately, and a **combined overlay** showing where the two signals
agree or conflict.

## Two anomalies that share an explanation, and where they diverge

Value and low-volatility outperformance are both long-documented departures
from what a simple risk-return model predicts, and a leading explanation for
both is the same: investor preference for lottery-like, high-volatility, high-
growth-narrative stocks bids those names up, leaving cheaper and steadier
names relatively underpriced.

That shared root is why the overlay matters. A security ranking well on both
is doubly supported by that mechanism. A security cheap on book-to-price but
*not* low-volatility is a different, riskier proposition — often a name that
is cheap because the market is pricing in real distress rather than a
behavioural mispricing, which is exactly the case a value screen alone cannot
distinguish from a genuine bargain.

## Book-to-price data quality is where this goes wrong quietly

Book value is an accounting figure, and accounting figures get **restated**.
A screen computed against a since-corrected book value ranks a security on
data that no longer describes it, and restatements are exactly the kind of
data event that does not announce itself the way a price move does.

The data-quality monitor exists specifically to catch this before it silently
corrupts a ranking.

## Quarterly refresh matches the data's own cadence

Fundamentals update on earnings cycles, so the backtest refreshes **quarterly
against new fundamental data** rather than continuously — refreshing a
value screen daily would mean mostly re-testing against unchanged inputs while
adding operational cost for no informational gain.

## Pricing

**Starter** plan, at $99/month.
