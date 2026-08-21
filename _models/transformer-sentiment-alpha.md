---
title: Transformer Sentiment Alpha
slug: transformer-sentiment-alpha
category: Trading / ML & Alt-Data
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: News wires, earnings calls and analyst commentary into a tradeable position signal — with per-source attribution for every day's signal. Signals only.
metrics:
  - { label: "Sources",         value: "Wires / transcripts / analyst notes" }
  - { label: "Output",          value: "Position signal, not score" }
  - { label: "Attribution",     value: "Per source, per day" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: score
  cta: Generate the signal
  lead: The output is a position signal with the sources that drove it. A signal driven by one wire story is a different bet than one confirmed across all three source types.
  score_label: Position signal
  drivers: [News wires, Earnings-call tone, Analyst commentary, Cross-source agreement]
  fields:
    - name: ticker
      type: text
      label: Security
      value: NVDA
      placeholder: Ticker
    - name: sources
      type: select
      label: Sources
      options: [All, News wires only, Transcripts only, Analyst notes only]
      value: All
    - name: window
      type: number
      label: Signal window
      value: 5
      min: 1
      max: 60
      unit: days
    - name: min_agreement
      type: checkbox
      label: Require cross-source agreement
      value: true
---

> **Hypothetical performance.** Every backtest, Sharpe ratio, and return figure
> on this page is **simulated and hypothetical**, not indicative of future
> returns.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## Different animal from Sentiment from Filings

The catalogue's other sentiment model reads **regulatory documents** —
periodic, structured, legally constrained text — and returns a score for use
as a feature. This model reads **news wires, earnings-call transcripts, and
analyst commentary**: continuous, unstructured, and written to persuade as
much as to inform. And it outputs a **position signal**, not a score — the
calibration from sentiment to position size is part of the model, not left as
an exercise.

That distinction cuts both ways: a position signal is more directly usable and
carries more responsibility, which is why the calibration job is maintained
explicitly rather than embedded invisibly.

## Attribution per source, per day — because the sources fail differently

News wires move fast and correct themselves later. Earnings-call tone is
structured but quarterly. Analyst commentary is informed but conflicted in
ways that are well understood.

A signal driven overwhelmingly by one wire story is a much more fragile bet
than the same signal confirmed across all three source types, and the daily
**source-attribution breakdown** exists so a subscriber can tell those two
situations apart before sizing. The cross-source agreement toggle makes that
judgement enforceable rather than advisory.

Per-source ingestion health is monitored separately, since a silently degraded
transcript feed shifts the signal's composition without shifting its
confidence — the failure mode attribution is designed to catch.

## Pricing

**Pro** plan and above, at $199/month.
