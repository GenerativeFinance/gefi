---
layout: app
title: "Developer Overview"
heading: "Developer Overview"
subtitle: "Build, test, and deploy AI financial models with comprehensive workflow management"
persona: developer
active_tab: Overview
permalink: /app/dev-training/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/devops-math.js
  - /assets/js/app/dev-ops.js
---

{% include app-devtabs.html active="Training" %}

<div data-tj-root>

<section class="app-panel">
  <div class="app-rowcard__head" style="margin-bottom:4px;">
    <h2 class="app-panel__title" style="margin:0;">Training Jobs</h2>
    <button type="button" class="app-btn app-btn--primary" style="margin-left:auto;" data-tj-new>New Training Job</button>
  </div>
  <p class="app-kpi__sub">Monitor and manage your model training processes</p>
  <div class="app-rowcards" data-tj-list style="margin-top:12px;"></div>
</section>

<div class="app-modal" data-tj-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="tj-modal-title">
    <h2 id="tj-modal-title" class="app-panel__title">New training job</h2>
    <p class="app-kpi__sub">Hyperparameters are validated before the job queues.</p>
    <form class="app-form" data-tj-form novalidate>
      <label>Model
        <select name="model" data-tj-models></select>
      </label>
      <label>Learning rate
        <input type="number" name="lr" value="0.001" step="0.0001" data-tj-bound="lr">
      </label>
      <label>Batch size
        <input type="number" name="batch" value="32" step="1" data-tj-bound="batch">
      </label>
      <label>Epochs
        <input type="number" name="epochs" value="100" step="1" data-tj-bound="epochs">
      </label>
      <label>Optimization method
        <select name="method" data-tj-methods required>
          <option value="">Select method…</option>
        </select>
      </label>
      <p class="app-kpi__sub" data-tj-error role="alert" style="color:var(--app-red);"></p>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-tj-modal-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Queue job</button>
      </div>
    </form>
  </div>
</div>

</div>
