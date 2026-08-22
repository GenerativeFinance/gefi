/* Portfolio Performance — four segments from one dataset (task 206). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    /* KPI row */
    var kpis = document.querySelector("[data-pp-kpis]");
    [
      { label: "Total Portfolio Value", value: fmt.moneyFull(D.portfolio.value), sub: fmt.signedPct(D.portfolio.ytdPct) + " YTD", tone: "is-up" },
      { label: "Monthly Return", value: fmt.signedPct(D.portfolio.monthlyPct), sub: "vs " + fmt.signedPct(D.portfolio.monthlyBenchPct) + " benchmark", tone: "is-up" },
      { label: "Sharpe Ratio", value: String(D.risk.sharpe), sub: "vs " + D.risk.sharpeBench + " benchmark", tone: "is-up" },
      { label: "Max Drawdown", value: fmt.signedPct(D.risk.maxDrawdown), sub: "Better than " + fmt.signedPct(D.risk.maxDrawdownBench), tone: "is-warn" }
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
      kpis.appendChild(card);
    });

    /* Overview: value line + donut (same dataset as Allocation) */
    function thin(series, step) {
      return series.filter(function (_, i) { return i % step === 0; });
    }
    document.querySelector("[data-pp-value]").appendChild(GeFi.svg.line(
      [{ name: "Portfolio", values: thin(D.portfolio.valueSeries, 6), kind: "area" }],
      { label: "Portfolio value over time", xLabels: ["6 months ago", "today"] }
    ));
    document.querySelector("[data-pp-donut]").appendChild(app.donut(D.allocation, "Asset allocation"));
    app.donutLegend(document.querySelector("[data-pp-donut-legend]"), D.allocation);

    /* Returns: grouped monthly bars + top performers */
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    var rand = GeFi.seed.rng(GeFi.seed.hash("demo|monthly-returns"));
    var port = months.map(function (_, i) { return +(D.portfolio.monthlyPct + (rand() - 0.5) * 6 - (i === 1 || i === 5 ? 4 : 0)).toFixed(1); });
    var bench = months.map(function () { return +(D.portfolio.monthlyBenchPct + (rand() - 0.5) * 4).toFixed(1); });
    document.querySelector("[data-pp-returns]").appendChild(
      app.groupedBars(months, port, bench, { label: "Monthly returns, portfolio versus benchmark, percent" })
    );

    var top = document.querySelector("[data-pp-top]");
    D.holdings.slice().sort(function (a, b) { return b.ret - a.ret; }).slice(0, 5).forEach(function (h) {
      var li = document.createElement("li");
      li.className = "app-holding";
      var tick = document.createElement("span");
      tick.className = "app-holding__ticker mono";
      tick.textContent = h.ticker;
      var main = document.createElement("div");
      main.className = "app-holding__main";
      var name = document.createElement("p");
      name.className = "app-holding__name";
      name.textContent = h.name;
      main.appendChild(name);
      var right = document.createElement("div");
      right.className = "app-holding__right";
      var ret = document.createElement("span");
      ret.className = "mono app-holding__ret " + (h.ret >= 0 ? "is-up" : "is-down");
      ret.textContent = fmt.signedPct(h.ret);
      var wt = document.createElement("span");
      wt.className = "mono app-holding__day";
      wt.textContent = h.weight.toFixed(1) + "% allocation";
      right.appendChild(ret);
      right.appendChild(wt);
      li.appendChild(tick);
      li.appendChild(main);
      li.appendChild(right);
      top.appendChild(li);
    });

    /* Allocation: horizontal color-coded bars (same data as the donut) */
    var alloc = document.querySelector("[data-pp-alloc]");
    D.allocation.forEach(function (a, i) {
      var row = document.createElement("div");
      row.className = "app-allocbar";
      var name = document.createElement("span");
      name.className = "app-allocbar__name";
      name.textContent = a.name;
      var track = document.createElement("div");
      track.className = "app-meter";
      var fill = document.createElement("div");
      fill.className = "app-meter__fill";
      fill.style.width = a.pct + "%";
      fill.style.background = app.donutColors[i % app.donutColors.length];
      track.appendChild(fill);
      var val = document.createElement("span");
      val.className = "app-meterrow__val";
      val.textContent = a.pct + "%";
      row.appendChild(name);
      row.appendChild(track);
      row.appendChild(val);
      alloc.appendChild(row);
    });

    /* Risk Analysis: benchmark row-cards with Good/Neutral badges */
    var riskEl = document.querySelector("[data-pp-risk]");
    [
      { name: "Sharpe Ratio", val: D.risk.sharpe, bench: D.risk.sharpeBench, betterHigh: true },
      { name: "Max Drawdown", val: D.risk.maxDrawdown, bench: D.risk.maxDrawdownBench, betterHigh: true, pct: true },
      { name: "Beta", val: D.risk.beta, bench: 1.0, neutral: true },
      { name: "Alpha", val: D.risk.alpha, bench: 0, betterHigh: true, pct: true },
      { name: "Volatility", val: D.risk.volatility, bench: 16.0, betterHigh: false, pct: true }
    ].forEach(function (m) {
      var good = m.neutral ? null : m.betterHigh ? m.val > m.bench : m.val < m.bench;
      var card = document.createElement("div");
      card.className = "app-rowcard";
      var main = document.createElement("div");
      main.className = "app-rowcard__main";
      var head = document.createElement("div");
      head.className = "app-rowcard__head";
      var title = document.createElement("p");
      title.className = "app-rowcard__title";
      title.textContent = m.name;
      var sub = document.createElement("span");
      sub.className = "app-rowcard__sub";
      sub.textContent = "Benchmark: " + m.bench + (m.pct ? "%" : "");
      head.appendChild(title);
      head.appendChild(sub);
      main.appendChild(head);
      var rail = document.createElement("div");
      rail.className = "app-rowcard__rail";
      var val = document.createElement("span");
      val.className = "mono app-holding__ret " + (good === false ? "" : "is-up");
      val.textContent = m.val + (m.pct ? "%" : "");
      var badge = GeFi.app.chip(good == null ? "neutral" : good ? "deployed" : "neutral", good == null ? "Neutral" : good ? "Good" : "Neutral");
      rail.appendChild(val);
      rail.appendChild(badge);
      card.appendChild(main);
      card.appendChild(rail);
      riskEl.appendChild(card);
    });
  });
})(window, document);
