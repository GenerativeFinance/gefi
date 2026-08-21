import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import {
  Search,
  Filter,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  Plus,
  User,
  Calendar,
  FileText,
  Shield,
  Zap
} from "lucide-react";

export default function ComplianceIssues() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const issues = [
    {
      id: "CI-001",
      title: "Unauthorized Data Usage in Model Training",
      description: "AI model MOD-2024-015 appears to be using customer transaction data without explicit consent documentation.",
      severity: "critical",
      status: "open",
      priority: "high",
      reportedDate: "2025-01-12",
      reportedBy: "Automated Compliance Monitor",
      assignedTo: "Sarah Chen",
      affectedEntities: ["MOD-2024-015", "DataSet-TX-2024-001"],
      category: "Data Privacy",
      resolutionTime: null,
      actions: [
        { date: "2025-01-12", action: "Issue flagged by automated system", user: "System" },
        { date: "2025-01-13", action: "Assigned to compliance officer", user: "Admin" },
        { date: "2025-01-14", action: "Initial investigation started", user: "Sarah Chen" }
      ]
    },
    {
      id: "CI-002",
      title: "Model Bias in Credit Scoring Algorithm",
      description: "Statistical analysis reveals potential discriminatory bias in credit scoring model affecting protected demographic groups.",
      severity: "high",
      status: "in-progress",
      priority: "high",
      reportedDate: "2025-01-08",
      reportedBy: "Dr. Michael Rodriguez",
      assignedTo: "Emma Thompson",
      affectedEntities: ["MOD-2024-009"],
      category: "Algorithmic Fairness",
      resolutionTime: null,
      actions: [
        { date: "2025-01-08", action: "Bias detected in routine audit", user: "Dr. Michael Rodriguez" },
        { date: "2025-01-09", action: "Escalated to fairness review board", user: "Compliance Team" },
        { date: "2025-01-10", action: "Developer notified for remediation", user: "Emma Thompson" }
      ]
    },
    {
      id: "CI-003",
      title: "Insufficient Model Documentation",
      description: "Trading algorithm lacks required technical documentation for regulatory approval and risk assessment.",
      severity: "medium",
      status: "resolved",
      priority: "medium",
      reportedDate: "2024-12-20",
      reportedBy: "James Wilson",
      assignedTo: "David Kim",
      affectedEntities: ["MOD-2024-003"],
      category: "Documentation",
      resolutionTime: "7 days",
      actions: [
        { date: "2024-12-20", action: "Documentation review initiated", user: "James Wilson" },
        { date: "2024-12-22", action: "Developer contacted for updates", user: "David Kim" },
        { date: "2024-12-27", action: "Complete documentation submitted and approved", user: "David Kim" }
      ]
    },
    {
      id: "CI-004",
      title: "Data Retention Policy Violation",
      description: "Personal financial data being retained beyond the stated 5-year policy limit in multiple datasets.",
      severity: "high",
      status: "open",
      priority: "critical",
      reportedDate: "2025-01-10",
      reportedBy: "Privacy Audit System",
      assignedTo: "Lisa Martinez",
      affectedEntities: ["DS-2018-001", "DS-2018-007", "DS-2019-003"],
      category: "Data Governance",
      resolutionTime: null,
      actions: [
        { date: "2025-01-10", action: "Automated retention policy check failed", user: "System" },
        { date: "2025-01-11", action: "Data providers notified", user: "Lisa Martinez" }
      ]
    },
    {
      id: "CI-005",
      title: "Cross-Border Data Transfer Without Consent",
      description: "European customer data being processed on US servers without proper data transfer agreements.",
      severity: "critical",
      status: "escalated",
      priority: "critical",
      reportedDate: "2025-01-05",
      reportedBy: "GDPR Compliance Monitor",
      assignedTo: "Legal Team",
      affectedEntities: ["Provider-EU-001"],
      category: "International Compliance",
      resolutionTime: null,
      actions: [
        { date: "2025-01-05", action: "Data transfer violation detected", user: "GDPR Monitor" },
        { date: "2025-01-06", action: "Escalated to legal department", user: "Compliance Officer" },
        { date: "2025-01-07", action: "External legal counsel engaged", user: "Legal Team" }
      ]
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Flag className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "escalated":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "open":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-muted";
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || issue.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compliance Issues</h1>
          <p className="text-muted-foreground">
            Track and manage compliance violations and regulatory concerns across the platform
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">2</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89.4%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.2 days</div>
              <p className="text-xs text-muted-foreground">-0.8 days improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search issues by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report Compliance Issue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="data-privacy">Data Privacy</SelectItem>
                        <SelectItem value="algorithmic-fairness">Algorithmic Fairness</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="data-governance">Data Governance</SelectItem>
                        <SelectItem value="international-compliance">International Compliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input id="title" placeholder="Brief description of the compliance issue" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea id="description" placeholder="Provide detailed information about the compliance issue..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entities">Affected Entities</Label>
                  <Input id="entities" placeholder="Model IDs, Dataset IDs, Provider IDs (comma-separated)" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Submit Report
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{issue.title}</h3>
                      <Badge className={getSeverityColor(issue.severity)}>
                        {getSeverityIcon(issue.severity)}
                        <span className="ml-1 capitalize">{issue.severity}</span>
                      </Badge>
                      <Badge className={getStatusColor(issue.status)}>
                        <span className="capitalize">{issue.status.replace('-', ' ')}</span>
                      </Badge>
                      <Badge variant="outline">
                        {issue.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {issue.description}
                    </p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Issue ID:</strong> {issue.id}</p>
                      <p><strong>Reported:</strong> {issue.reportedDate} by {issue.reportedBy}</p>
                      <p><strong>Assigned to:</strong> {issue.assignedTo}</p>
                      <p><strong>Affected Entities:</strong> {issue.affectedEntities.join(", ")}</p>
                      {issue.resolutionTime && (
                        <p><strong>Resolution Time:</strong> {issue.resolutionTime}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Action Log
                    </Button>
                  </div>
                </div>

                {issue.actions.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Recent Actions:</h4>
                    <div className="space-y-1">
                      {issue.actions.slice(-2).map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{action.date}</span>
                          <span>-</span>
                          <span>{action.action}</span>
                          <span className="text-muted-foreground">by {action.user}</span>
                        </div>
                      ))}
                      {issue.actions.length > 2 && (
                        <p className="text-xs text-muted-foreground ml-5">
                          +{issue.actions.length - 2} earlier actions
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <Card className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No compliance issues found</h3>
            <p className="text-muted-foreground mb-4">
              No compliance issues match your current search criteria
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSeverityFilter("all");
              setStatusFilter("all");
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}