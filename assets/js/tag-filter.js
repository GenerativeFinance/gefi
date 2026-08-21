(function () {
  "use strict";

  var roots = document.querySelectorAll("[data-tag-filter]");
  if (!roots.length) return;

  roots.forEach(function (root) {
    var grid = root.querySelector("[data-tag-grid]");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-tags]"));
    var chips = Array.prototype.slice.call(root.querySelectorAll(".filter-chip[data-tag]"));
    var countEl = root.querySelector("[data-tag-count]");
    var emptyEl = root.querySelector("[data-tag-empty]");

    var state = "all";

    function apply() {
      var visible = 0;
      cards.forEach(function (card) {
        var raw = (card.getAttribute("data-tags") || "").toLowerCase();
        var tags = raw.split("|").filter(function (t) { return t.length > 0; });
        var show = state === "all" || tags.indexOf(state) !== -1;
        card.classList.toggle("is-hidden", !show);
        if (show) visible++;
      });
      if (countEl) {
        var noun = cards.length === 1 ? " entry" : " entries";
        countEl.textContent = visible + " of " + cards.length + noun;
      }
      if (emptyEl) {
        emptyEl.hidden = visible !== 0;
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        state = (chip.getAttribute("data-tag") || "all").toLowerCase();
        chips.forEach(function (c) {
          c.classList.toggle("is-active", c === chip);
        });
        apply();
      });
    });

    apply();
  });
})();
