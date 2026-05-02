import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Star, 
  DollarSign, 
  BarChart3, 
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Users,
  LineChart
} from "lucide-react";

interface ModelProfile {
  id: number;
  name: string;
  description: string;
  category: string;
  creator: string;
  price: string;
  rating: string;
  totalRatings: number;
  tags: string[];
  aiTechnique: string;
  targetUserType: string;
  financialInstrument: string;
  riskLevel: "Low" | "Medium" | "High";
  minInvestment: string;
  dataRequirements: string[];
  supportedRegions: string[];
  complianceFrameworks: string[];
  features: Record<string, boolean>;
  performance: Record<string, number>;
  isFeatured: boolean;
  isActive: boolean;
}

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case "Low": return "text-green-600 dark:text-green-400";
    case "Medium": return "text-yellow-600 dark:text-yellow-400";
    case "High": return "text-red-600 dark:text-red-400";
    default: return "text-gray-600 dark:text-gray-400";
  }
};

const formatCurrency = (value: number | string) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatPercentage = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export default function ModelProfile() {
  const params = useParams();
  const modelId = params.id;

  const { data: model, isLoading } = useQuery<ModelProfile>({
    queryKey: ["/api/ai-models", modelId],
    enabled: !!modelId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-700 rounded w-1/3"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-48 bg-slate-700 rounded"></div>
              <div className="h-48 bg-slate-700 rounded"></div>
              <div className="h-48 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Model Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              The AI model you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>AI Models</span>
            <span>/</span>
            <span>{model.category}</span>
            <span>/</span>
            <span className="text-white">{model.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{model.name}</h1>
                {model.isFeatured && (
                  <Badge variant="default" className="bg-yellow-500 text-black">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-lg text-gray-300 max-w-2xl">{model.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">By {model.creator}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{model.rating}</span>
                  <span className="text-gray-400">({model.totalRatings} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <DollarSign className="h-4 w-4 mr-2" />
                Subscribe - ${model.price}
              </Button>
              <Button variant="outline" size="lg">
                Try Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(model.performance.current_value || 0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Annual Return</p>
                  <p className={`text-2xl font-bold ${model.performance.annual_return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercentage(model.performance.annual_return)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Sharpe Ratio</p>
                  <p className="text-2xl font-bold">{model.performance.sharpe_ratio}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Max Drawdown</p>
                  <p className="text-2xl font-bold text-red-400">
                    -{model.performance.max_drawdown}%
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Model Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-semibold">{model.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">AI Technique</p>
                      <p className="font-semibold">{model.aiTechnique}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Target Users</p>
                      <p className="font-semibold">{model.targetUserType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Risk Level</p>
                      <p className={`font-semibold ${getRiskColor(model.riskLevel)}`}>
                        {model.riskLevel}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="bg-slate-700" />
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {model.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-slate-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Investment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Subscription Price</p>
                    <p className="text-2xl font-bold text-green-500">${model.price}</p>
                    <p className="text-xs text-gray-400">per month</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Minimum Investment</p>
                    <p className="font-semibold">{formatCurrency(parseFloat(model.minInvestment))}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Financial Instruments</p>
                    <p className="font-semibold">{model.financialInstrument}</p>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Target className="h-4 w-4 mr-2" />
                    Start Investment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Accuracy</p>
                      <p className="text-xl font-bold">{model.performance.accuracy}%</p>
                      <Progress value={model.performance.accuracy} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Win Rate</p>
                      <p className="text-xl font-bold">{model.performance.win_rate || 0}%</p>
                      <Progress value={model.performance.win_rate || 0} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Beta</p>
                      <p className="text-xl font-bold">{model.performance.beta || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Alpha</p>
                      <p className="text-xl font-bold text-green-500">
                        {model.performance.alpha ? formatPercentage(model.performance.alpha) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Volatility</span>
                      <span className="font-semibold">12.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Value at Risk (95%)</span>
                      <span className="font-semibold text-red-400">-2.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Conditional VaR</span>
                      <span className="font-semibold text-red-400">-3.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Downside Deviation</span>
                      <span className="font-semibold">5.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Analysis
                </CardTitle>
                <CardDescription>
                  Comprehensive risk assessment and management features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-gray-400">Risk Level</p>
                    <p className={`text-2xl font-bold ${getRiskColor(model.riskLevel)}`}>
                      {model.riskLevel}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-gray-400">Max Drawdown</p>
                    <p className="text-2xl font-bold text-red-400">
                      -{model.performance.max_drawdown}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-gray-400">Sharpe Ratio</p>
                    <p className="text-2xl font-bold text-green-500">
                      {model.performance.sharpe_ratio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Features & Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(model.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      {enabled ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="capitalize">{feature.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Compliance & Regulations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Supported Regions</p>
                  <div className="flex flex-wrap gap-2">
                    {model.supportedRegions.map((region, index) => (
                      <Badge key={index} variant="outline" className="border-slate-600">
                        <Globe className="h-3 w-3 mr-1" />
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Compliance Frameworks</p>
                  <div className="flex flex-wrap gap-2">
                    {model.complianceFrameworks.map((framework, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-900/20 text-green-300 border-green-700">
                        <Shield className="h-3 w-3 mr-1" />
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Data & Technical Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Required Data Sources</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {model.dataRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
                        <LineChart className="h-4 w-4 text-blue-400" />
                        <span className="capitalize">{requirement.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}