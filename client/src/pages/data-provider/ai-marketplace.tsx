import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import {
  Store,
  Brain,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  BarChart3,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Target,
  Activity,
  Database
} from "lucide-react";

export default function DataProviderAIMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("browse");

  // Sample AI models data from Data Provider perspective
  const aiModels = [
    {
      id: 1,
      name: "Portfolio Risk Analyzer",
      description: "Advanced AI model for real-time portfolio risk assessment using machine learning algorithms trained on historical market data.",
      category: "Risk Management",
      developer: "QuantAI Labs",
      dataCompatibility: ["Market Data", "Economic Indicators"],
      requiredDatasets: 3,
      pricing: "$299/month",
      subscribers: 245,
      revenue: "$73,055",
      rating: 4.8,
      accuracy: "94.2%",
      lastUpdated: "2024-01-15",
      status: "Active",
      dataProviderRevenue: "$14,611",
      integrationLevel: "Full Integration"
    },
    {
      id: 2,
      name: "Crypto Sentiment Predictor",
      description: "Deep learning model that analyzes social media sentiment and news to predict cryptocurrency price movements.",
      category: "Market Prediction",
      developer: "CryptoInsight AI",
      dataCompatibility: ["Social Media Data", "News Data", "Cryptocurrency"],
      requiredDatasets: 5,
      pricing: "$450/month",
      subscribers: 189,
      revenue: "$85,050",
      rating: 4.6,
      accuracy: "87.8%",
      lastUpdated: "2024-01-12",
      status: "Active",
      dataProviderRevenue: "$25,515",
      integrationLevel: "Partial Integration"
    },
    {
      id: 3,
      name: "ESG Compliance Checker",
      description: "AI-powered tool for automated ESG compliance monitoring and scoring for corporate sustainability reporting.",
      category: "Compliance",
      developer: "GreenFinance Tech",
      dataCompatibility: ["ESG Data", "Corporate Data"],
      requiredDatasets: 2,
      pricing: "$199/month",
      subscribers: 156,
      revenue: "$31,044",
      rating: 4.4,
      accuracy: "91.5%",
      lastUpdated: "2024-01-10",
      status: "Integration Pending",
      dataProviderRevenue: "$9,313",
      integrationLevel: "No Integration"
    },
    {
      id: 4,
      name: "Algorithmic Trading Bot",
      description: "High-frequency trading algorithm that uses technical analysis and market microstructure data for automated trading.",
      category: "Trading",
      developer: "AlgoTrade Pro",
      dataCompatibility: ["Market Data", "Order Book Data"],
      requiredDatasets: 4,
      pricing: "$899/month",
      subscribers: 78,
      revenue: "$70,122",
      rating: 4.9,
      accuracy: "96.1%",
      lastUpdated: "2024-01-14",
      status: "Active",
      dataProviderRevenue: "$28,049",
      integrationLevel: "Full Integration"
    }
  ];

  const datasetCompatibility = [
    {
      id: 1,
      name: "S&P 500 Historical Data",
      compatibleModels: 15,
      revenue: "$45,230",
      integrations: 8,
      demandLevel: "High",
      category: "Market Data"
    },
    {
      id: 2,
      name: "Crypto Order Book Data",
      compatibleModels: 12,
      revenue: "$67,450",
      integrations: 12,
      demandLevel: "Very High",
      category: "Cryptocurrency"
    },
    {
      id: 3,
      name: "ESG Corporate Ratings",
      compatibleModels: 8,
      revenue: "$23,890",
      integrations: 5,
      demandLevel: "Medium",
      category: "ESG Data"
    },
    {
      id: 4,
      name: "Economic Indicators",
      compatibleModels: 20,
      revenue: "$34,560",
      integrations: 15,
      demandLevel: "High",
      category: "Economic Data"
    }
  ];

  const filteredModels = aiModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "integration pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getIntegrationColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "full integration": return "bg-green-100 text-green-800";
      case "partial integration": return "bg-yellow-100 text-yellow-800";
      case "no integration": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDemandColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "very high": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Marketplace</h1>
          <p className="text-muted-foreground">
            Browse, integrate, and monetize AI financial models with your datasets
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compatible Models</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">$77,488</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Integrations</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Revenue/Model</p>
                  <p className="text-2xl font-bold">$1,649</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="browse">Browse Models</TabsTrigger>
            <TabsTrigger value="integrations">My Integrations</TabsTrigger>
            <TabsTrigger value="compatibility">Data Compatibility</TabsTrigger>
            <TabsTrigger value="monetization">Monetization</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search AI models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Risk Management">Risk Management</SelectItem>
                  <SelectItem value="Market Prediction">Market Prediction</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Trading">Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* AI Models Grid */}
            <div className="space-y-6">
              {filteredModels.map((model) => (
                <Card key={model.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{model.name}</h3>
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                          <Badge className={getIntegrationColor(model.integrationLevel)}>
                            {model.integrationLevel}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{model.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Developer: {model.developer}</span>
                          <span>•</span>
                          <span>Category: {model.category}</span>
                          <span>•</span>
                          <span>Updated: {model.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Subscribers</p>
                        <p className="text-lg font-semibold">{model.subscribers}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Your Revenue</p>
                        <p className="text-lg font-semibold text-green-600">{model.dataProviderRevenue}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-lg font-semibold">{model.rating}</span>
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-lg font-semibold text-blue-600">{model.accuracy}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">Data Requirements:</span>
                      {model.dataCompatibility.map((data, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {data}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Requires {model.requiredDatasets} datasets
                        </span>
                        <span className="text-sm font-semibold">{model.pricing}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Zap className="h-4 w-4 mr-1" />
                          Integrate Data
                        </Button>
                        <Button size="sm">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Enable Monetization
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiModels.filter(model => model.integrationLevel !== "No Integration").map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Brain className="h-8 w-8 text-purple-500" />
                        <div>
                          <h3 className="font-semibold">{model.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {model.subscribers} subscribers • {model.dataProviderRevenue} revenue
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getIntegrationColor(model.integrationLevel)}>
                          {model.integrationLevel}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Compatibility Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {datasetCompatibility.map((dataset) => (
                    <div key={dataset.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Database className="h-6 w-6 text-blue-500" />
                          <div>
                            <h3 className="font-semibold">{dataset.name}</h3>
                            <p className="text-sm text-muted-foreground">{dataset.category}</p>
                          </div>
                        </div>
                        <Badge className={getDemandColor(dataset.demandLevel)}>
                          {dataset.demandLevel} Demand
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Compatible Models</p>
                          <p className="font-semibold">{dataset.compatibleModels}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Active Integrations</p>
                          <p className="font-semibold">{dataset.integrations}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue Generated</p>
                          <p className="font-semibold text-green-600">{dataset.revenue}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monetization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monetization Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">High-Demand Data</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your crypto and market data has high demand from AI models
                    </p>
                    <Button size="sm">Explore Opportunities</Button>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">New Model Integration</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      3 new AI models are seeking ESG data integration
                    </p>
                    <Button size="sm">View Requests</Button>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold">Revenue Optimization</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Potential 25% revenue increase with premium data tiers
                    </p>
                    <Button size="sm">Optimize Pricing</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Revenue breakdown by AI model</p>
                      <p className="text-sm text-muted-foreground">Total: $77,488 this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}