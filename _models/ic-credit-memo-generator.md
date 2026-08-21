---
title: IC & Credit Memo Generator
slug: ic-credit-memo-generator
category: Generative / Documents
featured: true
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Drafts investment-committee and credit memos from a deal file, with every figure linked back to the model run that produced it.
metrics:
  - { label: "Figures with a run id", value: "100%" }
  - { label: "Median draft time",     value: "38s" }
  - { label: "Templates versioned",   value: "Yes" }
  - { label: "Watermark until signoff", value: "Enforced" }
analytics: true
demo:
  output: table
  cta: Draft the memo
  lead: Pick a file and a template. The draft below shows the figures section — each row carries the model run that produced it.
  columns: [Section, Figure, Source run]
  row_labels: [Probability of default, Loss given default, Enterprise value, Debt / EBITDA, Coverage ratio]
  row_count: 5
  fields:
    - name: file
      type: select
      label: Deal or loan file
      options: [Project Meridian (LBO), Harbour SME facility, Northwind refinancing]
      value: Project Meridian (LBO)
    - name: template
      type: select
      label: Template
      options: [Investment-committee memo, Credit memo]
      value: Investment-committee memo
    - name: sections
      type: number
      label: Sections
      value: 5
      min: 1
      max: 12
    - name: watermark
      type: checkbox
      label: Watermark draft until sign-off
      value: true
---

## What it does

Point it at a deal or loan file, choose an investment-committee or credit memo
template, and it renders a draft. Every figure in that draft is linked to the
model run that produced it — a probability of default from Credit Oracle, a
comparable-company multiple from the valuation engine — so a reader can click
any number and see the inputs and the audit-log proof behind it.

A tracked-changes view keeps generated text and analyst edits visually
separate. Reviewers can see at a glance what the model wrote and what a person
changed, which is the distinction that matters when the memo is later
questioned.

Export is DOCX or PDF, and the export keeps a **draft watermark** until the
memo is signed off.

## Why it works

Memo drafting is mostly assembly: pulling figures from the systems that hold
them, arranging them under standard headings, and writing connective prose. The
assembly is what the generator does. The judgement — whether the deal is good —
stays with the committee.

Grounding is what makes that division safe. A figure without a `run_id` behind
it does not silently make it into a draft; it goes to the grounding-check
queue and is flagged for an analyst. The failure mode of a memo generator is a
confident number nobody can trace, and the queue exists specifically to make
that failure visible instead of invisible.

## Compliance posture

Templates live in a version-controlled library, so a memo can be reproduced
against the template that was current when it was written. Reviewer sign-off is
a workflow, not a checkbox: approval is logged into the compliance case system,
and only then does the watermark lift.

The result is that any memo in the record can be traced three ways — to its
template version, to the model runs behind each figure, and to the person who
approved it.

## Pricing

**Pro** plan and above, at $199/month. Figures are sourced from your subscribed
models; the generator cannot cite a model you do not hold.
