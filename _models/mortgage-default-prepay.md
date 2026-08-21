---
title: Mortgage Default & Prepay
slug: mortgage-default-prepay
category: Credit
featured: false
risk: medium
maturity: Beta
federated: true
price: 199
jurisdictions: [US, UK]
lead: Paired default and prepayment curves over a loan's life, federated across servicers, with a servicing recommendation and rate/HPI shock testing.
metrics:
  - { label: "Default AUC",        value: "0.81" }
  - { label: "Prepay AUC",         value: "0.77" }
  - { label: "Servicer network",   value: "9" }
  - { label: "Cohorts monitored",  value: "By vintage" }
analytics: true
demo:
  output: curve
  cta: Project the loan
  lead: Enter a loan or shock the environment. Default and prepayment are projected together — they are competing risks, not independent ones.
  series_label: Default hazard
  chart_label: Default hazard over loan life
  x_labels: [Year 1, Year 30]
  fields:
    - name: balance
      type: number
      label: Current balance
      value: 320000
      min: 0
      step: 5000
      unit: USD
    - name: ltv
      type: number
      label: LTV
      value: 78
      min: 1
      max: 125
      unit: "%"
    - name: rate_shock
      type: number
      label: Rate shock
      value: 0
      min: -300
      max: 300
      step: 25
      unit: bp
    - name: hpi_shock
      type: number
      label: HPI shock
      value: 0
      min: -40
      max: 40
      unit: "%"
    - name: benchmark
      type: checkbox
      label: Show federated-lender percentile
      value: true
---

## What it does

Returns paired **default and prepayment probability curves** across a loan's
remaining life, from a loan-level input or an uploaded loan tape. A rate and
HPI shock re-renders both curves, and the output includes a servicing
recommendation — retain, modify, or refer.

## Why the curves are paired

Default and prepayment are **competing risks**. A loan that prepays cannot
subsequently default, and a borrower with equity and a rate incentive is far
likelier to refinance than to fall behind. Modelling either in isolation
overstates it.

That is why a rate shock moves both curves at once and in opposite directions:
rates rising suppresses prepayment, which extends the loan's exposure window,
which raises cumulative default probability even when the per-period hazard is
unchanged. Reading one curve without the other gets that backwards.

HPI shocks work through equity: falling prices raise LTV, which suppresses both
refinance capacity and the incentive to keep paying.

## Federated benchmark

Nine servicers contribute gradients without exchanging loan tapes. Output
includes a **percentile against the federated network**, which answers a
question a standalone model cannot: whether this loan is risky in absolute
terms, or risky relative to comparable loans other servicers are seeing right
now.

## Vintage drift

PSI is tracked **by origination quarter** rather than in aggregate. Mortgage
books are cohort-structured — underwriting standards, rate environment, and
house prices at origination differ sharply between vintages — and a portfolio
whose aggregate PSI looks stable can contain one vintage drifting badly.
Aggregate monitoring would mask exactly the cohort worth acting on.

## Reporting

Scenario libraries for rate and HPI shocks are maintained by the risk team and
versioned, and output exports to GSE and regulatory reporting formats.

## Pricing

**Pro** plan and above, at $199/month. Servicer federation requires onboarding
and a data-sharing agreement.
