---
layout: page
title: "Model Leaderboard"
eyebrow: "Marketplace"
lead: "Per-category rankings of GeFi models. A Verified figure is backed by an audit-log inclusion proof you can check yourself; a self-attested figure is the developer's own claim, styled so you can tell the difference at a glance."
permalink: /leaderboard/
wide: true
---

<div class="tag-filter" aria-label="Filter leaderboard by category">
  <div class="tag-filter__chips" data-lb-chips>
    <button type="button" class="filter-chip is-active" data-lb-chip="all">All categories</button>
    {%- for cat in site.data.leaderboard.categories %}
    <button type="button" class="filter-chip" data-lb-chip="{{ cat.name | slugify }}">{{ cat.name }} <span class="filter-chip__count">{{ cat.models | size }}</span></button>
    {%- endfor %}
  </div>
</div>

{%- for cat in site.data.leaderboard.categories %}
<section class="lb-section" data-lb-section="{{ cat.name | slugify }}" markdown="0">
<h2 class="lb-section__title">{{ cat.name }}</h2>
<div class="lb-scroll">
<table class="lb-table">
  <thead>
    <tr><th>#</th><th>Model</th><th>Key metric</th><th>Improvement</th><th>Attestation</th><th>As of</th></tr>
  </thead>
  <tbody>
    {%- for m in cat.models %}
    <tr>
      <td class="lb-rank">{{ forloop.index }}</td>
      <td class="lb-model"><a href="/models/{{ m.slug }}/">{{ m.name }}</a></td>
      <td class="lb-metric"><span class="lb-metric__value">{{ m.value }}</span> <span class="lb-metric__label">{{ m.metric }} · {{ m.direction }}</span></td>
      <td class="lb-score {% if m.score >= 0 %}is-up{% else %}is-down{% endif %}">{% if m.score >= 0 %}+{% endif %}{{ m.score }}%</td>
      <td>
        {%- if m.verified %}
        <a class="lb-badge lb-badge--verified" href="/compliance/?run_id={{ m.proof }}" title="Check this figure's audit-log inclusion proof">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>
          Verified
        </a>
        {%- else %}
        <span class="lb-badge lb-badge--self">Self-attested</span>
        {%- endif %}
      </td>
      <td class="lb-asof">{{ m.as_of }}</td>
    </tr>
    {%- endfor %}
  </tbody>
</table>
</div>
</section>
{%- endfor %}

<aside class="lb-method" markdown="1">
## Methodology

Models within a category report **different key metrics**, so ranking by raw
figure would compare incomparable numbers. The Improvement column is the
signed relative change in each model's *own* key metric over the trailing
sample window, direction-adjusted (for metrics where lower is better, a fall
counts as improvement) — that score is what orders each table.

**Verified** means the figure is anchored in the append-only audit log and
the badge links to an inclusion-proof check on the trust page.
**Self-attested** means the developer reported the figure and no proof has
been anchored yet; it is styled differently on purpose. Figures on this
preview are sample data; the pipeline that stamps real proofs is described
on the [trust page](/compliance/). Last generated {{ site.data.leaderboard.generated }}.
</aside>

<script src="{{ '/assets/js/leaderboard.js' | relative_url }}" defer></script>
