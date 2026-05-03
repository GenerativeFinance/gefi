import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({
  size = "md",
  label = "Loading…",
}: SpinnerProps): React.ReactElement {
  return (
    <span role="status" aria-label={label}>
      <span
        className={[
          "gf-spinner",
          size === "sm" ? "gf-spinner--sm" : size === "lg" ? "gf-spinner--lg" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      />
    </span>
  );
}
