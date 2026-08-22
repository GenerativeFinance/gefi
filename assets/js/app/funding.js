/* Funding Hub dashboard (task 223). Every figure aggregates
 * DEMO.fundingProjects + DEMO.bounties — the same lists the Bot/Model/
 * Bounty funding tabs render, so the hub can never contradict them
 * (the reference showed $0 total next to "+12%"; §5 improvement 6). */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var projects = D.fundingProjects;
    var bounties = D.bounties;
    var bots = projects.filter(function (p) { return p.kind === "bot"; });
    var models = projects.filter(function (p) { return p.kind === "model"; });

    function raised(list) {
      return list.reduce(function (n, p) { return n + p.raised; }, 0);
    }
    var bountyTotal = bounties.reduce(function (n, b) { return n + b.reward; }, 0);
    var totalFunding = raised(projects) + bountyTotal;
    var activeProjects = projects.filter(function (p) { return p.daysLeft > 0; });
    var backers = projects.reduce(function (n, p) { return n + p.backers; }, 0);
    var submitters = bounties.reduce(function (n, b) { return n + b.submissions; }, 0);
    var avgProgress = Math.round(
      projects.reduce(function (n, p) { return n + (p.raised / p.goal) * 100; }, 0) / projects.length
    );

    /* KPI strip — the ONE standard card anatomy */
    var kpiEl = document.querySelector("[data-fh-kpis]");
    [
      { label: "Total Funding", value: fmt.moneyFull(totalFunding), sub: "campaigns + bounty rewards", tone: "is-up" },
      { label: "Active Campaigns", value: String(activeProjects.length), sub: models.filter(function (p) { return p.daysLeft > 0; }).length + " models · " + bots.filter(function (p) { return p.daysLeft > 0; }).length + " bots", tone: "" },
      { label: "Avg Goal Progress", value: avgProgress + "%", sub: "across " + projects.length + " campaigns", tone: "" },
      { label: "Contributors", value: (backers + submitters).toLocaleString("en-US"), sub: "backers + bounty submitters", tone: "" }
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

    /* Summary cards — one per sibling tab, same aggregates */
    var cardsEl = document.querySelector("[data-fh-cards]");
    [
      { title: "Bot Funding", total: raised(bots), active: bots.filter(function (p) { return p.daysLeft > 0; }).length, unit: "campaigns", cta: "View Bot Funding", href: "/app/bot-funding/" },
      { title: "AI Model Funding", total: raised(models), active: models.filter(function (p) { return p.daysLeft > 0; }).length, unit: "campaigns", cta: "View Model Funding", href: "/app/model-funding/" },
      { title: "Bounty Funding", total: bountyTotal, active: bounties.filter(function (b) { return b.status !== "COMPLETED"; }).length, unit: "bounties", cta: "View Bounty Funding", href: "/app/bounty-funding/" }
    ].forEach(function (c) {
      var card = document.createElement("div");
      card.className = "app-gridcard";
      var title = document.createElement("p");
      title.className = "app-gridcard__title";
      title.textContent = c.title;
      card.appendChild(title);
      [["Total Raised", fmt.moneyFull(c.total), "data-fh-card-total"], ["Active", c.active + " " + c.unit, null]].forEach(function (row) {
        var r = document.createElement("div");
        r.className = "app-fh-row";
        var lab = document.createElement("span");
        lab.className = "app-rowcard__collabel";
        lab.textContent = row[0];
        var val = document.createElement("span");
        val.className = "mono";
        val.textContent = row[1];
        if (row[2]) val.setAttribute(row[2], "");
        r.appendChild(lab);
        r.appendChild(val);
        card.appendChild(r);
      });
      var a = document.createElement("a");
      a.className = "app-btn app-btn--primary app-btn--block";
      a.href = c.href;
      a.textContent = c.cta;
      card.appendChild(a);
      cardsEl.appendChild(card);
    });

    /* Recently Funded — only campaigns that actually hit 100% (the
     * reference padded this to three; the canonical dataset has what
     * it has, and the note says so). */
    var funded = projects.filter(function (p) { return p.raised >= p.goal; });
    var feedEl = document.querySelector("[data-fh-funded]");
    funded.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "app-rowcard";
      var main = document.createElement("div");
      main.className = "app-rowcard__main";
      var head = document.createElement("div");
      head.className = "app-rowcard__head";
      var title = document.createElement("p");
      title.className = "app-rowcard__title";
      title.textContent = p.name;
      var sub = document.createElement("span");
      sub.className = "app-rowcard__sub";
      sub.textContent = p.category + " · by " + p.by + " · " + p.backers + " backers";
      head.appendChild(title);
      head.appendChild(sub);
      head.appendChild(app.chip("ok", "Funded"));
      main.appendChild(head);
      var meter = document.createElement("div");
      meter.className = "app-meterrow";
      var track = document.createElement("div");
      track.className = "app-meter app-meter--good";
      var fill = document.createElement("div");
      fill.className = "app-meter__fill";
      fill.style.width = "100%";
      track.appendChild(fill);
      var val = document.createElement("span");
      val.className = "app-meterrow__val mono";
      val.textContent = fmt.moneyFull(p.raised) + " of " + fmt.moneyFull(p.goal) + " · 100%";
      meter.appendChild(track);
      meter.appendChild(val);
      main.appendChild(meter);
      card.appendChild(main);
      feedEl.appendChild(card);
    });
    document.querySelector("[data-fh-funded-note]").textContent =
      funded.length + " campaign" + (funded.length === 1 ? "" : "s") + " fully funded so far — sample data. Campaigns still raising live on the Bot and Model Funding tabs.";
  });
})(window, document);
