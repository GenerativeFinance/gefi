import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Eye, Calendar, TrendingUp, Shield, AlertTriangle, Users, DollarSign } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { generateAndDownloadReport, type ReportStatusResponse } from '@/utils/downloadReport';

interface Report {
  id: string;
  title: string;
  type: string;
  status: 'generated' | 'pending' | 'failed';
  lastUpdated: string;
  description: string;
}

export default function Reports() {
  const { toast } = useToast();
  
  // Fetch reports data
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['/api/reports'],
    enabled: true
  });

  const handleDownloadReport = async (report: Report) => {
    try {
      toast({
        title: "Generating Report",
        description: `Generating ${report.title}...`,
      });

      const result = await generateAndDownloadReport(
        {
          type: report.type,
          title: report.title,
          data: {
            user: {
              firstName: 'User',
              lastName: ''
            }
          },
          templateId: 'executive-report'
        },
        (status: ReportStatusResponse) => {
          if (status.status === 'processing' && status.progress) {
            toast({
              title: "Generating Report",
              description: `Progress: ${status.progress}%`,
            });
          }
        }
      );

      if (result.success) {
        toast({
          title: "Report Downloaded",
          description: `${report.title} has been downloaded successfully.`,
        });
      } else {
        throw new Error(result.error || 'Report generation failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const reportCategories = [
    {
      title: 'Performance Reports',
      description: 'Track portfolio performance and returns',
      icon: TrendingUp,
      color: 'blue',
      reports: [
        { id: '1', title: 'Monthly Performance Summary', type: 'performance', status: 'generated' as const, lastUpdated: '2024-01-15', description: 'Comprehensive portfolio performance analysis' },
        { id: '2', title: 'Q4 2023 Portfolio Review', type: 'performance', status: 'generated' as const, lastUpdated: '2024-01-10', description: 'Quarterly performance and allocation review' }
      ]
    },
    {
      title: 'Risk Assessment',
      description: 'Monitor risk metrics and exposure',
      icon: Shield,
      color: 'red',
      reports: [
        { id: '3', title: 'Risk Compliance Report', type: 'risk', status: 'generated' as const, lastUpdated: '2024-01-12', description: 'Current risk exposure and compliance status' },
        { id: '4', title: 'Stress Test Results', type: 'risk', status: 'pending' as const, lastUpdated: '2024-01-14', description: 'Portfolio stress testing under market scenarios' }
      ]
    },
    {
      title: 'Regulatory Compliance',
      description: 'Compliance and audit reports',
      icon: AlertTriangle,
      color: 'yellow',
      reports: [
        { id: '5', title: 'SEC Filing Summary', type: 'compliance', status: 'generated' as const, lastUpdated: '2024-01-08', description: 'Regulatory filing requirements summary' }
      ]
    },
    {
      title: 'Client Reports',
      description: 'Client-facing performance summaries',
      icon: Users,
      color: 'green',
      reports: [
        { id: '6', title: 'Client Portfolio Summary', type: 'client', status: 'generated' as const, lastUpdated: '2024-01-16', description: 'Monthly client portfolio overview' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      case 'red': return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'yellow': return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
      case 'green': return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      default: return 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            Reports Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mb-4">
            Access and manage your financial reports across all categories. Generate, download, and analyze comprehensive portfolio insights.
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/reports/all">
              <Button variant="outline" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>View All Reports</span>
              </Button>
            </Link>
            <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Report Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.title} className={`${getCategoryColor(category.color)} hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <IconComponent className="w-6 h-6" />
                      <span>{category.title}</span>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{report.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                              {report.status}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {report.lastUpdated}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" onClick={() => handleDownloadReport(report)}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common report generation and management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>Monthly Performance</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Shield className="w-6 h-6" />
                  <span>Risk Analysis</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Users className="w-6 h-6" />
                  <span>Client Summary</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}