/**
 * Federation Status Dashboard — cross-cutting page.
 *
 * Sections:
 *   - Active rounds visualisation with status chips
 *   - Privacy budget gauges per data source
 *   - Contribution leaderboard (TMC-Shapley scores)
 *   - Network topology SVG (stub — force-directed deferred post-launch)
 *   - TEE attestation status per node
 */
import React, { useState } from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { Gauge } from "@gefi/ui/primitives/Gauge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Button } from "@gefi/ui/Button.js";
import { Spinner } from "@gefi/ui/Spinner.js";
import { Badge } from "@gefi/ui/Badge.js";

const STATUS_COLOR: Record<string, string> = {
  init:       "var(--color-muted)",
  invite:     "var(--color-brand)",
  collect:    "var(--color-warn)",
  aggregate:  "var(--color-brand)",
  distribute: "var(--color-profit)",
  closed:     "var(--color-compliant)",
  failed:     "var(--color-loss)",
};

const NODES = [
  { id:"node-001", region:"eu",   attestation:"sgx",   status:"online",  uptimePct:99.9 },
  { id:"node-002", region:"us",   attestation:"nitro",  status:"online",  uptimePct:99.7 },
  { id:"node-003", region:"uk",   attestation:"stub",   status:"online",  uptimePct:98.2 },
  { id:"node-004", region:"apac", attestation:"nitro",  status:"offline", uptimePct:95.0 },
  { id:"node-005", region:"mena", attestation:"stub",   status:"online",  uptimePct:99.1 },
];

function TopologyGraph(): React.ReactElement {
  const r = 140;
  const cx = 200; const cy = 160;
  const online = NODES.filter((n) => n.status==="online");

  return (
    <div className="topology">
      <svg width={400} height={320} viewBox="0 0 400 320" aria-label="Network topology">
        {/* Central aggregator */}
        <circle cx={cx} cy={cy} r={22} fill="var(--color-brand)" opacity={0.9} />
        <text x={cx} y={cy+5} textAnchor="middle" fontSize={10} fill="#fff" fontFamily="var(--font-mono)">AGG</text>

        {/* Node positions (pentagon) */}
        {NODES.map((node, i) => {
          const angle = (i / NODES.length) * 2 * Math.PI - Math.PI / 2;
          const nx = cx + r * Math.cos(angle);
          const ny = cy + r * Math.sin(angle);
          const color = node.status==="online" ? "var(--color-compliant)" : "var(--color-loss)";
          return (
            <g key={node.id}>
              {/* Edge to aggregator */}
              <line x1={cx} y1={cy} x2={nx} y2={ny}
                stroke={node.status==="online"?"var(--color-brand)":"var(--color-border-strong)"}
                strokeWidth={node.status==="online"?1.5:0.5} strokeDasharray={node.status==="offline"?"4,4":undefined} opacity={0.5} />
              {/* Node circle */}
              <circle cx={nx} cy={ny} r={14} fill={color} opacity={0.85} />
              <text x={nx} y={ny+4} textAnchor="middle" fontSize={8} fill="#fff" fontFamily="var(--font-mono)">
                {node.region.toUpperCase()}
              </text>
              {/* Attestation badge */}
              <text x={nx} y={ny+22} textAnchor="middle" fontSize={7} fill="var(--color-muted)" fontFamily="var(--font-mono)">
                {node.attestation}
              </text>
            </g>
          );
        })}
      </svg>
      <p style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)", textAlign:"center", margin:0 }}>
        Stub SVG topology. Production: force-directed D3/Three.js graph fed by real-time node health events.
      </p>
    </div>
  );
}

export default function FederationStatus(): React.ReactElement {
  const rounds      = useApi(() => stubClient.getFederationRounds(10));
  const datasets    = useApi(() => stubClient.getDatasets());
  const [selRound, setSelRound]  = useState<string | null>(null);
  const contributors = useApi(() =>
    selRound ? stubClient.getContributors(selRound) : Promise.resolve([])
  , [selRound]);

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Cross-cutting</div>
        <h1 className="page-header__title">Federation Status Dashboard</h1>
        <p className="page-header__sub">Active rounds, privacy budgets, contribution leaderboard, and network topology.</p>
      </div>

      {/* KPIs */}
      <div className="grid-4 section">
        <MetricCard label="Active Rounds" value={rounds.data?.filter((r)=>["collect","aggregate","invite"].includes(r.status)).length ?? "…"} />
        <MetricCard label="Total Participants" value={rounds.data?.reduce((s,r)=>s+r.participantCount,0).toLocaleString() ?? "…"} />
        <MetricCard label="Nodes Online" value={`${NODES.filter((n)=>n.status==="online").length} / ${NODES.length}`} />
        <MetricCard label="Avg Accuracy" value={
          rounds.data
            ? `${((rounds.data.filter((r)=>r.accuracy).reduce((s,r)=>s+(r.accuracy??0),0)/(rounds.data.filter((r)=>r.accuracy).length||1))*100).toFixed(1)}%`
            : "…"
        } />
      </div>

      <div className="grid-2-1 section" style={{ alignItems:"start" }}>
        {/* Rounds table */}
        <div>
          <div className="section__header"><h2 className="section__title">Active Rounds</h2></div>
          {rounds.isLoading && <Spinner />}
          {rounds.data && (
            <div className="gf-card" style={{ padding:0 }}>
              <table className="gf-table">
                <thead><tr><th>Round</th><th>Model</th><th>Status</th><th style={{ textAlign:"right" }}>Nodes</th><th>Actions</th></tr></thead>
                <tbody>
                  {rounds.data.slice(0,7).map((r) => (
                    <tr key={r.id} style={{ cursor:"pointer", background:selRound===r.id?"var(--color-brand-subtle)":"" }}
                        onClick={() => setSelRound((s) => s===r.id ? null : r.id)}>
                      <td className="num">#{r.roundNumber}</td>
                      <td style={{ fontSize:"var(--font-size-sm)" }}>{r.modelId}</td>
                      <td>
                        <span style={{ fontSize:"var(--font-size-xs)", fontFamily:"var(--font-mono)", padding:"2px 8px", borderRadius:"var(--radius-full)", background:"var(--color-surface-2)", color:STATUS_COLOR[r.status]??"var(--color-muted)" }}>
                          {r.status}
                        </span>
                      </td>
                      <td className="num" style={{ textAlign:"right" }}>{r.participantCount}</td>
                      <td>
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelRound(r.id); }}>
                          Leaderboard
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Contribution leaderboard */}
          {selRound && (
            <div style={{ marginTop:"var(--space-5)" }}>
              <div className="section__header">
                <h2 className="section__title">Contribution Leaderboard — Round {selRound}</h2>
              </div>
              {contributors.isLoading && <Spinner />}
              {contributors.data && contributors.data.length > 0 && (
                <div className="gf-card" style={{ padding:0 }}>
                  <table className="gf-table">
                    <thead><tr><th>Rank</th><th>Node</th><th>Attestation</th><th style={{ textAlign:"right" }}>Samples</th><th style={{ textAlign:"right" }}>Shapley Score</th><th style={{ textAlign:"right" }}>Reward (ETH)</th></tr></thead>
                    <tbody>
                      {[...contributors.data].sort((a,b)=>b.score-a.score).map((c,i) => (
                        <tr key={c.participantId}>
                          <td style={{ fontWeight:600, color: i===0?"var(--color-profit)":i===1?"var(--color-warn)":"var(--color-muted)" }}>
                            {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                          </td>
                          <td className="num">{c.participantId}</td>
                          <td>
                            <Badge variant={c.attestationKind==="sgx"?"profit":c.attestationKind==="nitro"?"brand":"neutral"}>
                              {c.attestationKind}
                            </Badge>
                          </td>
                          <td className="num" style={{ textAlign:"right" }}>{c.sampleCount.toLocaleString()}</td>
                          <td className="num" style={{ textAlign:"right", fontWeight:600 }}>{c.score.toFixed(4)}</td>
                          <td className="num" style={{ textAlign:"right", color:"var(--color-profit)" }}>{c.reward?.toFixed(4) ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-5)" }}>
          {/* Network topology */}
          <div className="gf-card">
            <div className="gf-card__header"><h3 className="gf-card__title">Network Topology</h3></div>
            <TopologyGraph />
          </div>

          {/* Node attestation */}
          <div className="gf-card">
            <div className="gf-card__header"><h3 className="gf-card__title">TEE Attestation</h3></div>
            <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-2)" }}>
              {NODES.map((n) => (
                <div key={n.id} style={{ display:"flex", alignItems:"center", gap:"var(--space-3)", padding:"var(--space-2) 0", borderBottom:"1px solid var(--color-border)" }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:n.status==="online"?"var(--color-profit)":"var(--color-loss)", flexShrink:0 }} />
                  <JurisdictionBadge region={n.region} />
                  <span className="num" style={{ flex:1, fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>{n.id}</span>
                  <Badge variant={n.attestation==="sgx"?"profit":n.attestation==="nitro"?"brand":"neutral"}>
                    {n.attestation}
                  </Badge>
                  <span className="num" style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>{n.uptimePct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy budgets */}
          {datasets.data && (
            <div className="gf-card">
              <div className="gf-card__header"><h3 className="gf-card__title">Privacy Budgets</h3></div>
              <div style={{ display:"flex", gap:"var(--space-4)", justifyContent:"center", flexWrap:"wrap" }}>
                {datasets.data.map((d) => (
                  <div key={d.id} style={{ textAlign:"center" }}>
                    <Gauge value={d.privacyBudgetUsed} max={d.privacyBudgetMax} size={72} />
                    <div style={{ fontSize:"9px", color:"var(--color-muted)", marginTop:"var(--space-1)", maxWidth:80 }}>{d.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
