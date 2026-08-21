---
title: Credit Oracle
slug: credit-oracle
category: Credit / Risk
featured: true
risk: medium
maturity: Beta
federated: true
price: 149
jurisdictions: [US, UK, EU]
lead: Federated credit risk model for SME lending, trained on anonymised loan tape from 14 partner lenders.
metrics:
  - { label: "AUC (out-of-sample)", value: "0.84" }
  - { label: "Gini",                 value: "0.68" }
  - { label: "PSI (vs baseline)",    value: "0.04" }
  - { label: "Federated lenders",    value: "14" }
---

## What it does

Returns a probability-of-default and a recommended pricing tier for an
SME credit application. Trained federation-style across 14 partner lenders
without any borrower-level data ever leaving its lender of origin.

## Why it works

Federated training pools the **statistical** signal across lenders without
pooling their **data**. The result is a model with materially better
out-of-sample AUC than any single lender's bespoke model — without raising
the data-privacy and competition-law issues that block centralised pooling.

## Compliance posture

Each prediction comes with a SHAP-style explanation suitable for adverse
action notices in the US and the UK. EU deployments include the additional
documentation required under the EU AI Act for high-risk credit-scoring
systems.

## Pricing

**Pro** plan and above. Federated lender onboarding includes a data audit
and an explainability review.
