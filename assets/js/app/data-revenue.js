/* Provider Market Insights + Revenue tabs (task 222). Revenue figures
 * come from GeFi.appProvider (data-provider.js), so this tab can never
 * disagree with Overview — same rows, same math. */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO || !GeFi.appProvider) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    /* ---- Market Insights tab ---- */
    var trendsEl = document.querySelector("[data-di-trends]");
    if (trendsEl) {
      var P = D.provider;
      document.querySelector("[data-di-adoption]").textContent = fmt.signedPct(P.adoptionPct);
      document.querySelector("[data-di-impact]").textContent = P.impactScore + " / 10";
      document.querySelector("[data-di-value]").textContent = fmt.moneyFull(P.impactValue);
      document.querySelector("[data-di-models]").textContent = String(P.modelsUsingData);

      P.trends.forEach(function (t) {
        var li = document.createElement("li");
        li.className = "app-holding";
        var main = document.createElement("div");
        main.className = "app-holding__main";
        var name = document.createElement("p");
        name.className = "app-holding__name";
        name.textContent = t.name;
        var sub = document.createElement("p");
        sub.className = "app-holding__sub";
        sub.textContent = "demand from marketplace models";
        main.appendChild(name);
        main.appendChild(sub);
        var right = document.createElement("div");
        right.className = "app-holding__right";
        var growth = document.createElement("span");
        growth.className = "mono app-holding__ret is-up";
        growth.textContent = fmt.signedPct(t.growthPct, 0) + " growth";
        right.appendChild(growth);
        right.appendChild(app.chip(t.impact.toLowerCase(), t.impact + " impact"));
        li.appendChild(main);
        li.appendChild(right);
        trendsEl.appendChild(li);
      });

      var modal = document.querySelector("[data-di-modal]");
      document.querySelector("[data-di-report]").addEventListener("click", function () {
        var t = GeFi.appProvider.totals();
        modal.querySelector("[data-di-modal-body]").textContent = [
          "# SAMPLE DATA — GeFi market insights report",
          "Generated " + fmt.date("2026-08-22"),
          "",
          "Datasets in registry:   " + t.datasets,
          "Total revenue:          " + fmt.moneyFull(t.revenue),
          "Active subscriptions:   " + t.subscribers,
          "Models using this data: " + D.provider.modelsUsingData,
          "Adoption rate:          " + fmt.signedPct(D.provider.adoptionPct),
          "Market impact:          " + D.provider.impactScore + " / 10 (" + fmt.moneyFull(D.provider.impactValue) + ")",
          "",
          "Top trends: " + D.provider.trends.map(function (x) {
            return x.name + " (" + fmt.signedPct(x.growthPct, 0) + ")";
          }).join(", ")
        ].join("\n");
        modal.hidden = false;
        modal.querySelector("[data-di-modal-close]").focus();
      });
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-di-modal-close]")) modal.hidden = true;
      });
    }

    /* ---- Revenue tab ---- */
    var kpiEl = document.querySelector("[data-dr-kpis]");
    if (kpiEl) {
      var t = GeFi.appProvider.totals();
      var paying = GeFi.appProvider.allDatasets().filter(function (d) { return d.revenue > 0; });

      [
        /* Identical label+value to the Overview KPI — derived from the same rows */
        { label: "Total Revenue", value: fmt.moneyFull(t.revenue), sub: "lifetime, sample", tone: "is-up" },
        { label: "Monthly Revenue", value: fmt.moneyFull(Math.round(t.revenue / 12)), sub: "trailing 12-month average", tone: "" },
        { label: "Active Subscriptions", value: String(t.subscribers), sub: "models + tenants", tone: "" },
        { label: "Avg Revenue / Dataset", value: paying.length ? fmt.moneyFull(Math.round(t.revenue / paying.length)) : "—", sub: "across " + paying.length + " earning datasets", tone: "" }
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
        kpiEl.appendChild(card);
      });

      var bars = document.querySelector("[data-dr-bars]");
      paying.slice().sort(function (a, b) { return b.revenue - a.revenue; }).forEach(function (d, i) {
        var share = t.revenue ? (d.revenue / t.revenue) * 100 : 0;
        var row = document.createElement("div");
        row.className = "app-allocbar";
        var name = document.createElement("span");
        name.className = "app-allocbar__name";
        name.textContent = d.name;
        var track = document.createElement("div");
        track.className = "app-meter";
        var fill = document.createElement("div");
        fill.className = "app-meter__fill";
        fill.style.width = share.toFixed(1) + "%";
        fill.style.background = app.donutColors[i % app.donutColors.length];
        track.appendChild(fill);
        var val = document.createElement("span");
        val.className = "app-meterrow__val mono";
        val.textContent = fmt.moneyFull(d.revenue) + " · " + share.toFixed(1) + "%";
        row.appendChild(name);
        row.appendChild(track);
        row.appendChild(val);
        bars.appendChild(row);
      });

      /* Seeded monthly series that sums exactly to total revenue, so the
       * chart, the KPI and the bars all describe the same dollars. */
      var rand = GeFi.seed.rng(GeFi.seed.hash("provider|monthly-revenue"));
      var weights = [];
      var wsum = 0;
      for (var i = 0; i < 12; i++) {
        var w = 0.6 + (i / 11) * 0.8 + rand() * 0.3;
        weights.push(w);
        wsum += w;
      }
      var months = [];
      var used = 0;
      weights.forEach(function (w, idx) {
        var v = idx === 11 ? t.revenue - used : Math.round((w / wsum) * t.revenue);
        used += v;
        months.push(v);
      });
      document.querySelector("[data-dr-chart]").appendChild(GeFi.svg.line(
        [{ name: "Revenue", values: months, kind: "area" }],
        { label: "Monthly revenue, Sep 2025 – Aug 2026" }
      ));
      document.querySelector("[data-dr-payout]").textContent = fmt.moneyFull(months[11]);
    }
  });
})(window, document);
