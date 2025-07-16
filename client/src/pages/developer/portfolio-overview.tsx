import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import { Link } from "wouter";
import { 
  Brain,
  TrendingUp,
  Activity,
  DollarSign,
  MessageCircle,
  Shield,
  Award,
  Users,
  Calendar,
  Star,
  ChevronRight,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  FileText,
  GitCommit,
  Code,
  Building,
  Zap
} from "lucide-react";

export default function DeveloperPortfolioOverview() {
  // Portfolio overview statistics
  const portfolioStats = {
    totalModels: 12,
    activeModels: 8,
    totalUsers: 1247,
    totalRevenue: 125000,
    avgAccuracy: 92.3,
    totalFunding: 75000,
    complianceScore: 95,
    overallScore: 88
  };

  const portfolioSections = [
    {
      id: "ai-models",
      title: "AI Models",
      description: "Manage your published AI financial models and track their performance",
      icon: Brain,
      href: "/developer/portfolio/ai-models",
      color: "bg-blue-500",
      stats: {
        primary: "12 Models",
        secondary: "8 Active, 2 Draft, 2 Review",
        trend: "+2 this month"
      },
      metrics: [
        { label: "Published", value: "8", change: "+2", trend: "up" },
        { label: "Draft", value: "2", change: "0", trend: "neutral" },
        { label: "Under Review", value: "2", change: "+1", trend: "up" },
        { label: "Total Downloads", value: "2.4K", change: "+312", trend: "up" }
      ]
    },
    {
      id: "performance",
      title: "Performance",
      description: "Track accuracy scores, usage statistics, and model validation results",
      icon: TrendingUp,
      href: "/developer/portfolio/performance",
      color: "bg-green-500",
      stats: {
        primary: "92.3% Avg Accuracy",
        secondary: "1,247 Active Users",
        trend: "+5.2% this week"
      },
      metrics: [
        { label: "Accuracy", value: "92.3%", change: "+3.1%", trend: "up" },
        { label: "Users", value: "1,247", change: "+89", trend: "up" },
        { label: "Uptime", value: "99.5%", change: "+0.2%", trend: "up" },
        { label: "API Calls", value: "45.2K", change: "+8.7K", trend: "up" }
      ]
    },
    {
      id: "activity",
      title: "Activity",
      description: "View project timelines, commit tracking, and collaborator management",
      icon: Activity,
      href: "/developer/portfolio/activity",
      color: "bg-purple-500",
      stats: {
        primary: "127 Commits",
        secondary: "5 Active Projects",
        trend: "23 commits this week"
      },
      metrics: [
        { label: "Commits", value: "127", change: "+23", trend: "up" },
        { label: "Projects", value: "5", change: "+1", trend: "up" },
        { label: "Contributors", value: "8", change: "+2", trend: "up" },
        { label: "Pull Requests", value: "34", change: "+7", trend: "up" }
      ]
    },
    {
      id: "funding",
      title: "Funding",
      description: "Monitor investment tracking, ROI metrics, and funding history",
      icon: DollarSign,
      href: "/developer/portfolio/funding",
      color: "bg-yellow-500",
      stats: {
        primary: "$75,000 Raised",
        secondary: "18.5% ROI Q2",
        trend: "+$12K this month"
      },
      metrics: [
        { label: "Total Funding", value: "$75K", change: "+$12K", trend: "up" },
        { label: "ROI", value: "18.5%", change: "+3.2%", trend: "up" },
        { label: "Investors", value: "12", change: "+3", trend: "up" },
        { label: "Revenue", value: "$42.8K", change: "+$8.5K", trend: "up" }
      ]
    },
    {
      id: "feedback",
      title: "Feedback",
      description: "Manage user ratings, response tracking, and comment management",
      icon: MessageCircle,
      href: "/developer/portfolio/feedback",
      color: "bg-orange-500",
      stats: {
        primary: "4.8/5 Rating",
        secondary: "94% Response Rate",
        trend: "23 new reviews"
      },
      metrics: [
        { label: "Rating", value: "4.8/5", change: "+0.2", trend: "up" },
        { label: "Reviews", value: "189", change: "+23", trend: "up" },
        { label: "Response Rate", value: "94%", change: "+8%", trend: "up" },
        { label: "Satisfaction", value: "96%", change: "+5%", trend: "up" }
      ]
    },
    {
      id: "compliance",
      title: "Compliance",
      description: "Track regulatory adherence, audit logs, and compliance actions",
      icon: Shield,
      href: "/developer/portfolio/compliance",
      color: "bg-red-500",
      stats: {
        primary: "95% Compliant",
        secondary: "Last Audit: July 12",
        trend: "1 pending action"
      },
      metrics: [
        { label: "Compliance Rate", value: "95%", change: "+2%", trend: "up" },
        { label: "Audits Passed", value: "7/8", change: "+1", trend: "up" },
        { label: "Issues Resolved", value: "15", change: "+3", trend: "up" },
        { label: "Certifications", value: "4", change: "+1", trend: "up" }
      ]
    },
    {
      id: "score",
      title: "Score",
      description: "View overall developer score, milestones, and performance rankings",
      icon: Award,
      href: "/developer/portfolio/score",
      color: "bg-indigo-500",
      stats: {
        primary: "88/100 Score",
        secondary: "Top 12% Developer",
        trend: "+5 points this month"
      },
      metrics: [
        { label: "Overall Score", value: "88/100", change: "+5", trend: "up" },
        { label: "Rank", value: "Top 12%", change: "+3%", trend: "up" },
        { label: "Milestones", value: "14/16", change: "+2", trend: "up" },
        { label: "Achievements", value: "23", change: "+4", trend: "up" }
      ]
    }
  ];

  const recentActivity = [
    {
      action: "Model deployment",
      model: "Portfolio Risk Analyzer v2.1",
      time: "2 hours ago",
      status: "success"
    },
    {
      action: "Funding received",
      model: "Smart Trading Bot",
      time: "1 day ago",
      status: "success"
    },
    {
      action: "Compliance review",
      model: "Credit Risk Model",
      time: "3 days ago",
      status: "pending"
    },
    {
      action: "Performance update",
      model: "Market Prediction Engine",
      time: "1 week ago",
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
      task: "Model accuracy validation",
      deadline: "July 20, 2025",
      priority: "medium"
    },
    {
      task: "Investor presentation",
      deadline: "July 30, 2025",
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
            Comprehensive view of your developer portfolio performance and metrics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Models</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">$125K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                  <p className="text-2xl font-bold">88/100</p>
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
                        <p className="text-xs text-muted-foreground">{activity.model}</p>
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