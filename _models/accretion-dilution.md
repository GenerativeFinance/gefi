---
title: Accretion / Dilution
slug: accretion-dilution
category: M&A
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Year-by-year EPS accretion or dilution with a break-even synergies calculator and sensitivities across price, financing mix, and close timing.
metrics:
  - { label: "Break-even synergies", value: "Solved" }
  - { label: "Sensitivities",        value: "Price / mix / timing" }
  - { label: "Consensus feed",       value: "Health-monitored" }
  - { label: "Annotations",          value: "Per cell" }
analytics: true
demo:
  output: curve
  cta: Run accretion
  lead: Set the terms. The line is accretion against a zero baseline — the crossover year is the number people actually quote.
  series_label: EPS accretion
  chart_label: Accretion / dilution by year
  x_labels: [Y1, Y5]
  fields:
    - name: price
      type: number
      label: Offer price per share
      value: 62
      min: 0
      step: 0.5
      unit: USD
    - name: cash_pct
      type: number
      label: Cash consideration
      value: 50
      min: 0
      max: 100
      unit: "%"
    - name: cost_of_debt
      type: number
      label: Financing cost
      value: 6.5
      min: 0
      max: 25
      step: 0.1
      unit: "%"
    - name: synergies
      type: number
      label: Run-rate synergies
      value: 30000000
      min: 0
      step: 1000000
      unit: USD
---

## What it does

Takes acquirer and target EPS, share counts, consideration, financing cost,
and synergies, and returns **year-by-year accretion or dilution**, a
**break-even synergies** figure, and sensitivity tables across price,
financing mix, and close timing. Accretion is charted against a zero line so
the crossover year is visible rather than read off a table.

## Break-even synergies is the honest question

"Is this deal accretive" has a trivially manipulable answer: change the
consideration mix until it is. Financing with cheap debt makes almost anything
accretive in year one, which is why year-one accretion on its own persuades
nobody who has seen a few deals.

**Break-even synergies inverts the question**: how much synergy must be
delivered for this deal to stop diluting EPS? That number is comparable across
deals, it is checkable against what the acquirer has publicly promised, and it
cannot be improved by re-cutting the financing.

## Accretion is not value

A deal can be accretive and value-destructive. Accretion is an arithmetic
consequence of the relationship between the acquirer's P/E, the target's P/E,
and the financing cost — a high-multiple acquirer buying a low-multiple target
with debt is accretive almost mechanically, regardless of whether the
businesses fit.

Which is why the sensitivity grids matter more than the headline. Close timing
in particular moves year-one accretion substantially through part-period
consolidation, and that is a calendar artefact rather than anything about the
deal.

## Annotation before export

Bankers leave rationale against individual sensitivity cells, so a model
arriving on someone's desk carries the reasoning for the case being made
rather than a bare grid. Assumption libraries are version-historied and the
consensus-EPS feed is health-monitored, since a stale consensus number silently
shifts every figure downstream of it.

## Pricing

**Pro** plan and above, at $199/month.
