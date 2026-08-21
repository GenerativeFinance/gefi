import React, { useState } from "react";
import { Button } from "@gefi/ui/Button.js";
import { Select } from "@gefi/ui/Select.js";
import { Input } from "@gefi/ui/Input.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { Sparkline } from "@gefi/ui/primitives/Sparkline.js";

const STUB_EQUITY = [100,102,101,104,103,106,108,107,110,109,112,114,113,116,118,115,119,121,120,123];
const STUB_DD     = [0,-0.3,-0.8,-0.4,-1.1,-0.6,-1.9,-1.4,-0.9,-2.1,-1.6,-3.2,-2.8,-1.4,-0.6,-3.8,-2.1,-0.9,-1.4,-0.2];

export default function DeveloperBacktest(): React.ReactElement {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [config, setConfig] = useState({ model: "mdl-001", period: "1Y", jurisdiction: "eu" });

  async function run(): Promise<void> {
    setRunning(true);
    setDone(false);
    await new Promise((r) => setTimeout(r, 1400));
    setRunning(false);
    setDone(true);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Developer</div>
        <h1 className="page-header__title">Backtesting Console</h1>
        <p className="page-header__sub">Run historical simulations against GeFi's jurisdiction-resident datasets.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "var(--space-6)", alignItems: "start" }}>
        {/* Config panel */}
        <div className="gf-card">
          <h3 className="gf-card__title" style={{ marginBottom: "var(--space-5)" }}>Configuration</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <Select label="Model" options={[{ value:"mdl-001", label:"AlphaQuant EU"},{ value:"mdl-002", label:"BetaDraft"}]} value={config.model} onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))} />
            <Select label="Backtest period" options={[{value:"3M",label:"3 months"},{value:"6M",label:"6 months"},{value:"1Y",label:"1 year"},{value:"3Y",label:"3 years"}]} value={config.period} onChange={(e) => setConfig((c) => ({ ...c, period: e.target.value }))} />
            <Select label="Jurisdiction" options={[{value:"eu",label:"EU"},{value:"us",label:"US"},{value:"uk",label:"UK"}]} value={config.jurisdiction} onChange={(e) => setConfig((c) => ({ ...c, jurisdiction: e.target.value }))} />
            <Input label="Initial capital (USD)" type="number" defaultValue="1000000" />
            <Input label="Transaction cost (bps)" type="number" defaultValue="5" />
            <Button onClick={() => { void run(); }} loading={running} style={{ marginTop: "var(--space-2)" }}>
              {running ? "Running…" : "▶ Run backtest"}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div>
          {!done && !running && (
            <div className="gf-empty">
              <div className="gf-empty__icon">📉</div>
              <h3 className="gf-empty__title">Configure and run a backtest</h3>
              <p className="gf-empty__desc">Select a model, period, and jurisdiction then click "Run backtest" to see historical performance.</p>
            </div>
          )}

          {running && (
            <div className="gf-empty">
              <div style={{ fontSize: 40 }}>⏳</div>
              <h3 className="gf-empty__title">Running backtest…</h3>
              <p className="gf-empty__desc">Replaying {config.period} of market data against {config.model} in {config.jurisdiction.toUpperCase()} Workers.</p>
            </div>
          )}

          {done && (
            <>
              <div className="grid-4" style={{ marginBottom: "var(--space-5)" }}>
                <MetricCard label="Total Return" value="+23.1%" trend={{ value: 23.1, direction: "up" }} />
                <MetricCard label="Sharpe Ratio" value="2.18" />
                <MetricCard label="Max Drawdown" value="-3.8%" trend={{ value: 3.8, direction: "down" }} />
                <MetricCard label="Win Rate" value="61.4%" />
              </div>
              <div className="gf-card section">
                <div className="gf-card__header"><h3 className="gf-card__title">Equity curve</h3></div>
                <Sparkline data={STUB_EQUITY} color="var(--color-profit)" height={160} width={600} strokeWidth={2} />
              </div>
              <div className="gf-card">
                <div className="gf-card__header"><h3 className="gf-card__title">Drawdown profile</h3></div>
                <Sparkline data={STUB_DD} color="var(--color-loss)" height={80} width={600} strokeWidth={1.5} area={false} />
              </div>
              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <Button size="sm">Submit for compliance review</Button>
                <Button size="sm" variant="secondary">Export report (PDF)</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
