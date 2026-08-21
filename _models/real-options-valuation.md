---
title: Real Options Valuation
slug: real-options-valuation
category: Valuation
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Values managerial flexibility — expand, delay, abandon — alongside static NPV, and says plainly how much of the answer is the option.
metrics:
  - { label: "Option types",     value: "Expand / delay / abandon" }
  - { label: "Methods",          value: "BS, binomial, MC" }
  - { label: "Flexibility split", value: "Always shown" }
  - { label: "Review trigger",   value: "Configurable" }
analytics: true
demo:
  output: score
  cta: Value the option
  lead: Enter the project. The result separates static NPV from the value of flexibility — the second number is the one that needs scrutiny.
  score_label: Option value / total
  drivers: [Volatility, Time to expiry, Moneyness, Exercise cost]
  fields:
    - name: asset_value
      type: number
      label: Underlying asset value
      value: 12000000
      min: 0
      step: 100000
      unit: USD
    - name: exercise_cost
      type: number
      label: Exercise cost
      value: 9500000
      min: 0
      step: 100000
      unit: USD
    - name: expiry
      type: number
      label: Time to expiration
      value: 3
      min: 0
      max: 30
      unit: years
    - name: vol
      type: number
      label: Volatility
      value: 35
      min: 1
      max: 200
      unit: "%"
    - name: option_type
      type: select
      label: Option type
      options: [Expand, Delay, Abandon]
      value: Delay
---

## What it does

Takes underlying asset value, exercise cost, time to expiration, volatility,
and option type — expand, delay, or abandon — and returns an **option value
alongside the static NPV**, with a plain-language panel stating how much of
the total comes from flexibility. Includes a decision-milestone timeline and a
binomial-tree view.

## Why the split is always shown

Real options valuation is genuinely useful and unusually easy to misuse. A
project with negative static NPV can be worth pursuing because the right to
proceed later, once uncertainty resolves, has value. That is a real insight.

It is also the mechanism by which any project can be made to look attractive:
raise the volatility assumption and the flexibility premium rises with it,
because **option value increases with uncertainty**. Nothing about the project
improved — the input changed.

So the two numbers are never blended. A reader can always see whether an
investment case rests on cash flows or on the option, and the driver bars show
how much of the option value is volatility rather than moneyness.

## Volatility is the assumption that decides the answer

Volatility for a real asset is not observable the way it is for a listed
equity. It is estimated from comparable assets, and the estimate carries
enormous weight in the result.

The **volatility library is sourced from comparable-asset feeds** rather than
entered ad hoc, and any valuation where the flexibility premium exceeds a
configurable share of static NPV routes to an **analyst review queue** — not
because such valuations are wrong, but because that is where an unexamined
volatility assumption does the most damage.

Method choice — Black-Scholes, binomial, Monte Carlo — is version-controlled,
since the same project values differently under each and the difference should
be attributable.

## Pricing

**Pro** plan and above, at $199/month.
