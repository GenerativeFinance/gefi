/* Leaderboard category chips (Task 121). Progressive enhancement over a
 * page that renders every category without JS. */
(function (document) {
  "use strict";

  var chips = document.querySelector("[data-lb-chips]");
  if (!chips) return;

  chips.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-lb-chip]");
    if (!chip) return;
    var key = chip.getAttribute("data-lb-chip");
    chips.querySelectorAll("[data-lb-chip]").forEach(function (c) {
      c.classList.toggle("is-active", c === chip);
    });
    document.querySelectorAll("[data-lb-section]").forEach(function (s) {
      s.hidden = key !== "all" && s.getAttribute("data-lb-section") !== key;
    });
  });
})(document);
