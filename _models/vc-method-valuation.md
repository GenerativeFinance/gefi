---
title: VC Method Valuation
slug: vc-method-valuation
category: Venture / Growth
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [Global]
lead: Implied pre- and post-money from exit assumptions and a target return, with sensitivity heatmaps over multiple, growth, timing, and required return.
metrics:
  - { label: "Exit multiples",   value: "Benchmarked quarterly" }
  - { label: "Sensitivities",    value: "4-way heatmap" }
  - { label: "Return assumption", value: "Audit-trailed" }
  - { label: "Firm comparison",  value: "Same-stage history" }
analytics: true
demo:
  output: table
  cta: Value it
  lead: Work backwards from an exit. The valuation is a function of the required return, so the sensitivity grid matters more than the point estimate.
  columns: [Exit multiple, Implied post-money, Implied pre-money]
  row_labels: [4x revenue, 6x revenue, 8x revenue, 10x revenue, 12x revenue]
  row_count: 5
  fields:
    - name: exit_year
      type: number
      label: Exit year
      value: 6
      min: 1
      max: 15
    - name: exit_revenue
      type: number
      label: Exit revenue
      value: 120000000
      min: 0
      step: 1000000
      unit: USD
    - name: target_return
      type: number
      label: Target return
      value: 10
      min: 1
      max: 100
      unit: x
    - name: dilution
      type: number
      label: Expected future dilution
      value: 35
      min: 0
      max: 90
      unit: "%"
---

## What it does

Takes exit year, exit revenue or EBITDA, exit multiple, and a target investor
return, and returns the **implied post-money and pre-money valuation** with a
dilution table — plus sensitivity heatmaps across exit multiple, growth rate,
timing, and required return.

## It is a required-return calculation, not a valuation

The VC method does not value a company. It computes the price at which a
specified return is achievable given a set of exit assumptions, which is a
different thing wearing similar clothes.

Change the required return from 10x to 7x and the implied valuation rises
substantially with nothing about the company having changed. That is not a
flaw — it reflects that venture pricing is a function of fund economics and
the investor's own portfolio construction as much as of the asset.

But it does mean a single implied valuation is close to meaningless on its own,
which is why the **sensitivity grid is the primary output**. The point estimate
is one cell in it.

## Future dilution is easy to forget and expensive to omit

Today's ownership is not exit ownership. Subsequent rounds dilute, and a model
that computes return on current ownership overstates it — often by enough to
change the decision.

Expected future dilution is a required input rather than an optional
refinement, for that reason.

## Comparison against the firm's own history

Every valuation is shown against the firm's historical VC-method valuations
**at the same stage**. The useful question is rarely whether an assumption is
defensible in isolation; it is whether this deal is being underwritten on
assumptions the firm does not normally accept.

Target-return assumptions are audit-trailed per fund, and exit-multiple
benchmarks refresh quarterly.

## Pricing

**Starter** plan, at $99/month.
