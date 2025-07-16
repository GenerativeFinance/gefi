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
  Clock
} from "lucide-react";

export default function DeveloperPortfolioOverview() {
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
        secondary: "3 Active, 2 Pending",
        trend: "+2 this month"
      },
      metrics: [
        { label: "Total Models", value: "12", change: "+2" },
        { label: "Active", value: "3", change: "0" },
        { label: "Draft", value: "2", change: "+1" }
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
        primary: "92% Avg Accuracy",
        secondary: "200 Users",
        trend: "+5% this week"
      },
      metrics: [
        { label: "Accuracy", value: "92%", change: "+3%" },
        { label: "Users", value: "200", change: "+15" },
        { label: "Uptime", value: "99.5%", change: "+0.2%" }
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
        primary: "50 Commits",
        secondary: "3 Projects Active",
        trend: "5 commits this week"
      },
      metrics: [
        { label: "Commits", value: "50", change: "+5" },
        { label: "Projects", value: "3", change: "0" },
        { label: "Contributors", value: "4", change: "+1" }
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
        primary: "$50,000 Raised",
        secondary: "15% ROI Q2",
        trend: "+$5K this month"
      },
      metrics: [
        { label: "Total Funding", value: "$50K", change: "+$5K" },
        { label: "ROI", value: "15%", change: "+3%" },
        { label: "Investors", value: "8", change: "+2" }
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
        primary: "4.7/5 Rating",
        secondary: "89% Response Rate",
        trend: "12 new reviews"
      },
      metrics: [
        { label: "Rating", value: "4.7/5", change: "+0.1" },
        { label: "Reviews", value: "156", change: "+12" },
        { label: "Response Rate", value: "89%", change: "+5%" }
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
        primary: "SEC Compliant",
        secondary: "Last Audit: July 5",
        trend: "2 pending actions"
      },
      metrics: [
        { label: "Compliance Rate", value: "98%", change: "+2%" },
        { label: "Audits", value: "5", change: "+1" },
        { label: "Issues", value: "2", change: "-1" }
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
        primary: "85/100 Score",
        secondary: "Top 15% Developer",
        trend: "+3 points this month"
      },
      metrics: [
        { label: "Overall Score", value: "85/100", change: "+3" },
        { label: "Rank", value: "Top 15%", change: "+2%" },
        { label: "Milestones", value: "12/15", change: "+1" }
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
                  <p className="text-2xl font-bold">4.7</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">2,840</p>
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

        {/* Recent Activity & Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <p className="text-sm text-muted-foreground">{activity.model}</p>
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

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
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
                
                <Button className="w-full mt-4" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}