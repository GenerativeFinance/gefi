---
title: GeFi Copilot
slug: gefi-copilot
category: Generative / Copilot
featured: true
risk: medium
maturity: Beta
federated: false
price: 199
jurisdictions: [US, UK, EU]
lead: Chat surface over your portfolio and subscribed models, where every numeric claim carries a run id that resolves to its audit-log proof.
metrics:
  - { label: "Claims with a run id",  value: "98.2%" }
  - { label: "Median answer latency", value: "4.1s" }
  - { label: "Models callable",       value: "Your subscriptions" }
  - { label: "Ships as advice",       value: "No" }
analytics: true
demo:
  output: text
  cta: Ask the copilot
  lead: Ask a question against a sample portfolio. The copilot decides which subscribed models to call, then answers with a citation for every figure.
  sample_text: >-
    Against the sample EU credit book, a parallel +200bp shift raises modelled
    12-month expected loss from 1.84% to 2.37% of drawn exposure (+53bp).
    Two models were called: Credit Oracle [run 8f2c…a91] for obligor-level PD
    migration, and IRRBB / ALM Modeler [run 41d7…0b3] for the repricing gap.
    The largest contributors are floating-rate exposures in the 3–5 year
    bucket. Decision support, not investment advice — every figure above
    resolves to its audit-log proof.
  fields:
    - name: question
      type: textarea
      label: Question
      value: What happens to our EU credit exposure if rates rise 200bp?
      placeholder: Ask about exposure, concentration, or a scenario
    - name: scope
      type: select
      label: Portfolio scope
      options: [EU credit book, US SME book, Global macro overlay]
      value: EU credit book
    - name: horizon
      type: number
      label: Horizon
      value: 12
      min: 1
      max: 60
      unit: months
    - name: cite
      type: checkbox
      label: Require a run id for every figure
      value: true
---

## What it does

GeFi Copilot answers questions about your portfolio by calling the models you
already subscribe to, rather than by generating prose about them. Ask what
happens to EU credit exposure under a 200bp parallel shift and it routes the
question to the relevant models, runs them against your book, and composes the
answer from what came back.

Every numeric claim in an answer carries a `run_id` citation chip. Expanding
one shows the model that produced the figure, the inputs it was given, and the
Merkle inclusion proof anchoring that run in the audit log. A number without a
run id is flagged in the answer rather than presented alongside grounded ones.

## Why it works

Grounded generation is the whole product. A copilot that talks about your
portfolio is a chatbot; a copilot whose numbers are individually verifiable is
an auditable analyst. The model never invents a figure — it either has a model
run to cite or it says it does not.

The **model-call trace panel** shows which models were invoked, with which
inputs, in what order. That makes an answer reproducible: re-run the same
trace and you get the same figures, or you get a diff worth investigating.

Suggested-question chips are generated per subscribed model, so the surface
stays useful as your subscriptions change rather than offering questions the
tenant has no model to answer.

## Compliance posture

Answers carry a persistent **decision support, not investment advice** line,
and generated drafts are watermarked for human review. Nothing the copilot
produces ships to a client, a regulator, or an investment committee without a
person in the loop.

Operationally, the copilot is bounded by a tool-call registry: it may only
invoke model endpoints the tenant's subscription tier permits. Prompt-injection
and jailbreak attempts are monitored per tenant, as are token cost and latency.
Answer grounding — the share of numeric claims backed by a verifiable run id —
is reported as an operating metric, not an aspiration.

## Pricing

**Pro** plan and above, at $199/month. The copilot calls your subscribed models;
model subscriptions are billed separately and the copilot cannot invoke an
endpoint you do not hold.
