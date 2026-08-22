/* Category grid: search, sort, grid/list toggle (task 214). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var grid = document.querySelector("[data-cat-grid]");
    if (!grid) return;
    var app = window.GeFi && window.GeFi.app;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".app-catcard"));
    var emptyEl = document.querySelector("[data-cat-empty]");

    function apply() {
      var q = (document.querySelector("[data-cat-search]").value || "").toLowerCase();
      var visible = 0;
      cards.forEach(function (c) {
        var show = !q || c.getAttribute("data-cat-name").indexOf(q) !== -1 ||
          c.textContent.toLowerCase().indexOf(q) !== -1;
        c.hidden = !show;
        if (show) visible += 1;
      });
      emptyEl.innerHTML = "";
      emptyEl.hidden = visible > 0;
      if (!visible && app) {
        emptyEl.appendChild(app.empty({ head: "No categories match", hint: "Try a different search." }));
      }
    }

    function sortCards(key) {
      var sorted = cards.slice().sort(function (a, b) {
        if (key === "models") return +b.getAttribute("data-cat-models") - +a.getAttribute("data-cat-models");
        if (key === "price") return +a.getAttribute("data-cat-price") - +b.getAttribute("data-cat-price");
        return a.getAttribute("data-cat-name").localeCompare(b.getAttribute("data-cat-name"));
      });
      sorted.forEach(function (c) { grid.appendChild(c); });
    }

    document.querySelector("[data-cat-search]").addEventListener("input", apply);
    document.querySelector("[data-cat-sort]").addEventListener("change", function (e) {
      sortCards(e.target.value);
    });
    var viewBtn = document.querySelector("[data-cat-view]");
    viewBtn.addEventListener("click", function () {
      var list = grid.classList.toggle("app-gridcards--list");
      viewBtn.setAttribute("aria-pressed", list ? "true" : "false");
      viewBtn.textContent = list ? "Grid view" : "List view";
    });
  });
})(window, document);
