---
layout: page
title: Model catalogue
eyebrow: Marketplace
lead: Production-ready AI models for investing, risk, fraud, compliance, and trade finance. Filter, subscribe, and ship.
permalink: /models/
---

{%- assign featured = site.models | where: "featured", true | sort: "title" -%}
{%- assign rest = site.models | where_exp: "m", "m.featured != true" | sort: "title" -%}

{% if site.models.size > 0 %}
<div class="model-filter" data-model-filter aria-label="Filter models">
  <div class="model-filter__group" role="group" aria-label="Category">
    <span class="model-filter__label">Category</span>
    <button type="button" class="filter-chip is-active" data-filter="category" data-value="all">All</button>
    <button type="button" class="filter-chip" data-filter="category" data-value="investing">Investing</button>
    <button type="button" class="filter-chip" data-filter="category" data-value="risk">Risk</button>
    <button type="button" class="filter-chip" data-filter="category" data-value="fraud">Fraud</button>
    <button type="button" class="filter-chip" data-filter="category" data-value="trade finance">Trade Finance</button>
    <button type="button" class="filter-chip" data-filter="category" data-value="compliance">Compliance</button>
    <button type="button" class="filter-chip" data-filter="category" data-value="esg">ESG</button>
  </div>
  <div class="model-filter__group" role="group" aria-label="Risk level">
    <span class="model-filter__label">Risk</span>
    <button type="button" class="filter-chip is-active" data-filter="risk" data-value="all">All</button>
    <button type="button" class="filter-chip" data-filter="risk" data-value="low">Low</button>
    <button type="button" class="filter-chip" data-filter="risk" data-value="medium">Medium</button>
    <button type="button" class="filter-chip" data-filter="risk" data-value="high">High</button>
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

<div class="card-grid" data-model-grid>
  {% for m in featured %}
    {% include model-card.html model=m %}
  {% endfor %}
  {% for m in rest %}
    {% include model-card.html model=m %}
  {% endfor %}
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
