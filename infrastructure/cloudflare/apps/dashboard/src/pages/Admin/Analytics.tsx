import React from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { Sparkline } from "@gefi/ui/primitives/Sparkline.js";
import { Spinner } from "@gefi/ui/Spinner.js";

const INFERENCES = [420000,480000,510000,560000,620000,590000,680000,720000,750000,800000,840000,842100];
const REVENUE    = [18000,22000,24000,28000,32000,30000,38000,42000,44000,50000,58000,62000];
const LATENCY    = [48,52,45,50,47,43,46,44,41,42,38,39];

export default function AdminAnalytics(): React.ReactElement {
  const metrics = useApi(() => stubClient.getPlatformMetrics());

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Admin</div>
        <h1 className="page-header__title">Platform Analytics</h1>
        <p className="page-header__sub">Usage, revenue, latency, and growth metrics across all tenants.</p>
      </div>

      {metrics.isLoading && <Spinner />}
      {metrics.data && (
        <>
          <div className="grid-4 section">
            <MetricCard label="DAU" value={metrics.data.dailyActiveUsers.toLocaleString()} trend={{ value:4.2,direction:"up" }} />
            <MetricCard label="Inferences (MTD)" value={`${(metrics.data.totalInferences/1e6).toFixed(2)}M`} trend={{ value:9.1,direction:"up" }} />
            <MetricCard label="Revenue (MTD)" value={`$${(metrics.data.revenueMonth/1000).toFixed(0)}k`} trend={{ value:12.4,direction:"up" }} />
            <MetricCard label="p99 Latency" value="39 ms" trend={{ value:5.2,direction:"down" }} />
          </div>

          <div className="grid-3">
            <div className="gf-card">
              <div className="gf-card__header"><h3 className="gf-card__title">Daily inferences</h3></div>
              <Sparkline data={INFERENCES} color="var(--color-brand)" height={100} strokeWidth={2} />
            </div>
            <div className="gf-card">
              <div className="gf-card__header"><h3 className="gf-card__title">Monthly revenue</h3></div>
              <Sparkline data={REVENUE} color="var(--color-profit)" height={100} strokeWidth={2} />
            </div>
            <div className="gf-card">
              <div className="gf-card__header"><h3 className="gf-card__title">API p99 latency (ms)</h3></div>
              <Sparkline data={LATENCY} color="var(--color-warn)" height={100} strokeWidth={2} area={false} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
