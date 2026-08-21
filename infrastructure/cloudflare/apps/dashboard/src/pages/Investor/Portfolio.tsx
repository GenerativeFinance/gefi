import React from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { Sparkline } from "@gefi/ui/primitives/Sparkline.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { Spinner } from "@gefi/ui/Spinner.js";
import { Button } from "@gefi/ui/Button.js";

export default function InvestorPortfolio(): React.ReactElement {
  const positions = useApi(() => stubClient.getModelPositions());

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Investor</div>
        <h1 className="page-header__title">Portfolio Detail</h1>
        <p className="page-header__sub">Allocation breakdown and per-model compliance status across all subscriptions.</p>
      </div>

      {positions.isLoading && <Spinner size="lg" />}

      {positions.data && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {positions.data.map((pos) => (
            <div key={pos.id} className="gf-card">
              <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-6)", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                    <h3 style={{ margin: 0, fontSize: "var(--font-size-lg)", fontWeight: 700 }}>{pos.name}</h3>
                    <JurisdictionBadge region={pos.jurisdiction} />
                    <ComplianceBadge status={pos.complianceStatus} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: "var(--space-6)", marginTop: "var(--space-4)" }}>
                    <div>
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Allocation</div>
                      <div className="num" style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-text)" }}>{pos.allocation.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>7-Day</div>
                      <div className="num" style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: pos.return7d >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>
                        {pos.return7d >= 0 ? "+" : ""}{pos.return7d.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>30-Day</div>
                      <div className="num" style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: pos.return30d >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>
                        {pos.return30d >= 0 ? "+" : ""}{pos.return30d.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)", marginBottom: "var(--space-2)" }}>10-period trend</div>
                  <Sparkline data={pos.sparkline} height={56} width={160} color={pos.return30d >= 0 ? "var(--color-profit)" : "var(--color-loss)"} />
                </div>
                <div style={{ flexShrink: 0, alignSelf: "center" }}>
                  <Button size="sm" variant="secondary">View details</Button>
                </div>
              </div>
              {/* Allocation bar */}
              <div style={{ marginTop: "var(--space-4)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)", color: "var(--color-muted)", marginBottom: "var(--space-1)" }}>
                  <span>Portfolio weight</span><span className="num">{pos.allocation.toFixed(1)}%</span>
                </div>
                <div className="gf-progress">
                  <div className="gf-progress__fill" style={{ width: `${pos.allocation}%`, background: pos.return30d >= 0 ? "var(--color-profit)" : "var(--color-loss)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
