/* Investor Overview (/app/, UI-FOLLOWUP task 203). Reads GeFi.DEMO only. */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;

    function txt(sel, value) {
      var el = document.querySelector(sel);
      if (el) el.textContent = value;
    }

    /* hero band */
    txt("[data-hero-value]", fmt.moneyFull(D.portfolio.value));
    txt("[data-hero-day]", "+" + fmt.moneyFull(D.portfolio.dayChange) + " (" + fmt.signedPct(D.portfolio.dayChangePct) + ") today");
    txt("[data-hero-month]", fmt.signedPct(D.portfolio.monthlyPct));
    txt("[data-hero-bench]", "vs " + fmt.signedPct(D.portfolio.monthlyBenchPct) + " benchmark");
    txt("[data-hero-ytd]", fmt.signedPct(D.portfolio.ytdPct));
    txt("[data-hero-cash]", fmt.moneyFull(D.portfolio.cash));

    /* KPI row */
    var kpis = document.querySelector("[data-ov-kpis]");
    [
      { label: "Active AI Models", value: String(D.aiModels.active), sub: "+2 from last week", tone: "is-up", icon: "brand" },
      { label: "Trading Bots", value: "3", sub: "+1 from last week", tone: "is-up", icon: "blue" },
      { label: "Risk Score", value: "6.2/10", sub: "-0.3 from last week", tone: "is-warn", icon: "amber" },
      { label: "Alerts", value: "2", sub: "1 needs review", tone: "is-down", icon: "red" }
    ].forEach(function (k) {
      var card = document.createElement("div");
      card.className = "app-kpi";
      var label = document.createElement("p");
      label.className = "app-kpi__label";
      label.textContent = k.label;
      var value = document.createElement("p");
      value.className = "app-kpi__value";
      value.textContent = k.value;
      var sub = document.createElement("p");
      sub.className = "app-kpi__sub " + k.tone;
      sub.textContent = k.sub;
      card.appendChild(label);
      card.appendChild(value);
      card.appendChild(sub);
      kpis.appendChild(card);
    });

    /* performance chart: portfolio (area) vs dashed benchmark */
    var perf = document.querySelector("[data-ov-perf]");
    var step = 6; /* thin the 180-day series for a readable line */
    function thin(series) {
      return series.filter(function (_, i) { return i % step === 0; });
    }
    perf.appendChild(GeFi.svg.line(
      [
        { name: "Portfolio", values: thin(D.portfolio.valueSeries), kind: "area" },
        { name: "Benchmark", values: thin(D.portfolio.benchSeries), kind: "dashed" }
      ],
      { label: "Portfolio value versus benchmark over six months", xLabels: ["6 months ago", "today"] }
    ));

    /* allocation donut (SVG built here — no new dashboard primitive) */
    var colors = ["#6D5BFF", "#22C55E", "#F59E0B", "#F97316", "#22D3EE"];
    var donutEl = document.querySelector("[data-ov-donut]");
    var svg = GeFi.svg.el("svg", { viewBox: "0 0 120 120", width: "100%", role: "img", "aria-label": "Asset allocation donut chart", class: "app-donut" });
    var cx = 60, cy = 60, r = 44, width = 18;
    var start = -Math.PI / 2;
    D.allocation.forEach(function (a, i) {
      var frac = a.pct / 100;
      var end = start + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
      var x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
      var path = GeFi.svg.el("path", {
        d: "M" + x1.toFixed(2) + " " + y1.toFixed(2) + " A" + r + " " + r + " 0 " + large + " 1 " + x2.toFixed(2) + " " + y2.toFixed(2),
        stroke: colors[i % colors.length],
        "stroke-width": width,
        fill: "none"
      });
      svg.appendChild(path);
      start = end + 0.02; /* hairline gap between segments */
    });
    donutEl.appendChild(svg);

    var legend = document.querySelector("[data-ov-legend]");
    D.allocation.forEach(function (a, i) {
      var li = document.createElement("li");
      var dot = document.createElement("span");
      dot.className = "app-ov-legend__dot";
      dot.style.background = colors[i % colors.length];
      dot.setAttribute("aria-hidden", "true");
      var name = document.createElement("span");
      name.textContent = a.name;
      var val = document.createElement("span");
      val.className = "mono app-ov-legend__val";
      val.textContent = a.pct + "%";
      li.appendChild(dot);
      li.appendChild(name);
      li.appendChild(val);
      legend.appendChild(li);
    });

    /* activity feed */
    var feed = document.querySelector("[data-ov-activity]");
    D.activity.forEach(function (a) {
      var li = document.createElement("li");
      li.className = "app-activity__row";
      var main = document.createElement("div");
      main.className = "app-activity__main";
      var title = document.createElement("p");
      title.className = "app-activity__title";
      title.textContent = a.title;
      var detail = document.createElement("p");
      detail.className = "app-activity__detail";
      detail.textContent = a.detail + " · " + a.when;
      main.appendChild(title);
      main.appendChild(detail);
      var val = document.createElement("span");
      val.className = "app-activity__val mono " + (a.tone === "up" ? "is-up" : a.tone === "warn" ? "is-warn" : "is-info");
      val.textContent = a.value;
      li.appendChild(main);
      li.appendChild(val);
      feed.appendChild(li);
    });
  });
})(window, document);
