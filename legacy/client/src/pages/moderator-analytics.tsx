import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";

interface ModerationMetrics {
  category: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  period: string;
}

interface ContentModerationStats {
  type: string;
  total: number;
  approved: number;
  rejected: number;
  flagged: number;
  pending: number;
  avgProcessingTime: number; // in hours
}

interface UserBehaviorData {
  category: string;
  violations: number;
  warnings: number;
  suspensions: number;
  appeals: number;
  successRate: number; // percentage
}

export default function ModeratorAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [metricCategory, setMetricCategory] = useState("all");

  // Mock data - in real implementation, these would come from API calls
  const moderationMetrics: ModerationMetrics[] = [
    {
      category: "Content",
      name: "Total Content Reviewed",
      value: 1247,
      unit: "items",
      change: 15.3,
      trend: "up",
      period: "vs last week"
    },
    {
      category: "Content",
      name: "Approval Rate",
      value: 78.2,
      unit: "percent",
      change: 2.1,
      trend: "up",
      period: "vs last week"
    },
    {
      category: "Content",
      name: "Average Processing Time",
      value: 2.4,
      unit: "hours",
      change: -12.5,
      trend: "down",
      period: "vs last week"
    },
    {
      category: "Users",
      name: "Users Monitored",
      value: 3421,
      unit: "users",
      change: 8.7,
      trend: "up",
      period: "vs last week"
    },
    {
      category: "Users",
      name: "Warnings Issued",
      value: 89,
      unit: "warnings",
      change: -18.3,
      trend: "down",
      period: "vs last week"
    },
    {
      category: "Users",
      name: "Account Suspensions",
      value: 12,
      unit: "suspensions",
      change: -25.0,
      trend: "down",
      period: "vs last week"
    },
    {
      category: "Support",
      name: "Support Tickets Resolved",
      value: 156,
      unit: "tickets",
      change: 22.1,
      trend: "up",
      period: "vs last week"
    },
    {
      category: "Support",
      name: "Average Response Time",
      value: 1.8,
      unit: "hours",
      change: -15.4,
      trend: "down",
      period: "vs last week"
    },
    {
      category: "Support",
      name: "User Satisfaction",
      value: 4.3,
      unit: "rating",
      change: 6.2,
      trend: "up",
      period: "vs last week"
    },
    {
      category: "Quality",
      name: "False Positive Rate",
      value: 3.2,
      unit: "percent",
      change: -8.7,
      trend: "down",
      period: "vs last week"
    },
    {
      category: "Quality",
      name: "Appeal Success Rate",
      value: 23.5,
      unit: "percent",
      change: 4.1,
      trend: "up",
      period: "vs last week"
    },
    {
      category: "Quality",
      name: "Community Reports",
      value: 234,
      unit: "reports",
      change: -12.3,
      trend: "down",
      period: "vs last week"
    }
  ];

  const contentStats: ContentModerationStats[] = [
    { type: "AI Model Reviews", total: 145, approved: 98, rejected: 32, flagged: 15, pending: 0, avgProcessingTime: 3.2 },
    { type: "User Comments", total: 567, approved: 489, rejected: 45, flagged: 33, pending: 0, avgProcessingTime: 1.1 },
    { type: "Developer Profiles", total: 89, approved: 72, rejected: 12, flagged: 5, pending: 0, avgProcessingTime: 4.8 },
    { type: "Model Descriptions", total: 234, approved: 198, rejected: 28, flagged: 8, pending: 0, avgProcessingTime: 2.7 },
    { type: "Community Posts", total: 312, approved: 278, rejected: 19, flagged: 15, pending: 0, avgProcessingTime: 0.9 }
  ];

  const userBehaviorData: UserBehaviorData[] = [
    { category: "Content Violations", violations: 67, warnings: 45, suspensions: 8, appeals: 12, successRate: 25.0 },
    { category: "Trading Abuse", violations: 23, warnings: 18, suspensions: 5, appeals: 3, successRate: 33.3 },
    { category: "Social Misconduct", violations: 89, warnings: 67, suspensions: 15, appeals: 18, successRate: 27.8 },
    { category: "Security Issues", violations: 12, warnings: 8, suspensions: 4, appeals: 2, successRate: 50.0 },
    { category: "Policy Violations", violations: 34, warnings: 29, suspensions: 3, appeals: 8, successRate: 37.5 }
  ];

  const filteredMetrics = metricCategory === "all" 
    ? moderationMetrics 
    : moderationMetrics.filter(metric => metric.category.toLowerCase() === metricCategory.toLowerCase());

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
    if (unit === "percent") {
      return `${value.toFixed(1)}%`;
    }
    if (unit === "hours") {
      return `${value.toFixed(1)}h`;
    }
    if (unit === "rating") {
      return `${value.toFixed(1)}/5`;
    }
    return value.toLocaleString();
  };

  const getApprovalRate = (stats: ContentModerationStats) => {
    return ((stats.approved / stats.total) * 100).toFixed(1);
  };

  const getRejectionRate = (stats: ContentModerationStats) => {
    return ((stats.rejected / stats.total) * 100).toFixed(1);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Moderator Analytics</h1>
              <p className="text-muted-foreground mt-2">Comprehensive moderation performance metrics and insights</p>
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
              </SelectContent>
            </Select>

            <Select value={metricCategory} onValueChange={setMetricCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
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

          {/* Content Moderation Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Content Moderation Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Content Type</th>
                      <th className="text-left p-3 font-medium">Total</th>
                      <th className="text-left p-3 font-medium">Approved</th>
                      <th className="text-left p-3 font-medium">Rejected</th>
                      <th className="text-left p-3 font-medium">Flagged</th>
                      <th className="text-left p-3 font-medium">Approval Rate</th>
                      <th className="text-left p-3 font-medium">Avg Processing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentStats.map((stats, index) => (
                      <tr key={index} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">{stats.type}</td>
                        <td className="p-3">{stats.total}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{stats.approved}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span>{stats.rejected}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <Flag className="h-4 w-4 text-orange-600" />
                            <span>{stats.flagged}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge 
                            className={`${parseFloat(getApprovalRate(stats)) > 80 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : parseFloat(getApprovalRate(stats)) > 60 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {getApprovalRate(stats)}%
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{stats.avgProcessingTime.toFixed(1)}h</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* User Behavior Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Behavior Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userBehaviorData.map((data, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{data.category}</h4>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {data.successRate.toFixed(1)}% appeal success
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600">{data.violations}</div>
                          <div className="text-xs text-muted-foreground">Violations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-yellow-600">{data.warnings}</div>
                          <div className="text-xs text-muted-foreground">Warnings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-orange-600">{data.suspensions}</div>
                          <div className="text-xs text-muted-foreground">Suspensions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">{data.appeals}</div>
                          <div className="text-xs text-muted-foreground">Appeals</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Moderation Efficiency</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Content Processing Speed</span>
                      <span className="text-sm font-semibold">95%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Items processed within SLA</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Accuracy Rate</span>
                      <span className="text-sm font-semibold">91%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Decisions upheld on appeal</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">User Satisfaction</span>
                      <span className="text-sm font-semibold">87%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Positive feedback from users</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm font-semibold">82%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Within target response time</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Overall Performance Score</h4>
                      <p className="text-sm text-muted-foreground">Based on all metrics</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">A+</div>
                      <div className="text-sm text-muted-foreground">Excellent</div>
                    </div>
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