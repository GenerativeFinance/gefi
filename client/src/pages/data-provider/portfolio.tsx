import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Database,
  Activity,
  Star,
  Shield,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Calendar,
  Eye,
  Download,
  RefreshCw,
  Target,
  Zap
} from "lucide-react";

export default function DataProviderPortfolio() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  // Sample portfolio data
  const portfolioOverview = {
    totalValue: "$245,670",
    monthlyChange: "+12.5%",
    yearlyChange: "+45.2%",
    activeDatasets: 12,
    totalSubscriptions: 1847,
    averageRating: 4.7,
    complianceScore: 94
  };

  const assetAllocation = [
    { category: "Market Data", value: "$89,450", percentage: 36.4, growth: "+15%" },
    { category: "Cryptocurrency", value: "$67,320", percentage: 27.4, growth: "+23%" },
    { category: "Economic Data", value: "$45,890", percentage: 18.7, growth: "+8%" },
    { category: "ESG Data", value: "$32,100", percentage: 13.1, growth: "+12%" },
    { category: "Alternative Data", value: "$10,910", percentage: 4.4, growth: "+5%" }
  ];

  const contributionHistory = [
    {
      dataset: "S&P 500 Historical Data",
      type: "Dataset",
      date: "2024-01-15",
      value: "$23,450",
      performance: "+18%",
      status: "Active",
      subscribers: 145
    },
    {
      dataset: "Crypto Order Book Data",
      type: "Real-time Feed",
      date: "2024-01-10",
      value: "$45,890",
      performance: "+32%",
      status: "Active",
      subscribers: 89
    },
    {
      dataset: "ESG Corporate Ratings",
      type: "Dataset",
      date: "2024-01-05",
      value: "$32,100",
      performance: "+12%",
      status: "Under Review",
      subscribers: 67
    },
    {
      dataset: "Economic Indicators",
      type: "Dataset",
      date: "2023-12-28",
      value: "$18,670",
      performance: "+8%",
      status: "Active",
      subscribers: 234
    }
  ];

  const performanceMetrics = [
    { metric: "Total Revenue", value: "$245,670", change: "+12.5%", trend: "up" },
    { metric: "Active Subscribers", value: "1,847", change: "+18%", trend: "up" },
    { metric: "Avg Revenue per Dataset", value: "$20,472", change: "+8%", trend: "up" },
    { metric: "Customer Retention", value: "89%", change: "+3%", trend: "up" },
    { metric: "Data Quality Score", value: "94%", change: "+2%", trend: "up" },
    { metric: "Compliance Rating", value: "A+", change: "Stable", trend: "stable" }
  ];

  const riskAssessment = [
    { risk: "Data Quality", level: "Low", score: 85, description: "Consistent high-quality data delivery" },
    { risk: "Compliance", level: "Very Low", score: 95, description: "Full regulatory compliance maintained" },
    { risk: "Market Competition", level: "Medium", score: 65, description: "Increasing competition in core markets" },
    { risk: "Technology", level: "Low", score: 80, description: "Modern infrastructure with backup systems" },
    { risk: "Customer Concentration", level: "Medium", score: 70, description: "Top 5 customers represent 40% of revenue" }
  ];

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "very low": return "text-green-600 bg-green-100";
      case "low": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-red-600 bg-red-100";
      case "very high": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "under review": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-blue-100 text-blue-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Portfolio Management</h1>
            <p className="text-muted-foreground">
              Track your contributed datasets, financial assets, and marketplace involvement
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                  <p className="text-2xl font-bold">{portfolioOverview.totalValue}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {portfolioOverview.monthlyChange} this month
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Datasets</p>
                  <p className="text-2xl font-bold">{portfolioOverview.activeDatasets}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +2 this month
                  </p>
                </div>
                <Database className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Subscriptions</p>
                  <p className="text-2xl font-bold">{portfolioOverview.totalSubscriptions.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +18% growth
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{portfolioOverview.averageRating}/5</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +0.2 this month
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Value Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Portfolio value chart</p>
                      <p className="text-sm text-muted-foreground">12-month growth: {portfolioOverview.yearlyChange}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Data Quality Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={94} className="w-20" />
                      <span className="text-sm font-semibold">94%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Compliance Rating</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      A+ Rating
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Market Position</span>
                    <span className="text-sm font-semibold">Top 5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-semibold">{portfolioOverview.averageRating}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assetAllocation.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: `hsl(${index * 72}, 70%, 50%)` }} />
                        <div>
                          <p className="font-semibold">{asset.category}</p>
                          <p className="text-sm text-muted-foreground">{asset.percentage}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{asset.value}</p>
                        <p className="text-sm text-green-600">{asset.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">{metric.metric}</p>
                        {metric.trend === "up" && (
                          <Badge className="bg-green-100 text-green-800">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {metric.change}
                          </Badge>
                        )}
                        {metric.trend === "down" && (
                          <Badge className="bg-red-100 text-red-800">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            {metric.change}
                          </Badge>
                        )}
                        {metric.trend === "stable" && (
                          <Badge variant="outline">{metric.change}</Badge>
                        )}
                      </div>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contributions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contribution History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contributionHistory.map((contribution, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <Database className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">{contribution.dataset}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{contribution.type}</span>
                            <span>•</span>
                            <span>{contribution.date}</span>
                            <span>•</span>
                            <span>{contribution.subscribers} subscribers</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{contribution.value}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(contribution.status)}>
                            {contribution.status}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {contribution.performance}
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
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAssessment.map((risk, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{risk.risk}</h3>
                          <Badge className={getRiskColor(risk.level)}>
                            {risk.level}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Progress value={risk.score} className="w-20" />
                            <span className="text-sm font-semibold">{risk.score}/100</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
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