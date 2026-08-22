---
layout: app
title: "Learning Center"
heading: "Learning Center"
subtitle: "Master AI financial modeling through comprehensive tutorials, workshops, and hands-on projects. Build expertise and earn certifications."
persona: learning
active_tab: Learning
permalink: /app/learning/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/learning-math.js
  - /assets/js/app/learning.js
---

<div data-ln-root>

<div class="app-kpis" data-ln-kpis></div>

<div data-segment-scope>
  <div class="app-segments" data-ln-segments role="group" aria-label="Content filter">
    <button type="button" class="app-segment app-segment--active" data-ln-seg="">All Content</button>
    <button type="button" class="app-segment" data-ln-seg="progress">In Progress</button>
    <button type="button" class="app-segment" data-ln-seg="completed">Completed</button>
    <button type="button" class="app-segment" data-ln-seg="recommended">Recommended</button>
  </div>
</div>

<div class="app-filterbar">
  <input type="search" placeholder="Search tutorials, webinars, docs..." aria-label="Search learning content" data-ln-search>
  <select aria-label="Type" data-ln-type>
    <option value="">All Types</option>
    <option>GET-STARTED</option><option>TUTORIAL</option><option>WEBINAR</option><option>BLOG</option><option>FAQ</option>
  </select>
  <select aria-label="Level" data-ln-level>
    <option value="">All Levels</option>
    <option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option>
  </select>
</div>

<div class="app-gridcards" data-ln-grid></div>
<div data-ln-empty hidden></div>

<h2 class="app-panel__title" style="margin-top:28px;">Featured Learning Paths</h2>
<div class="app-gridcards" data-ln-paths></div>

</div>
