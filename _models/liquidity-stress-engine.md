---
title: Liquidity Stress Engine
slug: liquidity-stress-engine
category: Risk
featured: false
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Projects LCR and NSFR through idiosyncratic and market-wide stress, with a survival horizon and regulator-ready Basel III and FCA templates.
metrics:
  - { label: "Conformity assessment", value: "Pending" }
  - { label: "Scenario library",      value: "Versioned" }
  - { label: "Horizon",               value: "Up to 12 months" }
  - { label: "Templates",             value: "Basel III, FCA" }
analytics: true
demo:
  output: curve
  cta: Run the stress
  lead: Pick a scenario and horizon. The curve is the projected LCR path; the regulatory floor is what it has to clear.
  series_label: LCR projection
  chart_label: LCR through the stress horizon
  x_labels: [M0, M12]
  fields:
    - name: scenario
      type: select
      label: Scenario
      options: [Idiosyncratic, Market-wide, Combined]
      value: Combined
    - name: horizon
      type: number
      label: Stress horizon
      value: 12
      min: 1
      max: 12
      unit: months
    - name: metric
      type: select
      label: Metric
      options: [LCR, NSFR]
      value: LCR
    - name: template
      type: select
      label: Regulator template
      options: [Basel III, FCA]
      value: Basel III
---

## Conformity assessment: pending

This model is **high risk under the EU AI Act**. Its conformity assessment is
currently *pending* with the assigned notified body, and that status is stated
here rather than in a footnote because it governs where the model may lawfully
be used.

Status is published in the metric tiles above and tracked per model version. A
dedicated status badge alongside the risk badge would be a better home for it;
that is a change to the shared model layout rather than to this page, and is
noted as harness work.

## What it does

Takes a balance sheet — uploaded or through a connector — and projects **LCR
and NSFR** through a chosen stress scenario: idiosyncratic, market-wide, or
combined. Output includes the projected ratio path, the **survival horizon**
(how long the institution stays above the regulatory floor), and the run
packaged into a Basel III or FCA template.

## Why the survival horizon matters

A stress test that reports a trough ratio answers "how bad does it get". The
question a treasury function actually acts on is "how long do we have" — the
point at which the ratio crosses the floor, and therefore how much time exists
to execute a contingency plan.

Both are reported. The trough is the headline; the horizon is the decision.

## Scenario governance

The scenario library is **version-controlled**. A stress run is only meaningful
alongside the scenario definition it used, and scenario definitions change —
so a result from last quarter is reproducible against the scenario as it was
then, not as it is now.

Model validation and backtesting evidence is retained in an evidence vault, on
the assumption that a supervisor will eventually ask to see it.

## Regulatory submission

Completed runs can be packaged into a fileable PDF bundling the scenario
definition, the projection, and the supporting evidence.

The engine produces submissions; it does not submit them, and it does not
certify compliance. A run is an input to a regulatory conversation, not a
substitute for one.

## Pricing

**Enterprise** tier, at $499/month, reflecting the conformity-assessment
workflow and the evidence retention this model requires.
