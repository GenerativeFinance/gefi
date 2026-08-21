import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Settings,
  Star,
  Code,
  GitBranch,
  Play,
  Pause,
  Target,
  MessageCircle,
  FileText,
  Award,
  Building,
  Globe
} from "lucide-react";

export default function DeveloperCollaborationProjects() {
  const projects = [
    {
      id: 1,
      name: "AI Trading Bot Enterprise",
      description: "Advanced AI-powered trading bot for institutional investors with real-time market analysis",
      status: "active",
      progress: 75,
      collaborators: [
        { name: "Sarah Chen", role: "Data Scientist", avatar: "/api/placeholder/32/32" },
        { name: "Mike Johnson", role: "Backend Developer", avatar: "/api/placeholder/32/32" },
        { name: "Elena Rodriguez", role: "AI Specialist", avatar: "/api/placeholder/32/32" }
      ],
      budget: "$125,000",
      deadline: "August 15, 2025",
      priority: "high",
      category: "Trading Algorithms",
      client: "Quantum Capital Partners",
      revenue: "$45,000",
      milestones: {
        completed: 6,
        total: 8
      },
      technologies: ["Python", "TensorFlow", "React", "Node.js"],
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      name: "Risk Assessment Model",
      description: "Comprehensive risk assessment model for portfolio management with Monte Carlo simulations",
      status: "planning",
      progress: 25,
      collaborators: [
        { name: "David Kim", role: "Quantitative Analyst", avatar: "/api/placeholder/32/32" },
        { name: "Lisa Wang", role: "Risk Manager", avatar: "/api/placeholder/32/32" }
      ],
      budget: "$80,000",
      deadline: "September 30, 2025",
      priority: "medium",
      category: "Risk Management",
      client: "Global Asset Management",
      revenue: "$20,000",
      milestones: {
        completed: 2,
        total: 10
      },
      technologies: ["R", "Python", "MATLAB", "Vue.js"],
      lastActivity: "1 day ago"
    },
    {
      id: 3,
      name: "Crypto Market Predictor",
      description: "Machine learning model for cryptocurrency market prediction and sentiment analysis",
      status: "completed",
      progress: 100,
      collaborators: [
        { name: "Alex Turner", role: "ML Engineer", avatar: "/api/placeholder/32/32" },
        { name: "Jessica Brown", role: "Data Engineer", avatar: "/api/placeholder/32/32" },
        { name: "Tom Wilson", role: "Frontend Developer", avatar: "/api/placeholder/32/32" }
      ],
      budget: "$95,000",
      deadline: "June 30, 2025",
      priority: "completed",
      category: "Cryptocurrency",
      client: "CryptoTech Solutions",
      revenue: "$85,000",
      milestones: {
        completed: 12,
        total: 12
      },
      technologies: ["Python", "Keras", "Angular", "Express"],
      lastActivity: "2 weeks ago"
    },
    {
      id: 4,
      name: "ESG Investment Platform",
      description: "Sustainable investment platform with ESG scoring and impact measurement",
      status: "on-hold",
      progress: 40,
      collaborators: [
        { name: "Maria Garcia", role: "ESG Analyst", avatar: "/api/placeholder/32/32" },
        { name: "James Lee", role: "Full Stack Developer", avatar: "/api/placeholder/32/32" }
      ],
      budget: "$110,000",
      deadline: "October 15, 2025",
      priority: "low",
      category: "ESG Analytics",
      client: "Green Capital Fund",
      revenue: "$25,000",
      milestones: {
        completed: 4,
        total: 9
      },
      technologies: ["TypeScript", "React", "Node.js", "PostgreSQL"],
      lastActivity: "1 week ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Collaboration Projects</h1>
            <p className="text-muted-foreground">
              Manage your active projects, team collaborations, and development milestones
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Project Name</label>
                    <Input placeholder="Enter project name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trading">Trading Algorithms</SelectItem>
                        <SelectItem value="risk">Risk Management</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="esg">ESG Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Project description" rows={3} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Budget</label>
                    <Input placeholder="$0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deadline</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">$175K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-10" />
              </div>
              <div className="flex gap-3">
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                    <SelectItem value="risk">Risk Management</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="esg">ESG Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {project.client}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {project.deadline}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Milestones */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Milestones</span>
                      <Badge variant="outline">
                        {project.milestones.completed}/{project.milestones.total}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{project.revenue}</span>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <p className="text-sm font-medium mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Code className="h-3 w-3 mr-1" />
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Team */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Team Members</span>
                      <span className="text-xs text-muted-foreground">
                        Last activity: {project.lastActivity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.collaborators.map((member, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-lg px-2 py-1">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium">{member.name}</span>
                            <span className="text-xs text-muted-foreground">{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    <Button className="flex-1">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Open Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}