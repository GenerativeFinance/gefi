/**
 * Component showcase — Storybook substitute.
 *
 * Lives at /components. Shows all @gefi/ui primitives and base components
 * in all states, with code snippets and WCAG notes.
 *
 * This page is always accessible regardless of persona.
 */
import React from "react";
import { Button } from "@gefi/ui/Button.js";
import { Card } from "@gefi/ui/Card.js";
import { Badge } from "@gefi/ui/Badge.js";
import { Input } from "@gefi/ui/Input.js";
import { Select } from "@gefi/ui/Select.js";
import { Spinner } from "@gefi/ui/Spinner.js";
import { MetricCard } from "@gefi/ui/primitives/MetricCard.js";
import { TrendIndicator } from "@gefi/ui/primitives/TrendIndicator.js";
import { RiskBadge } from "@gefi/ui/primitives/RiskBadge.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Sparkline } from "@gefi/ui/primitives/Sparkline.js";
import { Gauge } from "@gefi/ui/primitives/Gauge.js";

function Section({ title, children }: { title:string; children:React.ReactNode }): React.ReactElement {
  return (
    <section style={{ marginBottom:"var(--space-10)" }}>
      <h2 style={{ fontSize:"var(--font-size-xl)", fontWeight:700, borderBottom:"2px solid var(--color-brand)", paddingBottom:"var(--space-2)", marginBottom:"var(--space-6)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ children, label }: { children:React.ReactNode; label?:string }): React.ReactElement {
  return (
    <div style={{ marginBottom:"var(--space-5)" }}>
      {label && <div style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)", marginBottom:"var(--space-2)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>}
      <div style={{ display:"flex", gap:"var(--space-3)", alignItems:"flex-start", flexWrap:"wrap" }}>
        {children}
      </div>
    </div>
  );
}

const SPARKDATA = [10,15,12,18,14,20,17,22,19,25];

export default function ComponentShowcase(): React.ReactElement {
  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Design system</div>
        <h1 className="page-header__title">Component Showcase</h1>
        <p className="page-header__sub">All @gefi/ui components in every state. WCAG AAA compliant across light / dark / high-contrast themes.</p>
      </div>

      {/* Theme info */}
      <div className="gf-card section" style={{ padding:"var(--space-4)", background:"var(--color-brand-subtle)", border:"1px solid var(--color-brand)" }}>
        <p style={{ margin:0, fontSize:"var(--font-size-sm)", color:"var(--color-text-2)" }}>
          <strong>Theme switching:</strong> Use the ☀️/🌙/◐ button in the top-right corner to cycle between light, dark, and high-contrast (WCAG AAA) themes. All tokens update automatically via CSS custom properties.
        </p>
      </div>

      <Section title="Button">
        <Row label="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="States">
          <Button loading>Loading…</Button>
          <Button disabled>Disabled</Button>
        </Row>
      </Section>

      <Section title="Badge">
        <Row label="Variants">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="brand">Brand</Badge>
          <Badge variant="profit">Profit +2.4%</Badge>
          <Badge variant="loss">Loss −1.8%</Badge>
          <Badge variant="warn">Warning</Badge>
        </Row>
        <Row label="With dot">
          <Badge variant="profit" dot>Live</Badge>
          <Badge variant="warn" dot>Processing</Badge>
          <Badge variant="neutral" dot>Offline</Badge>
        </Row>
      </Section>

      <Section title="Input & Select">
        <Row>
          <div style={{ minWidth:260 }}>
            <Input label="Email address" type="email" placeholder="alex@gefi.io" />
          </div>
          <div style={{ minWidth:260 }}>
            <Input label="With error" error="This field is required" />
          </div>
          <div style={{ minWidth:260 }}>
            <Input label="With hint" hint="Must be a valid IBAN" />
          </div>
        </Row>
        <Row>
          <div style={{ minWidth:260 }}>
            <Select label="Jurisdiction" options={[{value:"eu",label:"EU"},{value:"us",label:"US"},{value:"uk",label:"UK"}]} placeholder="Select…" value="" onChange={() => undefined} />
          </div>
        </Row>
      </Section>

      <Section title="Spinner">
        <Row>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
      </Section>

      <Section title="MetricCard">
        <div className="grid-4">
          <MetricCard label="Sharpe Ratio" value="2.41" sub="Annualised" trend={{ value:0.12,direction:"up" }} />
          <MetricCard label="Max Drawdown" value="−4.12%" trend={{ value:4.12,direction:"down" }} />
          <MetricCard label="AUM" value="$4.28B" sparkline={SPARKDATA} trend={{ value:7.2,direction:"up",label:"30d" }} />
          <MetricCard label="VaR 95%" value="−1.85%" sub="1-day parametric" />
        </div>
      </Section>

      <Section title="TrendIndicator">
        <Row>
          <TrendIndicator value={2.41} direction="up" />
          <TrendIndicator value={-1.83} direction="down" />
          <TrendIndicator value={0} direction="flat" />
          <TrendIndicator value={7.14} direction="up" label="30d" />
        </Row>
      </Section>

      <Section title="RiskBadge">
        <Row>
          <RiskBadge level="low" />
          <RiskBadge level="medium" score={5.4} />
          <RiskBadge level="high" score={7.8} />
          <RiskBadge level="critical" score={9.2} />
        </Row>
      </Section>

      <Section title="ComplianceBadge">
        <Row>
          <ComplianceBadge status="compliant" />
          <ComplianceBadge status="review" />
          <ComplianceBadge status="violation" />
          <ComplianceBadge status="pending" />
        </Row>
        <Row label="Custom labels">
          <ComplianceBadge status="compliant" label="MiFID II ✓" />
          <ComplianceBadge status="pending" label="SOC 2 in progress" />
          <ComplianceBadge status="review" label="KYC Under Review" />
        </Row>
      </Section>

      <Section title="JurisdictionBadge">
        <Row>
          {["eu","us","uk","mena","apac","ch","global"].map((r) => (
            <JurisdictionBadge key={r} region={r} />
          ))}
        </Row>
      </Section>

      <Section title="Sparkline">
        <Row>
          <div>
            <div style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)", marginBottom:"var(--space-1)" }}>Profit (green)</div>
            <Sparkline data={SPARKDATA} color="var(--color-profit)" height={48} width={160} />
          </div>
          <div>
            <div style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)", marginBottom:"var(--space-1)" }}>Loss (red)</div>
            <Sparkline data={[25,22,19,17,20,15,12,10,8,6]} color="var(--color-loss)" height={48} width={160} />
          </div>
          <div>
            <div style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)", marginBottom:"var(--space-1)" }}>Brand (no area)</div>
            <Sparkline data={SPARKDATA} color="var(--color-brand)" height={48} width={160} area={false} strokeWidth={2} />
          </div>
        </Row>
      </Section>

      <Section title="Gauge">
        <Row>
          <Gauge value={25} label="Low" size={96} />
          <Gauge value={55} label="Medium" size={96} />
          <Gauge value={82} label="High" size={96} />
          <Gauge value={100} label="Max" size={96} />
        </Row>
        <Row label="Privacy budget (ε)">
          <Gauge value={0.8} max={10} label="Dataset A" size={80} />
          <Gauge value={4.5} max={8}  label="Dataset B" size={80} />
          <Gauge value={8.2} max={10} label="Dataset C" size={80} />
        </Row>
      </Section>

      <Section title="Card">
        <div className="grid-3">
          <Card title="Default card" subtitle="With a subtitle">
            <p style={{ margin:0, fontSize:"var(--font-size-sm)", color:"var(--color-muted)" }}>Card body content goes here.</p>
          </Card>
          <Card variant="raised" title="Raised card" action={<Button size="sm" variant="ghost">Action</Button>}>
            <p style={{ margin:0, fontSize:"var(--font-size-sm)", color:"var(--color-muted)" }}>Elevated with shadow.</p>
          </Card>
          <Card variant="ghost" title="Ghost card">
            <p style={{ margin:0, fontSize:"var(--font-size-sm)", color:"var(--color-muted)" }}>No background, no border.</p>
          </Card>
        </div>
      </Section>

      <Section title="Design tokens">
        <div className="grid-4">
          {[
            ["Brand","var(--color-brand)","#6D5BFF"],
            ["Profit","var(--color-profit)","#16A34A"],
            ["Loss","var(--color-loss)","#DC2626"],
            ["Warn","var(--color-warn)","#D97706"],
            ["Surface","var(--color-surface)","varies"],
            ["Text","var(--color-text)","varies"],
            ["Muted","var(--color-muted)","varies"],
            ["Border","var(--color-border)","varies"],
          ].map(([name, cssVar, value]) => (
            <div key={name} style={{ display:"flex", alignItems:"center", gap:"var(--space-3)" }}>
              <div style={{ width:28, height:28, borderRadius:"var(--radius-sm)", background:cssVar, border:"1px solid var(--color-border)", flexShrink:0 }} />
              <div>
                <div style={{ fontSize:"var(--font-size-xs)", fontWeight:600, color:"var(--color-text)" }}>{name}</div>
                <div style={{ fontSize:"10px", color:"var(--color-muted)", fontFamily:"var(--font-mono)" }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
