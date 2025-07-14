import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import {
  Plus,
  Upload,
  BarChart3,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Users,
  Download,
  Settings,
  Brain,
  Code,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  FileText,
  Globe,
  Search,
  Filter
} from "lucide-react";

export default function DeveloperMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for developer's models
  const developerModels = [
    {
      id: "MOD-2024-001",
      name: "Advanced Portfolio Optimizer",
      description: "Machine learning model for optimizing portfolio allocation using modern portfolio theory and risk-adjusted returns.",
      category: "Portfolio Management",
      subcategory: "Portfolio Optimization",
      status: "deployed",
      version: "2.1.0",
      subscribers: 342,
      monthlyRevenue: 15750.00,
      accuracy: 94.2,
      createdAt: "2024-03-15",
      lastUpdated: "2025-01-10",
      deploymentStatus: "live",
      apiCalls: 28450,
      uptime: 99.8,
      riskLevel: "low",
      pricingModel: "subscription",
      monthlyPrice: 49.99,
      tags: ["AI", "Portfolio", "Optimization", "Risk Management"]
    },
    {
      id: "MOD-2024-002",
      name: "Real-time Risk Analyzer",
      description: "Deep learning model for real-time risk assessment across multiple asset classes with early warning systems.",
      category: "Risk Assessment",
      subcategory: "Risk Prediction",
      status: "testing",
      version: "1.3.0",
      subscribers: 0,
      monthlyRevenue: 0,
      accuracy: 89.7,
      createdAt: "2024-11-20",
      lastUpdated: "2025-01-12",
      deploymentStatus: "testing",
      apiCalls: 1250,
      uptime: 97.5,
      riskLevel: "medium",
      pricingModel: "usage",
      monthlyPrice: 0.05,
      tags: ["Risk", "Real-time", "Deep Learning", "Alerts"]
    },
    {
      id: "MOD-2024-003",
      name: "Sentiment Trading Bot",
      description: "NLP-powered trading algorithm that analyzes market sentiment from news and social media for automated trading decisions.",
      category: "Trading Strategies",
      subcategory: "Sentiment Analysis",
      status: "under-review",
      version: "1.0.0",
      subscribers: 0,
      monthlyRevenue: 0,
      accuracy: 87.3,
      createdAt: "2025-01-05",
      lastUpdated: "2025-01-14",
      deploymentStatus: "pending",
      apiCalls: 0,
      uptime: 0,
      riskLevel: "high",
      pricingModel: "subscription",
      monthlyPrice: 99.99,
      tags: ["NLP", "Sentiment", "Trading", "Automation"]
    },
    {
      id: "MOD-2023-015",
      name: "Credit Risk Predictor",
      description: "Neural network model for predicting credit default risk with explainable AI features for regulatory compliance.",
      category: "Credit Scoring",
      subcategory: "Default Prediction",
      status: "deprecated",
      version: "1.2.1",
      subscribers: 89,
      monthlyRevenue: 3200.00,
      accuracy: 91.8,
      createdAt: "2023-08-10",
      lastUpdated: "2024-12-01",
      deploymentStatus: "maintenance",
      apiCalls: 8900,
      uptime: 95.2,
      riskLevel: "medium",
      pricingModel: "subscription",
      monthlyPrice: 35.99,
      tags: ["Credit", "Neural Network", "Explainable AI", "Compliance"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "testing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "under-review":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "deprecated":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "testing":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "under-review":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "deprecated":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "draft":
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredModels = developerModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || model.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || model.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(developerModels.map(m => m.category))];

  const totalRevenue = developerModels.reduce((sum, model) => sum + model.monthlyRevenue, 0);
  const totalSubscribers = developerModels.reduce((sum, model) => sum + model.subscribers, 0);
  const deployedModels = developerModels.filter(m => m.status === "deployed").length;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My AI Models</h1>
              <p className="text-muted-foreground">
                Manage, monitor, and monetize your AI financial models
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Analytics
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Submit New Model
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Submit New AI Model</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="model-name">Model Name</Label>
                        <Input id="model-name" placeholder="Enter model name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                            <SelectItem value="portfolio-management">Portfolio Management</SelectItem>
                            <SelectItem value="trading-strategies">Trading Strategies</SelectItem>
                            <SelectItem value="fraud-detection">Fraud Detection</SelectItem>
                            <SelectItem value="credit-scoring">Credit Scoring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your AI model..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pricing">Pricing Model</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pricing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="subscription">Monthly Subscription</SelectItem>
                            <SelectItem value="usage">Pay per Use</SelectItem>
                            <SelectItem value="free">Free Tier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" type="number" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model-file">Model File</Label>
                      <Input id="model-file" type="file" accept=".pkl,.joblib,.h5,.pb" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => setIsCreateModalOpen(false)}>
                      Submit for Review
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Save as Draft
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{developerModels.length}</div>
              <p className="text-xs text-muted-foreground">{deployedModels} deployed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+24 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.2%</div>
              <p className="text-xs text-muted-foreground">Model accuracy</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="my-models" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-models">My Models</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Tracking</TabsTrigger>
            <TabsTrigger value="marketplace-insights">Market Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="my-models" className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search your AI models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredModels.map((model) => (
                <Card key={model.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{model.name}</h3>
                          <Badge className={getStatusColor(model.status)}>
                            {getStatusIcon(model.status)}
                            <span className="ml-1 capitalize">{model.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {model.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {model.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subscribers</span>
                          <span className="font-medium">{model.subscribers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Monthly Revenue</span>
                          <span className="font-medium">${model.monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Accuracy</span>
                          <span className="font-medium">{model.accuracy}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Version</span>
                          <span className="font-medium">v{model.version}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">API Calls</span>
                          <span className="font-medium">{model.apiCalls.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Uptime</span>
                          <span className="font-medium">{model.uptime}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Updated {model.lastUpdated}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm">
                          <Code className="h-4 w-4 mr-1" />
                          API Docs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredModels.length === 0 && (
              <Card className="p-12 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No models found</h3>
                <p className="text-muted-foreground mb-4">
                  No models match your current search criteria
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Detailed analytics and performance metrics for your AI models
              </p>
              <Button variant="outline">
                View Detailed Analytics
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card className="p-12 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Revenue Tracking</h3>
              <p className="text-muted-foreground mb-4">
                Monitor earnings, subscription trends, and revenue optimization opportunities
              </p>
              <Button variant="outline">
                View Revenue Dashboard
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace-insights" className="space-y-6">
            <Card className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Market Insights</h3>
              <p className="text-muted-foreground mb-4">
                Discover market trends, competitor analysis, and optimization recommendations
              </p>
              <Button variant="outline">
                Explore Market Data
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}