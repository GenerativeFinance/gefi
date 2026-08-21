---
title: ESG Materiality Scorer
slug: esg-materiality-scorer
category: ESG
featured: false
risk: medium
maturity: Beta
federated: true
price: 199
jurisdictions: [EU, UK]
lead: Plots financial against stakeholder impact on a materiality matrix, scores SASB and ISSB topics, and flags greenwashing risk with evidence.
metrics:
  - { label: "Taxonomies",        value: "SASB, ISSB, EU" }
  - { label: "Disclosure network", value: "19 partners" }
  - { label: "Greenwashing flag", value: "Evidence-backed" }
  - { label: "Weights",           value: "Per sector" }
analytics: true
demo:
  output: table
  cta: Score materiality
  lead: Enter a company. Each row is a topic scored on both axes — a topic can be financially material and immaterial to stakeholders, or the reverse.
  columns: [Topic, Financial impact, Stakeholder impact]
  row_labels: [GHG emissions, Water stress, Labour practices, Board governance, Product safety]
  row_count: 5
  fields:
    - name: company
      type: text
      label: Company or ticker
      value: NESN
      placeholder: Ticker or legal name
    - name: sector
      type: select
      label: Sector
      options: [Consumer staples, Energy, Financials, Industrials, Technology]
      value: Consumer staples
    - name: taxonomy
      type: select
      label: Taxonomy
      options: [SASB, ISSB, EU Taxonomy]
      value: ISSB
    - name: greenwash
      type: checkbox
      label: Run greenwashing-risk check
      value: true
---

## What it does

Returns a **materiality matrix** for a company, plotting financial impact
against stakeholder impact for each ESG topic, with SASB and ISSB topic
scores, a federated peer benchmark, and a greenwashing-risk flag backed by
evidence.

## Two axes, because one is not enough

Single-score ESG ratings collapse two different questions into one number and
lose both.

**Financial materiality** asks whether an issue affects enterprise value.
**Stakeholder materiality** asks whether it affects people affected by the
company. These genuinely diverge: water stress may be financially immaterial
to a company that can relocate production and severely material to the
communities it draws from. A single rating has to silently pick one, and
readers cannot tell which.

Plotting both keeps the divergence visible, which is the information a
single score destroys.

Materiality weights are calibrated **per sector**, since the same topic
carries very different weight for an energy producer and a software company.

## Greenwashing risk, with evidence

The flag is raised against **disclosure-versus-behaviour divergence**: a
company's stated commitments compared with controversy-feed signals and its
actual disclosed metrics. Every flag carries the evidence that produced it.

An unevidenced greenwashing accusation is defamatory and useless in equal
measure. The flag exists to direct attention to a discrepancy, not to make an
allegation.

## Federated peer benchmark

Nineteen partners contribute to the federated disclosure network, so a
company's scores are benchmarked against a real peer distribution rather than
a published-data sample skewed toward companies that disclose well. Firms
disclosing least are exactly those a public-data benchmark under-represents.

## Pricing

**Pro** plan and above, at $199/month. Federated disclosure participation
requires partner onboarding.
