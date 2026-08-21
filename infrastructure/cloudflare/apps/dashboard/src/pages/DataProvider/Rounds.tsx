import React from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { Spinner } from "@gefi/ui/Spinner.js";
import { Button } from "@gefi/ui/Button.js";

export default function DataProviderRounds(): React.ReactElement {
  const rounds = useApi(() => stubClient.getFederationRounds(20));

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Data Provider</div>
        <h1 className="page-header__title">Federation Round History</h1>
        <p className="page-header__sub">All federated training rounds you participated in, with contribution scores and rewards.</p>
      </div>

      {rounds.isLoading && <Spinner />}
      {rounds.data && (
        <div className="gf-card" style={{ padding: 0 }}>
          <table className="gf-table">
            <thead>
              <tr>
                <th>Round</th><th>Model</th><th>Status</th>
                <th style={{ textAlign:"right" }}>Participants</th>
                <th style={{ textAlign:"right" }}>Accuracy</th>
                <th style={{ textAlign:"right" }}>ε Used</th>
                <th>Completed</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rounds.data.map((r) => (
                <tr key={r.id}>
                  <td className="num">#{r.roundNumber}</td>
                  <td style={{ fontSize:"var(--font-size-sm)" }}>{r.modelId}</td>
                  <td>
                    <span style={{ fontSize:"var(--font-size-xs)", fontFamily:"var(--font-mono)",
                      background: r.status === "closed" ? "var(--color-compliant-subtle)" : "var(--color-surface-2)",
                      color: r.status === "closed" ? "var(--color-compliant)" : "var(--color-muted)",
                      padding:"2px 8px", borderRadius:"var(--radius-full)" }}>
                      {r.status}
                    </span>
                  </td>
                  <td className="num" style={{ textAlign:"right" }}>{r.participantCount}</td>
                  <td className="num" style={{ textAlign:"right" }}>{r.accuracy ? `${(r.accuracy*100).toFixed(1)}%` : "—"}</td>
                  <td className="num" style={{ textAlign:"right" }}>{r.privacyBudgetUsed?.toFixed(2) ?? "—"}</td>
                  <td className="num" style={{ fontSize:"var(--font-size-xs)" }}>
                    {r.completedAt ? r.completedAt.slice(0,10) : "—"}
                  </td>
                  <td><Button size="sm" variant="ghost">Details</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
