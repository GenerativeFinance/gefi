import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Shield,
  Clock,
  Database,
  Target,
  Zap
} from "lucide-react";

export default function DataProviderQuality() {
  const [selectedDataset, setSelectedDataset] = useState("all");

  // Sample quality metrics data
  const qualityOverview = {
    overallScore: 87,
    accuracy: 94,
    completeness: 89,
    timeliness: 82,
    consistency: 91,
    validity: 85
  };

  const datasetQuality = [
    {
      id: 1,
      name: "Financial Market Data Q3 2025",
      accuracy: 96,
      completeness: 94,
      timeliness: 88,
      consistency: 92,
      validity: 89,
      overallScore: 92,
      status: "excellent",
      lastUpdated: "2 hours ago",
      issues: 2,
      feedbackScore: 4.8
    },
    {
      id: 2,
      name: "Real Estate Pricing Analytics",
      accuracy: 91,
      completeness: 87,
      timeliness: 85,
      consistency: 89,
      validity: 84,
      overallScore: 87,
      status: "good",
      lastUpdated: "6 hours ago",
      issues: 5,
      feedbackScore: 4.5
    },
    {
      id: 3,
      name: "Cryptocurrency Trading Signals",
      accuracy: 88,
      completeness: 82,
      timeliness: 75,
      consistency: 86,
      validity: 79,
      overallScore: 82,
      status: "fair",
      lastUpdated: "12 hours ago",
      issues: 8,
      feedbackScore: 4.2
    },
    {
      id: 4,
      name: "ESG Investment Data",
      accuracy: 93,
      completeness: 91,
      timeliness: 89,
      consistency: 94,
      validity: 87,
      overallScore: 91,
      status: "excellent",
      lastUpdated: "4 hours ago",
      issues: 3,
      feedbackScore: 4.7
    }
  ];

  const qualityIssues = [
    {
      dataset: "Cryptocurrency Trading Signals",
      issue: "Missing data points in trading volume",
      severity: "medium",
      impact: "Reduced accuracy for volume-based predictions",
      status: "in_progress",
      reportedDate: "2025-07-12"
    },
    {
      dataset: "Real Estate Pricing Analytics",
      issue: "Outdated property listings in downtown area",
      severity: "low",
      impact: "Minor impact on regional pricing trends",
      status: "resolved",
      reportedDate: "2025-07-10"
    },
    {
      dataset: "Financial Market Data Q3 2025",
      issue: "Inconsistent timestamp formatting",
      severity: "high",
      impact: "Could affect time-series analysis",
      status: "open",
      reportedDate: "2025-07-14"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50 border-green-200";
      case "good": return "text-blue-600 bg-blue-50 border-blue-200";
      case "fair": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "poor": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quality Metrics</h1>
            <p className="text-muted-foreground">Monitor data quality, accuracy, and completeness</p>
          </div>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            Run Quality Check
          </Button>
        </div>

        {/* Quality Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-blue-600">{qualityOverview.overallScore}%</CardTitle>
              <CardDescription>Overall Quality Score</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={qualityOverview.overallScore} className="w-full" />
              <div className="flex items-center justify-center mt-2">
                <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3% from last month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Accuracy</span>
                <div className="flex items-center gap-2">
                  <Progress value={qualityOverview.accuracy} className="w-16" />
                  <span className="text-sm font-medium">{qualityOverview.accuracy}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completeness</span>
                <div className="flex items-center gap-2">
                  <Progress value={qualityOverview.completeness} className="w-16" />
                  <span className="text-sm font-medium">{qualityOverview.completeness}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Timeliness</span>
                <div className="flex items-center gap-2">
                  <Progress value={qualityOverview.timeliness} className="w-16" />
                  <span className="text-sm font-medium">{qualityOverview.timeliness}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Excellent</span>
                </div>
                <Badge variant="secondary">2 datasets</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Good</span>
                </div>
                <Badge variant="secondary">1 dataset</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Fair</span>
                </div>
                <Badge variant="secondary">1 dataset</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Quality Analysis */}
        <Tabs defaultValue="datasets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="datasets">Dataset Quality</TabsTrigger>
            <TabsTrigger value="issues">Quality Issues</TabsTrigger>
            <TabsTrigger value="trends">Quality Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="datasets" className="space-y-4">
            <div className="grid gap-6">
              {datasetQuality.map((dataset) => (
                <Card key={dataset.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{dataset.name}</h3>
                          <Badge className={getStatusColor(dataset.status)}>
                            {dataset.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Accuracy</p>
                            <p className="font-medium">{dataset.accuracy}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Completeness</p>
                            <p className="font-medium">{dataset.completeness}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Timeliness</p>
                            <p className="font-medium">{dataset.timeliness}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Issues</p>
                            <p className="font-medium">{dataset.issues}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">User Rating</p>
                            <p className="font-medium">{dataset.feedbackScore}/5.0</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{dataset.overallScore}%</div>
                          <div className="text-xs text-muted-foreground">Quality Score</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quality Issues</CardTitle>
                <CardDescription>Track and resolve data quality issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityIssues.map((issue, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{issue.issue}</h4>
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{issue.dataset}</p>
                          <p className="text-sm">{issue.impact}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge variant={issue.status === "resolved" ? "default" : "secondary"}>
                              {issue.status.replace("_", " ")}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{issue.reportedDate}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            {issue.status === "resolved" ? "View Resolution" : "Resolve"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Trends</CardTitle>
                  <CardDescription>Quality metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Quality trend chart would be implemented here
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Areas</CardTitle>
                  <CardDescription>Focus areas for quality enhancement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Timeliness</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">82%</span>
                        <p className="text-xs text-muted-foreground">Needs improvement</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Validity</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">85%</span>
                        <p className="text-xs text-muted-foreground">Good</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Completeness</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">89%</span>
                        <p className="text-xs text-muted-foreground">Excellent</p>
                      </div>
                    </div>
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