import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generatePDFReport, type ReportData, type PDFCustomizations } from "@/lib/pdfGenerator";
import {
  FileText,
  Download,
  Calendar,
  Plus,
  Eye,
  Settings,
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";

export default function InvestorReports() {
  const [selectedReport, setSelectedReport] = useState("");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [reportSettings, setReportSettings] = useState({
    name: "",
    type: "",
    visualizations: [] as string[],
    layout: "portrait",
    period: "monthly",
    includeCharts: true,
    includeTables: true,
    includeRecommendations: true,
    customSections: ""
  });
  const { toast } = useToast();

  // Fetch reports from API
  const { data: reportsData, isLoading: isLoadingReports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const reports = (reportsData as any)?.data || [
    {
      id: 1,
      name: "Monthly AI Performance Review",
      icon: TrendingUp,
      lastUpdated: "Jan 15, 2025",
      status: "Ready",
      description: "AI-driven investment performance metrics and analysis",
      downloadCount: 1250,
      period: "Monthly"
    },
    {
      id: 2,
      name: "Risk & Compliance Analysis",
      icon: Shield,
      lastUpdated: "Updated daily",
      status: "Ready",
      description: "Risk assessments, compliance status, and mitigation strategies",
      downloadCount: 890,
      period: "Daily"
    },
    {
      id: 3,
      name: "Portfolio Optimization",
      icon: Target,
      lastUpdated: "AI-powered suggestions",
      status: "Ready",
      description: "Asset allocation recommendations and rebalancing strategies",
      downloadCount: 645,
      period: "Weekly"
    }
  ];

  const visualizationTypes = [
    { value: "line-chart", label: "Line Chart", icon: LineChart },
    { value: "bar-chart", label: "Bar Chart", icon: BarChart3 },
    { value: "pie-chart", label: "Pie Chart", icon: PieChart },
    { value: "heatmap", label: "Heatmap", icon: Activity },
    { value: "scatter-plot", label: "Scatter Plot", icon: Activity },
    { value: "table", label: "Data Table", icon: FileText }
  ];



  const handleDownloadReport = async (reportName: string, reportId?: string) => {
    try {
      const report = reports.find((r: any) => r.name === reportName || r.id === reportId) || 
                   { id: reportId || 'temp', name: reportName, status: 'ready', lastUpdated: new Date().toLocaleDateString(), type: 'performance' };
      
      // Convert to proper ReportData format
      const reportData: ReportData = {
        id: report.id.toString(),
        name: report.name,
        type: report.type || 'performance',
        status: report.status,
        lastUpdated: report.lastUpdated,
        description: report.description
      };
      
      // Generate PDF using the new generator
      const doc = generatePDFReport(reportData, { layout: 'portrait' });
      
      // Download the PDF
      const fileName = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "Report Downloaded",
        description: `${reportName} has been downloaded successfully as PDF.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = async () => {
    try {
      // Create a new custom report object
      const reportData: ReportData = {
        id: `custom-${Date.now()}`,
        name: reportSettings.name,
        type: reportSettings.type,
        status: 'ready',
        lastUpdated: new Date().toLocaleDateString(),
        description: `Custom ${reportSettings.type} report with ${reportSettings.visualizations.length} visualizations`
      };
      
      // Convert settings to PDFCustomizations
      const customizations: PDFCustomizations = {
        layout: reportSettings.layout as 'portrait' | 'landscape',
        includeCharts: reportSettings.includeCharts,
        includeTables: reportSettings.includeTables,
        includeRecommendations: reportSettings.includeRecommendations,
        visualizations: reportSettings.visualizations,
        period: reportSettings.period,
        customSections: reportSettings.customSections
      };
      
      // Generate PDF immediately for custom reports
      const doc = generatePDFReport(reportData, customizations);
      
      // Download the PDF
      const fileName = `${reportSettings.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "Report Generated",
        description: `${reportSettings.name} has been generated and downloaded successfully.`,
      });
      
      setIsGenerateOpen(false);
      setReportSettings({
        name: "",
        type: "",
        visualizations: [],
        layout: "portrait",
        period: "monthly",
        includeCharts: true,
        includeTables: true,
        includeRecommendations: true,
        customSections: ""
      });
    } catch (error) {
      console.error('Generate report error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate custom report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleVisualization = (viz: string) => {
    setReportSettings(prev => ({
      ...prev,
      visualizations: prev.visualizations.includes(viz)
        ? prev.visualizations.filter(v => v !== viz)
        : [...prev.visualizations, viz]
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              Investor Reports
            </h1>
            <p className="text-muted-foreground">Download and generate comprehensive investment reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="#all-reports">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Generate Custom Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-name">Report Name</Label>
                      <Input
                        id="report-name"
                        value={reportSettings.name}
                        onChange={(e) => setReportSettings({...reportSettings, name: e.target.value})}
                        placeholder="Custom Investment Analysis"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select value={reportSettings.type} onValueChange={(value) => setReportSettings({...reportSettings, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Performance Analysis</SelectItem>
                          <SelectItem value="risk">Risk Assessment</SelectItem>
                          <SelectItem value="compliance">Compliance Review</SelectItem>
                          <SelectItem value="portfolio">Portfolio Optimization</SelectItem>
                          <SelectItem value="market">Market Analysis</SelectItem>
                          <SelectItem value="custom">Custom Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Reporting Period</Label>
                      <Select value={reportSettings.period} onValueChange={(value) => setReportSettings({...reportSettings, period: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>PDF Layout</Label>
                      <Select value={reportSettings.layout} onValueChange={(value) => setReportSettings({...reportSettings, layout: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Portrait</SelectItem>
                          <SelectItem value="landscape">Landscape</SelectItem>
                          <SelectItem value="auto">Auto-adjust</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Export Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Visualizations</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {visualizationTypes.map((viz) => (
                        <div key={viz.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={viz.value}
                            checked={reportSettings.visualizations.includes(viz.value)}
                            onCheckedChange={() => toggleVisualization(viz.value)}
                          />
                          <Label htmlFor={viz.value} className="flex items-center gap-2 cursor-pointer">
                            <viz.icon className="h-4 w-4" />
                            {viz.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Content Options</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-charts"
                          checked={reportSettings.includeCharts}
                          onCheckedChange={(checked) => setReportSettings({...reportSettings, includeCharts: !!checked})}
                        />
                        <Label htmlFor="include-charts">Include Charts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-tables"
                          checked={reportSettings.includeTables}
                          onCheckedChange={(checked) => setReportSettings({...reportSettings, includeTables: !!checked})}
                        />
                        <Label htmlFor="include-tables">Include Data Tables</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-recommendations"
                          checked={reportSettings.includeRecommendations}
                          onCheckedChange={(checked) => setReportSettings({...reportSettings, includeRecommendations: !!checked})}
                        />
                        <Label htmlFor="include-recommendations">Include AI Recommendations</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-sections">Custom Sections (Optional)</Label>
                    <Textarea
                      id="custom-sections"
                      value={reportSettings.customSections}
                      onChange={(e) => setReportSettings({...reportSettings, customSections: e.target.value})}
                      placeholder="Describe any additional sections or specific metrics you want included..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGenerateReport}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingReports && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {/* Report Cards */}
        <div className="space-y-4">
          {reports.map((report: any) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <report.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{report.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{report.lastUpdated}</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {report.status}
                        </Badge>
                        <span>{report.downloadCount} downloads</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Customize {report.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Date Range</Label>
                              <Select defaultValue="last-30-days">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                                  <SelectItem value="last-90-days">Last 90 days</SelectItem>
                                  <SelectItem value="last-year">Last year</SelectItem>
                                  <SelectItem value="custom">Custom range</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Format</Label>
                              <Select defaultValue="pdf">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                  <SelectItem value="excel">Excel</SelectItem>
                                  <SelectItem value="csv">CSV</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Include Sections</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="executive-summary" defaultChecked />
                                <Label htmlFor="executive-summary">Executive Summary</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="detailed-analysis" defaultChecked />
                                <Label htmlFor="detailed-analysis">Detailed Analysis</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="charts-graphs" defaultChecked />
                                <Label htmlFor="charts-graphs">Charts & Graphs</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="recommendations" defaultChecked />
                                <Label htmlFor="recommendations">Recommendations</Label>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsCustomizeOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={async () => {
                              await handleDownloadReport(report.name, report.id);
                              setIsCustomizeOpen(false);
                            }}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button onClick={() => handleDownloadReport(report.name, report.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">Performance Summary</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Quick overview of portfolio performance and key metrics
                </p>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Risk Analysis</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Comprehensive risk assessment and compliance status
                </p>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">AI Recommendations</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  AI-powered suggestions for portfolio optimization
                </p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}