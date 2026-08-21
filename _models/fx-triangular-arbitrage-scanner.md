---
title: FX Triangular Arbitrage Scanner
slug: fx-triangular-arbitrage-scanner
category: Trading / Arbitrage
featured: false
risk: medium
maturity: GA
federated: false
price: 199
jurisdictions: [US, UK, EU, SG]
lead: Cross-rate inconsistencies with the implied profit shown net of transaction cost — most triangular arb is arbitraged away by cost alone in liquid pairs. Signals only.
metrics:
  - { label: "Rate feeds",      value: "Multi-venue" }
  - { label: "Viability",       value: "Net-of-cost flag" }
  - { label: "Window frequency", value: "Dashboarded" }
  - { label: "Execution",       value: "Yours, not ours" }
analytics: true
demo:
  output: score
  cta: Scan for arbitrage
  lead: The gross inconsistency is common. The net-of-cost flag is the number that matters — most of the time it says no.
  score_label: Net-of-cost profit
  drivers: [Gross inconsistency, Bid-ask cost, Venue fee, Execution latency]
  fields:
    - name: triangle
      type: select
      label: Currency triangle
      options: [EUR/USD-USD/JPY-EUR/JPY, GBP/USD-USD/CHF-GBP/CHF, AUD/USD-USD/CAD-AUD/CAD]
      value: EUR/USD-USD/JPY-EUR/JPY
    - name: venue
      type: select
      label: Venue
      options: [Primary ECN, Retail broker, Interbank]
      value: Primary ECN
    - name: notional
      type: number
      label: Notional
      value: 1000000
      min: 1000
      step: 10000
      unit: USD
    - name: latency
      type: number
      label: Assumed execution latency
      value: 40
      min: 1
      max: 500
      unit: ms
---

> **Hypothetical performance.** Every profit figure and backtest on this page
> is **simulated and hypothetical**, not indicative of future returns, and net
> figures depend entirely on cost and latency assumptions that vary by venue
> and account.

## Signals only

This model produces **signals for the subscriber's own execution**. GeFi does
not place orders, route orders, or hold client assets.

## Most opportunities disappear the moment costs are applied

This is stated directly because it is the single most important fact about
this strategy in liquid currency pairs.

A **gross** cross-rate inconsistency across three currency pairs is common —
markets are not perfectly synchronised at the microsecond level. It is close to
irrelevant on its own. What matters is whether that inconsistency survives
**bid-ask spread, venue fees, and execution latency** across three legs, and
in the major pairs this scanner covers, it very often does not.

The **net-of-cost viability flag** is therefore the headline, not the gross
number, and the opportunity-frequency dashboard reports honestly how rarely a
genuinely viable window occurs — which is the useful expectation to set before
anyone builds infrastructure around chasing this.

## Costs are modelled per pair and per venue, not assumed generic

Spread and fee structure differ meaningfully across venues and across pairs,
and a generic cost assumption would misstate viability in both directions —
understating it on the tightest interbank venues, overstating it on retail
ones. The cost model is maintained **per currency pair and venue** for that
reason.

## Latency is part of the arithmetic, not an afterthought

By the time a three-leg execution completes, the rates that made it viable may
have moved. The latency assumption is a first-class input, and the "net" in
net-of-cost includes an estimate of what latency costs — not just spread and
fees frozen at signal time.

## Pricing

**Starter** plan and above, at $199/month.
