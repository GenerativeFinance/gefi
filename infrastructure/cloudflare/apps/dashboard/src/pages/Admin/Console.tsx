import React from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Button } from "@gefi/ui/Button.js";
import { Sparkline } from "@gefi/ui/primitives/Sparkline.js";
import { Spinner } from "@gefi/ui/Spinner.js";

const DAU = [1200,1350,1180,1420,1600,1550,1720,1800,1680,1840,1900,1842];

export default function AdminConsole(): React.ReactElement {
  const metrics = useApi(() => stubClient.getPlatformMetrics());
  const events  = useApi(() => stubClient.getComplianceEvents(5));

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Admin</div>
        <h1 className="page-header__title">Admin Console</h1>
        <p className="page-header__sub">Platform health, user moderation, model approval queue, and feature flags.</p>
      </div>

      <div style={{ display:"flex", gap:"var(--space-3)", marginBottom:"var(--space-8)", flexWrap:"wrap" }}>
        <Button as="a" href="/admin/models">Model approval queue</Button>
        <Button variant="secondary" as="a" href="/admin/users">User moderation</Button>
        <Button variant="secondary" as="a" href="/admin/flags">Feature flags</Button>
        <Button variant="ghost" as="a" href="/admin/analytics">Analytics →</Button>
      </div>

      {/* Platform KPIs */}
      {metrics.isLoading && <Spinner />}
      {metrics.data && (
        <>
          <div className="grid-4 section">
            <MetricCard label="Daily Active Users" value={metrics.data.dailyActiveUsers.toLocaleString()} trend={{ value: 4.2, direction: "up" }} />
            <MetricCard label="Models Deployed" value={metrics.data.modelsDeployed} sub="Live in production" />
            <MetricCard label="Total Inferences" value={`${(metrics.data.totalInferences / 1e6).toFixed(2)}M`} />
            <MetricCard label="Platform Health" value={`${metrics.data.complianceScore.toFixed(1)}%`} trend={{ value: 0.8, direction: "up" }} />
            <MetricCard label="Open Tickets" value={metrics.data.openTickets} trend={{ value: metrics.data.openTickets, direction: "down" }} />
            <MetricCard label="Revenue (MTD)" value={`$${(metrics.data.revenueMonth / 1000).toFixed(0)}k`} trend={{ value: 12.4, direction: "up" }} />
            <MetricCard label="Compliance Score" value={`${metrics.data.complianceScore}%`} sub="All jurisdictions" />
            <MetricCard label="SLA Uptime" value="99.97%" sub="Last 30 days" />
          </div>

          <div className="gf-card section">
            <div className="gf-card__header">
              <h3 className="gf-card__title">Daily active users (12 months)</h3>
            </div>
            <Sparkline data={DAU} color="var(--color-brand)" height={120} width={700} strokeWidth={2} />
          </div>
        </>
      )}

      {/* Recent compliance events (admin view) */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Recent Compliance Events</h2>
          <Link to="/compliance"><Button size="sm" variant="ghost">Compliance center →</Button></Link>
        </div>
        {events.isLoading && <Spinner />}
        {events.data && (
          <div className="gf-card" style={{ padding:0 }}>
            <table className="gf-table">
              <thead><tr><th>Time</th><th>Jurisdiction</th><th>Event</th><th>Summary</th><th>Severity</th><th /></tr></thead>
              <tbody>
                {events.data.map((ev) => (
                  <tr key={ev.id}>
                    <td className="num" style={{ fontSize:"var(--font-size-xs)", whiteSpace:"nowrap" }}>
                      {new Date(ev.timestamp).toLocaleString("en-GB",{dateStyle:"short",timeStyle:"short"})}
                    </td>
                    <td><JurisdictionBadge region={ev.jurisdiction} /></td>
                    <td style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>{ev.kind.replace(/_/g," ")}</td>
                    <td style={{ fontSize:"var(--font-size-sm)" }}>{ev.summary}</td>
                    <td>
                      <span className={`gf-badge gf-badge--${ev.severity==="critical"?"loss":ev.severity==="warn"?"warn":"neutral"}`}>
                        {ev.severity}
                      </span>
                    </td>
                    <td><Button size="sm" variant="ghost">Act</Button></td>
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
