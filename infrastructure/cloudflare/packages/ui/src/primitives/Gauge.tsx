import React from "react";

export interface GaugeProps {
  value: number;
  max?: number;
  label?: string;
  size?: number;
  color?: string;
  trackColor?: string;
  className?: string;
}

export function Gauge({
  value,
  max = 100,
  label,
  size = 96,
  color,
  trackColor = "var(--color-surface-3)",
  className = "",
}: GaugeProps): React.ReactElement {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const r = (size - 12) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -225;
  const sweepAngle = 270;

  function polarToCartesian(angle: number): [number, number] {
    const rad = ((angle - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function arc(from: number, to: number): string {
    const [x1, y1] = polarToCartesian(from);
    const [x2, y2] = polarToCartesian(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const trackEnd = startAngle + sweepAngle;
  const fillEnd = startAngle + sweepAngle * pct;

  const fillColor =
    color ??
    (pct > 0.75
      ? "var(--color-loss)"
      : pct > 0.5
        ? "var(--color-warn)"
        : "var(--color-profit)");

  return (
    <div
      className={["gf-gauge", className].filter(Boolean).join(" ")}
      role="meter"
      aria-valuenow={value}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-label={label ?? `${value} / ${max}`}
    >
      <svg
        width={size}
        height={size}
        className="gf-gauge__arc"
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <path
          d={arc(startAngle, trackEnd)}
          fill="none"
          stroke={trackColor}
          strokeWidth={8}
          strokeLinecap="round"
        />
        {pct > 0 && (
          <path
            d={arc(startAngle, fillEnd)}
            fill="none"
            stroke={fillColor}
            strokeWidth={8}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.4s ease" }}
          />
        )}
        <text
          x={cx}
          y={cy}
          className="gf-gauge__value"
          style={{ fill: "var(--color-text)" }}
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      {label && <div className="gf-gauge__label">{label}</div>}
    </div>
  );
}
