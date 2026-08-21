---
title: Working Capital Forecaster
slug: working-capital-forecaster
category: Treasury
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU]
lead: DSO, DIO, DPO and the cash-conversion cycle, with a seasonality-aware forecast and a flag when the forecast implies a funding gap.
metrics:
  - { label: "Cycle metrics",   value: "DSO / DIO / DPO" }
  - { label: "Seasonality",     value: "Detected + monitored" }
  - { label: "Funding gap",     value: "Flagged" }
  - { label: "Terms benchmark", value: "By industry" }
analytics: true
demo:
  output: curve
  cta: Forecast working capital
  lead: The curve is working-capital cash release or consumption. Growth consumes cash here, which is why profitable companies still run out of it.
  series_label: Working-capital cash
  chart_label: Cash release / consumption by month
  x_labels: [M1, M12]
  fields:
    - name: dso
      type: number
      label: DSO
      value: 52
      min: 0
      max: 365
      unit: days
    - name: dio
      type: number
      label: DIO
      value: 68
      min: 0
      max: 365
      unit: days
    - name: dpo
      type: number
      label: DPO
      value: 41
      min: 0
      max: 365
      unit: days
    - name: growth
      type: number
      label: Revenue growth
      value: 18
      min: -50
      max: 200
      unit: "% p.a."
---

## What it does

Takes AR, inventory, and AP and returns **DSO, DIO, DPO**, the **cash-conversion
cycle**, and a **seasonality-aware forecast** of working-capital cash release or
consumption — with a **financing-needs flag** when the forecast implies a gap.

## Growth consumes cash

A company growing 18% with a 79-day cash-conversion cycle is funding an ever-
larger receivables and inventory balance out of cash. Profit and cash diverge,
and the faster it grows the wider the gap.

This is how profitable companies run out of money, and it is entirely
predictable from the cycle and the growth rate. The forecast makes the
consumption explicit, and the **funding-gap flag** fires before the gap arrives
rather than when the balance is drawn.

## Seasonality is signal, not noise

Most businesses have a seasonal working-capital pattern — inventory builds
ahead of a season, receivables spike after it. A forecast that smooths this
into an annual average is wrong in both directions at the times of year that
matter, which is precisely when a facility is drawn.

The model fits the tenant's **historical seasonal curve** and monitors for
divergence from it. That divergence is one of the better early indicators
available: receivables running above the seasonal norm usually means collection
is slowing or a customer is in trouble, well before either shows up as a bad
debt.

## DPO is where the tempting answer lives

The cycle can always be improved by paying suppliers later, and it is the
lever with no immediate cost line. The cost is real but off-balance-sheet:
supplier goodwill, pricing at the next negotiation, and priority when supply is
constrained.

Payment terms are benchmarked **by industry** so a DPO figure sits against what
is normal in context, rather than being optimised until something breaks.

## Pricing

**Starter** plan, at $99/month.
