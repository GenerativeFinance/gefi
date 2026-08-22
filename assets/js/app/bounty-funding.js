/* Bounty Funding (task 225). Funding-side view of DEMO.bounties — the
 * bounty's reward IS the funding goal; the developer-side lifecycle on
 * /app/bounties/ is untouched. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var kpiEl = document.querySelector("[data-bf-kpis]");
    if (!kpiEl) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var KEY = "gefi-app-bounty-funding";
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { contributions: [], requests: [] };
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();
    var view = { cat: "", sort: "newest" };

    function myRequests() {
      return st.requests.map(function (r, i) {
        return {
          id: "B-U" + (i + 1), title: r.title, category: r.category, difficulty: r.difficulty,
          reward: r.reward, deadline: "2026-10-15", skills: [], submissions: 0,
          funding: { status: "SUBMITTED", raised: 0, backers: 0, by: "you", duration: "6 weeks" },
          mine: true
        };
      });
    }
    function list() {
      return D.bounties.concat(myRequests());
    }
    function contribsFor(id) {
      return st.contributions.filter(function (c) { return c.id === id; });
    }
    function effRaised(b) {
      return b.funding.raised + contribsFor(b.id).reduce(function (n, c) { return n + c.amount; }, 0);
    }
    function statusOf(b) {
      if (b.mine) return "SUBMITTED";
      if (effRaised(b) >= b.reward) return "COMPLETED";
      return b.funding.status;
    }
    function backersOf(b) {
      return b.funding.backers + contribsFor(b.id).length;
    }

    var STATUS_VOCAB = { SUBMITTED: "submitted", APPROVED: "approved", ACTIVE: "outline", COMPLETED: "completed" };
    var DIFF_VOCAB = { EXPERT: "expert", ADVANCED: "adv", INTERMEDIATE: "intermediate" };

    function renderKpis() {
      kpiEl.innerHTML = "";
      var rows = list();
      var totalFunded = rows.reduce(function (n, b) { return n + effRaised(b); }, 0);
      var totalRewards = rows.reduce(function (n, b) { return n + b.reward; }, 0);
      var completed = rows.filter(function (b) { return statusOf(b) === "COMPLETED"; }).length;
      var pending = rows.filter(function (b) { return statusOf(b) === "SUBMITTED"; }).length;
      var contributors = rows.reduce(function (n, b) { return n + backersOf(b); }, 0);
      [
        { label: "Total Funded", value: fmt.moneyFull(totalFunded), sub: "of " + fmt.moneyFull(totalRewards) + " in rewards", tone: "is-up" },
        { label: "Active Bounties", value: String(rows.length - completed), sub: pending + " pending approval", tone: "is-blue" },
        { label: "Contributors", value: contributors.toLocaleString("en-US"), sub: "backing these bounties", tone: "is-purple" },
        { label: "Completed", value: String(completed), sub: Math.round((completed / rows.length) * 100) + "% fully backed", tone: "is-amber" }
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

    var fundModal = document.querySelector("[data-bf-modal]");
    var fundTarget = null;
    var detailModal = document.querySelector("[data-bf-detail]");

    function openDetail(b) {
      detailModal.querySelector("[data-bf-detail-name]").textContent = b.id + " — " + b.title;
      var body = detailModal.querySelector("[data-bf-detail-body]");
      body.innerHTML = "";
      [
        ["Category", b.category],
        ["Difficulty", b.difficulty],
        ["Funding status", statusOf(b)],
        ["Estimated reward", fmt.moneyFull(b.reward)],
        ["Funded so far", fmt.moneyFull(effRaised(b)) + " (" + backersOf(b) + " backers)"],
        ["Duration", b.funding.duration],
        ["Deadline", fmt.date(b.deadline)],
        ["Developer", b.funding.by],
        ["Required skills", b.skills.length ? b.skills.join(", ") : "—"],
        ["Submissions", String(b.submissions)]
      ].forEach(function (row) {
        var dt = document.createElement("dt");
        dt.textContent = row[0];
        var dd = document.createElement("dd");
        dd.textContent = row[1];
        body.appendChild(dt);
        body.appendChild(dd);
      });
      detailModal.hidden = false;
      detailModal.querySelector("[data-bf-detail-close]").focus();
    }

    function card(b) {
      var status = statusOf(b);
      var raised = effRaised(b);
      var pct = Math.min(100, Math.round((raised / b.reward) * 100));
      var completed = status === "COMPLETED";

      var c = document.createElement("div");
      c.className = "app-rowcard";
      var main = document.createElement("div");
      main.className = "app-rowcard__main";

      var head = document.createElement("div");
      head.className = "app-rowcard__head";
      var title = document.createElement("p");
      title.className = "app-rowcard__title";
      title.textContent = b.title;
      var sub = document.createElement("span");
      sub.className = "app-rowcard__sub";
      sub.textContent = b.id + " · " + b.category + " · by " + b.funding.by;
      head.appendChild(title);
      head.appendChild(sub);
      var statusChip = app.chip(STATUS_VOCAB[status] || "neutral", status);
      statusChip.style.marginLeft = "auto";
      head.appendChild(statusChip);
      head.appendChild(app.chip(DIFF_VOCAB[b.difficulty] || "neutral", b.difficulty));
      main.appendChild(head);

      var cols = document.createElement("div");
      cols.className = "app-rowcard__cols";
      cols.style.gridTemplateColumns = "2fr 1fr 1fr";
      var progCol = document.createElement("div");
      progCol.className = "app-rowcard__col";
      var progLab = document.createElement("span");
      progLab.className = "app-rowcard__collabel";
      progLab.textContent = "Funding Progress";
      var meter = document.createElement("div");
      meter.className = "app-meterrow";
      var track = document.createElement("div");
      track.className = "app-meter" + (completed ? " app-meter--good" : "");
      var fill = document.createElement("div");
      fill.className = "app-meter__fill";
      fill.style.width = pct + "%";
      track.appendChild(fill);
      var mval = document.createElement("span");
      mval.className = "app-meterrow__val mono";
      mval.textContent = fmt.moneyFull(raised) + " / " + fmt.moneyFull(b.reward) + " · " + pct + "%";
      meter.appendChild(track);
      meter.appendChild(mval);
      progCol.appendChild(progLab);
      progCol.appendChild(meter);
      cols.appendChild(progCol);
      [["Backers", backersOf(b) + " backers"], ["Duration", b.funding.duration]].forEach(function (row) {
        var col = document.createElement("div");
        col.className = "app-rowcard__col";
        var cl = document.createElement("span");
        cl.className = "app-rowcard__collabel";
        cl.textContent = row[0];
        var cv = document.createElement("span");
        cv.className = "app-rowcard__colval";
        cv.textContent = row[1];
        col.appendChild(cl);
        col.appendChild(cv);
        cols.appendChild(col);
      });
      main.appendChild(cols);

      if (b.skills.length) {
        var skillsRow = document.createElement("div");
        skillsRow.className = "app-gridcard__tags";
        var sl = document.createElement("span");
        sl.className = "app-rowcard__collabel";
        sl.textContent = "Required Skills:";
        skillsRow.appendChild(sl);
        b.skills.slice(0, 2).forEach(function (s) { skillsRow.appendChild(app.chip("outline", s)); });
        if (b.skills.length > 2) skillsRow.appendChild(app.chip("outline", "+" + (b.skills.length - 2) + " more"));
        main.appendChild(skillsRow);
      }

      var rail = document.createElement("div");
      rail.className = "app-bf-rail";
      var rl = document.createElement("span");
      rl.className = "app-gridcard__statlabel";
      rl.textContent = "Estimated Reward";
      var rv = document.createElement("span");
      rv.className = "app-bf-reward mono";
      rv.textContent = fmt.moneyFull(b.reward);
      rail.appendChild(rl);
      rail.appendChild(rv);
      var btns = document.createElement("div");
      btns.className = "app-bf-railbtns";
      var fund = document.createElement("button");
      fund.type = "button";
      fund.className = "app-btn app-btn--primary";
      fund.textContent = "Fund";
      if (completed || b.mine) {
        fund.disabled = true;
        fund.setAttribute("aria-disabled", "true");
        fund.title = b.mine ? "You can't fund your own request." : "Funding complete — the reward is fully backed.";
      } else {
        fund.addEventListener("click", function () {
          fundTarget = b;
          fundModal.querySelector("[data-bf-modal-name]").textContent = b.title;
          fundModal.querySelector("[data-bf-modal-min]").textContent =
            "Minimum $50 · " + fmt.moneyFull(b.reward - effRaised(b)) + " still needed to fully back the reward.";
          fundModal.querySelector("[data-bf-modal-err]").textContent = "";
          fundModal.querySelector('input[name="amount"]').value = 50;
          fundModal.hidden = false;
          fundModal.querySelector('input[name="amount"]').focus();
        });
      }
      var eye = document.createElement("button");
      eye.type = "button";
      eye.className = "app-btn app-btn--ghost";
      eye.setAttribute("aria-label", "View details for " + b.title);
      eye.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
      eye.addEventListener("click", function () { openDetail(b); });
      btns.appendChild(fund);
      btns.appendChild(eye);
      rail.appendChild(btns);

      c.appendChild(main);
      c.appendChild(rail);
      return c;
    }

    function renderList() {
      var el = document.querySelector("[data-bf-list]");
      var empty = document.querySelector("[data-bf-empty]");
      el.innerHTML = "";
      empty.innerHTML = "";
      var rows = list().filter(function (b) {
        return !view.cat || b.category === view.cat;
      });
      if (view.sort === "ending") {
        rows.sort(function (a, b) { return a.deadline < b.deadline ? -1 : 1; });
      } else if (view.sort === "funded") {
        rows.sort(function (a, b) { return effRaised(b) - effRaised(a); });
      } else {
        rows.sort(function (a, b) { return a.id < b.id ? 1 : -1; });
      }
      empty.hidden = rows.length > 0;
      if (!rows.length) {
        empty.appendChild(app.empty({ head: "No funding requests found", hint: "Try a different category filter." }));
      }
      rows.forEach(function (b) { el.appendChild(card(b)); });
    }

    function renderRequests() {
      var el = document.querySelector("[data-bf-requests]");
      var empty = document.querySelector("[data-bf-requests-empty]");
      el.innerHTML = "";
      empty.innerHTML = "";
      var mine = myRequests();
      empty.hidden = mine.length > 0;
      if (!mine.length) {
        empty.appendChild(app.empty({ head: "No requests yet", hint: "Use “+ Request Funding” to propose a bounty for the community to back." }));
        return;
      }
      mine.forEach(function (r) {
        var row = document.createElement("div");
        row.className = "app-fh-row";
        var lab = document.createElement("span");
        var strong = document.createElement("strong");
        strong.style.color = "var(--app-text)";
        strong.textContent = r.title;
        lab.appendChild(strong);
        lab.append(" · " + r.category + " · reward " + fmt.moneyFull(r.reward));
        var right = document.createElement("span");
        right.appendChild(app.chip("submitted", "SUBMITTED"));
        row.appendChild(lab);
        row.appendChild(right);
        el.appendChild(row);
      });
    }

    function renderContribs() {
      var el = document.querySelector("[data-bf-contribs]");
      var empty = document.querySelector("[data-bf-contribs-empty]");
      el.innerHTML = "";
      empty.innerHTML = "";
      empty.hidden = st.contributions.length > 0;
      if (!st.contributions.length) {
        empty.appendChild(app.empty({ head: "No funding yet", hint: "Fund a bounty from Browse Requests and it shows up here." }));
        return;
      }
      st.contributions.forEach(function (cn) {
        var b = list().filter(function (x) { return x.id === cn.id; })[0];
        var row = document.createElement("div");
        row.className = "app-fh-row";
        var lab = document.createElement("span");
        var strong = document.createElement("strong");
        strong.style.color = "var(--app-text)";
        strong.textContent = b ? b.title : cn.id;
        lab.appendChild(strong);
        lab.append(" · " + fmt.date(cn.date));
        var right = document.createElement("span");
        right.className = "mono";
        right.textContent = fmt.moneyFull(cn.amount) + " ";
        if (b) right.appendChild(app.chip(STATUS_VOCAB[statusOf(b)] || "neutral", statusOf(b)));
        row.appendChild(lab);
        row.appendChild(right);
        el.appendChild(row);
      });
    }

    function renderAll() {
      renderKpis();
      renderList();
      renderRequests();
      renderContribs();
    }

    /* Fund modal */
    fundModal.addEventListener("click", function (e) {
      if (e.target === fundModal || e.target.closest("[data-bf-modal-cancel]")) fundModal.hidden = true;
    });
    document.querySelector("[data-bf-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!fundTarget) return;
      var amount = parseInt(e.target.elements.amount.value, 10);
      if (!amount || amount < 50) {
        fundModal.querySelector("[data-bf-modal-err]").textContent = "Amount must be at least the $50 minimum.";
        return;
      }
      st.contributions.push({ id: fundTarget.id, amount: amount, date: "2026-08-22" });
      save();
      fundModal.hidden = true;
      fundTarget = null;
      renderAll();
    });

    /* Detail modal */
    detailModal.addEventListener("click", function (e) {
      if (e.target === detailModal || e.target.closest("[data-bf-detail-close]")) detailModal.hidden = true;
    });

    /* Request modal */
    var reqModal = document.querySelector("[data-bf-request]");
    function openRequest() {
      reqModal.hidden = false;
      reqModal.querySelector('input[name="title"]').focus();
    }
    var headLink = document.querySelector('.app-pagehead__actions a[href$="#request"]');
    if (headLink) headLink.addEventListener("click", openRequest);
    if (window.location.hash === "#request") openRequest();
    window.addEventListener("hashchange", function () {
      if (window.location.hash === "#request") openRequest();
    });
    reqModal.addEventListener("click", function (e) {
      if (e.target === reqModal || e.target.closest("[data-bf-request-cancel]")) reqModal.hidden = true;
    });
    document.querySelector("[data-bf-request-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      var title = e.target.elements.title.value.trim();
      var reward = parseInt(e.target.elements.reward.value, 10);
      if (!title || !reward) return;
      st.requests.push({ title: title, category: e.target.elements.category.value, reward: reward, difficulty: e.target.elements.difficulty.value });
      save();
      reqModal.hidden = true;
      e.target.reset();
      renderAll();
      window.location.hash = "requests";
    });

    /* Filters */
    var catSel = document.querySelector("[data-bf-category]");
    ["Derivatives", "ESG", "DeFi", "NLP", "Risk"].forEach(function (cName) {
      var o = document.createElement("option");
      o.value = cName;
      o.textContent = cName;
      catSel.appendChild(o);
    });
    catSel.addEventListener("change", function (e) {
      view.cat = e.target.value;
      renderList();
    });
    document.querySelector("[data-bf-sort]").addEventListener("change", function (e) {
      view.sort = e.target.value;
      renderList();
    });

    renderAll();
  });
})(window, document);
