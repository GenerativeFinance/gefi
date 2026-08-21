---
title: HFT Signal Research Engine
slug: hft-signal-research-engine
category: Trading / Microstructure
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Order-book-imbalance and Hawkes-process intensity signals over historical tick data. A research and backtesting tool — not live microsecond execution, which GeFi's infrastructure does not provide.
metrics:
  - { label: "Scope",          value: "Research, not live execution" }
  - { label: "Signals",        value: "Book imbalance, Hawkes intensity" }
  - { label: "Edge decay",     value: "vs latency, backtested" }
  - { label: "Data",           value: "Historical tick" }
analytics: true
demo:
  output: curve
  cta: Research the signal
  lead: The curve is backtested edge against assumed latency. Where your own execution stack sits on this curve is the answer to whether this signal is usable for you at all.
  series_label: Edge (bp)
  chart_label: Edge decay vs execution latency
  x_labels: [0 µs, 5000 µs]
  fields:
    - name: instrument
      type: text
      label: Instrument
      value: ES futures
      placeholder: Ticker or contract
    - name: signal
      type: select
      label: Signal
      options: [Order-book imbalance, Hawkes intensity, Both]
      value: Order-book imbalance
    - name: window
      type: number
      label: Lookback window
      value: 30
      min: 1
      max: 365
      unit: days
    - name: latency
      type: number
      label: Assumed round-trip latency
      value: 800
      min: 5
      max: 10000
      unit: µs
---

> **Hypothetical performance.** Every backtest, edge-decay curve, and return
> figure on this page is **simulated and hypothetical**, not indicative of
> future returns, and reflects historical tick data rather than current
> live-market microstructure.

## This is a research tool, not a live execution system

Stated explicitly because the distinction is the whole point. This model
researches and backtests signals over **historical tick data**. It is not
live microsecond execution, and GeFi does not provide the edge infrastructure
— colocation, kernel-bypass networking, FPGA order entry — that capturing
these signals live actually requires.

## The edge-decay curve is the honest answer to "is this usable"

Order-book-imbalance and Hawkes-process intensity signals are real and
well-documented in the microstructure literature, and they are also **latency-
sensitive in a way most trading signals are not**: the edge exists for
microseconds to low milliseconds before it is arbitraged away by faster
participants reacting to the same imbalance.

So the central output is not "here is a profitable signal" — it is the
**edge-decay-versus-latency curve**, which lets a subscriber locate their own
execution stack on it and answer the only question that matters: whether they
are fast enough to capture what the backtest shows, or whether the backtest
describes an edge that exists only for infrastructure they do not have.

For most subscribers reading this honestly, the answer is that they are not
fast enough — and that is the useful, if unwelcome, output of the tool.

## Backtests are grounded in current conditions, not a static snapshot

The edge-decay model is maintained against current market conditions rather
than fixed at whenever the backtest was last run, because microstructure
changes — venue mix, participant composition, and typical latency all shift
over time, and a decay curve computed on old tick data can describe a market
that no longer exists.

## Pricing

**Enterprise** tier, at $499/month.
