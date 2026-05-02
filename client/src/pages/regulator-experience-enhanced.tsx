import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { 
  Shield, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Clock,
  Target,
  Users,
  FileText,
  Eye,
  Download,
  Search,
  Filter,
  Settings,
  Zap,
  Database,
  Brain,
  Lightbulb
} from "lucide-react";

export default function RegulatorExperienceEnhanced() {
  const [selectedView, setSelectedView] = useState("overview");

  // Enhanced regulator dashboard metrics matching the analysis
  const enhancedMetrics = {
    totalAudits: 142,
    auditGrowth: 12, // +12% from last period
    pendingAudits: 18,
    dueSoon: 3, // 3 due this week
    complianceRate: 87.3,
    complianceImprovement: 2.1, // +2.1% improvement
    flaggedIssues: 23,
    criticalIssues: 3,
    resolvedIssues: 156,
    resolutionRate: 87, // 87% resolution rate
    activeStandards: 15,
    pendingUpdates: 2,
    auditCompletionRate: 94.2,
    avgResolutionTime: 4.8, // days
    resolutionImprovement: -1.2 // -1.2 days improvement
  };

  const complianceTrend = [
    { month: "Jul", rate: 82.1 },
    { month: "Aug", rate: 84.5 },
    { month: "Sep", rate: 86.2 },
    { month: "Oct", rate: 87.8 },
    { month: "Nov", rate: 86.9 },
    { month: "Dec", rate: 87.3 }
  ];

  const auditDistribution = [
    { type: "Privacy Compliance", count: 45, color: "bg-blue-500" },
    { type: "Model Validation", count: 38, color: "bg-green-500" },
    { type: "Data Quality", count: 29, color: "bg-yellow-500" },
    { type: "Security Assessment", count: 20, color: "bg-red-500" },
    { type: "Bias Testing", count: 10, color: "bg-purple-500" }
  ];

  const issueDistribution = [
    { category: "Privacy", count: 8, percentage: 35 },
    { category: "Security", count: 6, percentage: 26 },
    { category: "Bias", count: 4, percentage: 17 },
    { category: "Data Quality", count: 3, percentage: 13 },
    { category: "Other", count: 2, percentage: 9 }
  ];

  const aiInsights = [
    {
      type: "improvement",
      title: "Compliance Improvement Detected",
      description: "Overall compliance rate has improved by 2.1% this month, primarily driven by better data retention policy adherence across AI Trading Solutions models.",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200"
    },
    {
      type: "attention",
      title: "Attention Required", 
      description: "3 critical issues remain unresolved beyond the 7-day SLA. Consider escalating to senior management for Dataset #DS-8834 and Model #ML-3456.",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200"
    },
    {
      type: "best-practice",
      title: "Best Practice Identified",
      description: "RegTech Compliance Ltd demonstrates excellent audit preparation, with 98% documentation completeness. Consider sharing their practices as a model.",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200"
    },
    {
      type: "trend",
      title: "Trend Analysis",
      description: "Privacy compliance audits are increasing 15% month-over-month. Consider allocating additional resources to handle the growing workload.",
      icon: BarChart3,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "audit_completed",
      title: "GDPR Compliance Audit Completed",
      details: "AI Trading Model #MT-4521 passed compliance review",
      timestamp: "2 hours ago",
      priority: "medium",
      entity: "AI Trading Solutions"
    },
    {
      id: 2,
      type: "issue_flagged",
      title: "Data Retention Policy Violation",
      details: "Dataset #DS-8834 exceeds retention period limits",
      timestamp: "4 hours ago",
      priority: "high",
      entity: "FinTech Analytics Corp"
    },
    {
      id: 3,
      type: "audit_started",
      title: "Model Bias Assessment Initiated",
      details: "Credit Scoring Model #CS-9912 under review",
      timestamp: "1 day ago",
      priority: "medium",
      entity: "CreditTech Systems"
    },
    {
      id: 4,
      type: "communication_sent",
      title: "Compliance Reminder Sent",
      details: "Quarterly compliance update distributed to all partners",
      timestamp: "1 day ago",
      priority: "low",
      entity: "All Partners"
    },
    {
      id: 5,
      type: "issue_resolved",
      title: "Security Vulnerability Fixed",
      details: "API endpoint security issue resolved in Model #ML-3456",
      timestamp: "2 days ago",
      priority: "high",
      entity: "RegTech Compliance Ltd"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Enhanced Regulator Experience</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Comprehensive compliance monitoring and AI model governance with improved clarity, accessibility, and functionality
            </p>
            
            {/* Success Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Fixed "Regulator Not Found" Errors
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      AI-Powered Insights Added
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      Enhanced User Experience
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Enhanced Overview</TabsTrigger>
              <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="improvements">Key Improvements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Centralized Dashboard Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Audits (30d)</p>
                        <p className="text-2xl font-bold">{enhancedMetrics.totalAudits}</p>
                        <p className="text-xs text-green-600">+{enhancedMetrics.auditGrowth}% from last period</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                        <p className="text-2xl font-bold text-green-600">{enhancedMetrics.complianceRate}%</p>
                        <p className="text-xs text-green-600">+{enhancedMetrics.complianceImprovement}% improvement</p>
                      </div>
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                        <p className="text-2xl font-bold text-red-600">{enhancedMetrics.criticalIssues}</p>
                        <p className="text-xs text-yellow-600">Requires attention</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Audit Completion Rate</p>
                        <p className="text-2xl font-bold">{enhancedMetrics.auditCompletionRate}%</p>
                        <p className="text-xs text-green-600">On target</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Resolution Time</p>
                        <p className="text-2xl font-bold">{enhancedMetrics.avgResolutionTime} days</p>
                        <p className="text-xs text-green-600">{enhancedMetrics.resolutionImprovement} days improvement</p>
                      </div>
                      <Clock className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                        <p className="text-2xl font-bold text-green-600">{enhancedMetrics.resolutionRate}%</p>
                        <p className="text-xs text-muted-foreground">{enhancedMetrics.resolvedIssues} resolved</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Activity Feed
                  </CardTitle>
                  <CardDescription>Latest regulatory activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">{activity.title}</h3>
                            <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{activity.details}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{activity.entity}</Badge>
                            <Badge variant={activity.priority === "high" ? "destructive" : 
                                           activity.priority === "medium" ? "default" : "secondary"}>
                              {activity.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Compliance Rate Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Rate Trend</CardTitle>
                    <CardDescription>6-month compliance performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {complianceTrend.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.month}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={item.rate} className="w-32 h-2" />
                            <span className="text-sm font-bold w-12">{item.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Audit Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Distribution by Type</CardTitle>
                    <CardDescription>Breakdown of audit categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditDistribution.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{item.type}</span>
                            <span className="text-sm text-muted-foreground">{item.count} audits</span>
                          </div>
                          <Progress value={(item.count / 142) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Issue Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Issue Distribution</CardTitle>
                    <CardDescription>Breakdown of flagged issues by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {issueDistribution.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{item.category}</span>
                            <span className="text-sm text-muted-foreground">
                              {item.count} ({item.percentage}%)
                            </span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Audit Completion Rate</span>
                        <span className="font-bold text-green-600">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Resolution Time</span>
                        <span className="font-bold">4.8 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Issue Resolution Rate</span>
                        <span className="font-bold text-green-600">87.1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Critical Issues Open</span>
                        <span className="font-bold text-red-600">3</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    AI-Powered Regulatory Insights
                  </CardTitle>
                  <CardDescription>
                    Predictive analytics and proactive recommendations for compliance management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {aiInsights.map((insight, index) => {
                      const IconComponent = insight.icon;
                      return (
                        <div key={index} className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full bg-background flex items-center justify-center ${insight.color}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{insight.title}</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {insight.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="improvements">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                      Issues Fixed
                    </CardTitle>
                    <CardDescription>Problems resolved in the enhanced experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Eliminated "Regulator Not Found" Errors</h4>
                          <p className="text-sm text-muted-foreground">
                            Fixed broken navigation links and missing data across multiple regulator pages
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Cleaned Up Cluttered Metrics</h4>
                          <p className="text-sm text-muted-foreground">
                            Removed repetitive data and unclear labels, replaced with precise, labeled metrics
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Enhanced Data Integrity</h4>
                          <p className="text-sm text-muted-foreground">
                            Implemented automated validation and synchronization for accurate metrics
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-blue-600" />
                      New Features Added
                    </CardTitle>
                    <CardDescription>Enhancements for improved regulatory oversight</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">AI-Driven Predictive Insights</h4>
                          <p className="text-sm text-muted-foreground">
                            Proactive compliance risk identification and trend analysis
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Interactive Dashboard Visualizations</h4>
                          <p className="text-sm text-muted-foreground">
                            Clear charts for compliance trends, audit distribution, and issue tracking
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Comprehensive Audit Trails</h4>
                          <p className="text-sm text-muted-foreground">
                            Detailed, searchable logs with drill-down capabilities for accountability
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Enhanced Risk Assessment</h4>
                          <p className="text-sm text-muted-foreground">
                            Real-time incident reporting with detailed resolution tracking
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-purple-600" />
                      User Experience Improvements
                    </CardTitle>
                    <CardDescription>Enhanced interface and usability features</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Interface Enhancements</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Intuitive navigation with clear visual hierarchy</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Advanced search and filtering capabilities</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Customizable time period selection</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium">Accessibility Features</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Download className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Export functionality for all reports</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Configurable alerts and notifications</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Database className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Real-time data synchronization</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}