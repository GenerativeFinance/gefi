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
  Database,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  Award,
  CheckCircle,
  BarChart3,
  FileText,
  Clock
} from "lucide-react";

// Mock data for data provider profiles
const dataProviderProfiles = [
  {
    id: "financial-data-corp",
    handle: "@financial-data",
    name: "Financial Data Corp",
    verified: true,
    description: "Premium financial data provider serving institutional clients with real-time market data, historical analytics, and comprehensive ESG datasets.",
    location: "New York, NY",
    website: "https://financialdata.corp",
    github: "financial-data-corp",
    linkedin: "financial-data-corp",
    twitter: "financial_data",
    avatar: "/avatars/financial-data.png",
    rating: 4.9,
    reviewCount: 87,
    joinedDate: "Feb 2022",
    datasets: 24,
    subscribers: 4200,
    revenue: 485000,
    specialties: ["Market Data", "ESG Analytics", "Risk Metrics", "Alternative Data"],
    topDatasets: [
      { name: "Real-Time Market Feed", rating: 4.9, category: "Market Data", subscribers: 1250 },
      { name: "ESG Score Database", rating: 4.8, category: "ESG Analytics", subscribers: 890 },
      { name: "Credit Risk Indicators", rating: 4.7, category: "Risk Metrics", subscribers: 750 }
    ],
    stats: {
      totalAPIcalls: 12500000,
      dataAccuracy: 99.7,
      avgLatency: 15,
      uptime: 99.95,
      clientRetention: 94.2
    },
    achievements: [
      "Premium Data Partner",
      "99.9% Uptime Award",
      "Institutional Grade",
      "Verified Provider"
    ],
    dataTypes: ["Market Data", "Fundamental Data", "Alternative Data", "ESG Data", "Risk Data"],
    coverage: {
      markets: 45,
      instruments: 125000,
      countries: 65,
      currencies: 35
    }
  },
  {
    id: "global-market-insights",
    handle: "@global-insights",
    name: "Global Market Insights",
    verified: true,
    description: "Leading provider of global market intelligence, economic indicators, and macroeconomic research data for financial institutions worldwide.",
    location: "London, UK",
    website: "https://globalmarketinsights.com",
    github: "global-market-insights",
    linkedin: "global-market-insights",
    twitter: "global_insights",
    avatar: "/avatars/global-insights.png",
    rating: 4.8,
    reviewCount: 156,
    joinedDate: "Jun 2021",
    datasets: 18,
    subscribers: 2850,
    revenue: 320000,
    specialties: ["Economic Data", "Market Intelligence", "Research Reports", "Macro Analytics"],
    topDatasets: [
      { name: "Global Economic Indicators", rating: 4.9, category: "Economic Data", subscribers: 980 },
      { name: "Market Sentiment Index", rating: 4.7, category: "Market Intelligence", subscribers: 745 },
      { name: "Central Bank Analysis", rating: 4.8, category: "Research Reports", subscribers: 620 }
    ],
    stats: {
      totalAPIcalls: 8500000,
      dataAccuracy: 98.9,
      avgLatency: 22,
      uptime: 99.8,
      clientRetention: 91.5
    },
    achievements: [
      "Research Excellence Award",
      "Global Coverage Leader",
      "Trusted Analytics",
      "Verified Provider"
    ],
    dataTypes: ["Economic Data", "Research Reports", "Market Sentiment", "Policy Analysis", "Forecasts"],
    coverage: {
      markets: 38,
      instruments: 85000,
      countries: 120,
      currencies: 45
    }
  },
  {
    id: "alternative-signals",
    handle: "@alt-signals",
    name: "Alternative Signals Ltd",
    verified: true,
    description: "Innovative alternative data provider specializing in satellite imagery, social sentiment, and non-traditional market indicators for quantitative research.",
    location: "Singapore",
    website: "https://alternativesignals.com",
    github: "alternative-signals",
    linkedin: "alternative-signals",
    twitter: "alt_signals",
    avatar: "/avatars/alt-signals.png",
    rating: 4.6,
    reviewCount: 93,
    joinedDate: "Sep 2022",
    datasets: 12,
    subscribers: 1680,
    revenue: 195000,
    specialties: ["Satellite Data", "Social Sentiment", "Alternative Indicators", "Geospatial Analytics"],
    topDatasets: [
      { name: "Satellite Economic Activity", rating: 4.7, category: "Satellite Data", subscribers: 450 },
      { name: "Social Media Sentiment", rating: 4.5, category: "Social Sentiment", subscribers: 520 },
      { name: "Supply Chain Tracking", rating: 4.6, category: "Alternative Indicators", subscribers: 380 }
    ],
    stats: {
      totalAPIcalls: 3200000,
      dataAccuracy: 97.3,
      avgLatency: 35,
      uptime: 99.6,
      clientRetention: 88.7
    },
    achievements: [
      "Innovation Award 2024",
      "Alternative Data Pioneer",
      "Tech Innovation Leader",
      "Verified Provider"
    ],
    dataTypes: ["Satellite Data", "Social Data", "Geospatial Data", "Alternative Indicators", "Predictive Signals"],
    coverage: {
      markets: 25,
      instruments: 45000,
      countries: 85,
      currencies: 20
    }
  }
];

export default function DataProviderProfile() {
  const { providerId } = useParams<{ providerId: string }>();
  
  // Find the data provider profile
  const provider = dataProviderProfiles.find(prov => prov.id === providerId);

  if (!provider) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Data Provider Not Found</h1>
            <p className="text-muted-foreground">The data provider profile you're looking for doesn't exist.</p>
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

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Profile Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Info */}
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback className="text-2xl font-bold bg-green-600 text-white">
                    {provider.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold">{provider.name}</h1>
                    {provider.verified && (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-lg">{provider.handle}</p>
                  
                  <p className="text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                    {provider.description}
                  </p>
                  
                  {/* Location and Social Links */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {provider.joinedDate}</span>
                    </div>
                    {provider.website && (
                      <a href={provider.website} className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {provider.github && (
                      <a href={`https://github.com/${provider.github}`} className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {provider.linkedin && (
                      <a href={`https://linkedin.com/company/${provider.linkedin}`} className="flex items-center space-x-1 hover:text-green-600 transition-colors">
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
                    <span className="text-2xl font-bold">{provider.rating}</span>
                    <span className="text-muted-foreground">({provider.reviewCount})</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button size="lg">
                    <Database className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                  <Button size="lg" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Datasets
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
              <div className="text-3xl font-bold text-green-600">{provider.datasets}</div>
              <div className="text-sm text-muted-foreground">Datasets</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{formatNumber(provider.subscribers)}</div>
              <div className="text-sm text-muted-foreground">Subscribers</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{formatCurrency(provider.revenue)}</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Data Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Data Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {provider.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Data Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {provider.dataTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{type}</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coverage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Markets</span>
                    <span className="font-medium">{provider.coverage.markets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Instruments</span>
                    <span className="font-medium">{formatNumber(provider.coverage.instruments)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Countries</span>
                    <span className="font-medium">{provider.coverage.countries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Currencies</span>
                    <span className="font-medium">{provider.coverage.currencies}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Datasets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Top Datasets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {provider.topDatasets.map((dataset, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{dataset.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{dataset.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{dataset.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(dataset.subscribers)} subscribers
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">API Calls</span>
                      <span className="font-bold">{formatLargeNumber(provider.stats.totalAPIcalls)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Data Accuracy</span>
                      <span className="font-bold">{provider.stats.dataAccuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg Latency</span>
                      <span className="font-bold">{provider.stats.avgLatency}ms</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-bold text-green-600">{provider.stats.uptime}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Client Retention</span>
                      <span className="font-bold">{provider.stats.clientRetention}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-bold">{provider.rating}/5.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button>
                    <Database className="h-4 w-4 mr-2" />
                    Browse Datasets
                  </Button>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Request Trial
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