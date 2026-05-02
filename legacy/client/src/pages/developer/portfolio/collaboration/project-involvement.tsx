import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "@/components/layout/Layout";
import {
  Users,
  Calendar,
  Target,
  GitBranch,
  Code,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Award,
  Eye,
  BarChart3,
  Handshake
} from "lucide-react";

export default function DeveloperCollaborationProjectInvolvement() {
  // Sample joint project data
  const jointProjects = [
    {
      id: 1,
      projectName: "Multi-Asset Risk Management Platform",
      description: "Collaborative platform integrating multiple AI models for comprehensive risk assessment",
      status: "Active",
      role: "Lead AI Developer",
      startDate: "March 15, 2025",
      estimatedCompletion: "September 2025",
      progress: 65,
      myContribution: ["AI Trading Bot Alpha", "Risk Assessment Model", "Feature Engineering"],
      collaborators: [
        { name: "Sarah Chen", role: "Data Scientist", company: "TechVenture", avatar: "SC" },
        { name: "Mike Johnson", role: "Backend Dev", company: "DataFlow Corp", avatar: "MJ" },
        { name: "Emily Watson", role: "Product Manager", company: "Future Capital", avatar: "EW" }
      ],
      funding: "$450,000",
      expectedROI: "18-25%",
      priority: "High",
      technologies: ["Python", "TensorFlow", "Docker", "Kubernetes"],
      recentActivity: "Deployed model v2.1 with improved accuracy (+3.2%)"
    },
    {
      id: 2,
      projectName: "DeFi Yield Optimization Engine",
      description: "Joint development of automated yield farming and liquidity optimization system",
      status: "In Development",
      role: "AI Model Contributor",
      startDate: "May 1, 2025",
      estimatedCompletion: "November 2025",
      progress: 40,
      myContribution: ["DeFi Prediction Model", "Yield Calculation Algorithms"],
      collaborators: [
        { name: "Alex Rodriguez", role: "Blockchain Dev", company: "CryptoTech", avatar: "AR" },
        { name: "Lisa Park", role: "DeFi Specialist", company: "Yield Labs", avatar: "LP" },
        { name: "David Kim", role: "Smart Contract Dev", company: "Web3 Solutions", avatar: "DK" }
      ],
      funding: "$320,000",
      expectedROI: "22-30%",
      priority: "Medium",
      technologies: ["Solidity", "Web3.js", "React", "Node.js"],
      recentActivity: "Completed integration testing for Uniswap V3 pools"
    },
    {
      id: 3,
      projectName: "Alternative Credit Scoring Model",
      description: "Machine learning model for non-traditional credit assessment using alternative data sources",
      status: "Completed",
      role: "Model Architect",
      startDate: "January 10, 2025",
      estimatedCompletion: "June 2025",
      progress: 100,
      myContribution: ["P2P Risk Assessment", "Credit Scoring Algorithms", "Data Preprocessing"],
      collaborators: [
        { name: "Jennifer Liu", role: "Data Engineer", company: "FinData Inc", avatar: "JL" },
        { name: "Robert Taylor", role: "ML Engineer", company: "AI Credit", avatar: "RT" }
      ],
      funding: "$180,000",
      expectedROI: "15%",
      priority: "Completed",
      technologies: ["Python", "Scikit-learn", "AWS", "PostgreSQL"],
      recentActivity: "Project successfully deployed to production"
    },
    {
      id: 4,
      projectName: "ESG Investment Analytics Suite",
      description: "Comprehensive ESG scoring and sustainable investment analysis platform",
      status: "Planning",
      role: "Technical Advisor",
      startDate: "August 2025",
      estimatedCompletion: "February 2026",
      progress: 15,
      myContribution: ["ESG Scoring Model", "Impact Assessment Algorithms"],
      collaborators: [
        { name: "Maria Silva", role: "ESG Analyst", company: "Green Capital", avatar: "MS" },
        { name: "James Wilson", role: "Portfolio Manager", company: "Sustainable Investments", avatar: "JW" }
      ],
      funding: "$275,000",
      expectedROI: "12-18%",
      priority: "Medium",
      technologies: ["Python", "R", "Tableau", "Apache Spark"],
      recentActivity: "Initial requirements gathering completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500 text-white";
      case "In Development": return "bg-blue-500 text-white";
      case "Planning": return "bg-yellow-500 text-white";
      case "Completed": return "bg-purple-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 border-red-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      case "Completed": return "text-purple-600 bg-purple-50 border-purple-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Project Involvement</h1>
          <p className="text-muted-foreground">Track your contributions to joint projects and collaborations</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Funding</p>
                  <p className="text-2xl font-bold text-green-600">$1.2M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collaborators</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg ROI</p>
                  <p className="text-2xl font-bold text-blue-600">21%</p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Cards */}
        <div className="space-y-6">
          {jointProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{project.projectName}</CardTitle>
                    <p className="text-muted-foreground mt-1">{project.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(project.priority)} border`}>
                      {project.priority}
                    </Badge>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Project Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Project Progress</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress 
                    value={project.progress} 
                    className="h-2"
                  />
                </div>

                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">My Role</p>
                    <p className="font-medium">{project.role}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Funding</p>
                    <p className="font-medium text-green-600">{project.funding}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Expected ROI</p>
                    <p className="font-medium text-blue-600">{project.expectedROI}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Est. Completion</p>
                    <p className="font-medium">{project.estimatedCompletion}</p>
                  </div>
                </div>

                {/* My Contributions */}
                <div>
                  <p className="text-sm font-medium mb-3">My Model Contributions</p>
                  <div className="flex flex-wrap gap-2">
                    {project.myContribution.map((contribution, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        <Code className="h-3 w-3 mr-1" />
                        {contribution}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <p className="text-sm font-medium mb-3">Technologies Used</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Collaborators */}
                <div>
                  <p className="text-sm font-medium mb-3">Project Collaborators</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {project.collaborators.map((collaborator, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{collaborator.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{collaborator.name}</p>
                          <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                          <p className="text-xs text-muted-foreground">{collaborator.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Recent Activity</p>
                      <p className="text-sm text-muted-foreground mt-1">{project.recentActivity}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Started: {project.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Target: {project.estimatedCompletion}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Project Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    Team Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Project Achievement Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Projects Completed</h3>
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-sm text-muted-foreground">100% on-time delivery</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Average Rating</h3>
                <p className="text-2xl font-bold text-blue-600">4.8/5</p>
                <p className="text-sm text-muted-foreground">From project partners</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">ROI Generated</h3>
                <p className="text-2xl font-bold text-purple-600">$2.1M</p>
                <p className="text-sm text-muted-foreground">Across all projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}