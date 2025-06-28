import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  BarChart3,
  LineChart,
  Activity,
  Settings,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Zap,
  Target,
  Brain
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Line, Bar } from "react-chartjs-2";
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

const backtestConfigSchema = z.object({
  modelId: z.string().min(1, "Model selection is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  initialCapital: z.string().min(1, "Initial capital is required"),
  benchmark: z.string().min(1, "Benchmark is required"),
  commission: z.string(),
  slippage: z.string(),
  riskFreeRate: z.string(),
});

type BacktestConfig = z.infer<typeof backtestConfigSchema>;

interface BacktestResult {
  id: string;
  modelId: string;
  modelName: string;
  status: 'running' | 'completed' | 'failed';
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalValue: number;
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  winRate: number;
  profitFactor: number;
  createdAt: string;
  completedAt?: string;
  trades: Trade[];
  performanceData: PerformancePoint[];
  benchmarkData: PerformancePoint[];
  metrics: BacktestMetrics;
}

interface Trade {
  date: string;
  symbol: string;
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  value: number;
  commission: number;
  pnl?: number;
}

interface PerformancePoint {
  date: string;
  value: number;
  drawdown: number;
  returns: number;
}

interface BacktestMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWinSize: number;
  avgLossSize: number;
  largestWin: number;
  largestLoss: number;
  avgHoldingPeriod: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  calmarRatio: number;
  sortinoRatio: number;
}

export default function BacktestingEnvironment() {
  const [selectedTab, setSelectedTab] = useState("configure");
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [selectedBacktest, setSelectedBacktest] = useState<BacktestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: models = [] } = useQuery({
    queryKey: ["/api/developer/models"],
    retry: false,
  });

  const { data: backtests = [], isLoading: backtestsLoading } = useQuery<BacktestResult[]>({
    queryKey: ["/api/backtests"],
    retry: false,
  });

  const { data: marketData } = useQuery({
    queryKey: ["/api/market-data/historical"],
    retry: false,
  });

  const form = useForm<BacktestConfig>({
    resolver: zodResolver(backtestConfigSchema),
    defaultValues: {
      modelId: "",
      startDate: "",
      endDate: "",
      initialCapital: "100000",
      benchmark: "SPY",
      commission: "0.001",
      slippage: "0.0005",
      riskFreeRate: "0.02",
    },
  });

  const createBacktestMutation = useMutation({
    mutationFn: async (data: BacktestConfig) => {
      return apiRequest('POST', '/api/backtests', data);
    },
    onSuccess: () => {
      toast({
        title: "Backtest Started",
        description: "Your backtest is now running. Results will appear when complete.",
      });
      setShowConfigDialog(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/backtests"] });
      setIsRunning(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const stopBacktestMutation = useMutation({
    mutationFn: async (backtestId: string) => {
      return apiRequest('POST', `/api/backtests/${backtestId}/stop`);
    },
    onSuccess: () => {
      toast({
        title: "Backtest Stopped",
        description: "The backtest has been stopped successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/backtests"] });
      setIsRunning(false);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <RefreshCw className="h-4 w-4 animate-spin" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "failed": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const createPerformanceChart = (backtest: BacktestResult) => {
    if (!backtest.performanceData || backtest.performanceData.length === 0) return null;

    const chartData = {
      labels: backtest.performanceData.map(point => 
        new Date(point.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: backtest.modelName,
          data: backtest.performanceData.map(point => point.value),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.1,
        },
        {
          label: 'Benchmark',
          data: backtest.benchmarkData?.map(point => point.value) || [],
          borderColor: 'rgb(156, 163, 175)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          fill: false,
          tension: 0.1,
        }
      ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Portfolio Performance vs Benchmark'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value: any) {
              return formatCurrency(value);
            }
          }
        }
      }
    };

    return <Line data={chartData} options={options} />;
  };

  const createDrawdownChart = (backtest: BacktestResult) => {
    if (!backtest.performanceData || backtest.performanceData.length === 0) return null;

    const chartData = {
      labels: backtest.performanceData.map(point => 
        new Date(point.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: 'Drawdown',
          data: backtest.performanceData.map(point => point.drawdown * 100),
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
        }
      ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Drawdown Analysis'
        }
      },
      scales: {
        y: {
          max: 0,
          ticks: {
            callback: function(value: any) {
              return `${value}%`;
            }
          }
        }
      }
    };

    return <Bar data={chartData} options={options} />;
  };

  if (backtestsLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Backtesting Environment</h1>
            <p className="text-muted-foreground">Test AI models against historical data and optimize performance</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Brain className="h-4 w-4 mr-2" />
                  New Backtest
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Configure Backtest</DialogTitle>
                  <DialogDescription>
                    Set up parameters for backtesting your AI model
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => createBacktestMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="modelId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AI Model</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {models.map((model: any) => (
                                  <SelectItem key={model.id} value={model.id.toString()}>
                                    {model.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="benchmark"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Benchmark</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select benchmark" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SPY">S&P 500 (SPY)</SelectItem>
                                <SelectItem value="QQQ">NASDAQ 100 (QQQ)</SelectItem>
                                <SelectItem value="IWM">Russell 2000 (IWM)</SelectItem>
                                <SelectItem value="VTI">Total Stock Market (VTI)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="initialCapital"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Initial Capital ($)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="100000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="commission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Commission (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.001" placeholder="0.001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="slippage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slippage (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.0001" placeholder="0.0005" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="riskFreeRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Risk-Free Rate (%)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.02" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowConfigDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createBacktestMutation.isPending}>
                        {createBacktestMutation.isPending ? "Starting..." : "Start Backtest"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Backtests</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{backtests.length}</div>
              <p className="text-xs text-muted-foreground">
                {backtests.filter(b => b.status === 'running').length} running
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Sharpe Ratio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {backtests.filter(b => b.status === 'completed').length > 0 
                  ? Math.max(...backtests.filter(b => b.status === 'completed').map(b => b.sharpeRatio)).toFixed(2)
                  : "N/A"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Risk-adjusted returns
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Annual Return</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {backtests.filter(b => b.status === 'completed').length > 0 
                  ? formatPercentage(
                      backtests.filter(b => b.status === 'completed')
                        .reduce((sum, b) => sum + b.annualizedReturn, 0) / 
                      backtests.filter(b => b.status === 'completed').length
                    )
                  : "N/A"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Across all models
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Models</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(backtests.map(b => b.modelId)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Being tested
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Backtest Configuration</CardTitle>
                  <CardDescription>Set up your backtest parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Available Models</label>
                        <div className="mt-2 space-y-2">
                          {models.slice(0, 3).map((model: any) => (
                            <div key={model.id} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{model.name}</span>
                              <Badge variant="outline">{model.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Quick Presets</label>
                        <div className="mt-2 space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Calendar className="h-4 w-4 mr-2" />
                            Last 1 Year
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Calendar className="h-4 w-4 mr-2" />
                            Last 2 Years
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Calendar className="h-4 w-4 mr-2" />
                            Custom Range
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => setShowConfigDialog(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure New Backtest
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Data Status</CardTitle>
                  <CardDescription>Historical data availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stock Data (US)</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Crypto Data</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Forex Data</span>
                      <Badge variant="secondary">Limited</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Options Data</span>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4" />
                        <span className="text-sm font-medium">Data Range</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Historical data available from January 2020 to present
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              {backtests.length > 0 ? (
                backtests.map((backtest) => (
                  <Card key={backtest.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedBacktest(backtest)}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`rounded-full p-2 ${getStatusColor(backtest.status)}`}>
                            {getStatusIcon(backtest.status)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{backtest.modelName}</CardTitle>
                            <CardDescription>
                              {new Date(backtest.startDate).toLocaleDateString()} - {new Date(backtest.endDate).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Total Return</div>
                          <div className={`text-lg font-bold ${backtest.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(backtest.totalReturn)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    {backtest.status === 'completed' && (
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                            <div className="text-lg font-semibold">{backtest.sharpeRatio.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Max Drawdown</div>
                            <div className="text-lg font-semibold text-red-600">
                              {formatPercentage(backtest.maxDrawdown)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Win Rate</div>
                            <div className="text-lg font-semibold">{formatPercentage(backtest.winRate)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Final Value</div>
                            <div className="text-lg font-semibold">{formatCurrency(backtest.finalValue)}</div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-40">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-semibold mb-2">No backtests yet</p>
                    <p className="text-muted-foreground text-center mb-4">
                      Configure and run your first backtest to see performance results.
                    </p>
                    <Button onClick={() => setShowConfigDialog(true)}>
                      <Brain className="h-4 w-4 mr-2" />
                      Start First Backtest
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {selectedBacktest && selectedBacktest.status === 'completed' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {createPerformanceChart(selectedBacktest)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Drawdown Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {createDrawdownChart(selectedBacktest)}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Total Return</div>
                          <div className="text-xl font-bold">{formatPercentage(selectedBacktest.totalReturn)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Annualized Return</div>
                          <div className="text-xl font-bold">{formatPercentage(selectedBacktest.annualizedReturn)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                          <div className="text-xl font-bold">{selectedBacktest.sharpeRatio.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Volatility</div>
                          <div className="text-xl font-bold">{formatPercentage(selectedBacktest.volatility)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Max Drawdown</div>
                          <div className="text-xl font-bold text-red-600">{formatPercentage(selectedBacktest.maxDrawdown)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                          <div className="text-xl font-bold">{formatPercentage(selectedBacktest.winRate)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Trading Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Trades</span>
                          <span className="font-semibold">{selectedBacktest.metrics?.totalTrades || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Winning Trades</span>
                          <span className="font-semibold text-green-600">{selectedBacktest.metrics?.winningTrades || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Losing Trades</span>
                          <span className="font-semibold text-red-600">{selectedBacktest.metrics?.losingTrades || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Profit Factor</span>
                          <span className="font-semibold">{selectedBacktest.profitFactor.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Average Win</span>
                          <span className="font-semibold">{formatCurrency(selectedBacktest.metrics?.avgWinSize || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Average Loss</span>
                          <span className="font-semibold">{formatCurrency(selectedBacktest.metrics?.avgLossSize || 0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold mb-2">Select a completed backtest</p>
                  <p className="text-muted-foreground text-center">
                    Choose a backtest from the Results tab to view detailed analysis.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Comparison</CardTitle>
                <CardDescription>Compare performance across different AI models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4" />
                  <p>Model comparison features coming soon!</p>
                  <p className="text-sm">Side-by-side performance analysis and ranking will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}