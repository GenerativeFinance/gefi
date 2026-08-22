---
layout: app
title: "AI Model Marketplace"
heading: "AI Model Marketplace"
subtitle: "Discover and subscribe to AI-powered financial models tailored to your needs"
persona: marketplace
active_tab: AI Marketplace
permalink: /app/marketplace/
sitemap: false
robots: noindex
app_scripts: [/assets/js/app/catalog.js, /assets/js/app/marketplace.js]
---

<div class="app-filterbar">
  <input type="search" placeholder="Search AI models..." aria-label="Search models" data-mk-search>
  <select aria-label="Category" data-mk-category><option value="">All Categories</option></select>
  <select aria-label="Risk" data-mk-risk>
    <option value="">All Risk Levels</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
  <button type="button" class="app-btn app-btn--ghost" data-mk-prefs-open>Preferences</button>
</div>

<div data-segment-scope>
  <div class="app-segments" data-app-segments aria-label="Marketplace views">
    <button type="button" class="app-segment" data-segment="for-you">For You</button>
    <button type="button" class="app-segment" data-segment="trending">Trending</button>
    <button type="button" class="app-segment" data-segment="browse">Browse All</button>
  </div>

  <div data-segment-panel="for-you">
    <h2 class="app-panel__title">Personalized Recommendations</h2>
    <div data-mk-foryou-empty hidden></div>
    <div class="app-gridcards" data-mk-foryou></div>
  </div>

  <div data-segment-panel="trending" hidden>
    <h2 class="app-panel__title">Trending this week</h2>
    <div class="app-gridcards" data-mk-trending></div>
  </div>

  <div data-segment-panel="browse" hidden>
    <h2 class="app-panel__title">All models <span class="app-kpi__sub" data-mk-count></span></h2>
    <div class="app-gridcards" data-mk-browse></div>
    <div data-mk-browse-empty hidden></div>
    <div class="app-oh-pager">
      <span class="app-kpi__sub" data-mk-page></span>
      <span class="app-oh-pager__btns">
        <button type="button" class="app-btn app-btn--ghost" data-mk-prev>&larr; Prev</button>
        <button type="button" class="app-btn app-btn--ghost" data-mk-next>Next &rarr;</button>
      </span>
    </div>
  </div>
</div>

<div class="app-modal" data-mk-prefs hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="mk-prefs-title">
    <h2 id="mk-prefs-title" class="app-panel__title">Your preferences</h2>
    <p class="app-kpi__sub">Pick the wings you care about and a risk ceiling — For You builds from these.</p>
    <div class="app-mk-prefcats" data-mk-prefcats></div>
    <div class="app-setting" style="cursor:default; border:0;">
      <span><strong>Risk tolerance</strong><small>Highest risk band to recommend</small></span>
      <span class="app-segments" style="margin:0; padding:3px;" data-mk-prefrisk role="group" aria-label="Risk tolerance">
        <button type="button" class="app-segment" data-prefrisk="low">Low</button>
        <button type="button" class="app-segment app-segment--active" data-prefrisk="medium">Medium</button>
        <button type="button" class="app-segment" data-prefrisk="high">High</button>
      </span>
    </div>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-mk-prefs-cancel>Cancel</button>
      <button type="button" class="app-btn app-btn--primary" data-mk-prefs-save>Save preferences</button>
    </div>
  </div>
</div>
