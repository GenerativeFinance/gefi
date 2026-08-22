/* Bot Funding + AI Model Funding (task 224). One script, two pages —
 * the [data-pf-root] kind attribute picks the slice of
 * DEMO.fundingProjects. KPIs always recompute from the rendered list,
 * so they can never contradict the cards. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var root = document.querySelector("[data-pf-root]");
    if (!root) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;
    var FU = GeFi.funding;
    var kind = root.getAttribute("data-pf-kind");
    var noun = kind === "bot" ? "bot" : "model";

    var KEY = "gefi-app-funding";
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
    var filters = { q: "", cat: "", risk: "" };

    var CATS = kind === "bot"
      ? ["Grid Trading", "Arbitrage", "DeFi", "Trend Following", "Market Making"]
      : ["Pricing", "NLP", "Fraud", "Risk", "Forecasting"];

    function myRequests() {
      return st.requests.filter(function (r) { return r.kind === kind; }).map(function (r) {
        return {
          name: r.name, category: r.category, risk: r.risk, status: "submitted",
          goal: r.goal, raised: 0, backers: 0, roiPct: null, daysLeft: 45, min: 100,
          features: [], by: "you", mine: true
        };
      });
    }
    function list() {
      return D.fundingProjects.filter(function (p) { return p.kind === kind; }).concat(myRequests());
    }
    /* A contribution is applied to the campaign ROW, exactly as the server
     * applies it, rather than kept as a side list this page adds on top.
     * The old overlay meant the funding hub — which reads the rows — showed
     * a smaller total than this tab the moment anyone contributed.
     * `st.contributions` survives only as the record for "My Contributions". */
    function contribsFor(name) {
      return st.contributions.filter(function (c) { return c.kind === kind && c.project === name; });
    }
    function effRaised(p) {
      return p.raised;
    }
    function isFunded(p) {
      return FU.statusOf(p) === "funded";
    }
    function statusOf(p) {
      if (p.mine) return "submitted";
      return FU.statusOf(p);
    }
    function backersOf(p) {
      return p.backers;
    }

    function renderKpis() {
      var el = document.querySelector("[data-pf-kpis]");
      el.innerHTML = "";
      var rows = list();
      var totalFunded = rows.reduce(function (n, p) { return n + effRaised(p); }, 0);
      var active = rows.filter(function (p) { return !p.mine && !isFunded(p) && p.daysLeft > 0; }).length;
      var contributors = rows.reduce(function (n, p) { return n + backersOf(p); }, 0);
      var base = rows.filter(function (p) { return !p.mine; });
      var fundedCount = base.filter(isFunded).length;
      var avgRoi = base.reduce(function (n, p) { return n + p.roiPct; }, 0) / base.length;
      var kpis = [
        { label: "Total Funded", value: fmt.moneyFull(totalFunded), sub: "across all " + noun + " campaigns", tone: "is-up" },
        { label: kind === "bot" ? "Active Bots" : "Active Models", value: String(active), sub: "campaigns still raising", tone: "" },
        { label: kind === "bot" ? "Contributors" : "Funders", value: backersToStr(contributors), sub: "backing these campaigns", tone: "" },
        kind === "bot"
          ? { label: "Success Rate", value: Math.round((fundedCount / base.length) * 100) + "%", sub: fundedCount + " of " + base.length + " fully funded", tone: "" }
          : { label: "Avg Expected ROI", value: fmt.signedPct(avgRoi), sub: "projected, not guaranteed", tone: "is-up" }
      ];
      kpis.forEach(function (k) {
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
    function backersToStr(n) {
      return n.toLocaleString("en-US");
    }

    var STATUS_VOCAB = { active: ["active", "Active"], funded: ["info", "Funded"], approved: ["approved", "Approved"], submitted: ["submitted", "Submitted"] };

    var modal = document.querySelector("[data-pf-modal]");
    var modalTarget = null;

    function card(p) {
      var funded = isFunded(p);
      var status = statusOf(p);
      var raised = effRaised(p);
      var pct = Math.min(100, Math.round((raised / p.goal) * 100));
      var c = document.createElement("div");
      c.className = "app-gridcard";

      var chips = document.createElement("div");
      chips.className = "app-gridcard__chips";
      var sv = STATUS_VOCAB[status] || ["neutral", status];
      chips.appendChild(app.chip(sv[0], sv[1]));
      chips.appendChild(app.chip(p.risk.toLowerCase(), p.risk + " risk"));
      chips.appendChild(app.chip("outline", p.category));
      c.appendChild(chips);

      var title = document.createElement("p");
      title.className = "app-gridcard__title";
      title.textContent = p.name;
      c.appendChild(title);
      var by = document.createElement("p");
      by.className = "app-gridcard__desc";
      by.append("Created by ");
      if (p.mine) {
        by.append("you");
      } else {
        var a = document.createElement("a");
        a.href = "/app/developers/";
        a.textContent = p.by;
        by.appendChild(a);
      }
      c.appendChild(by);

      var progLabel = document.createElement("p");
      progLabel.className = "app-gridcard__statlabel";
      progLabel.style.margin = "0";
      progLabel.textContent = "Funding Progress";
      c.appendChild(progLabel);
      var meter = document.createElement("div");
      meter.className = "app-meterrow";
      var track = document.createElement("div");
      track.className = "app-meter" + (funded ? " app-meter--good" : "");
      var fill = document.createElement("div");
      fill.className = "app-meter__fill";
      fill.style.width = pct + "%";
      track.appendChild(fill);
      var mval = document.createElement("span");
      mval.className = "app-meterrow__val mono";
      mval.textContent = fmt.moneyFull(raised) + " of " + fmt.moneyFull(p.goal) + " · " + pct + "%";
      meter.appendChild(track);
      meter.appendChild(mval);
      c.appendChild(meter);

      var stats = document.createElement("div");
      stats.className = "app-gridcard__stats";
      stats.style.gridTemplateColumns = "1fr 1fr 1fr";
      [
        ["Contributors", backersToStr(backersOf(p)), ""],
        ["Expected ROI", p.roiPct == null ? "—" : fmt.signedPct(p.roiPct), p.roiPct == null ? "" : "is-up"],
        ["Days Left", funded || p.daysLeft <= 0 ? "Ended" : String(p.daysLeft), ""]
      ].forEach(function (row) {
        var stEl = document.createElement("div");
        stEl.className = "app-gridcard__stat";
        var sl = document.createElement("span");
        sl.className = "app-gridcard__statlabel";
        sl.textContent = row[0];
        var svv = document.createElement("span");
        svv.className = "app-gridcard__statval " + row[2];
        svv.textContent = row[1];
        stEl.appendChild(sl);
        stEl.appendChild(svv);
        stats.appendChild(stEl);
      });
      c.appendChild(stats);

      if (p.features.length) {
        var fLabel = document.createElement("p");
        fLabel.className = "app-gridcard__statlabel";
        fLabel.style.margin = "0";
        fLabel.textContent = "Features:";
        c.appendChild(fLabel);
        var tags = document.createElement("div");
        tags.className = "app-gridcard__tags";
        p.features.forEach(function (f) { tags.appendChild(app.chip("outline", f)); });
        c.appendChild(tags);
      }

      var footer = document.createElement("div");
      footer.className = "app-gridcard__footer";
      if (!funded && !p.mine && p.daysLeft > 0) {
        var minNote = document.createElement("p");
        minNote.className = "app-kpi__sub";
        minNote.style.margin = "0 0 6px";
        minNote.textContent = "Min Contribution " + fmt.moneyFull(p.min);
        footer.appendChild(minNote);
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "app-btn app-btn--primary app-btn--block";
        btn.style.marginTop = "0";
        btn.textContent = "Contribute " + fmt.moneyFull(p.min);
        btn.addEventListener("click", function () {
          modalTarget = p;
          modal.querySelector("[data-pf-modal-name]").textContent = p.name;
          modal.querySelector("[data-pf-modal-min]").textContent =
            "Minimum " + fmt.moneyFull(p.min) + " · " + fmt.moneyFull(p.goal - effRaised(p)) + " still needed to reach the goal.";
          modal.querySelector("[data-pf-modal-err]").textContent = "";
          modal.querySelector('input[name="amount"]').value = p.min;
          modal.hidden = false;
          modal.querySelector('input[name="amount"]').focus();
        });
        footer.appendChild(btn);
      }
      c.appendChild(footer);
      return c;
    }

    function renderGrid() {
      var grid = document.querySelector("[data-pf-grid]");
      var empty = document.querySelector("[data-pf-empty]");
      grid.innerHTML = "";
      empty.innerHTML = "";
      var q = filters.q.toLowerCase();
      var rows = list().filter(function (p) {
        return (!q || p.name.toLowerCase().indexOf(q) !== -1 || p.by.toLowerCase().indexOf(q) !== -1) &&
          (!filters.cat || p.category === filters.cat) &&
          (!filters.risk || p.risk === filters.risk);
      });
      empty.hidden = rows.length > 0;
      if (!rows.length) {
        empty.appendChild(app.empty({ head: "No funding requests found", hint: "Try adjusting your search filters." }));
      }
      rows.forEach(function (p) { grid.appendChild(card(p)); });
    }

    function renderContribs() {
      var el = document.querySelector("[data-pf-contribs]");
      var empty = document.querySelector("[data-pf-contribs-empty]");
      el.innerHTML = "";
      empty.innerHTML = "";
      var mine = st.contributions.filter(function (c) { return c.kind === kind; });
      empty.hidden = mine.length > 0;
      if (!mine.length) {
        empty.appendChild(app.empty({ head: "No contributions yet", hint: "Back a " + noun + " from Browse Requests and it shows up here." }));
        return;
      }
      mine.forEach(function (cn) {
        var p = list().filter(function (x) { return x.name === cn.project; })[0];
        var row = document.createElement("div");
        row.className = "app-fh-row";
        var lab = document.createElement("span");
        var strong = document.createElement("strong");
        strong.style.color = "var(--app-text)";
        strong.textContent = cn.project;
        lab.appendChild(strong);
        lab.append(" · " + fmt.date(cn.date));
        var right = document.createElement("span");
        right.className = "mono";
        right.textContent = fmt.moneyFull(cn.amount) + " ";
        if (p) {
          var sv = STATUS_VOCAB[statusOf(p)] || ["neutral", statusOf(p)];
          right.appendChild(app.chip(sv[0], sv[1]));
        }
        row.appendChild(lab);
        row.appendChild(right);
        el.appendChild(row);
      });
    }

    function renderRequests() {
      var el = document.querySelector("[data-pf-requests]");
      var empty = document.querySelector("[data-pf-requests-empty]");
      el.innerHTML = "";
      empty.innerHTML = "";
      var mine = myRequests();
      empty.hidden = mine.length > 0;
      if (!mine.length) {
        empty.appendChild(app.empty({ head: "No requests yet", hint: "Use “+ Request Funding” to submit a " + noun + " for community funding." }));
        return;
      }
      mine.forEach(function (r) {
        var row = document.createElement("div");
        row.className = "app-fh-row";
        var lab = document.createElement("span");
        var strong = document.createElement("strong");
        strong.style.color = "var(--app-text)";
        strong.textContent = r.name;
        lab.appendChild(strong);
        lab.append(" · " + r.category + " · goal " + fmt.moneyFull(r.goal));
        var right = document.createElement("span");
        right.appendChild(app.chip("submitted", "Submitted"));
        row.appendChild(lab);
        row.appendChild(right);
        el.appendChild(row);
      });
    }

    function renderAll() {
      renderKpis();
      renderGrid();
      renderContribs();
      renderRequests();
    }

    /* Contribute modal */
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-pf-modal-cancel]")) modal.hidden = true;
    });
    document.querySelector("[data-pf-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!modalTarget) return;
      var target = modalTarget;
      var amount = parseInt(e.target.elements.amount.value, 10);
      /* The same rules the service applies: at least the minimum, at most
       * what is still needed. Checking here means the refusal reads the
       * same whether or not the API is reachable. */
      var why = FU.validateContribution(target, amount);
      if (why) {
        modal.querySelector("[data-pf-modal-err]").textContent = why;
        return;
      }
      modal.querySelector("[data-pf-modal-err]").textContent = "";
      GeFi.api.post("/funding/projects/" + encodeURIComponent(target.id || target.name) + "/contributions", { amount: amount }).then(
        function (r) { apply(r && r.project ? r.project : null); },
        function (err) {
          var msg = err && err.body && err.body.message;
          if (msg) {
            modal.querySelector("[data-pf-modal-err]").textContent = msg;
            return;
          }
          apply(null);
        }
      );

      function apply(server) {
        /* Take the server's row when it answered; otherwise apply the same
         * arithmetic locally, so the outcome is identical either way. */
        var next = server || FU.applyContribution(target, amount);
        target.raised = next.raised;
        target.backers = next.backers;
        target.status = next.status;
        if (next.daysLeft != null) target.daysLeft = next.daysLeft;
        st.contributions.push({ kind: kind, project: target.name, amount: amount, date: "2026-08-22" });
        save();
        modal.hidden = true;
        modalTarget = null;
        renderAll();
        var el = document.querySelector("[data-pf-root]");
        if (el) el.setAttribute("data-pf-backed", target.name + ":" + target.raised);
        if (GeFi.app.toast) {
          GeFi.app.toast(
            FU.statusOf(target) === "funded"
              ? target.name + " reached its goal. No payment was taken — this is a sample workspace."
              : "Backed " + target.name + " with " + fmt.moneyFull(amount) + ". No payment was taken."
          );
        }
      }
    });

    /* Request Funding modal — opened by the pagehead "+ Request Funding"
     * link (#request) or a hash deep-link */
    var reqModal = document.querySelector("[data-pf-request]");
    var catSel = reqModal.querySelector("[data-pf-request-cats]");
    CATS.forEach(function (cName) {
      var o = document.createElement("option");
      o.textContent = cName;
      catSel.appendChild(o);
    });
    function openRequest() {
      reqModal.hidden = false;
      reqModal.querySelector('input[name="name"]').focus();
    }
    var headLink = document.querySelector('.app-pagehead__actions a[href$="#request"]');
    if (headLink) headLink.addEventListener("click", openRequest);
    if (window.location.hash === "#request") openRequest();
    window.addEventListener("hashchange", function () {
      if (window.location.hash === "#request") openRequest();
    });
    reqModal.addEventListener("click", function (e) {
      if (e.target === reqModal || e.target.closest("[data-pf-request-cancel]")) reqModal.hidden = true;
    });
    document.querySelector("[data-pf-request-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = e.target.elements.name.value.trim();
      var goal = parseInt(e.target.elements.goal.value, 10);
      if (!name || !goal) return;
      st.requests.push({ kind: kind, name: name, category: e.target.elements.category.value, goal: goal, risk: e.target.elements.risk.value });
      save();
      reqModal.hidden = true;
      e.target.reset();
      renderAll();
      window.location.hash = "requests";
    });

    /* Filters */
    var catFilter = document.querySelector("[data-pf-category]");
    CATS.forEach(function (cName) {
      var o = document.createElement("option");
      o.value = cName;
      o.textContent = cName;
      catFilter.appendChild(o);
    });
    document.querySelector("[data-pf-search]").addEventListener("input", function (e) {
      filters.q = e.target.value;
      renderGrid();
    });
    catFilter.addEventListener("change", function (e) {
      filters.cat = e.target.value;
      renderGrid();
    });
    document.querySelector("[data-pf-risk]").addEventListener("change", function (e) {
      filters.risk = e.target.value;
      renderGrid();
    });

    renderAll();
  });
})(window, document);
