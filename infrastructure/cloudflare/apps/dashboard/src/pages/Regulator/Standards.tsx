import React, { useState } from "react";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { Button } from "@gefi/ui/Button.js";
import { Input } from "@gefi/ui/Input.js";

const STANDARDS = [
  { id:"mifid2",    name:"MiFID II",       jurisdiction:"eu",   status:"compliant" as const, version:"2018/C 277/01", summary:"Markets in Financial Instruments Directive. Requires explainability for algorithmic trading." },
  { id:"gdpr",     name:"GDPR",           jurisdiction:"eu",   status:"compliant" as const, version:"2016/679",      summary:"General Data Protection Regulation. Data residency and erasure rights enforced by GeFi." },
  { id:"sec-ia",   name:"SEC Reg IA",     jurisdiction:"us",   status:"review" as const,   version:"2024-rev",      summary:"Investment Advisers Act. AI model disclosures required for SEC-registered advisers." },
  { id:"fca-cd",   name:"FCA Consumer Duty", jurisdiction:"uk", status:"compliant" as const, version:"PS22/9",     summary:"Consumer Duty requires fair value assessment for retail investors." },
  { id:"mas-trm",  name:"MAS TRM",        jurisdiction:"apac", status:"pending" as const,   version:"2021",         summary:"Monetary Authority of Singapore Technology Risk Management guidelines." },
  { id:"iso42001", name:"ISO 42001",      jurisdiction:"global", status:"pending" as const, version:"2023",        summary:"AI Management System standard. GeFi certification program started." },
  { id:"iso27001", name:"ISO 27001",      jurisdiction:"global", status:"compliant" as const, version:"2022",     summary:"Information Security Management System. Annual audit completed." },
  { id:"soc2",     name:"SOC 2 Type II",  jurisdiction:"global", status:"review" as const, version:"AICPA 2023",  summary:"Trust Services Criteria. Type I complete; Type II in progress." },
];

export default function RegulatorStandards(): React.ReactElement {
  const [q, setQ] = useState("");
  const filtered = STANDARDS.filter((s) =>
    !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.jurisdiction.includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Regulator</div>
        <h1 className="page-header__title">Standards Library</h1>
        <p className="page-header__sub">All regulatory frameworks and certifications relevant to GeFi's jurisdictions.</p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)", alignItems: "flex-end" }}>
        <div style={{ flex: 1, maxWidth: 360 }}>
          <Input label="Search standards" placeholder="e.g. GDPR, ISO, MiFID…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button variant="secondary" size="sm">Download white paper</Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {filtered.map((s) => (
          <div key={s.id} className="gf-card" style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-5)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                <h3 style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: 600 }}>{s.name}</h3>
                <JurisdictionBadge region={s.jurisdiction} />
                <ComplianceBadge status={s.status} />
              </div>
              <p style={{ margin: "0 0 var(--space-2)", fontSize: "var(--font-size-sm)", color: "var(--color-muted)" }}>{s.summary}</p>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-xs)", color: "var(--color-muted-2)" }}>Version: {s.version}</span>
            </div>
            <Button size="sm" variant="ghost">Evidence pack →</Button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="gf-empty"><div className="gf-empty__icon">📚</div><h3 className="gf-empty__title">No standards match</h3></div>
        )}
      </div>
    </div>
  );
}
