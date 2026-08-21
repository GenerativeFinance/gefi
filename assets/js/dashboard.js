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

  /* ------------------------------------------------------ primitive: network */

  /* Hub-and-spoke diagram for a federated network of n participants. */
  function network(count, opts) {
    var o = opts || {};
    var n = Math.max(0, Math.min(60, count | 0));
    var w = 320;
    var h = 220;
    var cx = w / 2;
    var cy = h / 2;
    var r = 82;
    var svg = frame(w, h, (o.label || "network") + " diagram");

    for (var i = 0; i < n; i++) {
      var a = (i / n) * 2 * Math.PI - Math.PI / 2;
      var x = cx + r * Math.cos(a);
      var y = cy + r * Math.sin(a);
      svg.appendChild(svgEl("line", { x1: cx, y1: cy, x2: x.toFixed(1), y2: y.toFixed(1), class: "gefi-chart__spoke" }));
      svg.appendChild(svgEl("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: 7, class: "gefi-chart__node" }));
    }
    svg.appendChild(svgEl("circle", { cx: cx, cy: cy, r: 24, class: "gefi-chart__hub" }));
    var t = svgEl("text", { x: cx, y: cy + 4, class: "gefi-chart__hub-label", "text-anchor": "middle" });
    t.textContent = o.hubLabel || "GeFi";
    svg.appendChild(t);
    var cap = svgEl("text", { x: cx, y: h - 6, class: "gefi-chart__caption", "text-anchor": "middle" });
    cap.textContent = n + " " + (o.label || "participants");
    svg.appendChild(cap);
    return svg;
  }

  GeFi.svg = {
    el: svgEl,
    frame: frame,
    gauge: gauge,
    line: line,
    bars: bars,
    sparkline: sparkline,
    network: network,
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
    { slug: "accretion-dilution", name: "Accretion / Dilution", wing: "M&A & Corporate Transactions", risk: "medium", federated: false, unit: "Yr1 accretion %", series: [0.4, 0.6, 0.9, 1.1, 1.4, 1.6, 1.9, 2.1, 2.3, 2.5, 2.7, 2.9] },
    { slug: "alt-data-alpha-scanner", name: "Alternative Data Alpha Scanner", wing: "ML & Alternative Data", risk: "medium", federated: true, unit: "Source IC", series: [0.06, 0.062, 0.058, 0.064, 0.066, 0.06, 0.063, 0.067, 0.061, 0.065, 0.068, 0.063] },
    { slug: "basel-rwa-capital-calculator", name: "Basel RWA & Capital Calculator", wing: "Banking Book & Provisioning", risk: "medium", federated: false, unit: "CET1 %", series: [13.4, 13.5, 13.6, 13.7, 13.8, 13.8, 13.9, 14.0, 14.0, 14.1, 14.2, 14.2] },
    { slug: "board-lp-report-generator", name: "Board & LP Report Generator", wing: "Generative AI", risk: "medium", federated: false, unit: "Reconciled figures", series: [0.97, 0.98, 0.98, 0.99, 0.99, 0.99, 1, 1, 1, 1, 1, 1] },
    { slug: "breakout-signal-engine", name: "Breakout Signal Engine", wing: "Directional Strategies", risk: "medium", federated: false, unit: "Hit rate", series: [0.38, 0.4, 0.37, 0.41, 0.43, 0.39, 0.42, 0.44, 0.41, 0.45, 0.43, 0.46] },
    { slug: "calendar-spread-optimizer", name: "Calendar Spread Optimizer", wing: "Relative-Value & Arbitrage", risk: "medium", federated: false, unit: "Roll yield %", series: [1.8, 1.9, 1.7, 2.0, 2.1, 1.8, 2.0, 2.2, 1.9, 2.1, 2.3, 2.0] },
    { slug: "cap-table-manager", name: "Cap Table Manager", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Founder %", series: [62, 60, 58, 56, 54, 52, 50, 49, 47, 46, 44, 43] },
    { slug: "capital-budgeting-engine", name: "Capital Budgeting Engine", wing: "Capital Budgeting & Project Finance", risk: "low", federated: false, unit: "Portfolio NPV", series: [18, 19, 21, 22, 24, 25, 27, 28, 30, 31, 33, 34] },
    { slug: "carry-trade-optimizer", name: "Carry Trade Optimizer", wing: "Directional Strategies", risk: "medium", federated: false, unit: "Adj. carry", series: [0.51, 0.54, 0.56, 0.53, 0.58, 0.6, 0.57, 0.62, 0.64, 0.61, 0.66, 0.68] },
    { slug: "carve-out-model", name: "Carve-Out Model", wing: "M&A & Corporate Transactions", risk: "medium", federated: false, unit: "Standalone EBITDA %", series: [11.8, 12.0, 12.1, 12.3, 12.4, 12.6, 12.7, 12.9, 13.0, 13.2, 13.3, 13.5] },
    { slug: "cecl-ifrs9-ecl-engine", name: "CECL / IFRS 9 ECL Engine", wing: "Banking Book & Provisioning", risk: "high", federated: false, unit: "Coverage ratio %", series: [1.42, 1.45, 1.48, 1.51, 1.55, 1.58, 1.61, 1.63, 1.66, 1.69, 1.72, 1.74] },
    { slug: "claim-fraud-vision", name: "Claim Fraud Vision", wing: "Fraud & AML", risk: "low", federated: true, unit: "Detection AUC", series: [0.72, 0.73, 0.74, 0.74, 0.75, 0.76, 0.76, 0.77, 0.78, 0.78, 0.79, 0.79] },
    { slug: "commodities-flow-nowcast", name: "Commodities Flow Nowcast", wing: "Investing & Macro", risk: "medium", federated: false, unit: "Flow RMSE %", series: [9.1, 8.8, 8.6, 8.4, 8.2, 8.1, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4] },
    { slug: "convertible-arbitrage-modeler", name: "Convertible Arbitrage Modeler", wing: "Relative-Value & Arbitrage", risk: "medium", federated: false, unit: "Vol gap (pts)", series: [2.1, 2.3, 2.0, 2.4, 2.6, 2.2, 2.5, 2.7, 2.3, 2.8, 2.9, 2.6] },
    { slug: "credit-oracle", name: "Credit Oracle", wing: "Credit & Risk", risk: "medium", federated: true, unit: "AUC", series: [0.79, 0.8, 0.81, 0.8, 0.82, 0.83, 0.83, 0.84, 0.84, 0.83, 0.84, 0.84] },
    { slug: "cross-border-payment-router", name: "Cross-Border Payment Router", wing: "Trade, Payments & KYB", risk: "low", federated: false, unit: "Landed cost %", series: [2.4, 2.35, 2.3, 2.28, 2.22, 2.18, 2.15, 2.1, 2.06, 2.02, 1.98, 1.95] },
    { slug: "cross-sectional-mean-reversion", name: "Cross-Sectional Mean Reversion", wing: "Directional Strategies", risk: "medium", federated: false, unit: "Sharpe (sim.)", series: [0.52, 0.55, 0.58, 0.54, 0.6, 0.62, 0.59, 0.64, 0.66, 0.63, 0.68, 0.7] },
    { slug: "debt-schedule-engine", name: "Debt Schedule Engine", wing: "Corporate Treasury & Structured Finance", risk: "medium", federated: false, unit: "Headroom %", series: [26, 25, 24, 23, 22, 21, 21, 20, 19, 18, 18, 17] },
    { slug: "defi-protocol-risk-scorer", name: "DeFi Protocol Risk Scorer", wing: "Crypto & DeFi", risk: "high", federated: false, unit: "Composite risk", series: [0.42, 0.41, 0.43, 0.4, 0.39, 0.41, 0.38, 0.4, 0.37, 0.39, 0.36, 0.38] },
    { slug: "deposit-behavior-model", name: "Deposit Behavior Model", wing: "Banking Book & Provisioning", risk: "medium", federated: false, unit: "Backtest error %", series: [4.8, 4.6, 4.4, 4.3, 4.1, 4.0, 3.9, 3.7, 3.6, 3.5, 3.4, 3.3] },
    { slug: "disclosure-drafter", name: "Disclosure Drafter", wing: "Generative AI", risk: "high", federated: false, unit: "Checklist coverage", series: [0.9, 0.91, 0.92, 0.93, 0.94, 0.94, 0.95, 0.96, 0.96, 0.97, 0.97, 0.98] },
    { slug: "esg-materiality-scorer", name: "ESG Materiality Scorer", wing: "ESG", risk: "medium", federated: true, unit: "Topic coverage", series: [0.71, 0.73, 0.75, 0.77, 0.79, 0.8, 0.82, 0.83, 0.85, 0.86, 0.87, 0.88] },
    { slug: "fixed-income-arbitrage-engine", name: "Fixed Income Arbitrage Engine", wing: "Relative-Value & Arbitrage", risk: "high", federated: false, unit: "Basis (bp)", series: [3.2, 3.5, 3.1, 3.7, 3.9, 3.4, 3.8, 4.0, 3.6, 4.1, 4.3, 3.9] },
    { slug: "follow-on-advisor", name: "Follow-On Advisor", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Reserve efficiency", series: [0.62, 0.64, 0.65, 0.67, 0.68, 0.7, 0.71, 0.73, 0.74, 0.76, 0.77, 0.79] },
    { slug: "fraud-graph", name: "Fraud Graph", wing: "Fraud & AML", risk: "low", federated: false, unit: "Recall @0.1% FPR", series: [0.66, 0.67, 0.68, 0.69, 0.7, 0.7, 0.71, 0.72, 0.72, 0.73, 0.74, 0.74] },
    { slug: "fund-cash-flow-modeler", name: "Fund Cash-Flow Modeler", wing: "Private Funds", risk: "medium", federated: false, unit: "Unfunded %", series: [72, 66, 61, 55, 50, 45, 40, 35, 31, 27, 23, 20] },
    { slug: "fund-performance-engine", name: "Fund Performance Engine", wing: "Private Funds", risk: "medium", federated: true, unit: "Net TVPI", series: [1.1, 1.2, 1.3, 1.45, 1.55, 1.65, 1.75, 1.85, 1.95, 2.05, 2.15, 2.2] },
    { slug: "fx-triangular-arbitrage-scanner", name: "FX Triangular Arbitrage Scanner", wing: "Relative-Value & Arbitrage", risk: "medium", federated: false, unit: "Net-viable windows/day", series: [2, 3, 1, 2, 4, 2, 3, 2, 1, 3, 4, 2] },
    { slug: "gefi-copilot", name: "GeFi Copilot", wing: "Generative AI", risk: "medium", federated: false, unit: "Grounded claims", series: [0.94, 0.95, 0.95, 0.96, 0.96, 0.97, 0.97, 0.97, 0.98, 0.98, 0.98, 0.98] },
    { slug: "global-macro-signal-engine", name: "Global Macro Signal Engine", wing: "Directional Strategies", risk: "medium", federated: true, unit: "Sharpe (sim.)", series: [0.44, 0.47, 0.5, 0.46, 0.52, 0.55, 0.51, 0.57, 0.59, 0.56, 0.61, 0.63] },
    { slug: "gradient-boosted-alpha-engine", name: "Gradient-Boosted Alpha Engine", wing: "ML & Alternative Data", risk: "medium", federated: false, unit: "OOS IC", series: [0.041, 0.043, 0.04, 0.045, 0.047, 0.042, 0.046, 0.048, 0.043, 0.047, 0.05, 0.045] },
    { slug: "growth-equity-model", name: "Growth Equity Model", wing: "Venture & Growth Capital", risk: "medium", federated: false, unit: "Investor MOIC", series: [2.1, 2.15, 2.2, 2.25, 2.3, 2.35, 2.4, 2.45, 2.5, 2.55, 2.6, 2.65] },
    { slug: "hft-signal-research-engine", name: "HFT Signal Research Engine", wing: "Market Microstructure", risk: "high", federated: false, unit: "Edge at 200us (bp)", series: [1.8, 1.9, 1.7, 2.0, 2.1, 1.8, 2.0, 2.2, 1.9, 2.1, 2.3, 2.0] },
    { slug: "ic-credit-memo-generator", name: "IC & Credit Memo Generator", wing: "Generative AI", risk: "medium", federated: false, unit: "Grounded figures", series: [0.96, 0.97, 0.97, 0.98, 0.98, 0.99, 0.99, 0.99, 1, 1, 1, 1] },
    { slug: "infrastructure-investment-modeler", name: "Infrastructure Investment Modeler", wing: "Capital Budgeting & Project Finance", risk: "high", federated: false, unit: "Equity IRR %", series: [11.2, 11.4, 11.5, 11.7, 11.8, 12.0, 12.1, 12.3, 12.4, 12.6, 12.7, 12.9] },
    { slug: "ipo-model", name: "IPO Model", wing: "Venture & Growth Capital", risk: "high", federated: false, unit: "Implied multiple", series: [6.2, 6.4, 6.5, 6.7, 6.8, 7.0, 7.1, 7.3, 7.4, 7.6, 7.7, 7.9] },
    { slug: "irrbb-alm-modeler", name: "IRRBB / ALM Modeler", wing: "Banking Book & Provisioning", risk: "high", federated: false, unit: "EVE sensitivity %", series: [-8.2, -8.0, -7.9, -7.7, -7.5, -7.4, -7.2, -7.1, -6.9, -6.8, -6.6, -6.5] },
    { slug: "kyb-graph", name: "KYB Graph", wing: "Trade, Payments & KYB", risk: "low", federated: false, unit: "UBO resolution", series: [0.84, 0.85, 0.85, 0.86, 0.87, 0.88, 0.88, 0.89, 0.9, 0.9, 0.91, 0.91] },
    { slug: "lbo-model", name: "LBO Model", wing: "M&A & Corporate Transactions", risk: "high", federated: false, unit: "Sponsor IRR %", series: [18.2, 18.6, 19.1, 19.4, 19.8, 20.1, 20.5, 20.8, 21.2, 21.5, 21.9, 22.2] },
    { slug: "lease-vs-buy-analyzer", name: "Lease vs. Buy Analyzer", wing: "Real Estate", risk: "low", federated: false, unit: "NPV delta %", series: [3.2, 3.4, 3.5, 3.7, 3.8, 4.0, 4.1, 4.3, 4.4, 4.6, 4.7, 4.9] },
    { slug: "liquidation-valuation", name: "Liquidation Valuation", wing: "Valuation (advanced)", risk: "medium", federated: false, unit: "Recovery %", series: [0.41, 0.4, 0.39, 0.38, 0.38, 0.37, 0.36, 0.36, 0.35, 0.35, 0.34, 0.34] },
    { slug: "liquidity-stress-engine", name: "Liquidity Stress Engine", wing: "Credit & Risk", risk: "high", federated: false, unit: "LCR %", series: [148, 144, 138, 131, 124, 118, 115, 113, 112, 114, 117, 121] },
    { slug: "lp-treasury-cash-management", name: "LP Treasury & Cash Management", wing: "Simulation & Market Primitives", risk: "medium", federated: false, unit: "Coverage prob.", series: [0.93, 0.94, 0.94, 0.95, 0.95, 0.96, 0.96, 0.97, 0.97, 0.97, 0.98, 0.98] },
    { slug: "macro-nowcast", name: "Macro Nowcast", wing: "Investing & Macro", risk: "medium", federated: false, unit: "RMSE", series: [0.42, 0.4, 0.39, 0.38, 0.37, 0.36, 0.36, 0.35, 0.34, 0.34, 0.33, 0.33] },
    { slug: "market-making-engine", name: "Market Making Engine", wing: "Market Microstructure", risk: "high", federated: false, unit: "Spread capture bp", series: [3.1, 3.3, 3.0, 3.4, 3.6, 3.2, 3.5, 3.7, 3.3, 3.6, 3.8, 3.5] },
    { slug: "mbo-model", name: "MBO Model", wing: "M&A & Corporate Transactions", risk: "medium", federated: false, unit: "Mgmt effective %", series: [11.2, 11.5, 11.8, 12.0, 12.3, 12.5, 12.8, 13.0, 13.3, 13.5, 13.8, 14.0] },
    { slug: "merger-arbitrage-tracker", name: "Merger Arbitrage Tracker", wing: "Relative-Value & Arbitrage", risk: "high", federated: false, unit: "Completion prob.", series: [0.86, 0.87, 0.85, 0.88, 0.89, 0.86, 0.88, 0.9, 0.87, 0.89, 0.91, 0.88] },
    { slug: "merger-model", name: "Merger Model", wing: "M&A & Corporate Transactions", risk: "high", federated: false, unit: "Accretion %", series: [1.2, 1.4, 1.5, 1.7, 1.9, 2.0, 2.2, 2.3, 2.5, 2.6, 2.8, 2.9] },
    { slug: "momentum-factor-screener", name: "Momentum Factor Screener", wing: "Factor & Systematic", risk: "low", federated: false, unit: "12m momentum %", series: [8.2, 8.6, 8.0, 9.1, 9.5, 8.4, 9.3, 9.8, 8.7, 9.6, 10.1, 9.2] },
    { slug: "monte-carlo-simulation-service", name: "Monte Carlo Simulation Service", wing: "Simulation & Market Primitives", risk: "low", federated: false, unit: "Convergence", series: [0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.96, 0.97, 0.98, 0.98, 0.99] },
    { slug: "mortgage-default-prepay", name: "Mortgage Default & Prepay", wing: "Credit & Risk", risk: "medium", federated: true, unit: "Default AUC", series: [0.76, 0.77, 0.77, 0.78, 0.78, 0.79, 0.79, 0.8, 0.8, 0.81, 0.81, 0.81] },
    { slug: "multifactor-ranking-engine", name: "Multifactor Ranking Engine", wing: "Factor & Systematic", risk: "low", federated: false, unit: "Composite score", series: [0.58, 0.6, 0.57, 0.62, 0.64, 0.59, 0.63, 0.65, 0.6, 0.64, 0.67, 0.62] },
    { slug: "options-vol-arb-engine", name: "Options Volatility Arbitrage Engine", wing: "Relative-Value & Arbitrage", risk: "high", federated: false, unit: "Mispricing (vol pts)", series: [1.6, 1.8, 1.5, 1.9, 2.0, 1.7, 1.9, 2.1, 1.8, 2.0, 2.2, 1.9] },
    { slug: "pairs-trading-engine", name: "Pairs Trading Engine", wing: "Relative-Value & Arbitrage", risk: "medium", federated: false, unit: "Median half-life (d)", series: [14, 13, 15, 12, 14, 13, 12, 14, 13, 11, 12, 13] },
    { slug: "portfolio-optimiser", name: "Portfolio Optimiser", wing: "Investing & Macro", risk: "medium", federated: true, unit: "Sharpe", series: [1.02, 1.05, 1.04, 1.09, 1.12, 1.1, 1.15, 1.18, 1.17, 1.2, 1.22, 1.24] },
    { slug: "project-finance-modeler", name: "Project Finance Modeler", wing: "Capital Budgeting & Project Finance", risk: "high", federated: false, unit: "Min DSCR", series: [1.22, 1.24, 1.25, 1.27, 1.28, 1.3, 1.31, 1.33, 1.34, 1.36, 1.37, 1.39] },
    { slug: "purchase-price-allocation", name: "Purchase Price Allocation", wing: "M&A & Corporate Transactions", risk: "medium", federated: false, unit: "Goodwill share %", series: [46, 45, 45, 44, 43, 43, 42, 42, 41, 41, 40, 40] },
    { slug: "re-acquisition-underwriter", name: "RE Acquisition Underwriter", wing: "Real Estate", risk: "low", federated: true, unit: "Cash-on-cash %", series: [6.1, 6.2, 6.4, 6.5, 6.7, 6.8, 7.0, 7.1, 7.3, 7.4, 7.6, 7.7] },
    { slug: "re-development-modeler", name: "RE Development Modeler", wing: "Real Estate", risk: "medium", federated: false, unit: "Developer IRR %", series: [14.2, 14.5, 14.8, 15.0, 15.3, 15.6, 15.8, 16.1, 16.4, 16.6, 16.9, 17.2] },
    { slug: "real-options-valuation", name: "Real Options Valuation", wing: "Valuation (advanced)", risk: "medium", federated: false, unit: "Flex premium", series: [0.18, 0.19, 0.2, 0.21, 0.22, 0.22, 0.23, 0.24, 0.24, 0.25, 0.26, 0.26] },
    { slug: "recapitalization-model", name: "Recapitalization", wing: "M&A & Corporate Transactions", risk: "medium", federated: false, unit: "Headroom %", series: [22, 21, 20, 19, 18, 18, 17, 16, 16, 15, 15, 14] },
    { slug: "regulatory-change-summariser", name: "Regulatory Change Summariser", wing: "Compliance & Regulatory", risk: "low", federated: false, unit: "Delivery success", series: [0.981, 0.983, 0.985, 0.986, 0.988, 0.99, 0.991, 0.992, 0.993, 0.994, 0.995, 0.996] },
    { slug: "renewable-project-modeler", name: "Renewable Project Modeler", wing: "Capital Budgeting & Project Finance", risk: "medium", federated: false, unit: "Capacity factor %", series: [30.2, 30.4, 30.5, 30.7, 30.8, 31.0, 31.1, 31.2, 31.4, 31.5, 31.6, 31.8] },
    { slug: "reserving-engine", name: "Reserving Engine", wing: "Insurance & Actuarial", risk: "medium", federated: false, unit: "CL/BF divergence %", series: [6.2, 5.9, 6.1, 5.6, 5.4, 5.7, 5.2, 5.0, 5.3, 4.9, 4.7, 5.0] },
    { slug: "reversal-detector", name: "Reversal Detector", wing: "Directional Strategies", risk: "medium", federated: false, unit: "Accuracy", series: [0.31, 0.33, 0.3, 0.34, 0.36, 0.33, 0.35, 0.37, 0.34, 0.38, 0.36, 0.39] },
    { slug: "risk-parity-allocator", name: "Risk Parity Allocator", wing: "Factor & Systematic", risk: "medium", federated: true, unit: "Realised vol %", series: [8.4, 8.2, 8.5, 8.1, 7.9, 8.3, 8.0, 7.8, 8.2, 7.9, 7.7, 8.0] },
    { slug: "rl-execution-agent", name: "RL Execution Agent", wing: "ML & Alternative Data", risk: "high", federated: false, unit: "Sim. savings bp", series: [3.2, 3.4, 3.1, 3.5, 3.7, 3.3, 3.6, 3.8, 3.4, 3.7, 3.9, 3.6] },
    { slug: "safe-note-conversion", name: "SAFE & Note Conversion", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Conversion %", series: [8.2, 8.6, 9.0, 9.4, 9.8, 10.1, 10.5, 10.9, 11.2, 11.6, 11.9, 12.3] },
    { slug: "scenario-narrative-engine", name: "Scenario Narrative Engine", wing: "Generative AI", risk: "medium", federated: false, unit: "Consistent claims", series: [0.95, 0.96, 0.96, 0.97, 0.98, 0.98, 0.98, 0.99, 0.99, 0.99, 1, 1] },
    { slug: "securitization-modeler", name: "Securitization Modeler", wing: "Corporate Treasury & Structured Finance", risk: "high", federated: false, unit: "Class A enhancement %", series: [22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27] },
    { slug: "sentiment-from-filings", name: "Sentiment from Filings", wing: "Investing & Macro", risk: "low", federated: false, unit: "F1", series: [0.68, 0.7, 0.71, 0.72, 0.74, 0.75, 0.75, 0.76, 0.77, 0.78, 0.78, 0.79] },
    { slug: "spin-off-model", name: "Spin-Off Model", wing: "M&A & Corporate Transactions", risk: "medium", federated: false, unit: "Stranded cost %", series: [4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6, 3.6, 3.5, 3.4, 3.3, 3.3] },
    { slug: "stablecoin-depeg-monitor", name: "Stablecoin Depeg Monitor", wing: "Crypto & DeFi", risk: "medium", federated: false, unit: "Peg deviation bp", series: [4, 3, 5, 3, 2, 4, 6, 3, 2, 3, 4, 3] },
    { slug: "startup-financial-model", name: "Startup Financial Model", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Runway months", series: [21, 20, 19, 19, 18, 17, 17, 16, 16, 15, 15, 14] },
    { slug: "startup-runway-tracker", name: "Startup Runway Tracker", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Runway months", series: [18, 17, 17, 16, 16, 15, 15, 14, 14, 13, 13, 12] },
    { slug: "statistical-arbitrage-engine", name: "Statistical Arbitrage Engine", wing: "Relative-Value & Arbitrage", risk: "medium", federated: true, unit: "Sharpe (sim.)", series: [0.68, 0.71, 0.66, 0.73, 0.75, 0.69, 0.74, 0.77, 0.71, 0.78, 0.8, 0.75] },
    { slug: "strategy-construction-engine", name: "Strategy Construction Engine", wing: "Strategy Infrastructure", risk: "medium", federated: false, unit: "Cost drag bp", series: [12, 11.6, 11.9, 11.2, 10.9, 11.3, 10.6, 10.3, 10.7, 10.1, 9.8, 10.2] },
    { slug: "tax-residency-classifier", name: "Tax Residency Classifier", wing: "Compliance & Regulatory", risk: "low", federated: false, unit: "Backtest agreement", series: [0.89, 0.9, 0.9, 0.91, 0.91, 0.92, 0.92, 0.93, 0.93, 0.94, 0.94, 0.94] },
    { slug: "trade-finance-doc-ai", name: "Trade Finance Doc AI", wing: "Trade, Payments & KYB", risk: "low", federated: false, unit: "Accuracy", series: [0.88, 0.89, 0.9, 0.9, 0.91, 0.92, 0.92, 0.93, 0.93, 0.94, 0.94, 0.95] },
    { slug: "transaction-monitoring-explainer", name: "Transaction Monitoring Explainer", wing: "Fraud & AML", risk: "medium", federated: false, unit: "Alerts explained", series: [0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1, 1, 1, 1] },
    { slug: "transformer-sentiment-alpha", name: "Transformer Sentiment Alpha", wing: "ML & Alternative Data", risk: "medium", federated: false, unit: "Sharpe (sim.)", series: [0.55, 0.58, 0.53, 0.6, 0.62, 0.56, 0.61, 0.64, 0.58, 0.62, 0.66, 0.6] },
    { slug: "trend-following-engine", name: "Trend Following Engine", wing: "Directional Strategies", risk: "medium", federated: false, unit: "Sharpe (sim.)", series: [0.61, 0.64, 0.6, 0.67, 0.7, 0.66, 0.72, 0.75, 0.71, 0.78, 0.8, 0.77] },
    { slug: "underwriting-pricing-engine", name: "Underwriting Pricing Engine", wing: "Insurance & Actuarial", risk: "medium", federated: false, unit: "Rate adequacy %", series: [96, 97, 96, 98, 99, 97, 99, 100, 98, 100, 101, 99] },
    { slug: "value-low-vol-screener", name: "Value & Low-Volatility Screener", wing: "Factor & Systematic", risk: "low", federated: false, unit: "Book-to-price", series: [1.12, 1.15, 1.1, 1.18, 1.21, 1.13, 1.19, 1.23, 1.14, 1.2, 1.25, 1.17] },
    { slug: "vc-method-valuation", name: "VC Method Valuation", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Implied pre-money", series: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
    { slug: "vc-portfolio-tracker", name: "VC Portfolio Tracker", wing: "Venture & Growth Capital", risk: "low", federated: true, unit: "TVPI", series: [1.9, 2.0, 2.05, 2.1, 2.2, 2.25, 2.3, 2.4, 2.45, 2.5, 2.6, 2.65] },
    { slug: "vendor-risk-aiops", name: "Vendor Risk AIOps", wing: "Credit & Risk", risk: "low", federated: false, unit: "Alert precision", series: [0.78, 0.79, 0.8, 0.81, 0.82, 0.82, 0.83, 0.84, 0.84, 0.85, 0.85, 0.86] },
    { slug: "volatility-surface-service", name: "Volatility Surface Service", wing: "Simulation & Market Primitives", risk: "medium", federated: false, unit: "Fit R2", series: [0.955, 0.958, 0.961, 0.963, 0.966, 0.968, 0.971, 0.973, 0.975, 0.977, 0.979, 0.981] },
    { slug: "wallet-risk-scorer", name: "Wallet Risk Scorer", wing: "Crypto & DeFi", risk: "medium", federated: false, unit: "FP rate %", series: [8.2, 7.9, 8.1, 7.6, 7.3, 7.7, 7.1, 6.8, 7.2, 6.6, 6.4, 6.7] },
    { slug: "waterfall-distribution", name: "Waterfall Distribution Engine", wing: "Venture & Growth Capital", risk: "medium", federated: false, unit: "Common share %", series: [12, 13, 15, 16, 18, 19, 21, 22, 24, 25, 27, 28] },
    { slug: "working-capital-forecaster", name: "Working Capital Forecaster", wing: "Corporate Treasury & Structured Finance", risk: "low", federated: false, unit: "CCC days", series: [86, 85, 84, 83, 82, 82, 81, 80, 80, 79, 79, 78] },
    { slug: "yield-curve-forecaster", name: "Yield-Curve Forecaster", wing: "Investing & Macro", risk: "low", federated: false, unit: "10y RMSE bp", series: [27, 26, 25, 25, 24, 23, 23, 22, 22, 21, 21, 21] }
  ];

  GeFi.model = function (slug) {
    for (var i = 0; i < GeFi.MODELS.length; i++) {
      if (GeFi.MODELS[i].slug === slug) return GeFi.MODELS[i];
    }
    return null;
  };
})(window, document);

/* ==================================================================
 * Dashboard preview app (Task 111). Runs only on /dashboard/ — the
 * [data-dash-root] guard makes this a no-op on every other page that
 * loads this file for the primitives and registry above.
 * ================================================================== */
(function (window, document) {
  "use strict";

  var GeFi = window.GeFi;
  var root = document.querySelector("[data-dash-root]");
  var gate = document.querySelector("[data-dash-gate]");
  if (!root || !gate || !GeFi) return;

  var GATE_KEY = "gefi-dash-preview";

  /* ------------------------------------------------------------- gate */

  function gated() {
    try {
      return window.sessionStorage && sessionStorage.getItem(GATE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function show(section) {
    gate.hidden = section !== "gate";
    root.hidden = section !== "app";
  }

  gate.addEventListener("click", function (e) {
    if (!e.target.closest("[data-dash-enter]")) return;
    try {
      sessionStorage.setItem(GATE_KEY, "1");
    } catch (err) {
      /* storage unavailable: still let them in for this page view */
    }
    show("app");
    boot();
  });

  root.addEventListener("click", function (e) {
    if (!e.target.closest("[data-dash-exit]")) return;
    try {
      sessionStorage.removeItem(GATE_KEY);
    } catch (err) {}
    window.location.href = "/";
  });

  /* -------------------------------------------------------------- tabs */

  var TABS = ["overview", "analytics", "compliance", "federation", "api-keys", "alerts", "tenants", "approvals", "system", "dev-models", "dev-versions", "dev-earnings"];
  var OPERATOR_TABS = ["overview", "analytics", "compliance", "federation", "api-keys", "alerts", "tenants", "approvals", "system"];
  var DEVELOPER_TABS = ["dev-models", "dev-versions", "dev-earnings"];

  var PERSONA_KEY = "gefi-dash-persona";

  function loadPersona() {
    try {
      var p = sessionStorage.getItem(PERSONA_KEY);
      if (p === "developer" || p === "operator") return p;
    } catch (e) {}
    return "operator";
  }

  function savePersona(p) {
    try {
      sessionStorage.setItem(PERSONA_KEY, p);
    } catch (e) {}
  }

  function currentTab() {
    var h = (window.location.hash || "").replace("#", "");
    if (TABS.indexOf(h) !== -1) return h;
    return loadPersona() === "developer" ? "dev-models" : "overview";
  }

  /* Persona toggle gates which sidebar groups (and therefore which tabs)
   * are reachable — this is a preview convenience, not an auth boundary. */
  function applyPersona() {
    var persona = loadPersona();
    root.querySelectorAll("[data-dash-group]").forEach(function (el) {
      var isDeveloperGroup = el.getAttribute("data-dash-group") === "developer";
      el.hidden = isDeveloperGroup !== (persona === "developer");
    });
    root.querySelectorAll("[data-dash-persona-btn]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-dash-persona-btn") === persona);
    });
    return persona;
  }

  root.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-dash-persona-btn]");
    if (!btn) return;
    var persona = btn.getAttribute("data-dash-persona-btn");
    savePersona(persona);
    applyPersona();
    var tabs = persona === "developer" ? DEVELOPER_TABS : OPERATOR_TABS;
    var rawHash = (window.location.hash || "").replace("#", "");
    if (tabs.indexOf(rawHash) === -1) {
      window.location.hash = "#" + tabs[0];
    } else {
      renderCurrent();
    }
  });

  function renderTab() {
    var tab = currentTab();
    root.querySelectorAll("[data-dash-panel]").forEach(function (p) {
      p.hidden = p.getAttribute("data-dash-panel") !== tab;
    });
    root.querySelectorAll("[data-dash-tab-link]").forEach(function (a) {
      var active = a.getAttribute("data-dash-tab-link") === tab;
      a.classList.toggle("is-active", active);
      if (active) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  function renderCurrent() {
    applyPersona();
    renderTab();
    var tab = currentTab();
    if (tab === "overview") renderOverview();
    if (tab === "api-keys") renderApiKeys();
    if (tab === "alerts") renderAlerts(true);
    if (tab === "dev-models") renderDevModels();
    if (tab === "dev-versions") renderDevVersions();
    if (tab === "dev-earnings") renderDevEarnings();
    updateBell();
  }

  window.addEventListener("hashchange", renderCurrent);

  /* ---------------------------------------------------- seeded mock data */

  function series(seedKey, n, base, drift) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("dash|" + seedKey));
    var vals = [];
    var v = base;
    for (var i = 0; i < n; i++) {
      v = Math.max(0, v + (rand() - 0.5 + drift) * base * 0.08);
      vals.push(v);
    }
    return vals;
  }

  var KPIS = [
    { key: "calls", label: "Inference calls (24h)", unit: "", base: 41200, drift: 0.012 },
    { key: "latency", label: "p99 latency", unit: "ms", base: 128, drift: -0.006 },
    { key: "subs", label: "Active subscriptions", unit: "", base: 312, drift: 0.01 },
    { key: "revenue", label: "MRR", unit: "USD", base: 48200, drift: 0.014 }
  ];

  var ALERTS = [
    { severity: "critical", model: "liquidity-stress-engine", text: "LCR projection crossed the covenant floor in the severe scenario for tenant acme-bank." },
    { severity: "warn", model: "sentiment-from-filings", text: "Live IR drifting from backtest baseline — 0.61 vs 0.78 over the trailing 60 days." },
    { severity: "warn", model: "stablecoin-depeg-monitor", text: "Cross-venue peg dispersion widening on USDT — 18bp spread between venues." },
    { severity: "info", model: "credit-oracle", text: "Model version 2026.08.2 cleared EU conformity review and is serving EU traffic." },
    { severity: "info", model: "fraud-graph", text: "UAE edge latency back under 50ms after the region's cache rebuild." }
  ];

  /* ------------------------------------------- api keys (Task 116) */

  var KEYS_KEY = "gefi-dash-keys";

  function seedKeys() {
    return [
      { name: "prod-inference", prefix: "gefi_sk_9f2c", scope: "inference", created: "2026-06-02", lastUsed: "today", usage: [820, 940, 1010, 880, 1200, 1150, 1290] },
      { name: "ci-smoke", prefix: "gefi_sk_41d7", scope: "read", created: "2026-07-11", lastUsed: "3 days ago", usage: [40, 38, 42, 36, 40, 44, 39] }
    ];
  }

  function loadKeys() {
    try {
      var raw = sessionStorage.getItem(KEYS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return seedKeys();
  }

  function saveKeys(keys) {
    try {
      sessionStorage.setItem(KEYS_KEY, JSON.stringify(keys));
    } catch (e) {}
  }

  function randomKey() {
    var hex = "";
    for (var i = 0; i < 8; i++) {
      hex += Math.floor((Date.now() / (i + 3) + i * 7919) % 16).toString(16);
    }
    /* Preview-only key material: derived, not random, and never real. */
    var body = GeFi.seed.hash("key|" + hex + "|" + (loadKeys().length + 1)).toString(16);
    return "gefi_sk_" + hex + body + body.split("").reverse().join("");
  }

  function renderApiKeys() {
    var body = root.querySelector("[data-keys-body]");
    var empty = root.querySelector("[data-keys-empty]");
    if (!body) return;
    var keys = loadKeys();
    body.innerHTML = "";
    empty.hidden = keys.length !== 0;
    root.querySelector("[data-keys-table]").hidden = keys.length === 0;

    keys.forEach(function (k, idx) {
      var tr = document.createElement("tr");

      function td(content, cls) {
        var cell = document.createElement("td");
        if (cls) cell.className = cls;
        if (typeof content === "string") {
          cell.textContent = content;
        } else {
          cell.appendChild(content);
        }
        tr.appendChild(cell);
        return cell;
      }

      td(k.name);
      td(k.prefix + "\u2026", "is-mono");
      var scope = document.createElement("span");
      scope.className = "badge";
      scope.textContent = k.scope;
      td(scope);
      td(k.created, "is-mono");
      td(k.lastUsed);
      var spark = document.createElement("span");
      spark.className = "dash-keyspark";
      spark.appendChild(GeFi.svg.sparkline(k.usage, { label: k.name + " 7-day usage" }));
      td(spark);

      var actions = document.createElement("td");
      actions.className = "is-actions";
      if (k.confirming) {
        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Type \"" + k.name + "\" to revoke";
        input.className = "dash-confirm-input";
        input.setAttribute("data-revoke-input", String(idx));
        var confirm = document.createElement("button");
        confirm.type = "button";
        confirm.className = "btn btn-ghost is-danger";
        confirm.textContent = "Confirm revoke";
        confirm.setAttribute("data-revoke-confirm", String(idx));
        actions.appendChild(input);
        actions.appendChild(confirm);
      } else {
        var revoke = document.createElement("button");
        revoke.type = "button";
        revoke.className = "btn btn-ghost";
        revoke.textContent = "Revoke";
        revoke.setAttribute("data-revoke-start", String(idx));
        actions.appendChild(revoke);
      }
      tr.appendChild(actions);
      body.appendChild(tr);
    });
  }

  root.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-key-create-open]")) {
      var modal = root.querySelector("[data-key-modal]");
      modal.hidden = false;
      root.querySelector("[data-key-modal-form]").hidden = false;
      root.querySelector("[data-key-modal-reveal]").hidden = true;
      root.querySelector("[data-key-name]").value = "";
      return;
    }
    if (t.closest("[data-key-modal-cancel]")) {
      root.querySelector("[data-key-modal]").hidden = true;
      return;
    }
    if (t.closest("[data-key-modal-create]")) {
      var name = (root.querySelector("[data-key-name]").value || "").trim() || "unnamed-key";
      var scope = root.querySelector("[data-key-scope]").value;
      var full = randomKey();
      var keys = loadKeys();
      keys.push({
        name: name,
        prefix: full.slice(0, 12),
        scope: scope,
        created: "today",
        lastUsed: "never",
        usage: [0, 0, 0, 0, 0, 0, 0]
      });
      saveKeys(keys);
      root.querySelector("[data-key-full]").textContent = full;
      root.querySelector("[data-key-modal-form]").hidden = true;
      root.querySelector("[data-key-modal-reveal]").hidden = false;
      root.querySelector("[data-key-copied]").hidden = true;
      renderApiKeys();
      return;
    }
    if (t.closest("[data-key-copy]")) {
      var text = root.querySelector("[data-key-full]").textContent;
      var done = function () {
        root.querySelector("[data-key-copied]").hidden = false;
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
      return;
    }
    if (t.closest("[data-key-modal-done]")) {
      root.querySelector("[data-key-modal]").hidden = true;
      root.querySelector("[data-key-full]").textContent = "";
      return;
    }
    var start = t.closest("[data-revoke-start]");
    if (start) {
      var keys2 = loadKeys();
      keys2[parseInt(start.getAttribute("data-revoke-start"), 10)].confirming = true;
      saveKeys(keys2);
      renderApiKeys();
      return;
    }
    var conf = t.closest("[data-revoke-confirm]");
    if (conf) {
      var i = parseInt(conf.getAttribute("data-revoke-confirm"), 10);
      var keys3 = loadKeys();
      var typed = root.querySelector('[data-revoke-input="' + i + '"]').value.trim();
      if (typed === keys3[i].name) {
        keys3.splice(i, 1);
      } else {
        delete keys3[i].confirming;
      }
      saveKeys(keys3);
      renderApiKeys();
      return;
    }
  });

  /* --------------------------------------- alerts center (Task 117) */

  var PREFS_KEY = "gefi-dash-alert-prefs";
  var READ_KEY = "gefi-dash-alerts-read";
  var SEV_RANK = { info: 0, warn: 1, critical: 2 };

  function loadPrefs() {
    try {
      var raw = sessionStorage.getItem(PREFS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { mutes: {}, minSev: {}, delivery: { critical: { email: true, webhook: true, slack: true }, warn: { email: true, webhook: false, slack: true }, info: { email: false, webhook: false, slack: false } } };
  }

  function savePrefs(p) {
    try {
      sessionStorage.setItem(PREFS_KEY, JSON.stringify(p));
    } catch (e) {}
  }

  function alertsRead() {
    try {
      return sessionStorage.getItem(READ_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function visibleAlerts() {
    var prefs = loadPrefs();
    return ALERTS.filter(function (a) {
      if (prefs.mutes[a.model]) return false;
      var min = prefs.minSev[a.model] || "info";
      return SEV_RANK[a.severity] >= SEV_RANK[min];
    });
  }

  function updateBell() {
    var bell = root.querySelector("[data-dash-bell-count]");
    if (!bell) return;
    var unread = alertsRead()
      ? 0
      : visibleAlerts().filter(function (a) {
          return a.severity !== "info";
        }).length;
    bell.textContent = String(unread);
    bell.hidden = unread === 0;
  }

  function alertItem(a) {
    var li = document.createElement("li");
    li.className = "dash-alert dash-alert--" + a.severity;
    var svg = GeFi.svg.el("svg", { viewBox: "0 0 24 24", width: 14, height: 14, class: "dash-alert__icon", "aria-hidden": "true" });
    svg.appendChild(GeFi.svg.el("path", { d: SEV_ICON[a.severity] }));
    li.appendChild(svg);
    var bodyEl = document.createElement("div");
    var head = document.createElement("p");
    head.className = "dash-alert__head";
    var sev = document.createElement("span");
    sev.className = "dash-alert__sev";
    sev.textContent = a.severity;
    head.appendChild(sev);
    var text = document.createElement("p");
    text.className = "dash-alert__text";
    text.textContent = a.text;
    bodyEl.appendChild(head);
    bodyEl.appendChild(text);
    li.appendChild(bodyEl);
    return li;
  }

  function renderAlerts(markRead) {
    var inbox = root.querySelector("[data-alerts-inbox]");
    if (!inbox) return;
    if (markRead && currentTab() === "alerts") {
      try {
        sessionStorage.setItem(READ_KEY, "1");
      } catch (e) {}
    }

    /* Inbox grouped by model. */
    inbox.innerHTML = "";
    var byModel = {};
    visibleAlerts().forEach(function (a) {
      (byModel[a.model] = byModel[a.model] || []).push(a);
    });
    var models = Object.keys(byModel).sort();
    if (!models.length) {
      var none = document.createElement("p");
      none.className = "dash-empty";
      none.textContent = "Nothing in the inbox — everything is either read, muted, or below your severity thresholds.";
      inbox.appendChild(none);
    }
    models.forEach(function (m) {
      var group = document.createElement("div");
      group.className = "dash-alertgroup";
      var h = document.createElement("h3");
      h.className = "dash-alertgroup__model";
      h.textContent = m;
      group.appendChild(h);
      var ul = document.createElement("ul");
      ul.className = "dash-alerts";
      byModel[m].forEach(function (a) {
        ul.appendChild(alertItem(a));
      });
      group.appendChild(ul);
      inbox.appendChild(group);
    });

    /* Per-model preferences. */
    var prefs = loadPrefs();
    var prefBody = root.querySelector("[data-alert-prefs-body]");
    prefBody.innerHTML = "";
    var allModels = [];
    ALERTS.forEach(function (a) {
      if (allModels.indexOf(a.model) === -1) allModels.push(a.model);
    });
    allModels.sort().forEach(function (m) {
      var tr = document.createElement("tr");
      var name = document.createElement("td");
      name.className = "is-mono";
      name.textContent = m;
      tr.appendChild(name);

      var muteTd = document.createElement("td");
      var mute = document.createElement("input");
      mute.type = "checkbox";
      mute.checked = !!prefs.mutes[m];
      mute.setAttribute("data-alert-mute", m);
      muteTd.appendChild(mute);
      tr.appendChild(muteTd);

      var sevTd = document.createElement("td");
      var sel = document.createElement("select");
      sel.setAttribute("data-alert-minsev", m);
      ["info", "warn", "critical"].forEach(function (sv) {
        var opt = document.createElement("option");
        opt.value = sv;
        opt.textContent = sv;
        if ((prefs.minSev[m] || "info") === sv) opt.selected = true;
        sel.appendChild(opt);
      });
      sevTd.appendChild(sel);
      tr.appendChild(sevTd);
      prefBody.appendChild(tr);
    });

    /* Delivery matrix. */
    var dBody = root.querySelector("[data-delivery-body]");
    dBody.innerHTML = "";
    ["critical", "warn", "info"].forEach(function (sv) {
      var tr = document.createElement("tr");
      var name = document.createElement("td");
      var sevSpan = document.createElement("span");
      sevSpan.className = "dash-alert__sev dash-sev--" + sv;
      sevSpan.textContent = sv;
      name.appendChild(sevSpan);
      tr.appendChild(name);
      ["email", "webhook", "slack"].forEach(function (ch) {
        var td = document.createElement("td");
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!(prefs.delivery[sv] && prefs.delivery[sv][ch]);
        cb.setAttribute("data-delivery", sv + "|" + ch);
        td.appendChild(cb);
        tr.appendChild(td);
      });
      dBody.appendChild(tr);
    });
  }

  root.addEventListener("change", function (e) {
    var t = e.target;
    var prefs = loadPrefs();
    if (t.matches("[data-alert-mute]")) {
      prefs.mutes[t.getAttribute("data-alert-mute")] = t.checked;
      savePrefs(prefs);
      renderAlerts(false);
      updateBell();
      return;
    }
    if (t.matches("[data-alert-minsev]")) {
      prefs.minSev[t.getAttribute("data-alert-minsev")] = t.value;
      savePrefs(prefs);
      renderAlerts(false);
      updateBell();
      return;
    }
    if (t.matches("[data-delivery]")) {
      var parts = t.getAttribute("data-delivery").split("|");
      prefs.delivery[parts[0]] = prefs.delivery[parts[0]] || {};
      prefs.delivery[parts[0]][parts[1]] = t.checked;
      savePrefs(prefs);
      return;
    }
  });

  /* ---------------------------------------------------------- overview */

  var SEV_ICON = {
    critical: "M12 2 L22 20 H2 Z",            /* triangle */
    warn: "M12 3 a9 9 0 1 0 0.001 0 Z",        /* circle */
    info: "M4 4 h16 v16 h-16 Z"                /* square */
  };

  function renderOverview() {
    var grid = root.querySelector("[data-kpi-grid]");
    if (grid && !grid.childNodes.length) {
      KPIS.forEach(function (k) {
        var vals = series(k.key, 30, k.base, k.drift);
        var last = vals[vals.length - 1];
        var delta = last - vals[0];

        var card = document.createElement("div");
        card.className = "kpi-card";

        /* Sparkline sits behind the number, low opacity, per the redesign. */
        var spark = document.createElement("div");
        spark.className = "kpi-card__spark";
        spark.appendChild(GeFi.svg.line([{ name: k.label, values: vals, kind: "area" }], { label: k.label + " trend" }));
        card.appendChild(spark);

        var body = document.createElement("div");
        body.className = "kpi-card__body";
        var label = document.createElement("p");
        label.className = "kpi-card__label";
        label.textContent = k.label;
        var num = document.createElement("p");
        num.className = "kpi-card__value";
        num.textContent = k.unit === "USD" ? GeFi.fmt.money(last, "USD") : GeFi.fmt.compact(last) + (k.unit ? " " + k.unit : "");
        var d = document.createElement("p");
        d.className = "kpi-card__delta " + (delta >= 0 ? "is-up" : "is-down");
        d.textContent = GeFi.fmt.delta(k.unit === "ms" ? delta : (delta / vals[0]) * 100, 1) + (k.unit === "ms" ? " ms" : "%") + " over 30d";
        body.appendChild(label);
        body.appendChild(num);
        body.appendChild(d);
        card.appendChild(body);
        grid.appendChild(card);
      });
    }

    var list = root.querySelector("[data-dash-alerts]");
    if (list && !list.childNodes.length) {
      ALERTS.forEach(function (a) {
        var li = document.createElement("li");
        li.className = "dash-alert dash-alert--" + a.severity;

        var svg = GeFi.svg.el("svg", { viewBox: "0 0 24 24", width: 14, height: 14, class: "dash-alert__icon", "aria-hidden": "true" });
        svg.appendChild(GeFi.svg.el("path", { d: SEV_ICON[a.severity] }));
        li.appendChild(svg);

        var body = document.createElement("div");
        var head = document.createElement("p");
        head.className = "dash-alert__head";
        var sev = document.createElement("span");
        sev.className = "dash-alert__sev";
        sev.textContent = a.severity;
        var model = document.createElement("span");
        model.className = "dash-alert__model";
        model.textContent = a.model;
        head.appendChild(sev);
        head.appendChild(model);
        var text = document.createElement("p");
        text.className = "dash-alert__text";
        text.textContent = a.text;
        body.appendChild(head);
        body.appendChild(text);
        li.appendChild(body);
        list.appendChild(li);
      });
    }

    updateBell();
  }

  root.addEventListener("click", function (e) {
    if (e.target.closest("[data-dash-bell]")) {
      window.location.hash = "#alerts";
    }
  });

  /* ------------------------------------------- developer console (Task 119) */

  var DEV_MODELS = [
    { slug: "signal-momentum-v2", name: "Signal Momentum v2", category: "Quant / Signals", status: "live", version: "2026.07.3", submitted: "2026-07-02" },
    { slug: "credit-tail-risk", name: "Credit Tail Risk", category: "Credit / Risk", status: "pending", version: "2026.08.1", submitted: "2026-08-18" },
    { slug: "esg-controversy-scan", name: "ESG Controversy Scan", category: "ESG / Screening", status: "draft", version: "0.9.0", submitted: "—" },
    { slug: "macro-regime-classifier", name: "Macro Regime Classifier", category: "Macro", status: "live", version: "2026.05.6", submitted: "2026-05-14" }
  ];

  var DEV_STATUS_LABEL = { draft: "Draft", pending: "Pending approval", live: "Live" };
  var DEV_STATUS_PILL = { draft: "status-pill--muted", pending: "status-pill--progress", live: "status-pill--brand" };

  function tableRow(cells) {
    var tr = document.createElement("tr");
    cells.forEach(function (c) {
      var cell = document.createElement("td");
      if (c.cls) cell.className = c.cls;
      if (typeof c.content === "string") {
        cell.textContent = c.content;
      } else {
        cell.appendChild(c.content);
      }
      tr.appendChild(cell);
    });
    return tr;
  }

  function statusPill(cls, text) {
    var span = document.createElement("span");
    span.className = "status-pill " + cls;
    span.textContent = text;
    return span;
  }

  var pendingVersionModel = null;

  function renderDevModels() {
    var body = root.querySelector("[data-dev-models-body]");
    if (!body || body.childNodes.length) return;
    DEV_MODELS.forEach(function (m) {
      var view = document.createElement("button");
      view.type = "button";
      view.className = "btn btn-ghost";
      view.textContent = "View";
      view.setAttribute("data-dev-model-view", m.slug);
      body.appendChild(tableRow([
        { content: m.name },
        { content: m.category },
        { content: statusPill(DEV_STATUS_PILL[m.status], DEV_STATUS_LABEL[m.status]) },
        { content: m.version, cls: "is-mono" },
        { content: m.submitted },
        { content: view, cls: "is-actions" }
      ]));
    });
  }

  root.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-dev-model-view]");
    if (!btn) return;
    pendingVersionModel = btn.getAttribute("data-dev-model-view");
    window.location.hash = "#dev-versions";
  });

  /* -------------------------------------- developer console: versions */

  var DEV_VERSIONS_KEY = "gefi-dash-dev-versions";

  function artifactHash(seedKey) {
    var h = GeFi.seed.hash("artifact|" + seedKey).toString(16);
    while (h.length < 10) h = "0" + h;
    return "sha256:" + h.slice(0, 10) + "…";
  }

  function seedDevVersions() {
    var rows = [];
    DEV_MODELS.forEach(function (m) {
      if (m.status === "draft") return;
      rows.push({
        model: m.name,
        version: m.version,
        hash: artifactHash(m.slug + "|" + m.version),
        anchored: true,
        status: m.status,
        uploaded: m.submitted
      });
    });
    return rows;
  }

  function loadDevVersions() {
    try {
      var raw = sessionStorage.getItem(DEV_VERSIONS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return seedDevVersions();
  }

  function saveDevVersions(rows) {
    try {
      sessionStorage.setItem(DEV_VERSIONS_KEY, JSON.stringify(rows));
    } catch (e) {}
  }

  function renderVersionsTable() {
    var body = root.querySelector("[data-dev-versions-body]");
    if (!body) return;
    body.innerHTML = "";
    loadDevVersions().forEach(function (v) {
      body.appendChild(tableRow([
        { content: v.model },
        { content: v.version, cls: "is-mono" },
        { content: v.hash, cls: "is-mono" },
        { content: statusPill(v.anchored ? "status-pill--ok" : "status-pill--progress", v.anchored ? "Anchored" : "Anchoring…") },
        { content: statusPill(DEV_STATUS_PILL[v.status] || "status-pill--muted", DEV_STATUS_LABEL[v.status] || v.status) },
        { content: v.uploaded }
      ]));
    });
  }

  function renderDevVersions() {
    var select = root.querySelector("[data-dev-version-model]");
    if (select && !select.childNodes.length) {
      DEV_MODELS.forEach(function (m) {
        var opt = document.createElement("option");
        opt.value = m.slug;
        opt.textContent = m.name;
        select.appendChild(opt);
      });
    }
    if (select && pendingVersionModel) {
      select.value = pendingVersionModel;
      pendingVersionModel = null;
    }
    renderVersionsTable();
  }

  root.addEventListener("click", function (e) {
    if (!e.target.closest("[data-dev-version-upload]")) return;
    var select = root.querySelector("[data-dev-version-model]");
    var input = root.querySelector("[data-dev-version-label]");
    var slug = select ? select.value : DEV_MODELS[0].slug;
    var matches = DEV_MODELS.filter(function (m) { return m.slug === slug; });
    var model = matches[0] || DEV_MODELS[0];
    var rows = loadDevVersions();
    var label = (input && input.value.trim()) || ("draft-" + (rows.length + 1));
    if (input) input.value = "";

    var row = {
      model: model.name,
      version: label,
      hash: artifactHash(slug + "|" + label + "|" + rows.length),
      anchored: false,
      status: "pending",
      uploaded: "just now"
    };
    rows.unshift(row);
    saveDevVersions(rows);
    renderVersionsTable();

    /* The anchor transaction confirms a moment later, same shape as
     * waiting on a real Polygon confirmation. */
    window.setTimeout(function () {
      var current = loadDevVersions();
      var match = current.filter(function (r) {
        return r.model === row.model && r.version === row.version && r.hash === row.hash;
      })[0];
      if (match) match.anchored = true;
      saveDevVersions(current);
      renderVersionsTable();
    }, 1400);
  });

  /* -------------------------------------- developer console: earnings */

  var DEV_EARNINGS_KEY = "gefi-dash-dev-stripe";
  var DEV_SHARE_PCT = 70;

  var DEV_PAYOUTS = [
    { period: "Jul 2026", gross: 18400, status: "paid" },
    { period: "Jun 2026", gross: 16120, status: "paid" },
    { period: "Aug 2026 (to date)", gross: 9860, status: "pending" }
  ];

  function stripeConnected() {
    try {
      return sessionStorage.getItem(DEV_EARNINGS_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function renderDevEarnings() {
    var grid = root.querySelector("[data-dev-earnings-kpis]");
    if (grid && !grid.childNodes.length) {
      var gross = DEV_PAYOUTS.reduce(function (sum, p) { return sum + p.gross; }, 0);
      var share = gross * (DEV_SHARE_PCT / 100);
      var cards = [
        { label: "Gross revenue (trailing 3mo)", value: GeFi.fmt.money(gross, "USD") },
        { label: "Your share (" + DEV_SHARE_PCT + "%)", value: GeFi.fmt.money(share, "USD") },
        { label: "Next payout date", value: "Sep 1, 2026" }
      ];
      cards.forEach(function (c) {
        var card = document.createElement("div");
        card.className = "kpi-card";
        var body = document.createElement("div");
        body.className = "kpi-card__body";
        var label = document.createElement("p");
        label.className = "kpi-card__label";
        label.textContent = c.label;
        var val = document.createElement("p");
        val.className = "kpi-card__value";
        val.textContent = c.value;
        body.appendChild(label);
        body.appendChild(val);
        card.appendChild(body);
        grid.appendChild(card);
      });
    }

    var disconnected = root.querySelector("[data-dev-stripe-disconnected]");
    var connected = root.querySelector("[data-dev-stripe-connected]");
    var account = root.querySelector("[data-dev-stripe-account]");
    var isConnected = stripeConnected();
    if (disconnected) disconnected.hidden = isConnected;
    if (connected) connected.hidden = !isConnected;
    if (account && isConnected) account.textContent = "Payouts to Chase … 4821";

    var payoutsBody = root.querySelector("[data-dev-payouts-body]");
    if (payoutsBody && !payoutsBody.childNodes.length) {
      DEV_PAYOUTS.forEach(function (p) {
        payoutsBody.appendChild(tableRow([
          { content: p.period },
          { content: GeFi.fmt.money(p.gross, "USD"), cls: "is-mono" },
          { content: GeFi.fmt.money(p.gross * (DEV_SHARE_PCT / 100), "USD"), cls: "is-mono" },
          { content: statusPill(p.status === "paid" ? "status-pill--ok" : "status-pill--progress", p.status === "paid" ? "Paid" : "Pending") }
        ]));
      });
    }
  }

  root.addEventListener("click", function (e) {
    if (!e.target.closest("[data-dev-stripe-connect]")) return;
    try {
      sessionStorage.setItem(DEV_EARNINGS_KEY, "1");
    } catch (err) {}
    renderDevEarnings();
  });

  /* --------------------------------------------------------------- boot */

  function boot() {
    renderCurrent();
  }

  if (gated()) {
    show("app");
    boot();
  } else {
    show("gate");
  }
})(window, document);
