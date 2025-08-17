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
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3, FileDown, Settings, Target, Shield, Brain, Zap } from 'lucide-react';
import { useLocation } from 'wouter';

export default function HRPPortfolioOptimization() {
  const [, setLocation] = useLocation();
  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [aiAdjustments, setAiAdjustments] = useState(true);
  const [optimizationMethod, setOptimizationMethod] = useState('hrp-ai');
  const [scenario, setScenario] = useState('base-case');

  // Sample portfolio data
  const portfolioData = [
    { asset: 'US Equities', allocation: 35, risk: 28, aiAdjustment: '+2%' },
    { asset: 'EU Equities', allocation: 20, risk: 18, aiAdjustment: '-1%' },
    { asset: 'EM Equities', allocation: 15, risk: 22, aiAdjustment: '+3%' },
    { asset: 'US Bonds', allocation: 20, risk: 12, aiAdjustment: '0%' },
    { asset: 'Commodities', allocation: 10, risk: 20, aiAdjustment: '-2%' }
  ];

  const performanceMetrics = {
    expectedReturn: 16.4,
    volatility: 11.2,
    sharpeRatio: 2.3,
    maxDrawdown: 6.8,
    var95: 4.2,
    cvar95: 6.1
  };

  const factorExposure = [
    { factor: 'Market Beta', exposure: 0.85, target: 0.90 },
    { factor: 'Size Factor', exposure: 0.12, target: 0.10 },
    { factor: 'Value Factor', exposure: -0.05, target: 0.00 },
    { factor: 'Momentum', exposure: 0.18, target: 0.15 },
    { factor: 'ESG Score', exposure: 0.72, target: 0.70 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Portfolio Optimization & HRP (AI-Enhanced)
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Advanced portfolio optimization using Hierarchical Risk Parity with AI adjustments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <TrendingUp className="w-3 h-3 mr-1" />
              93.2% Accuracy
            </Badge>
            <Badge variant="outline">AI-Enhanced</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Input Panel */}
          <div className="lg:col-span-1 space-y-4">
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mean-variance">Mean-Variance</SelectItem>
                      <SelectItem value="risk-parity">Risk Parity</SelectItem>
                      <SelectItem value="hrp">Hierarchical Risk Parity</SelectItem>
                      <SelectItem value="hrp-ai">HRP + AI Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Risk Tolerance</Label>
                  <div className="mt-2 mb-2">
                    <Slider
                      value={riskTolerance}
                      onValueChange={setRiskTolerance}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Conservative</span>
                    <span>{riskTolerance[0]}%</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="ai-adjustments">AI Adjustments</Label>
                  <Switch
                    id="ai-adjustments"
                    checked={aiAdjustments}
                    onCheckedChange={setAiAdjustments}
                  />
                </div>

                <div>
                  <Label>Market Scenario</Label>
                  <Select value={scenario} onValueChange={setScenario}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base-case">Base Case</SelectItem>
                      <SelectItem value="inflation-shock">Inflation Shock</SelectItem>
                      <SelectItem value="recession">Recession</SelectItem>
                      <SelectItem value="bull-market">Bull Market</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Constraints</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Min Weight %</Label>
                      <Input type="number" placeholder="5" className="h-8" />
                    </div>
                    <div>
                      <Label className="text-xs">Max Weight %</Label>
                      <Input type="number" placeholder="40" className="h-8" />
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Target className="w-4 h-4 mr-2" />
                  Optimize Portfolio
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Key Recommendation</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Increase EM equity allocation by 3% due to favorable risk-adjusted returns in current macro environment.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Market Regime Confidence</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard - Center Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="allocation" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="allocation">Allocation</TabsTrigger>
                <TabsTrigger value="correlation">Correlation</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              </TabsList>

              <TabsContent value="allocation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Portfolio Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolioData.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.asset}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.allocation}%</span>
                              <Badge variant="secondary" className="text-xs">
                                {item.aiAdjustment}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={item.allocation} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Risk Contribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {portfolioData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{item.asset}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={item.risk} className="w-16 h-2" />
                            <span className="text-sm w-10">{item.risk}%</span>
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
                    <CardTitle>Correlation Matrix & HRP Tree</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-1 mb-4">
                      {['', 'US Eq', 'EU Eq', 'EM Eq', 'Bonds'].map((label, i) => (
                        <div key={i} className="text-xs text-center font-medium p-1">
                          {label}
                        </div>
                      ))}
                      {[
                        ['US Eq', 1.00, 0.75, 0.68, 0.12],
                        ['EU Eq', 0.75, 1.00, 0.72, 0.18],
                        ['EM Eq', 0.68, 0.72, 1.00, 0.05],
                        ['Bonds', 0.12, 0.18, 0.05, 1.00]
                      ].map((row, i) => (
                        <React.Fragment key={i}>
                          {row.map((cell, j) => (
                            <div 
                              key={j}
                              className={`text-xs text-center p-1 rounded ${
                                typeof cell === 'string' 
                                  ? 'font-medium' 
                                  : cell > 0.7 
                                    ? 'bg-red-100 dark:bg-red-900/30' 
                                    : cell > 0.3 
                                      ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                      : 'bg-green-100 dark:bg-green-900/30'
                              }`}
                            >
                              {typeof cell === 'number' ? cell.toFixed(2) : cell}
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Higher correlations shown in red indicate potential clustering for HRP algorithm.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Return Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Return</span>
                        <span className="font-medium">{performanceMetrics.expectedReturn}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Volatility</span>
                        <span className="font-medium">{performanceMetrics.volatility}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sharpe Ratio</span>
                        <span className="font-medium">{performanceMetrics.sharpeRatio}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Max Drawdown</span>
                        <span className="font-medium">{performanceMetrics.maxDrawdown}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">VaR (95%)</span>
                        <span className="font-medium">{performanceMetrics.var95}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">CVaR (95%)</span>
                        <span className="font-medium">{performanceMetrics.cvar95}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scenario Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { scenario: 'Base Case', return: 16.4, probability: 50 },
                        { scenario: 'Bull Market', return: 24.8, probability: 20 },
                        { scenario: 'Bear Market', return: -8.2, probability: 15 },
                        { scenario: 'Inflation Shock', return: 5.1, probability: 15 }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <span className="font-medium">{item.scenario}</span>
                            <div className="text-xs text-gray-500">Probability: {item.probability}%</div>
                          </div>
                          <div className={`flex items-center gap-1 ${item.return > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.return > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="font-medium">{item.return}%</span>
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
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Factor Exposure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {factorExposure.map((factor, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{factor.factor}</span>
                      <span className="font-medium">{factor.exposure.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={(factor.exposure + 1) * 50} className="flex-1 h-2" />
                      <span className="text-xs text-gray-500">T: {factor.target.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HRP Algorithm Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Clustering Method</span>
                    <Badge variant="outline">Ward Linkage</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Metric</span>
                    <Badge variant="outline">Correlation</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Budget</span>
                    <Badge variant="outline">Equal Risk</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileDown className="w-5 h-5" />
                  Export & Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileDown className="w-4 h-4 mr-2" />
                  Download Portfolio CSV
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileDown className="w-4 h-4 mr-2" />
                  Risk Report PDF
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileDown className="w-4 h-4 mr-2" />
                  Executive Summary
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}