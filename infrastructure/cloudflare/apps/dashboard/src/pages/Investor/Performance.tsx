import React from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { Sparkline } from "@gefi/ui/primitives/Sparkline.js";
import { Spinner } from "@gefi/ui/Spinner.js";

const PERIODS = ["1D","1W","1M","3M","6M","1Y","All"];
const BENCHMARK = [98, 99, 100, 99.5, 101, 100.5, 102, 103, 102.5, 104];
const PORTFOLIO  = [100, 101.5, 101, 103, 104.5, 103.5, 106, 107.5, 107, 109];

export default function InvestorPerformance(): React.ReactElement {
  const portfolio = useApi(() => stubClient.getPortfolioSummary());

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Investor</div>
        <h1 className="page-header__title">Performance Attribution</h1>
        <p className="page-header__sub">Risk-adjusted returns, drawdown analysis, and benchmark comparison.</p>
      </div>

      {portfolio.isLoading && <Spinner size="lg" />}

      {portfolio.data && (
        <>
          {/* Period selector */}
          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-7)" }}>
            {PERIODS.map((p, i) => (
              <button key={p} style={{
                padding: "var(--space-1) var(--space-4)",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--color-border)",
                background: i === 2 ? "var(--color-brand)" : "var(--color-surface)",
                color: i === 2 ? "#fff" : "var(--color-muted)",
                cursor: "pointer",
                fontSize: "var(--font-size-xs)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}>{p}</button>
            ))}
          </div>

          {/* Chart area (stub SVG) */}
          <div className="gf-card section">
            <div className="gf-card__header">
              <h3 className="gf-card__title">Portfolio vs Benchmark (SPX)</h3>
              <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--font-size-xs)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 2, background: "var(--color-brand)", display: "inline-block" }} /> Portfolio</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 2, background: "var(--color-muted)", display: "inline-block" }} /> SPX</span>
              </div>
            </div>
            <div style={{ position: "relative", display: "flex", gap: 0 }}>
              <Sparkline data={PORTFOLIO} color="var(--color-brand)" height={180} width={640} strokeWidth={2} />
              <div style={{ position: "absolute", top: 0, left: 0 }}>
                <Sparkline data={BENCHMARK} color="var(--color-muted)" height={180} width={640} strokeWidth={1.5} area={false} />
              </div>
            </div>
          </div>

          {/* Risk metrics */}
          <div className="grid-4 section">
            <MetricCard label="Sharpe Ratio" value={portfolio.data.sharpeRatio.toFixed(2)} sub="Annualised, risk-free 5.25%" />
            <MetricCard label="Max Drawdown" value={`${portfolio.data.maxDrawdown.toFixed(2)}%`} trend={{ value: Math.abs(portfolio.data.maxDrawdown), direction: "down" }} />
            <MetricCard label="VaR (95%)" value={`${portfolio.data.varP95.toFixed(2)}%`} sub="1-day parametric" />
            <MetricCard label="Sortino Ratio" value="3.12" sub="Annualised" />
            <MetricCard label="Beta (vs SPX)" value="0.42" sub="12-month rolling" />
            <MetricCard label="Alpha" value="+4.81%" trend={{ value: 4.81, direction: "up" }} />
            <MetricCard label="Calmar Ratio" value="1.74" sub="Return / Max DD" />
            <MetricCard label="Win Rate" value="58.3%" sub="Monthly periods" />
          </div>

          {/* Drawdown chart */}
          <div className="gf-card section">
            <div className="gf-card__header">
              <h3 className="gf-card__title">Drawdown Profile</h3>
            </div>
            <Sparkline
              data={[0, -0.5, -1.2, -2.1, -3.4, -4.12, -3.8, -2.9, -1.5, -0.8, -0.3, 0]}
              color="var(--color-loss)"
              height={120}
              width={640}
              strokeWidth={1.5}
            />
            <p style={{ margin: "var(--space-3) 0 0", fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>
              Peak-to-trough drawdown. Maximum: <strong className="num">{portfolio.data.maxDrawdown.toFixed(2)}%</strong> on 2026-04-14.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
