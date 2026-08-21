import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText, TrendingUp, Shield, Brain, ChevronRight, Calendar, Plus, Download } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { generatePDFReport } from "@/utils/reportGenerator";

interface InvestorReportsProps {
  reports: any[];
}

export default function InvestorReports({ reports }: InvestorReportsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate new report mutation
  const generateReportMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/reports/generate");
    },
    onSuccess: () => {
      toast({
        title: "Report Generated",
        description: "A new investor report has been generated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate report. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const handleGenerateReport = () => {
    setIsGenerating(true);
    generateReportMutation.mutate();
  };

  // Download report function
  const handleDownloadReport = async (reportType: string) => {
    try {
      await generatePDFReport(reportType);
      toast({
        title: "Download Complete",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Default reports if no data
  const defaultReports = [
    {
      type: "monthly_performance",
      title: "Monthly AI Performance Review",
      status: "generated",
      lastUpdated: new Date().toISOString(),
      metadata: { icon: "trending-up", description: "Last updated: Jan 15, 2025" }
    },
    {
      type: "risk_compliance",
      title: "Risk & Compliance Analysis",
      status: "generated",
      lastUpdated: new Date().toISOString(),
      metadata: { icon: "shield", description: "Updated daily" }
    },
    {
      type: "portfolio_optimization",
      title: "Portfolio Optimization",
      status: "generated",
      lastUpdated: new Date().toISOString(),
      metadata: { icon: "brain", description: "AI-powered suggestions" }
    }
  ];

  const reportsList = reports && reports.length > 0 ? reports : defaultReports;

  const getIcon = (type: string) => {
    switch (type) {
      case "monthly_performance":
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case "risk_compliance":
        return <Shield className="h-4 w-4 text-blue-400" />;
      case "portfolio_optimization":
        return <Brain className="h-4 w-4 text-primary" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDescription = (report: any) => {
    if (report.metadata?.description) {
      return report.metadata.description;
    }
    
    switch (report.type) {
      case "monthly_performance":
        return "Last updated: Jan 15, 2025";
      case "risk_compliance":
        return "Updated daily";
      case "portfolio_optimization":
        return "AI-powered suggestions";
      default:
        return `Updated: ${new Date(report.lastUpdated).toLocaleDateString()}`;
    }
  };

  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Investor Reports</span>
        </CardTitle>
        <Link href="/reports/all">
          <Button variant="ghost" size="sm">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reportsList.map((report, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getIcon(report.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{report.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {getDescription(report)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.status === 'generated' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {report.status === 'generated' ? 'Ready' : 'Processing'}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadReport(report.type);
                }}
                disabled={report.status !== 'generated'}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGenerateReport}
            disabled={isGenerating || generateReportMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isGenerating || generateReportMutation.isPending ? "Generating..." : "Generate New Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
