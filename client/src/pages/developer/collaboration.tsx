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
  Star, 
  Calendar,
  Search,
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
  Award,
  Building,
  FileText,
  Settings,
  Bell,
  Video,
  Lock,
  Download,
  Play,
  BarChart,
  Activity,
  Handshake,
  CreditCard,
  FileCheck,
  UserCheck,
  MessageSquare,
  Briefcase,
  Scale,
  Key,
  Monitor,
  Globe,
  Gavel,
  Share,
  Mail,
  Phone,
  CheckSquare,
  FileDown,
  Folder,
  GitBranch,
  CloudUpload,
  Archive,
  Hash,
  AlertTriangle,
  Info,
  UserPlus,
  Calendar as CalendarIcon,
  MapPin,
  Link2,
  Filter,
  SortAsc,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Megaphone
} from "lucide-react";

export default function DeveloperCollaboration() {
  const collaborationStats = {
    activeCollaborations: 3,
    totalRevenue: "$46,000",
    teamMembers: 8,
    avgRating: 4.8,
    revenueGrowth: "+23%",
    teamGrowth: "+1"
  };

  const activeProjects = [
    {
      id: 1,
      name: "Quantum Risk Model",
      partner: "Quantum Capital Partners",
      type: "investor",
      status: "Active",
      progress: 85,
      deadline: "Aug 15, 2025",
      revenue: "$25,000",
      teamSize: 4
    },
    {
      id: 2,
      name: "ESG Portfolio Optimizer",
      partner: "Green Investment Fund",
      type: "investor",
      status: "Active",
      progress: 60,
      deadline: "Sep 30, 2025",
      revenue: "$18,000",
      teamSize: 3
    },
    {
      id: 3,
      name: "Real-time Fraud Detection",
      partner: "FinTech Solutions",
      type: "investor",
      status: "Planning",
      progress: 25,
      deadline: "Oct 20, 2025",
      revenue: "$35,000",
      teamSize: 5
    }
  ];

  const invitations = [
    {
      id: 1,
      from: "TechVenture Capital",
      project: "Crypto Portfolio Optimizer",
      type: "investor",
      funding: "$50,000",
      deadline: "2025-07-25",
      status: "pending",
      description: "Develop AI-powered cryptocurrency portfolio optimization platform",
      requirements: ["Machine Learning", "Blockchain", "Portfolio Theory"]
    },
    {
      id: 2,
      from: "Reuters Data Services",
      project: "Real-time Sentiment Analyzer",
      type: "data_provider",
      funding: "$25,000",
      deadline: "2025-07-30",
      status: "pending",
      description: "Build real-time news sentiment analysis for financial markets",
      requirements: ["NLP", "Real-time Processing", "Financial Markets"]
    },
    {
      id: 3,
      from: "SEC Technology Division",
      project: "Compliance Monitoring System",
      type: "regulator",
      funding: "$75,000",
      deadline: "2025-08-15",
      status: "pending",
      description: "Automated compliance monitoring for investment advisors",
      requirements: ["Regulatory Compliance", "Data Analysis", "Risk Management"]
    }
  ];

  const resources = [
    {
      id: 1,
      title: "API Documentation Hub",
      description: "Comprehensive documentation for all integrated APIs",
      type: "documentation",
      access: "All Team Members",
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      title: "Development Guidelines",
      description: "Best practices and coding standards for collaborative projects",
      type: "guidelines",
      access: "Developers Only",
      lastUpdated: "1 week ago"
    },
    {
      id: 3,
      title: "Compliance Checklist",
      description: "Regulatory compliance requirements and verification steps",
      type: "compliance",
      access: "All Team Members",
      lastUpdated: "3 days ago"
    },
    {
      id: 4,
      title: "Data Security Protocols",
      description: "Security guidelines for handling sensitive financial data",
      type: "security",
      access: "Certified Members",
      lastUpdated: "1 day ago"
    }
  ];

  const messages = [
    {
      id: 1,
      from: "Sarah Chen",
      organization: "Quantum Capital",
      message: "The risk model backtesting results look excellent. Ready for production deployment.",
      time: "2 hours ago",
      type: "investor",
      unread: true,
      priority: "high"
    },
    {
      id: 2,
      from: "Michael Rodriguez",
      organization: "Bloomberg Terminal",
      message: "Updated API documentation available. New rate limits effective next week.",
      time: "5 hours ago",
      type: "data_provider",
      unread: false,
      priority: "medium"
    },
    {
      id: 3,
      from: "Jessica Park",
      organization: "SEC Technology",
      message: "Compliance review completed. Minor documentation updates required.",
      time: "1 day ago",
      type: "regulator",
      unread: true,
      priority: "high"
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "Project Milestone Reached",
      message: "Quantum Risk Model reached 85% completion",
      type: "success",
      time: "1 hour ago",
      read: false
    },
    {
      id: 2,
      title: "New Collaboration Invitation",
      message: "TechVenture Capital invited you to Crypto Portfolio Optimizer",
      type: "invitation",
      time: "3 hours ago",
      read: false
    },
    {
      id: 3,
      title: "Compliance Update Required",
      message: "SEC documentation review requires minor updates",
      type: "warning",
      time: "6 hours ago",
      read: true
    },
    {
      id: 4,
      title: "Payment Received",
      message: "Received $8,500 from Green Investment Fund",
      type: "payment",
      time: "1 day ago",
      read: true
    }
  ];

  const investorRelations = [
    {
      name: "Quantum Capital Partners",
      status: "Active",
      investment: "$50,000",
      equity: "12%",
      contact: "Sarah Chen",
      reliability: "99.9%"
    }
  ];

  const dataProviders = [
    {
      name: "Bloomberg Terminal",
      status: "Active",
      apiCalls: "2.3M/month",
      reliability: "99.9%",
      contact: "Michael Rodriguez"
    }
  ];

  const regulatoryCompliance = [
    {
      authority: "SEC",
      requirement: "Model Documentation",
      status: "Compliant",
      nextReview: "December 2025",
      contact: "Regional Office"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Developer Collaboration
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage partnerships, team collaboration, and project communications
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {collaborationStats.activeCollaborations} Active Projects
                </Badge>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Collaboration
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Collaborations</p>
                      <p className="text-2xl font-bold text-blue-600">{collaborationStats.activeCollaborations}</p>
                      <p className="text-xs text-gray-500">{collaborationStats.teamGrowth} from last month</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">{collaborationStats.totalRevenue}</p>
                      <p className="text-xs text-gray-500">{collaborationStats.revenueGrowth} from last month</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Team Members</p>
                      <p className="text-2xl font-bold text-purple-600">{collaborationStats.teamMembers}</p>
                      <p className="text-xs text-gray-500">Across all projects</p>
                    </div>
                    <UserCheck className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Avg Rating</p>
                      <p className="text-2xl font-bold text-yellow-600">{collaborationStats.avgRating}</p>
                      <p className="text-xs text-gray-500">From partners</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="messaging">Messaging</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Investor Relations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      Investor Relations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{investorRelations[0].name}</h4>
                        <Badge variant="default">{investorRelations[0].status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Investment</p>
                          <p className="font-semibold text-green-600">{investorRelations[0].investment}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Equity</p>
                          <p className="font-semibold">{investorRelations[0].equity}</p>
                        </div>
                      </div>
                      <div className="text-xs">
                        <p className="text-gray-500">Contact: {investorRelations[0].contact}</p>
                        <p className="text-gray-500">Reliability: {investorRelations[0].reliability}</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Providers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-green-600" />
                      Data Providers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{dataProviders[0].name}</h4>
                        <Badge variant="default">{dataProviders[0].status}</Badge>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">API Calls</span>
                          <span className="font-semibold">{dataProviders[0].apiCalls}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Reliability</span>
                          <span className="font-semibold text-green-600">{dataProviders[0].reliability}</span>
                        </div>
                        <p className="text-gray-500">Contact: {dataProviders[0].contact}</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <Settings className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Regulatory Compliance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      Regulatory Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{regulatoryCompliance[0].authority}</h4>
                        <Badge variant="default">{regulatoryCompliance[0].status}</Badge>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-gray-500">Requirement</p>
                          <p className="font-semibold">{regulatoryCompliance[0].requirement}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Next Review</p>
                          <p className="font-semibold">{regulatoryCompliance[0].nextReview}</p>
                        </div>
                        <p className="text-gray-500">Contact: {regulatoryCompliance[0].contact}</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <FileCheck className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Active Projects</h3>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search projects..." className="w-64" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeProjects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">{project.name}</h4>
                          <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Partner: {project.partner}</p>
                          <p className="text-sm text-gray-600">Deadline: {project.deadline}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Revenue</p>
                            <p className="font-semibold text-green-600">{project.revenue}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Team Size</p>
                            <p className="font-semibold">{project.teamSize} members</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="default" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Team Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Invitations Tab */}
            <TabsContent value="invitations" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Collaboration Invitations</h3>
                  <Badge variant="secondary">{invitations.length} Pending</Badge>
                </div>

                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <Card key={invitation.id}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{invitation.project}</h4>
                            <p className="text-sm text-gray-600">From: {invitation.from}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{invitation.funding}</p>
                            <p className="text-xs text-gray-500">Deadline: {invitation.deadline}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300">{invitation.description}</p>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Required Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {invitation.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="default" className="flex-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="ghost">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Collaboration Resources</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Resource
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          {resource.type === 'documentation' && <BookOpen className="w-5 h-5 text-blue-600" />}
                          {resource.type === 'guidelines' && <FileText className="w-5 h-5 text-green-600" />}
                          {resource.type === 'compliance' && <Shield className="w-5 h-5 text-red-600" />}
                          {resource.type === 'security' && <Lock className="w-5 h-5 text-purple-600" />}
                          <div>
                            <h4 className="font-semibold">{resource.title}</h4>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-gray-500">Access: {resource.access}</p>
                            <p className="text-gray-500">Updated: {resource.lastUpdated}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Messaging Tab */}
            <TabsContent value="messaging" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      Team Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input placeholder="Search messages..." className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {messages.map((message) => (
                        <div key={message.id} className={`p-4 border rounded-lg ${message.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{message.from}</h4>
                              <Badge variant="outline" className="text-xs capitalize">
                                {message.type.replace('_', ' ')}
                              </Badge>
                              {message.priority === 'high' && (
                                <Badge variant="destructive" className="text-xs">
                                  High Priority
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{message.organization}</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">{message.message}</p>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Send className="w-3 h-3 mr-1" />
                              Reply
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Thread
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Textarea placeholder="Type your message..." className="flex-1" />
                      <Button>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      Team Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Upcoming Events</h4>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-sm">Team Standup</h5>
                            <Badge variant="outline">Today</Badge>
                          </div>
                          <p className="text-xs text-gray-600">2:00 PM - Weekly progress review</p>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-sm">Client Review</h5>
                            <Badge variant="secondary">Tomorrow</Badge>
                          </div>
                          <p className="text-xs text-gray-600">Risk model demo with Quantum Capital</p>
                        </div>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full">
                      <Plus className="w-3 h-3 mr-1" />
                      Schedule Meeting
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compliance Status</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Regulatory Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">SEC Compliance</h4>
                          <Badge variant="default" className="bg-green-600">Compliant</Badge>
                        </div>
                        <p className="text-xs text-gray-600">All investment advisor regulations met</p>
                        <p className="text-xs text-gray-500 mt-1">Next review: December 2025</p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">GDPR Compliance</h4>
                          <Badge variant="default" className="bg-green-600">Compliant</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Data protection requirements satisfied</p>
                        <p className="text-xs text-gray-500 mt-1">Last audit: June 2025</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                        Documentation Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Model Documentation</span>
                          <Badge variant="default">Complete</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Risk Assessment</span>
                          <Badge variant="default">Complete</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">API Documentation</span>
                          <Badge variant="secondary">In Review</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Security Audit</span>
                          <Badge variant="outline">Scheduled</Badge>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="w-full">
                        <FileDown className="w-3 h-3 mr-1" />
                        Download Compliance Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <CheckSquare className="w-3 h-3 mr-1" />
                      Mark All Read
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      Settings
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {notification.type === 'invitation' && <UserPlus className="w-4 h-4 text-blue-600" />}
                            {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                            {notification.type === 'payment' && <DollarSign className="w-4 h-4 text-green-600" />}
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                          </div>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </Layout>
  );
}