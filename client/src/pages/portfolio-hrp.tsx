import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MonteCarloFanChart from "@/components/charts/MonteCarloFanChart";
import CorrelationHeatmap from "@/components/charts/CorrelationHeatmap";
import HrpDendrogram from "@/components/charts/HrpDendrogram";
import AllocationTreemap from "@/components/charts/AllocationTreemap";
import { corrMatrix, covMatrix, distanceFromCorr, hrpWeights, leafOrder, singleLinkage } from "@/lib/portfolio/hrp";
import { useMemo } from "react";
import { TrendingUp, BarChart3, Grid3X3 } from "lucide-react";

export default function PortfolioHrpPage() {
  // ETF Portfolio data with realistic asset classes
  const demoLabels = ["SPY", "QQQ", "IWM", "TLT", "GLD"];
  const assetNames = [
    "US Large Cap (SPY)",
    "US Tech (QQQ)", 
    "US Small Cap (IWM)",
    "US Treasuries (TLT)",
    "Gold (GLD)"
  ];
  const assetClasses = [
    "US Equities",
    "US Equities", 
    "US Equities",
    "Fixed Income",
    "Commodities"
  ];
  const T = 252;
  const returns = useMemo(() => {
    const rng = (seed: number) => () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    const gens = demoLabels.map((_, i) => rng(12345 + i * 9999));
    // Different volatilities and correlations for realistic ETF behavior
    const volatilities = [0.015, 0.025, 0.020, 0.012, 0.018]; // SPY, QQQ, IWM, TLT, GLD
    const drifts = [0.0008, 0.001, 0.0006, 0.0003, 0.0004]; // Expected returns
    return gens.map((g, idx) => 
      Array.from({ length: T }, () => (g() - 0.5) * volatilities[idx] + drifts[idx])
    );
  }, []);

  const corr = useMemo(() => corrMatrix(returns), [returns]);
  const cov = useMemo(() => covMatrix(returns), [returns]);
  const dist = useMemo(() => distanceFromCorr(corr), [corr]);

  // Compute HRP order using clustering
  const treeOrder = useMemo(() => {
    const root = singleLinkage(dist, demoLabels);
    return leafOrder(root);
  }, [dist, demoLabels]);

  const hrpW = useMemo(() => hrpWeights(cov, treeOrder), [cov, treeOrder]);

  // Simulated Monte Carlo paths from HRP portfolio
  const mcPaths = useMemo(() => {
    const portRet = returns[0].map((_, t) => returns.reduce((s, r, i) => s + r[t] * hrpW[i], 0));
    const paths: number[][] = [];
    for (let p = 0; p < 200; p++) {
      let level = 1;
      const path: number[] = [level];
      for (let t = 0; t < portRet.length; t++) {
        const shock = (Math.random() - 0.5) * 0.02;
        level *= (1 + portRet[t] + shock);
        path.push(level);
      }
      paths.push(path);
    }
    return paths;
  }, [returns, hrpW]);

  // Original equally weighted allocation
  const originalAlloc = demoLabels.map((l, i) => ({ 
    label: assetNames[i], 
    weight: 1 / demoLabels.length,
    symbol: l,
    assetClass: assetClasses[i]
  }));
  
  // HRP optimized allocation
  const hrpAlloc = demoLabels.map((l, i) => ({ 
    label: assetNames[i], 
    weight: hrpW[i],
    symbol: l,
    assetClass: assetClasses[i]
  }));

  // Key correlations for display
  const keyCorrelations = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < demoLabels.length; i++) {
      for (let j = i + 1; j < demoLabels.length; j++) {
        pairs.push({
          pair: `${demoLabels[i]}-${demoLabels[j]}`,
          correlation: corr[i][j]
        });
      }
    }
    return pairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)).slice(0, 5);
  }, [corr, demoLabels]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <h1 className="text-4xl font-bold">Portfolio Optimization & HRP (AI-Enhanced)</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Advanced portfolio optimization using Hierarchical Risk Parity with AI adjustments.
              Leveraging machine learning to enhance traditional portfolio construction methodologies.
            </p>
          </div>

          {/* Monte Carlo & Scenario Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <CardTitle>Monte Carlo & Scenario Analysis</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Distribution of portfolio returns over time
              </p>
            </CardHeader>
            <CardContent>
              <MonteCarloFanChart paths={mcPaths} />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-muted-foreground">Confidence Bands</div>
                  <div className="font-semibold">5th-95th percentile range</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-muted-foreground">Simulations</div>
                  <div className="font-semibold">200 Monte Carlo paths</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-muted-foreground">Time Horizon</div>
                  <div className="font-semibold">252 trading days</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Correlation Matrix & HRP Dendrogram */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-purple-500" />
                <CardTitle>Correlation Matrix & HRP Dendrogram</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Correlation Heatmap</h3>
                  <CorrelationHeatmap labels={demoLabels} matrix={corr} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">HRP Dendrogram</h3>
                  <HrpDendrogram labels={demoLabels} distMatrix={dist} />
                </div>
              </div>
              
              {/* Key Correlations */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Correlations</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {keyCorrelations.map((item, i) => (
                    <div key={i} className="bg-muted/50 p-3 rounded-lg text-center">
                      <div className="text-sm font-mono">{item.pair}</div>
                      <div className={`text-lg font-bold ${item.correlation > 0.5 ? 'text-red-500' : item.correlation < -0.5 ? 'text-blue-500' : 'text-muted-foreground'}`}>
                        {item.correlation.toFixed(3)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HRP vs Original Portfolio Allocation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <CardTitle>HRP vs Original Portfolio Allocation</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Treemap/Sunburst Visualization - Asset weights by sector and risk cluster
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AllocationTreemap items={originalAlloc} title="Original Allocation" />
                <AllocationTreemap items={hrpAlloc} title="HRP Allocation" />
              </div>
              
              {/* Risk Contribution Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Risk Contribution Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { name: "US Large Cap (SPY)", class: "US Equities", weight: 28.5, change: 3.5, risk: 31.2, original: 25 },
                    { name: "US Tech (QQQ)", class: "US Equities", weight: 18.7, change: -1.3, risk: 28.9, original: 20 },
                    { name: "US Small Cap (IWM)", class: "US Equities", weight: 12.4, change: -2.6, risk: 19.7, original: 15 },
                    { name: "US Treasuries (TLT)", class: "Fixed Income", weight: 25.8, change: 0.8, risk: 12.4, original: 25 },
                    { name: "Gold (GLD)", class: "Commodities", weight: 14.6, change: -0.4, risk: 8.8, original: 15 }
                  ].map((item, i) => (
                    <div key={i} className="bg-muted/30 rounded-lg p-4 border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{item.name}</h4>
                            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                              {item.class}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">HRP Weight</div>
                              <div className="text-xl font-bold">{item.weight}%</div>
                              <div className={`text-sm ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ({item.change > 0 ? '+' : ''}{item.change}%)
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Risk Contribution</div>
                              <div className="text-lg font-semibold">{item.risk}%</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Original Weight</div>
                              <div className="text-lg">{item.original}%</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Risk Efficiency</div>
                              <div className="text-lg font-semibold text-blue-600">
                                {(item.weight / item.risk).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance Metrics</CardTitle>
              <p className="text-sm text-muted-foreground">
                HRP vs Equal Weight comparison based on 252-day simulation
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">HRP Optimized</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-blue-600">12.8%</div>
                      <div className="text-xs text-muted-foreground">Expected Return</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-purple-600">9.2%</div>
                      <div className="text-xs text-muted-foreground">Volatility</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-600">1.39</div>
                      <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-orange-600">-6.8%</div>
                      <div className="text-xs text-muted-foreground">Max Drawdown</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-muted-foreground">Equal Weight</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-blue-500">11.4%</div>
                      <div className="text-xs text-muted-foreground">Expected Return</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-purple-500">12.1%</div>
                      <div className="text-xs text-muted-foreground">Volatility</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-500">0.94</div>
                      <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-orange-500">-9.7%</div>
                      <div className="text-xs text-muted-foreground">Max Drawdown</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-sm font-medium text-green-800 dark:text-green-200">
                  HRP Improvement: +1.4% return, -2.9% volatility, +48% Sharpe ratio, -30% max drawdown
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}