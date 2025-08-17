import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Calendar, TrendingUp, Shield, AlertTriangle, Users, DollarSign } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface Report {
  id: string;
  title: string;
  type: string;
  status: 'generated' | 'pending' | 'failed';
  lastUpdated: string;
  description: string;
}

export default function Reports() {
  // Fetch reports data
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['/api/reports'],
    enabled: true
  });

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with breadcrumb navigation */}
      <div className="border-b bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/home" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">Reports</span>
              </nav>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                Reports Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                Access and manage your financial reports across all categories. Generate, download, and analyze comprehensive portfolio insights.
              </p>
            </div>
            
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
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
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
                          <Button size="sm">
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

      {/* Enhanced Footer */}
      <footer className="border-t bg-white dark:bg-gray-950 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Report Types</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/reports/performance" className="hover:text-gray-900 dark:hover:text-white">Performance Reports</Link></li>
                <li><Link href="/reports/risk" className="hover:text-gray-900 dark:hover:text-white">Risk Assessment</Link></li>
                <li><Link href="/reports/compliance" className="hover:text-gray-900 dark:hover:text-white">Regulatory Compliance</Link></li>
                <li><Link href="/reports/client" className="hover:text-gray-900 dark:hover:text-white">Client Reports</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/reports/generate" className="hover:text-gray-900 dark:hover:text-white">Generate New Report</Link></li>
                <li><Link href="/reports/scheduled" className="hover:text-gray-900 dark:hover:text-white">Scheduled Reports</Link></li>
                <li><Link href="/reports/templates" className="hover:text-gray-900 dark:hover:text-white">Report Templates</Link></li>
                <li><Link href="/reports/archive" className="hover:text-gray-900 dark:hover:text-white">Report Archive</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/docs/reports" className="hover:text-gray-900 dark:hover:text-white">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-gray-900 dark:hover:text-white">Contact Support</Link></li>
                <li><Link href="/tutorials/reports" className="hover:text-gray-900 dark:hover:text-white">Video Tutorials</Link></li>
                <li><Link href="/api/reports/docs" className="hover:text-gray-900 dark:hover:text-white">API Reference</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Portfolio Report Generated</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Risk Analysis Updated</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Compliance Review Pending</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 GeFi Reports. Last updated: {new Date().toLocaleDateString()}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge variant="secondary" className="text-xs">
                System Status: Operational
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Next scheduled report: Tomorrow 9:00 AM
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}