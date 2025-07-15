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
  Share
} from "lucide-react";

export default function DeveloperCollaboration() {
  const collaborations = [
    {
      id: 1,
      name: "AI Risk Assessment Model",
      partner: "Quantum Capital Partners",
      type: "investor",
      status: "Active",
      progress: 75,
      members: 4,
      revenue: "$15,000",
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      name: "ESG Investment Optimizer",
      partner: "Bloomberg Terminal",
      type: "data_provider", 
      status: "Active",
      progress: 60,
      members: 3,
      revenue: "$8,500",
      lastActivity: "1 day ago"
    },
    {
      id: 3,
      name: "Credit Scoring Framework",
      partner: "Federal Reserve",
      type: "regulator",
      status: "Review",
      progress: 90,
      members: 2,
      revenue: "$22,500",
      lastActivity: "3 days ago"
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
      status: "pending"
    },
    {
      id: 2,
      from: "Reuters Data Services", 
      project: "Real-time Sentiment Analyzer",
      type: "data_provider",
      funding: "$25,000",
      deadline: "2025-07-30",
      status: "pending"
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
      unread: true
    },
    {
      id: 2,
      from: "Michael Rodriguez",
      organization: "Bloomberg Terminal",
      message: "Updated API documentation available. New rate limits effective next week.",
      time: "5 hours ago", 
      type: "data_provider",
      unread: false
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "ML Engineer",
      expertise: "Deep Learning",
      rating: 4.9,
      projects: 12,
      avatar: "/avatars/alex.jpg"
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Data Scientist", 
      expertise: "Financial Modeling",
      rating: 4.8,
      projects: 8,
      avatar: "/avatars/maria.jpg"
    }
  ];

  const investors = [
    {
      id: 1,
      name: "Quantum Capital Partners",
      investment: "$50,000",
      equity: "12%",
      status: "Active",
      contact: "Sarah Chen",
      joinDate: "March 2025"
    },
    {
      id: 2,
      name: "TechVenture Capital",
      investment: "$75,000", 
      equity: "18%",
      status: "Active",
      contact: "David Kim",
      joinDate: "January 2025"
    }
  ];

  const dataProviders = [
    {
      id: 1,
      name: "Bloomberg Terminal",
      dataTypes: ["Market Data", "News", "Analytics"],
      apiCalls: "2.3M/month",
      reliability: "99.9%",
      status: "Active",
      contact: "Michael Rodriguez"
    },
    {
      id: 2,
      name: "Reuters Data Services",
      dataTypes: ["Economic Data", "Corporate Data"],
      apiCalls: "1.8M/month", 
      reliability: "99.7%",
      status: "Integration",
      contact: "Jennifer Liu"
    }
  ];

  const regulatoryItems = [
    {
      id: 1,
      authority: "SEC",
      requirement: "Model Documentation",
      status: "Compliant",
      lastAudit: "June 2025",
      nextReview: "December 2025",
      contact: "Regional Office"
    },
    {
      id: 2,
      authority: "FCA", 
      requirement: "Risk Assessment Framework",
      status: "Pending Review",
      lastAudit: "May 2025",
      nextReview: "August 2025",
      contact: "Compliance Team"
    }
  ];

  const accessPermissions = [
    {
      id: 1,
      resource: "Production Database",
      type: "database",
      access: "Read/Write",
      users: ["Alex Thompson", "Maria Garcia"],
      lastAccessed: "2 hours ago"
    },
    {
      id: 2,
      resource: "API Gateway",
      type: "api",
      access: "Admin",
      users: ["Alex Thompson"],
      lastAccessed: "1 day ago"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "investor",
      title: "Model Performance Alert",
      message: "95% accuracy target needed for Quantum Capital funding release",
      stakeholder: "Quantum Capital Partners",
      priority: "High",
      dueDate: "2025-07-25",
      read: false
    },
    {
      id: 2,
      type: "regulatory",
      title: "SEC Model Documentation Request",
      message: "Additional backtesting documentation required for ESG Investment Optimizer",
      stakeholder: "SEC Regulatory Team",
      priority: "Medium",
      dueDate: "2025-07-30",
      read: false
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
                    <p className="text-2xl font-bold text-purple-600">8</p>
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

            {/* Active Collaborations Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Investor Relations Panel */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      Investor Relations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {investors.map((investor) => (
                      <div key={investor.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{investor.name}</h4>
                          <Badge variant={investor.status === 'Active' ? 'default' : 'secondary'}>
                            {investor.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Investment</p>
                            <p className="font-semibold text-green-600">{investor.investment}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Equity</p>
                            <p className="font-semibold">{investor.equity}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Contact: {investor.contact}</span>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Data Providers Panel */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-green-600" />
                      Data Providers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dataProviders.map((provider) => (
                      <div key={provider.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{provider.name}</h4>
                          <Badge variant={provider.status === 'Active' ? 'default' : 'secondary'}>
                            {provider.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">API Calls</span>
                            <span className="font-semibold">{provider.apiCalls}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Reliability</span>
                            <span className="font-semibold text-green-600">{provider.reliability}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Contact: {provider.contact}</span>
                          <Button size="sm" variant="outline">
                            <Settings className="w-3 h-3 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Regulatory Compliance Panel */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      Regulatory Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {regulatoryItems.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{item.authority}</h4>
                          <Badge variant={item.status === 'Compliant' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Requirement</span>
                            <span className="font-semibold">{item.requirement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Next Review</span>
                            <span className="font-semibold">{item.nextReview}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Contact: {item.contact}</span>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Current Projects Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-purple-600" />
                    Current Projects Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {collaborations.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{project.name}</h4>
                          <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-semibold">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Revenue: {project.revenue}</span>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs would continue here but truncated for length */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Project management interface would be here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invitations">
              <Card>
                <CardHeader>
                  <CardTitle>Collaboration Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Invitation management interface would be here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Shared Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Resource sharing interface would be here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messaging">
              <Card>
                <CardHeader>
                  <CardTitle>Team Messaging</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Messaging interface would be here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance">
              <Card>
                <CardHeader>
                  <CardTitle>Legal & Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Compliance management interface would be here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Notification center would be here...</p>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </Layout>
  );
}