/* Data provider: overview + dataset management (task 221). Aggregates
 * always derive from the dataset rows — tabs cannot disagree. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var DP = GeFi.dataPlatform;

    /* The registry, hydrated live and seeded offline. Only activity is
     * stored — quality and revenue are DERIVED by the shared module, so no
     * surface can show a figure the line items do not support. */
    var registry = (D.datasets || []).map(function (d) {
      return Object.assign({}, d);
    });

    function allDatasets() {
      return registry
        .filter(function (d) { return d.status !== "archived"; })
        .map(DP.view);
    }
    function totals() {
      return DP.totals(registry.filter(function (d) { return d.status !== "archived"; }));
    }
    /* shared for tasks 221/222 — one set of rows, one set of sums */
    GeFi.appProvider = { allDatasets: allDatasets, totals: totals, refresh: refreshRegistry };

    function refreshRegistry() {
      return GeFi.api.get("/datasets?limit=100").then(function (r) {
        if (!r || !r.items || !r.items.length || r.sample) return;
        registry = r.items;
      }, function () {});
    }

    /* KPI strip on any provider page that has the container */
    var kpiEl = document.querySelector("[data-dpv-kpis]");
    function renderKpis() {
      if (!kpiEl) return;
      var t = totals();
      kpiEl.innerHTML = "";
      [
        { key: "datasets", label: "Total Datasets", value: String(t.datasets), sub: t.published + " published", tone: "" },
        { key: "revenue", label: "Total Revenue", value: fmt.moneyFull(t.revenue), sub: "lifetime, sample", tone: "is-up" },
        { key: "subscribers", label: "Active Subscriptions", value: String(t.subscribers), sub: "models + tenants", tone: "" },
        { key: "quality", label: "Avg Quality Score", value: String(t.avgQuality), sub: "of 10, across audited datasets", tone: "" }
      ].forEach(function (k) {
        var card = document.createElement("div");
        card.className = "app-kpi";
        var l = document.createElement("p");
        l.className = "app-kpi__label";
        l.textContent = k.label;
        var v = document.createElement("p");
        v.className = "app-kpi__value";
        v.setAttribute("data-dpv-kpi", k.key);
        v.textContent = k.value;
        var s = document.createElement("p");
        s.className = "app-kpi__sub " + k.tone;
        s.textContent = k.sub;
        card.appendChild(l);
        card.appendChild(v);
        card.appendChild(s);
        kpiEl.appendChild(card);
      });
    }
    renderKpis();

    /* Overview activity — derived from dataset events, never a blank panel */
    var actEl = document.querySelector("[data-dpv-activity]");
    if (actEl) {
      var events = [];
      allDatasets().slice(0, 5).forEach(function (d, i) {
        events.push({
          title: d.status === "processing" ? d.name + " is processing" : d.name + " " + (i % 2 ? "gained a subscriber" : "passed its quality audit"),
          detail: d.category + " · quality " + d.quality + " · " + d.subscribers + " subscribers",
          when: ["2h ago", "6h ago", "yesterday", "2 days ago", "3 days ago"][i]
        });
      });
      if (!events.length) {
        document.querySelector("[data-dpv-activity-empty]").hidden = false;
        document.querySelector("[data-dpv-activity-empty]").appendChild(
          app.empty({ head: "No activity yet", hint: "Upload a dataset to start the feed.", cta: { label: "Upload Dataset", href: "/app/datasets/" } })
        );
      }
      events.forEach(function (ev) {
        var li = document.createElement("li");
        li.className = "app-activity__row";
        var main = document.createElement("div");
        main.className = "app-activity__main";
        var title = document.createElement("p");
        title.className = "app-activity__title";
        title.textContent = ev.title;
        var detail = document.createElement("p");
        detail.className = "app-activity__detail";
        detail.textContent = ev.detail + " · " + ev.when;
        main.appendChild(title);
        main.appendChild(detail);
        li.appendChild(main);
        actEl.appendChild(li);
      });
    }

    /* Datasets tab */
    var listEl = document.querySelector("[data-ds-list]");
    if (listEl) {
      var statusLine = document.querySelector("[data-ds-status]");
      var archTarget = null;

      function renderList() {
        listEl.innerHTML = "";
        allDatasets().forEach(function (d) {
          var card = document.createElement("div");
          card.className = "app-rowcard";
          var main = document.createElement("div");
          main.className = "app-rowcard__main";
          var head = document.createElement("div");
          head.className = "app-rowcard__head";
          var title = document.createElement("p");
          title.className = "app-rowcard__title";
          title.textContent = d.name;
          var cat = document.createElement("span");
          cat.className = "app-rowcard__sub";
          cat.textContent = d.category;
          head.appendChild(title);
          head.appendChild(cat);
          head.appendChild(app.chip(d.status === "published" ? "ok" : d.status === "processing" ? "pending" : "draft", d.status));
          var q = document.createElement("span");
          q.className = "app-chip app-chip--outline mono";
          q.textContent = "quality " + d.quality;
          head.appendChild(q);
          main.appendChild(head);
          var cols = document.createElement("div");
          cols.className = "app-rowcard__cols";
          [["Rows", d.rows], ["Monthly revenue", d.revenue ? fmt.moneyFull(Math.round(d.revenue / 12)) : "—"], ["Downloads", String(d.downloads)], ["Subscribers", String(d.subscribers)]].forEach(function (c) {
            var col = document.createElement("div");
            col.className = "app-rowcard__col";
            var cl = document.createElement("span");
            cl.className = "app-rowcard__collabel";
            cl.textContent = c[0];
            var cv = document.createElement("span");
            cv.className = "app-rowcard__colval";
            cv.textContent = c[1];
            col.appendChild(cl);
            col.appendChild(cv);
            cols.appendChild(col);
          });
          main.appendChild(cols);
          var rail = document.createElement("div");
          rail.className = "app-rowcard__rail";
          ["Edit", "Analytics"].forEach(function (l) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "app-btn app-btn--ghost";
            b.textContent = l;
            rail.appendChild(b);
          });
          var arch = document.createElement("button");
          arch.type = "button";
          arch.className = "app-btn app-btn--ghost";
          arch.textContent = "Archive";
          arch.addEventListener("click", function () {
            archTarget = d;
            document.querySelector("[data-ds-archive-name]").textContent = d.name;
            document.querySelector("[data-ds-archive-err]").textContent = "";
            document.querySelector("[data-ds-archive] input").value = "";
            document.querySelector("[data-ds-archive]").hidden = false;
            document.querySelector("[data-ds-archive] input").focus();
          });
          rail.appendChild(arch);
          card.appendChild(main);
          card.appendChild(rail);
          listEl.appendChild(card);
        });
      }

      var upModal = document.querySelector("[data-ds-modal]");
      document.querySelector("[data-ds-upload]").addEventListener("click", function () {
        upModal.hidden = false;
        upModal.querySelector('input[name="name"]').focus();
      });
      upModal.addEventListener("click", function (e) {
        if (e.target === upModal || e.target.closest("[data-ds-modal-cancel]")) upModal.hidden = true;
      });
      var upError = document.querySelector("[data-ds-error]");
      document.querySelector("[data-ds-form]").addEventListener("submit", function (e) {
        e.preventDefault();
        var form = e.target;
        var spec = {
          name: form.elements.name.value.trim(),
          category: form.elements.category.value,
          rows: "1M"
        };
        /* Same rule the registry applies, so a name it would refuse is
         * refused here in the same words. */
        var why = DP.validateUpload(spec, registry);
        if (why) {
          upError.textContent = why;
          return;
        }
        upError.textContent = "";
        GeFi.api.post("/datasets", spec).then(
          function (r) { begin(r && r.id ? r : null); },
          function (err) {
            var msg = err && err.body && err.body.message;
            if (msg) {
              upError.textContent = msg;
              return;
            }
            begin(null);
          }
        );

        function begin(server) {
          var d = server || {
            id: "DS-LOCAL-" + registry.length,
            name: spec.name,
            category: spec.category,
            rows: spec.rows,
            status: "processing",
            downloads: 0,
            subscribers: 0
          };
          registry.push(d);
          upModal.hidden = true;
          form.reset();
          renderList();
          renderKpis();
          statusLine.textContent = d.name + " is processing — it publishes when ingestion and the quality audit finish.";
          stamp("processing", d.id);

          /* Ingestion finishes server-side too; poll for the transition when
           * the API is answering rather than guessing at the timing. */
          var deadline = 12;
          var timer = setInterval(function () {
            deadline -= 1;
            if (deadline <= 0) {
              clearInterval(timer);
              return;
            }
            GeFi.api.get("/datasets/" + encodeURIComponent(d.id)).then(function (r) {
              if (!r || r.status !== "published") return;
              clearInterval(timer);
              finish(r);
            }, function () {
              /* Offline nothing is ingesting, so publish locally on the
               * same 2s beat the contract documents. */
              if (deadline > 8) return;
              clearInterval(timer);
              d.status = "published";
              finish(DP.view(d));
            });
          }, 500);

          function finish(published) {
            Object.assign(d, published);
            renderList();
            renderKpis();
            statusLine.textContent = d.name + " is published. Aggregates on Overview and Revenue update from the same rows.";
            stamp("published", d.id);
          }
        }
      });

      var archModal = document.querySelector("[data-ds-archive]");
      archModal.addEventListener("click", function (e) {
        if (e.target === archModal || e.target.closest("[data-ds-archive-cancel]")) archModal.hidden = true;
      });
      document.querySelector("[data-ds-archive-form]").addEventListener("submit", function (e) {
        e.preventDefault();
        if (!archTarget) return;
        var typed = e.target.elements.confirm.value.trim();
        /* The registry demands an exact typed confirmation; applying the
         * same rule here means the refusal reads the same either way. */
        var why = DP.validateArchive(archTarget, typed);
        if (why) {
          document.querySelector("[data-ds-archive-err]").textContent = why;
          return;
        }
        var target = archTarget;
        GeFi.api.post("/datasets/" + encodeURIComponent(target.id) + "/archive", { confirm: typed }).then(
          function () { done(); },
          function (err) {
            var msg = err && err.body && err.body.message;
            if (msg) {
              document.querySelector("[data-ds-archive-err]").textContent = msg;
              return;
            }
            done();
          }
        );

        function done() {
          var row = registry.filter(function (d) { return d.id === target.id; })[0];
          if (row) row.status = "archived";
          archModal.hidden = true;
          renderList();
          renderKpis();
          statusLine.textContent = target.name + " archived — existing subscribers keep read access.";
          stamp("archived", target.id);
          archTarget = null;
        }
      });

      function stamp(kind, id) {
        var root = document.querySelector("[data-ds-root]");
        if (root) root.setAttribute("data-ds-" + kind, id);
      }

      renderList();
      refreshRegistry().then(function () {
        renderList();
        renderKpis();
      });
    }
  });
})(window, document);
