---
title: Regulatory Change Summariser
slug: regulatory-change-summariser
category: Compliance / NLP
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU, UAE, SG]
lead: Watches SEC, FCA, ESMA, MAS, and ADGM sources and delivers plain-language change digests tagged by impact to your own policies.
metrics:
  - { label: "Regulator sources", value: "5" }
  - { label: "Citation trace",    value: "Every item" }
  - { label: "Spot-check review", value: "Human" }
  - { label: "Delivery",          value: "Email + webhook" }
analytics: true
demo:
  output: table
  cta: Build the digest
  lead: Configure a watchlist. Each row is a change detected in the window, tagged by which of your policies it touches.
  columns: [Change, Regulator, Policy impact]
  row_labels: [Disclosure threshold revision, Reporting deadline shift, New conduct guidance, Capital treatment update, Consultation opened]
  row_count: 5
  fields:
    - name: jurisdictions
      type: select
      label: Jurisdiction
      options: [All, US (SEC), UK (FCA), EU (ESMA), SG (MAS), UAE (ADGM)]
      value: All
    - name: topic
      type: select
      label: Topic
      options: [Disclosure, Conduct, Capital, Market abuse, Client assets]
      value: Disclosure
    - name: window
      type: number
      label: Window
      value: 30
      min: 1
      max: 180
      unit: days
    - name: frequency
      type: select
      label: Digest frequency
      options: [Daily, Weekly, Monthly]
      value: Weekly
---

## What it does

Watches regulator sources across five jurisdictions — SEC, FCA, ESMA, MAS,
ADGM — and turns what changes into a **plain-language digest**, with each item
tagged by which of your internal policies it affects.

## Impact tagging is what makes it a product

A feed of regulatory changes is not scarce; regulators publish them. What is
scarce is knowing which changes matter to *you*.

Items are tagged against the tenant's own policy taxonomy, so a digest answers
"this affects your client-assets policy and your disclosure controls" rather
than "here are nineteen things that happened". A compliance team can act on
the first and can only triage the second.

## Every item cites its source

Each summary carries a **citation trace back to the original text**. Summaries
are lossy by construction, and the cases where a paraphrase drifts from the
regulation are exactly the cases with consequences.

Nobody should act on a summary of a rule. The summary tells you which rules
deserve your attention; the citation takes you to the text you actually rely
on.

A **human spot-check queue** samples summaries for accuracy review, because an
unchecked summarisation pipeline degrades quietly — the outputs stay fluent
while becoming less faithful.

## Delivery reliability

A digest that is not delivered is a change not seen, so email and webhook
success rates are monitored as a first-class metric rather than assumed. Source
ingestion health is tracked per regulator: a feed that stops publishing looks
identical to a quiet week unless something is watching for it.

## Pricing

**Starter** plan and above, at $99/month. Additional regulator sources on
request.
