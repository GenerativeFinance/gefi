/* Model detail page — per-model Demo tab widgets.
 *
 * Each of the 10 launch-featured models gets a tailored, lightweight
 * widget under the Demo tab — canned data, no auth, no network. Mounts
 * lazily on the first `model:tab-shown` event with `tab === "demo"`.
 *
 * If the slug has no widget registered we fall back to the empty-state
 * CTA already rendered server-side by Jekyll, so the page still works
 * for non-featured models. Phase 6 wires the real backends; the schemas
 * + result widgets in `playground-result-widgets.js` move with them.
 */
(function () {
  "use strict";
  var host = document.querySelector("[data-model-demo]");
  if (!host) return;
  var article = document.querySelector("[data-slug]");
  var slug = article ? article.dataset.slug : "";

  // ── Tiny helpers ───────────────────────────────────────────────────────
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === "class") e.className = attrs[k];
        else if (k === "style") e.setAttribute("style", attrs[k]);
        else e.setAttribute(k, attrs[k]);
      }
    }
    if (text != null) e.textContent = text;
    return e;
  }
  function svg(viewBox, inner, label) {
    return (
      '<svg class="demo-svg" viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      (label || "demo chart") + '">' + inner + "</svg>"
    );
  }
  function attrs(o) {
    var s = "";
    for (var k in o) s += " " + k + '="' + o[k] + '"';
    return s;
  }
  function rng(seed) {
    var h = 0;
    for (var i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i);
    var t = (h ^ 0x9e3779b9) >>> 0;
    return function () {
      t = (t + 0x6d2b79f5) >>> 0;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function ctaLink(label) {
    var a = document.createElement("a");
    a.className = "btn btn--primary demo-widget__cta";
    a.href = window.location.pathname.replace("/models/", "/playground/");
    a.textContent = label || "Try it in the Playground →";
    return a;
  }
  function reroll(label, fn) {
    var b = el("button", { class: "btn btn--ghost demo-widget__reroll", type: "button" }, label || "Re-roll");
    b.addEventListener("click", fn);
    return b;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // ── Widget registry ───────────────────────────────────────────────────
  var WIDGETS = {};

  // 1. sentiment-from-filings ─────────────────────────────────────────────
  WIDGETS["sentiment-from-filings"] = function (root) {
    var samples = [
      { text: "Liquidity remains robust with $2.3B in cash and revolving facilities; we expect continued strong growth into the second half.",
        sentiment: "positive", confidence: 0.91, topics: ["liquidity", "outlook", "guidance"] },
      { text: "We recognised a $480M impairment loss tied to weak demand in our European retail segment and warned of further restructuring charges.",
        sentiment: "negative", confidence: 0.87, topics: ["impairment", "demand-risk", "restructuring"] },
      { text: "Quarterly results were in line with the prior year. Operating expenses remained stable.",
        sentiment: "neutral", confidence: 0.62, topics: ["operating-results"] },
      { text: "The Audit Committee identified a material weakness in revenue-recognition controls; remediation is underway.",
        sentiment: "negative", confidence: 0.93, topics: ["controls", "audit-finding"] },
    ];
    var idx = 0;
    function paint() {
      clear(root);
      var s = samples[idx % samples.length];
      var card = el("div", { class: "demo-card demo-sentiment" });
      card.appendChild(el("blockquote", { class: "demo-sentiment__text" }, "“" + s.text + "”"));
      var meta = el("div", { class: "demo-sentiment__meta" });
      meta.appendChild(el("span", { class: "demo-chip demo-chip--" + s.sentiment }, s.sentiment.toUpperCase()));
      var bar = el("div", { class: "demo-bar", "aria-label": "confidence " + Math.round(s.confidence * 100) + "%" });
      bar.appendChild(el("div", { class: "demo-bar__fill", style: "width:" + Math.round(s.confidence * 100) + "%" }));
      meta.appendChild(bar);
      meta.appendChild(el("span", { class: "demo-meta-num" }, Math.round(s.confidence * 100) + "% confidence"));
      card.appendChild(meta);
      var tags = el("div", { class: "demo-tags" });
      s.topics.forEach(function (t) { tags.appendChild(el("span", { class: "demo-tag" }, "#" + t)); });
      card.appendChild(tags);
      root.appendChild(card);
      root.appendChild(reroll("Next sample →", function () { idx++; paint(); }));
      root.appendChild(ctaLink());
    }
    paint();
  };

  // 2. portfolio-optimiser — P5/P50/P95 fan chart ────────────────────────
  WIDGETS["portfolio-optimiser"] = function (root) {
    var seed = 1;
    function build(s) {
      var r = rng("portfolio-" + s);
      var n = 24, p50 = [], p5 = [], p95 = [], v = 100;
      for (var i = 0; i < n; i++) {
        v *= 1 + (r() - 0.45) * 0.05;
        p50.push(v);
        p5.push(v * (0.85 - i * 0.004));
        p95.push(v * (1.15 + i * 0.008));
      }
      return { p5: p5, p50: p50, p95: p95 };
    }
    function chart(d) {
      var w = 560, h = 220, n = d.p50.length;
      var all = d.p5.concat(d.p95);
      var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
      var span = hi - lo || 1;
      var x = function (i) { return (i / (n - 1)) * (w - 50) + 40; };
      var y = function (val) { return h - 24 - ((val - lo) / span) * (h - 44); };
      var top = "M" + d.p5.map(function (val, i) { return x(i) + "," + y(val); }).join(" L ");
      var bot = " L " + d.p95.slice().reverse().map(function (val, i) { return x(n - 1 - i) + "," + y(val); }).join(" L ") + " Z";
      var med = "M" + d.p50.map(function (val, i) { return x(i) + "," + y(val); }).join(" L ");
      var inner =
        '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="white"/>' +
        '<path d="' + top + bot + '"' + attrs({ fill: "rgba(99,102,241,0.18)", stroke: "none" }) + "/>" +
        '<path d="' + med + '"' + attrs({ fill: "none", stroke: "#6366f1", "stroke-width": "2" }) + "/>" +
        '<text x="' + (w - 8) + '" y="14" text-anchor="end" font-size="10" fill="#6b7280">P5 / P50 / P95 · 24 months</text>' +
        '<text x="40" y="' + (h - 6) + '" font-size="10" fill="#6b7280">t=0</text>' +
        '<text x="' + (w - 30) + '" y="' + (h - 6) + '" font-size="10" fill="#6b7280">t=24m</text>';
      return svg("0 0 " + w + " " + h, inner, "Forecast fan chart, P5 to P95 over 24 months");
    }
    function paint() {
      clear(root);
      var d = build(seed);
      var card = el("div", { class: "demo-card" });
      card.insertAdjacentHTML("beforeend", chart(d));
      var stats = el("div", { class: "demo-stats" });
      var r = rng("stats-" + seed);
      var cagr = ((d.p50[d.p50.length - 1] / 100 - 1) * 100).toFixed(1);
      [["Median CAGR (24m)", cagr + "%"],
       ["P5 drawdown", "-" + (12 + r() * 6).toFixed(1) + "%"],
       ["Sharpe (sim.)", (0.7 + r() * 0.6).toFixed(2)],
       ["Sortino (sim.)", (0.9 + r() * 0.6).toFixed(2)]].forEach(function (kv) {
        var s = el("div", { class: "demo-stat" });
        s.appendChild(el("span", { class: "demo-stat__label" }, kv[0]));
        s.appendChild(el("strong", { class: "demo-stat__value" }, kv[1]));
        stats.appendChild(s);
      });
      card.appendChild(stats);
      root.appendChild(card);
      root.appendChild(reroll("Re-roll seed", function () { seed++; paint(); }));
      root.appendChild(ctaLink());
    }
    paint();
  };

  // 3. credit-default-classifier — score dial + reason cards ─────────────
  WIDGETS["credit-default-classifier"] = function (root) {
    var target = 720;
    function dialSvg(score) {
      var pct = (score - 300) / 550; // 300..850
      var w = 260, h = 150, cx = w / 2, cy = h - 10, R = 110;
      var start = Math.PI, end = Math.PI + Math.PI * pct;
      var px = cx + R * Math.cos(end), py = cy + R * Math.sin(end);
      var large = pct > 0.5 ? 1 : 0;
      var ax = cx - R, ay = cy;
      var arc = "M " + ax + " " + ay + " A " + R + " " + R + " 0 " + large + " 1 " + px + " " + py;
      var trackArc = "M " + ax + " " + ay + " A " + R + " " + R + " 0 1 1 " + (cx + R) + " " + cy;
      var color = score < 580 ? "#ef4444" : score < 670 ? "#f59e0b" : score < 740 ? "#10b981" : "#0ea5e9";
      return svg("0 0 " + w + " " + h,
        '<path d="' + trackArc + '" fill="none" stroke="#e5e7eb" stroke-width="14" stroke-linecap="round"/>' +
        '<path d="' + arc + '" fill="none" stroke="' + color + '" stroke-width="14" stroke-linecap="round"/>' +
        '<text x="' + cx + '" y="' + (cy - 28) + '" text-anchor="middle" font-size="36" font-weight="700" fill="#111827">' + Math.round(score) + "</text>" +
        '<text x="' + cx + '" y="' + (cy - 8) + '" text-anchor="middle" font-size="11" fill="#6b7280">FICO-equivalent · 300-850</text>',
        "Credit score dial");
    }
    function paint(initial) {
      clear(root);
      var card = el("div", { class: "demo-card demo-credit" });
      var dial = el("div", { class: "demo-credit__dial" });
      dial.innerHTML = dialSvg(initial ? 300 : target);
      card.appendChild(dial);
      var reasons = el("ul", { class: "demo-reasons" });
      [
        { code: "+45", label: "Stable employment 6+ years", tone: "good" },
        { code: "+30", label: "Low credit utilisation (18%)", tone: "good" },
        { code: "-20", label: "Recent inquiry on auto loan", tone: "warn" },
      ].forEach(function (r) {
        var li = el("li", { class: "demo-reason demo-reason--" + r.tone });
        li.appendChild(el("span", { class: "demo-reason__code" }, r.code));
        li.appendChild(el("span", { class: "demo-reason__label" }, r.label));
        reasons.appendChild(li);
      });
      card.appendChild(reasons);
      var zk = el("p", { class: "demo-zkp" });
      zk.innerHTML = '<span class="demo-zkp__badge">ZKP</span> Proof of fairness: model has no access to age, gender, or postcode.';
      card.appendChild(zk);
      root.appendChild(card);
      root.appendChild(reroll("Animate score", function () { paint(true); requestAnimationFrame(function () { animate(300); }); }));
      root.appendChild(ctaLink());
    }
    function animate(from) {
      var t0 = performance.now(), dur = 1100;
      var dial = root.querySelector(".demo-credit__dial");
      function tick(t) {
        var p = Math.min(1, (t - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        dial.innerHTML = dialSvg(from + (target - from) * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    paint(true);
    setTimeout(function () { animate(300); }, 200);
  };

  // 4. fraud-anomaly-detector — tx table with flagged rows ───────────────
  WIDGETS["fraud-anomaly-detector"] = function (root) {
    var merchants = ["Coffee Co", "Streaming Inc", "Petrol Plus", "Grocer Ltd", "Electronics Direct",
      "Hotel Reseller", "Crypto Exchange", "Discount Pharma", "Boutique Jeweler", "Cab Co"];
    var countries = ["US", "US", "US", "GB", "US", "RO", "NG", "US", "US", "US"];
    var seed = 7;
    function rows() {
      var r = rng("tx-" + seed), out = [];
      for (var i = 0; i < 8; i++) {
        var m = merchants[Math.floor(r() * merchants.length)];
        var c = countries[Math.floor(r() * countries.length)];
        var amt = c !== "US" || m === "Crypto Exchange" ? 800 + r() * 4200 : 5 + r() * 240;
        var risky = amt > 1000 || c !== "US";
        var score = risky ? 0.55 + r() * 0.4 : r() * 0.25;
        out.push({ merchant: m, country: c, amount: amt, score: score, flagged: score > 0.5 });
      }
      return out;
    }
    function scoreFor(rs) {
      var n = rs.filter(function (r) { return r.flagged; }).length;
      return Math.min(1, n / rs.length + 0.1);
    }
    function paint() {
      clear(root);
      var rs = rows();
      var card = el("div", { class: "demo-card" });
      var hdr = el("div", { class: "demo-fraud__head" });
      var s = scoreFor(rs);
      hdr.appendChild(el("strong", { class: "demo-fraud__score" }, "Anomaly score: " + (s * 100).toFixed(0) + "%"));
      var bar = el("div", { class: "demo-bar demo-bar--lg" });
      var tone = s > 0.6 ? "high" : s > 0.3 ? "med" : "low";
      bar.appendChild(el("div", { class: "demo-bar__fill demo-bar__fill--" + tone, style: "width:" + Math.round(s * 100) + "%" }));
      hdr.appendChild(bar);
      card.appendChild(hdr);
      var table = el("table", { class: "demo-table" });
      table.innerHTML = "<thead><tr><th>#</th><th>Merchant</th><th>Country</th><th>Amount</th><th>Score</th></tr></thead>";
      var tbody = document.createElement("tbody");
      rs.forEach(function (row, i) {
        var tr = el("tr", { class: row.flagged ? "demo-table__row demo-table__row--flagged" : "demo-table__row" });
        tr.innerHTML = "<td>" + i + "</td><td>" + row.merchant + "</td><td>" + row.country +
          "</td><td>$" + row.amount.toFixed(2) + "</td><td>" + row.score.toFixed(2) +
          (row.flagged ? ' <span class="demo-pulse">●</span>' : "") + "</td>";
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      card.appendChild(table);
      root.appendChild(card);
      root.appendChild(reroll("Re-stream batch", function () { seed++; paint(); }));
      root.appendChild(ctaLink());
    }
    paint();
  };

  // 5. fx-volatility-forecast — forecast curve + confidence band ─────────
  WIDGETS["fx-volatility-forecast"] = function (root) {
    var pairs = ["EURUSD", "USDJPY", "GBPUSD", "USDCHF", "AUDUSD"];
    var idx = 0;
    function build(pair) {
      var r = rng("fx-" + pair), n = 30, mid = [], lo = [], hi = [];
      for (var i = 0; i < n; i++) {
        var v = 0.07 + Math.sin(i / 5) * 0.01 + r() * 0.015;
        mid.push(v);
        lo.push(v * 0.82);
        hi.push(v * 1.18);
      }
      return { mid: mid, lo: lo, hi: hi };
    }
    function chart(d) {
      var w = 560, h = 200, n = d.mid.length;
      var all = d.lo.concat(d.hi);
      var min = Math.min.apply(null, all), max = Math.max.apply(null, all);
      var span = max - min || 1;
      var x = function (i) { return (i / (n - 1)) * (w - 50) + 40; };
      var y = function (v) { return h - 24 - ((v - min) / span) * (h - 44); };
      var band = "M" + d.lo.map(function (v, i) { return x(i) + "," + y(v); }).join(" L ") +
        " L " + d.hi.slice().reverse().map(function (v, i) { return x(n - 1 - i) + "," + y(v); }).join(" L ") + " Z";
      var line = "M" + d.mid.map(function (v, i) { return x(i) + "," + y(v); }).join(" L ");
      return svg("0 0 " + w + " " + h,
        '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="white"/>' +
        '<path d="' + band + '" fill="rgba(14,165,233,0.18)"/>' +
        '<path d="' + line + '" fill="none" stroke="#0ea5e9" stroke-width="2"/>' +
        '<text x="40" y="14" font-size="11" fill="#6b7280">Realised vol forecast (annualised)</text>',
        "Forecast vol with confidence band");
    }
    function paint() {
      clear(root);
      var pair = pairs[idx % pairs.length];
      var d = build(pair);
      var card = el("div", { class: "demo-card" });
      var head = el("div", { class: "demo-fraud__head" });
      head.appendChild(el("strong", null, pair + " · 30-day forecast"));
      var worst = Math.max.apply(null, d.hi) * 100;
      head.appendChild(el("span", { class: "demo-chip demo-chip--neutral" }, "Worst-case " + worst.toFixed(1) + "%"));
      card.appendChild(head);
      card.insertAdjacentHTML("beforeend", chart(d));
      root.appendChild(card);
      root.appendChild(reroll("Next pair →", function () { idx++; paint(); }));
      root.appendChild(ctaLink());
    }
    paint();
  };

  // 6. yield-curve-predictor — curve + scenario toggle ───────────────────
  WIDGETS["yield-curve-predictor"] = function (root) {
    var tenors = [0.25, 1, 2, 3, 5, 7, 10, 20, 30];
    var labels = ["3M", "1Y", "2Y", "3Y", "5Y", "7Y", "10Y", "20Y", "30Y"];
    var scenarios = {
      "Steepening": tenors.map(function (t) { return 2 + Math.log(t + 0.1) * 0.9; }),
      "Flattening": tenors.map(function () { return 4 - Math.random() * 0.4; }),
      "Inverted":   tenors.map(function (t) { return 5 - Math.log(t + 0.1) * 0.6; }),
    };
    var current = "Steepening";
    function chart(ys) {
      var w = 560, h = 200;
      var min = Math.min.apply(null, ys) - 0.5, max = Math.max.apply(null, ys) + 0.5, span = max - min;
      var x = function (i) { return (i / (ys.length - 1)) * (w - 60) + 40; };
      var y = function (v) { return h - 30 - ((v - min) / span) * (h - 50); };
      var line = "M" + ys.map(function (v, i) { return x(i) + "," + y(v); }).join(" L ");
      var dots = ys.map(function (v, i) { return '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="3" fill="#6366f1"/>'; }).join("");
      var lbls = labels.map(function (l, i) { return '<text x="' + x(i) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="10" fill="#6b7280">' + l + "</text>"; }).join("");
      return svg("0 0 " + w + " " + h,
        '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="white"/>' +
        '<path d="' + line + '" fill="none" stroke="#6366f1" stroke-width="2"/>' + dots + lbls,
        "Yield curve");
    }
    function paint() {
      clear(root);
      var card = el("div", { class: "demo-card" });
      var pills = el("div", { class: "demo-pills" });
      Object.keys(scenarios).forEach(function (s) {
        var b = el("button", { type: "button", class: "demo-pill" + (s === current ? " is-active" : "") }, s);
        b.addEventListener("click", function () { current = s; paint(); });
        pills.appendChild(b);
      });
      card.appendChild(pills);
      card.insertAdjacentHTML("beforeend", chart(scenarios[current]));
      root.appendChild(card);
      root.appendChild(ctaLink());
    }
    paint();
  };

  // 7. compliance-redaction-llm — self-ticking checklist + hash ──────────
  WIDGETS["compliance-redaction-llm"] = function (root) {
    var controls = [
      "Detect personally-identifiable information (PII)",
      "Detect counterparty names against sanctions list",
      "Mask financial account numbers and routing IDs",
      "Preserve sentence structure for downstream NLP",
      "Emit auditable redaction log with span offsets",
    ];
    var states = controls.map(function () { return "pending"; });
    function paint() {
      clear(root);
      var card = el("div", { class: "demo-card" });
      var list = el("ul", { class: "demo-checklist" });
      controls.forEach(function (c, i) {
        var li = el("li", { class: "demo-checklist__item demo-checklist__item--" + states[i] });
        li.appendChild(el("span", { class: "demo-checklist__icon", "aria-hidden": "true" }, states[i] === "pass" ? "✓" : states[i] === "running" ? "…" : "○"));
        li.appendChild(el("span", { class: "demo-checklist__label" }, c));
        list.appendChild(li);
      });
      card.appendChild(list);
      var hash = el("p", { class: "demo-hash" });
      hash.innerHTML = '<strong>Proof hash:</strong> <code>0x9f1e8c…d3a4</code>';
      card.appendChild(hash);
      root.appendChild(card);
      var btn = reroll("Re-run checks", function () {
        states = controls.map(function () { return "pending"; });
        paint();
        run();
      });
      root.appendChild(btn);
      root.appendChild(ctaLink());
    }
    function run() {
      var i = 0;
      function next() {
        if (i >= states.length) return;
        states[i] = "running"; paint();
        setTimeout(function () { states[i] = "pass"; i++; paint(); next(); }, 700);
      }
      setTimeout(next, 350);
    }
    paint();
    run();
  };

  // 8. earnings-surprise-predictor — beat / inline / miss probability ────
  WIDGETS["earnings-surprise-predictor"] = function (root) {
    var presets = [
      { ticker: "AAPL", beat: 0.62, inline: 0.28, miss: 0.10, conf: 0.81 },
      { ticker: "TSLA", beat: 0.34, inline: 0.22, miss: 0.44, conf: 0.69 },
      { ticker: "META", beat: 0.55, inline: 0.30, miss: 0.15, conf: 0.74 },
    ];
    var idx = 0;
    function paint() {
      clear(root);
      var p = presets[idx % presets.length];
      var card = el("div", { class: "demo-card" });
      card.appendChild(el("div", { class: "demo-eps__hdr" }, p.ticker + " · next print"));
      var bars = el("div", { class: "demo-bars" });
      [["Beat", "good", p.beat], ["In-line", "neutral", p.inline], ["Miss", "bad", p.miss]].forEach(function (b) {
        var row = el("div", { class: "demo-bars__row" });
        row.appendChild(el("span", { class: "demo-bars__label" }, b[0]));
        var bar = el("div", { class: "demo-bar demo-bar--lg" });
        bar.appendChild(el("div", { class: "demo-bar__fill demo-bar__fill--" + b[1], style: "width:" + Math.round(b[2] * 100) + "%" }));
        row.appendChild(bar);
        row.appendChild(el("span", { class: "demo-bars__num" }, Math.round(b[2] * 100) + "%"));
        bars.appendChild(row);
      });
      card.appendChild(bars);
      card.appendChild(el("p", { class: "demo-meta-num" }, "Model confidence: " + Math.round(p.conf * 100) + "%"));
      root.appendChild(card);
      root.appendChild(reroll("Next ticker →", function () { idx++; paint(); }));
      root.appendChild(ctaLink());
    }
    paint();
  };

  // 9. esg-news-classifier — cycling headlines with multi-label tags ─────
  WIDGETS["esg-news-classifier"] = function (root) {
    var samples = [
      { headline: "Regulator fines bank $120M for AML breaches.",
        tags: [{ l: "governance:financial-crime", c: 0.94 }, { l: "governance:reg-action", c: 0.81 }],
        severity: "high" },
      { headline: "Major auto-maker reports 35% drop in fleet emissions YoY.",
        tags: [{ l: "environmental:emissions", c: 0.92 }, { l: "environmental:transition", c: 0.71 }],
        severity: "low" },
      { headline: "Workers at distribution centre vote to unionise.",
        tags: [{ l: "social:labor-relations", c: 0.88 }, { l: "governance:supply-chain", c: 0.55 }],
        severity: "medium" },
    ];
    var idx = 0;
    function paint() {
      clear(root);
      var s = samples[idx % samples.length];
      var card = el("div", { class: "demo-card demo-headline-card" });
      card.appendChild(el("blockquote", { class: "demo-headline" }, "“" + s.headline + "”"));
      var tags = el("div", { class: "demo-tags" });
      s.tags.forEach(function (t) {
        var tag = el("span", { class: "demo-tag demo-tag--bordered" });
        tag.appendChild(el("strong", null, t.l));
        tag.appendChild(el("span", { class: "demo-meta-num" }, " " + Math.round(t.c * 100) + "%"));
        tags.appendChild(tag);
      });
      card.appendChild(tags);
      card.appendChild(el("p", null, ""));
      var sev = el("p", null, "Severity: ");
      sev.appendChild(el("span", { class: "demo-chip demo-chip--" + (s.severity === "high" ? "negative" : s.severity === "low" ? "positive" : "neutral") }, s.severity.toUpperCase()));
      card.appendChild(sev);
      root.appendChild(card);
      root.appendChild(reroll("Next headline →", function () { idx++; paint(); }));
      root.appendChild(ctaLink());
    }
    paint();
  };

  // 10. insurance-claims-triage — severity gauge + queue routing ─────────
  WIDGETS["insurance-claims-triage"] = function (root) {
    var presets = [
      { type: "Auto", amount: 4500, severity: "low", fraud: 0.18, queue: "fast-track" },
      { type: "Property", amount: 78000, severity: "high", fraud: 0.41, queue: "complex-loss" },
      { type: "Liability", amount: 22000, severity: "medium", fraud: 0.62, queue: "fraud-investigation" },
    ];
    var idx = 0;
    function gauge(value, label) {
      var w = 220, h = 120, cx = w / 2, cy = h - 10, R = 90;
      var pct = Math.max(0, Math.min(1, value));
      var end = Math.PI + Math.PI * pct;
      var px = cx + R * Math.cos(end), py = cy + R * Math.sin(end);
      var large = pct > 0.5 ? 1 : 0;
      var trackArc = "M " + (cx - R) + " " + cy + " A " + R + " " + R + " 0 1 1 " + (cx + R) + " " + cy;
      var fillArc = "M " + (cx - R) + " " + cy + " A " + R + " " + R + " 0 " + large + " 1 " + px + " " + py;
      var color = pct < 0.34 ? "#10b981" : pct < 0.67 ? "#f59e0b" : "#ef4444";
      return svg("0 0 " + w + " " + h,
        '<path d="' + trackArc + '" stroke="#e5e7eb" stroke-width="12" fill="none" stroke-linecap="round"/>' +
        '<path d="' + fillArc + '" stroke="' + color + '" stroke-width="12" fill="none" stroke-linecap="round"/>' +
        '<text x="' + cx + '" y="' + (cy - 18) + '" text-anchor="middle" font-size="22" font-weight="700" fill="#111827">' + Math.round(pct * 100) + "%</text>" +
        '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-size="10" fill="#6b7280">' + label + "</text>",
        label);
    }
    function paint() {
      clear(root);
      var p = presets[idx % presets.length];
      var card = el("div", { class: "demo-card demo-claims" });
      card.appendChild(el("div", { class: "demo-claims__hdr" }, p.type + " · $" + p.amount.toLocaleString()));
      var dials = el("div", { class: "demo-claims__dials" });
      var sevPct = { low: 0.2, medium: 0.55, high: 0.9 }[p.severity];
      var sevWrap = el("div"); sevWrap.innerHTML = gauge(sevPct, "Severity (" + p.severity + ")");
      dials.appendChild(sevWrap);
      var fraudWrap = el("div"); fraudWrap.innerHTML = gauge(p.fraud, "Fraud risk");
      dials.appendChild(fraudWrap);
      card.appendChild(dials);
      var route = el("p", { class: "demo-route" });
      route.innerHTML = "Routed to <strong>" + p.queue + "</strong> queue";
      card.appendChild(route);
      root.appendChild(card);
      root.appendChild(reroll("Next claim →", function () { idx++; paint(); }));
      root.appendChild(ctaLink());
    }
    paint();
  };

  // ── Lazy-mount on first Demo tab show ─────────────────────────────────
  var mounted = false;
  function maybeMount(tab) {
    if (tab !== "demo" || mounted) return;
    mounted = true;
    var w = WIDGETS[slug];
    if (w) {
      try { w(host); }
      catch (err) {
        host.innerHTML = '<div class="demo-card"><p>Demo widget failed to load. ' +
          '<a href="' + window.location.pathname.replace("/models/", "/playground/") + '">Try in the Playground</a> instead.</p></div>';
      }
    }
    // If no widget registered, the empty-state in the Liquid layout stays.
  }
  document.addEventListener("model:tab-shown", function (ev) { maybeMount(ev.detail.tab); });

  // Both model-tabs.js and model-widgets.js load with `defer` in source
  // order. model-tabs.js fires its initial `model:tab-shown` event during
  // its own IIFE — i.e. *before* the listener above is attached. So if the
  // user lands on `#demo`, we'd miss the initial event. Resolve by reading
  // the active tab from the live tablist after registration.
  var activeTab = document.querySelector('.model-tabs [role="tab"][aria-selected="true"]');
  if (activeTab && activeTab.dataset.tab) maybeMount(activeTab.dataset.tab);
})();
