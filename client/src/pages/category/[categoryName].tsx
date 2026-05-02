import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Grid, List, TrendingUp, Users, Star, DollarSign, Clock, Brain, Target, Shield, BarChart3, TrendingDown, Zap, Bot, Calculator, Eye, AlertTriangle, ChevronLeft, Heart, Share2, Bookmark } from "lucide-react";
import { Link, useParams } from "wouter";
import Layout from "@/components/layout/Layout";

interface AIModel {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  rating: number;
  reviewCount: number;
  subscribers: number;
  accuracy: number;
  riskLevel: string;
  featured: boolean;
  trending: boolean;
  tags: string[];
  developer: string;
  lastUpdated: string;
  uptime: number;
}

interface CategoryInfo {
  name: string;
  description: string;
  icon: string;
  totalModels: number;
  averageRating: number;
  averagePrice: number;
  subcategories: string[];
}

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  // Convert URL parameter back to category name
  const displayCategoryName = categoryName ? 
    categoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 
    '';

  // Fetch models for this category
  const { data: models = [], isLoading: modelsLoading } = useQuery({
    queryKey: ["/api/ai-models", { category: displayCategoryName }],
  });

  // Get category info
  const categoryInfo: CategoryInfo = useMemo(() => {
    switch(displayCategoryName) {
      case 'Risk Assessment':
        return {
          name: 'Risk Assessment',
          description: 'AI-powered real-time risk assessment and monitoring systems that identify potential portfolio risks and provide actionable insights.',
          icon: 'Shield',
          totalModels: 57,
          averageRating: 4.8,
          averagePrice: 299,
          subcategories: ['Credit Risk', 'Market Risk', 'Operational Risk', 'Liquidity Risk', 'Stress Testing', 'Risk Prediction Models']
        };
      case 'Trading Strategies':
        return {
          name: 'Trading Strategies',
          description: 'Advanced algorithmic trading models and automated execution systems for optimal market performance.',
          icon: 'TrendingUp',
          totalModels: 42,
          averageRating: 4.6,
          averagePrice: 399,
          subcategories: ['Algorithmic Trading', 'High-Frequency Trading', 'Arbitrage Strategies', 'Trend Following', 'Mean Reversion', 'Trading Bots']
        };
      case 'Portfolio Management':
        return {
          name: 'Portfolio Management',
          description: 'AI-driven portfolio optimization and asset allocation models for maximizing returns while managing risk.',
          icon: 'Target',
          totalModels: 35,
          averageRating: 4.7,
          averagePrice: 249,
          subcategories: ['Asset Allocation', 'Risk-Adjusted Returns', 'Rebalancing Strategies', 'ESG Investing', 'Multi-Asset Portfolios', 'Portfolio Optimization']
        };
      case 'Credit Scoring':
        return {
          name: 'Credit Scoring',
          description: 'Advanced credit assessment and loan default prediction models using machine learning algorithms.',
          icon: 'Calculator',
          totalModels: 28,
          averageRating: 4.5,
          averagePrice: 199,
          subcategories: ['Consumer Credit', 'Corporate Credit', 'Mortgage Risk', 'Default Prediction', 'Credit Approval', 'Risk Scoring']
        };
      case 'Fraud Detection':
        return {
          name: 'Fraud Detection',
          description: 'Real-time fraud detection and prevention systems using advanced anomaly detection algorithms.',
          icon: 'Eye',
          totalModels: 31,
          averageRating: 4.6,
          averagePrice: 349,
          subcategories: ['Transaction Fraud', 'Identity Theft', 'Money Laundering Detection', 'Anomaly Detection', 'Synthetic Fraud', 'Pattern Recognition']
        };
      case 'Customer Service':
        return {
          name: 'Customer Service',
          description: 'AI-powered customer interaction and service enhancement models for improved user experience.',
          icon: 'Users',
          totalModels: 22,
          averageRating: 4.3,
          averagePrice: 149,
          subcategories: ['Sentiment Analysis', 'Customer Segmentation', 'Personalized Recommendations', 'Complaint Resolution', 'Chatbot Integration', 'Support Automation']
        };
      default:
        return {
          name: displayCategoryName,
          description: `AI models for ${displayCategoryName.toLowerCase()} applications`,
          icon: 'Brain',
          totalModels: 25,
          averageRating: 4.4,
          averagePrice: 299,
          subcategories: ['General', 'Advanced', 'Custom']
        };
    }
  }, [displayCategoryName]);

  // Sample models data based on category
  const sampleModels: AIModel[] = useMemo(() => {
    const baseModels = [
      {
        id: '1',
        name: 'Real-Time Risk Analyzer',
        description: 'AI-powered real-time risk assessment and monitoring system that identifies potential portfolio risks and provides actionable insights.',
        category: displayCategoryName,
        subcategory: 'Credit Risk',
        price: 399.99,
        rating: 4.9,
        reviewCount: 324,
        subscribers: 800,
        accuracy: 95,
        riskLevel: 'Low',
        featured: true,
        trending: true,
        tags: ['Low Risk', 'Deep Learning'],
        developer: 'QuantRisk Analytics',
        lastUpdated: '2024-12-10',
        uptime: 99.9
      },
      {
        id: '2',
        name: 'Portfolio Optimization Algorithm',
        description: 'Recommends optimal asset allocations based on risk tolerance and market conditions.',
        category: displayCategoryName,
        subcategory: 'Asset Allocation',
        price: 299.99,
        rating: 4.8,
        reviewCount: 167,
        subscribers: 650,
        accuracy: 92,
        riskLevel: 'Medium',
        featured: true,
        trending: false,
        tags: ['Medium Risk', 'Machine Learning'],
        developer: 'AlgoTrade Pro',
        lastUpdated: '2024-12-08',
        uptime: 99.7
      },
      {
        id: '3',
        name: 'Stock Prediction Model',
        description: 'Forecasts stock prices using historical data, market indicators, and sentiment analysis.',
        category: displayCategoryName,
        subcategory: 'Market Risk',
        price: 199.99,
        rating: 4.7,
        reviewCount: 289,
        subscribers: 920,
        accuracy: 88,
        riskLevel: 'Medium',
        featured: true,
        trending: true,
        tags: ['Medium Risk', 'Machine Learning'],
        developer: 'MarketPredict AI',
        lastUpdated: '2024-12-05',
        uptime: 99.5
      }
    ];

    // Generate additional models based on subcategories
    const additionalModels: AIModel[] = [];
    categoryInfo.subcategories.forEach((subcategory, index) => {
      if (index < 3) return; // Skip first 3 as they're already covered above
      
      additionalModels.push({
        id: `${index + 4}`,
        name: `${subcategory} Specialist`,
        description: `Advanced AI model specialized in ${subcategory.toLowerCase()} analysis and prediction.`,
        category: displayCategoryName,
        subcategory,
        price: 150 + Math.floor(Math.random() * 200),
        rating: 4.0 + Math.random() * 0.9,
        reviewCount: 50 + Math.floor(Math.random() * 200),
        subscribers: 200 + Math.floor(Math.random() * 500),
        accuracy: 82 + Math.floor(Math.random() * 15),
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        featured: Math.random() > 0.7,
        trending: Math.random() > 0.8,
        tags: [subcategory, 'AI', 'Analytics'],
        developer: `${subcategory} Innovations`,
        lastUpdated: '2024-12-01',
        uptime: 98 + Math.random() * 2
      });
    });

    return [...baseModels, ...additionalModels];
  }, [displayCategoryName, categoryInfo]);

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let filtered = sampleModels.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubcategory = selectedSubcategory === "all" || model.subcategory === selectedSubcategory;
      
      return matchesSearch && matchesSubcategory;
    });

    if (filterBy !== "all") {
      filtered = filtered.filter(model => {
        switch (filterBy) {
          case "featured":
            return model.featured;
          case "trending":
            return model.trending;
          case "high-rated":
            return model.rating >= 4.5;
          case "low-risk":
            return model.riskLevel === "Low";
          case "affordable":
            return model.price <= 200;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "price":
          return a.price - b.price;
        case "subscribers":
          return b.subscribers - a.subscribers;
        case "accuracy":
          return b.accuracy - a.accuracy;
        default:
          return 0;
      }
    });
  }, [sampleModels, searchTerm, selectedSubcategory, filterBy, sortBy]);

  function getIconComponent(iconName: string) {
    const icons: Record<string, any> = {
      Shield, Target, TrendingUp, Bot, Calculator, Eye, Brain, BarChart3, AlertTriangle, Zap, Users
    };
    const IconComponent = icons[iconName] || Brain;
    return <IconComponent className="h-8 w-8" />;
  }

  function getRiskLevelColor(riskLevel: string) {
    switch(riskLevel) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (modelsLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/categories" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link href="/categories" className="text-muted-foreground hover:text-foreground">
            Categories
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{categoryInfo.name}</span>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              {getIconComponent(categoryInfo.icon)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{categoryInfo.name}</h1>
              <p className="text-muted-foreground mt-1">{categoryInfo.description}</p>
            </div>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{categoryInfo.totalModels}</p>
                  <p className="text-sm text-muted-foreground">Models</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <p className="text-2xl font-bold">{categoryInfo.averageRating}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">${categoryInfo.averagePrice}</p>
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{categoryInfo.subcategories.length}</p>
                  <p className="text-sm text-muted-foreground">Subcategories</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subcategories</SelectItem>
                    {categoryInfo.subcategories.map(subcategory => (
                      <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="high-rated">High Rated</SelectItem>
                    <SelectItem value="low-risk">Low Risk</SelectItem>
                    <SelectItem value="affordable">Affordable</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="subscribers">Subscribers</SelectItem>
                    <SelectItem value="accuracy">Accuracy</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Models Grid */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {model.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      )}
                      {model.trending && (
                        <Badge className="bg-orange-100 text-orange-700">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription className="text-sm">{model.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Model Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <p className="text-lg font-bold">{model.rating}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">({model.reviewCount})</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{model.subscribers}</p>
                      <p className="text-sm text-muted-foreground">Subscribers</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="font-medium text-green-600">{model.accuracy}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <Badge className={getRiskLevelColor(model.riskLevel)}>
                        {model.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="font-medium text-purple-600">{model.uptime}%</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {model.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-lg font-bold">
                      ${model.price}<span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/model/${model.id}`}>Details</Link>
                      </Button>
                      <Button size="sm">Subscribe</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredModels.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No models found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find models in this category.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}