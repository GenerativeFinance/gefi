---
layout: app
title: "Funding Hub"
heading: "Funding Hub"
subtitle: "Support and fund AI financial innovations"
persona: funding
active_tab: Funding Hub
permalink: /app/funding/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/funding-math.js
  - /assets/js/app/collab-math.js
  - /assets/js/app/funding.js
---

<div class="app-kpis" data-fh-kpis></div>

<nav class="app-segments" aria-label="Funding sections" data-fh-seglinks>
  <a class="app-segment app-segment--active" href="/app/funding/" aria-current="page">Dashboard</a>
  <a class="app-segment" href="/app/bot-funding/">Bot Funding</a>
  <a class="app-segment" href="/app/model-funding/">AI Model Funding</a>
  <a class="app-segment" href="/app/bounty-funding/">Bounty Funding</a>
</nav>

<div class="app-gridcards app-gridcards--three" data-fh-cards></div>

<section class="app-panel" style="margin-top:18px;">
  <h2 class="app-panel__title">Recently Funded</h2>
  <div data-fh-funded></div>
  <p class="app-kpi__sub" data-fh-funded-note role="status"></p>
</section>
