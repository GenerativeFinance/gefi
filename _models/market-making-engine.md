---
title: Market Making Engine
slug: market-making-engine
category: Trading / Microstructure
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Avellaneda-Stoikov-style optimal bid/ask quotes for a target inventory band. Quoting signals for your own infrastructure — GeFi does not act as a market maker or provide direct market access.
metrics:
  - { label: "Quoting model",   value: "Avellaneda-Stoikov" }
  - { label: "MiFID II RTS 6",  value: "Self-assessment tracked" }
  - { label: "SEC 15c3-5",      value: "Risk controls tracked" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: curve
  cta: Generate quotes
  lead: The curve is spread capture against inventory risk as inventory drifts from target. Wider quotes protect inventory; tighter quotes capture more spread and carry more risk.
  series_label: Spread capture
  chart_label: Spread capture vs inventory position
  x_labels: [Short band, Long band]
  fields:
    - name: instrument
      type: text
      label: Instrument
      value: AAPL
      placeholder: Ticker or symbol
    - name: risk_aversion
      type: number
      label: Risk aversion (gamma)
      value: 0.1
      min: 0.01
      max: 2
      step: 0.01
    - name: inventory_band
      type: number
      label: Target inventory band
      value: 500
      min: 10
      max: 50000
      unit: shares
    - name: arrival_intensity
      type: number
      label: Order-arrival intensity
      value: 1.5
      min: 0.1
      max: 10
      step: 0.1
---

> **Hypothetical performance.** Every backtest, spread-capture figure, and
> return number on this page is **simulated and hypothetical**, not indicative
> of future returns, and excludes execution costs, adverse selection, and the
> cost of inventory risk actually realised in live quoting.

## Quoting signals only — GeFi does not act as a market maker

Stated directly, because it governs what this model is and is not. This
produces **quoting signals for the subscriber's own market-making
infrastructure**. GeFi does not act as a market maker, does not provide direct
market access, and does not place or route quotes on any venue.

## Why this is classed high-risk

Live algorithmic quoting is subject to **MiFID II RTS 6** and **SEC Rule
15c3-5** in the jurisdictions this model covers — regulation that exists
because a malfunctioning quoting algorithm can move a market in seconds. That
applicability is real regardless of whose infrastructure ultimately sends the
quote, which is why the risk badge reflects the activity this model informs,
not merely GeFi's own role in it.

An algorithmic-trading compliance checklist — RTS 6 self-assessment, 15c3-5
risk controls — is tracked per subscriber engagement and linked into the
compliance case system.

## What it does

Computes **Avellaneda-Stoikov-style optimal bid/ask quotes** for a given
inventory target, with a live chart of spread capture against inventory risk
as position drifts from that target.

## The core trade-off, made visible rather than optimised away

Market making is one continuous trade-off: quote tighter and capture more
spread, while carrying more inventory risk when flow is one-sided; quote wider
to protect inventory, while capturing less spread and possibly losing queue
priority.

The model does not present a single "optimal" quote and hide the trade-off
behind it. The chart shows spread capture across the inventory band explicitly,
so a subscriber configuring their own risk aversion parameter sees what that
choice costs and buys, rather than trusting a black-box optimum.

## Calibration is the whole model, so it is exposed, not hidden

**Risk aversion** and **order-arrival intensity** are the two parameters that
determine everything the model outputs, and both are subscriber-configurable
rather than fixed defaults. Per-instrument inventory-risk limits are maintained
in a library, since a limit appropriate for a liquid large-cap is reckless
applied to a thin name.

## Pricing

**Enterprise** tier, at $499/month, reflecting the compliance-tracking
requirements this activity carries.
