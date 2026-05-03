/**
 * 4-step Investor Onboarding flow.
 *
 * Step 1 — Country / Jurisdiction picker
 * Step 2 — Entity type
 * Step 3 — KYC (identity verification)
 * Step 4 — First model recommendation
 *
 * Lives at /onboarding/* and bypasses AppShell.
 * Posts to /v1/auth/onboard + /v1/kyc/start in production.
 * Stub: 800ms delay then localStorage flag.
 */
import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@gefi/ui/Button.js";
import { Select } from "@gefi/ui/Select.js";
import { Input } from "@gefi/ui/Input.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";

const STEPS = [
  { id: "jurisdiction", label: "Jurisdiction" },
  { id: "entity",       label: "Entity Type" },
  { id: "kyc",          label: "Identity" },
  { id: "recommend",    label: "Explore" },
];

function StepperBar({ current }: { current: number }): React.ReactElement {
  return (
    <ol className="gf-stepper" aria-label="Onboarding progress">
      {STEPS.map((s, i) => {
        const state = i < current ? "is-done" : i === current ? "is-current" : "";
        return (
          <li key={s.id} className={["gf-stepper__item", state].filter(Boolean).join(" ")}>
            <span className="gf-stepper__num">{i < current ? "✓" : i + 1}</span>
            <span className="gf-stepper__label">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

const JURISDICTIONS = [
  { value: "eu",     label: "🇪🇺  European Union (MiFID II / GDPR)" },
  { value: "us",     label: "🇺🇸  United States (SEC / CFTC / FinCEN)" },
  { value: "uk",     label: "🇬🇧  United Kingdom (FCA)" },
  { value: "mena",   label: "🌙  MENA (DFSA / SCA)" },
  { value: "apac",   label: "🌏  APAC (MAS / ASIC / FSA)" },
  { value: "ch",     label: "🇨🇭  Switzerland (FINMA)" },
  { value: "global", label: "🌐  Global (multi-jurisdiction)" },
];

const COMPLIANCE_NOTES: Record<string, string> = {
  eu:     "Your models will be routed to EU-resident Workers. GDPR data-residency attestation auto-generated. MiFID II explainability required.",
  us:     "SEC + CFTC compliance overlays active. FinCEN KYB for entities. Inference logs kept 7 years.",
  uk:     "FCA Consumer Duty applies. SMCR attestation for Senior Managers. ICO DPIA template provided.",
  mena:   "DFSA (Dubai) or SCA (Abu Dhabi) rulebook selected based on entity location. Arabic audit records available.",
  apac:   "MAS TRM and ASIC RG97 overlays. FSA (Japan) FIEA reporting available.",
  ch:     "FINMA AI governance circular. FADP (Swiss GDPR) data-residency on Infomaniak CH nodes.",
  global: "Highest-watermark rule set applied across all jurisdictions your models operate in.",
};

const ENTITY_TYPES = [
  { value: "individual",    label: "Individual / Family Office" },
  { value: "fund",          label: "Hedge Fund / Quant Fund" },
  { value: "bank",          label: "Bank / Broker-Dealer" },
  { value: "asset_manager", label: "Asset Manager / RIA" },
  { value: "exchange",      label: "Exchange / Trading Venue" },
  { value: "regulator",     label: "Regulatory Body / Government" },
  { value: "data_provider", label: "Data Provider / Research Firm" },
  { value: "developer",     label: "Independent Developer / Startup" },
];

const MODEL_RECOMMENDATIONS: Array<{
  id: string; name: string; jurisdiction: string; description: string;
  return30d: number; sharpe: number; riskLevel: string;
}> = [
  { id: "mdl-001", name: "AlphaQuant EU", jurisdiction: "eu",   description: "Momentum-factor model trained on EU equity price feeds. MiFID II compliant.", return30d: 7.4, sharpe: 2.1, riskLevel: "low" },
  { id: "mdl-002", name: "BetaSignal US",  jurisdiction: "us",   description: "Mean-reversion model for US large-cap equities. SEC-registered.", return30d: 3.2, sharpe: 1.6, riskLevel: "medium" },
  { id: "mdl-003", name: "GammaMomentum", jurisdiction: "uk",   description: "FCA-approved trend-following model for LSE instruments.", return30d: 9.1, sharpe: 2.4, riskLevel: "low" },
];

interface OnboardingState {
  jurisdiction: string;
  entityType: string;
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
}

const DEFAULT_STATE: OnboardingState = {
  jurisdiction: "", entityType: "",
  firstName: "", lastName: "", dob: "", country: "",
};

function OnboardingShell({ children, step }: { children: React.ReactNode; step: number }): React.ReactElement {
  return (
    <div style={{
      minHeight: "100vh", background: "var(--color-bg)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "flex-start", padding: "var(--space-10) var(--space-6)",
    }}>
      <div style={{ width: "100%", maxWidth: 680 }}>
        <a href="https://gefi.io" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "var(--space-8)" }}>
          <div style={{ width: 32, height: 32, background: "var(--color-brand)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>G</div>
          <span style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, color: "var(--color-text)" }}>GeFi</span>
        </a>
        <StepperBar current={step} />
        {children}
      </div>
    </div>
  );
}

/* Step 1 */
function StepJurisdiction({ state, setState, onNext }: { state: OnboardingState; setState: (s: OnboardingState) => void; onNext: () => void }): React.ReactElement {
  const note = state.jurisdiction ? COMPLIANCE_NOTES[state.jurisdiction] : null;
  return (
    <OnboardingShell step={0}>
      <div className="wizard__card">
        <h1 className="wizard__title">Where are you based?</h1>
        <p className="wizard__sub">GeFi routes inference requests to jurisdiction-resident Workers and applies the correct compliance overlay automatically.</p>
        <Select
          label="Primary jurisdiction"
          options={JURISDICTIONS}
          value={state.jurisdiction}
          onChange={(e) => setState({ ...state, jurisdiction: e.target.value })}
          placeholder="Select a jurisdiction…"
        />
        {note && state.jurisdiction && (
          <div style={{ marginTop: "var(--space-5)", padding: "var(--space-4)", background: "var(--color-brand-subtle)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--color-brand)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
              <JurisdictionBadge region={state.jurisdiction} />
              <ComplianceBadge status="compliant" label="Compliance overlay active" />
            </div>
            <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-2)", lineHeight: "var(--line-height-relaxed)" }}>{note}</p>
          </div>
        )}
        <div className="wizard__actions">
          <a href="https://gefi.io" style={{ fontSize: "var(--font-size-sm)", color: "var(--color-muted)" }}>← Back to site</a>
          <Button onClick={onNext} disabled={!state.jurisdiction}>Continue →</Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

/* Step 2 */
function StepEntity({ state, setState, onNext, onBack }: { state: OnboardingState; setState: (s: OnboardingState) => void; onNext: () => void; onBack: () => void }): React.ReactElement {
  return (
    <OnboardingShell step={1}>
      <div className="wizard__card">
        <h1 className="wizard__title">What type of entity are you?</h1>
        <p className="wizard__sub">This determines your KYC / KYB tier and the compliance checks applied to your account.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
          {ENTITY_TYPES.map((et) => (
            <button
              key={et.value}
              onClick={() => setState({ ...state, entityType: et.value })}
              style={{
                padding: "var(--space-4)",
                border: `2px solid ${state.entityType === et.value ? "var(--color-brand)" : "var(--color-border)"}`,
                borderRadius: "var(--radius-md)",
                background: state.entityType === et.value ? "var(--color-brand-subtle)" : "var(--color-surface)",
                color: "var(--color-text)",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "var(--font-size-sm)",
                fontFamily: "var(--font-sans)",
                fontWeight: state.entityType === et.value ? 600 : 400,
                transition: "all var(--duration-fast)",
              }}
              aria-pressed={state.entityType === et.value}
            >
              {et.label}
            </button>
          ))}
        </div>
        <div className="wizard__actions">
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <Button onClick={onNext} disabled={!state.entityType}>Continue →</Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

/* Step 3 */
function StepKyc({ state, setState, onNext, onBack }: { state: OnboardingState; setState: (s: OnboardingState) => void; onNext: () => void; onBack: () => void }): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setDone(true);
    setLoading(false);
  }

  if (done) return (
    <OnboardingShell step={2}>
      <div className="wizard__card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: "var(--space-4)" }}>🎉</div>
        <h2 style={{ margin: "0 0 var(--space-2)" }}>Identity verified</h2>
        <p style={{ color: "var(--color-muted)", margin: "0 0 var(--space-6)" }}>
          KYC passed. Your account is now <ComplianceBadge status="compliant" /> for {state.jurisdiction.toUpperCase()}.
        </p>
        <Button onClick={onNext}>See your recommendations →</Button>
      </div>
    </OnboardingShell>
  );

  return (
    <OnboardingShell step={2}>
      <div className="wizard__card">
        <h1 className="wizard__title">Verify your identity</h1>
        <p className="wizard__sub">
          We use{" "}
          {state.jurisdiction === "eu" || state.jurisdiction === "uk" ? "Onfido" : "Sumsub"}{" "}
          to verify your identity. Your data is stored in{" "}
          <JurisdictionBadge region={state.jurisdiction} />-resident infrastructure only.
        </p>
        <form onSubmit={(e) => { void submit(e); }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <Input label="First name" value={state.firstName} onChange={(e) => setState({ ...state, firstName: e.target.value })} required />
            <Input label="Last name"  value={state.lastName}  onChange={(e) => setState({ ...state, lastName: e.target.value })}  required />
          </div>
          <Input label="Date of birth" type="date" value={state.dob} onChange={(e) => setState({ ...state, dob: e.target.value })} required />
          <Select label="Country of nationality" options={JURISDICTIONS.map((j) => ({ value: j.value, label: j.label }))} value={state.country} onChange={(e) => setState({ ...state, country: e.target.value })} placeholder="Select…" />
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-muted)", lineHeight: "var(--line-height-relaxed)" }}>
            In production this step opens the KYC provider SDK (Onfido / Sumsub). Stub: submitting the form marks your account as verified.
          </p>
          <div className="wizard__actions">
            <Button variant="ghost" type="button" onClick={onBack}>← Back</Button>
            <Button type="submit" loading={loading} disabled={!state.firstName || !state.lastName || !state.dob}>
              Submit for verification
            </Button>
          </div>
        </form>
      </div>
    </OnboardingShell>
  );
}

/* Step 4 */
function StepRecommend({ state }: { state: OnboardingState }): React.ReactElement {
  const matching = MODEL_RECOMMENDATIONS.filter(
    (m) => m.jurisdiction === state.jurisdiction || state.jurisdiction === "global",
  );
  const shown = matching.length > 0 ? matching : MODEL_RECOMMENDATIONS;

  return (
    <OnboardingShell step={3}>
      <div className="wizard__card">
        <h1 className="wizard__title">Recommended models for you</h1>
        <p className="wizard__sub">Based on your jurisdiction and entity type, here are the best starting points.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
          {shown.map((m) => (
            <div key={m.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-5)", background: "var(--color-surface-2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                <strong style={{ fontSize: "var(--font-size-md)", flex: 1 }}>{m.name}</strong>
                <JurisdictionBadge region={m.jurisdiction} />
                <span style={{ fontSize: "var(--font-size-xs)", background: "var(--color-profit-subtle)", color: "var(--color-profit)", borderRadius: "var(--radius-full)", padding: "2px 8px", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                  +{m.return30d}% 30d
                </span>
              </div>
              <p style={{ margin: "0 0 var(--space-3)", fontSize: "var(--font-size-sm)", color: "var(--color-muted)" }}>{m.description}</p>
              <Button size="sm" variant="secondary">Subscribe →</Button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <Button as="a" href="/" size="lg">Go to your dashboard →</Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

export default function Onboarding(): React.ReactElement {
  const navigate = useNavigate();
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);

  return (
    <Routes>
      <Route path="/" element={<StepJurisdiction state={state} setState={setState} onNext={() => navigate("/onboarding/entity")} />} />
      <Route path="/entity" element={<StepEntity state={state} setState={setState} onNext={() => navigate("/onboarding/kyc")} onBack={() => navigate("/onboarding")} />} />
      <Route path="/kyc"    element={<StepKyc    state={state} setState={setState} onNext={() => navigate("/onboarding/recommend")} onBack={() => navigate("/onboarding/entity")} />} />
      <Route path="/recommend" element={<StepRecommend state={state} />} />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  );
}
