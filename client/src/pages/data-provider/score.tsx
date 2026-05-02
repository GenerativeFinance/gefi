import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import {
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  Star,
  Shield,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Activity,
  Users,
  Database,
  Clock
} from "lucide-react";

export default function DataProviderScore() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");

  // Sample score data
  const overallScore = {
    current: 87,
    previous: 82,
    change: 5,
    rank: 23,
    totalProviders: 156,
    percentile: 85
  };

  const scoreBreakdown = [
    {
      category: "Data Quality",
      score: 92,
      weight: 30,
      trend: "up",
      change: 3,
      description: "Accuracy, completeness, and consistency of datasets"
    },
    {
      category: "User Satisfaction",
      score: 89,
      weight: 25,
      trend: "up",
      change: 2,
      description: "Average user ratings and feedback scores"
    },
    {
      category: "Market Performance",
      score: 85,
      weight: 20,
      trend: "up",
      change: 7,
      description: "Revenue growth and subscription metrics"
    },
    {
      category: "Compliance",
      score: 91,
      weight: 15,
      trend: "stable",
      change: 0,
      description: "Regulatory adherence and security standards"
    },
    {
      category: "Innovation",
      score: 78,
      weight: 10,
      trend: "down",
      change: -2,
      description: "New dataset releases and feature updates"
    }
  ];

  const achievements = [
    {
      title: "Top Quality Provider",
      description: "Maintained 90%+ quality score for 6 months",
      earned: "2025-07-01",
      level: "gold",
      points: 500
    },
    {
      title: "Customer Champion",
      description: "Achieved 95%+ customer satisfaction",
      earned: "2025-06-15",
      level: "silver",
      points: 300
    },
    {
      title: "Compliance Expert",
      description: "Perfect compliance record for 1 year",
      earned: "2025-05-20",
      level: "gold",
      points: 400
    },
    {
      title: "Growth Leader",
      description: "50%+ revenue growth in last quarter",
      earned: "2025-04-10",
      level: "bronze",
      points: 200
    }
  ];

  const performanceMetrics = [
    {
      metric: "Dataset Downloads",
      current: 12547,
      target: 15000,
      progress: 84,
      trend: "up"
    },
    {
      metric: "API Call Volume",
      current: 245890,
      target: 300000,
      progress: 82,
      trend: "up"
    },
    {
      metric: "Customer Retention",
      current: 94,
      target: 95,
      progress: 99,
      trend: "stable"
    },
    {
      metric: "Response Time",
      current: 4.2,
      target: 4.0,
      progress: 95,
      trend: "improving"
    }
  ];

  const competitorComparison = [
    {
      provider: "You",
      score: 87,
      rank: 23,
      quality: 92,
      satisfaction: 89,
      performance: 85
    },
    {
      provider: "DataFlow Pro",
      score: 91,
      rank: 18,
      quality: 94,
      satisfaction: 91,
      performance: 88
    },
    {
      provider: "FinanceData Inc",
      score: 84,
      rank: 28,
      quality: 89,
      satisfaction: 86,
      performance: 82
    },
    {
      provider: "MarketInsights Co",
      score: 89,
      rank: 21,
      quality: 91,
      satisfaction: 88,
      performance: 86
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 80) return "bg-blue-50 border-blue-200";
    if (score >= 70) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getAchievementColor = (level: string) => {
    switch (level) {
      case "gold": return "text-yellow-600 bg-yellow-50";
      case "silver": return "text-gray-600 bg-gray-50";
      case "bronze": return "text-amber-600 bg-amber-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Provider Score</h1>
            <p className="text-muted-foreground">Track your performance and ranking in the marketplace</p>
          </div>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            Improvement Plan
          </Button>
        </div>

        {/* Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={getScoreBg(overallScore.current)}>
            <CardHeader className="text-center">
              <CardTitle className="text-5xl font-bold">
                <span className={getScoreColor(overallScore.current)}>{overallScore.current}</span>
              </CardTitle>
              <CardDescription>Overall Provider Score</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-2">
                {overallScore.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={overallScore.change > 0 ? "text-green-600" : "text-red-600"}>
                  {overallScore.change > 0 ? "+" : ""}{overallScore.change} points
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rank</span>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">#{overallScore.rank}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Out of</span>
                <span className="font-medium">{overallScore.totalProviders} providers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Percentile</span>
                <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                  {overallScore.percentile}th
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score Target: 90</span>
                  <span>{overallScore.current}/90</span>
                </div>
                <Progress value={(overallScore.current / 90) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rank Target: Top 20</span>
                  <span>#{overallScore.rank}/20</span>
                </div>
                <Progress value={(21 - overallScore.rank) / 20 * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score Breakdown and Details */}
        <Tabs defaultValue="breakdown" className="space-y-4">
          <TabsList>
            <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="comparison">Competitor Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-4">
            <div className="grid gap-6">
              {scoreBreakdown.map((category, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{category.category}</h3>
                          <Badge variant="outline">{category.weight}% weight</Badge>
                          {category.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : category.trend === "down" ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <Activity className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={category.score} className="flex-1 h-2" />
                          <span className="text-sm font-medium w-12">{category.score}%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(category.score)}`}>
                          {category.score}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {category.change > 0 ? "+" : ""}{category.change} pts
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {performanceMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{metric.current.toLocaleString()}</span>
                      <Badge variant="outline">
                        {metric.trend === "up" ? "↗️" : metric.trend === "improving" ? "📈" : "➡️"} {metric.trend}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Target: {metric.target.toLocaleString()}</span>
                        <span>{metric.progress}%</span>
                      </div>
                      <Progress value={metric.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Award className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground">Earned: {achievement.earned}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getAchievementColor(achievement.level)}>
                          {achievement.level}
                        </Badge>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">+{achievement.points}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
                <CardDescription>Compare your performance with similar providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitorComparison.map((provider, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${provider.provider === "You" ? "bg-blue-50 border-blue-200" : ""}`}>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-semibold">
                            {provider.provider === "You" ? (
                              <div className="flex items-center gap-2">
                                <span>You</span>
                                <Badge variant="secondary">Your Score</Badge>
                              </div>
                            ) : (
                              provider.provider
                            )}
                          </div>
                          <Badge variant="outline">Rank #{provider.rank}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold">{provider.score}</div>
                            <div className="text-xs text-muted-foreground">Overall</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{provider.quality}</div>
                            <div className="text-xs text-muted-foreground">Quality</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{provider.satisfaction}</div>
                            <div className="text-xs text-muted-foreground">Satisfaction</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{provider.performance}</div>
                            <div className="text-xs text-muted-foreground">Performance</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}