---
title: Waterfall Distribution Engine
slug: waterfall-distribution
category: Venture / Growth
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Distribution by stakeholder across the preference stack, redrawing live against exit value so the breakpoints are visible.
metrics:
  - { label: "Tiers",            value: "Visually stacked" }
  - { label: "Cap-table sync",   value: "Reconciled" }
  - { label: "Preference stack", value: "By round vintage" }
  - { label: "Runs",             value: "Version-historied" }
analytics: true
demo:
  output: table
  cta: Run the waterfall
  lead: Move exit value and watch the tiers fill. The interesting values are the breakpoints, where the next class starts receiving nothing.
  columns: [Class, Distribution, "% of exit"]
  row_labels: [Series B preferred, Series A preferred, Seed preferred, Common, Option pool]
  row_count: 5
  fields:
    - name: exit_value
      type: number
      label: Exit value
      value: 180000000
      min: 0
      step: 5000000
      unit: USD
    - name: pref_multiple
      type: number
      label: Senior preference
      value: 1
      min: 1
      max: 3
      step: 0.25
      unit: x
    - name: participation
      type: select
      label: Participation
      options: [Non-participating, Participating, Participating capped at 2x]
      value: Non-participating
    - name: total_pref
      type: number
      label: Total preference stack
      value: 95000000
      min: 0
      step: 5000000
      unit: USD
---

## What it does

Takes security classes, liquidation preferences, and participation terms and
returns a **distribution-by-stakeholder table** that redraws as exit value
changes, with each waterfall tier **visually stacked** so a reader sees where
exit value stops covering the next class.

## Breakpoints are the whole answer

A waterfall is not smooth. It is a series of thresholds, and between them the
distribution to a given class can be entirely flat.

Below the total preference stack, common holders receive **nothing** — not a
little, nothing — however hard they worked and whatever the headline exit
number looks like. A $95M preference stack and a $90M exit is a good outcome in
a press release and a zero for every employee holding common.

Which is why exit value is a slider rather than an input box. The question is
never "what happens at this number", it is "where are the cliffs", and the
stacked visual is built to show a founder or an employee exactly which exit
value makes their equity worth something.

## Non-participating is a choice, not a default

Under a non-participating preference the investor takes the greater of their
preference or their converted share. Participating means they take the
preference **and** convert, which pays them twice out of the same exit and
pushes every breakpoint upward.

The difference is invisible at a very strong exit and decisive in the middle
range. Showing both is the only way the structure's cost is legible to the
people it falls on.

## Reconciled against the cap table

The waterfall reconciles against the Cap Table Manager for the same company, so
the two never drift. A waterfall run on a stale cap table produces confident
numbers about the wrong ownership — and it is usually run at exactly the moment
nobody has time to re-check. Every run is version-historied.

## Pricing

**Pro** plan and above, at $199/month.
