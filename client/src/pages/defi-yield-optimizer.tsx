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
  ArrowLeft, Wallet, TrendingUp, TrendingDown, PieChart, BarChart3, 
  Target, Brain, Zap, Download, Settings, RefreshCw, FileText, 
  Shield, Database, Globe, ChevronRight, DollarSign, AlertCircle,
  Coins, Activity, LineChart, Gauge, Share2, Link, Users, 
  CheckCircle, AlertTriangle, Lock, Unlock, Droplets, Layers
} from 'lucide-react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';

export default function DeFiYieldOptimizer() {
  const [, setLocation] = useLocation();
  const [capitalAmount, setCapitalAmount] = useState([50000]);
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [selectedChains, setSelectedChains] = useState(['ethereum', 'polygon']);
  const [strategyType, setStrategyType] = useState('risk-adjusted');
  const [isRLEnabled, setIsRLEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Protocol data
  const protocols = [
    {
      name: 'Uniswap V3',
      enabled: true,
      tvl: '$4.2B',
      pools: 15,
      avgApy: 12.4,
      riskScore: 'Low',
      auditStatus: 'audited'
    },
    {
      name: 'Curve Finance',
      enabled: true,
      tvl: '$2.8B',
      pools: 8,
      avgApy: 18.7,
      riskScore: 'Low',
      auditStatus: 'audited'
    },
    {
      name: 'Aave',
      enabled: true,
      tvl: '$6.1B',
      pools: 12,
      avgApy: 8.9,
      riskScore: 'Very Low',
      auditStatus: 'audited'
    },
    {
      name: 'Balancer',
      enabled: false,
      tvl: '$1.4B',
      pools: 6,
      avgApy: 15.2,
      riskScore: 'Medium',
      auditStatus: 'audited'
    },
    {
      name: 'Yearn Finance',
      enabled: true,
      tvl: '$890M',
      pools: 4,
      avgApy: 22.1,
      riskScore: 'Medium',
      auditStatus: 'audited'
    }
  ];

  // Optimized allocation recommendations
  const optimizedPools = [
    {
      protocol: 'Curve Finance',
      pool: 'stETH/ETH',
      tokenPair: 'stETH-ETH',
      currentApy: 19.2,
      aiApy: 21.4,
      allocation: 35,
      impermanentLossRisk: 'Low',
      aiScore: 94,
      chain: 'Ethereum',
      tvl: '$432M',
      volume24h: '$12.4M'
    },
    {
      protocol: 'Uniswap V3',
      pool: 'USDC/USDT',
      tokenPair: 'USDC-USDT',
      currentApy: 8.7,
      aiApy: 11.2,
      allocation: 25,
      impermanentLossRisk: 'Very Low',
      aiScore: 88,
      chain: 'Ethereum',
      tvl: '$218M',
      volume24h: '$45.2M'
    },
    {
      protocol: 'Aave',
      pool: 'WMATIC Supply',
      tokenPair: 'WMATIC',
      currentApy: 12.8,
      aiApy: 13.9,
      allocation: 20,
      impermanentLossRisk: 'None',
      aiScore: 85,
      chain: 'Polygon',
      tvl: '$156M',
      volume24h: '$8.9M'
    },
    {
      protocol: 'Yearn Finance',
      pool: 'yvCurve-FRAX',
      tokenPair: 'FRAX-USDC',
      currentApy: 24.6,
      aiApy: 26.8,
      allocation: 20,
      impermanentLossRisk: 'Low',
      aiScore: 91,
      chain: 'Ethereum',
      tvl: '$98M',
      volume24h: '$3.2M'
    }
  ];

  // Performance projections
  const performanceData = {
    currentPortfolio: {
      totalApy: 14.2,
      estimatedReturn: 7100,
      volatility: 18.4,
      sharpeRatio: 1.2
    },
    optimizedPortfolio: {
      totalApy: 18.7,
      estimatedReturn: 9350,
      volatility: 16.8,
      sharpeRatio: 1.6
    }
  };

  // Risk metrics
  const riskMetrics = [
    {
      metric: 'Smart Contract Risk',
      score: 92,
      status: 'Low',
      description: 'All selected protocols are battle-tested with multiple audits'
    },
    {
      metric: 'Impermanent Loss Risk',
      score: 78,
      status: 'Medium',
      description: 'Balanced exposure to correlated and stable pairs'
    },
    {
      metric: 'Liquidity Risk',
      score: 95,
      status: 'Very Low',
      description: 'High TVL pools with consistent trading volume'
    },
    {
      metric: 'Governance Risk',
      score: 85,
      status: 'Low',
      description: 'Decentralized governance with active community participation'
    }
  ];

  const chains = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠', color: 'text-blue-600' },
    { id: 'polygon', name: 'Polygon', icon: '⬟', color: 'text-purple-600' },
    { id: 'bsc', name: 'BSC', icon: '⬢', color: 'text-yellow-600' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '⬟', color: 'text-blue-500' },
    { id: 'optimism', name: 'Optimism', icon: '⭕', color: 'text-red-500' }
  ];

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      'Very Low': 'text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-100',
      'Low': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100',
      'Medium': 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100',
      'High': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100',
      'Very High': 'text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-100'
    };
    return colors[risk] || colors['Medium'];
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
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
                <Droplets className="w-8 h-8 text-blue-600" />
                DeFi Yield Farming Optimizer
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                AI-powered liquidity mining and yield farming optimization across DeFi protocols
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
              <Wallet className="w-3 h-3" />
              {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </Badge>
            <Button
              variant={isConnected ? "outline" : "default"}
              onClick={() => setIsConnected(!isConnected)}
              className="flex items-center gap-2"
            >
              {isConnected ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isConnected ? 'Disconnect' : 'Connect Wallet'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet & Protocols
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {protocols.map((protocol, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">{protocol.name}</Label>
                        <div className="text-xs text-gray-500">TVL: {protocol.tvl}</div>
                      </div>
                      <Switch defaultChecked={protocol.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Investment Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Capital Amount: ${capitalAmount[0].toLocaleString()}</Label>
                  <Slider
                    value={capitalAmount}
                    onValueChange={setCapitalAmount}
                    max={1000000}
                    min={1000}
                    step={1000}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Risk Tolerance</Label>
                  <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Blockchain Networks</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {chains.map((chain) => (
                      <div key={chain.id} className="flex items-center gap-2 p-2 border rounded-lg">
                        <span className={`text-lg ${chain.color}`}>{chain.icon}</span>
                        <span className="text-xs">{chain.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Strategy Type</Label>
                  <Select value={strategyType} onValueChange={setStrategyType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yield-max">Yield Maximization</SelectItem>
                      <SelectItem value="risk-adjusted">Risk-Adjusted</SelectItem>
                      <SelectItem value="stablecoin">Stablecoin-Only</SelectItem>
                      <SelectItem value="multi-chain">Multi-Chain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reinforcement Learning</Label>
                    <div className="text-xs text-gray-500 mt-1">Dynamic rebalancing</div>
                  </div>
                  <Switch checked={isRLEnabled} onCheckedChange={setIsRLEnabled} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">Current Portfolio</div>
                    <div className="text-3xl font-bold text-orange-600 mt-2">
                      {performanceData.currentPortfolio.totalApy}%
                    </div>
                    <div className="text-sm text-gray-500">APY</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">AI Optimized</div>
                    <div className="text-3xl font-bold text-green-600 mt-2">
                      {performanceData.optimizedPortfolio.totalApy}%
                    </div>
                    <div className="text-sm text-gray-500">APY (+{(performanceData.optimizedPortfolio.totalApy - performanceData.currentPortfolio.totalApy).toFixed(1)}%)</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="allocation" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="allocation">Portfolio Allocation</TabsTrigger>
                <TabsTrigger value="protocols">Protocol Comparison</TabsTrigger>
                <TabsTrigger value="forecast">Yield Forecast</TabsTrigger>
                <TabsTrigger value="simulation">Risk Simulation</TabsTrigger>
              </TabsList>

              <TabsContent value="allocation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      AI-Recommended Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {optimizedPools.map((pool, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-lg font-bold">{pool.allocation}%</div>
                            <div>
                              <div className="font-medium">{pool.protocol}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{pool.tokenPair}</div>
                              <Badge variant="outline" className="text-xs mt-1">{pool.chain}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{pool.aiApy}% APY</div>
                            <Badge className={getRiskColor(pool.impermanentLossRisk)} variant="secondary">
                              {pool.impermanentLossRisk} IL Risk
                            </Badge>
                            <div className="text-sm text-gray-500 mt-1">AI Score: {pool.aiScore}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="protocols" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Protocol Performance Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {protocols.map((protocol, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">{protocol.name}</div>
                            <Badge className={protocol.auditStatus === 'audited' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {protocol.auditStatus === 'audited' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                              {protocol.auditStatus}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{protocol.avgApy}% APY</div>
                            <div className="text-sm text-gray-500">{protocol.pools} pools | {protocol.tvl} TVL</div>
                            <Badge className={getRiskColor(protocol.riskScore)} variant="outline">
                              {protocol.riskScore}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forecast" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      Yield Projection (12 months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Monte Carlo Yield Projection Chart
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Expected returns with confidence intervals
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">$9,350</div>
                        <div className="text-sm text-green-700">Expected Return</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1.6</div>
                        <div className="text-sm text-blue-700">Sharpe Ratio</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">16.8%</div>
                        <div className="text-sm text-orange-700">Volatility</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="simulation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Stress Test Scenarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Market Crash (-50%)</div>
                          <Badge className="bg-red-100 text-red-800">-12.4% portfolio impact</Badge>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Liquidity Crisis</div>
                          <Badge className="bg-orange-100 text-orange-800">-8.7% portfolio impact</Badge>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Protocol Exploit</div>
                          <Badge className="bg-yellow-100 text-yellow-800">-3.2% portfolio impact</Badge>
                        </div>
                        <Progress value={65} className="h-2" />
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
                  <Shield className="w-5 h-5" />
                  Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riskMetrics.map((risk, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">{risk.metric}</div>
                        <div className={`text-lg font-bold ${getScoreColor(risk.score)}`}>
                          {risk.score}
                        </div>
                      </div>
                      <Badge className={getRiskColor(risk.status)} variant="secondary">
                        {risk.status}
                      </Badge>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {risk.description}
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
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">Optimization Opportunity</div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Rebalancing to Curve stETH/ETH pool could increase APY by 4.5% with minimal additional risk.
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Market Timing</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Historical data suggests entering Yearn vaults during current market conditions yields 15% higher returns.
                  </div>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Risk Alert</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Monitor governance proposals for Aave. Recent voting patterns indicate potential parameter changes.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export & Deploy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Allocation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Strategy
                </Button>
                <Button variant="default" size="sm" className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Auto-Deploy Strategy
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}