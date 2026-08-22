/* Backtest engine (task 309) — ONE implementation of the simulated run,
 * shared by the backtesting page and the mock server (loaded there through
 * the same vm shim). The same model over the same window produces the same
 * equity curve, and every headline metric is DERIVED from that curve rather
 * than drawn independently, so the numbers in the results table, the chart
 * in Analysis and the overlay in Comparison all describe one run.
 *
 * Pure: seeded per model and window, no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* The page states this on screen; the contract and the validator below
   * both enforce it, so a custom window can't ask for data that isn't there. */
  var DATA_START = "2020-01-01";

  /* Simulation resolution: one point roughly every six trading days. */
  var STEPS_PER_YEAR = 60;

  var RANGES = {
    "1y": { label: "Last 1 Year", years: 1 },
    "2y": { label: "Last 2 Years", years: 2 },
    "5y": { label: "Last 5 Years", years: 5 }
  };

  /* Models available to test. The mock validates against this list, so the
   * dropdown and the server cannot disagree about what exists. */
  var MODELS = [
    { name: "Advanced Portfolio Optimizer", status: "deployed" },
    { name: "Real-time Risk Analyzer", status: "testing" },
    { name: "Sentiment Trading Bot", status: "approved" }
  ];

  var DAY = 24 * 3600 * 1000;

  /* ---------------------------------------------------------------- window */

  /* Normalise a request into the window actually simulated. `key` seeds the
   * path and is what gets displayed, so two requests that render the same
   * label are the same run. */
  function span(spec) {
    var s = spec || {};
    var range = s.range || "1y";
    if (range === "custom") {
      var years = (Date.parse(s.end) - Date.parse(s.start)) / (365.25 * DAY);
      return {
        key: s.start + ".." + s.end,
        label: s.start + " → " + s.end,
        years: years,
        points: Math.max(24, Math.round(years * STEPS_PER_YEAR))
      };
    }
    var r = RANGES[range] || RANGES["1y"];
    return { key: range, label: r.label, years: r.years, points: r.years * STEPS_PER_YEAR };
  }

  /* Returns null when the request is runnable, else why it isn't. */
  function validate(spec) {
    var s = spec || {};
    if (!s.model) return "model is required";
    var known = MODELS.some(function (m) {
      return m.name === s.model;
    });
    if (!known) return "unknown model: " + s.model;
    var range = s.range || "1y";
    if (range !== "custom") {
      if (!RANGES[range]) {
        return "range must be one of " + Object.keys(RANGES).join(", ") + ", or custom";
      }
      return null;
    }
    if (!s.start || !s.end) return "a custom range needs a start and an end date";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.start) || !/^\d{4}-\d{2}-\d{2}$/.test(s.end)) {
      return "dates must be YYYY-MM-DD";
    }
    if (s.start < DATA_START) return "historical data starts at " + DATA_START;
    if (s.end <= s.start) return "end must be after start";
    return null;
  }

  /* ---------------------------------------------------------------- engine */

  /* A model's own character: the edge it actually has, and how noisy that
   * edge is. Seeded on the model alone, so a longer window compounds the
   * same edge instead of inventing a different one.
   *
   * `edge` is the model's TRUE annualised Sharpe; drift is solved backwards
   * from it so the realised figure a run reports is an estimate of that
   * number rather than an arbitrary one. Short windows therefore come out
   * noisy and long ones converge, which is how backtests really behave. */
  function profile(model) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("btm|" + model));
    var vol = 0.010 + rand() * 0.010;
    var edge = 0.3 + rand() * 1.0;
    /* sd of a uniform draw over ±vol */
    var sd = vol * 0.5773502692;
    return {
      edge: +edge.toFixed(2),
      vol: vol,
      drift: (edge * sd) / Math.sqrt(STEPS_PER_YEAR),
      tradesPerYear: 120 + Math.round(rand() * 180)
    };
  }

  /* Equity curve, starting at 100. Everything else is measured off this. */
  function equity(model, spec) {
    var sp = span(spec);
    var prof = profile(model);
    var rand = GeFi.seed.rng(GeFi.seed.hash("btp|" + model + "|" + sp.key));
    var out = [100];
    var last = 100;
    for (var i = 1; i < sp.points; i++) {
      last = Math.max(1, last * (1 + prof.drift + (rand() - 0.5) * prof.vol * 2));
      out.push(+last.toFixed(2));
    }
    return out;
  }

  /* Headline metrics, all read off the curve above. */
  function metrics(model, spec) {
    var sp = span(spec);
    var eq = equity(model, spec);
    var prof = profile(model);

    var total = eq[eq.length - 1] / eq[0];
    var annualPct = +((Math.pow(total, 1 / sp.years) - 1) * 100).toFixed(1);

    var peak = eq[0];
    var worst = 0;
    var rets = [];
    var wins = 0;
    for (var i = 0; i < eq.length; i++) {
      if (eq[i] > peak) peak = eq[i];
      var dd = (eq[i] - peak) / peak;
      if (dd < worst) worst = dd;
      if (i > 0) {
        var r = eq[i] / eq[i - 1] - 1;
        rets.push(r);
        if (r > 0) wins++;
      }
    }

    var mean = rets.reduce(function (a, b) { return a + b; }, 0) / rets.length;
    var variance = rets.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0) / rets.length;
    var sd = Math.sqrt(variance);
    var perYear = rets.length / sp.years;

    return {
      range: sp.key,
      rangeLabel: sp.label,
      years: +sp.years.toFixed(2),
      sharpe: sd ? +((mean / sd) * Math.sqrt(perYear)).toFixed(2) : 0,
      annualPct: annualPct,
      totalPct: +((total - 1) * 100).toFixed(1),
      drawdownPct: +(worst * 100).toFixed(1),
      trades: Math.round(prof.tradesPerYear * sp.years),
      winRatePct: +((wins / rets.length) * 100).toFixed(1)
    };
  }

  /* Per-trade breakdown for the Analysis view. Count and win rate are the
   * ones metrics() reports, so the table can't contradict the headline. */
  function trades(model, spec, limit) {
    var sp = span(spec);
    var m = metrics(model, spec);
    var eq = equity(model, spec);
    var rand = GeFi.seed.rng(GeFi.seed.hash("btt|" + model + "|" + sp.key));
    var n = Math.min(limit || 20, m.trades);
    var out = [];
    var winsLeft = Math.round((m.winRatePct / 100) * n);
    for (var i = 0; i < n; i++) {
      var step = Math.floor(((i + 1) / (n + 1)) * (eq.length - 1));
      var win = winsLeft > 0 && (rand() < 0.7 || winsLeft >= n - i);
      if (win) winsLeft--;
      var mag = 0.4 + rand() * 3.1;
      out.push({
        n: i + 1,
        step: step,
        entry: eq[step],
        pnlPct: +((win ? mag : -mag)).toFixed(2),
        result: win ? "win" : "loss"
      });
    }
    return out;
  }

  /* Progress percentages a run reports on its way to done. Seeded on the run
   * id, which the server assigns and the client is told, so the live stream
   * and the offline simulation step through the same numbers. */
  function steps(id) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("btprog|" + id));
    var out = [];
    var p = 0;
    while (p < 100) {
      p = Math.min(100, p + 12 + Math.round(rand() * 10));
      out.push(p);
    }
    return out;
  }

  /* ------------------------------------------------------------- optimizer */

  var GRID = { lookback: [10, 20, 40, 60], band: [1.5, 2, 2.5] };

  /* Sweep a parameter grid, scoring each combination against the same engine.
   * Deterministic, so the best set is the best set on both sides. */
  function optimize(model, spec, grid) {
    var g = grid || GRID;
    var names = Object.keys(g);
    var combos = [{}];
    names.forEach(function (name) {
      var next = [];
      combos.forEach(function (base) {
        g[name].forEach(function (v) {
          var copy = {};
          Object.keys(base).forEach(function (k) { copy[k] = base[k]; });
          copy[name] = v;
          next.push(copy);
        });
      });
      combos = next;
    });
    var sp = span(spec);
    var rows = combos.map(function (params) {
      var tag = names.map(function (n) { return n + "=" + params[n]; }).join(",");
      var m = metrics(model + "|" + tag, spec);
      return { params: params, sharpe: m.sharpe, annualPct: m.annualPct, drawdownPct: m.drawdownPct };
    });
    rows.sort(function (a, b) { return b.sharpe - a.sharpe; });
    return { model: model, range: sp.key, grid: g, evaluated: rows.length, rows: rows, best: rows[0] };
  }

  GeFi.backtest = {
    DATA_START: DATA_START,
    RANGES: RANGES,
    MODELS: MODELS,
    GRID: GRID,
    span: span,
    validate: validate,
    profile: profile,
    equity: equity,
    metrics: metrics,
    trades: trades,
    steps: steps,
    optimize: optimize
  };
})(typeof window !== "undefined" ? window : globalThis);
