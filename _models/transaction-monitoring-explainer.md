---
title: Transaction Monitoring Explainer
slug: transaction-monitoring-explainer
category: AML
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Turns AML alerts into plain-language rationales with a typology tag and a one-click SAR draft, and feeds analyst dispositions back into retraining.
metrics:
  - { label: "Alerts explained",     value: "100%" }
  - { label: "Median draft time",    value: "12s" }
  - { label: "Typologies tagged",    value: "9" }
  - { label: "Rule mappings",        value: "FinCEN, FCA, 6AMLD" }
analytics: true
demo:
  output: table
  cta: Explain the alert
  lead: Pick an alert. Each row is a flagged transaction with the typology it matched and the rationale an analyst would act on.
  columns: [Transaction, Typology, Confidence]
  row_labels: [Cash deposit series, Rapid pass-through, Round-sum transfers, Third-party funding, Cross-border layering]
  row_count: 5
  fields:
    - name: queue
      type: select
      label: Alert queue
      options: [Retail banking, Correspondent banking, Payments / EMI]
      value: Retail banking
    - name: typology
      type: select
      label: Typology filter
      options: [All, Structuring, Layering, Smurfing, Trade-based]
      value: All
    - name: lookback
      type: number
      label: Lookback
      value: 30
      min: 1
      max: 365
      unit: days
    - name: sar
      type: checkbox
      label: Generate SAR drafts for confirmed alerts
      value: true
---

## What it does

Takes the alerts your transaction-monitoring system already produces and
attaches to each one a **plain-language rationale**, a **typology tag**
(structuring, layering, smurfing, trade-based, and others), and a one-click
**SAR draft**.

It does not replace your monitoring system. It explains its output, which is
the part that consumes analyst time.

## Why explanation is the bottleneck

AML alerting is dominated by false positives, and the cost is not the alert —
it is the analyst hours spent reconstructing why the system fired. An analyst
who can see "this matched structuring: eleven deposits between $9,100 and
$9,800 across four branches in six days" disposes of it in a minute. The same
analyst reading raw transaction rows takes far longer to reach the same place.

False-positive rate is reported **by typology** rather than in aggregate,
because the typologies fail differently: structuring detection over-fires on
legitimately cash-heavy businesses, while layering detection over-fires on
treasury operations. One blended number tells you nothing about which rule to
tune.

## The feedback loop

Analyst dispositions — including false-positive marks — feed the retraining
loop, and the retraining monitor tracks whether feedback is actually improving
precision or merely accumulating.

This is the part that quietly fails in most deployments: feedback is collected
and never used, so analysts learn their input changes nothing and stop giving
it.

## Regulatory mapping

Rules map to FinCEN, FCA, and EU 6AMLD obligations through an editable
mapping, so an alert can be traced to the obligation it serves. Every SAR
filing writes to an audit trail anchored in the Merkle log.

Drafts are drafts. A SAR is filed by a person with the authority to file it,
and the model's role ends at the draft.

## Pricing

**Pro** plan and above, at $199/month.
