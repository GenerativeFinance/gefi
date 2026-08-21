---
title: Macro Nowcast
slug: macro-nowcast
category: Macro / Investing
featured: true
risk: medium
maturity: Beta
federated: false
price: 149
jurisdictions: [US, UK, EU]
lead: Real-time nowcast of US, UK, and EU GDP, CPI, and unemployment from high-frequency alternative data.
metrics:
  - { label: "GDP RMSE (vs final)", value: "0.32 pp" }
  - { label: "CPI RMSE (vs final)", value: "0.21 pp" }
  - { label: "Median refresh",      value: "15 min" }
---

## What it does

Produces a rolling estimate of the next print of GDP, CPI, and unemployment
for the US, UK, and EU using card spend, payroll, web-scraped pricing, and
energy demand data. Refreshes every 15 minutes.

## Pricing

**Pro** plan and above. Enterprise customers can request additional
geographies and indicators on a custom basis.
