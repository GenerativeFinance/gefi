---
layout: app
title: "Compliance Reports"
heading: "Compliance Reports"
subtitle: "Monitor regulatory compliance across all financial operations and requirements"
persona: reports
active_tab: Compliance
permalink: /app/compliance-reports/
sitemap: false
robots: noindex
secondary_action: { label: "Refresh", url: "/app/compliance-reports/" }
primary_action: { label: "Export All", url: "/app/compliance-reports/#export" }
app_script: /assets/js/app/compliance-risk.js
---

<div class="app-kpis" data-cr-kpis></div>

<div class="app-filterbar">
  <input type="search" placeholder="Search compliance reports..." aria-label="Search compliance reports" data-cr-search>
  <select aria-label="Type" data-cr-type><option value="">All Types</option></select>
  <select aria-label="Status" data-cr-status>
    <option value="">All Status</option>
    <option>Compliant</option>
    <option>Warning</option>
    <option>Violation</option>
  </select>
  <select aria-label="Due window" data-cr-due>
    <option value="">Any due date</option>
    <option value="7">Due in 7 days</option>
    <option value="30">Due in 30 days</option>
  </select>
</div>

<div class="app-gridcards app-gridcards--two" data-cr-grid></div>
<div data-cr-empty hidden></div>
<p class="app-kpi__sub" data-cr-toast role="status" aria-live="polite"></p>

<div class="app-modal" data-cr-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="cr-modal-title">
    <h2 id="cr-modal-title" class="app-panel__title" data-cr-modal-name></h2>
    <dl class="app-kv" data-cr-modal-body></dl>
    <div data-cr-modal-findings></div>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-cr-modal-close>Close</button>
    </div>
  </div>
</div>
