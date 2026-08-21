---
title: Board & LP Report Generator
slug: board-lp-report-generator
category: Generative / Documents
featured: true
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Quarterly LP letters and board decks drafted from Fund Performance Engine records, with GIPS-aware language and auto-inserted past-performance disclaimers.
metrics:
  - { label: "Figures reconciled",   value: "100%" }
  - { label: "Median draft time",    value: "52s" }
  - { label: "GIPS language checks", value: "Enabled" }
  - { label: "Per-LP distribution log", value: "Audited" }
analytics: true
demo:
  output: table
  cta: Draft the report
  lead: Select a fund and period. The performance table below is drafted straight from Fund Performance Engine records — every figure is reconciled against them before it renders.
  columns: [Metric, This period, Since inception]
  row_labels: [Net IRR, TVPI, DPI, RVPI, Called capital]
  row_count: 5
  fields:
    - name: fund
      type: select
      label: Fund
      options: [Fund III, Fund IV, Continuation vehicle I]
      value: Fund IV
    - name: period
      type: select
      label: Period
      options: [Q1, Q2, Q3, Q4]
      value: Q2
    - name: document
      type: select
      label: Document
      options: [Quarterly LP letter, Board deck]
      value: Quarterly LP letter
    - name: gips
      type: checkbox
      label: GIPS-aware performance language
      value: true
---

## What it does

Pick a fund and a reporting period and it drafts the quarterly LP letter or
board deck: IRR and TVPI tables, contribution highlights, and outlook prose,
all built from Fund Performance Engine records rather than from a spreadsheet
someone maintains by hand.

Performance language is **GIPS-aware** — toggles adjust how returns are
described so the wording matches the presentation standard the fund reports
under. Past-performance disclaimers are inserted automatically rather than
relying on someone remembering them.

A brand-kit upload means output lands in the firm's own template, so the draft
that comes out is close to the document that goes to LPs.

## Why it works

LP reporting is high-frequency, highly repetitive, and unforgiving of small
numeric errors. The same figures are restated across a letter, a deck, and a
data request, and they must agree everywhere.

The generator solves that by having exactly one source of truth. A
**number-reconciliation monitor** asserts that every reported figure matches
the Fund Performance Engine's record before the draft renders. A figure that
does not reconcile blocks the draft rather than appearing in it — which is the
right default when the reader is an LP.

## Compliance posture

Report templates are governed, with legal-approved language blocks that cannot
be silently edited into something the firm has not cleared. Every distribution
is written to a **per-LP log**, so it is answerable later who received which
version of which document, and when.

Drafts remain drafts until a human signs off. Nothing in this model produces a
figure, or a characterisation of performance, that ships to an investor without
review.

## Pricing

**Pro** plan and above, at $199/month. Requires a Fund Performance Engine
subscription — the generator reports from its records and cannot substitute
another source.
