---
layout: app
title: "AI Financial Bounty Funding"
heading: "AI Financial Bounty Funding"
subtitle: "Support and fund the development of AI financial models and tools"
persona: funding
active_tab: Bounty Funding
permalink: /app/bounty-funding/
sitemap: false
robots: noindex
primary_action: { label: "+ Request Funding", url: "/app/bounty-funding/#request" }
app_script: /assets/js/app/bounty-funding.js
---

<div class="app-kpis" data-bf-kpis></div>

<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Bounty funding views">
    <button type="button" class="app-segment" data-segment="browse">Browse Requests</button>
    <button type="button" class="app-segment" data-segment="requests">My Requests</button>
    <button type="button" class="app-segment" data-segment="funding">My Funding</button>
  </div>

  <div data-segment-panel="browse">
    <div class="app-filterbar">
      <select aria-label="Category" data-bf-category><option value="">All Categories</option></select>
      <select aria-label="Sort" data-bf-sort>
        <option value="newest">Newest</option>
        <option value="ending">Ending Soon</option>
        <option value="funded">Most Funded</option>
      </select>
    </div>
    <div data-bf-list></div>
    <div data-bf-empty hidden></div>
  </div>

  <div data-segment-panel="requests" hidden>
    <h2 class="app-panel__title">My Requests</h2>
    <div data-bf-requests></div>
    <div data-bf-requests-empty hidden></div>
  </div>

  <div data-segment-panel="funding" hidden>
    <h2 class="app-panel__title">My Funding</h2>
    <div data-bf-contribs></div>
    <div data-bf-contribs-empty hidden></div>
  </div>
</div>

<div class="app-modal" data-bf-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="bf-modal-title">
    <h2 id="bf-modal-title" class="app-panel__title">Fund <span data-bf-modal-name></span></h2>
    <form class="app-form" data-bf-form>
      <label>Amount (USD)
        <input type="number" name="amount" inputmode="numeric" min="0" step="1" required>
      </label>
      <p class="app-kpi__sub" data-bf-modal-min></p>
      <p class="app-kpi__sub is-down" data-bf-modal-err role="alert"></p>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-bf-modal-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Confirm Funding</button>
      </div>
    </form>
  </div>
</div>

<div class="app-modal" data-bf-detail hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="bf-detail-title">
    <h2 id="bf-detail-title" class="app-panel__title" data-bf-detail-name></h2>
    <dl class="app-kv" data-bf-detail-body></dl>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-bf-detail-close>Close</button>
    </div>
  </div>
</div>

<div class="app-modal" data-bf-request hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="bf-request-title">
    <h2 id="bf-request-title" class="app-panel__title">Request bounty funding</h2>
    <form class="app-form" data-bf-request-form>
      <label>Bounty title
        <input type="text" name="title" required maxlength="90" placeholder="e.g. Liquidity Shock Early-Warning Model">
      </label>
      <label>Category
        <select name="category">
          <option>Derivatives</option>
          <option>ESG</option>
          <option>DeFi</option>
          <option selected>NLP</option>
          <option>Risk</option>
        </select>
      </label>
      <label>Estimated reward (USD)
        <input type="number" name="reward" inputmode="numeric" min="250" step="250" value="1500" required>
      </label>
      <label>Difficulty
        <select name="difficulty">
          <option>INTERMEDIATE</option>
          <option selected>ADVANCED</option>
          <option>EXPERT</option>
        </select>
      </label>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-bf-request-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Submit Request</button>
      </div>
    </form>
  </div>
</div>
