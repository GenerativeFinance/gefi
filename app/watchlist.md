---
layout: app
title: "Investor Overview"
heading: "Investor Overview"
subtitle: "Your comprehensive investment dashboard with enhanced analytics"
persona: investor
active_tab: Portfolio
permalink: /app/watchlist/
sitemap: false
robots: noindex
app_script: /assets/js/app/portfolio.js
---

{% include app-hero.html %}
{% include app-subtabs.html active="Watchlist" %}

<section class="app-panel">
  <h2 class="app-panel__title">Watchlist <span class="app-kpi__sub">starred entries persist in this browser session</span></h2>
  <ul class="app-holdings" data-pf-watchlist role="list"></ul>
</section>
