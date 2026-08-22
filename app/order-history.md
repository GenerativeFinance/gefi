---
layout: app
title: "Order History"
heading: "Order History"
subtitle: "Every order this account has placed — sample ledger plus your session fills"
persona: trader
active_tab: Order History
permalink: /app/order-history/
sitemap: false
robots: noindex
app_script: /assets/js/app/order-history.js
---

<div class="app-kpis" data-oh-kpis></div>

<div class="app-filterbar">
  <input type="search" placeholder="Search by symbol, order ID, or strategy..." aria-label="Search orders" data-oh-search>
  <select aria-label="Status" data-oh-status>
    <option value="">All statuses</option>
    <option value="filled">Filled</option>
    <option value="pending">Pending</option>
    <option value="cancelled">Cancelled</option>
  </select>
  <select aria-label="Type" data-oh-type>
    <option value="">All types</option>
    <option value="market">Market</option>
    <option value="limit">Limit</option>
    <option value="stop">Stop</option>
  </select>
  <button type="button" class="app-btn app-btn--ghost" data-oh-export>Copy CSV</button>
</div>

<div class="app-segments" data-oh-pills role="group" aria-label="Quick status filter" style="max-width:520px;">
  <button type="button" class="app-segment app-segment--active" data-pill="">All Orders</button>
  <button type="button" class="app-segment" data-pill="filled">Filled</button>
  <button type="button" class="app-segment" data-pill="pending">Pending</button>
  <button type="button" class="app-segment" data-pill="cancelled">Cancelled</button>
</div>

<section class="app-panel">
  <div class="app-tablewrap">
    <table class="app-table">
      <thead>
        <tr><th>Order ID</th><th>Symbol</th><th>Side</th><th>Type</th><th>Qty</th><th>Price</th><th>Fill Price</th><th>Status</th><th>P&amp;L</th><th>Date</th></tr>
      </thead>
      <tbody data-oh-body></tbody>
    </table>
  </div>
  <div data-oh-empty hidden></div>
  <div class="app-oh-pager">
    <span class="app-kpi__sub" data-oh-count></span>
    <span class="app-oh-pager__btns">
      <button type="button" class="app-btn app-btn--ghost" data-oh-prev>&larr; Prev</button>
      <button type="button" class="app-btn app-btn--ghost" data-oh-next>Next &rarr;</button>
    </span>
  </div>
  <p class="app-kpi__sub" data-oh-status-line role="status" aria-live="polite"></p>
</section>
