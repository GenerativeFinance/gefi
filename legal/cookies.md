---
layout: page
title: Cookie policy
eyebrow: Legal
lead: What cookies GeFi sets, why, and how to control them.
permalink: /cookie-policy/
---

> **This document has not yet been reviewed by legal counsel.** Final
> version to be published before public launch. Do not rely on it for
> legal compliance today.

GeFi uses a deliberately small set of cookies, all of which are
**strictly necessary** to operate the Service. We do not set advertising
or analytics cookies on the marketing site (`gefi.io`) or the dashboard
(`app.gefi.io`), and we do not embed third-party trackers.

Because we only use strictly-necessary cookies, no consent banner is
required under GDPR, UK GDPR, or the ePrivacy Directive. You can still
disable or delete cookies at any time from your browser — see "How to
control cookies" below.

## Cookies GeFi sets

<div class="prose">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Purpose</th>
        <th>Type</th>
        <th>Lifetime</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>gefi_session</code></td>
        <td>Maintains your authenticated session on the dashboard.</td>
        <td>First-party, HTTP-only, Secure, SameSite=Lax</td>
        <td>Session (deleted when you sign out or close the browser)</td>
      </tr>
      <tr>
        <td><code>gefi_csrf</code></td>
        <td>Protects forms and state-changing requests against
            cross-site request forgery.</td>
        <td>First-party, Secure, SameSite=Strict</td>
        <td>Session</td>
      </tr>
    </tbody>
  </table>
</div>

## What we do not use

- **Analytics cookies** — we do not run Google Analytics, Segment,
  Mixpanel, or any equivalent on `gefi.io` or `app.gefi.io`.
- **Advertising cookies** — we do not run remarketing pixels, conversion
  tags, or behavioural advertising trackers.
- **Social-media trackers** — links to X, GitHub, Discord, and LinkedIn
  in the footer are plain anchor tags; no third-party scripts are
  embedded.

## Third-party cookies

The only third-party cookies that may be set in connection with the
Service come from the **Stripe** payment iframe. When you reach the
checkout or update your payment method, the Stripe-hosted iframe sets
cookies that Stripe uses for fraud prevention and to operate the
payment flow. See the
[Stripe Cookie Policy](https://stripe.com/legal/cookies-policy).
Stripe acts as a separate controller for those cookies.

We do not embed Stripe cookies on marketing pages.

## How to control cookies

You can clear or block cookies in your browser at any time. Help pages
for the major browsers:

- [Chrome](https://support.google.com/chrome/answer/95647)
- [Firefox](https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox)
- [Safari](https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac)
- [Edge](https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09)

Disabling the `gefi_session` or `gefi_csrf` cookies will prevent you
from signing in to or using the dashboard.

## Changes to this policy

If we add, change, or remove cookies, we will update this page and note
the change in our [blog](/blog/). Material changes that affect your
privacy choices will be highlighted at the top of this page.

## Contact

Questions about cookies or tracking? Email **privacy@gefi.io**.
