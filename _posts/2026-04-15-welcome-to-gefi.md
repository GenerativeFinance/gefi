---
title: "Welcome to GeFi"
date: 2026-04-15
author: The GeFi team
tags: [Company, Launch]
lead: Why we're building a marketplace for AI financial models — and what's live, what's next, and what we're still arguing about.
---

We started GeFi because none of the existing AI marketplaces are structured
to serve a regulated financial-services buyer. They sell you a model. They
don't tell you where the training data came from, where the inference ran,
or how to prove either to your regulator.

So we built one that does.

## What's live today

- **Marketplace** — the catalogue is small but real. Five featured models
  across NLP, optimisation, credit risk, fraud, and trade finance.
- **Audit log** — every inference is hash-chained and Merkle-anchored
  daily. Spec is on [GitHub](https://github.com/gefi-io/audit-spec).
- **Federated training** — two production federations (Credit Oracle and
  Portfolio Optimiser) with 41 combined institutional participants.
- **Compliance routing** — KYC tiers and per-jurisdiction counsel are live
  for US, UK, EU, and UAE.

## What's next

- **More models.** Macro Nowcast comes out of beta in Q3. Treasury
  liquidity model and ESG attribution model are in private alpha.
- **MAS and FINMA.** Singapore and Switzerland counsel onboarding starts
  this quarter.
- **Sovereign tenants.** OVH SecNumCloud and Infomaniak deployments are in
  staging.
- **Public trust portal.** [trust.gefi.io](https://trust.gefi.io) goes live
  with the SOC 2 Type I report.

## What we're still arguing about

- **Onchain payouts as the default.** It's cleaner for global developer
  payouts; it's a UX cliff for fiat-only buyers. We're shipping both rails
  and watching what people use.
- **Open-sourcing the model evaluation harness.** We want to. We don't want
  to do it before it's clean. Probably Q4.
- **A native EU Cloud Region beyond Cloudflare.** Cloudflare's EU region is
  good. It is not "we run on a SecNumCloud-qualified provider" good. The
  Enterprise tier ships with that option; the question is whether we make it
  the default for EU paid tenants.

If any of this is interesting, you can [request early access](/contact/?topic=sales) (the self-serve sign-up at `app.gefi.io` opens with our next release)
or [book a demo](/contact/?topic=demo). If it's *very* interesting,
[we're hiring](mailto:careers@gefi.io).

— The GeFi team
