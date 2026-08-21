import React, { useState } from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Button } from "@gefi/ui/Button.js";
import { Input } from "@gefi/ui/Input.js";
import { Select } from "@gefi/ui/Select.js";
import { Spinner } from "@gefi/ui/Spinner.js";

export default function DataProviderDatasets(): React.ReactElement {
  const datasets = useApi(() => stubClient.getDatasets());
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [jur, setJur] = useState("eu");

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setShowForm(false);
    setName("");
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Data Provider</div>
        <h1 className="page-header__title">Dataset Registry</h1>
        <p className="page-header__sub">Register and manage your datasets. Schema validation is enforced at registration time.</p>
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"var(--space-5)" }}>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Register dataset"}</Button>
      </div>

      {showForm && (
        <div className="gf-card section" style={{ maxWidth: 560 }}>
          <h3 className="gf-card__title" style={{ marginBottom:"var(--space-5)" }}>New dataset</h3>
          <form onSubmit={(e) => { void handleSubmit(e); }} style={{ display:"flex", flexDirection:"column", gap:"var(--space-4)" }}>
            <Input label="Dataset name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Select label="Jurisdiction" options={[{value:"eu",label:"EU"},{value:"us",label:"US"},{value:"uk",label:"UK"},{value:"mena",label:"MENA"},{value:"apac",label:"APAC"}]} value={jur} onChange={(e) => setJur(e.target.value)} />
            <div className="gf-input-wrap">
              <label className="gf-label">Schema (JSON)</label>
              <textarea className="gf-input" style={{ height:80, paddingTop:8, fontFamily:"var(--font-mono)", fontSize:"var(--font-size-sm)" }} placeholder={'{"price":float,"volume":int,"timestamp":datetime}'} />
            </div>
            <div style={{ display:"flex", gap:"var(--space-3)", justifyContent:"flex-end" }}>
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" loading={submitting} disabled={!name}>Register</Button>
            </div>
          </form>
        </div>
      )}

      {datasets.isLoading && <Spinner />}
      {datasets.data && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--space-4)" }}>
          {datasets.data.map((d) => (
            <div key={d.id} className="gf-card">
              <div style={{ display:"flex", alignItems:"flex-start", gap:"var(--space-5)" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"var(--space-3)", marginBottom:"var(--space-2)" }}>
                    <h3 style={{ margin:0, fontSize:"var(--font-size-md)", fontWeight:600 }}>{d.name}</h3>
                    <JurisdictionBadge region={d.jurisdiction} />
                  </div>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:"var(--font-size-xs)", color:"var(--color-muted)", marginBottom:"var(--space-3)" }}>{d.schema}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3, auto)", gap:"var(--space-6)" }}>
                    <div><div style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>Rows</div><div className="num" style={{ fontWeight:600 }}>{d.rowCount.toLocaleString()}</div></div>
                    <div><div style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>ε Used</div><div className="num" style={{ fontWeight:600 }}>{d.privacyBudgetUsed.toFixed(1)} / {d.privacyBudgetMax}</div></div>
                    <div><div style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>Registered</div><div className="num" style={{ fontWeight:600 }}>{d.registeredAt.slice(0,10)}</div></div>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Edit schema</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
