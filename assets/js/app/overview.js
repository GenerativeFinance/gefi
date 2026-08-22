/* Investor Overview (/app/, UI-FOLLOWUP task 203). Reads GeFi.DEMO only. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;

    function txt(sel, value) {
      var el = document.querySelector(sel);
      if (el) el.textContent = value;
    }

    /* hero band hydrated by app/hero.js */

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

    /* allocation donut via the shared helper */
    var donutEl = document.querySelector("[data-ov-donut]");
    donutEl.appendChild(GeFi.app.donut(D.allocation, "Asset allocation donut chart"));

    GeFi.app.donutLegend(document.querySelector("[data-ov-legend]"), D.allocation);

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
