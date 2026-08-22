---
layout: app
title: "Portfolio Rebalancing"
heading: "Portfolio Rebalancing & Actions"
subtitle: "Optimize your portfolio allocation and manage rebalancing strategies"
persona: portfolio
active_tab: Rebalancing
permalink: /app/rebalance/
sitemap: false
robots: noindex
app_script: /assets/js/app/rebalance.js
---

<div class="app-kpis" data-rb-kpis></div>

<div class="app-ov-charts">
  <section class="app-panel">
    <h2 class="app-panel__title">Target Allocation</h2>
    <p class="app-kpi__sub">Set your desired portfolio allocation across asset classes.</p>
    <div class="app-rb-sliders" data-rb-sliders></div>
    <p class="app-rb-total" data-rb-total></p>
  </section>

  <section class="app-panel">
    <h2 class="app-panel__title">Rebalancing Settings</h2>
    <div class="app-settings">
      <label class="app-setting app-setting--range">
        <span>
          <strong>Rebalance threshold</strong>
          <small>Trigger rebalancing when any asset class drifts by this much</small>
        </span>
        <span class="app-setting__rangewrap">
          <input type="range" min="1" max="15" step="1" value="5" data-rb-threshold aria-label="Rebalance threshold">
          <output class="mono" data-rb-threshold-out>5%</output>
        </span>
      </label>
      <label class="app-setting">
        <span>
          <strong>Auto-rebalancing</strong>
          <small>Execute proposed trades without manual confirmation</small>
        </span>
        <input type="checkbox" data-rb-auto>
      </label>
      <div class="app-setting" style="cursor: default;">
        <span>
          <strong>Rebalancing frequency</strong>
          <small>How often drift is evaluated</small>
        </span>
        <span class="app-segments" style="margin:0; padding:3px;" data-rb-freq role="group" aria-label="Rebalancing frequency">
          <button type="button" class="app-segment" data-freq="Monthly">Monthly</button>
          <button type="button" class="app-segment app-segment--active" data-freq="Quarterly">Quarterly</button>
          <button type="button" class="app-segment" data-freq="Annually">Annually</button>
        </span>
      </div>
      <label class="app-setting">
        <span>
          <strong>Minimize trading costs</strong>
          <small>Prefer fewer, larger trades when drift allows</small>
        </span>
        <input type="checkbox" data-rb-costs checked>
      </label>
      <label class="app-setting">
        <span>
          <strong>Tax-loss harvesting</strong>
          <small>Realise losses first where a matching lot exists</small>
        </span>
        <input type="checkbox" data-rb-tax checked>
      </label>
    </div>
  </section>
</div>

<section class="app-panel" style="margin-top:16px;">
  <div class="app-rowcard__head" style="margin-bottom:12px;">
    <h2 class="app-panel__title" style="margin:0;">Required Rebalancing Actions</h2>
    <button type="button" class="app-btn app-btn--primary" style="margin-left:auto;" data-rb-execute>Execute Rebalance</button>
  </div>
  <p class="app-kpi__sub">Specific trades needed to achieve the target allocation. Sample portfolio — nothing executes for real.</p>
  <ul class="app-holdings" data-rb-actions role="list"></ul>
  <p class="app-rb-total" data-rb-txtotal></p>
  <p class="app-kpi__sub" data-rb-status role="status" aria-live="polite"></p>
</section>

<div class="app-modal" data-rb-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="rb-modal-title">
    <h2 id="rb-modal-title" class="app-panel__title">Confirm rebalance — sample</h2>
    <p class="app-kpi__sub">These trades bring the portfolio to target. This is the preview environment: no orders are placed.</p>
    <pre class="app-modal__pre mono" data-rb-modal-body></pre>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-rb-modal-cancel>Cancel</button>
      <button type="button" class="app-btn app-btn--primary" data-rb-modal-confirm>Confirm</button>
    </div>
  </div>
</div>
