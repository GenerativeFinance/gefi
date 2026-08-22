/* Learning center (task 219). Dark cards with colored accents — the
 * reference's white-on-pastel path cards were illegible (§5.8). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var app = GeFi.app;

    var LE = GeFi.learning;
    var state = { seg: "", q: "", type: "", level: "" };

    /* Catalog rows carry this account's progress and enrolment id; the
     * certificate list is the record set the KPI counts. Both hydrate from
     * the service when it is answering. */
    var items = (D.learning.items || []).map(function (it) {
      return Object.assign({ minutes: LE.durationMinutes(it.duration), enrollment: null }, it);
    });
    var certificates = items
      .filter(function (i) { return i.progress >= 100; })
      .map(function (i) { return LE.certificateFor(i, "2026-07-15"); });

    function progOf(it) {
      return it.progress || 0;
    }

    function renderKpis() {
      var el = document.querySelector("[data-ln-kpis]");
      el.innerHTML = "";
      /* Every figure is counted from the rows and the certificate records.
       * The old strip showed `completed + 1` certificates for an
       * "onboarding" one no record backed, and a flat 24.5 hours that
       * corresponded to nothing at all. */
      var t = LE.stats(items, {}, certificates);
      [
        { key: "completed", label: "Completed", value: String(t.completed), sub: "with certificates", tone: "is-up" },
        { key: "progress", label: "In Progress", value: String(t.inProgress), sub: "keep going", tone: "" },
        { key: "certificates", label: "Certificates", value: String(t.certificates), sub: "issued on completion", tone: "" },
        { key: "hours", label: "Hours Learned", value: String(t.hours), sub: "summed from completed items", tone: "" }
      ].forEach(function (k) {
        var card = document.createElement("div");
        card.className = "app-kpi";
        var l = document.createElement("p");
        l.className = "app-kpi__label";
        l.textContent = k.label;
        var v = document.createElement("p");
        v.className = "app-kpi__value";
        v.setAttribute("data-ln-kpi", k.key);
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
      var rows = LE.filter(items, state, {});
      empty.hidden = rows.length > 0;
      if (!rows.length) {
        empty.appendChild(app.empty({ head: "Nothing matches", hint: "Loosen the filters or search differently." }));
      }
      rows.forEach(function (it) {
        var p = progOf(it);
        var c = document.createElement("div");
        c.className = "app-gridcard";
        c.setAttribute("data-ln-card", it.title);
        c.setAttribute("data-ln-progress", p);
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
          btn.setAttribute("data-ln-advance", it.title);
          btn.textContent = p > 0 ? "Continue" : "Start Learning";
          btn.addEventListener("click", function () {
            advance(it);
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

    /* Advancing goes through the service: enrol if this is the first click,
     * then record the new progress. The service issues the certificate and
     * says so, rather than the page deciding one exists. Offline the same
     * step is applied locally and the certificate is minted from the same
     * function, so the outcome matches. */
    function advance(it) {
      var next = LE.nextProgress(progOf(it));
      var enrol = it.enrollment
        ? Promise.resolve({ id: it.enrollment })
        : GeFi.api.post("/learning/enrollments", { item: it.title }).then(
            function (r) { return r && r.id ? r : { id: null }; },
            function () { return { id: null }; }
          );
      enrol.then(function (e) {
        if (e.id) it.enrollment = e.id;
        if (!e.id) {
          applyLocally();
          return;
        }
        GeFi.api.patch("/learning/progress/" + encodeURIComponent(e.id), { progress: next }).then(
          function (r) {
            if (!r || !r.enrollment) {
              applyLocally();
              return;
            }
            it.progress = r.enrollment.progress;
            if (r.certificate) addCertificate(r.certificate);
            finish();
          },
          function () { applyLocally(); }
        );
      });

      function applyLocally() {
        it.progress = next;
        if (next >= 100) addCertificate(LE.certificateFor(it));
        finish();
      }
      function finish() {
        renderGrid();
        renderKpis();
        var root = document.querySelector("[data-ln-root]");
        if (root) root.setAttribute("data-ln-advanced", it.title + ":" + it.progress);
      }
    }

    function addCertificate(cert) {
      if (!cert) return;
      if (certificates.some(function (c) { return c.id === cert.id; })) return;
      certificates.push(cert);
    }

    renderKpis();
    renderGrid();
    renderPaths();

    /* Live, the catalog and the certificate records come from the service,
     * so the KPIs are computed from server state. */
    GeFi.api.get("/learning/catalog?limit=100").then(function (r) {
      if (!r || !r.items || !r.items.length || r.sample) return;
      items = r.items;
      return GeFi.api.get("/learning/certificates?limit=100").then(function (c) {
        if (c && c.items && !c.sample) certificates = c.items;
        renderKpis();
        renderGrid();
      });
    }, function () {});
  });
})(window, document);
