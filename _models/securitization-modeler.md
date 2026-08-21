---
title: Securitization Modeler
slug: securitization-modeler
category: Structured Finance
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Investor cash flows by tranche with WAL and credit enhancement, and a waterfall visual showing exactly where cash diverts when a trigger trips.
metrics:
  - { label: "Tranche outputs",  value: "Cash flow + WAL" }
  - { label: "Enhancement",      value: "Computed per tranche" }
  - { label: "Triggers",         value: "Per deal structure" }
  - { label: "Stress library",   value: "Centrally maintained" }
analytics: true
demo:
  output: table
  cta: Run the structure
  lead: Apply a stress and watch the waterfall. Senior tranches are protected by construction — the question is what that protection costs the tranches beneath.
  columns: [Tranche, WAL, Loss allocated]
  row_labels: [Class A, Class B, Class C, Class D, Residual]
  row_count: 5
  fields:
    - name: pool
      type: number
      label: Pool balance
      value: 750000000
      min: 0
      step: 10000000
      unit: USD
    - name: cdr
      type: number
      label: Default rate
      value: 3.5
      min: 0
      max: 40
      step: 0.1
      unit: "% CDR"
    - name: severity
      type: number
      label: Loss severity
      value: 35
      min: 0
      max: 100
      unit: "%"
    - name: cpr
      type: number
      label: Prepayment
      value: 12
      min: 0
      max: 60
      unit: "% CPR"
---

## What it does

Takes asset-pool, tranche-priority, and loss assumptions and returns
**investor cash flows by tranche**, **WAL and credit-enhancement metrics**, and
a waterfall and trigger visual showing where cash flow diverts under stress.

## Triggers are the part that surprises people

A securitisation behaves one way until a trigger trips and another way
afterwards. Delinquency and loss triggers redirect cash — typically to
accelerate senior amortisation — which protects the senior tranches exactly as
designed and abruptly changes the return profile of everything junior.

The visual exists to make that discontinuity concrete. The junior tranche
holder's downside is not a gradual erosion of return; it is a step change at a
threshold defined in a document, and the useful question is how close the pool
is to that threshold rather than what its expected loss is.

## WAL moves with prepayment, not just default

Weighted average life is where prepayment assumptions bite. Faster prepayment
shortens WAL and returns capital sooner, which is good for a discount tranche
and bad for a premium one. Slower prepayment extends exposure.

Prepayment and default are modelled separately because they are separate
behaviours that happen to affect the same schedule — and in stress they move in
opposite directions, which is why a single "bad scenario" understates the range
of outcomes.

## Consistency across deals

The stress library — prepayment, default, and recovery shocks — is maintained
**centrally by the structuring team** rather than per deal. Deal-specific stress
assumptions make deals incomparable and invite calibrating the stress until the
structure passes it.

Loan-level validation runs at ingestion, because a pool model built on
unvalidated tape produces precise numbers about the wrong collateral.

## Pricing

**Enterprise** tier, at $499/month.
