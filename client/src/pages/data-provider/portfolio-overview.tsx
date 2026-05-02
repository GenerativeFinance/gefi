import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import { Link } from "wouter";
import { 
  Activity,
  CheckCircle,
  DollarSign,
  MessageCircle,
  Shield,
  Award,
  Users,
  Database,
  TrendingUp,
  BarChart3,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  Star,
  AlertCircle,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  FileText,
  Globe,
  Gauge
} from "lucide-react";

export default function DataProviderPortfolioOverview() {
  // Portfolio overview statistics
  const portfolioStats = {
    totalDatasets: 23,
    activeDatasets: 18,
    totalRevenue: 31940,
    qualityScore: 98.5,
    avgRating: 4.7,
    complianceRate: 96,
    overallScore: 92
  };

  const portfolioSections = [
    {
      id: "usage",
      title: "Usage Statistics",
      description: "Monitor dataset usage, downloads, and API calls from subscribers",
      icon: Activity,
      href: "/data-provider/portfolio/usage",
      color: "bg-blue-500",
      stats: {
        primary: "3,196 Downloads",
        secondary: "125,958 API Calls",
        trend: "+18% from last month"
      },
      metrics: [
        { label: "Total Downloads", value: "3,196", change: "+18%", trend: "up" },
        { label: "API Calls", value: "125,958", change: "+12%", trend: "up" },
        { label: "Unique Users", value: "235", change: "+25%", trend: "up" },
        { label: "Total Revenue", value: "$31,940", change: "+14%", trend: "up" }
      ]
    },
    {
      id: "quality",
      title: "Quality Metrics",
      description: "Track data accuracy, completeness, timeliness and validation scores",
      icon: CheckCircle,
      href: "/data-provider/portfolio/quality",
      color: "bg-green-500",
      stats: {
        primary: "98.5% Quality Score",
        secondary: "99.2% Completeness",
        trend: "+2.5% improvement"
      },
      metrics: [
        { label: "Quality Score", value: "98.5%", change: "+2.5%", trend: "up" },
        { label: "Accuracy", value: "97.8%", change: "+1.2%", trend: "up" },
        { label: "Completeness", value: "99.2%", change: "+0.8%", trend: "up" },
        { label: "Timeliness", value: "96.4%", change: "+3.1%", trend: "up" }
      ]
    },
    {
      id: "revenue",
      title: "Revenue Tracking",
      description: "Monitor earnings, subscription growth, and payment analytics",
      icon: DollarSign,
      href: "/data-provider/portfolio/revenue",
      color: "bg-yellow-500",
      stats: {
        primary: "$31,940 Revenue",
        secondary: "45 Active Subscriptions",
        trend: "+$4,250 this month"
      },
      metrics: [
        { label: "Monthly Revenue", value: "$31,940", change: "+14%", trend: "up" },
        { label: "Subscriptions", value: "45", change: "+8", trend: "up" },
        { label: "Avg Revenue/User", value: "$136", change: "+$18", trend: "up" },
        { label: "Growth Rate", value: "22%", change: "+5%", trend: "up" }
      ]
    },
    {
      id: "compliance",
      title: "Compliance Status",
      description: "Track regulatory adherence, audit results, and compliance scores",
      icon: Shield,
      href: "/data-provider/portfolio/compliance",
      color: "bg-red-500",
      stats: {
        primary: "96% Compliant",
        secondary: "Last Audit: July 10",
        trend: "2 pending actions"
      },
      metrics: [
        { label: "Compliance Rate", value: "96%", change: "+3%", trend: "up" },
        { label: "GDPR Score", value: "98%", change: "+2%", trend: "up" },
        { label: "SOC 2", value: "95%", change: "+1%", trend: "up" },
        { label: "Issues Resolved", value: "12", change: "+4", trend: "up" }
      ]
    },
    {
      id: "feedback",
      title: "Reviews & Feedback",
      description: "Manage user ratings, response tracking, and satisfaction metrics",
      icon: MessageCircle,
      href: "/data-provider/portfolio/feedback",
      color: "bg-orange-500",
      stats: {
        primary: "4.7/5 Rating",
        secondary: "89% Response Rate",
        trend: "34 new reviews"
      },
      metrics: [
        { label: "Avg Rating", value: "4.7/5", change: "+0.3", trend: "up" },
        { label: "Total Reviews", value: "156", change: "+34", trend: "up" },
        { label: "Response Rate", value: "89%", change: "+12%", trend: "up" },
        { label: "Satisfaction", value: "94%", change: "+7%", trend: "up" }
      ]
    },
    {
      id: "score",
      title: "Portfolio Score",
      description: "View overall performance score, rankings, and achievements",
      icon: Award,
      href: "/data-provider/portfolio/score",
      color: "bg-indigo-500",
      stats: {
        primary: "92/100 Score",
        secondary: "Top 8% Provider",
        trend: "+7 points this month"
      },
      metrics: [
        { label: "Overall Score", value: "92/100", change: "+7", trend: "up" },
        { label: "Market Rank", value: "Top 8%", change: "+2%", trend: "up" },
        { label: "Achievements", value: "18", change: "+3", trend: "up" },
        { label: "Milestones", value: "12/15", change: "+2", trend: "up" }
      ]
    }
  ];

  const recentActivity = [
    {
      action: "Dataset updated",
      dataset: "Financial Market Data Q3 2025",
      time: "1 hour ago",
      status: "success"
    },
    {
      action: "Quality review completed",
      dataset: "Real Estate Pricing Analytics",
      time: "3 hours ago",
      status: "success"
    },
    {
      action: "New subscription",
      dataset: "Cryptocurrency Market Data",
      time: "1 day ago",
      status: "success"
    },
    {
      action: "Compliance audit",
      dataset: "Consumer Credit Data",
      time: "2 days ago",
      status: "pending"
    },
    {
      action: "Revenue milestone",
      dataset: "Reached $30K monthly revenue",
      time: "1 week ago",
      status: "success"
    }
  ];

  const upcomingTasks = [
    {
      task: "Quarterly compliance review",
      deadline: "July 22, 2025",
      priority: "high"
    },
    {
      task: "Dataset quality validation",
      deadline: "July 18, 2025",
      priority: "medium"
    },
    {
      task: "Revenue report generation",
      deadline: "July 25, 2025",
      priority: "medium"
    },
    {
      task: "Customer feedback response",
      deadline: "July 17, 2025",
      priority: "high"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Portfolio Overview</h1>
          <p className="text-muted-foreground">
            Comprehensive view of your data provider portfolio performance and metrics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Datasets</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">$31.9K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quality Score</p>
                  <p className="text-2xl font-bold">98.5%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                  <p className="text-2xl font-bold">92/100</p>
                </div>
                <Award className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {portfolioSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${section.color}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Link href={section.href}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Primary Stats */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{section.stats.primary}</p>
                        <p className="text-sm text-muted-foreground">{section.stats.secondary}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {section.stats.trend}
                      </Badge>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {section.metrics.map((metric, index) => (
                        <div key={index} className="space-y-1">
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <div className="flex items-center space-x-1">
                            <p className="text-sm font-semibold">{metric.value}</p>
                            <div className="flex items-center">
                              {metric.trend === "up" && (
                                <ArrowUpRight className="h-3 w-3 text-green-500" />
                              )}
                              {metric.trend === "down" && (
                                <ArrowDownRight className="h-3 w-3 text-red-500" />
                              )}
                              <span className={`text-xs ${
                                metric.trend === "up" 
                                  ? "text-green-600" 
                                  : metric.trend === "down" 
                                    ? "text-red-600" 
                                    : "text-muted-foreground"
                              }`}>
                                {metric.change}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Section - Recent Activity and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === "success" 
                          ? "bg-green-500" 
                          : activity.status === "pending" 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.dataset}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Upcoming Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === "high" 
                          ? "bg-red-500" 
                          : task.priority === "medium" 
                            ? "bg-yellow-500" 
                            : "bg-green-500"
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{task.task}</p>
                        <p className="text-xs text-muted-foreground">{task.deadline}</p>
                      </div>
                    </div>
                    <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}