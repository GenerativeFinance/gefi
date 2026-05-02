import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Square, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  LineChart, 
  DollarSign,
  Calendar,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Code,
  Database,
  Zap
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';

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

interface BacktestConfig {
  modelId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  benchmark: string;
  assets: string[];
  riskParameters: {
    maxDrawdown: number;
    stopLoss: number;
    positionSize: number;
  };
  dataSource: string;
  frequency: string;
}

interface BacktestResult {
  id: string;
  config: BacktestConfig;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  endTime?: string;
  metrics: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    winRate: number;
    profitFactor: number;
    calmarRatio: number;
    sortinoRatio: number;
    beta: number;
    alpha: number;
    informationRatio: number;
  };
  performance: {
    dates: string[];
    portfolioValue: number[];
    benchmarkValue: number[];
    drawdown: number[];
    returns: number[];
  };
  trades: {
    date: string;
    symbol: string;
    action: 'buy' | 'sell';
    quantity: number;
    price: number;
    value: number;
    reason: string;
  }[];
  riskAnalysis: {
    varDaily: number;
    varMonthly: number;
    expectedShortfall: number;
    correlations: Record<string, number>;
  };
}

export default function BacktestingEnvironment() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('setup');
  const [runningTests, setRunningTests] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  // Backtesting configuration state
  const [config, setConfig] = useState<BacktestConfig>({
    modelId: '',
    startDate: '2022-01-01',
    endDate: '2023-12-31',
    initialCapital: 100000,
    benchmark: 'SPY',
    assets: ['AAPL', 'GOOGL', 'MSFT', 'TSLA'],
    riskParameters: {
      maxDrawdown: 20,
      stopLoss: 5,
      positionSize: 10
    },
    dataSource: 'yahoo',
    frequency: 'daily'
  });

  // Fetch available AI models
  const { data: aiModels = [] } = useQuery({
    queryKey: ['/api/ai-models']
  });

  // Fetch backtest results
  const { data: backtestResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ['/api/backtesting/results']
  });

  // Run backtest mutation
  const runBacktestMutation = useMutation({
    mutationFn: async (config: BacktestConfig) => {
      return apiRequest('POST', '/api/backtesting/run', config);
    },
    onSuccess: (data) => {
      toast({
        title: "Backtest Started",
        description: "Your backtest is running. Results will appear shortly.",
      });
      setRunningTests(prev => [...prev, data.id]);
      queryClient.invalidateQueries({ queryKey: ['/api/backtesting/results'] });
      setActiveTab('results');
    },
    onError: (error: any) => {
      toast({
        title: "Backtest Failed",
        description: error.message || "Failed to start backtest",
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Running</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatMetric = (value: number, type: 'percentage' | 'ratio' | 'currency' | 'number' = 'number') => {
    switch (type) {
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`;
      case 'ratio':
        return value.toFixed(3);
      case 'currency':
        return `$${value.toLocaleString()}`;
      default:
        return value.toFixed(2);
    }
  };

  const selectedResultData = selectedResult 
    ? backtestResults.find((r: BacktestResult) => r.id === selectedResult)
    : null;

  const performanceChartData = selectedResultData ? {
    labels: selectedResultData.performance.dates,
    datasets: [
      {
        label: 'Portfolio Value',
        data: selectedResultData.performance.portfolioValue,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.1
      },
      {
        label: 'Benchmark',
        data: selectedResultData.performance.benchmarkValue,
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        fill: false,
        tension: 0.1
      }
    ]
  } : null;

  const drawdownChartData = selectedResultData ? {
    labels: selectedResultData.performance.dates,
    datasets: [
      {
        label: 'Drawdown',
        data: selectedResultData.performance.drawdown,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  } : null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Backtesting Environment</h1>
              <p className="text-muted-foreground mt-2">Test AI models against historical data</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Config
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            {/* Setup Tab */}
            <TabsContent value="setup" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Model Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Model Configuration
                    </CardTitle>
                    <CardDescription>
                      Select the AI model and configure parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="model">AI Model</Label>
                      <Select value={config.modelId} onValueChange={(value) => setConfig(prev => ({ ...prev, modelId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          {aiModels.map((model: any) => (
                            <SelectItem key={model.id} value={model.id.toString()}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={config.startDate}
                          onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={config.endDate}
                          onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="initialCapital">Initial Capital ($)</Label>
                      <Input
                        id="initialCapital"
                        type="number"
                        value={config.initialCapital}
                        onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="benchmark">Benchmark</Label>
                      <Select value={config.benchmark} onValueChange={(value) => setConfig(prev => ({ ...prev, benchmark: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SPY">S&P 500 (SPY)</SelectItem>
                          <SelectItem value="QQQ">NASDAQ (QQQ)</SelectItem>
                          <SelectItem value="VTI">Total Stock Market (VTI)</SelectItem>
                          <SelectItem value="IWM">Russell 2000 (IWM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Data Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure data sources and parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="assets">Assets (comma-separated)</Label>
                      <Textarea
                        id="assets"
                        value={config.assets.join(', ')}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          assets: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }))}
                        placeholder="AAPL, GOOGL, MSFT, TSLA"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dataSource">Data Source</Label>
                        <Select value={config.dataSource} onValueChange={(value) => setConfig(prev => ({ ...prev, dataSource: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yahoo">Yahoo Finance</SelectItem>
                            <SelectItem value="alpha_vantage">Alpha Vantage</SelectItem>
                            <SelectItem value="iex">IEX Cloud</SelectItem>
                            <SelectItem value="quandl">Quandl</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="frequency">Data Frequency</Label>
                        <Select value={config.frequency} onValueChange={(value) => setConfig(prev => ({ ...prev, frequency: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Risk Parameters
                    </CardTitle>
                    <CardDescription>
                      Configure risk management settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
                      <Input
                        id="maxDrawdown"
                        type="number"
                        value={config.riskParameters.maxDrawdown}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          riskParameters: { 
                            ...prev.riskParameters, 
                            maxDrawdown: Number(e.target.value) 
                          }
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                      <Input
                        id="stopLoss"
                        type="number"
                        value={config.riskParameters.stopLoss}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          riskParameters: { 
                            ...prev.riskParameters, 
                            stopLoss: Number(e.target.value) 
                          }
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="positionSize">Position Size (%)</Label>
                      <Input
                        id="positionSize"
                        type="number"
                        value={config.riskParameters.positionSize}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          riskParameters: { 
                            ...prev.riskParameters, 
                            positionSize: Number(e.target.value) 
                          }
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Action Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Run Backtest
                    </CardTitle>
                    <CardDescription>
                      Execute the backtest with current configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => runBacktestMutation.mutate(config)}
                      disabled={!config.modelId || runBacktestMutation.isPending}
                      className="w-full"
                      size="lg"
                    >
                      {runBacktestMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Starting Backtest...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Backtest
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Results List */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Backtest Results</CardTitle>
                    <CardDescription>
                      Click on a result to view details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resultsLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
                          <p className="text-sm text-muted-foreground mt-2">Loading results...</p>
                        </div>
                      ) : backtestResults.length === 0 ? (
                        <div className="text-center py-8">
                          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No backtest results yet</p>
                          <p className="text-sm text-muted-foreground">Run your first backtest to see results here</p>
                        </div>
                      ) : (
                        backtestResults.map((result: BacktestResult) => (
                          <div
                            key={result.id}
                            onClick={() => setSelectedResult(result.id)}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                              selectedResult === result.id 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-sm font-medium truncate">
                                Model {result.config.modelId}
                              </div>
                              {getStatusBadge(result.status)}
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div>Period: {result.config.startDate} to {result.config.endDate}</div>
                              <div>Capital: ${result.config.initialCapital.toLocaleString()}</div>
                              {result.status === 'completed' && (
                                <div className="text-green-600 dark:text-green-400 font-medium">
                                  Return: {formatMetric(result.metrics.totalReturn, 'percentage')}
                                </div>
                              )}
                              {result.status === 'running' && (
                                <Progress value={result.progress} className="h-1" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Results */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedResultData ? (
                    <>
                      {/* Performance Metrics */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Metrics</CardTitle>
                          <CardDescription>
                            Key performance indicators for the selected backtest
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatMetric(selectedResultData.metrics.totalReturn, 'percentage')}
                              </div>
                              <div className="text-sm text-muted-foreground">Total Return</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatMetric(selectedResultData.metrics.sharpeRatio, 'ratio')}
                              </div>
                              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {formatMetric(selectedResultData.metrics.maxDrawdown, 'percentage')}
                              </div>
                              <div className="text-sm text-muted-foreground">Max Drawdown</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {formatMetric(selectedResultData.metrics.winRate, 'percentage')}
                              </div>
                              <div className="text-sm text-muted-foreground">Win Rate</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Annual Return</span>
                                <span className="text-sm font-medium">{formatMetric(selectedResultData.metrics.annualizedReturn, 'percentage')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Volatility</span>
                                <span className="text-sm font-medium">{formatMetric(selectedResultData.metrics.volatility, 'percentage')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Profit Factor</span>
                                <span className="text-sm font-medium">{formatMetric(selectedResultData.metrics.profitFactor, 'ratio')}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Calmar Ratio</span>
                                <span className="text-sm font-medium">{formatMetric(selectedResultData.metrics.calmarRatio, 'ratio')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Sortino Ratio</span>
                                <span className="text-sm font-medium">{formatMetric(selectedResultData.metrics.sortinoRatio, 'ratio')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Beta</span>
                                <span className="text-sm font-medium">{formatMetric(selectedResultData.metrics.beta, 'ratio')}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Alpha</span>
                                <span className="text-sm font-medium">{formatMetric(selectedResultData.metrics.alpha, 'percentage')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Information Ratio</span>
                                <span className="text-sm font-medium">{formatMetric(selectedResultData.metrics.informationRatio, 'ratio')}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Performance Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Chart</CardTitle>
                          <CardDescription>
                            Portfolio value vs benchmark over time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {performanceChartData && (
                            <div className="h-64">
                              <Line 
                                data={performanceChartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: 'top' as const,
                                    },
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: false,
                                    },
                                  },
                                }}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Drawdown Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Drawdown Analysis</CardTitle>
                          <CardDescription>
                            Portfolio drawdown over time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {drawdownChartData && (
                            <div className="h-48">
                              <Bar 
                                data={drawdownChartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      display: false,
                                    },
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      max: 0,
                                    },
                                  },
                                }}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Select a Backtest Result</h3>
                        <p className="text-muted-foreground">Choose a backtest from the list to view detailed results and analysis</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Analysis</CardTitle>
                    <CardDescription>
                      Value at Risk and risk metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedResultData ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="text-xl font-bold text-red-600 dark:text-red-400">
                              {formatMetric(selectedResultData.riskAnalysis.varDaily, 'percentage')}
                            </div>
                            <div className="text-sm text-muted-foreground">Daily VaR (95%)</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                              {formatMetric(selectedResultData.riskAnalysis.varMonthly, 'percentage')}
                            </div>
                            <div className="text-sm text-muted-foreground">Monthly VaR (95%)</div>
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            {formatMetric(selectedResultData.riskAnalysis.expectedShortfall, 'percentage')}
                          </div>
                          <div className="text-sm text-muted-foreground">Expected Shortfall</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Select a backtest to view risk analysis</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trade Analysis</CardTitle>
                    <CardDescription>
                      Recent trades and execution details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedResultData ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedResultData.trades.slice(0, 10).map((trade, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{trade.symbol}</div>
                              <div className="text-xs text-muted-foreground">{trade.date}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-medium ${
                                trade.action === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {trade.action.toUpperCase()} {trade.quantity}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ${trade.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Select a backtest to view trades</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Model Comparison</CardTitle>
                  <CardDescription>
                    Compare performance across different backtests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Comparison Coming Soon</h3>
                    <p className="text-muted-foreground">Advanced model comparison features will be available in the next update</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}