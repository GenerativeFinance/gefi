import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  Users,
  CheckCircle,
  Target,
  BarChart3,
  Activity,
  ExternalLink,
  Clock,
  Zap,
  Brain,
  Settings,
  Download,
  Play,
  LineChart,
  PieChart,
  Calendar,
  Globe,
  Shield,
  Award
} from "lucide-react";

export default function ForecastingModel() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get the specific ARIMA/SARIMA model data
  const { data: models = [], isLoading } = useQuery({
    queryKey: ["/api/ai-models"]
  });
  
  const forecastingModel = models.find((model: any) => model.id === 5) || {
    id: 5,
    name: "Forecasting Time Series Model (ARIMA/SARIMA + ML Enhancements)",
    description: "Advanced time series forecasting model combining classical ARIMA/SARIMA methods with machine learning enhancements. Features interactive visualization, automated parameter tuning, and scenario testing for financial markets.",
    category: "Market Forecasting",
    subcategory: "Time Series Analysis",
    creator: "QuantumForecast Labs",
    rating: 4.9,
    totalRatings: 245,
    price: "399.99",
    monthlySubscribers: 890,
    accuracy: 92.5
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
            <Card className="relative border-0 bg-background/80 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive" className="text-xs">#1 Trending</Badge>
                      <Badge variant="outline">{forecastingModel.category}</Badge>
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold text-foreground mb-2">
                        {forecastingModel.name}
                      </CardTitle>
                      <CardDescription className="text-lg max-w-3xl">
                        {forecastingModel.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-xl font-semibold">{forecastingModel.rating}</span>
                        <span className="text-muted-foreground">({forecastingModel.totalRatings} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <span className="text-xl font-semibold text-green-500">+30%</span>
                        <span className="text-muted-foreground">performance</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-4">
                    <div>
                      <div className="text-3xl font-bold">${forecastingModel.price}/month</div>
                      <div className="text-muted-foreground">Professional Plan</div>
                    </div>
                    <Button size="lg" className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Subscribe
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-2xl font-bold text-green-600">{forecastingModel.accuracy}%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{forecastingModel.monthlySubscribers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Model Type</p>
                    <p className="text-xl font-bold">ARIMA+ML</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-bold text-green-600">99.9%</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="documentation">Docs</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      Model Architecture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ARIMA Components</span>
                        <Badge variant="outline">Auto-tuning (p,d,q)</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">SARIMA Components</span>
                        <Badge variant="outline">Auto-tuning (P,D,Q,s)</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ML Enhancements</span>
                        <Badge variant="secondary">Neural Networks</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Ensemble Methods</span>
                        <Badge variant="secondary">XGBoost + RF</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Forecast Horizons
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {["1 week", "1 month", "3 months", "6 months", "1 year"].map((horizon, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm">{horizon}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={95 - idx * 10} className="w-20" />
                            <span className="text-xs text-muted-foreground">{95 - idx * 10}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Use Cases & Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "Stock Price Forecasting",
                      "Commodity Price Prediction", 
                      "Currency Exchange Rate Forecasting",
                      "Economic Indicator Prediction",
                      "Portfolio Value Projection",
                      "Risk Scenario Analysis",
                      "Market Volatility Prediction",
                      "Trading Signal Generation"
                    ].map((useCase, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Core Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Real-Time Analysis", status: "Active" },
                      { name: "Backtesting Engine", status: "Active" },
                      { name: "Alert System", status: "Active" },
                      { name: "API Access", status: "Active" },
                      { name: "Custom Dashboard", status: "Active" },
                      { name: "Scenario Testing", status: "Active" }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">{feature.name}</span>
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Visualization Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      "Interactive Time Series Charts",
                      "Forecast vs Actual Overlays", 
                      "Confidence Interval Bands",
                      "Residual Diagnostic Plots",
                      "ACF/PACF Correlation Plots",
                      "Feature Importance Charts"
                    ].map((viz, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <LineChart className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{viz}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Accuracy Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">92.5%</div>
                      <p className="text-muted-foreground">Overall Accuracy</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">RMSE</span>
                        <span className="font-medium">0.045</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">MAE</span>
                        <span className="font-medium">0.032</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">MAPE</span>
                        <span className="font-medium">2.1%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Financial Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">2.2</div>
                      <p className="text-muted-foreground">Sharpe Ratio</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Max Drawdown</span>
                        <span className="font-medium text-red-600">6.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Annual Return</span>
                        <span className="font-medium text-green-600">15.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Win Rate</span>
                        <span className="font-medium">78.3%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">System Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                      <p className="text-muted-foreground">Uptime SLA</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Latency</span>
                        <span className="font-medium">&lt; 100ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Processing Speed</span>
                        <span className="font-medium">Real-time</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Data Points/sec</span>
                        <span className="font-medium">10,000+</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documentation" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Documentation & Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "API Documentation", type: "PDF", size: "2.4 MB" },
                      { name: "Implementation Guide", type: "PDF", size: "1.8 MB" },
                      { name: "Code Examples", type: "ZIP", size: "15.2 MB" },
                      { name: "Video Tutorials", type: "MP4", size: "145 MB" },
                      { name: "Best Practices", type: "PDF", size: "980 KB" }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">{doc.type} • {doc.size}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Compliance & Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium">Regulatory Compliance</div>
                          <div className="text-sm text-muted-foreground">SEC, MiFID II, GDPR, Basel III</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Certifications</div>
                          <div className="text-sm text-muted-foreground">ISO 27001, SOC 2 Type II</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="font-medium">Support</div>
                          <div className="text-sm text-muted-foreground">24/7 Technical Support</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Starter</CardTitle>
                    <CardDescription>Perfect for individual traders</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">$199<span className="text-lg text-muted-foreground">/month</span></div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Basic ARIMA modeling</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Up to 5 assets</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Daily forecasts</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Email support</li>
                    </ul>
                    <Button variant="outline" className="w-full">Get Started</Button>
                  </CardContent>
                </Card>

                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Professional
                      <Badge>Most Popular</Badge>
                    </CardTitle>
                    <CardDescription>For professional analysts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">$399<span className="text-lg text-muted-foreground">/month</span></div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />ARIMA + SARIMA + ML</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Unlimited assets</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Real-time forecasts</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Priority support</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />API access</li>
                    </ul>
                    <Button className="w-full">Subscribe Now</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For institutions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">$999<span className="text-lg text-muted-foreground">/month</span></div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Full model suite</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Custom integrations</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Dedicated support</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />SLA guarantees</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />White-label options</li>
                    </ul>
                    <Button variant="outline" className="w-full">Contact Sales</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Forecasting?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join over 890 professionals using our advanced ARIMA/SARIMA models to make accurate market predictions and improve their trading strategies.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}