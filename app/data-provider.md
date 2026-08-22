---
layout: app
title: "Data Provider Overview"
heading: "Data Provider Overview"
subtitle: "Manage your datasets, monitor revenue, and collaborate with developers"
persona: data-provider
active_tab: Overview
permalink: /app/data-provider/
sitemap: false
robots: noindex
app_script: /assets/js/app/data-provider.js
---

<div class="app-kpis" data-dpv-kpis></div>

{% include app-provtabs.html active="Overview" %}

<section class="app-panel">
  <h2 class="app-panel__title">Recent Activity</h2>
  <ul class="app-activity" data-dpv-activity role="list"></ul>
  <div data-dpv-activity-empty hidden></div>
</section>
