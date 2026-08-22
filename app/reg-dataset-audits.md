---
layout: app
title: "Dataset Audits"
heading: "Dataset Audits"
subtitle: "Lineage, licensing and data-quality audits across supervised datasets"
persona: regulator
active_tab: Dataset Audits
permalink: /app/reg-dataset-audits/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/regulator-math.js
  - /assets/js/app/reg-pages.js
---

<div data-rg-root>

<div data-ra-root data-ra-kind="dataset">
  <div class="app-filterbar">
    <input type="search" placeholder="Search audits, datasets, or organizations..." aria-label="Search dataset audits" data-ra-search>
    <select aria-label="Status" data-ra-status>
      <option value="">All Status</option>
      <option>Scheduled</option>
      <option>In Progress</option>
      <option>Completed</option>
    </select>
    <select aria-label="Severity" data-ra-severity>
      <option value="">All Severities</option>
      <option>high</option>
      <option>medium</option>
      <option>low</option>
    </select>
  </div>

  <div class="app-tablewrap">
    <table class="app-table">
      <thead><tr><th>Audit ID</th><th>Dataset</th><th>Organization</th><th>Coverage</th><th>PII flags</th><th>License</th><th>Severity</th><th>Status</th><th>Due</th><th></th></tr></thead>
      <tbody data-ra-rows></tbody>
    </table>
  </div>
  <div data-ra-empty hidden></div>

  <div class="app-modal" data-ra-modal hidden>
    <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="ra-modal-title">
      <h2 id="ra-modal-title" class="app-panel__title" data-ra-modal-name></h2>
      <dl class="app-kv" data-ra-modal-body></dl>
      <p class="app-rowcard__collabel" style="margin:14px 0 6px;">Findings timeline</p>
      <div data-ra-modal-findings></div>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-ra-modal-close>Close</button>
      </div>
    </div>
  </div>
</div>

</div>
