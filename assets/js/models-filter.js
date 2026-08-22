(function () {
  "use strict";

  var root = document.querySelector("[data-model-filter]");
  var grid = document.querySelector("[data-model-grid]");
  if (!root || !grid) return;

  var groups = Array.prototype.slice.call(grid.querySelectorAll("[data-model-group]"));
  var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-model-card]"));
  var countEl = root.querySelector("[data-filter-count]");
  var emptyEl = document.querySelector("[data-filter-empty]");
  var searchEl = root.querySelector('[data-filter="search"]');

  var cardIndex = cards.map(function (card) {
    var titleEl = card.querySelector("h3");
    var leadEl = card.querySelector("p.muted");
    var title = titleEl ? titleEl.textContent : "";
    var lead = leadEl ? leadEl.textContent : "";
    return (title + " " + lead).toLowerCase();
  });

  var state = { category: "all", risk: "all", federated: false, search: "" };

  /* Does card i match the current state, with any one dimension overridden?
   * The override is what makes facet counts live: a chip's count is "how many
   * cards would show if this chip were active, holding the other filters". */
  function matches(i, dim, value) {
    var card = cards[i];
    var s = {
      category: dim === "category" ? value : state.category,
      risk: dim === "risk" ? value : state.risk,
      federated: dim === "federated" ? value : state.federated,
      search: state.search
    };
    var family = (card.getAttribute("data-family") || "").toLowerCase();
    var risk = (card.getAttribute("data-risk") || "").toLowerCase();
    var fed = card.getAttribute("data-federated") === "true";

    var catOk = s.category === "all" || family === s.category;
    var riskOk = s.risk === "all" || risk === s.risk;
    var fedOk = !s.federated || fed;
    var searchOk = !s.search || cardIndex[i].indexOf(s.search) !== -1;
    return catOk && riskOk && fedOk && searchOk;
  }

  function updateFacetCounts() {
    var chips = root.querySelectorAll(".filter-chip");
    chips.forEach(function (chip) {
      var span = chip.querySelector("[data-facet-count]");
      if (!span) return;
      var dim = chip.getAttribute("data-filter");
      var value = chip.getAttribute("data-value");
      var n = 0;
      for (var i = 0; i < cards.length; i++) {
        if (matches(i, dim, value)) n++;
      }
      span.textContent = "(" + n + ")";
      chip.classList.toggle("is-zero", n === 0);
    });
  }

  function apply() {
    var visible = 0;
    cards.forEach(function (card, i) {
      var show = matches(i, null, null);
      card.classList.toggle("is-hidden", !show);
      if (show) visible++;
    });

    /* Hide group sections (and their sticky labels) with nothing visible;
     * update each label's live count. */
    groups.forEach(function (g) {
      var inGroup = g.querySelectorAll("[data-model-card]:not(.is-hidden)").length;
      g.hidden = inGroup === 0;
      var gc = g.querySelector("[data-group-count]");
      if (gc) gc.textContent = "(" + inGroup + ")";
    });

    if (countEl) {
      countEl.textContent = visible + " of " + cards.length + " model" + (cards.length === 1 ? "" : "s");
    }
    if (emptyEl) {
      emptyEl.hidden = visible !== 0;
    }
    updateFacetCounts();
  }

  root.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter-chip");
    if (!btn) return;
    var filter = btn.getAttribute("data-filter");
    var value = btn.getAttribute("data-value");
    if (!filter || value === null) return;
    state[filter] = value;
    var siblings = root.querySelectorAll(".filter-chip[data-filter='" + filter + "']");
    siblings.forEach(function (s) { s.classList.toggle("is-active", s === btn); });
    apply();
  });

  root.addEventListener("change", function (e) {
    var input = e.target;
    if (input && input.matches('input[type="checkbox"][data-filter="federated"]')) {
      state.federated = input.checked;
      apply();
    }
  });

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      state.search = searchEl.value.trim().toLowerCase();
      apply();
    });
  }

  /* Deep link: /models/?family=<name> pre-selects that category chip
   * (used by the app categories page, Task 214). */
  try {
    var fam = new URLSearchParams(window.location.search).get("family");
    if (fam) {
      var chip = root.querySelector(".filter-chip[data-filter='category'][data-value='" + fam.toLowerCase() + "']");
      if (chip) {
        state.category = fam.toLowerCase();
        root.querySelectorAll(".filter-chip[data-filter='category']").forEach(function (s) {
          s.classList.toggle("is-active", s === chip);
        });
        chip.scrollIntoView({ block: "center" });
      }
    }
  } catch (e) {}

  apply();
})();
