---
layout: app
title: "Developer Overview"
heading: "Developer Overview"
subtitle: "Build, test, and deploy AI financial models with comprehensive workflow management"
persona: developer
active_tab: Overview
permalink: /app/dev-collab/
sitemap: false
robots: noindex
app_scripts:
  - /assets/js/app/collab-math.js
  - /assets/js/app/collab.js
---

{% include app-devtabs.html active="Collaboration" %}

<div data-cl-root>

<div class="app-ov-charts">
  <section class="app-panel">
    <h2 class="app-panel__title">Team Members</h2>
    <p class="app-kpi__sub">Manage collaborators across your projects</p>
    <ul class="app-holdings" data-cl-team role="list"></ul>
    <button type="button" class="app-btn app-btn--ghost app-btn--block" data-cl-invite>+ Invite Collaborator</button>
  </section>
  <section class="app-panel">
    <h2 class="app-panel__title">Team Communication</h2>
    <p class="app-kpi__sub">Recent discussions and updates</p>
    <ul class="app-activity" data-cl-messages role="list"></ul>
    <form class="app-form" data-cl-compose style="margin-top:10px;">
      <label>New discussion
        <input type="text" name="text" maxlength="200" placeholder="Share an update with the team…" required>
      </label>
      <button type="submit" class="app-btn app-btn--ghost app-btn--block">Start Discussion</button>
    </form>
  </section>
</div>

<div class="app-modal" data-cl-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="cl-modal-title">
    <h2 id="cl-modal-title" class="app-panel__title">Invite collaborator</h2>
    <form class="app-form" data-cl-invite-form>
      <label>Name
        <input type="text" name="name" required maxlength="60">
      </label>
      <label>Role
        <select name="role">
          <option>ML Engineer</option><option>Quant Researcher</option><option>Data Engineer</option><option>Compliance Reviewer</option>
        </select>
      </label>
      <label>Email <span class="app-kpi__sub" style="font-weight:400;">(optional — nothing is sent)</span>
        <input type="email" name="email" maxlength="120" placeholder="name@example.com">
      </label>
      <p class="app-kpi__sub" data-cl-invite-error role="alert" style="color:var(--app-red);"></p>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-cl-modal-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary">Send invite</button>
      </div>
    </form>
  </div>
</div>

</div>
