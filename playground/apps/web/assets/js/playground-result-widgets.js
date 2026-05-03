/* Playground Try-tab — per-model result panel widgets.
 *
 * `playground-shell.js` consults `window.PG_RESULT_WIDGETS[slug]` before
 * falling back to the generic key/value tree renderer. Each widget
 * receives `(container, output)` where `output` is the parsed mock
 * payload (see `playground-mocks.ts` for the per-slug shape). Widgets
 * own all their DOM — the shell clears the container before calling.
 *
 * Phase 6 will swap the mocks for real backends; the output schemas
 * carry through, so these widgets keep working unchanged.
 */
(function () {
  "use strict";

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "style") e.setAttribute("style", attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (text != null) e.textContent = text;
    return e;
  }
  function svg(viewBox, inner, label) {
    return '<svg class="pg-result__svg" viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      (label || "result chart") + '">' + inner + "</svg>";
  }

  var W = {};

  // 1. sentiment-from-filings ─────────────────────────────────────────────
  W["sentiment-from-filings"] = function (root, out) {
    var sent = String(out.sentiment || "neutral");
    var conf = Number(out.confidence || 0);
    var card = el("div", { class: "pg-result__card" });
    var row = el("div", { class: "demo-sentiment__meta" });
    row.appendChild(el("span", { class: "demo-chip demo-chip--" + sent }, sent.toUpperCase()));
    var bar = el("div", { class: "demo-bar demo-bar--lg" });
    bar.appendChild(el("div", { class: "demo-bar__fill", style: "width:" + Math.round(conf * 100) + "%" }));
    row.appendChild(bar);
    row.appendChild(el("span", { class: "demo-meta-num" }, Math.round(conf * 100) + "% confidence"));
    card.appendChild(row);
    if (Array.isArray(out.topics) && out.topics.length) {
      var tags = el("div", { class: "demo-tags" });
      out.topics.forEach(function (t) { tags.appendChild(el("span", { class: "demo-tag" }, "#" + t)); });
      card.appendChild(tags);
    }
    root.appendChild(card);
  };

  // 2. portfolio-optimiser — weights bar chart + stats ───────────────────
  W["portfolio-optimiser"] = function (root, out) {
    var weights = Array.isArray(out.weights) ? out.weights : [];
    var card = el("div", { class: "pg-result__card" });
    var bars = el("div", { class: "demo-bars" });
    var max = weights.reduce(function (m, w) { return Math.max(m, w); }, 0) || 1;
    weights.forEach(function (w, i) {
      var row = el("div", { class: "demo-bars__row" });
      row.appendChild(el("span", { class: "demo-bars__label" }, "w[" + i + "]"));
      var bar = el("div", { class: "demo-bar demo-bar--lg" });
      bar.appendChild(el("div", { class: "demo-bar__fill", style: "width:" + Math.round((w / max) * 100) + "%" }));
      row.appendChild(bar);
      row.appendChild(el("span", { class: "demo-bars__num" }, (w * 100).toFixed(1) + "%"));
      bars.appendChild(row);
    });
    card.appendChild(bars);
    var stats = el("div", { class: "demo-stats" });
    [["Expected return", (Number(out.expected_return || 0) * 100).toFixed(2) + "%"],
     ["Expected vol", (Number(out.expected_vol || 0) * 100).toFixed(2) + "%"]].forEach(function (kv) {
      var s = el("div", { class: "demo-stat" });
      s.appendChild(el("span", { class: "demo-stat__label" }, kv[0]));
      s.appendChild(el("strong", { class: "demo-stat__value" }, kv[1]));
      stats.appendChild(s);
    });
    card.appendChild(stats);
    root.appendChild(card);
  };

  // 3. credit-default-classifier — PD pill + drivers ─────────────────────
  W["credit-default-classifier"] = function (root, out) {
    var pd = Number(out.pd_12m || 0);
    var rating = String(out.rating || "—");
    var card = el("div", { class: "pg-result__card demo-credit__compact" });
    var hdr = el("div", { class: "demo-claims__hdr" });
    hdr.appendChild(el("strong", null, "Rating " + rating));
    var tone = pd > 0.1 ? "negative" : pd > 0.05 ? "neutral" : "positive";
    hdr.appendChild(el("span", { class: "demo-chip demo-chip--" + tone }, "PD 12m: " + (pd * 100).toFixed(2) + "%"));
    card.appendChild(hdr);
    if (Array.isArray(out.drivers) && out.drivers.length) {
      var ul = el("ul", { class: "demo-reasons" });
      out.drivers.forEach(function (d) {
        var li = el("li", { class: "demo-reason demo-reason--warn" });
        li.appendChild(el("span", { class: "demo-reason__code" }, "•"));
        li.appendChild(el("span", { class: "demo-reason__label" }, d));
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }
    root.appendChild(card);
  };

  // 4. fraud-anomaly-detector — score bar + flagged indexes ──────────────
  W["fraud-anomaly-detector"] = function (root, out) {
    var score = Number(out.score || 0);
    var flagged = Array.isArray(out.flagged_indexes) ? out.flagged_indexes : [];
    var card = el("div", { class: "pg-result__card" });
    var hdr = el("div", { class: "demo-fraud__head" });
    hdr.appendChild(el("strong", null, "Anomaly score: " + (score * 100).toFixed(0) + "%"));
    var bar = el("div", { class: "demo-bar demo-bar--lg" });
    var tone = score > 0.6 ? "high" : score > 0.3 ? "med" : "low";
    bar.appendChild(el("div", { class: "demo-bar__fill demo-bar__fill--" + tone, style: "width:" + Math.round(score * 100) + "%" }));
    hdr.appendChild(bar);
    card.appendChild(hdr);
    if (flagged.length) {
      var p = el("p", null, "Flagged transactions: ");
      flagged.forEach(function (i) { p.appendChild(el("span", { class: "demo-tag demo-tag--bordered" }, "#" + i)); });
      card.appendChild(p);
    } else {
      card.appendChild(el("p", null, "No transactions flagged."));
    }
    root.appendChild(card);
  };

  // 5. fx-volatility-forecast — line + band ──────────────────────────────
  W["fx-volatility-forecast"] = function (root, out) {
    var mid = Array.isArray(out.forecast_vol) ? out.forecast_vol : [];
    var lo = Array.isArray(out.confidence_lo) ? out.confidence_lo : mid.map(function (v) { return v * 0.85; });
    var hi = Array.isArray(out.confidence_hi) ? out.confidence_hi : mid.map(function (v) { return v * 1.15; });
    if (!mid.length) { root.appendChild(el("p", null, "No forecast returned.")); return; }
    var w = 520, h = 200, n = mid.length;
    var all = lo.concat(hi);
    var min = Math.min.apply(null, all), max = Math.max.apply(null, all);
    var span = max - min || 1;
    var x = function (i) { return (i / Math.max(1, n - 1)) * (w - 50) + 40; };
    var y = function (v) { return h - 24 - ((v - min) / span) * (h - 44); };
    var band = "M" + lo.map(function (v, i) { return x(i) + "," + y(v); }).join(" L ") +
      " L " + hi.slice().reverse().map(function (v, i) { return x(n - 1 - i) + "," + y(v); }).join(" L ") + " Z";
    var line = "M" + mid.map(function (v, i) { return x(i) + "," + y(v); }).join(" L ");
    var card = el("div", { class: "pg-result__card" });
    card.insertAdjacentHTML("beforeend", svg("0 0 " + w + " " + h,
      '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="white"/>' +
      '<path d="' + band + '" fill="rgba(14,165,233,0.18)"/>' +
      '<path d="' + line + '" fill="none" stroke="#0ea5e9" stroke-width="2"/>',
      "FX volatility forecast"));
    root.appendChild(card);
  };

  // 6. yield-curve-predictor — curve plot ────────────────────────────────
  W["yield-curve-predictor"] = function (root, out) {
    var ts = Array.isArray(out.tenors_years) ? out.tenors_years : [];
    var ys = Array.isArray(out.yields_pct) ? out.yields_pct : [];
    if (!ts.length || ts.length !== ys.length) { root.appendChild(el("p", null, "No curve returned.")); return; }
    var w = 520, h = 200;
    var min = Math.min.apply(null, ys) - 0.3, max = Math.max.apply(null, ys) + 0.3, span = max - min || 1;
    var x = function (i) { return (i / Math.max(1, ts.length - 1)) * (w - 60) + 40; };
    var y = function (v) { return h - 30 - ((v - min) / span) * (h - 50); };
    var line = "M" + ys.map(function (v, i) { return x(i) + "," + y(v); }).join(" L ");
    var dots = ys.map(function (v, i) { return '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="3" fill="#6366f1"/>'; }).join("");
    var lbls = ts.map(function (t, i) { return '<text x="' + x(i) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="10" fill="#6b7280">' + t + "y</text>"; }).join("");
    var card = el("div", { class: "pg-result__card" });
    card.insertAdjacentHTML("beforeend", svg("0 0 " + w + " " + h,
      '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="white"/>' +
      '<path d="' + line + '" fill="none" stroke="#6366f1" stroke-width="2"/>' + dots + lbls,
      "Predicted yield curve"));
    root.appendChild(card);
  };

  // 7. compliance-redaction-llm — redacted text + span count ─────────────
  W["compliance-redaction-llm"] = function (root, out) {
    var card = el("div", { class: "pg-result__card" });
    card.appendChild(el("p", { class: "demo-meta-num" }, "Spans redacted: " + (out.spans_redacted || 0)));
    var pre = el("pre", { class: "demo-redacted" });
    pre.textContent = String(out.redacted_text || "");
    card.appendChild(pre);
    root.appendChild(card);
  };

  // 8. earnings-surprise-predictor — direction badge + bars ──────────────
  W["earnings-surprise-predictor"] = function (root, out) {
    var dir = String(out.surprise_direction || "inline");
    var pct = Number(out.surprise_pct || 0);
    var conf = Number(out.confidence || 0);
    var card = el("div", { class: "pg-result__card" });
    var hdr = el("div", { class: "demo-eps__hdr" });
    var tone = dir === "beat" ? "positive" : dir === "miss" ? "negative" : "neutral";
    hdr.appendChild(el("span", { class: "demo-chip demo-chip--" + tone }, dir.toUpperCase()));
    hdr.appendChild(el("span", { class: "demo-meta-num" }, " " + (pct * 100).toFixed(1) + "% surprise"));
    card.appendChild(hdr);
    var bar = el("div", { class: "demo-bar demo-bar--lg" });
    bar.appendChild(el("div", { class: "demo-bar__fill", style: "width:" + Math.round(conf * 100) + "%" }));
    card.appendChild(bar);
    card.appendChild(el("p", { class: "demo-meta-num" }, "Model confidence: " + Math.round(conf * 100) + "%"));
    root.appendChild(card);
  };

  // 9. esg-news-classifier — labels + severity ───────────────────────────
  W["esg-news-classifier"] = function (root, out) {
    var labels = Array.isArray(out.labels) ? out.labels : [];
    var sev = String(out.severity || "low");
    var card = el("div", { class: "pg-result__card" });
    var tags = el("div", { class: "demo-tags" });
    labels.forEach(function (l) { tags.appendChild(el("span", { class: "demo-tag demo-tag--bordered" }, l)); });
    card.appendChild(tags);
    var p = el("p", null, "Severity: ");
    p.appendChild(el("span", { class: "demo-chip demo-chip--" + (sev === "high" ? "negative" : sev === "low" ? "positive" : "neutral") }, sev.toUpperCase()));
    card.appendChild(p);
    root.appendChild(card);
  };

  // 10. insurance-claims-triage — severity + fraud + queue ───────────────
  W["insurance-claims-triage"] = function (root, out) {
    var sev = String(out.severity || "low");
    var fraud = Number(out.fraud_risk || 0);
    var queue = String(out.queue || "fast-track");
    var card = el("div", { class: "pg-result__card" });
    var hdr = el("div", { class: "demo-claims__hdr" });
    hdr.appendChild(el("span", { class: "demo-chip demo-chip--" + (sev === "high" ? "negative" : sev === "low" ? "positive" : "neutral") }, "Severity: " + sev.toUpperCase()));
    hdr.appendChild(el("span", { class: "demo-meta-num" }, " · Fraud risk " + Math.round(fraud * 100) + "%"));
    card.appendChild(hdr);
    var bar = el("div", { class: "demo-bar demo-bar--lg" });
    var tone = fraud > 0.5 ? "high" : fraud > 0.25 ? "med" : "low";
    bar.appendChild(el("div", { class: "demo-bar__fill demo-bar__fill--" + tone, style: "width:" + Math.round(fraud * 100) + "%" }));
    card.appendChild(bar);
    var route = el("p", { class: "demo-route" }, "Routed to ");
    route.appendChild(el("strong", null, queue));
    route.appendChild(document.createTextNode(" queue"));
    card.appendChild(route);
    root.appendChild(card);
  };

  window.PG_RESULT_WIDGETS = W;
})();
