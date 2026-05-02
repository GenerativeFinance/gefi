import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Calendar, TrendingUp, Shield, FileCheck } from "lucide-react";
import { useState } from "react";

export default function AllReports() {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const allReports = [
    {
      id: "1",
      name: "Portfolio Performance Report",
      type: "performance",
      date: "2024-01-15",
      status: "ready",
      description: "Comprehensive portfolio analysis and performance metrics"
    },
    {
      id: "2", 
      name: "Risk Assessment Report",
      type: "risk",
      date: "2024-01-14",
      status: "ready",
      description: "Detailed risk analysis and stress test results"
    },
    {
      id: "3",
      name: "Compliance Audit Report",
      type: "compliance", 
      date: "2024-01-13",
      status: "ready",
      description: "Regulatory compliance and audit findings"
    },
    {
      id: "4",
      name: "AI Model Performance",
      type: "performance",
      date: "2024-01-12",
      status: "ready",
      description: "AI-driven portfolio optimization performance review"
    },
    {
      id: "5",
      name: "Market Analysis Report",
      type: "performance",
      date: "2024-01-11", 
      status: "ready",
      description: "Market trends and investment opportunities analysis"
    },
    {
      id: "6",
      name: "Monthly Risk Dashboard",
      type: "risk",
      date: "2024-01-10",
      status: "ready",
      description: "Monthly risk metrics and exposure analysis"
    }
  ];

  const handleDownload = async (reportId: string, reportName: string, type: string) => {
    setDownloadingId(reportId);
    
    try {
      const { exportAndDownload } = await import("@/lib/reports");
      
      const template = type === "risk" ? "risk" : 
                      type === "compliance" ? "compliance" : "performance";
      
      const res = await exportAndDownload({
        template,
        input: {
          title: reportName,
          period: "Last 30 days",
          generatedBy: "GeFi",
          summary: `Generated ${reportName} with comprehensive analysis and insights.`,
          metrics: [
            { label: "Performance", value: "+12.3%" },
            { label: "Assets", value: "45" },
            { label: "Risk Score", value: "7.2/10" },
          ],
          sections: [
            {
              heading: "Executive Summary",
              body: "This report provides detailed analysis of key performance indicators and risk metrics."
            }
          ]
        }
      });

      if (!res?.downloadUrl) {
        throw new Error("No download URL returned");
      }
      
      toast({
        title: "Report Downloaded",
        description: `${reportName} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'risk': return <Shield className="h-4 w-4" />;
      case 'compliance': return <FileCheck className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getReportColor = (type: string) => {
    switch (type) {
      case 'risk': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'compliance': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Reports</h1>
          <p className="text-muted-foreground">
            Access and download all your generated reports
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {allReports.length} Reports Available
        </Badge>
      </div>

      <div className="grid gap-4">
        {allReports.map((report) => (
          <Card key={report.id} className="glass hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{report.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {report.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                      <Badge className={getReportColor(report.type)}>
                        {getReportIcon(report.type)}
                        <span className="ml-1 capitalize">{report.type}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(report.id, report.name, report.type)}
                  disabled={downloadingId === report.id}
                  size="sm"
                  className="ml-4"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {downloadingId === report.id ? "Downloading..." : "Download"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {allReports.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Reports Available</h3>
            <p className="text-muted-foreground">
              Generate your first report from the Reports Dashboard.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}