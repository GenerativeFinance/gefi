---
layout: page
title: Model catalogue
eyebrow: Marketplace
lead: Production-ready AI models for investing, risk, fraud, compliance, and trade finance. Filter, subscribe, and ship.
permalink: /models/
---

{%- assign grouped = site.models | group_by_exp: "m", "m.category | split: '/' | first | strip" | sort: "name" -%}

{% if site.models.size > 0 %}
<div class="model-filter" data-model-filter aria-label="Filter models">
  <div class="model-filter__group model-filter__group--families" role="group" aria-label="Category">
    <span class="model-filter__label">Category</span>
    <button type="button" class="filter-chip is-active" data-filter="category" data-value="all">All <span class="filter-chip__count" data-facet-count></span></button>
    {%- for g in grouped %}
    <button type="button" class="filter-chip" data-filter="category" data-value="{{ g.name | downcase }}">{{ g.name }} <span class="filter-chip__count" data-facet-count></span></button>
    {%- endfor %}
  </div>
  <div class="model-filter__group" role="group" aria-label="Risk level">
    <span class="model-filter__label">Risk</span>
    <button type="button" class="filter-chip is-active" data-filter="risk" data-value="all">All <span class="filter-chip__count" data-facet-count></span></button>
    <button type="button" class="filter-chip" data-filter="risk" data-value="low">Low <span class="filter-chip__count" data-facet-count></span></button>
    <button type="button" class="filter-chip" data-filter="risk" data-value="medium">Medium <span class="filter-chip__count" data-facet-count></span></button>
    <button type="button" class="filter-chip" data-filter="risk" data-value="high">High <span class="filter-chip__count" data-facet-count></span></button>
  </div>
  <div class="model-filter__group">
    <label class="model-filter__toggle">
      <input type="checkbox" data-filter="federated" />
      <span>Federated only</span>
    </label>
  </div>
  <div class="model-filter__group model-filter__group--search">
    <label class="sr-only" for="model-search">Search models</label>
    <input
      type="search"
      id="model-search"
      class="model-filter__search"
      data-filter="search"
      placeholder="Search models…"
      autocomplete="off"
      spellcheck="false"
    />
  </div>
  <p class="model-filter__count" data-filter-count aria-live="polite"></p>
</div>

<div data-model-grid>
  {%- for g in grouped %}
  <section class="model-group" data-model-group>
    <h2 class="model-group__label">
      {{ g.name }}
      <span class="model-group__count muted" data-group-count>({{ g.items | size }})</span>
    </h2>
    <div class="card-grid">
      {%- assign items = g.items | sort: "title" -%}
      {%- for m in items %}
        {% include model-card.html model=m %}
      {%- endfor %}
    </div>
  </section>
  {%- endfor %}
</div>

<p class="muted small model-filter__empty" data-filter-empty hidden>
  No models match those filters yet. Try widening them, or
  <a href="/contact/?topic=model-request">request a new model</a>.
</p>
{% else %}
  <p class="muted">The full catalogue is coming online with the marketplace launch. In the meantime, peek at the <a href="/research/">research notes</a> for what we're building.</p>
{% endif %}

---

## Don't see what you need?

Models are added monthly. If you have a use case that isn't covered, two options:

1. **Request a model.** [Tell us what you need](/contact/?topic=model-request) — if there's demand we'll commission it.
2. **Build and list yours.** GeFi pays developers a 70% revenue share on subscriptions and a per-call rate on metered inference. [Apply to the developer programme](/contact/?topic=developer).

<script src="{{ '/assets/js/models-filter.js' | relative_url }}" defer></script>
