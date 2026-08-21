---
title: Fraud Graph
slug: fraud-graph
category: Fraud / AML
featured: true
risk: low
maturity: GA
federated: false
price: 99
jurisdictions: [US, UK, EU, UAE]
lead: Real-time transaction fraud scoring over a 1.2B-node entity graph, returning in under 50 ms from any region.
metrics:
  - { label: "Recall @ 0.1% FPR", value: "0.74" }
  - { label: "p99 latency",       value: "48 ms", live: { base: 48, jitter: 7, floor: 33, unit: " ms" } }
  - { label: "Graph size",        value: "1.2B nodes" }
  - { label: "Edge regions",      value: "US, EU, UAE" }
analytics: true
demo:
  output: score
  cta: Score the transaction
  lead: Enter transaction signals. The score comes from the linked entities around this transaction, not from the transaction in isolation — the sample subgraph below is what the model actually walks.
  score_label: Fraud score
  drivers: [Device linkage, IP route, Merchant history, Velocity]
  graph:
    caption: Synthetic 20-node sample of the subgraph behind one score — how a transaction connects to devices, IPs, merchants, cards, and accounts. Run a score and the graph resolves outward from the transaction.
    center: { id: txn, label: Transaction, kind: center }
    kinds:
      - { kind: device, label: Devices }
      - { kind: ip, label: IP routes }
      - { kind: merchant, label: Merchants }
      - { kind: card, label: Cards }
      - { kind: account, label: Accounts }
    nodes:
      - { id: d1, kind: device }
      - { id: d2, kind: device }
      - { id: d3, kind: device }
      - { id: i1, kind: ip }
      - { id: i2, kind: ip }
      - { id: i3, kind: ip }
      - { id: m1, kind: merchant }
      - { id: m2, kind: merchant }
      - { id: m3, kind: merchant }
      - { id: c1, kind: card }
      - { id: c2, kind: card }
      - { id: c3, kind: card }
      - { id: c4, kind: card }
      - { id: c5, kind: card }
      - { id: a1, kind: account }
      - { id: a2, kind: account }
      - { id: a3, kind: account }
      - { id: a4, kind: account }
      - { id: i4, kind: ip }
    edges:
      - [txn, d1]
      - [txn, i1]
      - [txn, m1]
      - [txn, c1]
      - [d1, c1]
      - [d1, c2]
      - [d1, c3]
      - [d2, c3]
      - [d2, a1]
      - [d3, a2]
      - [i1, i2]
      - [i2, i3]
      - [i1, d2]
      - [i3, d3]
      - [m1, c4]
      - [m2, c4]
      - [m2, c5]
      - [m3, c5]
      - [m1, m2]
      - [c2, a1]
      - [c4, a3]
      - [c5, a4]
      - [i4, m3]
      - [i1, i4]
  fields:
    - name: device
      type: text
      label: Device fingerprint
      value: d41d8cd98f00b204
      placeholder: Fingerprint hash
    - name: ip_route
      type: select
      label: IP route
      options: [Residential, Datacenter, VPN / proxy, Mobile carrier]
      value: VPN / proxy
    - name: merchant
      type: text
      label: Merchant id
      value: mrc_88213
    - name: amount
      type: number
      label: Amount
      value: 480
      min: 0
      step: 10
      unit: USD
---

## What it does

Scores a transaction in real time using a graph constructed from device
fingerprints, IP routes, merchant ids, and historical chargeback patterns.
Scoring runs on Cloudflare Workers and Vectorize, so the round-trip stays
under 50&nbsp;ms even from regions with no major cloud presence.

The score is returned with the **linked entities that drove it** — the
subgraph, not just the number. An unexplained fraud score is unactionable: a
reviewer needs to see that this device has touched nine cards this week, not
merely that the model dislikes the transaction.

## Why recall is quoted at a fixed false-positive rate

The headline metric is **recall at 0.1% FPR**, not accuracy. Fraud is rare
enough that a model declining nothing scores above 99% accurate, so accuracy
is meaningless here.

What matters is how much fraud is caught at a false-positive rate the business
can absorb, because every false positive is a declined legitimate customer.
Fixing the FPR and reporting recall against it is the only comparison that
reflects the real trade.

The threshold is tunable with a live precision/recall preview, and the
false-positive review queue is fed by **actual chargeback outcomes** — so the
model is corrected against what really happened rather than against what
reviewers guessed at the time.

## Latency is a fraud control

At authorisation time the scoring budget is tens of milliseconds. A model that
is more accurate but slower does not get consulted; it times out and the
transaction is approved unscored. Per-region edge latency is monitored for
that reason — EU, US, and UAE tiles — because a regional latency regression
silently degrades coverage rather than raising an error.

That is also why the p99 latency figure above is **shown being measured**
rather than quoted: a sub-50&nbsp;ms claim is only worth anything as a live
number. The readout is a seeded sample on this page; in production it is the
same sparkline fed by the region you are calling from.

## Pricing

Available from **Starter**, at $99/month. Enterprise customers can run a
dedicated graph in a private region.
