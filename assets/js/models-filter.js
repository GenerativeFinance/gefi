(function () {
  "use strict";

  var root = document.querySelector("[data-model-filter]");
  var grid = document.querySelector("[data-model-grid]");
  if (!root || !grid) return;

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

  function apply() {
    var visible = 0;
    var query = state.search;
    cards.forEach(function (card, i) {
      var cat = (card.getAttribute("data-category") || "").toLowerCase();
      var risk = (card.getAttribute("data-risk") || "").toLowerCase();
      var fed = card.getAttribute("data-federated") === "true";

      var catOk = state.category === "all" || cat.indexOf(state.category) !== -1;
      var riskOk = state.risk === "all" || risk === state.risk;
      var fedOk = !state.federated || fed;
      var searchOk = !query || cardIndex[i].indexOf(query) !== -1;

      var show = catOk && riskOk && fedOk && searchOk;
      card.classList.toggle("is-hidden", !show);
      if (show) visible++;
    });

    if (countEl) {
      countEl.textContent = visible + " of " + cards.length + " model" + (cards.length === 1 ? "" : "s");
    }
    if (emptyEl) {
      emptyEl.hidden = visible !== 0;
    }
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

  apply();
})();
