---
layout: app
title: "Communications"
heading: "Communications"
subtitle: "Supervisory correspondence with regulated organizations"
persona: regulator
active_tab: Communications
permalink: /app/reg-communications/
sitemap: false
robots: noindex
primary_action: { label: "Send Communication", url: "/app/reg-communications/#compose" }
app_script: /assets/js/app/reg-pages.js
---

<div class="app-comm" data-rc-root>
  <aside class="app-comm__list" aria-label="Threads" data-rc-threads></aside>
  <section class="app-comm__view">
    <div class="app-comm__head">
      <h2 class="app-panel__title" style="margin:0;" data-rc-title>Select a thread</h2>
      <p class="app-kpi__sub" style="margin:0;" data-rc-subtitle></p>
    </div>
    <div class="app-comm__messages" data-rc-messages></div>
    <form class="app-comm__composer" data-rc-composer>
      <input type="text" name="message" placeholder="Write a message..." aria-label="Message" autocomplete="off">
      <button type="submit" class="app-btn app-btn--primary">Send</button>
    </form>
    <p class="app-kpi__sub" data-rc-status role="status" aria-live="polite"></p>
  </section>
</div>
