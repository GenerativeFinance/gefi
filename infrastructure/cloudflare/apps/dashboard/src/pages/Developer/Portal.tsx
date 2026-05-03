/**
 * Developer Portal — landing page for developers.
 *
 * Shows: published models, earnings summary, quick actions (new model,
 * open IDE, run backtest), recent compliance review results.
 */
import React from "react";
import { Link } from "react-router-dom";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Button } from "@gefi/ui/Button.js";
import { Badge } from "@gefi/ui/Badge.js";

const MY_MODELS = [
  { id: "mdl-001", name: "AlphaQuant EU", status: "live", jurisdiction: "eu", complianceStatus: "compliant" as const, subscribers: 42, revenue30d: 12_400 },
  { id: "mdl-002", name: "BetaDraft",     status: "draft", jurisdiction: "us", complianceStatus: "pending" as const, subscribers: 0, revenue30d: 0 },
];

const RECENT_REVIEWS = [
  { model: "AlphaQuant EU", result: "passed", date: "2026-05-01", note: "All MiFID II explainability checks passed." },
  { model: "BetaDraft",     result: "pending", date: "2026-05-03", note: "Awaiting manual review by GeFi compliance team." },
];

export default function DeveloperPortal(): React.ReactElement {
  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Developer</div>
        <h1 className="page-header__title">Developer Portal</h1>
        <p className="page-header__sub">Build, test, publish, and monetise AI financial models on GeFi.</p>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
        <Button as="a" href="/developer/models">+ New model</Button>
        <Button variant="secondary" as="a" href="/developer/ide">Open Cloud IDE</Button>
        <Button variant="secondary" as="a" href="/developer/backtest">Run backtest</Button>
        <Button variant="ghost" as="a" href="https://docs.gefi.io" target="_blank">Docs ↗</Button>
      </div>

      {/* Earnings KPIs */}
      <div className="grid-4 section">
        <MetricCard label="Revenue (30d)" value="$12,400" trend={{ value: 18.4, direction: "up", label: "vs prev" }} />
        <MetricCard label="Active Subscribers" value="42" sub="Across 1 live model" />
        <MetricCard label="Models Published" value="1" sub="1 in draft" />
        <MetricCard label="Avg Rating" value="4.7" sub="Out of 5" />
      </div>

      {/* My models */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">My Models</h2>
          <Link to="/developer/models"><Button size="sm" variant="ghost">View all →</Button></Link>
        </div>
        <div className="gf-card" style={{ padding: 0 }}>
          <table className="gf-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Jurisdiction</th>
                <th>Status</th>
                <th>Compliance</th>
                <th style={{ textAlign: "right" }}>Subscribers</th>
                <th style={{ textAlign: "right" }}>Revenue (30d)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MY_MODELS.map((m) => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td><JurisdictionBadge region={m.jurisdiction} /></td>
                  <td>
                    <Badge variant={m.status === "live" ? "profit" : "neutral"} dot>
                      {m.status}
                    </Badge>
                  </td>
                  <td><ComplianceBadge status={m.complianceStatus} /></td>
                  <td className="num" style={{ textAlign: "right" }}>{m.subscribers}</td>
                  <td className="num" style={{ textAlign: "right" }}>${m.revenue30d.toLocaleString()}</td>
                  <td><Button size="sm" variant="ghost">Edit</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Compliance reviews */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Compliance Review Queue</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {RECENT_REVIEWS.map((r, i) => (
            <div key={i} className="gf-card" style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)" }}>
              <ComplianceBadge status={r.result === "passed" ? "compliant" : "pending"} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "var(--font-size-sm)" }}>{r.model}</strong>
                <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--font-size-sm)", color: "var(--color-muted)" }}>{r.note}</p>
              </div>
              <span className="num" style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)", whiteSpace: "nowrap" }}>{r.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
