import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import {
  Award,
  TrendingUp,
  Shield,
  Users,
  Brain,
  DollarSign,
  Star,
  Target,
  BarChart3,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Info,
  Clock,
  Calendar,
  Zap,
  Trophy
} from "lucide-react";

export default function DeveloperPortfolioScore() {
  // Sample scoring data
  const overallScore = 89;
  const previousScore = 85;
  const scoreChange = overallScore - previousScore;

  const scoreComponents = [
    {
      category: "Model Performance",
      score: 92,
      weight: 30,
      description: "Accuracy, precision, and reliability of AI models",
      breakdown: [
        { metric: "Accuracy Rate", value: 94, benchmark: 90 },
        { metric: "Precision", value: 91, benchmark: 85 },
        { metric: "Recall", value: 89, benchmark: 88 },
        { metric: "F1 Score", value: 90, benchmark: 87 }
      ],
      trend: "+3.2%",
      icon: Brain,
      contributes: "276 points"
    },
    {
      category: "Usage & Adoption",
      score: 88,
      weight: 25,
      description: "How widely your models are used and adopted",
      breakdown: [
        { metric: "Active Users", value: 87, benchmark: 80 },
        { metric: "Subscription Rate", value: 90, benchmark: 75 },
        { metric: "Usage Growth", value: 85, benchmark: 70 },
        { metric: "Retention Rate", value: 92, benchmark: 85 }
      ],
      trend: "+5.1%",
      icon: Users,
      contributes: "220 points"
    },
    {
      category: "Funding Success",
      score: 85,
      weight: 20,
      description: "Track record of securing investments and funding",
      breakdown: [
        { metric: "Funding Amount", value: 88, benchmark: 70 },
        { metric: "Investor Count", value: 82, benchmark: 65 },
        { metric: "ROI Delivered", value: 86, benchmark: 75 },
        { metric: "Success Rate", value: 84, benchmark: 70 }
      ],
      trend: "+2.8%",
      icon: DollarSign,
      contributes: "170 points"
    },
    {
      category: "Compliance & Security",
      score: 91,
      weight: 15,
      description: "Adherence to regulations and security standards",
      breakdown: [
        { metric: "Compliance Rate", value: 95, benchmark: 85 },
        { metric: "Security Score", value: 89, benchmark: 80 },
        { metric: "Audit Results", value: 88, benchmark: 75 },
        { metric: "Documentation", value: 92, benchmark: 85 }
      ],
      trend: "+1.5%",
      icon: Shield,
      contributes: "136.5 points"
    },
    {
      category: "Community Impact",
      score: 86,
      weight: 10,
      description: "Contributions to the developer community",
      breakdown: [
        { metric: "Open Source", value: 84, benchmark: 70 },
        { metric: "Knowledge Sharing", value: 88, benchmark: 75 },
        { metric: "Mentoring", value: 85, benchmark: 70 },
        { metric: "Reviews", value: 87, benchmark: 80 }
      ],
      trend: "+4.2%",
      icon: Star,
      contributes: "86 points"
    }
  ];

  const milestones = [
    {
      id: 1,
      title: "First AI Model Deployed",
      description: "Successfully deployed your first financial AI model to production",
      status: "completed",
      completedDate: "March 15, 2025",
      points: 50,
      category: "Model Development"
    },
    {
      id: 2,
      title: "100K API Calls Milestone",
      description: "Your models have processed over 100,000 API calls",
      status: "completed",
      completedDate: "April 22, 2025",
      points: 75,
      category: "Usage & Adoption"
    },
    {
      id: 3,
      title: "First Investment Secured",
      description: "Received your first investment funding from platform investors",
      status: "completed",
      completedDate: "May 8, 2025",
      points: 100,
      category: "Funding Success"
    },
    {
      id: 4,
      title: "Compliance Certification",
      description: "Achieved full regulatory compliance for all deployed models",
      status: "completed",
      completedDate: "June 3, 2025",
      points: 60,
      category: "Compliance & Security"
    },
    {
      id: 5,
      title: "Community Contributor",
      description: "Made significant contributions to the developer community",
      status: "completed",
      completedDate: "June 18, 2025",
      points: 40,
      category: "Community Impact"
    },
    {
      id: 6,
      title: "Top 5% Developer",
      description: "Achieve a ranking in the top 5% of platform developers",
      status: "in_progress",
      progress: 78,
      points: 150,
      category: "Overall Performance"
    },
    {
      id: 7,
      title: "1M+ API Calls",
      description: "Process over 1 million API calls across all your models",
      status: "in_progress",
      progress: 45,
      points: 200,
      category: "Usage & Adoption"
    },
    {
      id: 8,
      title: "Enterprise Client",
      description: "Secure your first enterprise-level client contract",
      status: "upcoming",
      points: 300,
      category: "Business Growth"
    }
  ];

  const completedMilestones = milestones.filter(m => m.status === 'completed');
  const inProgressMilestones = milestones.filter(m => m.status === 'in_progress');
  const upcomingMilestones = milestones.filter(m => m.status === 'upcoming');

  const totalPoints = completedMilestones.reduce((sum, m) => sum + m.points, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Developer Overall Score
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive performance assessment based on multiple metrics
            </p>
          </div>

          <Tabs defaultValue="overall-score" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overall-score">Overall Score</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
            </TabsList>

            {/* Overall Score Tab */}
            <TabsContent value="overall-score" className="space-y-6">
              {/* Overall Score Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Overall Developer Score
                      </h2>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold text-blue-600">{overallScore}</span>
                        <span className="text-xl text-gray-500">/100</span>
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowUp className="w-4 h-4" />
                          <span className="text-sm font-medium">+{scoreChange} points from last month</span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Excellent performance across all categories</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-6 h-6 text-blue-600" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Top 5% Developer
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score Components */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scoreComponents.map((component, index) => {
                  const IconComponent = component.icon;
                  return (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                              <IconComponent className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{component.category}</CardTitle>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Weight: {component.weight}%
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {component.score}
                            </div>
                            <div className="text-xs text-green-600">{component.trend}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {component.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Contributes: {component.contributes}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Performance Breakdown:</h4>
                          {component.breakdown.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">{item.metric}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{item.value}</span>
                                  <span className="text-gray-500">(benchmark: {item.benchmark})</span>
                                  {item.value >= item.benchmark ? (
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <Info className="w-3 h-3 text-yellow-600" />
                                  )}
                                </div>
                              </div>
                              <Progress value={item.value} className="h-1" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones" className="space-y-6">
              {/* Milestones Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{completedMilestones.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{inProgressMilestones.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{upcomingMilestones.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
                  </CardContent>
                </Card>
              </div>

              {/* Milestone Sections */}
              <div className="space-y-8">
                {/* Completed Milestones */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Completed Milestones
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedMilestones.map((milestone) => (
                      <Card key={milestone.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{milestone.title}</h4>
                            <Badge variant="default" className="bg-green-600 text-xs">
                              +{milestone.points} pts
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {milestone.description}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant="outline" className="text-xs">
                              {milestone.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-green-600">
                              <Calendar className="w-3 h-3" />
                              <span>{milestone.completedDate}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* In Progress Milestones */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    In Progress
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inProgressMilestones.map((milestone) => (
                      <Card key={milestone.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{milestone.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              +{milestone.points} pts
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                            {milestone.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{milestone.progress}%</span>
                            </div>
                            <Progress value={milestone.progress} className="h-2" />
                          </div>
                          <Badge variant="outline" className="text-xs mt-2">
                            {milestone.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Upcoming Milestones */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Upcoming Milestones
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingMilestones.map((milestone) => (
                      <Card key={milestone.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{milestone.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              +{milestone.points} pts
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {milestone.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {milestone.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}