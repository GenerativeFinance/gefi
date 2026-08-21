/* GeFi shared dashboard primitives.
 *
 * Owns two things every model page and dashboard view depends on:
 *
 *   GeFi.MODELS  — the model registry. Model build tasks append ONE row here
 *                  (see the row shape documented above MODELS below). Nothing
 *                  else in a model task touches this file.
 *   GeFi.svg     — dependency-free SVG chart primitives (gauge, line, bars,
 *                  sparkline) reused by assets/js/model-demo.js and by any
 *                  dashboard surface.
 *   GeFi.fmt     — number / percent / money / compact formatters.
 *   GeFi.seed    — deterministic PRNG helpers, so sample output is stable
 *                  for a given input instead of reshuffling on every run.
 *
 * No build step, no dependencies, ES5-compatible.
 */
(function (window, document) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* ---------------------------------------------------------------- utils */

  function clamp(n, lo, hi) {
    return n < lo ? lo : n > hi ? hi : n;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function isNum(n) {
    return typeof n === "number" && isFinite(n);
  }

  GeFi.util = { clamp: clamp, esc: esc, isNum: isNum };

  /* ------------------------------------------------------------ formatters */

  var fmt = {
    num: function (n, dp) {
      if (!isNum(n)) return "—";
      var d = dp == null ? 2 : dp;
      return n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    pct: function (n, dp) {
      if (!isNum(n)) return "—";
      return fmt.num(n * 100, dp == null ? 1 : dp) + "%";
    },
    money: function (n, ccy) {
      if (!isNum(n)) return "—";
      var sym = { USD: "$", GBP: "£", EUR: "€", AED: "AED ", SGD: "S$" }[ccy || "USD"] || "";
      return sym + fmt.compact(n);
    },
    compact: function (n) {
      if (!isNum(n)) return "—";
      var abs = Math.abs(n);
      if (abs >= 1e9) return fmt.num(n / 1e9, 2) + "B";
      if (abs >= 1e6) return fmt.num(n / 1e6, 2) + "M";
      if (abs >= 1e3) return fmt.num(n / 1e3, 1) + "K";
      return fmt.num(n, abs < 10 ? 2 : 0);
    },
    /* Signed, for deltas. */
    delta: function (n, dp) {
      if (!isNum(n)) return "—";
      return (n > 0 ? "+" : "") + fmt.num(n, dp == null ? 2 : dp);
    }
  };

  GeFi.fmt = fmt;

  /* ------------------------------------------------------------------ seed */

  /* FNV-1a — stable string hash, used to seed the sample generator so a given
   * set of inputs always produces the same sample output. */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h >>> 0;
  }

  /* mulberry32 — small, fast, good enough for sample data. */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  GeFi.seed = { hash: hash, rng: rng };

  /* -------------------------------------------------------------- svg core */

  var NS = "http://www.w3.org/2000/svg";

  function svgEl(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] != null) {
        el.setAttribute(k, String(attrs[k]));
      }
    }
    return el;
  }

  function frame(w, h, label) {
    /* No height attribute: "auto" is only valid in CSS, not as an SVG
     * attribute. viewBox + preserveAspectRatio carry the ratio; the
     * .gefi-chart rule sets height:auto. */
    var svg = svgEl("svg", {
      viewBox: "0 0 " + w + " " + h,
      width: "100%",
      role: "img",
      preserveAspectRatio: "xMidYMid meet",
      "aria-label": label || "chart"
    });
    svg.setAttribute("class", "gefi-chart");
    return svg;
  }

  /* Map a numeric series into a plot box. */
  function project(values, box) {
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    if (min === max) {
      min -= 1;
      max += 1;
    }
    var pad = (max - min) * 0.08;
    min -= pad;
    max += pad;
    var n = values.length;
    return values.map(function (v, i) {
      var x = box.x + (n === 1 ? box.w / 2 : (i / (n - 1)) * box.w);
      var y = box.y + box.h - ((v - min) / (max - min)) * box.h;
      return [x, y];
    });
  }

  function pathFrom(pts) {
    return pts
      .map(function (p, i) {
        return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      })
      .join(" ");
  }

  /* ---------------------------------------------------------- primitive: gauge */

  /* Arc gauge for a 0..1 score. opts: { label, band, value2 } */
  function gauge(value, opts) {
    var o = opts || {};
    var v = clamp(isNum(value) ? value : 0, 0, 1);
    var w = 240;
    var h = 148;
    var cx = w / 2;
    var cy = 118;
    var r = 92;
    var svg = frame(w, h, o.label || "Score gauge");

    function arc(from, to, cls, width) {
      var a0 = Math.PI + Math.PI * from;
      var a1 = Math.PI + Math.PI * to;
      var x0 = cx + r * Math.cos(a0);
      var y0 = cy + r * Math.sin(a0);
      var x1 = cx + r * Math.cos(a1);
      var y1 = cy + r * Math.sin(a1);
      var large = to - from > 0.5 ? 1 : 0;
      return svgEl("path", {
        d: "M" + x0.toFixed(1) + " " + y0.toFixed(1) + " A" + r + " " + r + " 0 " + large + " 1 " + x1.toFixed(1) + " " + y1.toFixed(1),
        class: cls,
        fill: "none",
        "stroke-width": width || 14,
        "stroke-linecap": "round"
      });
    }

    svg.appendChild(arc(0, 1, "gefi-chart__track"));
    if (v > 0) svg.appendChild(arc(0, v, "gefi-chart__arc gefi-chart__arc--" + (o.band || band(v))));

    var val = svgEl("text", { x: cx, y: cy - 18, class: "gefi-chart__value", "text-anchor": "middle" });
    val.textContent = o.format ? o.format(v) : fmt.num(v, 2);
    svg.appendChild(val);

    if (o.label) {
      var lab = svgEl("text", { x: cx, y: cy + 8, class: "gefi-chart__caption", "text-anchor": "middle" });
      lab.textContent = o.label;
      svg.appendChild(lab);
    }
    return svg;
  }

  function band(v) {
    return v >= 0.66 ? "good" : v >= 0.33 ? "warn" : "bad";
  }

  /* ----------------------------------------------------------- primitive: line */

  /* Line / area chart. series: [{ name, values:[n], kind:'line'|'area' }] */
  function line(series, opts) {
    var o = opts || {};
    var w = 560;
    var h = 220;
    var box = { x: 44, y: 14, w: w - 60, h: h - 52 };
    var svg = frame(w, h, o.label || "Line chart");

    var all = [];
    series.forEach(function (s) {
      all = all.concat(s.values.filter(isNum));
    });
    if (!all.length) return svg;

    /* Horizontal gridlines + y labels. */
    var lo = Math.min.apply(null, all);
    var hi = Math.max.apply(null, all);
    for (var g = 0; g <= 3; g++) {
      var gy = box.y + (g / 3) * box.h;
      svg.appendChild(svgEl("line", { x1: box.x, y1: gy, x2: box.x + box.w, y2: gy, class: "gefi-chart__grid" }));
      var t = svgEl("text", { x: box.x - 8, y: gy + 4, class: "gefi-chart__tick", "text-anchor": "end" });
      t.textContent = fmt.compact(hi - (g / 3) * (hi - lo));
      svg.appendChild(t);
    }

    series.forEach(function (s, i) {
      var pts = project(s.values, box);
      if (s.kind === "area") {
        var floor = box.y + box.h;
        svg.appendChild(
          svgEl("path", {
            d: pathFrom(pts) + " L" + pts[pts.length - 1][0].toFixed(1) + " " + floor + " L" + pts[0][0].toFixed(1) + " " + floor + " Z",
            class: "gefi-chart__area gefi-chart__series--" + (i + 1)
          })
        );
      }
      svg.appendChild(
        svgEl("path", { d: pathFrom(pts), class: "gefi-chart__line gefi-chart__series--" + (i + 1), fill: "none" })
      );
    });

    /* X labels at the ends only — keeps it readable at tablet width. */
    if (o.xLabels && o.xLabels.length) {
      var first = svgEl("text", { x: box.x, y: h - 14, class: "gefi-chart__tick" });
      first.textContent = o.xLabels[0];
      svg.appendChild(first);
      var last = svgEl("text", { x: box.x + box.w, y: h - 14, class: "gefi-chart__tick", "text-anchor": "end" });
      last.textContent = o.xLabels[o.xLabels.length - 1];
      svg.appendChild(last);
    }
    return svg;
  }

  /* ----------------------------------------------------------- primitive: bars */

  function bars(values, opts) {
    var o = opts || {};
    var w = 560;
    var h = 200;
    var box = { x: 44, y: 14, w: w - 60, h: h - 46 };
    var svg = frame(w, h, o.label || "Bar chart");
    var nums = values.filter(isNum);
    if (!nums.length) return svg;

    var hi = Math.max.apply(null, nums.map(Math.abs));
    var bw = box.w / values.length;
    values.forEach(function (v, i) {
      if (!isNum(v)) return;
      var bh = (Math.abs(v) / hi) * box.h;
      svg.appendChild(
        svgEl("rect", {
          x: (box.x + i * bw + bw * 0.18).toFixed(1),
          y: (box.y + box.h - bh).toFixed(1),
          width: (bw * 0.64).toFixed(1),
          height: bh.toFixed(1),
          rx: 3,
          class: "gefi-chart__bar" + (v < 0 ? " gefi-chart__bar--neg" : "")
        })
      );
      if (o.labels && o.labels[i]) {
        var t = svgEl("text", {
          x: (box.x + i * bw + bw / 2).toFixed(1),
          y: h - 12,
          class: "gefi-chart__tick",
          "text-anchor": "middle"
        });
        t.textContent = o.labels[i];
        svg.appendChild(t);
      }
    });
    return svg;
  }

  /* ------------------------------------------------------ primitive: sparkline */

  function sparkline(values, opts) {
    var o = opts || {};
    var w = 120;
    var h = 32;
    var svg = frame(w, h, o.label || "Sparkline");
    var nums = values.filter(isNum);
    if (nums.length < 2) return svg;
    var pts = project(values, { x: 2, y: 3, w: w - 4, h: h - 6 });
    svg.appendChild(svgEl("path", { d: pathFrom(pts), class: "gefi-chart__spark", fill: "none" }));
    return svg;
  }

  GeFi.svg = {
    el: svgEl,
    frame: frame,
    gauge: gauge,
    line: line,
    bars: bars,
    sparkline: sparkline,
    band: band
  };

  /* --------------------------------------------------------------- registry */

  /* Model registry. ONE row per model, appended by that model's build task.
   *
   * Row shape:
   *   {
   *     slug:     "credit-oracle",          // matches _models/<slug>.md
   *     name:     "Credit Oracle",
   *     wing:     "Credit & Risk",          // ledger "Wing" column
   *     risk:     "medium",                 // low | medium | high
   *     federated: true,
   *     unit:     "PD",                     // what the headline figure means
   *     series:   [ ... ]                   // ~12 sample points for sparklines
   *   }
   *
   * Keep rows alphabetical by slug so 92 appends don't collide on the same
   * line. `series` is sample data for dashboard sparklines only — never
   * presented as a real result.
   */
  GeFi.MODELS = [
    { slug: "basel-rwa-capital-calculator", name: "Basel RWA & Capital Calculator", wing: "Banking Book & Provisioning", risk: "medium", federated: false, unit: "CET1 %", series: [13.4, 13.5, 13.6, 13.7, 13.8, 13.8, 13.9, 14.0, 14.0, 14.1, 14.2, 14.2] },
    { slug: "board-lp-report-generator", name: "Board & LP Report Generator", wing: "Generative AI", risk: "medium", federated: false, unit: "Reconciled figures", series: [0.97, 0.98, 0.98, 0.99, 0.99, 0.99, 1, 1, 1, 1, 1, 1] },
    { slug: "cecl-ifrs9-ecl-engine", name: "CECL / IFRS 9 ECL Engine", wing: "Banking Book & Provisioning", risk: "high", federated: false, unit: "Coverage ratio %", series: [1.42, 1.45, 1.48, 1.51, 1.55, 1.58, 1.61, 1.63, 1.66, 1.69, 1.72, 1.74] },
    { slug: "claim-fraud-vision", name: "Claim Fraud Vision", wing: "Fraud & AML", risk: "low", federated: true, unit: "Detection AUC", series: [0.72, 0.73, 0.74, 0.74, 0.75, 0.76, 0.76, 0.77, 0.78, 0.78, 0.79, 0.79] },
    { slug: "commodities-flow-nowcast", name: "Commodities Flow Nowcast", wing: "Investing & Macro", risk: "medium", federated: false, unit: "Flow RMSE %", series: [9.1, 8.8, 8.6, 8.4, 8.2, 8.1, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4] },
    { slug: "credit-oracle", name: "Credit Oracle", wing: "Credit & Risk", risk: "medium", federated: true, unit: "AUC", series: [0.79, 0.8, 0.81, 0.8, 0.82, 0.83, 0.83, 0.84, 0.84, 0.83, 0.84, 0.84] },
    { slug: "cross-border-payment-router", name: "Cross-Border Payment Router", wing: "Trade, Payments & KYB", risk: "low", federated: false, unit: "Landed cost %", series: [2.4, 2.35, 2.3, 2.28, 2.22, 2.18, 2.15, 2.1, 2.06, 2.02, 1.98, 1.95] },
    { slug: "deposit-behavior-model", name: "Deposit Behavior Model", wing: "Banking Book & Provisioning", risk: "medium", federated: false, unit: "Backtest error %", series: [4.8, 4.6, 4.4, 4.3, 4.1, 4.0, 3.9, 3.7, 3.6, 3.5, 3.4, 3.3] },
    { slug: "disclosure-drafter", name: "Disclosure Drafter", wing: "Generative AI", risk: "high", federated: false, unit: "Checklist coverage", series: [0.9, 0.91, 0.92, 0.93, 0.94, 0.94, 0.95, 0.96, 0.96, 0.97, 0.97, 0.98] },
    { slug: "esg-materiality-scorer", name: "ESG Materiality Scorer", wing: "ESG", risk: "medium", federated: true, unit: "Topic coverage", series: [0.71, 0.73, 0.75, 0.77, 0.79, 0.8, 0.82, 0.83, 0.85, 0.86, 0.87, 0.88] },
    { slug: "fraud-graph", name: "Fraud Graph", wing: "Fraud & AML", risk: "low", federated: false, unit: "Recall @0.1% FPR", series: [0.66, 0.67, 0.68, 0.69, 0.7, 0.7, 0.71, 0.72, 0.72, 0.73, 0.74, 0.74] },
    { slug: "gefi-copilot", name: "GeFi Copilot", wing: "Generative AI", risk: "medium", federated: false, unit: "Grounded claims", series: [0.94, 0.95, 0.95, 0.96, 0.96, 0.97, 0.97, 0.97, 0.98, 0.98, 0.98, 0.98] },
    { slug: "ic-credit-memo-generator", name: "IC & Credit Memo Generator", wing: "Generative AI", risk: "medium", federated: false, unit: "Grounded figures", series: [0.96, 0.97, 0.97, 0.98, 0.98, 0.99, 0.99, 0.99, 1, 1, 1, 1] },
    { slug: "irrbb-alm-modeler", name: "IRRBB / ALM Modeler", wing: "Banking Book & Provisioning", risk: "high", federated: false, unit: "EVE sensitivity %", series: [-8.2, -8.0, -7.9, -7.7, -7.5, -7.4, -7.2, -7.1, -6.9, -6.8, -6.6, -6.5] },
    { slug: "kyb-graph", name: "KYB Graph", wing: "Trade, Payments & KYB", risk: "low", federated: false, unit: "UBO resolution", series: [0.84, 0.85, 0.85, 0.86, 0.87, 0.88, 0.88, 0.89, 0.9, 0.9, 0.91, 0.91] },
    { slug: "liquidity-stress-engine", name: "Liquidity Stress Engine", wing: "Credit & Risk", risk: "high", federated: false, unit: "LCR %", series: [148, 144, 138, 131, 124, 118, 115, 113, 112, 114, 117, 121] },
    { slug: "macro-nowcast", name: "Macro Nowcast", wing: "Investing & Macro", risk: "medium", federated: false, unit: "RMSE", series: [0.42, 0.4, 0.39, 0.38, 0.37, 0.36, 0.36, 0.35, 0.34, 0.34, 0.33, 0.33] },
    { slug: "mortgage-default-prepay", name: "Mortgage Default & Prepay", wing: "Credit & Risk", risk: "medium", federated: true, unit: "Default AUC", series: [0.76, 0.77, 0.77, 0.78, 0.78, 0.79, 0.79, 0.8, 0.8, 0.81, 0.81, 0.81] },
    { slug: "portfolio-optimiser", name: "Portfolio Optimiser", wing: "Investing & Macro", risk: "medium", federated: true, unit: "Sharpe", series: [1.02, 1.05, 1.04, 1.09, 1.12, 1.1, 1.15, 1.18, 1.17, 1.2, 1.22, 1.24] },
    { slug: "regulatory-change-summariser", name: "Regulatory Change Summariser", wing: "Compliance & Regulatory", risk: "low", federated: false, unit: "Delivery success", series: [0.981, 0.983, 0.985, 0.986, 0.988, 0.99, 0.991, 0.992, 0.993, 0.994, 0.995, 0.996] },
    { slug: "scenario-narrative-engine", name: "Scenario Narrative Engine", wing: "Generative AI", risk: "medium", federated: false, unit: "Consistent claims", series: [0.95, 0.96, 0.96, 0.97, 0.98, 0.98, 0.98, 0.99, 0.99, 0.99, 1, 1] },
    { slug: "sentiment-from-filings", name: "Sentiment from Filings", wing: "Investing & Macro", risk: "low", federated: false, unit: "F1", series: [0.68, 0.7, 0.71, 0.72, 0.74, 0.75, 0.75, 0.76, 0.77, 0.78, 0.78, 0.79] },
    { slug: "tax-residency-classifier", name: "Tax Residency Classifier", wing: "Compliance & Regulatory", risk: "low", federated: false, unit: "Backtest agreement", series: [0.89, 0.9, 0.9, 0.91, 0.91, 0.92, 0.92, 0.93, 0.93, 0.94, 0.94, 0.94] },
    { slug: "trade-finance-doc-ai", name: "Trade Finance Doc AI", wing: "Trade, Payments & KYB", risk: "low", federated: false, unit: "Accuracy", series: [0.88, 0.89, 0.9, 0.9, 0.91, 0.92, 0.92, 0.93, 0.93, 0.94, 0.94, 0.95] },
    { slug: "transaction-monitoring-explainer", name: "Transaction Monitoring Explainer", wing: "Fraud & AML", risk: "medium", federated: false, unit: "Alerts explained", series: [0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1, 1, 1, 1] },
    { slug: "vendor-risk-aiops", name: "Vendor Risk AIOps", wing: "Credit & Risk", risk: "low", federated: false, unit: "Alert precision", series: [0.78, 0.79, 0.8, 0.81, 0.82, 0.82, 0.83, 0.84, 0.84, 0.85, 0.85, 0.86] },
    { slug: "yield-curve-forecaster", name: "Yield-Curve Forecaster", wing: "Investing & Macro", risk: "low", federated: false, unit: "10y RMSE bp", series: [27, 26, 25, 25, 24, 23, 23, 22, 22, 21, 21, 21] }
  ];

  GeFi.model = function (slug) {
    for (var i = 0; i < GeFi.MODELS.length; i++) {
      if (GeFi.MODELS[i].slug === slug) return GeFi.MODELS[i];
    }
    return null;
  };
})(window, document);
