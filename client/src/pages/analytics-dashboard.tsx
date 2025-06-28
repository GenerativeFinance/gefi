import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  PieChart,
  Activity,
  Brain,
  Shield,
  AlertTriangle,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Settings,
  Bell,
  Download,
  RefreshCw
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Sample data for charts
const portfolioPerformanceData = [
  { month: 'Jan', value: 245000, benchmark: 240000 },
  { month: 'Feb', value: 248000, benchmark: 242000 },
  { month: 'Mar', value: 251000, benchmark: 244000 },
  { month: 'Apr', value: 247000, benchmark: 243000 },
  { month: 'May', value: 252000, benchmark: 246000 },
  { month: 'Jun', value: 258000, benchmark: 248000 },
];

const assetAllocationData = [
  { name: 'Stocks', value: 60, amount: 148548 },
  { name: 'Bonds', value: 30, amount: 74274 },
  { name: 'Crypto', value: 10, amount: 24758 },
];

const aiModelPerformanceData = [
  { name: 'Conservative AI', performance: 12.4, accuracy: 94.2, risk: 'Low' },
  { name: 'Aggressive Growth', performance: 24.8, accuracy: 91.8, risk: 'High' },
  { name: 'Balanced Strategy', performance: 18.2, accuracy: 96.1, risk: 'Medium' },
];

const COLORS = ['hsl(243, 100%, 67%)', 'hsl(214, 100%, 61%)', 'hsl(197, 100%, 63%)'];

export default function AnalyticsDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('6M');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ["/api/portfolio"],
    retry: false,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/risk-alerts"],
    retry: false,
  });

  const { data: marketInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/market-insights"],
    retry: false,
  });

  if (isLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-secondary rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-secondary rounded-lg"></div>
              <div className="h-96 bg-secondary rounded-lg"></div>
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  // Default dashboard data until real API data is available
  const totalValue = 247580;
  const livePnL = 12430;
  const annualReturns = 18.4;
  const sharpeRatio = 2.1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Financial Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {(user as any)?.firstName || 'Investor'}. Here's your comprehensive financial overview.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" className="gradient-primary">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                  <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+5.2% today</span>
                  </div>
                </div>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Live P&L</p>
                  <p className="text-2xl font-bold text-green-400">+${livePnL.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-sm text-muted-foreground">+{((livePnL/totalValue) * 100).toFixed(1)}% return</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Returns</p>
                  <p className="text-2xl font-bold">{annualReturns}%</p>
                  <div className="flex items-center mt-1">
                    <Target className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-sm text-muted-foreground">Sharpe: {sharpeRatio}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Confidence</p>
                  <p className="text-2xl font-bold">94.2%</p>
                  <div className="flex items-center mt-1">
                    <Zap className="h-4 w-4 text-purple-400 mr-1" />
                    <span className="text-sm text-muted-foreground">3 models active</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Performance Chart */}
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Portfolio Performance</CardTitle>
                  <div className="flex items-center space-x-2">
                    {['1M', '3M', '6M', '1Y'].map((range) => (
                      <Button
                        key={range}
                        variant={selectedTimeRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeRange(range)}
                        className="text-xs"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={portfolioPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 32%, 17%)" />
                      <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" />
                      <YAxis stroke="hsl(215, 20%, 65%)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(217, 32%, 17%)', 
                          border: '1px solid hsl(217, 32%, 17%)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(243, 100%, 67%)" fill="hsl(243, 100%, 67%)" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="benchmark" stroke="hsl(215, 20%, 65%)" fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Asset Allocation */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {assetAllocationData.map((asset, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: COLORS[index] }}
                            ></div>
                            {asset.name}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-semibold">{asset.value}%</span>
                            <p className="text-xs text-muted-foreground">${asset.amount.toLocaleString()}</p>
                          </div>
                        </div>
                        <Progress value={asset.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Risk Level</span>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                        Moderate
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Portfolio rebalanced by AI</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New AI model subscribed: Conservative Strategy</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Market insight generated</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-yellow-400" />
                    Risk Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-300">AI predicts market volatility</p>
                        <p className="text-xs text-muted-foreground">High confidence • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <Shield className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-300">Tech sector exposure above threshold</p>
                        <p className="text-xs text-muted-foreground">Medium risk • 4 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* AI Model Performance */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>AI Model Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aiModelPerformanceData.map((model, index) => (
                    <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                      <h4 className="font-semibold mb-3">{model.name}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Performance</span>
                          <span className="text-sm font-semibold text-green-400">+{model.performance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Accuracy</span>
                          <span className="text-sm font-semibold">{model.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Risk Level</span>
                          <Badge variant="outline" className={
                            model.risk === 'High' ? 'text-red-400 border-red-400/50' :
                            model.risk === 'Medium' ? 'text-yellow-400 border-yellow-400/50' :
                            'text-green-400 border-green-400/50'
                          }>
                            {model.risk}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Value at Risk (VaR)</span>
                      <span className="text-sm font-semibold">-$12,380</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Maximum Drawdown</span>
                      <span className="text-sm font-semibold">-8.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Beta</span>
                      <span className="text-sm font-semibold">1.05</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Volatility</span>
                      <span className="text-sm font-semibold">12.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie 
                        data={assetAllocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {assetAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={portfolioPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 32%, 17%)" />
                    <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" />
                    <YAxis stroke="hsl(215, 20%, 65%)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(217, 32%, 17%)', 
                        border: '1px solid hsl(217, 32%, 17%)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="value" stroke="hsl(243, 100%, 67%)" strokeWidth={3} name="Portfolio" />
                    <Line type="monotone" dataKey="benchmark" stroke="hsl(215, 20%, 65%)" strokeWidth={2} strokeDasharray="5 5" name="Benchmark" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  );
}