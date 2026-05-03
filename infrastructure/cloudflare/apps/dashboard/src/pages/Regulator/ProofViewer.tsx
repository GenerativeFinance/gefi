/**
 * Cryptographic proof viewer.
 *
 * Given an audit entry ID, shows:
 *   - The entry's hash, prevHash, action, resource, timestamp, tenantId
 *   - The Merkle proof path (sibling hashes)
 *   - A "Verify on-chain" button (calls the Polygon anchor in production)
 *   - A copy-to-clipboard button for each hash
 *
 * Stub: verifies by checking that hashes are 32-byte hex strings (format only).
 * Production: submits the proof path to the Polygon anchor contract and checks
 * the root matches the published daily Merkle root.
 */
import React, { useState } from "react";
import { useApi } from "../../hooks/useApi.js";
import { stubClient } from "../../api/stub-client.js";
import { Input } from "@gefi/ui/Input.js";
import { Button } from "@gefi/ui/Button.js";
import { ComplianceBadge } from "@gefi/ui/primitives/ComplianceBadge.js";
import { Spinner } from "@gefi/ui/Spinner.js";

function truncate(s: string, n = 22): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function isValidHash(h: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(h);
}

export default function RegulatorProofViewer(): React.ReactElement {
  const [entryId, setEntryId] = useState("audit-0000");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<"valid" | "invalid" | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const entry = useApi(() => stubClient.getAuditEntry(entryId), [entryId]);

  async function verify(): Promise<void> {
    setVerifying(true);
    setVerifyResult(null);
    await new Promise((r) => setTimeout(r, 800));
    const e = entry.data;
    const ok = !!e && isValidHash(e.hash) && e.proofPath.every(isValidHash);
    setVerifyResult(ok ? "valid" : "invalid");
    setVerifying(false);
  }

  function copy(text: string): void {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header__eyebrow">Regulator</div>
        <h1 className="page-header__title">Cryptographic Proof Viewer</h1>
        <p className="page-header__sub">Independently verify any audit event by checking its Merkle inclusion proof against the on-chain anchor.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "var(--space-6)", alignItems: "start" }}>
        {/* Entry picker */}
        <div className="gf-card">
          <h3 className="gf-card__title" style={{ marginBottom: "var(--space-4)" }}>Lookup entry</h3>
          <Input
            label="Audit entry ID"
            value={entryId}
            onChange={(e) => { setEntryId(e.target.value); setVerifyResult(null); }}
            placeholder="audit-0000"
          />
          <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)", margin: "var(--space-3) 0 0" }}>
            Paste any entry ID from the audit log or from a legal hold export.
          </p>
          <Button
            style={{ marginTop: "var(--space-4)", width: "100%" }}
            onClick={() => { void verify(); }}
            loading={verifying}
            disabled={!entryId}
          >
            Verify proof
          </Button>
          {verifyResult && (
            <div style={{ marginTop: "var(--space-4)" }}>
              <ComplianceBadge
                status={verifyResult === "valid" ? "compliant" : "violation"}
                label={verifyResult === "valid" ? "✓ Proof valid" : "✕ Proof invalid"}
              />
              {verifyResult === "valid" && (
                <p style={{ margin: "var(--space-2) 0 0", fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>
                  All hashes are 32-byte hex. Production also verifies root against Polygon anchor contract.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Proof detail */}
        <div>
          {entry.isLoading && <Spinner />}
          {entry.data && (
            <>
              <div className="proof-viewer" style={{ marginBottom: "var(--space-5)" }}>
                {[
                  ["Entry ID", entry.data.id],
                  ["Timestamp", new Date(entry.data.timestamp).toISOString()],
                  ["Tenant", entry.data.tenantId],
                  ["Action", `${entry.data.action}:${entry.data.resource}`],
                  ["Hash", entry.data.hash],
                  ["Prev hash", entry.data.prevHash ?? "(genesis)"],
                ].map(([k, v]) => (
                  <div key={k} className="proof-viewer__row">
                    <span className="proof-viewer__key">{k}</span>
                    <span className="proof-viewer__val" style={{ flex: 1 }}>
                      {k === "Hash" || k === "Prev hash"
                        ? <span title={v ?? undefined}>{truncate(v ?? "")}</span>
                        : v}
                    </span>
                    {(k === "Hash" || k === "Prev hash") && v && v !== "(genesis)" && (
                      <button
                        onClick={() => copy(v)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: copied === v ? "var(--color-profit)" : "var(--color-muted)", fontSize: "var(--font-size-xs)", fontFamily: "var(--font-mono)" }}
                      >
                        {copied === v ? "✓" : "copy"}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="gf-card">
                <div className="gf-card__header">
                  <h3 className="gf-card__title">Merkle proof path</h3>
                </div>
                <ol style={{ margin: 0, padding: "0 0 0 var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  {entry.data.proofPath.map((sibling, i) => (
                    <li key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>
                      <span style={{ color: "var(--color-brand)", marginRight: "var(--space-2)" }}>[{i}]</span>
                      {truncate(sibling, 42)}
                      <button
                        onClick={() => copy(sibling)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: copied === sibling ? "var(--color-profit)" : "var(--color-muted)", fontSize: "var(--font-size-xs)", marginLeft: "var(--space-2)" }}
                      >
                        {copied === sibling ? "✓" : "copy"}
                      </button>
                    </li>
                  ))}
                </ol>
                <p style={{ margin: "var(--space-4) 0 0", fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>
                  Production: submit these sibling hashes + the entry hash to the Polygon anchor contract at the daily root to verify inclusion.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
