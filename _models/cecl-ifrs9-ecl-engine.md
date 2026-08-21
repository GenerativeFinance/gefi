---
title: CECL / IFRS 9 ECL Engine
slug: cecl-ifrs9-ecl-engine
category: Banking / Provisioning
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Twelve-month and lifetime expected credit losses by stage, with a stage-migration matrix and a provision waterfall attributing every quarter's change.
metrics:
  - { label: "Standards",        value: "CECL, IFRS 9" }
  - { label: "Stages modelled",  value: "1 / 2 / 3" }
  - { label: "Scenario weights", value: "Editable" }
  - { label: "Validation pack",  value: "SR 11-7 style" }
analytics: true
demo:
  output: table
  cta: Calculate ECL
  lead: Load a portfolio and weight the macro scenarios. The waterfall attributes the provision change to its causes, which is the number the audit committee asks about.
  columns: [Driver, Provision impact, Share of change]
  row_labels: [Opening balance, Volume, Credit quality, Macro assumptions, Stage migration]
  row_count: 5
  fields:
    - name: standard
      type: select
      label: Standard
      options: [CECL, IFRS 9]
      value: IFRS 9
    - name: base_weight
      type: number
      label: Base scenario weight
      value: 60
      min: 0
      max: 100
      unit: "%"
    - name: adverse_weight
      type: number
      label: Adverse scenario weight
      value: 30
      min: 0
      max: 100
      unit: "%"
    - name: horizon
      type: select
      label: Measurement
      options: [12-month ECL, Lifetime ECL]
      value: Lifetime ECL
---

## What it does

Takes a loan portfolio and returns **12-month and lifetime expected credit
losses by stage**, a **stage-migration matrix** (1→2→3) with the trigger that
caused each migration, an editable macro-scenario weight panel, and a
**quarter-over-quarter provision waterfall**.

## The waterfall is the point

The provision number is rarely what gets questioned. What gets questioned is
why it moved.

A provision can rise because the book grew, because credit quality
deteriorated, because macro assumptions were reweighted, or because loans
migrated stage. Those have entirely different implications: growth-driven
provisioning is a business outcome, quality-driven provisioning is a credit
event, and macro-driven provisioning is a modelling choice the bank made.

The waterfall separates them. Reporting only the delta invites the reading
that management adjusted assumptions to reach a number, and the waterfall is
the answer to that suspicion.

## Stage migration needs its trigger

Stage 2 means a significant increase in credit risk since origination — a
judgement, not an observation. So every migration is reported **with the
trigger that caused it**: days past due, rating downgrade, watchlist addition,
or a qualitative override.

Qualitative overrides are visible as overrides. A book where a large share of
staging is discretionary is a different risk proposition from one where
staging is rule-driven, and that distinction disappears if triggers are not
recorded.

## Governance

The macro-scenario library runs through an **approval workflow** — scenario
weights move provisions directly, which makes them a governance object rather
than a model parameter. Staging rules are **effective-dated**, so a prior
quarter's close is reproducible under the rules in force then.

A model-validation evidence pack generates in the form bank examiners expect
under SR 11-7.

## Pricing

**Enterprise** tier, at $499/month, reflecting the governance workflow and
examiner-facing evidence retention.
