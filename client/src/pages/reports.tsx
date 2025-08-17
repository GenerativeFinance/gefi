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
      case 'blue': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'red': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'yellow': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'green': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reports Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Access and manage your financial reports across all categories
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/reports/all">
              <Button variant="outline" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>View All Reports</span>
              </Button>
            </Link>
            <Button className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>

        {/* Report Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${getCategoryColor(category.color)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.reports.length} reports
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.reports.map((report) => (
                      <div 
                        key={report.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                            {report.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {report.description}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <Badge 
                              className={`text-xs ${getStatusColor(report.status)}`}
                              variant="secondary"
                            >
                              {report.status}
                            </Badge>
                            <span className="text-xs text-gray-400 flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(report.lastUpdated).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {report.status === 'generated' && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <Link href={`/reports/${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View All {category.title}
                      </Button>
                    </Link>
                  </div>
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
  );
}