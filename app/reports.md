---
layout: app
title: "Reports & Insights"
heading: "Reports & Insights"
subtitle: "AI-powered financial insights and comprehensive reports"
persona: reports
active_tab: Reports
permalink: /app/reports/
sitemap: false
robots: noindex
secondary_action: { label: "View All Reports", url: "/app/reports/#categories" }
primary_action: { label: "Generate Report", url: "/app/reports/#generate" }
app_scripts:
  - /assets/js/app/reports-math.js
  - /assets/js/app/reports.js
---

<div data-rp-root>

<div class="app-ov-charts">
  <section class="app-panel">
    <h2 class="app-panel__title">AI-Generated Market Insights</h2>
    <p class="app-rowcard__collabel" style="margin:0 0 6px;">Real-Time Market Sentiment</p>
    <div class="app-meterrow" style="margin-bottom:16px;">
      <div class="app-meter"><div class="app-meter__fill" data-rp-sentiment-fill></div></div>
      <span class="app-meterrow__val" data-rp-sentiment></span>
    </div>
    <p class="app-rowcard__collabel" style="margin:0 0 6px;">Macroeconomic Trends</p>
    <div class="app-gridcard__stats" style="grid-template-columns:1fr 1fr; margin-bottom:14px;">
      <div class="app-gridcard__stat"><span class="app-gridcard__statlabel">USD Index</span><span class="app-gridcard__statval" data-rp-usd></span></div>
      <div class="app-gridcard__stat"><span class="app-gridcard__statlabel">GDP Growth</span><span class="app-gridcard__statval" data-rp-gdp></span></div>
    </div>
    <div class="app-lt-notice" data-rp-fed></div>
  </section>

  <section class="app-panel">
    <h2 class="app-panel__title">Investor Reports</h2>
    <div data-rp-investor></div>
    <button type="button" class="app-btn app-btn--primary app-btn--block" data-rp-generate>+ Generate New Report</button>
  </section>
</div>

<h2 class="app-panel__title" id="categories" style="margin-top:22px;">Report Library</h2>
<div class="app-gridcards app-gridcards--two" data-rp-cats></div>
<p class="app-kpi__sub" data-rp-status role="status" aria-live="polite"></p>

<h2 class="app-panel__title" style="margin-top:22px;">Quick Actions</h2>
<div class="app-tiles" data-rp-quick></div>

<div class="app-modal" data-rp-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="rp-modal-title">
    <h2 id="rp-modal-title" class="app-panel__title">Generate a report</h2>
    <form class="app-form" data-rp-form>
      <label>Category
        <select name="category" data-rp-modal-cats></select>
      </label>
      <label>Period
        <select name="period">
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Year to date</option>
        </select>
      </label>
      <p class="app-kpi__sub">The report is queued as Pending and flips to Generated when the sample pipeline finishes.</p>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-rp-modal-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Queue Report</button>
      </div>
    </form>
  </div>
</div>

<div class="app-modal" data-rp-view hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="rp-view-title">
    <h2 id="rp-view-title" class="app-panel__title" data-rp-view-name></h2>
    <pre class="app-modal__pre mono" data-rp-view-body></pre>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-rp-view-close>Close</button>
    </div>
  </div>
</div>

</div>
