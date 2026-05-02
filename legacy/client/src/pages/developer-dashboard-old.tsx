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
  MoreHorizontal
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

interface DeveloperModelWithStats extends DeveloperModel {
  collaborators?: ModelCollaborator[];
  funding?: ModelFunding[];
  tests?: ModelTest[];
  fundingProgress?: number;
}

export default function DeveloperDashboard() {
  const [selectedTab, setSelectedTab] = useState("configure");
  const [showNewModelDialog, setShowNewModelDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: models = [], isLoading: modelsLoading } = useQuery<DeveloperModelWithStats[]>({
    queryKey: ["/api/developer/models"],
    retry: false,
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/developer/analytics"],
    retry: false,
  });

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

  const createModelMutation = useMutation({
    mutationFn: async (data: NewModelFormData) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('fundingGoal', data.fundingGoal);
      formData.append('tags', data.tags);
      
      return apiRequest('POST', '/api/developer/models', formData);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Developer Dashboard</h1>
            <p className="text-muted-foreground">Build, fund, and deploy AI financial models</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={showNewModelDialog} onOpenChange={setShowNewModelDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Financial Model
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New AI Model</DialogTitle>
                <DialogDescription>
                  Submit your AI financial model for crowdfunding and collaboration
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
                          <Textarea placeholder="Describe your model's purpose and capabilities..." {...field} />
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
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                            <SelectItem value="portfolio_optimization">Portfolio Optimization</SelectItem>
                            <SelectItem value="market_prediction">Market Prediction</SelectItem>
                            <SelectItem value="fraud_detection">Fraud Detection</SelectItem>
                            <SelectItem value="trading_strategy">Trading Strategy</SelectItem>
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
                          <Input type="number" placeholder="5000" {...field} />
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
                        <FormLabel>Tags (comma-separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="machine learning, neural networks, python" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowNewModelDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createModelMutation.isPending}>
                      {createModelMutation.isPending ? "Creating..." : "Create Model"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Bot className="h-4 w-4 mr-2" />
              New Trade Bot
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{models.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${models.reduce((sum, model) => sum + parseFloat(model.fundingRaised || "0"), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Collaborators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {models.reduce((sum, model) => sum + (model.collaborators?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                +3 this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deployed Models</CardTitle>
              <Rocket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {models.filter(model => model.status === "deployed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {models.filter(model => model.status === "deployed").length > 0 ? "Active" : "None yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
            <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on your models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {models.slice(0, 3).map((model) => (
                      <div key={model.id} className="flex items-center space-x-4">
                        <div className={`rounded-full p-2 ${getStatusColor(model.status)}`}>
                          {getStatusIcon(model.status)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{model.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Status: {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(model.updatedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {models.length === 0 && (
                      <p className="text-sm text-muted-foreground">No models yet. Create your first model to get started!</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks for model development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Upload className="h-6 w-6 mb-2" />
                      Upload Model
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <TestTube className="h-6 w-6 mb-2" />
                      Run Tests
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      Invite Collaborators
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Rocket className="h-6 w-6 mb-2" />
                      Deploy Model
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <Card key={model.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <Badge variant="secondary" className={getStatusColor(model.status)}>
                        {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Funding Progress</span>
                        <span>${parseFloat(model.fundingRaised || "0").toLocaleString()} / ${parseFloat(model.fundingGoal).toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={((parseFloat(model.fundingRaised || "0") / parseFloat(model.fundingGoal)) * 100)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Collaborators: {model.collaborators?.length || 0}</span>
                      <span>Tests: {model.tests?.filter(t => t.status === "passed").length || 0} passed</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      {model.status === "approved" && (
                        <Button size="sm" className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                      )}
                      {model.status === "deployed" && (
                        <Button size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          API
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {models.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center h-40">
                    <Code className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-semibold mb-2">No models yet</p>
                    <p className="text-muted-foreground text-center mb-4">
                      Create your first AI financial model to start building, collaborating, and raising funds.
                    </p>
                    <Button onClick={() => setShowNewModelDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Financial Model
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="funding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Funding Overview</CardTitle>
                <CardDescription>Track funding progress across all your models</CardDescription>
              </CardHeader>
              <CardContent>
                {models.length > 0 ? (
                  <div className="space-y-4">
                    {models.map((model) => (
                      <div key={model.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{model.name}</h4>
                          <Badge variant="outline">{model.category}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Goal: ${parseFloat(model.fundingGoal).toLocaleString()}</span>
                            <span>Raised: ${parseFloat(model.fundingRaised || "0").toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={((parseFloat(model.fundingRaised || "0") / parseFloat(model.fundingGoal)) * 100)} 
                            className="h-2" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.round((parseFloat(model.fundingRaised || "0") / parseFloat(model.fundingGoal)) * 100)}% funded</span>
                            <span>Investors: {model.funding?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No models to display funding information for.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>Manage collaborators and team communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>Collaboration features coming soon!</p>
                  <p className="text-sm">Real-time editing, version control, and team chat will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Deployment</CardTitle>
                <CardDescription>Deploy your models as APIs and monitor their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Rocket className="h-12 w-12 mx-auto mb-4" />
                  <p>Deployment features coming soon!</p>
                  <p className="text-sm">One-click deployment, API management, and monitoring will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}