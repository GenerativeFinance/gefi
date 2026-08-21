---
title: Cap Table Manager
slug: cap-table-manager
category: Venture / Growth
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU]
lead: Interactive cap table across every instrument, with a round simulator that updates ownership, pool, and per-stakeholder dilution in place.
metrics:
  - { label: "Instruments",     value: "Common / pref / options / SAFEs" }
  - { label: "Reconciliation",  value: "Must total 100%" }
  - { label: "Access log",      value: "Full audit trail" }
  - { label: "Templates",       value: "Per jurisdiction" }
analytics: true
demo:
  output: table
  cta: Simulate a round
  lead: Add a round and watch dilution land. Pool top-ups are the dilution founders most often miss, so they are shown as their own line.
  columns: [Stakeholder, Pre-round %, Post-round %]
  row_labels: [Founders, Employee pool, Seed preferred, Series A preferred, New round]
  row_count: 5
  fields:
    - name: raise
      type: number
      label: Round size
      value: 12000000
      min: 0
      step: 500000
      unit: USD
    - name: pre_money
      type: number
      label: Pre-money
      value: 48000000
      min: 0
      step: 1000000
      unit: USD
    - name: pool
      type: number
      label: Post-round option pool
      value: 12
      min: 0
      max: 40
      unit: "%"
    - name: pool_pre
      type: checkbox
      label: Pool created pre-money
      value: true
---

## What it does

An interactive table across founders, employees, investors, and every share
class — common, preferred, options, warrants, SAFEs, notes — with a
**financing-round simulator**: add a round and ownership, option pool, and
each stakeholder's dilution update in place.

## The pool shuffle is the dilution people miss

Where the option pool is created decides who pays for it.

A pool created **pre-money** dilutes existing shareholders — overwhelmingly the
founders — before the new investor's ownership is calculated. Created
**post-money**, it dilutes everyone including the new investor. The headline
valuation is identical either way, and founder ownership after the round can
differ by several percentage points.

This is standard practice and not a trick, but it is routinely misunderstood by
first-time founders, who negotiate hard on pre-money valuation and concede the
pool structure without registering that they have handed back part of what they
won. The simulator makes it a visible toggle rather than a buried assumption.

## Reconciliation is not optional

A cap table that does not total 100% is wrong in a way that becomes expensive
at exactly the wrong moment — during diligence, or at a distribution. The
**integrity checker** refuses to let a table drift, and share-class templates
follow each jurisdiction's standard instruments rather than a generic model.

## Access is logged

A cap table is among the most sensitive documents a company holds. It reveals
what everyone owns, what they paid, and what the company conceded to raise.
Every access is recorded.

## Pricing

**Starter** plan, at $99/month.
