import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Award
} from "lucide-react";

export default function DeveloperPerformance() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  // Sample performance data
  const modelPerformance = [
    {
      id: 1,
      name: "High-Frequency Trading Algorithm",
      accuracyScore: 94.2,
      accuracyTrend: 2.1,
      users: 342,
      userGrowth: 18,
      lastUpdate: "2025-07-14",
      updateNote: "Enhanced volatility prediction algorithms",
      status: "excellent",
      backtestResults: {
        sharpeRatio: 2.34,
        maxDrawdown: -5.2,
        winRate: 68.4
      }
    },
    {
      id: 2,
      name: "Portfolio Risk Assessment",
      accuracyScore: 89.7,
      accuracyTrend: -1.3,
      users: 156,
      userGrowth: 12,
      lastUpdate: "2025-07-12",
      updateNote: "Updated risk factor calculations for emerging markets",
      status: "good",
      backtestResults: {
        sharpeRatio: 1.87,
        maxDrawdown: -8.1,
        winRate: 72.1
      }
    },
    {
      id: 3,
      name: "ESG Investment Screener",
      accuracyScore: 91.3,
      accuracyTrend: 4.7,
      users: 89,
      userGrowth: 25,
      lastUpdate: "2025-07-15",
      updateNote: "Added new ESG data sources and improved scoring methodology",
      status: "excellent",
      backtestResults: {
        sharpeRatio: 1.92,
        maxDrawdown: -6.8,
        winRate: 65.3
      }
    },
    {
      id: 4,
      name: "Market Sentiment Analyzer",
      accuracyScore: 88.9,
      accuracyTrend: 1.8,
      users: 298,
      userGrowth: 15,
      lastUpdate: "2025-07-13",
      updateNote: "Integrated advanced NLP models for better sentiment detection",
      status: "good",
      backtestResults: {
        sharpeRatio: 1.65,
        maxDrawdown: -9.4,
        winRate: 61.7
      }
    }
  ];

  const overallMetrics = {
    avgAccuracy: 91.0,
    totalUsers: 885,
    modelsDeployed: 5,
    avgUserGrowth: 17.5,
    topPerformer: "High-Frequency Trading Algorithm",
    recentUpdates: 12
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "needs_attention":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getAccuracyColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 85) return "text-blue-600 dark:text-blue-400";
    if (score >= 80) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
            <p className="text-muted-foreground">
              Track accuracy scores, usage statistics, and recent model updates
            </p>
          </div>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
                  <p className="text-2xl font-bold text-green-600">{overallMetrics.avgAccuracy}%</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{overallMetrics.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Models Deployed</p>
                  <p className="text-2xl font-bold">{overallMetrics.modelsDeployed}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg User Growth</p>
                  <p className="text-2xl font-bold text-green-600">+{overallMetrics.avgUserGrowth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Details */}
        <Tabs defaultValue="accuracy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accuracy">Accuracy Scores</TabsTrigger>
            <TabsTrigger value="usage">Usage Statistics</TabsTrigger>
            <TabsTrigger value="updates">Recent Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="accuracy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {modelPerformance.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>Backtesting Performance as of {model.lastUpdate}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(model.status)}>
                        <Award className="h-3 w-3 mr-1" />
                        {model.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Accuracy Score */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Accuracy Score</span>
                          <span className={`text-lg font-bold ${getAccuracyColor(model.accuracyScore)}`}>
                            {model.accuracyScore}%
                          </span>
                        </div>
                        <Progress value={model.accuracyScore} className="h-2" />
                        <div className="flex items-center gap-1 text-sm">
                          {model.accuracyTrend > 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                          )}
                          <span className={model.accuracyTrend > 0 ? "text-green-600" : "text-red-600"}>
                            {model.accuracyTrend > 0 ? "+" : ""}{model.accuracyTrend}% vs last month
                          </span>
                        </div>
                      </div>

                      {/* Backtest Results */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                          <p className="font-semibold">{model.backtestResults.sharpeRatio}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Max Drawdown</p>
                          <p className="font-semibold text-red-600">{model.backtestResults.maxDrawdown}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Win Rate</p>
                          <p className="font-semibold text-green-600">{model.backtestResults.winRate}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {modelPerformance.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>User engagement and adoption metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Users</span>
                        <span className="text-2xl font-bold">{model.users}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">User Growth</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600 font-medium">+{model.userGrowth}%</span>
                          </div>
                        </div>
                        <Progress value={model.userGrowth} className="h-2" max={30} />
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          <span>Model X: {model.users} users actively utilizing this model</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <div className="space-y-4">
              {modelPerformance.map((model) => (
                <Card key={model.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{model.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Updated {model.updateNote}, {model.lastUpdate}
                        </p>
                        <p className="text-sm">{model.updateNote}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(model.lastUpdate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Update Summary</CardTitle>
                <CardDescription>Recent development activity across all models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total updates in July 2025</span>
                  <span className="font-semibold">{overallMetrics.recentUpdates} updates</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}