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
  - { label: "OCR accuracy",        value: "98.6%" }
  - { label: "Median processing",   value: "9 s / bundle" }
  - { label: "Sanctions lists",     value: "OFAC, UK, EU, UN" }
  - { label: "Discrepancy rules",   value: "UCP 600 / ISBP" }
analytics: true
demo:
  output: table
  cta: Check the bundle
  lead: Pick a document bundle. Each row is a check run against it — discrepancies under UCP 600, sanctions hits, and dual-use screening.
  columns: [Check, Result, Confidence]
  row_labels: [L/C/BoL consistency, UCP 600 discrepancies, Sanctions screening, Dual-use goods, Certificate of origin]
  row_count: 5
  fields:
    - name: bundle
      type: select
      label: Document bundle
      options: [Full presentation, L/C + BoL only, Inspection docs only]
      value: Full presentation
    - name: corridor
      type: select
      label: Corridor
      options: [UAE → EU, US → UK, EU → SG, UK → US]
      value: UAE → EU
    - name: value
      type: number
      label: Consignment value
      value: 480000
      min: 0
      step: 1000
      unit: USD
    - name: dual_use
      type: checkbox
      label: Screen for dual-use goods
      value: true
---

## What it does

Ingests a trade-finance document bundle (BoL, L/C, packing list, certificate
of origin, inspection certificate) and returns:

- A normalised, structured representation of every field.
- A list of UCP 600 / ISBP discrepancies.
- A sanctions-screening report against OFAC, UK, EU, and UN lists.
- A dual-use goods flag against EU regulation 2021/821.

## Why discrepancy detection is the hard part

A letter of credit is paid against documents, not against goods. A bank
examines whether the presentation complies on its face, and a trivial
mismatch — a description that reads differently across two documents, a date
outside a stated window — is grounds for refusal.

The model reads the bundle **as a set**, not document by document, because
almost every discrepancy that matters is a disagreement *between* documents.
A bill of lading is never non-compliant on its own; it is non-compliant
against the credit that governs it.

OCR accuracy is reported **by document type and language**, since a scanned
Arabic inspection certificate and a digitally generated English L/C are not
the same recognition problem, and one blended accuracy figure would hide the
harder case.

## Sanctions screening is a freshness problem

A screening result is only as current as the list behind it. Lists are
refreshed on a schedule with **failure alerting** — a refresh that silently
fails leaves screening running against stale data while continuing to return
clean results, which is worse than an outage because nothing looks wrong.

Enterprise tenants can configure their own refresh window.

## Pricing

Available from **Starter**, at $79/month. Enterprise customers get a dedicated
screening-list refresh window and a configurable discrepancy-rule set.
