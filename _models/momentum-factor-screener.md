---
title: Momentum Factor Screener
slug: momentum-factor-screener
category: Trading / Factor
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU]
lead: Price momentum and earnings-surprise momentum ranked side by side, with momentum-crash risk shown prominently — not buried in fine print. Signals only.
metrics:
  - { label: "Momentum types",  value: "Price + earnings surprise" }
  - { label: "Crash risk",      value: "Prominent, not footnoted" }
  - { label: "Windows",         value: "3 / 6 / 12 month" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: table
  cta: Screen for momentum
  lead: Both momentum types are shown together. A security strong on one and weak on the other is a different bet than one strong on both.
  columns: [Security, Price momentum, Earnings surprise]
  row_labels: [Rank 1, Rank 2, Rank 3, Rank 4, Rank 5]
  row_count: 5
  fields:
    - name: universe
      type: select
      label: Universe
      options: [US large-cap, US small-cap, EU equities, UK equities]
      value: US large-cap
    - name: window
      type: select
      label: Lookback window
      value: 6-month
      options: [3-month, 6-month, 12-month]
    - name: skip_recent
      type: checkbox
      label: Skip most recent month
      value: true
    - name: min_surprise
      type: number
      label: Minimum earnings surprise
      value: 0
      min: -50
      max: 50
      unit: "%"
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**, not indicative of future
> returns.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## Momentum crashes hard, and that goes on the page, not in the footnote

This is the single most important fact about momentum as a strategy, so it is
placed prominently rather than disclosed quietly.

Momentum works well for long stretches and then reverses sharply and suddenly
at regime turns — the well-documented "momentum crash" pattern, historically
concentrated at exactly the moments markets rebound hard after a selloff,
which is precisely when the securities that fell most (and are now shorted by
a momentum strategy) bounce most violently. The strategy's worst drawdowns
cluster tightly around a small number of these turning points rather than
spreading evenly through time.

The crash-risk indicator flags elevated risk of exactly that pattern, tracked
through factor volatility spikes, because averaged-out historical Sharpe
ratios hide how concentrated the pain actually is.

## Two kinds of momentum, shown side by side deliberately

**Price momentum** captures trend continuation in the security itself.
**Earnings-surprise momentum** captures the market's documented tendency to
underreact to earnings news, with drift continuing for weeks after the print.

They correlate but are not the same signal, and a security ranking highly on
both is a stronger case than one riding price momentum with earnings
disappointing — the second is closer to a name that has run ahead of its
fundamentals, which is a specific and identifiable risk the combined view
exists to surface.

## The most recent month is skipped by default, and that is deliberate

Momentum research consistently finds that the most recent month shows short-
term reversal rather than continuation — a distinct, opposite-signed effect
from momentum. Including it dilutes the signal with noise moving the wrong
direction. Skipping it is the field-standard convention, applied by default
rather than left as a trap for a subscriber unfamiliar with the literature.

## Pricing

**Starter** plan, at $99/month.
