---
title: DeFi Protocol Risk Scorer
slug: defi-protocol-risk-scorer
category: Crypto / Risk
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Composite protocol risk across contract, economic and governance dimensions — with an incident timeline and a linked post-mortem behind every score penalty.
metrics:
  - { label: "Dimensions",      value: "Contract / economic / governance" }
  - { label: "Penalties",       value: "Post-mortem-linked" }
  - { label: "Audit registry",  value: "Staleness-tracked" }
  - { label: "Indexers",        value: "Health-monitored per chain" }
analytics: true
demo:
  output: score
  cta: Score the protocol
  lead: Three dimensions, because protocols fail three different ways — and the failures that hurt most are rarely the ones the audit covered.
  score_label: Protocol risk
  drivers: [Contract risk, Economic risk, Governance risk, Incident history]
  fields:
    - name: protocol
      type: text
      label: Protocol
      value: Aave v3
      placeholder: Protocol name
    - name: chain
      type: select
      label: Chain
      options: [Ethereum, Arbitrum, Optimism, Polygon]
      value: Ethereum
    - name: dimension
      type: select
      label: Focus dimension
      options: [Composite, Contract, Economic, Governance]
      value: Composite
    - name: incidents
      type: checkbox
      label: Show incident timeline
      value: true
---

## What it does

Takes a protocol and returns a **composite risk score** across three
dimensions — **contract risk** (audit age, upgrade keys), **economic risk**
(TVL concentration, oracle dependency), **governance risk** — with an
**incident-history timeline** and a **linked post-mortem behind every score
penalty**.

## Three dimensions, because protocols die three different ways

A contract exploit, an economic design failure, and a governance capture are
different events with different warning signs, and a single blended "safety
score" hides which one a given protocol is actually exposed to.

**Contract risk** ages: an audit from two years and four upgrades ago
describes code that no longer exists, which is why audit age and upgrade-key
arrangements are scored rather than the mere existence of an audit.
**Economic risk** is where protocols with immaculate code fail — oracle
manipulation and TVL concentration are attacks on the design, not the
implementation, and no auditor signs off on tokenomics. **Governance risk** is
the slowest and least visible: a protocol whose admin keys or vote weight
concentrate quietly is one proposal away from being a different protocol.

## Every penalty cites its post-mortem

A score deduction with no stated cause is an opinion. Here, every penalty
links to the incident and post-mortem that produced it, so a subscriber
disputing a score can read exactly why it is what it is — and the scoring
process inherits the discipline of only penalising what it can document.

The **exploit post-mortem tagging workflow** propagates lessons across the
catalogue: when an incident's root cause is tagged, every protocol sharing
that trait is re-scored, because the honest lesson of most DeFi exploits is
that the vulnerable pattern was visible elsewhere before it was exploited
anywhere.

## The infrastructure is monitored because the score depends on it

Onchain indexers are health-monitored per chain — a stale indexer produces a
confident score about a protocol state that no longer exists, which is worse
than no score. The audit registry tracks staleness explicitly for the same
reason.

## Pricing

**Enterprise** tier, at $499/month.
