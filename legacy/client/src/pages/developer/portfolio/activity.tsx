import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import {
  Calendar,
  GitCommit,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Code,
  Rocket,
  MessageCircle,
  FileText,
  Database,
  TrendingUp
} from "lucide-react";

export default function DeveloperActivity() {
  // Sample activity data
  const projectTimeline = [
    {
      id: 1,
      modelName: "High-Frequency Trading Algorithm",
      status: "deployed",
      milestones: [
        { phase: "Development Started", date: "2025-03-15", completed: true },
        { phase: "Alpha Testing", date: "2025-04-20", completed: true },
        { phase: "Beta Release", date: "2025-05-10", completed: true },
        { phase: "Public Launch", date: "2025-06-15", completed: true },
        { phase: "Performance Optimization", date: "2025-07-01", completed: true }
      ]
    },
    {
      id: 2,
      modelName: "Portfolio Risk Assessment",
      status: "active",
      milestones: [
        { phase: "Development Started", date: "2025-02-01", completed: true },
        { phase: "Data Integration", date: "2025-03-15", completed: true },
        { phase: "Model Training", date: "2025-04-10", completed: true },
        { phase: "Backtesting", date: "2025-05-05", completed: true },
        { phase: "Production Release", date: "2025-05-20", completed: true }
      ]
    },
    {
      id: 3,
      modelName: "ESG Investment Screener",
      status: "in_development",
      milestones: [
        { phase: "Research & Planning", date: "2025-05-01", completed: true },
        { phase: "Data Collection", date: "2025-06-01", completed: true },
        { phase: "Model Development", date: "2025-07-01", completed: true },
        { phase: "Testing & Validation", date: "2025-07-20", completed: false },
        { phase: "Launch Preparation", date: "2025-08-15", completed: false }
      ]
    }
  ];

  const commitActivity = [
    { date: "2025-07-15", commits: 8, description: "Enhanced volatility prediction algorithms", model: "High-Frequency Trading Algorithm" },
    { date: "2025-07-14", commits: 5, description: "Fixed risk calculation edge cases", model: "Portfolio Risk Assessment" },
    { date: "2025-07-13", commits: 12, description: "Added new ESG data sources", model: "ESG Investment Screener" },
    { date: "2025-07-12", commits: 3, description: "Performance optimizations", model: "Market Sentiment Analyzer" },
    { date: "2025-07-11", commits: 7, description: "Updated documentation and API endpoints", model: "High-Frequency Trading Algorithm" },
    { date: "2025-07-10", commits: 4, description: "Bug fixes and stability improvements", model: "Portfolio Risk Assessment" },
    { date: "2025-07-09", commits: 9, description: "Integrated machine learning pipeline", model: "ESG Investment Screener" }
  ];

  const collaborators = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Data Provider",
      avatar: "SC",
      contributions: 45,
      specialization: "Market Data",
      joinDate: "2025-03-20",
      models: ["High-Frequency Trading Algorithm", "Market Sentiment Analyzer"]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Developer",
      avatar: "MR",
      contributions: 32,
      specialization: "Risk Analytics",
      joinDate: "2025-04-15",
      models: ["Portfolio Risk Assessment", "ESG Investment Screener"]
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Data Provider",
      avatar: "ET",
      contributions: 28,
      specialization: "ESG Data",
      joinDate: "2025-05-10",
      models: ["ESG Investment Screener"]
    },
    {
      id: 4,
      name: "David Park",
      role: "Developer",
      avatar: "DP",
      contributions: 19,
      specialization: "ML Engineering",
      joinDate: "2025-06-01",
      models: ["High-Frequency Trading Algorithm", "Portfolio Risk Assessment"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "in_development":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const totalCommits = commitActivity.reduce((sum, day) => sum + day.commits, 0);
  const activeCollaborators = collaborators.length;
  const totalContributions = collaborators.reduce((sum, collab) => sum + collab.contributions, 0);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Development Activity</h1>
            <p className="text-muted-foreground">
              Track project timelines, commits, and collaborative efforts
            </p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commits (July 2025)</p>
                  <p className="text-2xl font-bold">{totalCommits}</p>
                </div>
                <GitCommit className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Collaborators</p>
                  <p className="text-2xl font-bold">{activeCollaborators}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Contributions</p>
                  <p className="text-2xl font-bold">{totalContributions}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">{projectTimeline.length}</p>
                </div>
                <Rocket className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Details */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Project Timeline</TabsTrigger>
            <TabsTrigger value="commits">Commits & Contributions</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            {projectTimeline.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.modelName}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status === "deployed" && <Rocket className="h-3 w-3 mr-1" />}
                      {project.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {project.status === "in_development" && <Clock className="h-3 w-3 mr-1" />}
                      {project.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>Development milestones and key achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          milestone.completed 
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" 
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            milestone.completed ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {milestone.phase}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(milestone.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="commits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Commit Activity</CardTitle>
                <CardDescription>Summary of code commits and collaborative efforts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commitActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <GitCommit className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.model} • {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {activity.commits} commits
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborators" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collaborators.map((collaborator) => (
                <Card key={collaborator.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                          {collaborator.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{collaborator.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {collaborator.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {collaborator.specialization}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Contributions</span>
                            <span className="font-medium">{collaborator.contributions}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(collaborator.joinDate).toLocaleDateString()}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Working on:</p>
                            {collaborator.models.map((model, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs mr-1">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Collaboration Summary</CardTitle>
                <CardDescription>Overview of team contributions and involvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{collaborators.filter(c => c.role === "Data Provider").length}</p>
                    <p className="text-sm text-muted-foreground">Data Providers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{collaborators.filter(c => c.role === "Developer").length}</p>
                    <p className="text-sm text-muted-foreground">Developers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{totalContributions}</p>
                    <p className="text-sm text-muted-foreground">Total Contributions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}