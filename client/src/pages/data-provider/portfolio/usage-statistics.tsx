import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Eye,
  Calendar,
  FileText,
  Users,
  Target,
  Clock,
  GitBranch,
  Zap
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function UsageStatistics() {
  const [timeRange, setTimeRange] = useState("30d");

  // Sample usage statistics data
  const usageStats = {
    totalDownloads: 4785,
    activeIntegrations: 127,
    uniqueUsers: 89,
    recentActivity: 45,
    topPerformingDataset: "Cryptocurrency Trading Pairs"
  };

  const datasetUsage = [
    {
      id: 1,
      name: "S&P 500 Historical Data",
      downloads: 1247,
      uniqueUsers: 34,
      integrations: 23,
      lastUsed: "2025-07-15T10:30:00",
      trend: "+12%",
      activeModels: ["Risk Assessment Pro", "Portfolio Optimizer", "Market Predictor"]
    },
    {
      id: 2,
      name: "Federal Reserve Economic Data",
      downloads: 892,
      uniqueUsers: 28,
      integrations: 19,
      lastUsed: "2025-07-15T09:15:00",
      trend: "+8%",
      activeModels: ["Economic Forecaster", "Inflation Tracker"]
    },
    {
      id: 3,
      name: "Cryptocurrency Trading Pairs",
      downloads: 2156,
      uniqueUsers: 45,
      integrations: 67,
      lastUsed: "2025-07-15T11:45:00",
      trend: "+24%",
      activeModels: ["Crypto Bot Alpha", "DeFi Yield Optimizer", "Arbitrage Scanner", "Trend Hunter"]
    },
    {
      id: 4,
      name: "Corporate Bond Yields",
      downloads: 34,
      uniqueUsers: 8,
      integrations: 3,
      lastUsed: "2025-07-14T16:20:00",
      trend: "New",
      activeModels: ["Bond Analyzer"]
    },
    {
      id: 5,
      name: "Legacy Market Data 2010-2015",
      downloads: 456,
      uniqueUsers: 15,
      integrations: 12,
      lastUsed: "2025-07-13T14:10:00",
      trend: "-5%",
      activeModels: ["Historical Backtester", "Vintage Analysis Tool"]
    }
  ];

  const recentActivity = [
    {
      id: 1,
      timestamp: "2025-07-15T11:45:00",
      action: "Dataset Downloaded",
      dataset: "Cryptocurrency Trading Pairs",
      user: "Alex Chen",
      project: "DeFi Yield Optimizer",
      details: "Full dataset download for model training"
    },
    {
      id: 2,
      timestamp: "2025-07-15T10:30:00",
      action: "API Integration",
      dataset: "S&P 500 Historical Data",
      user: "Sarah Johnson",
      project: "Risk Assessment Pro",
      details: "Real-time API connection established"
    },
    {
      id: 3,
      timestamp: "2025-07-15T09:15:00",
      action: "Model Updated",
      dataset: "Federal Reserve Economic Data",
      user: "Mike Rodriguez",
      project: "Economic Forecaster",
      details: "Model retrained with latest data"
    },
    {
      id: 4,
      timestamp: "2025-07-14T16:20:00",
      action: "New Integration",
      dataset: "Corporate Bond Yields",
      user: "Emma Watson",
      project: "Bond Analyzer",
      details: "First time integration setup"
    },
    {
      id: 5,
      timestamp: "2025-07-14T14:35:00",
      action: "Data Update",
      dataset: "Cryptocurrency Trading Pairs",
      user: "System",
      project: "Automated Sync",
      details: "Hourly data synchronization completed"
    }
  ];

  const integrationMetrics = [
    {
      dataset: "Cryptocurrency Trading Pairs",
      totalIntegrations: 67,
      activeModels: 4,
      avgSessionDuration: "45 min",
      dataVolume: "2.3 GB/day",
      errorRate: "0.1%"
    },
    {
      dataset: "S&P 500 Historical Data",
      totalIntegrations: 23,
      activeModels: 3,
      avgSessionDuration: "32 min",
      dataVolume: "1.1 GB/day",
      errorRate: "0.3%"
    },
    {
      dataset: "Federal Reserve Economic Data",
      totalIntegrations: 19,
      activeModels: 2,
      avgSessionDuration: "28 min",
      dataVolume: "450 MB/day",
      errorRate: "0.2%"
    }
  ];

  const getTrendColor = (trend: string) => {
    if (trend === "New") return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (trend.startsWith("+")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (trend.startsWith("-")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Dataset Downloaded": return <Download className="h-4 w-4" />;
      case "API Integration": return <GitBranch className="h-4 w-4" />;
      case "Model Updated": return <Zap className="h-4 w-4" />;
      case "New Integration": return <Target className="h-4 w-4" />;
      case "Data Update": return <Activity className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Usage Statistics</h1>
            <p className="text-muted-foreground">Track how developers are using your datasets with detailed download and integration metrics.</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.totalDownloads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+15% from last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.activeIntegrations}</div>
              <p className="text-xs text-muted-foreground">AI models using your data</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">+8 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">Events last 24h</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{usageStats.topPerformingDataset}</div>
              <p className="text-xs text-muted-foreground">Most downloaded</p>
            </CardContent>
          </Card>
        </div>

        {/* Dataset Usage Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Download Statistics by Dataset</CardTitle>
            <CardDescription>Detailed usage metrics for each dataset including trends and integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset Name</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Unique Users</TableHead>
                  <TableHead>Integrations</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Active Models</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasetUsage.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>
                      <div className="font-medium">{dataset.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dataset.downloads.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{dataset.uniqueUsers}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dataset.integrations}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatTimeAgo(dataset.lastUsed)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTrendColor(dataset.trend)}>
                        {dataset.trend}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {dataset.activeModels.slice(0, 2).map((model, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {model}
                          </Badge>
                        ))}
                        {dataset.activeModels.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{dataset.activeModels.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Integration Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Integration Performance</CardTitle>
            <CardDescription>Technical metrics for dataset integrations and API usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {integrationMetrics.map((metric, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{metric.dataset}</h3>
                    <Badge variant="outline">{metric.totalIntegrations} integrations</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Active Models</div>
                      <div className="text-lg font-bold">{metric.activeModels}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Avg Session</div>
                      <div className="text-lg font-bold">{metric.avgSessionDuration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Data Volume</div>
                      <div className="text-lg font-bold">{metric.dataVolume}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Error Rate</div>
                      <div className="text-lg font-bold text-green-600">{metric.errorRate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Performance</div>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="h-2 flex-1" />
                        <span className="text-sm">95%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest dataset usage events and integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">{activity.action}</h4>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <span className="font-medium">{activity.dataset}</span> • Used by <span className="font-medium">{activity.user}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Project: <span className="font-medium">{activity.project}</span> • {activity.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">View All Activity</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}