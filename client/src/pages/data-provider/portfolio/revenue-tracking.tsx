import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  BarChart3, 
  Download, 
  CreditCard,
  Wallet,
  FileText,
  Eye,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function RevenueTracking() {
  const [timeRange, setTimeRange] = useState("2025");
  const [selectedDataset, setSelectedDataset] = useState("all");

  // Sample revenue data
  const revenueOverview = {
    totalEarnings: 47850,
    monthlyRecurring: 12400,
    oneTimePayments: 8750,
    pendingPayouts: 3200,
    avgMonthlyGrowth: 8.3,
    topEarningDataset: "Cryptocurrency Trading Pairs"
  };

  const monthlyRevenue = [
    { month: "Jan 2025", revenue: 3200, growth: 15.2 },
    { month: "Feb 2025", revenue: 3800, growth: 18.8 },
    { month: "Mar 2025", revenue: 4100, growth: 7.9 },
    { month: "Apr 2025", revenue: 4650, growth: 13.4 },
    { month: "May 2025", revenue: 5200, growth: 11.8 },
    { month: "Jun 2025", revenue: 5900, growth: 13.5 },
    { month: "Jul 2025", revenue: 6200, growth: 5.1 }
  ];

  const datasetRevenue = [
    {
      id: 1,
      name: "Cryptocurrency Trading Pairs",
      totalEarnings: 18500,
      monthlyRecurring: 5200,
      subscriptions: 67,
      avgRevenuePerUser: 276,
      revenueModel: "Subscription",
      growthRate: 24.5,
      lastPayment: "2025-07-15"
    },
    {
      id: 2,
      name: "S&P 500 Historical Data",
      totalEarnings: 12300,
      monthlyRecurring: 3400,
      subscriptions: 23,
      avgRevenuePerUser: 535,
      revenueModel: "Subscription",
      growthRate: 12.8,
      lastPayment: "2025-07-14"
    },
    {
      id: 3,
      name: "Federal Reserve Economic Data",
      totalEarnings: 9800,
      monthlyRecurring: 2800,
      subscriptions: 19,
      avgRevenuePerUser: 516,
      revenueModel: "Subscription",
      growthRate: 8.3,
      lastPayment: "2025-07-13"
    },
    {
      id: 4,
      name: "Corporate Bond Yields",
      totalEarnings: 1650,
      monthlyRecurring: 450,
      subscriptions: 3,
      avgRevenuePerUser: 550,
      revenueModel: "Pay-per-use",
      growthRate: -2.1,
      lastPayment: "2025-07-10"
    },
    {
      id: 5,
      name: "Legacy Market Data 2010-2015",
      totalEarnings: 5600,
      monthlyRecurring: 550,
      subscriptions: 12,
      avgRevenuePerUser: 467,
      revenueModel: "One-time",
      growthRate: -5.2,
      lastPayment: "2025-07-08"
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: "2025-07-15",
      amount: 6200,
      status: "Completed",
      method: "Bank Transfer",
      period: "July 2025",
      datasets: 5
    },
    {
      id: 2,
      date: "2025-06-15",
      amount: 5900,
      status: "Completed",
      method: "Bank Transfer",
      period: "June 2025",
      datasets: 5
    },
    {
      id: 3,
      date: "2025-05-15",
      amount: 5200,
      status: "Completed",
      method: "Bank Transfer",
      period: "May 2025",
      datasets: 4
    },
    {
      id: 4,
      date: "2025-04-15",
      amount: 4650,
      status: "Completed",
      method: "Bank Transfer",
      period: "April 2025",
      datasets: 4
    },
    {
      id: 5,
      date: "2025-03-15",
      amount: 4100,
      status: "Completed",
      method: "Bank Transfer",
      period: "March 2025",
      datasets: 4
    }
  ];

  const upcomingPayouts = [
    {
      dataset: "Cryptocurrency Trading Pairs",
      amount: 1850,
      dueDate: "2025-08-15",
      period: "July 15 - Aug 15",
      status: "Pending"
    },
    {
      dataset: "S&P 500 Historical Data",
      amount: 680,
      dueDate: "2025-08-15",
      period: "July 15 - Aug 15",
      status: "Pending"
    },
    {
      dataset: "Federal Reserve Economic Data",
      amount: 420,
      dueDate: "2025-08-15",
      period: "July 15 - Aug 15",
      status: "Pending"
    }
  ];

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getRevenueModelColor = (model: string) => {
    switch (model) {
      case "Subscription": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Pay-per-use": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "One-time": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Revenue Tracking</h1>
            <p className="text-muted-foreground">Monitor your earnings from dataset usage with detailed breakdowns and payment history.</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tax Report
            </Button>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid gap-6 md:grid-cols-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueOverview.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">2025 YTD</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueOverview.monthlyRecurring.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{revenueOverview.avgMonthlyGrowth}% growth</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">One-time Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueOverview.oneTimePayments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueOverview.pendingPayouts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Due Aug 15</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Growth</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{revenueOverview.avgMonthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">Monthly</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Earner</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{revenueOverview.topEarningDataset}</div>
              <p className="text-xs text-muted-foreground">Best performing</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Revenue Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Track revenue growth and patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyRevenue.map((month, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">{month.month}</div>
                      <div className="text-sm text-muted-foreground">Monthly earnings</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">${month.revenue.toLocaleString()}</div>
                      <div className={`text-sm flex items-center gap-1 ${getGrowthColor(month.growth)}`}>
                        {getGrowthIcon(month.growth)}
                        {month.growth > 0 ? '+' : ''}{month.growth}%
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress value={(month.revenue / 7000) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dataset Revenue Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Revenue by Dataset</CardTitle>
            <CardDescription>Detailed earnings breakdown for each dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset Name</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Monthly Recurring</TableHead>
                  <TableHead>Subscriptions</TableHead>
                  <TableHead>Avg Revenue/User</TableHead>
                  <TableHead>Revenue Model</TableHead>
                  <TableHead>Growth Rate</TableHead>
                  <TableHead>Last Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasetRevenue.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>
                      <div className="font-medium">{dataset.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">${dataset.totalEarnings.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        ${dataset.monthlyRecurring.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{dataset.subscriptions}</Badge>
                        <span className="text-sm text-muted-foreground">active</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${dataset.avgRevenuePerUser}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRevenueModelColor(dataset.revenueModel)}>
                        {dataset.revenueModel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${getGrowthColor(dataset.growthRate)}`}>
                        {getGrowthIcon(dataset.growthRate)}
                        <span className="font-medium">
                          {dataset.growthRate > 0 ? '+' : ''}{dataset.growthRate}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(dataset.lastPayment).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of all received payments and payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{payment.period}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()} • {payment.datasets} datasets
                      </div>
                      <div className="text-xs text-muted-foreground">{payment.method}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${payment.amount.toLocaleString()}</div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Payments
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Payouts */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payouts</CardTitle>
              <CardDescription>Scheduled payments for the current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayouts.map((payout, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{payout.dataset}</div>
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(payout.dueDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">{payout.period}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${payout.amount.toLocaleString()}</div>
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Total Pending</div>
                    <div className="text-sm text-muted-foreground">Next payout in 4 days</div>
                  </div>
                  <div className="text-xl font-bold">${revenueOverview.pendingPayouts.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}