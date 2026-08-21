import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Award,
  AlertCircle,
  Eye,
  Lock
} from "lucide-react";

export default function DeveloperCompliance() {
  // Sample compliance data
  const complianceStatus = [
    {
      id: 1,
      modelName: "High-Frequency Trading Algorithm",
      frameworks: [
        { name: "SEC Compliant", status: "compliant", badge: true, lastAudit: "2025-07-05" },
        { name: "MiFID II", status: "compliant", badge: true, lastAudit: "2025-06-20" },
        { name: "GDPR", status: "compliant", badge: true, lastAudit: "2025-07-01" },
        { name: "SOC 2", status: "pending", badge: false, lastAudit: "2025-06-15" }
      ],
      overallScore: 92,
      lastReview: "2025-07-05",
      nextReview: "2025-10-05"
    },
    {
      id: 2,
      modelName: "Portfolio Risk Assessment",
      frameworks: [
        { name: "SEC Compliant", status: "compliant", badge: true, lastAudit: "2025-06-28" },
        { name: "Basel III", status: "compliant", badge: true, lastAudit: "2025-07-10" },
        { name: "GDPR", status: "compliant", badge: true, lastAudit: "2025-06-25" },
        { name: "ISO 27001", status: "compliant", badge: true, lastAudit: "2025-07-02" }
      ],
      overallScore: 96,
      lastReview: "2025-07-10",
      nextReview: "2025-10-10"
    },
    {
      id: 3,
      modelName: "ESG Investment Screener",
      frameworks: [
        { name: "EU Taxonomy", status: "compliant", badge: true, lastAudit: "2025-07-08" },
        { name: "SFDR", status: "compliant", badge: true, lastAudit: "2025-07-12" },
        { name: "GDPR", status: "compliant", badge: true, lastAudit: "2025-07-03" },
        { name: "PRI Compliance", status: "under_review", badge: false, lastAudit: "2025-06-30" }
      ],
      overallScore: 88,
      lastReview: "2025-07-12",
      nextReview: "2025-10-12"
    },
    {
      id: 4,
      modelName: "Market Sentiment Analyzer",
      frameworks: [
        { name: "SEC Compliant", status: "compliant", badge: true, lastAudit: "2025-07-01" },
        { name: "GDPR", status: "compliant", badge: true, lastAudit: "2025-06-28" },
        { name: "CCPA", status: "pending", badge: false, lastAudit: "2025-06-20" },
        { name: "SOC 2", status: "under_review", badge: false, lastAudit: "2025-06-25" }
      ],
      overallScore: 85,
      lastReview: "2025-07-01",
      nextReview: "2025-10-01"
    }
  ];

  const auditLogs = [
    {
      id: 1,
      modelName: "High-Frequency Trading Algorithm",
      auditType: "SEC Compliance Review",
      auditor: "Financial Regulatory Services",
      date: "2025-07-05",
      status: "passed",
      reportUrl: "/reports/sec-audit-hft-2025-07-05.pdf",
      findings: 0,
      recommendations: 2
    },
    {
      id: 2,
      modelName: "Portfolio Risk Assessment",
      auditType: "Basel III Risk Framework",
      auditor: "Risk Compliance Associates",
      date: "2025-07-10",
      status: "passed",
      reportUrl: "/reports/basel-audit-pra-2025-07-10.pdf",
      findings: 0,
      recommendations: 1
    },
    {
      id: 3,
      modelName: "ESG Investment Screener",
      auditType: "EU Taxonomy Alignment",
      auditor: "ESG Verification Ltd",
      date: "2025-07-08",
      status: "passed",
      reportUrl: "/reports/eu-taxonomy-esg-2025-07-08.pdf",
      findings: 0,
      recommendations: 3
    },
    {
      id: 4,
      modelName: "Market Sentiment Analyzer",
      auditType: "GDPR Data Processing",
      auditor: "Privacy Compliance Group",
      date: "2025-06-28",
      status: "passed",
      reportUrl: "/reports/gdpr-audit-msa-2025-06-28.pdf",
      findings: 1,
      recommendations: 2
    }
  ];

  const pendingIssues = [
    {
      id: 1,
      modelName: "High-Frequency Trading Algorithm",
      issue: "SOC 2 Type II certification renewal required",
      priority: "medium",
      dueDate: "2025-08-15",
      status: "in_progress",
      assignee: "Security Team"
    },
    {
      id: 2,
      modelName: "Market Sentiment Analyzer",
      issue: "CCPA privacy policy update needed",
      priority: "high",
      dueDate: "2025-07-25",
      status: "pending",
      assignee: "Legal Team"
    },
    {
      id: 3,
      modelName: "ESG Investment Screener",
      issue: "PRI compliance documentation review",
      priority: "low",
      dueDate: "2025-08-30",
      status: "pending",
      assignee: "Compliance Officer"
    }
  ];

  const overallMetrics = {
    averageScore: 90.25,
    compliantModels: 4,
    totalFrameworks: 15,
    compliantFrameworks: 12,
    pendingActions: 3,
    lastAuditDate: "2025-07-12"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "under_review":
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "non_compliant":
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
      case "passed":
        return <CheckCircle className="h-3 w-3" />;
      case "under_review":
      case "in_progress":
        return <Clock className="h-3 w-3" />;
      case "pending":
        return <AlertTriangle className="h-3 w-3" />;
      case "non_compliant":
      case "failed":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Compliance Management</h1>
            <p className="text-muted-foreground">
              Monitor regulatory adherence, audit logs, and compliance issues
            </p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(overallMetrics.averageScore)}`}>
                    {overallMetrics.averageScore}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliant Models</p>
                  <p className="text-2xl font-bold">{overallMetrics.compliantModels}/4</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Framework Coverage</p>
                  <p className="text-2xl font-bold">{overallMetrics.compliantFrameworks}/{overallMetrics.totalFrameworks}</p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Actions</p>
                  <p className="text-2xl font-bold text-orange-600">{overallMetrics.pendingActions}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Details */}
        <Tabs defaultValue="adherence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="adherence">Regulatory Adherence</TabsTrigger>
            <TabsTrigger value="audits">Audit Logs</TabsTrigger>
            <TabsTrigger value="issues">Pending Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="adherence" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {complianceStatus.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{model.modelName}</CardTitle>
                        <CardDescription>Compliance status across regulatory frameworks</CardDescription>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${getScoreColor(model.overallScore)}`}>
                          {model.overallScore}%
                        </p>
                        <p className="text-xs text-muted-foreground">Overall Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Compliance Frameworks */}
                      <div className="space-y-3">
                        {model.frameworks.map((framework, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(framework.status)}>
                                {getStatusIcon(framework.status)}
                                <span className="ml-1">{framework.status.replace('_', ' ').toUpperCase()}</span>
                              </Badge>
                              <div>
                                <p className="font-medium">{framework.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Last audit: {new Date(framework.lastAudit).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {framework.badge && (
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">Certified</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Review Dates */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Last Review: {new Date(model.lastReview).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Next Review: {new Date(model.nextReview).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Reports & Documentation</CardTitle>
                <CardDescription>Links to audit reports and regulatory reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((audit) => (
                    <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          audit.status === "passed" 
                            ? "bg-green-100 dark:bg-green-900" 
                            : "bg-red-100 dark:bg-red-900"
                        }`}>
                          {audit.status === "passed" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{audit.auditType}</h3>
                          <p className="text-sm text-muted-foreground">{audit.modelName}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Auditor: {audit.auditor}</span>
                            <span>Date: {new Date(audit.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs">
                            <span className="text-red-600">{audit.findings} findings</span>
                            <span className="text-blue-600">{audit.recommendations} recommendations</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(audit.status)}>
                          {audit.status.toUpperCase()}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Compliance Actions</CardTitle>
                <CardDescription>Items requiring attention for regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingIssues.map((issue) => (
                    <div key={issue.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{issue.issue}</h3>
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority.toUpperCase()} PRIORITY
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{issue.modelName}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                            <span>Assigned to: {issue.assignee}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(issue.status)}>
                            {getStatusIcon(issue.status)}
                            <span className="ml-1">{issue.status.replace('_', ' ').toUpperCase()}</span>
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                      
                      {/* Progress indicator for overdue items */}
                      {new Date(issue.dueDate) < new Date() && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Overdue - Immediate attention required</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Summary</CardTitle>
                <CardDescription>Overview of pending compliance actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                    <p className="text-sm text-muted-foreground">Medium Priority</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">1</p>
                    <p className="text-sm text-muted-foreground">Low Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}