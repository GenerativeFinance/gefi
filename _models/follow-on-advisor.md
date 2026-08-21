---
title: Follow-On Advisor
slug: follow-on-advisor
category: Venture / Growth
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU]
lead: Dilution with and without pro-rata participation, expected fund-level return contribution, and a participate / pass / partial recommendation with its reasoning.
metrics:
  - { label: "Recommendation",   value: "With reasoning" }
  - { label: "Reserve tracking", value: "Fund-wide" }
  - { label: "Concentration",    value: "Guardrailed" }
  - { label: "Decisions",        value: "Logged" }
analytics: true
demo:
  output: score
  cta: Advise
  lead: Enter the round. The recommendation weighs fund-level return contribution against concentration — participating is not automatically right just because the company is doing well.
  score_label: Participate score
  drivers: [Return contribution, Reserve cost, Concentration, Ownership protection]
  fields:
    - name: ownership
      type: number
      label: Current ownership
      value: 8.5
      min: 0
      max: 100
      step: 0.1
      unit: "%"
    - name: pro_rata
      type: number
      label: Pro-rata amount
      value: 2500000
      min: 0
      step: 100000
      unit: USD
    - name: reserves
      type: number
      label: Remaining reserves
      value: 14000000
      min: 0
      step: 500000
      unit: USD
    - name: nav_share
      type: number
      label: Position as share of NAV
      value: 9
      min: 0
      max: 100
      unit: "%"
---

## What it does

Takes current ownership, new-round terms, and pro-rata rights, and returns
**dilution with and without participation** side by side, the **expected
contribution to fund-level return** if the investor participates, and a
recommendation — participate, pass, or partial — with its reasoning.

## Ownership protection is not a reason on its own

The instinct in a strong round is to defend ownership, and pro-rata exists
precisely for that. But maintaining a percentage is a means, not an end: what
matters is the fund's return, and follow-on capital deployed at a much higher
valuation buys far less of that return per dollar than the initial cheque did.

So the recommendation is framed on **return contribution**, with ownership
protection as one input among several. A follow-on can be right at a high price
when conviction is high and reserves permit — but "we did not want to be
diluted" is not by itself an investment case.

## Reserves are finite and mostly get spent on the wrong companies

Follow-on decisions are made sequentially, and the companies raising earliest
are not necessarily the ones most deserving of reserves. A fund that commits
its reserves to its first three follow-on opportunities has made a decision
about the remaining portfolio without evaluating it.

Reserve balance is therefore tracked **across the whole portfolio**, so a
recommendation is visible in the context of what it forecloses.

## The concentration guardrail

A recommendation that would push one company above a configurable share of
fund NAV is **flagged**. Concentration risk builds quietly through follow-ons
— each individually justified by that company's progress — and the fund ends
up with an outcome dominated by a single position without anyone having
decided that.

Every decision, including passes, writes to a log. In venture the passes are
worth reviewing at least as much as the participations.

## Pricing

**Starter** plan, at $99/month.
