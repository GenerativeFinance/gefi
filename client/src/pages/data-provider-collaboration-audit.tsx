import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Filter, 
  Download,
  Eye,
  Calendar,
  User,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function DataProviderCollaborationAudit() {
  // Sample audit data
  const auditData = {
    summary: {
      totalAudits: 45,
      completedAudits: 38,
      pendingAudits: 5,
      failedAudits: 2
    },
    recentAudits: [
      {
        id: 1,
        title: "GDPR Compliance Audit - FinTech Analytics",
        type: "Privacy Compliance",
        status: "completed",
        score: 96,
        auditor: "Sarah Johnson",
        date: "2024-12-22",
        partner: "FinTech Analytics Corp",
        findings: 2,
        priority: "low"
      },
      {
        id: 2,
        title: "Data Access Audit - AI Trading Solutions",
        type: "Access Control",
        status: "in_progress",
        score: null,
        auditor: "Michael Chen",
        date: "2024-12-20",
        partner: "AI Trading Solutions",
        findings: 0,
        priority: "medium"
      },
      {
        id: 3,
        title: "Security Audit - RegTech Compliance",
        type: "Security Assessment",
        status: "completed",
        score: 94,
        auditor: "Emma Williams",
        date: "2024-12-18",
        partner: "RegTech Compliance Ltd",
        findings: 1,
        priority: "low"
      },
      {
        id: 4,
        title: "Data Quality Audit - All Partners",
        type: "Data Quality",
        status: "scheduled",
        score: null,
        auditor: "David Brown",
        date: "2024-12-25",
        partner: "All Partners",
        findings: 0,
        priority: "high"
      }
    ],
    auditLogs: [
      {
        timestamp: "2024-12-22 15:30:00",
        action: "Audit Completed",
        user: "Sarah Johnson",
        target: "FinTech Analytics Corp",
        details: "GDPR compliance audit completed with score 96/100"
      },
      {
        timestamp: "2024-12-22 14:15:00",
        action: "Finding Logged",
        user: "Sarah Johnson",
        target: "FinTech Analytics Corp",
        details: "Minor data retention policy update needed"
      },
      {
        timestamp: "2024-12-21 10:20:00",
        action: "Audit Started",
        user: "Michael Chen",
        target: "AI Trading Solutions",
        details: "Access control audit initiated for Q4 review"
      },
      {
        timestamp: "2024-12-20 16:45:00",
        action: "Report Generated",
        user: "Emma Williams",
        target: "RegTech Compliance Ltd",
        details: "Security audit report generated and distributed"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in_progress": return "secondary";
      case "scheduled": return "outline";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "";
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Audit Management</h1>
            <p className="text-muted-foreground">
              Track audit activities, compliance reviews, and access logs for all partnerships
            </p>
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Schedule Audit
          </Button>
        </div>

        {/* Audit Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Audits</p>
                  <p className="text-2xl font-bold">{auditData.summary.totalAudits}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{auditData.summary.completedAudits}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">{auditData.summary.pendingAudits}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issues Found</p>
                  <p className="text-2xl font-bold text-red-600">{auditData.summary.failedAudits}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="audits" className="space-y-6">
          <TabsList>
            <TabsTrigger value="audits">Recent Audits</TabsTrigger>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="reports">Audit Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="audits">
            {/* Search and Filters */}
            <div className="flex justify-between items-center mb-6">
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

            {/* Audits List */}
            <div className="space-y-4">
              {auditData.recentAudits.map((audit) => (
                <Card key={audit.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{audit.title}</CardTitle>
                        <CardDescription>
                          {audit.type} • {audit.partner}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(audit.status)}>
                          {audit.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityColor(audit.priority)}>
                          {audit.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Auditor</p>
                        <p className="font-medium">{audit.auditor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(audit.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className={`font-medium ${getScoreColor(audit.score)}`}>
                          {audit.score ? `${audit.score}/100` : "Pending"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Findings</p>
                        <p className="font-medium">
                          {audit.findings} issue{audit.findings !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download Report
                      </Button>
                      {audit.status === "scheduled" && (
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Audit Activity Logs</CardTitle>
                <CardDescription>Chronological record of all audit activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditData.auditLogs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{log.action}</h3>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          By {log.user} • Target: {log.target}
                        </p>
                        <p className="text-sm">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quarterly Compliance Report</CardTitle>
                  <CardDescription>Comprehensive compliance overview for Q4 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Generated: December 22, 2024</p>
                      <p className="text-sm text-muted-foreground">
                        Covers all partnerships and compliance frameworks
                      </p>
                    </div>
                    <Button>
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partnership Audit Summary</CardTitle>
                  <CardDescription>Individual audit reports for each partnership</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {auditData.recentAudits
                      .filter(audit => audit.status === "completed")
                      .map((audit, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{audit.partner}</p>
                          <p className="text-sm text-muted-foreground">
                            Score: {audit.score}/100 • {audit.findings} findings
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
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