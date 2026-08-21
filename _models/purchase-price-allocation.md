---
title: Purchase Price Allocation
slug: purchase-price-allocation
category: M&A
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Full allocation across tangibles, identifiable intangibles, deferred tax, and goodwill, with a reconciliation strip and per-intangible amortisation.
metrics:
  - { label: "Reconciliation",   value: "Must balance" }
  - { label: "Useful lives",     value: "Benchmarked" }
  - { label: "Auditor checklist", value: "Per allocation" }
  - { label: "Post-close",       value: "Monitored vs actual" }
analytics: true
demo:
  output: table
  cta: Allocate
  lead: Enter consideration and the target balance sheet. The reconciliation must tie exactly — goodwill is the residual, not a plug you choose.
  columns: [Component, Allocated, Useful life]
  row_labels: [Tangible assets, Customer relationships, Technology, Deferred tax liability, Goodwill]
  row_count: 5
  fields:
    - name: consideration
      type: number
      label: Purchase consideration
      value: 620000000
      min: 0
      step: 1000000
      unit: USD
    - name: net_assets
      type: number
      label: Target net assets
      value: 180000000
      min: 0
      step: 1000000
      unit: USD
    - name: standard
      type: select
      label: Standard
      options: [US GAAP, IFRS]
      value: US GAAP
    - name: tax_rate
      type: number
      label: Deferred tax rate
      value: 25
      min: 0
      max: 60
      unit: "%"
---

## What it does

Takes purchase consideration and the target balance sheet and returns a **full
allocation** across tangible assets, identifiable intangibles, deferred tax
liabilities, and goodwill — with a **reconciliation strip** confirming the
consideration is fully allocated, and a useful-life and amortisation schedule
per intangible.

## Goodwill is a residual

Everything identifiable is recognised and measured first; goodwill is whatever
consideration remains. It is not a balancing figure to be chosen.

The reconciliation strip enforces that. If the components do not tie exactly to
consideration, the allocation is incomplete — and the common failure is under-
identifying intangibles so that more value falls into goodwill, which is
convenient because goodwill is not amortised under US GAAP while identified
intangibles are.

That convenience is precisely why auditors scrutinise the split, and why every
allocation carries an **auditor-review checklist**.

## Useful lives drive future earnings

An intangible's useful life determines the annual amortisation charge, and
therefore reported earnings for years afterward. A customer relationship
assigned twelve years rather than seven produces materially better reported
profit without any difference in the business.

Lives are set against a **benchmark library by asset type and industry**, so
an assumption sits against comparable transactions rather than being chosen in
isolation.

## Checked after close

Modelled amortisation is compared against actuals each quarter. A PPA is one of
the few valuation exercises whose accuracy becomes observable, and comparing
against outcomes is how the benchmark library stays honest rather than
accumulating whatever assumptions were convenient at the time.

## Pricing

**Pro** plan and above, at $199/month.
