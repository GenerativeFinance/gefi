import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, GitBranch, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Star, TrendingUp, Database, Code } from "lucide-react";

export default function DeveloperCollaborationHistory() {
  const collaborationProjects = [
    {
      id: "PROJ-001",
      title: "Portfolio Risk Assessment Model",
      collaborators: ["Alice Johnson", "Bob Smith", "DataCorp Analytics"],
      type: "AI Model Development",
      status: "completed",
      startDate: "March 15, 2025",
      endDate: "June 20, 2025",
      description: "Collaborated with risk analysts to develop advanced portfolio risk assessment model using Monte Carlo simulations",
      contributions: ["Algorithm Design", "Backtesting Framework", "Performance Optimization"],
      rating: 4.8,
      revenue: "$12,500"
    },
    {
      id: "PROJ-002", 
      title: "Cryptocurrency Trading Algorithm",
      collaborators: ["CryptoData Inc", "Sarah Wilson", "Michael Chen"],
      type: "Trading Strategy",
      status: "active",
      startDate: "July 1, 2025",
      endDate: "Ongoing",
      description: "Building high-frequency crypto trading algorithm with real-time market data integration",
      contributions: ["Signal Processing", "Risk Management", "API Integration"],
      rating: 4.5,
      revenue: "$8,200"
    },
    {
      id: "PROJ-003",
      title: "ESG Investment Screener",
      collaborators: ["GreenData Solutions", "Emma Davis"],
      type: "Data Analysis",
      status: "review",
      startDate: "June 10, 2025",
      endDate: "August 15, 2025",
      description: "Developing ESG scoring model for sustainable investment portfolio management",
      contributions: ["Data Preprocessing", "ML Model Training", "Validation Testing"],
      rating: 4.2,
      revenue: "$6,800"
    }
  ];

  const recentActivity = [
    {
      type: "commit",
      project: "Portfolio Risk Assessment Model",
      user: "Guillaume Lauzier",
      action: "Pushed optimization improvements",
      time: "2 hours ago",
      details: "Improved model accuracy by 12%"
    },
    {
      type: "review",
      project: "Cryptocurrency Trading Algorithm", 
      user: "Sarah Wilson",
      action: "Approved code review",
      time: "4 hours ago",
      details: "LGTM - Signal processing looks good"
    },
    {
      type: "message",
      project: "ESG Investment Screener",
      user: "Emma Davis",
      action: "Left feedback on data quality",
      time: "1 day ago",
      details: "Need to handle missing ESG scores better"
    },
    {
      type: "merge",
      project: "Portfolio Risk Assessment Model",
      user: "Alice Johnson",
      action: "Merged feature branch",
      time: "2 days ago",
      details: "Monte Carlo improvements integrated"
    }
  ];

  const collaborationStats = [
    {
      label: "Active Projects",
      value: "3",
      change: "+1 this month",
      color: "text-green-600"
    },
    {
      label: "Completed Projects",
      value: "8",
      change: "+2 this quarter",
      color: "text-blue-600"
    },
    {
      label: "Total Collaborators",
      value: "24",
      change: "+5 this month",
      color: "text-purple-600"
    },
    {
      label: "Average Rating",
      value: "4.6",
      change: "+0.3 this quarter",
      color: "text-yellow-600"
    }
  ];

  const collaborators = [
    {
      name: "Alice Johnson",
      role: "Risk Analyst",
      avatar: "/api/placeholder/40/40",
      projects: 3,
      rating: 4.9,
      lastActive: "2 hours ago",
      specialties: ["Risk Management", "Portfolio Theory", "Statistical Analysis"]
    },
    {
      name: "DataCorp Analytics",
      role: "Data Provider",
      avatar: "/api/placeholder/40/40",
      projects: 2,
      rating: 4.7,
      lastActive: "1 day ago",
      specialties: ["Market Data", "Real-time Feeds", "Data Quality"]
    },
    {
      name: "Sarah Wilson",
      role: "Crypto Specialist",
      avatar: "/api/placeholder/40/40",
      projects: 1,
      rating: 4.8,
      lastActive: "4 hours ago",
      specialties: ["Cryptocurrency", "DeFi", "Blockchain Analysis"]
    },
    {
      name: "GreenData Solutions",
      role: "ESG Data Provider",
      avatar: "/api/placeholder/40/40",
      projects: 1,
      rating: 4.2,
      lastActive: "1 day ago",
      specialties: ["ESG Data", "Sustainability", "Corporate Governance"]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Collaboration History</h1>
            <p className="text-muted-foreground mt-2">
              Track your collaborative projects, partnerships, and team activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Start New Project
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              View Messages
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {collaborationStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Input placeholder="Search projects..." className="max-w-sm" />
              <select className="p-2 border rounded-md">
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Review</option>
                <option>Paused</option>
              </select>
            </div>
            <div className="grid gap-4">
              {collaborationProjects.map((project, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600">{project.id}</span>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          project.status === "completed" ? "success" : 
                          project.status === "active" ? "default" : 
                          "secondary"
                        }>
                          {project.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {project.status === "active" && <Clock className="h-3 w-3 mr-1" />}
                          {project.status === "review" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {project.status}
                        </Badge>
                        <Badge variant="outline">{project.type}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{project.startDate} - {project.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{project.collaborators.length} collaborators</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{project.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>{project.revenue}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Collaborators:</span>
                        <div className="flex gap-1">
                          {project.collaborators.map((collaborator, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {collaborator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Contributions:</span>
                        <div className="flex gap-1">
                          {project.contributions.map((contribution, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {contribution}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        {activity.type === "commit" && <GitBranch className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                        {activity.type === "review" && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                        {activity.type === "message" && <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                        {activity.type === "merge" && <Code className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{activity.user}</span>
                          <span className="text-sm text-muted-foreground">{activity.action}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{activity.project}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collaborators" className="space-y-6">
            <div className="grid gap-4">
              {collaborators.map((collaborator, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback>{collaborator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{collaborator.name}</div>
                          <div className="text-sm text-muted-foreground">{collaborator.role}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{collaborator.projects} projects</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{collaborator.rating}/5</span>
                            </div>
                            <span>Active {collaborator.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {collaborator.specialties.slice(0, 2).map((specialty, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {collaborator.specialties.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{collaborator.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Collaboration Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Project Completion Rate</span>
                      <span className="text-green-600">87%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "87%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Project Duration</span>
                      <span>3.2 months</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Collaboration Satisfaction</span>
                      <span className="text-yellow-600">4.6/5</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Top Collaboration Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Assessment</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: "80%" }} />
                      </div>
                      <span className="text-xs text-muted-foreground">5 projects</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trading Algorithms</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: "60%" }} />
                      </div>
                      <span className="text-xs text-muted-foreground">3 projects</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Analysis</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: "40%" }} />
                      </div>
                      <span className="text-xs text-muted-foreground">2 projects</span>
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