/**
 * Tiny JSON Schema validator covering the Draft-07 subset the playground
 * mocks declare. Handwritten rather than pulling in `ajv` so the worker
 * stays small and bundlerless on the client (the SchemaForm mirrors this
 * exact behavior in `assets/js/schema-form.js`).
 *
 * Supported keywords:
 *   type             — "object" | "array" | "string" | "number" | "integer" | "boolean"
 *   properties       — recursive
 *   required         — string[]
 *   additionalProperties:false
 *   items            — recursive (single-schema items only — no tuple arrays)
 *   enum             — string[] | number[]
 *   format           — "date"  (YYYY-MM-DD)
 *   minimum / maximum — numeric bounds
 *   multipleOf       — numeric step (epsilon-tolerant)
 *   minLength / maxLength — string length
 *   minItems / maxItems   — array length
 *
 * Unsupported keywords are silently ignored — the playground's contract is
 * a simple form, not a faithful Draft-07 implementation.
 */
import type { JsonSchema } from "../data/playground-mocks.js";

export interface ValidationError {
  path: string;
  message: string;
}
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Shape + calendar-validity check (rejects 2026-13-99, 2025-02-30, etc). */
function isValidIsoDate(s: string): boolean {
  if (!ISO_DATE.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d!));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m! - 1 &&
    dt.getUTCDate() === d
  );
}

export function validateAgainstSchema(value: unknown, schema: JsonSchema): ValidationResult {
  const errors: ValidationError[] = [];
  walk(value, schema, "", errors);
  return { valid: errors.length === 0, errors };
}

function walk(value: unknown, schema: JsonSchema, path: string, errors: ValidationError[]): void {
  if (schema.type) {
    if (!matchesType(value, schema.type)) {
      errors.push({ path, message: `expected ${schema.type}` });
      return; // bail — downstream checks would compound errors
    }
  }
  if (schema.enum && !schema.enum.includes(value as string | number)) {
    errors.push({ path, message: `must be one of ${schema.enum.join(", ")}` });
    return;
  }

  if (schema.type === "string") {
    const s = value as string;
    if (schema.minLength != null && s.length < schema.minLength) {
      errors.push({ path, message: `must be ≥ ${schema.minLength} chars` });
    }
    if (schema.maxLength != null && s.length > schema.maxLength) {
      errors.push({ path, message: `must be ≤ ${schema.maxLength} chars` });
    }
    if (schema.format === "date" && !isValidIsoDate(s)) {
      errors.push({ path, message: "must be YYYY-MM-DD" });
    }
  }

  if (schema.type === "number" || schema.type === "integer") {
    const n = value as number;
    if (schema.minimum != null && n < schema.minimum) {
      errors.push({ path, message: `must be ≥ ${schema.minimum}` });
    }
    if (schema.maximum != null && n > schema.maximum) {
      errors.push({ path, message: `must be ≤ ${schema.maximum}` });
    }
    if (schema.multipleOf != null) {
      // Floating-point safe: round n/step to nearest int and compare.
      const step = schema.multipleOf;
      const k = Math.round(n / step);
      if (Math.abs(k * step - n) > 1e-9) {
        errors.push({ path, message: `must be a multiple of ${step}` });
      }
    }
  }

  if (schema.type === "array" && Array.isArray(value)) {
    if (schema.minItems != null && value.length < schema.minItems) {
      errors.push({ path, message: `must have ≥ ${schema.minItems} items` });
    }
    if (schema.maxItems != null && value.length > schema.maxItems) {
      errors.push({ path, message: `must have ≤ ${schema.maxItems} items` });
    }
    if (schema.items) {
      value.forEach((item, i) => walk(item, schema.items!, `${path}[${i}]`, errors));
    }
  }

  if (schema.type === "object" && value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    for (const k of schema.required ?? []) {
      if (!(k in obj)) errors.push({ path: childPath(path, k), message: "is required" });
    }
    if (schema.properties) {
      for (const [k, sub] of Object.entries(schema.properties)) {
        if (k in obj) walk(obj[k], sub, childPath(path, k), errors);
      }
      if (schema.additionalProperties === false) {
        for (const k of Object.keys(obj)) {
          if (!(k in schema.properties)) {
            errors.push({ path: childPath(path, k), message: "is not allowed" });
          }
        }
      }
    }
  }
}

function matchesType(v: unknown, t: NonNullable<JsonSchema["type"]>): boolean {
  switch (t) {
    case "string":
      return typeof v === "string";
    case "boolean":
      return typeof v === "boolean";
    case "number":
      return typeof v === "number" && Number.isFinite(v);
    case "integer":
      return typeof v === "number" && Number.isInteger(v);
    case "array":
      return Array.isArray(v);
    case "object":
      return !!v && typeof v === "object" && !Array.isArray(v);
  }
}

function childPath(parent: string, key: string): string {
  return parent ? `${parent}.${key}` : key;
}
