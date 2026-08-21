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
analytics: true
demo:
  output: score
  cta: Score the application
  lead: Enter an SME application. The score is a probability of default; the bars below are the SHAP-style contributions that would appear on an adverse-action notice.
  score_label: PD
  drivers: [Leverage, Debt service coverage, Sector risk, Trading history, Request vs revenue]
  fields:
    - name: revenue
      type: number
      label: Annual revenue
      value: 2400000
      min: 0
      step: 10000
      unit: USD
    - name: amount
      type: number
      label: Request amount
      value: 350000
      min: 0
      step: 5000
      unit: USD
    - name: sector
      type: select
      label: Sector
      options: [Retail, Manufacturing, Construction, Professional services, Hospitality]
      value: Manufacturing
    - name: trading_years
      type: number
      label: Years trading
      value: 7
      min: 0
      max: 100
    - name: notice
      type: select
      label: Explanation format
      options: [US adverse-action notice, UK adverse-action notice, EU AI Act documentation packet]
      value: US adverse-action notice
---

## What it does

Returns a probability-of-default and a recommended pricing tier for an SME
credit application. Trained federation-style across 14 partner lenders without
any borrower-level data ever leaving its lender of origin.

Every prediction comes with a **SHAP-style explanation** rendered in the format
the jurisdiction requires — a US or UK adverse-action notice, or the
documentation packet the EU AI Act expects for a high-risk credit-scoring
system. The explanation is generated with the score, not reconstructed
afterwards, because a reason code assembled after the fact is not a reason.

## Why it works

Federated training pools the **statistical** signal across lenders without
pooling their **data**. The result is a model with materially better
out-of-sample AUC than any single lender's bespoke model — without raising
the data-privacy and competition-law issues that block centralised pooling.

Aggregation runs FedProx round by round across the 14 lenders, with a
differential-privacy budget applied to the gradients. The privacy budget is a
dial, not a checkbox: spending less of it protects contributors more and costs
model quality, and that trade is made explicitly rather than by default.

## Monitoring what drifts

PSI against baseline is published because a credit model's failure mode is
rarely a sudden break — it is slow population drift that leaves accuracy
metrics intact while the model quietly stops describing the applicants it now
sees.

**SHAP drift** is monitored separately. A model whose accuracy holds while its
reason codes shift is a compliance problem even when it is not yet a modelling
problem: the explanations given to declined applicants would no longer match
how the model actually decides.

## Compliance posture

EU deployments carry the additional documentation required under the EU AI Act
for high-risk credit-scoring systems, and each model version moves through an
approval queue tied to its conformity-assessment case. A version that has not
cleared assessment does not serve EU traffic.

Lender onboarding includes a data audit and an explainability review before any
gradient is accepted into the federation.

## Pricing

**Pro** plan and above, at $149/month. Federated lender onboarding includes the
data audit and explainability review.
