import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, ScatterPlot, Scatter
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Play, Pause, Download, Upload, 
  Settings, BarChart3, Activity, DollarSign, Target,
  AlertTriangle, CheckCircle, Clock, HelpCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface BacktestResult {
  total_return: number;
  sharpe_ratio: number;
  max_drawdown: number;
  win_rate: number;
  profit_factor: number;
  trades: number;
  equity_curve: Array<{ date: string; value: number }>;
  trades_history: Array<{
    date: string;
    symbol: string;
    action: 'buy' | 'sell';
    quantity: number;
    price: number;
    pnl: number;
  }>;
}

interface TradingStrategyConfig {
  strategy_type: string;
  symbols: string[];
  timeframe: string;
  risk_per_trade: number;
  max_positions: number;
  stop_loss: number;
  take_profit: number;
  lookback_period: number;
  indicators: Record<string, any>;
}

interface TradingDashboardProps {
  modelId: string;
  modelName: string;
}

export default function TradingDashboard({ modelId, modelName }: TradingDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isLiveTrading, setIsLiveTrading] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState(['AAPL', 'GOOGL', 'MSFT']);
  const [strategyConfig, setStrategyConfig] = useState<TradingStrategyConfig>({
    strategy_type: 'mean_reversion',
    symbols: selectedSymbols,
    timeframe: '1d',
    risk_per_trade: 0.02,
    max_positions: 5,
    stop_loss: 0.05,
    take_profit: 0.10,
    lookback_period: 20,
    indicators: {
      rsi_period: 14,
      ma_short: 10,
      ma_long: 30,
      bb_period: 20,
      bb_std: 2
    }
  });
  const [backtestPeriod, setBacktestPeriod] = useState('1y');

  // Fetch real-time market data
  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ['/api/trading/market-data', selectedSymbols],
    refetchInterval: isLiveTrading ? 5000 : false,
  });

  // Fetch strategy performance
  const { data: performance, isLoading: performanceLoading } = useQuery({
    queryKey: ['/api/trading/performance', modelId],
    refetchInterval: isLiveTrading ? 10000 : false,
  });

  // Fetch active positions
  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: ['/api/trading/positions', modelId],
    refetchInterval: isLiveTrading ? 5000 : false,
  });

  // Backtest mutation
  const backtestMutation = useMutation({
    mutationFn: async (config: TradingStrategyConfig & { period: string }) => {
      return await apiRequest('POST', '/api/trading/backtest', {
        model_id: modelId,
        config,
        period: backtestPeriod
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Backtest Complete",
        description: `Strategy tested with ${data.trades} trades`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/trading'] });
    },
    onError: (error) => {
      toast({
        title: "Backtest Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Live trading mutation
  const toggleLiveTradingMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return await apiRequest('POST', '/api/trading/live-toggle', {
        model_id: modelId,
        enabled,
        config: strategyConfig
      });
    },
    onSuccess: (data) => {
      setIsLiveTrading(data.enabled);
      toast({
        title: data.enabled ? "Live Trading Started" : "Live Trading Stopped",
        description: data.enabled ? "Strategy is now running live" : "All positions closed",
      });
    },
  });

  // Sample data generation for demonstration
  const sampleMarketData: MarketData[] = [
    { symbol: 'AAPL', price: 175.43, change: 2.15, changePercent: 1.24, volume: 52348900, timestamp: new Date().toISOString() },
    { symbol: 'GOOGL', price: 2847.63, change: -15.22, changePercent: -0.53, volume: 1234567, timestamp: new Date().toISOString() },
    { symbol: 'MSFT', price: 348.10, change: 4.55, changePercent: 1.33, volume: 28475900, timestamp: new Date().toISOString() },
    { symbol: 'TSLA', price: 238.45, change: -8.12, changePercent: -3.29, volume: 45678900, timestamp: new Date().toISOString() },
  ];

  const sampleEquityCurve = Array.from({ length: 252 }, (_, i) => ({
    date: new Date(Date.now() - (251 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 100000 * (1 + Math.sin(i * 0.02) * 0.1 + (Math.random() - 0.5) * 0.02),
    benchmark: 100000 * (1 + i * 0.0003 + (Math.random() - 0.5) * 0.01)
  }));

  const sampleBacktestResult: BacktestResult = {
    total_return: 0.234,
    sharpe_ratio: 1.67,
    max_drawdown: -0.089,
    win_rate: 0.613,
    profit_factor: 1.89,
    trades: 127,
    equity_curve: sampleEquityCurve,
    trades_history: Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      symbol: ['AAPL', 'GOOGL', 'MSFT'][Math.floor(Math.random() * 3)],
      action: Math.random() > 0.5 ? 'buy' : 'sell',
      quantity: Math.floor(Math.random() * 100) + 1,
      price: 100 + Math.random() * 200,
      pnl: (Math.random() - 0.5) * 1000
    }))
  };

  const handleRunBacktest = () => {
    backtestMutation.mutate({ ...strategyConfig, period: backtestPeriod });
  };

  const handleToggleLiveTrading = () => {
    toggleLiveTradingMutation.mutate(!isLiveTrading);
  };

  const exportResults = () => {
    const reportData = {
      model: modelName,
      config: strategyConfig,
      performance: sampleBacktestResult,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-strategy-report-${modelId}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{modelName} - Trading Strategy</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time trading strategy analysis and execution</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={isLiveTrading ? "destructive" : "default"}
            onClick={handleToggleLiveTrading}
            disabled={toggleLiveTradingMutation.isPending}
          >
            {isLiveTrading ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Live Trading
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Live Trading
              </>
            )}
          </Button>
          <Button variant="outline" onClick={exportResults}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Live Trading Status */}
      {isLiveTrading && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
          <Activity className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Live trading is active. Strategy is monitoring markets and executing trades automatically.
          </AlertDescription>
        </Alert>
      )}

      {/* Real-time Market Data */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Market Data</CardTitle>
          <CardDescription>Live price feeds for selected symbols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleMarketData.map((data) => (
              <Card key={data.symbol} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{data.symbol}</h3>
                    <p className="text-2xl font-bold">${data.price.toFixed(2)}</p>
                  </div>
                  <Badge variant={data.change >= 0 ? 'default' : 'destructive'}>
                    {data.change >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Volume: {data.volume.toLocaleString()}</p>
                  <p className={data.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="strategy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="backtest">Backtest</TabsTrigger>
          <TabsTrigger value="live">Live Trading</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        {/* Strategy Configuration */}
        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Configuration</CardTitle>
              <CardDescription>Configure your trading strategy parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="strategy-type">Strategy Type</Label>
                  <Select 
                    value={strategyConfig.strategy_type} 
                    onValueChange={(value) => setStrategyConfig({...strategyConfig, strategy_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                      <SelectItem value="momentum">Momentum</SelectItem>
                      <SelectItem value="breakout">Breakout</SelectItem>
                      <SelectItem value="arbitrage">Statistical Arbitrage</SelectItem>
                      <SelectItem value="pairs_trading">Pairs Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select 
                    value={strategyConfig.timeframe} 
                    onValueChange={(value) => setStrategyConfig({...strategyConfig, timeframe: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="risk-per-trade">Risk per Trade (%)</Label>
                  <Input
                    type="number"
                    value={strategyConfig.risk_per_trade * 100}
                    onChange={(e) => setStrategyConfig({...strategyConfig, risk_per_trade: Number(e.target.value) / 100})}
                    min="0.1"
                    max="10"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="max-positions">Max Positions</Label>
                  <Input
                    type="number"
                    value={strategyConfig.max_positions}
                    onChange={(e) => setStrategyConfig({...strategyConfig, max_positions: Number(e.target.value)})}
                    min="1"
                    max="20"
                  />
                </div>

                <div>
                  <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                  <Input
                    type="number"
                    value={strategyConfig.stop_loss * 100}
                    onChange={(e) => setStrategyConfig({...strategyConfig, stop_loss: Number(e.target.value) / 100})}
                    min="1"
                    max="20"
                    step="0.5"
                  />
                </div>

                <div>
                  <Label htmlFor="take-profit">Take Profit (%)</Label>
                  <Input
                    type="number"
                    value={strategyConfig.take_profit * 100}
                    onChange={(e) => setStrategyConfig({...strategyConfig, take_profit: Number(e.target.value) / 100})}
                    min="1"
                    max="50"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rsi-period">RSI Period</Label>
                  <Input
                    type="number"
                    value={strategyConfig.indicators.rsi_period}
                    onChange={(e) => setStrategyConfig({
                      ...strategyConfig, 
                      indicators: {...strategyConfig.indicators, rsi_period: Number(e.target.value)}
                    })}
                    min="5"
                    max="50"
                  />
                </div>

                <div>
                  <Label htmlFor="lookback-period">Lookback Period</Label>
                  <Input
                    type="number"
                    value={strategyConfig.lookback_period}
                    onChange={(e) => setStrategyConfig({...strategyConfig, lookback_period: Number(e.target.value)})}
                    min="5"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backtesting */}
        <TabsContent value="backtest" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backtest Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backtest-period">Test Period</Label>
                  <Select value={backtestPeriod} onValueChange={setBacktestPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Month</SelectItem>
                      <SelectItem value="3m">3 Months</SelectItem>
                      <SelectItem value="6m">6 Months</SelectItem>
                      <SelectItem value="1y">1 Year</SelectItem>
                      <SelectItem value="2y">2 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleRunBacktest}
                  disabled={backtestMutation.isPending}
                  className="w-full"
                >
                  {backtestMutation.isPending ? 'Running...' : 'Run Backtest'}
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(sampleBacktestResult.total_return * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Total Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {sampleBacktestResult.sharpe_ratio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Sharpe Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {(sampleBacktestResult.max_drawdown * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Max Drawdown</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {(sampleBacktestResult.win_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {sampleBacktestResult.profit_factor.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Profit Factor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {sampleBacktestResult.trades}
                    </div>
                    <div className="text-sm text-gray-600">Total Trades</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equity Curve */}
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
              <CardDescription>Strategy performance vs benchmark</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sampleEquityCurve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Strategy" strokeWidth={2} />
                  <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" name="Benchmark" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Trading */}
        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
                <CardDescription>Current open trades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { symbol: 'AAPL', side: 'long', quantity: 100, entry: 172.50, current: 175.43, pnl: 293 },
                    { symbol: 'GOOGL', side: 'short', quantity: 10, entry: 2855.20, current: 2847.63, pnl: 75.7 },
                    { symbol: 'MSFT', side: 'long', quantity: 50, entry: 345.80, current: 348.10, pnl: 115 }
                  ].map((position, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{position.symbol}</div>
                        <div className="text-sm text-gray-600">
                          {position.side.toUpperCase()} {position.quantity} @ ${position.entry}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${position.current}</div>
                        <div className={`text-sm ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Platform Integration</CardTitle>
                <CardDescription>Connect to trading platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Alpaca
                  </Button>
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Interactive Brokers
                  </Button>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    TD Ameritrade
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Target className="w-4 h-4 mr-2" />
                    Paper Trading
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Trading Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Label className="text-sm">Paper Trading Mode</Label>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Live trading requires API keys. Set up your broker API credentials in settings.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { outcome: 'Winning Trades', count: 78, percentage: 61.3 },
                    { outcome: 'Losing Trades', count: 49, percentage: 38.7 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="outcome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={Array.from({ length: 12 }, (_, i) => ({
                    month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
                    return: (Math.random() - 0.3) * 0.15
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Return']} />
                    <Area type="monotone" dataKey="return" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Help Section */}
        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Strategy Help</CardTitle>
              <CardDescription>Documentation and guidance for using the trading system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Getting Started</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Configure your strategy parameters</li>
                    <li>• Run backtests to validate performance</li>
                    <li>• Set up paper trading first</li>
                    <li>• Connect your broker API</li>
                    <li>• Start with small position sizes</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Risk Management</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Never risk more than 2% per trade</li>
                    <li>• Use stop losses consistently</li>
                    <li>• Monitor drawdown levels</li>
                    <li>• Diversify across multiple symbols</li>
                    <li>• Review performance regularly</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">API Integration</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Alpaca: Free paper trading</li>
                    <li>• Interactive Brokers: Professional</li>
                    <li>• TD Ameritrade: Retail friendly</li>
                    <li>• Yahoo Finance: Market data</li>
                    <li>• Alpha Vantage: Technical indicators</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Performance Metrics</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Sharpe Ratio: Risk-adjusted returns</li>
                    <li>• Max Drawdown: Worst losing streak</li>
                    <li>• Win Rate: Percentage of winning trades</li>
                    <li>• Profit Factor: Wins vs losses ratio</li>
                    <li>• Calmar Ratio: Return vs drawdown</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}