import React from "react";

export type Region = "eu" | "us" | "uk" | "mena" | "apac" | "ch" | "global";

export interface JurisdictionBadgeProps {
  region: Region | string;
  className?: string;
}

const LABELS: Record<string, string> = {
  eu: "EU",
  us: "US",
  uk: "UK",
  mena: "MENA",
  apac: "APAC",
  ch: "CH",
  global: "GLOBAL",
};

export function JurisdictionBadge({
  region,
  className = "",
}: JurisdictionBadgeProps): React.ReactElement {
  const key = region.toLowerCase();
  const label = LABELS[key] ?? region.toUpperCase();
  const modifier = LABELS[key] ? `gf-jurisdiction--${key}` : "gf-jurisdiction--global";

  return (
    <span
      className={["gf-jurisdiction", modifier, className]
        .filter(Boolean)
        .join(" ")}
      aria-label={`Jurisdiction: ${label}`}
    >
      {label}
    </span>
  );
}
