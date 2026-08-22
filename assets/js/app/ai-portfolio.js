/* AI Portfolio split panel (task 207). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    function kv(dl, label, value, cls) {
      var div = document.createElement("div");
      var dt = document.createElement("dt");
      dt.textContent = label;
      var dd = document.createElement("dd");
      dd.className = "mono" + (cls ? " " + cls : "");
      dd.textContent = value;
      div.appendChild(dt);
      div.appendChild(dd);
      dl.appendChild(div);
    }

    var ov = document.querySelector("[data-aip-overview]");
    kv(ov, "Total Investment", fmt.moneyFull(D.portfolio.value));
    kv(ov, "Live P&L", "+" + fmt.moneyFull(D.portfolio.dayChange), "is-up");
    kv(ov, "Annual Returns", fmt.signedPct(D.portfolio.ytdPct), "is-up");
    kv(ov, "Sharpe Ratio", String(D.risk.sharpe));
    document.querySelector("[data-aip-market]").textContent =
      "Performance vs Market: " + fmt.signedPct(D.aiPortfolio.vsMarketPct) + " better";

    var riskEl = document.querySelector("[data-aip-risk]");
    D.aiPortfolio.riskDistribution.forEach(function (a) {
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
      track.appendChild(fill);
      var val = document.createElement("span");
      val.className = "app-meterrow__val";
      val.textContent = a.pct + "%";
      row.appendChild(name);
      row.appendChild(track);
      row.appendChild(val);
      riskEl.appendChild(row);
    });

    var strat = document.querySelector("[data-aip-strategies]");
    D.aiPortfolio.strategies.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "app-holding";
      var main = document.createElement("div");
      main.className = "app-holding__main";
      var name = document.createElement("p");
      name.className = "app-holding__name";
      name.textContent = s.name;
      main.appendChild(name);
      var right = document.createElement("div");
      right.className = "app-holding__right";
      var value = document.createElement("span");
      value.className = "mono app-holding__ret";
      value.textContent = fmt.moneyFull(s.value);
      var ret = document.createElement("span");
      ret.className = "mono app-holding__day is-up";
      ret.textContent = fmt.signedPct(s.retPct);
      right.appendChild(value);
      right.appendChild(ret);
      li.appendChild(main);
      li.appendChild(right);
      strat.appendChild(li);
    });

    /* confidence gauge (0..1) */
    document.querySelector("[data-aip-gauge]").appendChild(
      GeFi.svg.gauge(D.aiModels.confidence / 100, { label: "AI confidence score gauge" })
    );
    document.querySelector("[data-aip-conf]").textContent = D.aiModels.confidence.toFixed(1) + "%";

    /* actions */
    var status = document.querySelector("[data-aip-status]");
    document.querySelector("[data-aip-manual]").addEventListener("click", function () {
      status.textContent = "Manual override armed for this preview session — AI rebalancing paused until you run one.";
    });

    var modal = document.querySelector("[data-aip-modal]");
    document.querySelector("[data-aip-report]").addEventListener("click", function () {
      var lines = [
        "GEFI PORTFOLIO REPORT — SAMPLE DATA",
        "Generated for the preview; no live figures.",
        "",
        "Total investment   " + fmt.moneyFull(D.portfolio.value),
        "Live P&L           +" + fmt.moneyFull(D.portfolio.dayChange),
        "Annual return      " + fmt.signedPct(D.portfolio.ytdPct),
        "Sharpe ratio       " + D.risk.sharpe,
        "",
        "Strategies:"
      ];
      D.aiPortfolio.strategies.forEach(function (s) {
        lines.push("  " + s.name + "  " + fmt.moneyFull(s.value) + "  " + fmt.signedPct(s.retPct));
      });
      lines.push("", "Risk distribution: " + D.aiPortfolio.riskDistribution.map(function (r) { return r.name + " " + r.pct + "%"; }).join(" · "));
      document.querySelector("[data-aip-report-body]").textContent = lines.join("\n");
      modal.hidden = false;
      modal.querySelector("[data-aip-modal-close]").focus();
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-aip-modal-close]")) modal.hidden = true;
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) modal.hidden = true;
    });
  });
})(window, document);
