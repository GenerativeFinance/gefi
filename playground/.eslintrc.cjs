/* eslint-env node */
module.exports = {
  root: true,
  env: { node: true, browser: true, es2022: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    "_site/",
    ".wrangler/",
    ".jekyll-cache/",
    "vendor/",
    "**/*.generated.*",
    "apps/web/assets/css/tokens.css",
    "apps/web/vendor/",
    "apps/web/.jekyll-cache/",
    "apps/web/_site/",
    "apps/api/src/generated/",
    "packages/ui/dist/",
    "packages/ui/tokens.css",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
  },
};
