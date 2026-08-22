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
  <div class="ana-grid">
    <div class="ana-card">
      <h2 class="dash-panel__subtitle">Inference calls (30d)</h2>
      <div data-ana-volume></div>
    </div>
    <div class="ana-card">
      <h2 class="dash-panel__subtitle">Latency — p99 solid, p50 dashed (ms)</h2>
      <div data-ana-latency></div>
    </div>
  </div>
  <div class="ana-card ana-card--wide">
    <h2 class="dash-panel__subtitle">Model drift — live IR vs backtest</h2>
    <p class="muted small">Fixed 0–1 axis; the shaded band is the acceptable range. A line leaving the band is a drift case, not a rescaled axis.</p>
    <div data-ana-drift></div>
    <ul class="ana-legend" data-ana-drift-legend role="list"></ul>
  </div>
</section>

<section class="dash-panel" data-dash-panel="compliance" hidden>
  <h1 class="dash-panel__title">Compliance</h1>
  <p class="muted small">Open cases sorted by SLA urgency. Countdowns are relative to the sample snapshot.</p>
  <table class="dash-table" data-comp-table>
    <thead>
      <tr><th>Case</th><th>Model</th><th>Jur.</th><th>Type</th><th>Opened</th><th>SLA</th></tr>
    </thead>
    <tbody data-comp-cases></tbody>
  </table>
</section>

<section class="dash-panel" data-dash-panel="federation" hidden>
  <div class="dash-panel__head">
    <h1 class="dash-panel__title">Federation</h1>
    <div class="fed-viewtoggle" role="group" aria-label="Federation view">
      <button type="button" class="filter-chip is-active" data-fed-view-btn="operator">Operator view</button>
      <button type="button" class="filter-chip" data-fed-view-btn="participant">Participant view</button>
    </div>
  </div>

  <div data-fed-operator>
  <h2 class="dash-panel__subtitle">Training rounds</h2>
  <table class="dash-table" data-fed-table>
    <thead>
      <tr><th>Round</th><th>When</th><th>Participants</th><th>&epsilon; spent</th><th>Status</th></tr>
    </thead>
    <tbody data-fed-rounds></tbody>
  </table>
  <h2 class="dash-panel__subtitle">Shapley contribution — last aggregated round</h2>
  <p class="muted small">Colors match the participant chips in the rounds table above; the bar is each lender's marginal contribution to model quality.</p>
  <div class="fed-bars" data-fed-shapley></div>
  </div>

  <div data-fed-participant hidden>
    <p class="muted small">Your institution's standing in the <strong>credit-oracle</strong> federation — Alpine Credit Union's seat, not the operator's.</p>
    <div class="fedp-grid">
      <div class="fedp-card" data-fedp-node></div>
      <div class="fedp-card" data-fedp-attest></div>
    </div>
    <h2 class="dash-panel__subtitle">Round participation &amp; earnings</h2>
    <table class="dash-table" data-fedp-table>
      <thead>
        <tr><th>Round</th><th>Date</th><th>Participated</th><th>Shapley share</th><th>Earnings</th><th>Payout</th></tr>
      </thead>
      <tbody data-fedp-earnings></tbody>
    </table>
    <h2 class="dash-panel__subtitle">Data lineage — features your node served</h2>
    <p class="muted small">Exactly which feature groups left your node as differentially-private gradients. Raw rows never leave; this is the complete list.</p>
    <div data-fedp-lineage></div>
  </div>
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

<section class="dash-panel dash-panel--sandbox" data-dash-panel="sandbox" hidden>
  <div class="dash-panel__head">
    <h1 class="dash-panel__title">Paper-trading sandbox</h1>
    <div class="sbx-actions">
      <button type="button" class="btn btn-ghost" data-sbx-export>Copy CSV</button>
      <button type="button" class="btn btn-ghost" data-sbx-reset>Reset sandbox</button>
    </div>
  </div>
  <div class="sbx-banner" role="note">
    <strong>SIMULATED.</strong> This sandbox replays model signals against
    sample market data. No orders are placed, no live results are shown, and
    every export is stamped simulated.
  </div>
  <h2 class="dash-panel__subtitle">Models in this run</h2>
  <div class="sbx-picker" data-sbx-picker></div>
  <p class="dash-empty" data-sbx-empty hidden>Pick at least one trading model to simulate.</p>
  <div class="sbx-chart" data-sbx-chart></div>
  <div class="sbx-stats" data-sbx-stats></div>
  <p class="muted small" data-sbx-status role="status" aria-live="polite"></p>
</section>

<section class="dash-panel" data-dash-panel="tenants" hidden>
  <div class="dash-panel__head">
    <h1 class="dash-panel__title">Tenants</h1>
    <div class="ten-filters">
      <select data-ten-plan aria-label="Filter by plan">
        <option value="">All plans</option>
        <option value="Enterprise">Enterprise</option>
        <option value="Pro">Pro</option>
        <option value="Starter">Starter</option>
      </select>
      <select data-ten-region aria-label="Filter by region">
        <option value="">All regions</option>
        <option value="EU">EU</option>
        <option value="US">US</option>
        <option value="MENA">MENA</option>
      </select>
    </div>
  </div>
  <table class="dash-table" data-ten-table>
    <thead>
      <tr>
        <th><button type="button" class="ten-sort" data-ten-sort="name">Tenant</button></th>
        <th><button type="button" class="ten-sort" data-ten-sort="plan">Plan</button></th>
        <th><button type="button" class="ten-sort" data-ten-sort="region">Region</button></th>
        <th><button type="button" class="ten-sort" data-ten-sort="models">Models</button></th>
        <th><button type="button" class="ten-sort" data-ten-sort="calls">Calls (30d)</button></th>
        <th><button type="button" class="ten-sort" data-ten-sort="mrr">MRR</button></th>
      </tr>
    </thead>
    <tbody data-ten-body></tbody>
  </table>
  <p class="dash-empty" data-ten-empty hidden>No tenants match this plan/region filter.</p>
</section>

<section class="dash-panel" data-dash-panel="approvals" hidden>
  <h1 class="dash-panel__title">Approvals</h1>
  <p class="muted small">Model versions queued for release. Open a row's rationale before the actions unlock — an approval you have not read is not an approval.</p>
  <div class="apr-list" data-apr-list></div>
</section>

<section class="dash-panel" data-dash-panel="system" hidden>
  <h1 class="dash-panel__title">System</h1>
  <p class="muted small">Serving regions with live status. A degraded region shows amber, an outage red.</p>
  <div data-sys-map></div>
  <ul class="sys-detail" data-sys-detail role="list"></ul>
</section>

<section class="dash-panel" data-dash-panel="dev-models" hidden>
  <div class="dash-panel__head">
    <h1 class="dash-panel__title">My models</h1>
    <span class="badge">70% revenue share</span>
  </div>
  <p class="muted small">Every model you publish moves through the same pipeline: draft &rarr; pending approval &rarr; live. Task&nbsp;#5 shipped the API surface behind this — publish, versions with R2 artifacts and sha-256 anchoring, admin approval, Stripe Connect payouts.</p>
  <table class="dash-table" data-dev-models-table>
    <thead>
      <tr><th>Model</th><th>Category</th><th>Status</th><th>Version</th><th>Submitted</th><th></th></tr>
    </thead>
    <tbody data-dev-models-body></tbody>
  </table>
</section>

<section class="dash-panel" data-dash-panel="dev-versions" hidden>
  <h1 class="dash-panel__title">Versions</h1>
  <div class="dash-versions__upload">
    <label class="onb-field"><span>Model</span>
      <select data-dev-version-model></select>
    </label>
    <label class="onb-field"><span>Version label</span>
      <input type="text" data-dev-version-label placeholder="e.g. 2026.09.1" maxlength="24">
    </label>
    <button type="button" class="btn btn-primary" data-dev-version-upload>Upload new version</button>
  </div>
  <p class="muted small">Uploading computes a sha-256 artifact hash immediately; the Polygon anchor transaction confirms a few seconds later in this preview.</p>
  <table class="dash-table" data-dev-versions-table>
    <thead>
      <tr><th>Model</th><th>Version</th><th>Artifact hash</th><th>Anchor</th><th>Status</th><th>Uploaded</th></tr>
    </thead>
    <tbody data-dev-versions-body></tbody>
  </table>
</section>

<section class="dash-panel" data-dash-panel="dev-earnings" hidden>
  <h1 class="dash-panel__title">Earnings</h1>
  <div class="kpi-grid" data-dev-earnings-kpis></div>

  <h2 class="dash-panel__subtitle">Payouts</h2>
  <div class="dash-stripe-card" data-dev-stripe-card>
    <div data-dev-stripe-disconnected>
      <p class="muted">Connect a Stripe Connect account to receive payouts on your 70% revenue share.</p>
      <button type="button" class="btn btn-primary" data-dev-stripe-connect>Connect payouts with Stripe</button>
    </div>
    <div data-dev-stripe-connected hidden>
      <p><span class="status-pill status-pill--ok">Connected</span> <span class="muted small" data-dev-stripe-account></span></p>
    </div>
  </div>
  <table class="dash-table" data-dev-payouts-table>
    <thead><tr><th>Period</th><th>Gross</th><th>Your share</th><th>Status</th></tr></thead>
    <tbody data-dev-payouts-body></tbody>
  </table>
</section>
