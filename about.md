---
layout: page
title: About
eyebrow: Who we are
lead: GeFi is building the infrastructure layer for AI in regulated finance.
permalink: /about/
---

## What we're building

A marketplace where investors, quants, and institutions can discover,
subscribe to, and contribute to AI financial models — with provable training
data, hash-chained inference logs, and compliance routing per jurisdiction.

It's the layer between an off-the-shelf LLM and a regulator-friendly
production deployment.

## Why now

Three things changed in the last 24 months:

1. **Foundation models** got good enough at finance-flavoured tasks to be
   worth deploying.
2. **Cloudflare's edge stack** (Workers, D1, R2, KV, Vectorize, Durable
   Objects) made it possible to run latency-sensitive inference globally
   without standing up regional infrastructure yourself.
3. **Regulators** started writing AI-specific guidance — EU AI Act, SEC
   Rule 10c-1a, MAS FEAT — that none of the existing AI marketplaces are
   structured to serve.

GeFi is built on the assumption that all three of these are permanent.

## How we work

- **Public roadmap.** What we're building, and why, is on the [blog](/blog/).
- **Open audit infra.** Our Merkle-anchoring spec is open and verifiable
  offline.
- **Federated by default.** New models on the platform are encouraged to
  support federated participation.
- **Per-jurisdiction lawyer directory.** Every market we operate in has a
  named local counsel; we publish the list on the [trust page](/compliance/#counsel).

## Team

We're a small, distributed team across the EU, UK, and UAE. Every other role
below is open — write to [careers@gefi.io](mailto:careers@gefi.io) for an
introduction.

<ul class="team-grid" role="list">
  <li class="team-card team-card--member">
    <picture>
      <source srcset="{{ '/assets/img/team/guillaume-lauzier.webp' | relative_url }}" type="image/webp">
      <img class="team-card__avatar" src="{{ '/assets/img/team/guillaume-lauzier.jpg' | relative_url }}" alt="Portrait of Guillaume Lauzier" width="64" height="64" loading="lazy">
    </picture>
    <h3>Guillaume Lauzier</h3>
    <p class="team-card__title">Founder</p>
    <p class="muted">Operator and venture partner working across digital infrastructure, cybersecurity, blockchain, and AI. Building GeFi as the audit-grade inference layer between foundation models and regulated finance.</p>
    <a href="https://www.linkedin.com/in/guillaumelauzier/" rel="noopener">linkedin.com/in/guillaumelauzier</a>
  </li>
  <li class="team-card">
    <span class="badge badge--federated team-card__badge">Hiring</span>
    <h3>Founding engineer — Edge platform</h3>
    <p class="muted">Cloudflare Workers, Durable Objects, D1. Owns the inference router and audit pipeline.</p>
    <a href="mailto:careers@gefi.io?subject=Founding%20engineer%20%E2%80%94%20Edge%20platform">careers@gefi.io</a>
  </li>
  <li class="team-card">
    <span class="badge badge--federated team-card__badge">Hiring</span>
    <h3>Founding engineer — ML &amp; federated</h3>
    <p class="muted">Federated training, differential privacy, model evaluation. Owns the contributor SDK.</p>
    <a href="mailto:careers@gefi.io?subject=Founding%20engineer%20%E2%80%94%20ML%20%26%20federated">careers@gefi.io</a>
  </li>
  <li class="team-card">
    <span class="badge badge--federated team-card__badge">Hiring</span>
    <h3>Compliance &amp; counsel lead</h3>
    <p class="muted">EU AI Act, SEC, FCA, MAS, ADGM. Owns the per-jurisdiction counsel directory.</p>
    <a href="mailto:careers@gefi.io?subject=Compliance%20%26%20counsel%20lead">careers@gefi.io</a>
  </li>
  <li class="team-card">
    <span class="badge badge--federated team-card__badge">Hiring</span>
    <h3>Developer relations</h3>
    <p class="muted">Docs, sample apps, the model-author programme, and Discord office hours.</p>
    <a href="mailto:careers@gefi.io?subject=Developer%20relations">careers@gefi.io</a>
  </li>
  <li class="team-card">
    <span class="badge badge--federated team-card__badge">Hiring</span>
    <h3>Enterprise account executive</h3>
    <p class="muted">Banks, exchanges, asset managers. Sovereign-tenant deals across EMEA and MENA.</p>
    <a href="mailto:careers@gefi.io?subject=Enterprise%20account%20executive">careers@gefi.io</a>
  </li>
  <li class="team-card">
    <span class="badge badge--federated team-card__badge">Hiring</span>
    <h3>Design engineer</h3>
    <p class="muted">Marketing site, dashboard, and the live risk surface. Hand-rolled CSS, no frameworks.</p>
    <a href="mailto:careers@gefi.io?subject=Design%20engineer">careers@gefi.io</a>
  </li>
</ul>

[→ See partnerships](/partnerships/)
