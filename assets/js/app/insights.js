/* Analytics + Insights tabs (task 205). One script, two branches. */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    function kvRow(dl, label, value, cls) {
      var div = document.createElement("div");
      var dt = document.createElement("dt");
      dt.textContent = label;
      var dd = document.createElement("dd");
      dd.className = "mono" + (cls ? " " + cls : "");
      if (value instanceof Node) {
        dd.className = "";
        dd.appendChild(value);
      } else {
        dd.textContent = value;
      }
      div.appendChild(dt);
      div.appendChild(dd);
      dl.appendChild(div);
    }

    /* ------------- analytics ------------- */
    var perf = document.querySelector("[data-an-perf]");
    if (perf) {
      kvRow(perf, "Sharpe Ratio", String(D.risk.sharpe));
      kvRow(perf, "Max Drawdown", fmt.signedPct(D.risk.maxDrawdown), "is-down");
      kvRow(perf, "Beta", String(D.risk.beta));
      kvRow(perf, "Alpha", fmt.signedPct(D.risk.alpha), "is-up");
      kvRow(perf, "Volatility", D.risk.volatility + "%");

      var risk = document.querySelector("[data-an-risk]");
      kvRow(risk, "Value at Risk (95%)", "-" + fmt.moneyFull(Math.abs(D.risk.var95)), "is-down");
      kvRow(risk, "Concentration Risk", app.chip("medium", D.risk.concentration));
      kvRow(risk, "Sector Diversification", D.risk.sectors + " sectors");
      kvRow(risk, "Geographic Exposure", D.risk.regions + " regions");
    }

    /* ------------- insights ------------- */
    var list = document.querySelector("[data-in-list]");
    if (list) {
      var KEY = "gefi-app-alerts";
      var saved;
      try {
        saved = JSON.parse(sessionStorage.getItem(KEY) || "[]");
      } catch (e) {
        saved = [];
      }

      D.insights.forEach(function (ins) {
        var card = document.createElement("div");
        card.className = "app-rowcard";
        var main = document.createElement("div");
        main.className = "app-rowcard__main";
        var head = document.createElement("div");
        head.className = "app-rowcard__head";
        var title = document.createElement("p");
        title.className = "app-rowcard__title";
        title.textContent = ins.title;
        var sentiment = app.chip(
          ins.sentiment === "Bullish" ? "deployed" : ins.sentiment === "Cautious" ? "critical" : "neutral",
          ins.sentiment
        );
        var conf = document.createElement("span");
        conf.className = "app-chip app-chip--outline";
        conf.textContent = ins.confidence + "% confident";
        var impact = document.createElement("span");
        impact.className = "app-rowcard__meta " + (ins.impact === "High" ? "is-impact-high" : "is-impact-medium");
        impact.textContent = "Impact: " + ins.impact;
        head.appendChild(title);
        head.appendChild(sentiment);
        head.appendChild(conf);
        head.appendChild(impact);
        var body = document.createElement("p");
        body.className = "app-gridcard__desc";
        body.textContent = ins.body;
        main.appendChild(head);
        main.appendChild(body);

        var rail = document.createElement("div");
        rail.className = "app-rowcard__rail";
        var setBtn = document.createElement("button");
        setBtn.type = "button";
        var isSet = saved.indexOf(ins.title) !== -1;
        setBtn.className = "app-btn " + (isSet ? "app-btn--ghost" : "app-btn--primary");
        setBtn.textContent = isSet ? "Alert set ✓" : "Set Alert";
        setBtn.disabled = isSet;
        setBtn.addEventListener("click", function () {
          saved.push(ins.title);
          try {
            sessionStorage.setItem(KEY, JSON.stringify(saved));
          } catch (e) {}
          setBtn.textContent = "Alert set ✓";
          setBtn.className = "app-btn app-btn--ghost";
          setBtn.disabled = true;
        });
        var learn = document.createElement("a");
        learn.className = "app-btn app-btn--ghost";
        learn.href = "/app/learning/";
        learn.textContent = "Learn More";
        rail.appendChild(setBtn);
        rail.appendChild(learn);

        card.appendChild(main);
        card.appendChild(rail);
        list.appendChild(card);
      });
    }
  });
})(window, document);
