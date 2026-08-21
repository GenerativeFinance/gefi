---
title: Disclosure Drafter
slug: disclosure-drafter
category: Generative / Documents
featured: true
risk: high
maturity: Beta
federated: false
price: 499
jurisdictions: [US, UK, EU]
lead: Financials in, draft MD&A and risk-factor language out — redlined against the prior filing, watermarked for counsel, and never filed by the model.
metrics:
  - { label: "Drafts, never files",   value: "By design" }
  - { label: "Watermark removable",   value: "No" }
  - { label: "Requirement libraries", value: "SEC, UK, EU" }
  - { label: "Paragraph provenance",  value: "Tracked" }
analytics: true
demo:
  output: table
  cta: Draft disclosures
  lead: Select a filing and period. The checklist below shows required disclosure items and whether the draft covers them — it is a completeness check, not a legal opinion.
  columns: [Requirement, Status, Prior-period delta]
  row_labels: [MD&A — results of operations, MD&A — liquidity, Risk factors — market, Risk factors — cyber, Critical accounting estimates]
  row_count: 5
  fields:
    - name: filing
      type: select
      label: Filing
      options: [Form 10-K, Form 10-Q, UK Annual Report, EU Annual Financial Report]
      value: Form 10-K
    - name: jurisdiction
      type: select
      label: Requirement library
      options: [SEC (Reg S-K), UK, EU]
      value: SEC (Reg S-K)
    - name: period
      type: text
      label: Period
      value: FY2025
    - name: redline
      type: checkbox
      label: Redline against prior period
      value: true
---

## This drafts. It never files.

The Disclosure Drafter produces **drafts for counsel review** and nothing else.
Every export carries an unremovable *DRAFT — for counsel review* watermark.
There is no path through this product that submits a document to a regulator,
and no configuration that lifts the watermark automatically. A qualified person
reviews and files; the model does not.

This model is classed **high risk** for that reason. Disclosure language has
legal consequence, and generated text that reads as finished is exactly the
failure mode worth designing against.

## What it does

Feed it the period's financials and it drafts MD&A and risk-factor language
against the requirement library for your jurisdiction — SEC Regulation S-K
items, or their UK and EU equivalents.

Output comes with a **redline diff against the prior period's filing**, so
reviewers see what changed rather than re-reading the whole document, and a
**missing-disclosure checklist** flagging required items the draft does not yet
address.

## Why it works

Disclosure drafting is largely a completeness problem before it is a writing
problem: the question is whether every item the rules require has been
addressed, and whether anything has changed since last period. Both are
mechanical checks a model can run exhaustively and a person cannot.

An **edit-provenance trail** records, paragraph by paragraph, what the machine
drafted and what a human revised. When counsel later asks who wrote a
particular sentence, that has an answer.

## Compliance posture

The per-jurisdiction requirement library tracks rule updates, so a draft is
checked against the rules in force for that period rather than whatever was
current when the template was written.

Counsel review is routed through the lawyer directory as a workflow step, and
the watermark persists until a reviewer with authority signs off. Nothing about
that sequence is advisory: it is how the product works.

Nothing produced here is legal advice, and nothing produced here is a filing.

## Pricing

**Enterprise** tier, at $499/month, reflecting the review workflow and the
per-jurisdiction requirement libraries. Includes counsel-routing configuration
and rule-update tracking for one jurisdiction; additional jurisdictions are
priced per library.
