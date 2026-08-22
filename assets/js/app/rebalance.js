/* Portfolio rebalancing (task 209): live sliders -> drift -> trades. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;

    var KEY = "gefi-app-rebalance";

    function defaults() {
      var t = {};
      D.allocation.forEach(function (a) { t[a.name] = a.pct; });
      /* current weights start slightly drifted off the canonical targets */
      return {
        targets: t,
        current: { "Stocks": 48, "Bonds": 22, "Real Estate": 15, "Commodities": 10, "Cash": 5 },
        threshold: 5, auto: false, freq: "Quarterly", costs: true, tax: true, lastRebalance: "15 days ago"
      };
    }
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return defaults();
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();

    function totalTarget() {
      return Object.keys(st.targets).reduce(function (n, k) { return n + st.targets[k]; }, 0);
    }
    function trades() {
      var out = [];
      Object.keys(st.targets).forEach(function (k) {
        var driftPct = st.targets[k] - st.current[k];
        if (Math.abs(driftPct) >= 1) {
          out.push({
            side: driftPct > 0 ? "Buy" : "Sell",
            asset: k,
            value: Math.round(Math.abs(driftPct) / 100 * D.portfolio.value / 500) * 500
          });
        }
      });
      return out.filter(function (t) { return t.value > 0; });
    }
    function maxDrift() {
      return Math.max.apply(null, Object.keys(st.targets).map(function (k) {
        return Math.abs(st.targets[k] - st.current[k]);
      }));
    }

    /* ---- KPIs ---- */
    function renderKpis() {
      var el = document.querySelector("[data-rb-kpis]");
      el.innerHTML = "";
      var tr = trades();
      var value = tr.reduce(function (n, t) { return n + t.value; }, 0);
      [
        { label: "Portfolio Drift", value: maxDrift().toFixed(1) + "%", sub: "maximum deviation", tone: maxDrift() >= st.threshold ? "is-warn" : "" },
        { label: "Actions Required", value: String(tr.length), sub: "trades needed", tone: "" },
        { label: "Rebalance Value", value: fmt.moneyFull(value), sub: "total transaction value", tone: "" },
        { label: "Last Rebalance", value: st.lastRebalance, sub: st.freq + " schedule", tone: "" }
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

    /* ---- sliders ---- */
    var slidersEl = document.querySelector("[data-rb-sliders]");
    function renderSliders() {
      slidersEl.innerHTML = "";
      Object.keys(st.targets).forEach(function (k) {
      var row = document.createElement("div");
      row.className = "app-rb-slider";
      var top = document.createElement("div");
      top.className = "app-rb-slider__top";
      var name = document.createElement("span");
      name.textContent = k;
      var out = document.createElement("output");
      out.className = "mono";
      top.appendChild(name);
      top.appendChild(out);
      var input = document.createElement("input");
      input.type = "range";
      input.min = 0;
      input.max = 70;
      input.step = 1;
      input.value = st.targets[k];
      input.setAttribute("aria-label", k + " target allocation");
      var sub = document.createElement("p");
      sub.className = "app-kpi__sub";
      function paint() {
        out.textContent = st.targets[k] + "%";
        sub.textContent = "Current: " + st.current[k] + "% · Drift: " + Math.abs(st.targets[k] - st.current[k]).toFixed(0) + "%";
      }
      input.addEventListener("input", function () {
        st.targets[k] = parseInt(input.value, 10);
        save();
        paint();
        renderTotals();
        renderActions();
        renderKpis();
      });
      paint();
      row.appendChild(top);
      row.appendChild(input);
      row.appendChild(sub);
      slidersEl.appendChild(row);
      });
    }
    renderSliders();

    var totalEl = document.querySelector("[data-rb-total]");
    var executeBtn = document.querySelector("[data-rb-execute]");
    function renderTotals() {
      var t = totalTarget();
      totalEl.textContent = "Total Allocation: " + t + "%";
      totalEl.className = "app-rb-total " + (t === 100 ? "is-ok" : "is-off");
      executeBtn.disabled = t !== 100 || trades().length === 0;
      if (t !== 100) totalEl.textContent += " — must equal 100% before executing";
    }

    /* ---- actions list ---- */
    function renderActions() {
      var el = document.querySelector("[data-rb-actions]");
      el.innerHTML = "";
      trades().forEach(function (t) {
        var li = document.createElement("li");
        li.className = "app-holding";
        var dot = document.createElement("span");
        dot.className = "app-rb-dot " + (t.side === "Buy" ? "is-buy" : "is-sell");
        dot.setAttribute("aria-hidden", "true");
        var main = document.createElement("div");
        main.className = "app-holding__main";
        var name = document.createElement("p");
        name.className = "app-holding__name";
        name.textContent = t.side + " " + t.asset;
        main.appendChild(name);
        var right = document.createElement("div");
        right.className = "app-holding__right";
        var val = document.createElement("span");
        val.className = "mono app-holding__ret";
        val.textContent = fmt.moneyFull(t.value);
        var chip = GeFi.app.chip("low", "Low risk");
        right.appendChild(val);
        right.appendChild(chip);
        li.appendChild(dot);
        li.appendChild(main);
        li.appendChild(right);
        el.appendChild(li);
      });
      var total = trades().reduce(function (n, t) { return n + t.value; }, 0);
      document.querySelector("[data-rb-txtotal]").textContent =
        trades().length ? "Total Transaction Value: " + fmt.moneyFull(total) : "Portfolio is at target — no trades needed.";
    }

    /* ---- settings ---- */
    var threshold = document.querySelector("[data-rb-threshold]");
    var thresholdOut = document.querySelector("[data-rb-threshold-out]");
    threshold.value = st.threshold;
    thresholdOut.textContent = st.threshold + "%";
    threshold.addEventListener("input", function () {
      st.threshold = parseInt(threshold.value, 10);
      thresholdOut.textContent = st.threshold + "%";
      save();
      renderKpis();
    });
    var auto = document.querySelector("[data-rb-auto]");
    auto.checked = st.auto;
    auto.addEventListener("change", function () {
      st.auto = auto.checked;
      save();
    });
    var costs = document.querySelector("[data-rb-costs]");
    var tax = document.querySelector("[data-rb-tax]");
    costs.checked = st.costs;
    tax.checked = st.tax;
    costs.addEventListener("change", function () { st.costs = costs.checked; save(); });
    tax.addEventListener("change", function () { st.tax = tax.checked; save(); });
    document.querySelector("[data-rb-freq]").addEventListener("click", function (e) {
      var b = e.target.closest("[data-freq]");
      if (!b) return;
      st.freq = b.getAttribute("data-freq");
      save();
      document.querySelectorAll("[data-freq]").forEach(function (x) {
        x.classList.toggle("app-segment--active", x === b);
      });
      renderKpis();
    });
    document.querySelectorAll("[data-freq]").forEach(function (x) {
      x.classList.toggle("app-segment--active", x.getAttribute("data-freq") === st.freq);
    });

    /* ---- execute flow ---- */
    var modal = document.querySelector("[data-rb-modal]");
    var status = document.querySelector("[data-rb-status]");
    executeBtn.addEventListener("click", function () {
      var lines = trades().map(function (t) { return t.side.toUpperCase() + "  " + t.asset + "  " + fmt.moneyFull(t.value); });
      lines.push("", "TOTAL  " + fmt.moneyFull(trades().reduce(function (n, t) { return n + t.value; }, 0)));
      document.querySelector("[data-rb-modal-body]").textContent = lines.join("\n");
      modal.hidden = false;
      modal.querySelector("[data-rb-modal-confirm]").focus();
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-rb-modal-cancel]")) {
        modal.hidden = true;
        return;
      }
      if (e.target.closest("[data-rb-modal-confirm]")) {
        Object.keys(st.targets).forEach(function (k) { st.current[k] = st.targets[k]; });
        st.lastRebalance = "just now";
        save();
        modal.hidden = true;
        status.textContent = "Rebalance executed in this preview — current allocation now matches target.";
        renderSliders();
        renderKpis();
        renderActions();
        renderTotals();
      }
    });

    renderKpis();
    renderTotals();
    renderActions();
  });
})(window, document);
