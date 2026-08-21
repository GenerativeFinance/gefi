---
title: Cross-Border Payment Router
slug: cross-border-payment-router
category: Payments
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [Global]
lead: Compares rails for a payment corridor on cost, speed, and compliance burden, and shows why a route was chosen.
metrics:
  - { label: "Rails compared",     value: "SWIFT, RTP, local" }
  - { label: "Routing decision",   value: "Traced" }
  - { label: "FX markup",          value: "Disclosed" }
  - { label: "Travel-rule check",  value: "Built in" }
analytics: true
demo:
  output: table
  cta: Compare routes
  lead: Pick a corridor. Each row is a candidate rail with its true landed cost, speed, and compliance burden — not just the headline fee.
  columns: [Rail, Landed cost %, Settlement hrs]
  row_labels: [SWIFT correspondent, Local rail, RTP, Partner network, Stablecoin bridge]
  row_count: 5
  fields:
    - name: send
      type: select
      label: Send from
      options: [US, UK, EU, UAE, SG]
      value: US
    - name: receive
      type: select
      label: Receive in
      options: [Philippines, India, Nigeria, Mexico, Brazil]
      value: Philippines
    - name: amount
      type: number
      label: Amount
      value: 25000
      min: 1
      step: 100
      unit: USD
    - name: urgency
      type: select
      label: Priority
      options: [Cheapest, Fastest, Balanced]
      value: Balanced
---

## What it does

Takes a corridor — send country, receive country, currency, amount — and
returns a **route comparison** across available rails: SWIFT correspondent,
local rails, RTP, and partner networks. Each route is scored on cost, speed,
and compliance burden.

Every routing decision comes with a **trace**: which rail was chosen, and why
it beat the alternatives. A router that returns a single answer asks to be
trusted; a router that shows its comparison can be checked.

## Cost means landed cost

The headline fee on a cross-border payment is rarely the cost. The cost is the
fee plus the FX spread plus lifting charges deducted by intermediaries en
route — and the last of these is invisible at send time, which is precisely why
it is where margin hides.

The **FX transparency panel** separates the interbank rate from the applied
markup rather than quoting one blended rate. A route with no fee and a wide
spread is more expensive than a route with a visible fee and a tight one, and
comparing on fees alone gets that backwards.

## Compliance burden is a routing input

Rails differ in what they require: travel-rule data obligations, beneficiary
detail, sanctions screening depth. A route that is cheapest and fastest but
demands data you do not hold is not actually available to you.

The **travel-rule checklist** runs before routing rather than after, so a
payment is not routed onto a rail it cannot clear. The audit trail records what
was collected and transmitted per payment.

## Operations

Rail and partner health is monitored live, since a rail that is nominally
available but degraded should not win a route. Routing logic changes go through
A/B testing rather than straight to production, and new corridors enter through
a request queue.

## Pricing

**Starter** plan and above, at $99/month. Corridor coverage is global; rail
availability varies by corridor and by your own licensing.
