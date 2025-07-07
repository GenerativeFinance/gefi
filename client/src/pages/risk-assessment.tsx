import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, ScatterPlot, Scatter, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Upload, 
  Download, Share2, Settings, Eye, MessageCircle, FileText,
  Activity, Shield, BarChart3, Zap, Users, Globe
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  threshold: number;
  status: 'safe' | 'warning' | 'critical';
  unit: string;
}

interface ModelPrediction {
  timestamp: string;
  predicted_risk: number;
  actual_risk?: number;
  confidence: number;
  model_version: string;
}

interface FeatureImportance {
  feature: string;
  importance: number;
  description: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'annotation';
  position?: { x: number; y: number };
}

export default function RiskAssessment() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedModel, setSelectedModel] = useState('var_model');
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(75);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [customParameters, setCustomParameters] = useState({
    confidence_level: 0.95,
    time_horizon: 1,
    portfolio_value: 1000000,
    stress_scenario: 'moderate'
  });

  // Fetch real-time risk metrics
  const { data: riskMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/risk-assessment/metrics', selectedModel],
    refetchInterval: isLiveMonitoring ? 5000 : false,
  });

  // Fetch model predictions
  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ['/api/risk-assessment/predictions', selectedModel],
    refetchInterval: isLiveMonitoring ? 10000 : false,
  });

  // Fetch feature importance
  const { data: featureImportance, isLoading: featuresLoading } = useQuery({
    queryKey: ['/api/risk-assessment/features', selectedModel],
  });

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model_id', selectedModel);
      
      const response = await fetch('/api/risk-assessment/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Dataset uploaded and processing started",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/risk-assessment'] });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Run model prediction mutation
  const runPredictionMutation = useMutation({
    mutationFn: async (params: any) => {
      return await apiRequest('POST', '/api/risk-assessment/predict', {
        model_id: selectedModel,
        parameters: params,
      });
    },
    onSuccess: () => {
      toast({
        title: "Prediction Complete",
        description: "Risk assessment model has finished running",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/risk-assessment'] });
    },
  });

  // Generate sample data for demonstration
  const sampleRiskMetrics: RiskMetric[] = [
    {
      id: 'var_95',
      name: 'Value at Risk (95%)',
      value: 125000,
      change: -5.2,
      threshold: 150000,
      status: 'safe',
      unit: 'USD'
    },
    {
      id: 'cvar',
      name: 'Conditional VaR',
      value: 185000,
      change: 12.8,
      threshold: 200000,
      status: 'warning',
      unit: 'USD'
    },
    {
      id: 'sharpe',
      name: 'Sharpe Ratio',
      value: 1.42,
      change: 0.15,
      threshold: 1.0,
      status: 'safe',
      unit: ''
    },
    {
      id: 'beta',
      name: 'Portfolio Beta',
      value: 1.18,
      change: 0.03,
      threshold: 1.5,
      status: 'safe',
      unit: ''
    }
  ];

  const samplePredictions: ModelPrediction[] = Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    predicted_risk: 0.15 + Math.sin(i * 0.2) * 0.05 + Math.random() * 0.02,
    actual_risk: i < 25 ? 0.14 + Math.sin(i * 0.2) * 0.05 + Math.random() * 0.02 : undefined,
    confidence: 0.85 + Math.random() * 0.1,
    model_version: '2.1.0'
  }));

  const sampleFeatureImportance: FeatureImportance[] = [
    { feature: 'Market Volatility', importance: 0.28, description: 'Historical and implied volatility measures' },
    { feature: 'Credit Spread', importance: 0.22, description: 'Corporate bond credit spread indicators' },
    { feature: 'Liquidity Ratio', importance: 0.18, description: 'Portfolio liquidity and market depth' },
    { feature: 'Sector Concentration', importance: 0.15, description: 'Sector allocation and concentration risk' },
    { feature: 'Currency Exposure', importance: 0.12, description: 'Foreign exchange risk exposure' },
    { feature: 'Interest Rate Duration', importance: 0.05, description: 'Interest rate sensitivity measure' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleRunPrediction = () => {
    runPredictionMutation.mutate(customParameters);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Current User',
        content: newComment,
        timestamp: new Date().toISOString(),
        type: 'comment'
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const exportReport = () => {
    const reportData = {
      metrics: sampleRiskMetrics,
      predictions: samplePredictions,
      features: sampleFeatureImportance,
      parameters: customParameters,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-assessment-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Risk Assessment Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time risk monitoring and model analytics</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={isLiveMonitoring} 
                onCheckedChange={setIsLiveMonitoring}
              />
              <Label className="text-sm">Live Monitoring</Label>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {sampleRiskMetrics.some(m => m.status === 'critical') && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/10">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              Critical risk threshold exceeded! Immediate attention required.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleRiskMetrics.map((metric) => (
            <Card key={metric.id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.name}
                  </CardTitle>
                  <Badge 
                    variant={metric.status === 'safe' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}
                  >
                    {metric.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.unit === 'USD' ? `$${metric.value.toLocaleString()}` : metric.value.toFixed(2)}
                  {metric.unit && metric.unit !== 'USD' && <span className="text-sm ml-1">{metric.unit}</span>}
                </div>
                <div className={`flex items-center text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(metric.change).toFixed(1)}%
                </div>
                <Progress 
                  value={(metric.value / metric.threshold) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="data">Data Input</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="collaboration">Collaborate</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Trend Analysis</CardTitle>
                  <CardDescription>30-day predicted vs actual risk</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={samplePredictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="predicted_risk" stroke="#8884d8" name="Predicted Risk" />
                      <Line type="monotone" dataKey="actual_risk" stroke="#82ca9d" name="Actual Risk" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Feature Importance */}
              <Card>
                <CardHeader>
                  <CardTitle>Feature Importance</CardTitle>
                  <CardDescription>Model decision factors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sampleFeatureImportance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="feature" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="importance" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Model Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Summary</CardTitle>
                <CardDescription>Current model accuracy and reliability metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0.87</div>
                    <div className="text-sm text-gray-600">F1 Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">2.3ms</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Selection & Configuration</CardTitle>
                <CardDescription>Choose and configure risk assessment models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model-select">Select Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a risk model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="var_model">Value at Risk Model</SelectItem>
                        <SelectItem value="credit_risk">Credit Risk Model</SelectItem>
                        <SelectItem value="market_risk">Market Risk Model</SelectItem>
                        <SelectItem value="operational_risk">Operational Risk Model</SelectItem>
                        <SelectItem value="stress_test">Stress Testing Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="risk-threshold">Risk Threshold (%)</Label>
                    <Input
                      type="number"
                      value={riskThreshold}
                      onChange={(e) => setRiskThreshold(Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="confidence">Confidence Level</Label>
                    <Select 
                      value={customParameters.confidence_level.toString()} 
                      onValueChange={(value) => setCustomParameters({...customParameters, confidence_level: parseFloat(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.90">90%</SelectItem>
                        <SelectItem value="0.95">95%</SelectItem>
                        <SelectItem value="0.99">99%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="time-horizon">Time Horizon (days)</Label>
                    <Input
                      type="number"
                      value={customParameters.time_horizon}
                      onChange={(e) => setCustomParameters({...customParameters, time_horizon: Number(e.target.value)})}
                      min="1"
                      max="365"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="portfolio-value">Portfolio Value (USD)</Label>
                    <Input
                      type="number"
                      value={customParameters.portfolio_value}
                      onChange={(e) => setCustomParameters({...customParameters, portfolio_value: Number(e.target.value)})}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stress-scenario">Stress Scenario</Label>
                    <Select 
                      value={customParameters.stress_scenario} 
                      onValueChange={(value) => setCustomParameters({...customParameters, stress_scenario: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild Stress</SelectItem>
                        <SelectItem value="moderate">Moderate Stress</SelectItem>
                        <SelectItem value="severe">Severe Stress</SelectItem>
                        <SelectItem value="extreme">Extreme Stress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleRunPrediction}
                  disabled={runPredictionMutation.isPending}
                  className="w-full"
                >
                  {runPredictionMutation.isPending ? 'Running...' : 'Run Risk Assessment'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Input Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Upload & Management</CardTitle>
                <CardDescription>Upload datasets for risk analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-lg font-medium">Upload Dataset</span>
                    <br />
                    <span className="text-sm text-gray-600">Supports CSV, Excel, JSON formats</span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.json"
                    onChange={handleFileUpload}
                  />
                </div>

                {uploadMutation.isPending && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Uploading and processing...</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="dataset-select">Existing Datasets</Label>
                  <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select existing dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sp500_2024">S&P 500 Historical Data (2024)</SelectItem>
                      <SelectItem value="corporate_bonds">Corporate Bond Portfolio</SelectItem>
                      <SelectItem value="market_data">Multi-Asset Market Data</SelectItem>
                      <SelectItem value="stress_scenarios">Stress Test Scenarios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Data Quality</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Completeness</span>
                        <span className="text-sm font-medium">98.5%</span>
                      </div>
                      <Progress value={98.5} />
                      <div className="flex justify-between">
                        <span className="text-sm">Accuracy</span>
                        <span className="text-sm font-medium">96.2%</span>
                      </div>
                      <Progress value={96.2} />
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Dataset Info</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Records:</span>
                        <span className="font-medium">50,432</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Features:</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="font-medium">2 hours ago</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Portfolio risk allocation by asset class</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Equities', value: 45, risk: 0.18 },
                          { name: 'Fixed Income', value: 30, risk: 0.08 },
                          { name: 'Commodities', value: 15, risk: 0.25 },
                          { name: 'Cash', value: 10, risk: 0.02 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Correlation Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Factor Correlations</CardTitle>
                  <CardDescription>Correlation between key risk factors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {['Market', 'Credit', 'Liquidity', 'Operational'].map((factor1, i) => 
                      ['Market', 'Credit', 'Liquidity', 'Operational'].map((factor2, j) => {
                        const correlation = i === j ? 1 : Math.random() * 0.8 - 0.4;
                        return (
                          <div 
                            key={`${i}-${j}`}
                            className={`p-2 text-center rounded ${
                              correlation > 0.5 ? 'bg-red-100 text-red-800' :
                              correlation > 0 ? 'bg-yellow-100 text-yellow-800' :
                              correlation > -0.5 ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}
                          >
                            {correlation.toFixed(2)}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="mt-4 text-xs text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>Columns: Market, Credit, Liquidity, Operational</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stress Testing Results */}
            <Card>
              <CardHeader>
                <CardTitle>Stress Testing Results</CardTitle>
                <CardDescription>Portfolio performance under various stress scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { scenario: 'Normal', portfolio_value: 100, var_95: 5, expected_shortfall: 8 },
                    { scenario: 'Mild Stress', portfolio_value: 92, var_95: 12, expected_shortfall: 18 },
                    { scenario: 'Moderate Stress', portfolio_value: 78, var_95: 22, expected_shortfall: 32 },
                    { scenario: 'Severe Stress', portfolio_value: 58, var_95: 35, expected_shortfall: 48 },
                    { scenario: 'Extreme Stress', portfolio_value: 35, var_95: 52, expected_shortfall: 68 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="scenario" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="portfolio_value" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="var_95" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="expected_shortfall" stackId="3" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Alerts */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Live Risk Alerts</CardTitle>
                  <CardDescription>Real-time monitoring and threshold alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'warning', message: 'VaR threshold approaching (85% of limit)', time: '2 minutes ago' },
                      { type: 'info', message: 'Model retraining scheduled for tonight', time: '1 hour ago' },
                      { type: 'critical', message: 'Credit spread anomaly detected', time: '3 hours ago' },
                      { type: 'success', message: 'Stress test passed all scenarios', time: '1 day ago' }
                    ].map((alert, index) => (
                      <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                        alert.type === 'critical' ? 'bg-red-50 border border-red-200' :
                        alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                        alert.type === 'success' ? 'bg-green-50 border border-green-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}>
                        {alert.type === 'critical' ? <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" /> :
                         alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" /> :
                         alert.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> :
                         <Activity className="w-5 h-5 text-blue-600 mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-600">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: 'Data Pipeline', status: 'operational', uptime: '99.9%' },
                      { name: 'Model API', status: 'operational', uptime: '99.8%' },
                      { name: 'Risk Engine', status: 'warning', uptime: '98.5%' },
                      { name: 'Alerts System', status: 'operational', uptime: '100%' }
                    ].map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{service.name}</div>
                          <div className="text-xs text-gray-600">{service.uptime} uptime</div>
                        </div>
                        <Badge variant={service.status === 'operational' ? 'default' : 'secondary'}>
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Comments & Annotations */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Comments</CardTitle>
                  <CardDescription>Collaborate on risk analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-gray-600">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleAddComment}>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export & Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle>Export & Sharing</CardTitle>
                  <CardDescription>Share reports and insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      PDF Report
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Excel Export
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Dashboard Link
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Team Access
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Report Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language/Locale</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="en-gb">English (UK)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}