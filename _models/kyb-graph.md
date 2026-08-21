---
title: KYB Graph
slug: kyb-graph
category: Compliance
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU, UAE]
lead: Traces ultimate beneficial ownership through corporate structures, cross-checked against registries in four jurisdictions with sanctions and PEP screening.
metrics:
  - { label: "UBO resolution rate", value: "91%" }
  - { label: "Registries",          value: "US, UK, EU, UAE" }
  - { label: "Median lookup",       value: "6 s" }
  - { label: "Screening",           value: "Sanctions + PEP" }
analytics: true
demo:
  output: table
  cta: Trace ownership
  lead: Look up an entity. Each row is a layer in the ownership chain, with the registry that confirmed it — an unconfirmed layer is reported as unconfirmed.
  columns: [Layer, Ownership %, Registry status]
  row_labels: [Direct parent, Intermediate holdco, Offshore vehicle, Named beneficial owner, Nominee arrangement]
  row_count: 5
  fields:
    - name: entity
      type: text
      label: Entity name
      value: Meridian Holdings Ltd
      placeholder: Registered company name
    - name: jurisdiction
      type: select
      label: Jurisdiction of incorporation
      options: [US, UK, EU, UAE]
      value: UK
    - name: threshold
      type: number
      label: UBO threshold
      value: 25
      min: 1
      max: 100
      unit: "%"
    - name: pep
      type: checkbox
      label: Include PEP screening
      value: true
---

## What it does

Takes a business entity and traces its **ownership graph** through to ultimate
beneficial owners, cross-checking each layer against the corporate registry of
the jurisdiction that layer sits in. Output includes sanctions and PEP
screening and an explained risk score.

## Unresolved is a result, not a blank

UBO resolution succeeds about 91% of the time, and the interesting question is
what happens in the other 9%.

A chain that cannot be resolved is reported as **unresolved, with the layer
where it broke** — not silently truncated at the last known owner. This
matters because the structures hardest to trace are disproportionately the ones
worth tracing: opacity is a deliberate feature of the arrangement, not an
accident of data quality.

Registry cross-check status is shown **per jurisdiction**, since registry
quality varies enormously. A UK Companies House confirmation and a filing from
a jurisdiction with no verification requirement are both "registry-confirmed"
in a naive system, and treating them as equivalent is how ownership chains get
falsely certified.

## Screening against a moving target

Sanctions lists change, and an entity screened clean last quarter may not be
clean now. A **version diff log** records what changed between list versions,
so a re-screen that produces a new hit can be attributed to a list update
rather than to a change in the entity.

High-risk hits route into a case-escalation queue rather than returning as a
score for someone to notice.

## Pricing

**Starter** plan and above, at $99/month. Additional registry jurisdictions on
request.
