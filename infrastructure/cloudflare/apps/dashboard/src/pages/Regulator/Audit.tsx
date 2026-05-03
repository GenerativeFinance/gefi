import React, { useState } from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { Input } from "@gefi/ui/Input.js";
import { Button } from "@gefi/ui/Button.js";
import { Spinner } from "@gefi/ui/Spinner.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";

export default function RegulatorAudit(): React.ReactElement {
  const [filter, setFilter] = useState("");
  const audit = useApi(() => stubClient.getAuditLog(undefined, 40));

  const rows = audit.data?.filter((e) =>
    !filter || e.action.includes(filter) || e.resource.includes(filter) || e.id.includes(filter)
  ) ?? [];

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Regulator</div>
        <h1 className="page-header__title">Audit Log</h1>
        <p className="page-header__sub">Immutable, hash-chained record of every action on the platform. Each entry includes a Merkle inclusion proof verifiable on-chain.</p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)", alignItems: "flex-end" }}>
        <div style={{ flex: 1, maxWidth: 400 }}>
          <Input label="Filter" placeholder="action, resource, or entry ID…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
        <Button variant="secondary" size="sm" onClick={() => setFilter("")}>Clear</Button>
        <Button variant="secondary" size="sm">Export CSV</Button>
        <Button size="sm">Issue legal hold on selection</Button>
      </div>

      {audit.isLoading && <Spinner />}

      <div className="gf-card" style={{ padding: 0 }}>
        <table className="gf-table">
          <thead>
            <tr>
              <th>Entry ID</th>
              <th>Timestamp</th>
              <th>Tenant</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Hash</th>
              <th>Chain</th>
              <th>Proof</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td className="num" style={{ fontSize: "var(--font-size-xs)" }}>{e.id}</td>
                <td className="num" style={{ fontSize: "var(--font-size-xs)", whiteSpace: "nowrap" }}>
                  {new Date(e.timestamp).toISOString().slice(0, 19)}Z
                </td>
                <td style={{ fontSize: "var(--font-size-xs)" }}>{e.tenantId}</td>
                <td><span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-xs)", color: "var(--color-brand)" }}>{e.action}</span></td>
                <td><span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-xs)" }}>{e.resource}</span></td>
                <td className="num" style={{ fontSize: "10px", color: "var(--color-muted)" }} title={e.hash}>{e.hash.slice(0, 14)}…</td>
                <td>
                  {e.prevHash
                    ? <span style={{ color: "var(--color-profit)", fontSize: "var(--font-size-xs)" }}>✓ linked</span>
                    : <span style={{ color: "var(--color-muted)", fontSize: "var(--font-size-xs)" }}>genesis</span>}
                </td>
                <td>
                  <Button size="sm" variant="ghost" as="a" href="/regulator/proof">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!audit.isLoading && rows.length === 0 && (
        <div className="gf-empty">
          <div className="gf-empty__icon">🔍</div>
          <h3 className="gf-empty__title">No entries match your filter</h3>
        </div>
      )}
    </div>
  );
}
