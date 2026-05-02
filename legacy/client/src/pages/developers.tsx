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
  Bot,
  TrendingUp,
  Award,
  Code,
  Heart,
  ExternalLink,
  Filter,
  SortAsc,
  Building
} from "lucide-react";

// Sample developer data
const mockDevelopers = [
  {
    id: 1,
    name: "AI Solutions Inc.",
    username: "ai-solutions",
    avatar: "/api/placeholder/100/100",
    bio: "Leading AI research company specializing in financial risk management and portfolio optimization.",
    location: "San Francisco, CA",
    website: "https://aisolutions.com",
    joinedDate: "2023-01-15",
    modelsCount: 12,
    subscribersCount: 2840,
    totalRevenue: 125000,
    rating: 4.9,
    reviewsCount: 234,
    verified: true,
    specialties: ["Risk Management", "Portfolio Optimization", "Machine Learning"],
    topModels: [
      { name: "Quantum Risk Predictor", subscribers: 856, rating: 4.8 },
      { name: "Smart Allocation Engine", subscribers: 643, rating: 4.7 },
      { name: "Market Volatility Analyzer", subscribers: 521, rating: 4.9 }
    ]
  },
  {
    id: 2,
    name: "FinTech Innovations",
    username: "fintech-innov",
    avatar: "/api/placeholder/100/100",
    bio: "Innovative fintech startup creating next-generation trading algorithms and market analysis tools.",
    location: "New York, NY",
    website: "https://fintechinnovations.io",
    joinedDate: "2023-03-22",
    modelsCount: 8,
    subscribersCount: 1920,
    totalRevenue: 89000,
    rating: 4.7,
    reviewsCount: 156,
    verified: true,
    specialties: ["Trading Algorithms", "Market Analysis", "Quantitative Finance"],
    topModels: [
      { name: "Smart Portfolio Optimizer", subscribers: 612, rating: 4.8 },
      { name: "Trend Prediction Engine", subscribers: 487, rating: 4.6 },
      { name: "Risk Scoring Model", subscribers: 398, rating: 4.7 }
    ]
  },
  {
    id: 3,
    name: "Market Analytics Pro",
    username: "market-analytics",
    avatar: "/api/placeholder/100/100",
    bio: "Professional market research firm with 15+ years of experience in financial data analysis.",
    location: "London, UK",
    website: "https://marketanalytics.pro",
    joinedDate: "2022-11-08",
    modelsCount: 15,
    subscribersCount: 3150,
    totalRevenue: 198000,
    rating: 4.8,
    reviewsCount: 298,
    verified: true,
    specialties: ["Market Research", "Sentiment Analysis", "Economic Forecasting"],
    topModels: [
      { name: "AI Trend Analyzer", subscribers: 789, rating: 4.9 },
      { name: "Sentiment Predictor", subscribers: 654, rating: 4.7 },
      { name: "Economic Indicator Model", subscribers: 543, rating: 4.8 }
    ]
  },
  {
    id: 4,
    name: "SecureInvest Tech",
    username: "secureinvest",
    avatar: "/api/placeholder/100/100",
    bio: "Cybersecurity and risk assessment specialists for the financial industry.",
    location: "Toronto, Canada",
    website: "https://secureinvest.tech",
    joinedDate: "2023-05-10",
    modelsCount: 6,
    subscribersCount: 1456,
    totalRevenue: 72000,
    rating: 4.6,
    reviewsCount: 123,
    verified: false,
    specialties: ["Security Analysis", "Risk Assessment", "Compliance"],
    topModels: [
      { name: "Risk Assessment Pro", subscribers: 432, rating: 4.8 },
      { name: "Security Score Model", subscribers: 321, rating: 4.5 },
      { name: "Compliance Checker", subscribers: 287, rating: 4.7 }
    ]
  },
  {
    id: 5,
    name: "DataDriven Solutions",
    username: "datadriven",
    avatar: "/api/placeholder/100/100",
    bio: "Data science consultancy focused on building predictive models for investment management.",
    location: "Austin, TX",
    website: "https://datadriven.solutions",
    joinedDate: "2023-02-28",
    modelsCount: 10,
    subscribersCount: 2100,
    totalRevenue: 105000,
    rating: 4.5,
    reviewsCount: 187,
    verified: true,
    specialties: ["Data Science", "Predictive Analytics", "Investment Management"],
    topModels: [
      { name: "Predictive Returns Model", subscribers: 567, rating: 4.6 },
      { name: "Asset Correlation Finder", subscribers: 445, rating: 4.4 },
      { name: "Performance Predictor", subscribers: 389, rating: 4.7 }
    ]
  },
  {
    id: 6,
    name: "AlgoTrade Systems",
    username: "algotrade",
    avatar: "/api/placeholder/100/100",
    bio: "Algorithmic trading specialists with expertise in high-frequency trading and market making.",
    location: "Chicago, IL",
    website: "https://algotrade.systems",
    joinedDate: "2022-12-15",
    modelsCount: 9,
    subscribersCount: 1780,
    totalRevenue: 94000,
    rating: 4.4,
    reviewsCount: 145,
    verified: true,
    specialties: ["Algorithmic Trading", "High-Frequency Trading", "Market Making"],
    topModels: [
      { name: "HFT Strategy Engine", subscribers: 456, rating: 4.5 },
      { name: "Market Making Model", subscribers: 378, rating: 4.3 },
      { name: "Arbitrage Detector", subscribers: 334, rating: 4.6 }
    ]
  }
];

export default function Developers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // This would normally fetch from the API
  const { data: developers = mockDevelopers, isLoading } = useQuery({
    queryKey: ["/api/developers"],
    queryFn: () => mockDevelopers // Replace with actual API call
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const filteredAndSortedDevelopers = developers
    .filter(dev => {
      const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dev.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dev.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterBy === "all" || 
                           (filterBy === "verified" && dev.verified) ||
                           (filterBy === "new" && new Date(dev.joinedDate) > new Date('2023-01-01'));
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "models":
          return b.modelsCount - a.modelsCount;
        case "subscribers":
          return b.subscribersCount - a.subscribersCount;
        case "revenue":
          return b.totalRevenue - a.totalRevenue;
        case "joined":
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        default:
          return 0;
      }
    });

  const stats = {
    totalDevelopers: developers.length,
    verifiedDevelopers: developers.filter(d => d.verified).length,
    totalModels: developers.reduce((sum, d) => sum + d.modelsCount, 0),
    totalRevenue: developers.reduce((sum, d) => sum + d.totalRevenue, 0)
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Developers</h1>
            <p className="text-muted-foreground">Discover talented AI model developers and their work</p>
          </div>
          <Link href="/developer">
            <Button>Become a Developer</Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.totalDevelopers}</div>
                  <div className="text-sm text-muted-foreground">Total Developers</div>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.verifiedDevelopers}</div>
                  <div className="text-sm text-muted-foreground">Verified Developers</div>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.totalModels}</div>
                  <div className="text-sm text-muted-foreground">AI Models Created</div>
                </div>
                <Bot className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="text-sm text-muted-foreground">Total Revenue Generated</div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search developers by name, username, or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="models">Models Count</SelectItem>
                  <SelectItem value="subscribers">Subscribers</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="joined">Recently Joined</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Developers</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="new">New Developers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDevelopers.map((developer) => (
            <Card key={developer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={developer.avatar} />
                      <AvatarFallback>
                        {developer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{developer.name}</h3>
                        {developer.verified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <Award className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{developer.username}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{developer.bio}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{developer.rating}</span>
                    <span className="text-muted-foreground">({developer.reviewsCount})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{developer.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">{developer.modelsCount}</div>
                    <div className="text-xs text-muted-foreground">Models</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{developer.subscribersCount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Subscribers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{formatCurrency(developer.totalRevenue / 1000)}k</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Specialties:</div>
                  <div className="flex flex-wrap gap-1">
                    {developer.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Top Models:</div>
                  <div className="space-y-1">
                    {developer.topModels.slice(0, 2).map((model, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground truncate">{model.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{model.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Joined {formatDate(developer.joinedDate)}
                  </div>
                  <div className="flex space-x-2">
                    {developer.website && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={developer.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/developer/${developer.username}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedDevelopers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No developers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setFilterBy("all");
              setSortBy("rating");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}