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
import Layout from "@/components/layout/Layout";
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
  const [selectedTab, setSelectedTab] = useState("audits");
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
    <Layout>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Regulator Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Compliance oversight and regulatory monitoring for AI models and datasets
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="audits">Model Audits</TabsTrigger>
            <TabsTrigger value="datasets">Dataset Audits</TabsTrigger>
            <TabsTrigger value="issues">Compliance Issues</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="standards">Standards</TabsTrigger>
          </TabsList>

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
    </Layout>
  );
}