---
title: Startup Runway Tracker
slug: startup-runway-tracker
category: Venture / Growth
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [Global]
lead: Live cash and burn projecting a runway date, with hiring and fundraising toggles and a minimum-cash alert line.
metrics:
  - { label: "Connections",     value: "Bank / payroll or manual" }
  - { label: "Alert line",      value: "Minimum-cash threshold" }
  - { label: "Alert delivery",  value: "Reliability-monitored" }
  - { label: "Benchmarks",      value: "Anonymised aggregate" }
analytics: true
demo:
  output: curve
  cta: Project runway
  lead: The line is cash to zero. The alert threshold sits above it, because the decision point is well before the money runs out.
  series_label: Cash balance
  chart_label: Cash to runway end
  x_labels: [Today, Runway end]
  fields:
    - name: cash
      type: number
      label: Cash balance
      value: 2800000
      min: 0
      step: 50000
      unit: USD
    - name: burn
      type: number
      label: Monthly net burn
      value: 185000
      min: 0
      step: 5000
      unit: USD
    - name: hires
      type: number
      label: Planned hires
      value: 4
      min: 0
      max: 100
    - name: threshold
      type: number
      label: Minimum-cash alert
      value: 750000
      min: 0
      step: 50000
      unit: USD
---

## What it does

Projects a **runway date** from live cash balance and burn rate, with hiring
and fundraising toggles that redraw the line instantly. It pulls from a bank
and payroll connection where one is available, and accepts manual monthly
inputs where it is not.

## The alert line sits above zero for a reason

Running out of cash is not the event to plan around — it is the event to be
several months clear of. Raising takes time, and a company that starts a
process at its minimum viable cash position negotiates from weakness, or takes
a bridge on terms it would not otherwise accept.

The **minimum-cash threshold** is therefore a first-class input, and it is
where the alert fires. The decision the tracker exists to prompt is "start
raising" or "cut burn", and both need lead time.

## Hiring is the toggle that moves the line most

Headcount is the dominant term in most early-stage burn, and each hire's cost
compounds forward through the whole projection. A plan to hire four people is
frequently a decision to shorten runway by several months, taken without that
framing.

The toggle exists to put the two decisions in the same view: this hiring plan
and this runway date are the same choice.

## A missed alert is the worst failure mode

If this model fails, it fails silently — a founder who is not warned believes
they have more time than they do, and the tool's presence actively displaced
the manual check they would otherwise have run.

So **alert-delivery reliability is monitored as a first-class metric**, and
connector health is tracked per provider. A stale bank connection producing a
confident runway line is the specific outcome this design is built to avoid.

## Pricing

**Starter** plan, at $99/month. Contributing anonymised burn metrics to the
shared benchmark library is opt-in.
