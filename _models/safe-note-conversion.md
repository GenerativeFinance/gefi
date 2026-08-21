---
title: SAFE & Note Conversion
slug: safe-note-conversion
category: Venture / Growth
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK]
lead: Conversion price and resulting ownership, shown side by side for pre-money and post-money SAFE treatment so the dilution difference is explicit.
metrics:
  - { label: "Forms",            value: "YC + NVCA standard" }
  - { label: "Treatments",       value: "Pre- vs post-money" }
  - { label: "Regression suite", value: "On conversion math" }
  - { label: "Runs",             value: "Audit-trailed" }
analytics: true
demo:
  output: table
  cta: Convert
  lead: Enter the instrument and the qualifying round. The two treatments are shown together — same cap, same discount, different founder dilution.
  columns: [Treatment, Conversion price, Founder dilution]
  row_labels: [Pre-money SAFE, Post-money SAFE, Discount only, Cap only, Note with interest]
  row_count: 5
  fields:
    - name: principal
      type: number
      label: Principal
      value: 1500000
      min: 0
      step: 50000
      unit: USD
    - name: cap
      type: number
      label: Valuation cap
      value: 12000000
      min: 0
      step: 500000
      unit: USD
    - name: discount
      type: number
      label: Discount
      value: 20
      min: 0
      max: 50
      unit: "%"
    - name: round_pre
      type: number
      label: Qualifying round pre-money
      value: 30000000
      min: 0
      step: 1000000
      unit: USD
---

## What it does

Takes principal, valuation cap, discount, and a qualifying financing, and
returns the **conversion price and resulting ownership** — shown side by side
for **pre-money and post-money SAFE treatment**.

## Pre-money and post-money SAFEs are different instruments

They read almost identically and they allocate dilution very differently.

Under a **pre-money** SAFE, the ownership a SAFE holder receives depends on
what else converts alongside it: multiple SAFEs dilute each other, and the
founder's final position depends on the whole stack interacting. Under a
**post-money** SAFE, the holder's percentage is fixed at conversion and does not
dilute against other SAFEs — every subsequent SAFE dilutes the **founders**
instead.

Founders who raised several post-money SAFEs across a long pre-seed period
frequently discover at their priced round that they own materially less than
they expected. Nothing was hidden; the arithmetic simply compounds in a
direction that is not obvious when signing the second, third, and fourth
instrument.

Showing both treatments against the same inputs is the clearest way to make
that legible before it is irreversible.

## This is the model where a rounding bug changes ownership

Most models in this catalogue produce an estimate. This one produces an
**allocation** — the number that goes into a cap table and determines what
people own.

A conversion off by a fraction of a percent is not a modelling inaccuracy, it
is a wrong ownership position that will be relied upon and may be discovered
years later. The conversion math therefore carries a **regression-test suite**
covering the standard YC and NVCA forms, and every calculation run is
audit-trailed.

## Pricing

**Starter** plan, at $99/month.
