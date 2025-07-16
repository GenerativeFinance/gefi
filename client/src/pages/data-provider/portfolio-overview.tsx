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
  Target
} from "lucide-react";

export default function DataProviderPortfolioOverview() {
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
        { label: "Downloads", value: "3,196", change: "+18%" },
        { label: "API Calls", value: "125K", change: "+12%" },
        { label: "Users", value: "235", change: "+25%" }
      ]
    },
    {
      id: "quality",
      title: "Quality Metrics",
      description: "Track data accuracy, completeness, and validation scores",
      icon: CheckCircle,
      href: "/data-provider/portfolio/quality",
      color: "bg-green-500",
      stats: {
        primary: "98.5% Quality Score",
        secondary: "99.2% Completeness",
        trend: "+2.5% improvement"
      },
      metrics: [
        { label: "Quality", value: "98.5%", change: "+2.5%" },
        { label: "Accuracy", value: "97.8%", change: "+1.2%" },
        { label: "Freshness", value: "99.1%", change: "+0.8%" }
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
        trend: "+14% from last month"
      },
      metrics: [
        { label: "Revenue", value: "$31.9K", change: "+14%" },
        { label: "Subscriptions", value: "45", change: "+8" },
        { label: "ARPU", value: "$710", change: "+6%" }
      ]
    },
    {
      id: "compliance",
      title: "Compliance Status",
      description: "Track regulatory adherence, audit requirements, and data governance",
      icon: Shield,
      href: "/data-provider/portfolio/compliance",
      color: "bg-red-500",
      stats: {
        primary: "GDPR Compliant",
        secondary: "SOC 2 Certified",
        trend: "Last audit: June 15"
      },
      metrics: [
        { label: "Compliance Rate", value: "100%", change: "0%" },
        { label: "Audits", value: "3", change: "+1" },
        { label: "Issues", value: "0", change: "-2" }
      ]
    },
    {
      id: "feedback",
      title: "Reviews & Feedback",
      description: "Manage subscriber reviews, ratings, and support interactions",
      icon: MessageCircle,
      href: "/data-provider/portfolio/feedback",
      color: "bg-orange-500",
      stats: {
        primary: "4.8/5 Rating",
        secondary: "94% Satisfaction",
        trend: "23 new reviews"
      },
      metrics: [
        { label: "Rating", value: "4.8/5", change: "+0.2" },
        { label: "Reviews", value: "89", change: "+23" },
        { label: "Response", value: "94%", change: "+8%" }
      ]
    },
    {
      id: "collaboration",
      title: "Collaboration Hub",
      description: "Partner management, developer relations, and joint projects",
      icon: Users,
      href: "/data-provider/portfolio/collaboration",
      color: "bg-purple-500",
      stats: {
        primary: "12 Active Partners",
        secondary: "8 Joint Projects",
        trend: "+3 new partnerships"
      },
      metrics: [
        { label: "Partners", value: "12", change: "+3" },
        { label: "Projects", value: "8", change: "+2" },
        { label: "Developers", value: "34", change: "+7" }
      ]
    },
    {
      id: "score",
      title: "Provider Score",
      description: "Overall performance score, rankings, and achievement tracking",
      icon: Award,
      href: "/data-provider/portfolio/score",
      color: "bg-indigo-500",
      stats: {
        primary: "92/100 Score",
        secondary: "Top 10% Provider",
        trend: "+5 points this month"
      },
      metrics: [
        { label: "Overall", value: "92/100", change: "+5" },
        { label: "Rank", value: "Top 10%", change: "+2%" },
        { label: "Badges", value: "8/12", change: "+2" }
      ]
    }
  ];

  const topDatasets = [
    {
      name: "Financial Market Data Q3 2025",
      downloads: "1,247",
      revenue: "$12,450",
      rating: 4.9,
      trend: "+23%"
    },
    {
      name: "Real Estate Pricing Analytics",
      downloads: "892",
      revenue: "$8,920",
      rating: 4.7,
      trend: "+15%"
    },
    {
      name: "Cryptocurrency Market Data",
      downloads: "654",
      revenue: "$6,540",
      rating: 4.8,
      trend: "+31%"
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
      action: "New subscription",
      dataset: "Real Estate Pricing Analytics",
      time: "4 hours ago",
      status: "success"
    },
    {
      action: "Quality check",
      dataset: "Cryptocurrency Market Data",
      time: "1 day ago",
      status: "pending"
    },
    {
      action: "Revenue milestone",
      dataset: "All datasets",
      time: "2 days ago",
      status: "success"
    }
  ];

  const upcomingTasks = [
    {
      task: "Quarterly compliance review",
      deadline: "July 25, 2025",
      priority: "high"
    },
    {
      task: "Dataset quality validation",
      deadline: "July 22, 2025",
      priority: "medium"
    },
    {
      task: "Partner agreement renewal",
      deadline: "July 28, 2025",
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
            Comprehensive dashboard for your data provider portfolio performance and analytics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Datasets</p>
                  <p className="text-2xl font-bold">15</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">235</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {portfolioSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${section.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription className="text-sm">{section.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Main Stats */}
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">{section.stats.primary}</p>
                      <p className="text-sm text-muted-foreground">{section.stats.secondary}</p>
                      <p className="text-xs text-green-600">{section.stats.trend}</p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {section.metrics.map((metric, index) => (
                        <div key={index} className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-sm font-medium">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <p className="text-xs text-green-600">{metric.change}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button asChild className="w-full" variant="outline">
                      <Link href={section.href}>
                        View Details
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Top Datasets & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Performing Datasets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Performing Datasets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDatasets.map((dataset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{dataset.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {dataset.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {dataset.revenue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {dataset.rating}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {dataset.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.dataset}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                      <Badge 
                        className={`text-xs ${
                          activity.status === 'success' ? 'bg-green-100 text-green-800' : 
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {activity.status === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {activity.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {activity.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks & Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-muted-foreground">{task.deadline}</p>
                  </div>
                  <Badge 
                    className={`text-xs ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}