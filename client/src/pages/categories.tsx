import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Grid, List, TrendingUp, Users, Star, DollarSign, Clock, Brain, Target, Shield, BarChart3, TrendingDown, Zap, Bot, Calculator, Eye, AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";

interface AIModelCategory {
  id: number;
  name: string;
  description: string;
  modelCount: number;
  popularModels: string[];
  averageRating: number;
  averagePrice: number;
  icon: string;
  subcategories: string[];
  trending: boolean;
  featured: boolean;
}

interface CategoryStats {
  totalCategories: number;
  totalModels: number;
  averageRating: number;
  topPerformingCategory: string;
  newestCategory: string;
  mostPopularCategory: string;
}

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/ai-model-categories"],
  });

  // Sample category stats (in real app, this would come from API)
  const categoryStats: CategoryStats = {
    totalCategories: categories.length,
    totalModels: categories.reduce((sum: number, cat: any) => sum + (cat.modelCount || 0), 0),
    averageRating: 4.2,
    topPerformingCategory: "Risk Assessment",
    newestCategory: "ESG Analytics",
    mostPopularCategory: "Portfolio Optimization"
  };

  // Enhanced categories with additional data for demonstration
  const enhancedCategories: AIModelCategory[] = categories.map((cat: any, index: number) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description || `Advanced AI models for ${cat.name.toLowerCase()} applications`,
    modelCount: Math.floor(Math.random() * 50) + 10,
    popularModels: ["Model A", "Model B", "Model C"],
    averageRating: 3.5 + Math.random() * 1.5,
    averagePrice: Math.floor(Math.random() * 200) + 50,
    icon: getCategoryIcon(cat.name),
    subcategories: getSubcategories(cat.name),
    trending: index % 4 === 0,
    featured: index % 3 === 0
  }));

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let filtered = enhancedCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterBy !== "all") {
      filtered = filtered.filter(category => {
        switch (filterBy) {
          case "trending":
            return category.trending;
          case "featured":
            return category.featured;
          case "high-rated":
            return category.averageRating >= 4.0;
          case "new":
            return category.modelCount < 20;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "models":
          return b.modelCount - a.modelCount;
        case "rating":
          return b.averageRating - a.averageRating;
        case "price":
          return a.averagePrice - b.averagePrice;
        default:
          return 0;
      }
    });
  }, [enhancedCategories, searchTerm, filterBy, sortBy]);

  function getCategoryIcon(categoryName: string) {
    const iconMap: Record<string, string> = {
      "Risk Assessment": "Shield",
      "Portfolio Optimization": "Target",
      "Market Prediction": "TrendingUp",
      "Algorithmic Trading": "Bot",
      "Credit Analysis": "Calculator",
      "Fraud Detection": "Eye",
      "ESG Analytics": "Brain",
      "Quantitative Analysis": "BarChart3",
      "Compliance Monitoring": "AlertTriangle",
      "Robo Advisory": "Zap"
    };
    return iconMap[categoryName] || "Brain";
  }

  function getSubcategories(categoryName: string) {
    const subcategoryMap: Record<string, string[]> = {
      "Risk Assessment": ["Credit Risk", "Market Risk", "Operational Risk", "Liquidity Risk"],
      "Portfolio Optimization": ["Asset Allocation", "Risk Parity", "Factor Investing", "ESG Integration"],
      "Market Prediction": ["Price Forecasting", "Volatility Modeling", "Sentiment Analysis", "Technical Analysis"],
      "Algorithmic Trading": ["High Frequency", "Momentum", "Mean Reversion", "Arbitrage"],
      "Credit Analysis": ["Consumer Credit", "Corporate Credit", "Mortgage", "Default Prediction"],
      "Fraud Detection": ["Transaction Monitoring", "Identity Verification", "Anomaly Detection", "Pattern Recognition"],
      "ESG Analytics": ["Environmental Impact", "Social Metrics", "Governance Scoring", "Sustainability"],
      "Quantitative Analysis": ["Statistical Modeling", "Machine Learning", "Time Series", "Backtesting"],
      "Compliance Monitoring": ["Regulatory Reporting", "AML Detection", "KYC Verification", "Trade Surveillance"],
      "Robo Advisory": ["Goal Planning", "Tax Optimization", "Rebalancing", "Risk Profiling"]
    };
    return subcategoryMap[categoryName] || ["General", "Advanced", "Custom"];
  }

  function getIconComponent(iconName: string) {
    const icons: Record<string, any> = {
      Shield, Target, TrendingUp, Bot, Calculator, Eye, Brain, BarChart3, AlertTriangle, Zap
    };
    const IconComponent = icons[iconName] || Brain;
    return <IconComponent className="h-6 w-6" />;
  }

  if (isLoading) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Model Categories</h1>
          <p className="text-muted-foreground">
            Explore our comprehensive collection of AI financial models organized by category
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
                  <p className="text-2xl font-bold">{categoryStats.totalCategories}</p>
                </div>
                <Grid className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Models</p>
                  <p className="text-2xl font-bold">{categoryStats.totalModels}</p>
                </div>
                <Bot className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{categoryStats.averageRating}/5</p>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                  <p className="text-lg font-bold">{categoryStats.topPerformingCategory}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="high-rated">High Rated</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="models">Model Count</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
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

        {/* Categories Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getIconComponent(category.icon)}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {category.name}
                        {category.trending && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {category.featured && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Featured
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{category.modelCount}</p>
                      <p className="text-sm text-muted-foreground">Models</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <p className="text-2xl font-bold">{category.averageRating.toFixed(1)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div>
                    <p className="text-sm font-medium mb-2">Subcategories:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <Badge key={sub} variant="outline" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                      {category.subcategories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.subcategories.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Starting from:</span>
                    <span className="font-semibold">${category.averagePrice}/month</span>
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full">
                    <Link href={`/marketplace?category=${category.name}`}>
                      Browse Models
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}