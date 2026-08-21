---
title: Lease vs. Buy Analyzer
slug: lease-vs-buy-analyzer
category: Real Estate
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU]
lead: Total-cost-of-ownership comparison with an NPV recommendation, and the ASC 842 / IFRS 16 treatment called out because it changes the balance sheet, not just the cash.
metrics:
  - { label: "Standards",      value: "ASC 842 / IFRS 16" }
  - { label: "Comparison",     value: "Cash + balance sheet" }
  - { label: "Discount rates", value: "Benchmarked by class" }
  - { label: "Accuracy",       value: "Tracked vs decisions" }
analytics: true
demo:
  output: table
  cta: Compare
  lead: Both options are costed over the same horizon. The accounting column matters as much as the cash column — a lease that wins on NPV can still land on the balance sheet.
  columns: [Factor, Lease, Buy]
  row_labels: [NPV of cash flows, Balance-sheet impact, Year-1 P&L charge, Flexibility, Residual exposure]
  row_count: 5
  fields:
    - name: purchase
      type: number
      label: Purchase price
      value: 6200000
      min: 0
      step: 50000
      unit: USD
    - name: lease_annual
      type: number
      label: Annual lease
      value: 520000
      min: 0
      step: 10000
      unit: USD
    - name: term
      type: number
      label: Term
      value: 10
      min: 1
      max: 40
      unit: years
    - name: standard
      type: select
      label: Standard
      options: [ASC 842, IFRS 16]
      value: IFRS 16
---

## What it does

Takes purchase price, lease terms, and financing and returns a **total-cost-of-
ownership comparison** and an **NPV-based recommendation** — with the
accounting treatment stated explicitly.

## The accounting answer and the cash answer are different questions

This is why the standard is a first-class input rather than a footnote.

Under **IFRS 16**, essentially every lease of substance comes onto the balance
sheet as a right-of-use asset and a lease liability. Under **ASC 842**, leases
also capitalise, but the operating/finance classification still governs how the
expense flows through the P&L — straight-line operating cost versus front-
loaded interest plus amortisation.

So a lease that wins on NPV can still raise reported leverage, move covenant
ratios, and change year-one earnings. A recommendation based only on discounted
cash flow answers a question the CFO was not solely asking.

Both are therefore reported: NPV of cash flows, and what each option does to
the balance sheet and the P&L.

## Flexibility has value that NPV understates

Buying commits capital to an asset and to a location. Leasing preserves the
option to exit, relocate, or resize at term. Standard NPV treats the two as
cash-flow streams and prices that option at zero.

For a business whose space requirement is uncertain — growing, restructuring,
or in a volatile market — that option is worth real money. It is called out
qualitatively rather than fabricated into the NPV, because a made-up option
value is worse than a stated one.

Residual exposure is the mirror image: ownership carries the risk of what the
asset is worth at the end, which a lease does not.

## Checked against what people actually did

Where tenants report back, modelled recommendations are compared against the
decision taken. A model that consistently recommends against what informed
operators choose has an assumption problem worth finding — most likely in the
discount rate, which comes from a **benchmark set by asset class**.

## Pricing

**Starter** plan, at $99/month.
