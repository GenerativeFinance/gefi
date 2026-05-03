import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const UI_SRC = resolve(__dirname, "../../packages/ui/src");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Anchored regex aliases — no accidental prefix substitutions.
      // Exact barrel aliases.
      { find: /^@gefi\/ui\/primitives$/, replacement: `${UI_SRC}/primitives/index.ts` },
      { find: /^@gefi\/ui$/,            replacement: `${UI_SRC}/index.ts` },
      // Wildcard sub-paths: strip optional .js so Vite resolves to the real .tsx.
      //   @gefi/ui/Button.js              → packages/ui/src/Button           (Vite: → .tsx)
      //   @gefi/ui/primitives/MetricCard.js → packages/ui/src/primitives/MetricCard
      { find: /^@gefi\/ui\/(.+?)(?:\.js)?$/, replacement: `${UI_SRC}/$1` },
      // Legacy deep-relative imports that still exist in a few non-test files.
      { find: /^(\.\.\/)+packages\/ui\/src(.*)$/, replacement: `${UI_SRC}$2` },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
  },
});
