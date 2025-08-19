// Lightweight HRP utilities (no external deps)
// Inputs: asset log-returns matrix (rows = time, cols = assets) or price series
// Outputs: correlation, distance, HRP order, HRP weights

export type Matrix = number[][];
export type Vector = number[];

export function toReturns(pricesByAsset: Record<string, number[]>): { labels: string[]; returns: Matrix } {
  const labels = Object.keys(pricesByAsset);
  const T = Math.min(...labels.map(l => pricesByAsset[l].length));
  const returns: Matrix = labels.map(l => {
    const p = pricesByAsset[l].slice(-T);
    const r: number[] = [];
    for (let i = 1; i < p.length; i++) {
      r.push(Math.log(p[i] / p[i - 1]));
    }
    return r;
  });
  return { labels, returns };
}

export function mean(v: Vector): number {
  return v.reduce((a, b) => a + b, 0) / (v.length || 1);
}

export function variance(v: Vector): number {
  const m = mean(v);
  return v.reduce((a, b) => a + (b - m) * (b - m), 0) / (v.length || 1);
}

export function covariance(x: Vector, y: Vector): number {
  const mx = mean(x);
  const my = mean(y);
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  let s = 0;
  for (let i = 0; i < n; i++) s += (x[i] - mx) * (y[i] - my);
  return s / n;
}

export function corrMatrix(returns: Matrix): Matrix {
  const n = returns.length;
  const out: Matrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const cov = covariance(returns[i], returns[j]);
      const sd = Math.sqrt(variance(returns[i]) * variance(returns[j])) || 1e-12;
      const c = cov / sd;
      out[i][j] = out[j][i] = isFinite(c) ? Math.max(-1, Math.min(1, c)) : 0;
    }
  }
  return out;
}

// Distance metric for HRP (López de Prado): d_ij = sqrt(0.5 * (1 - corr_ij))
export function distanceFromCorr(corr: Matrix): Matrix {
  const n = corr.length;
  const dist: Matrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const d = Math.sqrt(Math.max(0, 0.5 * (1 - corr[i][j])));
      dist[i][j] = dist[j][i] = d;
    }
  }
  return dist;
}

// Simple agglomerative single-linkage clustering to produce a binary tree usable for dendrogram and HRP ordering.
export type ClusterNode =
  | { id: number; label: string; size: 1; height: 0; left?: undefined; right?: undefined }
  | { id: number; label: string; size: number; height: number; left: ClusterNode; right: ClusterNode };

export function singleLinkage(dist: Matrix, labels: string[]): ClusterNode {
  // Initialize leaves
  let nodes: ClusterNode[] = labels.map((l, i) => ({ id: i, label: l, size: 1, height: 0 as const }));
  let currentDist = dist.map(row => row.slice());
  let active = nodes.map((_, i) => i);
  const n0 = labels.length;
  let nextId = n0;

  function clusterDistance(aIdx: number, bIdx: number): number {
    // Single linkage distance = min distance between elements
    let minD = Infinity;
    const aMembers = getMembers(nodes[aIdx]);
    const bMembers = getMembers(nodes[bIdx]);
    for (const i of aMembers) for (const j of bMembers) if (currentDist[i][j] < minD) minD = currentDist[i][j];
    return minD;
  }

  function getMembers(node: ClusterNode): number[] {
    if (!node.left && !node.right) return [node.id];
    const left = node.left ? getMembers(node.left) : [];
    const right = node.right ? getMembers(node.right) : [];
    return left.concat(right);
  }

  while (active.length > 1) {
    let bestA = 0, bestB = 1, best = Infinity;
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i], b = active[j];
        const d = clusterDistance(a, b);
        if (d < best) { best = d; bestA = a; bestB = b; }
      }
    }
    const left = nodes[bestA];
    const right = nodes[bestB];
    const merged: ClusterNode = {
      id: nextId++,
      label: `${left.label}+${right.label}`,
      size: (left.size as number) + (right.size as number),
      height: best,
      left, right,
    };
    nodes.push(merged);

    // Remove merged indices from active and add new index
    active = active.filter(i => i !== bestA && i !== bestB);
    active.push(nodes.length - 1);
  }

  return nodes[active[0]];
}

// Quasi-diagonalization order from dendrogram (inorder leaf order)
export function leafOrder(root: ClusterNode): number[] {
  const order: number[] = [];
  function dfs(n: ClusterNode) {
    if (!n.left && !n.right) { order.push(n.id); return; }
    if (n.left) dfs(n.left);
    if (n.right) dfs(n.right);
  }
  dfs(root);
  return order;
}

// HRP recursive bisection weights
export function hrpWeights(cov: Matrix, order: number[]): number[] {
  function clusterVariance(indices: number[]): number {
    // Variance of equally-weighted cluster: 1' * Cov * 1 with weights normalized
    const w = 1 / indices.length;
    let v = 0;
    for (let i = 0; i < indices.length; i++) {
      for (let j = 0; j < indices.length; j++) {
        v += w * w * cov[indices[i]][indices[j]];
      }
    }
    return v;
  }

  function split(indices: number[]): [number[], number[]] {
    const mid = Math.floor(indices.length / 2);
    return [indices.slice(0, mid), indices.slice(mid)];
  }

  const weights: number[] = Array(cov.length).fill(0);
  function recurse(indices: number[], alloc: number) {
    if (indices.length === 1) {
      weights[indices[0]] = alloc;
      return;
    }
    const [left, right] = split(indices);
    const vL = clusterVariance(left);
    const vR = clusterVariance(right);
    const allocL = alloc * (1 - vL / (vL + vR));
    const allocR = alloc * (1 - vR / (vL + vR));
    recurse(left, allocL);
    recurse(right, allocR);
  }

  recurse(order, 1);
  return weights;
}

export function covMatrix(returns: Matrix): Matrix {
  const n = returns.length;
  const out: Matrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const c = covariance(returns[i], returns[j]);
      out[i][j] = out[j][i] = c;
    }
  }
  return out;
}

// Percentiles for Monte Carlo fan
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] * (hi - idx) + sorted[hi] * (idx - lo);
}

export function fanBands(series: number[][], ps: number[] = [0.05, 0.25, 0.5, 0.75, 0.95]): number[][] {
  const T = series[0]?.length || 0;
  return ps.map(p =>
    Array.from({ length: T }, (_, t) => percentile(series.map(path => path[t]), p))
  );
}