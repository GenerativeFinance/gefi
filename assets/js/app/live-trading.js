/* Live trading simulator (task 210): seeded ticking price, instant mock
 * fills, positions from fills. Everything sample, nothing real. */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var KEY = "gefi-app-orders-live";
    var BASE = { AAPL: 232.4, MSFT: 512.8, NVDA: 187.3, TSLA: 341.6, BTC: 118400 };
    var START_POS = [{ symbol: "AAPL", qty: 50, avg: 226.1 }];

    function loadOrders() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return [];
    }
    function saveOrders(list) {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(list));
      } catch (e) {}
    }
    var orders = loadOrders();

    /* seeded deterministic walk per symbol; tick index advances live */
    var tickIndex = 0;
    var rngs = {};
    var prices = {};
    Object.keys(BASE).forEach(function (s) {
      rngs[s] = GeFi.seed.rng(GeFi.seed.hash("lt|" + s));
      prices[s] = { last: BASE[s], series: [BASE[s]] };
    });
    function tick() {
      Object.keys(BASE).forEach(function (s) {
        var p = prices[s];
        p.last = Math.max(1, p.last * (1 + (rngs[s]() - 0.5) * 0.004));
        p.series.push(p.last);
        if (p.series.length > 40) p.series.shift();
      });
      tickIndex += 1;
      renderPrice();
      renderPositions();
    }

    var form = document.querySelector("[data-lt-form]");
    var symbolSel = document.querySelector("[data-lt-symbol]");
    var submitBtn = document.querySelector("[data-lt-submit]");
    var status = document.querySelector("[data-lt-status]");

    function currentSymbol() {
      return symbolSel.value;
    }
    function relabel() {
      submitBtn.textContent = form.elements.side.value + " " + currentSymbol();
      submitBtn.className = "app-btn " + (form.elements.side.value === "Sell" ? "app-btn--ghost is-sell" : "app-btn--primary");
      document.querySelector("[data-lt-price-symbol]").textContent = currentSymbol();
      renderPrice();
    }
    symbolSel.addEventListener("change", relabel);
    form.elements.side.addEventListener("change", relabel);

    var chartEl = document.querySelector("[data-lt-chart]");
    function renderPrice() {
      var p = prices[currentSymbol()];
      document.querySelector("[data-lt-price]").textContent =
        "$" + p.last.toFixed(2);
      var first = p.series[0];
      var chg = ((p.last - first) / first) * 100;
      var el = document.querySelector("[data-lt-price-chg]");
      el.textContent = fmt.signedPct(chg, 2) + " this session · sample feed";
      el.className = "app-kpi__sub " + (chg >= 0 ? "is-up" : "is-down");
      chartEl.innerHTML = "";
      if (p.series.length > 2) {
        chartEl.appendChild(GeFi.svg.line(
          [{ name: currentSymbol(), values: p.series.slice() }],
          { label: currentSymbol() + " session price, sample feed" }
        ));
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var qty = parseInt(form.elements.qty.value, 10);
      if (!qty || qty < 1) {
        status.textContent = "Enter a quantity of at least 1.";
        return;
      }
      var order = {
        time: "tick " + tickIndex,
        symbol: currentSymbol(),
        side: form.elements.side.value,
        type: form.elements.type.value,
        qty: qty,
        fill: null,
        status: "pending"
      };
      orders.unshift(order);
      saveOrders(orders);
      renderOrders();
      status.textContent = "Order accepted — filling against the sample book…";
      setTimeout(function () {
        order.fill = +prices[order.symbol].last.toFixed(2);
        order.status = "filled";
        saveOrders(orders);
        renderOrders();
        renderPositions();
        renderHistory();
        status.textContent = order.side + " " + order.qty + " " + order.symbol + " filled at $" + order.fill.toFixed(2) + " (simulated).";
      }, 400);
    });

    function renderOrders() {
      var body = document.querySelector("[data-lt-orders]");
      var empty = document.querySelector("[data-lt-orders-empty]");
      body.innerHTML = "";
      empty.innerHTML = "";
      empty.hidden = orders.length > 0;
      if (!orders.length) {
        empty.appendChild(app.empty({ head: "No orders this session", hint: "Place one from the Trade tab." }));
        return;
      }
      orders.forEach(function (o) {
        var tr = document.createElement("tr");
        function td(content, cls) {
          var el = document.createElement("td");
          if (cls) el.className = cls;
          if (content instanceof Node) {
            el.appendChild(content);
          } else {
            el.textContent = content;
          }
          tr.appendChild(el);
        }
        td(o.time, "is-mono");
        td(o.symbol, "is-mono");
        td(app.chip(o.side === "Buy" ? "buy" : "sell", o.side.toUpperCase()));
        td(o.type);
        td(String(o.qty), "is-mono");
        td(o.fill == null ? "—" : "$" + o.fill.toFixed(2), "is-mono");
        td(app.chip(o.status === "filled" ? "ok" : "pending", o.status));
        body.appendChild(tr);
      });
    }

    function positions() {
      var pos = {};
      START_POS.forEach(function (p) {
        pos[p.symbol] = { qty: p.qty, cost: p.qty * p.avg };
      });
      orders.slice().reverse().forEach(function (o) {
        if (o.status !== "filled") return;
        var p = (pos[o.symbol] = pos[o.symbol] || { qty: 0, cost: 0 });
        if (o.side === "Buy") {
          p.qty += o.qty;
          p.cost += o.qty * o.fill;
        } else {
          var avg = p.qty > 0 ? p.cost / p.qty : o.fill;
          p.qty -= o.qty;
          p.cost -= o.qty * avg;
        }
      });
      return Object.keys(pos).filter(function (s) { return pos[s].qty !== 0; }).map(function (s) {
        var p = pos[s];
        var avg = p.cost / p.qty;
        var last = prices[s] ? prices[s].last : avg;
        return { symbol: s, qty: p.qty, avg: avg, last: last, upl: (last - avg) * p.qty };
      });
    }

    function renderPositions() {
      var body = document.querySelector("[data-lt-positions]");
      if (!body) return;
      body.innerHTML = "";
      positions().forEach(function (p) {
        var tr = document.createElement("tr");
        function td(text, cls) {
          var el = document.createElement("td");
          el.className = cls || "";
          el.textContent = text;
          tr.appendChild(el);
        }
        td(p.symbol, "is-mono");
        td(String(p.qty), "is-mono");
        td("$" + p.avg.toFixed(2), "is-mono");
        td("$" + p.last.toFixed(2), "is-mono");
        var upl = document.createElement("td");
        upl.className = "is-mono";
        upl.style.color = p.upl >= 0 ? "var(--app-green)" : "var(--app-red)";
        upl.textContent = (p.upl >= 0 ? "+" : "-") + "$" + Math.abs(p.upl).toFixed(2);
        tr.appendChild(upl);
        body.appendChild(tr);
      });
    }

    function renderHistory() {
      var body = document.querySelector("[data-lt-history]");
      var empty = document.querySelector("[data-lt-history-empty]");
      body.innerHTML = "";
      empty.innerHTML = "";
      var fills = orders.filter(function (o) { return o.status === "filled"; });
      empty.hidden = fills.length > 0;
      if (!fills.length) {
        empty.appendChild(app.empty({ head: "No fills yet", hint: "Filled orders land here." }));
        return;
      }
      fills.forEach(function (o) {
        var tr = document.createElement("tr");
        [o.time, o.symbol, o.side, String(o.qty), "$" + o.fill.toFixed(2)].forEach(function (c) {
          var td = document.createElement("td");
          td.className = "is-mono";
          td.textContent = c;
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
    }

    relabel();
    renderOrders();
    renderPositions();
    renderHistory();
    /* tick only while the tab is visible; 2s cadence */
    var timer = setInterval(function () {
      if (!document.hidden) tick();
    }, 2000);
    window.addEventListener("beforeunload", function () {
      clearInterval(timer);
    });
    tick();
  });
})(window, document);
