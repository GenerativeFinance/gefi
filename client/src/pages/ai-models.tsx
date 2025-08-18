import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import ContextualMobileNav from "@/components/layout/contextual-mobile-nav";
import { 
  Bot, 
  Star, 
  TrendingUp, 
  DollarSign, 
  Search,
  Filter,
  Plus,
  Eye,
  BarChart3,
  ExternalLink,
  Activity,
  Users,
  Clock,
  CheckCircle,
  Target,
  MessageSquare,
  AlertTriangle,
  FileText,
  Wallet
} from "lucide-react";
import OnchainPaymentModal from "@/components/OnchainPaymentModal";

export default function AIModels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("performance");
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [modelDetailsOpen, setModelDetailsOpen] = useState(false);
  const [onchainPaymentOpen, setOnchainPaymentOpen] = useState(false);
  const [paymentModelId, setPaymentModelId] = useState<number | null>(null);

  const { data: aiModels = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/ai-models"]
  });

  const { data: userModels = [], isLoading: userModelsLoading } = useQuery<any[]>({
    queryKey: ["/api/portfolio/ai-models"]
  });

  const filteredModels = aiModels.filter((model: any) => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || model.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedModels = [...filteredModels].sort((a: any, b: any) => {
    switch (sortBy) {
      case "performance":
        return (b.performance || 0) - (a.performance || 0);
      case "price":
        return (a.pricing?.monthly || 0) - (b.pricing?.monthly || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "subscribers":
        return (b.subscribers || 0) - (a.subscribers || 0);
      default:
        return 0;
    }
  });

  const isUserSubscribed = (modelId: number) => {
    return userModels.some((userModel: any) => userModel.aiModelId === modelId);
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600 bg-green-100";
    if (performance >= 75) return "text-blue-600 bg-blue-100";
    if (performance >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const handleOnchainPayment = (modelId: number) => {
    setPaymentModelId(modelId);
    setOnchainPaymentOpen(true);
  };

  const handleCloseOnchainPayment = () => {
    setOnchainPaymentOpen(false);
    setPaymentModelId(null);
  };

  if (isLoading || userModelsLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded"></div>
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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Mobile Navigation for AI Models */}
          <ContextualMobileNav context="models" />
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                AI Models Portfolio
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your subscribed AI models and discover new ones
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Browse Models
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Models</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userModels.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.2%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,247</div>
                <p className="text-xs text-muted-foreground">
                  +$180 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+24.7%</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search AI models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                <SelectItem value="Portfolio Management">Portfolio Management</SelectItem>
                <SelectItem value="Trading Strategies">Trading Strategies</SelectItem>
                <SelectItem value="Market Forecasting">Market Forecasting</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="subscribers">Subscribers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedModels.map((model: any) => (
              <Card key={model.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {model.name}
                        {isUserSubscribed(model.id) && (
                          <Badge variant="default" className="text-xs">
                            Subscribed
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {model.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline">{model.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">
                        {model.rating || 4.5}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Performance</span>
                      <Badge className={getPerformanceColor(model.accuracy || model.performance || 85)}>
                        {model.accuracy || model.performance || 85}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Cost</span>
                      <span className="font-semibold">
                        ${model.price || model.pricing?.monthly || 149}/mo
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Subscribers</span>
                      <span className="text-sm">{model.monthlySubscribers || model.subscribers || 1247}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          // Navigate to individual model pages for specialized models
                          if (model.id === 5) {
                            window.location.href = '/forecasting-model';
                          } else if (model.id === 9) {
                            window.location.href = '/hrp-portfolio-optimization';
                          } else {
                            setSelectedModel(model);
                            setModelDetailsOpen(true);
                          }
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {!isUserSubscribed(model.id) ? (
                        <div className="flex gap-1 flex-1">
                          <Button size="sm" className="flex-1">
                            Subscribe
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleOnchainPayment(model.id)}
                            title="Pay with Crypto"
                          >
                            <Wallet className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="secondary" size="sm" className="flex-1">
                          Manage
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedModels.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No AI models found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all available models.
                </p>
                <Button>Browse All Models</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Model Details Dialog */}
        <Dialog open={modelDetailsOpen} onOpenChange={setModelDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                {selectedModel?.name || "AI Model Details"}
              </DialogTitle>
            </DialogHeader>
            
            {selectedModel && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">ML Task</Label>
                    <p className="text-sm font-medium">{selectedModel.category || "Price Prediction"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Model Accuracy</Label>
                    <p className="text-sm font-medium text-green-600">{selectedModel.performance || 89}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Current Status</Label>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Participants</Label>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedModel.subscribers || 1247}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg text-green-600">
                        {selectedModel.performance?.accuracy || selectedModel.accuracy || 89}%
                      </div>
                      <div className="text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg text-blue-600">
                        {selectedModel.performance?.sharpeRatio || 1.47}
                      </div>
                      <div className="text-muted-foreground">Sharpe Ratio</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-lg text-purple-600">
                        {selectedModel.performance?.maxDrawdown || 8.2}%
                      </div>
                      <div className="text-muted-foreground">Max Drawdown</div>
                    </div>
                  </div>
                  
                  {/* Extended Performance Metrics for ARIMA/SARIMA Model */}
                  {selectedModel.performance?.rmse && !selectedModel.performance?.auc && (
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-lg text-blue-600">
                          {selectedModel.performance.rmse}
                        </div>
                        <div className="text-muted-foreground">RMSE</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-lg text-green-600">
                          {selectedModel.performance.mae}
                        </div>
                        <div className="text-muted-foreground">MAE</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-lg text-orange-600">
                          {selectedModel.performance.mape}%
                        </div>
                        <div className="text-muted-foreground">MAPE</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Extended Performance Metrics for Credit Risk Models */}
                  {selectedModel.performance?.auc && !selectedModel.performance?.esgCorrelation && (
                    <div className="grid grid-cols-4 gap-3 mt-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-lg text-blue-600">
                          {selectedModel.performance.auc}
                        </div>
                        <div className="text-muted-foreground">AUC</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-lg text-green-600">
                          {selectedModel.performance.precision}
                        </div>
                        <div className="text-muted-foreground">Precision</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-lg text-purple-600">
                          {selectedModel.performance.recall}
                        </div>
                        <div className="text-muted-foreground">Recall</div>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="font-semibold text-lg text-indigo-600">
                          {selectedModel.performance.f1Score}
                        </div>
                        <div className="text-muted-foreground">F1-Score</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Extended Performance Metrics for ESG Models */}
                  {selectedModel.performance?.esgCorrelation && (
                    <div className="grid grid-cols-4 gap-3 mt-4 text-sm">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-lg text-green-600">
                          {selectedModel.performance.esgCorrelation}
                        </div>
                        <div className="text-muted-foreground">ESG Correlation</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-lg text-blue-600">
                          {selectedModel.performance.climateAccuracy}
                        </div>
                        <div className="text-muted-foreground">Climate Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-lg text-orange-600">
                          {selectedModel.performance.coverageGlobal}
                        </div>
                        <div className="text-muted-foreground">Global Coverage</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-lg text-purple-600">
                          {selectedModel.performance.dataFreshness}
                        </div>
                        <div className="text-muted-foreground">Data Freshness</div>
                      </div>
                    </div>
                  )}

                  {/* Extended Performance Metrics for NLP Models */}
                  {selectedModel.performance?.sentimentAccuracy && (
                    <div className="grid grid-cols-4 gap-3 mt-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-lg text-blue-600">
                          {selectedModel.performance.sentimentAccuracy}
                        </div>
                        <div className="text-muted-foreground">Sentiment Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-lg text-green-600">
                          {selectedModel.performance.entityF1Score}
                        </div>
                        <div className="text-muted-foreground">Entity F1-Score</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-lg text-purple-600">
                          {selectedModel.performance.processingSpeed}
                        </div>
                        <div className="text-muted-foreground">Processing Speed</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-lg text-orange-600">
                          {selectedModel.performance.languageSupport}
                        </div>
                        <div className="text-muted-foreground">Languages</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical Specifications for Time Series Models */}
                {selectedModel.technicalSpecs && !selectedModel.uiComponents && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Technical Specifications
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Model Types</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedModel.technicalSpecs.modelTypes?.map((type: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Forecast Horizons</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedModel.technicalSpecs.forecastHorizons?.map((horizon: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {horizon}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Visualizations</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {selectedModel.technicalSpecs.visualizations?.map((viz: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{viz}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Use Cases</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {selectedModel.useCases?.map((useCase: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-blue-500" />
                              <span>{useCase}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Credit Risk Model Specifications */}
                {selectedModel.technicalSpecs && selectedModel.uiComponents && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Credit Risk Model Architecture
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Model Types</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedModel.technicalSpecs.modelTypes?.map((type: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Target Variables</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedModel.technicalSpecs.targetVariables?.map((target: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {target}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Explainable AI (XAI) Tools</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {selectedModel.technicalSpecs.explainabilityTools?.map((tool: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                              <span>{tool}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Stress Testing Scenarios</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {selectedModel.technicalSpecs.stressTestingScenarios?.map((scenario: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-orange-500" />
                              <span>{scenario}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UI Dashboard Components for Credit Risk Models */}
                {selectedModel.uiComponents && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      UI Dashboard Components
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Input Panel (Left Sidebar)</h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.uiComponents.inputPanel?.map((component: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{component}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Main Dashboard (Center)</h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.uiComponents.mainDashboard?.map((component: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <BarChart3 className="h-3 w-3 text-purple-500" />
                                <span>{component}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Insights Panel (Right)</h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.uiComponents.insightsPanel?.map((component: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <Target className="h-3 w-3 text-indigo-500" />
                                <span>{component}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Export & Reporting</h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.uiComponents.exportReporting?.map((component: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <ExternalLink className="h-3 w-3 text-gray-500" />
                                <span>{component}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ESG & Sustainability Model Specifications */}
                {selectedModel.sustainabilityMetrics && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      ESG & Climate Risk Dashboard
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">ESG Components</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Environmental: {selectedModel.technicalSpecs?.esgComponents?.environmental?.substring(0, 40)}...</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Social: {selectedModel.technicalSpecs?.esgComponents?.social?.substring(0, 40)}...</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span>Governance: {selectedModel.technicalSpecs?.esgComponents?.governance?.substring(0, 40)}...</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Climate Risk Types</h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.technicalSpecs?.climateRiskTypes?.map((risk: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <Target className="h-3 w-3 text-orange-500" />
                                <span>{risk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Alternative Data Sources</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {selectedModel.technicalSpecs?.alternativeDataSources?.map((source: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                              <span>{source}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Scenario Modeling</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {selectedModel.technicalSpecs?.scenarioModeling?.map((scenario: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3 text-indigo-500" />
                              <span>{scenario}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ESG Executive Reporting Features */}
                {selectedModel.uiComponents?.executiveReporting && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Executive Reporting & Compliance
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Executive Features</h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.uiComponents.executiveReporting?.map((feature: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-gray-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Regulatory Alignment</h5>
                          <div className="space-y-1 text-xs">
                            {Object.entries(selectedModel.regulatoryAlignment || {}).map(([key, value], idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{key.toUpperCase()}: {typeof value === 'string' ? value.substring(0, 30) + '...' : String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NLP & Text Analysis Model Specifications */}
                {selectedModel.nlpAnalysisTypes && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      NLP Analysis & Text Processing
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Sentiment Analysis</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Types: {selectedModel.nlpAnalysisTypes.sentimentAnalysis?.types?.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Confidence: {selectedModel.nlpAnalysisTypes.sentimentAnalysis?.confidence}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span>Granularity: {selectedModel.nlpAnalysisTypes.sentimentAnalysis?.granularity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Entity Recognition</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>Financial: {selectedModel.nlpAnalysisTypes.entityRecognition?.financialEntities}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                              <span>Geographic: {selectedModel.nlpAnalysisTypes.entityRecognition?.geographicEntities}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-purple-500" />
                              <span>Temporal: {selectedModel.nlpAnalysisTypes.entityRecognition?.temporalEntities}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Topic Classification</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-orange-500" />
                              <span>Categories: {selectedModel.nlpAnalysisTypes.topicClassification?.categories?.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3 text-orange-600" />
                              <span>Method: {selectedModel.nlpAnalysisTypes.topicClassification?.confidence}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Document Summarization</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-indigo-500" />
                              <span>Types: {selectedModel.nlpAnalysisTypes.documentSummarization?.types?.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-indigo-600" />
                              <span>Length: {selectedModel.nlpAnalysisTypes.documentSummarization?.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk & Opportunity Signals for NLP Models */}
                {selectedModel.riskOpportunitySignals && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk & Opportunity Detection
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-red-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            Risk Flags
                          </h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.riskOpportunitySignals.riskFlags?.map((flag: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>{flag}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            Opportunity Signals
                          </h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.riskOpportunitySignals.opportunitySignals?.map((signal: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{signal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Processing Features for NLP Models */}
                {selectedModel.technicalSpecs?.textProcessingFeatures && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Advanced Text Processing
                    </h4>
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Processing Capabilities</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {selectedModel.technicalSpecs.textProcessingFeatures?.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-gray-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Model Architectures</h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.technicalSpecs.modelArchitectures?.map((arch: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>{arch}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Entity Types</h5>
                          <div className="space-y-1 text-xs">
                            {selectedModel.technicalSpecs.entityTypes?.map((type: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>{type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Use Cases Section */}
                {selectedModel.useCases && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Use Cases & Applications
                    </h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {selectedModel.useCases?.map((useCase: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Model update submitted</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Earned 15 GeFI reward</span>
                      <span className="text-muted-foreground">5 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Training session completed</span>
                      <span className="text-muted-foreground">1 day ago</span>
                    </div>
                  </div>
                </div>

                {/* Contract Details */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Contract Details
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Contract Address</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const contractAddress = selectedModel.contractAddress || '0xf1_' + selectedModel.id + '_model_contract';
                            window.open(`https://etherscan.io/address/${contractAddress}`, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View on Explorer
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {selectedModel.contractAddress || `0xf1_${selectedModel.id}_model_contract`}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Monthly Fee:</span>
                        <div className="font-medium text-green-600">${selectedModel.price || selectedModel.pricing?.monthly || 149}/month</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Developer Share:</span>
                        <div className="font-medium">70%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-4">
                  {!isUserSubscribed(selectedModel.id) ? (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button className="flex-1">
                          <Activity className="h-4 w-4 mr-2" />
                          Subscribe to Model
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Clock className="h-4 w-4 mr-2" />
                          Start Free Trial
                        </Button>
                      </div>
                      <Button 
                        variant="secondary" 
                        className="w-full"
                        onClick={() => handleOnchainPayment(selectedModel.id)}
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Pay with Crypto (Web3)
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button className="flex-1">
                        <Activity className="h-4 w-4 mr-2" />
                        Access Dashboard
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Target className="h-4 w-4 mr-2" />
                        View Performance
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Onchain Payment Modal */}
      <OnchainPaymentModal
        modelId={paymentModelId || 0}
        isOpen={onchainPaymentOpen}
        onClose={handleCloseOnchainPayment}
        modelName={paymentModelId ? aiModels.find(m => m.id === paymentModelId)?.name : "AI Model"}
        price={0.1} // Default price - can be made dynamic based on model
      />
    </Layout>
  );
}