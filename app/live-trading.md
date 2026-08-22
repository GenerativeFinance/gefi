---
layout: app
title: "Live Trading"
heading: "Live Trading"
subtitle: "Simulated execution against sample market data"
persona: trader
active_tab: Live Trading
permalink: /app/live-trading/
sitemap: false
robots: noindex
app_script: /assets/js/app/live-trading.js
---

<p class="app-lt-pills">
  <span class="app-chip app-chip--active"><span class="fedp-live" style="width:8px;height:8px;box-shadow:none;"></span> Live</span>
  <span class="app-chip app-chip--info">Secure</span>
  <span class="app-chip app-chip--outline">Demo environment</span>
</p>

<div class="app-tiles" style="margin-bottom:20px;">
  <div class="app-tile" style="cursor:default;"><span class="app-tile__title">Real-Time Data</span><span class="app-tile__desc">Seeded sample quotes tick every two seconds</span></div>
  <div class="app-tile" style="cursor:default;"><span class="app-tile__title">Fast Execution</span><span class="app-tile__desc">Market orders fill instantly against the sample book</span></div>
  <div class="app-tile" style="cursor:default;"><span class="app-tile__title">Risk Management</span><span class="app-tile__desc">Position and P&amp;L tracking on every fill</span></div>
</div>

<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Trading views">
    <button type="button" class="app-segment" data-segment="trade">Trade</button>
    <button type="button" class="app-segment" data-segment="orders">Orders</button>
    <button type="button" class="app-segment" data-segment="positions">Positions</button>
    <button type="button" class="app-segment" data-segment="history">History</button>
  </div>

  <div data-segment-panel="trade">
    <div class="app-ov-charts">
      <section class="app-panel">
        <h2 class="app-panel__title">Place Order</h2>
        <form class="app-form" data-lt-form>
          <label>Symbol
            <select name="symbol" data-lt-symbol>
              <option>AAPL</option><option>MSFT</option><option>NVDA</option><option>TSLA</option><option>BTC</option>
            </select>
          </label>
          <label>Side
            <select name="side"><option>Buy</option><option>Sell</option></select>
          </label>
          <label>Order Type
            <select name="type"><option>Market</option><option>Limit</option></select>
          </label>
          <label>Quantity
            <input type="number" name="qty" value="100" min="1" max="10000" required>
          </label>
          <label>Time in Force
            <select name="tif"><option>GTC</option><option>DAY</option><option>IOC</option></select>
          </label>
          <button type="submit" class="app-btn app-btn--primary" data-lt-submit>Buy AAPL</button>
          <p class="app-kpi__sub" data-lt-status role="status" aria-live="polite"></p>
        </form>
      </section>
      <section class="app-panel">
        <h2 class="app-panel__title"><span data-lt-price-symbol>AAPL</span> — Current Price</h2>
        <p class="app-kpi__value" style="font-size:32px;" data-lt-price></p>
        <p class="app-kpi__sub" data-lt-price-chg></p>
        <div data-lt-chart></div>
      </section>
    </div>
  </div>

  <div data-segment-panel="orders" hidden>
    <section class="app-panel">
      <div class="app-tablewrap">
        <table class="app-table">
          <thead><tr><th>Time</th><th>Symbol</th><th>Side</th><th>Type</th><th>Qty</th><th>Fill</th><th>Status</th></tr></thead>
          <tbody data-lt-orders></tbody>
        </table>
      </div>
      <div data-lt-orders-empty hidden></div>
    </section>
  </div>

  <div data-segment-panel="positions" hidden>
    <section class="app-panel">
      <div class="app-tablewrap">
        <table class="app-table">
          <thead><tr><th>Symbol</th><th>Qty</th><th>Avg Price</th><th>Last</th><th>Unrealised P&amp;L</th></tr></thead>
          <tbody data-lt-positions></tbody>
        </table>
      </div>
    </section>
  </div>

  <div data-segment-panel="history" hidden>
    <section class="app-panel">
      <p class="app-kpi__sub">Session fills, newest first. Full account history lives on <a href="/app/order-history/">Order History</a>.</p>
      <div class="app-tablewrap">
        <table class="app-table">
          <thead><tr><th>Time</th><th>Symbol</th><th>Side</th><th>Qty</th><th>Fill</th></tr></thead>
          <tbody data-lt-history></tbody>
        </table>
      </div>
      <div data-lt-history-empty hidden></div>
    </section>
  </div>
</div>

<aside class="app-lt-notice" role="note">
  <p><strong>Trading Safety Notice.</strong>
  <span class="is-risk">Risk warning:</span> simulated strategies do not predict live results.
  <strong>Demo environment:</strong> orders fill against seeded sample data — <em>real money is not at risk in this demonstration</em>.
  <strong>Educational purpose:</strong> this interface exists to learn the workflow, not to trade.</p>
</aside>
