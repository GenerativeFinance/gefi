import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Database,
  Plus,
  Download,
  Shield,
  Lock,
  Users,
  FileCheck
} from "lucide-react";

export default function DatasetAudits() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const audits = [
    {
      id: "DA-001",
      datasetId: "DS-2024-001",
      datasetName: "European Credit Bureau Historical Data",
      provider: "CreditData Solutions",
      status: "completed",
      priority: "high",
      submittedDate: "2024-12-01",
      completedDate: "2024-12-18",
      auditor: "Dr. Emma Thompson",
      privacyScore: 94,
      qualityScore: 89,
      complianceLevel: "GDPR Compliant",
      dataPoints: 2500000,
      findings: [
        { type: "pass", description: "PII anonymization meets GDPR standards" },
        { type: "warning", description: "Some data fields lack sufficient documentation" },
        { type: "pass", description: "Data quality metrics exceed industry benchmarks" }
      ],
      riskLevel: "low",
      categories: ["Credit Risk", "Personal Finance"]
    },
    {
      id: "DA-002",
      datasetId: "DS-2024-002",
      datasetName: "High-Frequency Trading Market Data",
      provider: "MarketStream Analytics",
      status: "in-progress",
      priority: "critical",
      submittedDate: "2025-01-08",
      completedDate: null,
      auditor: "James Wilson",
      privacyScore: null,
      qualityScore: null,
      complianceLevel: "Under Review",
      dataPoints: 50000000,
      findings: [],
      riskLevel: "medium",
      categories: ["Trading", "Market Data"]
    },
    {
      id: "DA-003",
      datasetId: "DS-2024-003",
      datasetName: "Insurance Claims Processing Dataset",
      provider: "InsureTech Data Corp",
      status: "pending",
      priority: "medium",
      submittedDate: "2025-01-15",
      completedDate: null,
      auditor: null,
      privacyScore: null,
      qualityScore: null,
      complianceLevel: "Pending Assessment",
      dataPoints: 750000,
      findings: [],
      riskLevel: "medium",
      categories: ["Insurance", "Claims"]
    },
    {
      id: "DA-004",
      datasetId: "DS-2023-045",
      datasetName: "Consumer Transaction Patterns",
      provider: "FinBehavior Insights",
      status: "flagged",
      priority: "critical",
      submittedDate: "2024-11-20",
      completedDate: "2024-12-10",
      auditor: "Dr. Maria Rodriguez",
      privacyScore: 45,
      qualityScore: 72,
      complianceLevel: "Non-Compliant",
      dataPoints: 1200000,
      findings: [
        { type: "fail", description: "Insufficient user consent documentation" },
        { type: "fail", description: "PII exposure in transaction metadata" },
        { type: "warning", description: "Data retention period exceeds policy limits" }
      ],
      riskLevel: "high",
      categories: ["Consumer Behavior", "Transactions"]
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

  const getComplianceColor = (level: string) => {
    if (level.includes("Compliant")) return "text-green-500";
    if (level.includes("Non-Compliant")) return "text-red-500";
    return "text-yellow-500";
  };

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.datasetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audit.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         audit.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dataset Audits</h1>
          <p className="text-muted-foreground">
            Monitor data privacy, quality, and compliance across all platform datasets
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+7 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Privacy Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.2%</div>
              <p className="text-xs text-muted-foreground">Average across all datasets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GDPR Compliant</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">83</div>
              <p className="text-xs text-muted-foreground">93% of total datasets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125M</div>
              <p className="text-xs text-muted-foreground">Total audited records</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search datasets by name, provider, or ID..."
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
                <DialogTitle>Create New Dataset Audit</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="dataset-id">Dataset ID</Label>
                  <Input id="dataset-id" placeholder="DS-2025-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audit-type">Audit Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="privacy">Privacy Assessment</SelectItem>
                      <SelectItem value="quality">Data Quality Review</SelectItem>
                      <SelectItem value="compliance">Compliance Check</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="scope">Audit Scope</Label>
                  <Textarea id="scope" placeholder="Describe the audit scope and objectives..." />
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

        {/* Dataset Audits List */}
        <div className="space-y-4">
          {filteredAudits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{audit.datasetName}</h3>
                      <Badge className={getStatusColor(audit.status)}>
                        {getStatusIcon(audit.status)}
                        <span className="ml-1 capitalize">{audit.status}</span>
                      </Badge>
                      <Badge variant="outline" className={getComplianceColor(audit.complianceLevel)}>
                        {audit.complianceLevel}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1 mb-3">
                      <p><strong>Audit ID:</strong> {audit.id} | <strong>Dataset ID:</strong> {audit.datasetId}</p>
                      <p><strong>Provider:</strong> {audit.provider}</p>
                      <p><strong>Data Points:</strong> {audit.dataPoints.toLocaleString()}</p>
                      <p><strong>Submitted:</strong> {audit.submittedDate}</p>
                      {audit.auditor && (
                        <p><strong>Auditor:</strong> {audit.auditor}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {audit.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    {audit.privacyScore !== null && audit.qualityScore !== null && (
                      <div className="space-y-2 text-right">
                        <div>
                          <div className="text-sm text-muted-foreground">Privacy Score</div>
                          <div className="flex items-center gap-2">
                            <Progress value={audit.privacyScore} className="w-20 h-2" />
                            <span className="text-sm font-medium">{audit.privacyScore}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Quality Score</div>
                          <div className="flex items-center gap-2">
                            <Progress value={audit.qualityScore} className="w-20 h-2" />
                            <span className="text-sm font-medium">{audit.qualityScore}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
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
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No dataset audits found</h3>
            <p className="text-muted-foreground mb-4">
              No dataset audits match your current search criteria
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