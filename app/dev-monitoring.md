---
layout: app
title: "Developer Overview"
heading: "Developer Overview"
subtitle: "Build, test, and deploy AI financial models with comprehensive workflow management"
persona: developer
active_tab: Overview
permalink: /app/dev-monitoring/
sitemap: false
robots: noindex
app_script: /assets/js/app/dev-ops.js
---

{% include app-devtabs.html active="Monitoring" %}

<div class="app-kpis" data-mo-kpis></div>

<section class="app-panel">
  <h2 class="app-panel__title">Real-Time Model Monitoring</h2>
  <p class="app-kpi__sub">Live performance metrics and alerts for deployed models — sample telemetry, distinct per model</p>
  <div data-mo-blocks style="margin-top:12px;"></div>
</section>

<div class="app-modal" data-mo-logs hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="mo-logs-title">
    <h2 id="mo-logs-title" class="app-panel__title" data-mo-logs-name>Logs</h2>
    <pre class="app-modal__pre mono" data-mo-logs-body></pre>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-mo-logs-close>Close</button>
    </div>
  </div>
</div>
