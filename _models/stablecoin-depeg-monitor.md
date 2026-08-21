---
title: Stablecoin Depeg Monitor
slug: stablecoin-depeg-monitor
category: Crypto / Risk
featured: false
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU, SG]
lead: Live peg deviation across venues, reserve-attestation freshness and composition, and a redemption-stress indicator with configurable alerts.
metrics:
  - { label: "Peg deviation",   value: "Cross-venue, live" }
  - { label: "Attestations",    value: "Freshness + composition" }
  - { label: "Backtest",        value: "Scored per historical event" }
  - { label: "Alerts",          value: "Configurable thresholds" }
analytics: true
demo:
  output: curve
  cta: Monitor the peg
  lead: The curve is peg deviation. The useful signal is rarely the deviation itself — it is attestation staleness and redemption stress moving first.
  series_label: Peg deviation (bp)
  chart_label: Deviation from peg across the window
  x_labels: [30d ago, Now]
  fields:
    - name: coin
      type: select
      label: Stablecoin
      options: [USDC, USDT, DAI, PYUSD]
      value: USDC
    - name: venues
      type: select
      label: Venue set
      options: [All venues, CEX only, DEX only]
      value: All venues
    - name: threshold
      type: number
      label: Alert threshold
      value: 25
      min: 1
      max: 500
      unit: bp
    - name: stress
      type: checkbox
      label: Include redemption-stress indicator
      value: true
---

## What it does

Renders **live peg deviation across venues** for a selected stablecoin,
**reserve-attestation freshness and composition**, and a **redemption-stress
indicator**, with configurable alert thresholds. Directly relevant to any
tenant holding USDC through GeFi's own payment rails.

## Price is the last thing to move

A depeg visible in the price is a depeg already underway. The historical
pattern — including the events every treasurer remembers — is that price holds
near the peg while the underlying stress builds elsewhere: reserve
composition shifting toward less-liquid assets, attestations arriving late or
not at all, redemption queues lengthening.

That is why this monitor treats **attestation freshness and composition** and
**redemption stress** as first-class signals beside the price, not as
supporting detail. The leading indicators are the product; the price chart is
confirmation.

## Cross-venue, because a depeg starts somewhere

Peg deviation is not uniform. Stress typically appears first on a single venue
— often the one with the thinnest order book or the most anxious holders —
before arbitrage stops closing the gap and the deviation spreads. Monitoring
the *dispersion* across venues catches that earlier than any single price
feed, and a widening spread between venues is itself an alert condition.

## The backtest scores earliness, not accuracy

Every monitor "detects" a depeg eventually. The **depeg-event backtest
library** scores this model on the only dimension that matters operationally:
**how early** it flagged each historical event relative to when the price
broke. A monitor judged on accuracy alone can score perfectly while alerting
too late to act on — earliness is the honest metric, and it is the one
published.

Attestation documents are ingested with **parse-failure alerts**, since an
attestation that failed to parse looks identical to one that was never
checked.

## Pricing

**Pro** plan and above, at $199/month.
