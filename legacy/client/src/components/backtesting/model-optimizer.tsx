import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings,
  Zap,
  Target,
  TrendingUp,
  Brain,
  BarChart3,
  LineChart,
  Activity,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Layers
} from "lucide-react";
import { Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
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
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ModelOptimizerProps {
  backtest: any;
  onOptimize: (parameters: any) => void;
}

export default function ModelOptimizer({ backtest, onOptimize }: ModelOptimizerProps) {
  const [optimizationMode, setOptimizationMode] = useState("sharpe");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hyperParameters, setHyperParameters] = useState({
    lookbackWindow: [20],
    rebalanceFrequency: [5],
    riskTolerance: [0.15],
    momentumWeight: [0.6],
    volatilityWeight: [0.4],
    maxPositions: [10],
    minWeight: [0.02],
    maxWeight: [0.25]
  });

  const [optimizationResults, setOptimizationResults] = useState({
    originalSharpe: 1.45,
    optimizedSharpe: 1.78,
    improvement: 22.8,
    iterations: 150,
    convergence: 95.2,
    bestParameters: {
      lookbackWindow: 18,
      rebalanceFrequency: 7,
      riskTolerance: 0.12,
      momentumWeight: 0.65,
      volatilityWeight: 0.35
    }
  });

  const handleOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      setOptimizationResults(prev => ({
        ...prev,
        optimizedSharpe: prev.originalSharpe * (1 + Math.random() * 0.3),
        improvement: 15 + Math.random() * 20,
        iterations: 100 + Math.floor(Math.random() * 100),
        convergence: 90 + Math.random() * 10
      }));
      setIsOptimizing(false);
      onOptimize(hyperParameters);
    }, 3000);
  };

  // Optimization charts
  const convergenceData = {
    labels: Array.from({length: 50}, (_, i) => i + 1),
    datasets: [
      {
        label: "Sharpe Ratio",
        data: Array.from({length: 50}, (_, i) => 
          1.45 + (0.33 * (1 - Math.exp(-i/15))) + (Math.random() - 0.5) * 0.1
        ),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const parameterSensitivityData = {
    labels: ['Lookback', 'Rebalance Freq', 'Risk Tolerance', 'Momentum', 'Volatility', 'Max Positions'],
    datasets: [
      {
        label: 'Current',
        data: [75, 60, 80, 85, 70, 65],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
      {
        label: 'Optimized',
        data: [82, 68, 90, 88, 75, 72],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(34, 197, 94)',
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

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Optimization Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Model Optimization</span>
          </CardTitle>
          <CardDescription>
            Hyperparameter tuning and performance optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Optimization Target */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Optimization Target</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: "sharpe", label: "Sharpe Ratio", icon: Target },
                  { id: "return", label: "Total Return", icon: TrendingUp },
                  { id: "calmar", label: "Calmar Ratio", icon: BarChart3 },
                  { id: "sortino", label: "Sortino Ratio", icon: Activity }
                ].map((target) => {
                  const Icon = target.icon;
                  return (
                    <Button
                      key={target.id}
                      variant={optimizationMode === target.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOptimizationMode(target.id)}
                      className="justify-start"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {target.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Hyperparameter Controls */}
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="risk">Risk</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Lookback Window: {hyperParameters.lookbackWindow[0]} days</Label>
                    <Slider
                      value={hyperParameters.lookbackWindow}
                      onValueChange={(value) => setHyperParameters(prev => ({...prev, lookbackWindow: value}))}
                      max={60}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Rebalance Frequency: {hyperParameters.rebalanceFrequency[0]} days</Label>
                    <Slider
                      value={hyperParameters.rebalanceFrequency}
                      onValueChange={(value) => setHyperParameters(prev => ({...prev, rebalanceFrequency: value}))}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Risk Tolerance: {(hyperParameters.riskTolerance[0] * 100).toFixed(1)}%</Label>
                    <Slider
                      value={hyperParameters.riskTolerance}
                      onValueChange={(value) => setHyperParameters(prev => ({...prev, riskTolerance: value}))}
                      max={0.5}
                      min={0.05}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Max Positions: {hyperParameters.maxPositions[0]}</Label>
                    <Slider
                      value={hyperParameters.maxPositions}
                      onValueChange={(value) => setHyperParameters(prev => ({...prev, maxPositions: value}))}
                      max={20}
                      min={3}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Momentum Weight: {(hyperParameters.momentumWeight[0] * 100).toFixed(1)}%</Label>
                    <Slider
                      value={hyperParameters.momentumWeight}
                      onValueChange={(value) => setHyperParameters(prev => ({...prev, momentumWeight: value}))}
                      max={1}
                      min={0}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Volatility Weight: {(hyperParameters.volatilityWeight[0] * 100).toFixed(1)}%</Label>
                    <Slider
                      value={hyperParameters.volatilityWeight}
                      onValueChange={(value) => setHyperParameters(prev => ({...prev, volatilityWeight: value}))}
                      max={1}
                      min={0}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Min Weight: {(hyperParameters.minWeight[0] * 100).toFixed(1)}%</Label>
                    <Slider
                      value={hyperParameters.minWeight}
                      onValueChange={(value) => setHyperParameters(prev => ({...prev, minWeight: value}))}
                      max={0.1}
                      min={0.01}
                      step={0.005}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Max Weight: {(hyperParameters.maxWeight[0] * 100).toFixed(1)}%</Label>
                    <Slider
                      value={hyperParameters.maxWeight}
                      onValueChange={(value) => setHyperParameters(prev => ({...prev, maxWeight: value}))}
                      max={0.5}
                      min={0.1}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="risk" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stop-loss">Enable Stop Loss</Label>
                    <Switch id="stop-loss" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="portfolio-insurance">Portfolio Insurance</Label>
                    <Switch id="portfolio-insurance" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="correlation-filter">Correlation Filter</Label>
                    <Switch id="correlation-filter" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volatility-targeting">Volatility Targeting</Label>
                    <Switch id="volatility-targeting" defaultChecked />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Optimization Button */}
            <Button 
              onClick={handleOptimization} 
              disabled={isOptimizing}
              className="w-full"
              size="lg"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing... ({Math.floor(Math.random() * 100)}%)
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Start Optimization
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Original Sharpe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationResults.originalSharpe.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Baseline performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Optimized Sharpe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{optimizationResults.optimizedSharpe.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">After optimization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">+{optimizationResults.improvement.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Performance gain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Convergence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationResults.convergence.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Algorithm convergence</p>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Convergence Progress</CardTitle>
            <CardDescription>Optimization algorithm convergence over iterations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line data={convergenceData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameter Sensitivity</CardTitle>
            <CardDescription>Current vs optimized parameter values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Radar data={parameterSensitivityData} options={radarOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Optimized Parameters</CardTitle>
          <CardDescription>Best parameter combination found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(optimizationResults.bestParameters).map(([key, value]) => (
              <div key={key} className="p-3 border rounded-lg">
                <div className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-lg font-bold text-blue-600">
                  {typeof value === 'number' ? value.toFixed(2) : value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization History */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization History</CardTitle>
          <CardDescription>Previous optimization runs and results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "2024-06-28", target: "Sharpe Ratio", result: 1.78, improvement: 22.8, status: "completed" },
              { date: "2024-06-27", target: "Calmar Ratio", result: 2.45, improvement: 18.2, status: "completed" },
              { date: "2024-06-26", target: "Total Return", result: 0.284, improvement: 15.7, status: "completed" },
              { date: "2024-06-25", target: "Sortino Ratio", result: 1.92, improvement: 12.3, status: "failed" },
            ].map((run, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {run.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium">{run.target}</span>
                  </div>
                  <Badge variant="outline">{run.date}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Result: {run.result}
                  </div>
                  <div className={`text-xs ${run.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                    {run.status === 'completed' ? `+${run.improvement}%` : 'Failed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}