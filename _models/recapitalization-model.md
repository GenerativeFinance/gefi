---
title: Recapitalization
slug: recapitalization-model
category: M&A
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Before-and-after leverage, interest expense, covenant headroom, and ownership change, with a dividend-recap proceeds calculator.
metrics:
  - { label: "Covenant library",   value: "Per agreement" }
  - { label: "Rating impact",      value: "Comps-estimated" }
  - { label: "Structures",         value: "Version-historied" }
  - { label: "Dividend recap",     value: "Modelled" }
analytics: true
demo:
  output: table
  cta: Model the recap
  lead: Compare current and proposed structures. Headroom is the constraint that binds first — a recap that optimises rate and loses headroom has bought fragility.
  columns: [Metric, Current, Proposed]
  row_labels: [Net debt / EBITDA, Interest cover, Interest expense, Covenant headroom, Sponsor ownership]
  row_count: 5
  fields:
    - name: new_debt
      type: number
      label: Proposed debt
      value: 260000000
      min: 0
      step: 5000000
      unit: USD
    - name: rate
      type: number
      label: Blended rate
      value: 7.2
      min: 0
      max: 25
      step: 0.1
      unit: "%"
    - name: dividend
      type: number
      label: Dividend to shareholders
      value: 90000000
      min: 0
      step: 5000000
      unit: USD
    - name: purpose
      type: select
      label: Purpose
      options: [Dividend recap, Refinancing, Leverage reduction]
      value: Dividend recap
---

## What it does

Takes current and proposed capital structures and returns **before/after
leverage ratios**, **interest-expense impact**, **covenant headroom**, and
shareholder ownership changes, with a dividend-recap proceeds calculator and a
side-by-side credit-metrics comparison.

## Headroom binds before ratios do

Leverage ratios are how a recap is discussed. Covenant headroom is what
constrains it.

A structure can look reasonable on net-debt-to-EBITDA and sit close enough to a
maintenance covenant that one soft quarter triggers a breach. Breach
consequences are discontinuous — waiver negotiations, repricing, in the worst
case acceleration — so the distance to the covenant matters far more than the
ratio itself.

The comparison therefore leads with headroom under the **proposed** structure,
not just the ratio, and headroom is computed from the **covenant library
maintained per lender-agreement template** rather than from a generic
definition. Covenant definitions differ between agreements in ways that change
the answer: what counts in EBITDA, which addbacks are permitted, how debt is
measured.

## Dividend recaps deserve the plainest possible framing

A dividend recapitalisation raises debt to pay shareholders. It transfers value
from the balance sheet to owners and leaves the business carrying the
liability. Sometimes that is entirely defensible.

The model shows the resulting metrics without softening: post-recap leverage,
reduced headroom, higher fixed charges, and the proceeds figure alongside them.
Whether the trade is sound is a judgement for the board; the model's job is to
avoid presenting the proceeds without the cost.

Rating impact is estimated from market comps, since a downgrade changes the
cost of the next refinancing and is often the real constraint on how far a
recap can go.

## Pricing

**Pro** plan and above, at $199/month.
