import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { 
  Bot, 
  Star, 
  TrendingUp, 
  DollarSign, 
  Search,
  Filter,
  Plus,
  Eye,
  BarChart3
} from "lucide-react";

export default function AIModels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("performance");

  const { data: aiModels = [], isLoading } = useQuery({
    queryKey: ["/api/ai-models"]
  });

  const { data: userModels = [], isLoading: userModelsLoading } = useQuery({
    queryKey: ["/api/portfolio/ai-models"]
  });

  const filteredModels = aiModels.filter((model: any) => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || model.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedModels = [...filteredModels].sort((a: any, b: any) => {
    switch (sortBy) {
      case "performance":
        return (b.performance || 0) - (a.performance || 0);
      case "price":
        return (a.pricing?.monthly || 0) - (b.pricing?.monthly || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "subscribers":
        return (b.subscribers || 0) - (a.subscribers || 0);
      default:
        return 0;
    }
  });

  const isUserSubscribed = (modelId: number) => {
    return userModels.some((userModel: any) => userModel.aiModelId === modelId);
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600 bg-green-100";
    if (performance >= 75) return "text-blue-600 bg-blue-100";
    if (performance >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (isLoading || userModelsLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                AI Models Portfolio
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your subscribed AI models and discover new ones
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Browse Models
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Models</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userModels.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.2%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,247</div>
                <p className="text-xs text-muted-foreground">
                  +$180 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+24.7%</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search AI models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                <SelectItem value="portfolio-optimization">Portfolio Optimization</SelectItem>
                <SelectItem value="market-prediction">Market Prediction</SelectItem>
                <SelectItem value="trading-signals">Trading Signals</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="subscribers">Subscribers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedModels.map((model: any) => (
              <Card key={model.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {model.name}
                        {isUserSubscribed(model.id) && (
                          <Badge variant="default" className="text-xs">
                            Subscribed
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {model.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline">{model.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">
                        {model.rating || 4.5}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Performance</span>
                      <Badge className={getPerformanceColor(model.performance || 85)}>
                        {model.performance || 85}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Cost</span>
                      <span className="font-semibold">
                        ${model.pricing?.monthly || 149}/mo
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Subscribers</span>
                      <span className="text-sm">{model.subscribers || 1247}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {!isUserSubscribed(model.id) ? (
                        <Button size="sm" className="flex-1">
                          Subscribe
                        </Button>
                      ) : (
                        <Button variant="secondary" size="sm" className="flex-1">
                          Manage
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedModels.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No AI models found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all available models.
                </p>
                <Button>Browse All Models</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}