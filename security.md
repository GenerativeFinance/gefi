---
layout: page
title: Security & vulnerability disclosure
eyebrow: Trust portal
lead: How to report a security issue to GeFi, what's in scope, and the safe-harbour terms researchers can rely on.
permalink: /security/
---

We run a coordinated vulnerability disclosure programme. Independent
security researchers are an essential part of how we keep GeFi safe for
the institutions, regulators, and end-users who depend on it. This page
is the human-readable companion to our machine-readable
[`/.well-known/security.txt`](/.well-known/security.txt) (RFC 9116).

<h2 id="report">Reporting a vulnerability</h2>

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

<h2 id="scope">In-scope assets</h2>

The following GeFi-operated assets are in scope:

- `gefi.io` and all subdomains (`app.gefi.io`, `api.gefi.io`,
  `docs.gefi.io`, `status.gefi.io`, `trust.gefi.io`).
- Public GeFi APIs documented at [/docs/](/docs/).
- The GeFi mobile and desktop clients distributed through our official
  channels.
- Source code in the [`gefi-io` GitHub organisation](https://github.com/gefi-io)
  that is part of the production stack (audit-spec, SDKs, model
  reference implementations).
- Federated model integrity, audit-log tamper resistance, and Merkle
  inclusion-proof verification.

### Out of scope

- Third-party services we use (Cloudflare, Stripe, Auth0, Sumsub,
  Resend) — please report those directly to the vendor. We will help
  coordinate where appropriate.
- Findings that require physical access to a user's device, social
  engineering of GeFi staff or customers, or compromise of a third
  party's account.
- Denial-of-service, volumetric, or load-testing attacks.
- Reports based solely on automated scanner output without a
  demonstrated impact.
- Missing security headers, cookie flags, SPF/DKIM/DMARC nits, or
  TLS configuration findings without a working exploit.
- Self-XSS, clickjacking on pages with no sensitive actions, and
  rate-limit absence on non-authenticated endpoints.
- Vulnerabilities in unsupported or end-of-life browsers or OS
  versions.

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

<h2 id="safe-harbour">Safe harbour</h2>

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
