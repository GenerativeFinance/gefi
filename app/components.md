---
layout: app
title: "Component Gallery"
subtitle: "The regression reference for every app-shell component — rendered from GeFi.DEMO."
persona: investor
active_tab: Overview
permalink: /app/components/
sitemap: false
robots: noindex
app_script: /assets/js/app/components.js
---

<h2 class="app-panel__title">KPI stat cards — the one anatomy</h2>
<div class="app-kpis" data-gal-kpis></div>

<h2 class="app-panel__title">Segmented control (hash-synced, arrow-key nav)</h2>
<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Gallery views">
    <button type="button" class="app-segment" data-segment="one">Overview</button>
    <button type="button" class="app-segment" data-segment="two">Returns</button>
    <button type="button" class="app-segment" data-segment="three">Allocation</button>
  </div>
  <div class="app-panel" data-segment-panel="one">Panel one — selected by default.</div>
  <div class="app-panel" data-segment-panel="two" hidden>Panel two.</div>
  <div class="app-panel" data-segment-panel="three" hidden>Panel three.</div>
</div>

<h2 class="app-panel__title" style="margin-top:24px;">Filter bar</h2>
<div class="app-filterbar">
  <input type="search" placeholder="Search AI models..." aria-label="Search">
  <select aria-label="Category"><option>All Categories</option></select>
  <select aria-label="Risk"><option>All Risk Levels</option></select>
  <select aria-label="Sort"><option>Newest</option></select>
</div>

<h2 class="app-panel__title">Chip vocabularies — always labelled</h2>
<div class="app-gridcard" data-gal-chips style="flex-direction: row; flex-wrap: wrap; gap: 8px;"></div>

<h2 class="app-panel__title" style="margin-top:24px;">Row-card</h2>
<div class="app-rowcards" data-gal-rowcard></div>

<h2 class="app-panel__title" style="margin-top:24px;">Grid cards with dual corner chips</h2>
<div class="app-gridcards" data-gal-gridcards></div>

<h2 class="app-panel__title" style="margin-top:24px;">Meters — bad-is-high renders red</h2>
<div class="app-panel" style="display:flex; flex-direction:column; gap:12px;">
  <div class="app-meterrow"><span class="app-rowcard__collabel" style="min-width:130px;">Prediction accuracy</span><div class="app-meter"><div class="app-meter__fill" style="width:95%"></div></div><span class="app-meterrow__val">95.2%</span></div>
  <div class="app-meterrow"><span class="app-rowcard__collabel" style="min-width:130px;">Uptime</span><div class="app-meter app-meter--good"><div class="app-meter__fill" style="width:99.8%"></div></div><span class="app-meterrow__val">99.8%</span></div>
  <div class="app-meterrow"><span class="app-rowcard__collabel" style="min-width:130px;">Error rate</span><div class="app-meter app-meter--bad"><div class="app-meter__fill" style="width:4%"></div></div><span class="app-meterrow__val">0.2%</span></div>
</div>

<h2 class="app-panel__title" style="margin-top:24px;">Quick-action tiles</h2>
<div class="app-tiles">
  <a class="app-tile" href="/app/"><span class="app-tile__title">Create New Model</span><span class="app-tile__desc">Start building a new AI model</span></a>
  <a class="app-tile" href="/app/"><span class="app-tile__title">Upload Dataset</span><span class="app-tile__desc">Contribute governed data</span></a>
  <a class="app-tile" href="/docs/"><span class="app-tile__title">View Documentation</span><span class="app-tile__desc">API docs and tutorials</span></a>
</div>

<h2 class="app-panel__title" style="margin-top:24px;">States — empty, skeleton, error</h2>
<div class="app-gridcards">
  <div data-gal-empty></div>
  <div class="app-panel" style="display:flex; flex-direction:column; gap:10px;">
    <div class="app-skeleton" style="width:60%"></div>
    <div class="app-skeleton" style="width:90%; height:22px;"></div>
    <div class="app-skeleton" style="width:75%"></div>
    <div class="app-skeleton" style="width:85%; height:44px;"></div>
  </div>
  <div data-gal-error></div>
</div>

<script>
/* Gallery hydration — everything below reads GeFi.DEMO. */
document.addEventListener("DOMContentLoaded", function () {
  var D = window.GeFi && window.GeFi.DEMO;
  var app = window.GeFi && window.GeFi.app;
  if (!D || !app) return;
  var fmt = window.GeFi.fmt;

  var kpis = document.querySelector("[data-gal-kpis]");
  [
    { label: "Total Portfolio Value", value: fmt.moneyFull(D.portfolio.value), sub: fmt.signedPct(D.portfolio.ytdPct) + " YTD", tone: "is-up", icon: "brand" },
    { label: "Monthly Return", value: fmt.signedPct(D.portfolio.monthlyPct), sub: "vs " + fmt.signedPct(D.portfolio.monthlyBenchPct) + " benchmark", tone: "is-up", icon: "green" },
    { label: "Sharpe Ratio", value: String(D.risk.sharpe), sub: "vs " + D.risk.sharpeBench + " benchmark", tone: "is-up", icon: "purple" },
    { label: "Max Drawdown", value: fmt.signedPct(D.risk.maxDrawdown), sub: "Better than " + fmt.signedPct(D.risk.maxDrawdownBench), tone: "is-warn", icon: "amber" }
  ].forEach(function (k) {
    var card = document.createElement("div");
    card.className = "app-kpi";
    card.innerHTML =
      '<p class="app-kpi__label"></p><p class="app-kpi__value mono"></p><p class="app-kpi__sub ' + k.tone + '"></p>' +
      '<span class="app-kpi__icon app-kpi__icon--' + k.icon + '" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg></span>';
    card.querySelector(".app-kpi__label").textContent = k.label;
    card.querySelector(".app-kpi__value").textContent = k.value;
    card.querySelector(".app-kpi__sub").textContent = k.sub;
    kpis.appendChild(card);
  });

  var chips = document.querySelector("[data-gal-chips]");
  ["active", "paused", "pending", "filled", "cancelled", "draft", "critical", "high", "medium", "low",
   "EXPERT", "ADVANCED", "INTERMEDIATE", "BEGINNER", "Testing", "Approved", "Deployed", "Coming Soon", "Compliant", "Violation"]
    .forEach(function (v) { chips.appendChild(app.chip(v)); });

  var row = document.querySelector("[data-gal-rowcard]");
  var m = D.aiModels.rows[0];
  var rc = document.createElement("div");
  rc.className = "app-rowcard";
  rc.innerHTML =
    '<div class="app-rowcard__main">' +
      '<div class="app-rowcard__head"><p class="app-rowcard__title"></p><span class="app-rowcard__sub"></span><span data-chip></span><span class="app-rowcard__meta"></span></div>' +
      '<div class="app-meterrow"><span class="app-rowcard__collabel" style="min-width:130px;">Portfolio Allocation</span><div class="app-meter"><div class="app-meter__fill"></div></div><span class="app-meterrow__val"></span></div>' +
      '<div class="app-rowcard__cols">' +
        '<div class="app-rowcard__col"><span class="app-rowcard__collabel">Performance</span><span class="app-rowcard__colval is-up" data-perf></span></div>' +
        '<div class="app-rowcard__col"><span class="app-rowcard__collabel">Total Trades</span><span class="app-rowcard__colval" data-trades></span></div>' +
        '<div class="app-rowcard__col"><span class="app-rowcard__collabel">Accuracy</span><span class="app-rowcard__colval" data-acc></span></div>' +
        '<div class="app-rowcard__col"><span class="app-rowcard__collabel">P&L</span><span class="app-rowcard__colval is-up" data-pnl></span></div>' +
      '</div>' +
    '</div>' +
    '<div class="app-rowcard__rail"><span class="app-rowcard__fee" data-fee></span>' +
      '<button type="button" class="app-btn app-btn--ghost">Pause</button>' +
      '<button type="button" class="app-btn app-btn--ghost">Configure</button>' +
      '<button type="button" class="app-btn app-btn--ghost">Analytics</button></div>';
  rc.querySelector(".app-rowcard__title").textContent = m.name;
  rc.querySelector(".app-rowcard__sub").textContent = m.sub;
  rc.querySelector("[data-chip]").replaceWith(app.chip(m.status));
  rc.querySelector(".app-rowcard__meta").textContent = "Updated " + m.updated;
  rc.querySelector(".app-meter__fill").style.width = m.allocationPct + "%";
  rc.querySelector(".app-meterrow__val").textContent = m.allocationPct + "%";
  rc.querySelector("[data-perf]").textContent = fmt.signedPct(m.performancePct);
  rc.querySelector("[data-trades]").textContent = m.trades;
  rc.querySelector("[data-acc]").textContent = m.accuracy + "%";
  rc.querySelector("[data-pnl]").textContent = "+" + fmt.moneyFull(m.pnl);
  rc.querySelector("[data-fee]").textContent = "$" + m.fee + "/mo";
  row.appendChild(rc);

  var grid = document.querySelector("[data-gal-gridcards]");
  D.bounties.slice(0, 2).forEach(function (b) {
    var c = document.createElement("div");
    c.className = "app-gridcard";
    var chipRow = document.createElement("div");
    chipRow.className = "app-gridcard__chips";
    chipRow.appendChild(app.chip(b.status));
    chipRow.appendChild(app.chip(b.difficulty));
    var title = document.createElement("p");
    title.className = "app-gridcard__title";
    title.textContent = b.title;
    var desc = document.createElement("p");
    desc.className = "app-gridcard__desc";
    desc.textContent = b.category + " · " + b.submissions + (b.submissions === 1 ? " submission" : " submissions") + " · due " + fmt.date(b.deadline);
    var stats = document.createElement("div");
    stats.className = "app-gridcard__stats";
    [["Reward", fmt.moneyFull(b.reward)], ["Deadline", fmt.date(b.deadline)], ["Category", b.category]].forEach(function (s) {
      var st = document.createElement("div");
      st.className = "app-gridcard__stat";
      st.innerHTML = '<span class="app-gridcard__statlabel"></span><span class="app-gridcard__statval"></span>';
      st.querySelector(".app-gridcard__statlabel").textContent = s[0];
      st.querySelector(".app-gridcard__statval").textContent = s[1];
      stats.appendChild(st);
    });
    var tags = document.createElement("div");
    tags.className = "app-gridcard__tags";
    b.skills.forEach(function (s) { tags.appendChild(app.chip("outline", s)); });
    var footer = document.createElement("div");
    footer.className = "app-gridcard__footer";
    footer.innerHTML = '<button type="button" class="app-btn app-btn--ghost">View Details</button><button type="button" class="app-btn app-btn--primary">Claim</button>';
    c.appendChild(chipRow); c.appendChild(title); c.appendChild(desc); c.appendChild(stats); c.appendChild(tags); c.appendChild(footer);
    grid.appendChild(c);
  });

  document.querySelector("[data-gal-empty]").appendChild(app.empty({
    head: "No funding requests found",
    hint: "Try adjusting your search filters",
    cta: { label: "Clear filters" }
  }));
  document.querySelector("[data-gal-error]").appendChild(app.error({
    head: "Regulator Not Found",
    hint: "The regulator profile you're looking for doesn't exist.",
    cta: { label: "Go Back", href: "/app/" }
  }));
});
</script>
