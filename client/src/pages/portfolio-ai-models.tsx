import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Star, 
  Pause, 
  Play, 
  X,
  BarChart3,
  Target,
  History,
  Sparkles
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, differenceInDays, isPast } from "date-fns";

interface SubscribedModel {
  id: number;
  name: string;
  description: string;
  category: string;
  creator: string;
  rating: number;
  totalRatings: number;
  subscription: {
    id: number;
    plan: string;
    status: string;
    price: number;
    subscribedAt: string;
    renewalDate: string;
    totalUsageHours: number;
  };
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
}

interface UsageHistory {
  id: number;
  modelName: string;
  sessionDuration: number;
  performanceResult: number;
  profitLoss: number;
  usageType: string;
  sessionStarted: string;
  sessionEnded: string;
}

interface RecommendedModel {
  id: number;
  name: string;
  description: string;
  category: string;
  creator: string;
  rating: number;
  price: number;
  matchScore: number;
  reasonsForRecommendation: string[];
}

export default function PortfolioAIModels() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("subscriptions");

  // Fetch user's subscribed models
  const { data: subscribedModels, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ["/api/portfolio/ai-models/subscriptions"],
  });

  // Fetch usage history
  const { data: usageHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/portfolio/ai-models/usage-history"],
  });

  // Fetch recommended models
  const { data: recommendedModels, isLoading: recommendationsLoading } = useQuery({
    queryKey: ["/api/portfolio/ai-models/recommendations"],
  });

  // Mutation for managing subscriptions
  const manageMutation = useMutation({
    mutationFn: async ({ action, subscriptionId }: { action: string; subscriptionId: number }) => {
      return apiRequest("POST", `/api/portfolio/ai-models/manage`, { action, subscriptionId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/ai-models/subscriptions"] });
      const actionText = variables.action === 'pause' ? 'paused' : 
                        variables.action === 'resume' ? 'resumed' : 'cancelled';
      toast({
        title: "Subscription Updated",
        description: `Model subscription ${actionText} successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Action Failed",
        description: "Unable to update subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRenewalStatus = (renewalDate: string) => {
    const daysUntilRenewal = differenceInDays(new Date(renewalDate), new Date());
    if (daysUntilRenewal < 0) return { text: 'Expired', color: 'text-red-600' };
    if (daysUntilRenewal <= 7) return { text: `${daysUntilRenewal} days`, color: 'text-orange-600' };
    return { text: `${daysUntilRenewal} days`, color: 'text-gray-600' };
  };

  const getUsageTypeIcon = (type: string) => {
    switch (type) {
      case 'backtesting': return <BarChart3 className="h-4 w-4" />;
      case 'live_trading': return <TrendingUp className="h-4 w-4" />;
      case 'analysis': return <Target className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (subscriptionsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio AI Models</h1>
          <p className="text-muted-foreground">
            Manage your AI model subscriptions, track performance, and discover new opportunities
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Active Models
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Usage History
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
          </TabsList>

          {/* Active Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <div className="grid gap-6">
              {subscribedModels && subscribedModels.length > 0 ? (
                subscribedModels.map((model: SubscribedModel) => (
                  <Card key={model.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{model.name}</h3>
                          <Badge className={getStatusColor(model.subscription.status)}>
                            {model.subscription.status}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{model.rating}</span>
                            <span className="text-sm text-muted-foreground">({model.totalRatings})</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{model.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Category: {model.category}</span>
                          <span>Created by: {model.creator}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {model.subscription.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => manageMutation.mutate({ action: 'pause', subscriptionId: model.subscription.id })}
                            disabled={manageMutation.isPending}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        )}
                        {model.subscription.status === 'paused' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => manageMutation.mutate({ action: 'resume', subscriptionId: model.subscription.id })}
                            disabled={manageMutation.isPending}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => manageMutation.mutate({ action: 'cancel', subscriptionId: model.subscription.id })}
                          disabled={manageMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">${model.subscription.price}/{model.subscription.plan}</p>
                          <p className="text-xs text-muted-foreground">Subscription</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className={`text-sm font-medium ${getRenewalStatus(model.subscription.renewalDate).color}`}>
                            {getRenewalStatus(model.subscription.renewalDate).text}
                          </p>
                          <p className="text-xs text-muted-foreground">Until renewal</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{model.subscription.totalUsageHours}h</p>
                          <p className="text-xs text-muted-foreground">Total usage</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className={`text-sm font-medium ${getPerformanceColor(model.performance.totalReturn)}`}>
                            {model.performance.totalReturn > 0 ? '+' : ''}{model.performance.totalReturn.toFixed(2)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Total return</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">{model.performance.sharpeRatio.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-red-600">{model.performance.maxDrawdown.toFixed(2)}%</p>
                        <p className="text-xs text-muted-foreground">Max Drawdown</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">{model.performance.winRate.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Subscriptions</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't subscribed to any AI models yet. Explore our marketplace to find models that match your investment strategy.
                  </p>
                  <Button>
                    Browse AI Models
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6">
              {subscribedModels && subscribedModels.length > 0 ? (
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle>Overall Portfolio Performance</CardTitle>
                    <CardDescription>Performance metrics across all your AI model subscriptions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">+12.45%</p>
                        <p className="text-sm text-muted-foreground">Total Return</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">1.8</p>
                        <p className="text-sm text-muted-foreground">Avg Sharpe Ratio</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">-8.2%</p>
                        <p className="text-sm text-muted-foreground">Max Drawdown</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">68.5%</p>
                        <p className="text-sm text-muted-foreground">Avg Win Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Performance Data</h3>
                  <p className="text-muted-foreground">
                    Subscribe to AI models to start tracking performance metrics.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Usage History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              {usageHistory && usageHistory.length > 0 ? (
                usageHistory.map((session: UsageHistory) => (
                  <Card key={session.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getUsageTypeIcon(session.usageType)}
                        <div>
                          <h4 className="font-medium">{session.modelName}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {session.usageType.replace('_', ' ')} session
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{session.sessionDuration.toFixed(1)}h</p>
                          <p className="text-muted-foreground">Duration</p>
                        </div>
                        <div className="text-center">
                          <p className={`font-medium ${getPerformanceColor(session.performanceResult)}`}>
                            {session.performanceResult > 0 ? '+' : ''}{session.performanceResult.toFixed(2)}%
                          </p>
                          <p className="text-muted-foreground">Performance</p>
                        </div>
                        <div className="text-center">
                          <p className={`font-medium ${getPerformanceColor(session.profitLoss)}`}>
                            ${session.profitLoss.toFixed(2)}
                          </p>
                          <p className="text-muted-foreground">P&L</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{format(new Date(session.sessionStarted), 'MMM dd')}</p>
                          <p className="text-muted-foreground">Date</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Usage History</h3>
                  <p className="text-muted-foreground">
                    Your AI model usage sessions will appear here once you start using them.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid gap-6">
              {recommendedModels && recommendedModels.length > 0 ? (
                recommendedModels.map((model: RecommendedModel) => (
                  <Card key={model.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{model.name}</h3>
                          <Badge variant="secondary">
                            {model.matchScore}% match
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{model.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{model.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>Category: {model.category}</span>
                          <span>Created by: {model.creator}</span>
                          <span>${model.price}/month</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Why this model is recommended:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {model.reasonsForRecommendation.map((reason, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Button>
                        Subscribe
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                  <p className="text-muted-foreground">
                    Subscribe to more AI models to get personalized recommendations based on your portfolio and preferences.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}