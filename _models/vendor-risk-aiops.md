---
title: Vendor Risk AIOps
slug: vendor-risk-aiops
category: Ops / Risk
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU, UAE, SG]
lead: Composite vendor risk across financial, cyber, and concentration dimensions, with continuous monitoring and contract-clause flags.
metrics:
  - { label: "Alert precision",   value: "0.86" }
  - { label: "Dimensions scored", value: "3" }
  - { label: "Monitoring",        value: "Continuous" }
  - { label: "Regions",           value: "US, UK, EU, UAE, SG" }
analytics: true
demo:
  output: score
  cta: Score the vendor
  lead: Enter a vendor. The composite score combines three dimensions; the bars below show what each contributes.
  score_label: Composite risk
  drivers: [Financial health, Cyber posture, Concentration, Contract terms]
  fields:
    - name: vendor
      type: text
      label: Vendor
      value: Northwind Data Services
      placeholder: Vendor legal name
    - name: category
      type: select
      label: Category
      options: [Cloud infrastructure, Data provider, Payments, Professional services, Logistics]
      value: Cloud infrastructure
    - name: spend
      type: number
      label: Annual spend
      value: 1200000
      min: 0
      step: 10000
      unit: USD
    - name: criticality
      type: select
      label: Criticality
      options: [Low, Material, Critical]
      value: Critical
    - name: clauses
      type: checkbox
      label: Flag SLA and contract-clause risk
      value: true
---

## What it does

Scores a vendor across three dimensions — **financial**, **cyber**, and
**concentration** — into a composite risk figure, then keeps monitoring
continuously rather than at renewal. Output includes SLA and contract-clause
flags and a portfolio view of where spend is concentrated by risk tier.

## Why concentration is scored separately

Financial and cyber risk are properties of the vendor. **Concentration is a
property of your portfolio.** A vendor with excellent financials and a clean
security posture is still a serious exposure if four critical systems depend on
it and no alternative is contracted.

Scoring concentration as its own dimension means a low-risk vendor can still
raise a portfolio-level flag — which is the case procurement teams most often
miss, because nothing about the vendor itself looks wrong.

The portfolio view is a treemap by spend and risk tier, so concentration is
visible as area rather than inferred from a list.

## Continuous, not periodic

Vendor risk assessed annually is a snapshot of a year-old vendor. Financial
deterioration, breach disclosure, and adverse news arrive between review
cycles, so monitoring runs continuously against financial data, cyber scans,
and news sentiment, with connector health surfaced per source.

## Tuning alert precision

Continuous monitoring is only useful if the alerts are trusted, and the failure
mode is volume: a feed that fires on every news mention trains a team to ignore
it. Precision is tunable with a **live precision/recall preview**, so the
trade-off is made deliberately and visibly rather than discovered after
everyone has muted the channel.

Alerts that clear the threshold escalate to procurement with an SLA countdown,
so an accepted alert has an owner and a clock rather than a queue position.

## Pricing

**Starter** plan and above, at $99/month. Cross-tenant aggregate exposure
reporting is available to enterprise customers.
