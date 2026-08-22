/* Developer console shared script (tasks 216-218): KPIs on every console
 * page + Overview activity + My Models grid. Branch by container. */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var KEY = "gefi-app-dev-models";
    function loadCustom() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return [];
    }
    function saveCustom(list) {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(list));
      } catch (e) {}
    }
    var custom = loadCustom();

    function allModels() {
      return D.devConsole.models.concat(custom);
    }

    /* KPI strip appears on every console page */
    var kpiEl = document.querySelector("[data-dc-kpis]");
    if (kpiEl) {
      var t = D.devConsole.totals;
      kpiEl.innerHTML = "";
      [
        { label: "Total Models", value: String(t.models + custom.length), sub: custom.length ? custom.length + " created this session" : "across environments", tone: "" },
        { label: "Total Funding", value: fmt.moneyFull(t.funding), sub: "raised by your models", tone: "is-up" },
        { label: "Collaborators", value: String(t.collaborators), sub: "across projects", tone: "" },
        { label: "Deployments", value: String(t.deployments), sub: "production + staging", tone: "" }
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

    /* Overview: activity feed */
    var act = document.querySelector("[data-dc-activity]");
    if (act) {
      D.devConsole.activityFeed.forEach(function (a) {
        var li = document.createElement("li");
        li.className = "app-activity__row";
        var main = document.createElement("div");
        main.className = "app-activity__main";
        var title = document.createElement("p");
        title.className = "app-activity__title";
        title.textContent = a.title;
        var meta = document.createElement("p");
        meta.className = "app-activity__detail";
        meta.textContent = a.meta;
        main.appendChild(title);
        main.appendChild(meta);
        var tag = app.chip("neutral", a.tag);
        li.appendChild(main);
        li.appendChild(tag);
        act.appendChild(li);
      });
    }

    /* My Models grid */
    var grid = document.querySelector("[data-dm-grid]");
    if (grid) {
      var filterSel = document.querySelector("[data-dm-filter]");

      function renderModels() {
        var status = filterSel.value;
        var rows = allModels().filter(function (m) { return !status || m.status === status; });
        document.querySelector("[data-dm-count]").textContent = "My Models (" + rows.length + ")";
        grid.innerHTML = "";
        var empty = document.querySelector("[data-dm-empty]");
        empty.innerHTML = "";
        empty.hidden = rows.length > 0;
        if (!rows.length) {
          empty.appendChild(app.empty({ head: "No models in this status", hint: "Clear the filter or create one." }));
        }
        rows.forEach(function (m) {
          var c = document.createElement("div");
          c.className = "app-gridcard";
          var chips = document.createElement("div");
          chips.className = "app-gridcard__chips";
          var title = document.createElement("p");
          title.className = "app-gridcard__title";
          title.style.margin = "0";
          title.textContent = m.name;
          chips.appendChild(title);
          chips.appendChild(app.chip(m.status.toLowerCase(), m.status));
          var stats = document.createElement("div");
          stats.className = "app-gridcard__stats";
          [["Category", m.category], ["Tests", String(m.tests)], ["Collaborators", String(m.collaborators)]].forEach(function (s) {
            var stEl = document.createElement("div");
            stEl.className = "app-gridcard__stat";
            var sl = document.createElement("span");
            sl.className = "app-gridcard__statlabel";
            sl.textContent = s[0];
            var sv = document.createElement("span");
            sv.className = "app-gridcard__statval";
            sv.textContent = s[1];
            stEl.appendChild(sl);
            stEl.appendChild(sv);
            stats.appendChild(stEl);
          });
          var meter = document.createElement("div");
          if (m.goal) {
            meter.className = "app-meterrow";
            var lab = document.createElement("span");
            lab.className = "app-gridcard__statlabel";
            lab.style.minWidth = "110px";
            lab.textContent = "Funding progress";
            var track = document.createElement("div");
            track.className = "app-meter";
            var fill = document.createElement("div");
            fill.className = "app-meter__fill";
            fill.style.width = Math.min(100, (m.funded / m.goal) * 100).toFixed(0) + "%";
            track.appendChild(fill);
            var val = document.createElement("span");
            val.className = "app-meterrow__val";
            val.style.minWidth = "auto";
            val.textContent = fmt.moneyFull(m.funded) + " / " + fmt.moneyFull(m.goal);
            meter.appendChild(lab);
            meter.appendChild(track);
            meter.appendChild(val);
          }
          var footer = document.createElement("div");
          footer.className = "app-gridcard__footer";
          ["View", "Edit"].concat(m.status === "Deployed" ? ["Monitor"] : []).forEach(function (label) {
            var b = document.createElement(label === "Monitor" ? "a" : "button");
            b.className = "app-btn app-btn--ghost";
            b.textContent = label;
            if (label === "Monitor") {
              b.href = "/app/dev-monitoring/";
            } else {
              b.type = "button";
            }
            footer.appendChild(b);
          });
          c.appendChild(chips);
          c.appendChild(stats);
          if (m.goal) c.appendChild(meter);
          c.appendChild(footer);
          grid.appendChild(c);
        });
      }

      filterSel.addEventListener("change", renderModels);

      var modal = document.querySelector("[data-dm-modal]");
      function openNew() {
        modal.hidden = false;
        modal.querySelector('input[name="name"]').focus();
      }
      document.querySelector("[data-dm-new]").addEventListener("click", openNew);
      if (window.location.hash === "#new") openNew();
      window.addEventListener("hashchange", function () {
        if (window.location.hash === "#new") openNew();
      });
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-dm-modal-cancel]")) modal.hidden = true;
      });
      document.querySelector("[data-dm-form]").addEventListener("submit", function (e) {
        e.preventDefault();
        var name = e.target.elements.name.value.trim();
        if (!name) return;
        custom.push({
          name: name,
          status: "Draft",
          category: e.target.elements.category.value,
          tests: 0,
          collaborators: 1,
          funded: 0,
          goal: 0
        });
        saveCustom(custom);
        modal.hidden = true;
        e.target.reset();
        renderModels();
      });

      renderModels();
    }
  });
})(window, document);
