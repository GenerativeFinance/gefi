import React, { useState } from 'react';
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
  ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3, FileDown, 
  Settings, Target, Shield, Brain, Zap, Upload, Database, Layers,
  Download, Share2, RefreshCw, Activity, LineChart, Gauge, Globe,
  DollarSign, AlertCircle, CheckCircle, Eye, Grid3X3, TreePine
} from 'lucide-react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';

export default function HRPPortfolioOptimization() {
  const [, setLocation] = useLocation();
  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [aiAdjustments, setAiAdjustments] = useState(true);
  const [optimizationMethod, setOptimizationMethod] = useState('hrp-ai');
  const [scenario, setScenario] = useState('base-case');
  const [dataSource, setDataSource] = useState('bloomberg');
  const [selectedAssets, setSelectedAssets] = useState(['SPY', 'QQQ', 'IWM', 'TLT', 'GLD']);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Enhanced portfolio data with HRP clustering
  const portfolioData = [
    { 
      asset: 'US Large Cap (SPY)', 
      allocation: 28.5, 
      originalWeight: 25.0,
      risk: 15.2, 
      aiAdjustment: '+3.5%',
      cluster: 'US Equities',
      riskContribution: 31.2,
      sharpeContribution: 0.89
    },
    { 
      asset: 'US Tech (QQQ)', 
      allocation: 18.7, 
      originalWeight: 20.0,
      risk: 22.1, 
      aiAdjustment: '-1.3%',
      cluster: 'US Equities',
      riskContribution: 28.9,
      sharpeContribution: 1.12
    },
    { 
      asset: 'US Small Cap (IWM)', 
      allocation: 12.4, 
      originalWeight: 15.0,
      risk: 24.8, 
      aiAdjustment: '-2.6%',
      cluster: 'US Equities',
      riskContribution: 19.7,
      sharpeContribution: 0.76
    },
    { 
      asset: 'US Treasuries (TLT)', 
      allocation: 25.8, 
      originalWeight: 25.0,
      risk: 8.9, 
      aiAdjustment: '+0.8%',
      cluster: 'Fixed Income',
      riskContribution: 12.4,
      sharpeContribution: 0.54
    },
    { 
      asset: 'Gold (GLD)', 
      allocation: 14.6, 
      originalWeight: 15.0,
      risk: 18.7, 
      aiAdjustment: '-0.4%',
      cluster: 'Commodities',
      riskContribution: 7.8,
      sharpeContribution: 0.43
    }
  ];

  const performanceMetrics = {
    expectedReturn: 12.8,
    volatility: 9.4,
    sharpeRatio: 1.36,
    maxDrawdown: 8.2,
    var95: 3.7,
    cvar95: 5.9,
    calmarRatio: 1.56,
    informationRatio: 0.84
  };

  const factorExposure = [
    { factor: 'Market Beta', exposure: 0.92, target: 0.90, status: 'on_target' },
    { factor: 'Size Factor', exposure: 0.08, target: 0.10, status: 'under' },
    { factor: 'Value Factor', exposure: -0.03, target: 0.00, status: 'on_target' },
    { factor: 'Momentum', exposure: 0.15, target: 0.15, status: 'on_target' },
    { factor: 'Quality', exposure: 0.21, target: 0.20, status: 'on_target' },
    { factor: 'ESG Score', exposure: 0.74, target: 0.70, status: 'over' }
  ];

  // Scenario analysis data
  const scenarioAnalysis = [
    {
      scenario: 'Base Case',
      probability: 0.60,
      expectedReturn: 12.8,
      volatility: 9.4,
      portfolioValue: 128000
    },
    {
      scenario: 'Bull Market',
      probability: 0.20,
      expectedReturn: 24.6,
      volatility: 14.2,
      portfolioValue: 146000
    },
    {
      scenario: 'Bear Market',
      probability: 0.15,
      expectedReturn: -8.4,
      volatility: 18.7,
      portfolioValue: 91600
    },
    {
      scenario: 'Stagflation',
      probability: 0.05,
      expectedReturn: -2.1,
      volatility: 22.3,
      portfolioValue: 97900
    }
  ];

  // Correlation matrix (simplified)
  const correlationData = [
    { asset1: 'SPY', asset2: 'QQQ', correlation: 0.89 },
    { asset1: 'SPY', asset2: 'IWM', correlation: 0.84 },
    { asset1: 'SPY', asset2: 'TLT', correlation: -0.23 },
    { asset1: 'SPY', asset2: 'GLD', correlation: 0.12 },
    { asset1: 'QQQ', asset2: 'IWM', correlation: 0.78 },
    { asset1: 'QQQ', asset2: 'TLT', correlation: -0.31 },
    { asset1: 'QQQ', asset2: 'GLD', correlation: 0.05 },
    { asset1: 'IWM', asset2: 'TLT', correlation: -0.18 },
    { asset1: 'IWM', asset2: 'GLD', correlation: 0.22 },
    { asset1: 'TLT', asset2: 'GLD', correlation: 0.34 }
  ];

  // Data sources
  const dataSources = [
    { id: 'bloomberg', name: 'Bloomberg Terminal', status: 'connected', cost: '$$$' },
    { id: 'yahoo', name: 'Yahoo Finance', status: 'connected', cost: 'Free' },
    { id: 'quandl', name: 'Quandl/NASDAQ', status: 'connected', cost: '$$' },
    { id: 'upload', name: 'CSV/Excel Upload', status: 'ready', cost: 'Free' }
  ];

  // Optimization methods
  const optimizationMethods = [
    { id: 'mean-variance', name: 'Mean-Variance (Markowitz)', complexity: 'Standard' },
    { id: 'risk-parity', name: 'Risk Parity', complexity: 'Intermediate' },
    { id: 'hrp', name: 'Hierarchical Risk Parity', complexity: 'Advanced' },
    { id: 'hrp-ai', name: 'HRP + AI Adjustments', complexity: 'Expert' }
  ];

  const getFactorStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'on_target': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100',
      'over': 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100',
      'under': 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100',
      'alert': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100'
    };
    return colors[status] || colors['on_target'];
  };

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'text-red-600';
    if (abs >= 0.5) return 'text-orange-600';
    if (abs >= 0.3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAdjustmentColor = (adjustment: string) => {
    if (adjustment.startsWith('+')) return 'text-green-600';
    if (adjustment.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
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
                <TreePine className="w-8 h-8 text-green-600" />
                Portfolio Optimization & HRP (AI-Enhanced)
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Advanced portfolio optimization using Hierarchical Risk Parity with AI adjustments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isOptimizing ? "default" : "secondary"} className="flex items-center gap-1">
              {isOptimizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
              {isOptimizing ? 'Optimizing...' : 'Portfolio Ready'}
            </Badge>
            <Button
              variant={isOptimizing ? "destructive" : "default"}
              onClick={() => setIsOptimizing(!isOptimizing)}
              className="flex items-center gap-2"
            >
              {isOptimizing ? <RefreshCw className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              {isOptimizing ? 'Stop Optimization' : 'Optimize Portfolio'}
            </Button>
          </div>
        </div>

        {/* Performance Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{performanceMetrics.expectedReturn}%</div>
              <div className="text-sm text-gray-500">Expected Return</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{performanceMetrics.volatility}%</div>
              <div className="text-sm text-gray-500">Volatility</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{performanceMetrics.sharpeRatio}</div>
              <div className="text-sm text-gray-500">Sharpe Ratio</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{performanceMetrics.var95}%</div>
              <div className="text-sm text-gray-500">95% VaR</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Sources & Upload
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

                <div className="space-y-2">
                  <Label>Asset Universe</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedAssets.map((asset, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded text-sm">
                        <span className="font-mono">{asset}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {dataSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between text-sm">
                      <span>{source.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={source.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {source.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{source.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Portfolio CSV
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Optimization Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Optimization Method</Label>
                  <Select value={optimizationMethod} onValueChange={setOptimizationMethod}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {optimizationMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Risk Tolerance: {riskTolerance[0]}%</Label>
                  <Slider
                    value={riskTolerance}
                    onValueChange={setRiskTolerance}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>AI Factor Adjustments</Label>
                    <Switch checked={aiAdjustments} onCheckedChange={setAiAdjustments} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>ESG Tilt</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Macro Risk Overlay</Label>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div>
                  <Label>Constraints</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <Label className="text-xs">Max Weight</Label>
                      <Input defaultValue="40%" className="h-8" />
                    </div>
                    <div>
                      <Label className="text-xs">Min Weight</Label>
                      <Input defaultValue="5%" className="h-8" />
                    </div>
                  </div>
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
                <div>
                  <Label>Scenario</Label>
                  <Select value={scenario} onValueChange={setScenario}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base-case">Base Case</SelectItem>
                      <SelectItem value="bull-market">Bull Market</SelectItem>
                      <SelectItem value="bear-market">Bear Market</SelectItem>
                      <SelectItem value="stagflation">Stagflation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="allocation" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="allocation">Portfolio Allocation</TabsTrigger>
                <TabsTrigger value="correlation">Correlation & Clustering</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="scenarios">Scenario Simulation</TabsTrigger>
              </TabsList>

              <TabsContent value="allocation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      HRP vs Original Portfolio Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed mb-4">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Treemap/Sunburst Visualization
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Asset weights by sector and risk cluster
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {portfolioData.map((asset, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">{asset.asset}</div>
                            <Badge variant="outline" className="text-xs">{asset.cluster}</Badge>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">{asset.allocation}%</span>
                              <span className={`text-sm ${getAdjustmentColor(asset.aiAdjustment)}`}>
                                ({asset.aiAdjustment})
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Risk: {asset.riskContribution}% | Orig: {asset.originalWeight}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="correlation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Grid3X3 className="w-5 h-5" />
                      Correlation Matrix & HRP Dendrogram
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                        <div className="text-center">
                          <Grid3X3 className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <div className="text-xs text-gray-600 dark:text-gray-400">Correlation Heatmap</div>
                        </div>
                      </div>
                      <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                        <div className="text-center">
                          <TreePine className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <div className="text-xs text-gray-600 dark:text-gray-400">HRP Dendrogram</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Key Correlations</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        {correlationData.slice(0, 6).map((corr, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span>{corr.asset1}-{corr.asset2}</span>
                            <span className={`font-bold ${getCorrelationColor(corr.correlation)}`}>
                              {corr.correlation.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Metrics & Risk Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Expected Return</span>
                          <span className="font-bold text-green-600">{performanceMetrics.expectedReturn}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Volatility</span>
                          <span className="font-bold text-blue-600">{performanceMetrics.volatility}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Max Drawdown</span>
                          <span className="font-bold text-red-600">{performanceMetrics.maxDrawdown}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">CVaR (95%)</span>
                          <span className="font-bold text-orange-600">{performanceMetrics.cvar95}%</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Sharpe Ratio</span>
                          <span className="font-bold text-purple-600">{performanceMetrics.sharpeRatio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Calmar Ratio</span>
                          <span className="font-bold text-indigo-600">{performanceMetrics.calmarRatio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Information Ratio</span>
                          <span className="font-bold text-teal-600">{performanceMetrics.informationRatio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">VaR (95%)</span>
                          <span className="font-bold text-yellow-600">{performanceMetrics.var95}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                      <div className="text-center">
                        <LineChart className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Performance Attribution Chart
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Monte Carlo & Scenario Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed mb-4">
                      <div className="text-center">
                        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Monte Carlo Fan Chart
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Distribution of portfolio returns over time
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {scenarioAnalysis.map((scenario, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">{scenario.scenario}</div>
                            <Badge variant="outline">
                              {(scenario.probability * 100).toFixed(0)}% prob
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              ${scenario.portfolioValue.toLocaleString()}
                            </div>
                            <div className={`text-sm ${scenario.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {scenario.expectedReturn >= 0 ? '+' : ''}{scenario.expectedReturn}% return
                            </div>
                          </div>
                        </div>
                      ))}
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
                  <Shield className="w-5 h-5" />
                  Risk Contribution Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolioData.map((asset, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{asset.asset.split(' ')[0]}</div>
                        <div className="text-sm font-bold">{asset.riskContribution}%</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={asset.riskContribution} className="h-2 flex-1" />
                        <span className={`text-xs ${getAdjustmentColor(asset.aiAdjustment)}`}>
                          {asset.aiAdjustment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Factor Exposures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {factorExposure.map((factor, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{factor.factor}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold">{factor.exposure.toFixed(2)}</div>
                          <Badge className={getFactorStatusColor(factor.status)} variant="outline">
                            {factor.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.abs(factor.exposure) * 100} className="h-2 flex-1" />
                        <span className="text-xs text-gray-500">
                          Target: {factor.target.toFixed(2)}
                        </span>
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
                  AI Explainability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">Optimization Insight</div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                    AI increased US Large Cap allocation by 3.5% due to strong momentum and quality factors.
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Risk Reduction</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    HRP clustering reduced correlation risk by 15% compared to market-cap weighting.
                  </div>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Factor Tilt</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    ESG overlay slightly overweights high-scoring assets while maintaining risk targets.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Allocation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileDown className="w-4 h-4 mr-2" />
                  Portfolio Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Model
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Deploy Live
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
