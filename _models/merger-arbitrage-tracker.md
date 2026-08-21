---
title: Merger Arbitrage Tracker
slug: merger-arbitrage-tracker
category: Trading / Arbitrage
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Deal spread and completion probability from public deal data only, with contributing factors broken out. Never non-public information. Signals only.
metrics:
  - { label: "Data source",       value: "Public filings only" }
  - { label: "Completion factors", value: "Regulatory / financing / shareholder" }
  - { label: "Info barrier",       value: "Audit-trailed" }
  - { label: "Execution",          value: "Yours, not ours" }
analytics: true
demo:
  output: score
  cta: Assess the deal
  lead: The spread compensates for completion risk. This score decomposes that risk into what's actually driving it.
  score_label: Completion probability
  drivers: [Regulatory risk, Financing risk, Shareholder approval, Deal spread width]
  fields:
    - name: deal
      type: text
      label: Announced deal
      value: Acme Corp / Northgate Inc
      placeholder: Acquirer / target
    - name: deal_price
      type: number
      label: Deal price
      value: 58
      min: 0
      step: 0.5
      unit: USD
    - name: current_price
      type: number
      label: Current target price
      value: 55.2
      min: 0
      step: 0.1
      unit: USD
    - name: expected_close
      type: number
      label: Expected close
      value: 4
      min: 1
      max: 24
      unit: months
---

> **Hypothetical performance.** Every backtest, completion-probability
> statistic, and return figure on this page is **simulated and hypothetical**,
> not indicative of future returns, and excludes execution costs and the cost
> of deal breaks specifically.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## Public data only — stated explicitly, checked continuously

This model uses **only public deal-announcement data**: filings, press
releases, and public regulatory dockets. It never ingests non-public
information, and an **information-barrier audit trail** confirms that no other
data source feeds it.

This is stated on the page itself, not just in a compliance appendix, because
merger arbitrage is a strategy area where the line between public analysis and
non-public advantage matters more than almost anywhere else in trading, and a
subscriber deserves to know unambiguously which side of that line this model
operates on.

## What it does

Takes an announced deal and returns the **spread** between deal price and
current target price, and a **completion-probability score** broken into
regulatory risk, financing risk, and shareholder approval — the specific
factors that actually determine whether a deal closes, rather than a single
opaque probability.

## The spread is compensation for a specific, nameable risk

The spread exists because the deal might not close, and each contributing
factor fails in its own way and on its own timeline. Regulatory risk resolves
in review cycles measured in months and can kill an otherwise clean deal
outright. Financing risk crystallises if credit markets move against the
acquirer's committed facilities. Shareholder approval risk is usually smallest
but is not zero, particularly in contested or activist situations.

Decomposing the spread into these factors is what lets a subscriber judge
whether the *compensation* matches the *specific risk* in this deal, rather
than pricing every announced deal off one blended market-implied probability.

## Backtested against actual outcomes

Completion-probability estimates are backtested against **historical deal
outcomes** — not against the market-implied spread, which would be circular.
A model that predicts completion well on deals that closed and poorly on deals
that broke is exactly what the backtest is built to surface.

## Pricing

**Enterprise** tier, at $499/month.
