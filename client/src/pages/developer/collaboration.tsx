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

            {/* Stakeholder Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Investor Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      Investor Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">AI Risk Assessment Model</h4>
                        <Badge variant="default">Funded</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">ROI Performance</span>
                          <span className="font-semibold text-green-600">+23.5%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Risk Score</span>
                          <span className="font-semibold">2.1/10</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Next Report</span>
                          <span className="font-semibold">July 30</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart className="w-3 h-3 mr-1" />
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Secure Document Vault</h4>
                        <Badge variant="secondary">4 Files</Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Funding Agreement.pdf</span>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Q2 Performance Report.pdf</span>
                          <Button size="sm" variant="ghost">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Risk Assessment.xlsx</span>
                          <Button size="sm" variant="ghost">
                            <Share className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Provider Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-green-600" />
                      Data Provider Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Bloomberg Data Integration</h4>
                        <Badge variant="default">Active</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Daily API Calls</span>
                          <span className="font-semibold">156,842</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Models Using Data</span>
                          <span className="font-semibold">7</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Data Quality</span>
                          <span className="font-semibold text-green-600">99.8%</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Monitor className="w-3 h-3 mr-1" />
                          Usage Stats
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Agreement Management</h4>
                        <Badge variant="default">3 Active</Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Bloomberg License</span>
                          <Badge variant="default">Valid</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Reuters Agreement</span>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Alpha Vantage API</span>
                          <Badge variant="default">Valid</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Regulatory Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      Regulatory Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">SEC Compliance Review</h4>
                        <Badge variant="default">In Progress</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Submission Date</span>
                          <span className="font-semibold">July 25, 2025</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Review Status</span>
                          <span className="font-semibold text-yellow-600">Pending</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Compliance Score</span>
                          <span className="font-semibold text-green-600">98.2%</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="w-3 h-3 mr-1" />
                          Submit Report
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Activity className="w-3 h-3 mr-1" />
                          Audit Log
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Query Response System</h4>
                        <Badge variant="secondary">2 Open</Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Model Documentation #001</span>
                          <Badge variant="default">Responded</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Risk Framework #002</span>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Invitations & Opportunities Tab */}
            <TabsContent value="invitations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Handshake className="w-5 h-5 text-blue-600" />
                      Pending Invitations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {invitations.map((invitation) => (
                      <div key={invitation.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{invitation.project}</h4>
                          <Badge variant="secondary">{invitation.type}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">From</span>
                            <span className="font-semibold">{invitation.from}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Funding</span>
                            <span className="font-semibold text-green-600">{invitation.funding}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Deadline</span>
                            <span className="font-semibold">{invitation.deadline}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="default" className="flex-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Collaboration Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">ESG Portfolio Optimizer</h4>
                        <Badge variant="default">Recommended</Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Match Score</span>
                          <span className="font-semibold text-green-600">95%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Potential Funding</span>
                          <span className="font-semibold">$75,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Partners</span>
                          <span className="font-semibold">GreenTech Ventures</span>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="w-full">
                        <Plus className="w-3 h-3 mr-1" />
                        Express Interest
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Real-time Fraud Detection</h4>
                        <Badge variant="secondary">New</Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Match Score</span>
                          <span className="font-semibold text-yellow-600">88%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Potential Funding</span>
                          <span className="font-semibold">$45,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Partners</span>
                          <span className="font-semibold">FinSec Solutions</span>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-3 h-3 mr-1" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Resources & Documents Tab */}
            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Document Repository
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input placeholder="Search documents..." className="flex-1" />
                      <Button size="sm" variant="outline">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>

                    {accessPermissions.map((permission) => (
                      <div key={permission.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{permission.resource}</h4>
                          <Badge variant={permission.access === 'Admin' ? 'default' : 'secondary'}>
                            {permission.access}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type</span>
                            <span className="font-semibold capitalize">{permission.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Users</span>
                            <span className="font-semibold">{permission.users.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Last Access</span>
                            <span className="font-semibold">{permission.lastAccessed}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Key className="w-3 h-3 mr-1" />
                            Permissions
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Activity className="w-3 h-3 mr-1" />
                            Activity
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Shared Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Upcoming Events</h4>
                        <Button size="sm" variant="outline">
                          <Plus className="w-3 h-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-sm">Investor Progress Review</h5>
                            <Badge variant="outline">Today</Badge>
                          </div>
                          <p className="text-xs text-gray-600">3:00 PM - Sarah Chen, Quantum Capital</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              <Video className="w-3 h-3 mr-1" />
                              Join
                            </Button>
                            <Button size="sm" variant="ghost">
                              <FileText className="w-3 h-3 mr-1" />
                              Agenda
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-sm">SEC Compliance Submission</h5>
                            <Badge variant="secondary">Jul 25</Badge>
                          </div>
                          <p className="text-xs text-gray-600">Deadline for model documentation</p>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-sm">Data Provider Sync</h5>
                            <Badge variant="outline">Jul 28</Badge>
                          </div>
                          <p className="text-xs text-gray-600">2:00 PM - Bloomberg API updates</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Messaging Hub Tab */}
            <TabsContent value="messaging" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      Centralized Messaging
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input placeholder="Search conversations..." className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="investors">Investors</SelectItem>
                          <SelectItem value="providers">Data Providers</SelectItem>
                          <SelectItem value="regulators">Regulators</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {messages.map((message) => (
                        <div key={message.id} className={`p-4 border rounded-lg ${message.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{message.from}</h4>
                              <Badge variant="outline" className="text-xs">
                                {message.organization}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{message.message}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Send className="w-3 h-3 mr-1" />
                              Reply
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Thread
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
                      <Users className="w-5 h-5 text-purple-600" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{member.name}</h4>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Rating: {member.rating}/5</span>
                          <Button size="sm" variant="ghost">
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button className="w-full" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Compliance & Security Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      Compliance Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">SOC 2</h4>
                        </div>
                        <p className="text-xs text-gray-600">Certified until Dec 2025</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">GDPR</h4>
                        </div>
                        <p className="text-xs text-gray-600">Compliant</p>
                      </div>

                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-semibold text-sm">ISO 27001</h4>
                        </div>
                        <p className="text-xs text-gray-600">Renewal pending</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">SEC</h4>
                        </div>
                        <p className="text-xs text-gray-600">Filed Q2 2025</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Security Features</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>End-to-End Encryption</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Audit Trail Logging</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Role-Based Access</span>
                          <Badge variant="default">Configured</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Data Anonymization</span>
                          <Badge variant="default">Enabled</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      Regulatory Submissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Model Documentation</h4>
                        <Badge variant="default">Submitted</Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Authority</span>
                          <span className="font-semibold">SEC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Submission Date</span>
                          <span className="font-semibold">July 20, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span className="font-semibold text-green-600">Approved</span>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-3 h-3 mr-1" />
                        Download Certificate
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Risk Assessment Framework</h4>
                        <Badge variant="secondary">In Review</Badge>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Authority</span>
                          <span className="font-semibold">FCA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Submission Date</span>
                          <span className="font-semibold">July 15, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Expected Response</span>
                          <span className="font-semibold">August 1, 2025</span>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-3 h-3 mr-1" />
                        Track Status
                      </Button>
                    </div>

                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      New Submission
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Center Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-yellow-600" />
                      Notification Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="regulatory">Regulatory</SelectItem>
                          <SelectItem value="data_provider">Data Provider</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" className="ml-auto">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark All Read
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              <Badge variant={notification.priority === 'High' ? 'destructive' : notification.priority === 'Medium' ? 'default' : 'secondary'}>
                                {notification.priority}
                              </Badge>
                            </div>
                            {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">From: {notification.stakeholder}</span>
                            <span className="font-semibold">Due: {notification.dueDate}</span>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mark Read
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gray-600" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Notifications</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push Notifications</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS Alerts</span>
                        <Badge variant="secondary">Disabled</Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-sm mb-3">Alert Thresholds</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Performance Drop</span>
                          <span className="font-semibold">5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Compliance Issues</span>
                          <span className="font-semibold">Immediate</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Quality</span>
                          <span className="font-semibold">95%</span>
                        </div>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure Alerts
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </Layout>
  );
}