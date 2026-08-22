---
title: How the GeFi audit log works
type: Methodology
topic: Audit infrastructure
date: 2026-04-08
slug: audit-log-design
lead: Every inference call is hash-chained, batched, Merkle-anchored daily, and verifiable offline by anyone with a run id. Here's the design.
---

## Why bother

Most AI marketplaces give you a CSV of your own usage and call it an audit
trail. Regulators ask three questions a CSV can't answer:

1. Has this row been edited since it was logged?
2. Are there rows missing?
3. Can a third party verify (1) and (2) without trusting the platform?

We needed a structure that answers all three and runs at edge latency.

## The design

Every inference call appends a record to a per-tenant log:

```
record_n = { run_id, model_id, input_hash, output_hash, ts, prev_hash }
prev_hash = sha256(record_{n-1})
```

The chain runs continuously per tenant. Every 24 hours a Merkle tree is
built over the day's records and the root is published to:

- A public KV namespace on Cloudflare.
- An OpenTimestamps anchor on Bitcoin.

Customers on the Enterprise tier can additionally pin the root to a public
Ethereum L2 of their choosing.

## Verifying a single run

Given a `run_id`, fetch:

```
GET https://api.gefi.io/v1/audit/proof/<run_id>
```

You get back the record, its position in the daily Merkle tree, and the
sibling hashes needed to reconstruct the root. Verify locally with
~10 lines of code in the language of your choice; reference implementations
in TS, Python, and Go are in [github.com/gefi-io/audit-spec](https://github.com/gefi-io/audit-spec).

## What this rules out

- Silent edits: any change to a record breaks the chain at that point.
- Silent deletions: any missing record breaks the chain at the next record.
- Platform compromise: you can verify offline against the timestamped root,
  even if our entire infrastructure goes dark.

## What it doesn't rule out

- A model author secretly returning different outputs to different tenants
  for the same input — you'd see it in the output hashes only if you ran
  the same input. We're working on a deterministic-input audit option for
  this; design notes coming in a future post.
