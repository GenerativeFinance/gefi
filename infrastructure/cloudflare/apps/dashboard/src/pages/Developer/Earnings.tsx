import React from "react";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { Sparkline } from "@gefi/ui/primitives/Sparkline.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";

const MONTHLY = [3200, 4100, 3800, 5200, 6100, 7400, 8200, 9100, 10200, 11400, 12400, 13800];
const ROWS = [
  { date: "2026-05-01", model: "AlphaQuant EU", event: "Subscription renewal", amount: 1200, jurisdiction: "eu" },
  { date: "2026-04-28", model: "AlphaQuant EU", event: "New subscriber",       amount:  400, jurisdiction: "eu" },
  { date: "2026-04-20", model: "AlphaQuant EU", event: "Usage fees (inference)", amount: 180, jurisdiction: "eu" },
  { date: "2026-04-15", model: "AlphaQuant EU", event: "Subscription renewal", amount: 1200, jurisdiction: "eu" },
];

export default function DeveloperEarnings(): React.ReactElement {
  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Developer</div>
        <h1 className="page-header__title">Earnings & Analytics</h1>
        <p className="page-header__sub">Revenue from subscriptions, inference fees, and federated training rewards.</p>
      </div>

      <div className="grid-4 section">
        <MetricCard label="This Month" value="$12,400" trend={{ value: 8.7, direction: "up", label: "vs last" }} />
        <MetricCard label="All Time" value="$94,800" />
        <MetricCard label="Active Subscribers" value="42" sub="Paying seats" />
        <MetricCard label="Avg Revenue / Sub" value="$295" sub="Monthly" />
      </div>

      <div className="gf-card section">
        <div className="gf-card__header"><h3 className="gf-card__title">Monthly revenue</h3></div>
        <Sparkline data={MONTHLY} color="var(--color-profit)" height={120} strokeWidth={2} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-2)" }}>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>Jun 2025</span>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>May 2026</span>
        </div>
      </div>

      <section className="section">
        <div className="section__header"><h2 className="section__title">Recent transactions</h2></div>
        <div className="gf-card" style={{ padding: 0 }}>
          <table className="gf-table">
            <thead><tr><th>Date</th><th>Model</th><th>Jurisdiction</th><th>Event</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i}>
                  <td className="num" style={{ fontSize: "var(--font-size-xs)" }}>{r.date}</td>
                  <td>{r.model}</td>
                  <td><JurisdictionBadge region={r.jurisdiction} /></td>
                  <td style={{ color: "var(--color-muted)", fontSize: "var(--font-size-sm)" }}>{r.event}</td>
                  <td className="num" style={{ textAlign: "right", color: "var(--color-profit)", fontWeight: 600 }}>${r.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
