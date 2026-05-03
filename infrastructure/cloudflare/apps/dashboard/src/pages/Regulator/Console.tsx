/**
 * Regulator Console — landing page for regulators / auditors.
 *
 * Shows: jurisdiction-filtered compliance events, recent audit entries,
 * cryptographic proof summary, quick-action buttons (subpoena, download).
 */
import React from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Button } from "@gefi/ui/Button.js";
import { Spinner } from "@gefi/ui/Spinner.js";
import { Badge } from "@gefi/ui/Badge.js";

export default function RegulatorConsole(): React.ReactElement {
  const events = useApi(() => stubClient.getComplianceEvents(10));
  const audit  = useApi(() => stubClient.getAuditLog(undefined, 8));

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Regulator</div>
        <h1 className="page-header__title">Regulatory Console</h1>
        <p className="page-header__sub">Cross-firm audit dashboard with cryptographic proofs. Every event is independently verifiable.</p>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
        <Button>Issue legal hold</Button>
        <Button variant="secondary">Download audit export</Button>
        <Button variant="secondary" as="a" href="/regulator/proof">Verify proof →</Button>
        <Button variant="ghost" as="a" href="/regulator/standards">Standards library →</Button>
      </div>

      {/* KPIs */}
      <div className="grid-4 section">
        <MetricCard label="Events (30d)" value="148" sub="Across all firms" />
        <MetricCard label="Open Violations" value="2" trend={{ value: 2, direction: "down", label: "vs 5 last period" }} />
        <MetricCard label="Proofs Verified" value="1,204" sub="Since inception" />
        <MetricCard label="Avg Response Time" value="4.2h" sub="To regulatory queries" />
      </div>

      {/* Compliance events */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Compliance Events</h2>
          <Link to="/compliance"><Button size="sm" variant="ghost">Full compliance center →</Button></Link>
        </div>
        {events.isLoading && <Spinner />}
        {events.data && (
          <div className="gf-card" style={{ padding: 0 }}>
            <table className="gf-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Jurisdiction</th>
                  <th>Kind</th>
                  <th>Summary</th>
                  <th>Severity</th>
                  <th>Proof</th>
                </tr>
              </thead>
              <tbody>
                {events.data.map((ev) => (
                  <tr key={ev.id}>
                    <td className="num" style={{ fontSize: "var(--font-size-xs)", whiteSpace: "nowrap" }}>
                      {new Date(ev.timestamp).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td><JurisdictionBadge region={ev.jurisdiction} /></td>
                    <td style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>{ev.kind.replace(/_/g, " ")}</td>
                    <td style={{ fontSize: "var(--font-size-sm)" }}>{ev.summary}</td>
                    <td>
                      <Badge variant={ev.severity === "critical" ? "loss" : ev.severity === "warn" ? "warn" : "neutral"} dot>
                        {ev.severity}
                      </Badge>
                    </td>
                    <td>
                      {ev.proofHash
                        ? <Link to="/regulator/proof"><Button size="sm" variant="ghost">Verify</Button></Link>
                        : <span style={{ color: "var(--color-muted)", fontSize: "var(--font-size-xs)" }}>N/A</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Audit log preview */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Hash-Chained Audit Log</h2>
          <Link to="/regulator/audit"><Button size="sm" variant="ghost">Full log →</Button></Link>
        </div>
        {audit.isLoading && <Spinner />}
        {audit.data && (
          <div className="proof-viewer">
            {audit.data.slice(0, 5).map((entry) => (
              <div key={entry.id} className="proof-viewer__row">
                <span className="proof-viewer__key">{entry.id}</span>
                <span className="proof-viewer__val">
                  <span style={{ color: "var(--color-muted)" }}>{new Date(entry.timestamp).toISOString().slice(0, 19)}Z</span>
                  {" · "}
                  <span style={{ color: "var(--color-brand)" }}>{entry.action}:{entry.resource}</span>
                  {" · "}
                  <span style={{ color: "var(--color-text-2)", fontSize: "0.9em" }}>{entry.hash.slice(0, 18)}…</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
