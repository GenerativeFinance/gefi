/* Portfolio AI Models — active / recommended / settings (task 208). */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var KEY = "gefi-app-portfolio-models";

    function loadState() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { paused: {}, subscribed: [], settings: { autopause: true, suggest: true, feecap: 500 } };
    }
    function saveState(st) {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = loadState();

    function activeRows() {
      var rows = D.aiModels.rows.slice();
      st.subscribed.forEach(function (name) {
        var rec = D.recommended.filter(function (r) { return r.name === name; })[0];
        if (rec) {
          rows.push({
            slug: null, name: rec.name, sub: rec.category, status: "active", updated: "just now",
            allocationPct: 0, performancePct: 0, trades: 0, accuracy: rec.accuracy, pnl: 0, fee: rec.fee
          });
        }
      });
      return rows;
    }

    function statusOf(row) {
      if (st.paused[row.name] === true) return "paused";
      if (st.paused[row.name] === false) return "active";
      return row.status;
    }

    function renderKpis() {
      var el = document.querySelector("[data-pm-kpis]");
      el.innerHTML = "";
      var rows = activeRows();
      var active = rows.filter(function (r) { return statusOf(r) === "active"; });
      var fees = active.reduce(function (n, r) { return n + r.fee; }, 0);
      var acc = rows.reduce(function (n, r) { return n + r.accuracy; }, 0) / rows.length;
      [
        { label: "Active Models", value: String(active.length), sub: rows.length - active.length + " paused", tone: "" },
        { label: "Total Performance", value: fmt.signedPct(D.aiModels.totalPerformancePct), sub: "30 days, all models", tone: "is-up" },
        { label: "Monthly Fees", value: fmt.moneyFull(fees), sub: "active subscriptions", tone: fees > st.settings.feecap ? "is-warn" : "" },
        { label: "Avg Accuracy", value: acc.toFixed(1) + "%", sub: "trailing evaluation", tone: "" }
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

    function renderActive() {
      var el = document.querySelector("[data-pm-active]");
      el.innerHTML = "";
      activeRows().forEach(function (m) {
        var status = statusOf(m);
        var card = document.createElement("div");
        card.className = "app-rowcard";

        var main = document.createElement("div");
        main.className = "app-rowcard__main";
        var head = document.createElement("div");
        head.className = "app-rowcard__head";
        var title = document.createElement("p");
        title.className = "app-rowcard__title";
        title.textContent = m.name;
        var sub = document.createElement("span");
        sub.className = "app-rowcard__sub";
        sub.textContent = m.sub;
        var meta = document.createElement("span");
        meta.className = "app-rowcard__meta";
        meta.textContent = "Updated " + m.updated;
        head.appendChild(title);
        head.appendChild(sub);
        head.appendChild(app.chip(status === "active" ? "active" : "paused", status));
        head.appendChild(meta);
        main.appendChild(head);

        var alloc = document.createElement("div");
        alloc.className = "app-meterrow";
        var lab = document.createElement("span");
        lab.className = "app-rowcard__collabel";
        lab.style.minWidth = "130px";
        lab.textContent = "Portfolio Allocation";
        var track = document.createElement("div");
        track.className = "app-meter";
        var fill = document.createElement("div");
        fill.className = "app-meter__fill";
        fill.style.width = (status === "paused" ? 0 : m.allocationPct) + "%";
        track.appendChild(fill);
        var pct = document.createElement("span");
        pct.className = "app-meterrow__val";
        pct.textContent = (status === "paused" ? 0 : m.allocationPct) + "%";
        alloc.appendChild(lab);
        alloc.appendChild(track);
        alloc.appendChild(pct);
        main.appendChild(alloc);

        var cols = document.createElement("div");
        cols.className = "app-rowcard__cols";
        [
          ["Performance", fmt.signedPct(m.performancePct), m.performancePct >= 0 ? "is-up" : "is-down"],
          ["Total Trades", String(m.trades), ""],
          ["Accuracy", m.accuracy + "%", ""],
          ["P&L", "+" + fmt.moneyFull(m.pnl), "is-up"]
        ].forEach(function (c) {
          var col = document.createElement("div");
          col.className = "app-rowcard__col";
          var cl = document.createElement("span");
          cl.className = "app-rowcard__collabel";
          cl.textContent = c[0];
          var cv = document.createElement("span");
          cv.className = "app-rowcard__colval " + c[2];
          cv.textContent = c[1];
          col.appendChild(cl);
          col.appendChild(cv);
          cols.appendChild(col);
        });
        main.appendChild(cols);

        var rail = document.createElement("div");
        rail.className = "app-rowcard__rail";
        var fee = document.createElement("span");
        fee.className = "app-rowcard__fee";
        fee.textContent = "$" + m.fee + "/mo";
        rail.appendChild(fee);
        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = status === "paused" ? "app-btn app-btn--primary" : "app-btn app-btn--ghost";
        toggle.textContent = status === "paused" ? "Resume" : "Pause";
        toggle.addEventListener("click", function () {
          st.paused[m.name] = status !== "paused";
          saveState(st);
          renderActive();
          renderKpis();
        });
        rail.appendChild(toggle);
        ["Configure", "Analytics"].forEach(function (label) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "app-btn app-btn--ghost";
          b.textContent = label;
          rail.appendChild(b);
        });

        card.appendChild(main);
        card.appendChild(rail);
        el.appendChild(card);
      });
    }

    function renderRecommended() {
      var el = document.querySelector("[data-pm-recommended]");
      el.innerHTML = "";
      D.recommended.forEach(function (r) {
        var done = st.subscribed.indexOf(r.name) !== -1;
        var c = document.createElement("div");
        c.className = "app-gridcard";
        var head = document.createElement("div");
        head.className = "app-gridcard__chips";
        var title = document.createElement("p");
        title.className = "app-gridcard__title";
        title.textContent = r.name;
        var price = document.createElement("span");
        price.className = "app-chip app-chip--outline mono";
        price.textContent = "$" + r.fee + "/mo";
        head.appendChild(title);
        head.appendChild(price);
        var desc = document.createElement("p");
        desc.className = "app-gridcard__desc";
        desc.textContent = r.category;
        var stats = document.createElement("div");
        stats.className = "app-gridcard__stats";
        [["Rating", "★ " + r.rating], ["Accuracy", r.accuracy + "%"], ["Subscribers", r.subscribers.toLocaleString("en-US")]].forEach(function (s) {
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
        var tags = document.createElement("div");
        tags.className = "app-gridcard__tags";
        r.tags.forEach(function (tg) { tags.appendChild(app.chip("outline", tg)); });
        var footer = document.createElement("div");
        footer.className = "app-gridcard__footer";
        var subBtn = document.createElement("button");
        subBtn.type = "button";
        subBtn.className = done ? "app-btn app-btn--ghost" : "app-btn app-btn--primary";
        subBtn.textContent = done ? "Subscribed ✓" : "Subscribe";
        subBtn.disabled = done;
        subBtn.addEventListener("click", function () {
          st.subscribed.push(r.name);
          saveState(st);
          renderRecommended();
          renderActive();
          renderKpis();
        });
        var details = document.createElement("a");
        details.className = "app-btn app-btn--ghost";
        details.href = "/app/marketplace/";
        details.textContent = "Details";
        footer.appendChild(subBtn);
        footer.appendChild(details);
        c.appendChild(head);
        c.appendChild(desc);
        c.appendChild(stats);
        c.appendChild(tags);
        c.appendChild(footer);
        el.appendChild(c);
      });
    }

    /* settings */
    var settingsEl = document.querySelector("[data-pm-settings]");
    var autop = settingsEl.querySelector('[data-set="autopause"]');
    var sugg = settingsEl.querySelector('[data-set="suggest"]');
    var cap = settingsEl.querySelector('[data-set="feecap"]');
    var capOut = document.querySelector("[data-feecap-out]");
    autop.checked = st.settings.autopause;
    sugg.checked = st.settings.suggest;
    cap.value = st.settings.feecap;
    capOut.textContent = "$" + st.settings.feecap;
    settingsEl.addEventListener("change", function () {
      st.settings = { autopause: autop.checked, suggest: sugg.checked, feecap: parseInt(cap.value, 10) };
      saveState(st);
      renderKpis();
    });
    cap.addEventListener("input", function () {
      capOut.textContent = "$" + cap.value;
    });

    renderKpis();
    renderActive();
    renderRecommended();
  });
})(window, document);
