---
layout: app-solo
title: "Settings"
heading: "Profile & Security"
subtitle: "Manage your profile, preferences and active sessions."
permalink: /app/settings/
sitemap: false
robots: noindex
app_script: /assets/js/app/settings.js
---

<div class="app-ov-charts">
  <section class="app-panel">
    <h2 class="app-panel__title">Profile</h2>
    <div class="app-settings-avatar">
      <span class="app-avatar app-settings-avatar__img" data-set-avatar-preview aria-hidden="true">?</span>
      <div>
        <label class="app-btn app-btn--ghost app-settings-upload">
          Upload avatar
          <input type="file" accept="image/*" data-set-avatar-input style="position:absolute; inset:0; opacity:0; cursor:pointer;">
        </label>
        <button type="button" class="app-btn app-btn--ghost" data-set-avatar-clear>Remove</button>
      </div>
    </div>
    <form class="app-form" data-set-profile-form>
      <label>Name
        <input type="text" name="name" required>
      </label>
      <label>Email
        <input type="email" name="email" disabled>
      </label>
      <label>Language
        <select name="language">
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="pt">Português</option>
        </select>
      </label>
      <div class="app-setting" style="cursor:default;">
        <span><strong>Theme</strong><small>Applies to this browser</small></span>
        <span class="app-segments" style="margin:0; padding:3px;" data-set-theme role="group" aria-label="Theme">
          <button type="button" class="app-segment" data-theme-choice="dark">Dark</button>
          <button type="button" class="app-segment" data-theme-choice="light">Light</button>
        </span>
      </div>
      <p class="app-kpi__sub" data-set-status role="status" aria-live="polite"></p>
      <button type="submit" class="app-btn app-btn--primary">Save Changes</button>
    </form>
  </section>

  <section class="app-panel">
    <h2 class="app-panel__title">Active Sessions</h2>
    <div data-set-sessions></div>
    <p class="app-kpi__sub" data-set-sessions-status role="status" aria-live="polite"></p>
  </section>
</div>

<section class="app-panel app-settings-danger" style="margin-top:18px;">
  <h2 class="app-panel__title" style="color:var(--app-red);">Danger Zone</h2>
  <div class="app-fh-row">
    <span>Sign out of this session</span>
    <button type="button" class="app-btn app-btn--ghost" data-set-signout>Sign Out</button>
  </div>
  <div class="app-fh-row">
    <span>Delete account — permanent, cannot be undone</span>
    <button type="button" class="app-btn app-btn--ghost app-settings-danger__btn" data-set-delete>Delete Account</button>
  </div>
</section>

<div class="app-modal" data-set-delete-modal hidden>
  <div class="app-modal__card" role="dialog" aria-modal="true" aria-labelledby="set-delete-title">
    <h2 id="set-delete-title" class="app-panel__title">Delete your account?</h2>
    <p class="app-kpi__sub">This is a sample environment — nothing is actually deleted, but the flow behaves as it would in production. Type <strong style="color:var(--app-text);" data-set-delete-name></strong> to confirm.</p>
    <form class="app-form" data-set-delete-form>
      <label>Type your email to confirm
        <input type="text" name="confirm" autocomplete="off">
      </label>
      <p class="app-kpi__sub is-down" data-set-delete-err role="alert"></p>
      <div class="app-modal__actions">
        <button type="button" class="app-btn app-btn--ghost" data-set-delete-cancel>Cancel</button>
        <button type="submit" class="app-btn app-btn--primary app-settings-danger__btn">Delete Account</button>
      </div>
    </form>
  </div>
</div>
