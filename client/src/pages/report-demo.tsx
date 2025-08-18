import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { generateAndDownloadReport, type ReportStatusResponse } from '@/utils/downloadReport';

export default function ReportGenerationDemo() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportStatus, setReportStatus] = useState<'idle' | 'pending' | 'processing' | 'completed' | 'failed'>('idle');
  const [reportForm, setReportForm] = useState({
    title: '',
    type: 'monthly-performance'
  });

  const handleGenerateReport = async () => {
    if (!reportForm.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Report title is required.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setReportStatus('pending');

    try {
      const result = await generateAndDownloadReport(
        {
          type: reportForm.type,
          title: reportForm.title,
          data: {
            user: {
              firstName: 'Demo',
              lastName: 'User',
              email: 'demo@gefi.com'
            },
            keyMetrics: {
              metrics: [
                { label: 'Total Value', value: '$125,000' },
                { label: 'Monthly Return', value: '+8.2%' },
                { label: 'Sharpe Ratio', value: '1.85' },
                { label: 'Risk Score', value: '6.2/10' }
              ]
            },
            executiveSummary: {
              content: 'Your portfolio has performed exceptionally well this month with strong returns across AI-powered trading strategies.'
            },
            highlights: {
              items: [
                'AI model accuracy improved to 94.2%',
                'Portfolio outperformed benchmark by 3.1%', 
                'Risk-adjusted returns increased by 12%',
                'All compliance checks passed'
              ]
            }
          },
          templateId: 'executive-report'
        },
        (status: ReportStatusResponse) => {
          console.log('Status update:', status);
          setReportStatus(status.status);
          if (status.progress) {
            setProgress(status.progress);
          }
          
          if (status.status === 'processing') {
            toast({
              title: "Processing Report",
              description: `Generating PDF... ${status.progress || 0}%`,
            });
          }
        }
      );

      if (result.success) {
        setReportStatus('completed');
        setProgress(100);
        toast({
          title: "Report Downloaded",
          description: `${reportForm.title} has been generated and downloaded successfully.`,
        });
        
        // Reset form
        setReportForm({ title: '', type: 'monthly-performance' });
      } else {
        setReportStatus('failed');
        throw new Error(result.error || 'Report generation failed');
      }
    } catch (error) {
      setReportStatus('failed');
      console.error('Report generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = () => {
    switch (reportStatus) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (reportStatus) {
      case 'pending':
        return 'Enqueued for processing...';
      case 'processing':
        return `Processing... ${progress}%`;
      case 'completed':
        return 'Completed! Download started.';
      case 'failed':
        return 'Generation failed. Please try again.';
      default:
        return 'Ready to generate';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-500" />
                Report Generation Demo
              </CardTitle>
              <CardDescription>
                Test the new async report generation system with background processing and polling.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter report title..."
                    value={reportForm.title}
                    onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Report Type</Label>
                  <Select
                    value={reportForm.type}
                    onValueChange={(value) => setReportForm(prev => ({ ...prev, type: value }))}
                    disabled={isGenerating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly-performance">Monthly Performance</SelectItem>
                      <SelectItem value="risk-compliance">Risk & Compliance</SelectItem>
                      <SelectItem value="portfolio-optimization">Portfolio Optimization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status Display */}
              {reportStatus !== 'idle' && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <span className="text-sm font-medium">{getStatusText()}</span>
                  </div>
                  
                  {(reportStatus === 'processing' || reportStatus === 'pending') && (
                    <Progress value={progress} className="w-full" />
                  )}
                </div>
              )}

              {/* Generate Button */}
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating || !reportForm.title.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>

              {/* Instructions */}
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p><strong>How it works:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Click "Generate Report" to enqueue a background job</li>
                  <li>The system polls for status updates with exponential backoff</li>
                  <li>PDF is generated using Puppeteer and uploaded to S3 (or local storage)</li>
                  <li>Download starts automatically when complete</li>
                </ol>
                <p className="mt-4 text-xs text-gray-500">
                  <strong>Note:</strong> In development mode without Redis/S3, the system will use local storage and graceful fallbacks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}