---
title: Spin-Off Model
slug: spin-off-model
category: M&A
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Pro forma statements for parent and spun-off entity, with an explicit stranded-cost estimate and a separation timeline.
metrics:
  - { label: "Entities modelled", value: "Parent + SpinCo" }
  - { label: "Stranded costs",    value: "Estimated" }
  - { label: "Allocation library", value: "Versioned" }
  - { label: "Sign-off",          value: "Finance / legal / tax" }
analytics: true
demo:
  output: table
  cta: Model the separation
  lead: Set the perimeter. The two entities are shown against the combined base — stranded cost is the line that decides whether separation creates value.
  columns: [Line, Parent, SpinCo]
  row_labels: [Revenue, EBITDA, Allocated overhead, Standalone costs, Stranded cost]
  row_count: 5
  fields:
    - name: spinco_rev
      type: number
      label: SpinCo revenue
      value: 240000000
      min: 0
      step: 1000000
      unit: USD
    - name: shared_costs
      type: number
      label: Shared services cost
      value: 38000000
      min: 0
      step: 500000
      unit: USD
    - name: method
      type: select
      label: Allocation method
      options: [Revenue-based, Headcount-based, Usage-based]
      value: Usage-based
    - name: timeline
      type: number
      label: Separation timeline
      value: 12
      min: 3
      max: 36
      unit: months
---

## What it does

Takes parent financials, the transferred asset and liability perimeter, and
standalone cost assumptions, and returns **pro forma statements for both
entities**, a **stranded-cost estimate**, and a separation timeline — with a
combined-versus-separated value comparison.

## Stranded cost is the number that decides it

When a business is spun off, it takes its revenue and its direct costs. It
does not take its share of the parent's overhead, because that overhead does
not divide cleanly — a finance function, a data centre, a leadership team.

The parent is left carrying cost that used to be spread across a larger
revenue base. That is **stranded cost**, and it is routinely underestimated in
spin-off cases because it appears nowhere in the historical accounts of either
entity: it is created by the separation.

Meanwhile SpinCo must build its own version of everything it used to consume
centrally, usually at worse unit economics than the shared function achieved.
The combined cost of the two entities after separation is therefore reliably
higher than the cost of the combined entity before it.

A separation case has to clear that gap. Showing it explicitly is the point of
the model.

## Allocation methodology is a choice with consequences

Revenue-based, headcount-based, and usage-based allocation produce materially
different pictures of the same business. Usage-based is usually closest to
economic reality and hardest to compute; revenue-based is easiest and most
misleading for a unit whose cost profile differs from the group's.

Methodologies live in a **versioned library**, so a model states which basis
produced it and a later reviewer can re-run it on another basis.

## Sign-off is cross-functional

Spin-offs fail on tax and legal structuring at least as often as on the
financial case, so the model is not final until finance, legal, and tax have
each signed off. The tracker enforces sequence rather than recording it after
the fact.

## Pricing

**Pro** plan and above, at $199/month.
