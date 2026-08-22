/* Funding Hub dashboard (task 223). Every figure aggregates
 * DEMO.fundingProjects + DEMO.bounties — the same lists the Bot/Model/
 * Bounty funding tabs render, so the hub can never contradict them
 * (the reference showed $0 total next to "+12%"; §5 improvement 6). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var FU = GeFi.funding;
    var projects = D.fundingProjects;
    var bounties = D.bounties;
    /* Every figure comes from the shared engine over the SAME rows the tabs
     * render, so the hub cannot report a total the tabs do not add up to.
     * Before this the hub read the raw stored `raised` and ignored the
     * session's own contributions, so backing a campaign made the two
     * disagree immediately. */
    var hub = FU.hubTotals(projects, bounties);

    /* KPI strip — the ONE standard card anatomy */
    var kpiEl = document.querySelector("[data-fh-kpis]");
    [
      { key: "total", label: "Total Funding", value: fmt.moneyFull(hub.total), sub: "campaigns + bounty backing", tone: "is-up" },
      { key: "active", label: "Active Campaigns", value: String(hub.activeProjects), sub: hub.activeModels + " models · " + hub.activeBots + " bots", tone: "" },
      { key: "progress", label: "Avg Goal Progress", value: hub.avgProgress + "%", sub: "across " + hub.campaigns + " campaigns", tone: "" },
      { key: "backers", label: "Contributors", value: hub.backers.toLocaleString("en-US"), sub: "campaign + bounty backers", tone: "" }
    ].forEach(function (k) {
      var card = document.createElement("div");
      card.className = "app-kpi";
      var l = document.createElement("p");
      l.className = "app-kpi__label";
      l.textContent = k.label;
      var v = document.createElement("p");
      v.className = "app-kpi__value";
      v.setAttribute("data-fh-kpi", k.key);
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
      { title: "Bot Funding", total: hub.botRaised, active: hub.activeBots, unit: "campaigns", cta: "View Bot Funding", href: "/app/bot-funding/" },
      { title: "AI Model Funding", total: hub.modelRaised, active: hub.activeModels, unit: "campaigns", cta: "View Model Funding", href: "/app/model-funding/" },
      { title: "Bounty Funding", total: hub.bountyRaised, active: hub.activeBounties, unit: "bounties", cta: "View Bounty Funding", href: "/app/bounty-funding/" }
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
    var funded = projects.filter(function (p) { return FU.statusOf(p) === "funded"; });
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
