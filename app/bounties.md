---
layout: app
title: "Bounty Board"
heading: "Bounty Board"
subtitle: "Discover and claim bounties to build cutting-edge AI financial models. Earn rewards while contributing to the future of finance."
persona: developer
active_tab: Bounties
permalink: /app/bounties/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/collab-math.js
  - /assets/js/app/collab.js
---

<div data-bn-root>

<div class="app-kpis" data-bn-kpis></div>

<div class="app-filterbar">
  <input type="search" placeholder="Search bounties..." aria-label="Search bounties" data-bn-search>
  <select aria-label="Status" data-bn-status>
    <option value="">All Status</option>
    <option value="OPEN">Open</option>
    <option value="CLAIMED">Claimed</option>
    <option value="IN PROGRESS">In Progress</option>
    <option value="COMPLETED">Completed</option>
  </select>
  <select aria-label="Level" data-bn-level>
    <option value="">All Levels</option>
    <option value="BEGINNER">Beginner</option>
    <option value="INTERMEDIATE">Intermediate</option>
    <option value="ADVANCED">Advanced</option>
    <option value="EXPERT">Expert</option>
  </select>
</div>

<div class="app-gridcards" data-bn-grid></div>
<div data-bn-empty hidden></div>

</div>
