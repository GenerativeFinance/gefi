import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Building,
  Code,
  DollarSign,
  Github,
  GitlabIcon,
  Globe,
  Mail,
  MessageCircle,
  Shield,
  Star,
  Target,
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
  BookOpen,
  FileText,
  Link,
  Zap,
  Activity
} from "lucide-react";

interface DeveloperProfileProps {
  developerId: string;
  data?: any;
}

export default function DeveloperProfile({ developerId, data }: DeveloperProfileProps) {
  const developer = data || {
    id: developerId,
    name: "Sarah Chen",
    handle: "@sarah_quant",
    organization: "Quantum AI Labs",
    bio: "Specialized in algorithmic trading and portfolio optimization with 8+ years in quantitative finance. Expert in machine learning for financial markets.",
    profileImage: "/api/placeholder/120/120",
    location: "San Francisco, CA",
    joinDate: "March 2024",
    verified: true,
    skills: [
      { name: "Python", level: 95 },
      { name: "TensorFlow", level: 90 },
      { name: "PyTorch", level: 85 },
      { name: "Quantitative Finance", level: 92 },
      { name: "Risk Management", level: 88 },
      { name: "Algorithmic Trading", level: 94 }
    ],
    techStack: ["Python", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Sklearn", "PostgreSQL", "Docker", "AWS"],
    publishedModels: [
      {
        id: 1,
        name: "Quantum Risk Optimizer",
        description: "Advanced portfolio optimization using quantum computing principles",
        accuracy: 94.5,
        sharpeRatio: 2.3,
        subscribers: 245,
        funding: "$125,000",
        status: "Active",
        performance: "+18.3%"
      },
      {
        id: 2,
        name: "ESG Sentiment Analyzer",
        description: "Real-time ESG sentiment analysis for sustainable investing",
        accuracy: 91.2,
        sharpeRatio: 1.8,
        subscribers: 180,
        funding: "$89,000",
        status: "Active",
        performance: "+12.7%"
      },
      {
        id: 3,
        name: "Crypto Volatility Predictor",
        description: "Predictive model for cryptocurrency market volatility",
        accuracy: 87.8,
        sharpeRatio: 2.1,
        subscribers: 320,
        funding: "$156,000",
        status: "Active",
        performance: "+22.1%"
      }
    ],
    totalFunding: "$370,000",
    totalSubscribers: 745,
    averageAccuracy: 91.2,
    averageSharpeRatio: 2.07,
    complianceStatus: {
      kyc: true,
      audit: true,
      lastAuditDate: "June 2025",
      certifications: ["SEC Compliant", "SOC 2 Type II", "ISO 27001"]
    },
    collaborationHistory: {
      investors: [
        { name: "Quantum Capital", investment: "$125,000", status: "Active" },
        { name: "TechVenture Fund", investment: "$156,000", status: "Active" },
        { name: "Green Investment", investment: "$89,000", status: "Active" }
      ],
      dataProviders: [
        { name: "Bloomberg Terminal", status: "Active", apiCalls: "2.3M/month" },
        { name: "Reuters Data", status: "Active", apiCalls: "1.8M/month" }
      ]
    },
    github: "https://github.com/sarah-quant",
    availability: "Available for consulting",
    consultingRate: "$250/hour",
    responseTime: "< 24 hours",
    rating: 4.9,
    reviews: 47,
    totalProjects: 12,
    completedProjects: 10
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={developer.profileImage} alt={developer.name} />
                <AvatarFallback className="text-2xl">{developer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {developer.verified && (
                <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{developer.name}</h1>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {developer.handle}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Building className="w-4 h-4" />
                  <span>{developer.organization}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{developer.location}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {developer.joinDate}</span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-3xl">{developer.bio}</p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{developer.rating}</span>
                  <span className="text-gray-500">({developer.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Briefcase className="w-4 h-4" />
                  <span>{developer.completedProjects}/{developer.totalProjects} projects completed</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Response time: {developer.responseTime}</span>
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{developer.publishedModels.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Published Models</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{developer.totalFunding}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Funding</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{developer.totalSubscribers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{developer.averageAccuracy}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {developer.publishedModels.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge variant={model.status === 'Active' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{model.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span className="font-semibold">{model.accuracy}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sharpe Ratio</span>
                        <span className="font-semibold">{model.sharpeRatio}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subscribers</span>
                        <span className="font-semibold">{model.subscribers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Performance</span>
                        <span className="font-semibold text-green-600">{model.performance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Funding: </span>
                      <span className="font-semibold text-green-600">{model.funding}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Core Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {developer.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-600 dark:text-gray-400">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {developer.techStack.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Funding Tab */}
        <TabsContent value="funding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funding History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {developer.collaborationHistory.investors.map((investor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{investor.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Investment Amount</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{investor.investment}</div>
                      <Badge variant={investor.status === 'Active' ? 'default' : 'secondary'}>
                        {investor.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>KYC Verification</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Security Audit</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Passed</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Audit</span>
                  <span className="text-gray-600 dark:text-gray-400">{developer.complianceStatus.lastAuditDate}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {developer.complianceStatus.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Collaboration Tab */}
        <TabsContent value="collaboration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {developer.collaborationHistory.dataProviders.map((provider, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{provider.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">API Usage: {provider.apiCalls}</p>
                    </div>
                    <Badge variant={provider.status === 'Active' ? 'default' : 'secondary'}>
                      {provider.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge variant="default" className="bg-green-600">
                    {developer.availability}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Consulting Rate</span>
                  <span className="font-semibold">{developer.consultingRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <span className="text-gray-600 dark:text-gray-400">{developer.responseTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Links & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <a href={developer.github} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  GitHub Profile
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Platform Member since {developer.joinDate}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}