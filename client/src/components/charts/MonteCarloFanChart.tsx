import React, { useMemo } from "react";
import { fanBands } from "@/lib/portfolio/hrp";

type Props = {
  paths: number[][];      // simulated cumulative returns (e.g., 1.0 start)
  labels?: string[];      // optional x labels
  height?: number;
};

export default function MonteCarloFanChart({ paths, labels, height = 260 }: Props) {
  const { bands, minY, maxY } = useMemo(() => {
    if (!paths.length) return { bands: [] as number[][], minY: 0.9, maxY: 1.1 };
    const b = fanBands(paths, [0.05, 0.25, 0.5, 0.75, 0.95]);
    const flat = b.flat();
    const minY = Math.min(...flat);
    const maxY = Math.max(...flat);
    return { bands: b, minY, maxY };
  }, [paths]);

  const T = paths[0]?.length || 0;
  const width = 760; // will scale via viewBox
  const margin = { t: 16, r: 16, b: 28, l: 40 };
  const innerW = width - margin.l - margin.r;
  const innerH = height - margin.t - margin.b;

  const x = (t: number) => margin.l + (T <= 1 ? 0 : (t / (T - 1)) * innerW);
  const y = (v: number) => margin.t + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

  function pathFromSeries(series: number[]) {
    return series.map((v, i) => `${i ? "L" : "M"} ${x(i)} ${y(v)}`).join(" ");
  }

  if (!T) return <div className="text-muted-foreground text-sm">No simulation data</div>;

  const [p05, p25, p50, p75, p95] = bands;

  function areaBetween(a: number[], b: number[], color: string, opacity = 0.2) {
    const top = a.map((v, i) => `${i ? "L" : "M"} ${x(i)} ${y(v)}`).join(" ");
    const bottom = b.slice().reverse().map((v, j) => {
      const i = b.length - 1 - j;
      return `L ${x(i)} ${y(v)}`;
    }).join(" ");
    return <path d={`${top} ${bottom} Z`} fill={color} opacity={opacity} />;
  }

  const gridY = Array.from({ length: 5 }, (_, i) => minY + (i * (maxY - minY)) / 4);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[260px] rounded-md bg-muted/30">
      {/* axes */}
      <g>
        {gridY.map((gy, idx) => (
          <g key={idx}>
            <line x1={margin.l} x2={margin.l + innerW} y1={y(gy)} y2={y(gy)} stroke="currentColor" className="opacity-10" />
            <text x={margin.l - 8} y={y(gy)} dominantBaseline="middle" textAnchor="end" className="fill-muted-foreground text-[10px]">
              {gy.toFixed(2)}
            </text>
          </g>
        ))}
        {/* x labels: quarterly ticks */}
        {[0, Math.floor(T/4), Math.floor(T/2), Math.floor(3*T/4), T-1].map((t, i) => (
          <text key={i} x={x(t)} y={height - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">
            {labels?.[t] ?? t}
          </text>
        ))}
      </g>

      {/* fan areas */}
      {areaBetween(p95, p05, "#8B5CF6", 0.15)}
      {areaBetween(p75, p25, "#8B5CF6", 0.25)}

      {/* median */}
      <path d={pathFromSeries(p50)} stroke="#A78BFA" strokeWidth={2} fill="none" />
    </svg>
  );
}