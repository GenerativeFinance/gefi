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
  ArrowLeft, Shield, AlertTriangle, Eye, Network, Activity, Zap, 
  TrendingDown, Clock, MapPin, Download, Settings, RefreshCw,
  FileText, Webhook, Database, Globe, ChevronRight, DollarSign,
  Target, Brain, Search, Filter, Play, Pause
} from 'lucide-react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';

export default function DeFiAnomalyDetection() {
  const [, setLocation] = useLocation();
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [sensitivity, setSensitivity] = useState([75]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const [anomalyFocus, setAnomalyFocus] = useState('all');

  // Real-time monitoring data
  const [liveAlerts, setLiveAlerts] = useState([
    {
      id: 1,
      timestamp: '2025-08-17 16:15:32',
      wallet: '0x742d...8f3e',
      token: 'SHIB2.0',
      activity: 'Potential Rug Pull',
      riskLevel: 95,
      confidence: 89,
      details: '90% liquidity removed in 3 minutes'
    },
    {
      id: 2,
      timestamp: '2025-08-17 16:12:18',
      wallet: '0x1a4b...9c2d',
      token: 'ETH/USDC',
      activity: 'Flash Loan Attack',
      riskLevel: 78,
      confidence: 92,
      details: 'Unusual arbitrage pattern detected'
    },
    {
      id: 3,
      timestamp: '2025-08-17 16:08:45',
      wallet: '0x8e7f...4a1b',
      token: 'DOGE-CLONE',
      activity: 'Wash Trading',
      riskLevel: 65,
      confidence: 76,
      details: 'Self-trading pattern identified'
    }
  ]);

  const protocolHealthScores = [
    { name: 'Uniswap V3', score: 98, status: 'Healthy', change: +2 },
    { name: 'Curve Finance', score: 95, status: 'Healthy', change: -1 },
    { name: 'SushiSwap', score: 88, status: 'Warning', change: -5 },
    { name: 'PancakeSwap', score: 92, status: 'Healthy', change: +3 },
    { name: 'Compound', score: 85, status: 'Caution', change: -8 }
  ];

  const networkGraphData = {
    nodes: 15,
    suspiciousConnections: 3,
    flaggedWallets: 7,
    riskClusters: 2
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100';
    if (risk >= 60) return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100';
    return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Healthy': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100',
      'Warning': 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100',
      'Caution': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100'
    };
    return colors[status] || colors['Caution'];
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
                <Shield className="w-8 h-8 text-blue-600" />
                DeFi Security Command Center
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Real-time on-chain anomaly detection for rug pulls, flash-loan attacks, and wash trading
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <Activity className="w-3 h-3 mr-1" />
              Live Monitoring
            </Badge>
            <Button
              variant={isMonitoring ? "destructive" : "default"}
              onClick={() => setIsMonitoring(!isMonitoring)}
              className="flex items-center gap-2"
            >
              {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isMonitoring ? 'Stop Monitor' : 'Start Monitor'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Connections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="wallet-input">Monitor Wallet/Contract</Label>
                  <Input 
                    id="wallet-input"
                    placeholder="0x742d...8f3e or ENS name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Blockchain Network</Label>
                  <Select value={selectedChain} onValueChange={setSelectedChain}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="bsc">BSC</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="multi-chain">Multi-chain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="real-time">Real-time Analysis</Label>
                  <Switch id="real-time" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Detection Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Anomaly Focus</Label>
                  <Select value={anomalyFocus} onValueChange={setAnomalyFocus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Anomalies</SelectItem>
                      <SelectItem value="rug-pulls">Rug Pulls</SelectItem>
                      <SelectItem value="flash-loans">Flash Loan Attacks</SelectItem>
                      <SelectItem value="wash-trading">Wash Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sensitivity: {sensitivity[0]}%</Label>
                  <Slider
                    value={sensitivity}
                    onValueChange={setSensitivity}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <div>
                  <Label>Detection Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ensemble">Ensemble (Recommended)</SelectItem>
                      <SelectItem value="isolation-forest">Isolation Forest</SelectItem>
                      <SelectItem value="autoencoder">Autoencoder</SelectItem>
                      <SelectItem value="gnn">Graph Neural Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="monitor" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monitor">Real-time Monitor</TabsTrigger>
                <TabsTrigger value="network">Network Graph</TabsTrigger>
                <TabsTrigger value="protocols">Protocol Health</TabsTrigger>
              </TabsList>

              <TabsContent value="monitor" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Live Threat Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {liveAlerts.map((alert) => (
                          <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getRiskColor(alert.riskLevel)}>
                                  Risk: {alert.riskLevel}%
                                </Badge>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {alert.timestamp}
                                </span>
                              </div>
                              <div className="text-sm font-medium">{alert.activity}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {alert.wallet} • {alert.token}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{alert.details}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">Confidence</div>
                              <div className="text-lg font-bold text-blue-600">{alert.confidence}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Eye className="w-8 h-8 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold">847</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Monitored Wallets</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                        <div>
                          <div className="text-2xl font-bold text-red-600">12</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Active Threats</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="network" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="w-5 h-5" />
                      Wallet Risk Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed">
                      <div className="text-center">
                        <Network className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive Network Graph
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Showing {networkGraphData.nodes} nodes, {networkGraphData.suspiciousConnections} suspicious connections
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{networkGraphData.flaggedWallets}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Flagged Wallets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{networkGraphData.riskClusters}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Risk Clusters</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="protocols" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Protocol Security Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {protocolHealthScores.map((protocol, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                              <Globe className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{protocol.name}</div>
                              <Badge className={getStatusColor(protocol.status)} variant="secondary">
                                {protocol.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{protocol.score}</div>
                            <div className={`text-sm ${protocol.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {protocol.change >= 0 ? '+' : ''}{protocol.change}
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
                  <FileText className="w-5 h-5" />
                  Detailed Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2 text-sm">
                    {liveAlerts.map((alert) => (
                      <div key={alert.id} className="p-2 border rounded text-xs">
                        <div className="font-medium">{alert.activity}</div>
                        <div className="text-gray-600 dark:text-gray-400">{alert.details}</div>
                        <div className="flex justify-between mt-1">
                          <span>{alert.token}</span>
                          <span className="text-blue-600">{alert.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="text-sm font-medium text-red-800 dark:text-red-200">Critical Alert</div>
                  <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                    Detected potential rug pull: 90% of SHIB2.0 liquidity withdrawn in 3 minutes. 
                    Pattern matches known exit scam signatures.
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Flash Loan Pattern</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Unusual arbitrage sequence detected. Model confidence: 92%. 
                    Similar to previous Curve pool exploits.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Alert Log
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Network className="w-4 h-4 mr-2" />
                  Download Network Graph
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Threat Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Webhook className="w-4 h-4 mr-2" />
                  Setup Webhooks
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}