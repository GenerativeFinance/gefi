import React from "react";

export type TrendDirection = "up" | "down" | "flat";

export interface TrendIndicatorProps {
  value: number;
  direction?: TrendDirection;
  label?: string;
  showSign?: boolean;
  className?: string;
}

const ARROWS: Record<TrendDirection, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

export function TrendIndicator({
  value,
  direction,
  label,
  showSign = true,
  className = "",
}: TrendIndicatorProps): React.ReactElement {
  const dir: TrendDirection =
    direction ?? (value > 0 ? "up" : value < 0 ? "down" : "flat");
  const absVal = Math.abs(value);
  const sign = showSign && value !== 0 ? (value > 0 ? "+" : "−") : "";

  return (
    <span
      className={["gf-trend", `gf-trend--${dir}`, className]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${sign}${absVal}%${label ? ` ${label}` : ""} ${dir}`}
    >
      <span className="gf-trend__arrow" aria-hidden="true">
        {ARROWS[dir]}
      </span>
      {sign}
      {absVal.toFixed(2)}%{label && <span style={{ marginLeft: 4, fontFamily: "var(--font-sans)" }}>{label}</span>}
    </span>
  );
}
