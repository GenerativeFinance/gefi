import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  CreditCard,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  RefreshCw,
  FileText
} from "lucide-react";

export default function DataProviderRevenue() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // Sample revenue data
  const revenueOverview = {
    totalRevenue: 47250,
    monthlyRevenue: 15680,
    growth: 18.5,
    activeSubscriptions: 142,
    avgRevenuePerUser: 110.42
  };

  const revenueByDataset = [
    {
      name: "Financial Market Data Q3 2025",
      revenue: 18450,
      growth: 23.1,
      subscribers: 89,
      avgRevenue: 207.30,
      category: "Financial Data"
    },
    {
      name: "Real Estate Pricing Analytics",
      revenue: 12340,
      growth: 15.7,
      subscribers: 67,
      avgRevenue: 184.18,
      category: "Real Estate"
    },
    {
      name: "Cryptocurrency Trading Signals",
      revenue: 9870,
      growth: -5.2,
      subscribers: 45,
      avgRevenue: 219.33,
      category: "Crypto"
    },
    {
      name: "ESG Investment Data",
      revenue: 6590,
      growth: 8.9,
      subscribers: 34,
      avgRevenue: 193.82,
      category: "ESG"
    }
  ];

  const payoutHistory = [
    {
      date: "2025-07-01",
      amount: 14250,
      status: "completed",
      method: "Bank Transfer",
      datasets: 4
    },
    {
      date: "2025-06-01",
      amount: 12890,
      status: "completed",
      method: "Bank Transfer",
      datasets: 4
    },
    {
      date: "2025-05-01",
      amount: 11670,
      status: "completed",
      method: "Bank Transfer",
      datasets: 3
    },
    {
      date: "2025-04-01",
      amount: 10450,
      status: "completed",
      method: "Bank Transfer",
      datasets: 3
    }
  ];

  const upcomingPayouts = [
    {
      date: "2025-08-01",
      estimatedAmount: 16200,
      datasets: 4,
      status: "pending"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Revenue Tracking</h1>
            <p className="text-muted-foreground">Monitor earnings, subscriptions, and payouts</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueOverview.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{revenueOverview.growth}%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueOverview.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Current month earnings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueOverview.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> new this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Revenue/User</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueOverview.avgRevenuePerUser}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5.2%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Aug 1</div>
              <p className="text-xs text-muted-foreground">
                ~${upcomingPayouts[0].estimatedAmount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Revenue Analysis */}
        <Tabs defaultValue="datasets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="datasets">Revenue by Dataset</TabsTrigger>
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
            <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="datasets" className="space-y-4">
            <div className="grid gap-6">
              {revenueByDataset.map((dataset, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{dataset.name}</h3>
                          <Badge variant="secondary">{dataset.category}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Subscribers</p>
                            <p className="font-medium">{dataset.subscribers}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Avg Revenue/User</p>
                            <p className="font-medium">${dataset.avgRevenue}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Growth</p>
                            <div className="flex items-center gap-1">
                              {dataset.growth > 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              <span className={dataset.growth > 0 ? "text-green-600" : "text-red-600"}>
                                {dataset.growth > 0 ? "+" : ""}{dataset.growth}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">${dataset.revenue.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total Revenue</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-4">
            {/* Upcoming Payouts */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payouts</CardTitle>
                <CardDescription>Your next scheduled payments</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingPayouts.map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Estimated Payout</p>
                        <p className="text-sm text-muted-foreground">{payout.datasets} datasets</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${payout.estimatedAmount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{payout.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payout History */}
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Your payment history and records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payoutHistory.map((payout, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{payout.method}</p>
                          <p className="text-sm text-muted-foreground">{payout.datasets} datasets</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${payout.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{payout.date}</p>
                      </div>
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        {payout.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Statement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Revenue performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Revenue trend chart would be implemented here
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Revenue distribution across data categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Financial Data</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real Estate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Crypto</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ESG</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '9%' }}></div>
                        </div>
                        <span className="text-sm font-medium">9%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}