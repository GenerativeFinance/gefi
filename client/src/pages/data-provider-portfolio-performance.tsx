import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  DollarSign,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Users,
  Database
} from "lucide-react";

export default function DataProviderPortfolioPerformance() {
  // Sample performance data
  const performanceData = {
    totalRevenue: 236000,
    monthlyGrowth: 8.5,
    quarterlyGrowth: 24.7,
    yearlyGrowth: 87.3,
    topPerformers: [
      { name: "S&P 500 Real-time", revenue: 85000, growth: 12.5, subscribers: 245 },
      { name: "Crypto Market Depth", revenue: 67500, growth: 8.3, subscribers: 189 },
      { name: "Economic Indicators", revenue: 45000, growth: 15.2, subscribers: 156 },
      { name: "ESG Risk Scores", revenue: 38500, growth: 6.7, subscribers: 134 }
    ],
    metrics: {
      avgRevenuePerDataset: 59000,
      totalApiCalls: 3210000,
      customerRetention: 94.2,
      satisfactionScore: 4.7
    },
    monthlyData: [
      { month: "Jul", revenue: 185000, subscribers: 612 },
      { month: "Aug", revenue: 195000, subscribers: 648 },
      { month: "Sep", revenue: 208000, subscribers: 685 },
      { month: "Oct", revenue: 218000, subscribers: 712 },
      { month: "Nov", revenue: 227000, subscribers: 734 },
      { month: "Dec", revenue: 236000, subscribers: 724 }
    ]
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Performance</h1>
            <p className="text-muted-foreground">
              Analyze revenue, growth metrics, and dataset performance
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
            <TabsTrigger value="datasets">Dataset Performance</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">${performanceData.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                      <p className="text-2xl font-bold text-green-600">+{performanceData.monthlyGrowth}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Quarterly Growth</p>
                      <p className="text-2xl font-bold text-blue-600">+{performanceData.quarterlyGrowth}%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Yearly Growth</p>
                      <p className="text-2xl font-bold text-purple-600">+{performanceData.yearlyGrowth}%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Trend Chart Placeholder */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and subscriber growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Revenue trend chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Datasets */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Datasets</CardTitle>
                <CardDescription>Highest revenue generating datasets this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.topPerformers.map((dataset, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold">#{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{dataset.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dataset.subscribers} subscribers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${dataset.revenue.toLocaleString()}</div>
                        <div className="text-sm text-green-600">+{dataset.growth}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue distribution by dataset category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Market Data</span>
                        <span className="text-sm">$152,500 (65%)</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Alternative Data</span>
                        <span className="text-sm">$45,000 (19%)</span>
                      </div>
                      <Progress value={19} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Risk Data</span>
                        <span className="text-sm">$38,500 (16%)</span>
                      </div>
                      <Progress value={16} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                  <CardDescription>Revenue growth over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceData.monthlyData.map((month, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{month.month}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            ${month.revenue.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {month.subscribers} subscribers
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="datasets">
            <div className="space-y-6">
              {performanceData.topPerformers.map((dataset, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{dataset.name}</CardTitle>
                        <CardDescription>Performance metrics and analytics</CardDescription>
                      </div>
                      <Badge variant="secondary">Rank #{index + 1}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${dataset.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {dataset.subscribers}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Subscribers</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          +{dataset.growth}%
                        </div>
                        <div className="text-sm text-muted-foreground">Growth Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>Essential metrics for portfolio health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg Revenue per Dataset</span>
                    <span className="font-bold">${performanceData.metrics.avgRevenuePerDataset.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total API Calls</span>
                    <span className="font-bold">{performanceData.metrics.totalApiCalls.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer Retention</span>
                    <span className="font-bold text-green-600">{performanceData.metrics.customerRetention}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Satisfaction Score</span>
                    <span className="font-bold text-blue-600">{performanceData.metrics.satisfactionScore}/5.0</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Health</CardTitle>
                  <CardDescription>Overall portfolio performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue Growth</span>
                      <span className="text-sm text-green-600">Excellent</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm text-green-600">Very High</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Market Position</span>
                      <span className="text-sm text-blue-600">Strong</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Data Quality</span>
                      <span className="text-sm text-green-600">High</span>
                    </div>
                    <Progress value={92} className="h-2" />
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