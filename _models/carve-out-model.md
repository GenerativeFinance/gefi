---
title: Carve-Out Model
slug: carve-out-model
category: M&A
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Standalone P&L and cash flow from allocated historicals, keeping reported, allocated, and pro forma figures visually separate.
metrics:
  - { label: "Column basis",      value: "Reported / allocated / pro forma" }
  - { label: "TSA timeline",      value: "Stepped down" }
  - { label: "Allocation basis",  value: "3 methods" }
  - { label: "Variance log",      value: "Per change" }
analytics: true
demo:
  output: table
  cta: Build standalone
  lead: The three columns are never blended. Reported is history, allocated is an assumption, pro forma is a projection — conflating them is how carve-out cases go wrong.
  columns: [Line, Allocated, Pro forma]
  row_labels: [Revenue, Gross profit, Allocated corporate, TSA charges, Standalone EBITDA]
  row_count: 5
  fields:
    - name: revenue
      type: number
      label: Carve-out revenue
      value: 180000000
      min: 0
      step: 1000000
      unit: USD
    - name: method
      type: select
      label: Allocation basis
      options: [Revenue-based, Headcount-based, Usage-based]
      value: Headcount-based
    - name: tsa_months
      type: number
      label: TSA period
      value: 18
      min: 0
      max: 48
      unit: months
    - name: tsa_cost
      type: number
      label: Initial TSA cost
      value: 14000000
      min: 0
      step: 500000
      unit: USD
---

## What it does

Takes historical allocated financials and standalone adjustments and returns a
**standalone P&L and cash flow**, presented in three visually distinct
columns — **reported**, **allocated**, **pro forma** — plus a
transition-service-agreement cost timeline that steps down across the TSA
period.

## Three columns, never blended

This is the core discipline of a carve-out model, and the reason the columns
are visually separated rather than merged into a single "standalone" view.

**Reported** is what the accounts actually show for the unit. **Allocated** is
management's assumption about the unit's share of costs it never separately
incurred. **Pro forma** is a projection of what it will cost to run alone.

Each is progressively less certain, and a diligence process spends most of its
time on the gap between the second and the third. A model that presents one
blended standalone EBITDA hides exactly the assumptions a buyer is paying to
scrutinise — and it is the presentation most likely to be disputed after
close.

## TSA costs step down, and rarely on schedule

Transition service agreements price the seller's continued provision of
functions the carve-out cannot yet run. They are meant to decline as the buyer
stands up its own capability.

They routinely run longer and cost more than modelled, because standing up a
function is harder than the plan assumed and because the seller has limited
incentive to accelerate. The timeline is modelled as a **stepped schedule**
rather than a single annual figure, and **TSA cost is tracked against actuals**
as separation progresses — the model is meant to be checked, not filed.

Every allocation assumption change writes to a **variance log**, since the
difference between the model at signing and the model at close is one of the
most contested artefacts in a carve-out.

## Pricing

**Pro** plan and above, at $199/month.
