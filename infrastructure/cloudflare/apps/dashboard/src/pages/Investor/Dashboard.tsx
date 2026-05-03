/**
 * Investor Dashboard — primary landing page for investors.
 *
 * Sections:
 *   - Portfolio summary metrics (AUM, Sharpe, Max DD, VaR, returns)
 *   - Subscribed model positions table with sparklines
 *   - Risk exposure heatmap
 *   - Per-jurisdiction compliance status strip
 *   - Empty state for new users (no subscriptions)
 */
import React from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { TrendIndicator } from "@gefi/ui/primitives/TrendIndicator.js";
import { RiskBadge } from "@gefi/ui/primitives/RiskBadge.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Sparkline } from "@gefi/ui/primitives/Sparkline.js";
import { Spinner } from "@gefi/ui/Spinner.js";
import { Button } from "@gefi/ui/Button.js";

const RISK_COLORS: Record<string, string> = {
  low:      "var(--color-risk-low)",
  medium:   "var(--color-risk-medium)",
  high:     "var(--color-risk-high)",
  critical: "var(--color-risk-critical)",
};

function fmt(n: number, decimals = 2): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtB(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${fmt(n)}`;
}

export default function InvestorDashboard(): React.ReactElement {
  const portfolio = useApi(() => stubClient.getPortfolioSummary());
  const positions = useApi(() => stubClient.getModelPositions());
  const compliance = useApi(() => stubClient.getComplianceEvents(6));

  if (portfolio.isLoading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-12)" }}><Spinner size="lg" /></div>;
  }

  const p = portfolio.data;
  const hasPositions = (positions.data?.length ?? 0) > 0;

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header__eyebrow">Investor</div>
        <h1 className="page-header__title">Portfolio Overview</h1>
        <p className="page-header__sub">Real-time view of your subscribed models, risk exposure, and compliance status.</p>
      </div>

      {/* KPI metrics */}
      {p && (
        <div className="grid-4 section">
          <MetricCard
            label="Total AUM"
            value={fmtB(p.totalAum)}
            trend={{ value: p.monthReturn, direction: "up", label: "30d" }}
          />
          <MetricCard
            label="Sharpe Ratio"
            value={fmt(p.sharpeRatio)}
            sub="Annualised"
            sparkline={[1.8, 2.0, 1.9, 2.1, 2.2, 2.3, 2.34]}
          />
          <MetricCard
            label="Max Drawdown"
            value={`${fmt(p.maxDrawdown)}%`}
            trend={{ value: Math.abs(p.maxDrawdown), direction: "down" }}
          />
          <MetricCard
            label="VaR (95%)"
            value={`${fmt(p.varP95)}%`}
            sub="1-day, parametric"
          />
          <MetricCard
            label="1-Day Return"
            value={`${p.dayReturn > 0 ? "+" : ""}${fmt(p.dayReturn)}%`}
            trend={{ value: p.dayReturn, direction: p.dayReturn >= 0 ? "up" : "down" }}
          />
          <MetricCard
            label="7-Day Return"
            value={`${p.weekReturn > 0 ? "+" : ""}${fmt(p.weekReturn)}%`}
            trend={{ value: p.weekReturn, direction: p.weekReturn >= 0 ? "up" : "down" }}
          />
          <MetricCard
            label="30-Day Return"
            value={`${p.monthReturn > 0 ? "+" : ""}${fmt(p.monthReturn)}%`}
            trend={{ value: p.monthReturn, direction: p.monthReturn >= 0 ? "up" : "down" }}
          />
          <MetricCard
            label="Active Models"
            value={p.activeModels}
            sub="Subscribed"
          />
        </div>
      )}

      {/* Model positions */}
      <section className="section">
        <div className="section__header">
          <div>
            <h2 className="section__title">Model Positions</h2>
            <p className="section__sub">Subscribed models sorted by AUM allocation</p>
          </div>
          <Button size="sm" variant="secondary">+ Subscribe to model</Button>
        </div>

        {positions.isLoading && <Spinner />}

        {!positions.isLoading && !hasPositions && (
          <div className="gf-empty">
            <div className="gf-empty__icon">📊</div>
            <h3 className="gf-empty__title">No models subscribed yet</h3>
            <p className="gf-empty__desc">Browse the model catalogue and subscribe to your first AI financial model to see performance data here.</p>
            <Button as="a" href="https://gefi.io/models">Browse models</Button>
          </div>
        )}

        {hasPositions && (
          <div className="gf-card" style={{ padding: 0 }}>
            <table className="gf-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Jurisdiction</th>
                  <th style={{ textAlign: "right" }}>Allocation</th>
                  <th style={{ textAlign: "right" }}>7-Day</th>
                  <th style={{ textAlign: "right" }}>30-Day</th>
                  <th>Risk</th>
                  <th>Compliance</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {positions.data!.map((pos) => (
                  <tr key={pos.id}>
                    <td><strong style={{ fontSize: "var(--font-size-sm)" }}>{pos.name}</strong></td>
                    <td><JurisdictionBadge region={pos.jurisdiction} /></td>
                    <td className="num" style={{ textAlign: "right" }}>{fmt(pos.allocation)}%</td>
                    <td style={{ textAlign: "right" }}>
                      <TrendIndicator value={pos.return7d} direction={pos.return7d >= 0 ? "up" : "down"} />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <TrendIndicator value={pos.return30d} direction={pos.return30d >= 0 ? "up" : "down"} />
                    </td>
                    <td><RiskBadge level={pos.riskLevel as "low" | "medium" | "high" | "critical"} /></td>
                    <td><ComplianceBadge status={pos.complianceStatus} /></td>
                    <td>
                      <Sparkline
                        data={pos.sparkline}
                        color={RISK_COLORS[pos.riskLevel] ?? "var(--color-brand)"}
                        height={28}
                        width={80}
                        strokeWidth={1.5}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Risk heatmap */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Risk Exposure Heatmap</h2>
        </div>
        <div className="gf-card">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "var(--space-2)" }}>
            {positions.data?.flatMap((pos) =>
              pos.sparkline.slice(-5).map((v, i) => {
                const pct = (v - 95) / 40;
                const clamped = Math.max(0, Math.min(1, pct));
                const bg = clamped > 0.7 ? "var(--color-loss)" : clamped > 0.4 ? "var(--color-warn)" : "var(--color-profit)";
                return (
                  <div
                    key={`${pos.id}-${i}`}
                    className="heatmap__cell"
                    style={{ background: bg, opacity: 0.6 + clamped * 0.4 }}
                    title={`${pos.name} t-${4 - i}: ${v}`}
                  >
                    {v}
                  </div>
                );
              })
            )}
          </div>
          <p style={{ margin: "var(--space-3) 0 0", fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>
            Last 5 periods per model. Green = within normal range, amber = elevated, red = breach.
          </p>
        </div>
      </section>

      {/* Compliance events strip */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Recent Compliance Events</h2>
          <Button size="sm" variant="ghost" as="a" href="/compliance">View all →</Button>
        </div>
        {compliance.isLoading && <Spinner />}
        {compliance.data && (
          <div className="gf-card" style={{ padding: 0 }}>
            <table className="gf-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Jurisdiction</th>
                  <th>Event</th>
                  <th>Summary</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {compliance.data.slice(0, 5).map((ev) => (
                  <tr key={ev.id}>
                    <td className="num" style={{ fontSize: "var(--font-size-xs)", whiteSpace: "nowrap" }}>
                      {new Date(ev.timestamp).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td><JurisdictionBadge region={ev.jurisdiction} /></td>
                    <td style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>{ev.kind.replace(/_/g, " ")}</td>
                    <td style={{ fontSize: "var(--font-size-sm)" }}>{ev.summary}</td>
                    <td>
                      <span className={`gf-badge gf-badge--${ev.severity === "critical" ? "loss" : ev.severity === "warn" ? "warn" : "neutral"}`}>
                        {ev.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
