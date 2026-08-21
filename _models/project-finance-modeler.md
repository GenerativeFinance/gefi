---
title: Project Finance Modeler
slug: project-finance-modeler
category: Project Finance
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU, UAE]
lead: Full debt-service schedule with DSCR and LLCR against covenant minimums, separate lender and sponsor views, and a headroom traffic light.
metrics:
  - { label: "Coverage",        value: "DSCR + LLCR" }
  - { label: "Views",           value: "Lender and sponsor" }
  - { label: "Headroom",        value: "Traffic light" }
  - { label: "Breach warning",  value: "Across live projects" }
analytics: true
demo:
  output: curve
  cta: Run the schedule
  lead: Set construction and operating assumptions. The curve is DSCR against its covenant floor — the minimum across the schedule is what matters, not the average.
  series_label: DSCR
  chart_label: DSCR through the debt tenor
  x_labels: [COD, Maturity]
  fields:
    - name: capex
      type: number
      label: Construction cost
      value: 480000000
      min: 0
      step: 10000000
      unit: USD
    - name: gearing
      type: number
      label: Gearing
      value: 70
      min: 0
      max: 95
      unit: "%"
    - name: tenor
      type: number
      label: Debt tenor
      value: 18
      min: 1
      max: 35
      unit: years
    - name: dscr_covenant
      type: number
      label: DSCR covenant
      value: 1.3
      min: 1
      max: 3
      step: 0.05
      unit: x
---

## What it does

Takes construction and operating-period inputs and returns a **full
debt-service schedule**, **DSCR and LLCR charts against covenant minimums**,
separate **lender and sponsor return views**, a construction-drawdown timeline,
and a covenant-headroom traffic light.

## The minimum DSCR is the covenant, not the average

Debt service coverage is tested **each period**. A project averaging 1.6x with
one period at 1.15x against a 1.3x covenant has breached, and the average is
irrelevant to that fact.

So the chart plots DSCR across the whole tenor against the covenant line, and
the traffic light reflects the **worst period**, not the mean. Amber is the
state worth designing for: comfortably above the covenant is not the same as
close enough that a modest revenue shortfall breaches it.

LLCR sits alongside because it answers a different question — whether the
project's remaining cash flows cover the remaining debt over its life — and a
project can look adequate on one measure and thin on the other.

## Lender and sponsor see different projects

The lender cares about downside: coverage in bad cases, reserve adequacy,
whether debt is repaid. The sponsor cares about equity return, which is
determined by what remains after debt service and is therefore geared and far
more volatile.

Presenting one blended view serves neither. The same model produces both, and
the difference between them is usually where negotiation actually happens.

## Warning across the portfolio

The **DSCR early-warning monitor** runs across every live project a tenant
tracks, not just the one on screen. Reserve-account balances are dashboarded
alongside, because reserves are the mechanism that converts a bad quarter into
a survivable one, and their depletion is the leading indicator of trouble that
period-by-period DSCR alone does not show.

## Pricing

**Enterprise** tier, at $499/month.
