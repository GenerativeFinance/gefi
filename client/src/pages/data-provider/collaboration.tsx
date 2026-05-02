import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
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
  BookOpen,
  HelpCircle,
  LineChart,
  Upload,
  Filter
} from "lucide-react";

export default function DataProviderCollaboration() {
  const activeCollaborations = [
    {
      id: 1,
      name: "Real-time Market Data Feed",
      partner: "QuantumAI Systems",
      type: "developer",
      status: "Active",
      revenue: "$12,500/month",
      dataUsage: "2.3M calls/day",
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      name: "ESG Investment Analytics",
      partner: "GreenTech Ventures",
      type: "investor",
      status: "Active", 
      revenue: "$8,000/month",
      dataUsage: "850K calls/day",
      lastActivity: "1 day ago"
    },
    {
      id: 3,
      name: "Regulatory Compliance Dataset",
      partner: "Financial Conduct Authority",
      type: "regulator",
      status: "Under Review",
      revenue: "N/A",
      dataUsage: "150K calls/day",
      lastActivity: "3 days ago"
    }
  ];

  const investmentOpportunities = [
    {
      id: 1,
      dataset: "Alternative Credit Scoring Data",
      description: "Non-traditional credit assessment data including social, behavioral, and transactional indicators",
      fundingGoal: "$150,000",
      currentFunding: "$89,000",
      investors: 12,
      expectedROI: "18-25%",
      timeline: "6 months",
      riskLevel: "Medium"
    },
    {
      id: 2,
      dataset: "Real-time Commodity Pricing",
      description: "Live pricing data for agricultural, energy, and metal commodities with millisecond latency",
      fundingGoal: "$200,000", 
      currentFunding: "$145,000",
      investors: 8,
      expectedROI: "22-30%",
      timeline: "4 months",
      riskLevel: "High"
    }
  ];

  const developerRequests = [
    {
      id: 1,
      developer: "Alex Thompson",
      company: "FinTech Innovations",
      dataset: "Financial News Sentiment",
      requestType: "API Access",
      status: "Pending Review",
      submittedDate: "2025-07-20",
      priority: "High"
    },
    {
      id: 2,
      developer: "Maria Garcia", 
      company: "AI Trading Solutions",
      dataset: "Options Market Data",
      requestType: "Extended Access",
      status: "Approved",
      submittedDate: "2025-07-18",
      priority: "Medium"
    }
  ];

  const complianceReports = [
    {
      id: 1,
      authority: "SEC",
      reportType: "Data Governance Audit",
      status: "Submitted",
      submissionDate: "2025-07-15",
      reviewDeadline: "2025-08-15",
      complianceScore: "98.5%"
    },
    {
      id: 2,
      authority: "GDPR Commission",
      reportType: "Privacy Impact Assessment", 
      status: "In Progress",
      submissionDate: "2025-07-22",
      reviewDeadline: "2025-08-22",
      complianceScore: "96.2%"
    }
  ];

  const collaborationMessages = [
    {
      id: 1,
      from: "Sarah Chen",
      organization: "GreenTech Ventures",
      type: "investor",
      message: "The ESG dataset performance has exceeded expectations. Let's discuss expanding the partnership.",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      from: "David Kim",
      organization: "QuantumAI Systems", 
      type: "developer",
      message: "Need clarification on the new API rate limits and pricing structure.",
      time: "5 hours ago",
      unread: false
    },
    {
      id: 3,
      from: "Regulatory Affairs",
      organization: "FCA",
      type: "regulator",
      message: "Please provide additional documentation for the compliance review by July 30th.",
      time: "1 day ago",
      unread: true
    }
  ];

  const performanceMetrics = {
    totalRevenue: "$45,500",
    monthlyGrowth: "+23.5%",
    activeDatasets: 12,
    totalApiCalls: "4.2M",
    averageUptime: "99.8%",
    clientSatisfaction: "4.7/5"
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Data Provider Collaboration
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage partnerships with investors, developers, and regulators
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {activeCollaborations.length} Active Partnerships
                </Badge>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Partnership
                </Button>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">{performanceMetrics.totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">{performanceMetrics.monthlyGrowth} from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Datasets</p>
                    <p className="text-2xl font-bold text-blue-600">{performanceMetrics.activeDatasets}</p>
                  </div>
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">+2 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">API Calls</p>
                    <p className="text-2xl font-bold text-purple-600">{performanceMetrics.totalApiCalls}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Daily average</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
                    <p className="text-2xl font-bold text-green-600">{performanceMetrics.averageUptime}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction</p>
                    <p className="text-2xl font-bold text-yellow-600">{performanceMetrics.clientSatisfaction}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Client rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Partners</p>
                    <p className="text-2xl font-bold text-blue-600">{activeCollaborations.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Active collaborations</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="investors">Investors</TabsTrigger>
              <TabsTrigger value="developers">Developers</TabsTrigger>
              <TabsTrigger value="regulators">Regulators</TabsTrigger>
              <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
              <TabsTrigger value="messaging">Messaging</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Handshake className="w-5 h-5 text-blue-600" />
                      Active Collaborations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeCollaborations.map((collaboration) => (
                      <div key={collaboration.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{collaboration.name}</h4>
                          <Badge variant={collaboration.status === 'Active' ? 'default' : 'secondary'}>
                            {collaboration.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Partner</p>
                            <p className="font-semibold">{collaboration.partner}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Type</p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {collaboration.type}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-gray-500">Revenue</p>
                            <p className="font-semibold text-green-600">{collaboration.revenue}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Usage</p>
                            <p className="font-semibold">{collaboration.dataUsage}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <BarChart className="w-3 h-3 mr-1" />
                            Analytics
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-yellow-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-sm">New API Access Request</h5>
                          <Badge variant="outline">2h ago</Badge>
                        </div>
                        <p className="text-xs text-gray-600"><Link href="/profile/developer/alex-thompson" className="hover:text-blue-600 cursor-pointer">Alex Thompson</Link> requested access to Financial News Sentiment dataset</p>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-sm">Investment Proposal</h5>
                          <Badge variant="secondary">1d ago</Badge>
                        </div>
                        <p className="text-xs text-gray-600">GreenTech Ventures submitted funding proposal for ESG expansion</p>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-sm">Compliance Review</h5>
                          <Badge variant="outline">3d ago</Badge>
                        </div>
                        <p className="text-xs text-gray-600">FCA requested additional documentation for regulatory compliance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Investors Tab */}
            <TabsContent value="investors" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Investment Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {investmentOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{opportunity.dataset}</h4>
                          <Badge variant="default">Open</Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600">{opportunity.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Funding Goal</p>
                            <p className="font-semibold text-green-600">{opportunity.fundingGoal}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Current Funding</p>
                            <p className="font-semibold">{opportunity.currentFunding}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Expected ROI</p>
                            <p className="font-semibold text-blue-600">{opportunity.expectedROI}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Timeline</p>
                            <p className="font-semibold">{opportunity.timeline}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Funding Progress</span>
                            <span>{Math.round((parseInt(opportunity.currentFunding.replace(/[$,]/g, '')) / parseInt(opportunity.fundingGoal.replace(/[$,]/g, ''))) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${Math.round((parseInt(opportunity.currentFunding.replace(/[$,]/g, '')) / parseInt(opportunity.fundingGoal.replace(/[$,]/g, ''))) * 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="default" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Share className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-blue-600" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">Revenue Growth</h4>
                        </div>
                        <p className="text-2xl font-bold text-green-600">+23.5%</p>
                        <p className="text-xs text-gray-600">Month over month</p>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-sm">Active Investors</h4>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">24</p>
                        <p className="text-xs text-gray-600">Portfolio partners</p>
                      </div>

                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-sm">ROI Average</h4>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">18.2%</p>
                        <p className="text-xs text-gray-600">Across all datasets</p>
                      </div>

                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-semibold text-sm">Satisfaction</h4>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600">4.8/5</p>
                        <p className="text-xs text-gray-600">Investor rating</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Revenue Alerts</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Monthly target achieved</span>
                          <Badge variant="default">Success</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>ESG dataset outperforming</span>
                          <Badge variant="default">+15% above target</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>New investor interest</span>
                          <Badge variant="secondary">3 inquiries</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Developers Tab */}
            <TabsContent value="developers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-600" />
                      Documentation Hub
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <h4 className="font-semibold text-sm">API Documentation</h4>
                        </div>
                        <p className="text-xs text-gray-600">Complete reference for all dataset APIs with examples and rate limits</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View Docs
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-green-600" />
                          <h4 className="font-semibold text-sm">Data Schemas</h4>
                        </div>
                        <p className="text-xs text-gray-600">JSON schemas and field definitions for all available datasets</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Code className="w-3 h-3 mr-1" />
                            View Schema
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-purple-600" />
                          <h4 className="font-semibold text-sm">Sample Queries</h4>
                        </div>
                        <p className="text-xs text-gray-600">Ready-to-use code examples in Python, JavaScript, and R</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Play className="w-3 h-3 mr-1" />
                            Try Examples
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-orange-600" />
                      Developer Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input placeholder="Search requests..." className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {developerRequests.map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{request.developer}</h4>
                          <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Pending Review' ? 'secondary' : 'destructive'}>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Company</span>
                            <span className="font-semibold">{request.company}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dataset</span>
                            <span className="font-semibold">{request.dataset}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Request Type</span>
                            <span className="font-semibold">{request.requestType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Priority</span>
                            <Badge variant={request.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                              {request.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {request.status === 'Pending Review' && (
                            <>
                              <Button size="sm" variant="default" className="flex-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Review
                              </Button>
                            </>
                          )}
                          {request.status === 'Approved' && (
                            <Button size="sm" variant="outline" className="w-full">
                              <Eye className="w-3 h-3 mr-1" />
                              View Access
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Technical Forum Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    Technical Forum
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Input placeholder="Search discussions..." className="flex-1" />
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Topic
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">API Rate Limiting Best Practices</h4>
                        <Badge variant="outline">12 replies</Badge>
                      </div>
                      <p className="text-xs text-gray-600">Discussion about optimal API usage patterns and rate limit handling</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Started by: <Link href="/profile/developer/alex-thompson" className="hover:text-blue-600 cursor-pointer">Alex Thompson</Link></span>
                        <span className="text-gray-500">Last activity: 2 hours ago</span>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Financial News Sentiment Data Format</h4>
                        <Badge variant="outline">8 replies</Badge>
                      </div>
                      <p className="text-xs text-gray-600">Questions about sentiment score calculation and data structure</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Started by: <Link href="/profile/developer/maria-garcia" className="hover:text-blue-600 cursor-pointer">Maria Garcia</Link></span>
                        <span className="text-gray-500">Last activity: 1 day ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Regulators Tab */}
            <TabsContent value="regulators" className="space-y-6">
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
                          <h4 className="font-semibold text-sm">GDPR</h4>
                        </div>
                        <p className="text-xs text-gray-600">Compliant - Last audit: June 2025</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">SOC 2</h4>
                        </div>
                        <p className="text-xs text-gray-600">Type II - Valid until Dec 2025</p>
                      </div>

                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-semibold text-sm">SEC Filing</h4>
                        </div>
                        <p className="text-xs text-gray-600">In progress - Due: Aug 15, 2025</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">ISO 27001</h4>
                        </div>
                        <p className="text-xs text-gray-600">Certified - Valid until Mar 2026</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Data Lineage Tracking</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Data Sources Tracked</span>
                          <Badge variant="default">15/15</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Processing Steps Logged</span>
                          <Badge variant="default">100%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Access Controls Applied</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      Regulatory Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {complianceReports.map((report) => (
                      <div key={report.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{report.reportType}</h4>
                          <Badge variant={report.status === 'Submitted' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Authority</span>
                            <span className="font-semibold">{report.authority}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Submission Date</span>
                            <span className="font-semibold">{report.submissionDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Review Deadline</span>
                            <span className="font-semibold">{report.reviewDeadline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Compliance Score</span>
                            <span className="font-semibold text-green-600">{report.complianceScore}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="ghost" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            Track Status
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Generate New Report
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Query Response System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    Query Response System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Input placeholder="Search regulatory queries..." className="flex-1" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Data Governance Inquiry #RQ-2025-001</h4>
                        <Badge variant="default">Responded</Badge>
                      </div>
                      <p className="text-xs text-gray-600">Request for additional documentation on data retention policies and access controls</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">From: SEC</span>
                          <span className="text-gray-500">Received: July 10, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Response Due: July 25, 2025</span>
                          <span className="text-gray-500">Responded: July 22, 2025</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-3 h-3 mr-1" />
                        View Response
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Privacy Impact Assessment #RQ-2025-002</h4>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <p className="text-xs text-gray-600">Request for detailed privacy impact assessment for new dataset collection</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">From: GDPR Commission</span>
                          <span className="text-gray-500">Received: July 18, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Response Due: August 2, 2025</span>
                          <span className="text-gray-500 font-semibold">11 days remaining</span>
                        </div>
                      </div>
                      <Button size="sm" variant="default" className="w-full">
                        <Send className="w-3 h-3 mr-1" />
                        Prepare Response
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Collaborations Management Tab */}
            <TabsContent value="collaborations" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Handshake className="w-5 h-5 text-blue-600" />
                      Collaboration Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input placeholder="Search collaborations..." className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="regulator">Regulator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeCollaborations.map((collaboration) => (
                        <div key={collaboration.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{collaboration.name}</h4>
                            <Badge variant={collaboration.status === 'Active' ? 'default' : 'secondary'}>
                              {collaboration.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Partner</span>
                              <span className="font-semibold">{collaboration.partner}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Type</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {collaboration.type}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Revenue</span>
                              <span className="font-semibold text-green-600">{collaboration.revenue}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Data Usage</span>
                              <span className="font-semibold">{collaboration.dataUsage}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Last Activity</span>
                              <span className="font-semibold">{collaboration.lastActivity}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Settings className="w-3 h-3 mr-1" />
                              Manage
                            </Button>
                            <Button size="sm" variant="ghost" className="flex-1">
                              <BarChart className="w-3 h-3 mr-1" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Messaging Tab */}
            <TabsContent value="messaging" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      Secure Messaging
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input placeholder="Search messages..." className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Messages</SelectItem>
                          <SelectItem value="investor">Investors</SelectItem>
                          <SelectItem value="developer">Developers</SelectItem>
                          <SelectItem value="regulator">Regulators</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {collaborationMessages.map((message) => (
                        <div key={message.id} className={`p-4 border rounded-lg ${message.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{message.from}</h4>
                              <Badge variant="outline" className="text-xs capitalize">
                                {message.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                          <p className="text-xs text-gray-500 mb-3">From: {message.organization}</p>

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
                      <Users className="w-5 h-5 text-purple-600" />
                      Active Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            SC
                          </div>
                          <div className="flex-1">
                            <Link href="/profile/investor/sarah-chen" className="font-semibold text-sm hover:text-blue-600 cursor-pointer">
                              Sarah Chen
                            </Link>
                            <p className="text-xs text-gray-500">GreenTech Ventures</p>
                          </div>
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <Button size="sm" variant="ghost" className="w-full">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                      </div>

                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            DK
                          </div>
                          <div className="flex-1">
                            <Link href="/profile/developer/david-kim" className="font-semibold text-sm hover:text-blue-600 cursor-pointer">
                              David Kim
                            </Link>
                            <p className="text-xs text-gray-500">QuantumAI Systems</p>
                          </div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <Button size="sm" variant="ghost" className="w-full">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                      </div>

                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            RA
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">Regulatory Affairs</h4>
                            <p className="text-xs text-gray-500">FCA</p>
                          </div>
                          <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        </div>
                        <Button size="sm" variant="ghost" className="w-full">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Conversation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-red-600" />
                      Data Security & Access Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">Encryption</h4>
                        </div>
                        <p className="text-xs text-gray-600">AES-256 at rest, TLS 1.3 in transit</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">Access Control</h4>
                        </div>
                        <p className="text-xs text-gray-600">Role-based permissions active</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">Audit Trails</h4>
                        </div>
                        <p className="text-xs text-gray-600">Complete activity logging</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">Monitoring</h4>
                        </div>
                        <p className="text-xs text-gray-600">24/7 security monitoring</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Role-Based Access Permissions</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Investor Access</span>
                          <Badge variant="default">Financial Data Only</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Developer Access</span>
                          <Badge variant="default">API & Documentation</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Regulator Access</span>
                          <Badge variant="default">Audit & Compliance</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Data Provider Admin</span>
                          <Badge variant="default">Full Access</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      Compliance Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-sm">SOC 2 Type II</h4>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Security, availability, and confidentiality controls</p>
                        <p className="text-xs text-gray-500 mt-1">Valid until: December 2025</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-sm">ISO 27001</h4>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Information security management system</p>
                        <p className="text-xs text-gray-500 mt-1">Valid until: March 2026</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-sm">GDPR Compliance</h4>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Data protection and privacy compliance</p>
                        <p className="text-xs text-gray-500 mt-1">Last audit: June 2025</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Security Protocols</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Multi-Factor Authentication</span>
                          <Badge variant="default">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>API Key Rotation</span>
                          <Badge variant="default">90 Days</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Data Retention Policy</span>
                          <Badge variant="default">7 Years</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Incident Response</span>
                          <Badge variant="default">&lt; 4 Hours</Badge>
                        </div>
                      </div>
                    </div>
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