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

// Sample data to populate the dashboard
const sampleAnalytics: AnalyticsData = {
  totalModels: 12,
  totalFunding: "486750.00",
  totalCollaborators: 28,
  totalDeployments: 8
};

const sampleModels: ModelWithExtraData[] = [
  {
    id: 1,
    userId: "github_55703540",
    name: "Advanced Portfolio Optimizer",
    description: "AI-driven portfolio optimization using reinforcement learning and risk assessment",
    category: "Portfolio Management",
    tags: ["optimization", "risk-assessment", "reinforcement-learning"],
    fundingGoal: "75000.00",
    currentFunding: "68250.00",
    status: "deployed",
    isPublic: true,
    githubRepo: "https://github.com/user/portfolio-optimizer",
    createdAt: "2024-08-15T10:30:00Z",
    updatedAt: "2025-01-07T14:20:00Z",
    collaborators: 5,
    tests: 847,
    fundingProgress: 91
  },
  {
    id: 2,
    userId: "github_55703540",
    name: "Real-time Risk Analyzer",
    description: "Machine learning model for real-time risk assessment and stress testing",
    category: "Risk Assessment",
    tags: ["risk-analysis", "machine-learning", "real-time"],
    fundingGoal: "50000.00",
    currentFunding: "45200.00",
    status: "testing",
    isPublic: true,
    githubRepo: "https://github.com/user/risk-analyzer",
    createdAt: "2024-09-10T11:45:00Z",
    updatedAt: "2025-01-07T13:15:00Z",
    collaborators: 3,
    tests: 623,
    fundingProgress: 90
  },
  {
    id: 3,
    userId: "github_55703540",
    name: "Sentiment Trading Bot",
    description: "NLP-powered trading bot that analyzes market sentiment from news and social media",
    category: "Trading Strategies",
    tags: ["nlp", "sentiment-analysis", "trading-bot"],
    fundingGoal: "40000.00",
    currentFunding: "28500.00",
    status: "approved",
    isPublic: true,
    githubRepo: "https://github.com/user/sentiment-bot",
    createdAt: "2024-10-20T09:20:00Z",
    updatedAt: "2025-01-07T12:45:00Z",
    collaborators: 4,
    tests: 389,
    fundingProgress: 71
  },
  {
    id: 4,
    userId: "github_55703540",
    name: "ESG Score Predictor",
    description: "Deep learning model for predicting ESG scores from company financial data",
    category: "Risk Assessment",
    tags: ["esg", "deep-learning", "prediction"],
    fundingGoal: "35000.00",
    currentFunding: "15600.00",
    status: "draft",
    isPublic: false,
    githubRepo: "https://github.com/user/esg-predictor",
    createdAt: "2024-11-30T16:10:00Z",
    updatedAt: "2025-01-07T11:30:00Z",
    collaborators: 2,
    tests: 156,
    fundingProgress: 45
  }
];

const recentActivity = [
  {
    id: 1,
    type: "deployment",
    description: "Advanced Portfolio Optimizer deployed to production",
    timestamp: "1 hour ago",
    icon: Rocket,
    model: "Advanced Portfolio Optimizer"
  },
  {
    id: 2,
    type: "test",
    description: "Real-time Risk Analyzer passed 95% accuracy test",
    timestamp: "3 hours ago",
    icon: CheckCircle,
    model: "Real-time Risk Analyzer"
  },
  {
    id: 3,
    type: "funding",
    description: "Received $5,000 funding for Sentiment Trading Bot",
    timestamp: "6 hours ago",
    icon: DollarSign,
    model: "Sentiment Trading Bot"
  },
  {
    id: 4,
    type: "collaboration",
    description: "New collaborator joined ESG Score Predictor project",
    timestamp: "1 day ago",
    icon: Users,
    model: "ESG Score Predictor"
  }
];

const trainingJobs = [
  {
    id: 1,
    modelName: "Advanced Portfolio Optimizer",
    status: "completed",
    accuracy: 94.8,
    loss: 0.052,
    duration: "2h 15m",
    startTime: "2025-01-07T10:00:00Z",
    progress: 100
  },
  {
    id: 2,
    modelName: "Real-time Risk Analyzer",
    status: "running",
    accuracy: 89.2,
    loss: 0.089,
    duration: "1h 32m",
    startTime: "2025-01-07T12:30:00Z",
    progress: 75
  },
  {
    id: 3,
    modelName: "Sentiment Trading Bot",
    status: "queued",
    accuracy: 0,
    loss: 0,
    duration: "0m",
    startTime: "2025-01-07T16:00:00Z",
    progress: 0
  }
];

const deployments = [
  {
    id: 1,
    modelName: "Advanced Portfolio Optimizer",
    environment: "Production",
    status: "active",
    uptime: "99.8%",
    requests: 15847,
    latency: "45ms",
    lastDeployed: "2025-01-07T14:20:00Z"
  },
  {
    id: 2,
    modelName: "Risk Assessment Model v2",
    environment: "Staging", 
    status: "active",
    uptime: "100%",
    requests: 3426,
    latency: "32ms",
    lastDeployed: "2025-01-06T09:15:00Z"
  },
  {
    id: 3,
    modelName: "Credit Scoring AI",
    environment: "Development",
    status: "inactive",
    uptime: "0%",
    requests: 0,
    latency: "0ms",
    lastDeployed: "2025-01-05T11:30:00Z"
  }
];

export default function DeveloperDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showNewModelDialog, setShowNewModelDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics data - use sample data if API fails
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/developer/analytics"],
    initialData: sampleAnalytics,
  });

  // Fetch models - use sample data if API fails
  const { data: models = [], isLoading: modelsLoading } = useQuery<ModelWithExtraData[]>({
    queryKey: ["/api/developer/models"],
    initialData: sampleModels,
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Developer Overview</h1>
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

        {/* Main Content - Enhanced Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">My Models</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates across your development projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <activity.icon className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.model} • {activity.timestamp}</p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Plus className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Create New Model</h3>
                      <p className="text-sm text-gray-600">Start building a new AI model</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowNewModelDialog(true)} className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Upload className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Upload Dataset</h3>
                      <p className="text-sm text-gray-600">Add training data for models</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Upload Data
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">View Documentation</h3>
                      <p className="text-sm text-gray-600">API docs and tutorials</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Models Tab */}
          <TabsContent value="models" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">My Models ({models.length})</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="deployed">Deployed</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {models.map((model) => (
                <Card key={model.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {model.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        className={getStatusColor(model.status)}
                        variant="secondary"
                      >
                        {getStatusIcon(model.status)}
                        <span className="ml-1 capitalize">{model.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Category</p>
                          <p className="font-medium">{model.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tests</p>
                          <p className="font-medium">{model.tests || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Collaborators</p>
                          <p className="font-medium">{model.collaborators || 0}</p>
                        </div>
                      </div>
                      
                      {/* Funding Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Funding Progress</span>
                          <span>${parseFloat(model.currentFunding).toLocaleString()} / ${parseFloat(model.fundingGoal).toLocaleString()}</span>
                        </div>
                        <Progress value={model.fundingProgress || 0} className="h-2" />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        {model.status === "deployed" && (
                          <Button size="sm" className="flex-1">
                            <Monitor className="h-4 w-4 mr-2" />
                            Monitor
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Training Jobs
                </CardTitle>
                <CardDescription>Monitor and manage your model training processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{job.modelName}</h4>
                          <p className="text-sm text-gray-500">Duration: {job.duration}</p>
                        </div>
                        <Badge variant={job.status === "completed" ? "default" : job.status === "running" ? "secondary" : "outline"}>
                          {job.status === "running" && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                          {job.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {job.status === "queued" && <Clock className="h-3 w-3 mr-1" />}
                          {job.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Accuracy</p>
                          <p className="font-medium">{job.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Loss</p>
                          <p className="font-medium">{job.loss}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        {job.status === "running" && (
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        )}
                        {job.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Logs
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Model Deployments
                </CardTitle>
                <CardDescription>Manage your deployed models across different environments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deployments.map((deployment) => (
                    <div key={deployment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{deployment.modelName}</h4>
                          <p className="text-sm text-gray-500">{deployment.environment} Environment</p>
                        </div>
                        <Badge variant={deployment.status === "active" ? "default" : "secondary"}>
                          {deployment.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {deployment.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500">Uptime</p>
                          <p className="font-medium text-green-600">{deployment.uptime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Requests</p>
                          <p className="font-medium">{deployment.requests.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Latency</p>
                          <p className="font-medium">{deployment.latency}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Deploy</p>
                          <p className="font-medium">{new Date(deployment.lastDeployed).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {deployment.status === "active" ? (
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        ) : (
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Metrics
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Logs
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>Manage collaborators across your projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          JS
                        </div>
                        <div>
                          <p className="font-medium">John Smith</p>
                          <p className="text-sm text-gray-500">ML Engineer</p>
                        </div>
                      </div>
                      <Badge>Owner</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          AD
                        </div>
                        <div>
                          <p className="font-medium">Alice Davis</p>
                          <p className="text-sm text-gray-500">Data Scientist</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Collaborator</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          MC
                        </div>
                        <div>
                          <p className="font-medium">Mike Chen</p>
                          <p className="text-sm text-gray-500">DevOps Engineer</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Collaborator</Badge>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Invite Collaborator
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Team Communication
                  </CardTitle>
                  <CardDescription>Recent discussions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          AD
                        </div>
                        <span className="font-medium text-sm">Alice Davis</span>
                        <span className="text-xs text-gray-500">2h ago</span>
                      </div>
                      <p className="text-sm">Portfolio optimizer accuracy improved to 94.8% after hyperparameter tuning</p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                          MC
                        </div>
                        <span className="font-medium text-sm">Mike Chen</span>
                        <span className="text-xs text-gray-500">4h ago</span>
                      </div>
                      <p className="text-sm">Deployed risk analyzer to staging environment for testing</p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          JS
                        </div>
                        <span className="font-medium text-sm">John Smith</span>
                        <span className="text-xs text-gray-500">1d ago</span>
                      </div>
                      <p className="text-sm">Created new branch for sentiment analysis feature development</p>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Activity className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">98.5%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">8/8</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Models</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600">43ms</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Real-Time Model Monitoring
                </CardTitle>
                <CardDescription>Live performance metrics and alerts for deployed models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {deployments.filter(d => d.status === "active").map((deployment) => (
                    <div key={deployment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <h4 className="font-medium">{deployment.modelName}</h4>
                          <Badge variant="outline">{deployment.environment}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Alerts
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Prediction Accuracy</label>
                          <Progress value={95} className="h-3" />
                          <span className="text-xs text-gray-600">95.2% last 24h</span>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Response Time</label>
                          <Progress value={85} className="h-3" />
                          <span className="text-xs text-gray-600">{deployment.latency} avg</span>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Uptime</label>
                          <Progress value={99} className="h-3" />
                          <span className="text-xs text-gray-600">{deployment.uptime}</span>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Error Rate</label>
                          <Progress value={2} className="h-3" />
                          <span className="text-xs text-gray-600">0.2% errors</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
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
