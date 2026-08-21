---
title: Scenario Narrative Engine
slug: scenario-narrative-engine
category: Generative / Narrative
featured: true
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Turns a stress-test run into prose in three registers — board summary, regulator submission, internal deep-dive — with every sentence linked to the figures it describes.
metrics:
  - { label: "Registers",            value: "3" }
  - { label: "Claims consistency-checked", value: "100%" }
  - { label: "Regulator formats",    value: "FCA, ECB" }
  - { label: "Median draft time",    value: "21s" }
analytics: true
demo:
  output: text
  cta: Write the narrative
  lead: Pick a stress-test run and an audience. The same numbers are rendered in the register that audience expects.
  sample_text: >-
    Under the severe-adverse scenario, the liquidity coverage ratio falls from
    148% to 112% at its trough in month 4, remaining above the 100% regulatory
    minimum throughout the projection. The decline is driven principally by
    modelled deposit outflow in the non-operational corporate segment
    (−£1.9bn), partially offset by the contingent facility drawdown assumed
    from month 3. Headroom at the trough is £0.4bn. Figures are drawn from
    Liquidity Stress Engine run 7c31…f08; each claim above is diffed against
    that run's JSON before it renders.
  fields:
    - name: run
      type: select
      label: Source run
      options: [Liquidity Stress Engine — severe adverse, IRRBB — parallel +200bp, IRRBB — steepener]
      value: Liquidity Stress Engine — severe adverse
    - name: register
      type: select
      label: Audience register
      options: [Board summary, Regulator submission, Internal deep-dive]
      value: Board summary
    - name: format
      type: select
      label: Regulator format
      options: [None, FCA, ECB]
      value: None
    - name: strict
      type: checkbox
      label: Block on any claim that fails the consistency check
      value: true
---

## What it does

Stress tests produce numbers; committees, regulators, and risk teams need
sentences. The Scenario Narrative Engine takes any stress-test run — a
Liquidity Stress Engine output, an IRRBB projection — and renders it as prose
in the register the audience expects.

The same run yields three different documents. A **board summary** leads with
the headline and the headroom. A **regulator submission** follows the format
that jurisdiction expects. An **internal deep-dive** keeps the mechanics that
the other two compress away.

Numbers and narrative sit side by side with hover-linking: hovering a sentence
highlights the exact figures it describes, so a reviewer can check the prose
against the run without holding both in their head.

## Why it works

The risk in narrating a stress test is drift — prose that is directionally
right but numerically wrong, or that softens a result by degrees until it
means something else.

A **factual-consistency checker** diffs every narrative claim against the
source run's JSON. A sentence asserting a trough the run does not contain is
caught before the draft renders, not in review. With strict mode on, a failed
claim blocks the draft; the engine will not narrate around a number it cannot
substantiate.

Registers are defined by an editable style guide per audience, so the house
voice is configuration rather than something relearned each quarter.

## Compliance posture

Regulator-format templates are maintained per jurisdiction — FCA and ECB
submission styles among them — and tracked as those formats change. A
submission drafted under last year's format is identifiable as such.

The engine narrates; it does not conclude. Nothing it produces is a risk
opinion, and every draft carries its source run id so a reader can go back to
the model output rather than taking the prose on trust.

## Pricing

**Pro** plan and above, at $199/month. Requires a subscription to the model
whose runs you narrate.
