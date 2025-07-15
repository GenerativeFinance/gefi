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
  ChevronLeft
} from "lucide-react";
import { Link } from "wouter";

export default function ModelDetail() {
  const [, params] = useRoute("/model/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const modelId = params?.id;

  // Fetch model details
  const { data: model, isLoading, error } = useQuery({
    queryKey: ["/api/ai-models", modelId],
    enabled: !!modelId,
  });

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/ai-models/${modelId}/subscribe`);
    },
    onSuccess: () => {
      setIsSubscribed(true);
      toast({
        title: "Success",
        description: "Successfully subscribed to AI model",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-models"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to subscribe to model",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !model) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Model Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The AI model you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/marketplace">
                <Button>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/marketplace" className="hover:text-blue-600 dark:hover:text-blue-400">
              AI Marketplace
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white">{model.name}</span>
          </div>

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {model.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      by {model.creator}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-4 max-w-3xl">
                  {model.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {model.category}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {model.subcategory}
                  </Badge>
                  <Badge className={`text-sm ${getRiskLevelColor(model.riskLevel)}`}>
                    {model.riskLevel} Risk
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {model.aiTechnique}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {model.rating}
                    </span>
                    <span>({model.totalRatings} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{model.monthlySubscribers.toLocaleString()} subscribers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{model.accuracy}% accuracy</span>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="lg:w-80 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(model.price)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Minimum Investment</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(model.minInvestment)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Target Users</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {model.targetUserType}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Supported Regions</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {model.supportedRegions.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => subscribeMutation.mutate()}
                    disabled={subscribeMutation.isPending || isSubscribed}
                    className="w-full"
                    size="lg"
                  >
                    {subscribeMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Subscribing...
                      </>
                    ) : isSubscribed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Subscribed
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Start Free Trial
                  </Button>
                  <Button variant="ghost" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="documentation">Docs</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Key Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(model.features).map(([feature, enabled]) => (
                          <div key={feature} className="flex items-center gap-2">
                            {enabled ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                            )}
                            <span className="text-sm capitalize">
                              {feature.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                        ))}
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
                      <div className="flex flex-wrap gap-2">
                        {model.dataRequirements.map((requirement, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {requirement}
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
                        {model.complianceFrameworks.map((framework, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            <Lock className="w-3 h-3 mr-1" />
                            {framework}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        {Object.entries(model.performance).map(([metric, value]) => (
                          <div key={metric} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">
                                {metric.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-lg font-bold">
                                {typeof value === 'number' ? 
                                  (metric.includes('ratio') || metric.includes('Rate') ? value.toFixed(2) : 
                                   metric.includes('Percent') || metric.includes('accuracy') ? `${value}%` : 
                                   value.toFixed(1)) : value}
                              </span>
                            </div>
                            <Progress 
                              value={typeof value === 'number' ? 
                                (metric.includes('accuracy') || metric.includes('Rate') ? value : 
                                 Math.min(value * 20, 100)) : 50} 
                              className="h-2" 
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documentation" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Documentation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Overview</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {model.documentation?.overview}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Methodology</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {model.documentation?.methodology}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Use Cases</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                          {model.documentation?.useCases?.map((useCase, index) => (
                            <li key={index}>{useCase}</li>
                          ))}
                        </ul>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Limitations</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                          {model.documentation?.limitations?.map((limitation, index) => (
                            <li key={index}>{limitation}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        User Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {model.reviews?.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback>
                                  {review.userName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{review.userName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {review.userRole}
                                  </Badge>
                                  {review.verified && (
                                    <Badge className="text-xs bg-green-100 text-green-800">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                    {new Date(review.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Pricing Plans
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <div className="text-center mb-4">
                            <h3 className="font-semibold text-lg">Basic</h3>
                            <div className="text-2xl font-bold">{formatCurrency(model.price)}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
                          </div>
                          <ul className="space-y-2 text-sm">
                            {model.pricing?.features?.basic?.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-2 border-blue-500 rounded-lg p-6 relative">
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                          </div>
                          <div className="text-center mb-4">
                            <h3 className="font-semibold text-lg">Premium</h3>
                            <div className="text-2xl font-bold">{formatCurrency(model.pricing?.annual / 12)}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
                          </div>
                          <ul className="space-y-2 text-sm">
                            {model.pricing?.features?.premium?.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <div className="text-center mb-4">
                            <h3 className="font-semibold text-lg">Enterprise</h3>
                            <div className="text-lg font-bold">Custom</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">pricing</div>
                          </div>
                          <ul className="space-y-2 text-sm">
                            {model.pricing?.features?.enterprise?.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                    <span className="font-medium">
                      {new Date(model.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Created</span>
                    <span className="font-medium">
                      {new Date(model.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Active Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      <Activity className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Related Models */}
              {model.relatedModels && model.relatedModels.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Models</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {model.relatedModels.map((relatedModel) => (
                      <Link key={relatedModel.id} href={`/model/${relatedModel.id}`}>
                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{relatedModel.name}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{relatedModel.rating}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {formatCurrency(relatedModel.price)}/month
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}