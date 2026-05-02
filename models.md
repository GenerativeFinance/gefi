---
layout: page
title: Model catalogue
eyebrow: Marketplace
lead: Production-ready AI models for investing, risk, fraud, compliance, and trade finance. Filter, subscribe, and ship.
permalink: /models/
---

<div class="card-grid" style="margin-top: var(--space-6);">
  {% assign models = site.models | sort: "title" %}
  {% for m in models %}
    {% include model-card.html model=m %}
  {% endfor %}
</div>

{% if site.models.size == 0 %}
  <p class="muted">The full catalogue is coming online with the marketplace launch. In the meantime, peek at the <a href="/research/">research notes</a> for what we're building.</p>
{% endif %}

---

## Don't see what you need?

Models are added monthly. If you have a use case that isn't covered, two options:

1. **Request a model.** [Tell us what you need](/contact/?topic=model-request) — if there's demand we'll commission it.
2. **Build and list yours.** GeFi pays developers a 70% revenue share on subscriptions and a per-call rate on metered inference. [Apply to the developer programme](/contact/?topic=developer).
