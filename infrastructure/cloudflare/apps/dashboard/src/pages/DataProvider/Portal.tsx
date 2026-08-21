import React from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { Gauge } from "@gefi/ui/primitives/Gauge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Button } from "@gefi/ui/Button.js";
import { Spinner } from "@gefi/ui/Spinner.js";

export default function DataProviderPortal(): React.ReactElement {
  const datasets = useApi(() => stubClient.getDatasets());
  const rounds   = useApi(() => stubClient.getFederationRounds(5));

  const totalBudgetUsed = datasets.data?.reduce((s, d) => s + d.privacyBudgetUsed, 0) ?? 0;
  const totalBudgetMax  = datasets.data?.reduce((s, d) => s + d.privacyBudgetMax, 0) ?? 30;

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Data Provider</div>
        <h1 className="page-header__title">Data Provider Portal</h1>
        <p className="page-header__sub">Register datasets, participate in federated rounds, and track your earnings and privacy budget.</p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
        <Button>+ Register dataset</Button>
        <Button variant="secondary" as="a" href="/data-provider/rounds">View fed rounds</Button>
        <Button variant="ghost" as="a" href="/data-provider/budget">Privacy budget →</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 240px", gap: "var(--space-5)", marginBottom: "var(--space-8)", alignItems: "start" }}>
        <MetricCard label="Datasets" value={datasets.data?.length ?? 0} sub="Registered" />
        <MetricCard label="Fed Rounds (30d)" value="8" sub="Participated" />
        <MetricCard label="Earnings (30d)" value="$4,820" trend={{ value: 12.3, direction: "up" }} />
        <div className="gf-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "var(--font-size-xs)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-muted)", marginBottom: "var(--space-3)" }}>Privacy Budget</div>
          <Gauge value={totalBudgetUsed} max={totalBudgetMax} label="ε used / total" size={100} />
          <p style={{ margin: "var(--space-2) 0 0", fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>
            {totalBudgetUsed.toFixed(1)} / {totalBudgetMax.toFixed(0)} ε
          </p>
        </div>
      </div>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">My Datasets</h2>
          <Link to="/data-provider/datasets"><Button size="sm" variant="ghost">Manage →</Button></Link>
        </div>
        {datasets.isLoading && <Spinner />}
        {datasets.data && (
          <div className="gf-card" style={{ padding: 0 }}>
            <table className="gf-table">
              <thead>
                <tr><th>Name</th><th>Jurisdiction</th><th style={{ textAlign:"right" }}>Rows</th><th>ε Used / Max</th><th /></tr>
              </thead>
              <tbody>
                {datasets.data.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong></td>
                    <td><JurisdictionBadge region={d.jurisdiction} /></td>
                    <td className="num" style={{ textAlign:"right" }}>{d.rowCount.toLocaleString()}</td>
                    <td style={{ minWidth: 180 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"var(--space-3)" }}>
                        <div className="gf-progress" style={{ flex: 1 }}>
                          <div className={`gf-progress__fill ${d.privacyBudgetUsed/d.privacyBudgetMax > 0.75 ? "gf-progress__fill--loss" : d.privacyBudgetUsed/d.privacyBudgetMax > 0.5 ? "gf-progress__fill--warn" : ""}`}
                               style={{ width:`${(d.privacyBudgetUsed/d.privacyBudgetMax)*100}%` }} />
                        </div>
                        <span className="num" style={{ fontSize:"var(--font-size-xs)", whiteSpace:"nowrap" }}>
                          {d.privacyBudgetUsed.toFixed(1)} / {d.privacyBudgetMax}
                        </span>
                      </div>
                    </td>
                    <td><Button size="sm" variant="ghost">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Recent Federation Rounds</h2>
          <Link to="/data-provider/rounds"><Button size="sm" variant="ghost">All rounds →</Button></Link>
        </div>
        {rounds.isLoading && <Spinner />}
        {rounds.data && (
          <div className="gf-card" style={{ padding: 0 }}>
            <table className="gf-table">
              <thead><tr><th>Round</th><th>Model</th><th>Status</th><th style={{ textAlign:"right" }}>Participants</th><th>Accuracy</th></tr></thead>
              <tbody>
                {rounds.data.map((r) => (
                  <tr key={r.id}>
                    <td className="num" style={{ fontSize:"var(--font-size-xs)" }}>#{r.roundNumber}</td>
                    <td style={{ fontSize:"var(--font-size-sm)" }}>{r.modelId}</td>
                    <td><span style={{ fontSize:"var(--font-size-xs)", fontFamily:"var(--font-mono)", background:"var(--color-surface-2)", padding:"2px 8px", borderRadius:"var(--radius-full)" }}>{r.status}</span></td>
                    <td className="num" style={{ textAlign:"right" }}>{r.participantCount}</td>
                    <td className="num">{r.accuracy ? `${(r.accuracy * 100).toFixed(1)}%` : "—"}</td>
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
