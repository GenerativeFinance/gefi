---
title: Portfolio Optimiser
slug: portfolio-optimiser
category: Optimisation / Investing
featured: true
risk: medium
maturity: GA
federated: true
price: 199
jurisdictions: [US, UK, EU, UAE]
lead: Mean-variance + Black-Litterman + risk-parity optimiser with federated views from anonymised institutional positioning data.
metrics:
  - { label: "Universe size",      value: "10,000+" }
  - { label: "Median solve time",  value: "240 ms" }
  - { label: "Backtest CAGR (60/40)", value: "+1.8 pp" }
  - { label: "Federated participants", value: "27" }
---

## What it does

A unified optimiser that supports three regimes — mean-variance,
Black-Litterman, and risk-parity — across an asset universe of 10,000+
instruments. Federated participants contribute anonymised positioning data
which improves the prior; their gradients never leave their institution.

## Federated upside

Subscribers see a measurable lift over the public-data baseline because the
prior is informed by real institutional positioning. Federated contributors
earn a rev-share proportional to gradient impact.

## Constraints supported

- Long-only / long-short
- Sector, country, factor, ESG, and counterparty caps
- Turnover and transaction-cost penalties
- Cardinality constraints (top-N positions)

## Pricing

**Pro** plan and above. Federated participation requires institutional
onboarding and a signed data-sharing agreement.
