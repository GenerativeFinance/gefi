---
layout: app
title: "Backtesting Environment"
heading: "Backtesting Environment"
subtitle: "Test model strategies against historical sample data before anything goes near capital"
persona: developer
active_tab: Backtesting
permalink: /app/backtesting/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/backtest-math.js
  - /assets/js/app/backtesting.js
---

<div data-bt-root>

<div class="app-kpis" data-bt-kpis></div>

<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Backtesting views">
    <button type="button" class="app-segment" data-segment="configure">Configure</button>
    <button type="button" class="app-segment" data-segment="monitor">Live Monitor</button>
    <button type="button" class="app-segment" data-segment="optimizer">Optimizer</button>
    <button type="button" class="app-segment" data-segment="results">Results</button>
    <button type="button" class="app-segment" data-segment="analysis">Analysis</button>
    <button type="button" class="app-segment" data-segment="comparison">Comparison</button>
  </div>

  <div data-segment-panel="configure">
    <div class="app-ov-charts">
      <section class="app-panel">
        <h2 class="app-panel__title">Backtest Configuration</h2>
        <h3 class="app-kpi__label" style="margin:12px 0 8px;">Available models</h3>
        <ul class="app-holdings" data-bt-models role="list"></ul>
        <h3 class="app-kpi__label" style="margin:16px 0 8px;">Quick presets</h3>
        <div class="app-lt-pills">
          <button type="button" class="app-btn app-btn--ghost" data-preset="1y">Last 1 Year</button>
          <button type="button" class="app-btn app-btn--ghost" data-preset="2y">Last 2 Years</button>
          <button type="button" class="app-btn app-btn--ghost" data-preset="custom">Custom Range</button>
        </div>
        <button type="button" class="app-btn app-btn--primary" style="margin-top:12px;" data-bt-new>Configure New Backtest</button>
      </section>
      <section class="app-panel">
        <h2 class="app-panel__title">Market Data Status</h2>
        <ul class="app-holdings" data-bt-data role="list"></ul>
        <div class="app-panel" style="background:var(--app-surface-2); margin-top:12px;">
          <p class="app-kpi__sub" style="margin:0;"><strong style="color:var(--app-text);">Data range.</strong> Historical data available from January 2020 to present.</p>
        </div>
      </section>
    </div>
  </div>

  <div data-segment-panel="monitor" hidden>
    <section class="app-panel">
      <h2 class="app-panel__title">Running backtests</h2>
      <div data-bt-running></div>
    </section>
  </div>

  <div data-segment-panel="optimizer" hidden>
    <section class="app-panel">
      <h2 class="app-panel__title">Parameter sweep</h2>
      <p class="app-kpi__sub" style="margin:0 0 12px;">Scores every combination against the same engine the backtests use. Deterministic — the same grid always picks the same winner.</p>
      <form class="app-form app-form--inline" data-bt-opt-form>
        <label>Model
          <select name="model" data-bt-opt-model></select>
        </label>
        <label>Range
          <select name="range" data-bt-opt-range></select>
        </label>
        <button type="submit" class="app-btn app-btn--primary">Run sweep</button>
      </form>
      <div data-bt-opt-result></div>
    </section>
  </div>

  <div data-segment-panel="results" hidden>
    <section class="app-panel">
      <div class="app-tablewrap">
        <table class="app-table">
          <thead><tr><th>Run</th><th>Model</th><th>Range</th><th>Sharpe</th><th>Annual</th><th>Max DD</th><th>Trades</th><th>Status</th></tr></thead>
          <tbody data-bt-results></tbody>
        </table>
      </div>
    </section>
  </div>

  <div data-segment-panel="analysis" hidden>
    <section class="app-panel">
      <h2 class="app-panel__title">Run analysis</h2>
      <form class="app-form app-form--inline" data-bt-analysis-form>
        <label>Run
          <select name="run" data-bt-analysis-run></select>
        </label>
      </form>
      <div data-bt-analysis-body></div>
    </section>
  </div>

  <div data-segment-panel="comparison" hidden>
    <section class="app-panel">
      <h2 class="app-panel__title">Compare runs</h2>
      <p class="app-kpi__sub" style="margin:0 0 12px;">Pick two or more completed runs. Curves are resampled onto a shared axis, so windows of different lengths line up honestly.</p>
      <div class="app-lt-pills" data-bt-compare-picks></div>
      <div data-bt-compare-body></div>
    </section>
  </div>
</div>

<div class="app-modal" data-bt-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="bt-modal-title">
    <h2 id="bt-modal-title" class="app-panel__title">New backtest</h2>
    <form class="app-form" data-bt-form>
      <label>Model
        <select name="model" data-bt-model-select></select>
      </label>
      <label>Range
        <select name="range" data-bt-range>
          <option value="1y">Last 1 Year</option>
          <option value="2y" selected>Last 2 Years</option>
          <option value="5y">Last 5 Years</option>
          <option value="custom">Custom Range</option>
        </select>
      </label>
      <div data-bt-custom hidden>
        <label>Start
          <input type="date" name="start" data-bt-min value="2021-01-01" />
        </label>
        <label>End
          <input type="date" name="end" data-bt-min value="2023-01-01" />
        </label>
        <p class="app-kpi__sub" data-bt-coverage style="margin:4px 0 0;"></p>
      </div>
      <p class="app-kpi__sub" data-bt-form-error hidden style="color:var(--app-down);margin:4px 0 0;"></p>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-bt-modal-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Start backtest</button>
      </div>
    </form>
  </div>
</div>

</div>
