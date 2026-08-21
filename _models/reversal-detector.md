---
title: Reversal Detector
slug: reversal-detector
category: Trading / Directional
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Top and bottom detection with the specific pattern flagged and accuracy segmented by regime. The hardest-to-time signal in the catalogue. Signals only.
metrics:
  - { label: "Patterns",       value: "Exhaustion / divergence / climax" }
  - { label: "Accuracy",       value: "By market regime" }
  - { label: "Manual review",  value: "Highest in catalogue" }
  - { label: "Execution",      value: "Yours, not ours" }
analytics: true
demo:
  output: score
  cta: Detect reversal
  lead: Confidence is deliberately conservative. A high score here means the pattern is clear, not that the timing is.
  score_label: Reversal confidence
  drivers: [Exhaustion volume, Momentum divergence, Climax pattern, Regime fit]
  fields:
    - name: instrument
      type: text
      label: Instrument
      value: NDX
      placeholder: Ticker or index
    - name: direction
      type: select
      label: Looking for
      options: [Top, Bottom, Either]
      value: Either
    - name: window
      type: number
      label: Pattern window
      value: 20
      min: 3
      max: 120
      unit: days
    - name: regime
      type: select
      label: Market regime
      options: [Trending, Ranging, High volatility]
      value: Trending
---

> **Hypothetical performance.** Every backtest, accuracy figure, and return
> number on this page is **simulated and hypothetical**. Simulated results do
> not reflect actual trading, carry no guarantee, and are **not indicative of
> future returns**. Hypothetical results benefit from hindsight and exclude
> execution costs and slippage.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## This is the hardest-to-time signal in the catalogue

Stated plainly, at the top, because it governs how the output should be used.

Calling a top or a bottom means trading **against** the prevailing trend at the
moment that trend is most convincing. Reversal patterns appear repeatedly
during a strong move and resolve into continuation most of the time; the one
that marks the actual turn looks much like the several that preceded it.

Accuracy is materially worse than the directional models in this catalogue, and
that is inherent to the problem rather than a deficiency in this
implementation. Anyone using it should size accordingly and treat it as one
input rather than a trigger.

## Accuracy is segmented by regime, because the average is misleading

Reversal detection is far more reliable at range extremes than in a persistent
trend. A single blended accuracy number averages a regime where the signal has
genuine value with one where it mostly generates losses.

The **accuracy-by-regime chart** is therefore the primary evidence on the page,
and the regime selector changes what the confidence score means as much as the
pattern does.

## Patterns are named, not implied

Output flags the **specific pattern** — exhaustion volume, momentum divergence,
climax — rather than returning a bare score. A trader who can see which pattern
fired can judge whether it fits what they are looking at; an unnamed
"confidence: 0.71" cannot be argued with, only obeyed or ignored.

Reversal calls draw more manual review than any other signal type here, and
analyst overrides are logged accordingly.

## Pricing

**Pro** plan and above, at $199/month.
