---
layout: app
title: "Developer Overview"
heading: "Developer Overview"
subtitle: "Build, test, and deploy AI financial models with comprehensive workflow management"
persona: developer
active_tab: Overview
permalink: /app/dev/
sitemap: false
robots: noindex
primary_action: { label: "Create Model", url: "/app/dev-models/#new" }
secondary_action: { label: "Export Data", url: "/app/dev/" }
app_scripts:
  - /assets/js/app/devops-math.js
  - /assets/js/app/dev-console.js
---

<div class="app-kpis" data-dc-kpis></div>

{% include app-devtabs.html active="Overview" %}

<div class="app-ov-charts">
  <section class="app-panel">
    <h2 class="app-panel__title">Recent Activity</h2>
    <p class="app-kpi__sub">Latest updates across your development projects</p>
    <ul class="app-activity" data-dc-activity role="list"></ul>
  </section>
  <section class="app-panel">
    <h2 class="app-panel__title">Quick actions</h2>
    <div class="app-tiles" style="grid-template-columns: 1fr;">
      <a class="app-tile" href="/app/dev-models/#new"><span class="app-tile__title">Create New Model</span><span class="app-tile__desc">Start building a new AI model</span></a>
      <a class="app-tile" href="/app/data-provider/"><span class="app-tile__title">Upload Dataset</span><span class="app-tile__desc">Contribute governed data to the feature store</span></a>
      <a class="app-tile" href="/docs/"><span class="app-tile__title">View Documentation</span><span class="app-tile__desc">API docs and tutorials</span></a>
      <a class="app-tile" href="/app/zkml/"><span class="app-tile__title">zKML Verification</span><span class="app-tile__desc">Prove model execution without exposing data or weights</span></a>
    </div>
  </section>
</div>
