---
layout: app
title: "Custom Reports"
heading: "Custom Reports"
subtitle: "Build, schedule and share reports with your preferred metrics and visualizations"
persona: reports
active_tab: Custom Reports
permalink: /app/custom-reports/
sitemap: false
robots: noindex
primary_action: { label: "Export All", url: "/app/custom-reports/#export" }
app_scripts:
  - /assets/js/app/reports-math.js
  - /assets/js/app/custom-reports.js
---

<div data-crb-root>

<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Custom report views">
    <button type="button" class="app-segment" data-segment="builder">Report Builder</button>
    <button type="button" class="app-segment" data-segment="my">My Reports</button>
    <button type="button" class="app-segment" data-segment="templates">Templates</button>
  </div>

  <div data-segment-panel="builder">
    <section class="app-panel" style="max-width:720px;">
      <h2 class="app-panel__title">Create Custom Report</h2>
      <p class="app-kpi__sub" style="margin-top:-6px;">Build a custom report with your preferred metrics and visualizations.</p>
      <form class="app-form" data-crb-form novalidate>
        <label>Report Name *
          <input type="text" name="name" maxlength="90" placeholder="e.g., Monthly Portfolio Review" aria-describedby="crb-err-name">
          <span class="app-kpi__sub is-down" id="crb-err-name" data-crb-err="name" role="alert"></span>
        </label>
        <label>Report Type *
          <select name="type" aria-describedby="crb-err-type">
            <option value="">Select a type…</option>
            <option>Performance</option>
            <option>Risk</option>
            <option>Compliance</option>
            <option>Client</option>
            <option>Custom</option>
          </select>
          <span class="app-kpi__sub is-down" id="crb-err-type" data-crb-err="type" role="alert"></span>
        </label>
        <label>Description
          <textarea name="desc" rows="3" placeholder="Describe what this report covers..."></textarea>
        </label>
        <label>Date Range *
          <select name="range" aria-describedby="crb-err-range">
            <option value="">Select a range…</option>
            <option>Last 30 days</option>
            <option>Last quarter</option>
            <option>Year to date</option>
            <option>Custom range</option>
          </select>
          <span class="app-kpi__sub is-down" id="crb-err-range" data-crb-err="range" role="alert"></span>
        </label>
        <label>Schedule (Optional)
          <select name="schedule">
            <option value="">Run manually</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </label>
        <fieldset class="app-crb-viz" aria-describedby="crb-err-viz">
          <legend class="app-rowcard__collabel">Visualization Types *</legend>
          <div class="app-mk-prefcats" style="max-height:none;" data-crb-viz></div>
          <span class="app-kpi__sub is-down" id="crb-err-viz" data-crb-err="viz" role="alert"></span>
        </fieldset>
        <label class="app-mk-prefcat" style="font-weight:400;">
          <input type="checkbox" name="public"> Make this report public (visible to team members)
        </label>
        <div class="app-modal__actions" style="justify-content:flex-start;">
          <button type="submit" class="app-btn app-btn--primary" data-crb-submit>Create Report</button>
          <button type="button" class="app-btn app-btn--ghost" data-crb-reset>Reset</button>
        </div>
        <p class="app-kpi__sub" data-crb-status role="status" aria-live="polite"></p>
      </form>
    </section>
  </div>

  <div data-segment-panel="my" hidden>
    <h2 class="app-panel__title">My Reports</h2>
    <div data-crb-list></div>
    <div data-crb-list-empty hidden></div>
    <p class="app-kpi__sub" data-crb-list-status role="status" aria-live="polite"></p>
  </div>

  <div data-segment-panel="templates" hidden>
    <h2 class="app-panel__title">Templates</h2>
    <div class="app-gridcards" data-crb-templates></div>
  </div>
</div>

<div class="app-modal" data-crb-delete hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="crb-delete-title">
    <h2 id="crb-delete-title" class="app-panel__title">Delete report?</h2>
    <p class="app-kpi__sub">Type <strong data-crb-delete-name style="color:var(--app-text);"></strong> to confirm. This can't be undone.</p>
    <form class="app-form" data-crb-delete-form>
      <label>Report name
        <input type="text" name="confirm" autocomplete="off">
      </label>
      <p class="app-kpi__sub is-down" data-crb-delete-err role="alert"></p>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-crb-delete-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Delete Report</button>
      </div>
    </form>
  </div>
</div>

</div>
