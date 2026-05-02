import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  DollarSign,
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
  Zap
} from "lucide-react";

interface InvestorProfileProps {
  investorId: string;
  data?: any;
}

export default function InvestorProfile({ investorId, data }: InvestorProfileProps) {
  const investor = data || {
    id: investorId,
    name: "Quantum Capital Partners",
    type: "Venture Capital",
    bio: "Early-stage venture capital firm focused on AI and fintech innovations. We invest in groundbreaking financial technology solutions that reshape how markets operate.",
    profileImage: "/api/placeholder/120/120",
    location: "New York, NY",
    founded: "2018",
    verified: true,
    accredited: true,
    investmentFocus: ["AI/ML", "Fintech", "Quantitative Trading", "Risk Management", "Blockchain"],
    ticketSize: {
      min: "$50,000",
      max: "$2,000,000",
      typical: "$250,000"
    },
    investmentStage: ["Seed", "Series A", "Series B"],
    riskAppetite: "Medium-High",
    totalInvestments: 47,
    totalInvested: "$28.5M",
    activeInvestments: 23,
    exitedInvestments: 8,
    averageReturn: "18.3%",
    bestReturn: "340%",
    investmentHistory: [
      {
        id: 1,
        modelName: "Quantum Risk Optimizer",
        developer: "Sarah Chen",
        amount: "$125,000",
        date: "May 2025",
        status: "Active",
        currentReturn: "+18.3%",
        equity: "12%",
        stage: "Series A"
      },
      {
        id: 2,
        modelName: "ESG Portfolio Analyzer",
        developer: "Michael Park",
        amount: "$89,000",
        date: "April 2025",
        status: "Active",
        currentReturn: "+12.7%",
        equity: "8%",
        stage: "Seed"
      },
      {
        id: 3,
        modelName: "Crypto Volatility Predictor",
        developer: "Alex Thompson",
        amount: "$156,000",
        date: "March 2025",
        status: "Active",
        currentReturn: "+22.1%",
        equity: "15%",
        stage: "Series A"
      }
    ],
    activeInvestmentDetails: [
      {
        category: "Risk Management",
        allocation: 35,
        amount: "$9.98M",
        models: 8,
        avgReturn: "21.2%"
      },
      {
        category: "Trading Algorithms",
        allocation: 28,
        amount: "$7.98M",
        models: 6,
        avgReturn: "18.7%"
      },
      {
        category: "Portfolio Optimization",
        allocation: 22,
        amount: "$6.27M",
        models: 5,
        avgReturn: "15.3%"
      },
      {
        category: "Market Analysis",
        allocation: 15,
        amount: "$4.28M",
        models: 4,
        avgReturn: "16.8%"
      }
    ],
    preferences: {
      communication: "Direct messaging preferred",
      ndaRequired: true,
      termSheetPreference: "Standard terms with performance milestones",
      investmentHorizon: "3-5 years",
      governanceParticipation: "Active board participation",
      reportingFrequency: "Monthly"
    },
    contact: {
      email: "invest@quantumcapital.com",
      phone: "+1 (555) 123-4567",
      website: "https://quantumcapital.com",
      linkedIn: "https://linkedin.com/company/quantum-capital"
    },
    team: [
      {
        name: "David Chen",
        role: "Managing Partner",
        experience: "15 years in fintech investing"
      },
      {
        name: "Sarah Williams",
        role: "Investment Director",
        experience: "12 years in quantitative finance"
      }
    ],
    rating: 4.8,
    reviews: 28,
    responseTime: "< 48 hours",
    lastActivity: "2 hours ago"
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={investor.profileImage} alt={investor.name} />
                <AvatarFallback className="text-2xl">{investor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {investor.verified && (
                <div className="absolute -top-1 -right-1 bg-green-600 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{investor.name}</h1>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {investor.type}
                </Badge>
                {investor.accredited && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Accredited
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{investor.location}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Founded {investor.founded}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Response: {investor.responseTime}</span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-3xl">{investor.bio}</p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{investor.rating}</span>
                  <span className="text-gray-500">({investor.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>Last active: {investor.lastActivity}</span>
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

      {/* Investment Focus Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investment Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {investor.investmentFocus.map((focus, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {focus}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{investor.totalInvested}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Invested</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{investor.totalInvestments}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Investments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{investor.activeInvestments}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Investments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{investor.averageReturn}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Return</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="investments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="criteria">Criteria</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Investments Tab */}
        <TabsContent value="investments" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Investments</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {investor.investmentHistory.map((investment) => (
                <Card key={investment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{investment.modelName}</CardTitle>
                      <Badge variant={investment.status === 'Active' ? 'default' : 'secondary'}>
                        {investment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Developer</span>
                          <span className="font-semibold">{investment.developer}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Amount</span>
                          <span className="font-semibold text-green-600">{investment.amount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Stage</span>
                          <span className="font-semibold">{investment.stage}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Date</span>
                          <span className="font-semibold">{investment.date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Return</span>
                          <span className="font-semibold text-green-600">{investment.currentReturn}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Equity</span>
                          <span className="font-semibold">{investment.equity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Contact Dev
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {investor.activeInvestmentDetails.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.category}</span>
                      <span className="text-gray-600 dark:text-gray-400">{category.allocation}%</span>
                    </div>
                    <Progress value={category.allocation} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{category.amount} • {category.models} models</span>
                      <span className="text-green-600">Avg: {category.avgReturn}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{investor.averageReturn}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Return</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{investor.bestReturn}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Best Return</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{investor.activeInvestments}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{investor.exitedInvestments}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Exited</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Criteria Tab */}
        <TabsContent value="criteria" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Ticket Size Range</span>
                    <span className="text-gray-600 dark:text-gray-400">{investor.ticketSize.min} - {investor.ticketSize.max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Typical Investment</span>
                    <span className="text-gray-600 dark:text-gray-400">{investor.ticketSize.typical}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Risk Appetite</span>
                    <span className="text-gray-600 dark:text-gray-400">{investor.riskAppetite}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Investment Horizon</span>
                    <span className="text-gray-600 dark:text-gray-400">{investor.preferences.investmentHorizon}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Stages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {investor.investmentStage.map((stage, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {stage}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Communication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{investor.preferences.communication}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">NDA Required</h4>
                    <Badge variant={investor.preferences.ndaRequired ? 'default' : 'secondary'}>
                      {investor.preferences.ndaRequired ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Reporting Frequency</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{investor.preferences.reportingFrequency}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Term Sheet Preference</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{investor.preferences.termSheetPreference}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Governance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{investor.preferences.governanceParticipation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investor.team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={`/api/placeholder/64/64`} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                      <p className="text-xs text-gray-500 mt-1">{member.experience}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                    <a href={`mailto:${investor.contact.email}`} className="text-blue-600 hover:underline">
                      {investor.contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <a href={`tel:${investor.contact.phone}`} className="text-blue-600 hover:underline">
                      {investor.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <a href={investor.contact.website} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <a href={investor.contact.linkedIn} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}