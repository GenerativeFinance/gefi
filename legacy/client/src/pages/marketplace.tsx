import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/layout/Layout";
import {
  Search,
  Filter,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Brain,
  Zap,
  Target,
  ShieldCheck,
  Heart,
  Share2,
  Eye,
  ChevronRight,
  Settings2,
  Sparkles,
  ThumbsUp,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";

interface Recommendation {
  modelId: number;
  model: any;
  score: number;
  reasoning: string;
  reasonCode: string;
  recommendationType: 'personalized' | 'trending' | 'collaborative' | 'content_based' | 'hybrid';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface UserPreferences {
  riskTolerance: string;
  investmentHorizon: string;
  preferredCategories: string[];
  excludedCategories: string[];
  maxMonthlySpend: number;
  experienceLevel: string;
  financialGoals: string[];
  preferredRegions: string[];
}

export default function AIMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [riskLevel, setRiskLevel] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number[]>([1000]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Fetch recommendations
  const { data: recommendations = [], isLoading: isLoadingRecs } = useQuery({
    queryKey: ["/api/recommendations", { 
      context: 'marketplace',
      categoryFilter: selectedCategory !== 'all' ? [selectedCategory] : undefined,
      riskLevel: riskLevel !== 'all' ? riskLevel : undefined,
      maxPrice: maxPrice[0],
      limit: 20
    }],
  });

  // Fetch user preferences
  const { data: userPreferences, isLoading: isLoadingPrefs } = useQuery({
    queryKey: ["/api/user/preferences"],
  });

  // Fetch AI model categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/ai-model-categories"],
  });

  // Fetch subcategories for selected category
  const { data: subcategories = [] } = useQuery({
    queryKey: ["/api/ai-model-subcategories", { category: selectedCategory }],
    enabled: selectedCategory !== "all",
  });

  // Fetch AI models for general browsing
  const { data: allModels = [] } = useQuery({
    queryKey: ["/api/ai-models"],
  });

  // Fetch trending models
  const { data: trendingModels = [] } = useQuery({
    queryKey: ["/api/recommendations/trending", { timeFrame: 'weekly', limit: 10 }],
  });

  // Track interaction mutation
  const trackInteractionMutation = useMutation({
    mutationFn: (data: { modelId: number; interactionType: string; metadata?: any }) =>
      apiRequest("POST", "/api/recommendations/interact", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences: Partial<UserPreferences>) =>
      apiRequest("POST", "/api/user/preferences", preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/preferences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Preferences updated",
        description: "Your AI model recommendations have been refreshed.",
      });
    },
  });

  const handleInteraction = (modelId: number, interactionType: string, metadata?: any) => {
    trackInteractionMutation.mutate({ modelId, interactionType, metadata });
  };

  const handleModelClick = (model: any) => {
    handleInteraction(model.id, 'view', { 
      sessionDuration: Math.floor(Math.random() * 120) + 30,
      clickDepth: 1 
    });
    
    // Special case redirects for models with custom pages
    if (model.id === 5) {
      window.location.href = "/forecasting-model";
      return;
    } else if (model.id === 9) {
      window.location.href = "/hrp-portfolio-optimization";
      return;
    }
    
    // Navigate to canonical model detail route using wouter
    navigate(`/model/${model.id}`);
  };

  const handleLike = (model: any) => {
    handleInteraction(model.id, 'like');
    toast({
      title: "Added to favorites",
      description: `${model.name} has been added to your favorites.`,
    });
  };

  const handleShare = (model: any) => {
    handleInteraction(model.id, 'share');
    navigator.clipboard.writeText(`Check out this AI model: ${model.name}`);
    toast({
      title: "Link copied",
      description: "Model link has been copied to your clipboard.",
    });
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'personalized': return <Target className="h-4 w-4" />;
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'collaborative': return <Users className="h-4 w-4" />;
      case 'content_based': return <Brain className="h-4 w-4" />;
      case 'hybrid': return <Sparkles className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredModels = (allModels as any[]).filter(model => {
    const matchesSearch = searchTerm === "" || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "all" || model.subcategory === selectedSubcategory;
    const matchesRisk = riskLevel === "all" || model.riskLevel === riskLevel;
    const matchesPrice = parseFloat(model.price) <= maxPrice[0];
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesRisk && matchesPrice;
  });

  // Reset subcategory when category changes
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory("all");
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-8 mobile-content-padding">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mobile-heading">AI Model Marketplace</h1>
          <p className="text-muted-foreground mt-2 mobile-body-text">
            Discover and subscribe to AI-powered financial models tailored to your needs
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 mobile-button-small mobile-touch-target">
                <Settings2 className="h-4 w-4" />
                Preferences
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Recommendation Preferences</DialogTitle>
                <DialogDescription>
                  Customize your AI model recommendations
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Risk Tolerance</label>
                  <Select defaultValue={(userPreferences as any)?.riskTolerance || 'moderate'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Experience Level</label>
                  <Select defaultValue={(userPreferences as any)?.experienceLevel || 'intermediate'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Monthly Budget: ${maxPrice[0]}</label>
                  <Slider
                    value={maxPrice}
                    onValueChange={setMaxPrice}
                    max={2000}
                    min={50}
                    step={50}
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  onClick={() => {
                    updatePreferencesMutation.mutate({
                      maxMonthlySpend: maxPrice[0]
                    });
                    setShowPreferences(false);
                  }}
                  className="w-full"
                >
                  Update Preferences
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mobile-search-container lg:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search AI models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mobile-search-input"
          />
        </div>
      </div>

      {/* Mobile Filter Pills */}
      <div className="mobile-filter-container lg:hidden">
        <div 
          className={`mobile-filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Categories
        </div>
        {(categories as any[]).map((category: any) => (
          <div 
            key={category.id}
            className={`mobile-filter-pill ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </div>
        ))}
      </div>

      {/* Desktop Search and Filters */}
      <div className="hidden lg:flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search AI models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(categories as any[]).map((category: any) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {selectedCategory !== "all" && (subcategories as any[]).map((subcategory: any) => (
                <SelectItem key={subcategory.id} value={subcategory.name}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={riskLevel} onValueChange={setRiskLevel}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Mobile Navigation Tabs */}
        <div className="mobile-nav-tabs lg:hidden">
          <button 
            onClick={() => setActiveTab('for-you')}
            className={`mobile-nav-tab ${activeTab === 'for-you' ? 'mobile-tab-active' : 'mobile-tab-inactive'}`}
          >
            <Target className="h-4 w-4" />
            For You
          </button>
          <button 
            onClick={() => setActiveTab('trending')}
            className={`mobile-nav-tab ${activeTab === 'trending' ? 'mobile-tab-active' : 'mobile-tab-inactive'}`}
          >
            <TrendingUp className="h-4 w-4" />
            Trending
          </button>
          <button 
            onClick={() => setActiveTab('browse')}
            className={`mobile-nav-tab ${activeTab === 'browse' ? 'mobile-tab-active' : 'mobile-tab-inactive'}`}
          >
            <Search className="h-4 w-4" />
            Browse
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`mobile-nav-tab ${activeTab === 'categories' ? 'mobile-tab-active' : 'mobile-tab-inactive'}`}
          >
            <Filter className="h-4 w-4" />
            Categories
          </button>
        </div>

        {/* Desktop Tabs */}
        <TabsList className="hidden lg:grid w-full grid-cols-4">
          <TabsTrigger value="for-you" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            For You
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse All
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        {/* Personalized Recommendations */}
        <TabsContent value="for-you" className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Personalized Recommendations</h2>
          </div>
          
          {isLoadingRecs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (recommendations as Recommendation[]).length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Building Your Recommendations</h3>
                <p className="text-muted-foreground mb-4">
                  We're analyzing your preferences to find the perfect AI models for you.
                </p>
                <Button 
                  onClick={() => setShowPreferences(true)}
                  variant="outline"
                >
                  Set Your Preferences
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {(recommendations as Recommendation[]).map((rec: Recommendation) => (
                <Card 
                  key={rec.modelId} 
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary mobile-card mobile-list-item"
                  onClick={() => handleModelClick(rec.model)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getRecommendationIcon(rec.recommendationType)}
                          <Badge variant="secondary" className="text-xs">
                            {rec.recommendationType.replace('_', ' ')}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {rec.model.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {rec.model.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{rec.model.rating || '4.5'}</span>
                        <span>({rec.model.totalRatings || '0'})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${rec.model.price}/mo</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">Why this model?</span>
                        <div className="text-sm text-muted-foreground">
                          Score: {(rec.score * 100).toFixed(0)}%
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rec.reasoning}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex gap-2 sm:gap-3">
                      <Button
                        size="sm"
                        className="flex-1 mobile-button-small mobile-touch-target"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModelClick(rec.model);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      
                      <Button 
                        size="sm"
                        className="flex-1 mobile-button-small mobile-touch-target"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInteraction(rec.model.id, 'trial');
                        }}
                        variant="outline"
                      >
                        <span className="hidden sm:inline">Try Free</span>
                        <span className="sm:hidden">Try</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(rec.model);
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(rec.model);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Trending Models */}
        <TabsContent value="trending" className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold mobile-subheading">Trending This Week</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {(allModels as any[]).slice(0, 9).map((model: any, index: number) => (
              <Card 
                key={model.id} 
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer mobile-card mobile-list-item"
                onClick={() => handleModelClick(model)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive" className="text-xs">
                          #{index + 1} Trending
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {model.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {model.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {model.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{model.rating || '4.5'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>+{Math.floor(Math.random() * 50) + 10}%</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    ${model.price}/month
                  </div>
                  
                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      size="sm"
                      className="flex-1 mobile-button-small mobile-touch-target"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModelClick(model);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    
                    <Button 
                      size="sm"
                      className="flex-1 mobile-button-small mobile-touch-target"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInteraction(model.id, 'subscribe');
                      }}
                    >
                      <span className="hidden sm:inline">Subscribe</span>
                      <span className="sm:hidden">Sub</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Browse All Models */}
        <TabsContent value="browse" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold mobile-subheading">All AI Models</h2>
              <Badge variant="outline" className="text-xs sm:text-sm">{filteredModels.length} models</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredModels.map((model: any) => (
              <Card 
                key={model.id} 
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer mobile-card mobile-list-item"
                onClick={() => handleModelClick(model)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {model.category}
                    </Badge>
                    {model.isFeatured && (
                      <Badge className="text-xs bg-yellow-500 text-black">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {model.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {model.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{model.rating || '4.5'}</span>
                      <span>({model.totalRatings || '0'})</span>
                    </div>
                    <div className="text-sm font-medium">
                      ${model.price}/mo
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    {model.riskLevel && (
                      <Badge variant="secondary" className="text-xs">
                        {model.riskLevel} Risk
                      </Badge>
                    )}
                    {model.aiTechnique && (
                      <Badge variant="outline" className="text-xs">
                        {model.aiTechnique}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModelClick(model);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    <Button 
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInteraction(model.id, 'subscribe');
                      }}
                    >
                      Subscribe
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(model);
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(model);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Browse by Category</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {(categories as any[]).map((category: any) => {
              const categoryModels = (allModels as any[]).filter((model: any) => model.category === category.name);
              return (
                <Card 
                  key={category.id} 
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer mobile-card mobile-list-item"
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setActiveTab('browse');
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription>
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {categoryModels.length} models available
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}