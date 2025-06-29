import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Target,
  BarChart3,
  Settings,
  Play,
  Pause,
  Copy,
  Eye,
  Grid3X3,
  ArrowUpDown,
  Zap,
  RefreshCw,
  Brain,
  Calendar
} from "lucide-react";

interface TradingBot {
  id: number;
  name: string;
  type: string;
  symbol: string;
  status: 'active' | 'paused' | 'stopped';
  pnl: number;
  pnlPercentage: number;
  roi: number;
  runtime: string;
  minInvestment: number;
  totalTrades: number;
  successfulTrades: number;
  profitPerGrid?: number;
  grids?: number;
  priceRange?: string;
  mode?: string;
  description: string;
  icon: any;
  chartData?: number[];
}

const tradingBotTypes = [
  {
    id: 'spot_grid',
    name: 'Spot Grid',
    icon: Grid3X3,
    description: 'Buy low and sell high. 24/7 availability',
    features: ['Automation', 'Profit from Volatility', 'Consistent Strategy']
  },
  {
    id: 'futures_grid',
    name: 'Futures Grid',
    icon: BarChart3,
    description: 'Automate your longs and shorts',
    features: ['Leverage Trading', 'Risk Management', 'Advanced Strategies']
  },
  {
    id: 'arbitrage_bot',
    name: 'Arbitrage Bot',
    icon: ArrowUpDown,
    description: 'Delta neutral strategy to earn Funding Fee effortlessly',
    features: ['Market Neutral', 'Consistent Returns', 'Low Risk']
  },
  {
    id: 'rebalancing_bot',
    name: 'Rebalancing Bot',
    icon: RefreshCw,
    description: 'Smart strategy for a multi-coins portfolio',
    features: ['Portfolio Management', 'Auto Rebalancing', 'Diversification']
  },
  {
    id: 'spot_algo_order',
    name: 'Spot Algo Order',
    icon: Brain,
    description: 'Enhance execution of large orders in smaller blocks',
    features: ['Smart Execution', 'Reduced Slippage', 'Order Optimization']
  },
  {
    id: 'spot_dca',
    name: 'Spot DCA',
    icon: TrendingUp,
    description: 'Lower average entry cost, profit from reversals',
    features: ['Dollar Cost Averaging', 'Risk Mitigation', 'Long-term Strategy']
  },
  {
    id: 'futures_twap',
    name: 'Futures TWAP',
    icon: Clock,
    description: 'Reduce execution costs by splitting orders',
    features: ['Time-weighted Average', 'Cost Reduction', 'Market Impact Minimization']
  },
  {
    id: 'futures_vp',
    name: 'Futures VP',
    icon: Zap,
    description: 'Split large order among specific urgency level',
    features: ['Volume Participation', 'Flexible Execution', 'Liquidity Management']
  }
];

const mockTradingBots: TradingBot[] = [
  {
    id: 1,
    name: 'SOL/FDUSD Grid',
    type: 'Spot Grid',
    symbol: 'SOL/FDUSD',
    status: 'active',
    pnl: 37631.14,
    pnlPercentage: 2.69,
    roi: 2.69,
    runtime: '2d 20h 48m',
    minInvestment: 680.79,
    totalTrades: 130,
    successfulTrades: 25,
    profitPerGrid: 0.10,
    grids: 111,
    priceRange: '125 - 175',
    mode: 'Geometric',
    description: 'High-performance grid trading on SOL/FDUSD pair',
    icon: Grid3X3,
    chartData: [20000, 15000, 25000, 30000, 28000, 35000, 37631]
  },
  {
    id: 2,
    name: 'ONDO/USDT Arbitrage',
    type: 'Arbitrage Bot',
    symbol: 'ONDO/USDT',
    status: 'active',
    pnl: 8027.25,
    pnlPercentage: 4.89,
    roi: 4.89,
    runtime: '6d 18h 3m',
    minInvestment: 298.23,
    totalTrades: 89,
    successfulTrades: 84,
    description: 'Delta neutral arbitrage strategy',
    icon: ArrowUpDown,
    chartData: [5000, 6000, 7000, 7500, 8000, 8027]
  },
  {
    id: 3,
    name: 'BTC/USDT Futures Grid',
    type: 'Futures Grid',
    symbol: 'BTC/USDT',
    status: 'paused',
    pnl: -1250.50,
    pnlPercentage: -0.85,
    roi: -0.85,
    runtime: '12h 30m',
    minInvestment: 5000.00,
    totalTrades: 45,
    successfulTrades: 32,
    description: 'Leveraged grid trading on Bitcoin futures',
    icon: BarChart3,
    chartData: [0, -500, -800, -1000, -1250]
  }
];

export default function TradingBots() {
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null);
  const [activeTab, setActiveTab] = useState('running');
  const [createBotOpen, setCreateBotOpen] = useState(false);
  const [selectedBotType, setSelectedBotType] = useState('');

  const { data: bots = mockTradingBots } = useQuery({
    queryKey: ['/api/trading-bots'],
    retry: false,
  });

  const runningBots = bots.filter(bot => bot.status === 'active');
  const pausedBots = bots.filter(bot => bot.status === 'paused');
  const stoppedBots = bots.filter(bot => bot.status === 'stopped');

  const handleBotAction = (botId: number, action: 'start' | 'pause' | 'stop' | 'copy') => {
    console.log(`${action} bot ${botId}`);
    // Implement bot actions
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trading Bots</h1>
          <p className="text-muted-foreground">Automate your trading strategies with AI-powered bots</p>
        </div>
        <Dialog open={createBotOpen} onOpenChange={setCreateBotOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Bot className="h-4 w-4 mr-2" />
              Create Bot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Trading Bot</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {tradingBotTypes.map((botType) => {
                const IconComponent = botType.icon;
                return (
                  <Card 
                    key={botType.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedBotType === botType.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedBotType(botType.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{botType.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{botType.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {botType.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {selectedBotType && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-4">Configure Bot Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trading-pair">Trading Pair</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trading pair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                        <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                        <SelectItem value="SOL/FDUSD">SOL/FDUSD</SelectItem>
                        <SelectItem value="ONDO/USDT">ONDO/USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="investment">Investment Amount</Label>
                    <Input id="investment" placeholder="1000" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="grid-count">Number of Grids</Label>
                    <Input id="grid-count" placeholder="20" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="price-range">Price Range</Label>
                    <Input id="price-range" placeholder="100 - 200" />
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" onClick={() => setCreateBotOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-primary">
                    Create Bot
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Featured Bot Banner */}
      <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-400/20 rounded-lg">
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">10 USDT UM Futures Grid Loss Protection</h3>
                <p className="text-muted-foreground">Ends in 04 D 01 : 19 : 35</p>
              </div>
            </div>
            <div className="text-right">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                Claim Now
              </Button>
              <p className="text-sm text-muted-foreground mt-1">1/2</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{runningBots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total PnL</p>
                <p className="text-2xl font-bold text-green-500">
                  {formatCurrency(bots.reduce((sum, bot) => sum + bot.pnl, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg ROI</p>
                <p className="text-2xl font-bold">
                  {formatPercentage(bots.reduce((sum, bot) => sum + bot.roi, 0) / bots.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">
                  {bots.reduce((sum, bot) => sum + bot.totalTrades, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bot Filters */}
      <div className="flex space-x-4 items-center">
        <div className="flex space-x-2">
          <Badge variant="outline">All</Badge>
          <Badge variant="outline">Algos</Badge>
          <Badge variant="outline">Sideways</Badge>
          <Badge variant="outline">Bullish</Badge>
          <Badge variant="outline">Bearish</Badge>
        </div>
        <div className="flex space-x-2 ml-auto">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Spot Grid" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="spot_grid">Spot Grid</SelectItem>
              <SelectItem value="futures_grid">Futures Grid</SelectItem>
              <SelectItem value="arbitrage">Arbitrage</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Top PNL" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pnl">Top PNL</SelectItem>
              <SelectItem value="roi">Top ROI</SelectItem>
              <SelectItem value="runtime">Runtime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bot Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="running">Running ({runningBots.length})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({pausedBots.length})</TabsTrigger>
          <TabsTrigger value="stopped">Stopped ({stoppedBots.length})</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="running" className="space-y-4">
          {runningBots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <bot.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{bot.symbol}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{bot.type}</span>
                        <span>•</span>
                        <span>A{bot.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">
                      {formatCurrency(bot.pnl)}
                    </p>
                    <p className="text-green-500 font-medium">
                      {formatPercentage(bot.pnlPercentage)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="font-semibold">{formatPercentage(bot.roi)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Runtime</p>
                    <p className="font-semibold">{bot.runtime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Min. Investment</p>
                    <p className="font-semibold">{formatCurrency(bot.minInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24H/Total Trades</p>
                    <p className="font-semibold">{bot.successfulTrades}/{bot.totalTrades}</p>
                  </div>
                </div>

                {bot.type === 'Spot Grid' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Price Range ({bot.symbol.split('/')[1]})</p>
                      <p className="font-semibold">{bot.priceRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Number of Grids</p>
                      <p className="font-semibold">{bot.grids}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mode</p>
                      <p className="font-semibold">{bot.mode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profit/Grid (fees deducted)</p>
                      <p className="font-semibold">{bot.profitPerGrid}%</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBot(bot)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBotAction(bot.id, 'copy')}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBotAction(bot.id, 'pause')}
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="paused" className="space-y-4">
          {pausedBots.map((bot) => (
            <Card key={bot.id} className="opacity-75">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-500/10 rounded-lg">
                      <bot.icon className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{bot.symbol}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Paused</Badge>
                        <span className="text-sm text-muted-foreground">{bot.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-500">
                      {formatCurrency(bot.pnl)}
                    </p>
                    <p className="text-red-500 font-medium">
                      {formatPercentage(bot.pnlPercentage)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleBotAction(bot.id, 'start')}
                    className="gradient-primary"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="stopped" className="space-y-4">
          <div className="text-center py-12">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Stopped Bots</h3>
            <p className="text-muted-foreground">All your bots are currently active or paused.</p>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tradingBotTypes.map((botType) => {
              const IconComponent = botType.icon;
              return (
                <Card key={botType.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{botType.name}</h3>
                        <p className="text-sm text-muted-foreground">{botType.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {botType.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">
                      Create {botType.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bot Details Modal */}
      {selectedBot && (
        <Dialog open={!!selectedBot} onOpenChange={() => setSelectedBot(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Bot Details - {selectedBot.symbol}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <selectedBot.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedBot.symbol}</h2>
                    <p className="text-muted-foreground">{selectedBot.type} • A{selectedBot.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-500">
                    {formatCurrency(selectedBot.pnl)}
                  </p>
                  <p className="text-green-500 font-medium text-lg">
                    {formatPercentage(selectedBot.pnlPercentage)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Runtime</p>
                  <p className="text-lg font-semibold">{selectedBot.runtime}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">24H/Total Matched Trades</p>
                  <p className="text-lg font-semibold">{selectedBot.successfulTrades}/{selectedBot.totalTrades}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Price Range ({selectedBot.symbol.split('/')[1]})</p>
                  <p className="text-lg font-semibold">{selectedBot.priceRange}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Number of Grids</p>
                  <p className="text-lg font-semibold">{selectedBot.grids}</p>
                </div>
              </div>

              {selectedBot.type === 'Spot Grid' && (
                <Card>
                  <CardHeader>
                    <CardTitle>What's Spot Grid</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Bot className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold">Automation</h4>
                        <p className="text-sm text-muted-foreground">Saves time by automating buy and sell orders.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Profit from Volatility</h4>
                        <p className="text-sm text-muted-foreground">Capitalizes on small price fluctuations.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Consistent Strategy</h4>
                        <p className="text-sm text-muted-foreground">Maintains a steady trading approach.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleBotAction(selectedBot.id, 'copy')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Bot
                </Button>
                <Button
                  className="gradient-primary"
                  onClick={() => setSelectedBot(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}