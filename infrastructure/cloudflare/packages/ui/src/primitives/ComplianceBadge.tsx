import React from "react";

export type ComplianceStatus = "compliant" | "review" | "violation" | "pending";

export interface ComplianceBadgeProps {
  status: ComplianceStatus;
  label?: string;
  className?: string;
}

const DEFAULT_LABELS: Record<ComplianceStatus, string> = {
  compliant: "✓ Compliant",
  review: "⚠ Under Review",
  violation: "✕ Violation",
  pending: "◷ Pending",
};

export function ComplianceBadge({
  status,
  label,
  className = "",
}: ComplianceBadgeProps): React.ReactElement {
  return (
    <span
      className={["gf-compliance", `gf-compliance--${status}`, className]
        .filter(Boolean)
        .join(" ")}
      role="status"
    >
      {label ?? DEFAULT_LABELS[status]}
    </span>
  );
}
