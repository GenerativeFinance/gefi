/* Backtesting environment (task 212): configure -> run -> results. */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var app = GeFi.app;

    var KEY = "gefi-app-backtests";
    var MODELS = [
      { name: "Advanced Portfolio Optimizer", status: "deployed" },
      { name: "Real-time Risk Analyzer", status: "testing" },
      { name: "Sentiment Trading Bot", status: "approved" }
    ];
    var DATA_SOURCES = [
      { name: "Stock Data (US)", status: "Active" },
      { name: "Crypto", status: "Active" },
      { name: "Forex", status: "Limited" },
      { name: "Options", status: "Coming Soon" }
    ];

    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { runs: D.backtests.slice(), nextId: 119, running: [] };
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();

    function renderKpis() {
      var el = document.querySelector("[data-bt-kpis]");
      el.innerHTML = "";
      var completed = st.runs.filter(function (r) { return r.status === "completed"; });
      var best = completed.length ? Math.max.apply(null, completed.map(function (r) { return r.sharpe; })) : null;
      var avg = completed.length ? completed.reduce(function (n, r) { return n + r.annualPct; }, 0) / completed.length : null;
      [
        { label: "Total Backtests", value: String(st.runs.length), sub: st.running.length + " running", tone: st.running.length ? "is-warn" : "" },
        { label: "Best Sharpe Ratio", value: best == null ? "N/A" : best.toFixed(2), sub: "completed runs", tone: "is-up" },
        { label: "Avg Annual Return", value: avg == null ? "N/A" : "+" + avg.toFixed(1) + "%", sub: "simulated, sample data", tone: "is-up" },
        { label: "Models Available", value: String(MODELS.length), sub: "ready to test", tone: "" }
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

    /* configure lists */
    var modelsEl = document.querySelector("[data-bt-models]");
    MODELS.forEach(function (m) {
      var li = document.createElement("li");
      li.className = "app-holding";
      var main = document.createElement("div");
      main.className = "app-holding__main";
      var name = document.createElement("p");
      name.className = "app-holding__name";
      name.textContent = m.name;
      main.appendChild(name);
      li.appendChild(main);
      li.appendChild(app.chip(m.status));
      modelsEl.appendChild(li);
    });
    var dataEl = document.querySelector("[data-bt-data]");
    DATA_SOURCES.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "app-holding";
      var main = document.createElement("div");
      main.className = "app-holding__main";
      var name = document.createElement("p");
      name.className = "app-holding__name";
      name.textContent = s.name;
      main.appendChild(name);
      li.appendChild(main);
      li.appendChild(app.chip(s.status === "Active" ? "active" : s.status === "Limited" ? "medium" : "coming-soon", s.status));
      dataEl.appendChild(li);
    });

    /* empty states for unbuilt segments — honest copy */
    document.querySelector("[data-bt-optimizer-empty]").appendChild(app.empty({
      head: "Optimizer runs on completed backtests",
      hint: "Finish at least two runs of one model, then sweep its parameters here."
    }));
    document.querySelector("[data-bt-analysis-empty]").appendChild(app.empty({
      head: "Pick a completed run to analyse",
      hint: "Per-trade breakdowns land here once a run is selected from Results."
    }));
    document.querySelector("[data-bt-comparison-empty]").appendChild(app.empty({
      head: "Compare two or more runs",
      hint: "Select runs from Results to overlay their equity curves."
    }));

    /* results table */
    function renderResults() {
      var body = document.querySelector("[data-bt-results]");
      body.innerHTML = "";
      st.runs.forEach(function (r) {
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
        td(r.id, "is-mono");
        td(r.model);
        td(r.range, "is-mono");
        td(r.sharpe.toFixed(2), "is-mono");
        td("+" + r.annualPct.toFixed(1) + "%", "is-mono");
        td(r.drawdownPct.toFixed(1) + "%", "is-mono");
        td(String(r.trades), "is-mono");
        td(app.chip(r.status === "completed" ? "ok" : "pending", r.status));
        body.appendChild(tr);
      });
    }

    /* live monitor */
    function renderRunning() {
      var el = document.querySelector("[data-bt-running]");
      el.innerHTML = "";
      if (!st.running.length) {
        el.appendChild(app.empty({ head: "Nothing running", hint: "Start one from Configure — progress streams here." }));
        return;
      }
      st.running.forEach(function (run) {
        var block = document.createElement("div");
        block.className = "app-meterrow";
        block.style.marginBottom = "12px";
        var name = document.createElement("span");
        name.className = "app-rowcard__collabel";
        name.style.minWidth = "220px";
        name.textContent = run.id + " · " + run.model;
        var track = document.createElement("div");
        track.className = "app-meter";
        var fill = document.createElement("div");
        fill.className = "app-meter__fill";
        fill.style.width = run.progress + "%";
        track.appendChild(fill);
        var val = document.createElement("span");
        val.className = "app-meterrow__val";
        val.textContent = run.progress + "%";
        block.appendChild(name);
        block.appendChild(track);
        block.appendChild(val);
        el.appendChild(block);
      });
    }

    /* new-backtest modal */
    var modal = document.querySelector("[data-bt-modal]");
    var modelSelect = document.querySelector("[data-bt-model-select]");
    MODELS.forEach(function (m) {
      var opt = document.createElement("option");
      opt.textContent = m.name;
      modelSelect.appendChild(opt);
    });
    document.querySelector("[data-bt-new]").addEventListener("click", function () {
      modal.hidden = false;
      modelSelect.focus();
    });
    document.querySelectorAll("[data-preset]").forEach(function (b) {
      b.addEventListener("click", function () {
        modal.hidden = false;
        document.querySelector('[data-bt-form] select[name="range"]').value =
          b.getAttribute("data-preset");
        modelSelect.focus();
      });
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-bt-modal-cancel]")) modal.hidden = true;
    });

    document.querySelector("[data-bt-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      var model = modelSelect.value;
      var range = e.target.elements.range.value;
      var id = "BT-" + st.nextId;
      st.nextId += 1;
      var run = { id: id, model: model, range: range, progress: 0 };
      st.running.push(run);
      save();
      modal.hidden = true;
      renderKpis();
      renderRunning();
      window.location.hash = "monitor";

      var rand = GeFi.seed.rng(GeFi.seed.hash("bt|" + id + "|" + model));
      var timer = setInterval(function () {
        run.progress = Math.min(100, run.progress + 12 + Math.round(rand() * 10));
        if (run.progress >= 100) {
          clearInterval(timer);
          st.running = st.running.filter(function (r) { return r !== run; });
          st.runs.unshift({
            id: id, model: model, range: range,
            sharpe: +(0.9 + rand() * 1.1).toFixed(2),
            annualPct: +(6 + rand() * 12).toFixed(1),
            drawdownPct: -+(4 + rand() * 9).toFixed(1),
            trades: 150 + Math.round(rand() * 400),
            status: "completed"
          });
          renderResults();
        }
        save();
        renderRunning();
        renderKpis();
      }, 600);
    });

    renderKpis();
    renderResults();
    renderRunning();
  });
})(window, document);
