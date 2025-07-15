import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Layout from "@/components/layout/Layout";
import {
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
  ArrowRight,
  Download,
  Play,
  Pause,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Globe,
  Lock,
  Database,
  Code,
  FileText,
  MessageSquare,
  Calendar,
  ChevronLeft,
  Gauge
} from "lucide-react";

export default function ModelDetail() {
  const [, params] = useRoute("/marketplace/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("1year");
  const [selectedRegion, setSelectedRegion] = useState("us");
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: model, isLoading, error } = useQuery({
    queryKey: ['/api/ai-models', params?.id],
    queryFn: async () => {
      const response = await apiRequest(`/api/ai-models/${params?.id}`);
      return response.json();
    },
    enabled: !!params?.id,
  });

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/ai-models/${params?.id}/subscribe`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed",
        description: "You now have access to this AI model.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-models'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to be logged in to subscribe.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = () => {
    subscribeMutation.mutate();
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Model</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Unable to load the model details. Please try again later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!model) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Model Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400">
              The requested model could not be found.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          <a href="/marketplace" className="hover:text-gray-800 dark:hover:text-gray-200">
            AI Marketplace
          </a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>{model.category}</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-800 dark:text-gray-200">{model.name}</span>
        </div>

        {/* Model Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {model.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {model.description}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(model.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {model.rating} ({formatNumber(model.totalRatings)} reviews)
                  </span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {model.category}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {model.subcategory}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Subscribers</span>
                      </div>
                      <div className="text-2xl font-bold">{formatNumber(model.monthlySubscribers)}</div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of active monthly subscribers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                      </div>
                      <div className="text-2xl font-bold">{formatPercentage(model.accuracy)}</div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Model prediction accuracy rate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                      </div>
                      <div className="text-2xl font-bold">{formatPercentage(model.performance?.annualReturn || 0)}</div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Annual return performance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
                      </div>
                      <div className="text-2xl font-bold">{formatCurrency(model.price)}</div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Monthly subscription price</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Model Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {model.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Creator:</span>
                        <p className="font-medium">{model.creator}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level:</span>
                        <Badge variant={model.riskLevel === 'Low' ? 'default' : model.riskLevel === 'Medium' ? 'secondary' : 'destructive'}>
                          {model.riskLevel}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">AI Technique:</span>
                        <p className="font-medium">{model.aiTechnique}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Target Users:</span>
                        <p className="font-medium">{model.targetUserType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {model.features && Object.entries(model.features).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${value ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {model.tags && model.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                {/* Performance Chart Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                    <div className="flex items-center gap-4">
                      <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1month">1 Month</SelectItem>
                          <SelectItem value="3months">3 Months</SelectItem>
                          <SelectItem value="6months">6 Months</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">US Market</SelectItem>
                          <SelectItem value="eu">EU Market</SelectItem>
                          <SelectItem value="asia">Asia-Pacific</SelectItem>
                          <SelectItem value="global">Global</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Performance chart would be displayed here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</span>
                      </div>
                      <div className="text-2xl font-bold">{model.performance?.sharpeRatio || 'N/A'}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</span>
                      </div>
                      <div className="text-2xl font-bold">{formatPercentage(model.performance?.maxDrawdown || 0)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Calmar Ratio</span>
                      </div>
                      <div className="text-2xl font-bold">{model.performance?.calmarRatio || 'N/A'}</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">
                      Comprehensive documentation for this AI model is available to subscribers. 
                      This includes implementation guides, API references, and integration examples.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sample review */}
                      <div className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Excellent model with consistent performance. The accuracy is impressive and the integration was seamless.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-2">{formatCurrency(model.price)}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">per month</p>
                </div>
                <Button 
                  className="w-full mb-4" 
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? 'Subscribing...' : 'Subscribe Now'}
                </Button>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Free trial:</span>
                    <span>14 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancel anytime:</span>
                    <span>Yes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Subscribers</span>
                    <span className="font-medium">{formatNumber(model.monthlySubscribers)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</span>
                    <span className="font-medium">{formatPercentage(model.accuracy)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
                    <Badge variant={model.riskLevel === 'Low' ? 'default' : 'secondary'}>
                      {model.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Min Investment</span>
                    <span className="font-medium">{formatCurrency(model.minInvestment || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {model.dataRequirements && model.dataRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {req}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supported Regions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Supported Regions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {model.supportedRegions && model.supportedRegions.map((region, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {region}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Compliance Frameworks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {model.complianceFrameworks && model.complianceFrameworks.map((framework, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      <Lock className="w-3 h-3 mr-1" />
                      {framework}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}