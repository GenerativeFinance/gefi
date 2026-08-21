/* eslint-env node */
/**
 * Tailwind config seeded with the brand tokens. Phase 0 ships hand-written CSS
 * (tokens.css + app.css) only; later phases can opt in to Tailwind by extending
 * this config and adding `@tailwind` directives to a per-app stylesheet.
 *
 * NOTE: values below are mirrored from packages/ui/src/tokens.ts. A `tokens.test.ts`
 * snapshot guards against drift; if you change tokens.ts, change this too.
 */
module.exports = {
  content: [
    "../../apps/web/**/*.{html,md,liquid}",
    "../../apps/api/src/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0E1A",
        surface: "#141826",
        brand: "#6D5BFF",
        accent: "#22D3EE",
        text: "#E6E8F0",
        muted: "#8A8FA3",
      },
      borderRadius: { sm: "6px", md: "10px", lg: "16px" },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
