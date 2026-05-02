import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, PieChart, Settings, Play, Save, Trash2, Eye, Copy } from "lucide-react";
import { format } from "date-fns";
import type { CustomReport } from "@shared/schema";

const REPORT_TYPES = [
  { value: 'portfolio', label: 'Portfolio Performance' },
  { value: 'risk', label: 'Risk Analysis' },
  { value: 'compliance', label: 'Compliance Report' },
  { value: 'market', label: 'Market Analysis' },
  { value: 'trading', label: 'Trading Activity' },
  { value: 'ai-models', label: 'AI Model Performance' },
  { value: 'revenue', label: 'Revenue & Earnings' },
  { value: 'custom', label: 'Custom Metrics' }
];

const DATE_RANGES = [
  { value: 'last-7-days', label: 'Last 7 Days' },
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'last-90-days', label: 'Last 90 Days' },
  { value: 'last-year', label: 'Last Year' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'custom', label: 'Custom Range' }
];

const AVAILABLE_METRICS = {
  portfolio: [
    'total_value', 'net_returns', 'sharpe_ratio', 'max_drawdown', 'volatility',
    'alpha', 'beta', 'sortino_ratio', 'calmar_ratio', 'var_95'
  ],
  risk: [
    'portfolio_var', 'credit_risk', 'market_risk', 'liquidity_risk',
    'concentration_risk', 'stress_test_results', 'correlation_matrix'
  ],
  trading: [
    'total_trades', 'win_rate', 'profit_factor', 'avg_trade_duration',
    'commission_costs', 'slippage', 'daily_pnl', 'monthly_pnl'
  ],
  market: [
    'price_movements', 'volume_analysis', 'sentiment_scores', 'volatility_index',
    'correlation_analysis', 'sector_performance', 'technical_indicators'
  ]
};

const VISUALIZATION_TYPES = [
  { value: 'line-chart', label: 'Line Chart', icon: TrendingUp },
  { value: 'bar-chart', label: 'Bar Chart', icon: BarChart3 },
  { value: 'pie-chart', label: 'Pie Chart', icon: PieChart },
  { value: 'table', label: 'Data Table', icon: FileText },
  { value: 'heatmap', label: 'Heat Map', icon: Settings },
  { value: 'scatter', label: 'Scatter Plot', icon: Settings }
];

export default function CustomReports() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("builder");
  
  // Report Builder State
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedVisualizations, setSelectedVisualizations] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [schedule, setSchedule] = useState("");

  // Fetch existing reports
  const { data: reportsResponse = {}, isLoading } = useQuery({
    queryKey: ["/api/reports"],
    retry: false,
  });

  const reports = reportsResponse.data || [];

  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: async (reportData: any) => {
      return apiRequest("POST", "/api/reports/test-generate", reportData);
    },
    onSuccess: () => {
      toast({
        title: "Report Created",
        description: "Your custom report has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Run report mutation
  const runReportMutation = useMutation({
    mutationFn: async (reportId: number) => {
      const response = await apiRequest("POST", `/api/custom-reports/${reportId}/run`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Generated",
        description: "Your report is being generated and will be available shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/custom-reports"] });
    },
  });

  // Delete report mutation
  const deleteReportMutation = useMutation({
    mutationFn: async (reportId: number) => {
      await apiRequest("DELETE", `/api/custom-reports/${reportId}`);
    },
    onSuccess: () => {
      toast({
        title: "Report Deleted",
        description: "The report has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/custom-reports"] });
    },
  });

  const resetForm = () => {
    setReportName("");
    setReportDescription("");
    setReportType("");
    setDateRange("");
    setSelectedMetrics([]);
    setSelectedVisualizations([]);
    setIsPublic(false);
    setSchedule("");
  };

  const handleCreateReport = () => {
    if (!reportName || !reportType || !dateRange) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const reportData = {
      name: reportName,
      type: reportType,
      visualizations: selectedVisualizations,
      layout: "portrait",
      period: dateRange,
      includeCharts: selectedVisualizations.includes("bar_chart") || selectedVisualizations.includes("line_chart"),
      includeTables: selectedVisualizations.includes("data_table"),
      includeRecommendations: true,
      customSections: reportDescription
    };

    createReportMutation.mutate(reportData);
  };

  const getMetricsForType = (type: string) => {
    return AVAILABLE_METRICS[type as keyof typeof AVAILABLE_METRICS] || [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Custom Reports</h1>
            <p className="text-muted-foreground">
              Create and manage custom financial reports tailored to your needs
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Report Builder
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              My Reports
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Create Custom Report
                </CardTitle>
                <CardDescription>
                  Build a custom report with your preferred metrics and visualizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name *</Label>
                    <Input
                      id="report-name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="e.g., Monthly Portfolio Review"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type *</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPORT_TYPES.map((type) => (
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
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe what this report covers..."
                    rows={3}
                  />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range *</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        {DATE_RANGES.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule (Optional)</Label>
                    <Select value={schedule} onValueChange={setSchedule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
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

                {/* Metrics Selection */}
                {reportType && (
                  <div className="space-y-3">
                    <Label>Metrics to Include</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {getMetricsForType(reportType).map((metric) => (
                        <div key={metric} className="flex items-center space-x-2">
                          <Checkbox
                            id={metric}
                            checked={selectedMetrics.includes(metric)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedMetrics([...selectedMetrics, metric]);
                              } else {
                                setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                              }
                            }}
                          />
                          <Label htmlFor={metric} className="text-sm font-normal">
                            {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visualization Types */}
                <div className="space-y-3">
                  <Label>Visualization Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {VISUALIZATION_TYPES.map((viz) => (
                      <div key={viz.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={viz.value}
                          checked={selectedVisualizations.includes(viz.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedVisualizations([...selectedVisualizations, viz.value]);
                            } else {
                              setSelectedVisualizations(selectedVisualizations.filter(v => v !== viz.value));
                            }
                          }}
                        />
                        <Label htmlFor={viz.value} className="text-sm font-normal flex items-center gap-2">
                          <viz.icon className="w-4 h-4" />
                          {viz.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="public"
                    checked={isPublic}
                    onCheckedChange={(checked) => setIsPublic(checked === true)}
                  />
                  <Label htmlFor="public">Make this report public (visible to team members)</Label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleCreateReport}
                    disabled={createReportMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {createReportMutation.isPending ? "Creating..." : "Create Report"}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-muted-foreground mt-2">Loading reports...</p>
                </div>
              ) : reports.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Custom Reports</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't created any custom reports yet. Get started by building your first report.
                    </p>
                    <Button onClick={() => setActiveTab("builder")}>
                      Create Your First Report
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                reports.map((report: CustomReport) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            {report.name}
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            {report.isPublic && (
                              <Badge variant="secondary">Public</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{report.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => runReportMutation.mutate(report.id)}
                            disabled={runReportMutation.isPending}
                            className="flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Run
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Export
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteReportMutation.mutate(report.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium">
                            {REPORT_TYPES.find(t => t.value === report.reportType)?.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date Range</p>
                          <p className="font-medium">
                            {DATE_RANGES.find(r => r.value === report.dateRange)?.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">
                            {report.createdAt ? format(new Date(report.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Run</p>
                          <p className="font-medium">
                            {report.lastRunAt 
                              ? format(new Date(report.lastRunAt), 'MMM dd, yyyy')
                              : 'Never'
                            }
                          </p>
                        </div>
                      </div>
                      {report.metrics && report.metrics.length > 0 && (
                        <div className="mt-4">
                          <p className="text-muted-foreground text-sm mb-2">Included Metrics:</p>
                          <div className="flex flex-wrap gap-1">
                            {report.metrics.slice(0, 5).map((metric) => (
                              <Badge key={metric} variant="secondary" className="text-xs">
                                {metric.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                            {report.metrics.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{report.metrics.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Portfolio Performance Template */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Portfolio Performance
                  </CardTitle>
                  <CardDescription>
                    Comprehensive portfolio performance analysis with returns, risk metrics, and benchmarks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Metrics:</span>
                      <span>8 included</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Visualizations:</span>
                      <span>4 charts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span>Monthly</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Use Template
                  </Button>
                </CardContent>
              </Card>

              {/* Risk Analysis Template */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Risk Analysis
                  </CardTitle>
                  <CardDescription>
                    Detailed risk assessment including VaR, stress testing, and concentration analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Metrics:</span>
                      <span>6 included</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Visualizations:</span>
                      <span>5 charts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span>Weekly</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Use Template
                  </Button>
                </CardContent>
              </Card>

              {/* Trading Activity Template */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Trading Activity
                  </CardTitle>
                  <CardDescription>
                    Trading performance metrics including win rate, profit factor, and trade analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Metrics:</span>
                      <span>7 included</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Visualizations:</span>
                      <span>3 charts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span>Daily</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}