---
title: Sentiment from Filings
slug: sentiment-from-filings
category: NLP / Investing
featured: true
risk: low
maturity: GA
federated: false
price: 49
jurisdictions: [US, UK, EU]
lead: Extracts forward-looking sentiment, risk language, and management tone from 10-K, 10-Q, 8-K, and equivalent EU/UK filings.
metrics:
  - { label: "F1 (binary tone)",        value: "0.91" }
  - { label: "Backtest IR (2018-2025)", value: "0.78" }
  - { label: "Median p99 latency",      value: "120 ms" }
  - { label: "Calls served",            value: "12.4 M" }
---

## What it does

`sentiment-from-filings` ingests the full text of a regulatory filing and
returns:

- A scalar sentiment score (`-1.0` to `+1.0`) for the document and per section.
- A list of detected risk-language phrases with their location offsets.
- A management-tone vector (confidence, hedging, novelty) for use as a feature in downstream models.

## Where it shines

Long-only equity funds running event-driven strategies on earnings releases
and 8-Ks. Backtests on 2018–2025 US large-cap show a 0.78 information ratio
when used as a single signal in a market-neutral overlay; full methodology
in our [research notes](/research/).

## Where to be careful

Sentiment models are reflexive. Crowded usage erodes the signal. Don't size
positions purely on this output — combine with at least one orthogonal
signal.

## How it's trained

Trained on 25 years of EDGAR filings + Companies House filings, fine-tuned
on a hand-labelled tone corpus. Re-trained quarterly; all training-data
provenance hashes are published in the [audit log](/compliance/).

## Pricing

Included in **Starter** and above for up to plan-tier inference calls;
metered overage at $0.001 / call.
