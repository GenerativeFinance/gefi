import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Star,
  FileText,
  Target,
  Zap,
  RefreshCw
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function QualityMetrics() {
  const [timeRange, setTimeRange] = useState("30d");

  // Sample quality metrics data
  const qualityOverview = {
    overallScore: 87,
    avgAccuracy: 92.3,
    avgCompleteness: 89.7,
    avgTimeliness: 91.2,
    totalFeedback: 156,
    positiveRating: 94.2
  };

  const datasetQuality = [
    {
      id: 1,
      name: "S&P 500 Historical Data",
      accuracyScore: 87,
      completeness: 95,
      timeliness: 88,
      lastUpdate: "2025-07-15",
      updateFrequency: "Daily",
      feedbackCount: 34,
      avgRating: 4.5,
      issues: 2,
      status: "Good"
    },
    {
      id: 2,
      name: "Federal Reserve Economic Data",
      accuracyScore: 94,
      completeness: 92,
      timeliness: 96,
      lastUpdate: "2025-07-14",
      updateFrequency: "Weekly",
      feedbackCount: 28,
      avgRating: 4.7,
      issues: 0,
      status: "Excellent"
    },
    {
      id: 3,
      name: "Cryptocurrency Trading Pairs",
      accuracyScore: 96,
      completeness: 89,
      timeliness: 98,
      lastUpdate: "2025-07-15",
      updateFrequency: "Real-time",
      feedbackCount: 67,
      avgRating: 4.8,
      issues: 1,
      status: "Excellent"
    },
    {
      id: 4,
      name: "Corporate Bond Yields",
      accuracyScore: 78,
      completeness: 83,
      timeliness: 75,
      lastUpdate: "2025-07-10",
      updateFrequency: "Weekly",
      feedbackCount: 8,
      avgRating: 4.1,
      issues: 5,
      status: "Needs Improvement"
    },
    {
      id: 5,
      name: "Legacy Market Data 2010-2015",
      accuracyScore: 85,
      completeness: 78,
      timeliness: 65,
      lastUpdate: "2025-01-15",
      updateFrequency: "Static",
      feedbackCount: 19,
      avgRating: 4.0,
      issues: 3,
      status: "Fair"
    }
  ];

  const qualityTrends = [
    {
      metric: "Accuracy Score",
      current: 92.3,
      previous: 89.1,
      change: "+3.2",
      trend: "up"
    },
    {
      metric: "Completeness",
      current: 89.7,
      previous: 91.2,
      change: "-1.5",
      trend: "down"
    },
    {
      metric: "Timeliness",
      current: 91.2,
      previous: 88.7,
      change: "+2.5",
      trend: "up"
    },
    {
      metric: "User Satisfaction",
      current: 94.2,
      previous: 93.8,
      change: "+0.4",
      trend: "up"
    }
  ];

  const feedbackSummary = [
    {
      dataset: "Cryptocurrency Trading Pairs",
      feedback: "Excellent real-time accuracy, minimal latency issues",
      rating: 4.8,
      user: "Alex Chen",
      date: "2025-07-14",
      category: "Accuracy"
    },
    {
      dataset: "Federal Reserve Economic Data",
      feedback: "Very reliable data source, consistent updates",
      rating: 4.7,
      user: "Sarah Johnson",
      date: "2025-07-13",
      category: "Timeliness"
    },
    {
      dataset: "S&P 500 Historical Data",
      feedback: "Good coverage but missing some recent dividend data",
      rating: 4.2,
      user: "Mike Rodriguez",
      date: "2025-07-12",
      category: "Completeness"
    },
    {
      dataset: "Corporate Bond Yields",
      feedback: "Data quality inconsistent, some fields incomplete",
      rating: 3.8,
      user: "Emma Watson",
      date: "2025-07-10",
      category: "Quality"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Good": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Fair": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Needs Improvement": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getUpdateFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case "Real-time": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Daily": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Weekly": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Static": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quality Metrics</h1>
            <p className="text-muted-foreground">Monitor data quality through accuracy scores, completeness ratings, and developer feedback.</p>
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
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quality Report
            </Button>
          </div>
        </div>

        {/* Quality Overview */}
        <div className="grid gap-6 md:grid-cols-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(qualityOverview.overallScore)}`}>
                {qualityOverview.overallScore}%
              </div>
              <p className="text-xs text-muted-foreground">Quality rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(qualityOverview.avgAccuracy)}`}>
                {qualityOverview.avgAccuracy}%
              </div>
              <p className="text-xs text-muted-foreground">Data reliability</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completeness</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(qualityOverview.avgCompleteness)}`}>
                {qualityOverview.avgCompleteness}%
              </div>
              <p className="text-xs text-muted-foreground">Field coverage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Timeliness</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(qualityOverview.avgTimeliness)}`}>
                {qualityOverview.avgTimeliness}%
              </div>
              <p className="text-xs text-muted-foreground">Update frequency</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{qualityOverview.totalFeedback}</div>
              <p className="text-xs text-muted-foreground">Developer reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{qualityOverview.positiveRating}%</div>
              <p className="text-xs text-muted-foreground">Positive ratings</p>
            </CardContent>
          </Card>
        </div>

        {/* Quality Trends */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quality Trends</CardTitle>
            <CardDescription>Track changes in quality metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {qualityTrends.map((trend, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">{trend.metric}</h3>
                    {getTrendIcon(trend.trend)}
                  </div>
                  <div className="text-2xl font-bold mb-1">{trend.current}%</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Previous: {trend.previous}%</span>
                    <Badge variant="outline" className={trend.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {trend.change}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Quality Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dataset Quality Analysis</CardTitle>
            <CardDescription>Detailed quality assessment for each dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset Name</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Completeness</TableHead>
                  <TableHead>Timeliness</TableHead>
                  <TableHead>Update Frequency</TableHead>
                  <TableHead>User Rating</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasetQuality.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>
                      <div className="font-medium">{dataset.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Last update: {new Date(dataset.lastUpdate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={dataset.accuracyScore} className="h-2 w-16" />
                        <span className={`font-medium ${getScoreColor(dataset.accuracyScore)}`}>
                          {dataset.accuracyScore}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={dataset.completeness} className="h-2 w-16" />
                        <span className={`font-medium ${getScoreColor(dataset.completeness)}`}>
                          {dataset.completeness}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={dataset.timeliness} className="h-2 w-16" />
                        <span className={`font-medium ${getScoreColor(dataset.timeliness)}`}>
                          {dataset.timeliness}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getUpdateFrequencyBadge(dataset.updateFrequency)}>
                        {dataset.updateFrequency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{dataset.avgRating}</span>
                        <span className="text-muted-foreground">({dataset.feedbackCount})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {dataset.issues > 0 ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span>{dataset.issues}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(dataset.status)}>
                        {dataset.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Developer Feedback</CardTitle>
            <CardDescription>Latest quality feedback and ratings from developers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackSummary.map((feedback, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{feedback.dataset}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>by {feedback.user}</span>
                        <span>•</span>
                        <span>{new Date(feedback.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{feedback.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{feedback.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">{feedback.feedback}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">View All Feedback</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}