---
title: LBO Model
slug: lbo-model
category: M&A
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Sources and uses, debt paydown with cash sweep, and a returns waterfall showing sponsor IRR and MOIC across entry and exit multiple grids.
metrics:
  - { label: "Debt tranches",     value: "Modelled" }
  - { label: "Cash sweep",        value: "Scheduled" }
  - { label: "Comps feed",        value: "Weekly" }
  - { label: "Export audit",      value: "Per counterparty" }
analytics: true
demo:
  output: table
  cta: Run the LBO
  lead: Set entry, leverage, and exit. Returns decompose into their sources — the split between multiple expansion and operations is what a committee interrogates.
  columns: [Return driver, Contribution, "% of MOIC"]
  row_labels: [EBITDA growth, Margin expansion, Debt paydown, Multiple expansion, Fees and costs]
  row_count: 5
  fields:
    - name: entry_multiple
      type: number
      label: Entry multiple
      value: 11.5
      min: 1
      max: 30
      step: 0.1
      unit: x EBITDA
    - name: leverage
      type: number
      label: Total leverage
      value: 5.5
      min: 0
      max: 12
      step: 0.1
      unit: x EBITDA
    - name: exit_multiple
      type: number
      label: Exit multiple
      value: 12.0
      min: 1
      max: 30
      step: 0.1
      unit: x EBITDA
    - name: hold
      type: number
      label: Hold period
      value: 5
      min: 1
      max: 15
      unit: years
---

## What it does

Takes entry valuation, debt tranches, an operating forecast, and exit
assumptions, and returns a **sources-and-uses table**, a **debt paydown
schedule with cash sweep**, and a **returns waterfall** decomposing sponsor
IRR and MOIC — with entry and exit multiple sensitivity grids and an
entry-to-exit equity bridge.

## Where the return actually came from

An LBO return has a small number of sources: EBITDA growth, margin expansion,
debt paydown, and multiple expansion. They are not equally creditable.

Multiple expansion is largely a bet on the exit environment. A model whose
returns rest on exiting two turns above entry is making a market call, not an
operational one — and every investment committee wants that separated out,
because it is the component the sponsor does not control.

So the waterfall decomposes rather than reporting a single IRR. Two deals with
identical MOIC can have entirely different risk profiles depending on this
split.

## Cash sweep is where leverage becomes a schedule

The sweep converts an operating forecast into a deleveraging path, and it is
sensitive to exactly the assumptions least likely to hold: working-capital
timing, capex phasing, a soft year in the middle of the hold.

Because the sweep compounds, a single weak year early does more damage than
the same shortfall later. The schedule is shown year by year rather than as an
average, and covenant headroom is calculated alongside it — a plan that
deleverages successfully but trips a covenant in year two never gets to year
three.

Debt-market comps refresh weekly, so entry leverage and pricing reflect what
is actually available rather than what was available when the template was
built.

## Export audit

Every model export links to the deal team and the counterparty it went to. In
a live process the same asset is modelled for several parties, and knowing
which version went where is a governance requirement rather than a nicety.

## Pricing

**Enterprise** tier, at $499/month.
