---
layout: app
title: "zKML Verification"
heading: "zKML Verification"
subtitle: "Zero-knowledge model verification — prove model execution without exposing data or weights"
persona: developer
active_tab: Overview
permalink: /app/zkml/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/zkml-math.js
  - /assets/js/app/zkml.js
---

<div data-zk-root>

<div class="app-gridcards" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
  <div class="app-gridcard">
    <p class="app-gridcard__title">Proof Generation</p>
    <p class="app-gridcard__desc">Local proofs are generated for each shard — sensitive data never leaves the participant's environment.</p>
  </div>
  <div class="app-gridcard">
    <p class="app-gridcard__title">Proof Verification</p>
    <p class="app-gridcard__desc">Proofs are verified using public values only, enabling trustless collaboration between counterparties.</p>
  </div>
  <div class="app-gridcard">
    <p class="app-gridcard__title">Elapsed Time</p>
    <p class="app-gridcard__desc">Wall-clock time is what you wait; task time is the summed prover work across parallel shard lanes.</p>
  </div>
</div>

<section class="app-panel" style="margin-top:18px;">
  <h2 class="app-panel__title">Verify a model</h2>
  <form class="app-form" data-zk-form style="max-width:560px;">
    <label>Model
      <select name="model" data-zk-models></select>
    </label>
    <label>Shard count: <span class="mono" data-zk-shardval>4</span>
      <input type="range" name="shards" min="2" max="8" step="1" value="4" aria-label="Shard count">
    </label>
    <div class="app-modal__actions" style="justify-content:flex-start;">
      <button type="submit" class="app-btn app-btn--primary" data-zk-run>Run verification</button>
    </div>
  </form>
</section>

<div class="app-ov-charts" style="margin-top:18px;">
  <section class="app-panel">
    <h2 class="app-panel__title">Pipeline</h2>
    <div class="app-zk-steps" data-zk-steps></div>
    <div data-zk-lanes></div>
    <div data-zk-pipeline-empty></div>
  </section>
  <section class="app-panel">
    <h2 class="app-panel__title">Prover log</h2>
    <pre class="app-modal__pre mono app-zk-log" data-zk-log aria-live="polite"></pre>
  </section>
</div>

<section class="app-panel" style="margin-top:18px;">
  <h2 class="app-panel__title">Verification summary</h2>
  <div data-zk-summary></div>
  <div data-zk-summary-empty></div>
</section>

<section class="app-panel" style="margin-top:18px;">
  <h2 class="app-panel__title">Federated models on the platform</h2>
  <p class="app-kpi__sub">Models trained federated can also be verified per participant. These catalogue models run federated today:</p>
  <div class="app-gridcard__tags" data-zk-federated></div>
</section>

<section class="app-panel" style="margin-top:16px;">
  <h2 class="app-panel__title">Verification history</h2>
  <p class="app-kpi__sub">Runs recorded by the service. Each hash is a deterministic label for its inputs — not a cryptographic commitment.</p>
  <div data-zk-history></div>
</section>

</div>
