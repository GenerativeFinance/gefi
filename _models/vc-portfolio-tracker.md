---
title: VC Portfolio Tracker
slug: vc-portfolio-tracker
category: Venture / Growth
featured: false
risk: low
maturity: GA
federated: true
price: 99
jurisdictions: [US, UK, EU]
lead: Portfolio marks rolled up to fund-level MOIC, IRR, DPI and TVPI, with concentration views and a federated peer-median benchmark.
metrics:
  - { label: "Fund metrics",     value: "MOIC / IRR / DPI / TVPI" }
  - { label: "Concentration",    value: "Sector / geo / stage / vintage" }
  - { label: "Peer benchmark",   value: "Federated median" }
  - { label: "Mark methodology", value: "Consistency-checked" }
analytics: true
demo:
  output: table
  cta: Roll up the fund
  lead: Positions roll into fund metrics. TVPI and DPI are shown together because the gap between them is the part that is still an opinion.
  columns: [Metric, Fund, Peer median]
  row_labels: [MOIC, Gross IRR, DPI, TVPI, Top-3 concentration]
  row_count: 5
  fields:
    - name: vintage
      type: number
      label: Vintage
      value: 2021
      min: 2000
      max: 2030
    - name: positions
      type: number
      label: Positions
      value: 34
      min: 1
      max: 500
    - name: deployed
      type: number
      label: Capital deployed
      value: 78000000
      min: 0
      step: 1000000
      unit: USD
    - name: benchmark
      type: checkbox
      label: Compare against federated peer median
      value: true
---

## What it does

Tracks company, investment date, cost basis, ownership, and current mark, and
rolls them into **fund-level MOIC, IRR, DPI, and TVPI**, with concentration
dashboards by sector, geography, stage, and vintage — plus a **federated
benchmark** against an anonymised peer-fund median.

## DPI and TVPI belong side by side

TVPI includes unrealised marks. DPI counts only cash actually returned. The
difference between them is the portion of reported performance that remains an
opinion.

A fund reporting 2.8x TVPI and 0.3x DPI has produced a view of value, not
distributions. That may be entirely appropriate for its vintage — but reporting
the first without the second describes a fund that has returned very little as
though it has performed strongly.

Both are always shown, and the concentration views sit alongside because a TVPI
carried by one position is a materially different fund from one carried by
fifteen.

## The benchmark's honest caveat

Peer comparison of venture marks compares **methodologies as much as
performance**. Funds mark differently: some hold at last round until a
realisation event, others adjust to comparable public multiples, others apply
haircuts to stale rounds.

A fund can appear to outperform its peer median mostly by marking more
aggressively. So the federation runs a **mark-methodology consistency checker**
across contributing funds, and the benchmark is presented as a comparison of
funds whose methodologies have been checked — not as an objective ranking.

Vintage matters for the same reason: a 2021 fund and a 2018 fund are at
different points in the J-curve, and comparing their TVPI without conditioning
on vintage is comparing calendar position rather than skill.

## Pricing

**Starter** plan and above, at $99/month. Federated benchmarking requires
data-partner onboarding.
