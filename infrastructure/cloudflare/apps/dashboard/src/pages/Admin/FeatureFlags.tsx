import React, { useState } from "react";
import { Badge } from "@gefi/ui/Badge.js";

interface Flag { id:string; name:string; description:string; enabled:boolean; rollout:number; env:"all"|"prod"|"staging" }

const INITIAL_FLAGS: Flag[] = [
  { id:"fl-001", name:"federation_v2_secure_agg",  description:"Use Bonawitz v2 secure aggregation in federation rounds",  enabled:true,  rollout:100, env:"all" },
  { id:"fl-002", name:"dp_per_batch_noise",         description:"Independent DP-SGD noise per batch (splitmix seeded)",     enabled:true,  rollout:100, env:"all" },
  { id:"fl-003", name:"cloud_ide_beta",             description:"Enable Cloud IDE stub for developer persona",              enabled:false, rollout:0,   env:"staging" },
  { id:"fl-004", name:"live_ticker_websocket",      description:"Switch ticker from polling to WebSocket stream",           enabled:false, rollout:0,   env:"staging" },
  { id:"fl-005", name:"onboarding_v2",              description:"New 4-step onboarding flow with jurisdiction compliance",  enabled:true,  rollout:100, env:"all" },
  { id:"fl-006", name:"compliance_center_v2",       description:"New compliance center with proof viewer and audit export", enabled:true,  rollout:100, env:"prod" },
  { id:"fl-007", name:"tmcshapley_leaderboard",     description:"Show TMC-Shapley contribution scores in federation UI",    enabled:true,  rollout:75,  env:"prod" },
  { id:"fl-008", name:"sovereign_terraform_module", description:"Expose sovereign tenant Terraform module download",        enabled:false, rollout:0,   env:"staging" },
];

export default function AdminFeatureFlags(): React.ReactElement {
  const [flags, setFlags] = useState<Flag[]>(INITIAL_FLAGS);

  function toggle(id:string): void {
    setFlags((fs) => fs.map((f) => f.id===id ? { ...f, enabled:!f.enabled } : f));
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Admin</div>
        <h1 className="page-header__title">Feature Flags</h1>
        <p className="page-header__sub">Enable or disable platform features without a deployment. Changes take effect within 60 seconds via KV propagation.</p>
      </div>

      <div className="gf-card">
        {flags.map((f) => (
          <div key={f.id} className="flag-row">
            <div className="flag-info">
              <div className="flag-info__name" style={{ display:"flex", alignItems:"center", gap:"var(--space-2)" }}>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"var(--font-size-sm)" }}>{f.name}</span>
                <Badge variant={f.env==="prod"?"loss":f.env==="staging"?"warn":"neutral"} style={{ fontSize:"10px" }}>
                  {f.env}
                </Badge>
                {f.rollout < 100 && f.rollout > 0 && (
                  <Badge variant="brand" style={{ fontSize:"10px" }}>{f.rollout}%</Badge>
                )}
              </div>
              <div className="flag-info__desc">{f.description}</div>
            </div>
            <button
              className={["toggle", f.enabled ? "is-on" : ""].filter(Boolean).join(" ")}
              onClick={() => toggle(f.id)}
              aria-pressed={f.enabled}
              aria-label={`${f.enabled?"Disable":"Enable"} ${f.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
