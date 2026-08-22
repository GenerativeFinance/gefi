/* Regulator Overview (task 229). Four hash-routed segments; analytics
 * bars derive from the same DEMO.regulator scalars as the KPI grid, so
 * the two views agree by construction. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
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

    /* Every figure is COUNTED from the audit register and the issue list by
     * the shared engine — the same function the service runs. Before this
     * they were stored constants (142 audits, 87.3% compliance, 15
     * standards) with no relationship to the rows the registers held, and
     * the audit-type breakdown was a fixed 41/29/19 share of that made-up
     * total. */
    var RG = GeFi.regulator;
    var auditRegister = RG.register(R.modelAudits, R.datasetAudits);
    var ov = RG.overview(auditRegister, R.issues, R.standardsList, st.resolvedIssues || []);
    var effFlagged = ov.flagged;
    var effCritical = ov.critical;
    var effResolved = ov.resolved;

    /* ---- KPI grid (3x3) ---- */
    [
      { key: "total", label: "Total Audits", value: String(ov.total), sub: "in the register", tone: "is-up" },
      { key: "pending", label: "Pending Audits", value: String(ov.pending), sub: ov.dueThisWeek + " due this week", tone: "is-amber" },
      { key: "compliance", label: "Compliance Rate", value: ov.compliancePct + "%", sub: "unflagged, across the register", tone: "" },
      { key: "flagged", label: "Flagged Issues", value: String(effFlagged), sub: effCritical + " critical", tone: "is-down" },
      { key: "resolved", label: "Resolved Issues", value: String(effResolved), sub: "closed this session", tone: "is-up" },
      { key: "standards", label: "Active Standards", value: String(ov.standards), sub: "in enforcement", tone: "is-blue" },
      { key: "completion", label: "Completion Rate", value: ov.completionPct + "%", sub: ov.completed + " of " + ov.total + " completed", tone: "" },
      { key: "resolution", label: "Avg Resolution", value: ov.avgResolutionDays == null ? "—" : ov.avgResolutionDays + " days", sub: ov.avgResolutionDays == null ? "nothing closed yet" : "issue open \u2192 closed", tone: "" },
      { key: "critical", label: "Critical Issues", value: String(effCritical), sub: "act now", tone: "is-down" }
    ].forEach(function (k) {
      var card = document.createElement("div");
      card.className = "app-kpi";
      var l = document.createElement("p");
      l.className = "app-kpi__label";
      l.textContent = k.label;
      var v = document.createElement("p");
      v.className = "app-kpi__value";
      if (k.key) v.setAttribute("data-rg-kpi", k.key);
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
      var v = +(ov.compliancePct + delta).toFixed(1);
      bar(trendEl, ["Q4 '25", "Q1 '26", "Q2 '26", "Q3 '26"][i], v, v + "%", i === 3 ? "var(--app-brand)" : "");
    });

    var typesEl = document.querySelector("[data-rg-audittypes]");
    /* Real counts per type, straight off the register — every row lands in
     * a bar, so the bars add up to the register's size. */
    var typeRows = Object.keys(ov.byType)
      .map(function (name) { return [name, ov.byType[name]]; })
      .sort(function (a, b) { return b[1] - a[1]; });
    typeRows.forEach(function (t) {
      bar(typesEl, t[0], (t[1] / ov.total) * 100, String(t[1]), "");
    });
    typesEl.setAttribute(
      "data-rg-audittotal",
      String(typeRows.reduce(function (n, t) { return n + t[1]; }, 0))
    );

    var issuesEl = document.querySelector("[data-rg-issues]");
    /* Real counts per severity. These used to be a fixed 30/45% share of
     * the flagged total, so the bars described no actual issue. */
    var sevRows = [
      ["Critical", ov.bySeverity.critical, "var(--app-red)"],
      ["High", ov.bySeverity.high, "var(--app-orange)"],
      ["Medium", ov.bySeverity.medium, "var(--app-amber)"],
      ["Low", ov.bySeverity.low, "var(--app-green)"]
    ];
    sevRows.forEach(function (t) {
      bar(issuesEl, t[0], effFlagged ? (t[1] / effFlagged) * 100 : 0, String(t[1]), t[2]);
    });
    issuesEl.setAttribute(
      "data-rg-issuetotal",
      String(sevRows.reduce(function (n, t) { return n + t[1]; }, 0))
    );

    var perfEl = document.querySelector("[data-rg-perf]");
    [
      ["Completion rate", ov.completionPct + "%"],
      ["Avg resolution", ov.avgResolutionDays == null ? "\u2014" : ov.avgResolutionDays + " days"],
      ["Resolved issues", String(ov.resolved)],
      ["Active standards", String(ov.standards)]
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
          totalAudits: ov.total, pending: ov.pending, complianceRatePct: ov.compliancePct,
          flagged: effFlagged, critical: effCritical, resolved: effResolved,
          standards: ov.standards, completionRatePct: ov.completionPct, avgResolutionDays: ov.avgResolutionDays
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
