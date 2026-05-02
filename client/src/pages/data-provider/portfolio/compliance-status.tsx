import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Calendar,
  Building,
  Globe,
  Lock,
  Eye,
  Download,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function ComplianceStatus() {
  const [selectedFramework, setSelectedFramework] = useState("all");

  // Sample compliance data
  const complianceOverview = {
    overallScore: 94,
    activeFrameworks: 6,
    pendingActions: 3,
    lastAudit: "2025-07-05",
    nextAudit: "2025-10-05",
    certifications: 8
  };

  const regulatoryFrameworks = [
    {
      id: 1,
      name: "GDPR",
      fullName: "General Data Protection Regulation",
      status: "Compliant",
      score: 98,
      lastAudit: "2025-07-05",
      nextAudit: "2025-10-05",
      certificate: "GDPR-2025-789",
      pendingActions: 0,
      jurisdiction: "European Union"
    },
    {
      id: 2,
      name: "SOC 2",
      fullName: "Service Organization Control 2",
      status: "Compliant",
      score: 96,
      lastAudit: "2025-06-15",
      nextAudit: "2025-12-15",
      certificate: "SOC2-2025-456",
      pendingActions: 1,
      jurisdiction: "United States"
    },
    {
      id: 3,
      name: "ISO 27001",
      fullName: "Information Security Management",
      status: "Compliant",
      score: 94,
      lastAudit: "2025-05-20",
      nextAudit: "2025-11-20",
      certificate: "ISO27001-2025-123",
      pendingActions: 0,
      jurisdiction: "International"
    },
    {
      id: 4,
      name: "SEC",
      fullName: "Securities and Exchange Commission",
      status: "Compliant",
      score: 92,
      lastAudit: "2025-04-10",
      nextAudit: "2025-07-10",
      certificate: "SEC-2025-321",
      pendingActions: 1,
      jurisdiction: "United States"
    },
    {
      id: 5,
      name: "MiFID II",
      fullName: "Markets in Financial Instruments Directive",
      status: "Pending Review",
      score: 87,
      lastAudit: "2025-03-15",
      nextAudit: "2025-09-15",
      certificate: "MiFID-2025-654",
      pendingActions: 2,
      jurisdiction: "European Union"
    },
    {
      id: 6,
      name: "CCPA",
      fullName: "California Consumer Privacy Act",
      status: "Compliant",
      score: 95,
      lastAudit: "2025-06-01",
      nextAudit: "2025-12-01",
      certificate: "CCPA-2025-987",
      pendingActions: 0,
      jurisdiction: "California, USA"
    }
  ];

  const auditHistory = [
    {
      id: 1,
      date: "2025-07-05",
      framework: "GDPR",
      auditor: "TrustCert Solutions",
      result: "Passed",
      score: 98,
      findings: 2,
      recommendations: 1
    },
    {
      id: 2,
      date: "2025-06-15",
      framework: "SOC 2",
      auditor: "SecureAudit Corp",
      result: "Passed",
      score: 96,
      findings: 3,
      recommendations: 2
    },
    {
      id: 3,
      date: "2025-06-01",
      framework: "CCPA",
      auditor: "PrivacyCheck Inc",
      result: "Passed",
      score: 95,
      findings: 1,
      recommendations: 1
    },
    {
      id: 4,
      date: "2025-05-20",
      framework: "ISO 27001",
      auditor: "InfoSec Auditors",
      result: "Passed",
      score: 94,
      findings: 4,
      recommendations: 3
    },
    {
      id: 5,
      date: "2025-04-10",
      framework: "SEC",
      auditor: "Financial Compliance LLC",
      result: "Passed",
      score: 92,
      findings: 2,
      recommendations: 2
    }
  ];

  const pendingActions = [
    {
      id: 1,
      framework: "SOC 2",
      action: "Update access control documentation",
      priority: "Medium",
      dueDate: "2025-08-15",
      assignee: "Security Team",
      description: "Review and update user access control policies and procedures"
    },
    {
      id: 2,
      framework: "MiFID II",
      action: "Implement transaction reporting system",
      priority: "High",
      dueDate: "2025-07-25",
      assignee: "Compliance Team",
      description: "Deploy automated transaction reporting system for EU markets"
    },
    {
      id: 3,
      framework: "MiFID II",
      action: "Update data retention policies",
      priority: "Medium",
      dueDate: "2025-08-01",
      assignee: "Data Team",
      description: "Align data retention policies with MiFID II requirements"
    },
    {
      id: 4,
      framework: "SEC",
      action: "Quarterly compliance review",
      priority: "Low",
      dueDate: "2025-08-10",
      assignee: "Legal Team",
      description: "Conduct quarterly SEC compliance assessment and documentation"
    }
  ];

  const datasetCompliance = [
    {
      dataset: "S&P 500 Historical Data",
      frameworks: ["SEC", "SOC 2", "ISO 27001"],
      overallScore: 96,
      issues: 0,
      lastReview: "2025-07-10"
    },
    {
      dataset: "Federal Reserve Economic Data",
      frameworks: ["SEC", "SOC 2"],
      overallScore: 94,
      issues: 1,
      lastReview: "2025-07-08"
    },
    {
      dataset: "Cryptocurrency Trading Pairs",
      frameworks: ["GDPR", "CCPA", "SOC 2"],
      overallScore: 98,
      issues: 0,
      lastReview: "2025-07-12"
    },
    {
      dataset: "Corporate Bond Yields",
      frameworks: ["SEC", "MiFID II"],
      overallScore: 87,
      issues: 2,
      lastReview: "2025-07-05"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending Review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Non-Compliant": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Compliant": return <CheckCircle className="h-4 w-4" />;
      case "Pending Review": return <Clock className="h-4 w-4" />;
      case "Non-Compliant": return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 90) return "text-blue-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Compliance Status</h1>
            <p className="text-muted-foreground">Monitor regulatory adherence with compliance badges, audit logs, and pending actions.</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="gdpr">GDPR</SelectItem>
                <SelectItem value="soc2">SOC 2</SelectItem>
                <SelectItem value="iso27001">ISO 27001</SelectItem>
                <SelectItem value="sec">SEC</SelectItem>
                <SelectItem value="mifid2">MiFID II</SelectItem>
                <SelectItem value="ccpa">CCPA</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Compliance Report
            </Button>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid gap-6 md:grid-cols-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(complianceOverview.overallScore)}`}>
                {complianceOverview.overallScore}%
              </div>
              <p className="text-xs text-muted-foreground">Compliance rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frameworks</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complianceOverview.activeFrameworks}</div>
              <p className="text-xs text-muted-foreground">Active compliance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{complianceOverview.pendingActions}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{new Date(complianceOverview.lastAudit).toLocaleDateString()}</div>
              <p className="text-xs text-muted-foreground">GDPR review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Audit</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{new Date(complianceOverview.nextAudit).toLocaleDateString()}</div>
              <p className="text-xs text-muted-foreground">In 82 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{complianceOverview.certifications}</div>
              <p className="text-xs text-muted-foreground">Valid certificates</p>
            </CardContent>
          </Card>
        </div>

        {/* Regulatory Frameworks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Regulatory Framework Compliance</CardTitle>
            <CardDescription>Status and scores for each compliance framework</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Framework</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Last Audit</TableHead>
                  <TableHead>Next Audit</TableHead>
                  <TableHead>Pending Actions</TableHead>
                  <TableHead>Jurisdiction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regulatoryFrameworks.map((framework) => (
                  <TableRow key={framework.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{framework.name}</div>
                        <div className="text-sm text-muted-foreground">{framework.fullName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(framework.status)}>
                        {getStatusIcon(framework.status)}
                        <span className="ml-1">{framework.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={framework.score} className="h-2 w-16" />
                        <span className={`font-medium ${getScoreColor(framework.score)}`}>
                          {framework.score}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{framework.certificate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(framework.lastAudit).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {new Date(framework.nextAudit).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {framework.pendingActions > 0 ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span>{framework.pendingActions}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{framework.jurisdiction}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Compliance Actions</CardTitle>
            <CardDescription>Outstanding tasks and compliance updates required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingActions.map((action) => (
                <div key={action.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{action.action}</h4>
                        <Badge variant="outline">{action.framework}</Badge>
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(action.dueDate).toLocaleDateString()}
                        </div>
                        <div>Assigned to: {action.assignee}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Recent Audit History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit History</CardTitle>
              <CardDescription>Latest compliance audits and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditHistory.map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{audit.framework}</span>
                        <Badge className={audit.result === "Passed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}>
                          {audit.result}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(audit.date).toLocaleDateString()} • {audit.auditor}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {audit.findings} findings, {audit.recommendations} recommendations
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(audit.score)}`}>
                        {audit.score}%
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Audits
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dataset Compliance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Dataset Compliance Summary</CardTitle>
              <CardDescription>Compliance status by dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {datasetCompliance.map((dataset, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{dataset.dataset}</h4>
                        <div className="text-sm text-muted-foreground">
                          Last review: {new Date(dataset.lastReview).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(dataset.overallScore)}`}>
                          {dataset.overallScore}%
                        </div>
                        {dataset.issues > 0 && (
                          <div className="text-sm text-red-600">{dataset.issues} issues</div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dataset.frameworks.map((framework, fIdx) => (
                        <Badge key={fIdx} variant="secondary" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}