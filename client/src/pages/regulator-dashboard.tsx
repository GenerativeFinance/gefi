import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { 
  Shield, 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Flag, 
  CheckCircle, 
  BookOpen,
  MessageSquare,
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  Settings,
  Bell,
  Plus,
  AlertTriangle,
  FileText,
  Users,
  Target,
  Activity
} from "lucide-react";

const auditSchema = z.object({
  entityType: z.string().min(1, "Entity type is required"),
  entityId: z.string().min(1, "Entity ID is required"),
  auditorName: z.string().min(1, "Auditor name is required"),
  auditType: z.string().min(1, "Audit type is required"),
  priority: z.string().min(1, "Priority is required"),
});

const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  severity: z.string().min(1, "Severity is required"),
  entityType: z.string().min(1, "Entity type is required"),
  entityId: z.string().min(1, "Entity ID is required"),
});

const communicationSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  priority: z.string().min(1, "Priority is required"),
});

export default function RegulatorDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();

  // Enhanced sample data with realistic metrics
  const dashboardData = {
    overview: {
      totalAudits: 142,
      pendingAudits: 18,
      complianceRate: 87.3,
      flaggedIssues: 23,
      resolvedIssues: 156,
      activeStandards: 15,
      auditCompletionRate: 94.2,
      averageResolutionTime: 4.8, // days
      criticalIssueCount: 3
    },
    trends: {
      complianceRateHistory: [
        { month: "Jul", rate: 82.1 },
        { month: "Aug", rate: 84.5 },
        { month: "Sep", rate: 86.2 },
        { month: "Oct", rate: 87.8 },
        { month: "Nov", rate: 86.9 },
        { month: "Dec", rate: 87.3 }
      ],
      auditsByType: [
        { type: "Privacy Compliance", count: 45 },
        { type: "Model Validation", count: 38 },
        { type: "Data Quality", count: 29 },
        { type: "Security Assessment", count: 20 },
        { type: "Bias Testing", count: 10 }
      ]
    },
    recentActivity: [
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
    ],
    upcomingAudits: [
      {
        id: 1,
        title: "Quarterly AI Model Review",
        scheduled: "2024-12-28",
        auditor: "Sarah Johnson",
        entityType: "AI Model",
        priority: "high"
      },
      {
        id: 2,
        title: "Data Privacy Assessment",
        scheduled: "2024-12-30",
        auditor: "Michael Chen",
        entityType: "Dataset",
        priority: "medium"
      },
      {
        id: 3,
        title: "Security Compliance Check",
        scheduled: "2025-01-02",
        auditor: "Emma Williams",
        entityType: "System",
        priority: "medium"
      }
    ],
    issueDistribution: [
      { category: "Privacy", count: 8, percentage: 35 },
      { category: "Security", count: 6, percentage: 26 },
      { category: "Bias", count: 4, percentage: 17 },
      { category: "Data Quality", count: 3, percentage: 13 },
      { category: "Other", count: 2, percentage: 9 }
    ]
  };

  const auditForm = useForm({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      entityType: "",
      entityId: "",
      auditorName: "",
      auditType: "",
      priority: ""
    }
  });

  const issueForm = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "",
      entityType: "",
      entityId: ""
    }
  });

  const commForm = useForm({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      recipient: "",
      subject: "",
      message: "",
      priority: ""
    }
  });

  const createAuditMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/regulator/audits', data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Audit created successfully" });
      auditForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create audit", variant: "destructive" });
    }
  });

  const createIssueMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/regulator/issues', data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Issue reported successfully" });
      issueForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to report issue", variant: "destructive" });
    }
  });

  const sendCommunicationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/regulator/communications', data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Communication sent successfully" });
      commForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send communication", variant: "destructive" });
    }
  });

  const getMetricColor = (metric: string, value: number) => {
    switch (metric) {
      case "complianceRate":
        return value >= 90 ? "text-green-600" : value >= 75 ? "text-yellow-600" : "text-red-600";
      case "auditCompletionRate":
        return value >= 95 ? "text-green-600" : value >= 85 ? "text-yellow-600" : "text-red-600";
      case "averageResolutionTime":
        return value <= 3 ? "text-green-600" : value <= 7 ? "text-yellow-600" : "text-red-600";
      default:
        return "text-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "audit_completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "issue_flagged": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "audit_started": return <FileText className="h-4 w-4 text-blue-600" />;
      case "communication_sent": return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case "issue_resolved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header with User Profile and Controls */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Regulator Overview</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Comprehensive compliance monitoring and AI model governance
            </p>
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">This year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <div className="flex space-x-2">
              <Input
                placeholder="Search audits, models, or datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 md:w-80"
              />
              <Button variant="outline" size="icon" className="shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ai_models">AI Models</SelectItem>
                <SelectItem value="datasets">Datasets</SelectItem>
                <SelectItem value="audits">Audits</SelectItem>
                <SelectItem value="issues">Issues</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full md:w-auto">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export Dashboard</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Regulator Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs md:text-sm">Recent Activity</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs md:text-sm">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Enhanced Key Metrics Grid (3x3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                        Total Audits ({selectedPeriod})
                      </p>
                      <p className="text-xl md:text-2xl font-bold">{dashboardData.overview.totalAudits}</p>
                      <p className="text-xs text-green-600 mt-1">+12% from last period</p>
                    </div>
                    <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">Pending Audits</p>
                      <p className="text-xl md:text-2xl font-bold">{dashboardData.overview.pendingAudits}</p>
                      <p className="text-xs text-yellow-600 mt-1">3 due this week</p>
                    </div>
                    <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">Compliance Rate</p>
                      <p className={`text-xl md:text-2xl font-bold ${getMetricColor("complianceRate", dashboardData.overview.complianceRate)}`}>
                        {dashboardData.overview.complianceRate}%
                      </p>
                      <p className="text-xs text-green-600 mt-1">+2.1% improvement</p>
                    </div>
                    <Shield className="h-6 w-6 md:h-8 md:w-8 text-green-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">Flagged Issues</p>
                      <p className="text-xl md:text-2xl font-bold text-red-600">{dashboardData.overview.flaggedIssues}</p>
                      <p className="text-xs text-red-600 mt-1">{dashboardData.overview.criticalIssueCount} critical</p>
                    </div>
                    <Flag className="h-6 w-6 md:h-8 md:w-8 text-red-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">Resolved Issues</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{dashboardData.overview.resolvedIssues}</p>
                      <p className="text-xs text-green-600 mt-1">87% resolution rate</p>
                    </div>
                    <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">Active Standards</p>
                      <p className="text-xl md:text-2xl font-bold">{dashboardData.overview.activeStandards}</p>
                      <p className="text-xs text-blue-600 mt-1">2 updates pending</p>
                    </div>
                    <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-blue-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">Audit Completion Rate</p>
                      <p className={`text-xl md:text-2xl font-bold ${getMetricColor("auditCompletionRate", dashboardData.overview.auditCompletionRate)}`}>
                        {dashboardData.overview.auditCompletionRate}%
                      </p>
                      <p className="text-xs text-green-600 mt-1">On target</p>
                    </div>
                    <Target className="h-6 w-6 md:h-8 md:w-8 text-purple-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">Avg Resolution Time</p>
                      <p className={`text-xl md:text-2xl font-bold ${getMetricColor("averageResolutionTime", dashboardData.overview.averageResolutionTime)}`}>
                        {dashboardData.overview.averageResolutionTime} days
                      </p>
                      <p className="text-xs text-green-600 mt-1">-1.2 days improvement</p>
                    </div>
                    <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">Critical Issues</p>
                      <p className="text-xl md:text-2xl font-bold text-red-600">{dashboardData.overview.criticalIssueCount}</p>
                      <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
                    </div>
                    <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-red-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-primary/20">
                    <CardContent className="pt-4 md:pt-6">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <Plus className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                        <h3 className="text-sm md:text-base font-semibold">Start New Audit</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Initiate compliance review</p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Audit</DialogTitle>
                    <DialogDescription>Schedule a new compliance audit for an AI model or dataset</DialogDescription>
                  </DialogHeader>
                  <Form {...auditForm}>
                    <form onSubmit={auditForm.handleSubmit((data) => createAuditMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={auditForm.control}
                        name="entityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entity Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select entity type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ai_model">AI Model</SelectItem>
                                <SelectItem value="dataset">Dataset</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={auditForm.control}
                        name="entityId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entity ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter entity identifier" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={auditForm.control}
                        name="auditorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Auditor Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter auditor name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={auditForm.control}
                        name="auditType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Audit Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select audit type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="privacy_compliance">Privacy Compliance</SelectItem>
                                <SelectItem value="model_validation">Model Validation</SelectItem>
                                <SelectItem value="bias_testing">Bias Testing</SelectItem>
                                <SelectItem value="security_assessment">Security Assessment</SelectItem>
                                <SelectItem value="data_quality">Data Quality</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={auditForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={createAuditMutation.isPending}>
                        {createAuditMutation.isPending ? "Creating..." : "Create Audit"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-red-200">
                    <CardContent className="pt-4 md:pt-6">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <Flag className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
                        <h3 className="text-sm md:text-base font-semibold">Report Issue</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Flag compliance concern</p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Compliance Issue</DialogTitle>
                    <DialogDescription>Document a compliance concern or violation</DialogDescription>
                  </DialogHeader>
                  <Form {...issueForm}>
                    <form onSubmit={issueForm.handleSubmit((data) => createIssueMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={issueForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issue Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter issue title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={issueForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <textarea 
                                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md"
                                placeholder="Describe the compliance issue in detail"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={issueForm.control}
                        name="severity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Severity</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={issueForm.control}
                          name="entityType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Entity Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Entity type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ai_model">AI Model</SelectItem>
                                  <SelectItem value="dataset">Dataset</SelectItem>
                                  <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={issueForm.control}
                          name="entityId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Entity ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Entity ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" disabled={createIssueMutation.isPending}>
                        {createIssueMutation.isPending ? "Reporting..." : "Report Issue"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-blue-200">
                    <CardContent className="pt-4 md:pt-6">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                        <h3 className="text-sm md:text-base font-semibold">Send Communication</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Contact stakeholders</p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Communication</DialogTitle>
                    <DialogDescription>Send compliance updates or notifications</DialogDescription>
                  </DialogHeader>
                  <Form {...commForm}>
                    <form onSubmit={commForm.handleSubmit((data) => sendCommunicationMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={commForm.control}
                        name="recipient"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select recipient" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all_partners">All Partners</SelectItem>
                                <SelectItem value="ai_trading_solutions">AI Trading Solutions</SelectItem>
                                <SelectItem value="fintech_analytics">FinTech Analytics Corp</SelectItem>
                                <SelectItem value="regtech_compliance">RegTech Compliance Ltd</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={commForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter subject" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={commForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <textarea 
                                className="w-full min-h-[120px] px-3 py-2 border border-input bg-background rounded-md"
                                placeholder="Enter your message"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={commForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={sendCommunicationMutation.isPending}>
                        {sendCommunicationMutation.isPending ? "Sending..." : "Send Communication"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Upcoming Audits */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Upcoming Audits</CardTitle>
                <CardDescription>Scheduled compliance reviews and assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcomingAudits.map((audit) => (
                    <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{audit.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {audit.auditor} • {new Date(audit.scheduled).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(audit.priority)}>
                          {audit.priority}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
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
                    {dashboardData.trends.complianceRateHistory.map((item, index) => (
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
                    {dashboardData.trends.auditsByType.map((item, index) => (
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
                    {dashboardData.issueDistribution.map((item, index) => (
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

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Feed</CardTitle>
                <CardDescription>Latest regulatory activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{activity.title}</h3>
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{activity.details}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{activity.entity}</Badge>
                          <Badge className={getPriorityColor(activity.priority)}>
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

          <TabsContent value="insights">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regulatory Insights</CardTitle>
                  <CardDescription>AI-powered analysis and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Compliance Improvement Detected</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Overall compliance rate has improved by 2.1% this month, primarily driven by 
                            better data retention policy adherence across AI Trading Solutions models.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900">Attention Required</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            3 critical issues remain unresolved beyond the 7-day SLA. Consider escalating 
                            to senior management for Dataset #DS-8834 and Model #ML-3456.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Best Practice Identified</h4>
                          <p className="text-sm text-green-700 mt-1">
                            RegTech Compliance Ltd demonstrates excellent audit preparation, with 
                            98% documentation completeness. Consider sharing their practices as a model.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <BarChart3 className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-900">Trend Analysis</h4>
                          <p className="text-sm text-purple-700 mt-1">
                            Privacy compliance audits are increasing 15% month-over-month. Consider 
                            allocating additional resources to handle the growing workload.
                          </p>
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
    </Layout>
  );
}