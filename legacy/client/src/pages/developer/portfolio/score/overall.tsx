import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Info
} from "lucide-react";

export default function DeveloperPortfolioScoreOverall() {
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
      icon: Brain
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
      icon: Users
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
      icon: DollarSign
    },
    {
      category: "Compliance & Security",
      score: 91,
      weight: 15,
      description: "Adherence to regulations and security standards",
      breakdown: [
        { metric: "Regulatory Compliance", value: 95, benchmark: 90 },
        { metric: "Security Score", value: 89, benchmark: 85 },
        { metric: "Audit Results", value: 92, benchmark: 88 },
        { metric: "Data Privacy", value: 88, benchmark: 82 }
      ],
      trend: "+1.5%",
      icon: Shield
    },
    {
      category: "Innovation",
      score: 87,
      weight: 10,
      description: "Novelty and advancement in AI model development",
      breakdown: [
        { metric: "Research Impact", value: 85, benchmark: 75 },
        { metric: "Technology Stack", value: 89, benchmark: 80 },
        { metric: "Patent Applications", value: 86, benchmark: 70 },
        { metric: "Awards & Recognition", value: 88, benchmark: 65 }
      ],
      trend: "+4.2%",
      icon: Star
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return "bg-green-100 border-green-200";
    if (score >= 80) return "bg-blue-100 border-blue-200";
    if (score >= 70) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrendIcon = (trend: string) => {
    return trend.startsWith('+') ? 
      <ArrowUp className="h-4 w-4 text-green-500" /> : 
      <ArrowDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Developer Overall Score</h1>
          <p className="text-muted-foreground">Comprehensive performance assessment based on multiple metrics</p>
        </div>

        {/* Overall Score Card */}
        <Card className={`${getScoreBackground(overallScore)} border-2`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Overall Developer Score</h2>
                  <div className="flex items-center gap-2 mt-2">
                    {getTrendIcon(`+${scoreChange}`)}
                    <span className="text-sm text-muted-foreground">
                      {scoreChange > 0 ? '+' : ''}{scoreChange} points from last month
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1">Excellent performance across all categories</p>
                </div>
              </div>
              
              <div className="text-center">
                <Award className={`h-16 w-16 mx-auto mb-2 ${getScoreColor(overallScore)}`} />
                <Badge className={`${getScoreColor(overallScore)} bg-white border-2`}>
                  Top 5% Developer
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {scoreComponents.map((component, index) => {
            const IconComponent = component.icon;
            const weightedScore = (component.score * component.weight) / 100;
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getScoreBackground(component.score)}`}>
                        <IconComponent className={`h-5 w-5 ${getScoreColor(component.score)}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{component.category}</CardTitle>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(component.score)}`}>
                        {component.score}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        {getTrendIcon(component.trend)}
                        <span className="text-sm text-muted-foreground">{component.trend}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Weight and Contribution */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Weight: {component.weight}%</span>
                    <span className="font-medium">Contributes: {weightedScore.toFixed(1)} points</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress 
                      value={component.score} 
                      className="h-2"
                    />
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Performance Breakdown:</p>
                    {component.breakdown.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{item.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.value}</span>
                          <span className="text-xs text-muted-foreground">
                            (benchmark: {item.benchmark})
                          </span>
                          {item.value >= item.benchmark ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Info className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Score History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Score History & Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">6 months</div>
                <div className="text-sm text-muted-foreground">Consistent Top 10%</div>
                <div className="mt-2">
                  <Badge variant="secondary">Stable Performance</Badge>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">+12 points</div>
                <div className="text-sm text-muted-foreground">Improvement this year</div>
                <div className="mt-2">
                  <Badge className="bg-green-500 text-white">Growing</Badge>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">95th</div>
                <div className="text-sm text-muted-foreground">Percentile ranking</div>
                <div className="mt-2">
                  <Badge className="bg-purple-500 text-white">Elite</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Improvement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Increase Model Accuracy</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Focus on improving F1 scores to reach the 95+ benchmark. Consider ensemble methods.
                  </p>
                  <Badge variant="outline" className="mt-2">+3 points potential</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Expand User Base</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Marketing efforts and partnerships could help reach more users and improve adoption metrics.
                  </p>
                  <Badge variant="outline" className="mt-2">+2 points potential</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Research & Innovation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Publishing research papers and applying for patents could boost innovation scores.
                  </p>
                  <Badge variant="outline" className="mt-2">+2 points potential</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Button className="flex-1">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
              <Button variant="outline" className="flex-1">
                <BarChart3 className="h-4 w-4 mr-2" />
                Download Score Report
              </Button>
              <Button variant="outline" className="flex-1">
                <Target className="h-4 w-4 mr-2" />
                Set Improvement Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}