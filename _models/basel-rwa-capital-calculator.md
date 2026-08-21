---
title: Basel RWA & Capital Calculator
slug: basel-rwa-capital-calculator
category: Banking / Capital
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Risk-weighted assets by exposure class with a standardised/IRB toggle, a CET1 bridge, and every risk weight traced to the rule paragraph behind it.
metrics:
  - { label: "Approaches",       value: "Standardised + IRB" }
  - { label: "Weight traced to", value: "Rule paragraph" }
  - { label: "National packs",   value: "Per jurisdiction" }
  - { label: "Audit trail",      value: "Every figure" }
analytics: true
demo:
  output: table
  cta: Calculate RWA
  lead: Load exposures. Each row is an exposure class with its risk weight and the rule paragraph that sets it — a weight you cannot cite is a weight you cannot defend.
  columns: [Exposure class, RWA, Rule reference]
  row_labels: [Corporate, Retail, Residential mortgage, Sovereign, Off-balance-sheet]
  row_count: 5
  fields:
    - name: approach
      type: select
      label: Approach
      options: [Standardised, Foundation IRB, Advanced IRB]
      value: Standardised
    - name: jurisdiction
      type: select
      label: National discretion pack
      options: [US, UK (PRA), EU (EBA)]
      value: UK (PRA)
    - name: cet1
      type: number
      label: Current CET1
      value: 14.2
      min: 0
      max: 40
      step: 0.1
      unit: "%"
    - name: proforma
      type: checkbox
      label: Show pro-forma bridge
      value: true
---

## What it does

Takes an exposure file and returns **risk-weighted assets by class**, a
standardised-versus-IRB toggle, a **CET1 ratio bridge** from current to
pro-forma, and a buffer-headroom reading against combined requirements.

## Every weight cites its rule

A risk weight that cannot be traced to the paragraph that set it is a number a
supervisor will not accept and a bank cannot defend. Each weight in the output
carries its **rule reference**, and the full calculation sits behind an audit
trail.

This is what makes the standardised-versus-IRB comparison usable: the two
approaches can differ substantially on the same exposures, and the question is
always *why*. With both traceable to their rules, the difference is
attributable rather than mysterious.

## National discretion is not a detail

Basel is implemented, not adopted. The same framework yields different
outcomes in the US, UK, and EU, because national authorities exercise
discretion over parameters, transitional arrangements, and the treatment of
particular exposure classes.

Those choices ship as **per-jurisdiction parameter packs** rather than being
hardcoded, so a group calculating across jurisdictions gets each entity's
actual requirement instead of one approximated rule set.

Rule updates map to Basel, EBA, and PRA publications **with effective dates**,
so a calculation is reproducible under the rules in force on its date — which
is the form the question takes when it is asked a year later.

## Buffer headroom

The headroom reading is against **combined buffer requirements**, not the
minimum. The minimum is where resolution begins; the combined buffer is where
distribution restrictions begin, and that is the constraint that actually binds
management decisions.

## Pricing

**Pro** plan and above, at $199/month. Additional national discretion packs on
request.
