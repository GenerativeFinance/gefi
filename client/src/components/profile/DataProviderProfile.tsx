import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  Database,
  Mail,
  MessageCircle,
  Shield,
  Star,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  ExternalLink,
  MapPin,
  Calendar,
  BarChart3,
  Clock,
  Briefcase,
  Target,
  CreditCard,
  FileText,
  Globe,
  Phone,
  Lock,
  Activity,
  PieChart,
  LineChart,
  Zap,
  Server,
  Key,
  Upload,
  Download,
  Wifi,
  HardDrive,
  CloudLightning,
  Timer,
  RefreshCw,
  DollarSign,
  Archive,
  Code,
  Settings,
  Eye,
  AlertTriangle
} from "lucide-react";

interface DataProviderProfileProps {
  providerId: string;
  data?: any;
}

export default function DataProviderProfile({ providerId, data }: DataProviderProfileProps) {
  const provider = data || {
    id: providerId,
    name: "FinanceData Solutions",
    entity: "Financial Data Corporation",
    bio: "Leading provider of real-time financial market data, alternative data, and economic indicators. Serving institutional clients worldwide with premium data solutions.",
    profileImage: "/api/placeholder/120/120",
    location: "London, UK",
    established: "2015",
    verified: true,
    certified: true,
    dataTypes: [
      "Real-time Market Data",
      "Alternative Data",
      "Economic Indicators",
      "Corporate Fundamentals",
      "ESG Data",
      "Sentiment Analysis",
      "News & Social Media",
      "Regulatory Filings"
    ],
    pricingModel: "Tiered Subscription",
    apiAccess: {
      restApi: true,
      graphqlApi: true,
      websocketStreaming: true,
      bulkDownload: true,
      customIntegrations: true
    },
    sla: {
      uptime: "99.9%",
      latency: "< 50ms",
      refreshRate: "Real-time",
      support: "24/7"
    },
    accessControl: {
      authentication: "OAuth 2.0 / API Keys",
      authorization: "Role-based",
      encryption: "AES-256",
      compliance: ["GDPR", "SOC 2", "ISO 27001"]
    },
    dataUsageStats: {
      totalApiCalls: "2.3B",
      activeModels: 156,
      monthlyUsers: "12.5K",
      dataProcessed: "45TB/month"
    },
    datasets: [
      {
        id: 1,
        name: "Global Equity Market Data",
        description: "Real-time stock prices, volumes, and market data for global exchanges",
        category: "Market Data",
        subscribers: 245,
        apiCalls: "450M/month",
        revenue: "$125,000/month",
        quality: 98.5,
        coverage: "50+ exchanges",
        updateFrequency: "Real-time"
      },
      {
        id: 2,
        name: "Alternative ESG Dataset",
        description: "Comprehensive ESG scores and sustainability metrics for 10,000+ companies",
        category: "ESG Data",
        subscribers: 89,
        apiCalls: "89M/month",
        revenue: "$78,000/month",
        quality: 95.2,
        coverage: "10,000+ companies",
        updateFrequency: "Weekly"
      },
      {
        id: 3,
        name: "Economic Indicators Feed",
        description: "Real-time economic data including GDP, inflation, unemployment rates",
        category: "Economic Data",
        subscribers: 134,
        apiCalls: "156M/month",
        revenue: "$95,000/month",
        quality: 99.1,
        coverage: "195 countries",
        updateFrequency: "Daily"
      }
    ],
    totalRevenue: "$298,000/month",
    totalSubscribers: 468,
    averageQuality: 97.6,
    totalApiCalls: "695M/month",
    pricing: {
      basic: "$500/month",
      professional: "$2,500/month",
      enterprise: "Custom pricing",
      payPerUse: "$0.01/API call"
    },
    licensing: {
      redistribution: "Permitted with license",
      derivatives: "Allowed",
      commercialUse: "Included",
      attribution: "Required"
    },
    sampleDatasets: [
      {
        name: "S&P 500 Sample",
        format: "JSON/CSV",
        size: "10MB",
        description: "30-day sample of S&P 500 data"
      },
      {
        name: "ESG Scores Demo",
        format: "JSON",
        size: "5MB",
        description: "Sample ESG data for 100 companies"
      }
    ],
    developerFeedback: {
      rating: 4.7,
      reviews: 89,
      commonPraise: ["Reliable data", "Excellent API", "Great support"],
      suggestions: ["More historical data", "Additional data formats"]
    },
    contact: {
      email: "api@financedata.com",
      phone: "+44 20 7123 4567",
      website: "https://financedata.com",
      support: "support@financedata.com",
      sales: "sales@financedata.com"
    },
    certifications: [
      {
        name: "ISO 27001",
        description: "Information Security Management",
        validUntil: "Dec 2025"
      },
      {
        name: "SOC 2 Type II",
        description: "Service Organization Control",
        validUntil: "Mar 2025"
      },
      {
        name: "GDPR Compliant",
        description: "Data Protection Regulation",
        validUntil: "Ongoing"
      }
    ],
    responseTime: "< 2 hours",
    lastActivity: "30 minutes ago"
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={provider.profileImage} alt={provider.name} />
                <AvatarFallback className="text-2xl">{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {provider.verified && (
                <div className="absolute -top-1 -right-1 bg-purple-600 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{provider.name}</h1>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Data Provider
                </Badge>
                {provider.certified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Certified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Building className="w-4 h-4" />
                  <span>{provider.entity}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Est. {provider.established}</span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-3xl">{provider.bio}</p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{provider.developerFeedback.rating}</span>
                  <span className="text-gray-500">({provider.developerFeedback.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>Last active: {provider.lastActivity}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Response: {provider.responseTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Data Types Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Types Offered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {provider.dataTypes.map((type, index) => (
              <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{provider.datasets.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Datasets</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{provider.totalRevenue}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{provider.totalSubscribers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{provider.averageQuality}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Quality Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="sla">SLA & Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {provider.datasets.map((dataset) => (
              <Card key={dataset.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dataset.name}</CardTitle>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {dataset.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{dataset.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subscribers</span>
                        <span className="font-semibold">{dataset.subscribers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>API Calls</span>
                        <span className="font-semibold">{dataset.apiCalls}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Quality Score</span>
                        <span className="font-semibold">{dataset.quality}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Revenue</span>
                        <span className="font-semibold text-green-600">{dataset.revenue}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Coverage</span>
                        <span className="font-semibold">{dataset.coverage}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Update Freq</span>
                        <span className="font-semibold">{dataset.updateFrequency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      View Sample
                    </Button>
                    <Button size="sm">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Access Tab */}
        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      REST API
                    </span>
                    <Badge variant={provider.apiAccess.restApi ? 'default' : 'secondary'}>
                      {provider.apiAccess.restApi ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      GraphQL API
                    </span>
                    <Badge variant={provider.apiAccess.graphqlApi ? 'default' : 'secondary'}>
                      {provider.apiAccess.graphqlApi ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Wifi className="w-4 h-4" />
                      WebSocket Streaming
                    </span>
                    <Badge variant={provider.apiAccess.websocketStreaming ? 'default' : 'secondary'}>
                      {provider.apiAccess.websocketStreaming ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Bulk Download
                    </span>
                    <Badge variant={provider.apiAccess.bulkDownload ? 'default' : 'secondary'}>
                      {provider.apiAccess.bulkDownload ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Authentication</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{provider.accessControl.authentication}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Authorization</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{provider.accessControl.authorization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Encryption</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{provider.accessControl.encryption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Compliance</span>
                    <div className="flex gap-1">
                      {provider.accessControl.compliance.map((comp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Basic Plan</span>
                    <span className="text-gray-600 dark:text-gray-400">{provider.pricing.basic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Professional Plan</span>
                    <span className="text-gray-600 dark:text-gray-400">{provider.pricing.professional}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Enterprise Plan</span>
                    <span className="text-gray-600 dark:text-gray-400">{provider.pricing.enterprise}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Pay-per-Use</span>
                    <span className="text-gray-600 dark:text-gray-400">{provider.pricing.payPerUse}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Licensing Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Redistribution</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{provider.licensing.redistribution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Derivatives</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{provider.licensing.derivatives}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Commercial Use</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{provider.licensing.commercialUse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Attribution</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{provider.licensing.attribution}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SLA & Performance Tab */}
        <TabsContent value="sla" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Level Agreement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Uptime Guarantee</span>
                    <span className="text-green-600 font-semibold">{provider.sla.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Response Latency</span>
                    <span className="text-green-600 font-semibold">{provider.sla.latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Data Refresh Rate</span>
                    <span className="text-green-600 font-semibold">{provider.sla.refreshRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Support</span>
                    <span className="text-green-600 font-semibold">{provider.sla.support}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{provider.dataUsageStats.totalApiCalls}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total API Calls</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{provider.dataUsageStats.activeModels}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Models</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{provider.dataUsageStats.monthlyUsers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Users</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{provider.dataUsageStats.dataProcessed}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Data Processed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-semibold">{cert.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{cert.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        Valid until {cert.validUntil}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Developer Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-yellow-600">{provider.developerFeedback.rating}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                  <div className="text-xs text-gray-500">({provider.developerFeedback.reviews} reviews)</div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Common Praise:</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.developerFeedback.commonPraise.map((praise, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                          {praise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Suggestions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.developerFeedback.suggestions.map((suggestion, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium">General</div>
                      <a href={`mailto:${provider.contact.email}`} className="text-blue-600 hover:underline text-sm">
                        {provider.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <a href={`tel:${provider.contact.phone}`} className="text-blue-600 hover:underline text-sm">
                        {provider.contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium">Website</div>
                      <a href={provider.contact.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline text-sm">
                        {provider.contact.website}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium">Support</div>
                      <a href={`mailto:${provider.contact.support}`} className="text-blue-600 hover:underline text-sm">
                        {provider.contact.support}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium">Sales</div>
                      <a href={`mailto:${provider.contact.sales}`} className="text-blue-600 hover:underline text-sm">
                        {provider.contact.sales}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h4 className="font-semibold mb-3">Sample Datasets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.sampleDatasets.map((sample, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{sample.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          {sample.format}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{sample.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Size: {sample.size}</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}