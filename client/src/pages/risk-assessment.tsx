import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  DollarSign,
  Clock,
  User,
  FileText,
  Calculator,
  PieChart,
  Activity,
  Zap
} from "lucide-react";

interface RiskProfile {
  id: number;
  userId: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: number;
  financialGoals: string[];
  currentIncome: number;
  netWorth: number;
  age: number;
  experience: 'beginner' | 'intermediate' | 'expert';
  riskCapacity: number;
  questionnaire: {
    riskComfort: number;
    volatilityTolerance: number;
    lossReaction: string;
    investmentKnowledge: number;
    financialStability: number;
  };
  lastAssessment: string;
  riskScore: number;
}

interface RiskMetrics {
  portfolioRisk: number;
  valueAtRisk: number;
  expectedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  correlationRisk: number;
  concentrationRisk: number;
}

export default function RiskAssessment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({
    age: 30,
    income: 50000,
    netWorth: 100000,
    investmentHorizon: 10,
    riskTolerance: 5,
    experience: 'intermediate',
    financialGoals: [],
    volatilityComfort: 5,
    lossReaction: '',
    investmentKnowledge: 5,
    financialStability: 5
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current risk profile
  const { data: riskProfile } = useQuery({
    queryKey: ["/api/risk-assessment/profile"]
  });

  // Fetch risk metrics
  const { data: riskMetrics } = useQuery({
    queryKey: ["/api/risk-assessment/metrics"]
  });

  // Fetch risk recommendations
  const { data: recommendations = [] } = useQuery({
    queryKey: ["/api/risk-assessment/recommendations"]
  });

  const saveAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/risk-assessment", data);
    },
    onSuccess: () => {
      toast({
        title: "Risk Assessment Saved",
        description: "Your risk profile has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/risk-assessment"] });
    },
    onError: () => {
      toast({
        title: "Assessment Failed",
        description: "Failed to save risk assessment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const calculateRiskScore = () => {
    const ageScore = Math.max(0, (65 - assessmentData.age) / 65 * 20);
    const horizonScore = Math.min(20, assessmentData.investmentHorizon * 2);
    const toleranceScore = assessmentData.riskTolerance * 2;
    const experienceScore = {
      'beginner': 5,
      'intermediate': 10,
      'expert': 15
    }[assessmentData.experience] || 10;
    const stabilityScore = assessmentData.financialStability * 2;
    const knowledgeScore = assessmentData.investmentKnowledge * 1.5;
    
    return Math.round(ageScore + horizonScore + toleranceScore + experienceScore + stabilityScore + knowledgeScore);
  };

  const getRiskCategory = (score: number) => {
    if (score <= 30) return { category: 'Conservative', color: 'bg-green-500', description: 'Low risk, stable returns' };
    if (score <= 60) return { category: 'Moderate', color: 'bg-yellow-500', description: 'Balanced risk and return' };
    return { category: 'Aggressive', color: 'bg-red-500', description: 'High risk, high potential return' };
  };

  const handleSaveAssessment = () => {
    saveAssessmentMutation.mutate({
      ...assessmentData,
      riskScore: calculateRiskScore(),
      completedAt: new Date().toISOString()
    });
  };

  const riskScore = calculateRiskScore();
  const riskCategory = getRiskCategory(riskScore);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Risk Management Assessment
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive risk analysis and profile management for optimal portfolio allocation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Report
              </Button>
              <Button onClick={handleSaveAssessment} disabled={saveAssessmentMutation.isPending}>
                <Zap className="h-4 w-4 mr-2" />
                {saveAssessmentMutation.isPending ? "Saving..." : "Save Assessment"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="assessment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
              <TabsTrigger value="profile">Current Profile</TabsTrigger>
              <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            {/* Risk Assessment Tab */}
            <TabsContent value="assessment" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assessment Form */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>
                        Basic information to assess your investment profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            value={assessmentData.age}
                            onChange={(e) => setAssessmentData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="income">Annual Income ($)</Label>
                          <Input
                            id="income"
                            type="number"
                            value={assessmentData.income}
                            onChange={(e) => setAssessmentData(prev => ({ ...prev, income: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="netWorth">Net Worth ($)</Label>
                          <Input
                            id="netWorth"
                            type="number"
                            value={assessmentData.netWorth}
                            onChange={(e) => setAssessmentData(prev => ({ ...prev, netWorth: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="horizon">Investment Horizon (years)</Label>
                          <Input
                            id="horizon"
                            type="number"
                            value={assessmentData.investmentHorizon}
                            onChange={(e) => setAssessmentData(prev => ({ ...prev, investmentHorizon: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Investment Experience</Label>
                        <Select 
                          value={assessmentData.experience} 
                          onValueChange={(value: 'beginner' | 'intermediate' | 'expert') => 
                            setAssessmentData(prev => ({ ...prev, experience: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                            <SelectItem value="intermediate">Intermediate (3-7 years)</SelectItem>
                            <SelectItem value="expert">Expert (8+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Risk Tolerance Assessment
                      </CardTitle>
                      <CardDescription>
                        Help us understand your comfort level with investment risk
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label>Risk Tolerance Level: {assessmentData.riskTolerance}/10</Label>
                        <Slider
                          value={[assessmentData.riskTolerance]}
                          onValueChange={(value) => setAssessmentData(prev => ({ ...prev, riskTolerance: value[0] }))}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Conservative</span>
                          <span>Aggressive</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Volatility Comfort Level: {assessmentData.volatilityComfort}/10</Label>
                        <Slider
                          value={[assessmentData.volatilityComfort]}
                          onValueChange={(value) => setAssessmentData(prev => ({ ...prev, volatilityComfort: value[0] }))}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Low Volatility</span>
                          <span>High Volatility</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Investment Knowledge: {assessmentData.investmentKnowledge}/10</Label>
                        <Slider
                          value={[assessmentData.investmentKnowledge]}
                          onValueChange={(value) => setAssessmentData(prev => ({ ...prev, investmentKnowledge: value[0] }))}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Beginner</span>
                          <span>Expert</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Financial Stability: {assessmentData.financialStability}/10</Label>
                        <Slider
                          value={[assessmentData.financialStability]}
                          onValueChange={(value) => setAssessmentData(prev => ({ ...prev, financialStability: value[0] }))}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Unstable</span>
                          <span>Very Stable</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>How would you react to a 20% portfolio loss?</Label>
                        <RadioGroup 
                          value={assessmentData.lossReaction} 
                          onValueChange={(value) => setAssessmentData(prev => ({ ...prev, lossReaction: value }))}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="panic" id="panic" />
                            <Label htmlFor="panic">Panic and sell immediately</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="concerned" id="concerned" />
                            <Label htmlFor="concerned">Be very concerned and consider selling</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hold" id="hold" />
                            <Label htmlFor="hold">Hold and wait for recovery</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="buy" id="buy" />
                            <Label htmlFor="buy">Buy more at lower prices</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Score Card */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Risk Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{riskScore}</div>
                        <div className="text-sm text-muted-foreground">out of 100</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Risk Category</span>
                          <Badge className={`${riskCategory.color} text-white`}>
                            {riskCategory.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {riskCategory.description}
                        </p>
                      </div>

                      <Progress value={riskScore} className="w-full" />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Age Factor</span>
                          <span>{Math.round((65 - assessmentData.age) / 65 * 20)}/20</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time Horizon</span>
                          <span>{Math.min(20, assessmentData.investmentHorizon * 2)}/20</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Tolerance</span>
                          <span>{assessmentData.riskTolerance * 2}/20</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Experience</span>
                          <span>{({ 'beginner': 5, 'intermediate': 10, 'expert': 15 }[assessmentData.experience] || 10)}/15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Financial Stability</span>
                          <span>{assessmentData.financialStability * 2}/20</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Current Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Category</span>
                      <Badge variant="outline">{riskProfile?.riskTolerance || 'Not Set'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Investment Horizon</span>
                      <span>{riskProfile?.investmentHorizon || 'N/A'} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience Level</span>
                      <span className="capitalize">{riskProfile?.experience || 'Not Set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Assessment</span>
                      <span>{riskProfile?.lastAssessment ? new Date(riskProfile.lastAssessment).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Financial Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Income</span>
                      <span>${(riskProfile?.currentIncome || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Worth</span>
                      <span>${(riskProfile?.netWorth || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Capacity</span>
                      <span>{riskProfile?.riskCapacity || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Score</span>
                      <span className="font-bold">{riskProfile?.riskScore || 0}/100</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Financial Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {riskProfile?.financialGoals?.length > 0 ? (
                      <div className="space-y-2">
                        {riskProfile.financialGoals.map((goal: string, index: number) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No goals set yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Risk Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolio Risk</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskMetrics?.portfolioRisk || 0}%</div>
                    <p className="text-xs text-muted-foreground">
                      Overall portfolio risk level
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Value at Risk</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(riskMetrics?.valueAtRisk || 0).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      95% confidence, 1-day horizon
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expected Return</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskMetrics?.expectedReturn || 0}%</div>
                    <p className="text-xs text-muted-foreground">
                      Annual expected return
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskMetrics?.sharpeRatio || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Risk-adjusted return measure
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskMetrics?.maxDrawdown || 0}%</div>
                    <p className="text-xs text-muted-foreground">
                      Maximum historical loss
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Volatility</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskMetrics?.volatility || 0}%</div>
                    <p className="text-xs text-muted-foreground">
                      Price volatility measure
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Correlation Risk</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskMetrics?.correlationRisk || 0}%</div>
                    <p className="text-xs text-muted-foreground">
                      Asset correlation risk
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Concentration Risk</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskMetrics?.concentrationRisk || 0}%</div>
                    <p className="text-xs text-muted-foreground">
                      Portfolio concentration risk
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Risk Management Recommendations
                  </CardTitle>
                  <CardDescription>
                    AI-powered suggestions to optimize your risk profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recommendations.length > 0 ? (
                    <div className="space-y-4">
                      {recommendations.map((rec: any, index: number) => (
                        <div key={index} className="border-l-4 border-primary pl-4 py-2">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <p className="text-muted-foreground text-sm">{rec.description}</p>
                          <div className="mt-2">
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                              {rec.priority} priority
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Critical Recommendations</h3>
                      <p className="text-muted-foreground">
                        Your current risk profile appears well-balanced. Continue monitoring your portfolio regularly.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}