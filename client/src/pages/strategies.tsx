import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Play, 
  Pause, 
  Settings, 
  BarChart3,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  Shield
} from "lucide-react";

export default function Strategies() {
  const activeStrategies = [
    {
      id: 1,
      name: "Momentum Breakout",
      type: "Technical Analysis",
      status: "active",
      performance: 15.3,
      winRate: 68.2,
      maxDrawdown: 8.5,
      totalTrades: 234,
      averageTrade: 1.8,
      riskLevel: "Medium",
      timeframe: "4H",
      assets: ["AAPL", "MSFT", "GOOGL"],
      allocation: 35,
      createdDate: "2024-12-15"
    },
    {
      id: 2,
      name: "Mean Reversion Pro",
      type: "Statistical Arbitrage",
      status: "active",
      performance: 8.7,
      winRate: 72.5,
      maxDrawdown: 4.2,
      totalTrades: 189,
      averageTrade: 0.9,
      riskLevel: "Low",
      timeframe: "1D",
      assets: ["SPY", "QQQ", "IWM"],
      allocation: 25,
      createdDate: "2024-11-28"
    },
    {
      id: 3,
      name: "Volatility Harvester",
      type: "Options Strategy",
      status: "paused",
      performance: -2.1,
      winRate: 58.3,
      maxDrawdown: 12.8,
      totalTrades: 67,
      averageTrade: -0.3,
      riskLevel: "High",
      timeframe: "1W",
      assets: ["VIX", "SPX", "NDX"],
      allocation: 15,
      createdDate: "2024-10-10"
    }
  ];

  const strategyTemplates = [
    {
      id: 1,
      name: "Moving Average Crossover",
      description: "Classic trend-following strategy using EMA crossovers",
      complexity: "Beginner",
      expectedReturn: "8-12%",
      riskLevel: "Low",
      minCapital: 10000,
      timeframe: "Daily",
      tags: ["Trend Following", "Technical Analysis"]
    },
    {
      id: 2,
      name: "RSI Divergence",
      description: "Identify reversal opportunities using RSI divergence patterns",
      complexity: "Intermediate",
      expectedReturn: "12-18%",
      riskLevel: "Medium",
      minCapital: 25000,
      timeframe: "4H",
      tags: ["Reversal", "Oscillators"]
    },
    {
      id: 3,
      name: "Pairs Trading",
      description: "Market-neutral strategy trading correlated asset pairs",
      complexity: "Advanced",
      expectedReturn: "6-10%",
      riskLevel: "Low",
      minCapital: 50000,
      timeframe: "1H",
      tags: ["Market Neutral", "Statistical Arbitrage"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch ((risk ?? '').toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch ((complexity ?? '').toLowerCase()) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'advanced':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Trading Strategies
                </h1>
                <p className="text-muted-foreground">
                  Create, manage, and optimize your automated trading strategies
                </p>
              </div>
              <Button className="gap-2">
                <Target className="h-5 w-5" />
                Create Strategy
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Strategies</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Performance</p>
                    <p className="text-2xl font-bold text-green-600">+21.9%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold">66.3%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                    <p className="text-2xl font-bold">490</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Strategies</TabsTrigger>
              <TabsTrigger value="templates">Strategy Templates</TabsTrigger>
              <TabsTrigger value="backtesting">Backtest Results</TabsTrigger>
            </TabsList>

            {/* Active Strategies */}
            <TabsContent value="active" className="space-y-6">
              <div className="grid gap-6">
                {activeStrategies.map((strategy) => (
                  <Card key={strategy.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Strategy Info */}
                        <div className="lg:col-span-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Target className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{strategy.name}</h3>
                              <p className="text-sm text-muted-foreground">{strategy.type}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(strategy.status)}>
                              {strategy.status}
                            </Badge>
                            <Badge className={getRiskColor(strategy.riskLevel)}>
                              {strategy.riskLevel} Risk
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Portfolio Allocation</span>
                              <span>{strategy.allocation}%</span>
                            </div>
                            <Progress value={strategy.allocation} className="h-2" />
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {strategy.assets.map((asset, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {asset}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Performance</p>
                            <p className={`text-lg font-bold ${strategy.performance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {strategy.performance > 0 ? '+' : ''}{strategy.performance}%
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Win Rate</p>
                            <p className="text-lg font-bold">{strategy.winRate}%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Max Drawdown</p>
                            <p className="text-lg font-bold text-red-600">-{strategy.maxDrawdown}%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Avg Trade</p>
                            <p className={`text-lg font-bold ${strategy.averageTrade > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {strategy.averageTrade > 0 ? '+' : ''}{strategy.averageTrade}%
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Timeframe</span>
                            <span className="font-semibold">{strategy.timeframe}</span>
                          </div>
                          
                          <div className="space-y-2">
                            {strategy.status === 'active' ? (
                              <Button variant="outline" className="w-full gap-2">
                                <Pause className="h-4 w-4" />
                                Pause
                              </Button>
                            ) : (
                              <Button className="w-full gap-2">
                                <Play className="h-4 w-4" />
                                Resume
                              </Button>
                            )}
                            <Button variant="outline" className="w-full gap-2">
                              <Settings className="h-4 w-4" />
                              Configure
                            </Button>
                            <Button variant="outline" className="w-full gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Strategy Templates */}
            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategyTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Brain className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <Badge className={getComplexityColor(template.complexity)}>
                              {template.complexity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{template.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Expected Return</p>
                          <p className="font-semibold text-green-600">{template.expectedReturn}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <Badge className={getRiskColor(template.riskLevel)}>
                            {template.riskLevel}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Min Capital</p>
                          <p className="font-semibold">${template.minCapital.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeframe</p>
                          <p className="font-semibold">{template.timeframe}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2">
                          <Zap className="h-4 w-4" />
                          Use Template
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Backtest Results */}
            <TabsContent value="backtesting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Backtest Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No backtest results yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Run backtests on your strategies to see historical performance data
                    </p>
                    <Button className="gap-2">
                      <Play className="h-4 w-4" />
                      Start Backtest
                    </Button>
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