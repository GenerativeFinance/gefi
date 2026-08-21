---
title: Fraud Graph
slug: fraud-graph
category: Fraud / AML
featured: true
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU, UAE]
lead: Graph-neural-network fraud detection for card-not-present and ACH transactions, with sub-50&nbsp;ms inference at the edge.
metrics:
  - { label: "Recall @ 0.1% FPR", value: "0.79" }
  - { label: "Median latency",    value: "32 ms" }
  - { label: "Graph nodes",       value: "1.2 B" }
---

## What it does

Scores a transaction in real time using a graph constructed from device
fingerprints, IP routes, merchant ids, and historical chargeback patterns.
The scoring runs on Cloudflare Workers + Vectorize, so the round-trip stays
under 50&nbsp;ms even from regions with no major cloud presence.

## Pricing

Available from **Starter**. Enterprise customers can run a dedicated graph
in a private region.
