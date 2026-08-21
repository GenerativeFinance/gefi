---
title: IPO Model
slug: ipo-model
category: Venture / Growth
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Post-IPO ownership and dilution, comps-based multiple comparison, pro forma statements, lock-up timeline — with every view and export logged.
metrics:
  - { label: "Access log",       value: "Every view + export" }
  - { label: "Comps feed",       value: "Health-monitored" }
  - { label: "Underwriter terms", value: "Benchmarked" }
  - { label: "Disclosure risk",  value: "Highest in catalogue" }
analytics: true
demo:
  output: table
  cta: Model the offering
  lead: Set the offering. Ownership and proceeds are shown across the price range — the range is the decision, not the midpoint.
  columns: [Price point, Post-IPO ownership %, Gross proceeds]
  row_labels: [Low end, Low-mid, Midpoint, Mid-high, High end]
  row_count: 5
  fields:
    - name: shares
      type: number
      label: Shares offered
      value: 12000000
      min: 0
      step: 100000
    - name: low
      type: number
      label: Range low
      value: 18
      min: 0
      step: 0.5
      unit: USD
    - name: high
      type: number
      label: Range high
      value: 22
      min: 0
      step: 0.5
      unit: USD
    - name: greenshoe
      type: checkbox
      label: Include greenshoe
      value: true
---

## Access to this model is logged

This is the most **disclosure-sensitive** model in the catalogue. A pre-IPO
cap table and offering range are material non-public information, and every
**view and export is recorded** against the person who made it.

That is not a deterrent feature bolted on. It is how a firm answers a
regulator asking who had access to the offering range and when.

## What it does

Takes a pre-IPO cap table, offering range, and underwriting terms and returns
**dilution and post-IPO ownership**, valuation-multiple comparison against
public comps, and pro forma statements — plus a **lock-up timeline** and an
offering-price sensitivity table.

## The range is the decision

An offering is priced within a range, and outcomes across that range differ
enough that modelling the midpoint alone is close to useless. Proceeds,
founder and investor ownership, and the implied multiple against comps all
move together across it.

So the sensitivity table is the primary output rather than an appendix. The
question a board is actually deciding is what happens at the low end, not what
happens if everything goes well.

## Lock-up is a supply schedule

The lock-up timeline is a forward calendar of share supply. Expiry dates
concentrate selling pressure at predictable moments, and staged or
partially-released lock-ups change that shape.

Anyone modelling post-IPO ownership without the expiry schedule is modelling a
snapshot of a structure whose whole point is that it changes on known dates.

## Comps quality

Multiple comparison is only as good as the comp set, and comps feed health is
monitored — a stale comp or a peer that has re-rated shifts the implied
valuation without anything about the issuer changing. Underwriter terms are
benchmarked so fee and structure sit against comparable offerings.

## Pricing

**Enterprise** tier, at $499/month, reflecting the access-control and audit
requirements.
