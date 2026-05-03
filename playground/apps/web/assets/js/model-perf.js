/* Performance tab — uPlot via CDN (~40KB).
 * Lazy-loads uPlot the first time the Performance tab is shown, then
 * renders one chart per series found on `model.metrics`:
 *   - equityCurve : [[t, value], …] line chart
 *   - accuracy    : [[t, pct],   …] line chart
 *   - latency     : { p50, p95 } summary cards
 * Empty / missing series get a polite "No data yet" placeholder so the
 * panel never shows a broken chart. */
(function () {
  "use strict";
  var root = document.querySelector("[data-perf-root]");
  if (!root) return;
  var data = (function () {
    var el = document.getElementById("model-data");
    try { return el ? JSON.parse(el.textContent || "null") : null; }
    catch { return null; }
  })();
  var metrics = (data && data.metrics) || {};
  var rendered = false;

  document.addEventListener("model:tab-shown", function (ev) {
    if (ev.detail && ev.detail.tab === "performance" && !rendered) {
      rendered = true;
      ensureUplot().then(render).catch(function () {
        renderFallback();
      });
    }
  });

  function ensureUplot() {
    if (window.uPlot) return Promise.resolve(window.uPlot);
    return new Promise(function (resolve, reject) {
      var css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://cdn.jsdelivr.net/npm/uplot@1.6.31/dist/uPlot.min.css";
      document.head.appendChild(css);
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/uplot@1.6.31/dist/uPlot.iife.min.js";
      s.onload = function () { resolve(window.uPlot); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function lineChart(host, series, label, color) {
    if (!series || !series.length) {
      host.innerHTML = '<p class="perf-empty">No data yet.</p>';
      return;
    }
    var xs = series.map(function (p) { return p[0]; });
    var ys = series.map(function (p) { return p[1]; });
    var w = host.clientWidth || 540;
    var opts = {
      width: w,
      height: 220,
      scales: { x: { time: false } },
      legend: { show: false },
      series: [
        {},
        { label: label, stroke: color, width: 2, points: { show: false } },
      ],
      axes: [
        { stroke: "#9aa3b2" },
        { stroke: "#9aa3b2" },
      ],
    };
    new window.uPlot(opts, [xs, ys], host);
  }

  function render() {
    root.querySelectorAll("[data-series]").forEach(function (el) {
      var key = el.dataset.series;
      var host = el.querySelector("[data-uplot]");
      if (key === "equityCurve" && host) {
        lineChart(host, metrics.equityCurve, "Equity", "#7cf2c4");
      } else if (key === "accuracy" && host) {
        lineChart(host, metrics.accuracy, "Accuracy", "#9bb1ff");
      } else if (key === "latency") {
        var lat = metrics.latency || {};
        var p50 = el.querySelector("[data-p50]");
        var p95 = el.querySelector("[data-p95]");
        if (p50) p50.textContent = lat.p50 != null ? String(lat.p50) : "—";
        if (p95) p95.textContent = lat.p95 != null ? String(lat.p95) : "—";
      }
    });
  }

  function renderFallback() {
    root.querySelectorAll("[data-uplot]").forEach(function (h) {
      h.innerHTML = '<p class="perf-empty">Chart library failed to load.</p>';
    });
  }
})();
