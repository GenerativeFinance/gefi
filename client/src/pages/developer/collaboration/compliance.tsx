import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Upload,
  Eye,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Building,
  Scale,
  Globe,
  Lock,
  Key,
  Settings,
  Activity,
  BarChart,
  TrendingUp,
  AlertCircle,
  Info,
  BookOpen,
  Archive,
  Flag,
  Star,
  CheckSquare,
  XCircle,
  Zap,
  Database,
  Code,
  FileCheck,
  Users,
  Monitor,
  Cloud,
  ExternalLink
} from "lucide-react";

export default function DeveloperCollaborationCompliance() {
  const complianceFrameworks = [
    {
      id: 1,
      name: "SEC Regulations",
      description: "Securities and Exchange Commission compliance for financial AI models",
      status: "compliant",
      lastAudit: "June 15, 2025",
      nextAudit: "December 15, 2025",
      score: 95,
      requirements: 24,
      completed: 23,
      documents: ["SEC Form ADV", "Risk Disclosure", "Model Documentation"],
      auditor: "Regulatory Compliance Office",
      priority: "high"
    },
    {
      id: 2,
      name: "GDPR Data Protection",
      description: "General Data Protection Regulation compliance for user data handling",
      status: "compliant",
      lastAudit: "July 1, 2025",
      nextAudit: "January 1, 2026",
      score: 98,
      requirements: 18,
      completed: 18,
      documents: ["Privacy Policy", "Data Processing Agreement", "Consent Forms"],
      auditor: "Data Protection Team",
      priority: "high"
    },
    {
      id: 3,
      name: "SOC 2 Type II",
      description: "Service Organization Control 2 for security and availability",
      status: "in-progress",
      lastAudit: "March 20, 2025",
      nextAudit: "September 20, 2025",
      score: 87,
      requirements: 32,
      completed: 28,
      documents: ["Security Policies", "Incident Response", "Access Controls"],
      auditor: "External Security Auditor",
      priority: "medium"
    },
    {
      id: 4,
      name: "ISO 27001",
      description: "Information Security Management System certification",
      status: "pending",
      lastAudit: "May 10, 2025",
      nextAudit: "August 10, 2025",
      score: 73,
      requirements: 28,
      completed: 20,
      documents: ["ISMS Manual", "Risk Assessment", "Treatment Plan"],
      auditor: "ISO Certification Body",
      priority: "medium"
    }
  ];

  const complianceIssues = [
    {
      id: 1,
      title: "Model Documentation Update Required",
      description: "AI model documentation needs to include new risk assessment metrics as per latest SEC guidelines",
      severity: "medium",
      framework: "SEC Regulations",
      assignedTo: "Sarah Chen",
      dueDate: "July 25, 2025",
      status: "open",
      createdDate: "July 10, 2025",
      tags: ["documentation", "sec", "risk-assessment"]
    },
    {
      id: 2,
      title: "Data Retention Policy Review",
      description: "GDPR data retention policies need review and update for new data sources",
      severity: "high",
      framework: "GDPR Data Protection",
      assignedTo: "Mike Johnson",
      dueDate: "July 20, 2025",
      status: "in-progress",
      createdDate: "July 5, 2025",
      tags: ["gdpr", "data-retention", "privacy"]
    },
    {
      id: 3,
      title: "Access Control Audit",
      description: "Quarterly review of user access controls and permissions",
      severity: "low",
      framework: "SOC 2 Type II",
      assignedTo: "Elena Rodriguez",
      dueDate: "July 30, 2025",
      status: "completed",
      createdDate: "June 30, 2025",
      completedDate: "July 12, 2025",
      tags: ["access-control", "soc2", "security"]
    }
  ];

  const auditHistory = [
    {
      id: 1,
      framework: "SEC Regulations",
      auditor: "Regulatory Compliance Office",
      date: "June 15, 2025",
      type: "Annual Review",
      result: "Passed",
      score: 95,
      findings: 2,
      recommendations: 3,
      reportUrl: "#"
    },
    {
      id: 2,
      framework: "GDPR Data Protection",
      auditor: "Data Protection Team",
      date: "July 1, 2025",
      type: "Quarterly Review",
      result: "Passed",
      score: 98,
      findings: 0,
      recommendations: 1,
      reportUrl: "#"
    },
    {
      id: 3,
      framework: "SOC 2 Type II",
      auditor: "External Security Auditor",
      date: "March 20, 2025",
      type: "Semi-Annual",
      result: "Conditional Pass",
      score: 87,
      findings: 4,
      recommendations: 6,
      reportUrl: "#"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Conditional Pass': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Compliance Management</h1>
            <p className="text-muted-foreground">
              Monitor regulatory compliance, track audits, and manage compliance issues
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Compliance Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Document Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="policy">Policy Document</SelectItem>
                          <SelectItem value="audit">Audit Report</SelectItem>
                          <SelectItem value="certificate">Certificate</SelectItem>
                          <SelectItem value="assessment">Risk Assessment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Framework</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sec">SEC Regulations</SelectItem>
                          <SelectItem value="gdpr">GDPR</SelectItem>
                          <SelectItem value="soc2">SOC 2</SelectItem>
                          <SelectItem value="iso27001">ISO 27001</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Document Title</label>
                    <Input placeholder="Enter document title" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Document description" rows={3} />
                  </div>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop your file here
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Upload Document</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                  <p className="text-2xl font-bold">91%</p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next Audit</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Frameworks</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Scale className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="frameworks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="audits">Audit History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="frameworks" className="space-y-6">
            {/* Compliance Frameworks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {complianceFrameworks.map((framework) => (
                <Card key={framework.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-1">{framework.name}</CardTitle>
                          <Badge className={getStatusColor(framework.status)}>
                            {framework.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{framework.score}%</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{framework.description}</p>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Requirements Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {framework.completed}/{framework.requirements}
                          </span>
                        </div>
                        <Progress 
                          value={(framework.completed / framework.requirements) * 100} 
                          className="h-2" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">Last Audit</p>
                          <p className="text-xs text-muted-foreground">{framework.lastAudit}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">Next Audit</p>
                          <p className="text-xs text-muted-foreground">{framework.nextAudit}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Key Documents:</p>
                        <div className="flex flex-wrap gap-1">
                          {framework.documents.map((doc, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Auditor: {framework.auditor}</span>
                        <Badge className={framework.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {framework.priority} priority
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Reports
                        </Button>
                        <Button className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search issues..." className="pl-10" />
                  </div>
                  <div className="flex gap-3">
                    <Select>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severity</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Issues */}
            <div className="space-y-4">
              {complianceIssues.map((issue) => (
                <Card key={issue.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{issue.title}</CardTitle>
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          <Badge className={getIssueStatusColor(issue.status)}>
                            {issue.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {issue.framework}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {issue.assignedTo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {issue.dueDate}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {issue.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Created: {issue.createdDate}</span>
                        {issue.completedDate && (
                          <span>Completed: {issue.completedDate}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {issue.status !== 'completed' && (
                          <Button variant="outline" className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Update Status
                          </Button>
                        )}
                        <Button variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audits" className="space-y-6">
            {/* Audit History */}
            <div className="space-y-4">
              {auditHistory.map((audit) => (
                <Card key={audit.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-1">{audit.framework}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{audit.type}</span>
                            <span>{audit.date}</span>
                            <span>By {audit.auditor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getResultColor(audit.result)}>
                          {audit.result}
                        </Badge>
                        <p className="text-sm font-bold mt-1">Score: {audit.score}%</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-red-600">{audit.findings}</p>
                          <p className="text-xs text-muted-foreground">Findings</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-yellow-600">{audit.recommendations}</p>
                          <p className="text-xs text-muted-foreground">Recommendations</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">{audit.score}%</p>
                          <p className="text-xs text-muted-foreground">Overall Score</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Findings
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {/* Document Library Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Document Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Document Library</h3>
                  <p className="text-muted-foreground mb-4">
                    Manage your compliance documents, policies, and certificates
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}