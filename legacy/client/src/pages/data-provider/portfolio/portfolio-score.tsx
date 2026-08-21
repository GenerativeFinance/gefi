import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Award, 
  Trophy, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Target, 
  CheckCircle, 
  Calendar,
  BarChart3,
  DollarSign,
  Users,
  Shield,
  Zap,
  Crown,
  Medal,
  Download,
  RefreshCw
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function PortfolioScore() {
  const [timeRange, setTimeRange] = useState("current");

  // Sample portfolio score data
  const portfolioScore = {
    overall: 82,
    previousScore: 78,
    change: +4,
    ranking: 12,
    totalProviders: 1847,
    percentile: 94.2
  };

  const scoreBreakdown = [
    {
      category: "Usage",
      score: 88,
      weight: 30,
      contribution: 26.4,
      details: "Download frequency, integration rate, active models",
      trend: "+5%",
      color: "bg-blue-500"
    },
    {
      category: "Quality",
      score: 85,
      weight: 25,
      contribution: 21.25,
      details: "Accuracy ratings, completeness, timeliness",
      trend: "+2%",
      color: "bg-green-500"
    },
    {
      category: "Revenue",
      score: 79,
      weight: 20,
      contribution: 15.8,
      details: "Monthly earnings, growth rate, subscription retention",
      trend: "+8%",
      color: "bg-purple-500"
    },
    {
      category: "Compliance",
      score: 92,
      weight: 15,
      contribution: 13.8,
      details: "Regulatory adherence, audit results, certifications",
      trend: "+1%",
      color: "bg-orange-500"
    },
    {
      category: "Collaboration",
      score: 76,
      weight: 10,
      contribution: 7.6,
      details: "Developer feedback, response rate, project success",
      trend: "+3%",
      color: "bg-cyan-500"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Top Data Provider 2025",
      description: "Ranked in top 15 data providers globally",
      dateEarned: "2025-01-01",
      rarity: "Legendary",
      icon: <Crown className="h-8 w-8" />,
      color: "bg-gradient-to-br from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Quality Excellence",
      description: "Maintained 90%+ quality score for 6 consecutive months",
      dateEarned: "2025-06-30",
      rarity: "Epic",
      icon: <Star className="h-8 w-8" />,
      color: "bg-gradient-to-br from-purple-400 to-pink-500"
    },
    {
      id: 3,
      title: "High Volume Provider",
      description: "Achieved 1M+ dataset downloads",
      dateEarned: "2025-05-15",
      rarity: "Rare",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      id: 4,
      title: "Compliance Champion",
      description: "Perfect compliance record across all frameworks",
      dateEarned: "2025-04-20",
      rarity: "Epic",
      icon: <Shield className="h-8 w-8" />,
      color: "bg-gradient-to-br from-green-400 to-emerald-500"
    },
    {
      id: 5,
      title: "Developer Favorite",
      description: "Achieved 4.8+ average developer rating",
      dateEarned: "2025-03-10",
      rarity: "Rare",
      icon: <Users className="h-8 w-8" />,
      color: "bg-gradient-to-br from-indigo-400 to-purple-500"
    },
    {
      id: 6,
      title: "Revenue Milestone",
      description: "Generated $50K+ in dataset revenue",
      dateEarned: "2025-02-28",
      rarity: "Rare",
      icon: <DollarSign className="h-8 w-8" />,
      color: "bg-gradient-to-br from-emerald-400 to-teal-500"
    },
    {
      id: 7,
      title: "Innovation Leader",
      description: "First to integrate AI-powered data validation",
      dateEarned: "2025-01-15",
      rarity: "Legendary",
      icon: <Zap className="h-8 w-8" />,
      color: "bg-gradient-to-br from-yellow-400 to-red-500"
    },
    {
      id: 8,
      title: "Collaboration Master",
      description: "Successfully collaborated on 25+ AI projects",
      dateEarned: "2024-12-20",
      rarity: "Epic",
      icon: <Trophy className="h-8 w-8" />,
      color: "bg-gradient-to-br from-amber-400 to-orange-600"
    }
  ];

  const scoreHistory = [
    { month: "Jan 2025", score: 75, trend: "up" },
    { month: "Feb 2025", score: 77, trend: "up" },
    { month: "Mar 2025", score: 76, trend: "down" },
    { month: "Apr 2025", score: 79, trend: "up" },
    { month: "May 2025", score: 81, trend: "up" },
    { month: "Jun 2025", score: 78, trend: "down" },
    { month: "Jul 2025", score: 82, trend: "up" }
  ];

  const upcomingMilestones = [
    {
      title: "Elite Provider Status",
      description: "Reach overall score of 90+",
      currentProgress: 82,
      target: 90,
      estimatedDate: "August 2025",
      difficulty: "Hard"
    },
    {
      title: "Perfect Compliance",
      description: "Achieve 100% compliance score",
      currentProgress: 92,
      target: 100,
      estimatedDate: "September 2025",
      difficulty: "Medium"
    },
    {
      title: "Mega Download Milestone",
      description: "Reach 5M total downloads",
      currentProgress: 3.2,
      target: 5.0,
      estimatedDate: "October 2025",
      difficulty: "Easy"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20";
      case "Epic": return "text-purple-600 border-purple-300 bg-purple-50 dark:bg-purple-950/20";
      case "Rare": return "text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/20";
      default: return "text-gray-600 border-gray-300 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Portfolio Score</h1>
            <p className="text-muted-foreground">Track your composite score based on usage, quality, revenue, and compliance metrics.</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Score Report
            </Button>
          </div>
        </div>

        {/* Overall Score Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Overall Portfolio Score
            </CardTitle>
            <CardDescription>Composite score based on multiple performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(portfolioScore.overall)}`}>
                  {portfolioScore.overall}
                </div>
                <div className="text-lg text-muted-foreground">Out of 100</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {getTrendIcon(portfolioScore.change)}
                  <span className={portfolioScore.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {portfolioScore.change > 0 ? "+" : ""}{portfolioScore.change} from last month
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-blue-600">#{portfolioScore.ranking}</div>
                <div className="text-lg text-muted-foreground">Global Ranking</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Out of {portfolioScore.totalProviders.toLocaleString()} providers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-green-600">{portfolioScore.percentile}%</div>
                <div className="text-lg text-muted-foreground">Percentile</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Better than {portfolioScore.percentile}% of providers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-purple-600">{achievements.length}</div>
                <div className="text-lg text-muted-foreground">Achievements</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Badges earned
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
            <CardDescription>Detailed analysis of how your score is calculated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {scoreBreakdown.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <h3 className="text-lg font-medium">{item.category}</h3>
                      <Badge variant="outline">{item.weight}% weight</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                        {item.score}
                      </span>
                      <span className="text-sm text-green-600">{item.trend}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Score</div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Contribution to Total</div>
                      <div className="text-lg font-medium">{item.contribution} points</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Key Metrics</div>
                      <div className="text-sm">{item.details}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Score History</CardTitle>
            <CardDescription>Track your score progression over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-7">
              {scoreHistory.map((month, idx) => (
                <div key={idx} className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">{month.month}</div>
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(month.score)}`}>
                    {month.score}
                  </div>
                  <div className="flex justify-center">
                    {month.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Achievement Badges
            </CardTitle>
            <CardDescription>Milestones and recognitions earned for exceptional performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`border-2 ${getRarityColor(achievement.rarity)}`}>
                  <CardHeader className="text-center pb-2">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white ${achievement.color}`}>
                      {achievement.icon}
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(achievement.dateEarned).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Upcoming Milestones
            </CardTitle>
            <CardDescription>Goals and achievements within reach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingMilestones.map((milestone, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-medium mb-1">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Estimated: {milestone.estimatedDate}</span>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(milestone.difficulty)}>
                      {milestone.difficulty}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{milestone.currentProgress}/{milestone.target}</span>
                    </div>
                    <Progress 
                      value={(milestone.currentProgress / milestone.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}