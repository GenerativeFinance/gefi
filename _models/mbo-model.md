---
title: MBO Model
slug: mbo-model
category: M&A
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK]
lead: Ownership and proceeds by stakeholder across exit scenarios, showing how incentive-pool sizing changes management's effective ownership.
metrics:
  - { label: "Stakeholders modelled", value: "Mgmt / sponsor / seller" }
  - { label: "Rollover",              value: "Modelled explicitly" }
  - { label: "Pool templates",        value: "By deal size" }
  - { label: "Share log",             value: "Per party" }
analytics: true
demo:
  output: table
  cta: Split the proceeds
  lead: Set the structure. Proceeds are shown per stakeholder — management's headline percentage and their effective ownership after pool dilution are different numbers.
  columns: [Stakeholder, Ownership %, Exit proceeds]
  row_labels: [Management rollover, Incentive pool, Sponsor equity, Seller note, Ordinary equity]
  row_count: 5
  fields:
    - name: price
      type: number
      label: Purchase price
      value: 48000000
      min: 0
      step: 1000000
      unit: USD
    - name: rollover
      type: number
      label: Management rollover
      value: 15
      min: 0
      max: 100
      unit: "%"
    - name: pool
      type: number
      label: Incentive pool
      value: 10
      min: 0
      max: 30
      unit: "%"
    - name: seller_note
      type: number
      label: Seller financing
      value: 20
      min: 0
      max: 100
      unit: "%"
---

## What it does

Takes purchase price, management rollover, sponsor equity, seller financing,
and incentive-pool sizing, and returns **ownership and proceeds by stakeholder
across exit scenarios**, with an alignment chart showing how pool sizing
changes management's **effective** ownership.

## Headline ownership is not effective ownership

Management in an MBO holds several overlapping claims: rolled-over equity, a
share of the incentive pool, and sometimes ordinary equity alongside the
sponsor. Each dilutes differently, and the pool vests against conditions that
may or may not be met.

So "management owns 25%" is rarely a usable statement. What management
actually receives at a given exit value depends on the interaction between
those claims and the sponsor's preference, and the difference between headline
and effective ownership is frequently large enough to change whether a
manager takes the deal.

Both are shown, side by side, across scenarios.

## Alignment is the point of the structure

The alignment chart exists because MBO structures fail in a specific way: a
pool sized so that management's outcome is dominated by sponsor preference at
realistic exit values leaves management economically indifferent to the
performance they are being incentivised to deliver.

Plotting management's effective ownership against exit value makes that
visible at design time. A structure where management's line is flat until an
exit value nobody expects to reach is a structure that has not aligned anyone.

## Seller financing changes the risk, not just the funding

Seller notes are common in MBOs because they bridge valuation gaps, and they
subordinate the seller to the sponsor's return. Term benchmarks are maintained
so the note is priced against comparable deals rather than negotiated blind.

## Communication log

Proceeds scenarios are shared with different parties at different times, and
management, sponsor, and seller each see a version. The **stakeholder log**
tracks which scenario went to which party — in a transaction where the parties
are also each other's counterparties, that matters.

## Pricing

**Pro** plan and above, at $199/month.
