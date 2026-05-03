/**
 * Worker-side HTML composition. Inlines the same brand tokens.css that
 * the Jekyll site links to, so editing tokens.ts repaints both surfaces.
 */
import { Button } from "@gefi-playground/ui";
import { tokensCss } from "./generated/tokens.css.js";

export function renderHome(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AI Financial Model Library</title>
  <meta name="description" content="Federated. Audited. Accountable." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
  <style>${tokensCss}
    *,*::before,*::after{box-sizing:border-box}
    body{margin:0;background:var(--color-bg);color:var(--color-text);font-family:var(--font-sans);min-height:100dvh;display:grid;place-items:center;padding:var(--space-xl) var(--space-md)}
    h1{margin:0;font-size:clamp(2rem,6vw,3rem);font-weight:700;letter-spacing:-0.02em}
    p{margin:0;color:var(--color-muted)}
    .wrap{max-width:560px;text-align:center;display:grid;gap:var(--space-lg)}
    .btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:var(--radius-md);font-weight:600;text-decoration:none;border:1px solid transparent;cursor:pointer}
    .btn--primary{background:var(--color-brand);color:#fff}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>AI Financial Model Library</h1>
    <p>Federated. Audited. Accountable.</p>
    <p>${Button({ label: "Open the Jekyll site", href: "http://localhost:4000", variant: "primary" })}</p>
    <p style="font-size:.85rem">Worker dev server running on :8787 \u00b7 POST <code>/api/subscribe</code></p>
  </div>
</body>
</html>`;
}
