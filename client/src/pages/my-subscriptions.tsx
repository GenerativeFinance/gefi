import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/layout/Layout";
import { Link } from "wouter";
import { 
  Bot, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Pause, 
  Play, 
  Settings, 
  TrendingUp, 
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getLocalSubscriptions, mergeSubscriptions } from "@/lib/subscriptionsLocal";

// Sample subscription data (this would normally come from the API)
const mockSubscriptions = [
  {
    id: 1,
    modelId: 1,
    modelName: "Quantum Risk Predictor",
    developerName: "AI Solutions Inc.",
    price: 299,
    billingCycle: "monthly",
    status: "active",
    nextBilling: "2025-08-02",
    subscribedDate: "2025-07-02",
    performance: "+24.8%",
    category: "Risk Management"
  },
  {
    id: 2,
    modelId: 2,
    modelName: "Smart Portfolio Optimizer",
    developerName: "FinTech Innovations",
    price: 199,
    billingCycle: "monthly",
    status: "active",
    nextBilling: "2025-08-05",
    subscribedDate: "2025-06-15",
    performance: "+18.3%",
    category: "Portfolio Management"
  },
  {
    id: 3,
    modelId: 3,
    modelName: "AI Trend Analyzer",
    developerName: "Market Analytics Pro",
    price: 149,
    billingCycle: "monthly",
    status: "paused",
    nextBilling: null,
    subscribedDate: "2025-05-20",
    performance: "+15.7%",
    category: "Market Analysis"
  },
  {
    id: 4,
    modelId: 4,
    modelName: "Risk Assessment Pro",
    developerName: "SecureInvest Tech",
    price: 399,
    billingCycle: "annually",
    status: "trial",
    nextBilling: "2025-07-16",
    subscribedDate: "2025-07-02",
    performance: "+12.4%",
    category: "Risk Management"
  }
];

export default function MySubscriptions() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // This would normally fetch from the API
  const { data: serverSubscriptions = mockSubscriptions, isLoading } = useQuery({
    queryKey: ["/api/my-subscriptions"],
    queryFn: () => mockSubscriptions // Replace with actual API call
  });

  // Merge server subscriptions with local subscriptions
  const subscriptions = mergeSubscriptions(serverSubscriptions, getLocalSubscriptions());

  const pauseSubscription = useMutation({
    mutationFn: async (subscriptionId: number) => {
      return apiRequest("POST", `/api/subscriptions/${subscriptionId}/pause`);
    },
    onSuccess: () => {
      toast({
        title: "Subscription Paused",
        description: "Your subscription has been paused successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-subscriptions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to pause subscription. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resumeSubscription = useMutation({
    mutationFn: async (subscriptionId: number) => {
      return apiRequest("POST", `/api/subscriptions/${subscriptionId}/resume`);
    },
    onSuccess: () => {
      toast({
        title: "Subscription Resumed",
        description: "Your subscription has been resumed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-subscriptions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to resume subscription. Please try again.",
        variant: "destructive",
      });
    }
  });

  const cancelSubscription = useMutation({
    mutationFn: async (subscriptionId: number) => {
      return apiRequest("POST", `/api/subscriptions/${subscriptionId}/cancel`);
    },
    onSuccess: () => {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-subscriptions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />;
      case 'trial':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'paused':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'trial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (activeTab === "all") return true;
    return sub.status === activeTab;
  });

  const totalMonthlySpend = subscriptions
    .filter(sub => sub.status === 'active' && sub.billingCycle === 'monthly')
    .reduce((total, sub) => total + sub.price, 0);

  const totalAnnualSpend = subscriptions
    .filter(sub => sub.status === 'active' && sub.billingCycle === 'annually')
    .reduce((total, sub) => total + sub.price, 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Subscriptions</h1>
            <p className="text-muted-foreground">Manage your AI model subscriptions and billing</p>
          </div>
          <Link href="/marketplace">
            <Button>Browse More Models</Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</div>
                  <div className="text-sm text-muted-foreground">Active Subscriptions</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(totalMonthlySpend)}</div>
                  <div className="text-sm text-muted-foreground">Monthly Spend</div>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(totalAnnualSpend)}</div>
                  <div className="text-sm text-muted-foreground">Annual Spend</div>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">+19.3%</div>
                  <div className="text-sm text-muted-foreground">Avg Performance</div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({subscriptions.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({subscriptions.filter(s => s.status === 'active').length})</TabsTrigger>
                <TabsTrigger value="paused">Paused ({subscriptions.filter(s => s.status === 'paused').length})</TabsTrigger>
                <TabsTrigger value="trial">Trial ({subscriptions.filter(s => s.status === 'trial').length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredSubscriptions.map((subscription) => (
                    <Card key={subscription.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Bot className="h-6 w-6 text-primary" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold">{subscription.modelName}</h3>
                              <Badge className={getStatusColor(subscription.status)}>
                                {getStatusIcon(subscription.status)}
                                <span className="ml-1 capitalize">{subscription.status}</span>
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-1">
                              by {subscription.developerName} • {subscription.category}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Performance: <span className="text-green-600 font-medium">{subscription.performance}</span></span>
                              <span>Subscribed: {formatDate(subscription.subscribedDate)}</span>
                              {subscription.nextBilling && (
                                <span>Next billing: {formatDate(subscription.nextBilling)}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-bold">{formatCurrency(subscription.price)}</div>
                            <div className="text-sm text-muted-foreground">/{subscription.billingCycle}</div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {subscription.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => pauseSubscription.mutate(subscription.id)}
                                disabled={pauseSubscription.isPending}
                              >
                                <Pause className="h-4 w-4 mr-1" />
                                Pause
                              </Button>
                            )}

                            {subscription.status === 'paused' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => resumeSubscription.mutate(subscription.id)}
                                disabled={resumeSubscription.isPending}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Resume
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={`/marketplace/model/${subscription.modelId}`}>
                                <BarChart3 className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>

                            {subscription.status !== 'trial' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => cancelSubscription.mutate(subscription.id)}
                                disabled={cancelSubscription.isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {filteredSubscriptions.length === 0 && (
                    <div className="text-center py-12">
                      <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No subscriptions found</h3>
                      <p className="text-muted-foreground mb-4">
                        {activeTab === "all" 
                          ? "You don't have any subscriptions yet."
                          : `You don't have any ${activeTab} subscriptions.`
                        }
                      </p>
                      <Link href="/marketplace">
                        <Button>Browse AI Models</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}