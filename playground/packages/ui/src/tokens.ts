/**
 * GeFi Playground brand tokens.
 *
 * The single source of truth for colors, radii, spacing, typography.
 * `generate-css.ts` reads this file and emits `tokens.css`, which is
 * consumed by both the Jekyll web app and the Cloudflare Worker HTML.
 *
 * Changing one token here must repaint both apps after `pnpm build:tokens`.
 */

export const colors = {
  bg: "#0B0E1A",
  surface: "#141826",
  brand: "#6D5BFF",
  accent: "#22D3EE",
  text: "#E6E8F0",
  muted: "#8A8FA3",
} as const;

export const radii = {
  sm: "6px",
  md: "10px",
  lg: "16px",
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "40px",
  xxl: "64px",
} as const;

export const fonts = {
  sans: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const tokens = { colors, radii, spacing, fonts } as const;

export type Tokens = typeof tokens;

/** Render the token set as :root CSS custom properties. */
export function tokensToCss(t: Tokens = tokens): string {
  const lines: string[] = [];
  lines.push("/* AUTO-GENERATED from packages/ui/src/tokens.ts — do not edit by hand. */");
  lines.push(":root {");
  for (const [k, v] of Object.entries(t.colors)) lines.push(`  --color-${k}: ${v};`);
  for (const [k, v] of Object.entries(t.radii)) lines.push(`  --radius-${k}: ${v};`);
  for (const [k, v] of Object.entries(t.spacing)) lines.push(`  --space-${k}: ${v};`);
  for (const [k, v] of Object.entries(t.fonts)) lines.push(`  --font-${k}: ${v};`);
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}
