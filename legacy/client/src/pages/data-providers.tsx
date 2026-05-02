import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Link } from "wouter";
import { 
  Search,
  Users,
  Star,
  MapPin,
  Globe,
  Database,
  TrendingUp,
  Award,
  Shield,
  Heart,
  ExternalLink,
  Filter,
  SortAsc,
  Building,
  CheckCircle,
  Clock,
  Activity,
  DollarSign
} from "lucide-react";

// Sample data provider data
const mockDataProviders = [
  {
    id: 1,
    name: "Bloomberg Terminal Data",
    username: "bloomberg-data",
    avatar: "/api/placeholder/100/100",
    bio: "Professional-grade financial market data and analytics provider with real-time feeds across global markets.",
    location: "New York, NY",
    website: "https://bloomberg.com/professional",
    joinedDate: "2022-08-15",
    datasetsCount: 45,
    subscribersCount: 8420,
    totalRevenue: 450000,
    rating: 4.9,
    reviewsCount: 534,
    verified: true,
    compliance: ["SOC 2", "ISO 27001", "GDPR"],
    specialties: ["Market Data", "Real-time Feeds", "Global Coverage", "Risk Analytics"],
    topDatasets: [
      { name: "Global Equity Prices", subscribers: 2156, rating: 4.9, category: "Market Data" },
      { name: "Fixed Income Analytics", subscribers: 1843, rating: 4.8, category: "Bonds" },
      { name: "Currency Exchange Rates", subscribers: 1521, rating: 4.9, category: "Forex" }
    ],
    dataQuality: 98,
    updateFrequency: "Real-time",
    apiUptime: 99.9
  },
  {
    id: 2,
    name: "Refinitiv Financial Data",
    username: "refinitiv-data",
    avatar: "/api/placeholder/100/100",
    bio: "Comprehensive financial data provider offering market data, analytics, and insights across asset classes.",
    location: "London, UK",
    website: "https://refinitiv.com",
    joinedDate: "2022-11-10",
    datasetsCount: 38,
    subscribersCount: 6750,
    totalRevenue: 320000,
    rating: 4.8,
    reviewsCount: 387,
    verified: true,
    compliance: ["SOC 2", "MiFID II", "GDPR"],
    specialties: ["Alternative Data", "ESG Analytics", "Credit Data", "Economic Indicators"],
    topDatasets: [
      { name: "ESG Sustainability Scores", subscribers: 1654, rating: 4.8, category: "ESG" },
      { name: "Corporate Credit Ratings", subscribers: 1432, rating: 4.7, category: "Credit" },
      { name: "Economic Indicators", subscribers: 1298, rating: 4.9, category: "Economics" }
    ],
    dataQuality: 96,
    updateFrequency: "Daily",
    apiUptime: 99.7
  },
  {
    id: 3,
    name: "Quandl Financial Markets",
    username: "quandl-data",
    avatar: "/api/placeholder/100/100",
    bio: "Alternative and traditional financial data platform providing unique datasets for quantitative analysis.",
    location: "Toronto, CA",
    website: "https://quandl.com",
    joinedDate: "2023-02-20",
    datasetsCount: 52,
    subscribersCount: 4920,
    totalRevenue: 180000,
    rating: 4.6,
    reviewsCount: 298,
    verified: true,
    compliance: ["SOC 2", "GDPR"],
    specialties: ["Alternative Data", "Commodities", "Macro Economics", "Quantitative Research"],
    topDatasets: [
      { name: "Commodity Futures Data", subscribers: 1123, rating: 4.7, category: "Commodities" },
      { name: "Macro Economic Indicators", subscribers: 987, rating: 4.6, category: "Economics" },
      { name: "Cryptocurrency Market Data", subscribers: 856, rating: 4.8, category: "Crypto" }
    ],
    dataQuality: 94,
    updateFrequency: "Hourly",
    apiUptime: 99.5
  },
  {
    id: 4,
    name: "Alpha Vantage Analytics",
    username: "alphavantage",
    avatar: "/api/placeholder/100/100",
    bio: "Free and premium APIs for real-time and historical financial data, technical indicators, and market intelligence.",
    location: "Boston, MA",
    website: "https://alphavantage.co",
    joinedDate: "2023-05-12",
    datasetsCount: 28,
    subscribersCount: 3840,
    totalRevenue: 125000,
    rating: 4.5,
    reviewsCount: 203,
    verified: true,
    compliance: ["SOC 2"],
    specialties: ["Technical Indicators", "Real-time Data", "Fundamental Data", "Forex"],
    topDatasets: [
      { name: "Stock Time Series Data", subscribers: 1456, rating: 4.6, category: "Equities" },
      { name: "Technical Indicators", subscribers: 892, rating: 4.4, category: "Analytics" },
      { name: "Company Fundamentals", subscribers: 734, rating: 4.5, category: "Fundamentals" }
    ],
    dataQuality: 92,
    updateFrequency: "Real-time",
    apiUptime: 99.2
  },
  {
    id: 5,
    name: "S&P Global Market Intelligence",
    username: "sp-global",
    avatar: "/api/placeholder/100/100",
    bio: "Leading provider of multi-asset class data, research and analytics to institutional investors worldwide.",
    location: "New York, NY",
    website: "https://spglobal.com/marketintelligence",
    joinedDate: "2022-06-30",
    datasetsCount: 67,
    subscribersCount: 7250,
    totalRevenue: 380000,
    rating: 4.7,
    reviewsCount: 445,
    verified: true,
    compliance: ["SOC 2", "ISO 27001", "SEC Registered"],
    specialties: ["Credit Analytics", "Market Research", "Risk Assessment", "Portfolio Analytics"],
    topDatasets: [
      { name: "Credit Risk Models", subscribers: 1789, rating: 4.8, category: "Credit" },
      { name: "Market Research Reports", subscribers: 1543, rating: 4.7, category: "Research" },
      { name: "Portfolio Analytics Suite", subscribers: 1234, rating: 4.9, category: "Analytics" }
    ],
    dataQuality: 97,
    updateFrequency: "Daily",
    apiUptime: 99.8
  },
  {
    id: 6,
    name: "IEX Cloud Data Services",
    username: "iex-cloud",
    avatar: "/api/placeholder/100/100",
    bio: "Financial data infrastructure providing reliable, scalable market data APIs for developers and institutions.",
    location: "New York, NY",
    website: "https://iexcloud.io",
    joinedDate: "2023-01-18",
    datasetsCount: 34,
    subscribersCount: 5680,
    totalRevenue: 210000,
    rating: 4.6,
    reviewsCount: 312,
    verified: true,
    compliance: ["SOC 2", "GDPR"],
    specialties: ["Market Data APIs", "Developer Tools", "Real-time Feeds", "Historical Data"],
    topDatasets: [
      { name: "US Equity Market Data", subscribers: 1876, rating: 4.7, category: "Equities" },
      { name: "Options Chain Data", subscribers: 923, rating: 4.5, category: "Options" },
      { name: "Corporate Actions", subscribers: 687, rating: 4.6, category: "Corporate" }
    ],
    dataQuality: 95,
    updateFrequency: "Real-time",
    apiUptime: 99.6
  }
];

export default function DataProviders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  // Get all unique specialties
  const allSpecialties = Array.from(
    new Set(mockDataProviders.flatMap(provider => provider.specialties))
  ).sort();

  // Filter and sort providers
  const filteredProviders = mockDataProviders
    .filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           provider.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           provider.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecialty = selectedSpecialty === "all" || 
                              provider.specialties.includes(selectedSpecialty);
      
      const matchesFilter = filterBy === "all" || 
                           (filterBy === "verified" && provider.verified) ||
                           (filterBy === "high-rated" && provider.rating >= 4.5) ||
                           (filterBy === "high-quality" && provider.dataQuality >= 95) ||
                           (filterBy === "real-time" && provider.updateFrequency === "Real-time");
      
      return matchesSearch && matchesSpecialty && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "subscribers":
          return b.subscribersCount - a.subscribersCount;
        case "datasets":
          return b.datasetsCount - a.datasetsCount;
        case "revenue":
          return b.totalRevenue - a.totalRevenue;
        case "quality":
          return b.dataQuality - a.dataQuality;
        default:
          return 0;
      }
    });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Data Providers</h1>
              <p className="text-muted-foreground">
                Discover professional data providers and their datasets for your AI models
              </p>
            </div>
            <Button asChild>
              <Link href="/data-provider">Become a Data Provider</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <p className="text-2xl font-bold">6</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Data Providers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Verified Providers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Database className="h-5 w-5 text-purple-500" />
                    <p className="text-2xl font-bold">264</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Datasets</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                    <p className="text-2xl font-bold">$1.67M</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Revenue Generated</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search data providers by name, specialty, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {allSpecialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="high-rated">High Rated</SelectItem>
                    <SelectItem value="high-quality">High Quality</SelectItem>
                    <SelectItem value="real-time">Real-time Data</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="subscribers">Subscribers</SelectItem>
                    <SelectItem value="datasets">Datasets</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="quality">Data Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={provider.avatar} />
                      <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        {provider.verified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{provider.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={provider.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{provider.bio}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <p className="text-lg font-bold">{provider.rating}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">({provider.reviewsCount})</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{provider.subscribersCount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Subscribers</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{provider.datasetsCount}</p>
                      <p className="text-xs text-muted-foreground">Datasets</p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Data Quality:</span>
                      <span className="font-medium text-green-600">{provider.dataQuality}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">API Uptime:</span>
                      <span className="font-medium text-blue-600">{provider.apiUptime}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Update Frequency:</span>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {provider.updateFrequency}
                      </Badge>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <p className="text-sm font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Compliance */}
                  <div>
                    <p className="text-sm font-medium mb-2">Compliance:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.compliance.map((cert, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Top Datasets */}
                  <div>
                    <p className="text-sm font-medium mb-2">Top Datasets:</p>
                    <div className="space-y-1">
                      {provider.topDatasets.slice(0, 2).map((dataset, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{dataset.name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{dataset.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/data-provider/${provider.id}`}>View Profile</Link>
                    </Button>
                    <Button className="flex-1">
                      Explore Datasets
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProviders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data providers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find data providers.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}