---
layout: page
title: Research
eyebrow: Notes from the platform team
lead: Working notes on federated learning for finance, model evaluation, audit infrastructure, and the regulatory landscape.
permalink: /research/
---

<div class="card-grid" style="margin-top: var(--space-6);">
  {% assign research = site.research | sort: "date" | reverse %}
  {% for r in research %}
    {% include research-card.html research=r %}
  {% endfor %}
</div>

{% if site.research.size == 0 %}
  <p class="muted">First research notes go live alongside the marketplace launch.</p>
{% endif %}

---

## Want to contribute?

We publish replicable, citation-clean research and pay an honorarium for
accepted external pieces. [Pitch a topic &rarr;](/contact/?topic=research)
