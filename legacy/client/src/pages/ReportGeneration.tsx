import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import GenerateReportButton from "@/components/reports/GenerateReportButton";
import { listReports, deleteReport, downloadReport, type ReportMetadata } from "@/lib/reportGenerator";
import {
  FileText,
  Download,
  Trash2,
  Calendar,
  Eye,
  RefreshCw,
  TrendingUp,
  Shield,
  AlertTriangle,
  Plus,
  Clock
} from "lucide-react";

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800";
    case "processing": return "bg-blue-100 text-blue-800";
    case "failed": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getTemplateIcon(template: string) {
  switch (template) {
    case "performance": return <TrendingUp className="h-4 w-4 text-blue-600" />;
    case "risk": return <Shield className="h-4 w-4 text-orange-600" />;
    case "compliance": return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default: return <FileText className="h-4 w-4 text-gray-600" />;
  }
}

export default function ReportGeneration() {
  const { toast } = useToast();

  // Fetch existing reports
  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ["generated-reports"],
    queryFn: listReports,
    refetchInterval: 10000, // Refetch every 10 seconds to check status updates
  });

  // Delete report handler
  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteReport(reportId);
      toast({
        title: "Report Deleted",
        description: "The report has been successfully deleted.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  // Download report handler
  const handleDownload = (report: ReportMetadata) => {
    if (report.status !== "completed") {
      toast({
        title: "Report Not Ready",
        description: "This report is still being processed. Please wait.",
        variant: "destructive",
      });
      return;
    }

    downloadReport(report.id, report.filename);
    toast({
      title: "Download Started",
      description: "Your report download has begun.",
    });
  };

  const completedReports = reports.filter((r) => r.status === "completed");
  const processingReports = reports.filter((r) => r.status === "processing");
  const failedReports = reports.filter((r) => r.status === "failed");

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Report Generation</h1>
            <p className="text-muted-foreground">Create and manage professional PDF reports</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Generation Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Generate New Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <GenerateReportButton
                    template="performance"
                    defaultData={{
                      title: "Portfolio Performance Report",
                      period: "last-30-days",
                      summary: "Comprehensive analysis of portfolio performance and key metrics"
                    }}
                    buttonText="Performance Report"
                    buttonVariant="default"
                    buttonSize="default"
                    className="w-full justify-start"
                  />

                  <GenerateReportButton
                    template="risk"
                    defaultData={{
                      title: "Risk Assessment Report",
                      period: "current",
                      summary: "Detailed risk analysis and compliance monitoring"
                    }}
                    buttonText="Risk Assessment"
                    buttonVariant="default"
                    buttonSize="default"
                    className="w-full justify-start"
                  />

                  <GenerateReportButton
                    template="compliance"
                    defaultData={{
                      title: "Compliance Report",
                      period: "last-quarter",
                      summary: "Regulatory compliance assessment and audit findings"
                    }}
                    buttonText="Compliance Report"
                    buttonVariant="default"
                    buttonSize="default"
                    className="w-full justify-start"
                  />

                  <GenerateReportButton
                    template="custom"
                    defaultData={{
                      title: "Custom Report",
                      period: "custom",
                      summary: "Build a report with your specific requirements"
                    }}
                    buttonText="Custom Report"
                    buttonVariant="outline"
                    buttonSize="default"
                    className="w-full justify-start"
                  />
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Report Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Reports</span>
                      <span className="text-sm font-medium">{reports.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="text-sm font-medium">{completedReports.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Processing</span>
                      <span className="text-sm font-medium">{processingReports.length}</span>
                    </div>
                    {failedReports.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Failed</span>
                        <span className="text-sm font-medium text-red-600">{failedReports.length}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reports List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Reports</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Loading reports...</p>
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No reports generated yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Use the quick generation panel to create your first report
                      </p>
                    </div>
                  ) : (
                    <Tabs defaultValue="completed" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="completed">Completed ({completedReports.length})</TabsTrigger>
                        <TabsTrigger value="processing">Processing ({processingReports.length})</TabsTrigger>
                        <TabsTrigger value="failed">Failed ({failedReports.length})</TabsTrigger>
                      </TabsList>

                      <TabsContent value="completed" className="space-y-4 mt-4">
                        {completedReports.map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {getTemplateIcon(report.template)}
                              <div>
                                <p className="font-medium">{report.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3 inline mr-1" />
                                    {formatDate(report.createdAt)}
                                  </span>
                                  {report.createdBy && (
                                    <span className="text-sm text-muted-foreground">• {report.createdBy}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleDownload(report)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(report.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="processing" className="space-y-4 mt-4">
                        {processingReports.map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                              <div>
                                <p className="font-medium">{report.title}</p>
                                <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="failed" className="space-y-4 mt-4">
                        {failedReports.map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <div>
                                <p className="font-medium">{report.title}</p>
                                <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                                {report.error && (
                                  <p className="text-sm text-red-600 mt-1">{report.error}</p>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(report.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}