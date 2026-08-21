---
title: Tax Residency Classifier
slug: tax-residency-classifier
category: Compliance
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU]
lead: Determines tax residency from days present, ties, and applicable treaty, showing the tie-breaker trace and CRS/FATCA reportability.
metrics:
  - { label: "Backtest agreement", value: "94%" }
  - { label: "Treaty database",    value: "Versioned" }
  - { label: "Tie-breaker trace",  value: "Always shown" }
  - { label: "Reportability",      value: "CRS + FATCA" }
analytics: true
demo:
  output: table
  cta: Determine residency
  lead: Enter the facts. Each row is a step in the treaty tie-breaker, applied in order — the determination is the first step that resolves.
  columns: [Tie-breaker step, Outcome, Resolves]
  row_labels: [Permanent home, Centre of vital interests, Habitual abode, Nationality, Competent authority]
  row_count: 5
  fields:
    - name: days_a
      type: number
      label: Days in jurisdiction A
      value: 168
      min: 0
      max: 366
    - name: days_b
      type: number
      label: Days in jurisdiction B
      value: 142
      min: 0
      max: 366
    - name: treaty
      type: select
      label: Applicable treaty
      options: [US–UK, US–EU member, UK–EU member, No treaty]
      value: US–UK
    - name: home
      type: select
      label: Permanent home available in
      options: [Both, A only, B only, Neither]
      value: Both
    - name: crs
      type: checkbox
      label: Assess CRS / FATCA reportability
      value: true
---

## What it does

Takes the facts — days present, personal and economic ties, permanent home,
applicable treaty — and returns a **residency determination** with a
**confidence score**, a **CRS/FATCA reportability flag**, and the tie-breaker
trace that produced the answer.

## The trace is the deliverable

Treaty tie-breakers are **ordered tests**, applied in sequence until one
resolves: permanent home, then centre of vital interests, then habitual abode,
then nationality, then competent-authority agreement. A determination is only
meaningful alongside which test resolved it.

So the trace is always shown. "Resident in A" is not an answer a tax adviser
can rely on; "resident in A, resolved at centre of vital interests because a
permanent home was available in both" is, because it identifies exactly which
fact would need to change for the answer to change.

## Confidence, and what it means

Day counts are arithmetic. Centre of vital interests is a judgement about
where someone's personal and economic life is centred, and reasonable people
reach different conclusions on the same facts.

The confidence score reflects that difference. A determination resolved on day
counting is high-confidence; one resolved on vital interests is not, and is
flagged for review rather than returned as settled. Low-confidence cases route
to an **escalation queue** directed to counsel in the relevant jurisdiction.

## Keeping current

The treaty database is version-controlled, so a determination is reproducible
against the treaty text in force on the date it was made. CRS and FATCA rule
updates flow through a tracked pipeline, and classifier output is backtested
against actual rulings where those are available.

**This is not tax advice.** It is a structured determination with its
reasoning exposed, for a professional to review.

## Pricing

**Starter** plan and above, at $99/month. Additional treaty jurisdictions on
request.
