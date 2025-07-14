import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Link } from "wouter";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  BarChart3,
  Bot,
  Shield,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  AlertTriangle,
  Users,
  Zap,
  PieChart,
  Activity,
  Eye,
  Bell,
  Newspaper,
  Star,
  Settings,
  Download
} from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Dashboard overview data with enhanced metrics
const portfolioOverview = {
  totalValue: 142500,
  dailyChange: 2850,
  dailyChangePercent: 2.04,
  monthlyReturn: 8.7,
  ytdReturn: 24.3,
  benchmark: 18.1,
  cashBalance: 12750,
  marginUsed: 5200,
  buyingPower: 45300,
  // Enhanced risk-adjusted metrics
  sharpeRatio: 1.42,
  benchmarkSharpe: 1.18,
  maxDrawdown: -8.5,
  benchmarkDrawdown: -12.3,
  beta: 0.94,
  alpha: 6.2,
  volatility: 14.8,
  var95: -3.2  // 95% VaR
};

const quickStats = [
  { 
    label: "Active AI Models", 
    value: "8", 
    change: "+2",
    icon: Bot,
    color: "text-blue-600"
  },
  { 
    label: "Trading Bots", 
    value: "3", 
    change: "+1",
    icon: Zap,
    color: "text-green-600"
  },
  { 
    label: "Risk Score", 
    value: "6.2/10", 
    change: "-0.3",
    icon: Shield,
    color: "text-orange-600"
  },
  { 
    label: "Alerts", 
    value: "2", 
    change: "0",
    icon: AlertTriangle,
    color: "text-red-600"
  }
];

// Asset allocation data
const assetAllocation = {
  labels: ['Stocks', 'Crypto', 'AI Models', 'Bonds', 'Cash'],
  datasets: [{
    data: [45, 25, 15, 10, 5],
    backgroundColor: [
      '#3b82f6', // Blue
      '#f59e0b', // Orange  
      '#10b981', // Green
      '#8b5cf6', // Purple
      '#6b7280'  // Gray
    ],
    borderWidth: 2,
    borderColor: '#1f2937'
  }]
};

// Portfolio performance data
const performanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Portfolio Value',
      data: [100000, 105000, 108000, 112000, 118000, 125000, 142500],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Benchmark',
      data: [100000, 103000, 106000, 109000, 112000, 115000, 118100],
      borderColor: '#6b7280',
      backgroundColor: 'transparent',
      tension: 0.4,
      borderDash: [5, 5]
    }
  ]
};

// Top holdings data
const topHoldings = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', value: 28500, allocation: 20.0, change: 12.5 },
  { symbol: 'TSLA', name: 'Tesla Inc', value: 21375, allocation: 15.0, change: -2.1 },
  { symbol: 'AAPL', name: 'Apple Inc', value: 14250, allocation: 10.0, change: 3.2 },
  { symbol: 'BTC', name: 'Bitcoin', value: 12825, allocation: 9.0, change: 8.7 },
  { symbol: 'ETH', name: 'Ethereum', value: 10692, allocation: 7.5, change: 5.4 }
];

// Recent transactions
const recentTransactions = [
  { type: 'BUY', symbol: 'NVDA', quantity: 50, price: 195.50, date: '2025-07-08', time: '09:30 AM' },
  { type: 'SELL', symbol: 'MSFT', quantity: 25, price: 420.00, date: '2025-07-07', time: '02:15 PM' },
  { type: 'BUY', symbol: 'BTC', quantity: 0.5, price: 35000.00, date: '2025-07-06', time: '11:45 AM' },
  { type: 'DEPOSIT', symbol: 'CASH', quantity: 10000, price: 1.00, date: '2025-07-05', time: '10:00 AM' }
];

// Watchlist data
const watchlist = [
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 2750.00, change: 1.2, changePercent: 0.044 },
  { symbol: 'AMZN', name: 'Amazon.com Inc', price: 3420.50, change: -15.30, changePercent: -0.445 },
  { symbol: 'META', name: 'Meta Platforms', price: 485.20, change: 8.75, changePercent: 1.837 },
  { symbol: 'NFLX', name: 'Netflix Inc', price: 625.80, change: 12.40, changePercent: 2.021 }
];

// AI model performance
const aiModelPerformance = [
  { 
    name: 'Quantum Risk Predictor', 
    return: 24.8, 
    accuracy: 94.2, 
    trades: 156, 
    pnl: 2847, 
    status: 'Active',
    subscriptionCost: 299
  },
  { 
    name: 'Smart Portfolio Optimizer', 
    return: 13.3, 
    accuracy: 87.6, 
    trades: 89, 
    pnl: 1654, 
    status: 'Active',
    subscriptionCost: 199
  },
  { 
    name: 'Sentiment Analysis Pro', 
    return: 8.9, 
    accuracy: 82.1, 
    trades: 245, 
    pnl: 987, 
    status: 'Testing',
    subscriptionCost: 149
  }
];

// Market insights
const marketInsights = [
  {
    title: 'Tech Sector Outlook',
    insight: 'AI and semiconductor stocks showing strong momentum with 15% sector gain this month',
    sentiment: 'Bullish',
    confidence: 87,
    impact: 'High'
  },
  {
    title: 'Crypto Market Analysis',
    insight: 'Bitcoin consolidation above $35K support level suggests potential breakout',
    sentiment: 'Neutral',
    confidence: 72,
    impact: 'Medium'
  },
  {
    title: 'Portfolio Concentration Risk',
    insight: 'High exposure to tech sector (35%) may increase volatility during corrections',
    sentiment: 'Cautious',
    confidence: 91,
    impact: 'High'
  }
];

const recentActivity = [
  {
    type: "trade",
    description: "Bought 50 shares of NVDA",
    amount: "+$12,450",
    time: "2 hours ago",
    status: "completed"
  },
  {
    type: "alert",
    description: "Portfolio risk exceeded threshold",
    amount: "Risk: 7.2/10",
    time: "4 hours ago",
    status: "warning"
  },
  {
    type: "model",
    description: "Quantum Risk Predictor activated",
    amount: "+$2,847",
    time: "6 hours ago",
    status: "active"
  },
  {
    type: "deposit",
    description: "Cash deposit processed",
    amount: "+$10,000",
    time: "1 day ago",
    status: "completed"
  }
];

const quickActions = [
  {
    title: "View Portfolio",
    description: "Check your current holdings and performance",
    href: "/portfolio",
    icon: Wallet,
    color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
  },
  {
    title: "Browse AI Models",
    description: "Discover new AI models to enhance your strategy",
    href: "/marketplace",
    icon: Bot,
    color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
  },
  {
    title: "Risk Assessment",
    description: "Review your current risk exposure",
    href: "/risk-assessment",
    icon: Shield,
    color: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
  },
  {
    title: "Generate Reports",
    description: "Create detailed performance and compliance reports",
    href: "/reports",
    icon: FileText,
    color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
  }
];

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-orange-600 dark:text-orange-400';
      case 'active': return 'text-blue-600 dark:text-blue-400';
      case 'info': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Investor Overview</h1>
            <p className="text-muted-foreground">Your comprehensive investment dashboard with enhanced analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Badge variant="outline" className="text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        {/* Enhanced Portfolio Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Portfolio Overview
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(portfolioOverview.totalValue)}</div>
                <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
                <div className="flex items-center mt-1">
                  {portfolioOverview.dailyChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={portfolioOverview.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(Math.abs(portfolioOverview.dailyChange))} ({Math.abs(portfolioOverview.dailyChangePercent)}%)
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600">+{portfolioOverview.monthlyReturn}%</div>
                <div className="text-sm text-muted-foreground">Monthly Return</div>
                <div className="text-xs text-muted-foreground mt-1">vs +3.2% benchmark</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-blue-600">+{portfolioOverview.ytdReturn}%</div>
                <div className="text-sm text-muted-foreground">YTD Return</div>
                <div className="text-xs text-muted-foreground mt-1">vs +{portfolioOverview.benchmark}% benchmark</div>
              </div>

              <div>
                <div className="text-2xl font-bold">{formatCurrency(portfolioOverview.cashBalance)}</div>
                <div className="text-sm text-muted-foreground">Cash Balance</div>
                <div className="text-xs text-muted-foreground mt-1">Available for investing</div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Link href="/portfolio">
                  <Button size="sm" className="w-full">View Details</Button>
                </Link>
                <Link href="/portfolio-performance">
                  <Button variant="outline" size="sm" className="w-full">Performance</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comprehensive Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="ai-models">AI Models</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                        <div className="text-xs text-muted-foreground">{stat.change} from last week</div>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Portfolio Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line 
                      data={performanceData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' }
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
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Asset Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Asset Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Pie 
                      data={assetAllocation} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'right' }
                        }
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Card className={`cursor-pointer hover:shadow-md transition-shadow ${action.color}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <action.icon className="h-8 w-8" />
                            <div>
                              <div className="font-semibold">{action.title}</div>
                              <div className="text-sm text-muted-foreground">{action.description}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                        <div>
                          <div className="font-medium">{activity.description}</div>
                          <div className="text-sm text-muted-foreground">{activity.time}</div>
                        </div>
                      </div>
                      <div className={`font-medium ${getStatusColor(activity.status)}`}>
                        {activity.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Holdings Tab */}
          <TabsContent value="holdings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topHoldings.map((holding, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="font-bold text-lg">{holding.symbol}</div>
                        <div>
                          <div className="font-medium">{holding.name}</div>
                          <div className="text-sm text-muted-foreground">{holding.allocation}% of portfolio</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(holding.value)}</div>
                        <div className={`text-sm ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.change >= 0 ? '+' : ''}{holding.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                  <CardDescription>Risk-adjusted returns and benchmark comparisons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Sharpe Ratio</span>
                      <div className="text-right">
                        <span className="font-bold text-green-600">{portfolioOverview.sharpeRatio}</span>
                        <div className="text-xs text-muted-foreground">vs {portfolioOverview.benchmarkSharpe} benchmark</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Max Drawdown</span>
                      <div className="text-right">
                        <span className="font-bold text-green-600">{portfolioOverview.maxDrawdown}%</span>
                        <div className="text-xs text-muted-foreground">vs {portfolioOverview.benchmarkDrawdown}% benchmark</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Beta</span>
                      <div className="text-right">
                        <span className="font-bold">{portfolioOverview.beta}</span>
                        <div className="text-xs text-muted-foreground">Market correlation</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Alpha</span>
                      <div className="text-right">
                        <span className="font-bold text-green-600">+{portfolioOverview.alpha}%</span>
                        <div className="text-xs text-muted-foreground">Excess return</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Volatility</span>
                      <div className="text-right">
                        <span className="font-bold">{portfolioOverview.volatility}%</span>
                        <div className="text-xs text-muted-foreground">Annualized</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                  <CardDescription>Value at Risk and diversification analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Value at Risk (95%)</span>
                      <div className="text-right">
                        <span className="font-bold text-red-600">{portfolioOverview.var95}%</span>
                        <div className="text-xs text-muted-foreground">Daily VaR</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Concentration Risk</span>
                      <div className="text-right">
                        <span className="font-bold text-orange-600">Medium</span>
                        <div className="text-xs text-muted-foreground">Top 5 holdings: 67%</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sector Diversification</span>
                      <div className="text-right">
                        <span className="font-bold">7 sectors</span>
                        <div className="text-xs text-muted-foreground">Well diversified</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Geographic Exposure</span>
                      <div className="text-right">
                        <span className="font-bold">4 regions</span>
                        <div className="text-xs text-muted-foreground">Global exposure</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Benchmark Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Benchmark Comparison</CardTitle>
                <CardDescription>Performance vs S&P 500 and sector indices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+{portfolioOverview.ytdReturn}%</div>
                    <div className="text-sm text-muted-foreground">Your Portfolio YTD</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">+{portfolioOverview.benchmark}%</div>
                    <div className="text-sm text-muted-foreground">S&P 500 YTD</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">+{(portfolioOverview.ytdReturn - portfolioOverview.benchmark).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Outperformance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant={transaction.type === 'BUY' ? 'default' : transaction.type === 'SELL' ? 'destructive' : 'secondary'}>
                          {transaction.type}
                        </Badge>
                        <div>
                          <div className="font-medium">{transaction.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.date} at {transaction.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {transaction.quantity} @ {formatCurrency(transaction.price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total: {formatCurrency(transaction.quantity * transaction.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Watchlist
                  </div>
                  <Button size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Add Symbol
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {watchlist.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="font-bold text-lg">{item.symbol}</div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(item.price)}</div>
                        <div className={`text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change >= 0 ? '+' : ''}{formatCurrency(Math.abs(item.change))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="ai-models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="h-5 w-5 mr-2" />
                    AI Model Performance
                  </div>
                  <Button size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Browse Models
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiModelPerformance.map((model, index) => (
                    <div key={index} className="p-6 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{model.name}</h3>
                          <Badge variant={model.status === 'Active' ? 'default' : 'secondary'}>
                            {model.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">+{model.return}%</div>
                          <div className="text-sm text-muted-foreground">30-day return</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Accuracy</div>
                          <div className="font-bold">{model.accuracy}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Trades</div>
                          <div className="font-bold">{model.trades}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">P&L</div>
                          <div className="font-bold text-green-600">+{formatCurrency(model.pnl)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Cost</div>
                          <div className="font-bold">{formatCurrency(model.subscriptionCost)}/mo</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Newspaper className="h-5 w-5 mr-2" />
                  AI-Driven Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {marketInsights.map((insight, index) => (
                    <div key={index} className="p-6 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg">{insight.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            insight.sentiment === 'Bullish' ? 'default' : 
                            insight.sentiment === 'Neutral' ? 'secondary' : 
                            'destructive'
                          }>
                            {insight.sentiment}
                          </Badge>
                          <Badge variant="outline">
                            {insight.confidence}% confident
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{insight.insight}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Impact: </span>
                            <span className={`font-medium ${
                              insight.impact === 'High' ? 'text-red-600' : 
                              insight.impact === 'Medium' ? 'text-orange-600' : 
                              'text-green-600'
                            }`}>
                              {insight.impact}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Bell className="h-4 w-4 mr-2" />
                            Set Alert
                          </Button>
                          <Button size="sm">
                            Learn More
                          </Button>
                        </div>
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