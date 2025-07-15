import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import {
  Brain,
  Search,
  Filter,
  Eye,
  Edit3,
  Archive,
  Calendar,
  Tag,
  TrendingUp,
  Shield,
  BarChart3,
  Zap
} from "lucide-react";

export default function DeveloperAIModels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Sample AI models data
  const aiModels = [
    {
      id: 1,
      name: "High-Frequency Trading Algorithm",
      description: "Advanced ML model for real-time stock price prediction and automated trading decisions",
      category: "Trading Strategies",
      status: "active",
      launchDate: "2025-06-15",
      accuracy: 94.2,
      users: 342,
      version: "v2.1.3",
      tags: ["Machine Learning", "Real-time", "Automated Trading"],
      revenue: "$125,000"
    },
    {
      id: 2,
      name: "Portfolio Risk Assessment",
      description: "Comprehensive risk analysis model using Monte Carlo simulations and VaR calculations",
      category: "Risk Management",
      status: "active",
      launchDate: "2025-05-20",
      accuracy: 89.7,
      users: 156,
      version: "v1.8.2",
      tags: ["Risk Analysis", "Portfolio Management", "VaR"],
      revenue: "$78,500"
    },
    {
      id: 3,
      name: "ESG Investment Screener",
      description: "AI-powered ESG scoring model for sustainable investment portfolio construction",
      category: "ESG & Sustainability",
      status: "under_review",
      launchDate: "2025-07-01",
      accuracy: 91.3,
      users: 89,
      version: "v1.2.0",
      tags: ["ESG", "Sustainability", "Investment Screening"],
      revenue: "$42,000"
    },
    {
      id: 4,
      name: "Credit Default Predictor",
      description: "Machine learning model for predicting corporate credit defaults using financial ratios",
      category: "Credit Analysis",
      status: "archived",
      launchDate: "2025-03-10",
      accuracy: 87.5,
      users: 67,
      version: "v1.0.5",
      tags: ["Credit Risk", "Default Prediction", "Corporate Finance"],
      revenue: "$28,750"
    },
    {
      id: 5,
      name: "Market Sentiment Analyzer",
      description: "NLP-based sentiment analysis of news and social media for market trend prediction",
      category: "Market Analysis",
      status: "active",
      launchDate: "2025-04-22",
      accuracy: 88.9,
      users: 298,
      version: "v2.0.1",
      tags: ["NLP", "Sentiment Analysis", "Market Trends"],
      revenue: "$95,200"
    }
  ];

  const categories = [
    "Trading Strategies",
    "Risk Management",
    "ESG & Sustainability",
    "Credit Analysis",
    "Market Analysis",
    "Portfolio Optimization"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Zap className="h-3 w-3" />;
      case "under_review":
        return <Eye className="h-3 w-3" />;
      case "archived":
        return <Archive className="h-3 w-3" />;
      default:
        return <Eye className="h-3 w-3" />;
    }
  };

  const filteredModels = aiModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || model.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Models</h1>
            <p className="text-muted-foreground">
              Manage your published AI financial models and track their performance
            </p>
          </div>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Deploy New Model
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{model.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {model.description}
                    </CardDescription>
                  </div>
                  <Badge className={`ml-2 ${getStatusColor(model.status)}`}>
                    {getStatusIcon(model.status)}
                    <span className="ml-1 capitalize">{model.status.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Model Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Launched: {new Date(model.launchDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>Accuracy: {model.accuracy}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span>{model.users} Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>{model.version}</span>
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2">
                      {model.category}
                    </Badge>
                    <div className="flex flex-wrap gap-1">
                      {model.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Revenue: {model.revenue}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No models found</CardTitle>
              <CardDescription className="mb-4">
                Try adjusting your search criteria or deploy your first AI model
              </CardDescription>
              <Button>
                <Brain className="h-4 w-4 mr-2" />
                Deploy New Model
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}