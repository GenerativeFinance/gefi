import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Brain, 
  BarChart3, 
  Clock, 
  DollarSign,
  MapPin,
  Network,
  Download,
  Upload,
  Settings,
  Play,
  Pause,
  Target,
  TrendingUp,
  Users,
  CreditCard,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function FraudDetectionBayesian() {
  const [isRealTime, setIsRealTime] = useState(true);
  const [fraudThreshold, setFraudThreshold] = useState([95]);
  const [selectedModel, setSelectedModel] = useState("bayesian");
  const [alertCount, setAlertCount] = useState(0);

  // Mock real-time transaction data
  const [transactions, setTransactions] = useState([
    { id: "TXN001", amount: "$2,847", customer: "John D.", merchant: "Amazon", time: "14:32:15", probability: 12.3, status: "normal" },
    { id: "TXN002", amount: "$15,000", customer: "Sarah M.", merchant: "Unknown", time: "14:32:18", probability: 97.2, status: "fraud" },
    { id: "TXN003", amount: "$89", customer: "Mike R.", merchant: "Starbucks", time: "14:32:21", probability: 8.7, status: "normal" },
    { id: "TXN004", amount: "$450", customer: "Lisa K.", merchant: "Target", time: "14:32:24", probability: 23.4, status: "normal" },
    { id: "TXN005", amount: "$3,200", customer: "Alex P.", merchant: "Casino XYZ", time: "14:32:27", probability: 89.1, status: "suspicious" }
  ]);

  const fraudCases = [
    {
      id: "CASE_001",
      transactionId: "TXN002",
      amount: "$15,000",
      customer: "Sarah M.",
      merchant: "Unknown Merchant",
      probability: 97.2,
      risk: "Critical",
      features: [
        { name: "Unusual Amount", weight: 0.35 },
        { name: "Unknown Merchant", weight: 0.28 },
        { name: "Off-hours Transaction", weight: 0.22 },
        { name: "Geographic Anomaly", weight: 0.15 }
      ]
    },
    {
      id: "CASE_002", 
      transactionId: "TXN005",
      amount: "$3,200",
      customer: "Alex P.",
      merchant: "Casino XYZ",
      probability: 89.1,
      risk: "High",
      features: [
        { name: "High-Risk Merchant", weight: 0.42 },
        { name: "Velocity Pattern", weight: 0.31 },
        { name: "Customer Behavior", weight: 0.27 }
      ]
    }
  ];

  const riskMetrics = [
    { name: "Transactions Flagged", value: "2.3%", trend: "down", color: "green" },
    { name: "Expected Loss", value: "$847K", trend: "down", color: "green" },
    { name: "False Positive Rate", value: "1.2%", trend: "up", color: "yellow" },
    { name: "Detection Accuracy", value: "96.7%", trend: "up", color: "green" }
  ];

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setAlertCount(prev => prev + Math.floor(Math.random() * 2));
        
        // Add new transaction occasionally
        if (Math.random() > 0.7) {
          const newTransaction = {
            id: `TXN${String(Date.now()).slice(-3)}`,
            amount: `$${Math.floor(Math.random() * 5000 + 100)}`,
            customer: ["Alice S.", "Bob T.", "Carol W.", "David L."][Math.floor(Math.random() * 4)],
            merchant: ["Amazon", "Target", "Unknown", "Walmart", "Casino"][Math.floor(Math.random() * 5)],
            time: new Date().toLocaleTimeString(),
            probability: Math.random() * 100,
            status: Math.random() > 0.9 ? "fraud" : Math.random() > 0.7 ? "suspicious" : "normal"
          };
          
          setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  const getStatusIcon = (status: string, probability: number) => {
    if (probability > fraudThreshold[0]) return <XCircle className="h-4 w-4 text-red-500" />;
    if (probability > 70) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusColor = (status: string, probability: number) => {
    if (probability > fraudThreshold[0]) return "destructive";
    if (probability > 70) return "secondary";
    return "default";
  };

  return (
    <Layout>
      <div className="container mx-auto p-3 md:p-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
              Fraud Detection & Anomaly Analysis
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Bayesian Inference models for real-time fraud detection and risk control
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Badge variant={isRealTime ? "default" : "secondary"} className="px-2 md:px-3 py-1 text-xs md:text-sm">
              {isRealTime ? (
                <><Activity className="h-3 w-3 mr-1" /> LIVE</>
              ) : (
                <><Pause className="h-3 w-3 mr-1" /> PAUSED</>
              )}
            </Badge>
            <Badge variant="destructive" className="px-2 md:px-3 py-1 text-xs md:text-sm">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {alertCount} Alerts
            </Badge>
            <Button 
              onClick={() => setIsRealTime(!isRealTime)}
              variant={isRealTime ? "destructive" : "default"}
              size="sm"
              className="text-sm"
            >
              {isRealTime ? <Pause className="h-4 w-4 mr-1 md:mr-2" /> : <Play className="h-4 w-4 mr-1 md:mr-2" />}
              <span className="hidden md:inline">{isRealTime ? "Stop Monitoring" : "Start Monitoring"}</span>
              <span className="md:hidden">{isRealTime ? "Stop" : "Start"}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Sidebar - Input Panel */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Detection Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Model Type</label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="bayesian">Bayesian Inference</option>
                    <option value="isolation">Isolation Forest</option>
                    <option value="autoencoder">Autoencoder</option>
                    <option value="gnn">Graph Neural Network</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">
                    Fraud Threshold: {fraudThreshold[0]}%
                  </label>
                  <Slider 
                    value={fraudThreshold}
                    onValueChange={setFraudThreshold}
                    min={90}
                    max={99}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Processing Mode</label>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant={isRealTime ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsRealTime(true)}
                    >
                      Real-time
                    </Button>
                    <Button 
                      variant={!isRealTime ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsRealTime(false)}
                    >
                      Batch
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium">Transaction Filters</label>
                  <div className="space-y-2 mt-2">
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option>All Transaction Types</option>
                      <option>Online Purchases</option>
                      <option>ATM Withdrawals</option>
                      <option>Wire Transfers</option>
                    </select>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option>All Regions</option>
                      <option>North America</option>
                      <option>Europe</option>
                      <option>Asia Pacific</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV/Excel
                </Button>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Payment API</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Banking Platform</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>ERP System</span>
                    <Badge variant="secondary">Offline</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard - Center Panel */}
          <div className="lg:col-span-6 space-y-4">
            {/* Live Transaction Stream */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Live Transaction Stream
                  </span>
                  <div className="text-sm text-muted-foreground">
                    Last update: {new Date().toLocaleTimeString()}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {transactions.map((txn, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(txn.status, txn.probability)}
                        <div>
                          <div className="font-medium">{txn.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {txn.customer} → {txn.merchant}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{txn.amount}</div>
                        <Badge variant={getStatusColor(txn.status, txn.probability)} className="text-xs">
                          {txn.probability.toFixed(1)}% risk
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Probability Distribution & Heatmap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Probability Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-950 dark:to-red-950 rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Bayesian Posterior</p>
                      <p className="text-xs text-muted-foreground">
                        Fraud vs Normal Distribution
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Geographic Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Fraud Hotspots</p>
                      <p className="text-xs text-muted-foreground">
                        Global risk concentration
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {riskMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="font-semibold text-lg">{metric.value}</div>
                      <p className="text-xs text-muted-foreground">{metric.name}</p>
                      <Badge 
                        variant={metric.color === "green" ? "default" : metric.color === "yellow" ? "secondary" : "destructive"}
                        className="text-xs mt-1"
                      >
                        {metric.trend === "up" ? "↑" : "↓"} {metric.trend}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Network Graph */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Suspicious Network Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950 rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <Network className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Network Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Suspicious connections between accounts, devices, and merchants
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Insights Panel */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Active Fraud Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fraudCases.map((case_, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="destructive" className="text-xs">
                          {case_.risk}
                        </Badge>
                        <span className="text-sm font-semibold">{case_.probability}%</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><strong>ID:</strong> {case_.transactionId}</div>
                        <div><strong>Amount:</strong> {case_.amount}</div>
                        <div><strong>Customer:</strong> {case_.customer}</div>
                        <div><strong>Merchant:</strong> {case_.merchant}</div>
                      </div>
                      <Separator className="my-2" />
                      <div className="text-xs">
                        <div className="font-medium mb-1">Evidence Weights:</div>
                        {case_.features.map((feature, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{feature.name}</span>
                            <span>{(feature.weight * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Bayesian Reasoning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Prior Probability</div>
                    <Progress value={15} className="mt-1" />
                    <div className="text-xs text-muted-foreground">15% base fraud rate</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Likelihood Evidence</div>
                    <Progress value={85} className="mt-1" />
                    <div className="text-xs text-muted-foreground">85% suspicious patterns</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Posterior Probability</div>
                    <Progress value={97} className="mt-1" />
                    <div className="text-xs text-muted-foreground">97% fraud confidence</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Model Explainability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Transaction Velocity</span>
                    <Badge variant="destructive">High Impact</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant Risk Score</span>
                    <Badge variant="destructive">High Impact</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Geographic Anomaly</span>
                    <Badge variant="secondary">Medium Impact</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Pattern</span>
                    <Badge variant="default">Low Impact</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Flagged Cases
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Send Alert Webhook
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Summary Panel */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">96.7%</div>
                    <div className="text-xs text-muted-foreground">Detection Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1.2%</div>
                    <div className="text-xs text-muted-foreground">False Positive Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">$847K</div>
                    <div className="text-xs text-muted-foreground">Expected Loss Prevented</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">127</div>
                    <div className="text-xs text-muted-foreground">Cases Investigated</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    System Healthy
                  </Badge>
                  <Button variant="default">
                    <Target className="h-4 w-4 mr-2" />
                    Tune Model
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}