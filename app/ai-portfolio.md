---
layout: app
title: "AI Portfolio"
heading: "AI Portfolio"
subtitle: "Portfolio overview and AI-powered management"
persona: portfolio
active_tab: Portfolio
permalink: /app/ai-portfolio/
sitemap: false
robots: noindex
app_script: /assets/js/app/ai-portfolio.js
---

<div class="app-aip">
  <div class="app-aip__left">
    <section class="app-panel">
      <h2 class="app-panel__title">Portfolio Overview</h2>
      <dl class="app-kv" data-aip-overview></dl>
      <p class="app-kpi__sub is-up" style="margin-top:10px;" data-aip-market></p>
    </section>
    <section class="app-panel">
      <h2 class="app-panel__title">Risk Distribution</h2>
      <div class="app-allocbars" data-aip-risk></div>
      <p style="margin-top:12px;"><span class="app-chip app-chip--medium">Risk Level: Moderate</span></p>
    </section>
  </div>

  <section class="app-panel app-aip__right">
    <h2 class="app-panel__title">AI Models</h2>
    <ul class="app-holdings" data-aip-strategies role="list"></ul>
    <div class="app-aip__actions">
      <a class="app-btn app-btn--primary" href="/app/rebalance/">Rebalance with AI</a>
      <button type="button" class="app-btn app-btn--ghost" data-aip-manual>Manual Override</button>
      <button type="button" class="app-btn app-btn--ghost" data-aip-report>Download Report</button>
    </div>
    <p class="app-kpi__sub" data-aip-status role="status" aria-live="polite"></p>
    <div class="app-aip__confidence">
      <div data-aip-gauge></div>
      <p class="app-aip__conflabel">AI Confidence Score</p>
      <p class="app-aip__confval mono" data-aip-conf></p>
    </div>
  </section>
</div>

<div class="app-modal" data-aip-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="aip-modal-title">
    <h2 id="aip-modal-title" class="app-panel__title">Portfolio report — sample</h2>
    <pre class="app-modal__pre mono" data-aip-report-body></pre>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-aip-modal-close>Close</button>
    </div>
  </div>
</div>
