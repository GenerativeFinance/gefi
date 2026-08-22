---
layout: app-solo
title: "Sign In"
heading: "Sign in to GeFi"
subtitle: "Access your portfolio, models and workspace."
permalink: /app/signin/
sitemap: false
robots: noindex
bare_topbar: true
app_script: /assets/js/app/auth.js
---

<div class="app-auth-wrap">
  <div class="app-auth-card" data-auth-mode="signin">
    <p class="app-auth-demo">
      <strong>Demo accounts (mock only):</strong>
      investor@demo.gefi &middot; developer@demo.gefi &middot; provider@demo.gefi &middot;
      regulator@demo.gefi &middot; admin@demo.gefi — password <span class="mono">demo1234</span>.
      Any other email/password also works and signs in as a new investor account.
      No mock running? Sign-in still works, offline, as the sample investor account.
    </p>

    <form class="app-form" data-auth-form="password" novalidate>
      <label>Email
        <input type="email" name="email" autocomplete="username" required placeholder="you@company.com">
      </label>
      <label>Password
        <span class="app-auth-pwrow">
          <input type="password" name="password" autocomplete="current-password" required data-auth-pw>
          <button type="button" class="app-auth-pwtoggle" data-auth-pwtoggle aria-label="Show password">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </span>
      </label>
      <p class="app-kpi__sub is-down" data-auth-error role="alert"></p>
      <button type="submit" class="app-btn app-btn--primary app-btn--block" data-auth-submit>Sign In</button>
    </form>

    <div class="app-auth-divider"><span>or continue with</span></div>
    <div class="app-auth-sso">
      <button type="button" class="app-btn app-btn--ghost app-btn--block" data-auth-sso="google">Continue with Google</button>
      <button type="button" class="app-btn app-btn--ghost app-btn--block" data-auth-sso="github">Continue with GitHub</button>
    </div>

    <p class="app-auth-switch">New to GeFi? <a href="/app/signup/">Create an account</a></p>
  </div>

  <div class="app-auth-card" data-auth-mfa hidden>
    <h2 class="app-panel__title">Two-factor verification</h2>
    <p class="app-kpi__sub">Enter the 6-digit code from your authenticator app.
      <strong style="color:var(--app-text);">Demo code: 000000.</strong></p>
    <form class="app-form" data-auth-mfa-form>
      <label>Verification code
        <input type="text" name="code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" autocomplete="one-time-code" required>
      </label>
      <p class="app-kpi__sub is-down" data-auth-mfa-error role="alert"></p>
      <button type="submit" class="app-btn app-btn--primary app-btn--block" data-auth-mfa-submit>Verify &amp; Continue</button>
    </form>
  </div>
</div>
