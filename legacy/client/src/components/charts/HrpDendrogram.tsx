import React, { useMemo } from "react";
import { ClusterNode, singleLinkage } from "@/lib/portfolio/hrp";

type Props = {
  labels: string[];
  distMatrix: number[][];
  height?: number;
};

export default function HrpDendrogram({ labels, distMatrix, height = 260 }: Props) {
  const root = useMemo<ClusterNode>(() => singleLinkage(distMatrix, labels), [labels, distMatrix]);

  // layout (top-down): compute x for leaves equally spaced, y by height (normalized)
  const leaves: string[] = [];
  function collectLeaves(n: ClusterNode) {
    if (!n.left && !n.right) { leaves.push(n.label); return; }
    if (n.left) collectLeaves(n.left);
    if (n.right) collectLeaves(n.right);
  }
  collectLeaves(root);

  const width = Math.max(600, leaves.length * 80);
  const margin = { t: 10, r: 10, b: 80, l: 10 };
  const innerW = width - margin.l - margin.r;
  const innerH = height - margin.t - margin.b;

  const leafX: Record<string, number> = {};
  leaves.forEach((lab, i) => { leafX[lab] = (i + 0.5) * (innerW / leaves.length); });

  // find max height
  function maxHeight(n: ClusterNode): number {
    if (!n.left && !n.right) return 0;
    return Math.max(n.left ? maxHeight(n.left) : 0, n.right ? maxHeight(n.right) : 0, (n as any).height || 0);
  }
  const hMax = Math.max(1e-6, maxHeight(root));
  const y = (h: number) => margin.t + innerH - (h / hMax) * innerH;

  type Edge = { x1: number; y1: number; x2: number; y2: number };
  const edges: Edge[] = [];
  const nodePos = new Map<ClusterNode, { x: number; y: number }>();

  function layout(n: ClusterNode): { x: number; y: number } {
    if (!n.left && !n.right) {
      const x = leafX[n.label];
      const y0 = y(0);
      const pos = { x, y: y0 };
      nodePos.set(n, pos);
      return pos;
    }
    const left = n.left ? layout(n.left) : { x: 0, y: 0 };
    const right = n.right ? layout(n.right) : { x: 0, y: 0 };
    const my = y((n as any).height || 0);
    const mx = (left.x + right.x) / 2;
    // edges: left up, right up, horizontal link at my
    edges.push({ x1: left.x, y1: left.y, x2: left.x, y2: my });
    edges.push({ x1: right.x, y1: right.y, x2: right.x, y2: my });
    edges.push({ x1: left.x, y1: my, x2: right.x, y2: my });
    const pos = { x: mx, y: my };
    nodePos.set(n, pos);
    return pos;
  }
  layout(root);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[260px] rounded-md bg-muted/30">
      <g transform={`translate(${margin.l},${margin.t})`}>
        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#64748b" strokeWidth={1} />
        ))}
        {leaves.map((lab, i) => (
          <text key={lab} x={(i + 0.5) * (innerW / leaves.length)} y={innerH + 18} textAnchor="end" transform={`rotate(-45 ${(i + 0.5) * (innerW / leaves.length)} ${innerH + 18})`} className="fill-muted-foreground text-[11px]">
            {lab}
          </text>
        ))}
      </g>
    </svg>
  );
}