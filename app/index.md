---
layout: app
title: "Investor Overview"
subtitle: "Your comprehensive investment dashboard with enhanced analytics"
persona: investor
active_tab: Overview
permalink: /app/
sitemap: false
robots: noindex
app_script: /assets/js/app/overview.js
---

{% include app-hero.html %}

<!-- KPI row -->
<div class="app-kpis" data-ov-kpis></div>

<!-- Charts -->
<div class="app-ov-charts">
  <section class="app-panel">
    <h2 class="app-panel__title">Portfolio Performance</h2>
    <div data-ov-perf><noscript>Chart requires JavaScript; the figures above summarise it.</noscript></div>
    <p class="app-kpi__sub" style="margin-top:8px;">Solid: portfolio · dashed: benchmark · sample data</p>
  </section>
  <section class="app-panel">
    <h2 class="app-panel__title">Asset Allocation</h2>
    <div class="app-ov-donutwrap">
      <div data-ov-donut></div>
      <ul class="app-ov-legend" data-ov-legend role="list"></ul>
    </div>
  </section>
</div>

<!-- Quick actions -->
<h2 class="app-panel__title" style="margin-top:24px;">Quick Actions</h2>
<div class="app-tiles">
  <a class="app-tile" href="/app/holdings/"><span class="app-tile__title">View Portfolio</span><span class="app-tile__desc">Holdings, transactions, watchlist</span></a>
  <a class="app-tile" href="/app/marketplace/"><span class="app-tile__title">Browse AI Models</span><span class="app-tile__desc">92 models across 28 families</span></a>
  <a class="app-tile" href="/app/analytics/"><span class="app-tile__title">Risk Assessment</span><span class="app-tile__desc">Sharpe, drawdown, VaR, concentration</span></a>
  <a class="app-tile" href="/app/reports/"><span class="app-tile__title">Generate Reports</span><span class="app-tile__desc">Performance, risk, regulatory</span></a>
</div>

<!-- Recent activity -->
<h2 class="app-panel__title" style="margin-top:24px;">Recent Activity</h2>
<section class="app-panel">
  <ul class="app-activity" data-ov-activity role="list"></ul>
</section>
