/* Data provider: overview + dataset management (task 221). Aggregates
 * always derive from the dataset rows — tabs cannot disagree. */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var KEY = "gefi-app-datasets";
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { extra: [], archived: [] };
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();

    function allDatasets() {
      return D.datasets.concat(st.extra).filter(function (d) {
        return st.archived.indexOf(d.id) === -1;
      });
    }
    function totals() {
      var t = { datasets: 0, revenue: 0, downloads: 0, subscribers: 0, quality: 0 };
      allDatasets().forEach(function (d) {
        t.datasets += 1;
        t.revenue += d.revenue;
        t.downloads += d.downloads;
        t.subscribers += d.subscribers;
        t.quality += d.quality;
      });
      t.avgQuality = t.datasets ? +(t.quality / t.datasets).toFixed(1) : 0;
      return t;
    }
    /* shared for tasks 221/222 */
    GeFi.appProvider = { allDatasets: allDatasets, totals: totals };

    /* KPI strip on any provider page that has the container */
    var kpiEl = document.querySelector("[data-dpv-kpis]");
    if (kpiEl) {
      var t = totals();
      [
        { label: "Total Datasets", value: String(t.datasets), sub: "in the registry", tone: "" },
        { label: "Total Revenue", value: fmt.moneyFull(t.revenue), sub: "lifetime, sample", tone: "is-up" },
        { label: "Active Subscriptions", value: String(t.subscribers), sub: "models + tenants", tone: "" },
        { label: "Avg Quality Score", value: String(t.avgQuality), sub: "of 10, audited", tone: "" }
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
        kpiEl.appendChild(card);
      });
    }

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
      document.querySelector("[data-ds-form]").addEventListener("submit", function (e) {
        e.preventDefault();
        var name = e.target.elements.name.value.trim();
        if (!name) return;
        var d = {
          id: "DS-NEW-" + (st.extra.length + 1),
          name: name,
          category: e.target.elements.category.value,
          quality: 0,
          rows: "—",
          status: "processing",
          revenue: 0,
          downloads: 0,
          subscribers: 0
        };
        st.extra.push(d);
        save();
        upModal.hidden = true;
        e.target.reset();
        renderList();
        statusLine.textContent = name + " is processing — it publishes when ingestion and the quality audit finish.";
        setTimeout(function () {
          d.status = "published";
          d.quality = 8.6;
          d.rows = "1M";
          save();
          renderList();
          statusLine.textContent = name + " is published. Aggregates on Overview and Revenue update from the same rows.";
        }, 2000);
      });

      var archModal = document.querySelector("[data-ds-archive]");
      archModal.addEventListener("click", function (e) {
        if (e.target === archModal || e.target.closest("[data-ds-archive-cancel]")) archModal.hidden = true;
      });
      document.querySelector("[data-ds-archive-form]").addEventListener("submit", function (e) {
        e.preventDefault();
        if (!archTarget) return;
        var typed = e.target.elements.confirm.value.trim();
        if (typed !== archTarget.name) {
          document.querySelector("[data-ds-archive-err]").textContent = "Name doesn't match — nothing archived.";
          return;
        }
        st.archived.push(archTarget.id);
        save();
        archModal.hidden = true;
        renderList();
        statusLine.textContent = archTarget.name + " archived — existing subscribers keep read access.";
        archTarget = null;
      });

      renderList();
    }
  });
})(window, document);
