---
title: Fund Performance Engine
slug: fund-performance-engine
category: Private Funds
featured: false
risk: medium
maturity: Beta
federated: true
price: 199
jurisdictions: [US, UK, EU]
lead: Gross and net IRR, MOIC, DPI, RVPI and TVPI from investment-level cash flows, with vintage comparison and a federated PME benchmark.
metrics:
  - { label: "Gross and net",   value: "Both reported" }
  - { label: "Benchmark",       value: "Federated PME" }
  - { label: "Fee waterfall",   value: "Audited" }
  - { label: "Exit sensitivity", value: "On unrealised" }
analytics: true
demo:
  output: table
  cta: Compute performance
  lead: Cash flows roll up to fund metrics. Gross and net are shown together — the spread between them is what the LP actually paid.
  columns: [Metric, Gross, Net]
  row_labels: [IRR, MOIC, DPI, RVPI, TVPI]
  row_count: 5
  fields:
    - name: vintage
      type: number
      label: Vintage
      value: 2019
      min: 2000
      max: 2030
    - name: called
      type: number
      label: Capital called
      value: 190000000
      min: 0
      step: 5000000
      unit: USD
    - name: carry
      type: number
      label: Carried interest
      value: 20
      min: 0
      max: 40
      unit: "%"
    - name: exit_mult
      type: number
      label: Exit multiple on unrealised
      value: 2.5
      min: 0
      max: 10
      step: 0.1
      unit: x
---

## What it does

Rolls investment-level cash flows into **gross and net IRR, MOIC, DPI, RVPI,
and TVPI**, with vintage-year comparison and a **federated PME benchmark**
against an anonymised peer universe at the same vintage.

## Gross and net, always both

The spread between gross and net is what the LP paid for access: management
fees, carried interest, fund expenses. It is frequently several hundred basis
points of IRR.

Reporting gross alone describes the investments. Reporting net alone describes
the LP's outcome. Both are needed, and quoting whichever is more flattering is
common enough that showing them together is a stance rather than a formatting
choice.

The **fee-and-carry waterfall is independently audited** within the model,
because carry calculations involve hurdle rates, catch-up provisions, and
whether carry is computed deal-by-deal or whole-of-fund — each of which
materially changes the net figure and none of which is visible in a headline
number.

## Why PME rather than a peer median

Peer-median comparison tells a GP where they rank among funds that raised at
the same time. **Public market equivalent** asks a harder question: would the
LP have done better putting the same cash flows, on the same dates, into a
public index?

That is the question an allocator actually faces, and it is unforgiving in a
way a peer median is not — an entire vintage can underperform public markets
while its median fund looks respectable against its peers.

## Unrealised is where the uncertainty lives

RVPI is a mark, not a result. The **exit-sensitivity tool** models a range of
exit multiples on remaining holdings so a GP can see how much of reported TVPI
depends on unrealised positions performing as marked — the number that moves
most between a fund's interim reporting and its final result.

## Pricing

**Pro** plan and above, at $199/month. Federated PME benchmarking requires
data-partner onboarding.
