/* App-shell global search (task 320). Loaded on every app page.
 *
 * Like the bell before task 317, the top-bar search button was markup
 * with nothing behind it. It now opens a panel whose grouped results come
 * from the data layer — /search live, the same shared engine offline. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    var PL = GeFi.platform;
    if (!PL) return;
    var btn = document.querySelector("[data-app-search]");
    if (!btn) return;

    var GROUP_LABELS = { models: "Models", datasets: "Datasets", docs: "Pages", orders: "Orders" };
    var panel = null;
    var seq = 0;

    function closePanel() {
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      panel = null;
      btn.setAttribute("aria-expanded", "false");
    }

    function renderResults(listEl, result) {
      listEl.innerHTML = "";
      listEl.setAttribute("data-app-search-total", String(result.total || 0));
      if (!result.q) {
        var hint = document.createElement("p");
        hint.className = "app-searchpanel__hint";
        hint.textContent = "Search models, datasets, pages and orders.";
        listEl.appendChild(hint);
        return;
      }
      if (!result.total) {
        var none = document.createElement("p");
        none.className = "app-searchpanel__hint";
        none.textContent = "Nothing matches “" + result.q + "”.";
        listEl.appendChild(none);
        return;
      }
      PL.SEARCH_GROUPS.forEach(function (g) {
        var hits = result.groups[g] || [];
        if (!hits.length) return;
        var head = document.createElement("p");
        head.className = "app-searchpanel__group";
        head.setAttribute("data-app-search-group", g);
        head.textContent = GROUP_LABELS[g] || g;
        listEl.appendChild(head);
        hits.forEach(function (hit) {
          var a = document.createElement("a");
          a.className = "app-searchpanel__hit";
          a.setAttribute("data-app-search-hit", hit.kind);
          a.href = hit.ref;
          var name = document.createElement("span");
          name.textContent = hit.name;
          var meta = document.createElement("span");
          meta.className = "app-searchpanel__meta";
          meta.textContent = hit.meta || "";
          a.appendChild(name);
          a.appendChild(meta);
          listEl.appendChild(a);
        });
      });
    }

    function openPanel() {
      closePanel();
      panel = document.createElement("div");
      panel.className = "app-searchpanel";
      panel.setAttribute("data-app-searchpanel", "");
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "Search");

      var input = document.createElement("input");
      input.type = "search";
      input.className = "app-searchpanel__input";
      input.placeholder = "Search models, datasets, pages, orders…";
      input.setAttribute("aria-label", "Search query");
      var list = document.createElement("div");
      list.className = "app-searchpanel__list";
      list.setAttribute("data-app-search-results", "");
      panel.appendChild(input);
      panel.appendChild(list);
      btn.parentNode.appendChild(panel);
      btn.setAttribute("aria-expanded", "true");
      renderResults(list, { q: "", total: 0, groups: {} });
      input.focus();

      var timer = null;
      input.addEventListener("input", function () {
        clearTimeout(timer);
        var q = input.value;
        timer = setTimeout(function () {
          var mySeq = ++seq;
          GeFi.api.get("/search?q=" + encodeURIComponent(q)).then(
            function (r) {
              if (mySeq !== seq || !panel) return;
              /* Offline the fallback resolver answers, but it never sees
               * the query string — so on a sample response run the same
               * shared engine locally. Grouping is identical either way. */
              renderResults(list, r && r.groups && !r.sample ? r : PL.search(q));
            },
            function () {
              if (mySeq !== seq || !panel) return;
              renderResults(list, PL.search(q));
            }
          );
        }, 150);
      });
    }

    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (panel) closePanel();
      else openPanel();
    });
    document.addEventListener("click", function (e) {
      if (panel && !panel.contains(e.target) && e.target !== btn) closePanel();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel) {
        closePanel();
        btn.focus();
      }
    });
  });
})(window, document);
