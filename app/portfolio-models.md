---
layout: app
title: "Portfolio AI Models"
heading: "Portfolio AI Models"
subtitle: "The models managing this portfolio — performance, fees, and controls"
persona: portfolio
active_tab: AI Models
permalink: /app/portfolio-models/
sitemap: false
robots: noindex
primary_action: { label: "Browse Models", url: "/app/marketplace/" }
app_script: /assets/js/app/portfolio-models.js
---

<div class="app-kpis" data-pm-kpis></div>

<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Model views">
    <button type="button" class="app-segment" data-segment="active">Active Models</button>
    <button type="button" class="app-segment" data-segment="recommended">Recommended</button>
    <button type="button" class="app-segment" data-segment="settings">Settings</button>
  </div>

  <div data-segment-panel="active">
    <div class="app-rowcards" data-pm-active></div>
  </div>

  <div data-segment-panel="recommended" hidden>
    <div class="app-gridcards app-gridcards--two" data-pm-recommended></div>
    <p class="app-kpi__sub" style="margin-top:12px;">Subscribing in this preview moves the model into Active with sample figures — no billing occurs.</p>
  </div>

  <div data-segment-panel="settings" hidden>
    <section class="app-panel" style="max-width:560px;">
      <h2 class="app-panel__title">Model management settings</h2>
      <div class="app-settings" data-pm-settings>
        <label class="app-setting">
          <span>
            <strong>Auto-pause on drawdown</strong>
            <small>Pause any model whose 30-day P&amp;L breaches -5%</small>
          </span>
          <input type="checkbox" data-set="autopause" checked>
        </label>
        <label class="app-setting">
          <span>
            <strong>Rebalance suggestions</strong>
            <small>Let active models propose allocation changes for review</small>
          </span>
          <input type="checkbox" data-set="suggest" checked>
        </label>
        <label class="app-setting app-setting--range">
          <span>
            <strong>Monthly fee cap</strong>
            <small>Warn before a subscription pushes total fees past this</small>
          </span>
          <span class="app-setting__rangewrap">
            <input type="range" min="100" max="1000" step="50" value="500" data-set="feecap" aria-label="Monthly fee cap">
            <output class="mono" data-feecap-out>$500</output>
          </span>
        </label>
      </div>
      <p class="app-kpi__sub" data-pm-set-status role="status" aria-live="polite">Settings persist in this browser session.</p>
    </section>
  </div>
</div>
