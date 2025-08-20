import Layout from "@/components/layout/Layout";
import ContextualMobileNav from "@/components/layout/contextual-mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  CreditCard, 
  FileText, 
  Eye, 
  Plus, 
  Download, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Shield,
  Key,
  Copy,
  ExternalLink,
  Settings,
  Zap,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  BookOpen,
  Code,
  Link as LinkIcon,
  Activity,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  Building,
  Users,
  Target,
  Award,
  Star,
  Brain,
  Network,
  Database,
  Cpu,
  Share2,
  GitBranch,
  PlayCircle,
  PauseCircle,
  Upload,
  RotateCcw,
  TrendingDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import FederatedLearningGraph from "@/components/FederatedLearningGraph";
import { Sparkles } from "lucide-react";

export default function WalletPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isNewContractOpen, setIsNewContractOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [flModelStatus, setFlModelStatus] = useState("idle");
  const [selectedChain, setSelectedChain] = useState<string>("solana");
  const [hasPro, setHasPro] = useState<boolean>(() => !!localStorage.getItem("gefi.contractWallet.pro"));

  // Contract Model Status
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: 85.3,
    loss: 0.247,
    participants: 12,
    rounds: 45,
    lastUpdate: new Date().toISOString()
  });

  // Subscribe to Contract Wallet Pro
  const subscribePro = useMutation({
    mutationFn: async () => {
      const resp = await apiRequest("POST", "/api/contract-wallet/subscribe", {});
      if ((resp as any)?.json) return (resp as Response).json();
      return resp;
    },
    onSuccess: (data: any) => {
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      localStorage.setItem("gefi.contractWallet.pro", "true");
      setHasPro(true);
      toast({ title: "Activated", description: "Contract Wallet Pro is now active." });
    },
    onError: (err: any) => {
      toast({ title: "Activation failed", description: String(err?.message || "Please try again."), variant: "destructive" });
    }
  });

  // Mock wallet data for contract system
  const contractWalletData = {
    publicKey: "contract_" + (user as any)?.id || "demo_key",
    balance: 2850, // GeFi tokens
    totalEarnings: 12450,
    contributions: 47,
    rank: "#23",
    stakeholderType: (user as any)?.role || "investor"
  };

  // Contract Wallet Contracts
  const flContracts = [
    {
      id: 1,
      name: "Asset Price Prediction Model",
      type: "AI Model Contract",
      contractAddress: "0xcw_001...abc",
      status: "Active",
      balance: "1,250 GeFi",
      totalEarnings: "8,450 GeFi",
      participants: 12,
      createdDate: "2024-01-15",
      lastActivity: "2 minutes ago",
      mlTask: "Price Prediction",
      modelAccuracy: "85.3%",
      contributionReward: "10 GeFi/update",
      nextAggregation: "In 23 minutes"
    },
    {
      id: 2,
      name: "Risk Assessment Collaborative Model",
      type: "AI Model Contract",
      contractAddress: "0xcw_002...def",
      status: "Training",
      balance: "850 GeFi",
      totalEarnings: "2,100 GeFi",
      participants: 8,
      createdDate: "2024-02-01",
      lastActivity: "5 minutes ago",
      mlTask: "Risk Classification",
      modelAccuracy: "78.1%",
      contributionReward: "15 GeFi/update",
      nextAggregation: "In 45 minutes"
    },
    {
      id: 3,
      name: "Market Sentiment Analysis",
      type: "Federated Learning",
      contractAddress: "0xfl_003...ghi",
      status: "Completed",
      balance: "750 GeFi",
      totalEarnings: "1,900 GeFi",
      participants: 25,
      createdDate: "2023-12-01",
      lastActivity: "2 days ago",
      mlTask: "Sentiment Classification",
      modelAccuracy: "92.7%",
      contributionReward: "8 GeFi/update",
      nextAggregation: "Completed"
    }
  ];

  // FL Transaction History
  const flTransactions = [
    {
      id: 1,
      type: "Model Contribution Reward",
      amount: "+10 GeFi",
      contract: "Asset Price Prediction Model",
      date: "2025-01-07 11:02",
      txHash: "0xfl_tx_001",
      status: "Confirmed",
      details: "Local model update submitted"
    },
    {
      id: 2,
      type: "Aggregation Bonus",
      amount: "+25 GeFi",
      contract: "Risk Assessment Model",
      date: "2025-01-07 10:45",
      txHash: "0xfl_tx_002",
      status: "Confirmed",
      details: "High-quality contribution bonus"
    },
    {
      id: 3,
      type: "Contract Deployment",
      amount: "-50 GeFi",
      contract: "New FL Initiative",
      date: "2025-01-06 14:30",
      txHash: "0xfl_tx_003",
      status: "Confirmed",
      details: "Smart contract deployment fee"
    }
  ];

  // FL Training simulation
  const simulateTraining = async () => {
    setIsTrainingActive(true);
    setFlModelStatus("training");
    setTrainingProgress(0);
    
    // Simulate training progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setTrainingProgress(i);
    }
    
    setIsTrainingActive(false);
    setFlModelStatus("completed");
    
    // Update wallet balance
    toast({
      title: "Training Complete!",
      description: "You earned 10 GeFi tokens for your contribution.",
    });
    
    // Reset after a few seconds
    setTimeout(() => {
      setFlModelStatus("idle");
      setTrainingProgress(0);
    }, 2000);
  };

  // Create new FL wallet
  const createWallet = async () => {
    try {
      const newAddress = "fl_" + Math.random().toString(36).substr(2, 9);
      setWalletAddress(newAddress);
      toast({
        title: "Wallet Created!",
        description: `Your FL wallet address: ${newAddress}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Training": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Completed": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "Expired": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Federated Learning": return <Brain className="w-4 h-4" />;
      case "Revenue Sharing": return <TrendingUp className="w-4 h-4" />;
      case "Data Licensing": return <Building className="w-4 h-4" />;
      case "Crowdfunding": return <Users className="w-4 h-4" />;
      case "Subscription": return <RefreshCw className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStakeholderRole = (role: string) => {
    switch (role) {
      case "investor": return { icon: <TrendingUp className="w-4 h-4" />, label: "Investor", color: "text-green-600" };
      case "developer": return { icon: <Code className="w-4 h-4" />, label: "Developer", color: "text-blue-600" };
      case "data_provider": return { icon: <Database className="w-4 h-4" />, label: "Data Provider", color: "text-purple-600" };
      case "regulator": return { icon: <Shield className="w-4 h-4" />, label: "Regulator", color: "text-orange-600" };
      default: return { icon: <Users className="w-4 h-4" />, label: "Participant", color: "text-gray-600" };
    }
  };

  const filteredContracts = flContracts.filter(contract => {
    const statusMatch = filterStatus === "all" || contract.status.toLowerCase() === filterStatus;
    const typeMatch = filterType === "all" || contract.type.toLowerCase().replace(/\s+/g, '-') === filterType;
    return statusMatch && typeMatch;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Mobile Navigation for Wallet */}
        <ContextualMobileNav context="portfolio" />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              Contract Wallet
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage stakeholder contracts for your AI financial models across supported blockchains
            </p>
          </div>
          
          {/* Chain selector and Pro upsell */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select blockchain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
              </SelectContent>
            </Select>

            {!hasPro && (
              <Button onClick={() => subscribePro.mutate()} className="gap-2" disabled={subscribePro.isPending}>
                <Sparkles className="h-4 w-4" />
                {subscribePro.isPending ? "Activating..." : "Enable Contract Wallet Pro – $19/mo"}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={createWallet} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Wallet
            </Button>
            <Button onClick={simulateTraining} disabled={isTrainingActive} className="bg-primary hover:bg-primary/90">
              {isTrainingActive ? (
                <>
                  <PauseCircle className="w-4 h-4 mr-2" />
                  Training...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Training
                </>
              )}
            </Button>
          </div>
        </div>

        {/* FL Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">GeFi Balance</p>
                  <p className="text-2xl font-bold">{contractWalletData.balance.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">tokens</p>
                </div>
                <Wallet className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">{contractWalletData.totalEarnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">GeFi tokens</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contributions</p>
                  <p className="text-2xl font-bold">{contractWalletData.contributions}</p>
                  <p className="text-xs text-muted-foreground">model updates</p>
                </div>
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leaderboard Rank</p>
                  <p className="text-2xl font-bold">{contractWalletData.rank}</p>
                  <p className="text-xs text-muted-foreground">global ranking</p>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stakeholder Type</p>
                  <div className="flex items-center gap-2">
                    {getStakeholderRole(contractWalletData.stakeholderType).icon}
                    <p className="text-sm font-semibold capitalize">{getStakeholderRole(contractWalletData.stakeholderType).label}</p>
                  </div>
                </div>
                <Network className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FL Model Status */}
        {isTrainingActive && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                Federated Learning in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Training Progress</span>
                  <span className="text-sm font-mono">{trainingProgress}%</span>
                </div>
                <Progress value={trainingProgress} className="w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Accuracy</p>
                    <p className="font-semibold">{modelMetrics.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Loss</p>
                    <p className="font-semibold">{modelMetrics.loss}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Active Participants</p>
                    <p className="font-semibold">{modelMetrics.participants}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Training Rounds</p>
                    <p className="font-semibold">{modelMetrics.rounds}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="contracts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* FL Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search FL contracts..."
                  className="w-full"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="price-prediction">Price Prediction</SelectItem>
                  <SelectItem value="risk-classification">Risk Classification</SelectItem>
                  <SelectItem value="sentiment-analysis">Sentiment Analysis</SelectItem>
                  <SelectItem value="fraud-detection">Fraud Detection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FL Contracts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredContracts.map((contract) => (
                <Card key={contract.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(contract.type)}
                        <div>
                          <CardTitle className="text-lg">{contract.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{contract.mlTask}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Balance</p>
                        <p className="font-semibold text-green-600">{contract.balance}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Earnings</p>
                        <p className="font-semibold">{contract.totalEarnings}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Model Accuracy</p>
                        <p className="font-semibold text-blue-600">{contract.modelAccuracy}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Reward/Update</p>
                        <p className="font-semibold text-purple-600">{contract.contributionReward}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participants</p>
                        <p className="font-semibold">{contract.participants}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Aggregation</p>
                        <p className="font-semibold">{contract.nextAggregation}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Contract Address:</span>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-xs">
                            {contract.contractAddress}
                          </code>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedContract(contract)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {contract.status === "Active" && (
                        <Button 
                          size="sm" 
                          onClick={simulateTraining}
                          disabled={isTrainingActive}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Train
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FL Transaction History Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  FL Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type.includes('Reward') || tx.type.includes('Bonus') ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
                        }`}>
                          {tx.type.includes('Reward') || tx.type.includes('Bonus') ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : tx.type.includes('Deployment') ? (
                            <Upload className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Brain className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.contract}</p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
                          <p className="text-xs text-blue-600">{tx.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.amount}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {tx.status}
                        </div>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {tx.txHash}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Model Performance Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Model Accuracy Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flContracts.map((contract) => (
                      <div key={contract.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{contract.name}</span>
                          <span className="font-semibold text-blue-600">{contract.modelAccuracy}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: contract.modelAccuracy }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Training Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Global Model Accuracy</span>
                      <span className="font-semibold text-green-600">{modelMetrics.accuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Loss</span>
                      <span className="font-semibold">{modelMetrics.loss}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Training Rounds</span>
                      <span className="font-semibold">{modelMetrics.rounds}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Participants</span>
                      <span className="font-semibold">{modelMetrics.participants}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <Button onClick={simulateTraining} disabled={isTrainingActive} className="w-full">
                        {isTrainingActive ? (
                          <>
                            <PauseCircle className="w-4 h-4 mr-2" />
                            Training in Progress...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Contribute to Training
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Network Visualization Tab */}
          <TabsContent value="network" className="space-y-6">
            <FederatedLearningGraph />
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  FL Contributors Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "DataMaster Pro", contributions: 156, tokens: 15600, accuracy: "94.2%" },
                    { rank: 2, name: "ML_Investor_01", contributions: 143, tokens: 14300, accuracy: "93.8%" },
                    { rank: 3, name: "QuantAnalyst", contributions: 128, tokens: 12800, accuracy: "92.1%" },
                    { rank: 23, name: `You (${contractWalletData.publicKey.slice(0, 12)}...)`, contributions: contractWalletData.contributions, tokens: contractWalletData.totalEarnings, accuracy: "85.3%", isUser: true }
                  ].map((participant) => (
                    <div 
                      key={participant.rank} 
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        participant.isUser ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          participant.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          participant.rank === 2 ? 'bg-gray-100 text-gray-800' :
                          participant.rank === 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          #{participant.rank}
                        </div>
                        <div>
                          <p className={`font-medium ${participant.isUser ? 'text-primary' : ''}`}>
                            {participant.name}
                            {participant.isUser && <Badge className="ml-2 text-xs">You</Badge>}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {participant.contributions} contributions • {participant.accuracy} avg accuracy
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{participant.tokens.toLocaleString()} GeFi</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 text-yellow-500" />
                          Top Contributor
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FL Wallet Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Wallet Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="wallet-address">FL Wallet Address</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        id="wallet-address"
                        value={contractWalletData.publicKey}
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="stakeholder-type">Stakeholder Type</Label>
                    <Select defaultValue={contractWalletData.stakeholderType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investor">Investor</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="data_provider">Data Provider</SelectItem>
                        <SelectItem value="regulator">Regulator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full" onClick={createWallet}>
                      <Plus className="w-4 h-4 mr-2" />
                      Generate New Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    FL Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Auto-join Training Rounds</Label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-muted-foreground">
                        Automatically participate when eligible
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Reward Threshold</Label>
                    <Input type="number" placeholder="10" defaultValue="10" className="mt-1" />
                    <p className="text-xs text-muted-foreground">
                      Minimum GeFi tokens to participate
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Privacy Level</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High (More Noise)</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="low">Low (Better Accuracy)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Two-Factor Authentication</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Encryption</span>
                      <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Audit Trail</span>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Regulatory Compliance</span>
                      <Badge className="bg-green-100 text-green-800">GDPR</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Residency</span>
                      <Badge className="bg-blue-100 text-blue-800">EU/US</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Model Verification</span>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contract Details Modal */}
        <Dialog open={!!selectedContract} onOpenChange={(open) => !open && setSelectedContract(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                {selectedContract?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedContract && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ML Task</Label>
                    <p className="text-sm font-medium">{selectedContract.mlTask}</p>
                  </div>
                  <div>
                    <Label>Model Accuracy</Label>
                    <p className="text-sm font-medium text-blue-600">{selectedContract.modelAccuracy}</p>
                  </div>
                  <div>
                    <Label>Current Status</Label>
                    <Badge className={getStatusColor(selectedContract.status)}>
                      {selectedContract.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Participants</Label>
                    <p className="text-sm font-medium">{selectedContract.participants}</p>
                  </div>
                </div>
                <div>
                  <Label>Contract Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-muted px-3 py-2 rounded text-sm flex-1">
                      {selectedContract.contractAddress}
                    </code>
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total Earnings</Label>
                    <p className="text-lg font-semibold text-green-600">{selectedContract.totalEarnings}</p>
                  </div>
                  <div>
                    <Label>Reward per Update</Label>
                    <p className="text-lg font-semibold text-purple-600">{selectedContract.contributionReward}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={simulateTraining} disabled={isTrainingActive} className="flex-1">
                    {isTrainingActive ? (
                      <>
                        <PauseCircle className="w-4 h-4 mr-2" />
                        Training in Progress...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Participate in Training
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const contractAddress = selectedContract.contractAddress || '0xf1_001...abc';
                      window.open(`https://etherscan.io/address/${contractAddress}`, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}