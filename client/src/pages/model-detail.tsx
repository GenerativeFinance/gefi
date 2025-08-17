import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Layout from "@/components/layout/Layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  BarElement,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Scatter, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  BarElement,
  ArcElement,
  Filler
);
import {
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Brain,
  Zap,
  Target,
  ShieldCheck,
  Heart,
  Share2,
  Eye,
  ChevronRight,
  Settings2,
  Sparkles,
  ThumbsUp,
  ArrowRight,
  Download,
  Play,
  Pause,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Globe,
  Lock,
  Database,
  Code,
  FileText,
  MessageSquare,
  Calendar,
  ChevronLeft,
  Gauge
} from "lucide-react";

export default function ModelDetail() {
  // try both route patterns (support legacy and current routes)
  const [, paramsModel] = useRoute("/model/:id");
  const [, paramsMarketplace] = useRoute("/marketplace/:id");
  const [, setLocation] = useLocation();

  // resolve id from route params or fallback to parsing pathname
  const resolvedIdFromRoute = paramsModel?.id ?? paramsMarketplace?.id;
  const idFromPathname = typeof window !== "undefined"
    ? (() => {
        const m = window.location.pathname.match(/\/(?:model|marketplace)\/([^/]+)/);
        return m ? m[1] : undefined;
      })()
    : undefined;

  const idParam = resolvedIdFromRoute ?? idFromPathname;

  // Special case redirects to specialized model pages
  useEffect(() => {
    if (idParam === '5') {
      setLocation('/forecasting-model');
      return;
    }
    if (idParam === '9') {
      setLocation('/hrp-portfolio-optimization');
      return;
    }
    if (idParam === '10') {
      setLocation('/defi-anomaly-detection');
      return;
    }
    if (idParam === '6') {
      setLocation('/social-sentiment-trading');
      return;
    }
    if (idParam === '11') {
      setLocation('/defi-yield-optimizer');
      return;
    }
    if (idParam === '12') {
      setLocation('/esg-climate-risk');
      return;
    }
  }, [idParam, setLocation]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("1year");
  const [selectedRegion, setSelectedRegion] = useState("us");
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [marketCondition, setMarketCondition] = useState("normal");
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  const { data: model, isLoading, error } = useQuery({
    queryKey: ['/api/ai-models', idParam],
    queryFn: async () => {
      if (!idParam) throw new Error("No model id provided");
      const response = await apiRequest('GET', `/api/ai-models/${idParam}`);
      return response.json();
    },
    enabled: !!idParam,
    retry: false,
  });

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (!idParam) throw new Error("No model id provided");
      const response = await apiRequest('POST', `/api/ai-models/${idParam}/subscribe`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed",
        description: "You now have access to this AI model.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-models'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to be logged in to subscribe.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = () => {
    subscribeMutation.mutate();
  };

  useEffect(() => {
    if (error) {
      console.error("Error loading model:", error);
      // show a toast for non-404 errors (queryFn will throw if fetch failed)
      if ((error as any)?.message) {
        toast({
          title: "Failed to load model",
          description: String((error as any).message),
        });
      }
    }
  }, [error, toast]);

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  // Chart data generation functions
  const generateGaugeData = (value: number, label: string) => ({
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        data: [33, 33, 34],
        backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
        borderWidth: 0,
        cutout: '70%',
        rotation: 270,
        circumference: 180,
      },
    ],
  });

  const generateLossReductionData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Loss Reduction %',
        data: [8, 10, 12, 13, 14, 15, 16, 15, 14, 15, 16, 15],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  });

  const generateScatterData = () => ({
    datasets: [
      {
        label: 'Predicted vs Actual Risk',
        data: [
          { x: 10, y: 12 },
          { x: 20, y: 18 },
          { x: 30, y: 28 },
          { x: 40, y: 42 },
          { x: 50, y: 48 },
          { x: 60, y: 58 },
          { x: 70, y: 72 },
          { x: 80, y: 78 },
          { x: 90, y: 88 },
          { x: 100, y: 95 },
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: '#22c55e',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
      },
    ],
  });

  const generatePortfolioAllocationData = () => ({
    labels: ['Stocks', 'Bonds', 'Real Estate', 'Commodities', 'Cash'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#6b7280',
        ],
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff',
      },
    ],
  });

  const generateAccuracyComparisonData = () => ({
    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
    datasets: [
      {
        label: 'Risk Analyzer',
        data: [92, 94, 95, 95],
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
        borderWidth: 2,
      },
      {
        label: 'Industry Average',
        data: [85, 87, 88, 89],
        backgroundColor: '#6b7280',
        borderColor: '#6b7280',
        borderWidth: 2,
      },
    ],
  });

  // Chart options
  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
          color: '#6b7280',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Loss Reduction %',
          color: '#6b7280',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#22c55e',
        borderWidth: 1,
      },
    },
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Predicted Risk %',
          color: '#6b7280',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Actual Risk %',
          color: '#6b7280',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#22c55e',
        borderWidth: 1,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#6b7280',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#6b7280',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    },
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Model</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Unable to load the model details. Please try again later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!model) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Model Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400">
              The requested model could not be found.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          <a href="/marketplace" className="hover:text-gray-800 dark:hover:text-gray-200">
            AI Marketplace
          </a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Risk Assessment</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-800 dark:text-gray-200">Real-Time Risk Analyzer</span>
        </div>

        {/* Real-Time Risk Analyzer Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Real-Time Risk Analyzer
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Assesses portfolio risk with real-time data
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    4.9 (1,247 reviews)
                  </span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Risk Assessment
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Real-Time Analytics
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Real-Time Risk Analyzer Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Subscribers</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">800</div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of active monthly subscribers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">95%</div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Model prediction accuracy rate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Gauge className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">99.9%</div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Continuous operation metric</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-help bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Loss Reduction</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">15%</div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average portfolio loss reduction achieved</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Interactive Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Conditions:</span>
              <Select value={marketCondition} onValueChange={setMarketCondition}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="volatile">Volatile</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="crisis">Crisis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Period:</span>
              <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content - Charts and Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Gauge Chart - Accuracy Display */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-green-600" />
                      Accuracy Gauge
                    </CardTitle>
                    <CardDescription>
                      Semi-circle gauge showing 95% accuracy in green zone (80-100%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-64 flex items-center justify-center">
                      <div className="relative">
                        <Doughnut 
                          data={generateGaugeData(95, 'Accuracy')} 
                          options={gaugeOptions} 
                          width={200} 
                          height={200}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">95%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Line Graph - Loss Reduction Over Time */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-green-600" />
                      Loss Reduction Trend
                    </CardTitle>
                    <CardDescription>
                      Green line showing 15% annual loss reduction trend
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Line data={generateLossReductionData()} options={lineOptions} />
                    </div>
                  </CardContent>
                </Card>

                {/* Model Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Model Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Creator:</span>
                        <p className="font-medium">RiskTech Solutions</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level:</span>
                        <Badge variant="secondary">Low</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">AI Technique:</span>
                        <p className="font-medium">Deep Learning</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Target Users:</span>
                        <p className="font-medium">Portfolio Managers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Scatter Plot - Predicted vs Actual Risk */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Predicted vs Actual Risk Outcomes
                    </CardTitle>
                    <CardDescription>
                      Green points showing tight clustering, indicating 95% accuracy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Scatter data={generateScatterData()} options={scatterOptions} />
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio Allocation Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      Portfolio Allocation Distribution
                    </CardTitle>
                    <CardDescription>
                      Current portfolio allocation with risk-adjusted segments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Pie data={generatePortfolioAllocationData()} options={pieOptions} />
                    </div>
                  </CardContent>
                </Card>

                {/* Real-time Risk Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-red-50 dark:bg-red-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">VaR (95%)</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600">-2.4%</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 dark:bg-orange-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Beta</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">0.85</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Volatility</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">12.3%</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                {/* Accuracy Comparison Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      Performance Comparison
                    </CardTitle>
                    <CardDescription>
                      Quarterly accuracy comparison vs industry average
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Bar data={generateAccuracyComparisonData()} options={barOptions} />
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">1.85</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 dark:bg-red-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600">-5.2%</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Calmar Ratio</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">2.88</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 dark:bg-purple-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Win Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">78%</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Technical Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">API Integration</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Complete API documentation with real-time risk assessment endpoints, 
                          portfolio optimization calls, and risk alert webhooks.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Model Architecture</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Deep learning architecture utilizing LSTM networks for temporal risk patterns 
                          and transformer models for cross-asset correlations.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Data Requirements</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Real-time price feeds, historical volatility data, market sentiment indicators, 
                          and macroeconomic factors for comprehensive risk assessment.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-2 text-blue-600">$299</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">per month</p>
                </div>
                <Button 
                  className="w-full mb-4 bg-blue-600 hover:bg-blue-700" 
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? 'Subscribing...' : 'Subscribe Now'}
                </Button>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Free trial:</span>
                    <span className="text-green-600 font-medium">14 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancel anytime:</span>
                    <span className="text-green-600 font-medium">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support:</span>
                    <span className="text-blue-600 font-medium">24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-Time Risk Analyzer Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Subscribers</span>
                    <span className="font-medium text-blue-600">800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</span>
                    <span className="font-medium text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                    <span className="font-medium text-purple-600">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Loss Reduction</span>
                    <span className="font-medium text-green-600">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Low
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Min Investment</span>
                    <span className="font-medium">$10,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-orange-600" />
                  Data Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Real-time price feeds
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Historical volatility data
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Market sentiment indicators
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Macroeconomic factors
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Cross-asset correlations
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported Regions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Supported Regions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm">
                    North America
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Europe
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Asia-Pacific
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Latin America
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  Compliance & Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm">
                    <Lock className="w-3 h-3 mr-1" />
                    SOC 2 Type II
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Lock className="w-3 h-3 mr-1" />
                    ISO 27001
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Lock className="w-3 h-3 mr-1" />
                    GDPR
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Lock className="w-3 h-3 mr-1" />
                    SEC Compliant
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Lock className="w-3 h-3 mr-1" />
                    MiFID II
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Performance Highlights */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Performance Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Best Month</span>
                    <span className="font-medium text-green-600">+22.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Win Rate</span>
                    <span className="font-medium text-green-600">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Monthly Return</span>
                    <span className="font-medium text-green-600">+8.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score</span>
                    <span className="font-medium text-green-600">Low (2/10)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}