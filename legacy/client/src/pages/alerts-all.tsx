import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, TrendingDown, Shield, Search, Filter, CheckCircle, X, Bell, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface RiskAlert {
  id: number;
  userId: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

interface MarketInsight {
  id: number;
  type: string;
  title: string;
  content: string;
  impact: string;
  createdAt: string;
  metadata?: any;
}

export default function AlertsAll() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [activeTab, setActiveTab] = useState("alerts");

  const { data: alerts = [], isLoading: alertsLoading } = useQuery<RiskAlert[]>({
    queryKey: ["/api/risk-alerts"],
    retry: false,
  });

  const { data: insights = [], isLoading: insightsLoading } = useQuery<MarketInsight[]>({
    queryKey: ["/api/market-insights"],
    retry: false,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      return apiRequest("PATCH", `/api/risk-alerts/${alertId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/risk-alerts"] });
      toast({
        title: "Alert Updated",
        description: "Alert marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/risk-alerts/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/risk-alerts"] });
      toast({
        title: "Success",
        description: "All alerts marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark all alerts as read",
        variant: "destructive",
      });
    },
  });

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || alert.type === filterType;
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  // Filter insights
  const filteredInsights = insights.filter((insight) => {
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || insight.type === filterType;
    return matchesSearch && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high": return AlertTriangle;
      case "medium": return Clock;
      case "low": return Shield;
      default: return Bell;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  if (alertsLoading || insightsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <MobileNav />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MobileNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Alerts & Insights</h1>
                <p className="text-muted-foreground">
                  Manage your risk alerts and market insights
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Badge variant="destructive">
                    {unreadCount} unread
                  </Badge>
                )}
                <Button
                  variant="outline"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending || unreadCount === 0}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts and insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="risk">Risk Alerts</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alerts">
                Risk Alerts ({filteredAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="insights">
                Market Insights ({filteredInsights.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4 mt-6">
              {filteredAlerts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Alerts Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || filterType !== "all" || filterSeverity !== "all"
                        ? "Try adjusting your filters to see more alerts."
                        : "You're all caught up! No alerts at this time."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => {
                    const SeverityIcon = getSeverityIcon(alert.severity);
                    return (
                      <Card key={alert.id} className={`transition-all hover:shadow-md ${!alert.isRead ? 'border-primary' : ''}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${alert.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20' : 
                                              alert.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' : 
                                              'bg-blue-100 dark:bg-blue-900/20'}`}>
                                <SeverityIcon className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-600 dark:text-red-400' : 
                                                         alert.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                                                         'text-blue-600 dark:text-blue-400'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <CardTitle className="text-lg">{alert.title}</CardTitle>
                                  {!alert.isRead && (
                                    <Badge variant="secondary" className="text-xs">New</Badge>
                                  )}
                                </div>
                                <CardDescription className="mt-1">
                                  {alert.message}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              {!alert.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsReadMutation.mutate(alert.id)}
                                  disabled={markAsReadMutation.isPending}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Type: {alert.type}</span>
                            <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4 mt-6">
              {filteredInsights.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Market Insights Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || filterType !== "all"
                        ? "Try adjusting your filters to see more insights."
                        : "No market insights available at this time."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredInsights.map((insight) => (
                    <Card key={insight.id} className="transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                            <CardDescription className="mt-2">
                              {insight.content}
                            </CardDescription>
                          </div>
                          <Badge variant={getImpactColor(insight.impact)}>
                            {insight.impact} Impact
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Type: {insight.type}</span>
                          <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}