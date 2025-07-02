import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  Code, 
  DollarSign, 
  Upload, 
  Users, 
  TestTube, 
  Rocket, 
  GitBranch, 
  MessageSquare, 
  Award,
  Plus,
  Eye,
  Settings,
  Play,
  Download,
  TrendingUp,
  Bot,
  AlertTriangle,
  CheckCircle,
  Monitor,
  BarChart3,
  Zap,
  Activity,
  Database,
  Target,
  Clock,
  Gauge,
  LineChart,
  PieChart,
  ArrowRight,
  Pause,
  RefreshCw,
  Calendar,
  FileText,
  Filter,
  MoreHorizontal,
  TrendingDown
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DeveloperModel, ModelFunding, ModelCollaborator, ModelTest } from "@shared/schema";

const newModelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  fundingGoal: z.string().min(1, "Funding goal is required"),
  tags: z.string(),
});

type NewModelFormData = z.infer<typeof newModelSchema>;

interface AnalyticsData {
  totalModels: number;
  totalFunding: string;
  totalCollaborators: number;
  totalDeployments: number;
}

interface ModelWithExtraData extends DeveloperModel {
  collaborators?: number;
  tests?: number;
  fundingProgress?: number;
}

export default function DeveloperDashboard() {
  const [selectedTab, setSelectedTab] = useState("configure");
  const [showNewModelDialog, setShowNewModelDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/developer/analytics"],
  });

  // Fetch models
  const { data: models = [], isLoading: modelsLoading } = useQuery<ModelWithExtraData[]>({
    queryKey: ["/api/developer/models"],
  });

  // Form setup
  const form = useForm<NewModelFormData>({
    resolver: zodResolver(newModelSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      fundingGoal: "",
      tags: "",
    },
  });

  // Create model mutation
  const createModelMutation = useMutation({
    mutationFn: async (data: NewModelFormData) => {
      return await apiRequest("POST", "/api/developer/models", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Model created successfully!",
      });
      setShowNewModelDialog(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/developer/models"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-500";
      case "submitted": return "bg-blue-500";
      case "approved": return "bg-green-500";
      case "rejected": return "bg-red-500";
      case "testing": return "bg-yellow-500";
      case "deployed": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <Code className="h-4 w-4" />;
      case "submitted": return <Upload className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <AlertTriangle className="h-4 w-4" />;
      case "testing": return <TestTube className="h-4 w-4" />;
      case "deployed": return <Rocket className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  if (modelsLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Developer Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Build, test, and deploy AI financial models with comprehensive workflow management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowNewModelDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Model
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Code className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics?.totalModels || models.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Models</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${analytics?.totalFunding || "0"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Funding</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics?.totalCollaborators || "0"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Collaborators</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Rocket className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics?.totalDeployments || "0"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Deployments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Workflow Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
            <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          {/* Configure Tab */}
          <TabsContent value="configure" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Model Configuration
                  </CardTitle>
                  <CardDescription>Set up your AI model parameters and data sources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Model Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                          <SelectItem value="portfolio-optimization">Portfolio Optimization</SelectItem>
                          <SelectItem value="trading-strategy">Trading Strategy</SelectItem>
                          <SelectItem value="market-prediction">Market Prediction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Data Sources</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data sources" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stocks">Stock Data (US)</SelectItem>
                          <SelectItem value="crypto">Crypto Data</SelectItem>
                          <SelectItem value="forex">Forex Data</SelectItem>
                          <SelectItem value="options">Options Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Training Period</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Start Date" />
                        <Input placeholder="End Date" />
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Configuration
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Performance Targets
                  </CardTitle>
                  <CardDescription>Define success metrics and optimization goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Target Accuracy</label>
                      <Input placeholder="85%" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Drawdown</label>
                      <Input placeholder="10%" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sharpe Ratio</label>
                      <Input placeholder="1.5" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Annual Return</label>
                      <Input placeholder="15%" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Targets
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Monitor Tab */}
          <TabsContent value="monitor" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Activity className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">94.2%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Model Accuracy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">Live</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600">2.1s</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Real-Time Performance Monitor
                </CardTitle>
                <CardDescription>Live monitoring of your AI model's performance and predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Model Status: Active</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Prediction Accuracy (Last 24h)</label>
                      <Progress value={94} className="h-3" />
                      <span className="text-xs text-gray-600">94.2% accuracy rate</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Processing Rate</label>
                      <Progress value={78} className="h-3" />
                      <span className="text-xs text-gray-600">1,250 data points/minute</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimizer Tab */}
          <TabsContent value="optimizer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Model Optimizer
                </CardTitle>
                <CardDescription>Optimize your model parameters for better performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Optimization Parameters</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Learning Rate</label>
                        <Input defaultValue="0.001" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Batch Size</label>
                        <Input defaultValue="32" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Epochs</label>
                        <Input defaultValue="100" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Optimization Method</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="adam">Adam</SelectItem>
                            <SelectItem value="sgd">SGD</SelectItem>
                            <SelectItem value="rmsprop">RMSprop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Current Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Accuracy</span>
                        <span className="font-medium">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Loss</span>
                        <span className="font-medium">0.058</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Training Time</span>
                        <span className="font-medium">45 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Memory Usage</span>
                        <span className="font-medium">2.4 GB</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Start Optimization
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">18.7%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Annual Return</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">2.1</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-600">8.5%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600">94.2%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Results
                </CardTitle>
                <CardDescription>Detailed results from your latest model runs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Latest Test Results</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Test Date:</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Points:</span>
                          <span>10,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>45 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Performance Metrics</h4>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Precision</span>
                            <span>92.4%</span>
                          </div>
                          <Progress value={92.4} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Recall</span>
                            <span>89.7%</span>
                          </div>
                          <Progress value={89.7} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>F1 Score</span>
                            <span>91.0%</span>
                          </div>
                          <Progress value={91.0} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Results
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Performance Analysis
                </CardTitle>
                <CardDescription>Deep dive into your model's behavior and patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Feature Importance</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Market Volatility</span>
                          <span>34.2%</span>
                        </div>
                        <Progress value={34.2} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Volume Indicators</span>
                          <span>28.7%</span>
                        </div>
                        <Progress value={28.7} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Price Momentum</span>
                          <span>23.5%</span>
                        </div>
                        <Progress value={23.5} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Technical Patterns</span>
                          <span>13.6%</span>
                        </div>
                        <Progress value={13.6} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Error Analysis</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>False Positives</span>
                          <span>4.2%</span>
                        </div>
                        <Progress value={4.2} className="h-2 bg-red-100" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>False Negatives</span>
                          <span>3.8%</span>
                        </div>
                        <Progress value={3.8} className="h-2 bg-orange-100" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Prediction Lag</span>
                          <span>1.2s avg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Model Comparison
                </CardTitle>
                <CardDescription>Compare performance across different models and versions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium">Model A</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select first model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="model1">Risk Predictor v1.0</SelectItem>
                        <SelectItem value="model2">Portfolio Optimizer v2.1</SelectItem>
                        <SelectItem value="model3">Trading Strategy v1.5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Model B</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select second model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="model1">Risk Predictor v1.0</SelectItem>
                        <SelectItem value="model2">Portfolio Optimizer v2.1</SelectItem>
                        <SelectItem value="model3">Trading Strategy v1.5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Performance Comparison</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Metric</th>
                          <th className="text-center py-2">Model A</th>
                          <th className="text-center py-2">Model B</th>
                          <th className="text-center py-2">Difference</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        <tr className="border-b">
                          <td className="py-2">Accuracy</td>
                          <td className="text-center">94.2%</td>
                          <td className="text-center">91.8%</td>
                          <td className="text-center text-green-600">+2.4%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Sharpe Ratio</td>
                          <td className="text-center">2.1</td>
                          <td className="text-center">1.8</td>
                          <td className="text-center text-green-600">+0.3</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Max Drawdown</td>
                          <td className="text-center">8.5%</td>
                          <td className="text-center">12.3%</td>
                          <td className="text-center text-green-600">-3.8%</td>
                        </tr>
                        <tr>
                          <td className="py-2">Response Time</td>
                          <td className="text-center">2.1s</td>
                          <td className="text-center">3.4s</td>
                          <td className="text-center text-green-600">-1.3s</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Compare Models
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Comparison
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Model Dialog */}
        <Dialog open={showNewModelDialog} onOpenChange={setShowNewModelDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New AI Model</DialogTitle>
              <DialogDescription>
                Set up a new AI financial model for development and testing.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createModelMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Advanced Risk Predictor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your model's purpose and functionality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                          <SelectItem value="portfolio-optimization">Portfolio Optimization</SelectItem>
                          <SelectItem value="trading-strategy">Trading Strategy</SelectItem>
                          <SelectItem value="market-prediction">Market Prediction</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fundingGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Goal ($)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., machine-learning, finance, risk" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewModelDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createModelMutation.isPending}
                  >
                    {createModelMutation.isPending ? "Creating..." : "Create Model"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
}