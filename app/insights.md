---
layout: app
title: "Investor Overview"
heading: "Investor Overview"
subtitle: "Your comprehensive investment dashboard with enhanced analytics"
persona: investor
active_tab: Portfolio
permalink: /app/insights/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/insights-math.js
  - /assets/js/app/insights.js
---

<div data-in-root>

{% include app-hero.html %}
{% include app-subtabs.html active="Insights" %}

<h2 class="app-panel__title">AI-Driven Market Insights</h2>
<div class="app-rowcards" data-in-list></div>
<p class="app-kpi__sub" style="margin-top:12px;">AI-generated sample analysis — not investment advice. Alerts persist in this browser session.</p>

</div>
