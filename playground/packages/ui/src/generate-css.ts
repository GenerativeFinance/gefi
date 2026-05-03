#!/usr/bin/env tsx
/**
 * Build-time script: emit tokens.css to every consumer.
 *
 * Targets:
 *   - packages/ui/tokens.css                (canonical, exported)
 *   - apps/web/assets/css/tokens.css        (Jekyll <link>)
 *   - apps/api/src/generated/tokens.css.ts  (Worker inline <style>)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tokensToCss } from "./tokens.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repo = resolve(__dirname, "..", "..", "..");

const css = tokensToCss();

const targets = [
  resolve(repo, "packages/ui/tokens.css"),
  resolve(repo, "apps/web/assets/css/tokens.css"),
];

for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, css, "utf8");
  console.log(`wrote ${target}`);
}

const tsTarget = resolve(repo, "apps/api/src/generated/tokens.css.ts");
mkdirSync(dirname(tsTarget), { recursive: true });
writeFileSync(
  tsTarget,
  `/* AUTO-GENERATED — do not edit. Regenerate with \`pnpm build:tokens\`. */\nexport const tokensCss = ${JSON.stringify(css)};\n`,
  "utf8",
);
console.log(`wrote ${tsTarget}`);
