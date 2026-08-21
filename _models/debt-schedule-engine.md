---
title: Debt Schedule Engine
slug: debt-schedule-engine
category: Treasury
featured: false
risk: medium
maturity: GA
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Linked schedule across revolver, term loans and notes with sweep, covenant headroom, and a maturity strip that makes a refinancing wall obvious early.
metrics:
  - { label: "Instruments",     value: "Revolver / TL / notes" }
  - { label: "Sweep",           value: "Toggleable" }
  - { label: "Covenants",       value: "Per lender template" }
  - { label: "Maturity wall",   value: "Early warning" }
analytics: true
demo:
  output: curve
  cta: Build the schedule
  lead: The curve is covenant headroom over time. A wall shows up here long before it shows up in a maturity table.
  series_label: Covenant headroom
  chart_label: Headroom across the schedule
  x_labels: [Now, Y7]
  fields:
    - name: total_debt
      type: number
      label: Total debt
      value: 420000000
      min: 0
      step: 10000000
      unit: USD
    - name: revolver
      type: number
      label: Revolver drawn
      value: 60000000
      min: 0
      step: 5000000
      unit: USD
    - name: rate
      type: number
      label: Blended rate
      value: 7.4
      min: 0
      max: 25
      step: 0.1
      unit: "%"
    - name: sweep
      type: checkbox
      label: Apply cash sweep
      value: true
---

## What it does

Takes a company's revolver, term loans, and notes into a **linked debt
schedule** with mandatory and optional amortisation, a **cash-sweep toggle**,
and covenant calculations against a live **headroom gauge** — with maturities
rendered as a **timeline strip**.

## A refinancing wall is a solvable problem, early

Maturity concentration is one of the few genuinely predictable corporate
crises. Everyone knows the dates. What goes wrong is that the wall stays
comfortably distant on a spreadsheet until the refinancing window is twelve
months out and the terms available are whatever the market is offering that
quarter.

Rendering maturities as a **visual strip** rather than a column of dates is a
small change that makes concentration obvious years ahead, while options —
extending, refinancing early, deleveraging into it — are still cheap. The
early-warning monitor runs across every modelled debt stack, not one at a time.

## The schedule has to be linked

Debt schedules break when instruments are modelled independently. The sweep
draws on cash that the revolver also draws on; paying down a term loan changes
interest, which changes cash, which changes what the sweep can pay next period.

Modelling those separately produces a schedule that looks fine and does not
reconcile. Linking them means the sweep toggle propagates all the way through
rather than adjusting one line.

## Covenants come from the agreement, not a template

Headroom depends on definitions that differ between credit agreements — what
counts in EBITDA, which addbacks are permitted, whether debt is gross or net of
cash. A generic covenant calculation can report comfortable headroom on a
definition the lender does not use.

Definitions are maintained **per lender-agreement template**, and refinancing
scenarios are pushed out by the risk team as market rates move, so a company's
wall is assessed against current pricing rather than the pricing that existed
when the model was built.

## Pricing

**Pro** plan and above, at $199/month.
