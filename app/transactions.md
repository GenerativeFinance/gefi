---
layout: app
title: "Investor Overview"
heading: "Investor Overview"
subtitle: "Your comprehensive investment dashboard with enhanced analytics"
persona: investor
active_tab: Portfolio
permalink: /app/transactions/
sitemap: false
robots: noindex
app_script: /assets/js/app/portfolio.js
---

{% include app-hero.html %}
{% include app-subtabs.html active="Transactions" %}

<div class="app-filterbar">
  <input type="search" placeholder="Search by asset or type..." aria-label="Search transactions" data-pf-tx-search>
  <select aria-label="Type" data-pf-tx-type>
    <option value="">All types</option>
    <option value="buy">Buy</option>
    <option value="sell">Sell</option>
    <option value="dividend">Dividend</option>
    <option value="deposit">Deposit</option>
  </select>
</div>

<section class="app-panel">
  <div class="app-tablewrap">
    <table class="app-table">
      <thead>
        <tr><th>Date</th><th>Type</th><th>Asset</th><th>Quantity</th><th>Price</th><th>Value</th><th>Status</th></tr>
      </thead>
      <tbody data-pf-tx></tbody>
    </table>
  </div>
  <div data-pf-tx-empty hidden></div>
</section>
