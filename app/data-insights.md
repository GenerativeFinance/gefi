---
layout: app
title: "Data Provider Overview"
heading: "Data Provider Overview"
subtitle: "Manage your datasets, monitor revenue, and collaborate with developers"
persona: data-provider
active_tab: Overview
permalink: /app/data-insights/
sitemap: false
robots: noindex
app_scripts: [/assets/js/app/dataplatform-math.js, /assets/js/app/data-provider.js, /assets/js/app/data-revenue.js]
---

{% include app-provtabs.html active="Market Insights" %}

<div class="app-rowcard__head" style="margin-bottom:12px;">
  <h2 class="app-panel__title" style="margin:0;">Market Insights &amp; Trends</h2>
  <button type="button" class="app-btn app-btn--primary" style="margin-left:auto;" data-di-report>Generate Report</button>
</div>

<div class="app-ov-charts">
  <section class="app-panel">
    <h2 class="app-panel__title">Market Performance</h2>
    <div class="app-meterrow" style="margin-bottom:12px;">
      <span class="app-rowcard__collabel" style="min-width:170px;">Dataset Adoption Rate</span>
      <div class="app-meter"><div class="app-meter__fill" style="width:62%"></div></div>
      <span class="app-meterrow__val is-up" data-di-adoption></span>
    </div>
    <div class="app-meterrow" style="margin-bottom:16px;">
      <span class="app-rowcard__collabel" style="min-width:170px;">Market Impact Score</span>
      <div class="app-meter"><div class="app-meter__fill" style="width:87%"></div></div>
      <span class="app-meterrow__val" data-di-impact></span>
    </div>
    <div class="app-gridcard__stats" style="grid-template-columns:1fr 1fr;">
      <div class="app-gridcard__stat"><span class="app-gridcard__statlabel">Market Impact Value</span><span class="app-gridcard__statval" style="color:var(--app-green); font-size:18px;" data-di-value></span></div>
      <div class="app-gridcard__stat"><span class="app-gridcard__statlabel">Models Using Data</span><span class="app-gridcard__statval" style="color:var(--app-blue); font-size:18px;" data-di-models></span></div>
    </div>
  </section>
  <section class="app-panel">
    <h2 class="app-panel__title">Trend Analysis</h2>
    <ul class="app-holdings" data-di-trends role="list"></ul>
  </section>
</div>

<div class="app-modal" data-di-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="di-modal-title">
    <h2 id="di-modal-title" class="app-panel__title">Market insights report — sample</h2>
    <pre class="app-modal__pre mono" data-di-modal-body></pre>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-di-modal-close>Close</button>
    </div>
  </div>
</div>
