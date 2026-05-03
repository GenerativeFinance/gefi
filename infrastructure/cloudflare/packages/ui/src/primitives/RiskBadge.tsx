import React from "react";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  className?: string;
}

const LABELS: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  critical: "Critical",
};

export function RiskBadge({
  level,
  score,
  className = "",
}: RiskBadgeProps): React.ReactElement {
  return (
    <span
      className={["gf-risk", `gf-risk--${level}`, className]
        .filter(Boolean)
        .join(" ")}
      title={score !== undefined ? `Risk score: ${score}` : undefined}
    >
      {LABELS[level]}
      {score !== undefined && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            marginLeft: 4,
            opacity: 0.75,
          }}
        >
          {score.toFixed(1)}
        </span>
      )}
    </span>
  );
}
