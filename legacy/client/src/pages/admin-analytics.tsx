import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Eye,
  Download,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlatformMetrics {
  category: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  period: string;
}

interface UserGrowthData {
  month: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  retentionRate: number;
}

interface RevenueData {
  category: string;
  current: number;
  previous: number;
  growth: number;
}

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [metricCategory, setMetricCategory] = useState("all");

  // Mock data - in real implementation, these would come from API calls
  const platformMetrics: PlatformMetrics[] = [
    {
      category: "Users",
      name: "Total Registered Users",
      value: 15847,
      unit: "users",
      change: 12.5,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Users",
      name: "Daily Active Users",
      value: 3421,
      unit: "users",
      change: 8.3,
      trend: "up",
      period: "vs yesterday"
    },
    {
      category: "Users",
      name: "Monthly Active Users",
      value: 12634,
      unit: "users",
      change: 15.7,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Revenue",
      name: "Monthly Recurring Revenue",
      value: 342500,
      unit: "USD",
      change: 18.2,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Revenue",
      name: "Average Revenue Per User",
      value: 27.15,
      unit: "USD",
      change: 5.8,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Revenue",
      name: "Platform Commission",
      value: 68500,
      unit: "USD",
      change: 22.4,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Models",
      name: "Total AI Models",
      value: 234,
      unit: "models",
      change: 9.4,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Models",
      name: "Active Subscriptions",
      value: 1847,
      unit: "subscriptions",
      change: 14.2,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Models",
      name: "Model Performance Score",
      value: 4.3,
      unit: "rating",
      change: 2.1,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Trading",
      name: "Total Trades Executed",
      value: 45623,
      unit: "trades",
      change: 28.7,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Trading",
      name: "Trading Volume",
      value: 12450000,
      unit: "USD",
      change: 31.5,
      trend: "up",
      period: "vs last month"
    },
    {
      category: "Trading",
      name: "Average Trade Size",
      value: 272.8,
      unit: "USD",
      change: -3.2,
      trend: "down",
      period: "vs last month"
    }
  ];

  const userGrowthData: UserGrowthData[] = [
    { month: "Jan 2025", totalUsers: 12450, newUsers: 1200, activeUsers: 8900, retentionRate: 85.2 },
    { month: "Feb 2025", totalUsers: 13200, newUsers: 950, activeUsers: 9400, retentionRate: 87.1 },
    { month: "Mar 2025", totalUsers: 14100, newUsers: 1100, activeUsers: 10200, retentionRate: 88.5 },
    { month: "Apr 2025", totalUsers: 14850, newUsers: 850, activeUsers: 10800, retentionRate: 89.2 },
    { month: "May 2025", totalUsers: 15200, newUsers: 650, activeUsers: 11200, retentionRate: 90.1 },
    { month: "Jun 2025", totalUsers: 15600, newUsers: 750, activeUsers: 11800, retentionRate: 91.3 },
    { month: "Jul 2025", totalUsers: 15847, newUsers: 480, activeUsers: 12200, retentionRate: 92.1 }
  ];

  const revenueData: RevenueData[] = [
    { category: "AI Model Subscriptions", current: 245000, previous: 198000, growth: 23.7 },
    { category: "Trading Commissions", current: 68500, previous: 54200, growth: 26.4 },
    { category: "Data Provider Fees", current: 29000, previous: 25800, growth: 12.4 },
    { category: "Premium Features", current: 15600, previous: 12900, growth: 20.9 }
  ];

  const filteredMetrics = metricCategory === "all" 
    ? platformMetrics 
    : platformMetrics.filter(metric => metric.category.toLowerCase() === metricCategory.toLowerCase());

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === "USD") {
      return `$${value.toLocaleString()}`;
    }
    if (unit === "users" || unit === "trades" || unit === "subscriptions" || unit === "models") {
      return value.toLocaleString();
    }
    if (unit === "rating") {
      return value.toFixed(1);
    }
    return value.toString();
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.current, 0);
  const totalGrowth = revenueData.reduce((sum, item) => sum + item.growth, 0) / revenueData.length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Platform Analytics</h1>
              <p className="text-muted-foreground mt-2">Comprehensive platform performance metrics and insights</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={metricCategory} onValueChange={setMetricCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="models">Models</SelectItem>
                <SelectItem value="trading">Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  {getTrendIcon(metric.trend, metric.change)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatValue(metric.value, metric.unit)}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-xs font-medium ${getTrendColor(metric.trend)}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground">{metric.period}</span>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {metric.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Revenue Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Total Monthly Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Average Growth</p>
                    <p className="text-lg font-semibold text-green-600">+{totalGrowth.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {revenueData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.category}</h4>
                        <p className="text-lg font-semibold">${item.current.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            +{item.growth.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          vs ${item.previous.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Growth Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Growth Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Month</th>
                      <th className="text-left p-2 font-medium">Total Users</th>
                      <th className="text-left p-2 font-medium">New Users</th>
                      <th className="text-left p-2 font-medium">Active Users</th>
                      <th className="text-left p-2 font-medium">Retention Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userGrowthData.map((data, index) => (
                      <tr key={index} className="border-b hover:bg-muted/30">
                        <td className="p-2 font-medium">{data.month}</td>
                        <td className="p-2">{data.totalUsers.toLocaleString()}</td>
                        <td className="p-2">
                          <span className="text-green-600">+{data.newUsers.toLocaleString()}</span>
                        </td>
                        <td className="p-2">{data.activeUsers.toLocaleString()}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-green-600">
                            {data.retentionRate.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Top Performing Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">AI Model Subscriptions</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Trading Volume</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">User Engagement</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Data Quality</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API Uptime</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      99.97%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      245ms
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Error Rate</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      0.08%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Data Processing</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Real-time
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Security Score</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      A+
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}