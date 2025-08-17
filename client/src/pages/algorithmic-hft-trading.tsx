import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Target, 
  BarChart3, 
  Clock, 
  DollarSign,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Download,
  Brain,
  Layers,
  ChevronUp,
  ChevronDown
} from "lucide-react";

export default function AlgorithmicHFTTrading() {
  const [isLive, setIsLive] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("market-making");
  const [realTimeData, setRealTimeData] = useState({
    price: 150.45,
    volume: 2847362,
    spread: 0.02,
    lastUpdate: new Date()
  });

  // Simulate real-time data updates
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setRealTimeData(prev => ({
          price: prev.price + (Math.random() - 0.5) * 0.5,
          volume: prev.volume + Math.floor(Math.random() * 1000),
          spread: 0.01 + Math.random() * 0.03,
          lastUpdate: new Date()
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const strategies = [
    { id: "market-making", name: "Market Making", confidence: 87 },
    { id: "momentum", name: "Momentum", confidence: 73 },
    { id: "mean-reversion", name: "Mean Reversion", confidence: 91 },
    { id: "pairs-trading", name: "Pairs Trading", confidence: 65 }
  ];

  const performanceMetrics = [
    { name: "Sharpe Ratio", value: "2.47", trend: "up" },
    { name: "Max Drawdown", value: "3.2%", trend: "down" },
    { name: "Win Rate", value: "68.4%", trend: "up" },
    { name: "Avg Latency", value: "0.8ms", trend: "down" }
  ];

  const recentTrades = [
    { time: "09:34:21", action: "BUY", instrument: "AAPL", size: 500, price: 150.42, pnl: "+$127", qValue: 0.89 },
    { time: "09:34:18", action: "SELL", instrument: "MSFT", size: 300, price: 342.15, pnl: "+$89", qValue: 0.76 },
    { time: "09:34:15", action: "BUY", instrument: "GOOGL", size: 200, price: 2847.33, pnl: "-$43", qValue: 0.62 },
    { time: "09:34:12", action: "SELL", instrument: "TSLA", size: 400, price: 198.76, pnl: "+$234", qValue: 0.91 }
  ];

  const dqnFeatures = [
    { feature: "Order Flow Imbalance", importance: 92 },
    { feature: "Price Volatility", importance: 87 },
    { feature: "Volume Profile", importance: 79 },
    { feature: "Bid-Ask Spread", importance: 73 },
    { feature: "Market Microstructure", importance: 68 }
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              Algorithmic & High-Frequency Trading
            </h1>
            <p className="text-muted-foreground mt-1">
              Deep Q-Networks for intelligent decision-making in milliseconds
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isLive ? "default" : "secondary"} className="px-3 py-1">
              {isLive ? (
                <><Activity className="h-3 w-3 mr-1" /> LIVE</>
              ) : (
                <><Pause className="h-3 w-3 mr-1" /> PAUSED</>
              )}
            </Badge>
            <Button 
              onClick={() => setIsLive(!isLive)}
              variant={isLive ? "destructive" : "default"}
            >
              {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isLive ? "Stop Trading" : "Start Trading"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Input Panel */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Trading Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Strategy Type</label>
                  <select 
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {strategies.map(strategy => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Position Size</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" placeholder="Min" className="w-full p-2 border rounded-md" />
                    <input type="number" placeholder="Max" className="w-full p-2 border rounded-md" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Risk Controls</label>
                  <div className="space-y-2 mt-1">
                    <input type="number" placeholder="Stop Loss %" className="w-full p-2 border rounded-md" />
                    <input type="number" placeholder="Take Profit %" className="w-full p-2 border rounded-md" />
                  </div>
                </div>

                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Update Parameters
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Data Feeds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">NYSE</span>
                    <Badge variant="default">Live</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">NASDAQ</span>
                    <Badge variant="default">Live</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CME</span>
                    <Badge variant="secondary">Delayed</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Binance</span>
                    <Badge variant="default">Live</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard - Center Panel */}
          <div className="col-span-6 space-y-4">
            {/* Market View */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Market View & DQN Decisions
                  </span>
                  <div className="flex items-center gap-2 text-sm">
                    <span>Price: ${realTimeData.price.toFixed(2)}</span>
                    <span className="text-muted-foreground">
                      Spread: ${realTimeData.spread.toFixed(3)}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Live Candlestick Chart</p>
                    <p className="text-sm text-muted-foreground">
                      Real-time market data with DQN decision overlay
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                      <Badge variant="default" className="bg-green-100 text-green-800">BUY Signal</Badge>
                      <Badge variant="secondary">Q-Value: 0.87</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    P&L Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Today's P&L</span>
                      <span className="font-semibold text-green-600">+$2,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Unrealized P&L</span>
                      <span className="font-semibold text-blue-600">+$156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Equity</span>
                      <span className="font-semibold">$127,843</span>
                    </div>
                    <Progress value={68} className="mt-2" />
                    <p className="text-xs text-muted-foreground">Daily target: 68% achieved</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Execution Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Latency</span>
                      <span className="font-semibold">0.8ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fill Rate</span>
                      <span className="font-semibold">97.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Slippage</span>
                      <span className="font-semibold">0.02%</span>
                    </div>
                    <Progress value={97} className="mt-2" />
                    <p className="text-xs text-muted-foreground">System performance: Excellent</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategy Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {metric.trend === "up" ? (
                          <ChevronUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-semibold">{metric.value}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{metric.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Insights Panel */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentTrades.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={trade.action === "BUY" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {trade.action}
                        </Badge>
                        <span className="text-sm font-medium">{trade.instrument}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{trade.pnl}</div>
                        <div className="text-xs text-muted-foreground">Q: {trade.qValue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  DQN Feature Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dqnFeatures.map((feature, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{feature.feature}</span>
                        <span className="font-medium">{feature.importance}%</span>
                      </div>
                      <Progress value={feature.importance} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Risk Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portfolio Risk</span>
                    <Badge variant="default">Low</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Concentration Risk</span>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Risk</span>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Risk Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Action Panel */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Trade Log
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    Model Diagnostics
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last update: {realTimeData.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}