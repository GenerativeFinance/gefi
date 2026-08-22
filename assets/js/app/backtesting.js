/* Backtesting environment (task 212, wired to the service in task 309):
 * configure -> run -> results -> analysis -> comparison.
 *
 * Every metric on this page comes from GeFi.backtest, the same module the
 * mock server runs, so a run the server computed and a run simulated here
 * report the same numbers for the same inputs. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var app = GeFi.app;
    var BT = GeFi.backtest;

    var MODELS = BT.MODELS;
    var DATA_SOURCES = [
      { name: "Stock Data (US)", status: "Active" },
      { name: "Crypto", status: "Active" },
      { name: "Forex", status: "Limited" },
      { name: "Options", status: "Coming Soon" }
    ];

    /* Runs are stored as the request that produced them; the numbers are
     * always derived, never cached, so nothing can drift out of agreement. */
    var runs = (D.backtests || []).map(function (r) {
      return { id: r.id, model: r.model, range: r.range, status: r.status || "completed" };
    });
    var running = [];
    var nextId = 119;
    runs.forEach(function (r) {
      var n = parseInt(String(r.id).replace(/^BT-/, ""), 10);
      if (n >= nextId) nextId = n + 1;
    });

    /* A stored range is either a preset key or "start..end". */
    function specOf(run) {
      if (String(run.range).indexOf("..") > -1) {
        var parts = run.range.split("..");
        return { model: run.model, range: "custom", start: parts[0], end: parts[1] };
      }
      return { model: run.model, range: run.range };
    }
    function metricsOf(run) {
      return BT.metrics(run.model, specOf(run));
    }

    function pct(n) {
      return (n > 0 ? "+" : "") + n.toFixed(1) + "%";
    }

    /* ------------------------------------------------------------- KPIs */
    function renderKpis() {
      var el = document.querySelector("[data-bt-kpis]");
      el.innerHTML = "";
      var completed = runs.filter(function (r) { return r.status === "completed"; });
      var stats = completed.map(metricsOf);
      var best = stats.length ? Math.max.apply(null, stats.map(function (s) { return s.sharpe; })) : null;
      var avg = stats.length ? stats.reduce(function (n, s) { return n + s.annualPct; }, 0) / stats.length : null;
      [
        { label: "Total Backtests", value: String(runs.length), sub: running.length + " running", tone: running.length ? "is-warn" : "" },
        { label: "Best Sharpe Ratio", value: best == null ? "N/A" : best.toFixed(2), sub: "completed runs", tone: "is-up" },
        { label: "Avg Annual Return", value: avg == null ? "N/A" : pct(avg), sub: "simulated, sample data", tone: avg != null && avg < 0 ? "is-down" : "is-up" },
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

    /* -------------------------------------------------- configure lists */
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

    /* ---------------------------------------------------- results table */
    function renderResults() {
      var body = document.querySelector("[data-bt-results]");
      body.innerHTML = "";
      runs.forEach(function (r) {
        var tr = document.createElement("tr");
        tr.setAttribute("data-bt-run", r.id);
        function td(content, cls) {
          var el = document.createElement("td");
          if (cls) el.className = cls;
          if (content instanceof Node) el.appendChild(content);
          else el.textContent = content;
          tr.appendChild(el);
        }
        td(r.id, "is-mono");
        td(r.model);
        if (r.status === "completed") {
          var m = metricsOf(r);
          td(m.range, "is-mono");
          td(m.sharpe.toFixed(2), "is-mono");
          td(pct(m.annualPct), "is-mono");
          td(m.drawdownPct.toFixed(1) + "%", "is-mono");
          td(String(m.trades), "is-mono");
        } else {
          td(r.range, "is-mono");
          td("—", "is-mono");
          td("—", "is-mono");
          td("—", "is-mono");
          td("—", "is-mono");
        }
        td(app.chip(r.status === "completed" ? "ok" : "pending", r.status));
        body.appendChild(tr);
      });
    }

    /* ------------------------------------------------------ live monitor */
    function renderRunning() {
      var el = document.querySelector("[data-bt-running]");
      el.innerHTML = "";
      if (!running.length) {
        el.appendChild(app.empty({ head: "Nothing running", hint: "Start one from Configure — progress streams here." }));
        return;
      }
      running.forEach(function (run) {
        var block = document.createElement("div");
        block.className = "app-meterrow";
        block.style.marginBottom = "12px";
        block.setAttribute("data-bt-progress", run.id);
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

    /* -------------------------------------------------- new-backtest flow */
    var modal = document.querySelector("[data-bt-modal]");
    var form = document.querySelector("[data-bt-form]");
    var modelSelect = document.querySelector("[data-bt-model-select]");
    var rangeSelect = document.querySelector("[data-bt-range]");
    var customBox = document.querySelector("[data-bt-custom]");
    var formError = document.querySelector("[data-bt-form-error]");

    MODELS.forEach(function (m) {
      var opt = document.createElement("option");
      opt.textContent = m.name;
      modelSelect.appendChild(opt);
    });
    /* The browser's own date validation and the engine's rule are the same
     * rule, so the bound is written once and read from the module. Two
     * copies would eventually disagree about what data exists. */
    document.querySelectorAll("[data-bt-min]").forEach(function (input) {
      input.min = BT.DATA_START;
    });
    document.querySelector("[data-bt-coverage]").textContent =
      "Historical coverage starts " + BT.DATA_START + ".";

    function syncCustom() {
      customBox.hidden = rangeSelect.value !== "custom";
    }
    rangeSelect.addEventListener("change", syncCustom);
    syncCustom();

    document.querySelector("[data-bt-new]").addEventListener("click", function () {
      formError.hidden = true;
      modal.hidden = false;
      modelSelect.focus();
    });
    document.querySelectorAll("[data-preset]").forEach(function (b) {
      b.addEventListener("click", function () {
        formError.hidden = true;
        modal.hidden = false;
        rangeSelect.value = b.getAttribute("data-preset");
        syncCustom();
        modelSelect.focus();
      });
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-bt-modal-cancel]")) modal.hidden = true;
    });

    function currentSpec() {
      var spec = { model: modelSelect.value, range: rangeSelect.value };
      if (spec.range === "custom") {
        spec.start = form.elements.start.value;
        spec.end = form.elements.end.value;
      }
      return spec;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var spec = currentSpec();
      /* Validate with the same rules the server applies, so an impossible
       * window is refused here with the same words instead of round-tripping. */
      var why = BT.validate(spec);
      if (why) {
        formError.textContent = why;
        formError.hidden = false;
        return;
      }
      formError.hidden = true;
      modal.hidden = true;
      GeFi.api.post("/backtests", spec).then(
        function (r) { startRun(spec, r && r.id, !(r && r.sample)); },
        function (err) {
          if (err && err.httpStatus === 422 && err.body && err.body.message) {
            formError.textContent = err.body.message;
            formError.hidden = false;
            modal.hidden = false;
            return;
          }
          startRun(spec, null, false);
        }
      );
    });

    function startRun(spec, serverId, live) {
      var id = serverId || "BT-" + nextId;
      var n = parseInt(String(id).replace(/^BT-/, ""), 10);
      if (n >= nextId) nextId = n + 1;
      var run = { id: id, model: spec.model, range: BT.span(spec).key, progress: 0 };
      running.push(run);
      renderKpis();
      renderRunning();
      window.location.hash = "monitor";

      function advance(p) {
        run.progress = p;
        renderRunning();
        if (p < 100) return;
        running = running.filter(function (r) { return r !== run; });
        runs.unshift({ id: run.id, model: run.model, range: run.range, status: "completed" });
        renderKpis();
        renderResults();
        renderRunning();
        refreshPickers();
        var root = document.querySelector("[data-bt-root]");
        if (root) root.setAttribute("data-bt-last-run", run.id);
      }

      /* Live, the server drives the bar. Offline, the same step sequence is
       * replayed locally from the run id — identical numbers either way. */
      var steps = BT.steps(run.id);
      GeFi.api.stream(
        "/backtests/" + encodeURIComponent(run.id) + "/events",
        function (name, data) {
          if (data && typeof data.progress === "number") advance(data.progress);
        },
        {
          events: ["backtest.progress", "backtest.completed"],
          simulate: function (emit) {
            var i = 0;
            var timer = setInterval(function () {
              if (i >= steps.length) {
                clearInterval(timer);
                return;
              }
              var p = steps[i++];
              emit(p >= 100 ? "backtest.completed" : "backtest.progress", { id: run.id, progress: p });
              if (p >= 100) clearInterval(timer);
            }, 300);
            return function () { clearInterval(timer); };
          }
        }
      );
    }

    /* ---------------------------------------------------------- optimizer */
    var optForm = document.querySelector("[data-bt-opt-form]");
    var optModel = document.querySelector("[data-bt-opt-model]");
    var optRange = document.querySelector("[data-bt-opt-range]");
    var optResult = document.querySelector("[data-bt-opt-result]");
    MODELS.forEach(function (m) {
      var opt = document.createElement("option");
      opt.textContent = m.name;
      optModel.appendChild(opt);
    });
    Object.keys(BT.RANGES).forEach(function (key) {
      var opt = document.createElement("option");
      opt.value = key;
      opt.textContent = BT.RANGES[key].label;
      optRange.appendChild(opt);
    });
    optRange.value = "2y";

    function renderOptimizer(result) {
      optResult.innerHTML = "";
      /* Say what the table is a sweep OF. The panel opens on a default
       * sweep, so an unlabelled table would leave the reader guessing which
       * model these rows describe. */
      optResult.setAttribute("data-bt-opt-of", result.model + "|" + result.range);
      var head = document.createElement("p");
      head.className = "app-kpi__sub";
      head.setAttribute("data-bt-opt-best", "");
      var b = result.best;
      var window_ = BT.RANGES[result.range] ? BT.RANGES[result.range].label : result.range;
      head.textContent =
        result.model + " · " + window_ + " — best of " + result.evaluated + ": " +
        Object.keys(b.params).map(function (k) { return k + " " + b.params[k]; }).join(", ") +
        " — Sharpe " + b.sharpe.toFixed(2) + ", annual " + pct(b.annualPct) + ", max drawdown " + b.drawdownPct.toFixed(1) + "%";
      optResult.appendChild(head);

      var wrap = document.createElement("div");
      wrap.className = "app-tablewrap";
      var table = document.createElement("table");
      table.className = "app-table";
      var names = Object.keys(result.grid);
      var thead = document.createElement("thead");
      var htr = document.createElement("tr");
      names.concat(["Sharpe", "Annual", "Max DD"]).forEach(function (h) {
        var th = document.createElement("th");
        th.textContent = h;
        htr.appendChild(th);
      });
      thead.appendChild(htr);
      table.appendChild(thead);
      var tbody = document.createElement("tbody");
      tbody.setAttribute("data-bt-opt-rows", "");
      result.rows.forEach(function (row) {
        var tr = document.createElement("tr");
        names.forEach(function (k) {
          var td = document.createElement("td");
          td.className = "is-mono";
          td.textContent = String(row.params[k]);
          tr.appendChild(td);
        });
        [row.sharpe.toFixed(2), pct(row.annualPct), row.drawdownPct.toFixed(1) + "%"].forEach(function (v) {
          var td = document.createElement("td");
          td.className = "is-mono";
          td.textContent = v;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      optResult.appendChild(wrap);
    }

    optForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var spec = { model: optModel.value, range: optRange.value };
      GeFi.api.post("/optimizer/runs", spec).then(
        function (r) {
          renderOptimizer(r && r.rows ? r : BT.optimize(spec.model, spec));
        },
        function () {
          renderOptimizer(BT.optimize(spec.model, spec));
        }
      );
    });

    /* ----------------------------------------------------------- analysis */
    var analysisRun = document.querySelector("[data-bt-analysis-run]");
    var analysisBody = document.querySelector("[data-bt-analysis-body]");

    function renderAnalysis() {
      analysisBody.innerHTML = "";
      var run = runs.filter(function (r) {
        return r.status === "completed" && r.id === analysisRun.value;
      })[0];
      if (!run) {
        analysisBody.appendChild(app.empty({
          head: "Pick a completed run to analyse",
          hint: "Per-trade breakdowns land here once a run is selected."
        }));
        return;
      }
      var spec = specOf(run);
      var m = BT.metrics(run.model, spec);
      var eq = BT.equity(run.model, spec);
      var rows = BT.trades(run.model, spec, 12);

      var chart = document.createElement("div");
      chart.setAttribute("data-bt-analysis-chart", "");
      chart.appendChild(GeFi.svg.line([{ name: run.model, values: eq }], {
        label: run.id + " equity curve, simulated"
      }));
      analysisBody.appendChild(chart);

      var summary = document.createElement("p");
      summary.className = "app-kpi__sub";
      summary.setAttribute("data-bt-analysis-stats", "");
      summary.textContent =
        m.rangeLabel + " · Sharpe " + m.sharpe.toFixed(2) +
        " · annual " + pct(m.annualPct) +
        " · total " + pct(m.totalPct) +
        " · max drawdown " + m.drawdownPct.toFixed(1) + "%" +
        " · " + m.trades + " trades, " + m.winRatePct.toFixed(1) + "% won";
      analysisBody.appendChild(summary);

      var wrap = document.createElement("div");
      wrap.className = "app-tablewrap";
      var table = document.createElement("table");
      table.className = "app-table";
      var thead = document.createElement("thead");
      var htr = document.createElement("tr");
      ["#", "Entry", "P&L", "Result"].forEach(function (h) {
        var th = document.createElement("th");
        th.textContent = h;
        htr.appendChild(th);
      });
      thead.appendChild(htr);
      table.appendChild(thead);
      var tbody = document.createElement("tbody");
      tbody.setAttribute("data-bt-analysis-rows", "");
      rows.forEach(function (t) {
        var tr = document.createElement("tr");
        [String(t.n), t.entry.toFixed(2), pct(t.pnlPct)].forEach(function (v) {
          var td = document.createElement("td");
          td.className = "is-mono";
          td.textContent = v;
          tr.appendChild(td);
        });
        var last = document.createElement("td");
        last.appendChild(app.chip(t.result === "win" ? "buy" : "sell", t.result));
        tr.appendChild(last);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      analysisBody.appendChild(wrap);
    }
    analysisRun.addEventListener("change", renderAnalysis);

    /* --------------------------------------------------------- comparison */
    var comparePicks = document.querySelector("[data-bt-compare-picks]");
    var compareBody = document.querySelector("[data-bt-compare-body]");
    var selected = {};

    function renderCompare() {
      compareBody.innerHTML = "";
      var chosen = runs.filter(function (r) {
        return r.status === "completed" && selected[r.id];
      });
      if (chosen.length < 2) {
        compareBody.appendChild(app.empty({
          head: "Compare two or more runs",
          hint: "Select runs above to overlay their equity curves."
        }));
        return;
      }
      /* Different windows are different lengths; put them on one axis before
       * drawing so neither curve is stretched to flatter it. */
      var points = 60;
      var series = chosen.map(function (r) {
        var eq = BT.equity(r.model, specOf(r));
        var out = [];
        for (var i = 0; i < points; i++) {
          out.push(eq[Math.round((i / (points - 1)) * (eq.length - 1))]);
        }
        return { name: r.id + " · " + r.model, values: out };
      });
      var chart = document.createElement("div");
      chart.setAttribute("data-bt-compare-chart", "");
      chart.appendChild(GeFi.svg.line(series, { label: "Equity curves, rebased to 100" }));
      compareBody.appendChild(chart);

      var wrap = document.createElement("div");
      wrap.className = "app-tablewrap";
      var table = document.createElement("table");
      table.className = "app-table";
      var thead = document.createElement("thead");
      var htr = document.createElement("tr");
      ["Run", "Model", "Range", "Sharpe", "Annual", "Max DD"].forEach(function (h) {
        var th = document.createElement("th");
        th.textContent = h;
        htr.appendChild(th);
      });
      thead.appendChild(htr);
      table.appendChild(thead);
      var tbody = document.createElement("tbody");
      tbody.setAttribute("data-bt-compare-rows", "");
      chosen.forEach(function (r) {
        var m = metricsOf(r);
        var tr = document.createElement("tr");
        [r.id, r.model, m.rangeLabel, m.sharpe.toFixed(2), pct(m.annualPct), m.drawdownPct.toFixed(1) + "%"].forEach(function (v, i) {
          var td = document.createElement("td");
          if (i !== 1) td.className = "is-mono";
          td.textContent = v;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      compareBody.appendChild(wrap);
    }

    /* Both pickers list exactly the completed runs, so a run created in this
     * session is analysable and comparable without a reload. */
    function refreshPickers() {
      var completed = runs.filter(function (r) { return r.status === "completed"; });

      var keep = analysisRun.value;
      analysisRun.innerHTML = "";
      completed.forEach(function (r) {
        var opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = r.id + " · " + r.model;
        analysisRun.appendChild(opt);
      });
      analysisRun.value = completed.some(function (r) { return r.id === keep; }) ? keep : (completed[0] ? completed[0].id : "");
      renderAnalysis();

      comparePicks.innerHTML = "";
      completed.forEach(function (r) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "app-btn " + (selected[r.id] ? "app-btn--primary" : "app-btn--ghost");
        b.setAttribute("data-bt-compare-pick", r.id);
        b.setAttribute("aria-pressed", selected[r.id] ? "true" : "false");
        b.textContent = r.id;
        b.addEventListener("click", function () {
          selected[r.id] = !selected[r.id];
          refreshPickers();
        });
        comparePicks.appendChild(b);
      });
      renderCompare();
    }

    /* Start with the two most recent runs overlaid, so the segment opens on
     * a real comparison rather than an empty state. */
    runs.filter(function (r) { return r.status === "completed"; }).slice(0, 2).forEach(function (r) {
      selected[r.id] = true;
    });

    renderKpis();
    renderResults();
    renderRunning();
    refreshPickers();
    /* Open on a real sweep rather than a bare form — the maths is cheap and
     * every other segment shows something. */
    renderOptimizer(BT.optimize(optModel.value, { model: optModel.value, range: optRange.value }));
  });
})(window, document);
