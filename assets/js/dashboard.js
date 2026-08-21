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
    { slug: "accretion-dilution", name: "Accretion / Dilution", wing: "M&A & Corporate Transactions", risk: "medium", federated: false, unit: "Yr1 accretion %", series: [0.4, 0.6, 0.9, 1.1, 1.4, 1.6, 1.9, 2.1, 2.3, 2.5, 2.7, 2.9] },
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
    { slug: "growth-equity-model", name: "Growth Equity Model", wing: "Venture & Growth Capital", risk: "medium", federated: false, unit: "Investor MOIC", series: [2.1, 2.15, 2.2, 2.25, 2.3, 2.35, 2.4, 2.45, 2.5, 2.55, 2.6, 2.65] },
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
    { slug: "mbo-model", name: "MBO Model", wing: "M&A & Corporate Transactions", risk: "medium", federated: false, unit: "Mgmt effective %", series: [11.2, 11.5, 11.8, 12.0, 12.3, 12.5, 12.8, 13.0, 13.3, 13.5, 13.8, 14.0] },
    { slug: "merger-arbitrage-tracker", name: "Merger Arbitrage Tracker", wing: "Relative-Value & Arbitrage", risk: "high", federated: false, unit: "Completion prob.", series: [0.86, 0.87, 0.85, 0.88, 0.89, 0.86, 0.88, 0.9, 0.87, 0.89, 0.91, 0.88] },
    { slug: "merger-model", name: "Merger Model", wing: "M&A & Corporate Transactions", risk: "high", federated: false, unit: "Accretion %", series: [1.2, 1.4, 1.5, 1.7, 1.9, 2.0, 2.2, 2.3, 2.5, 2.6, 2.8, 2.9] },
    { slug: "monte-carlo-simulation-service", name: "Monte Carlo Simulation Service", wing: "Simulation & Market Primitives", risk: "low", federated: false, unit: "Convergence", series: [0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.96, 0.97, 0.98, 0.98, 0.99] },
    { slug: "mortgage-default-prepay", name: "Mortgage Default & Prepay", wing: "Credit & Risk", risk: "medium", federated: true, unit: "Default AUC", series: [0.76, 0.77, 0.77, 0.78, 0.78, 0.79, 0.79, 0.8, 0.8, 0.81, 0.81, 0.81] },
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
    { slug: "reversal-detector", name: "Reversal Detector", wing: "Directional Strategies", risk: "medium", federated: false, unit: "Accuracy", series: [0.31, 0.33, 0.3, 0.34, 0.36, 0.33, 0.35, 0.37, 0.34, 0.38, 0.36, 0.39] },
    { slug: "safe-note-conversion", name: "SAFE & Note Conversion", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Conversion %", series: [8.2, 8.6, 9.0, 9.4, 9.8, 10.1, 10.5, 10.9, 11.2, 11.6, 11.9, 12.3] },
    { slug: "scenario-narrative-engine", name: "Scenario Narrative Engine", wing: "Generative AI", risk: "medium", federated: false, unit: "Consistent claims", series: [0.95, 0.96, 0.96, 0.97, 0.98, 0.98, 0.98, 0.99, 0.99, 0.99, 1, 1] },
    { slug: "securitization-modeler", name: "Securitization Modeler", wing: "Corporate Treasury & Structured Finance", risk: "high", federated: false, unit: "Class A enhancement %", series: [22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27] },
    { slug: "sentiment-from-filings", name: "Sentiment from Filings", wing: "Investing & Macro", risk: "low", federated: false, unit: "F1", series: [0.68, 0.7, 0.71, 0.72, 0.74, 0.75, 0.75, 0.76, 0.77, 0.78, 0.78, 0.79] },
    { slug: "spin-off-model", name: "Spin-Off Model", wing: "M&A & Corporate Transactions", risk: "medium", federated: false, unit: "Stranded cost %", series: [4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.6, 3.6, 3.5, 3.4, 3.3, 3.3] },
    { slug: "startup-financial-model", name: "Startup Financial Model", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Runway months", series: [21, 20, 19, 19, 18, 17, 17, 16, 16, 15, 15, 14] },
    { slug: "startup-runway-tracker", name: "Startup Runway Tracker", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Runway months", series: [18, 17, 17, 16, 16, 15, 15, 14, 14, 13, 13, 12] },
    { slug: "statistical-arbitrage-engine", name: "Statistical Arbitrage Engine", wing: "Relative-Value & Arbitrage", risk: "medium", federated: true, unit: "Sharpe (sim.)", series: [0.68, 0.71, 0.66, 0.73, 0.75, 0.69, 0.74, 0.77, 0.71, 0.78, 0.8, 0.75] },
    { slug: "tax-residency-classifier", name: "Tax Residency Classifier", wing: "Compliance & Regulatory", risk: "low", federated: false, unit: "Backtest agreement", series: [0.89, 0.9, 0.9, 0.91, 0.91, 0.92, 0.92, 0.93, 0.93, 0.94, 0.94, 0.94] },
    { slug: "trade-finance-doc-ai", name: "Trade Finance Doc AI", wing: "Trade, Payments & KYB", risk: "low", federated: false, unit: "Accuracy", series: [0.88, 0.89, 0.9, 0.9, 0.91, 0.92, 0.92, 0.93, 0.93, 0.94, 0.94, 0.95] },
    { slug: "transaction-monitoring-explainer", name: "Transaction Monitoring Explainer", wing: "Fraud & AML", risk: "medium", federated: false, unit: "Alerts explained", series: [0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1, 1, 1, 1] },
    { slug: "trend-following-engine", name: "Trend Following Engine", wing: "Directional Strategies", risk: "medium", federated: false, unit: "Sharpe (sim.)", series: [0.61, 0.64, 0.6, 0.67, 0.7, 0.66, 0.72, 0.75, 0.71, 0.78, 0.8, 0.77] },
    { slug: "vc-method-valuation", name: "VC Method Valuation", wing: "Venture & Growth Capital", risk: "low", federated: false, unit: "Implied pre-money", series: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
    { slug: "vc-portfolio-tracker", name: "VC Portfolio Tracker", wing: "Venture & Growth Capital", risk: "low", federated: true, unit: "TVPI", series: [1.9, 2.0, 2.05, 2.1, 2.2, 2.25, 2.3, 2.4, 2.45, 2.5, 2.6, 2.65] },
    { slug: "vendor-risk-aiops", name: "Vendor Risk AIOps", wing: "Credit & Risk", risk: "low", federated: false, unit: "Alert precision", series: [0.78, 0.79, 0.8, 0.81, 0.82, 0.82, 0.83, 0.84, 0.84, 0.85, 0.85, 0.86] },
    { slug: "volatility-surface-service", name: "Volatility Surface Service", wing: "Simulation & Market Primitives", risk: "medium", federated: false, unit: "Fit R2", series: [0.955, 0.958, 0.961, 0.963, 0.966, 0.968, 0.971, 0.973, 0.975, 0.977, 0.979, 0.981] },
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
