import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import {
  Database,
  Upload,
  BarChart3,
  Users,
  DollarSign,
  Shield,
  Star,
  Download,
  Eye,
  Plus,
  Settings,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Handshake,
  MessageSquare,
  Key,
  Code,
  Target,
  Globe,
  PieChart,
  Lock,
  CreditCard,
  BookOpen,
  Zap,
  Building,
  AlertCircle,
  UserCheck,
  Search,
  Filter,
  Bell,
  Share2,
  Edit,
  Trash2,
  RefreshCw,
  Gauge,
  Calendar,
  MapPin,
  Briefcase,
  Award
} from "lucide-react";

const datasetSchema = z.object({
  name: z.string().min(1, "Dataset name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  dataType: z.string().min(1, "Data type is required"),
  updateFrequency: z.string().min(1, "Update frequency is required"),
  licenseType: z.string().min(1, "License type is required"),
  pricePerRecord: z.string().optional(),
  monthlySubscriptionFee: z.string().optional(),
  oneTimePurchasePrice: z.string().optional(),
  complianceLevel: z.string().min(1, "Compliance level is required")
});

export default function DataProviderEnhanced() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("revenue");
  const [filterType, setFilterType] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(datasetSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      subcategory: "",
      dataType: "",
      updateFrequency: "",
      licenseType: "",
      pricePerRecord: "",
      monthlySubscriptionFee: "",
      oneTimePurchasePrice: "",
      complianceLevel: ""
    }
  });

  // Enhanced sample data based on analysis
  const enhancedMetrics = {
    totalDatasets: 24,
    totalRevenue: "2,847,500",
    activeSubscriptions: 1847,
    avgQualityScore: 9.4,
    downloadCount: 45230,
    monthlyGrowth: 15.3,
    complianceRate: 98.5,
    apiCalls: 2845670,
    marketImpact: 8.7,
    feedbackScore: 4.8
  };

  const datasets = [
    {
      id: 1,
      name: "S&P 500 Real-time Market Data",
      description: "Real-time stock prices, volumes, and market depth data for all S&P 500 companies",
      category: "Market Data",
      subcategory: "Equity Data",
      dataType: "Real-time Stream",
      size: "2.5 TB",
      records: "15M",
      updateFrequency: "Real-time",
      qualityScore: 9.8,
      downloads: 5670,
      subscriptions: 245,
      revenue: "612,500",
      compliance: "Compliant",
      status: "Active",
      lastUpdated: "2 hours ago",
      usage: 87,
      feedback: 4.9
    },
    {
      id: 2,
      name: "Cryptocurrency Market Depth",
      description: "Order book data for top 100 cryptocurrencies across major exchanges",
      category: "Market Data", 
      subcategory: "Crypto Data",
      dataType: "Real-time Stream",
      size: "1.8 TB",
      records: "8.5M",
      updateFrequency: "Real-time",
      qualityScore: 9.5,
      downloads: 3420,
      subscriptions: 189,
      revenue: "340,200",
      compliance: "Compliant",
      status: "Active",
      lastUpdated: "1 hour ago",
      usage: 92,
      feedback: 4.7
    },
    {
      id: 3,
      name: "Economic Indicators Dataset",
      description: "Global economic indicators including GDP, inflation, unemployment rates",
      category: "Economic Data",
      subcategory: "Macroeconomic",
      dataType: "Historical + Live",
      size: "500 GB",
      records: "2.5M",
      updateFrequency: "Daily",
      qualityScore: 9.3,
      downloads: 2890,
      subscriptions: 156,
      revenue: "234,000",
      compliance: "Compliant",
      status: "Active",
      lastUpdated: "6 hours ago",
      usage: 78,
      feedback: 4.6
    },
    {
      id: 4,
      name: "ESG Risk Assessment Data",
      description: "Environmental, Social, and Governance risk scores for 5000+ companies",
      category: "Risk Data",
      subcategory: "ESG Analytics",
      dataType: "Monthly Updates",
      size: "850 GB",
      records: "1.2M",
      updateFrequency: "Monthly",
      qualityScore: 9.1,
      downloads: 1450,
      subscriptions: 98,
      revenue: "156,800",
      compliance: "Under Review",
      status: "Active",
      lastUpdated: "3 days ago",
      usage: 65,
      feedback: 4.4
    }
  ];

  const recentActivity = [
    { id: 1, type: "download", message: "S&P 500 dataset downloaded by AI Trading Co.", time: "2 mins ago", severity: "info" },
    { id: 2, type: "subscription", message: "New subscription to Crypto dataset from Hedge Fund Alpha", time: "15 mins ago", severity: "success" },
    { id: 3, type: "feedback", message: "5-star rating received on Economic Indicators dataset", time: "1 hour ago", severity: "success" },
    { id: 4, type: "compliance", message: "ESG dataset requires compliance documentation update", time: "2 hours ago", severity: "warning" },
    { id: 5, type: "api", message: "API limit reached for cryptocurrency data feed", time: "3 hours ago", severity: "warning" }
  ];

  const collaborations = [
    { id: 1, partner: "AI Trading Solutions", type: "Developer", project: "Algorithmic Trading Models", status: "Active", revenue: "$45,600" },
    { id: 2, partner: "RegTech Compliance Ltd", type: "Regulator", project: "Compliance Monitoring", status: "In Review", revenue: "$0" },
    { id: 3, partner: "QuantumFund Analytics", type: "Developer", project: "Risk Assessment Engine", status: "Active", revenue: "$32,400" },
    { id: 4, partner: "Financial Conduct Authority", type: "Regulator", project: "Market Surveillance", status: "Approved", revenue: "$0" }
  ];

  const onSubmit = (data: any) => {
    console.log("Dataset upload:", data);
    setShowUploadDialog(false);
    form.reset();
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || dataset.category.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Enhanced Data Provider Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive dataset management, revenue tracking, and collaboration platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified Provider
              </Badge>
              <Badge variant="secondary">
                <Shield className="h-4 w-4 mr-1" />
                SOC 2 Certified
              </Badge>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="datasets">Dataset Management</TabsTrigger>
              <TabsTrigger value="insights">Analytics & Insights</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Tracking</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration Hub</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Enhanced Overview with Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Datasets</p>
                        <p className="text-2xl font-bold">{enhancedMetrics.totalDatasets}</p>
                        <p className="text-xs text-green-600">+{enhancedMetrics.monthlyGrowth}% this month</p>
                      </div>
                      <Database className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">${enhancedMetrics.totalRevenue}</p>
                        <p className="text-xs text-green-600">+23% from last quarter</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                        <p className="text-2xl font-bold">{enhancedMetrics.activeSubscriptions}</p>
                        <p className="text-xs text-green-600">+156 this week</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Quality Score</p>
                        <p className="text-2xl font-bold">{enhancedMetrics.avgQualityScore}/10</p>
                        <p className="text-xs text-green-600">Above industry avg</p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Compliance Rate</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={enhancedMetrics.complianceRate} className="w-24 h-2" />
                          <span className="text-sm font-bold text-green-600">{enhancedMetrics.complianceRate}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">API Usage</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={75} className="w-24 h-2" />
                          <span className="text-sm font-bold">75%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Market Impact Score</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={enhancedMetrics.marketImpact * 10} className="w-24 h-2" />
                          <span className="text-sm font-bold text-blue-600">{enhancedMetrics.marketImpact}/10</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Satisfaction</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={enhancedMetrics.feedbackScore * 20} className="w-24 h-2" />
                          <span className="text-sm font-bold text-yellow-600">{enhancedMetrics.feedbackScore}/5</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.severity === "success" ? "bg-green-600" :
                            activity.severity === "warning" ? "bg-yellow-600" : "bg-blue-600"
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="datasets">
              {/* Enhanced Dataset Management */}
              <div className="space-y-6">
                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search datasets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="market">Market Data</SelectItem>
                      <SelectItem value="economic">Economic Data</SelectItem>
                      <SelectItem value="risk">Risk Data</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                      <SelectItem value="quality">Quality Score</SelectItem>
                      <SelectItem value="date">Last Updated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Dataset
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Upload New Dataset</DialogTitle>
                        <DialogDescription>
                          Provide dataset information and upload your data files
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dataset Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter dataset name" {...field} />
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
                                      <SelectItem value="market">Market Data</SelectItem>
                                      <SelectItem value="economic">Economic Data</SelectItem>
                                      <SelectItem value="risk">Risk Data</SelectItem>
                                      <SelectItem value="sentiment">Sentiment Data</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Describe your dataset..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="dataType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Data Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select data type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="realtime">Real-time Stream</SelectItem>
                                      <SelectItem value="historical">Historical Data</SelectItem>
                                      <SelectItem value="batch">Batch Updates</SelectItem>
                                      <SelectItem value="mixed">Historical + Live</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="updateFrequency"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Update Frequency</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select frequency" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="realtime">Real-time</SelectItem>
                                      <SelectItem value="minutely">Every Minute</SelectItem>
                                      <SelectItem value="hourly">Hourly</SelectItem>
                                      <SelectItem value="daily">Daily</SelectItem>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setShowUploadDialog(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Upload Dataset</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Dataset Grid */}
                <div className="grid gap-6">
                  {filteredDatasets.map((dataset) => (
                    <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          <div className="lg:col-span-2">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold">{dataset.name}</h3>
                              <Badge variant={dataset.status === "Active" ? "default" : "secondary"}>
                                {dataset.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{dataset.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline">{dataset.category}</Badge>
                              <Badge variant="outline">{dataset.subcategory}</Badge>
                              <Badge variant="outline">{dataset.dataType}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              Updated {dataset.lastUpdated}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>Quality Score:</span>
                              <span className="font-semibold text-green-600">{dataset.qualityScore}/10</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Size:</span>
                              <span className="font-semibold">{dataset.size}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Records:</span>
                              <span className="font-semibold">{dataset.records}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Downloads:</span>
                              <span className="font-semibold">{dataset.downloads}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Compliance:</span>
                              <Badge variant={dataset.compliance === "Compliant" ? "default" : "secondary"}>
                                {dataset.compliance}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">${dataset.revenue}</p>
                              <p className="text-sm text-muted-foreground">Total Revenue</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold">{dataset.subscriptions}</p>
                              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                            </div>
                            <div className="flex justify-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights">
              {/* Analytics & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Usage Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Dataset Adoption Rate</span>
                        <span className="font-bold text-green-600">+15.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Market Impact Score</span>
                        <span className="font-bold">{enhancedMetrics.marketImpact}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">API Calls (30d)</span>
                        <span className="font-bold">{enhancedMetrics.apiCalls.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Downloads</span>
                        <span className="font-bold">{enhancedMetrics.downloadCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5" />
                      Market Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Algorithmic Trading</span>
                        <Badge className="bg-green-600">+23% Growth</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Risk Assessment</span>
                        <Badge className="bg-blue-600">+12% Growth</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Market Sentiment</span>
                        <Badge className="bg-purple-600">+34% Growth</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ESG Analytics</span>
                        <Badge className="bg-yellow-600">+8% Growth</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Developer Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Rating</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-bold">{enhancedMetrics.feedbackScore}/5</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>5 stars</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={78} className="w-16 h-2" />
                            <span>78%</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>4 stars</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={15} className="w-16 h-2" />
                            <span>15%</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>3 stars</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={5} className="w-16 h-2" />
                            <span>5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overall Compliance</span>
                        <span className="font-bold text-green-600">{enhancedMetrics.complianceRate}%</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>GDPR Compliant</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>SOC 2 Certified</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>ISO 27001</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pending Reviews</span>
                          <Badge variant="secondary">1</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue">
              {/* Revenue Tracking */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                          <p className="text-2xl font-bold">${enhancedMetrics.totalRevenue}</p>
                          <p className="text-xs text-green-600">+23% from last quarter</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                          <p className="text-2xl font-bold">$245,800</p>
                          <p className="text-xs text-green-600">+18% from last month</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Avg Revenue/Dataset</p>
                          <p className="text-2xl font-bold">$118,646</p>
                          <p className="text-xs text-green-600">Above market avg</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue by Dataset */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="mr-2 h-5 w-5" />
                      Revenue by Dataset
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {datasets.map((dataset) => (
                        <div key={dataset.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{dataset.name}</h4>
                            <p className="text-sm text-muted-foreground">{dataset.subscriptions} subscriptions</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">${dataset.revenue}</p>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="collaboration">
              {/* Collaboration Hub */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Handshake className="mr-2 h-5 w-5" />
                        Active Collaborations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {collaborations.map((collab) => (
                          <div key={collab.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{collab.partner}</h4>
                              <p className="text-sm text-muted-foreground">{collab.project}</p>
                              <Badge variant={collab.type === "Developer" ? "default" : "secondary"}>
                                {collab.type}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                collab.status === "Active" ? "default" :
                                collab.status === "Approved" ? "default" : "secondary"
                              }>
                                {collab.status}
                              </Badge>
                              <p className="text-sm font-bold mt-1">{collab.revenue}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Communication Center
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button className="w-full" variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message Developers
                        </Button>
                        <Button className="w-full" variant="outline">
                          <Shield className="mr-2 h-4 w-4" />
                          Contact Regulators
                        </Button>
                        <Button className="w-full" variant="outline">
                          <Bell className="mr-2 h-4 w-4" />
                          Setup Alerts
                        </Button>
                        <Button className="w-full" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Reports
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Compliance Tools */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Compliance & Audit Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 border rounded-lg">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-medium mb-2">Compliance Reports</h4>
                        <p className="text-sm text-muted-foreground mb-3">Generate detailed compliance documentation</p>
                        <Button size="sm">Generate Report</Button>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h4 className="font-medium mb-2">Audit Trail</h4>
                        <p className="text-sm text-muted-foreground mb-3">Track all data access and modifications</p>
                        <Button size="sm">View Audit Log</Button>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                        <h4 className="font-medium mb-2">Risk Assessment</h4>
                        <p className="text-sm text-muted-foreground mb-3">Identify and mitigate compliance risks</p>
                        <Button size="sm">Run Assessment</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}