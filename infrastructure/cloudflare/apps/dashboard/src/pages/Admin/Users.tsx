import React, { useState } from "react";
import { Input } from "@gefi/ui/Input.js";
import { Button } from "@gefi/ui/Button.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { JurisdictionBadge } from "@gefi/ui/primitives/JurisdictionBadge.js";
import { Badge } from "@gefi/ui/Badge.js";

const USERS = [
  { id:"u-001", name:"Alex Chen",    email:"alex.chen@acmecapital.com",    role:"investor",      jurisdiction:"eu",   kyc:"enhanced", status:"active",    joined:"2025-11-02" },
  { id:"u-002", name:"Priya Nair",   email:"priya.nair@quant-labs.io",     role:"developer",     jurisdiction:"us",   kyc:"standard", status:"active",    joined:"2025-12-14" },
  { id:"u-003", name:"Marcus Bauer", email:"marcus.bauer@bafin.de",        role:"regulator",     jurisdiction:"eu",   kyc:"enhanced", status:"active",    joined:"2026-01-08" },
  { id:"u-004", name:"Sofia Reyes",  email:"sofia.reyes@databridge.io",    role:"data_provider", jurisdiction:"us",   kyc:"standard", status:"active",    joined:"2026-02-20" },
  { id:"u-005", name:"Jin Park",     email:"jin.park@alpha-hedge.kr",      role:"investor",      jurisdiction:"apac", kyc:"basic",    status:"suspended", joined:"2026-03-01" },
  { id:"u-006", name:"Amir Hassan",  email:"amir.hassan@dubai-fund.ae",    role:"investor",      jurisdiction:"mena", kyc:"enhanced", status:"pending",   joined:"2026-04-12" },
];

export default function AdminUsers(): React.ReactElement {
  const [q, setQ] = useState("");
  const filtered = USERS.filter((u) =>
    !q || u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase()) ||
    u.role.includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Admin</div>
        <h1 className="page-header__title">User Moderation</h1>
        <p className="page-header__sub">Review, approve, suspend, or remove users across all tenants.</p>
      </div>

      <div style={{ display:"flex", gap:"var(--space-4)", marginBottom:"var(--space-5)", alignItems:"flex-end" }}>
        <div style={{ flex:1, maxWidth:360 }}>
          <Input label="Search users" placeholder="name, email, or role…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button variant="secondary" size="sm">Export CSV</Button>
        <Button size="sm">Invite user</Button>
      </div>

      <div className="gf-card" style={{ padding:0 }}>
        <table className="gf-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>Jurisdiction</th><th>KYC</th><th>Status</th><th>Joined</th><th /></tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <div>
                    <strong style={{ fontSize:"var(--font-size-sm)" }}>{u.name}</strong>
                    <div style={{ fontSize:"var(--font-size-xs)", color:"var(--color-muted)" }}>{u.email}</div>
                  </div>
                </td>
                <td style={{ fontSize:"var(--font-size-sm)", color:"var(--color-muted)", textTransform:"capitalize" }}>
                  {u.role.replace(/_/g," ")}
                </td>
                <td><JurisdictionBadge region={u.jurisdiction} /></td>
                <td>
                  <Badge variant={u.kyc==="enhanced"?"profit":u.kyc==="standard"?"brand":"neutral"}>
                    {u.kyc}
                  </Badge>
                </td>
                <td>
                  <ComplianceBadge
                    status={u.status==="active"?"compliant":u.status==="pending"?"pending":"violation"}
                    label={u.status}
                  />
                </td>
                <td className="num" style={{ fontSize:"var(--font-size-xs)" }}>{u.joined}</td>
                <td>
                  <div style={{ display:"flex", gap:"var(--space-2)" }}>
                    <Button size="sm" variant="ghost">View</Button>
                    {u.status==="active" && <Button size="sm" variant="danger">Suspend</Button>}
                    {u.status==="suspended" && <Button size="sm" variant="secondary">Restore</Button>}
                    {u.status==="pending" && <Button size="sm">Approve</Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && (
          <div className="gf-empty"><div className="gf-empty__icon">👥</div><h3 className="gf-empty__title">No users match</h3></div>
        )}
      </div>
    </div>
  );
}
