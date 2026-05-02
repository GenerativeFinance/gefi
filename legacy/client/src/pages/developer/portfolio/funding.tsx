import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Target,
  FileText,
  ArrowUpRight,
  Building,
  Award,
  PieChart,
  BarChart3
} from "lucide-react";

export default function DeveloperFunding() {
  // Sample funding data
  const fundingReceived = [
    {
      id: 1,
      modelName: "High-Frequency Trading Algorithm",
      investor: "Alpha Capital Ventures",
      amount: 125000,
      date: "2025-07-10",
      type: "Series A",
      equity: 8.5,
      currentROI: 15.2,
      status: "active"
    },
    {
      id: 2,
      modelName: "Portfolio Risk Assessment",
      investor: "FinTech Growth Partners",
      amount: 75000,
      date: "2025-06-15",
      type: "Seed",
      equity: 12.0,
      currentROI: 22.8,
      status: "active"
    },
    {
      id: 3,
      modelName: "ESG Investment Screener",
      investor: "Sustainable Tech Fund",
      amount: 50000,
      date: "2025-05-20",
      type: "Pre-Seed",
      equity: 10.0,
      currentROI: 8.4,
      status: "active"
    },
    {
      id: 4,
      modelName: "Market Sentiment Analyzer",
      investor: "Data Insights Capital",
      amount: 95000,
      date: "2025-04-25",
      type: "Series A",
      equity: 15.0,
      currentROI: 18.7,
      status: "completed"
    }
  ];

  const fundingHistory = [
    { date: "2025-07-10", event: "Received $125,000 from Alpha Capital Ventures for High-Frequency Trading Algorithm", type: "funding" },
    { date: "2025-07-01", event: "Completed ROI milestone - 15% return achieved for HFT Algorithm", type: "milestone" },
    { date: "2025-06-15", event: "Secured $75,000 Series A funding from FinTech Growth Partners", type: "funding" },
    { date: "2025-06-01", event: "Portfolio Risk Assessment generated 20% ROI for Q2 2025", type: "milestone" },
    { date: "2025-05-20", event: "Pre-seed funding of $50,000 from Sustainable Tech Fund", type: "funding" },
    { date: "2025-05-01", event: "ESG Investment Screener reached profitability milestone", type: "milestone" },
    { date: "2025-04-25", event: "Market Sentiment Analyzer funding round completed - $95,000", type: "funding" }
  ];

  const overallMetrics = {
    totalFunding: 345000,
    avgROI: 16.3,
    activeInvestments: 3,
    completedDeals: 1,
    totalInvestors: 4,
    bestPerformer: "Portfolio Risk Assessment"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 20) return "text-green-600 dark:text-green-400";
    if (roi >= 15) return "text-blue-600 dark:text-blue-400";
    if (roi >= 10) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Funding Portfolio</h1>
            <p className="text-muted-foreground">
              Track funding received, investment returns, and funding history
            </p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Funding Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Funding</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${overallMetrics.totalFunding.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average ROI</p>
                  <p className="text-2xl font-bold text-blue-600">{overallMetrics.avgROI}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Investments</p>
                  <p className="text-2xl font-bold">{overallMetrics.activeInvestments}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Investors</p>
                  <p className="text-2xl font-bold">{overallMetrics.totalInvestors}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funding Details */}
        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="received">Funding Received</TabsTrigger>
            <TabsTrigger value="returns">Investment Returns</TabsTrigger>
            <TabsTrigger value="history">Funding History</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fundingReceived.map((funding) => (
                <Card key={funding.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{funding.modelName}</CardTitle>
                        <CardDescription>Funded by {funding.investor}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(funding.status)}>
                        {funding.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Funding Amount */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Funding Amount</span>
                        <span className="text-lg font-bold text-green-600">
                          ${funding.amount.toLocaleString()}
                        </span>
                      </div>

                      {/* Funding Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(funding.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{funding.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PieChart className="h-4 w-4 text-muted-foreground" />
                          <span>{funding.equity}% Equity</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className={getROIColor(funding.currentROI)}>
                            {funding.currentROI}% ROI
                          </span>
                        </div>
                      </div>

                      {/* ROI Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current Performance</span>
                          <span className={`text-sm font-bold ${getROIColor(funding.currentROI)}`}>
                            {funding.currentROI}% Return
                          </span>
                        </div>
                        <Progress value={Math.min(funding.currentROI, 30)} className="h-2" max={30} />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="returns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Returns Overview</CardTitle>
                <CardDescription>ROI and performance metrics for funded models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {fundingReceived.map((funding) => (
                    <div key={funding.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{funding.modelName}</h3>
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                          <span className={`font-bold ${getROIColor(funding.currentROI)}`}>
                            {funding.currentROI}% ROI
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Initial Investment</p>
                          <p className="font-medium">${funding.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Value</p>
                          <p className="font-medium text-green-600">
                            ${Math.round(funding.amount * (1 + funding.currentROI / 100)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Profit Generated</p>
                          <p className="font-medium text-green-600">
                            ${Math.round(funding.amount * (funding.currentROI / 100)).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Performance vs Target (20%)</span>
                          <span>{(funding.currentROI / 20 * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={Math.min(funding.currentROI / 20 * 100, 100)} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Performer</CardTitle>
                <CardDescription>Highest performing funded model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{overallMetrics.bestPerformer}</h3>
                    <p className="text-sm text-muted-foreground">
                      Generated 22.8% ROI in Q2 2025
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">22.8%</p>
                    <p className="text-xs text-muted-foreground">ROI</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Timeline</CardTitle>
                <CardDescription>Complete history of investment events and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fundingHistory.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.type === "funding" 
                          ? "bg-green-100 dark:bg-green-900" 
                          : "bg-blue-100 dark:bg-blue-900"
                      }`}>
                        {event.type === "funding" ? (
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-300" />
                        ) : (
                          <Target className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{event.event}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {event.type === "funding" ? "Funding" : "Milestone"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}