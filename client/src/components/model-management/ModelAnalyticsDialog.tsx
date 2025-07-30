import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Target,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react";

interface ModelAnalyticsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  model: {
    id: number;
    name: string;
    category: string;
    status: string;
  };
}

export default function ModelAnalyticsDialog({ isOpen, onClose, model }: ModelAnalyticsDialogProps) {
  const [timeframe, setTimeframe] = useState("30d");
  
  const { data: analytics, isLoading } = useQuery({
    queryKey: [`/api/ai-models/${model.id}/analytics`, timeframe],
    enabled: isOpen
  });

  // Mock analytics data matching the user's models
  const mockAnalytics = {
    performance: {
      totalReturn: model.id === 1 ? 12.5 : model.id === 2 ? 8.7 : -2.1,
      accuracy: model.id === 1 ? 94.2 : model.id === 2 ? 89.1 : 87.3,
      totalTrades: model.id === 1 ? 156 : model.id === 2 ? 234 : 89,
      profitLoss: model.id === 1 ? 2847.50 : model.id === 2 ? 1923.75 : -456.25,
      winRate: model.id === 1 ? 68.5 : model.id === 2 ? 72.1 : 61.2,
      sharpeRatio: model.id === 1 ? 1.8 : model.id === 2 ? 1.6 : 0.9,
      maxDrawdown: model.id === 1 ? -8.2 : model.id === 2 ? -12.1 : -15.7,
      volatility: model.id === 1 ? 14.5 : model.id === 2 ? 18.3 : 22.1
    },
    usage: {
      totalHours: model.id === 1 ? 87.5 : model.id === 2 ? 156.3 : 45.2,
      activeDays: model.id === 1 ? 28 : model.id === 2 ? 30 : 15,
      avgSessionTime: model.id === 1 ? 2.8 : model.id === 2 ? 3.2 : 2.1,
      dataProcessed: model.id === 1 ? "2.4TB" : model.id === 2 ? "4.1TB" : "1.2TB"
    },
    trades: [
      { date: "2025-07-25", type: "BUY", symbol: "AAPL", quantity: 100, price: 192.45, pnl: 245.50 },
      { date: "2025-07-24", type: "SELL", symbol: "MSFT", quantity: 50, price: 415.20, pnl: -123.75 },
      { date: "2025-07-23", type: "BUY", symbol: "GOOGL", quantity: 25, price: 2750.30, pnl: 567.80 },
      { date: "2025-07-22", type: "SELL", symbol: "TSLA", quantity: 75, price: 245.67, pnl: 789.25 },
      { date: "2025-07-21", type: "BUY", symbol: "NVDA", quantity: 30, price: 425.80, pnl: 1234.50 }
    ],
    dailyPerformance: [
      { date: "2025-07-21", return: 2.1, trades: 3, pnl: 234.50 },
      { date: "2025-07-22", return: -0.8, trades: 2, pnl: -89.25 },
      { date: "2025-07-23", return: 3.2, trades: 4, pnl: 456.75 },
      { date: "2025-07-24", return: 1.5, trades: 1, pnl: 178.30 },
      { date: "2025-07-25", return: 2.8, trades: 5, pnl: 623.90 },
      { date: "2025-07-26", return: -1.2, trades: 2, pnl: -145.60 },
      { date: "2025-07-27", return: 4.1, trades: 6, pnl: 789.45 }
    ]
  };

  const data = analytics || mockAnalytics;

  const exportReport = () => {
    // In a real app, this would generate and download a PDF report
    console.log("Exporting analytics report for", model.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {model.name} Analytics
            <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
              {model.status}
            </Badge>
          </DialogTitle>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trades">Trade History</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="overview" className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Total Return
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      {data.performance.totalReturn > 0 ? '+' : ''}{data.performance.totalReturn}%
                    </div>
                    <p className="text-sm text-muted-foreground">Last {timeframe}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Accuracy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">
                      {data.performance.accuracy}%
                    </div>
                    <p className="text-sm text-muted-foreground">Prediction accuracy</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-500" />
                      Total Trades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-500">
                      {data.performance.totalTrades}
                    </div>
                    <p className="text-sm text-muted-foreground">Executed trades</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      P&L
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${data.performance.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${data.performance.profitLoss >= 0 ? '+' : ''}{data.performance.profitLoss.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">Profit & Loss</p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Performance chart would be rendered here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Risk Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Sharpe Ratio</span>
                      <span className="font-medium">{data.performance.sharpeRatio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Max Drawdown</span>
                      <span className="font-medium text-red-500">{data.performance.maxDrawdown}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Volatility</span>
                      <span className="font-medium">{data.performance.volatility}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Win Rate</span>
                      <span className="font-medium text-green-500">{data.performance.winRate}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Hours</span>
                      <span className="font-medium">{data.usage.totalHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Days</span>
                      <span className="font-medium">{data.usage.activeDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Session</span>
                      <span className="font-medium">{data.usage.avgSessionTime}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Data Processed</span>
                      <span className="font-medium">{data.usage.dataProcessed}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Returns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.dailyPerformance.slice(-7).map((day, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{day.date}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${day.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {day.return >= 0 ? '+' : ''}{day.return}%
                            </span>
                            <div className="w-16 bg-muted rounded">
                              <div 
                                className={`h-2 rounded ${day.return >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.abs(day.return) * 10}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Winning Days</span>
                          <span>{Math.round(data.performance.winRate)}%</span>
                        </div>
                        <Progress value={data.performance.winRate} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Accuracy</span>
                          <span>{data.performance.accuracy}%</span>
                        </div>
                        <Progress value={data.performance.accuracy} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Risk Adjusted Return</span>
                          <span>{Math.round(data.performance.sharpeRatio * 50)}%</span>
                        </div>
                        <Progress value={data.performance.sharpeRatio * 50} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trades" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                      <span>Date</span>
                      <span>Type</span>
                      <span>Symbol</span>
                      <span>Quantity</span>
                      <span>Price</span>
                      <span>P&L</span>
                    </div>
                    {data.trades.map((trade, index) => (
                      <div key={index} className="grid grid-cols-6 gap-4 text-sm items-center py-2 border-b">
                        <span>{trade.date}</span>
                        <Badge variant={trade.type === 'BUY' ? 'default' : 'secondary'} className="w-fit">
                          {trade.type}
                        </Badge>
                        <span className="font-medium">{trade.symbol}</span>
                        <span>{trade.quantity}</span>
                        <span>${trade.price}</span>
                        <span className={`font-medium ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Runtime</span>
                      <span className="font-medium">{data.usage.totalHours} hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Days</span>
                      <span className="font-medium">{data.usage.activeDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Session</span>
                      <span className="font-medium">{data.usage.avgSessionTime} hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Processed</span>
                      <span className="font-medium">{data.usage.dataProcessed}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Efficiency Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Trades per Hour</span>
                      <span className="font-medium">
                        {(data.performance.totalTrades / data.usage.totalHours).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">P&L per Trade</span>
                      <span className="font-medium">
                        ${(data.performance.profitLoss / data.performance.totalTrades).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Success Rate</span>
                      <span className="font-medium text-green-500">{data.performance.winRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Return/Day</span>
                      <span className="font-medium">
                        {(data.performance.totalReturn / data.usage.activeDays).toFixed(2)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}