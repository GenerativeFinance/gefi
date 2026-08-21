import React from "react";

type Allocation = { label: string; weight: number; group?: string };

type Props = {
  items: Allocation[]; // weights sum ~ 1.0
  height?: number;
  palette?: string[];
  title?: string;
};

const DEFAULT_COLORS = ["#8B5CF6","#A78BFA","#7C3AED","#C4B5FD","#6D28D9","#5B21B6","#4C1D95"];

export default function AllocationTreemap({ items, height = 280, palette = DEFAULT_COLORS, title }: Props) {
  const width = 760;
  const margin = { t: 28, r: 16, b: 16, l: 16 };
  const innerW = width - margin.l - margin.r;
  const innerH = height - margin.t - margin.b;

  const total = items.reduce((s, x) => s + Math.max(0, x.weight), 0) || 1;
  const sorted = items.slice().sort((a, b) => b.weight - a.weight);
  // simple slice-and-dice
  let x = 0, y = 0, w = innerW, h = innerH, horizontal = true;
  const rects: { x: number; y: number; w: number; h: number; item: Allocation; color: string }[] = [];
  sorted.forEach((it, idx) => {
    const fraction = Math.max(0, it.weight) / total;
    if (horizontal) {
      const rw = w * fraction;
      rects.push({ x: x, y: y, w: rw, h: h, item: it, color: palette[idx % palette.length] });
      x += rw;
    } else {
      const rh = h * fraction;
      rects.push({ x: x, y: y, w: w, h: rh, item: it, color: palette[idx % palette.length] });
      y += rh;
    }
    horizontal = !horizontal;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[280px] rounded-md bg-muted/30">
      <text x={margin.l} y={22} className="fill-muted-foreground text-[12px]">{title}</text>
      <g transform={`translate(${margin.l},${margin.t})`}>
        {rects.map((r, i) => (
          <g key={i}>
            <rect x={r.x} y={r.y} width={Math.max(0, r.w - 2)} height={Math.max(0, r.h - 2)} fill={r.color} opacity={0.85} rx={6}/>
            <text x={r.x + 8} y={r.y + 18} className="fill-white text-[11px]">
              {r.item.label} • {(r.item.weight * 100).toFixed(1)}%
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}