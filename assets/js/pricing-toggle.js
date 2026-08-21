(function () {
  "use strict";

  var STORAGE_KEY = "gefi:pricing:billing";
  var VALID = { monthly: true, yearly: true };

  function init() {
    var section = document.querySelector(".pricing[data-billing]");
    if (!section) return;
    var buttons = section.querySelectorAll("[data-billing-option]");
    if (!buttons.length) return;

    var stored;
    try {
      stored = window.sessionStorage && sessionStorage.getItem(STORAGE_KEY);
    } catch (_) {
      stored = null;
    }

    var initial = (stored && VALID[stored]) ? stored : section.getAttribute("data-billing");
    if (!VALID[initial]) initial = "monthly";
    apply(section, buttons, initial);

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (e) {
        var choice = e.currentTarget.getAttribute("data-billing-option");
        if (!VALID[choice]) return;
        apply(section, buttons, choice);
        try {
          if (window.sessionStorage) sessionStorage.setItem(STORAGE_KEY, choice);
        } catch (_) { /* storage may be blocked; ignore */ }
      });
    }
  }

  function apply(section, buttons, choice) {
    section.setAttribute("data-billing", choice);
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var isActive = btn.getAttribute("data-billing-option") === choice;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  /* Pro usage calculator (Task 101). Rates come from data attributes set
   * in _config.yml; output is an estimate and says so. */
  function initCalc() {
    var calc = document.querySelector("[data-pricing-calc]");
    if (!calc) return;
    var controls = calc.querySelector("[data-pricing-calc-controls]");
    var nojs = calc.querySelector("[data-pricing-calc-nojs]");
    var calls = calc.querySelector("[data-calc-calls]");
    var keys = calc.querySelector("[data-calc-keys]");
    var callsOut = calc.querySelector("[data-calc-calls-out]");
    var keysOut = calc.querySelector("[data-calc-keys-out]");
    var totalEl = calc.querySelector("[data-calc-total]");
    var breakdownEl = calc.querySelector("[data-calc-breakdown]");
    if (!controls || !calls || !keys || !totalEl) return;

    var base = parseFloat(calc.getAttribute("data-calc-base")) || 499;
    var includedCalls = parseFloat(calc.getAttribute("data-calc-included-calls")) || 5000;
    var rate = parseFloat(calc.getAttribute("data-calc-rate")) || 0.0008;
    var includedKeys = parseFloat(calc.getAttribute("data-calc-included-keys")) || 10;
    var keyPrice = parseFloat(calc.getAttribute("data-calc-key-price")) || 5;

    controls.hidden = false;
    if (nojs) nojs.hidden = true;

    function money(n) {
      return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function update() {
      var callsPerDay = parseFloat(calls.value) || 0;
      var keyCount = parseFloat(keys.value) || 0;
      if (callsOut) callsOut.textContent = callsPerDay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (keysOut) keysOut.textContent = keyCount;

      var meteredCalls = Math.max(0, callsPerDay - includedCalls) * 30;
      var callCost = meteredCalls * rate;
      var keyCost = Math.max(0, keyCount - includedKeys) * keyPrice;
      var total = base + callCost + keyCost;
      totalEl.textContent = money(total) + "/mo";
      if (breakdownEl) {
        breakdownEl.textContent =
          money(base) + " base + " + money(callCost) + " metered calls" +
          (keyCost > 0 ? " + " + money(keyCost) + " extra keys" : "") + ".";
      }
    }

    calls.addEventListener("input", update);
    keys.addEventListener("input", update);
    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      initCalc();
    });
  } else {
    init();
    initCalc();
  }
})();
