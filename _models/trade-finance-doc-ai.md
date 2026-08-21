---
title: Trade Finance Doc AI
slug: trade-finance-doc-ai
category: Trade Finance / Compliance
featured: true
risk: low
maturity: GA
federated: false
price: 79
jurisdictions: [US, UK, EU, UAE]
lead: Reads bills of lading, letters of credit, and inspection certificates. Flags discrepancies, sanctions risk, and dual-use goods.
metrics:
  - { label: "OCR accuracy",      value: "99.2%" }
  - { label: "Discrepancy recall", value: "0.91" }
  - { label: "Median doc time",   value: "1.4 s" }
---

## What it does

Ingests a trade-finance document bundle (BoL, L/C, packing list, certificate
of origin, inspection certificate) and returns:

- A normalised, structured representation of every field.
- A list of UCP 600 / ISBP discrepancies.
- A sanctions-screening report against OFAC, UK, EU, and UN lists.
- A dual-use goods flag against EU regulation 2021/821.

## Pricing

Available from **Starter**. Enterprise customers get a dedicated screening
list refresh window.
