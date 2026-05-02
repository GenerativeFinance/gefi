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
  Code,
  Brain,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  Award,
  CheckCircle
} from "lucide-react";

// Mock data for developer profiles - in production this would come from API
const developerProfiles = [
  {
    id: "ai-solutions",
    handle: "@ai-solutions",
    name: "AI Solutions Inc.",
    verified: true,
    description: "Leading AI research company specializing in financial AI and machine learning portfolio optimization.",
    location: "San Francisco, CA",
    website: "https://ai-solutions.com",
    github: "ai-solutions",
    linkedin: "ai-solutions-inc",
    twitter: "ai_solutions",
    avatar: "/avatars/ai-solutions.png",
    rating: 4.9,
    reviewCount: 234,
    joinedDate: "Jan 2023",
    models: 12,
    subscribers: 2840,
    revenue: 125000,
    specialties: ["Risk Management", "Portfolio Optimization", "Machine Learning"],
    topModels: [
      { name: "Quantum Risk Predictor", rating: 4.8, category: "Risk Management" },
      { name: "Smart Allocation Engine", rating: 4.7, category: "Portfolio Optimization" }
    ],
    stats: {
      totalDownloads: 15420,
      activeSubscriptions: 2840,
      avgRating: 4.9,
      completionRate: 98.5
    },
    achievements: [
      "Top Developer 2024",
      "Most Innovative AI Model",
      "100k+ Downloads",
      "Verified Developer"
    ]
  },
  {
    id: "market-analytics",
    handle: "@market-analytics",
    name: "Market Analytics Pro",
    verified: true,
    description: "Professional market research firm with 15+ years of experience in financial analysis.",
    location: "London, UK",
    website: "https://marketanalytics.pro",
    github: "market-analytics",
    linkedin: "market-analytics-pro",
    twitter: "market_analytics",
    avatar: "/avatars/market-analytics.png",
    rating: 4.8,
    reviewCount: 298,
    joinedDate: "Nov 2022",
    models: 15,
    subscribers: 3150,
    revenue: 198000,
    specialties: ["Market Research", "Sentiment Analysis", "Economic Forecasting"],
    topModels: [
      { name: "AI Trend Analyzer", rating: 4.9, category: "Market Analysis" },
      { name: "Sentiment Predictor", rating: 4.7, category: "Sentiment Analysis" }
    ],
    stats: {
      totalDownloads: 22100,
      activeSubscriptions: 3150,
      avgRating: 4.8,
      completionRate: 96.2
    },
    achievements: [
      "Market Expert 2024",
      "Best Analytics Tool",
      "Trusted Partner",
      "Verified Developer"
    ]
  },
  {
    id: "fintech-innovations",
    handle: "@fintech-innov",
    name: "FinTech Innovations",
    verified: true,
    description: "Innovative fintech startup creating next-generation trading algorithms and portfolio analysis tools.",
    location: "New York, NY",
    website: "https://fintech-innovations.com",
    github: "fintech-innovations",
    linkedin: "fintech-innovations",
    twitter: "fintech_innov",
    avatar: "/avatars/fintech-innovations.png",
    rating: 4.7,
    reviewCount: 156,
    joinedDate: "Mar 2023",
    models: 8,
    subscribers: 1920,
    revenue: 89000,
    specialties: ["Trading Algorithms", "Market Analysis", "Quantitative Finance"],
    topModels: [
      { name: "Smart Portfolio Optimizer", rating: 4.8, category: "Portfolio Management" },
      { name: "Trend Prediction Engine", rating: 4.6, category: "Market Analysis" }
    ],
    stats: {
      totalDownloads: 8760,
      activeSubscriptions: 1920,
      avgRating: 4.7,
      completionRate: 94.8
    },
    achievements: [
      "Rising Star 2024",
      "Innovation Award",
      "Fast Growing",
      "Verified Developer"
    ]
  }
];

export default function DeveloperProfile() {
  const { developerId } = useParams<{ developerId: string }>();
  
  // Find the developer profile
  const developer = developerProfiles.find(dev => dev.id === developerId);

  if (!developer) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Developer Not Found</h1>
            <p className="text-muted-foreground">The developer profile you're looking for doesn't exist.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Profile Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Info */}
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={developer.avatar} alt={developer.name} />
                  <AvatarFallback className="text-2xl font-bold bg-blue-600 text-white">
                    {developer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold">{developer.name}</h1>
                    {developer.verified && (
                      <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-lg">{developer.handle}</p>
                  
                  <p className="text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                    {developer.description}
                  </p>
                  
                  {/* Location and Social Links */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{developer.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {developer.joinedDate}</span>
                    </div>
                    {developer.website && (
                      <a href={developer.website} className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {developer.github && (
                      <a href={`https://github.com/${developer.github}`} className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {developer.linkedin && (
                      <a href={`https://linkedin.com/company/${developer.linkedin}`} className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
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
                    <span className="text-2xl font-bold">{developer.rating}</span>
                    <span className="text-muted-foreground">({developer.reviewCount})</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button size="lg">
                    <Users className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                  <Button size="lg" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{developer.models}</div>
              <div className="text-sm text-muted-foreground">Models</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{formatNumber(developer.subscribers)}</div>
              <div className="text-sm text-muted-foreground">Subscribers</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{formatCurrency(developer.revenue)}</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Specialties and Top Models */}
          <div className="space-y-6">
            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {developer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Top Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {developer.topModels.map((model, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-muted-foreground">{model.category}</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{model.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {developer.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Performance Stats */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Downloads</span>
                      <span className="font-bold">{formatNumber(developer.stats.totalDownloads)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Active Subscriptions</span>
                      <span className="font-bold">{formatNumber(developer.stats.activeSubscriptions)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Rating</span>
                      <span className="font-bold">{developer.stats.avgRating}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-bold">{developer.stats.completionRate}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{developer.models}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Published Models</div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(developer.revenue)}</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Total Revenue</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatNumber(developer.subscribers)}</div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Active Subscribers</div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button>
                    <Eye className="h-4 w-4 mr-2" />
                    View All Models
                  </Button>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Follow Developer
                  </Button>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    View Reviews
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