import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Clock, CheckCircle, XCircle, BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function Reports() {
  const [reportType, setReportType] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const { toast } = useToast();

  const reportTypes = [
    { value: 'portfolio_performance', label: 'Portfolio Performance Report', icon: BarChart3 },
    { value: 'risk_assessment', label: 'Risk Assessment Report', icon: Activity },
    { value: 'market_analysis', label: 'Market Analysis Report', icon: TrendingUp },
    { value: 'compliance', label: 'Compliance Report', icon: FileText },
    { value: 'allocation', label: 'Asset Allocation Report', icon: PieChart }
  ];

  const generateSampleData = (type: string) => {
    const baseData = {
      generatedAt: new Date().toLocaleDateString(),
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        end: new Date().toLocaleDateString()
      },
      keyMetrics: {
        metrics: [
          { label: 'Total Return', value: '+12.5%' },
          { label: 'Sharpe Ratio', value: '1.42' },
          { label: 'Max Drawdown', value: '-8.3%' },
          { label: 'Volatility', value: '15.2%' }
        ]
      },
      executiveSummary: {
        content: `This report provides a comprehensive analysis of portfolio performance for the period ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} to ${new Date().toLocaleDateString()}. Key highlights include strong risk-adjusted returns and effective diversification strategies.`
      },
      highlights: {
        items: [
          'Portfolio outperformed benchmark by 3.2%',
          'Risk metrics remain within acceptable ranges',
          'Diversification strategy effectively reduced volatility',
          'ESG criteria integration showing positive impact'
        ]
      },
      charts: [
        {
          title: 'Portfolio Performance Over Time',
          description: 'Cumulative returns compared to benchmark performance.',
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
              <rect width="600" height="300" fill="#f8fafc"/>
              <line x1="50" y1="250" x2="550" y2="50" stroke="#6a5af9" stroke-width="3"/>
              <line x1="50" y1="250" x2="550" y2="120" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5"/>
              <text x="300" y="280" text-anchor="middle" font-family="Arial" font-size="14" fill="#374151">Portfolio vs Benchmark Performance</text>
              <text x="30" y="30" font-family="Arial" font-size="12" fill="#6b7280">Returns (%)</text>
            </svg>
          `),
          insights: {
            items: [
              'Consistent outperformance vs benchmark',
              'Lower volatility during market downturns',
              'Strong momentum in growth sectors'
            ]
          }
        }
      ],
      dataTables: [
        {
          title: 'Top Holdings Analysis',
          description: 'Detailed breakdown of largest portfolio positions.',
          tableHtml: `
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Weight</th>
                  <th>Return (30d)</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Tech Growth Fund</td><td>22.5%</td><td>+15.2%</td><td>Medium</td></tr>
                <tr><td>ESG Bond Fund</td><td>18.0%</td><td>+3.8%</td><td>Low</td></tr>
                <tr><td>Emerging Markets</td><td>12.3%</td><td>+8.9%</td><td>High</td></tr>
                <tr><td>Real Estate ETF</td><td>10.1%</td><td>+6.4%</td><td>Medium</td></tr>
              </tbody>
            </table>
          `
        }
      ]
    };

    return baseData;
  };

  const handleGenerateReport = async () => {
    if (!reportType || !reportTitle) {
      toast({
        title: "Missing Information",
        description: "Please select a report type and enter a title.",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const sampleData = generateSampleData(reportType);
      
      const response = await apiRequest('POST', '/api/reports/generate', {
        type: reportType,
        title: reportTitle,
        description: reportDescription,
        data: sampleData,
        templateId: 'executive-report'
      });

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Report Generated",
          description: "Your report has been generated successfully!",
        });
        
        setGeneratedReports(prev => [...prev, result]);
        setReportTitle('');
        setReportDescription('');
        setReportType('');
      } else {
        throw new Error(result.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = (reportId: string) => {
    window.open(`/api/reports/${reportId}/download`, '_blank');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Report Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Generate comprehensive financial reports with AI-powered analytics
          </p>
        </div>

        {/* Report Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Generate New Report</span>
            </CardTitle>
            <CardDescription>
              Create professional financial reports with customizable data and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input
                  id="reportTitle"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g., Q4 2024 Portfolio Performance"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportDescription">Description (Optional)</Label>
              <Textarea
                id="reportDescription"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Brief description of the report purpose and scope..."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleGenerateReport}
              disabled={generating || !reportType || !reportTitle}
              className="w-full"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Reports */}
        {generatedReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Download and manage your generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedReports.map((report, index) => (
                  <div 
                    key={report.reportId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Report #{index + 1}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Generated on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={report.status === 'completed' ? 'default' : 'secondary'}
                        className="flex items-center space-x-1"
                      >
                        {report.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : report.status === 'failed' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span className="capitalize">{report.status}</span>
                      </Badge>
                      
                      {report.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(report.reportId)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}