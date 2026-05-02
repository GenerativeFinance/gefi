import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, TrendingUp, Users, Star, DollarSign, Clock, Shield, ChevronLeft, Heart, Share2, Bookmark } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";

interface RiskAssessmentModel {
  id: string;
  name: string;
  description: string;
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
  modelType: string;
  aiTechnique: string;
}

export default function RiskAssessmentModels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  const subcategories = [
    "Credit Risk",
    "Market Risk", 
    "Operational Risk",
    "Liquidity Risk",
    "Stress Testing",
    "Risk Prediction Models",
    "Consumer Credit",
    "Corporate Credit",
    "Value at Risk (VaR)",
    "Cybersecurity",
    "Business Continuity"
  ];

  const sampleModels: RiskAssessmentModel[] = [
    {
      id: '1',
      name: 'Real-Time Risk Analyzer',
      description: 'AI-powered real-time risk assessment and monitoring system that identifies potential portfolio risks and provides actionable insights for professional traders and institutional investors.',
      subcategory: 'Market Risk',
      price: 399.99,
      rating: 4.9,
      reviewCount: 324,
      subscribers: 800,
      accuracy: 95,
      riskLevel: 'Low',
      featured: true,
      trending: true,
      tags: ['Low Risk', 'Deep Learning', 'Real-time'],
      developer: 'QuantRisk Analytics',
      lastUpdated: '2024-12-10',
      uptime: 99.9,
      modelType: 'Deep Learning',
      aiTechnique: 'Neural Networks'
    },
    {
      id: '2',
      name: 'Credit Score Predictor Pro',
      description: 'Advanced credit risk assessment model using machine learning algorithms to predict default probability and credit worthiness with 92% accuracy.',
      subcategory: 'Credit Risk',
      price: 299.99,
      rating: 4.8,
      reviewCount: 267,
      subscribers: 650,
      accuracy: 92,
      riskLevel: 'Medium',
      featured: true,
      trending: false,
      tags: ['Medium Risk', 'Machine Learning', 'Credit Analysis'],
      developer: 'CreditAI Solutions',
      lastUpdated: '2024-12-08',
      uptime: 99.7,
      modelType: 'Machine Learning',
      aiTechnique: 'Random Forest'
    },
    {
      id: '3',
      name: 'Operational Risk Monitor',
      description: 'Comprehensive operational risk monitoring system that tracks internal processes, systems, and human factors to prevent operational failures.',
      subcategory: 'Operational Risk',
      price: 249.99,
      rating: 4.7,
      reviewCount: 189,
      subscribers: 420,
      accuracy: 88,
      riskLevel: 'Low',
      featured: false,
      trending: true,
      tags: ['Low Risk', 'Process Monitoring', 'Compliance'],
      developer: 'OpRisk Technologies',
      lastUpdated: '2024-12-05',
      uptime: 99.5,
      modelType: 'Machine Learning',
      aiTechnique: 'Support Vector Machines'
    },
    {
      id: '4',
      name: 'Liquidity Risk Assessor',
      description: 'Sophisticated liquidity risk assessment tool that analyzes cash flow patterns and funding availability to prevent liquidity crises.',
      subcategory: 'Liquidity Risk',
      price: 199.99,
      rating: 4.6,
      reviewCount: 145,
      subscribers: 320,
      accuracy: 85,
      riskLevel: 'Medium',
      featured: false,
      trending: false,
      tags: ['Medium Risk', 'Cash Flow Analysis', 'Funding Risk'],
      developer: 'LiquidityAI Corp',
      lastUpdated: '2024-12-03',
      uptime: 99.2,
      modelType: 'Time Series Analysis',
      aiTechnique: 'LSTM Networks'
    },
    {
      id: '5',
      name: 'Stress Test Simulator',
      description: 'Advanced stress testing framework that simulates extreme market conditions to evaluate portfolio resilience and risk exposure.',
      subcategory: 'Stress Testing',
      price: 349.99,
      rating: 4.8,
      reviewCount: 278,
      subscribers: 550,
      accuracy: 90,
      riskLevel: 'High',
      featured: true,
      trending: true,
      tags: ['High Risk', 'Stress Testing', 'Scenario Analysis'],
      developer: 'StressTest Analytics',
      lastUpdated: '2024-12-07',
      uptime: 99.8,
      modelType: 'Monte Carlo Simulation',
      aiTechnique: 'Ensemble Methods'
    },
    {
      id: '6',
      name: 'VaR Calculator Advanced',
      description: 'Professional Value at Risk calculation engine with multiple methodologies including historical simulation, parametric, and Monte Carlo approaches.',
      subcategory: 'Value at Risk (VaR)',
      price: 279.99,
      rating: 4.7,
      reviewCount: 203,
      subscribers: 480,
      accuracy: 91,
      riskLevel: 'Medium',
      featured: false,
      trending: false,
      tags: ['Medium Risk', 'VaR Calculation', 'Risk Metrics'],
      developer: 'VaR Solutions Ltd',
      lastUpdated: '2024-12-04',
      uptime: 99.6,
      modelType: 'Statistical Modeling',
      aiTechnique: 'Monte Carlo Methods'
    },
    {
      id: '7',
      name: 'Cybersecurity Risk Analyzer',
      description: 'AI-powered cybersecurity risk assessment platform that evaluates digital threats and vulnerabilities in financial systems.',
      subcategory: 'Cybersecurity',
      price: 399.99,
      rating: 4.9,
      reviewCount: 156,
      subscribers: 380,
      accuracy: 94,
      riskLevel: 'High',
      featured: true,
      trending: true,
      tags: ['High Risk', 'Cybersecurity', 'Threat Detection'],
      developer: 'CyberRisk Systems',
      lastUpdated: '2024-12-09',
      uptime: 99.9,
      modelType: 'Deep Learning',
      aiTechnique: 'Convolutional Neural Networks'
    },
    {
      id: '8',
      name: 'Business Continuity Planner',
      description: 'Comprehensive business continuity risk assessment tool that evaluates operational resilience and disaster recovery capabilities.',
      subcategory: 'Business Continuity',
      price: 229.99,
      rating: 4.5,
      reviewCount: 134,
      subscribers: 290,
      accuracy: 87,
      riskLevel: 'Medium',
      featured: false,
      trending: false,
      tags: ['Medium Risk', 'Business Continuity', 'Disaster Recovery'],
      developer: 'Continuity Solutions',
      lastUpdated: '2024-12-02',
      uptime: 99.3,
      modelType: 'Rule-Based Systems',
      aiTechnique: 'Expert Systems'
    }
  ];

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
            return model.price <= 250;
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

  function getRiskLevelColor(riskLevel: string) {
    switch(riskLevel) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <span className="font-medium">Risk Assessment</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Risk Assessment Models</h1>
              <p className="text-muted-foreground mt-1">
                AI-powered risk assessment and monitoring systems that identify potential portfolio risks and provide actionable insights
              </p>
            </div>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">57</p>
                  <p className="text-sm text-muted-foreground">Models</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <p className="text-2xl font-bold">4.8</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">$299</p>
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">11</p>
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
                  placeholder="Search risk assessment models..."
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
                    {subcategories.map(subcategory => (
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
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Technique:</span>
                      <span className="font-medium text-blue-600">{model.aiTechnique}</span>
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
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No models found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find risk assessment models.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}