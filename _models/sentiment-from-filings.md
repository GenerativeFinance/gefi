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
analytics: true
demo:
  output: score
  cta: Score the filing
  lead: Look up a ticker or pick a filing type. The gauge is the document-level tone score; the bars below break it into the management-tone components.
  score_label: Tone (0–1)
  drivers: [Confidence, Hedging, Novelty, Risk language]
  fields:
    - name: ticker
      type: text
      label: Ticker
      value: MSFT
      placeholder: e.g. MSFT
    - name: filing
      type: select
      label: Filing type
      options: [10-K, 10-Q, 8-K, EU Annual Report, UK Annual Report]
      value: 10-K
    - name: section
      type: select
      label: Section
      options: [Whole document, MD&A, Risk factors]
      value: Whole document
    - name: highlight
      type: checkbox
      label: Return risk-language offsets
      value: true
---

## What it does

`sentiment-from-filings` ingests the full text of a regulatory filing and
returns:

- A scalar sentiment score for the document and per section.
- A list of detected risk-language phrases with their location offsets, so a
  reader pane can highlight them in place rather than summarising them away.
- A management-tone vector (confidence, hedging, novelty) for use as a feature
  in downstream models.

The API returns tone on a **−1 to +1** scale. The gauge above shows the same
score normalised to 0–1, because the shared chart primitive is currently
unsigned; the underlying figure is unchanged. A signed gauge is a harness
change rather than a change to this page.

## Where it shines

Long-only equity funds running event-driven strategies on earnings releases
and 8-Ks. Backtests on 2018–2025 US large-cap show a 0.78 information ratio
when used as a single signal in a market-neutral overlay; full methodology
in our [research notes](/research/).

## Where to be careful

**Do not size positions on this output alone.** Sentiment models are
reflexive: as usage crowds, the signal erodes. Live information ratio is
monitored against the backtest baseline and a **decay alert** fires when the
two diverge — which is the honest way to run a signal whose edge is a
function of how many people have it.

Combine with at least one orthogonal signal. This is a feature, not a
strategy.

## How it's trained

Trained on 25 years of EDGAR filings plus Companies House filings, fine-tuned
on a hand-labelled tone corpus. Labelling runs through a queue with
**inter-annotator agreement** tracked, since tone labels are subjective and a
corpus nobody agrees on produces a model that scores well against itself and
poorly against reality.

Re-trained quarterly. All training-data provenance hashes are published in the
[audit log](/compliance/), so the corpus behind any given model version is
identifiable after the fact.

## Pricing

Included in **Starter** and above for up to plan-tier inference calls;
metered overage at $0.001 / call. Listed at $49/month.
