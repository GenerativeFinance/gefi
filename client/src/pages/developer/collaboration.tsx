import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  GitBranch, 
  Star, 
  Calendar,
  Search,
  Filter,
  Plus,
  Send,
  Eye,
  ExternalLink,
  Clock,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Code,
  Database,
  Shield,
  Zap,
  Target,
  Award
} from "lucide-react";

export default function DeveloperCollaboration() {
  const collaborations = [
    {
      id: 1,
      title: "Advanced Portfolio Risk Model",
      partner: "QuantTech Solutions",
      partnerType: "Data Provider",
      status: "Active",
      role: "Lead Developer",
      startDate: "2025-03-15",
      revenue: "$15,600",
      progress: 85,
      lastActivity: "2 hours ago",
      team: 5,
      description: "Developing sophisticated risk assessment model using real-time market data",
      technologies: ["Python", "TensorFlow", "AWS"],
      priority: "High"
    },
    {
      id: 2,
      title: "Crypto Sentiment Analysis Bot",
      partner: "CryptoData Inc",
      partnerType: "Data Provider",
      status: "In Progress",
      role: "AI Specialist",
      startDate: "2025-04-20",
      revenue: "$8,400",
      progress: 62,
      lastActivity: "1 day ago",
      team: 3,
      description: "Building sentiment analysis engine for cryptocurrency trading decisions",
      technologies: ["Python", "NLP", "Docker"],
      priority: "Medium"
    },
    {
      id: 3,
      title: "ESG Investment Optimizer",
      partner: "GreenFin Analytics",
      partnerType: "Investor",
      status: "Planning",
      role: "Technical Lead",
      startDate: "2025-06-01",
      revenue: "$22,000",
      progress: 15,
      lastActivity: "3 days ago",
      team: 4,
      description: "Creating ESG-focused investment optimization algorithm",
      technologies: ["R", "Machine Learning", "API"],
      priority: "High"
    }
  ];

  const invitations = [
    {
      id: 1,
      title: "Real-time Fraud Detection System",
      partner: "SecureBank Corp",
      partnerType: "Investor",
      budget: "$35,000",
      duration: "4 months",
      role: "Senior ML Engineer",
      skills: ["Machine Learning", "Python", "Real-time Processing"],
      deadline: "2025-08-15",
      description: "Develop advanced fraud detection system for banking transactions"
    },
    {
      id: 2,
      title: "Alternative Credit Scoring Model",
      partner: "FinTech Innovations",
      partnerType: "Data Provider",
      budget: "$18,500",
      duration: "3 months",
      role: "Data Scientist",
      skills: ["Credit Risk", "Statistical Modeling", "SQL"],
      deadline: "2025-07-30",
      description: "Build credit scoring model using alternative data sources"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      company: "QuantTech Solutions",
      message: "The latest model iteration shows 94.2% accuracy. Ready for production deployment?",
      timestamp: "2 hours ago",
      project: "Advanced Portfolio Risk Model",
      unread: true
    },
    {
      id: 2,
      sender: "Mike Rodriguez",
      company: "CryptoData Inc",
      message: "Updated dataset available. Can we schedule a review meeting this week?",
      timestamp: "1 day ago",
      project: "Crypto Sentiment Analysis Bot",
      unread: true
    },
    {
      id: 3,
      sender: "Emma Thompson",
      company: "GreenFin Analytics",
      message: "Thanks for the technical specifications. Our team is reviewing the proposal.",
      timestamp: "3 days ago",
      project: "ESG Investment Optimizer",
      unread: false
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Alex Kumar",
      role: "ML Engineer",
      company: "QuantTech Solutions",
      project: "Advanced Portfolio Risk Model",
      contributions: 156,
      rating: 4.8,
      status: "online"
    },
    {
      id: 2,
      name: "Jennifer Walsh",
      role: "Data Scientist",
      company: "CryptoData Inc",
      project: "Crypto Sentiment Analysis Bot",
      contributions: 89,
      rating: 4.9,
      status: "away"
    },
    {
      id: 3,
      name: "David Park",
      role: "Backend Developer",
      company: "GreenFin Analytics",
      project: "ESG Investment Optimizer",
      contributions: 45,
      rating: 4.7,
      status: "offline"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Developer Collaboration
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage partnerships, team collaboration, and project communications
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  3 Active Projects
                </Badge>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Collaboration
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Collaborations</p>
                    <p className="text-2xl font-bold text-blue-600">3</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">+1 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">$46,000</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">+23% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Across all projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">4.8</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">From partners</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="projects">Active Projects</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Active Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Active Collaboration Projects</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search projects..." className="pl-10 w-64" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {collaborations.map((collab) => (
                  <Card key={collab.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{collab.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={collab.status === 'Active' ? 'default' : 
                                         collab.status === 'Planning' ? 'secondary' : 'outline'}>
                            {collab.status}
                          </Badge>
                          <Badge variant="outline" className={collab.priority === 'High' ? 'border-red-200 text-red-700' : 
                                                             collab.priority === 'Medium' ? 'border-yellow-200 text-yellow-700' : 
                                                             'border-green-200 text-green-700'}>
                            {collab.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {collab.partner}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {collab.role}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {collab.description}
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Progress</span>
                          <span className="text-blue-600">{collab.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all" 
                            style={{ width: `${collab.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                          <p className="text-sm font-semibold text-green-600">{collab.revenue}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Size</p>
                          <p className="text-sm font-semibold">{collab.team} members</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Started</p>
                          <p className="text-sm font-semibold">{new Date(collab.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Activity</p>
                          <p className="text-sm font-semibold">{collab.lastActivity}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {collab.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Code className="w-3 h-3 mr-1" />
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Invitations Tab */}
            <TabsContent value="invitations" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Collaboration Invitations</h2>
                <Badge variant="outline">{invitations.length} Pending</Badge>
              </div>

              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <Card key={invitation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{invitation.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            from {invitation.partner} • {invitation.partnerType}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Clock className="w-4 h-4 mr-1" />
                          Pending
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {invitation.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget</p>
                          <p className="text-sm font-semibold text-green-600">{invitation.budget}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</p>
                          <p className="text-sm font-semibold">{invitation.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Role</p>
                          <p className="text-sm font-semibold">{invitation.role}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deadline</p>
                          <p className="text-sm font-semibold">{new Date(invitation.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {invitation.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept Invitation
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Discuss Terms
                        </Button>
                        <Button variant="ghost">
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Team Communications</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    2 Unread
                  </Badge>
                  <Button size="sm">
                    <Send className="w-4 h-4 mr-1" />
                    New Message
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className={message.unread ? 'border-blue-200 bg-blue-50/30' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {message.sender.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold">{message.sender}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{message.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{message.timestamp}</p>
                          {message.unread && (
                            <Badge variant="default" className="text-xs mt-1">New</Badge>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <Badge variant="outline" className="text-xs mb-2">
                          {message.project}
                        </Badge>
                        <p className="text-gray-700 dark:text-gray-300">{message.message}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Send className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Collaboration Team Members</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            member.status === 'online' ? 'bg-green-500' : 
                            member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Company</span>
                          <span className="font-medium">{member.company}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Project</span>
                          <span className="font-medium text-xs">{member.project.substring(0, 20)}...</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Contributions</span>
                          <span className="font-medium">{member.contributions}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{member.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Collaboration Analytics</h2>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Last 30 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {collaborations.map((collab, index) => (
                        <div key={collab.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-blue-500' : 
                              index === 1 ? 'bg-green-500' : 'bg-purple-500'
                            }`}></div>
                            <span className="text-sm font-medium">{collab.title.substring(0, 25)}...</span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">{collab.revenue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Collaboration Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">Projects Completed</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">8</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">Success Rate</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">94%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium">Avg Partner Rating</span>
                        </div>
                        <span className="text-lg font-bold text-purple-600">4.8/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Award className="w-6 h-6 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Top Collaborator Badge</p>
                        <p className="text-xs text-gray-500">Earned for exceptional partnership performance</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Project Milestone Reached</p>
                        <p className="text-xs text-gray-500">Advanced Portfolio Risk Model - 85% completion</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Star className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">5-Star Partner Review</p>
                        <p className="text-xs text-gray-500">Received from QuantTech Solutions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}