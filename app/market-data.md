---
layout: app
title: "Market Data"
heading: "Market Data"
subtitle: "Access comprehensive financial data for AI model development and backtesting"
persona: developer
active_tab: Market Data
permalink: /app/market-data/
sitemap: false
robots: noindex
app_script: /assets/js/app/market-data.js
---

<div class="app-kpis" data-md-kpis></div>

<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Market data views">
    <button type="button" class="app-segment" data-segment="sources">Data Sources</button>
    <button type="button" class="app-segment" data-segment="preview">Data Preview</button>
  </div>

  <div data-segment-panel="sources">
    <div class="app-gridcards app-gridcards--two" data-md-sources></div>
  </div>

  <div data-segment-panel="preview" hidden>
    <section class="app-panel">
      <div class="app-rowcard__head" style="margin-bottom:10px;">
        <h2 class="app-panel__title" style="margin:0;" data-md-preview-title>Preview</h2>
        <span class="app-chip app-chip--active" data-md-streaming hidden><span class="fedp-live" style="width:8px;height:8px;box-shadow:none;"></span> Streaming</span>
        <button type="button" class="app-btn app-btn--primary" style="margin-left:auto;" data-md-stream>Start Stream</button>
        <button type="button" class="app-btn app-btn--ghost" data-md-export>Export Data</button>
      </div>
      <div class="app-tablewrap">
        <table class="app-table">
          <thead><tr><th>Time</th><th>Symbol</th><th>Price</th><th>Volume</th></tr></thead>
          <tbody data-md-rows></tbody>
        </table>
      </div>
      <p class="app-kpi__sub" data-md-status role="status" aria-live="polite">Select a source card, then preview its sample rows here.</p>
    </section>
  </div>
</div>
