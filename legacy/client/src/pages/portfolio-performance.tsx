import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  Download,
  RefreshCw
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts';

// Mock data for portfolio performance
const performanceData = [
  { date: '2024-01', value: 100000, returns: 0 },
  { date: '2024-02', value: 103500, returns: 3.5 },
  { date: '2024-03', value: 97800, returns: -5.5 },
  { date: '2024-04', value: 108200, returns: 10.6 },
  { date: '2024-05', value: 112450, returns: 3.9 },
  { date: '2024-06', value: 118900, returns: 5.7 },
  { date: '2024-07', value: 125300, returns: 5.4 },
  { date: '2024-08', value: 121700, returns: -2.9 },
  { date: '2024-09', value: 128500, returns: 5.6 },
  { date: '2024-10', value: 134200, returns: 4.4 },
  { date: '2024-11', value: 138800, returns: 3.4 },
  { date: '2024-12', value: 142500, returns: 2.7 }
];

const monthlyReturns = [
  { month: 'Jan', returns: 3.5, benchmark: 2.1 },
  { month: 'Feb', returns: -2.1, benchmark: -1.8 },
  { month: 'Mar', returns: 4.8, benchmark: 3.2 },
  { month: 'Apr', returns: 2.3, benchmark: 1.9 },
  { month: 'May', returns: 5.7, benchmark: 4.1 },
  { month: 'Jun', returns: -1.2, benchmark: -0.8 }
];

const assetAllocation = [
  { name: 'Stocks', value: 45, color: '#8884d8' },
  { name: 'Bonds', value: 25, color: '#82ca9d' },
  { name: 'Real Estate', value: 15, color: '#ffc658' },
  { name: 'Commodities', value: 10, color: '#ff7300' },
  { name: 'Cash', value: 5, color: '#00ff88' }
];

const topPerformers = [
  { name: 'NVIDIA Corp', symbol: 'NVDA', returns: 24.8, allocation: 8.5 },
  { name: 'Microsoft Corp', symbol: 'MSFT', returns: 18.3, allocation: 12.2 },
  { name: 'Apple Inc', symbol: 'AAPL', returns: 15.7, allocation: 10.1 },
  { name: 'Amazon.com Inc', symbol: 'AMZN', returns: 12.4, allocation: 7.8 },
  { name: 'Alphabet Inc', symbol: 'GOOGL', returns: 11.9, allocation: 9.3 }
];

const riskMetrics = [
  { metric: 'Sharpe Ratio', value: 1.42, benchmark: 1.18, status: 'good' },
  { metric: 'Max Drawdown', value: -8.5, benchmark: -12.3, status: 'good' },
  { metric: 'Beta', value: 0.89, benchmark: 1.00, status: 'neutral' },
  { metric: 'Alpha', value: 2.1, benchmark: 0.0, status: 'good' },
  { metric: 'Volatility', value: 14.2, benchmark: 16.8, status: 'good' }
];

export default function PortfolioPerformance() {
  const [timeframe, setTimeframe] = useState("1Y");
  const [compareWith, setCompareWith] = useState("SP500");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'bad': return 'text-red-600 dark:text-red-400';
      default: return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Performance</h1>
            <p className="text-muted-foreground">Track your investment returns and risk metrics</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(142500)}</div>
              <div className="flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+42.5% YTD</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2.7%</div>
              <div className="flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">vs +1.8% benchmark</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.42</div>
              <div className="flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">vs 1.18 benchmark</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-8.5%</div>
              <div className="flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">Better than -12.3%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Portfolio Value Over Time</CardTitle>
                    <div className="flex space-x-2">
                      <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1M">1M</SelectItem>
                          <SelectItem value="3M">3M</SelectItem>
                          <SelectItem value="6M">6M</SelectItem>
                          <SelectItem value="1Y">1Y</SelectItem>
                          <SelectItem value="ALL">ALL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={assetAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {assetAllocation.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Returns Tab */}
          <TabsContent value="returns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Returns vs Benchmark</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={monthlyReturns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="returns" fill="#8884d8" name="Portfolio" />
                      <Bar dataKey="benchmark" fill="#82ca9d" name="Benchmark" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((stock, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            {formatPercentage(stock.returns)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stock.allocation}% allocation
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Allocation Tab */}
          <TabsContent value="allocation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assetAllocation.map((asset, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{asset.name}</span>
                        <span>{asset.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${asset.value}%`, 
                            backgroundColor: asset.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{metric.metric}</div>
                        <div className="text-sm text-muted-foreground">
                          Benchmark: {metric.benchmark}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                          {metric.value}
                        </div>
                        <Badge variant={metric.status === 'good' ? 'default' : 'secondary'}>
                          {metric.status === 'good' ? 'Good' : metric.status === 'bad' ? 'Poor' : 'Neutral'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}