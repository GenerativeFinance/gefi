---
layout: page
title: Blog
eyebrow: Shipping notes
lead: Releases, post-mortems, and field reports from the GeFi team.
permalink: /blog/
---

{% include blog-list.html posts=site.posts %}

{% if site.posts.size == 0 %}
  <p class="muted">First posts land alongside the marketplace launch.</p>
{% endif %}

---

<div style="max-width: 480px;">
  <p class="eyebrow">Subscribe</p>
  <p>Get new posts in your inbox — about once a month.</p>
  {% include newsletter.html %}
  <p class="muted small" style="margin-top: var(--space-3);">
    Or grab the <a href="/feed.xml">RSS feed</a>.
  </p>
</div>
