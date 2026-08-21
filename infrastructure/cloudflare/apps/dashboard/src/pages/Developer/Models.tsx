import React, { useState } from "react";
import { Button } from "@gefi/ui/Button.js";
import { Input } from "@gefi/ui/Input.js";
import { Select } from "@gefi/ui/Select.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Badge } from "@gefi/ui/Badge.js";

interface WizardState { name: string; description: string; jurisdiction: string; algorithm: string; step: number; submitting: boolean; submitted: boolean; }

const DEFAULT: WizardState = { name: "", description: "", jurisdiction: "eu", algorithm: "fedavg", step: 0, submitting: false, submitted: false };

const JURS = [{ value:"eu",label:"EU"},{ value:"us",label:"US"},{ value:"uk",label:"UK"},{ value:"mena",label:"MENA"},{ value:"apac",label:"APAC"}];
const ALGOS = [{ value:"fedavg",label:"FedAvg — Federated Averaging"},{ value:"fedprox",label:"FedProx — Proximal Gradient"},{ value:"standalone",label:"Standalone (no federation)"}];

const WIZARD_STEPS = ["Basic info","Algorithm","Review & submit"];

export default function DeveloperModels(): React.ReactElement {
  const [w, setW] = useState<WizardState>(DEFAULT);

  async function submit(): Promise<void> {
    setW((s) => ({ ...s, submitting: true }));
    await new Promise((r) => setTimeout(r, 900));
    setW((s) => ({ ...s, submitting: false, submitted: true }));
  }

  if (w.submitted) return (
    <div>
      <div className="page-header"><h1 className="page-header__title">Model created!</h1></div>
      <div className="gf-card" style={{ maxWidth: 500, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: "var(--space-4)" }}>🎉</div>
        <h2 style={{ margin: "0 0 var(--space-2)" }}>{w.name}</h2>
        <p style={{ color: "var(--color-muted)", margin: "0 0 var(--space-5)" }}>Your model draft is created. Open the Cloud IDE to start coding, then submit for compliance review.</p>
        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
          <Button as="a" href="/developer/ide">Open IDE</Button>
          <Button variant="secondary" onClick={() => setW(DEFAULT)}>Create another</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Developer</div>
        <h1 className="page-header__title">New Model</h1>
        <p className="page-header__sub">Create a new AI financial model. It will go through compliance review before publishing.</p>
      </div>

      <div className="wizard">
        {/* Step indicator */}
        <ol className="gf-stepper">
          {WIZARD_STEPS.map((label, i) => {
            const state = i < w.step ? "is-done" : i === w.step ? "is-current" : "";
            return (
              <li key={label} className={["gf-stepper__item", state].filter(Boolean).join(" ")}>
                <span className="gf-stepper__num">{i < w.step ? "✓" : i + 1}</span>
                <span className="gf-stepper__label">{label}</span>
              </li>
            );
          })}
        </ol>

        <div className="wizard__card">
          {w.step === 0 && (
            <>
              <h2 className="wizard__title">Basic information</h2>
              <p className="wizard__sub">Name your model and describe what it does for subscribers.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <Input label="Model name" value={w.name} onChange={(e) => setW((s) => ({ ...s, name: e.target.value }))} placeholder="e.g. EuroMomentum v2" />
                <div className="gf-input-wrap">
                  <label className="gf-label">Description</label>
                  <textarea className="gf-input" style={{ height: 90, paddingTop: 8, resize: "vertical" }} value={w.description} onChange={(e) => setW((s) => ({ ...s, description: e.target.value }))} placeholder="Describe your model's strategy, inputs, and target asset class…" />
                </div>
                <Select label="Primary jurisdiction" options={JURS} value={w.jurisdiction} onChange={(e) => setW((s) => ({ ...s, jurisdiction: e.target.value }))} />
              </div>
              <div className="wizard__actions">
                <span />
                <Button onClick={() => setW((s) => ({ ...s, step: 1 }))} disabled={!w.name || !w.description}>Next →</Button>
              </div>
            </>
          )}

          {w.step === 1 && (
            <>
              <h2 className="wizard__title">Training algorithm</h2>
              <p className="wizard__sub">Choose how your model will be trained. FedAvg enables privacy-preserving distributed training via GeFi's federation network.</p>
              <Select label="Algorithm" options={ALGOS} value={w.algorithm} onChange={(e) => setW((s) => ({ ...s, algorithm: e.target.value }))} />
              {w.algorithm === "fedavg" && (
                <div style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", background: "var(--color-brand-subtle)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-2)" }}>
                    FedAvg rounds your model across participant data nodes with DP-SGD noise (ε configurable) and Bonawitz secure aggregation. Contribution scores are computed via TMC-Shapley.
                  </p>
                </div>
              )}
              <div className="wizard__actions">
                <Button variant="ghost" onClick={() => setW((s) => ({ ...s, step: 0 }))}>← Back</Button>
                <Button onClick={() => setW((s) => ({ ...s, step: 2 }))}>Next →</Button>
              </div>
            </>
          )}

          {w.step === 2 && (
            <>
              <h2 className="wizard__title">Review & submit</h2>
              <p className="wizard__sub">Confirm your model details before creating the draft.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {[
                  ["Name", w.name],
                  ["Description", w.description],
                  ["Algorithm", ALGOS.find((a) => a.value === w.algorithm)?.label ?? w.algorithm],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-3) 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ color: "var(--color-muted)", fontSize: "var(--font-size-sm)", minWidth: 120 }}>{k}</span>
                    <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text)" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-3) 0" }}>
                  <span style={{ color: "var(--color-muted)", fontSize: "var(--font-size-sm)", minWidth: 120 }}>Jurisdiction</span>
                  <JurisdictionBadge region={w.jurisdiction} />
                </div>
                <div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-3) 0" }}>
                  <span style={{ color: "var(--color-muted)", fontSize: "var(--font-size-sm)", minWidth: 120 }}>After creation</span>
                  <ComplianceBadge status="pending" label="Awaiting compliance review" />
                </div>
              </div>
              <div className="wizard__actions">
                <Button variant="ghost" onClick={() => setW((s) => ({ ...s, step: 1 }))}>← Back</Button>
                <Button onClick={() => { void submit(); }} loading={w.submitting}>Create draft</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
