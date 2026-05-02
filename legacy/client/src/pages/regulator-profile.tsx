import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "@/components/layout/Layout";
import { 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  Star,
  Eye,
  Shield,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Award,
  CheckCircle,
  BarChart3,
  Building,
  Scale,
  Clock,
  AlertTriangle,
  CheckSquare
} from "lucide-react";

// Mock data for regulator profiles
const regulatorProfiles = [
  {
    id: "financial-conduct-authority",
    handle: "@fca-uk",
    name: "Financial Conduct Authority",
    verified: true,
    description: "UK's financial services regulator ensuring financial markets work well for individuals, businesses and the economy as a whole.",
    location: "London, UK",
    website: "https://fca.org.uk",
    github: "fca-digital",
    linkedin: "financial-conduct-authority",
    twitter: "fca_news",
    avatar: "/avatars/fca.png",
    rating: 4.8,
    reviewCount: 245,
    joinedDate: "Jan 2021",
    jurisdiction: "United Kingdom",
    regulatoryScope: ["Banking", "Insurance", "Investment", "Consumer Credit", "Market Infrastructure"],
    activeRegulations: 18,
    complianceRate: 94.3,
    registeredEntities: 58000,
    specialties: ["Market Integrity", "Consumer Protection", "Prudential Regulation", "Anti-Money Laundering"],
    recentActions: [
      { type: "Policy Update", title: "AI in Financial Services Guidelines", date: "2025-01-15", status: "Published" },
      { type: "Enforcement", title: "Market Manipulation Investigation", date: "2025-01-10", status: "Ongoing" },
      { type: "Consultation", title: "Digital Assets Framework", date: "2025-01-05", status: "Open" }
    ],
    stats: {
      totalAudits: 1247,
      complianceChecks: 8950,
      enforcementActions: 156,
      policyUpdates: 45,
      averageResponseTime: 5.2
    },
    achievements: [
      "International Regulatory Excellence",
      "Digital Innovation Leader",
      "Consumer Protection Award",
      "Regulatory Technology Pioneer"
    ],
    coverage: {
      sectors: 12,
      firms: 58000,
      assets: "£8.2T",
      countries: 1
    }
  },
  {
    id: "sec-usa",
    handle: "@sec-gov",
    name: "Securities and Exchange Commission",
    verified: true,
    description: "U.S. federal agency that enforces securities laws and regulates the securities industry, stock and options exchanges, and related activities.",
    location: "Washington, DC",
    website: "https://sec.gov",
    github: "sec-gov",
    linkedin: "us-securities-exchange-commission",
    twitter: "sec_news",
    avatar: "/avatars/sec.png",
    rating: 4.7,
    reviewCount: 892,
    joinedDate: "Mar 2020",
    jurisdiction: "United States",
    regulatoryScope: ["Securities", "Investment Companies", "Investment Advisers", "Public Companies", "Market Infrastructure"],
    activeRegulations: 24,
    complianceRate: 91.8,
    registeredEntities: 145000,
    specialties: ["Securities Regulation", "Market Oversight", "Investor Protection", "Corporate Disclosure"],
    recentActions: [
      { type: "Rule Making", title: "Climate Risk Disclosure Rules", date: "2025-01-20", status: "Final Rule" },
      { type: "Enforcement", title: "Cryptocurrency Exchange Violations", date: "2025-01-18", status: "Settlement" },
      { type: "Guidance", title: "ESG Investment Disclosures", date: "2025-01-12", status: "Published" }
    ],
    stats: {
      totalAudits: 3480,
      complianceChecks: 24500,
      enforcementActions: 678,
      policyUpdates: 89,
      averageResponseTime: 7.8
    },
    achievements: [
      "Global Regulatory Leadership",
      "Market Transparency Champion",
      "Investor Protection Excellence",
      "Technology Innovation Award"
    ],
    coverage: {
      sectors: 15,
      firms: 145000,
      assets: "$45.6T",
      countries: 1
    }
  },
  {
    id: "esma-eu",
    handle: "@esma-europa",
    name: "European Securities and Markets Authority",
    verified: true,
    description: "EU authority that contributes to safeguarding the stability of the European Union's financial system by enhancing investor protection and promoting stable and orderly financial markets.",
    location: "Paris, France",
    website: "https://esma.europa.eu",
    github: "esma-europa",
    linkedin: "european-securities-markets-authority",
    twitter: "esma_news",
    avatar: "/avatars/esma.png",
    rating: 4.6,
    reviewCount: 167,
    joinedDate: "Aug 2021",
    jurisdiction: "European Union",
    regulatoryScope: ["Securities Markets", "Credit Rating Agencies", "Trade Repositories", "Investment Funds", "Market Infrastructure"],
    activeRegulations: 21,
    complianceRate: 89.7,
    registeredEntities: 85000,
    specialties: ["MiFID Implementation", "CSDR Compliance", "Sustainable Finance", "Digital Assets"],
    recentActions: [
      { type: "Technical Standards", title: "MiFID III Implementation", date: "2025-01-25", status: "Consultation" },
      { type: "Supervision", title: "ESG Rating Providers Review", date: "2025-01-22", status: "Ongoing" },
      { type: "Guidelines", title: "Crypto Asset Regulation (MiCA)", date: "2025-01-15", status: "Published" }
    ],
    stats: {
      totalAudits: 2156,
      complianceChecks: 15600,
      enforcementActions: 234,
      policyUpdates: 67,
      averageResponseTime: 6.5
    },
    achievements: [
      "EU Financial Integration Leader",
      "Cross-Border Supervision Excellence",
      "Regulatory Harmonization Award",
      "Digital Finance Innovation"
    ],
    coverage: {
      sectors: 14,
      firms: 85000,
      assets: "€32.8T",
      countries: 27
    }
  }
];

export default function RegulatorProfile() {
  const { regulatorId } = useParams<{ regulatorId: string }>();
  
  // Find the regulator profile
  const regulator = regulatorProfiles.find(reg => reg.id === regulatorId);

  if (!regulator) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Regulator Not Found</h1>
            <p className="text-muted-foreground">The regulator profile you're looking for doesn't exist.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': case 'Final Rule': case 'Settlement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Ongoing': case 'Open': case 'Consultation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'Policy Update': case 'Rule Making': case 'Technical Standards': return FileText;
      case 'Enforcement': return AlertTriangle;
      case 'Consultation': case 'Guidance': case 'Guidelines': return CheckSquare;
      case 'Supervision': return Eye;
      default: return FileText;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Profile Card */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-200 dark:border-red-800">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Info */}
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={regulator.avatar} alt={regulator.name} />
                  <AvatarFallback className="text-2xl font-bold bg-red-600 text-white">
                    {regulator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold">{regulator.name}</h1>
                    {regulator.verified && (
                      <Badge variant="default" className="bg-red-600 hover:bg-red-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Official
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-lg">{regulator.handle}</p>
                  
                  <p className="text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                    {regulator.description}
                  </p>
                  
                  {/* Location and Links */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{regulator.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{regulator.jurisdiction}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {regulator.joinedDate}</span>
                    </div>
                    {regulator.website && (
                      <a href={regulator.website} className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                        <Globe className="h-4 w-4" />
                        <span>Official Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating and Actions */}
              <div className="lg:ml-auto flex flex-col items-end space-y-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{regulator.rating}</span>
                    <span className="text-muted-foreground">({regulator.reviewCount})</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Industry Rating</div>
                </div>
                
                <div className="flex space-x-3">
                  <Button size="lg">
                    <FileText className="h-4 w-4 mr-2" />
                    View Regulations
                  </Button>
                  <Button size="lg" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600">{regulator.activeRegulations}</div>
              <div className="text-sm text-muted-foreground">Active Regulations</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{formatNumber(regulator.registeredEntities)}</div>
              <div className="text-sm text-muted-foreground">Registered Entities</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{regulator.complianceRate}%</div>
              <div className="text-sm text-muted-foreground">Compliance Rate</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{regulator.coverage.assets}</div>
              <div className="text-sm text-muted-foreground">Assets Under Supervision</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Regulatory Scope */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="h-5 w-5 mr-2" />
                  Regulatory Scope
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {regulator.regulatoryScope.map((scope, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {scope}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Key Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regulator.specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{specialty}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coverage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Jurisdiction Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sectors</span>
                    <span className="font-medium">{regulator.coverage.sectors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Regulated Firms</span>
                    <span className="font-medium">{formatNumber(regulator.coverage.firms)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Countries</span>
                    <span className="font-medium">{regulator.coverage.countries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Assets</span>
                    <span className="font-medium">{regulator.coverage.assets}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Regulatory Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Regulatory Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regulator.recentActions.map((action, index) => {
                    const Icon = getActionIcon(action.type);
                    return (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold">{action.title}</h3>
                              <Badge className={getStatusColor(action.status)}>
                                {action.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{action.type}</Badge>
                              <span className="text-sm text-muted-foreground">{action.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Regulatory Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Audits</span>
                      <span className="font-bold">{formatNumber(regulator.stats.totalAudits)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Compliance Checks</span>
                      <span className="font-bold">{formatNumber(regulator.stats.complianceChecks)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Enforcement Actions</span>
                      <span className="font-bold">{formatNumber(regulator.stats.enforcementActions)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Policy Updates</span>
                      <span className="font-bold">{regulator.stats.policyUpdates}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg Response Time</span>
                      <span className="font-bold">{regulator.stats.averageResponseTime} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Compliance Rate</span>
                      <span className="font-bold text-green-600">{regulator.complianceRate}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Awards and Recognition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Awards & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {regulator.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    View All Regulations
                  </Button>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Compliance Guide
                  </Button>
                  <Button variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Submit Inquiry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}