# `@gefi/compliance-rules`

Versioned, typed compliance rule definitions for the eleven jurisdictions GeFi
operates in. Rules are the **source of truth** the compliance engine
(`@gefi/compliance-engine`) consumes when deciding which actions a platform
event triggers.

## Source of truth

Each jurisdiction has a TypeScript module under `src/rules/` (e.g.
`src/rules/mifid-ii.ts`). Rules carry:

- `id` — globally unique identifier (`<jurisdiction>.<short-name>.v<n>`).
- `version` — incremented when the rule's behaviour changes; old versions
  stay published so historical events still resolve cleanly.
- `jurisdiction` — `"sec"`, `"mifid-ii"`, etc.
- `appliesTo.regions` — the GeFi data planes (`eu` / `us`) where this rule is
  evaluated.
- `trigger.eventKind` — which `ComplianceEventKind` activates the rule.
- `trigger.match` — optional structured filter on the event payload (e.g.
  `entityType: "retail"`, `subscriptionTier: "enterprise"`).
- `requires.actions[]` — the canonical actions the engine must take (case
  creation, lawyer routing, encrypted email, on-chain anchor, etc.).
- `requires.slaHours` — the deadline for the routed lawyer/auditor to ack
  and sign off, used by the ComplianceCase Durable Object's `alarm()`.
- `reviewer` — the role on the lawyer/auditor directory that should be
  assigned the routed case.
- `statute` — citation of the source law / regulation. Free-form so we can
  link to PDFs or directives.
- `rationale` — short explanation for engineers reading the rule cold.

## YAML mirror

The `rules/` directory at the package root contains YAML files emitted from
the TypeScript modules via `pnpm sync-yaml`. They are committed so auditors
who don't read TypeScript can review the rule book directly. A vitest
consistency test (`src/yaml-sync.test.ts`) re-emits the YAML and asserts the
committed copies match — drift is a CI failure.

## Adding a rule

1. Open the relevant `src/rules/<jurisdiction>.ts` file (or create one).
2. Append a new entry; bump the `id` suffix if you're versioning an existing
   rule.
3. Run `pnpm test` — the consistency test will fail with an instructive diff.
4. Run `pnpm sync-yaml` to refresh the YAML mirror.
5. Commit both the `.ts` and the `.yaml`.

The point of carrying the YAML mirror is auditability — never modify the YAML
by hand. The TS file is canonical.
