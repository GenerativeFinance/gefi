---
layout: page
title: "Transactional email fixtures"
eyebrow: "Design system"
lead: "Every transactional email GeFi sends, rendered from one shared 600px base — receipts, dunning, KYC status, alert digests, and federation notices, each with a plain-text twin."
permalink: /emails/
wide: true
sitemap: false
robots: noindex
---

<div class="email-notes" markdown="1">
The base template is hand-coded for email clients: table layout, inline
styles, a bulletproof button, `color-scheme` meta plus a dark-mode media
query, and a hidden preheader. Variants share the header, footer, and
palette; every HTML variant ships a `.txt` twin for multipart sends. All
figures are sample fixtures, not live data.
</div>

<div class="email-grid">
<figure class="email-fixture">
<figcaption><strong>Receipt</strong> — <a href="/assets/email/receipt.txt">plain-text twin</a></figcaption>
<iframe src="/assets/email/receipt.html" title="Receipt email preview" loading="lazy"></iframe>
</figure>
<figure class="email-fixture">
<figcaption><strong>Dunning</strong> — <a href="/assets/email/dunning.txt">plain-text twin</a></figcaption>
<iframe src="/assets/email/dunning.html" title="Dunning email preview" loading="lazy"></iframe>
</figure>
<figure class="email-fixture">
<figcaption><strong>KYC status</strong> — <a href="/assets/email/kyc-status.txt">plain-text twin</a></figcaption>
<iframe src="/assets/email/kyc-status.html" title="KYC status email preview" loading="lazy"></iframe>
</figure>
<figure class="email-fixture">
<figcaption><strong>Alert digest</strong> — <a href="/assets/email/alert-digest.txt">plain-text twin</a></figcaption>
<iframe src="/assets/email/alert-digest.html" title="Alert digest email preview" loading="lazy"></iframe>
</figure>
<figure class="email-fixture">
<figcaption><strong>Federation notice</strong> — <a href="/assets/email/federation-notice.txt">plain-text twin</a></figcaption>
<iframe src="/assets/email/federation-notice.html" title="Federation notice email preview" loading="lazy"></iframe>
</figure>
</div>
