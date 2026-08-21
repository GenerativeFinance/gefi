---
layout: onboarding
title: Onboarding & KYC
permalink: /onboarding/
sitemap: false
---

<section class="onb-step" data-onb-step="1" hidden>
  <h1>What kind of account is this?</h1>
  <p class="muted">This decides the KYC checks that apply and the tiers available to you.</p>
  <div class="onb-choice-grid">
    <button type="button" class="onb-choice" data-onb-choice="individual">
      <strong>Individual</strong>
      <span class="muted">A personal account. ID document + liveness check.</span>
    </button>
    <button type="button" class="onb-choice" data-onb-choice="institutional">
      <strong>Institutional</strong>
      <span class="muted">A company account. KYB: registry extract, UBO declaration, authorised-signer ID.</span>
    </button>
  </div>
</section>

<section class="onb-step" data-onb-step="2" hidden>
  <h1>Where are you based?</h1>
  <p class="muted">Jurisdiction routes your KYC checks and determines which models you can subscribe to.</p>
  <label class="onb-field">
    <span>Jurisdiction</span>
    <select data-onb-jurisdiction>
      <option value="">Choose…</option>
      <option>US</option>
      <option>UK</option>
      <option>EU</option>
      <option>UAE</option>
      <option>SG</option>
    </select>
  </label>

  <h2 class="onb-subhead">What each KYC tier unlocks</h2>
  <table class="onb-tiers">
    <thead>
      <tr><th>Tier</th><th>Checks</th><th>Unlocks</th></tr>
    </thead>
    <tbody>
      <tr><td class="num">0</td><td>Email only</td><td>Docs, catalogue browsing, sandbox keys</td></tr>
      <tr><td class="num">1</td><td>ID + liveness (individual) / registry + signer (institutional)</td><td>Starter and Pro subscriptions, production API keys</td></tr>
      <tr><td class="num">2</td><td>Tier 1 + source-of-funds + UBO verification</td><td>Enterprise tier, federated participation, USDC settlement rails</td></tr>
    </tbody>
  </table>
</section>

<section class="onb-step" data-onb-step="3" hidden>
  <h1>Document capture</h1>
  <p class="muted">In production this is the embedded Sumsub SDK. In this preview it is mocked — nothing is captured or uploaded.</p>
  <div class="onb-sumsub" data-onb-sumsub>
    <p class="onb-sumsub__label">Sumsub WebSDK</p>
    <p class="muted">The capture flow (document photos, liveness) renders here when <code>api.base_url</code> is configured.</p>
    <button type="button" class="btn btn-primary" data-onb-capture>Simulate capture complete</button>
    <p class="onb-sumsub__done" data-onb-capture-done hidden>&#10003; Documents captured (simulated)</p>
  </div>
</section>

<section class="onb-step" data-onb-step="4" hidden>
  <h1>Review &amp; status</h1>
  <dl class="onb-review" data-onb-review></dl>
  <button type="button" class="btn btn-primary" data-onb-submit>Submit for review</button>
  <div class="onb-status" data-onb-status hidden>
    <p class="onb-status__headline" data-onb-status-headline></p>
    <p class="muted" data-onb-status-detail></p>
    <p class="muted small">
      Honest expectations: individual reviews typically clear in <strong>1–2 business
      days</strong>; institutional KYB takes <strong>3–5 business days</strong> and can
      require follow-up on UBO documentation. You will be emailed either way —
      there is no need to re-submit.
    </p>
  </div>
</section>

<div class="onb-nav" data-onb-nav>
  <button type="button" class="btn btn-ghost" data-onb-back hidden>Back</button>
  <button type="button" class="btn btn-primary" data-onb-next hidden>Continue</button>
</div>
