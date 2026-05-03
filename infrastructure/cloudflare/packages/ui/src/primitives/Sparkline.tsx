import React from "react";

export interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  strokeWidth?: number;
  area?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  color = "var(--color-brand)",
  height = 40,
  width,
  strokeWidth = 1.5,
  area = true,
  className = "",
}: SparklineProps): React.ReactElement | null {
  if (data.length < 2) return null;

  const w = width ?? data.length * 8;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = strokeWidth;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (w - pad * 2) + pad,
    y: height - pad - ((v - min) / range) * (height - pad * 2),
  }));

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  const areaPath =
    area && points.length > 0
      ? `${d} L${points[points.length - 1]!.x.toFixed(2)},${height} L${points[0]!.x.toFixed(2)},${height} Z`
      : null;

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      width={w}
      height={height}
      className={["gf-sparkline", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {areaPath && (
        <path
          d={areaPath}
          fill={color}
          className="gf-sparkline__area"
        />
      )}
      <path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        className="gf-sparkline__line"
      />
    </svg>
  );
}
