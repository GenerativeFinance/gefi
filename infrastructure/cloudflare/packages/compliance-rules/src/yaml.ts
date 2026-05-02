/**
 * Tiny YAML emitter scoped to the `ComplianceRule[]` shape. Hand-rolled to
 * keep the package free of YAML dependencies (the `compliance-rules` graph
 * is consumed by Workers; we don't want to drag js-yaml into the bundle).
 *
 * Output is intentionally deterministic and conservative:
 *
 * - Block style, 2-space indentation.
 * - All strings are double-quoted with `\\` / `\"` / `\n` escapes; this
 *   removes any ambiguity around YAML special characters (colons in
 *   citation strings, dashes in IDs, etc.).
 * - Object keys are emitted in declaration order — the call site is
 *   responsible for passing a "canonical" object built in a fixed order.
 * - Empty arrays render as `[]`, empty objects as `{}`.
 *
 * The corresponding "loader" is just `yamlStringify(parse(file))`-style
 * roundtrip in `yaml-sync.test.ts`: we never actually parse YAML at
 * runtime — the TS rule modules are the source of truth, and the YAML
 * mirror exists only for human auditors.
 */

import type { ComplianceRule, RequiredAction } from "./types.js";

function escapeString(s: string): string {
  return `"${s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")}"`;
}

function emitScalar(v: string | number | boolean | null | undefined): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") {
    if (!Number.isFinite(v)) throw new Error(`yaml: non-finite number ${v}`);
    return String(v);
  }
  return escapeString(v);
}

function emitArray(arr: readonly unknown[], indent: number): string {
  if (arr.length === 0) return "[]";
  const pad = "  ".repeat(indent);
  const lines: string[] = [];
  for (const item of arr) {
    if (item === null || item === undefined || typeof item !== "object") {
      lines.push(`${pad}- ${emitScalar(item as string | number | boolean | null | undefined)}`);
      continue;
    }
    if (Array.isArray(item)) {
      const nested = emitArray(item, indent + 1);
      lines.push(`${pad}-${nested.includes("\n") ? "\n" + nested : " " + nested}`);
      continue;
    }
    // Object item: first key-value goes on the `- ` line, the rest sit at
    // the next indent level so the YAML reader sees one block per item.
    const entries = Object.entries(item as Record<string, unknown>);
    if (entries.length === 0) {
      lines.push(`${pad}- {}`);
      continue;
    }
    const childPad = "  ".repeat(indent + 1);
    const [firstKey, firstVal] = entries[0]!;
    const firstLine = renderKeyValue(firstKey, firstVal, indent + 1);
    lines.push(`${pad}- ${firstLine.startsWith(childPad) ? firstLine.slice(childPad.length) : firstLine}`);
    for (let i = 1; i < entries.length; i++) {
      const [k, v] = entries[i]!;
      lines.push(renderKeyValue(k, v, indent + 1));
    }
  }
  return lines.join("\n");
}

function renderKeyValue(key: string, value: unknown, indent: number): string {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return `${pad}${key}: null`;
  if (typeof value !== "object") {
    return `${pad}${key}: ${emitScalar(value as string | number | boolean)}`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}${key}: []`;
    return `${pad}${key}:\n${emitArray(value, indent + 1)}`;
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return `${pad}${key}: {}`;
  const inner = entries.map(([k, v]) => renderKeyValue(k, v, indent + 1)).join("\n");
  return `${pad}${key}:\n${inner}`;
}

/** Canonicalise an action into a fixed key order so YAML diffs stay stable. */
function canonAction(a: RequiredAction): Record<string, unknown> {
  const out: Record<string, unknown> = { kind: a.kind };
  if (a.slaHours !== undefined) out.slaHours = a.slaHours;
  if (a.params !== undefined) out.params = a.params;
  return out;
}

/** Canonicalise a rule for emission. The key order here is the auditor-facing order. */
function canonRule(r: ComplianceRule): Record<string, unknown> {
  return {
    id: r.id,
    version: r.version,
    jurisdiction: r.jurisdiction,
    appliesTo: { regions: r.appliesTo.regions },
    trigger: r.trigger.match
      ? { eventKind: r.trigger.eventKind, match: r.trigger.match }
      : { eventKind: r.trigger.eventKind },
    requires: {
      actions: r.requires.actions.map(canonAction),
      slaHours: r.requires.slaHours,
    },
    reviewer: r.reviewer,
    statute: r.statute,
    rationale: r.rationale,
  };
}

/**
 * Render an array of rules to a deterministic YAML document, with a
 * leading explanatory comment block. Trailing newline is included so
 * the emitted file is POSIX-clean.
 */
export function rulesToYaml(rules: readonly ComplianceRule[]): string {
  const header =
    "# AUTO-GENERATED — DO NOT EDIT.\n" +
    "# Source of truth: packages/compliance-rules/src/rules/<jurisdiction>.ts\n" +
    "# Run `pnpm --filter @gefi/compliance-rules sync-yaml` to refresh.\n";
  const body = emitArray(rules.map(canonRule), 0);
  return `${header}${body}\n`;
}
