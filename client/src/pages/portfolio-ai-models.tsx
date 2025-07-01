import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Settings, 
  PlayCircle,
  PauseCircle,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Target
} from "lucide-react";

export default function PortfolioAIModels() {
  const { data: aiModels, isLoading } = useQuery({
    queryKey: ["/api/portfolio/ai-models"],
    enabled: true
  });

  const activeModels = [
    {
      id: 1,
      name: "Quantum Risk Predictor",
      category: "Risk Assessment",
      status: "active",
      performance: 12.5,
      allocation: 25,
      monthlyFee: 99,
      lastUpdate: "2 hours ago",
      accuracy: 94.2,
      trades: 156,
      profitLoss: 2847.50,
      riskScore: "Low"
    },
    {
      id: 2,
      name: "Momentum Tracker Pro",
      category: "Trend Analysis",
      status: "active",
      performance: 8.7,
      allocation: 30,
      monthlyFee: 149,
      lastUpdate: "15 minutes ago",
      accuracy: 89.1,
      trades: 234,
      profitLoss: 1923.75,
      riskScore: "Medium"
    },
    {
      id: 3,
      name: "Volatility Shield",
      category: "Risk Management",
      status: "paused",
      performance: -2.1,
      allocation: 15,
      monthlyFee: 79,
      lastUpdate: "1 day ago",
      accuracy: 87.3,
      trades: 89,
      profitLoss: -456.25,
      riskScore: "Low"
    }
  ];

  const recommendedModels = [
    {
      id: 4,
      name: "Crypto Sentiment Analyzer",
      category: "Sentiment Analysis",
      rating: 4.8,
      monthlyFee: 129,
      description: "Advanced NLP model for cryptocurrency sentiment analysis",
      accuracy: 91.5,
      subscribers: 1247,
      tags: ["Crypto", "NLP", "Sentiment"]
    },
    {
      id: 5,
      name: "ESG Impact Scorer",
      category: "ESG Analysis",
      rating: 4.6,
      monthlyFee: 199,
      description: "Evaluate environmental, social, and governance factors",
      accuracy: 88.9,
      subscribers: 856,
      tags: ["ESG", "Sustainability", "Risk"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'paused':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Portfolio AI Models
                </h1>
                <p className="text-muted-foreground">
                  Manage and optimize your AI-powered investment models
                </p>
              </div>
              <Button className="gap-2">
                <Bot className="h-5 w-5" />
                Browse Models
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Models</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <Bot className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Performance</p>
                    <p className="text-2xl font-bold text-green-600">+19.1%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Fees</p>
                    <p className="text-2xl font-bold">$327</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                    <p className="text-2xl font-bold">90.2%</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Models</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Active Models */}
            <TabsContent value="active" className="space-y-6">
              <div className="grid gap-6">
                {activeModels.map((model) => (
                  <Card key={model.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Model Info */}
                        <div className="lg:col-span-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Bot className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{model.name}</h3>
                              <p className="text-sm text-muted-foreground">{model.category}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getStatusIcon(model.status)}
                            <Badge className={getStatusColor(model.status)}>
                              {model.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Updated {model.lastUpdate}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Portfolio Allocation</span>
                              <span>{model.allocation}%</span>
                            </div>
                            <Progress value={model.allocation} className="h-2" />
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Performance</p>
                            <p className={`text-lg font-bold ${model.performance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {model.performance > 0 ? '+' : ''}{model.performance}%
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Accuracy</p>
                            <p className="text-lg font-bold">{model.accuracy}%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Trades</p>
                            <p className="text-lg font-bold">{model.trades}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">P&L</p>
                            <p className={`text-lg font-bold ${model.profitLoss > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${model.profitLoss.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Monthly Fee</span>
                            <span className="font-semibold">${model.monthlyFee}</span>
                          </div>
                          
                          <div className="space-y-2">
                            {model.status === 'active' ? (
                              <Button variant="outline" className="w-full gap-2">
                                <PauseCircle className="h-4 w-4" />
                                Pause
                              </Button>
                            ) : (
                              <Button className="w-full gap-2">
                                <PlayCircle className="h-4 w-4" />
                                Resume
                              </Button>
                            )}
                            <Button variant="outline" className="w-full gap-2">
                              <Settings className="h-4 w-4" />
                              Configure
                            </Button>
                            <Button variant="outline" className="w-full gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Recommended Models */}
            <TabsContent value="recommended" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedModels.map((model) => (
                  <Card key={model.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Bot className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{model.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{model.category}</p>
                          </div>
                        </div>
                        <Badge variant="outline">${model.monthlyFee}/mo</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{model.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Rating</p>
                          <p className="font-semibold">⭐ {model.rating}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Accuracy</p>
                          <p className="font-semibold">{model.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Subscribers</p>
                          <p className="font-semibold">{model.subscribers.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p className="font-semibold">{model.category}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {model.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2">
                          <Zap className="h-4 w-4" />
                          Subscribe
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Auto-Rebalancing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable automatic rebalancing</span>
                      <Button variant="outline" size="sm">Toggle</Button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Rebalance frequency</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Maximum allocation per model</label>
                      <input type="number" className="w-full p-2 border rounded-md" defaultValue="35" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Stop-loss threshold</label>
                      <input type="number" className="w-full p-2 border rounded-md" defaultValue="15" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}