---
layout: app
title: "Risk Analysis"
heading: "Risk Analysis"
subtitle: "Portfolio risk analytics across market, liquidity, credit and operational exposure"
persona: reports
active_tab: Risk Analysis
permalink: /app/risk-reports/
sitemap: false
robots: noindex
secondary_action: { label: "Refresh", url: "/app/risk-reports/" }
primary_action: { label: "Export All", url: "/app/risk-reports/#export" }
app_scripts:
  - /assets/js/app/reports-math.js
  - /assets/js/app/compliance-risk.js
---

<div class="app-kpis" data-rr-kpis></div>

<div class="app-filterbar">
  <input type="search" placeholder="Search risk reports..." aria-label="Search risk reports" data-rr-search>
  <select aria-label="Risk type" data-rr-type><option value="">All Risk Types</option></select>
  <select aria-label="Severity" data-rr-severity>
    <option value="">All Severities</option>
    <option>Critical</option>
    <option>High</option>
    <option>Medium</option>
    <option>Low</option>
  </select>
</div>

<div class="app-gridcards app-gridcards--two" data-rr-grid></div>
<div data-rr-empty hidden></div>
<p class="app-kpi__sub" data-rr-toast role="status" aria-live="polite"></p>

<div class="app-modal" data-rr-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="rr-modal-title">
    <h2 id="rr-modal-title" class="app-panel__title" data-rr-modal-name></h2>
    <dl class="app-kv" data-rr-modal-body></dl>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-rr-modal-close>Close</button>
    </div>
  </div>
</div>
