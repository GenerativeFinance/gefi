import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, Upload, TrendingUp, TrendingDown, BarChart3, 
  Target, Brain, Zap, Download, Settings, RefreshCw, FileText, 
  Database, Activity, ChevronRight, DollarSign, AlertCircle,
  LineChart, Gauge, Share2, Play, Pause, RotateCcw, 
  CheckCircle, AlertTriangle, Clock, Eye, Layers, Grid3X3
} from 'lucide-react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';

export default function GRUForecasting() {
  const [, setLocation] = useLocation();
  const [selectedModel, setSelectedModel] = useState('gru');
  const [isTraining, setIsTraining] = useState(false);
  const [sequenceLength, setSequenceLength] = useState([60]);
  const [epochs, setEpochs] = useState([100]);
  const [learningRate, setLearningRate] = useState([0.001]);
  const [hiddenUnits, setHiddenUnits] = useState([128]);
  const [selectedScenario, setSelectedScenario] = useState('neutral');
  const [dataSource, setDataSource] = useState('yahoo');
  const [selectedAsset, setSelectedAsset] = useState('AAPL');

  // Training status
  const trainingStatus = {
    currentEpoch: 78,
    totalEpochs: 100,
    trainLoss: 0.0234,
    valLoss: 0.0189,
    eta: '2m 15s',
    bestModel: 'Epoch 72'
  };

  // Model performance metrics
  const performanceMetrics = {
    rmse: 2.34,
    mae: 1.78,
    mape: 3.45,
    r2Score: 0.924,
    directionAccuracy: 76.8,
    sharpeRatio: 1.42
  };

  // Forecast data
  const forecastData = [
    { date: '2024-01-15', actual: 185.2, forecast: 184.8, lower: 182.1, upper: 187.5, scenario: 'neutral' },
    { date: '2024-01-16', actual: 186.1, forecast: 186.3, lower: 183.4, upper: 189.2, scenario: 'neutral' },
    { date: '2024-01-17', actual: null, forecast: 187.9, lower: 184.8, upper: 191.0, scenario: 'neutral' },
    { date: '2024-01-18', actual: null, forecast: 189.2, lower: 185.9, upper: 192.5, scenario: 'neutral' },
    { date: '2024-01-19', actual: null, forecast: 190.8, lower: 187.2, upper: 194.4, scenario: 'neutral' }
  ];

  // Model comparison results
  const modelComparison = [
    {
      model: 'GRU',
      rmse: 2.34,
      mae: 1.78,
      mape: 3.45,
      trainTime: '4m 32s',
      status: 'completed',
      selected: true
    },
    {
      model: 'LSTM',
      rmse: 2.67,
      mae: 1.92,
      mape: 3.78,
      trainTime: '5m 48s',
      status: 'completed',
      selected: false
    },
    {
      model: 'Transformer',
      rmse: 2.12,
      mae: 1.65,
      mape: 3.12,
      trainTime: '8m 15s',
      status: 'completed',
      selected: false
    },
    {
      model: 'ARIMA',
      rmse: 4.23,
      mae: 3.45,
      mape: 6.78,
      trainTime: '0m 45s',
      status: 'completed',
      selected: false
    }
  ];

  // Feature importance data
  const featureImportance = [
    { feature: 'Previous Close', importance: 0.342, type: 'price' },
    { feature: 'Volume', importance: 0.189, type: 'volume' },
    { feature: 'MA(20)', importance: 0.156, type: 'technical' },
    { feature: 'RSI', importance: 0.123, type: 'technical' },
    { feature: 'VIX', importance: 0.098, type: 'market' },
    { feature: 'SPY', importance: 0.092, type: 'market' }
  ];

  // Residual analysis
  const residualStats = {
    mean: 0.012,
    std: 1.456,
    skewness: -0.089,
    kurtosis: 2.987,
    ljungBox: 0.234,
    normalityTest: 0.678
  };

  const scenarios = [
    { id: 'bullish', name: 'Bullish', multiplier: 1.15, color: 'text-green-600' },
    { id: 'neutral', name: 'Neutral', multiplier: 1.0, color: 'text-gray-600' },
    { id: 'bearish', name: 'Bearish', multiplier: 0.85, color: 'text-red-600' }
  ];

  const dataSources = [
    { id: 'yahoo', name: 'Yahoo Finance', status: 'connected' },
    { id: 'bloomberg', name: 'Bloomberg', status: 'disconnected' },
    { id: 'quandl', name: 'Quandl', status: 'connected' },
    { id: 'upload', name: 'File Upload', status: 'ready' }
  ];

  const getMetricColor = (value: number, metric: string) => {
    if (metric === 'r2Score') {
      if (value >= 0.9) return 'text-green-600';
      if (value >= 0.7) return 'text-blue-600';
      if (value >= 0.5) return 'text-orange-600';
      return 'text-red-600';
    }
    
    // For error metrics (lower is better)
    if (value <= 2) return 'text-green-600';
    if (value <= 4) return 'text-blue-600';
    if (value <= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getModelStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100',
      'training': 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100',
      'failed': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100',
      'pending': 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
    };
    return colors[status] || colors['pending'];
  };

  const getFeatureTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'price': 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100',
      'volume': 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-100',
      'technical': 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100',
      'market': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100'
    };
    return colors[type] || colors['market'];
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/ai-models')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to AI Models
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-8 h-8 text-blue-600" />
                GRU Time Series Forecasting
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Advanced sequence forecasting with Gated Recurrent Units and uncertainty quantification
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isTraining ? "default" : "secondary"} className="flex items-center gap-1">
              {isTraining ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              {isTraining ? 'Training Active' : 'Model Ready'}
            </Badge>
            <Button
              variant={isTraining ? "destructive" : "default"}
              onClick={() => setIsTraining(!isTraining)}
              className="flex items-center gap-2"
            >
              {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTraining ? 'Stop Training' : 'Start Training'}
            </Button>
          </div>
        </div>

        {/* Training Progress */}
        {isTraining && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Training Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{trainingStatus.currentEpoch}</div>
                  <div className="text-sm text-gray-500">Current Epoch</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{trainingStatus.totalEpochs}</div>
                  <div className="text-sm text-gray-500">Total Epochs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{trainingStatus.trainLoss}</div>
                  <div className="text-sm text-gray-500">Train Loss</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{trainingStatus.valLoss}</div>
                  <div className="text-sm text-gray-500">Val Loss</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{trainingStatus.eta}</div>
                  <div className="text-sm text-gray-500">ETA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{trainingStatus.bestModel}</div>
                  <div className="text-sm text-gray-500">Best Model</div>
                </div>
              </div>
              <Progress 
                value={(trainingStatus.currentEpoch / trainingStatus.totalEpochs) * 100} 
                className="mt-4 h-3"
              />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Data Source</Label>
                  <Select value={dataSource} onValueChange={setDataSource}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Asset Symbol</Label>
                  <Input 
                    value={selectedAsset} 
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    placeholder="AAPL, TSLA, BTC-USD..."
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  {dataSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between text-sm">
                      <span>{source.name}</span>
                      <Badge className={source.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {source.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV/Excel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Model Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Model Type</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gru">GRU</SelectItem>
                      <SelectItem value="lstm">LSTM</SelectItem>
                      <SelectItem value="transformer">Transformer</SelectItem>
                      <SelectItem value="hybrid">Hybrid (GRU + ARIMA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sequence Length: {sequenceLength[0]} days</Label>
                  <Slider
                    value={sequenceLength}
                    onValueChange={setSequenceLength}
                    max={252}
                    min={5}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Hidden Units: {hiddenUnits[0]}</Label>
                  <Slider
                    value={hiddenUnits}
                    onValueChange={setHiddenUnits}
                    max={512}
                    min={32}
                    step={32}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Epochs: {epochs[0]}</Label>
                  <Slider
                    value={epochs}
                    onValueChange={setEpochs}
                    max={500}
                    min={10}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Learning Rate: {learningRate[0]}</Label>
                  <Slider
                    value={learningRate}
                    onValueChange={setLearningRate}
                    max={0.01}
                    min={0.0001}
                    step={0.0001}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Scenario Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="flex items-center justify-between">
                      <Label className={`flex items-center gap-2 ${scenario.color}`}>
                        {scenario.name}
                      </Label>
                      <Switch 
                        checked={selectedScenario === scenario.id}
                        onCheckedChange={() => setSelectedScenario(scenario.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">RMSE</div>
                  <div className={`text-2xl font-bold ${getMetricColor(performanceMetrics.rmse, 'rmse')}`}>
                    {performanceMetrics.rmse}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">R² Score</div>
                  <div className={`text-2xl font-bold ${getMetricColor(performanceMetrics.r2Score, 'r2Score')}`}>
                    {performanceMetrics.r2Score}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Direction Accuracy</div>
                  <div className="text-2xl font-bold text-green-600">
                    {performanceMetrics.directionAccuracy}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="forecast" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
                <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
                <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
              </TabsList>

              <TabsContent value="forecast" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      Time Series Forecast with Confidence Intervals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          GRU Forecast Visualization
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Historical data, predictions, and uncertainty bands
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Forecast Data Points</div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {forecastData.map((point, index) => (
                          <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span>{point.date}</span>
                            <span className="font-mono">
                              {point.actual ? `${point.actual}` : `${point.forecast} (±${(point.upper - point.lower).toFixed(1)})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="training" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Training & Validation Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Loss Curves (Training vs Validation)
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Monitor overfitting and convergence
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{performanceMetrics.mae}</div>
                        <div className="text-sm text-blue-700">MAE</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{performanceMetrics.mape}%</div>
                        <div className="text-sm text-orange-700">MAPE</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{performanceMetrics.sharpeRatio}</div>
                        <div className="text-sm text-green-700">Sharpe Ratio</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Grid3X3 className="w-5 h-5" />
                      Model Performance Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {modelComparison.map((model, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="font-bold text-lg">{model.model}</div>
                            <Badge className={getModelStatusColor(model.status)}>
                              {model.status}
                            </Badge>
                            {model.selected && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Selected
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <div className="text-gray-600 dark:text-gray-400">RMSE</div>
                                <div className={`font-bold ${getMetricColor(model.rmse, 'rmse')}`}>
                                  {model.rmse}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600 dark:text-gray-400">MAE</div>
                                <div className={`font-bold ${getMetricColor(model.mae, 'mae')}`}>
                                  {model.mae}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600 dark:text-gray-400">Time</div>
                                <div className="font-bold">{model.trainTime}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diagnostics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Residual Analysis & Diagnostics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                        <div className="text-center">
                          <Activity className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <div className="text-xs text-gray-600 dark:text-gray-400">Residual Plot</div>
                        </div>
                      </div>
                      <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                        <div className="text-center">
                          <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <div className="text-xs text-gray-600 dark:text-gray-400">Error Distribution</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold">{residualStats.mean}</div>
                        <div className="text-gray-500">Mean Error</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{residualStats.std}</div>
                        <div className="text-gray-500">Std Dev</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{residualStats.ljungBox}</div>
                        <div className="text-gray-500">Ljung-Box</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Insights Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Feature Importance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featureImportance.map((feature, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{feature.feature}</div>
                        <div className="text-sm font-bold">{(feature.importance * 100).toFixed(1)}%</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={feature.importance * 100} className="h-2 flex-1" />
                        <Badge className={getFeatureTypeColor(feature.type)} variant="outline">
                          {feature.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">Strong Performance</div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                    GRU model shows excellent directional accuracy at 76.8% with stable convergence.
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Model Recommendation</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Consider Transformer model for longer sequences - shows 10% better accuracy on this dataset.
                  </div>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Data Quality</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Low residual autocorrelation suggests good model fit. Consider adding volatility features.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export & Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Forecasts
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Model
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Training
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}