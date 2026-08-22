---
title: Why federated learning is the right shape for financial AI
type: Note
topic: Federated learning
date: 2026-04-22
slug: why-federated-learning-finance
lead: Pooling data across lenders, asset managers, or payment processors is illegal, impractical, or both. Federated learning sidesteps the pool and keeps the signal.
---

## The problem

The most useful financial AI models are trained on data that, by law or by
contract, can't be pooled:

- Loan tapes (banking secrecy + competition law).
- Custodied positions (fiduciary duty + market-abuse risk).
- Card-spend telemetry (PCI + privacy).
- KYC / AML records (regulatory residency requirements).

The result: every institution trains its own model on its own data,
underperforms a hypothetical pooled model, and has no path to close the gap
without a regulatory miracle.

## What federated learning actually does

It substitutes **gradient pooling** for **data pooling**. Each institution
trains locally; only the parameter updates leave the institution; an
aggregator combines them; the merged model is redistributed.

Done well — with secure aggregation, differential-privacy budgets, and
client-side validation — the institution gives up no information that an
adversary couldn't already infer from the public model's outputs.

## What this enables on GeFi

- **Credit Oracle** (live) — 14 SME lenders, +6 AUC points over the best
  single-lender model.
- **Portfolio Optimiser** federation (live) — 27 institutions contributing
  anonymised positioning, measurable lift over the public-data baseline.
- **Macro Nowcast** federation (planned) — central banks publish a few prints
  per quarter; payment processors publish nothing. There's a path here.

## What we got wrong on the first iteration

We initially under-specified the client-side validation step. A single
malicious participant could — in principle — submit poisoned gradients that
biased the merged model. The current production stack runs every gradient
through a robust-aggregation step (Krum + median-of-means) before merging,
and we publish the rejection rate alongside the model card.

## Further reading

- [The audit log spec](https://github.com/gefi-io/audit-spec)
- [Bonawitz et al., 2017 — Practical Secure Aggregation for Federated Learning](https://arxiv.org/abs/1611.04482)
- [McMahan et al., 2017 — Communication-Efficient Learning of Deep Networks from Decentralized Data](https://arxiv.org/abs/1602.05629)
