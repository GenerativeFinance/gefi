---
layout: page
title: Research
eyebrow: Notes from the platform team
lead: Working notes on federated learning for finance, model evaluation, audit infrastructure, and the regulatory landscape.
permalink: /research/
---

{% if site.research.size > 0 %}
{%- assign research = site.research | sort: "date" | reverse -%}
{%- assign all_tags = "" | split: "" -%}
{%- for r in research -%}
  {%- if r.topic -%}{%- assign all_tags = all_tags | push: r.topic -%}{%- endif -%}
  {%- if r.tags -%}
    {%- for t in r.tags -%}
      {%- assign all_tags = all_tags | push: t -%}
    {%- endfor -%}
  {%- endif -%}
{%- endfor -%}
{%- assign unique_tags = all_tags | uniq | sort -%}

<div class="tag-filter" data-tag-filter>
  {%- if unique_tags.size > 0 -%}
  <div class="tag-filter__chips" role="group" aria-label="Filter research by topic">
    <button type="button" class="filter-chip is-active" data-tag="all">All</button>
    {%- for t in unique_tags -%}
      <button type="button" class="filter-chip" data-tag="{{ t | downcase }}">{{ t }}</button>
    {%- endfor -%}
  </div>
  <p class="tag-filter__count muted small" data-tag-count aria-live="polite"></p>
  {%- endif -%}

  <div class="card-grid card-grid--posts" data-tag-grid>
    {% for r in research %}
      {% include research-card.html research=r %}
    {% endfor %}
  </div>
  <p class="muted small tag-filter__empty" data-tag-empty hidden>No research notes match that topic yet.</p>
</div>

<script src="{{ '/assets/js/tag-filter.js' | relative_url }}" defer></script>
{% else %}
  <p class="muted">First research notes go live alongside the marketplace launch.</p>
{% endif %}

---

## Want to contribute?

We publish replicable, citation-clean research and pay an honorarium for
accepted external pieces. [Pitch a topic &rarr;](/contact/?topic=research)
