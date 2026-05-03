/**
 * Cloud IDE — stub page.
 *
 * Production: embeds VS Code Server running in a Cloudflare Worker via WASM.
 * Stub: displays an informational pane explaining the feature and its roadmap.
 *
 * DEFERRED: VS Code Server WASM is a post-launch infrastructure addition.
 * Operator steps: build code-server wasm target, deploy as a Worker route on
 * app.gefi.io/ide/:session, proxy via Durable Object for session persistence.
 */
import React from "react";
import { Button } from "@gefi/ui/Button.js";

export default function DeveloperIDE(): React.ReactElement {
  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Developer</div>
        <h1 className="page-header__title">Cloud IDE</h1>
        <p className="page-header__sub">VS Code environment running at the edge — no local setup required.</p>
      </div>

      <div className="ide-stub" style={{ minHeight: 520 }}>
        <div className="ide-stub__bar">
          <div className="ide-stub__dot" style={{ background: "#ff5f57" }} />
          <div className="ide-stub__dot" style={{ background: "#ffbd2e" }} />
          <div className="ide-stub__dot" style={{ background: "#28c840" }} />
          <span style={{ marginLeft: "var(--space-3)", color: "#8892A4", fontSize: "var(--font-size-xs)", fontFamily: "var(--font-mono)" }}>
            gefi-ide — /workspace/my-model
          </span>
        </div>
        <div className="ide-stub__body">
          <div style={{ fontSize: 48 }}>💻</div>
          <div className="ide-stub__badge">Coming post-launch</div>
          <p style={{ maxWidth: 420, lineHeight: 1.6, margin: 0 }}>
            The Cloud IDE will embed VS Code Server compiled to WASM, running directly in a Cloudflare Worker with a persistent Durable Object session.
            Your model code, backtest results, and dependencies stay within your jurisdiction's Worker region.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
            <Button as="a" href="https://github.com/cdr/code-server" target="_blank" variant="secondary" size="sm">
              code-server upstream ↗
            </Button>
            <Button as="a" href="https://gefi.io/docs/ide" target="_blank" variant="ghost" size="sm">
              Roadmap →
            </Button>
          </div>
          <div style={{ marginTop: "var(--space-4)", padding: "var(--space-4) var(--space-6)", background: "#212540", borderRadius: "var(--radius-md)", textAlign: "left", maxWidth: 480 }}>
            <div style={{ color: "#4ADE80", marginBottom: "var(--space-2)", fontSize: "var(--font-size-xs)" }}># Planned environment</div>
            <div>$ <span style={{ color: "#BDB0FF" }}>pip install gefi-sdk</span></div>
            <div>$ <span style={{ color: "#BDB0FF" }}>gefi backtest --model ./my_model.py --period 1Y</span></div>
            <div>$ <span style={{ color: "#BDB0FF" }}>gefi publish --jurisdiction eu</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
