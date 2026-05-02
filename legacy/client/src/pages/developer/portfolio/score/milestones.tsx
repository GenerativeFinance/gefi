import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import {
  Award,
  Star,
  Trophy,
  Target,
  Crown,
  Medal,
  Zap,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Lock,
  Sparkles
} from "lucide-react";

export default function DeveloperPortfolioScoreMilestones() {
  // Sample milestones and achievements data
  const achievements = [
    {
      id: 1,
      title: "Top Developer 2025",
      description: "Ranked in top 5% of all developers on the platform",
      badge: "Elite",
      dateEarned: "July 2025",
      rarity: "Legendary",
      requirements: "Maintain 85+ overall score for 6 consecutive months",
      icon: Crown,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 border-yellow-200",
      earned: true,
      progress: 100
    },
    {
      id: 2,
      title: "Model of the Month - July 2025",
      description: "AI Trading Bot Alpha achieved highest performance in July",
      badge: "Featured",
      dateEarned: "July 2025",
      rarity: "Epic",
      requirements: "Best performing model in category for the month",
      icon: Star,
      color: "text-blue-500",
      bgColor: "bg-blue-50 border-blue-200",
      earned: true,
      progress: 100
    },
    {
      id: 3,
      title: "Innovation Pioneer",
      description: "First to implement breakthrough ML technique",
      badge: "Pioneer",
      dateEarned: "June 2025",
      rarity: "Legendary",
      requirements: "Introduce novel AI technique adopted by 10+ developers",
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-50 border-purple-200",
      earned: true,
      progress: 100
    },
    {
      id: 4,
      title: "Funding Master",
      description: "Successfully raised over $200K in total funding",
      badge: "Investor Favorite",
      dateEarned: "May 2025",
      rarity: "Epic",
      requirements: "Secure $200,000+ in cumulative funding",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50 border-green-200",
      earned: true,
      progress: 100
    },
    {
      id: 5,
      title: "Collaboration Champion",
      description: "Completed 10+ successful joint projects",
      badge: "Team Player",
      dateEarned: "April 2025",
      rarity: "Rare",
      requirements: "Complete 10 collaborative projects with 4.5+ rating",
      icon: Medal,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 border-indigo-200",
      earned: true,
      progress: 100
    },
    {
      id: 6,
      title: "Accuracy Expert",
      description: "Maintain 95%+ model accuracy for 3 months",
      badge: "Precision Master",
      dateEarned: null,
      rarity: "Epic",
      requirements: "Achieve and maintain 95%+ accuracy across all models",
      icon: Target,
      color: "text-red-500",
      bgColor: "bg-red-50 border-red-200",
      earned: false,
      progress: 87
    }
  ];

  const upcomingMilestones = [
    {
      title: "Global Impact Leader",
      description: "Models used in 50+ countries",
      rarity: "Legendary",
      progress: 76,
      target: "50 countries",
      current: "38 countries",
      estimatedCompletion: "September 2025"
    },
    {
      title: "Regulatory Compliance Master",
      description: "Pass all major regulatory audits",
      rarity: "Epic",
      progress: 60,
      target: "5 audits",
      current: "3 audits",
      estimatedCompletion: "October 2025"
    },
    {
      title: "Million Dollar Model",
      description: "Generate $1M+ in total revenue",
      rarity: "Legendary",
      progress: 45,
      target: "$1,000,000",
      current: "$450,000",
      estimatedCompletion: "December 2025"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "Epic": return "text-purple-600 bg-purple-100 border-purple-300";
      case "Rare": return "text-blue-600 bg-blue-100 border-blue-300";
      case "Common": return "text-gray-600 bg-gray-100 border-gray-300";
      default: return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return <Crown className="h-4 w-4" />;
      case "Epic": return <Sparkles className="h-4 w-4" />;
      case "Rare": return <Star className="h-4 w-4" />;
      case "Common": return <Medal className="h-4 w-4" />;
      default: return <Medal className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Milestones & Achievements</h1>
          <p className="text-muted-foreground">Track your badges, achievements, and milestone progress</p>
        </div>

        {/* Achievement Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Achievements</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Legendary Badges</p>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                </div>
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">2</p>
                </div>
                <Star className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">85%</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earned Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Earned Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.filter(achievement => achievement.earned).map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={achievement.id} className={`p-6 border-2 rounded-lg ${achievement.bgColor} hover:shadow-lg transition-shadow`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-white border`}>
                        <IconComponent className={`h-6 w-6 ${achievement.color}`} />
                      </div>
                      <Badge className={`${getRarityColor(achievement.rarity)} border`}>
                        {getRarityIcon(achievement.rarity)}
                        <span className="ml-1">{achievement.rarity}</span>
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Earned:</span>
                        <span className="font-medium">{achievement.dateEarned}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">Completed</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-white rounded border">
                      <p className="text-xs text-muted-foreground">{achievement.requirements}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* In Progress Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.filter(achievement => !achievement.earned).map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={achievement.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${achievement.bgColor} border`}>
                          <IconComponent className={`h-6 w-6 ${achievement.color}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      
                      <Badge className={`${getRarityColor(achievement.rarity)} border`}>
                        {getRarityIcon(achievement.rarity)}
                        <span className="ml-1">{achievement.rarity}</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                      
                      <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
                        {achievement.requirements}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMilestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    
                    <Badge className={`${getRarityColor(milestone.rarity)} border`}>
                      {getRarityIcon(milestone.rarity)}
                      <span className="ml-1">{milestone.rarity}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-lg font-bold">{milestone.current}</div>
                      <div className="text-sm text-muted-foreground">Current</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-lg font-bold">{milestone.target}</div>
                      <div className="text-sm text-muted-foreground">Target</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-lg font-bold">{milestone.estimatedCompletion}</div>
                      <div className="text-sm text-muted-foreground">Est. Completion</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Locked Achievements Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Future Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-600 mb-2">Platinum Developer</h3>
                <p className="text-sm text-gray-500">Reach 95+ overall score</p>
                <Badge variant="outline" className="mt-2">Legendary</Badge>
              </div>
              
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-600 mb-2">International Impact</h3>
                <p className="text-sm text-gray-500">Models used globally</p>
                <Badge variant="outline" className="mt-2">Epic</Badge>
              </div>
              
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-600 mb-2">AI Visionary</h3>
                <p className="text-sm text-gray-500">Predict market trends</p>
                <Badge variant="outline" className="mt-2">Legendary</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Button className="flex-1">
                <Trophy className="h-4 w-4 mr-2" />
                View All Achievements
              </Button>
              <Button variant="outline" className="flex-1">
                <Target className="h-4 w-4 mr-2" />
                Set New Goals
              </Button>
              <Button variant="outline" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Achievement Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}