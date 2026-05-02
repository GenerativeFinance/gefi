import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Users,
  DollarSign,
  Star,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function DataProviderMarketInsights() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample market insights data
  const marketTrends = [
    {
      category: "Market Data",
      growth: "+23%",
      trend: "up",
      subscribers: 2450,
      revenue: "$45,670",
      demand: "High",
      forecast: "Strong growth expected",
      topRegions: ["North America", "Europe", "Asia-Pacific"]
    },
    {
      category: "Cryptocurrency",
      growth: "+45%",
      trend: "up",
      subscribers: 1890,
      revenue: "$67,320",
      demand: "Very High",
      forecast: "Explosive growth anticipated",
      topRegions: ["Global", "North America", "Europe"]
    },
    {
      category: "ESG Data",
      growth: "+18%",
      trend: "up",
      subscribers: 1230,
      revenue: "$28,950",
      demand: "Medium",
      forecast: "Steady growth projected",
      topRegions: ["Europe", "North America", "Asia-Pacific"]
    },
    {
      category: "Economic Data",
      growth: "-5%",
      trend: "down",
      subscribers: 980,
      revenue: "$19,450",
      demand: "Low",
      forecast: "Stabilization expected",
      topRegions: ["North America", "Europe", "Latin America"]
    }
  ];

  const competitorAnalysis = [
    {
      name: "FinanceData Corp",
      marketShare: "24%",
      strengths: ["Comprehensive coverage", "Real-time data"],
      weaknesses: ["High pricing", "Complex API"],
      rating: 4.2
    },
    {
      name: "DataStream Solutions",
      marketShare: "18%",
      strengths: ["User-friendly interface", "Good support"],
      weaknesses: ["Limited historical data", "Slower updates"],
      rating: 3.8
    },
    {
      name: "MarketVault",
      marketShare: "15%",
      strengths: ["Competitive pricing", "Fast delivery"],
      weaknesses: ["Quality inconsistency", "Limited compliance"],
      rating: 3.5
    }
  ];

  const insights = [
    {
      type: "opportunity",
      title: "Emerging Demand for DeFi Data",
      description: "Growing interest in decentralized finance datasets with 85% month-over-month increase in search queries.",
      impact: "High",
      urgency: "Medium",
      recommendation: "Consider expanding DeFi data coverage"
    },
    {
      type: "trend",
      title: "ESG Integration Requirements",
      description: "New regulatory requirements driving 40% increase in ESG data subscriptions across financial institutions.",
      impact: "Medium",
      urgency: "High",
      recommendation: "Enhance ESG compliance certifications"
    },
    {
      type: "risk",
      title: "Data Privacy Regulation Changes",
      description: "Upcoming GDPR updates may impact data sharing practices, requiring enhanced privacy controls.",
      impact: "High",
      urgency: "High",
      recommendation: "Implement advanced privacy features"
    }
  ];

  const performanceMetrics = [
    { metric: "Dataset Adoption Rate", value: "78%", change: "+12%", trend: "up" },
    { metric: "Customer Satisfaction", value: "4.6/5", change: "+0.3", trend: "up" },
    { metric: "Data Quality Score", value: "94%", change: "+2%", trend: "up" },
    { metric: "Market Penetration", value: "32%", change: "+8%", trend: "up" },
    { metric: "Revenue per Customer", value: "$245", change: "-3%", trend: "down" },
    { metric: "Churn Rate", value: "8%", change: "-2%", trend: "up" }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity": return <Target className="h-5 w-5 text-green-500" />;
      case "trend": return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "risk": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getInsightBadgeColor = (type: string) => {
    switch (type) {
      case "opportunity": return "bg-green-100 text-green-800";
      case "trend": return "bg-blue-100 text-blue-800";
      case "risk": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financial Tracking Tools</h1>
            <p className="text-muted-foreground">
              Monitor revenue from dataset usage, model subscriptions, and licensing agreements with full transparency
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
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
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            {/* Trend Analysis Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Market Predictions</p>
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        Accuracy rate
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Trend Insights</p>
                      <p className="text-2xl font-bold">145</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        Generated this month
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Investor Justifications</p>
                      <p className="text-2xl font-bold">23</p>
                      <p className="text-sm text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        Funding reports shared
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Market Relevance</p>
                      <p className="text-2xl font-bold">94%</p>
                      <p className="text-sm text-blue-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Regulatory compliance
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Trend Analysis Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Market Data Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Time Series Analysis</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Seasonal Pattern Detection</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Volatility Forecasting</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <Button size="sm" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Run Market Analysis
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Predictive Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Price Movement Prediction</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Correlation Analysis</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Risk Factor Identification</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <Button size="sm" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Predictions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Actionable Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Investment Recommendations</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Regulatory Compliance Reports</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Market Opportunity Alerts</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <Button size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Insights Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Tracking Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Usage Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Real-time Usage Tracking</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">API Call Monitoring</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Revenue Attribution</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <Button size="sm" className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    View Usage Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Revenue Transparency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Detailed Revenue Reports</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Payment Tracking</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Investor Visibility</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <Button size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Revenue Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Financial Accountability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Audit-ready Reports</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Trust Metrics</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Compliance Tracking</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <Button size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Category Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Category Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-semibold">{trend.category}</p>
                          <Badge className={trend.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {trend.trend === "up" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {trend.growth}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-sm">
                          <div>
                            <p className="text-muted-foreground">Subscribers</p>
                            <p className="font-semibold">{trend.subscribers.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-semibold">{trend.revenue}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Demand</p>
                            <Badge variant={trend.demand === "High" || trend.demand === "Very High" ? "default" : "secondary"}>
                              {trend.demand}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{trend.forecast}</p>
                        <p className="text-xs text-muted-foreground">
                          Top: {trend.topRegions.slice(0, 2).join(", ")}
                        </p>
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
                        <Badge className={metric.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {metric.trend === "up" ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {metric.change}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {competitorAnalysis.map((competitor, index) => (
                    <div key={index} className="p-6 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{competitor.name}</h3>
                          <p className="text-muted-foreground">Market Share: {competitor.marketShare}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold">{competitor.rating}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Customer Rating</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-2">Strengths</p>
                          <ul className="text-sm space-y-1">
                            {competitor.strengths.map((strength, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-600 mb-2">Weaknesses</p>
                          <ul className="text-sm space-y-1">
                            {competitor.weaknesses.map((weakness, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="p-6 border rounded-lg">
                      <div className="flex items-start gap-4">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{insight.title}</h3>
                            <Badge className={getInsightBadgeColor(insight.type)}>
                              {insight.type}
                            </Badge>
                            <Badge variant="outline">
                              Impact: {insight.impact}
                            </Badge>
                            <Badge variant="outline">
                              Urgency: {insight.urgency}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600">
                              Recommendation: {insight.recommendation}
                            </p>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Forecast & Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-semibold">Revenue Forecast</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Next Quarter</span>
                        <span className="font-semibold text-green-600">+18% growth</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next 6 Months</span>
                        <span className="font-semibold text-green-600">+35% growth</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Year</span>
                        <span className="font-semibold text-green-600">+67% growth</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-semibold">Market Opportunities</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>DeFi Data</span>
                        <span className="font-semibold text-blue-600">High potential</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ESG Metrics</span>
                        <span className="font-semibold text-blue-600">Growing demand</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Real-time Analytics</span>
                        <span className="font-semibold text-blue-600">Premium tier</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}