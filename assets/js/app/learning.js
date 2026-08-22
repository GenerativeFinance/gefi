/* Learning center (task 219). Dark cards with colored accents — the
 * reference's white-on-pastel path cards were illegible (§5.8). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var app = GeFi.app;

    var KEY = "gefi-app-learning";
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      var p = {};
      D.learning.items.forEach(function (it) { p[it.title] = it.progress; });
      return { progress: p };
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();
    var state = { seg: "", q: "", type: "", level: "" };

    function progOf(it) {
      return st.progress[it.title] != null ? st.progress[it.title] : it.progress;
    }

    function renderKpis() {
      var el = document.querySelector("[data-ln-kpis]");
      el.innerHTML = "";
      var items = D.learning.items;
      var completed = items.filter(function (i) { return progOf(i) >= 100; }).length;
      var inProgress = items.filter(function (i) { var p = progOf(i); return p > 0 && p < 100; }).length;
      [
        { label: "Completed", value: String(completed), sub: "with certificates", tone: "is-up" },
        { label: "In Progress", value: String(inProgress), sub: "keep going", tone: "" },
        { label: "Certificates", value: String(completed + 1), sub: "incl. onboarding", tone: "" },
        { label: "Hours Learned", value: "24.5", sub: "lifetime, sample", tone: "" }
      ].forEach(function (k) {
        var card = document.createElement("div");
        card.className = "app-kpi";
        var l = document.createElement("p");
        l.className = "app-kpi__label";
        l.textContent = k.label;
        var v = document.createElement("p");
        v.className = "app-kpi__value";
        v.textContent = k.value;
        var s = document.createElement("p");
        s.className = "app-kpi__sub " + k.tone;
        s.textContent = k.sub;
        card.appendChild(l);
        card.appendChild(v);
        card.appendChild(s);
        el.appendChild(card);
      });
    }

    var TYPE_VOCAB = { "GET-STARTED": "ok", "TUTORIAL": "info", "WEBINAR": "completed", "BLOG": "neutral", "FAQ": "draft" };

    function renderGrid() {
      var grid = document.querySelector("[data-ln-grid]");
      var empty = document.querySelector("[data-ln-empty]");
      grid.innerHTML = "";
      empty.innerHTML = "";
      var q = state.q.toLowerCase();
      var rows = D.learning.items.filter(function (it) {
        var p = progOf(it);
        if (state.seg === "progress" && !(p > 0 && p < 100)) return false;
        if (state.seg === "completed" && p < 100) return false;
        if (state.seg === "recommended" && !(p === 0 && it.rating >= 4.5)) return false;
        return (!state.type || it.type === state.type) &&
          (!state.level || it.level === state.level) &&
          (!q || it.title.toLowerCase().indexOf(q) !== -1 || it.author.toLowerCase().indexOf(q) !== -1);
      });
      empty.hidden = rows.length > 0;
      if (!rows.length) {
        empty.appendChild(app.empty({ head: "Nothing matches", hint: "Loosen the filters or search differently." }));
      }
      rows.forEach(function (it) {
        var p = progOf(it);
        var c = document.createElement("div");
        c.className = "app-gridcard";
        var chips = document.createElement("div");
        chips.className = "app-gridcard__chips";
        chips.appendChild(app.chip(TYPE_VOCAB[it.type] || "neutral", it.type));
        chips.appendChild(app.chip(it.level.toLowerCase() === "beginner" ? "beginner" : it.level.toLowerCase() === "intermediate" ? "intermediate" : "advanced", it.level));
        var title = document.createElement("p");
        title.className = "app-gridcard__title";
        title.textContent = it.title;
        var meta = document.createElement("p");
        meta.className = "app-gridcard__desc";
        meta.textContent = it.duration + " · " + it.enrolled.toLocaleString("en-US") + " enrolled · ★ " + it.rating + " · " + it.author;
        c.appendChild(chips);
        c.appendChild(title);
        c.appendChild(meta);
        if (p > 0) {
          var meter = document.createElement("div");
          meter.className = "app-meterrow";
          var track = document.createElement("div");
          track.className = "app-meter" + (p >= 100 ? " app-meter--good" : "");
          var fill = document.createElement("div");
          fill.className = "app-meter__fill";
          fill.style.width = Math.min(100, p) + "%";
          track.appendChild(fill);
          var val = document.createElement("span");
          val.className = "app-meterrow__val";
          val.textContent = Math.min(100, p) + "%";
          meter.appendChild(track);
          meter.appendChild(val);
          c.appendChild(meter);
        }
        var footer = document.createElement("div");
        footer.className = "app-gridcard__footer";
        var btn = document.createElement("button");
        btn.type = "button";
        if (p >= 100) {
          btn.className = "app-btn app-btn--ghost";
          btn.textContent = "Completed ✓";
          btn.disabled = true;
        } else {
          btn.className = p > 0 ? "app-btn app-btn--ghost" : "app-btn app-btn--primary";
          btn.textContent = p > 0 ? "Continue" : "Start Learning";
          btn.addEventListener("click", function () {
            var next = p === 0 ? 20 : Math.min(100, p + 40);
            st.progress[it.title] = next;
            save();
            renderGrid();
            renderKpis();
          });
        }
        footer.appendChild(btn);
        c.appendChild(footer);
        grid.appendChild(c);
      });
    }

    function renderPaths() {
      var el = document.querySelector("[data-ln-paths]");
      el.innerHTML = "";
      var accents = ["var(--app-brand)", "var(--app-green)", "var(--app-purple)"];
      D.learning.paths.forEach(function (path, i) {
        var c = document.createElement("div");
        c.className = "app-gridcard";
        c.style.borderTop = "3px solid " + accents[i % accents.length];
        var title = document.createElement("p");
        title.className = "app-gridcard__title";
        title.textContent = path.name;
        var meta = document.createElement("p");
        meta.className = "app-gridcard__desc";
        meta.textContent = path.courses + " courses · ~" + path.hours + " hours";
        var footer = document.createElement("div");
        footer.className = "app-gridcard__footer";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = path.started ? "app-btn app-btn--ghost" : "app-btn app-btn--primary";
        btn.textContent = path.started ? "Continue Path" : "Start Path";
        footer.appendChild(btn);
        c.appendChild(title);
        c.appendChild(meta);
        c.appendChild(footer);
        el.appendChild(c);
      });
    }

    document.querySelector("[data-ln-segments]").addEventListener("click", function (e) {
      var b = e.target.closest("[data-ln-seg]");
      if (!b) return;
      state.seg = b.getAttribute("data-ln-seg");
      document.querySelectorAll("[data-ln-seg]").forEach(function (x) {
        x.classList.toggle("app-segment--active", x === b);
      });
      renderGrid();
    });
    document.querySelector("[data-ln-search]").addEventListener("input", function (e) {
      state.q = e.target.value;
      renderGrid();
    });
    document.querySelector("[data-ln-type]").addEventListener("change", function (e) {
      state.type = e.target.value;
      renderGrid();
    });
    document.querySelector("[data-ln-level]").addEventListener("change", function (e) {
      state.level = e.target.value;
      renderGrid();
    });

    renderKpis();
    renderGrid();
    renderPaths();
  });
})(window, document);
