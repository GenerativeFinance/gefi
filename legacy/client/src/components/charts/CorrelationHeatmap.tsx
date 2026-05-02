import React from "react";

type Props = {
  labels: string[];
  matrix: number[][]; // correlation [-1..1]
  height?: number;
};

export default function CorrelationHeatmap({ labels, matrix, height = 280 }: Props) {
  const n = labels.length;
  const cellSize = Math.max(18, Math.min(42, Math.floor(520 / Math.max(1, n))));
  const labelSpace = 120;
  const width = labelSpace + n * cellSize + 20;
  const inner = n * cellSize;

  function color(c: number) {
    // blue (-1) -> neutral (0) -> red (+1)
    const clamp = Math.max(-1, Math.min(1, c || 0));
    const r = clamp > 0 ? Math.round(160 + 80 * clamp) : Math.round(60 * (clamp + 1));
    const g = Math.round(60 + 60 * (1 - Math.abs(clamp)));
    const b = clamp < 0 ? Math.round(180 + 60 * (-clamp)) : Math.round(60 * (1 - clamp));
    return `rgb(${r},${g},${b})`;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[280px] rounded-md bg-muted/30">
      {/* cells */}
      <g transform={`translate(${labelSpace},20)`}>
        {matrix.map((row, i) =>
          row.map((c, j) => (
            <g key={`${i}-${j}`}>
              <rect
                x={j * cellSize}
                y={i * cellSize}
                width={cellSize - 2}
                height={cellSize - 2}
                fill={color(c)}
                opacity={0.9}
                rx={2}
              />
              {i === j && (
                <rect
                  x={j * cellSize}
                  y={i * cellSize}
                  width={cellSize - 2}
                  height={cellSize - 2}
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth={1.5}
                  rx={2}
                />
              )}
            </g>
          ))
        )}
      </g>
      {/* y labels */}
      <g transform="translate(0,20)">
        {labels.map((l, i) => (
          <text key={l} x={labelSpace - 8} y={i * cellSize + cellSize / 2} dominantBaseline="middle" textAnchor="end" className="fill-muted-foreground text-[11px]">
            {l}
          </text>
        ))}
      </g>
      {/* x labels */}
      <g transform={`translate(${labelSpace},${20 + inner + 14})`}>
        {labels.map((l, j) => (
          <text key={l} x={j * cellSize + cellSize / 2} y={0} transform={`rotate(-45 ${j * cellSize + cellSize / 2} 0)`} textAnchor="start" className="fill-muted-foreground text-[11px]">
            {l}
          </text>
        ))}
      </g>
      {/* legend */}
      <g transform={`translate(${width - 80}, 30)`}>
        <text x={0} y={-5} className="fill-muted-foreground text-[10px]">Correlation</text>
        {[-1, -0.5, 0, 0.5, 1].map((val, i) => (
          <g key={val} transform={`translate(0, ${i * 16})`}>
            <rect width={12} height={12} fill={color(val)} rx={2} />
            <text x={16} y={8} className="fill-muted-foreground text-[9px]">{val}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}