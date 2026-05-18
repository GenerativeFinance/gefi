---
layout: page
title: Acceptable use policy
eyebrow: Legal
lead: The full list of workloads that are prohibited on the GeFi platform.
permalink: /legal/acceptable-use/
---

> **This document has not yet been reviewed by legal counsel.** Final
> version to be published before public launch. Until then, this policy
> is enforced on a best-efforts basis and is subject to change.

## Scope

This Acceptable Use Policy ("AUP") applies to anyone who accesses the
GeFi marketing site (`gefi.io`), the application (`app.gefi.io`), the
GeFi APIs, the SDKs, any model hosted on the marketplace, and any
inference output produced by the platform. It is incorporated by
reference into the [Terms of Service](/legal/terms/) and applies to
both subscribers and the end users they grant access to.

We may suspend or terminate access, withhold inference output, freeze
payouts, file regulatory or law-enforcement reports, and pursue civil
remedies for any violation. Violations of categories marked **(zero
tolerance)** below will result in immediate termination without
warning.

## How to read this policy

For each prohibited category we list:

- **Definition** — what the category covers.
- **Examples** — non-exhaustive workloads that fall inside it.
- **Out of scope** — adjacent activity that is *not* prohibited, where
  the line is easy to misread.

The examples are illustrative, not exhaustive. If a workload is not
listed but is reasonably analogous to one that is, treat it as
prohibited and contact `trust@gefi.io` for a written exception.

---

## 1. Illegal activity & sanctions evasion **(zero tolerance)**

**Definition.** Any use of the Service that violates applicable law in
the user's jurisdiction, the jurisdiction of the data subject, the
jurisdiction of the GeFi entity contracting with the user, or any
sanctions regime that GeFi is required to observe (UK OFSI, EU, US
OFAC, UN).

**Examples.**

- Onboarding, transacting with, or routing payments for sanctioned
  persons, entities, vessels, or jurisdictions.
- Structuring transactions to evade reporting thresholds.
- Operating an unlicensed money services, virtual-asset, or securities
  business through the Service.
- Concealing beneficial ownership during KYB.

**Out of scope.** Sanctions screening, AML transaction monitoring, and
adverse-media research that are themselves designed to *detect* and
*prevent* the above are explicitly permitted and encouraged.

## 2. Market abuse & financial-market manipulation **(zero tolerance)**

**Definition.** Any workload designed to manipulate the price,
liquidity, or perceived state of a regulated or unregulated market,
or to trade on information that is not lawfully available.

**Examples.**

- Spoofing, layering, wash trading, marking the close, or quote
  stuffing on any venue.
- Coordinated pump-and-dump or rug-pull schemes on equities, crypto,
  or other assets.
- Generating or amplifying false news, social-media posts, fake
  research, or fake "leaks" intended to move a price.
- Trading on the basis of material non-public information ("insider
  trading"), including using a model to infer MNPI from alternative
  data that was obtained in breach of contract or duty.
- Front-running customer orders or copy-trading flow you are obliged
  to keep confidential.

**Out of scope.** Lawful market-making, statistical arbitrage,
execution algorithms, and surveillance models designed to *detect*
the above on behalf of a venue, broker, or regulator.

## 3. Fraud, deception & social engineering

**Definition.** Use of the Service to defraud, deceive, or impersonate
a person, business, regulator, or public authority for financial or
strategic gain.

**Examples.**

- Generating synthetic identities, forged KYC documents, deepfaked
  voice or video for account takeover, or fake proofs of funds.
- Phishing kits, fraudulent invoices, business-email-compromise
  templates, or romance / investment scam scripts.
- Impersonating GeFi, a GeFi customer, a regulator, or any financial
  institution.
- Operating Ponzi, pyramid, "guaranteed return", or
  high-yield-investment-program schemes.

## 4. Child sexual abuse material (CSAM) and child exploitation **(zero tolerance)**

**Definition.** Any content, prompt, fine-tune, or workload that
sexualises a minor, or that is intended to identify, groom, or harm
minors.

**Examples.**

- Generating, soliciting, transmitting, or storing CSAM in any form,
  real or synthetic.
- Using person-recognition or location models to identify minors
  outside a lawful safeguarding context.

**Reporting.** Suspected CSAM is reported to the relevant national
authority (NCMEC in the US, the IWF in the UK, equivalents elsewhere)
and the account is terminated and preserved for law enforcement.

## 5. Mass surveillance & unlawful monitoring **(zero tolerance)**

**Definition.** Indiscriminate or untargeted monitoring of populations,
or monitoring of identified individuals without a lawful basis.

**Examples.**

- Bulk facial recognition, gait recognition, or biometric
  identification of people in public spaces without specific legal
  authority.
- Predictive policing, social-credit scoring, or systems that infer
  protected characteristics (sexuality, religion, political opinion)
  for state or commercial profiling.
- Stalkerware, spousal-monitoring tooling, or any product designed to
  surveil a person without their informed consent.

**Out of scope.** Targeted, lawful, and proportionate investigations
by competent authorities, internal fraud and insider-threat programmes
operating under a lawful basis, and consented user analytics.

## 6. Weapons design, targeting & critical-infrastructure attack **(zero tolerance)**

**Definition.** Any workload that designs, optimises, targets, or
operates weapons systems, or that attacks critical infrastructure.

**Examples.**

- Design or improvement of chemical, biological, radiological,
  nuclear, or high-yield explosive (CBRNE) weapons.
- Targeting, fire-control, or autonomous-engagement decisions for
  kinetic or cyber weapons.
- Generation of malware, ransomware, exploit chains, or
  command-and-control infrastructure.
- Attacks on, or unauthorised intrusion into, financial market
  infrastructure, payments rails, energy grids, water systems,
  hospitals, or transport networks.

## 7. Election manipulation & democratic interference **(zero tolerance)**

**Definition.** Use of the Service to undermine the integrity of an
election, referendum, or democratic process.

**Examples.**

- Generating or distributing deceptive content about when, where, or
  how to vote, or about candidate eligibility.
- Mass synthetic-persona campaigns ("astroturf") aimed at voters,
  poll workers, or election officials.
- Voter suppression, intimidation, or doxxing of election workers.
- Foreign-influence operations of any kind.

**Out of scope.** Academic study of disinformation, fact-checking,
journalism, and election-integrity monitoring conducted under
appropriate ethical oversight.

## 8. Discrimination & unlawful credit / insurance decisions

**Definition.** Use of the Service to make or materially influence
decisions about a person in a way that is unlawfully discriminatory or
that violates sectoral fairness rules (consumer credit, insurance,
employment, housing, healthcare).

**Examples.**

- Credit, insurance, or pricing models that use protected
  characteristics (or close proxies) as inputs in violation of local
  law (e.g. ECOA, Equality Act 2010, EU AI Act high-risk rules).
- Adverse decisions issued without the explainability, recourse, or
  human-review steps required by the customer's regulator.
- Workforce screening that scores candidates on protected
  characteristics or undisclosed personality inferences.

**Out of scope.** Fair-lending audits, bias testing, and counterfactual
analysis designed to *measure* and *reduce* discrimination.

## 9. Misuse of personal & confidential data

**Definition.** Processing personal data, customer data, or
confidential business data without a lawful basis, in breach of
contract, or beyond the purpose for which it was collected.

**Examples.**

- Re-identifying individuals from anonymised or pseudonymised
  datasets.
- Scraping personal data in violation of a site's terms or applicable
  data-protection law.
- Using customer data uploaded to one workspace to train, fine-tune,
  or evaluate models for an unrelated workspace or third party.
- Exfiltrating model inputs, outputs, or audit logs belonging to
  another tenant.

## 10. Tampering with the platform, models, or audit trail **(zero tolerance)**

**Definition.** Any attempt to subvert the integrity, security, or
auditability of GeFi itself.

**Examples.**

- Reverse-engineering, extracting, or redistributing model weights in
  violation of the model's licence.
- Model-extraction attacks (e.g. high-volume querying to clone a
  hosted model), prompt-injection attacks against other tenants, or
  data-poisoning of shared training pipelines.
- Forging, deleting, or back-dating audit logs, evaluation results,
  attestations, or model cards.
- Bypassing rate limits, billing, KYC/KYB, sanctions screening, or
  evaluation gating.
- Unauthorised security testing of the platform outside the scope of
  a written authorisation from `security@gefi.io`.

## 11. Self-harm, harassment & violent extremism

**Definition.** Content or workloads that promote, glorify, or
operationally support self-harm, harassment of an individual or group,
or violent extremism.

**Examples.**

- Targeted harassment, doxxing, or coordinated brigading of an
  individual.
- Content promoting suicide, eating disorders, or self-injury as
  desirable.
- Recruitment, propaganda, or fundraising for designated terrorist
  organisations.

**Out of scope.** Counter-terrorism research, safeguarding tooling,
and clinical content delivered by qualified professionals to people
in their care.

## 12. Spam, scraping & platform abuse

**Definition.** Behaviour that degrades the Service for other users,
abuses shared resources, or violates third-party terms via the
Service.

**Examples.**

- Sending unsolicited bulk messages, comment spam, or SEO-link spam
  generated through the platform.
- Using the Service to scrape sites in breach of their terms or
  `robots.txt`.
- Co-tenancy abuse: sharing credentials across organisations,
  re-selling inference without an authorised reseller agreement, or
  running undisclosed multi-tenant proxies on top of a single
  subscription.

---

## Reporting a violation

If you believe someone is using GeFi in violation of this policy,
email **`trust@gefi.io`** with as much detail as you can share. For
suspected CSAM, you may also report directly to NCMEC, the IWF, or
your national equivalent — please still let us know so we can
preserve evidence and terminate the account.

For security vulnerabilities in the platform itself, contact
**`security@gefi.io`**.

## Exceptions & written approvals

A small number of legitimate workloads (for example, regulated
sanctions screening that necessarily ingests sanctions-list data, or
academic disinformation research) sit close to the lines drawn above.
If your use case is one of them, contact `trust@gefi.io` *before*
launch with a written description of the workload, the lawful basis,
the safeguards you will operate, and the regulator (if any)
supervising you. Approvals are issued in writing and are
account-specific.

## Changes to this policy

We will update this policy as the platform, the threat landscape, and
the regulatory landscape evolve. Material changes will be announced
in the in-product changelog and, for paying subscribers, by email at
least 30 days before they take effect. The "Last updated" date below
reflects the most recent revision.

*Last updated: {{ site.time | date: "%-d %B %Y" }}*
