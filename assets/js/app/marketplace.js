/* AI marketplace over the real GeFi.MODELS registry (task 213). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.MODELS || !GeFi.app) return;
    var app = GeFi.app;

    var PREF_KEY = "gefi-app-prefs";
    var SUB_KEY = "gefi-app-subs";
    var PAGE = 12;

    function loadJSON(key, fallback) {
      try {
        var raw = sessionStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return fallback;
    }
    function saveJSON(key, v) {
      try {
        sessionStorage.setItem(key, JSON.stringify(v));
      } catch (e) {}
    }

    var prefs = loadJSON(PREF_KEY, null);
    var subs = loadJSON(SUB_KEY, []);
    var state = { q: "", category: "", risk: "", page: 0 };

    var wings = [];
    GeFi.MODELS.forEach(function (m) {
      if (wings.indexOf(m.wing) === -1) wings.push(m.wing);
    });
    wings.sort();

    /* filter dropdown options from the real taxonomy */
    var catSel = document.querySelector("[data-mk-category]");
    wings.forEach(function (w) {
      var opt = document.createElement("option");
      opt.value = w;
      opt.textContent = w;
      catSel.appendChild(opt);
    });

    function riskRank(r) {
      return r === "low" ? 0 : r === "medium" ? 1 : 2;
    }

    function matches(m) {
      var q = state.q.toLowerCase();
      return (!state.category || m.wing === state.category) &&
        (!state.risk || m.risk === state.risk) &&
        (!q || m.name.toLowerCase().indexOf(q) !== -1 || m.slug.indexOf(q) !== -1 || m.wing.toLowerCase().indexOf(q) !== -1);
    }

    function card(m) {
      var subDone = subs.indexOf(m.slug) !== -1;
      var c = document.createElement("div");
      c.className = "app-gridcard";
      var chips = document.createElement("div");
      chips.className = "app-gridcard__chips";
      chips.appendChild(app.chip(m.risk, m.risk + " risk"));
      if (m.federated) chips.appendChild(app.chip("deployed", "Federated"));
      var title = document.createElement("p");
      title.className = "app-gridcard__title";
      title.textContent = m.name;
      var desc = document.createElement("p");
      desc.className = "app-gridcard__desc";
      desc.textContent = m.wing + " · headline " + m.unit;
      var spark = document.createElement("div");
      spark.appendChild(GeFi.svg.sparkline(m.series, { label: m.name + " sample trend" }));
      var footer = document.createElement("div");
      footer.className = "app-gridcard__footer";
      var subBtn = document.createElement("button");
      subBtn.type = "button";
      subBtn.className = subDone ? "app-btn app-btn--ghost" : "app-btn app-btn--primary";
      subBtn.textContent = subDone ? "Subscribed ✓" : "Subscribe";
      subBtn.disabled = subDone;
      subBtn.addEventListener("click", function () {
        subs.push(m.slug);
        saveJSON(SUB_KEY, subs);
        subBtn.textContent = "Subscribed ✓";
        subBtn.className = "app-btn app-btn--ghost";
        subBtn.disabled = true;
      });
      var details = document.createElement("a");
      details.className = "app-btn app-btn--ghost";
      details.href = "/models/" + m.slug + "/";
      details.textContent = "Details";
      footer.appendChild(subBtn);
      footer.appendChild(details);
      c.appendChild(chips);
      c.appendChild(title);
      c.appendChild(desc);
      c.appendChild(spark);
      c.appendChild(footer);
      return c;
    }

    /* ---- For You ---- */
    function renderForYou() {
      var grid = document.querySelector("[data-mk-foryou]");
      var empty = document.querySelector("[data-mk-foryou-empty]");
      grid.innerHTML = "";
      empty.innerHTML = "";
      if (!prefs) {
        empty.hidden = false;
        empty.appendChild(app.empty({
          head: "Building Your Recommendations",
          hint: "We're analyzing your preferences to find the perfect AI models for you.",
          cta: { label: "Set Your Preferences", onClick: openPrefs }
        }));
        return;
      }
      empty.hidden = true;
      var recs = GeFi.MODELS.filter(function (m) {
        return prefs.wings.indexOf(m.wing) !== -1 && riskRank(m.risk) <= riskRank(prefs.risk);
      }).slice(0, 9);
      if (!recs.length) {
        empty.hidden = false;
        empty.appendChild(app.empty({
          head: "Nothing matches those preferences yet",
          hint: "Loosen the risk ceiling or pick more categories.",
          cta: { label: "Edit preferences", onClick: openPrefs }
        }));
        return;
      }
      recs.forEach(function (m) { grid.appendChild(card(m)); });
    }

    /* ---- Trending: seeded deterministic ranking ---- */
    function renderTrending() {
      var grid = document.querySelector("[data-mk-trending]");
      grid.innerHTML = "";
      var ranked = GeFi.MODELS.slice().sort(function (a, b) {
        return GeFi.seed.hash("trend|" + b.slug) % 1000 - GeFi.seed.hash("trend|" + a.slug) % 1000;
      }).slice(0, 6);
      ranked.forEach(function (m, i) {
        var c = card(m);
        var flame = app.chip("high", "#" + (i + 1) + " trending");
        c.querySelector(".app-gridcard__chips").appendChild(flame);
        grid.appendChild(c);
      });
    }

    /* ---- Browse All ---- */
    function renderBrowse() {
      var grid = document.querySelector("[data-mk-browse]");
      var empty = document.querySelector("[data-mk-browse-empty]");
      grid.innerHTML = "";
      empty.innerHTML = "";
      var rows = GeFi.MODELS.filter(matches);
      document.querySelector("[data-mk-count]").textContent = "— " + rows.length + " of " + GeFi.MODELS.length;
      var pages = Math.max(1, Math.ceil(rows.length / PAGE));
      if (state.page >= pages) state.page = pages - 1;
      empty.hidden = rows.length > 0;
      if (!rows.length) {
        empty.appendChild(app.empty({ head: "No models match", hint: "Try adjusting your search filters" }));
      }
      rows.slice(state.page * PAGE, (state.page + 1) * PAGE).forEach(function (m) {
        grid.appendChild(card(m));
      });
      document.querySelector("[data-mk-page]").textContent = rows.length
        ? "Page " + (state.page + 1) + " of " + pages
        : "";
      document.querySelector("[data-mk-prev]").disabled = state.page === 0;
      document.querySelector("[data-mk-next]").disabled = state.page >= pages - 1;
    }

    document.querySelector("[data-mk-search]").addEventListener("input", function (e) {
      state.q = e.target.value;
      state.page = 0;
      renderBrowse();
    });
    catSel.addEventListener("change", function () {
      state.category = catSel.value;
      state.page = 0;
      renderBrowse();
    });
    document.querySelector("[data-mk-risk]").addEventListener("change", function (e) {
      state.risk = e.target.value;
      state.page = 0;
      renderBrowse();
    });
    document.querySelector("[data-mk-prev]").addEventListener("click", function () {
      state.page -= 1;
      renderBrowse();
    });
    document.querySelector("[data-mk-next]").addEventListener("click", function () {
      state.page += 1;
      renderBrowse();
    });

    /* ---- preferences modal ---- */
    var modal = document.querySelector("[data-mk-prefs]");
    var prefRisk = prefs ? prefs.risk : "medium";
    function openPrefs() {
      var box = document.querySelector("[data-mk-prefcats]");
      box.innerHTML = "";
      var chosen = prefs ? prefs.wings : [];
      wings.forEach(function (w) {
        var label = document.createElement("label");
        label.className = "app-mk-prefcat";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = w;
        cb.checked = chosen.indexOf(w) !== -1;
        label.appendChild(cb);
        label.appendChild(document.createTextNode(w));
        box.appendChild(label);
      });
      document.querySelectorAll("[data-prefrisk]").forEach(function (b) {
        b.classList.toggle("app-segment--active", b.getAttribute("data-prefrisk") === prefRisk);
      });
      modal.hidden = false;
    }
    document.querySelector("[data-mk-prefs-open]").addEventListener("click", openPrefs);
    document.querySelector("[data-mk-prefrisk]").addEventListener("click", function (e) {
      var b = e.target.closest("[data-prefrisk]");
      if (!b) return;
      prefRisk = b.getAttribute("data-prefrisk");
      document.querySelectorAll("[data-prefrisk]").forEach(function (x) {
        x.classList.toggle("app-segment--active", x === b);
      });
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-mk-prefs-cancel]")) {
        modal.hidden = true;
        return;
      }
      if (e.target.closest("[data-mk-prefs-save]")) {
        var chosen = Array.prototype.map.call(
          document.querySelectorAll("[data-mk-prefcats] input:checked"),
          function (cb) { return cb.value; }
        );
        prefs = { wings: chosen, risk: prefRisk };
        saveJSON(PREF_KEY, prefs);
        modal.hidden = true;
        renderForYou();
      }
    });

    /* deep link ?category= from the categories page */
    try {
      var qc = new URLSearchParams(window.location.search).get("category");
      if (qc && wings.indexOf(qc) !== -1) {
        state.category = qc;
        catSel.value = qc;
        window.location.hash = "browse";
      }
    } catch (e) {}

    renderForYou();
    renderTrending();
    renderBrowse();
  });
})(window, document);
