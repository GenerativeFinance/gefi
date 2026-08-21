---
title: LP Treasury & Cash Management
slug: lp-treasury-cash-management
category: Primitives / Treasury
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Cash ladder, sweep recommendations, and Monte Carlo capital-call coverage for fund back offices — the weekly treasury run.
metrics:
  - { label: "Coverage probability", value: "Simulated" }
  - { label: "Sweep instruments",    value: "T-bill, MMF" }
  - { label: "Guardrails",           value: "Floors + caps" }
  - { label: "Onchain rails",        value: "USDC on/off-ramp" }
analytics: true
demo:
  output: table
  cta: Build the ladder
  lead: Enter commitments and a call schedule. The ladder is the output a back office acts on; coverage probability comes from the Monte Carlo service.
  columns: [Maturity bucket, Balance, Coverage prob.]
  row_labels: [Overnight, 1 week, 1 month, 3 months, 6 months]
  row_count: 5
  fields:
    - name: commitments
      type: number
      label: Uncalled commitments
      value: 45000000
      min: 0
      step: 1000000
      unit: USD
    - name: horizon
      type: number
      label: Planning horizon
      value: 12
      min: 1
      max: 60
      unit: months
    - name: floor
      type: number
      label: Minimum liquidity floor
      value: 5
      min: 0
      max: 100
      unit: "%"
    - name: usdc
      type: checkbox
      label: Include USDC rails
      value: false
---

## What it does

Takes fund commitments and expected call schedules and returns a **cash
ladder**, **sweep recommendations** across T-bill and money-market-fund
ladders, and a **capital-call coverage probability** computed through the
Monte Carlo Simulation Service.

For funds using GeFi's onchain rails, it includes a USDC on/off-ramp view.

## Coverage is a probability, not a plan

Capital calls do not arrive on schedule. A back office that ladders against
the *expected* call timing is solvent on the expected path and short on a
meaningful fraction of the others.

So coverage is expressed as a **probability** over simulated call timing:
the chance of meeting every call from maturing instruments without an
unplanned sale. That reframes the decision from "does the ladder work" —
which is always yes on the expected path — to "how often does it fail, and
is that acceptable".

Because the simulation runs on the shared Monte Carlo service, the coverage
figure in a memo can be replayed exactly.

## Yield is the smaller half of the problem

Sweeping idle cash into T-bills and MMFs earns yield, and the yield is the
easy part. The hard part is not being forced to liquidate early into a call
that arrived sooner than modelled — where the realised cost of a forced sale
can exceed the yield the ladder was reaching for.

Guardrails are therefore policy, not suggestion: **minimum liquidity floors**
and **counterparty caps** bound what the tool will recommend. A sweep that
would breach a floor is not offered, whatever it yields.

Counterparty caps matter for the same reason concentration matters anywhere —
an MMF ladder concentrated in one provider is a single point of failure
holding the fund's operating liquidity.

## Operations

Custodian and bank feed health is monitored, since a stale balance produces a
confidently wrong ladder. Scenario presets are configured per fund, as call
patterns differ sharply between a deploying fund and one in harvest.

## Pricing

**Pro** plan and above, at $199/month. Monte Carlo compute is metered against
plan quota.
