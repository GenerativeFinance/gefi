---
layout: app
title: "Data Provider Overview"
heading: "Data Provider Overview"
subtitle: "Manage your datasets, monitor revenue, and collaborate with developers"
persona: data-provider
active_tab: Overview
permalink: /app/datasets/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/dataplatform-math.js
  - /assets/js/app/data-provider.js
---

{% include app-provtabs.html active="Datasets" %}

<div class="app-rowcard__head" style="margin-bottom:12px;">
  <h2 class="app-panel__title" style="margin:0;">Dataset Management</h2>
  <button type="button" class="app-btn app-btn--primary" style="margin-left:auto;" data-ds-upload>+ Upload Dataset</button>
</div>

<div data-ds-root>

<div class="app-rowcards" data-ds-list></div>
<p class="app-kpi__sub" data-ds-status role="status" aria-live="polite"></p>

<div class="app-modal" data-ds-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="ds-modal-title">
    <h2 id="ds-modal-title" class="app-panel__title">Upload dataset</h2>
    <form class="app-form" data-ds-form>
      <label>Name
        <input type="text" name="name" required maxlength="60" placeholder="e.g. Options Skew Surface">
      </label>
      <label>Category
        <select name="category">
          <option>Market Data</option><option>Alternative</option><option>Credit</option><option>ESG</option><option>Macro</option><option>On-Chain</option>
        </select>
      </label>
      <label>License
        <select name="license">
          <option>Federated only — raw rows never leave</option>
          <option>Aggregate query access</option>
          <option>Full subscription</option>
        </select>
      </label>
      <label>Monthly price (USD)
        <input type="number" name="price" value="500" min="0" step="50">
      </label>
      <p class="app-kpi__sub" data-ds-error role="alert" style="color:var(--app-red);"></p>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-ds-modal-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Upload</button>
      </div>
    </form>
  </div>
</div>

<div class="app-modal" data-ds-archive hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="ds-archive-title">
    <h2 id="ds-archive-title" class="app-panel__title">Archive dataset</h2>
    <p class="app-kpi__sub">Archiving stops new subscriptions. Type the dataset name to confirm:</p>
    <p class="mono" data-ds-archive-name style="margin:0 0 8px;"></p>
    <form class="app-form" data-ds-archive-form>
      <input type="text" name="confirm" autocomplete="off" aria-label="Type the dataset name to confirm">
      <p class="app-kpi__sub" data-ds-archive-err role="alert" style="color:var(--app-red);"></p>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-ds-archive-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Archive</button>
      </div>
    </form>
  </div>
</div>

</div>
