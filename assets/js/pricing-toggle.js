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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
