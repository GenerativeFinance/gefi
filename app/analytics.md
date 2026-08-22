---
layout: app
title: "Investor Overview"
heading: "Investor Overview"
subtitle: "Your comprehensive investment dashboard with enhanced analytics"
persona: investor
active_tab: Portfolio
permalink: /app/analytics/
sitemap: false
robots: noindex
app_script: /assets/js/app/insights.js
---

{% include app-hero.html %}
{% include app-subtabs.html active="Analytics" %}

<div class="app-ov-charts">
  <section class="app-panel">
    <h2 class="app-panel__title">Performance Analysis</h2>
    <dl class="app-kv" data-an-perf></dl>
  </section>
  <section class="app-panel">
    <h2 class="app-panel__title">Risk Metrics</h2>
    <dl class="app-kv" data-an-risk></dl>
  </section>
</div>
