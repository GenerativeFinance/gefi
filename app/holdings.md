---
layout: app
title: "Investor Overview"
heading: "Investor Overview"
subtitle: "Your comprehensive investment dashboard with enhanced analytics"
persona: investor
active_tab: Portfolio
permalink: /app/holdings/
sitemap: false
robots: noindex
app_script: /assets/js/app/portfolio.js
---

{% include app-hero.html %}
{% include app-subtabs.html active="Holdings" %}

<section class="app-panel">
  <h2 class="app-panel__title">Top Holdings</h2>
  <ul class="app-holdings" data-pf-holdings role="list"></ul>
</section>
