/* Shared portfolio hero-band hydration (any page including app-hero.html). */
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

    txt("[data-hero-value]", fmt.moneyFull(D.portfolio.value));
    txt("[data-hero-day]", "+" + fmt.moneyFull(D.portfolio.dayChange) + " (" + fmt.signedPct(D.portfolio.dayChangePct) + ") today");
    txt("[data-hero-month]", fmt.signedPct(D.portfolio.monthlyPct));
    txt("[data-hero-bench]", "vs " + fmt.signedPct(D.portfolio.monthlyBenchPct) + " benchmark");
    txt("[data-hero-ytd]", fmt.signedPct(D.portfolio.ytdPct));
    txt("[data-hero-cash]", fmt.moneyFull(D.portfolio.cash));
  });
})(window, document);
