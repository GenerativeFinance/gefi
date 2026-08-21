---
title: Claim Fraud Vision
slug: claim-fraud-vision
category: Insurance
featured: false
risk: low
maturity: Beta
federated: true
price: 99
jurisdictions: [US, UK, EU]
lead: Scores claim photos and documents for fraud likelihood with a visual overlay, benchmarked against a federated insurer network.
metrics:
  - { label: "Detection AUC",     value: "0.79" }
  - { label: "Insurer network",   value: "11" }
  - { label: "Override logging",  value: "Mandatory" }
  - { label: "Evidence packs",    value: "SII, NAIC, PRA" }
analytics: true
demo:
  output: score
  cta: Assess the claim
  lead: Describe a claim. The score is fraud likelihood; the bars show which inconsistencies drove it. An adjuster can override any score, with a reason.
  score_label: Fraud likelihood
  drivers: [Damage consistency, Document metadata, Claim history, Network benchmark]
  fields:
    - name: claim_type
      type: select
      label: Claim type
      options: [Motor, Property, Contents, Commercial]
      value: Motor
    - name: amount
      type: number
      label: Claimed amount
      value: 8400
      min: 0
      step: 100
      unit: USD
    - name: days_since
      type: number
      label: Days since policy start
      value: 42
      min: 0
    - name: prior_claims
      type: number
      label: Prior claims
      value: 1
      min: 0
      max: 50
    - name: benchmark
      type: checkbox
      label: Compare against federated network
      value: true
---

## What it does

Takes uploaded claim photos and documents and returns a **fraud-likelihood
score** with a **visual overlay** marking the damage inconsistencies that drove
it — mismatched impact angles, damage inconsistent with the reported incident,
image metadata that disagrees with the claimed timeline.

The overlay is the product. A score alone shifts the burden to the adjuster to
justify a decision they cannot see the basis for.

## Federated benchmark

Eleven insurers contribute without exchanging claim images. The output includes
a **comparable-claim benchmark**: how this claim's characteristics compare with
similar claims across the network.

Fraud rings work across insurers precisely because no single insurer sees the
pattern. A federated benchmark is one of the few defences that operates at the
scale the fraud does, without insurers pooling claimant data.

## The adjuster is the decision-maker

Every score can be **overridden by the adjuster**, and every override records
its reason. Two things follow.

First, the model never declines a claim — it informs a person who does.
Second, override reasons are training data. A model that adjusters routinely
overturn on a particular claim type is a model with a known weakness, and the
override log is where that shows up first.

Image-model drift is tracked **by claim type**, since a model that holds up on
motor claims can degrade badly on property ones while aggregate metrics stay
flat.

## Regulatory evidence

One-click evidence packs generate to Solvency II, NAIC Model Bulletin, and PRA
SS1/23 formats — the documentation a supervisor expects for an AI system
influencing claims decisions.

## Pricing

**Starter** plan and above, at $99/month. Federated participation requires
insurer onboarding.
