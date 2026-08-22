/* Order history: filterable, paginated ledger (task 211). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var PAGE = 10;
    var state = { q: "", status: "", type: "", page: 0 };

    /* session fills from the live-trading page join the ledger */
    var sessionOrders = [];
    try {
      sessionOrders = (JSON.parse(sessionStorage.getItem("gefi-app-orders-live") || "[]")).map(function (o, i) {
        return {
          id: "SES-" + (100 + i),
          serverId: o.id || null,
          strategy: "Manual (this session)",
          symbol: o.symbol,
          side: o.side.toUpperCase(),
          type: o.type.toLowerCase(),
          qty: o.qty,
          price: o.fill || 0,
          fill: o.fill,
          status: o.status,
          pnl: 0,
          date: "2026-08-22"
        };
      });
    } catch (e) {}
    /* A fill placed while the API was answering is already in the ledger
     * the server just sent us. Keep the server's record and drop the local
     * echo, or the same trade is listed twice. Offline fills have no server
     * id and stay. */
    var inLedger = {};
    (D.orders || []).forEach(function (o) {
      inLedger[o.id] = true;
    });
    sessionOrders = sessionOrders.filter(function (o) {
      return !(o.serverId && inLedger[o.serverId]);
    });
    var ALL = sessionOrders.concat(D.orders);

    function filtered() {
      var q = state.q.toLowerCase();
      return ALL.filter(function (o) {
        return (!state.status || o.status === state.status) &&
          (!state.type || o.type === state.type) &&
          (!q || o.symbol.toLowerCase().indexOf(q) !== -1 ||
            o.id.toLowerCase().indexOf(q) !== -1 ||
            o.strategy.toLowerCase().indexOf(q) !== -1);
      });
    }

    function renderKpis() {
      var el = document.querySelector("[data-oh-kpis]");
      el.innerHTML = "";
      var rows = filtered();
      var filledRows = rows.filter(function (o) { return o.status === "filled"; });
      var pnl = rows.reduce(function (n, o) { return n + (o.pnl || 0); }, 0);
      [
        { label: "Total Orders", value: String(rows.length), sub: "matching filters", tone: "" },
        { label: "Filled Orders", value: String(filledRows.length), sub: "executed", tone: "is-up" },
        { label: "Pending Orders", value: String(rows.filter(function (o) { return o.status === "pending"; }).length), sub: "awaiting fill", tone: "is-warn" },
        { label: "Total P&L", value: (pnl >= 0 ? "+$" : "-$") + Math.abs(pnl).toFixed(2), sub: "closed trades", tone: pnl >= 0 ? "is-up" : "is-down" }
      ].forEach(function (k) {
        var card = document.createElement("div");
        card.className = "app-kpi";
        var l = document.createElement("p");
        l.className = "app-kpi__label";
        l.textContent = k.label;
        var v = document.createElement("p");
        v.className = "app-kpi__value";
        v.textContent = k.value;
        var s = document.createElement("p");
        s.className = "app-kpi__sub " + k.tone;
        s.textContent = k.sub;
        card.appendChild(l);
        card.appendChild(v);
        card.appendChild(s);
        el.appendChild(card);
      });
    }

    function renderTable() {
      var body = document.querySelector("[data-oh-body]");
      var empty = document.querySelector("[data-oh-empty]");
      var rows = filtered();
      var pages = Math.max(1, Math.ceil(rows.length / PAGE));
      if (state.page >= pages) state.page = pages - 1;
      var slice = rows.slice(state.page * PAGE, (state.page + 1) * PAGE);

      body.innerHTML = "";
      empty.innerHTML = "";
      empty.hidden = rows.length > 0;
      if (!rows.length) {
        empty.appendChild(app.empty({ head: "No orders match", hint: "Try adjusting your search filters" }));
      }
      slice.forEach(function (o) {
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
        var idCell = document.createElement("td");
        idCell.className = "is-mono";
        var idTop = document.createElement("div");
        idTop.textContent = o.id;
        var strat = document.createElement("div");
        strat.className = "app-kpi__sub";
        strat.textContent = o.strategy;
        idCell.appendChild(idTop);
        idCell.appendChild(strat);
        tr.appendChild(idCell);
        td(o.symbol, "is-mono");
        td(app.chip(o.side === "BUY" ? "buy" : "sell", o.side));
        td(app.chip("outline", o.type));
        td(String(o.qty), "is-mono");
        td("$" + o.price.toFixed(2), "is-mono");
        td(o.fill == null ? "—" : "$" + o.fill.toFixed(2), "is-mono");
        td(app.chip(o.status === "filled" ? "ok" : o.status === "pending" ? "pending" : "cancelled", o.status));
        var pnlCell = document.createElement("td");
        pnlCell.className = "is-mono";
        pnlCell.style.color = o.pnl > 0 ? "var(--app-green)" : o.pnl < 0 ? "var(--app-red)" : "var(--app-muted)";
        pnlCell.textContent = o.pnl ? (o.pnl > 0 ? "+$" : "-$") + Math.abs(o.pnl).toFixed(2) : "—";
        tr.appendChild(pnlCell);
        td(fmt.date(o.date), "is-mono");
        body.appendChild(tr);
      });

      document.querySelector("[data-oh-count]").textContent = rows.length
        ? "Showing " + (state.page * PAGE + 1) + "–" + Math.min(rows.length, (state.page + 1) * PAGE) + " of " + rows.length
        : "";
      document.querySelector("[data-oh-prev]").disabled = state.page === 0;
      document.querySelector("[data-oh-next]").disabled = state.page >= pages - 1;
    }

    function renderAll() {
      renderKpis();
      renderTable();
    }

    document.querySelector("[data-oh-search]").addEventListener("input", function (e) {
      state.q = e.target.value;
      state.page = 0;
      renderAll();
    });
    document.querySelector("[data-oh-status]").addEventListener("change", function (e) {
      state.status = e.target.value;
      state.page = 0;
      syncPills();
      renderAll();
    });
    document.querySelector("[data-oh-type]").addEventListener("change", function (e) {
      state.type = e.target.value;
      state.page = 0;
      renderAll();
    });
    document.querySelector("[data-oh-pills]").addEventListener("click", function (e) {
      var pill = e.target.closest("[data-pill]");
      if (!pill) return;
      state.status = pill.getAttribute("data-pill");
      state.page = 0;
      document.querySelector("[data-oh-status]").value = state.status;
      syncPills();
      renderAll();
    });
    function syncPills() {
      document.querySelectorAll("[data-pill]").forEach(function (p) {
        p.classList.toggle("app-segment--active", p.getAttribute("data-pill") === state.status);
      });
    }
    document.querySelector("[data-oh-prev]").addEventListener("click", function () {
      state.page -= 1;
      renderTable();
    });
    document.querySelector("[data-oh-next]").addEventListener("click", function () {
      state.page += 1;
      renderTable();
    });

    document.querySelector("[data-oh-export]").addEventListener("click", function () {
      var lines = ["# SAMPLE DATA — GeFi order history export", "id,symbol,side,type,qty,price,fill,status,pnl,date"];
      filtered().forEach(function (o) {
        lines.push([o.id, o.symbol, o.side, o.type, o.qty, o.price, o.fill == null ? "" : o.fill, o.status, o.pnl, o.date].join(","));
      });
      var line = document.querySelector("[data-oh-status-line]");
      function done(ok) {
        line.textContent = ok ? "CSV copied — stamped SAMPLE in its header." : "Copy failed — clipboard unavailable.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lines.join("\n")).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });

    renderAll();
  });
})(window, document);
