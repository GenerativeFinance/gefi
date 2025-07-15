import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import {
  Activity,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  BarChart3,
  ArrowUpRight,
  Filter,
  Search,
  RefreshCw
} from "lucide-react";

export default function DataProviderUsage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample usage data
  const usageStats = [
    {
      dataset: "Financial Market Data Q3 2025",
      downloads: 1247,
      apiCalls: 45623,
      uniqueUsers: 89,
      revenue: "$12,450",
      growth: "+23%",
      trend: "up"
    },
    {
      dataset: "Real Estate Pricing Analytics",
      downloads: 892,
      apiCalls: 32145,
      uniqueUsers: 67,
      revenue: "$8,920",
      growth: "+15%",
      trend: "up"
    },
    {
      dataset: "Cryptocurrency Trading Signals",
      downloads: 634,
      apiCalls: 28734,
      uniqueUsers: 45,
      revenue: "$6,340",
      growth: "-5%",
      trend: "down"
    },
    {
      dataset: "ESG Investment Data",
      downloads: 423,
      apiCalls: 19456,
      uniqueUsers: 34,
      revenue: "$4,230",
      growth: "+8%",
      trend: "up"
    }
  ];

  const recentActivity = [
    {
      user: "AlgoTrade Corp",
      action: "Downloaded Financial Market Data Q3 2025",
      time: "2 hours ago",
      volume: "2.3 GB"
    },
    {
      user: "QuantFund Analytics",
      action: "API access to Real Estate Pricing Analytics",
      time: "4 hours ago",
      volume: "1,250 calls"
    },
    {
      user: "CryptoInsights Ltd",
      action: "Downloaded Cryptocurrency Trading Signals",
      time: "6 hours ago",
      volume: "890 MB"
    },
    {
      user: "Green Capital Partners",
      action: "API access to ESG Investment Data",
      time: "8 hours ago",
      volume: "745 calls"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Usage Statistics</h1>
            <p className="text-muted-foreground">Monitor dataset usage, downloads, and API calls</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
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
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,196</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125,958</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">235</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+25%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$31,940</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+14%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed view */}
        <Tabs defaultValue="datasets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="datasets">Dataset Usage</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="datasets" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Dataset Usage Table */}
            <div className="grid gap-4">
              {usageStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{stat.dataset}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {stat.downloads} downloads
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {stat.apiCalls.toLocaleString()} API calls
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {stat.uniqueUsers} users
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{stat.revenue}</div>
                          <div className="flex items-center gap-1 text-sm">
                            {stat.trend === "up" ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                              {stat.growth}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest dataset access and download activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{activity.user}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{activity.volume}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Trends</CardTitle>
                  <CardDescription>Dataset usage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Chart visualization would be implemented here
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Datasets</CardTitle>
                  <CardDescription>Most popular datasets by usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {usageStats.slice(0, 3).map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{stat.dataset}</span>
                        <Badge variant="secondary">{stat.downloads} downloads</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}