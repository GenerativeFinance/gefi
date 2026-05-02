import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  Plus,
  Download,
  Calendar,
  User,
  Shield
} from "lucide-react";

export default function ModelAudits() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  const audits = [
    {
      id: "AUD-001",
      modelId: "MOD-2024-001",
      modelName: "Deep Learning Credit Risk Predictor",
      developer: "FinTech Innovations Ltd",
      status: "completed",
      priority: "high",
      submittedDate: "2024-12-10",
      completedDate: "2024-12-20",
      auditor: "Sarah Mitchell",
      complianceScore: 92,
      findings: [
        { type: "pass", description: "Model validation methodology meets regulatory standards" },
        { type: "warning", description: "Documentation requires minor updates for clarity" },
        { type: "pass", description: "Bias testing shows acceptable fairness metrics" }
      ],
      riskLevel: "low"
    },
    {
      id: "AUD-002",
      modelId: "MOD-2024-002",
      modelName: "High-Frequency Trading Algorithm",
      developer: "Quantum Capital Partners",
      status: "in-progress",
      priority: "critical",
      submittedDate: "2025-01-05",
      completedDate: null,
      auditor: "Michael Chen",
      complianceScore: null,
      findings: [],
      riskLevel: "high"
    },
    {
      id: "AUD-003",
      modelId: "MOD-2024-003",
      modelName: "Portfolio Optimization Engine",
      developer: "Smart Invest AI",
      status: "pending",
      priority: "medium",
      submittedDate: "2025-01-12",
      completedDate: null,
      auditor: null,
      complianceScore: null,
      findings: [],
      riskLevel: "medium"
    },
    {
      id: "AUD-004",
      modelId: "MOD-2024-004",
      modelName: "Fraud Detection Neural Network",
      developer: "SecureBank Technologies",
      status: "flagged",
      priority: "critical",
      submittedDate: "2024-11-28",
      completedDate: "2024-12-15",
      auditor: "David Rodriguez",
      complianceScore: 67,
      findings: [
        { type: "fail", description: "Insufficient documentation of model training data" },
        { type: "fail", description: "Bias testing reveals discriminatory patterns" },
        { type: "warning", description: "Model interpretability below regulatory threshold" }
      ],
      riskLevel: "high"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "flagged":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "flagged":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-500";
      case "high":
        return "bg-orange-500/10 text-orange-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "low":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-muted";
    }
  };

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audit.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audit.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Model Audits</h1>
          <p className="text-muted-foreground">
            Review and manage AI model compliance audits and assessments
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.3%</div>
              <p className="text-xs text-muted-foreground">+2.1% improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search audits by model name, developer, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Model Audit</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="model-id">Model ID</Label>
                  <Input id="model-id" placeholder="MOD-2025-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Initial Notes</Label>
                  <Textarea id="notes" placeholder="Enter initial audit notes..." />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create Audit
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Audits List */}
        <div className="space-y-4">
          {filteredAudits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{audit.modelName}</h3>
                      <Badge className={getStatusColor(audit.status)}>
                        {getStatusIcon(audit.status)}
                        <span className="ml-1 capitalize">{audit.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(audit.priority)}>
                        {audit.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Audit ID:</strong> {audit.id} | <strong>Model ID:</strong> {audit.modelId}</p>
                      <p><strong>Developer:</strong> {audit.developer}</p>
                      <p><strong>Submitted:</strong> {audit.submittedDate}</p>
                      {audit.auditor && (
                        <p><strong>Auditor:</strong> {audit.auditor}</p>
                      )}
                      {audit.completedDate && (
                        <p><strong>Completed:</strong> {audit.completedDate}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {audit.complianceScore !== null && (
                      <div className="text-right">
                        <div className="text-2xl font-bold">{audit.complianceScore}%</div>
                        <div className="text-xs text-muted-foreground">Compliance Score</div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedAudit(audit)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>

                {audit.findings.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Key Findings:</h4>
                    <div className="space-y-1">
                      {audit.findings.slice(0, 2).map((finding, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {finding.type === "pass" && <CheckCircle className="h-3 w-3 text-green-500" />}
                          {finding.type === "warning" && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                          {finding.type === "fail" && <XCircle className="h-3 w-3 text-red-500" />}
                          <span>{finding.description}</span>
                        </div>
                      ))}
                      {audit.findings.length > 2 && (
                        <p className="text-xs text-muted-foreground ml-5">
                          +{audit.findings.length - 2} more findings
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAudits.length === 0 && (
          <Card className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No audits found</h3>
            <p className="text-muted-foreground mb-4">
              No model audits match your current search criteria
            </p>
            <Button onClick={() => setSearchQuery("")}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}