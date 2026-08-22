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

    /* Catalogue math (pricing, filtering, ranking, recommendations) is the
     * shared GeFi.catalog module the mock server also runs, so the same
     * filters return the same set whether or not the API answers. */
    var C = GeFi.catalog;
    var CATALOG = C.catalog();

    /* Subscriptions round-trip through the API; offline the resolver
     * answers locally and the button behaves identically. */
    function subscribeRemote(slug) {
      return GeFi.api.post("/subscriptions", { slug: slug, plan: "standard" });
    }

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

    function filtered() {
      return C.filter(CATALOG, { wing: state.category, risk: state.risk, q: state.q });
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
      var price = document.createElement("p");
      price.className = "app-gridcard__desc mono";
      price.setAttribute("data-mk-price", String(m.monthly_fee));
      price.textContent = "$" + m.monthly_fee + "/month";
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
        /* Optimistic: flip at once, then confirm with the API. */
        subs.push(m.slug);
        saveJSON(SUB_KEY, subs);
        subBtn.textContent = "Subscribed ✓";
        subBtn.className = "app-btn app-btn--ghost";
        subBtn.disabled = true;
        subscribeRemote(m.slug).then(
          function (r) { subBtn.setAttribute("data-sub-id", (r && r.id) || "local"); },
          function () { subBtn.setAttribute("data-sub-id", "local"); }
        );
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
      c.appendChild(price);
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
      var recs = C.recommend(CATALOG, prefs, 9);
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
      var ranked = C.trending(CATALOG, 6);
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
      var rows = filtered();
      document.querySelector("[data-mk-count]").textContent = "— " + rows.length + " of " + CATALOG.length;
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
        GeFi.api.put("/preferences", prefs).catch(function () {});
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
