---
title: Monte Carlo Simulation Service
slug: monte-carlo-simulation-service
category: Primitives / Simulation
featured: false
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [Global]
lead: Path simulation as a primitive — define or import distributions and correlations, run with fan charts and percentile tables, and replay any run exactly.
metrics:
  - { label: "Replay",            value: "Deterministic" }
  - { label: "Convergence",       value: "Reported" }
  - { label: "Consumed by",       value: "LP Treasury, Real Options" }
  - { label: "Config sharing",    value: "Save + share" }
analytics: true
demo:
  output: table
  cta: Run the simulation
  lead: Define a run. Percentiles are reported with a convergence indicator — a percentile from an unconverged run is a number with no claim on the truth.
  columns: [Percentile, Outcome, Std. error]
  row_labels: [P5, P25, P50, P75, P95]
  row_count: 5
  fields:
    - name: paths
      type: number
      label: Paths
      value: 50000
      min: 1000
      max: 1000000
      step: 1000
    - name: horizon
      type: number
      label: Horizon
      value: 60
      min: 1
      max: 360
      unit: months
    - name: distribution
      type: select
      label: Distribution
      options: [Normal, Student-t, Empirical bootstrap, Import from model]
      value: Student-t
    - name: seed
      type: number
      label: Seed
      value: 42
      min: 0
---

## What it does

Defines distributions and correlations — by hand, or imported from another
GeFi model — and runs path simulations, returning **fan charts**, **percentile
tables**, and a **convergence indicator**. Configurations save and share.

This is the primitive that the LP Treasury tool and the Real Options model
call underneath, exposed as a product in its own right.

## Convergence is reported, not assumed

A Monte Carlo result is an estimate, and its precision depends on path count.
Tail percentiles converge far more slowly than the median: a run that has
settled at P50 may still be moving substantially at P95.

Since the tails are usually the reason anyone runs the simulation, reporting a
percentile without its **standard error** invites a decision on a number that
has not converged. Both are returned, and the convergence indicator says
plainly whether more paths are needed.

## Every run replays exactly

Seed and RNG selection are governed, so any simulation can be **replayed
deterministically**. Two consequences follow.

A result quoted in a memo or a board pack can be reproduced months later,
exactly — not approximately. And when a downstream model's output changes,
the question "did the simulation change or did the inputs change" has an
answer, because an identical config and seed must give an identical result.

A simulation service without reproducibility produces numbers nobody can
defend, which is why this is governance rather than a convenience.

## Metering and consumers

Compute is metered per tenant against plan quotas, and a **consumer registry**
records which GeFi models depend on the service — so the blast radius of a
change to it is known before the change is made rather than discovered after.

## Pricing

**Starter** plan and above, at $99/month, with compute metered against plan
quota.
