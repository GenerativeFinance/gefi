---
title: Reserving Engine
slug: reserving-engine
category: Insurance / Reserving
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Chain-ladder and Bornhuetter-Ferguson reserves side by side from a claims triangle, with editable development factors and an IBNR bridge to ultimate.
metrics:
  - { label: "Methods",         value: "Chain-ladder + BF, side by side" }
  - { label: "Dev factors",     value: "Editable, live re-projection" }
  - { label: "IBNR bridge",     value: "Paid → reported → ultimate" }
  - { label: "Sign-off",        value: "Actuarial workflow" }
analytics: true
demo:
  output: table
  cta: Project reserves
  lead: Two methods, shown together. Where they agree, the reserve is robust; where they diverge, the divergence is the finding.
  columns: [Accident year, Chain-ladder, Bornhuetter-Ferguson]
  row_labels: [AY 2021, AY 2022, AY 2023, AY 2024, AY 2025]
  row_count: 5
  fields:
    - name: line
      type: select
      label: Line of business
      options: [Motor, Property, Casualty, Professional lines]
      value: Casualty
    - name: triangle
      type: select
      label: Triangle basis
      options: [Paid, Incurred]
      value: Incurred
    - name: tail_factor
      type: number
      label: Tail factor
      value: 1.05
      min: 1
      max: 2
      step: 0.01
    - name: bf_apriori
      type: number
      label: BF a priori loss ratio
      value: 65
      min: 0
      max: 200
      unit: "%"
---

## What it does

Takes a claims-triangle upload and returns **chain-ladder and
Bornhuetter-Ferguson reserves side by side**, an **editable
development-factor panel** with instant re-projection, and an **IBNR bridge**
from paid through reported to ultimate.

## Two methods side by side, because their disagreement is information

Chain-ladder trusts the triangle: it projects ultimates entirely from
historical development patterns, which makes it powerful on mature, stable
years and unreliable on green ones — in a recent accident year, chain-ladder
multiplies a small reported amount by a large factor, and small errors in
either explode.

Bornhuetter-Ferguson blends the triangle with an **a priori loss ratio**,
which stabilises the immature years exactly where chain-ladder is weakest —
at the cost of importing an assumption that may itself be wrong.

Shown together, the pattern is diagnostic: agreement on mature years and
divergence on recent ones is normal and expected; divergence on *mature*
years means either the development pattern has shifted or the a priori is
stale, and both are findings worth escalating rather than smoothing away.

## Editable factors, with the edit on the record

Development factors are judgement as much as arithmetic — actuaries adjust
them for known changes in claims handling, legislation, or mix. The panel
re-projects instantly so the cost of a judgement is visible as it is made,
and **method-selection governance records why a method was chosen per line of
business**, because "why did we book this number" is a question that outlives
the person who chose it.

The IBNR bridge makes the reserve legible to non-actuaries: paid to reported
to ultimate, each step labelled, so a board member can see what portion of the
booked reserve is claims nobody has reported yet.

## Sign-off is a workflow, not a signature line

Triangle data is validated on upload with anomaly flags — a negative
development cell or a discontinuity in a diagonal is caught before it flows
into a booked number. Actuarial sign-off feeds the compliance case system, so
a booked reserve traces to who approved it, on which data, using which method,
and why.

## Pricing

**Pro** plan and above, at $199/month.
