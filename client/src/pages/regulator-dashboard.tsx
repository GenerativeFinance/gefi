import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Search,
  Filter,
  Download,
  Eye,
  Flag,
  TrendingUp,
  Users,
  BarChart3,
  Settings,
  Mail,
  Calendar,
  BookOpen,
  AlertCircle
} from "lucide-react";

// Form schemas
const auditFormSchema = z.object({
  entityId: z.number(),
  entityType: z.enum(["model", "dataset"]),
  auditType: z.string(),
  regulatoryFramework: z.string(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
});

const communicationFormSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["developer", "data_provider"]),
  subject: z.string(),
  message: z.string(),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  responseRequired: z.boolean(),
});

const issueFormSchema = z.object({
  entityId: z.number(),
  entityType: z.enum(["model", "dataset"]),
  issueType: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  title: z.string(),
  description: z.string(),
  regulatoryFramework: z.string().optional(),
});

export default function RegulatorDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [communicationDialogOpen, setCommunicationDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);

  const auditForm = useForm<z.infer<typeof auditFormSchema>>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      auditType: "compliance",
      riskLevel: "medium",
    },
  });

  const communicationForm = useForm<z.infer<typeof communicationFormSchema>>({
    resolver: zodResolver(communicationFormSchema),
    defaultValues: {
      priority: "normal",
      responseRequired: false,
    },
  });

  const issueForm = useForm<z.infer<typeof issueFormSchema>>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      severity: "medium",
    },
  });

  // Queries
  const { data: dashboardStats = {
    totalAudits: 45,
    pendingAudits: 12,
    flaggedIssues: 7,
    resolvedIssues: 23,
    complianceRate: 87.2,
    criticalIssues: 3
  }, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/regulator/stats"],
    retry: false,
  });

  const { data: modelAudits = [], isLoading: auditsLoading } = useQuery({
    queryKey: ["/api/regulator/model-audits"],
    retry: false,
  });

  const { data: datasetAudits = [], isLoading: datasetAuditsLoading } = useQuery({
    queryKey: ["/api/regulator/dataset-audits"],
    retry: false,
  });

  const { data: complianceIssues = [], isLoading: issuesLoading } = useQuery({
    queryKey: ["/api/regulator/compliance-issues"],
    retry: false,
  });

  const { data: communications = [], isLoading: communicationsLoading } = useQuery({
    queryKey: ["/api/regulator/communications"],
    retry: false,
  });

  const { data: regulatoryStandards = [], isLoading: standardsLoading } = useQuery({
    queryKey: ["/api/regulator/standards"],
    retry: false,
  });

  // Mutations
  const auditMutation = useMutation({
    mutationFn: (data: z.infer<typeof auditFormSchema>) => 
      apiRequest("POST", "/api/regulator/audits", data),
    onSuccess: () => {
      toast({
        title: "Audit Created",
        description: "New audit has been successfully initiated.",
      });
      setAuditDialogOpen(false);
      auditForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/regulator/model-audits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/regulator/dataset-audits"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create audit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const communicationMutation = useMutation({
    mutationFn: (data: z.infer<typeof communicationFormSchema>) => 
      apiRequest("POST", "/api/regulator/communications", data),
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Communication has been sent successfully.",
      });
      setCommunicationDialogOpen(false);
      communicationForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/regulator/communications"] });
    },
  });

  const issueMutation = useMutation({
    mutationFn: (data: z.infer<typeof issueFormSchema>) => 
      apiRequest("POST", "/api/regulator/issues", data),
    onSuccess: () => {
      toast({
        title: "Issue Reported",
        description: "Compliance issue has been successfully reported.",
      });
      setIssueDialogOpen(false);
      issueForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/regulator/compliance-issues"] });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "success";
      case "completed": return "success";
      case "in_progress": return "warning";
      case "flagged": return "destructive";
      case "under_review": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Regulator Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Compliance oversight and regulatory monitoring for AI models and datasets
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audits">Model Audits</TabsTrigger>
            <TabsTrigger value="datasets">Dataset Audits</TabsTrigger>
            <TabsTrigger value="issues">Compliance Issues</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="standards">Standards</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalAudits}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Audits</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.pendingAudits}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.complianceRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% improvement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flagged Issues</CardTitle>
                  <Flag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.flaggedIssues}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.criticalIssues} critical issues
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.resolvedIssues}</div>
                  <p className="text-xs text-muted-foreground">
                    76% resolution rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Standards</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regulatoryStandards.length || 8}</div>
                  <p className="text-xs text-muted-foreground">
                    2 updated this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common regulatory tasks and operations</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Start New Audit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Audit</DialogTitle>
                      <DialogDescription>
                        Initiate a new compliance audit for a model or dataset
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...auditForm}>
                      <form onSubmit={auditForm.handleSubmit((data) => auditMutation.mutate(data))} className="space-y-4">
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
                                  <SelectItem value="model">AI Model</SelectItem>
                                  <SelectItem value="dataset">Dataset</SelectItem>
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
                                <Input 
                                  type="number" 
                                  placeholder="Enter entity ID" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
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
                                  <SelectItem value="compliance">Compliance</SelectItem>
                                  <SelectItem value="technical">Technical</SelectItem>
                                  <SelectItem value="ethical">Ethical</SelectItem>
                                  <SelectItem value="privacy">Privacy</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={auditForm.control}
                          name="regulatoryFramework"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Regulatory Framework</FormLabel>
                              <Select onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select framework" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="SEC">SEC</SelectItem>
                                  <SelectItem value="GDPR">GDPR</SelectItem>
                                  <SelectItem value="MiFID">MiFID</SelectItem>
                                  <SelectItem value="FINRA">FINRA</SelectItem>
                                  <SelectItem value="SOX">SOX</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={auditForm.control}
                          name="riskLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Risk Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select risk level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full" disabled={auditMutation.isPending}>
                          {auditMutation.isPending ? "Creating..." : "Create Audit"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Flag className="mr-2 h-4 w-4" />
                      Report Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Report Compliance Issue</DialogTitle>
                      <DialogDescription>
                        Report a compliance violation or concern
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...issueForm}>
                      <form onSubmit={issueForm.handleSubmit((data) => issueMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={issueForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Issue Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Brief description of the issue" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={issueForm.control}
                          name="entityType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Entity Type</FormLabel>
                              <Select onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select entity type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="model">AI Model</SelectItem>
                                  <SelectItem value="dataset">Dataset</SelectItem>
                                </SelectContent>
                              </Select>
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
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                              </Select>
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
                                <Textarea 
                                  placeholder="Detailed description of the compliance issue"
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full" disabled={issueMutation.isPending}>
                          {issueMutation.isPending ? "Reporting..." : "Report Issue"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Dialog open={communicationDialogOpen} onOpenChange={setCommunicationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Communication
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Send Communication</DialogTitle>
                      <DialogDescription>
                        Send a message to developers or data providers
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...communicationForm}>
                      <form onSubmit={communicationForm.handleSubmit((data) => communicationMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={communicationForm.control}
                          name="recipientType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient Type</FormLabel>
                              <Select onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select recipient type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="developer">Developer</SelectItem>
                                  <SelectItem value="data_provider">Data Provider</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={communicationForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Message subject" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={communicationForm.control}
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
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={communicationForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Your message"
                                  rows={4}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full" disabled={communicationMutation.isPending}>
                          {communicationMutation.isPending ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest regulatory actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Critical compliance issue flagged</p>
                      <p className="text-xs text-muted-foreground">Model ID #1234 - Privacy violation detected</p>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Audit completed successfully</p>
                      <p className="text-xs text-muted-foreground">Dataset ID #5678 - GDPR compliance verified</p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New regulatory standard updated</p>
                      <p className="text-xs text-muted-foreground">SEC Rule 15c3-3 Amendment effective immediately</p>
                    </div>
                    <Badge variant="warning">Updated</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Model Audits Tab */}
          <TabsContent value="audits" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Model Audits</h2>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search audits..."
                  className="w-64"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">AI Trading Model #{1000 + i}</h3>
                        <p className="text-sm text-muted-foreground">
                          Risk Assessment Model - SEC Compliance Audit
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Auditor: John Smith</span>
                          <span>Started: Dec 1, 2024</span>
                          <span>Framework: SEC</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(["in_progress", "completed", "flagged"][i % 3])}>
                          {["In Progress", "Completed", "Flagged"][i % 3]}
                        </Badge>
                        <Badge variant={getSeverityColor(["low", "medium", "high"][i % 3])}>
                          {["Low", "Medium", "High"][i % 3]} Risk
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Dataset Audits Tab */}
          <TabsContent value="datasets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Dataset Audits</h2>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search dataset audits..."
                  className="w-64"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Financial Dataset #{2000 + i}</h3>
                        <p className="text-sm text-muted-foreground">
                          Market Data Collection - GDPR Privacy Audit
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Auditor: Sarah Johnson</span>
                          <span>Started: Nov 28, 2024</span>
                          <span>Framework: GDPR</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(["completed", "in_progress", "under_review"][i % 3])}>
                          {["Completed", "In Progress", "Under Review"][i % 3]}
                        </Badge>
                        <Badge variant={getSeverityColor(["medium", "low", "high"][i % 3])}>
                          {["Medium", "Low", "High"][i % 3]} Risk
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compliance Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Compliance Issues</h2>
              <div className="flex space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Issues</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { title: "Data Privacy Violation", severity: "critical", status: "open", framework: "GDPR" },
                { title: "Model Bias Detection", severity: "high", status: "investigating", framework: "SEC" },
                { title: "Documentation Incomplete", severity: "medium", status: "resolved", framework: "FINRA" },
                { title: "Access Control Issue", severity: "low", status: "open", framework: "SOX" },
              ].map((issue, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          {issue.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Entity ID: #{3000 + i} • Reported: Dec {i + 1}, 2024
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Reporter: Compliance Team</span>
                          <span>Framework: {issue.framework}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        <Badge variant={getStatusColor(issue.status)}>
                          {issue.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Communications</h2>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <div className="grid gap-4">
              {[
                { recipient: "John Developer", subject: "Model Documentation Required", priority: "high", status: "sent" },
                { recipient: "DataCorp Inc.", subject: "Dataset Compliance Review", priority: "normal", status: "read" },
                { recipient: "AI Solutions", subject: "Audit Findings Report", priority: "urgent", status: "responded" },
                { recipient: "Tech Startup", subject: "Clarification Needed", priority: "normal", status: "delivered" },
              ].map((comm, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {comm.subject}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          To: {comm.recipient} • Sent: Dec {i + 1}, 2024
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={comm.priority === "urgent" ? "destructive" : comm.priority === "high" ? "warning" : "secondary"}>
                          {comm.priority}
                        </Badge>
                        <Badge variant={comm.status === "responded" ? "success" : "secondary"}>
                          {comm.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Standards Tab */}
          <TabsContent value="standards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Regulatory Standards</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Standards
              </Button>
            </div>

            <div className="grid gap-4">
              {[
                { name: "SEC Rule 15c3-3", framework: "SEC", version: "2024.1", status: "active" },
                { name: "GDPR Article 22", framework: "GDPR", version: "2023.2", status: "active" },
                { name: "MiFID II RTS 28", framework: "MiFID", version: "2024.1", status: "active" },
                { name: "FINRA Rule 3110", framework: "FINRA", version: "2023.3", status: "updated" },
                { name: "SOX Section 404", framework: "SOX", version: "2024.1", status: "active" },
              ].map((standard, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          {standard.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Framework: {standard.framework} • Version: {standard.version}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last updated: Dec {i + 1}, 2024
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={standard.status === "updated" ? "warning" : "success"}>
                          {standard.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}