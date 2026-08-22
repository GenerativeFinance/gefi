---
layout: app
title: "Portfolio Performance"
heading: "Portfolio Performance"
subtitle: "Track your investment returns and risk metrics"
persona: portfolio
active_tab: Performance
permalink: /app/performance/
sitemap: false
robots: noindex
primary_action: { label: "Export Report", url: "/app/reports/" }
secondary_action: { label: "Refresh", url: "/app/performance/" }
app_script: /assets/js/app/performance.js
---

<div class="app-kpis" data-pp-kpis></div>

<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Performance views">
    <button type="button" class="app-segment" data-segment="overview">Overview</button>
    <button type="button" class="app-segment" data-segment="returns">Returns</button>
    <button type="button" class="app-segment" data-segment="allocation">Allocation</button>
    <button type="button" class="app-segment" data-segment="risk">Risk Analysis</button>
  </div>

  <div data-segment-panel="overview">
    <div class="app-ov-charts">
      <section class="app-panel">
        <h2 class="app-panel__title">Portfolio Value Over Time</h2>
        <div data-pp-value></div>
      </section>
      <section class="app-panel">
        <h2 class="app-panel__title">Asset Allocation</h2>
        <div class="app-ov-donutwrap">
          <div data-pp-donut></div>
          <ul class="app-ov-legend" data-pp-donut-legend role="list"></ul>
        </div>
      </section>
    </div>
  </div>

  <div data-segment-panel="returns" hidden>
    <div class="app-ov-charts">
      <section class="app-panel">
        <h2 class="app-panel__title">Monthly Returns vs Benchmark</h2>
        <div data-pp-returns></div>
        <p class="app-kpi__sub" style="margin-top:8px;"><span class="app-ov-legend__dot" style="display:inline-block;background:var(--app-brand);"></span> Portfolio &nbsp; <span class="app-ov-legend__dot" style="display:inline-block;background:var(--app-green);"></span> Benchmark</p>
      </section>
      <section class="app-panel">
        <h2 class="app-panel__title">Top Performers</h2>
        <ul class="app-holdings" data-pp-top role="list"></ul>
      </section>
    </div>
  </div>

  <div data-segment-panel="allocation" hidden>
    <section class="app-panel">
      <h2 class="app-panel__title">Asset Allocation Details</h2>
      <div class="app-allocbars" data-pp-alloc></div>
    </section>
  </div>

  <div data-segment-panel="risk" hidden>
    <section class="app-panel">
      <h2 class="app-panel__title">Risk Metrics</h2>
      <div class="app-rowcards" data-pp-risk></div>
    </section>
  </div>
</div>
