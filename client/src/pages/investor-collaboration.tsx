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
  BookOpen,
  HelpCircle,
  LineChart,
  Upload,
  Filter,
  GitBranch,
  Terminal,
  FolderOpen,
  Folder,
  CheckSquare,
  Milestone,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Link,
  PlusCircle,
  Edit
} from "lucide-react";

export default function InvestorCollaboration() {
  const developers = [
    {
      id: 1,
      name: "Alex Thompson",
      company: "QuantumAI Systems",
      expertise: ["Machine Learning", "Risk Assessment", "Quantitative Finance"],
      rating: 4.8,
      projects: 12,
      completionRate: "96%",
      hourlyRate: "$150/hr",
      location: "New York, NY",
      status: "Available",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Maria Garcia",
      company: "AI Trading Solutions", 
      expertise: ["Deep Learning", "Algorithmic Trading", "Portfolio Optimization"],
      rating: 4.9,
      projects: 8,
      completionRate: "100%",
      hourlyRate: "$175/hr",
      location: "San Francisco, CA",
      status: "In Project",
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "David Kim",
      company: "FinTech Innovations",
      expertise: ["NLP", "Sentiment Analysis", "Market Prediction"],
      rating: 4.7,
      projects: 15,
      completionRate: "94%",
      hourlyRate: "$140/hr",
      location: "London, UK",
      status: "Available",
      lastActive: "30 minutes ago"
    }
  ];

  const activeProjects = [
    {
      id: 1,
      name: "ESG Portfolio Optimizer",
      developer: "Alex Thompson",
      progress: 75,
      deadline: "Aug 15, 2025",
      budget: "$25,000",
      spent: "$18,750",
      status: "On Track",
      lastUpdate: "Updated risk assessment algorithms",
      nextMilestone: "Beta testing phase"
    },
    {
      id: 2,
      name: "Real-time Fraud Detection",
      developer: "Maria Garcia",
      progress: 40,
      deadline: "Sep 30, 2025", 
      budget: "$35,000",
      spent: "$14,000",
      status: "On Track",
      lastUpdate: "Completed data preprocessing module",
      nextMilestone: "Model training phase"
    }
  ];

  const dataProviders = [
    {
      id: 1,
      name: "Bloomberg Terminal Data",
      provider: "Bloomberg LP",
      dataTypes: ["Market Data", "News", "Analytics"],
      coverage: "Global",
      updateFrequency: "Real-time",
      compliance: ["SOC 2", "ISO 27001"],
      pricing: "$2,000/month",
      apiCalls: "Unlimited",
      status: "Active"
    },
    {
      id: 2,
      name: "Alternative Credit Data",
      provider: "Experian DataLabs",
      dataTypes: ["Credit Scores", "Transaction Data", "Social Indicators"],
      coverage: "US, EU",
      updateFrequency: "Daily",
      compliance: ["GDPR", "CCPA"],
      pricing: "$1,500/month",
      apiCalls: "1M/month",
      status: "Active"
    },
    {
      id: 3,
      name: "ESG Sustainability Metrics",
      provider: "Sustainalytics",
      dataTypes: ["ESG Scores", "Carbon Footprint", "Governance Data"],
      coverage: "Global",
      updateFrequency: "Weekly",
      compliance: ["GRI Standards", "SASB"],
      pricing: "$3,500/month",
      apiCalls: "500K/month",
      status: "Trial"
    }
  ];

  const regulatoryContacts = [
    {
      id: 1,
      authority: "Securities and Exchange Commission",
      abbreviation: "SEC",
      contact: "Dr. Sarah Williams",
      department: "Investment Management Division",
      email: "swilliams@sec.gov",
      phone: "+1-202-551-6720",
      jurisdiction: "United States",
      status: "Active",
      lastContact: "July 10, 2025"
    },
    {
      id: 2,
      authority: "Financial Conduct Authority",
      abbreviation: "FCA",
      contact: "James Richardson",
      department: "Prudential Regulation",
      email: "james.richardson@fca.org.uk",
      phone: "+44-20-7066-1000",
      jurisdiction: "United Kingdom",
      status: "Active",
      lastContact: "July 5, 2025"
    }
  ];

  const complianceStatus = {
    overall: "98.5%",
    sec: "Compliant",
    gdpr: "Compliant", 
    sox: "Compliant",
    mifid: "Under Review",
    nextAudit: "September 15, 2025",
    certificationsExpiring: 2
  };

  const unifiedMessages = [
    {
      id: 1,
      from: "Alex Thompson",
      type: "developer",
      subject: "ESG Optimizer Progress Update",
      message: "Risk assessment module completed ahead of schedule. Ready for your review.",
      time: "2 hours ago",
      unread: true,
      priority: "high"
    },
    {
      id: 2,
      from: "Bloomberg Support",
      type: "data_provider",
      subject: "API Rate Limit Increase Approved",
      message: "Your request for increased API limits has been approved and will be active within 24 hours.",
      time: "4 hours ago",
      unread: false,
      priority: "medium"
    },
    {
      id: 3,
      from: "SEC Compliance Team",
      type: "regulator",
      subject: "Q3 Reporting Reminder",
      message: "Quarterly compliance report due August 31st. Please ensure all documentation is current.",
      time: "1 day ago",
      unread: true,
      priority: "high"
    }
  ];

  const collaborationMetrics = {
    activeDevelopers: 3,
    activeDataSources: 8,
    regulatoryContacts: 5,
    projectsInProgress: 2,
    totalInvestment: "$150,000",
    expectedROI: "22.5%"
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
                  Investor Collaboration Hub
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage partnerships with developers, data providers, and regulators
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Handshake className="w-4 h-4 mr-1" />
                  {collaborationMetrics.activeDevelopers + collaborationMetrics.activeDataSources + collaborationMetrics.regulatoryContacts} Active Partnerships
                </Badge>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Collaboration
                </Button>
              </div>
            </div>
          </div>

          {/* Collaboration Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Developers</p>
                    <p className="text-2xl font-bold text-blue-600">{collaborationMetrics.activeDevelopers}</p>
                  </div>
                  <Code className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">+1 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Sources</p>
                    <p className="text-2xl font-bold text-green-600">{collaborationMetrics.activeDataSources}</p>
                  </div>
                  <Database className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">+2 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Regulatory Contacts</p>
                    <p className="text-2xl font-bold text-red-600">{collaborationMetrics.regulatoryContacts}</p>
                  </div>
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">All active</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects</p>
                    <p className="text-2xl font-bold text-purple-600">{collaborationMetrics.projectsInProgress}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Investment</p>
                    <p className="text-2xl font-bold text-green-600">{collaborationMetrics.totalInvestment}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Total committed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expected ROI</p>
                    <p className="text-2xl font-bold text-yellow-600">{collaborationMetrics.expectedROI}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Projected annual</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="developers">Developers</TabsTrigger>
              <TabsTrigger value="data-providers">Data Providers</TabsTrigger>
              <TabsTrigger value="regulators">Regulators</TabsTrigger>
              <TabsTrigger value="messaging">Unified Inbox</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                      Active Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeProjects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{project.name}</h4>
                          <Badge variant={project.status === 'On Track' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Developer</p>
                            <p className="font-semibold">{project.developer}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Deadline</p>
                            <p className="font-semibold">{project.deadline}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Budget Used</p>
                            <p className="font-semibold text-green-600">{project.spent} / {project.budget}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Progress</p>
                            <p className="font-semibold">{project.progress}%</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
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

                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Latest Update:</p>
                          <p className="text-xs font-semibold">{project.lastUpdate}</p>
                          <p className="text-xs text-gray-500 mt-1">Next: {project.nextMilestone}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Contact Dev
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
                          <h5 className="font-semibold text-sm">Developer Update</h5>
                          <Badge variant="outline">2h ago</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Alex Thompson completed risk assessment module for ESG Optimizer</p>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-sm">Data Provider Alert</h5>
                          <Badge variant="secondary">4h ago</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Bloomberg API rate limit increased - additional capacity available</p>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-sm">Compliance Reminder</h5>
                          <Badge variant="outline">1d ago</Badge>
                        </div>
                        <p className="text-xs text-gray-600">SEC quarterly report due August 31st - documentation review scheduled</p>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-sm">New Data Source</h5>
                          <Badge variant="secondary">2d ago</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Sustainalytics ESG data trial approved - integration in progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Developers Tab */}
            <TabsContent value="developers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Developer Directory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input placeholder="Search developers..." className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Expertise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ml">Machine Learning</SelectItem>
                          <SelectItem value="risk">Risk Assessment</SelectItem>
                          <SelectItem value="trading">Algorithmic Trading</SelectItem>
                          <SelectItem value="nlp">Natural Language Processing</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="project">In Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {developers.map((developer) => (
                      <div key={developer.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {developer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{developer.name}</h4>
                              <p className="text-xs text-gray-500">{developer.company}</p>
                            </div>
                          </div>
                          <Badge variant={developer.status === 'Available' ? 'default' : 'secondary'}>
                            {developer.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {developer.expertise.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{developer.rating}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500">Projects</p>
                            <p className="font-semibold">{developer.projects}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Completion Rate</p>
                            <p className="font-semibold text-green-600">{developer.completionRate}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Rate</p>
                            <p className="font-semibold">{developer.hourlyRate}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{developer.location}</span>
                          <span className="ml-2">Last active: {developer.lastActive}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="default" className="flex-1">
                            <Plus className="w-3 h-3 mr-1" />
                            Hire
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-green-600" />
                      Code Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-blue-600" />
                          <h4 className="font-semibold text-sm">IDE Access</h4>
                        </div>
                        <p className="text-xs text-gray-600">Secure cloud-based development environment with real-time collaboration</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Terminal className="w-3 h-3 mr-1" />
                          Launch IDE
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-green-600" />
                          <h4 className="font-semibold text-sm">Version Control</h4>
                        </div>
                        <p className="text-xs text-gray-600">Git-based version control with branch management and merge tracking</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <GitBranch className="w-3 h-3 mr-1" />
                          View Repository
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-purple-600" />
                          <h4 className="font-semibold text-sm">Code Review</h4>
                        </div>
                        <p className="text-xs text-gray-600">Automated and manual code review with quality gates and security scanning</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <FileCheck className="w-3 h-3 mr-1" />
                          Review Code
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
                      <h4 className="font-semibold text-sm">Project Workspace</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Active Tasks</span>
                          <Badge variant="default">5</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Code Reviews</span>
                          <Badge variant="secondary">2 Pending</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Milestones</span>
                          <Badge variant="outline">3 Upcoming</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="default" className="w-full">
                        <Briefcase className="w-3 h-3 mr-1" />
                        Open Workspace
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Data Providers Tab */}
            <TabsContent value="data-providers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-green-600" />
                      Data Marketplace
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Input placeholder="Search datasets..." className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Data Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Data</SelectItem>
                          <SelectItem value="credit">Credit Data</SelectItem>
                          <SelectItem value="esg">ESG Data</SelectItem>
                          <SelectItem value="news">News & Sentiment</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="available">Available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {dataProviders.map((provider) => (
                      <div key={provider.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{provider.name}</h4>
                          <Badge variant={provider.status === 'Active' ? 'default' : provider.status === 'Trial' ? 'secondary' : 'outline'}>
                            {provider.status}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600">Provider: {provider.provider}</p>

                        <div className="flex flex-wrap gap-1">
                          {provider.dataTypes.map((type, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Coverage</p>
                            <p className="font-semibold">{provider.coverage}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Update Frequency</p>
                            <p className="font-semibold">{provider.updateFrequency}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Pricing</p>
                            <p className="font-semibold text-green-600">{provider.pricing}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">API Calls</p>
                            <p className="font-semibold">{provider.apiCalls}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {provider.compliance.map((cert, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          {provider.status === 'Active' ? (
                            <>
                              <Button size="sm" variant="outline" className="flex-1">
                                <BarChart className="w-3 h-3 mr-1" />
                                Usage Stats
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Settings className="w-3 h-3 mr-1" />
                                Manage
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="default" className="w-full">
                              <Plus className="w-3 h-3 mr-1" />
                              {provider.status === 'Trial' ? 'Upgrade to Full Access' : 'Start Trial'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-purple-600" />
                      Data Requests & Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Request Custom Dataset</h4>
                      <p className="text-xs text-gray-600">Submit requests for specialized datasets not available in the marketplace</p>
                      <div className="space-y-2">
                        <Input placeholder="Dataset description..." />
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Data category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="financial">Financial Markets</SelectItem>
                            <SelectItem value="alternative">Alternative Data</SelectItem>
                            <SelectItem value="esg">ESG & Sustainability</SelectItem>
                            <SelectItem value="regulatory">Regulatory Data</SelectItem>
                          </SelectContent>
                        </Select>
                        <Textarea placeholder="Specific requirements and use case..." />
                        <Button size="sm" className="w-full">
                          <Send className="w-3 h-3 mr-1" />
                          Submit Request
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Current Usage Overview</h4>
                      
                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Bloomberg Terminal</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Monthly Usage</span>
                            <span className="font-semibold">2.3M calls</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Data Quality Score</span>
                            <span className="font-semibold text-green-600">99.8%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Experian Credit Data</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Monthly Usage</span>
                            <span className="font-semibold">850K calls</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Data Quality Score</span>
                            <span className="font-semibold text-green-600">98.5%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Sustainalytics ESG</span>
                          <Badge variant="secondary">Trial</Badge>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Trial Usage</span>
                            <span className="font-semibold">125K calls</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Trial Ends</span>
                            <span className="font-semibold text-yellow-600">Aug 15, 2025</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Overall Compliance Status</h4>
                        <Badge variant="default" className="bg-green-600">
                          {complianceStatus.overall}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">All major regulatory requirements met with ongoing monitoring</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <h5 className="font-semibold text-sm">SEC</h5>
                        </div>
                        <p className="text-xs text-gray-600">{complianceStatus.sec}</p>
                        <p className="text-xs text-gray-500">Last filing: July 15, 2025</p>
                      </div>

                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <h5 className="font-semibold text-sm">GDPR</h5>
                        </div>
                        <p className="text-xs text-gray-600">{complianceStatus.gdpr}</p>
                        <p className="text-xs text-gray-500">Last audit: June 30, 2025</p>
                      </div>

                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <h5 className="font-semibold text-sm">SOX</h5>
                        </div>
                        <p className="text-xs text-gray-600">{complianceStatus.sox}</p>
                        <p className="text-xs text-gray-500">Controls tested: Q2 2025</p>
                      </div>

                      <div className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <h5 className="font-semibold text-sm">MiFID II</h5>
                        </div>
                        <p className="text-xs text-gray-600">{complianceStatus.mifid}</p>
                        <p className="text-xs text-gray-500">Review scheduled: Aug 1</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Upcoming Activities</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Next Audit</span>
                          <span className="font-semibold">{complianceStatus.nextAudit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Certifications Expiring</span>
                          <Badge variant="secondary">{complianceStatus.certificationsExpiring}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Quarterly Report Due</span>
                          <span className="font-semibold text-yellow-600">August 31, 2025</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Regulatory Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {regulatoryContacts.map((contact) => (
                      <div key={contact.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">{contact.abbreviation}</h4>
                            <p className="text-xs text-gray-600">{contact.authority}</p>
                          </div>
                          <Badge variant={contact.status === 'Active' ? 'default' : 'secondary'}>
                            {contact.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div>
                            <p className="text-gray-500">Contact Person</p>
                            <p className="font-semibold">{contact.contact}</p>
                            <p className="text-gray-600">{contact.department}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-gray-500">Email</p>
                              <p className="font-semibold">{contact.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Phone</p>
                              <p className="font-semibold">{contact.phone}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Contact</p>
                            <p className="font-semibold">{contact.lastContact}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <FileText className="w-3 h-3 mr-1" />
                            Submit Report
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline" className="w-full">
                          <FileText className="w-3 h-3 mr-1" />
                          Generate Compliance Report
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Upload className="w-3 h-3 mr-1" />
                          Submit Regulatory Filing
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <HelpCircle className="w-3 h-3 mr-1" />
                          Query Regulatory Guidance
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Unified Inbox Tab */}
            <TabsContent value="messaging" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-green-600" />
                      Unified Inbox
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
                          <SelectItem value="developer">Developers</SelectItem>
                          <SelectItem value="data_provider">Data Providers</SelectItem>
                          <SelectItem value="regulator">Regulators</SelectItem>
                        </SelectContent>
                      </Select>
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
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {unifiedMessages.map((message) => (
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
                          
                          <h5 className="font-semibold text-sm mb-2">{message.subject}</h5>
                          <p className="text-sm text-gray-600 mb-3">{message.message}</p>

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
                            <h5 className="font-semibold text-sm">Developer Review Meeting</h5>
                            <Badge variant="outline">Today</Badge>
                          </div>
                          <p className="text-xs text-gray-600">2:00 PM - Progress review with Alex Thompson</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              <Video className="w-3 h-3 mr-1" />
                              Join
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-sm">SEC Compliance Review</h5>
                            <Badge variant="secondary">Aug 31</Badge>
                          </div>
                          <p className="text-xs text-gray-600">Quarterly compliance report submission deadline</p>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-sm">Data Provider Check-in</h5>
                            <Badge variant="outline">Sep 5</Badge>
                          </div>
                          <p className="text-xs text-gray-600">Monthly review with Bloomberg and Experian teams</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                      <h4 className="font-semibold text-sm">Quick Stats</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Unread Messages</span>
                          <Badge variant="secondary">4</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>High Priority</span>
                          <Badge variant="destructive">2</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Upcoming Meetings</span>
                          <Badge variant="outline">3</Badge>
                        </div>
                      </div>
                    </div>
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
                      Security & Access Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">Encryption</h4>
                        </div>
                        <p className="text-xs text-gray-600">End-to-end encryption for all communications</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">Role-Based Access</h4>
                        </div>
                        <p className="text-xs text-gray-600">Granular permissions by stakeholder type</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">Audit Trails</h4>
                        </div>
                        <p className="text-xs text-gray-600">Complete activity logging and monitoring</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-sm">Real-time Monitoring</h4>
                        </div>
                        <p className="text-xs text-gray-600">24/7 security monitoring and alerts</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-semibold text-sm">Access Control Matrix</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Developer Access</span>
                          <Badge variant="default">Code & Project Data</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Data Provider Access</span>
                          <Badge variant="default">Usage & Analytics</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Regulator Access</span>
                          <Badge variant="default">Compliance & Audit</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Investor Admin</span>
                          <Badge variant="default">Full Platform Access</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      Compliance Badges
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
                        <p className="text-xs text-gray-600">Security, availability, processing integrity, confidentiality, and privacy</p>
                        <p className="text-xs text-gray-500 mt-1">Valid until: December 2025</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-sm">GDPR Compliant</h4>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <p className="text-xs text-gray-600">European data protection and privacy regulations</p>
                        <p className="text-xs text-gray-500 mt-1">Last audit: June 2025</p>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-sm">ISO 27001</h4>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Information security management system standards</p>
                        <p className="text-xs text-gray-500 mt-1">Valid until: March 2026</p>
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
                          <span>Session Timeout</span>
                          <Badge variant="default">30 Minutes</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Password Policy</span>
                          <Badge variant="default">Strong</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Data Retention</span>
                          <Badge variant="default">7 Years</Badge>
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