---
layout: app
title: "Regulator Overview"
heading: "Regulator Overview"
subtitle: "Comprehensive compliance monitoring and AI model governance"
persona: regulator
active_tab: Overview
permalink: /app/regulator/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/regulator-math.js
  - /assets/js/app/regulator.js
---

<div data-rg-root>

<div class="app-filterbar">
  <input type="search" placeholder="Search audits, models, or datasets..." aria-label="Search audits, models, or datasets" data-rg-search>
  <select aria-label="Category" data-rg-cat>
    <option value="">All Categories</option>
    <option>Model Audits</option>
    <option>Dataset Audits</option>
    <option>Issues</option>
    <option>Communications</option>
  </select>
  <select aria-label="Period" data-rg-period>
    <option>Last 30 days</option>
    <option>Last quarter</option>
    <option>Year to date</option>
  </select>
  <button type="button" class="app-btn app-btn--primary" style="margin-left:auto;" data-rg-export>Export Dashboard</button>
</div>
<p class="app-kpi__sub" data-rg-toast role="status" aria-live="polite"></p>

<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Regulator views">
    <button type="button" class="app-segment" data-segment="overview">Regulator Overview</button>
    <button type="button" class="app-segment" data-segment="analytics">Analytics</button>
    <button type="button" class="app-segment" data-segment="activity">Recent Activity</button>
    <button type="button" class="app-segment" data-segment="insights">Insights</button>
  </div>

  <div data-segment-panel="overview">
    <div class="app-kpis" data-rg-kpis></div>
    <div class="app-tiles" style="margin-top:16px;" data-rg-quick></div>
    <section class="app-panel" style="margin-top:18px;">
      <h2 class="app-panel__title">Upcoming Audits</h2>
      <div data-rg-upcoming></div>
    </section>
  </div>

  <div data-segment-panel="analytics" hidden>
    <div class="app-ov-charts">
      <section class="app-panel">
        <h2 class="app-panel__title">Compliance Rate Trend</h2>
        <div class="app-allocbars" data-rg-trend></div>
      </section>
      <section class="app-panel">
        <h2 class="app-panel__title">Audit Distribution by Type</h2>
        <div class="app-allocbars" data-rg-audittypes></div>
      </section>
      <section class="app-panel">
        <h2 class="app-panel__title">Issue Distribution</h2>
        <div class="app-allocbars" data-rg-issues></div>
      </section>
      <section class="app-panel">
        <h2 class="app-panel__title">Performance Metrics</h2>
        <dl class="app-kv" data-rg-perf></dl>
      </section>
    </div>
  </div>

  <div data-segment-panel="activity" hidden>
    <section class="app-panel">
      <h2 class="app-panel__title">Recent Activity</h2>
      <ul class="app-activity" data-rg-activity role="list"></ul>
    </section>
  </div>

  <div data-segment-panel="insights" hidden>
    <div data-rg-insights></div>
  </div>
</div>

<div class="app-modal" data-rg-audit hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="rg-audit-title">
    <h2 id="rg-audit-title" class="app-panel__title">Start a new audit</h2>
    <form class="app-form" data-rg-audit-form>
      <label>Entity (model, dataset or org)
        <input type="text" name="entity" required placeholder="e.g. #ML-3456 or Meridian Bank">
      </label>
      <label>Audit type
        <select name="type">
          <option>Model bias assessment</option>
          <option>Dataset lineage audit</option>
          <option>GDPR compliance audit</option>
          <option>Security review</option>
        </select>
      </label>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-rg-audit-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Schedule Audit</button>
      </div>
    </form>
  </div>
</div>

<div class="app-modal" data-rg-issue hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="rg-issue-title">
    <h2 id="rg-issue-title" class="app-panel__title">Report an issue</h2>
    <form class="app-form" data-rg-issue-form>
      <label>Severity
        <select name="severity">
          <option>low</option>
          <option selected>medium</option>
          <option>high</option>
          <option>critical</option>
        </select>
      </label>
      <label>Description
        <textarea name="desc" rows="3" required placeholder="What did you find, and where?"></textarea>
      </label>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-rg-issue-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">File Issue</button>
      </div>
    </form>
  </div>
</div>

<div class="app-modal" data-rg-comm hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="rg-comm-title">
    <h2 id="rg-comm-title" class="app-panel__title">Send a communication</h2>
    <form class="app-form" data-rg-comm-form>
      <label>Recipient organization
        <input type="text" name="recipient" required placeholder="e.g. Atlas Lending">
      </label>
      <label>Message
        <textarea name="message" rows="3" required placeholder="Reminder, request for evidence, finding notice..."></textarea>
      </label>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-rg-comm-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Send</button>
      </div>
    </form>
  </div>
</div>

</div>
