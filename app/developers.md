---
layout: app
title: "Developers"
heading: "Developers"
subtitle: "Discover talented AI model developers and their work"
persona: marketplace
active_tab: Developers
permalink: /app/developers/
sitemap: false
robots: noindex
primary_action: { label: "Become a Developer", url: "/app/dev/" }
app_script: /assets/js/app/developers.js
---

<div class="app-kpis" data-dv-kpis></div>

<div class="app-filterbar">
  <input type="search" placeholder="Search developers by name, username, or specialization..." aria-label="Search developers" data-dv-search>
  <select aria-label="Sort" data-dv-sort>
    <option value="rating">Sort: Rating</option>
    <option value="models">Sort: Models</option>
    <option value="revenue">Sort: Revenue</option>
  </select>
</div>

<div class="app-gridcards" data-dv-grid></div>
<div data-dv-empty hidden></div>

<div class="app-modal" data-dv-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="dv-modal-title">
    <h2 id="dv-modal-title" class="app-panel__title" data-dv-modal-name></h2>
    <div data-dv-modal-body></div>
    <div class="app-modal__actions">
      <button type="button" class="app-btn app-btn--ghost" data-dv-modal-close>Close</button>
    </div>
  </div>
</div>
