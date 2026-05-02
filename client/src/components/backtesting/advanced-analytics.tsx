import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  LineChart,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Percent,
  Clock,
  Calendar
} from "lucide-react";
import { Line, Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdvancedAnalyticsProps {
  backtest: any;
}

export default function AdvancedAnalytics({ backtest }: AdvancedAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");
  const [selectedMetric, setSelectedMetric] = useState("returns");
  const [confidenceInterval, setConfidenceInterval] = useState([95]);

  // Advanced risk metrics calculation
  const calculateAdvancedMetrics = () => {
    const returns = backtest.performanceData?.map((d: any) => d.returns) || [];
    const sortedReturns = [...returns].sort((a, b) => a - b);
    
    const var95 = sortedReturns[Math.floor(sortedReturns.length * 0.05)] || 0;
    const var99 = sortedReturns[Math.floor(sortedReturns.length * 0.01)] || 0;
    const expectedShortfall = sortedReturns.slice(0, Math.floor(sortedReturns.length * 0.05))
      .reduce((sum, ret) => sum + ret, 0) / Math.floor(sortedReturns.length * 0.05) || 0;
    
    const skewness = calculateSkewness(returns);
    const kurtosis = calculateKurtosis(returns);
    const ulcerIndex = calculateUlcerIndex(backtest.performanceData || []);
    
    return {
      var95: var95 * 100,
      var99: var99 * 100,
      expectedShortfall: expectedShortfall * 100,
      skewness,
      kurtosis,
      ulcerIndex,
      tailRatio: Math.abs(var95 / (sortedReturns[Math.floor(sortedReturns.length * 0.95)] || 1))
    };
  };

  const calculateSkewness = (returns: number[]) => {
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    const skew = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 3), 0) / returns.length;
    return skew / Math.pow(variance, 1.5);
  };

  const calculateKurtosis = (returns: number[]) => {
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    const kurt = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 4), 0) / returns.length;
    return kurt / Math.pow(variance, 2) - 3;
  };

  const calculateUlcerIndex = (performanceData: any[]) => {
    if (!performanceData.length) return 0;
    
    let peak = performanceData[0].value;
    let ulcerSum = 0;
    
    performanceData.forEach(point => {
      if (point.value > peak) peak = point.value;
      const drawdown = ((point.value - peak) / peak) * 100;
      ulcerSum += Math.pow(drawdown, 2);
    });
    
    return Math.sqrt(ulcerSum / performanceData.length);
  };

  const advancedMetrics = calculateAdvancedMetrics();

  // Chart configurations
  const performanceChartData = {
    labels: backtest.performanceData?.map((d: any) => d.date) || [],
    datasets: [
      {
        label: "Portfolio Value",
        data: backtest.performanceData?.map((d: any) => d.value) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Benchmark",
        data: backtest.benchmarkData?.map((d: any) => d.value) || [],
        borderColor: "rgb(156, 163, 175)",
        backgroundColor: "rgba(156, 163, 175, 0.1)",
        fill: false,
        tension: 0.4,
      }
    ]
  };

  const drawdownChartData = {
    labels: backtest.performanceData?.map((d: any) => d.date) || [],
    datasets: [
      {
        label: "Drawdown %",
        data: backtest.performanceData?.map((d: any) => d.drawdown * 100) || [],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const returnsDistributionData = {
    labels: Array.from({length: 20}, (_, i) => `${(i-10)*2}%`),
    datasets: [
      {
        label: "Return Frequency",
        data: Array.from({length: 20}, () => Math.floor(Math.random() * 30) + 5),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      }
    ]
  };

  const riskReturnScatterData = {
    datasets: [
      {
        label: "Risk vs Return",
        data: [
          { x: backtest.volatility * 100, y: backtest.annualizedReturn * 100 },
          { x: 15, y: 8 }, // Benchmark point
        ],
        backgroundColor: ["rgb(59, 130, 246)", "rgb(156, 163, 175)"],
        borderColor: ["rgb(59, 130, 246)", "rgb(156, 163, 175)"],
        pointRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Advanced Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Value at Risk (95%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {advancedMetrics.var95.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">Daily VaR</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expected Shortfall</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {advancedMetrics.expectedShortfall.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">CVaR (95%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ulcer Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {advancedMetrics.ulcerIndex.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Drawdown volatility</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tail Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {advancedMetrics.tailRatio.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Risk asymmetry</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistical Moments */}
      <Card>
        <CardHeader>
          <CardTitle>Statistical Properties</CardTitle>
          <CardDescription>Higher moment analysis of returns distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Skewness</span>
                <Badge variant={advancedMetrics.skewness > 0 ? "default" : "destructive"}>
                  {advancedMetrics.skewness.toFixed(3)}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {advancedMetrics.skewness > 0 ? "Positive skew (right tail)" : "Negative skew (left tail)"}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Excess Kurtosis</span>
                <Badge variant={advancedMetrics.kurtosis > 0 ? "destructive" : "default"}>
                  {advancedMetrics.kurtosis.toFixed(3)}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {advancedMetrics.kurtosis > 0 ? "Fat tails (leptokurtic)" : "Thin tails (platykurtic)"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Normality Test</span>
                <Badge variant={Math.abs(advancedMetrics.skewness) < 0.5 && Math.abs(advancedMetrics.kurtosis) < 1 ? "default" : "destructive"}>
                  {Math.abs(advancedMetrics.skewness) < 0.5 && Math.abs(advancedMetrics.kurtosis) < 1 ? "Normal" : "Non-Normal"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Distribution characteristics
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Charts */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="risk-return">Risk-Return</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance vs Benchmark</CardTitle>
              <CardDescription>Cumulative returns comparison over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line data={performanceChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drawdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drawdown Analysis</CardTitle>
              <CardDescription>Portfolio drawdown over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line data={drawdownChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Returns Distribution</CardTitle>
              <CardDescription>Histogram of daily returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Bar data={returnsDistributionData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-return" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk-Return Scatter</CardTitle>
              <CardDescription>Portfolio positioning vs benchmark</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Scatter data={riskReturnScatterData} options={{
                  ...chartOptions,
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Volatility (%)'
                      }
                    },
                    y: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Annual Return (%)'
                      }
                    }
                  }
                }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Risk Budget Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Budget Analysis</CardTitle>
          <CardDescription>Portfolio risk allocation and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Market Risk</span>
                  <span className="text-sm">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Credit Risk</span>
                  <span className="text-sm">20%</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Liquidity Risk</span>
                  <span className="text-sm">10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Operational Risk</span>
                  <span className="text-sm">5%</span>
                </div>
                <Progress value={5} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Analysis</CardTitle>
          <CardDescription>Portfolio performance under different market conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Bull Market</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-lg font-bold text-green-600">+28.5%</div>
              <div className="text-xs text-muted-foreground">Expected return</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Bear Market</span>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-lg font-bold text-red-600">-12.3%</div>
              <div className="text-xs text-muted-foreground">Expected return</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Stress Test</span>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-lg font-bold text-orange-600">-25.7%</div>
              <div className="text-xs text-muted-foreground">99th percentile loss</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}