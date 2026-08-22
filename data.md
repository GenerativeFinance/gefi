---
layout: page
title: "Data-Feed Catalog"
eyebrow: "The layer under the models"
lead: "Every model on GeFi runs on governed feeds from the feature store — versioned definitions, jurisdiction enforcement, and per-lookup lineage. This is the catalogue of what's flowing."
permalink: /data/
wide: true
---

<div class="card-grid feed-grid" markdown="0">
{%- assign signup_base = site.app.signup_url | default: '/register/' -%}
{%- for f in site.data.feeds %}
<article class="model-card feed-card">
  <header class="feed-card__head">
    <h3>{{ f.name }}</h3>
    <span class="badge badge--readtime feed-card__fresh" title="Freshness">{{ f.freshness }}</span>
  </header>
  <p class="muted">{{ f.description }}</p>
  <ul class="badge-row badge-row--tight" aria-label="Jurisdictions">
    {%- for j in f.jurisdictions -%}
    <li class="badge badge--jurisdiction">{{ j }}</li>
    {%- endfor -%}
  </ul>
  <p class="feed-card__fieldshead">Sample fields</p>
  <div class="feed-card__fields">
    {%- for fld in f.fields -%}
    <code class="fedp-feature">{{ fld }}</code>
    {%- endfor -%}
  </div>
  <details class="feed-card__lineage">
    <summary>Lineage — used by {{ f.lineage | size }} model{% if f.lineage.size != 1 %}s{% endif %}</summary>
    <ul role="list">
      {%- for l in f.lineage -%}
      <li><a href="/models/{{ l.slug }}/">{{ l.model }}</a> <span class="muted small">— {{ l.use }}</span></li>
      {%- endfor -%}
    </ul>
    <p class="muted small">Per-lookup lineage is recorded in the audit log; a
    subscriber can trace any served value back to feed version and load time.</p>
  </details>
  <footer class="feed-card__cta">
    {%- if site.app.enabled -%}
    <a class="btn btn-primary" href="{{ signup_base }}?feed={{ f.slug }}">Subscribe</a>
    {%- else -%}
    <a class="btn btn-primary" href="/contact/?topic=early-access&amp;feed={{ f.slug }}">Subscribe</a>
    {%- endif -%}
    <a class="btn btn-ghost" href="/contact/?topic=sales&amp;feed={{ f.slug }}">Talk to sales</a>
  </footer>
</article>
{%- endfor %}
</div>

<aside class="lb-method" markdown="1">
Feed subscriptions are gated exactly like model subscriptions — the same
sign-up flow, the same KYC tiering, the same metering through the audit log.
Freshness figures describe the pipeline's target service level on this
preview catalogue.
</aside>
