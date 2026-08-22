---
layout: app
title: "AI Model Categories"
heading: "AI Model Categories"
subtitle: "Explore the catalogue by family — counts, entry prices, and real subcategories"
persona: marketplace
active_tab: Categories
permalink: /app/categories/
sitemap: false
robots: noindex
app_script: /assets/js/app/categories.js
---

{%- assign grouped = site.models | group_by_exp: "m", "m.category | split: '/' | first | strip" | sort: "name" -%}
{%- assign total_models = 0 -%}
{%- assign top_name = "" -%}
{%- assign top_count = 0 -%}
{%- for g in grouped -%}
  {%- assign total_models = total_models | plus: g.items.size -%}
  {%- if g.items.size > top_count -%}
    {%- assign top_count = g.items.size -%}
    {%- assign top_name = g.name -%}
  {%- endif -%}
{%- endfor -%}

<div class="app-kpis">
  <div class="app-kpi"><p class="app-kpi__label">Total Categories</p><p class="app-kpi__value">{{ grouped.size }}</p><p class="app-kpi__sub">model families</p></div>
  <div class="app-kpi"><p class="app-kpi__label">Total Models</p><p class="app-kpi__value">{{ total_models }}</p><p class="app-kpi__sub">across all families</p></div>
  <div class="app-kpi"><p class="app-kpi__label">Top Category</p><p class="app-kpi__value" style="font-size:18px;">{{ top_name }}</p><p class="app-kpi__sub">{{ top_count }} models</p></div>
  <div class="app-kpi"><p class="app-kpi__label">Federated Models</p><p class="app-kpi__value">{{ site.models | where: "federated", true | size }}</p><p class="app-kpi__sub">privacy-preserving training</p></div>
</div>

<div class="app-filterbar">
  <input type="search" placeholder="Search categories..." aria-label="Search categories" data-cat-search>
  <select aria-label="Sort" data-cat-sort>
    <option value="name">Sort: Name</option>
    <option value="models">Sort: Models</option>
    <option value="price">Sort: Entry price</option>
  </select>
  <button type="button" class="app-btn app-btn--ghost" data-cat-view aria-pressed="false">List view</button>
</div>

<div class="app-gridcards" data-cat-grid>
{%- for g in grouped %}
  {%- assign min_price = 99999 -%}
  {%- assign subcats = "" | split: "," -%}
  {%- for m in g.items -%}
    {%- if m.price and m.price < min_price -%}{%- assign min_price = m.price -%}{%- endif -%}
    {%- assign sub = m.category | strip -%}
    {%- unless subcats contains sub -%}{%- assign subcats = subcats | push: sub -%}{%- endunless -%}
  {%- endfor %}
  <article class="app-gridcard app-catcard" data-cat-name="{{ g.name | downcase }}" data-cat-models="{{ g.items.size }}" data-cat-price="{{ min_price }}">
    <div class="app-gridcard__chips">
      <p class="app-gridcard__title" style="margin:0;">{{ g.name }}</p>
      {%- if g.items.size >= 8 %}<span class="app-chip app-chip--deployed">Featured</span>{% endif %}
    </div>
    <div class="app-gridcard__stats" style="grid-template-columns: 1fr 1fr;">
      <div class="app-gridcard__stat"><span class="app-gridcard__statlabel">Models</span><span class="app-gridcard__statval" style="color:var(--app-brand-2); font-size:18px;">{{ g.items.size }}</span></div>
      <div class="app-gridcard__stat"><span class="app-gridcard__statlabel">Starting from</span><span class="app-gridcard__statval">${{ min_price }}/month</span></div>
    </div>
    <p class="app-gridcard__statlabel" style="margin:0;">Subcategories</p>
    <div class="app-gridcard__tags">
      {%- for s in subcats limit: 4 %}<span class="app-chip app-chip--outline">{{ s }}</span>{% endfor -%}
      {%- if subcats.size > 4 %}<span class="app-chip app-chip--neutral">+{{ subcats.size | minus: 4 }} more</span>{% endif -%}
    </div>
    <div class="app-gridcard__footer">
      <a class="app-btn app-btn--primary" href="{{ '/models/' | relative_url }}?family={{ g.name | downcase | uri_escape }}">Browse Models</a>
    </div>
  </article>
{%- endfor %}
</div>
<div data-cat-empty hidden></div>
