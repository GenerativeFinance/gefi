---
layout: trust
title: GeFi Trust — evidence portal
permalink: /trust/
sitemap: false
description: Certifications, audit reports, evidence packs, and the live artifact-anchor feed for the GeFi platform.
---

<div class="trust-hero" markdown="1">

# Evidence, not adjectives

This portal is the single place we point auditors, security teams, and
regulators. Everything here is either downloadable now, available under NDA,
or verifiable on-chain. In production this portal is served at
`trust.gefi.io`.

</div>

<section id="certifications" class="trust-section" markdown="1">

## Certifications & frameworks

<div class="trust-certs">
{% for c in site.data.trust.certifications %}
<article class="trust-cert">
<header class="trust-cert__head">
<h3>{{ c.name }}</h3>
{% if c.status == "aligned" %}<span class="status-pill status-pill--ok">Aligned</span>{% elsif c.status == "certified" %}<span class="status-pill status-pill--ok">Certified</span>{% else %}<span class="status-pill status-pill--progress">In progress</span>{% endif %}
</header>
<p class="muted small">{{ c.detail }}</p>
</article>
{% endfor %}
</div>

<p class="muted small">"In progress" means exactly that — we publish the
stage we are at, not the badge we hope for. Statuses update here first.</p>

</section>

<section id="reports" class="trust-section" markdown="1">

## Audit reports

<table>
  <thead>
    <tr><th>Report</th><th>Access</th><th></th></tr>
  </thead>
  <tbody>
    {% for r in site.data.trust.reports %}
      <tr>
        <td><strong>{{ r.name }}</strong><br><span class="muted small">{{ r.note }}</span></td>
        <td>{% if r.access == "public" %}<span class="status-pill status-pill--ok">Public</span>{% else %}<span class="status-pill status-pill--muted">Under NDA</span>{% endif %}</td>
        <td class="is-actions">{% if r.access == "public" %}<a class="btn btn-ghost" href="mailto:trust@gefi.io?subject=Request%3A%20{{ r.name | uri_escape }}">Request copy</a>{% else %}<a class="btn btn-ghost" href="mailto:trust@gefi.io?subject=NDA%20request%3A%20{{ r.name | uri_escape }}">Request under NDA</a>{% endif %}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>

</section>

<section id="evidence" class="trust-section" markdown="1">

## Evidence packs

<div class="trust-evidence">
{% for p in site.data.trust.evidence_packs %}
<a class="trust-card" href="mailto:trust@gefi.io?subject=Evidence%20pack%3A%20{{ p.name | uri_escape }}">
<h2>{{ p.name }}</h2>
<p class="muted small">{{ p.note }}</p>
<span class="trust-card__cta">Request pack &rarr;</span>
</a>
{% endfor %}
</div>

</section>

<section id="subprocessors" class="trust-section" markdown="1">

## Subprocessors

Material changes are announced at least 30 days before they take effect.

<table>
  <thead>
    <tr><th>Subprocessor</th><th>Purpose</th></tr>
  </thead>
  <tbody>
    {% for sp in site.subprocessors %}
      <tr>
        <td><strong>{{ sp.name }}</strong></td>
        <td>{{ sp.purpose }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>

</section>

<section id="anchors" class="trust-section" markdown="1">

## Artifact anchor feed

Every published model version is hashed (sha-256) and the hash anchored to
Polygon. The feed below reads the live anchor endpoint; each row can be
independently re-verified against the chain.

<div class="trust-anchors" data-anchor-feed data-anchor-endpoint="{{ site.api.base_url }}/v1/trust/anchors">
  <p class="muted small" data-anchor-status>Loading the live anchor feed&hellip;</p>
  <table class="trust-anchors__table" data-anchor-table hidden>
    <thead>
      <tr><th>Model</th><th>Version</th><th>Artifact hash</th><th>Anchor tx</th><th>Anchored</th></tr>
    </thead>
    <tbody data-anchor-body></tbody>
  </table>
  <p class="muted small" data-anchor-fallback hidden>
    The live anchor feed is not reachable right now. Anchors are also
    published in each model's evidence pack, and every hash can be
    re-verified from the <a href="https://gefi.io/compliance/">compliance
    page's</a> verifier.
  </p>
</div>

<noscript>
  <p class="muted small">The live feed needs JavaScript. Anchors are also
  published in each model's evidence pack — request one above.</p>
</noscript>

</section>
