import React, { useState } from "react";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Button } from "@gefi/ui/Button.js";

type QueueStatus = "pending" | "review" | "compliant" | "violation";
interface QueueItem { id: string; name: string; author: string; jurisdiction: string; submittedAt: string; status: QueueStatus; risk: string; checks: string[]; }

const QUEUE: QueueItem[] = [
  { id:"mdl-010", name:"GammaFactor EU",       author:"Priya Nair",  jurisdiction:"eu",   submittedAt:"2026-05-02", status:"pending",   risk:"medium", checks:["explainability","backtesting","jurisdiction"] },
  { id:"mdl-011", name:"DeltaArbitrage US",     author:"Jin Park",    jurisdiction:"us",   submittedAt:"2026-05-01", status:"review",    risk:"high",   checks:["explainability","backtesting"] },
  { id:"mdl-012", name:"EpsilonCarry APAC",     author:"Amir Hassan", jurisdiction:"apac", submittedAt:"2026-04-29", status:"compliant", risk:"low",    checks:["explainability","backtesting","jurisdiction","sanctions"] },
];

export default function AdminModelQueue(): React.ReactElement {
  const [queue, setQueue] = useState<QueueItem[]>(QUEUE);

  function approve(id: string): void {
    setQueue((q) => q.map((m) => m.id===id ? { ...m, status:"compliant" as const } : m));
  }
  function reject(id: string): void {
    setQueue((q) => q.map((m) => m.id===id ? { ...m, status:"violation" as const } : m));
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Admin</div>
        <h1 className="page-header__title">Model Approval Queue</h1>
        <p className="page-header__sub">Review model submissions for compliance before they go live on the marketplace.</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-4)" }}>
        {queue.map((m) => (
          <div key={m.id} className="gf-card">
            <div style={{ display:"flex", alignItems:"flex-start", gap:"var(--space-5)" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"var(--space-3)", marginBottom:"var(--space-2)" }}>
                  <h3 style={{ margin:0, fontSize:"var(--font-size-md)", fontWeight:600 }}>{m.name}</h3>
                  <JurisdictionBadge region={m.jurisdiction} />
                  <ComplianceBadge status={m.status} />
                  <span style={{ fontSize:"var(--font-size-xs)", background:"var(--color-surface-2)", padding:"2px 8px", borderRadius:"var(--radius-full)", color: m.risk==="high"?"var(--color-loss)":m.risk==="medium"?"var(--color-warn)":"var(--color-profit)" }}>
                    {m.risk} risk
                  </span>
                </div>
                <div style={{ fontSize:"var(--font-size-sm)", color:"var(--color-muted)", marginBottom:"var(--space-3)" }}>
                  By <strong>{m.author}</strong> · Submitted {m.submittedAt}
                </div>
                <div style={{ display:"flex", gap:"var(--space-2)", flexWrap:"wrap" }}>
                  {["explainability","backtesting","jurisdiction","sanctions"].map((check) => {
                    const done = m.checks.includes(check);
                    return (
                      <span key={check} style={{ fontSize:"var(--font-size-xs)", padding:"2px 8px", borderRadius:"var(--radius-full)", background: done ? "var(--color-compliant-subtle)" : "var(--color-surface-2)", color: done ? "var(--color-compliant)" : "var(--color-muted)" }}>
                        {done ? "✓" : "○"} {check}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div style={{ display:"flex", gap:"var(--space-3)", flexShrink:0 }}>
                <Button size="sm" variant="ghost">Review full report</Button>
                {m.status==="pending" || m.status==="review" ? (
                  <>
                    <Button size="sm" onClick={() => approve(m.id)}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => reject(m.id)}>Reject</Button>
                  </>
                ) : (
                  <Button size="sm" variant="ghost" disabled>
                    {m.status==="compliant" ? "Approved ✓" : "Rejected ✕"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {queue.length===0 && (
          <div className="gf-empty"><div className="gf-empty__icon">✅</div><h3 className="gf-empty__title">Queue empty — all models reviewed</h3></div>
        )}
      </div>
    </div>
  );
}
