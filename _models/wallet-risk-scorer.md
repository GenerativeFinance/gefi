---
title: Wallet Risk Scorer
slug: wallet-risk-scorer
category: Crypto / Compliance
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU, SG]
lead: Address risk with reason codes — mixer exposure, sanctioned-cluster proximity, darknet lineage — plus an entity-cluster graph and travel-rule readiness.
metrics:
  - { label: "Reason codes",    value: "Always attached" }
  - { label: "SDN refresh",     value: "Scheduled + alerting" }
  - { label: "Chains",          value: "Multi-chain" }
  - { label: "Travel rule",     value: "Readiness flagged" }
analytics: true
demo:
  output: score
  cta: Score the address
  lead: The score comes with its reasons. A compliance decision made on an unexplained score is a decision nobody can defend later.
  score_label: Wallet risk
  drivers: [Mixer exposure, Sanctioned-cluster proximity, Darknet lineage, Counterparty quality]
  fields:
    - name: address
      type: text
      label: Address
      value: 0x7a25...c4e1
      placeholder: Wallet address
    - name: chain
      type: select
      label: Chain
      options: [Ethereum, Bitcoin, Polygon, Solana]
      value: Ethereum
    - name: hops
      type: number
      label: Proximity depth
      value: 3
      min: 1
      max: 10
      unit: hops
    - name: travel_rule
      type: checkbox
      label: Assess travel-rule readiness
      value: true
---

## What it does

Takes a wallet address and returns a **risk score with reason codes** — mixer
exposure, sanctioned-cluster proximity measured in hops, darknet-market
lineage — an **entity-cluster graph**, and a **travel-rule data-readiness
flag** that ties into GeFi's existing VASP compliance rules.

## Reason codes, because "high risk" is not a decision

A compliance officer cannot act on a bare score. Blocking a withdrawal,
filing a report, or off-boarding a customer each requires knowing *why* the
address is risky — and each reason code implies a different action. Mixer
exposure two hops back is a different situation from direct receipt of funds
from a sanctioned cluster, and treating them identically produces either
over-blocking or under-reporting.

**Proximity is measured in hops** and disclosed as such, because hop distance
is the honest unit: attribution certainty degrades with each hop, and a score
that hides how far away the taint actually sits is claiming more confidence
than clustering can support.

## The cluster graph shows what clustering actually is

Entity clustering is inference — heuristics grouping addresses that likely
share control. The graph visual shows the cluster the score is built on, so a
reviewer can see whether the sanctioned entity is connected by a strong
co-spend heuristic or a weak one-time interaction. That distinction is where
false positives live, and the **false-positive review queue** feeds analyst
dispositions back into recalibration rather than discarding them.

## Sanctions data is a freshness problem

OFAC adds crypto addresses to the SDN list irregularly and without warning,
and screening against a stale list returns clean results for addresses that
are now sanctioned — the silent failure mode. The SDN refresh runs on a
schedule with **failure alerting**, so a broken refresh is an incident, not an
invisible degradation.

## Pricing

**Pro** plan and above, at $199/month.
