---
layout: page
title: Security & vulnerability disclosure
eyebrow: Trust portal
lead: How to report a security issue to GeFi, what's in scope, and the safe-harbour terms researchers can rely on.
permalink: /security/
---

<div class="sec-report" id="report" markdown="0">
<div class="sec-report__panel">
<p class="sec-report__eyebrow">Found something? Report it now.</p>
<p class="sec-report__email"><a href="mailto:security@gefi.io">security@gefi.io</a></p>
<div class="sec-report__links">
<a class="btn btn-ghost" href="/.well-known/security.txt">security.txt</a>
<a class="btn btn-ghost" href="#encryption">PGP key</a>
</div>
<p class="muted small">Good-faith research is protected — see the safe-harbour terms below.</p>
</div>
<ul class="sec-report__tiles" role="list">
<li><span class="sec-report__num">1<span class="sec-report__unit">business day</span></span><span class="sec-report__label">to acknowledge your report</span></li>
<li><span class="sec-report__num">3<span class="sec-report__unit">business days</span></span><span class="sec-report__label">to triage and assess severity</span></li>
<li><span class="sec-report__num">30/60/90<span class="sec-report__unit">days</span></span><span class="sec-report__label">fix targets by severity</span></li>
</ul>
</div>

We run a coordinated vulnerability disclosure programme. Independent
security researchers are an essential part of how we keep GeFi safe for
the institutions, regulators, and end-users who depend on it. This page
is the human-readable companion to our machine-readable
[`/.well-known/security.txt`](/.well-known/security.txt) (RFC 9116).

## What to include in a report

Email **<a href="mailto:security@gefi.io">security@gefi.io</a>** with:

- A clear description of the issue and the impact you believe it has.
- Step-by-step reproduction instructions, including any proof-of-concept
  code, request payloads, or screenshots.
- The affected URL, endpoint, model id, or asset (see [scope](#scope)
  below).
- Your name or handle and how you would like to be credited (optional).
- Your PGP public key if you would like our reply encrypted (optional —
  see [encryption](#encryption)).

Please do **not** include real personal data, customer data, or
production secrets in your report. If you encountered any during
testing, redact it and tell us so we can rotate or purge it.

## Our commitments (SLA)

| Step | Target |
|------|--------|
| Acknowledgement of receipt | **1 business day** |
| Initial triage and severity assessment | **3 business days** |
| Status update cadence while open | At least every 7 days |
| Fix target — Critical / High | 30 days |
| Fix target — Medium | 60 days |
| Fix target — Low | 90 days |
| Public disclosure | Coordinated with the reporter |

We will keep you informed throughout, credit you in our security
advisory and on this page (unless you prefer to remain anonymous), and
will not take legal action against researchers acting in good faith
under the [safe-harbour](#safe-harbour) terms below.

<h2 id="scope">Scope</h2>

<div class="sec-scope" markdown="0">
<div class="sec-scope__col sec-scope__col--in">
<h3><span class="sec-scope__mark sec-scope__mark--in" aria-hidden="true">✓</span> In scope</h3>
<ul>
<li><code>gefi.io</code> and all subdomains (<code>app</code>, <code>api</code>, <code>docs</code>, <code>status</code>, <code>trust</code>)</li>
<li>Public GeFi APIs documented at <a href="/docs/">/docs/</a></li>
<li>GeFi mobile and desktop clients from official channels</li>
<li>Production source code in the <a href="https://github.com/gefi-io">gefi-io GitHub organisation</a> (audit-spec, SDKs, model reference implementations)</li>
<li>Federated model integrity, audit-log tamper resistance, Merkle inclusion-proof verification</li>
</ul>
</div>
<div class="sec-scope__col sec-scope__col--out">
<h3><span class="sec-scope__mark sec-scope__mark--out" aria-hidden="true">✕</span> Out of scope</h3>
<ul>
<li>Third-party services (Cloudflare, Stripe, Auth0, Sumsub, Resend) — report to the vendor; we help coordinate</li>
<li>Physical access, social engineering, or third-party account compromise</li>
<li>Denial-of-service, volumetric, or load-testing attacks</li>
<li>Raw scanner output without demonstrated impact</li>
<li>Header/cookie/SPF/DKIM/TLS nits without a working exploit</li>
<li>Self-XSS, clickjacking without sensitive actions, rate-limit absence on unauthenticated endpoints</li>
<li>Unsupported or end-of-life browsers and OS versions</li>
</ul>
</div>
</div>

<h2 id="rules">Rules of engagement</h2>

When testing, please:

- Use only accounts you own, or test accounts you create. Do **not**
  attempt to access, modify, or delete data belonging to other
  customers.
- Stop as soon as you have demonstrated impact — do not pivot,
  exfiltrate, or persist.
- Do not run automated scanners against production at a rate that
  could degrade service. If you need to scale up, contact us first.
- Do not publicly disclose the issue, share it with third parties, or
  file it in a bug bounty marketplace until we have agreed a
  coordinated disclosure timeline.
- Comply with all applicable laws.

<details class="sec-legal" id="safe-harbour" markdown="1">
<summary><strong>Safe harbour</strong> — the legal terms researchers can rely on</summary>

If you make a good-faith effort to comply with this policy during your
security research, GeFi will:

- Consider your activity to be **authorised** under the Computer Fraud
  and Abuse Act (US), the Computer Misuse Act 1990 (UK), and analogous
  laws in other jurisdictions where we operate.
- Consider your activity to be **exempt** from restrictions in our
  [Terms of Service](/legal/terms/) and
  [Acceptable Use Policy](/legal/acceptable-use/) that would otherwise
  prohibit security testing.
- **Not pursue or support any legal action** against you related to
  your research, and will work with you if a third party (for example,
  law enforcement) raises concerns based on your good-faith activity.
- **Not file a DMCA or equivalent takedown** against research output
  published in line with this policy.

If at any point you are unsure whether a particular action is covered,
contact us at `security@gefi.io` first and we will tell you.

</details>

<h2 id="encryption">Encryption (PGP)</h2>

You can encrypt sensitive reports with our security team key:

- **Key id:** `0x2D5F1B8C7E3A6D40`
- **Fingerprint:** `9F3D 4C2B 7A1E 5F8D 6B0C  4A9E 2D5F 1B8C 7E3A 6D40`
- **Download:** [`keys.openpgp.org`](https://keys.openpgp.org/vks/v1/by-fingerprint/9F3D4C2B7A1E5F8D6B0C4A9E2D5F1B8C7E3A6D40)
- **Algorithm:** Curve25519 (EdDSA + ECDH)

Always verify the fingerprint out-of-band before sending sensitive
material. Rotation is announced on the [blog](/blog/) and reflected in
our [`/.well-known/security.txt`](/.well-known/security.txt).

<h2 id="hall-of-fame">Acknowledgements</h2>

We credit researchers who report valid issues here, with their consent.
The first cohort will be listed once we publish our inaugural quarterly
security letter.

## Related

- [Compliance & Trust](/compliance/) — certifications, subprocessors,
  audit log spec, per-jurisdiction counsel.
- [trust.gefi.io](https://trust.gefi.io) — live evidence.
- [status.gefi.io](https://status.gefi.io) — current uptime and
  incidents.
- [`/.well-known/security.txt`](/.well-known/security.txt) —
  machine-readable contact for tooling (RFC 9116).
