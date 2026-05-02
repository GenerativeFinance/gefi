import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Eye,
  Download,
  RefreshCw,
  Users,
  Building,
  Globe
} from "lucide-react";

export default function DataProviderCollaborationCompliance() {
  // Sample compliance data
  const complianceData = {
    overallScore: 94,
    frameworks: [
      { name: "GDPR", score: 96, status: "compliant", lastAudit: "2024-12-15" },
      { name: "CCPA", score: 92, status: "compliant", lastAudit: "2024-11-28" },
      { name: "SOX", score: 89, status: "compliant", lastAudit: "2024-12-01" },
      { name: "MiFID II", score: 91, status: "compliant", lastAudit: "2024-12-10" }
    ],
    partnerships: [
      {
        partner: "FinTech Analytics Corp",
        complianceScore: 95,
        status: "compliant",
        frameworks: ["GDPR", "SOX"],
        lastReview: "2024-12-20",
        issues: 0
      },
      {
        partner: "AI Trading Solutions",
        complianceScore: 88,
        status: "under_review",
        frameworks: ["CCPA", "MiFID II"],
        lastReview: "2024-12-18",
        issues: 2
      },
      {
        partner: "RegTech Compliance Ltd",
        complianceScore: 97,
        status: "compliant",
        frameworks: ["GDPR", "CCPA", "SOX"],
        lastReview: "2024-12-22",
        issues: 0
      }
    ],
    recentActions: [
      {
        action: "GDPR Compliance Review Completed",
        timestamp: "2024-12-22 14:30",
        status: "completed",
        partner: "All Partners"
      },
      {
        action: "Data Processing Agreement Updated",
        timestamp: "2024-12-21 10:15",
        status: "completed",
        partner: "AI Trading Solutions"
      },
      {
        action: "Privacy Impact Assessment",
        timestamp: "2024-12-20 16:45",
        status: "in_progress",
        partner: "FinTech Analytics Corp"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "default";
      case "under_review": return "secondary";
      case "non_compliant": return "destructive";
      default: return "outline";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Compliance Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage compliance across all partnerships and data sharing agreements
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(complianceData.overallScore)}`}>
                    {complianceData.overallScore}/100
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
                  <p className="text-sm font-medium text-muted-foreground">Compliant Partners</p>
                  <p className="text-2xl font-bold">
                    {complianceData.partnerships.filter(p => p.status === "compliant").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                  <p className="text-2xl font-bold">
                    {complianceData.partnerships.filter(p => p.status === "under_review").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Issues</p>
                  <p className="text-2xl font-bold">
                    {complianceData.partnerships.reduce((sum, p) => sum + p.issues, 0)}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="frameworks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="frameworks">Compliance Frameworks</TabsTrigger>
            <TabsTrigger value="partnerships">Partnership Compliance</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="frameworks">
            <div className="grid gap-6">
              {complianceData.frameworks.map((framework, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{framework.name}</CardTitle>
                        <CardDescription>
                          Last audit: {new Date(framework.lastAudit).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(framework.status)}>
                        {framework.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Compliance Score</span>
                        <span className={`font-bold ${getScoreColor(framework.score)}`}>
                          {framework.score}/100
                        </span>
                      </div>
                      <Progress value={framework.score} className="h-2" />
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Audit Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Run Audit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partnerships">
            <div className="space-y-6">
              {complianceData.partnerships.map((partnership, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{partnership.partner}</CardTitle>
                        <CardDescription>
                          Last review: {new Date(partnership.lastReview).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(partnership.status)}>
                          {partnership.status}
                        </Badge>
                        {partnership.issues > 0 && (
                          <Badge variant="destructive">
                            {partnership.issues} issue{partnership.issues > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Compliance Score</span>
                        <span className={`font-bold ${getScoreColor(partnership.complianceScore)}`}>
                          {partnership.complianceScore}/100
                        </span>
                      </div>
                      <Progress value={partnership.complianceScore} className="h-2" />
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Applicable Frameworks</p>
                        <div className="flex flex-wrap gap-2">
                          {partnership.frameworks.map((framework, idx) => (
                            <Badge key={idx} variant="outline">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Building className="h-4 w-4 mr-1" />
                          Data Agreement
                        </Button>
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4 mr-1" />
                          Privacy Policy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Compliance Activities</CardTitle>
                <CardDescription>Latest compliance actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceData.recentActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {action.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{action.action}</h3>
                          <p className="text-sm text-muted-foreground">
                            {action.partner} • {action.timestamp}
                          </p>
                        </div>
                      </div>
                      <Badge variant={action.status === "completed" ? "default" : "secondary"}>
                        {action.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}