/**
 * YAML mirror drift test.
 *
 * The committed `rules/<jurisdiction>.yaml` files MUST stay in sync with
 * the TypeScript modules. This test re-emits the YAML in-memory and
 * compares it byte-for-byte against the on-disk copy. Drift is a CI
 * failure.
 *
 * Set `UPDATE_YAML=1` to regenerate the YAML files instead of asserting:
 *
 *     UPDATE_YAML=1 pnpm vitest run src/yaml-sync.test.ts
 *     # or, equivalently:
 *     pnpm --filter @gefi/compliance-rules sync-yaml
 */

import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { RULES } from "./rules/index.js";
import type { Jurisdiction } from "./types.js";
import { rulesToYaml } from "./yaml.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const RULES_DIR = resolve(HERE, "..", "rules");
const UPDATE = process.env["UPDATE_YAML"] === "1";

function bucketByJurisdiction(): Map<Jurisdiction, typeof RULES[number][]> {
  const out = new Map<Jurisdiction, typeof RULES[number][]>();
  for (const r of RULES) {
    const list = out.get(r.jurisdiction) ?? [];
    list.push(r);
    out.set(r.jurisdiction, list);
  }
  return out;
}

describe("YAML mirror is in sync with TypeScript rule modules", () => {
  const grouped = bucketByJurisdiction();

  if (UPDATE) {
    if (!existsSync(RULES_DIR)) mkdirSync(RULES_DIR, { recursive: true });
  }

  for (const [jurisdiction, rules] of grouped) {
    it(`${jurisdiction}.yaml matches src/rules/${jurisdiction}.ts`, () => {
      const expected = rulesToYaml(rules);
      const path = resolve(RULES_DIR, `${jurisdiction}.yaml`);
      if (UPDATE) {
        writeFileSync(path, expected, "utf8");
        return;
      }
      expect(existsSync(path), `missing YAML mirror at ${path}; run \`pnpm --filter @gefi/compliance-rules sync-yaml\``).toBe(true);
      const actual = readFileSync(path, "utf8");
      expect(actual).toBe(expected);
    });
  }
});
