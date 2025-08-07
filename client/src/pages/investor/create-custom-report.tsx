import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { generatePDFReport, type ReportData, type PDFCustomizations } from "@/lib/pdfGenerator";
import {
  Settings,
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";

export default function CreateCustomReport() {
  const [reportSettings, setReportSettings] = useState({
    name: "",
    description: "",
    type: "",
    dateRange: "last-30-days",
    schedule: "weekly",
    metricsToInclude: [] as string[],
    visualizationTypes: [] as string[],
    layout: "portrait",
    format: "pdf"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const reportTypes = [
    { value: "performance", label: "Performance Analysis" },
    { value: "risk", label: "Risk Assessment" },
    { value: "compliance", label: "Compliance Review" },
    { value: "portfolio", label: "Portfolio Optimization" },
    { value: "market", label: "Market Analysis" },
    { value: "ai-insights", label: "AI Insights Report" }
  ];

  const metricsOptions = [
    "Portfolio VaR",
    "Credit Risk",
    "Market Risk",
    "Liquidity Risk",
    "Concentration Risk",
    "Correlation Matrix",
    "Stress Test Results"
  ];

  const visualizationOptions = [
    { value: "line-chart", label: "Line Chart", icon: LineChart },
    { value: "bar-chart", label: "Bar Chart", icon: BarChart3 },
    { value: "pie-chart", label: "Pie Chart", icon: PieChart },
    { value: "heatmap", label: "Heatmap", icon: Activity },
    { value: "table", label: "Data Table", icon: FileText }
  ];

  const toggleMetric = (metric: string) => {
    setReportSettings(prev => ({
      ...prev,
      metricsToInclude: prev.metricsToInclude.includes(metric)
        ? prev.metricsToInclude.filter(m => m !== metric)
        : [...prev.metricsToInclude, metric]
    }));
  };

  const toggleVisualization = (viz: string) => {
    setReportSettings(prev => ({
      ...prev,
      visualizationTypes: prev.visualizationTypes.includes(viz)
        ? prev.visualizationTypes.filter(v => v !== viz)
        : [...prev.visualizationTypes, viz]
    }));
  };

  const handleCreateReport = async () => {
    // Validation
    if (!reportSettings.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Report name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!reportSettings.type) {
      toast({
        title: "Validation Error",
        description: "Report type must be selected.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Create report data
      const reportData: ReportData = {
        id: `custom-${Date.now()}`,
        name: reportSettings.name,
        type: reportSettings.type,
        status: 'ready',
        lastUpdated: new Date().toLocaleDateString(),
        description: reportSettings.description || `Custom ${reportSettings.type} report`
      };

      // Convert settings to PDFCustomizations
      const customizations: PDFCustomizations = {
        layout: reportSettings.layout as 'portrait' | 'landscape',
        includeCharts: true,
        includeTables: true,
        includeRecommendations: true,
        visualizations: reportSettings.visualizationTypes,
        period: reportSettings.dateRange,
        customSections: reportSettings.description
      };

      // Generate PDF
      const doc = generatePDFReport(reportData, customizations);

      // Download the PDF
      const fileName = `${reportSettings.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "Report Created",
        description: `${reportSettings.name} has been generated and downloaded successfully.`,
      });

      // Reset form
      setReportSettings({
        name: "",
        description: "",
        type: "",
        dateRange: "last-30-days",
        schedule: "weekly",
        metricsToInclude: [],
        visualizationTypes: [],
        layout: "portrait",
        format: "pdf"
      });

    } catch (error) {
      console.error('Create report error:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create custom report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/investor/reports">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-500" />
              Create Custom Report
            </h1>
            <p className="text-muted-foreground">Build a custom report with your preferred metrics and visualizations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name *</Label>
                    <Input
                      id="report-name"
                      value={reportSettings.name}
                      onChange={(e) => setReportSettings({...reportSettings, name: e.target.value})}
                      placeholder="Q4 2025 Risk Analysis"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type *</Label>
                    <Select value={reportSettings.type} onValueChange={(value) => setReportSettings({...reportSettings, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={reportSettings.description}
                    onChange={(e) => setReportSettings({...reportSettings, description: e.target.value})}
                    placeholder="Describe what this report covers..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Range *</Label>
                    <Select value={reportSettings.dateRange} onValueChange={(value) => setReportSettings({...reportSettings, dateRange: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                        <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Schedule (Optional)</Label>
                    <Select value={reportSettings.schedule} onValueChange={(value) => setReportSettings({...reportSettings, schedule: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Metrics to Include</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {metricsOptions.map((metric) => (
                    <div key={metric} className="flex items-center space-x-2">
                      <Checkbox
                        id={metric}
                        checked={reportSettings.metricsToInclude.includes(metric)}
                        onCheckedChange={() => toggleMetric(metric)}
                      />
                      <Label htmlFor={metric} className="cursor-pointer">
                        {metric}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visualization Types */}
            <Card>
              <CardHeader>
                <CardTitle>Visualization Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {visualizationOptions.map((viz) => (
                    <div key={viz.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={viz.value}
                        checked={reportSettings.visualizationTypes.includes(viz.value)}
                        onCheckedChange={() => toggleVisualization(viz.value)}
                      />
                      <Label htmlFor={viz.value} className="flex items-center gap-2 cursor-pointer">
                        <viz.icon className="h-4 w-4" />
                        {viz.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Output Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Output Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Layout</Label>
                  <Select value={reportSettings.layout} onValueChange={(value) => setReportSettings({...reportSettings, layout: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select value={reportSettings.format} onValueChange={(value) => setReportSettings({...reportSettings, format: value})}>
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
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{reportSettings.name || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{reportTypes.find(t => t.value === reportSettings.type)?.label || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metrics:</span>
                    <span>{reportSettings.metricsToInclude.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visualizations:</span>
                    <span>{reportSettings.visualizationTypes.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create Button */}
            <Button 
              onClick={handleCreateReport}
              disabled={!reportSettings.name.trim() || !reportSettings.type || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                  Generating...
                </div>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Create Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}