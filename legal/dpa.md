---
layout: page
title: Data Processing Agreement
eyebrow: Legal
lead: The terms under which GeFi processes personal data on behalf of customers.
permalink: /dpa/
---

> **This document has not yet been reviewed by legal counsel.** Final
> version to be published before public launch. Do not rely on it for
> legal compliance today.

This Data Processing Agreement ("DPA") forms part of the
[Terms of Service](/legal/terms/) between the customer ("Controller") and
GeFi Ltd. ("Processor", "we", "us") and applies whenever GeFi processes
personal data on the Controller's behalf in connection with the Service.

## 1. Parties

- **Controller** — the customer entity that has accepted the Terms of
  Service and uses the Service to process personal data of its own end
  users, employees, or counterparties.
- **Processor** — GeFi Ltd., a company registered in England & Wales,
  with data-protection enquiries handled at **privacy@gefi.io**.

## 2. Subject matter & duration

The Processor processes personal data only to provide the Service as
described in the Terms of Service. Processing continues for the term of
the customer's subscription and any wind-down period required to return
or delete personal data (see §9).

## 3. Nature & purpose of processing

- Operating the marketplace and dashboard surfaces (`gefi.io`,
  `app.gefi.io`).
- Authenticating users and enforcing role-based access control.
- Metering, billing, and producing audit logs.
- Routing inference calls to the federated model network and recording
  hash-chained, Merkle-anchored audit entries.
- Performing KYC / KYB checks where required by jurisdiction.

## 4. Types of personal data

- **Account data** — name, email, company, role, locale.
- **Authentication data** — Auth0 user identifiers, MFA factors, session
  metadata.
- **Usage telemetry** — inference call metadata, model subscriptions,
  audit log entries, billing events.
- **Identity verification data** — when required, name, address, ID
  document images, and liveness checks processed by our KYC subprocessor
  (Sumsub).
- **Billing data** — last four digits of card / wallet identifier,
  billing address, invoice history.

## 5. Data-subject categories

- The Controller's employees, contractors, and authorised users.
- The Controller's end users and counterparties whose data is submitted
  to the Service for inference, risk, fraud, compliance, or trade-finance
  workloads.

## 6. Processor obligations

The Processor will:

1. **Process only on documented instructions.** The Terms of Service,
   this DPA, and the customer's documented configuration constitute the
   complete instructions. We will notify the Controller if, in our
   opinion, an instruction violates GDPR, UK GDPR, or other applicable
   data-protection law.
2. **Ensure confidentiality.** All personnel authorised to process
   personal data are bound by written confidentiality obligations.
3. **Implement security measures.** TLS 1.3 in transit, AES-256 at rest,
   per-tenant KMS-managed keys on Enterprise, MFA enforced for human
   access to production, and just-in-time elevation for engineering. See
   [Compliance & Trust](/compliance/) for the current control set.
4. **Engage sub-processors only as listed in §8** and only under written
   terms that impose equivalent data-protection obligations.
5. **Assist with data-subject requests.** We will provide reasonable
   technical assistance so the Controller can respond to access,
   rectification, erasure, restriction, portability, and objection
   requests.
6. **Assist with DPIAs and prior consultations.** On request and to the
   extent the information is available to us.
7. **Notify the Controller of personal-data breaches without undue
   delay** and in any event within 72 hours of becoming aware, with the
   information required by Article 33(3) GDPR to the extent then known.
8. **Return or delete personal data** at the Controller's choice on
   termination of the Service, save to the extent retention is required
   by law (see §9).
9. **Make available the information necessary to demonstrate
   compliance** and allow audits as set out in §10.

## 7. International transfers

Where personal data is transferred outside the UK / EEA, the parties rely
on the UK International Data Transfer Addendum and / or the EU Standard
Contractual Clauses (Module 2: Controller to Processor), incorporated by
reference. Customers can pin all data to a single region (US, EU, or
MENA) on the Enterprise tier.

## 8. Sub-processors

We use the following sub-processors. Material changes are announced on
the [blog](/blog/) at least 30 days before they take effect.

<div class="prose">
  <table>
    <thead>
      <tr><th>Sub-processor</th><th>Purpose</th></tr>
    </thead>
    <tbody>
      {% for sp in site.subprocessors %}
        <tr>
          <td><strong>{{ sp.name }}</strong></td>
          <td>{{ sp.purpose }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
</div>

## 9. Deletion & return

On termination, the Controller may export account data and audit logs
from the dashboard. Unless the Controller instructs otherwise within 30
days of termination, we will delete personal data in our possession,
except where retention is required by law (e.g. audit logs retained for
the period required by each model's jurisdiction, typically 5–7 years).

## 10. Audit rights

The Controller may, no more than once per twelve-month period, request
evidence of compliance with this DPA. We satisfy audit requests by
providing our most recent SOC 2 Type II report, ISO 27001 certificate,
and the evidence pack available to Pro-tier and above customers from
inside the dashboard. On the Enterprise tier, on-site or remote audits
can be arranged on reasonable notice and at the Controller's cost.

## 11. Liability & order of precedence

In the event of a conflict between this DPA and the Terms of Service,
this DPA prevails on data-protection matters. Liability under this DPA
is subject to the limitations set out in the Terms of Service.

## Contact

Email **privacy@gefi.io** for any questions about this DPA, to request a
counter-signed copy, or to report a data-protection concern.
