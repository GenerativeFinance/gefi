---
layout: app
title: "Data Provider Overview"
heading: "Data Provider Overview"
subtitle: "Manage your datasets, monitor revenue, and collaborate with developers"
persona: data-provider
active_tab: Overview
permalink: /app/data-revenue/
sitemap: false
robots: noindex
app_scripts: [/assets/js/app/data-provider.js, /assets/js/app/data-revenue.js]
---

{% include app-provtabs.html active="Revenue" %}

<div class="app-kpis" data-dr-kpis></div>

<div class="app-ov-charts">
  <section class="app-panel">
    <h2 class="app-panel__title">Revenue by Dataset</h2>
    <div class="app-allocbars" data-dr-bars></div>
  </section>
  <section class="app-panel">
    <h2 class="app-panel__title">Monthly revenue</h2>
    <div data-dr-chart></div>
    <div class="app-panel" style="background:var(--app-surface-2); margin-top:12px;">
      <p class="app-kpi__sub" style="margin:0;"><strong style="color:var(--app-text);">Next payout.</strong> <span data-dr-payout></span> settles Sep 1, 2026 via the audit-log metered statement.</p>
    </div>
  </section>
</div>
