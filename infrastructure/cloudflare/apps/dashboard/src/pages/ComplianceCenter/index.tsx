/**
 * Compliance Status Center — cross-cutting page, accessible to all personas.
 *
 * Sections:
 *   - Jurisdiction map (visual strip showing status per region)
 *   - Per-jurisdiction status cards with upcoming audit calendar
 *   - Recent compliance events log
 *   - Quick actions: Notify Auditor, Notify Lawyer, Download Evidence Pack
 *   - Upcoming audit calendar
 */
import React, { useState } from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Button } from "@gefi/ui/Button.js";
import { Badge } from "@gefi/ui/Badge.js";
import { Spinner } from "@gefi/ui/Spinner.js";
import { useToast } from "../../hooks/useToast.js";

const JURISDICTIONS: Array<{
  id:string; name:string; status:"compliant"|"review"|"violation"|"pending";
  nextAudit:string; frameworks:string[]; dataResidency:string; contact:string;
}> = [
  { id:"eu",     name:"European Union", status:"compliant", nextAudit:"2026-07-01", frameworks:["MiFID II","GDPR","DORA"],          dataResidency:"Frankfurt (DE)",  contact:"eu-compliance@gefi.io" },
  { id:"us",     name:"United States",  status:"review",    nextAudit:"2026-06-15", frameworks:["SEC IA","CFTC","FinCEN"],           dataResidency:"Ashburn (US-VA)", contact:"us-compliance@gefi.io" },
  { id:"uk",     name:"United Kingdom", status:"compliant", nextAudit:"2026-08-01", frameworks:["FCA Consumer Duty","ICO","SMCR"], dataResidency:"London (UK)",     contact:"uk-compliance@gefi.io" },
  { id:"mena",   name:"MENA",           status:"pending",   nextAudit:"2026-09-01", frameworks:["DFSA","SCA"],                      dataResidency:"Dubai (UAE)",     contact:"mena-compliance@gefi.io" },
  { id:"apac",   name:"APAC",           status:"compliant", nextAudit:"2026-07-15", frameworks:["MAS TRM","ASIC RG97"],             dataResidency:"Singapore (SG)", contact:"apac-compliance@gefi.io" },
  { id:"ch",     name:"Switzerland",    status:"pending",   nextAudit:"2026-10-01", frameworks:["FINMA","FADP"],                   dataResidency:"Geneva (CH)",     contact:"ch-compliance@gefi.io" },
];

const AUDIT_CALENDAR = [
  { date:"2026-06-15", jurisdiction:"us",   event:"SEC quarterly review",           type:"regulatory" },
  { date:"2026-07-01", jurisdiction:"eu",   event:"MiFID II annual audit",          type:"audit" },
  { date:"2026-07-15", jurisdiction:"apac", event:"MAS TRM assessment",             type:"audit" },
  { date:"2026-08-01", jurisdiction:"uk",   event:"FCA Consumer Duty review",       type:"regulatory" },
  { date:"2026-09-01", jurisdiction:"mena", event:"DFSA initial compliance review", type:"regulatory" },
];

function JurisdictionCard({ jur }: { jur: typeof JURISDICTIONS[0] }): React.ReactElement {
  return (
    <div className="gf-card">
      <div style={{ display:"flex", alignItems:"center", gap:"var(--space-3)", marginBottom:"var(--space-3)" }}>
        <JurisdictionBadge region={jur.id} />
        <strong style={{ fontSize:"var(--font-size-md)", flex:1 }}>{jur.name}</strong>
        <ComplianceBadge status={jur.status} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-2)", marginBottom:"var(--space-3)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"var(--font-size-xs)" }}>
          <span style={{ color:"var(--color-muted)" }}>Data residency</span>
          <span className="num">{jur.dataResidency}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"var(--font-size-xs)" }}>
          <span style={{ color:"var(--color-muted)" }}>Next audit</span>
          <span className="num">{jur.nextAudit}</span>
        </div>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"var(--space-1)" }}>
        {jur.frameworks.map((fw) => (
          <span key={fw} className="gf-tag">{fw}</span>
        ))}
      </div>
      <div style={{ marginTop:"var(--space-4)", display:"flex", gap:"var(--space-2)" }}>
        <Button size="sm" variant="ghost">Notify auditor</Button>
        <Button size="sm" variant="ghost">Notify lawyer</Button>
      </div>
    </div>
  );
}

export default function ComplianceCenter(): React.ReactElement {
  const events = useApi(() => stubClient.getComplianceEvents(20));
  const { toast, toasts, dismiss } = useToast();
  const [filter, setFilter] = useState<string>("all");

  const filtered = events.data?.filter(
    (ev) => filter==="all" || ev.jurisdiction===filter
  ) ?? [];

  function notifyAll(): void {
    toast("success", "Notifications sent", "Auditors and lawyers across all active jurisdictions notified.");
  }

  return (
    <div>
      {/* Toast region */}
      <div className="gf-toast-region" role="log" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <div key={t.id} className={`gf-toast gf-toast--${t.kind}`}>
            <div className="gf-toast__body">
              <div className="gf-toast__title">{t.title}</div>
              {t.desc && <div className="gf-toast__desc">{t.desc}</div>}
            </div>
            <button onClick={() => dismiss(t.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"var(--color-muted)",fontSize:"14px" }} aria-label="Dismiss">✕</button>
          </div>
        ))}
      </div>

      <div className="page-header">
        <div className="page-header__eyebrow">Cross-cutting</div>
        <h1 className="page-header__title">Compliance Status Center</h1>
        <p className="page-header__sub">Real-time compliance status across all GeFi jurisdictions. Compliance is a feature, not friction.</p>
      </div>

      {/* Quick actions */}
      <div style={{ display:"flex", gap:"var(--space-3)", marginBottom:"var(--space-7)", flexWrap:"wrap" }}>
        <Button onClick={notifyAll}>📣 Notify all auditors + lawyers</Button>
        <Button variant="secondary">📥 Download evidence pack</Button>
        <Button variant="secondary" as="a" href="/regulator/proof">🔐 Verify cryptographic proof</Button>
      </div>

      {/* Jurisdiction overview strip */}
      <div className="gf-card section" style={{ padding:"var(--space-5)" }}>
        <div style={{ display:"flex", gap:"var(--space-3)", overflowX:"auto", paddingBottom:"var(--space-2)" }}>
          {JURISDICTIONS.map((j) => (
            <div key={j.id} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:"var(--space-2)",
              padding:"var(--space-4) var(--space-5)", borderRadius:"var(--radius-md)", flexShrink:0,
              background: j.status==="compliant"?"var(--color-compliant-subtle)":j.status==="review"?"var(--color-review-subtle)":j.status==="violation"?"var(--color-violation-subtle)":"var(--color-pending-subtle)",
              border:`1px solid ${j.status==="compliant"?"var(--color-compliant)":j.status==="review"?"var(--color-review)":j.status==="violation"?"var(--color-violation)":"var(--color-pending)"}`,
              cursor:"pointer",
            }}
            onClick={() => setFilter(j.id===filter?"all":j.id)}
            role="button"
            aria-pressed={filter===j.id}
            tabIndex={0}
            >
              <JurisdictionBadge region={j.id} />
              <ComplianceBadge status={j.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Per-jurisdiction cards */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Jurisdiction Status</h2>
        </div>
        <div className="grid-3">
          {JURISDICTIONS.map((j) => <JurisdictionCard key={j.id} jur={j} />)}
        </div>
      </section>

      {/* Upcoming audit calendar */}
      <section className="section">
        <div className="section__header"><h2 className="section__title">Upcoming Audit Calendar</h2></div>
        <div className="gf-card" style={{ padding:0 }}>
          <table className="gf-table">
            <thead><tr><th>Date</th><th>Jurisdiction</th><th>Event</th><th>Type</th><th /></tr></thead>
            <tbody>
              {AUDIT_CALENDAR.map((a, i) => (
                <tr key={i}>
                  <td className="num">{a.date}</td>
                  <td><JurisdictionBadge region={a.jurisdiction} /></td>
                  <td style={{ fontSize:"var(--font-size-sm)" }}>{a.event}</td>
                  <td>
                    <Badge variant={a.type==="regulatory"?"warn":"brand"}>{a.type}</Badge>
                  </td>
                  <td><Button size="sm" variant="ghost">Add to calendar</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Events log */}
      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Compliance Events Log</h2>
          <div style={{ display:"flex", gap:"var(--space-2)" }}>
            {["all","eu","us","uk","mena","apac"].map((j) => (
              <button key={j} onClick={() => setFilter(j)} style={{
                padding:"2px var(--space-3)", borderRadius:"var(--radius-full)",
                border:`1px solid ${filter===j?"var(--color-brand)":"var(--color-border)"}`,
                background:filter===j?"var(--color-brand)":"transparent",
                color:filter===j?"#fff":"var(--color-muted)",
                cursor:"pointer", fontSize:"var(--font-size-xs)", fontFamily:"var(--font-sans)",
              }} aria-pressed={filter===j}>
                {j.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {events.isLoading && <Spinner />}
        {filtered.length > 0 && (
          <div className="gf-card" style={{ padding:0 }}>
            <table className="gf-table">
              <thead><tr><th>Time</th><th>Jurisdiction</th><th>Kind</th><th>Summary</th><th>Severity</th><th>Proof</th></tr></thead>
              <tbody>
                {filtered.map((ev) => (
                  <tr key={ev.id}>
                    <td className="num" style={{ fontSize:"var(--font-size-xs)", whiteSpace:"nowrap" }}>
                      {new Date(ev.timestamp).toLocaleString("en-GB",{dateStyle:"short",timeStyle:"short"})}
                    </td>
                    <td><JurisdictionBadge region={ev.jurisdiction} /></td>
                    <td style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>{ev.kind.replace(/_/g," ")}</td>
                    <td style={{ fontSize:"var(--font-size-sm)" }}>{ev.summary}</td>
                    <td>
                      <span className={`gf-badge gf-badge--${ev.severity==="critical"?"loss":ev.severity==="warn"?"warn":"neutral"}`}>
                        {ev.severity}
                      </span>
                    </td>
                    <td>
                      {ev.proofHash
                        ? <a href="/regulator/proof" style={{ fontSize:"var(--font-size-xs)", color:"var(--color-brand)" }}>Verify →</a>
                        : <span style={{ color:"var(--color-muted)", fontSize:"var(--font-size-xs)" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!events.isLoading && filtered.length===0 && (
          <div className="gf-empty"><div className="gf-empty__icon">🛡️</div><h3 className="gf-empty__title">No events for this filter</h3></div>
        )}
      </section>
    </div>
  );
}
