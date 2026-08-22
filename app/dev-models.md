---
layout: app
title: "Developer Overview"
heading: "Developer Overview"
subtitle: "Build, test, and deploy AI financial models with comprehensive workflow management"
persona: developer
active_tab: Overview
permalink: /app/dev-models/
sitemap: false
robots: noindex
app_script: /assets/js/app/dev-console.js
---

<div class="app-kpis" data-dc-kpis></div>

{% include app-devtabs.html active="My Models" %}

<div class="app-rowcard__head" style="margin-bottom:12px;">
  <h2 class="app-panel__title" style="margin:0;" data-dm-count>My Models</h2>
  <select aria-label="Status filter" data-dm-filter style="margin-left:auto; font: inherit; font-size: 13px; color: var(--app-muted); background: var(--app-bg); border: 1px solid var(--app-border); border-radius: 8px; padding: 8px 10px;">
    <option value="">All Status</option>
    <option value="Deployed">Deployed</option>
    <option value="Testing">Testing</option>
    <option value="Approved">Approved</option>
    <option value="Draft">Draft</option>
  </select>
  <button type="button" class="app-btn app-btn--primary" data-dm-new>Create Model</button>
</div>

<div class="app-gridcards app-gridcards--two" data-dm-grid></div>
<div data-dm-empty hidden></div>

<div class="app-modal" data-dm-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="dm-modal-title">
    <h2 id="dm-modal-title" class="app-panel__title">Create model</h2>
    <form class="app-form" data-dm-form>
      <label>Name
        <input type="text" name="name" required maxlength="60" placeholder="e.g. Regime Change Detector">
      </label>
      <label>Category
        <select name="category">
          <option>Optimization</option><option>Risk</option><option>NLP</option><option>Macro</option><option>Fraud</option>
        </select>
      </label>
      <label>Template
        <select name="template">
          <option>Blank scaffold</option><option>Time-series classifier</option><option>Portfolio optimiser</option>
        </select>
      </label>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-dm-modal-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Create draft</button>
      </div>
    </form>
  </div>
</div>
