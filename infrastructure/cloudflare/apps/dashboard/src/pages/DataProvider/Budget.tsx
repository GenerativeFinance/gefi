import React from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { Gauge } from "@gefi/ui/primitives/Gauge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Spinner } from "@gefi/ui/Spinner.js";

export default function DataProviderBudget(): React.ReactElement {
  const datasets = useApi(() => stubClient.getDatasets());

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Data Provider</div>
        <h1 className="page-header__title">Privacy Budget Tracker</h1>
        <p className="page-header__sub">Differential privacy budget (ε) consumed per dataset across all federated rounds. Lower ε = stronger privacy guarantee.</p>
      </div>

      <div className="gf-card section" style={{ padding:"var(--space-5)", background:"var(--color-brand-subtle)", border:"1px solid var(--color-brand)" }}>
        <p style={{ margin:0, fontSize:"var(--font-size-sm)", color:"var(--color-text-2)", lineHeight:"var(--line-height-relaxed)" }}>
          <strong>About DP-SGD:</strong> Each federated round adds Gaussian noise calibrated to your chosen ε. Total budget tracks how much privacy has been spent across all rounds. When your budget is exhausted, the dataset can no longer participate in new rounds until the next privacy accounting period.
        </p>
      </div>

      {datasets.isLoading && <Spinner />}
      {datasets.data && (
        <div className="grid-3">
          {datasets.data.map((d) => {
            const pct = d.privacyBudgetUsed / d.privacyBudgetMax;
            return (
              <div key={d.id} className="gf-card" style={{ textAlign:"center" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"var(--space-2)", marginBottom:"var(--space-4)" }}>
                  <strong style={{ fontSize:"var(--font-size-md)" }}>{d.name}</strong>
                  <JurisdictionBadge region={d.jurisdiction} />
                </div>
                <Gauge
                  value={d.privacyBudgetUsed}
                  max={d.privacyBudgetMax}
                  label={`ε: ${d.privacyBudgetUsed.toFixed(2)} / ${d.privacyBudgetMax}`}
                  size={120}
                />
                <div style={{ marginTop:"var(--space-4)", display:"flex", flexDirection:"column", gap:"var(--space-2)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>
                    <span>Used</span><span className="num">{d.privacyBudgetUsed.toFixed(2)} ε</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>
                    <span>Remaining</span><span className="num">{(d.privacyBudgetMax - d.privacyBudgetUsed).toFixed(2)} ε</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>
                    <span>Utilisation</span>
                    <span className="num" style={{ color: pct > 0.75 ? "var(--color-loss)" : pct > 0.5 ? "var(--color-warn)" : "var(--color-profit)" }}>
                      {(pct*100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                {pct > 0.75 && (
                  <div style={{ marginTop:"var(--space-3)", padding:"var(--space-2)", background:"var(--color-warn-subtle)", borderRadius:"var(--radius-sm)", fontSize:"var(--font-size-xs)", color:"var(--color-warn)" }}>
                    ⚠ Budget almost exhausted — increase ε limit or wait for next accounting period.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
