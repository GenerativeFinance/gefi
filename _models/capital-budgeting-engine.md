---
title: Capital Budgeting Engine
slug: capital-budgeting-engine
category: Capital Budgeting
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [Global]
lead: NPV, IRR, payback and profitability index across candidate projects, ranked by value creation and capital efficiency.
metrics:
  - { label: "Metrics",         value: "NPV / IRR / PB / PI" }
  - { label: "WACC library",    value: "Per business unit" }
  - { label: "Portfolio view",  value: "Committed vs available" }
  - { label: "Approval",        value: "NPV-threshold gated" }
analytics: true
demo:
  output: table
  cta: Rank the projects
  lead: Compare candidates. Ranking by NPV and by profitability index gives different orders — which one is right depends on whether capital is constrained.
  columns: [Project, NPV, Profitability index]
  row_labels: [Line expansion, Automation retrofit, New facility, Systems upgrade, Fleet replacement]
  row_count: 5
  fields:
    - name: discount_rate
      type: number
      label: Discount rate
      value: 9.5
      min: 0
      max: 40
      step: 0.1
      unit: "%"
    - name: capital
      type: number
      label: Available capital
      value: 40000000
      min: 0
      step: 1000000
      unit: USD
    - name: horizon
      type: number
      label: Evaluation horizon
      value: 10
      min: 1
      max: 40
      unit: years
    - name: rank_by
      type: select
      label: Rank by
      options: [NPV, IRR, Profitability index, Payback]
      value: Profitability index
---

## What it does

Takes project cost, timing, and cash flows and returns **NPV, IRR, payback
period, and profitability index**, with a multi-project comparison table
sortable by any metric.

## NPV and profitability index rank differently, and both can be right

NPV measures total value created. Profitability index measures value created
**per unit of capital**. They agree only when capital is unconstrained.

When it is constrained — which is the situation capital budgeting exists to
address — a large project with the highest NPV can consume budget that three
smaller projects would have turned into more total value. Ranking on NPV alone
systematically favours big projects; ranking on PI alone systematically favours
small ones and can leave capital unspent.

Both are shown, and the ranking control is explicit rather than defaulted,
because choosing the ranking metric *is* the capital-allocation decision.

## IRR is the metric to trust least

IRR is intuitive and widely quoted, and it misleads in specific ways: it
assumes interim cash flows reinvest at the IRR itself, it can produce multiple
values for projects with sign changes in their cash flows, and it is
insensitive to project scale — a 40% return on $200k looks better than 18% on
$20M and creates far less value.

It is reported because people expect it. NPV and PI are what the ranking should
rest on.

## Portfolio view

Projects are evaluated individually and funded collectively. The dashboard
shows **total committed against available capital** across everything modelled,
so an approval is visible against what remains rather than assessed in
isolation. Discount rates come from a **per-business-unit WACC library** — a
single corporate rate applied to units with different risk profiles
systematically over-funds the risky ones.

## Pricing

**Starter** plan, at $99/month.
