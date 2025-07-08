import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Link } from "wouter";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  BarChart3,
  Bot,
  Shield,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  AlertTriangle,
  Users,
  Zap
} from "lucide-react";

// Dashboard overview data
const portfolioOverview = {
  totalValue: 142500,
  dailyChange: 2850,
  dailyChangePercent: 2.04,
  monthlyReturn: 8.7,
  ytdReturn: 24.3
};

const quickStats = [
  { 
    label: "Active AI Models", 
    value: "8", 
    change: "+2",
    icon: Bot,
    color: "text-blue-600"
  },
  { 
    label: "Trading Bots", 
    value: "3", 
    change: "+1",
    icon: Zap,
    color: "text-green-600"
  },
  { 
    label: "Risk Score", 
    value: "6.2/10", 
    change: "-0.3",
    icon: Shield,
    color: "text-orange-600"
  },
  { 
    label: "Alerts", 
    value: "2", 
    change: "0",
    icon: AlertTriangle,
    color: "text-red-600"
  }
];

const recentActivity = [
  {
    type: "trade",
    description: "Bought 50 shares of NVDA",
    amount: "+$12,450",
    time: "2 hours ago",
    status: "completed"
  },
  {
    type: "alert",
    description: "Portfolio risk exceeded threshold",
    amount: "Risk: 7.2/10",
    time: "4 hours ago",
    status: "warning"
  },
  {
    type: "model",
    description: "Subscribed to Quantum Risk Predictor",
    amount: "$299/month",
    time: "1 day ago",
    status: "active"
  },
  {
    type: "report",
    description: "Monthly performance report generated",
    amount: "+18.5% return",
    time: "2 days ago",
    status: "info"
  }
];

const topPerformingModels = [
  { name: "Quantum Risk Predictor", performance: "+24.8%", status: "active" },
  { name: "Smart Portfolio Optimizer", performance: "+18.3%", status: "active" },
  { name: "AI Trend Analyzer", performance: "+15.7%", status: "active" },
  { name: "Risk Assessment Pro", performance: "+12.4%", status: "paused" }
];

const quickActions = [
  {
    title: "View Portfolio",
    description: "Check your current holdings and performance",
    href: "/portfolio",
    icon: Wallet,
    color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
  },
  {
    title: "Browse AI Models",
    description: "Discover new AI models to enhance your strategy",
    href: "/marketplace",
    icon: Bot,
    color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
  },
  {
    title: "Risk Assessment",
    description: "Review your current risk exposure",
    href: "/risk-assessment",
    icon: Shield,
    color: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
  },
  {
    title: "Generate Reports",
    description: "Create detailed performance and compliance reports",
    href: "/reports",
    icon: FileText,
    color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
  }
];

export default function InvestorDashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-orange-600 dark:text-orange-400';
      case 'active': return 'text-blue-600 dark:text-blue-400';
      case 'info': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Investor Overview</h1>
            <p className="text-muted-foreground">Your investment overview and performance metrics</p>
          </div>
          <Badge variant="outline" className="text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>

        {/* Portfolio Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(portfolioOverview.totalValue)}</div>
                <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
                <div className="flex items-center mt-1">
                  {portfolioOverview.dailyChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={portfolioOverview.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(Math.abs(portfolioOverview.dailyChange))} ({Math.abs(portfolioOverview.dailyChangePercent)}%)
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600">+{portfolioOverview.monthlyReturn}%</div>
                <div className="text-sm text-muted-foreground">Monthly Return</div>
                <div className="text-xs text-muted-foreground mt-1">vs +3.2% benchmark</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-blue-600">+{portfolioOverview.ytdReturn}%</div>
                <div className="text-sm text-muted-foreground">YTD Return</div>
                <div className="text-xs text-muted-foreground mt-1">vs +18.1% benchmark</div>
              </div>
              
              <div className="flex space-x-2">
                <Link href="/portfolio">
                  <Button size="sm">View Details</Button>
                </Link>
                <Link href="/portfolio-performance">
                  <Button variant="outline" size="sm">Performance</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.change} from last week</div>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${action.color}`}>
                    <div className="flex items-start space-x-3">
                      <action.icon className="h-6 w-6 mt-0.5" />
                      <div>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{activity.description}</div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getStatusColor(activity.status)}`}>
                        {activity.amount}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Models */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing AI Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topPerformingModels.map((model, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">{model.name}</div>
                    <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-green-600">{model.performance}</div>
                  <div className="text-xs text-muted-foreground">Last 30 days</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/marketplace">
                <Button variant="outline">Browse More Models</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}