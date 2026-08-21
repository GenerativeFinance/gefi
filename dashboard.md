---
layout: dashboard
title: Dashboard preview
permalink: /dashboard/
sitemap: false
---

<section class="dash-panel" data-dash-panel="overview">
  <h1 class="dash-panel__title">Overview</h1>
  <div class="kpi-grid" data-kpi-grid></div>
  <h2 class="dash-panel__subtitle">Alerts</h2>
  <ul class="dash-alerts" data-dash-alerts role="list"></ul>
</section>

<section class="dash-panel" data-dash-panel="analytics" hidden>
  <h1 class="dash-panel__title">Analytics</h1>
  <p class="dash-empty">Call volume, latency, and drift charts land with the Analytics redesign task. Nothing is hidden here — this tab has not been built yet.</p>
</section>

<section class="dash-panel" data-dash-panel="compliance" hidden>
  <h1 class="dash-panel__title">Compliance</h1>
  <p class="dash-empty">The case list with SLA urgency lands with the Compliance redesign task.</p>
</section>

<section class="dash-panel" data-dash-panel="federation" hidden>
  <h1 class="dash-panel__title">Federation</h1>
  <p class="dash-empty">Rounds and Shapley contribution views land with the Federation redesign task.</p>
</section>

<section class="dash-panel" data-dash-panel="api-keys" hidden>
  <div class="dash-panel__head">
    <h1 class="dash-panel__title">API keys</h1>
    <button type="button" class="btn btn-primary" data-key-create-open>Create key</button>
  </div>
  <table class="dash-table" data-keys-table>
    <thead>
      <tr><th>Name</th><th>Key</th><th>Scope</th><th>Created</th><th>Last used</th><th>7-day usage</th><th></th></tr>
    </thead>
    <tbody data-keys-body></tbody>
  </table>
  <p class="dash-empty" data-keys-empty hidden>No API keys yet. Create one to call the API.</p>

  <div class="dash-modal" data-key-modal hidden>
    <div class="dash-modal__card">
      <h2>Create API key</h2>
      <div data-key-modal-form>
        <label class="onb-field"><span>Name</span><input type="text" data-key-name placeholder="e.g. prod-inference" maxlength="40"></label>
        <label class="onb-field"><span>Scope</span>
          <select data-key-scope>
            <option value="inference">inference — run subscribed models</option>
            <option value="read">read — usage &amp; audit proofs only</option>
            <option value="admin">admin — keys, billing, webhooks</option>
          </select>
        </label>
        <div class="dash-modal__actions">
          <button type="button" class="btn btn-ghost" data-key-modal-cancel>Cancel</button>
          <button type="button" class="btn btn-primary" data-key-modal-create>Create</button>
        </div>
      </div>
      <div data-key-modal-reveal hidden>
        <p class="muted">Copy this key now — <strong>it is shown once</strong> and stored only as a hash.</p>
        <div class="dash-keyreveal">
          <code data-key-full></code>
          <button type="button" class="btn btn-ghost" data-key-copy>Copy</button>
        </div>
        <p class="muted small" data-key-copied hidden>&#10003; Copied to clipboard</p>
        <div class="dash-modal__actions">
          <button type="button" class="btn btn-primary" data-key-modal-done>Done</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="dash-panel" data-dash-panel="alerts" hidden>
  <h1 class="dash-panel__title">Alerts &amp; notifications</h1>
  <h2 class="dash-panel__subtitle">Inbox</h2>
  <div data-alerts-inbox></div>
  <h2 class="dash-panel__subtitle">Per-model preferences</h2>
  <table class="dash-table" data-alert-prefs>
    <thead><tr><th>Model</th><th>Muted</th><th>Min severity</th></tr></thead>
    <tbody data-alert-prefs-body></tbody>
  </table>
  <h2 class="dash-panel__subtitle">Delivery</h2>
  <table class="dash-table dash-table--matrix" data-delivery-matrix>
    <thead><tr><th>Severity</th><th>Email</th><th>Signed webhook</th><th>Slack</th></tr></thead>
    <tbody data-delivery-body></tbody>
  </table>
  <p class="muted small">Delivery preferences are stored locally in this preview; in production they configure the notification service per tenant.</p>
</section>

<section class="dash-panel" data-dash-panel="tenants" hidden>
  <h1 class="dash-panel__title">Tenants</h1>
  <p class="dash-empty">The sortable tenant table lands with the admin-tabs task.</p>
</section>

<section class="dash-panel" data-dash-panel="approvals" hidden>
  <h1 class="dash-panel__title">Approvals</h1>
  <p class="dash-empty">The approval queue with risk-class rationale lands with the admin-tabs task.</p>
</section>

<section class="dash-panel" data-dash-panel="system" hidden>
  <h1 class="dash-panel__title">System</h1>
  <p class="dash-empty">The region status map lands with the admin-tabs task.</p>
</section>
