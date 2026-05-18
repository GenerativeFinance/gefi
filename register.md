---
layout: page
title: "Create your account"
eyebrow: "Get started"
lead: "Tell us a bit about yourself and we'll set up your GeFi workspace. Passkeys, GitHub, and Google sign-in arrive when our auth backend goes live — until then you'll be on the early-access list and we'll email you the moment your workspace is ready."
permalink: /register/
sitemap: false
robots: noindex
---

<noscript>
  <p class="lead">
    JavaScript is required to submit this form. Email
    <a href="mailto:hello@gefi.io">hello@gefi.io</a> and we'll create your
    workspace by hand.
  </p>
</noscript>

<form class="form-grid" data-form="register" novalidate>
  <label>
    Full name
    <input type="text" name="name" autocomplete="name" required />
  </label>
  <label>
    Work email
    <input type="email" name="email" autocomplete="email" required />
  </label>
  <label>
    Company / organisation
    <input type="text" name="company" autocomplete="organization" />
  </label>
  <label>
    Role
    <select name="role">
      <option value="">Choose one…</option>
      <option value="investor">Investor / portfolio manager</option>
      <option value="quant">Quant / researcher</option>
      <option value="developer">Developer / engineer</option>
      <option value="bank">Bank / institutional</option>
      <option value="compliance">Compliance / legal</option>
      <option value="data-provider">Data provider</option>
      <option value="other">Other</option>
    </select>
  </label>
  <label>
    Primary jurisdiction
    <select name="jurisdiction" required>
      <option value="">Choose one…</option>
      <option value="US">United States</option>
      <option value="EU">European Union</option>
      <option value="UK">United Kingdom</option>
      <option value="CH">Switzerland</option>
      <option value="AE">UAE</option>
      <option value="SG">Singapore</option>
      <option value="AU">Australia</option>
      <option value="SA">Saudi Arabia</option>
      <option value="OTHER">Somewhere else</option>
    </select>
  </label>
  <label class="form-grid__checkbox">
    <input type="checkbox" name="terms" value="accepted" required />
    <span>
      I agree to the <a href="/legal/terms/">Terms of Service</a> and
      <a href="/legal/privacy/">Privacy Policy</a>.
    </span>
  </label>
  <button type="submit" class="btn btn-primary">Create account</button>
  <p class="newsletter__status" data-status role="status" aria-live="polite"></p>
</form>

<p class="auth-switch">
  Already have an account? <a href="/login/">Sign in</a>
</p>
