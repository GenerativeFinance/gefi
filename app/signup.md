---
layout: app-solo
title: "Create Account"
heading: "Create your GeFi account"
subtitle: "Pick a workspace, then set your sign-in details."
permalink: /app/signup/
sitemap: false
robots: noindex
bare_topbar: true
app_script: /assets/js/app/auth.js
---

<div class="app-auth-wrap">
  <div class="app-auth-card app-auth-card--wide" data-auth-mode="signup">
    <fieldset class="app-auth-personas" data-auth-personas>
      <legend class="app-rowcard__collabel">I'm joining as an</legend>
      <button type="button" class="app-auth-persona" data-persona="investor" aria-pressed="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>
        <strong>Investor</strong>
        <span>Track a portfolio and subscribe to AI models</span>
      </button>
      <button type="button" class="app-auth-persona" data-persona="developer" aria-pressed="false">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
        <strong>Developer</strong>
        <span>Build, train and deploy financial AI models</span>
      </button>
      <button type="button" class="app-auth-persona" data-persona="data-provider" aria-pressed="false">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2z"/><path d="M4 5v14c0 1.1 3.6 2 8 2s8-.9 8-2V5"/><path d="M4 12c0 1.1 3.6 2 8 2s8-.9 8-2"/></svg>
        <strong>Data Provider</strong>
        <span>Publish datasets and earn from subscriptions</span>
      </button>
    </fieldset>

    <form class="app-form" data-auth-form="register" novalidate>
      <label>Name
        <input type="text" name="name" autocomplete="name" required placeholder="Your name">
      </label>
      <label>Email
        <input type="email" name="email" autocomplete="username" required placeholder="you@company.com">
      </label>
      <label>Password
        <span class="app-auth-pwrow">
          <input type="password" name="password" autocomplete="new-password" minlength="8" required data-auth-pw>
          <button type="button" class="app-auth-pwtoggle" data-auth-pwtoggle aria-label="Show password">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </span>
        <span class="app-auth-strength" data-auth-strength>
          <span class="app-auth-strength__track"><span class="app-auth-strength__fill" data-auth-strength-fill></span></span>
          <span class="app-auth-strength__label" data-auth-strength-label>8+ characters</span>
        </span>
      </label>
      <p class="app-kpi__sub is-down" data-auth-error role="alert"></p>
      <button type="submit" class="app-btn app-btn--primary app-btn--block" data-auth-submit>Create Account</button>
    </form>

    <div class="app-auth-divider"><span>or continue with</span></div>
    <div class="app-auth-sso">
      <button type="button" class="app-btn app-btn--ghost app-btn--block" data-auth-sso="google">Continue with Google</button>
      <button type="button" class="app-btn app-btn--ghost app-btn--block" data-auth-sso="github">Continue with GitHub</button>
    </div>

    <p class="app-auth-switch">Already have an account? <a href="/app/signin/">Sign in</a></p>
  </div>
</div>
