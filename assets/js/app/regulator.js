/* Regulator Overview (task 229). Four hash-routed segments; analytics
 * bars derive from the same DEMO.regulator scalars as the KPI grid, so
 * the two views agree by construction. */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var kpiEl = document.querySelector("[data-rg-kpis]");
    if (!kpiEl) return;
    var D = GeFi.DEMO;
    var R = D.regulator;
    var fmt = GeFi.fmt;
    var app = GeFi.app;
    var toast = document.querySelector("[data-rg-toast]");

    var KEY = "gefi-app-regulator";
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { extraActivity: [], resolvedIssues: [] };
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();

    /* ---- KPI grid (3x3) ---- */
    [
      { label: "Total Audits", value: String(R.audits30d), sub: "+12% vs prior period", tone: "is-up" },
      { label: "Pending Audits", value: String(R.pending), sub: R.dueThisWeek + " due this week", tone: "is-amber" },
      { label: "Compliance Rate", value: R.complianceRate + "%", sub: "across supervised orgs", tone: "" },
      { label: "Flagged Issues", value: String(R.flagged), sub: R.critical + " critical", tone: "is-down" },
      { label: "Resolved Issues", value: String(R.resolved), sub: "lifetime, sample", tone: "is-up" },
      { label: "Active Standards", value: String(R.standards), sub: "in enforcement", tone: "is-blue" },
      { label: "Completion Rate", value: R.completionRate + "%", sub: "of scheduled audits", tone: "" },
      { label: "Avg Resolution", value: R.avgResolutionDays + " days", sub: "issue open → closed", tone: "" },
      { label: "Critical Issues", value: String(R.critical), sub: "act now", tone: "is-down" }
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

    /* ---- Quick actions ---- */
    var quick = document.querySelector("[data-rg-quick]");
    [
      { title: "Start New Audit", desc: "Schedule a model, dataset or org audit", cls: "", modal: "[data-rg-audit]" },
      { title: "Report Issue", desc: "File a compliance finding", cls: "app-tile--red", modal: "[data-rg-issue]" },
      { title: "Send Communication", desc: "Message a supervised organization", cls: "app-tile--blue", modal: "[data-rg-comm]" }
    ].forEach(function (q) {
      var t = document.createElement("button");
      t.type = "button";
      t.className = "app-tile " + q.cls;
      var tt = document.createElement("span");
      tt.className = "app-tile__title";
      tt.textContent = q.title;
      var td = document.createElement("span");
      td.className = "app-tile__desc";
      td.textContent = q.desc;
      t.appendChild(tt);
      t.appendChild(td);
      t.addEventListener("click", function () {
        var m = document.querySelector(q.modal);
        m.hidden = false;
        var f = m.querySelector("input, select, textarea");
        if (f) f.focus();
      });
      quick.appendChild(t);
    });

    /* ---- Upcoming audits ---- */
    var upEl = document.querySelector("[data-rg-upcoming]");
    R.upcoming.forEach(function (u) {
      var row = document.createElement("div");
      row.className = "app-rp-row";
      var main = document.createElement("div");
      main.className = "app-rp-row__main";
      var name = document.createElement("p");
      name.className = "app-rp-row__name";
      name.textContent = u.title;
      var meta = document.createElement("p");
      meta.className = "app-rp-row__desc";
      meta.textContent = u.owner + " • " + fmt.date(u.date);
      main.appendChild(name);
      main.appendChild(meta);
      row.appendChild(main);
      row.appendChild(app.chip(u.priority, u.priority));
      var view = document.createElement("a");
      view.className = "app-btn app-btn--ghost";
      view.href = "/app/reg-model-audits/";
      view.textContent = "View";
      row.appendChild(view);
      upEl.appendChild(row);
    });

    /* ---- Analytics — derived from the SAME scalars as the KPIs ---- */
    function bar(el, label, pct, valText, color) {
      var row = document.createElement("div");
      row.className = "app-allocbar";
      var name = document.createElement("span");
      name.className = "app-allocbar__name";
      name.textContent = label;
      var track = document.createElement("div");
      track.className = "app-meter";
      var fill = document.createElement("div");
      fill.className = "app-meter__fill";
      fill.style.width = Math.min(100, pct) + "%";
      if (color) fill.style.background = color;
      track.appendChild(fill);
      var val = document.createElement("span");
      val.className = "app-meterrow__val mono";
      val.textContent = valText;
      row.appendChild(name);
      row.appendChild(track);
      row.appendChild(val);
      el.appendChild(row);
    }

    var trendEl = document.querySelector("[data-rg-trend]");
    [-5.2, -3.1, -1.4, 0].forEach(function (delta, i) {
      var v = +(R.complianceRate + delta).toFixed(1);
      bar(trendEl, ["Q4 '25", "Q1 '26", "Q2 '26", "Q3 '26"][i], v, v + "%", i === 3 ? "var(--app-brand)" : "");
    });

    var typesEl = document.querySelector("[data-rg-audittypes]");
    var model = Math.round(R.audits30d * 0.41);
    var dataset = Math.round(R.audits30d * 0.29);
    var process = Math.round(R.audits30d * 0.19);
    var security = R.audits30d - model - dataset - process;
    [["Model", model], ["Dataset", dataset], ["Process", process], ["Security", security]].forEach(function (t) {
      bar(typesEl, t[0], (t[1] / R.audits30d) * 100, String(t[1]), "");
    });
    typesEl.setAttribute("data-rg-audittotal", String(model + dataset + process + security));

    var issuesEl = document.querySelector("[data-rg-issues]");
    var high = Math.round((R.flagged - R.critical) * 0.3);
    var medium = Math.round((R.flagged - R.critical) * 0.45);
    var low = R.flagged - R.critical - high - medium;
    [
      ["Critical", R.critical, "var(--app-red)"],
      ["High", high, "var(--app-orange)"],
      ["Medium", medium, "var(--app-amber)"],
      ["Low", low, "var(--app-green)"]
    ].forEach(function (t) {
      bar(issuesEl, t[0], (t[1] / R.flagged) * 100, String(t[1]), t[2]);
    });
    issuesEl.setAttribute("data-rg-issuetotal", String(R.critical + high + medium + low));

    var perfEl = document.querySelector("[data-rg-perf]");
    [
      ["Completion rate", R.completionRate + "%"],
      ["Avg resolution", R.avgResolutionDays + " days"],
      ["Resolved issues", String(R.resolved)],
      ["Active standards", String(R.standards)]
    ].forEach(function (kv) {
      var dt = document.createElement("dt");
      dt.textContent = kv[0];
      var dd = document.createElement("dd");
      dd.className = "mono";
      dd.textContent = kv[1];
      perfEl.appendChild(dt);
      perfEl.appendChild(dd);
    });

    /* ---- Recent activity ---- */
    var ICONS = {
      ok: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
      bad: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.8L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
      doc: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
      chat: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    };
    var SEV_CHIP = { low: "low", medium: "medium", high: "high", critical: "sev-critical" };

    function renderActivity() {
      var el = document.querySelector("[data-rg-activity]");
      el.innerHTML = "";
      st.extraActivity.concat(R.activity).forEach(function (a) {
        var li = document.createElement("li");
        li.className = "app-activity__row";
        var tile = document.createElement("span");
        tile.className = "app-rg-icontile app-rg-icontile--" + a.icon;
        tile.innerHTML = ICONS[a.icon] || ICONS.doc;
        li.appendChild(tile);
        var main = document.createElement("div");
        main.className = "app-activity__main";
        var title = document.createElement("p");
        title.className = "app-activity__title";
        title.textContent = a.title;
        var detail = document.createElement("p");
        detail.className = "app-activity__detail";
        detail.textContent = a.detail + " · " + a.when;
        main.appendChild(title);
        main.appendChild(detail);
        li.appendChild(main);
        var chips = document.createElement("span");
        chips.style.display = "inline-flex";
        chips.style.gap = "6px";
        chips.appendChild(app.chip("outline", a.org));
        chips.appendChild(app.chip(SEV_CHIP[a.severity] || "neutral", a.severity));
        li.appendChild(chips);
        el.appendChild(li);
      });
    }
    renderActivity();

    /* ---- Insights ---- */
    var ICON_BY_TONE = { blue: "doc", amber: "bad", green: "ok", purple: "chat" };
    var insEl = document.querySelector("[data-rg-insights]");
    R.insights.forEach(function (ins) {
      var b = document.createElement("div");
      b.className = "app-rg-banner app-rg-banner--" + ins.tone;
      var icon = document.createElement("span");
      icon.className = "app-rg-banner__icon";
      icon.innerHTML = ICONS[ICON_BY_TONE[ins.tone]];
      b.appendChild(icon);
      var main = document.createElement("div");
      var kind = document.createElement("p");
      kind.className = "app-rg-banner__kind";
      kind.textContent = ins.kind;
      var title = document.createElement("p");
      title.className = "app-rg-banner__title";
      title.textContent = ins.title;
      var body = document.createElement("p");
      body.className = "app-rg-banner__body";
      body.textContent = ins.body;
      main.appendChild(kind);
      main.appendChild(title);
      main.appendChild(body);
      b.appendChild(main);
      insEl.appendChild(b);
    });

    /* ---- Quick-action modals → activity feed ---- */
    function goActivity() {
      var btn = document.querySelector('[data-segment="activity"]');
      if (btn) btn.click();
    }
    function wireModal(sel, cancelSel, formSel, onSubmit) {
      var m = document.querySelector(sel);
      m.addEventListener("click", function (e) {
        if (e.target === m || e.target.closest(cancelSel)) m.hidden = true;
      });
      document.querySelector(formSel).addEventListener("submit", function (e) {
        e.preventDefault();
        var entry = onSubmit(e.target);
        if (!entry) return;
        st.extraActivity.unshift(entry);
        save();
        m.hidden = true;
        e.target.reset();
        renderActivity();
        goActivity();
        toast.textContent = entry.title + " — logged to the activity feed.";
      });
    }
    wireModal("[data-rg-audit]", "[data-rg-audit-cancel]", "[data-rg-audit-form]", function (f) {
      var entity = f.elements.entity.value.trim();
      if (!entity) return null;
      return { icon: "doc", title: f.elements.type.value + " scheduled", detail: entity + " · queued by you", when: "just now", org: "You", severity: "medium" };
    });
    wireModal("[data-rg-issue]", "[data-rg-issue-cancel]", "[data-rg-issue-form]", function (f) {
      var desc = f.elements.desc.value.trim();
      if (!desc) return null;
      return { icon: "bad", title: "Issue reported", detail: desc.slice(0, 80) + " · filed by you", when: "just now", org: "You", severity: f.elements.severity.value };
    });
    wireModal("[data-rg-comm]", "[data-rg-comm-cancel]", "[data-rg-comm-form]", function (f) {
      var to = f.elements.recipient.value.trim();
      var msg = f.elements.message.value.trim();
      if (!to || !msg) return null;
      return { icon: "chat", title: "Communication sent", detail: "To " + to + " · " + msg.slice(0, 60), when: "just now", org: to, severity: "low" };
    });

    /* ---- Export Dashboard ---- */
    document.querySelector("[data-rg-export]").addEventListener("click", function () {
      var payload = {
        sample: true,
        generated: "2026-08-22",
        kpis: {
          totalAudits: R.audits30d, pending: R.pending, complianceRatePct: R.complianceRate,
          flagged: R.flagged, critical: R.critical, resolved: R.resolved,
          standards: R.standards, completionRatePct: R.completionRate, avgResolutionDays: R.avgResolutionDays
        },
        upcoming: R.upcoming.length,
        activityEntries: st.extraActivity.length + R.activity.length
      };
      var text = JSON.stringify(payload, null, 2);
      function done(ok) {
        toast.textContent = ok ? "Dashboard summary copied as JSON — stamped sample:true." : "Copy failed — clipboard unavailable.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  });
})(window, document);
