import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Wallet, DollarSign, TrendingUp, Users, Activity, ArrowUpRight, ArrowDownRight, Target, Clock, CheckCircle, XCircle, Zap, Shield, AlertCircle, Link } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ModelRevenue {
  modelId: string;
  totalRevenue: number;
  developerShare: number;
  platformShare: number;
  investorShares: { address: string; percentage: number }[];
  isActive: boolean;
  lastDistribution: Date;
}

interface CrowdfundingCampaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  deadline: Date;
  status: 'active' | 'successful' | 'failed' | 'cancelled';
  creator: string;
  contributors: { address: string; amount: number }[];
  category: 'ai-model' | 'trading-bot' | 'research';
}

export default function BlockchainContracts() {
  const { toast } = useToast();
  
  // Demo state for smart contracts
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0.0234);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  // Sample data for demonstration
  const [models] = useState<ModelRevenue[]>([
    {
      modelId: 'quantum-risk-predictor',
      totalRevenue: 12.5,
      developerShare: 70,
      platformShare: 20,
      investorShares: [
        { address: '0x1234...5678', percentage: 5 },
        { address: '0x8765...4321', percentage: 5 }
      ],
      isActive: true,
      lastDistribution: new Date(Date.now() - 86400000)
    },
    {
      modelId: 'defi-yield-optimizer',
      totalRevenue: 8.3,
      developerShare: 65,
      platformShare: 25,
      investorShares: [
        { address: '0x9999...1111', percentage: 10 }
      ],
      isActive: true,
      lastDistribution: new Date(Date.now() - 172800000)
    }
  ]);

  const [campaigns] = useState<CrowdfundingCampaign[]>([
    {
      id: 'ai-sentiment-analyzer-v2',
      title: 'AI Sentiment Analyzer V2',
      description: 'Advanced sentiment analysis model with multi-language support and real-time processing capabilities.',
      goal: 50,
      raised: 32.5,
      deadline: new Date(Date.now() + 30 * 86400000),
      status: 'active',
      creator: '0xabcd...efgh',
      contributors: [
        { address: '0x1111...2222', amount: 15 },
        { address: '0x3333...4444', amount: 10 },
        { address: '0x5555...6666', amount: 7.5 }
      ],
      category: 'ai-model'
    },
    {
      id: 'defi-arbitrage-bot',
      title: 'DeFi Arbitrage Trading Bot',
      description: 'Automated trading bot for cross-chain arbitrage opportunities with MEV protection.',
      goal: 100,
      raised: 85.2,
      deadline: new Date(Date.now() + 15 * 86400000),
      status: 'active',
      creator: '0xijkl...mnop',
      contributors: [
        { address: '0x7777...8888', amount: 50 },
        { address: '0x9999...aaaa', amount: 25.2 },
        { address: '0xbbbb...cccc', amount: 10 }
      ],
      category: 'trading-bot'
    }
  ]);

  // Form states
  const [newModelForm, setNewModelForm] = useState({
    modelId: '',
    developer: '',
    developerShare: 70,
    platformShare: 30
  });

  const [newCampaignForm, setNewCampaignForm] = useState({
    campaignId: '',
    title: '',
    description: '',
    modelId: '',
    goal: '',
    durationInDays: 30,
    minContribution: '0.01',
    maxContribution: '10',
    category: 'ai-model'
  });

  const [contributeForm, setContributeForm] = useState({
    campaignId: '',
    amount: ''
  });

  const connectWallet = async () => {
    setLoading({ connect: true });
    
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setUserAddress('0x742d35Cc6634C0532925a3b8D24b693d54b32625');
      setLoading({ connect: false });
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask wallet"
      });
    }, 1500);
  };

  const handleRegisterModel = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setLoading({ registerModel: true });
    
    // Simulate blockchain transaction
    setTimeout(() => {
      toast({
        title: "Model Registered",
        description: `Model ${newModelForm.modelId} registered on blockchain with revenue sharing contract`
      });

      setNewModelForm({
        modelId: '',
        developer: '',
        developerShare: 70,
        platformShare: 30
      });
      
      setLoading({ registerModel: false });
    }, 2000);
  };

  const handleWithdrawRevenue = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setLoading({ withdraw: true });
    
    // Simulate withdrawal transaction
    setTimeout(() => {
      toast({
        title: "Revenue Withdrawn",
        description: `Successfully withdrew ${pendingWithdrawal.toFixed(4)} ETH to your wallet`
      });

      setPendingWithdrawal(0);
      setLoading({ withdraw: false });
    }, 2500);
  };

  const handleCreateCampaign = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setLoading({ createCampaign: true });
    
    // Simulate campaign creation
    setTimeout(() => {
      toast({
        title: "Campaign Created",
        description: `Crowdfunding campaign "${newCampaignForm.title}" deployed to blockchain`
      });

      setNewCampaignForm({
        campaignId: '',
        title: '',
        description: '',
        modelId: '',
        goal: '',
        durationInDays: 30,
        minContribution: '0.01',
        maxContribution: '10',
        category: 'ai-model'
      });
      
      setLoading({ createCampaign: false });
    }, 2000);
  };

  const handleContribute = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setLoading({ contribute: true });
    
    // Simulate contribution transaction
    setTimeout(() => {
      toast({
        title: "Contribution Successful",
        description: `Contributed ${contributeForm.amount} ETH to campaign ${contributeForm.campaignId}`
      });

      setContributeForm({ campaignId: '', amount: '' });
      setLoading({ contribute: false });
    }, 2000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Active', variant: 'default' as const, icon: Activity },
      successful: { label: 'Successful', variant: 'default' as const, icon: CheckCircle },
      failed: { label: 'Failed', variant: 'destructive' as const, icon: XCircle },
      cancelled: { label: 'Cancelled', variant: 'secondary' as const, icon: Clock }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: 'Unknown', variant: 'secondary' as const, icon: AlertCircle };
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Smart Contracts</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Transparent revenue sharing and crowdfunding powered by blockchain technology.
            All transactions are immutable, verifiable, and automatically executed through smart contracts.
          </p>
        </div>

        {/* Connection Status */}
        <Alert className={isConnected ? 'border-green-200 bg-green-50 dark:bg-green-950' : 'border-orange-200 bg-orange-50 dark:bg-orange-950'}>
          <Wallet className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                Wallet Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Wallet Not Connected
              </>
            )}
          </AlertTitle>
          <AlertDescription>
            {isConnected ? (
              <div className="space-y-1">
                <p>Connected to: {userAddress}</p>
                <p>Network: Ethereum Mainnet</p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span>Connect your wallet to interact with smart contracts</span>
                <Button onClick={connectWallet} disabled={loading.connect} size="sm">
                  {loading.connect ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Withdrawal</p>
                  <p className="text-2xl font-bold">{pendingWithdrawal.toFixed(4)} ETH</p>
                  <p className="text-xs text-slate-500">≈ ${(pendingWithdrawal * 2000).toFixed(2)} USD</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Models</p>
                  <p className="text-2xl font-bold">{models.filter(m => m.isActive).length}</p>
                  <p className="text-xs text-slate-500">Revenue sharing enabled</p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Campaigns</p>
                  <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p>
                  <p className="text-xs text-slate-500">Crowdfunding ongoing</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Raised</p>
                  <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.raised, 0).toFixed(1)} ETH</p>
                  <p className="text-xs text-slate-500">Across all campaigns</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue Sharing</TabsTrigger>
            <TabsTrigger value="crowdfunding">Crowdfunding</TabsTrigger>
            <TabsTrigger value="analytics">Blockchain Analytics</TabsTrigger>
          </TabsList>

          {/* Revenue Sharing Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Register Model */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Register AI Model
                  </CardTitle>
                  <CardDescription>
                    Deploy your AI model to the revenue sharing smart contract
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="modelId">Model ID</Label>
                    <Input
                      id="modelId"
                      value={newModelForm.modelId}
                      onChange={(e) => setNewModelForm({ ...newModelForm, modelId: e.target.value })}
                      placeholder="unique-model-id"
                    />
                  </div>
                  <div>
                    <Label htmlFor="developer">Developer Address</Label>
                    <Input
                      id="developer"
                      value={newModelForm.developer}
                      onChange={(e) => setNewModelForm({ ...newModelForm, developer: e.target.value })}
                      placeholder="0x..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="developerShare">Developer Share (%)</Label>
                      <Input
                        id="developerShare"
                        type="number"
                        value={newModelForm.developerShare}
                        onChange={(e) => setNewModelForm({ ...newModelForm, developerShare: parseInt(e.target.value) })}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="platformShare">Platform Share (%)</Label>
                      <Input
                        id="platformShare"
                        type="number"
                        value={newModelForm.platformShare}
                        onChange={(e) => setNewModelForm({ ...newModelForm, platformShare: parseInt(e.target.value) })}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleRegisterModel} 
                    className="w-full"
                    disabled={loading.registerModel}
                  >
                    {loading.registerModel ? 'Deploying to Blockchain...' : 'Register Model'}
                  </Button>
                </CardContent>
              </Card>

              {/* Withdraw Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowDownRight className="h-5 w-5" />
                    Withdraw Revenue
                  </CardTitle>
                  <CardDescription>
                    Withdraw your earned revenue from smart contracts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg p-4 border">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Available for Withdrawal</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {pendingWithdrawal.toFixed(6)} ETH
                      </p>
                      <p className="text-sm text-slate-500">
                        ≈ ${(pendingWithdrawal * 2000).toFixed(2)} USD
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gas Estimate:</span>
                      <span>~0.002 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Net Amount:</span>
                      <span className="font-medium">{(pendingWithdrawal - 0.002).toFixed(4)} ETH</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleWithdrawRevenue} 
                    className="w-full"
                    disabled={loading.withdraw || pendingWithdrawal === 0}
                  >
                    {loading.withdraw ? 'Processing Transaction...' : 'Withdraw Revenue'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Active Models */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sharing Models</CardTitle>
                <CardDescription>
                  AI models with active revenue sharing smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {models.map((model, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{model.modelId}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Last distribution: {formatDate(model.lastDistribution)}
                          </p>
                        </div>
                        <Badge variant={model.isActive ? 'default' : 'secondary'}>
                          {model.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
                          <p className="text-lg font-bold">{model.totalRevenue.toFixed(4)} ETH</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Developer Share</p>
                          <p className="text-lg font-bold">{model.developerShare}%</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Platform Share</p>
                          <p className="text-lg font-bold">{model.platformShare}%</p>
                        </div>
                      </div>

                      {model.investorShares.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Investor Shares:</p>
                          <div className="flex flex-wrap gap-2">
                            {model.investorShares.map((investor, idx) => (
                              <Badge key={idx} variant="outline">
                                {investor.address}: {investor.percentage}%
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crowdfunding Tab */}
          <TabsContent value="crowdfunding" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Campaign */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Create Campaign
                  </CardTitle>
                  <CardDescription>
                    Deploy a crowdfunding campaign smart contract
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="campaignId">Campaign ID</Label>
                    <Input
                      id="campaignId"
                      value={newCampaignForm.campaignId}
                      onChange={(e) => setNewCampaignForm({ ...newCampaignForm, campaignId: e.target.value })}
                      placeholder="unique-campaign-id"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newCampaignForm.title}
                      onChange={(e) => setNewCampaignForm({ ...newCampaignForm, title: e.target.value })}
                      placeholder="Campaign title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCampaignForm.description}
                      onChange={(e) => setNewCampaignForm({ ...newCampaignForm, description: e.target.value })}
                      placeholder="Campaign description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goal">Goal (ETH)</Label>
                      <Input
                        id="goal"
                        value={newCampaignForm.goal}
                        onChange={(e) => setNewCampaignForm({ ...newCampaignForm, goal: e.target.value })}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (Days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newCampaignForm.durationInDays}
                        onChange={(e) => setNewCampaignForm({ ...newCampaignForm, durationInDays: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newCampaignForm.category}
                      onValueChange={(value) => setNewCampaignForm({ ...newCampaignForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai-model">AI Model</SelectItem>
                        <SelectItem value="trading-bot">Trading Bot</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleCreateCampaign} 
                    className="w-full"
                    disabled={loading.createCampaign}
                  >
                    {loading.createCampaign ? 'Deploying Contract...' : 'Create Campaign'}
                  </Button>
                </CardContent>
              </Card>

              {/* Contribute to Campaign */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5" />
                    Contribute to Campaign
                  </CardTitle>
                  <CardDescription>
                    Support AI model development through smart contracts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contributeCampaignId">Campaign ID</Label>
                    <Select
                      value={contributeForm.campaignId}
                      onValueChange={(value) => setContributeForm({ ...contributeForm, campaignId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaigns.filter(c => c.status === 'active').map(campaign => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contributeAmount">Amount (ETH)</Label>
                    <Input
                      id="contributeAmount"
                      value={contributeForm.amount}
                      onChange={(e) => setContributeForm({ ...contributeForm, amount: e.target.value })}
                      placeholder="0.1"
                    />
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Smart Contract Protection</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Funds are held in escrow and automatically refunded if campaign fails
                    </p>
                  </div>
                  <Button 
                    onClick={handleContribute} 
                    className="w-full"
                    disabled={loading.contribute}
                  >
                    {loading.contribute ? 'Processing Transaction...' : 'Contribute'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Active Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Active Crowdfunding Campaigns</CardTitle>
                <CardDescription>
                  Blockchain-powered crowdfunding with transparent fund management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {campaigns.map((campaign, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{campaign.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{campaign.description}</p>
                          <p className="text-xs text-slate-500 mt-2">Creator: {campaign.creator}</p>
                        </div>
                        {getStatusBadge(campaign.status)}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{campaign.raised.toFixed(1)} / {campaign.goal.toFixed(1)} ETH</span>
                        </div>
                        <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Contributors</p>
                            <p className="text-lg font-bold">{campaign.contributors.length}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Deadline</p>
                            <p className="text-lg font-bold">{formatDate(campaign.deadline)}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Category</p>
                            <p className="text-lg font-bold capitalize">{campaign.category.replace('-', ' ')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Link className="h-4 w-4" />
                          <span>Contract: 0x{campaign.id.substring(0, 8)}...{campaign.id.substring(campaign.id.length - 8)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Analytics</CardTitle>
                  <CardDescription>
                    Real-time blockchain data and smart contract metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Total Contracts Deployed</span>
                      <span className="font-bold">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Revenue Streams</span>
                      <span className="font-bold">{models.filter(m => m.isActive).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Value Locked</span>
                      <span className="font-bold">284.7 ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Gas Used</span>
                      <span className="font-bold">127,450</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>
                    Global platform metrics and blockchain activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Total Revenue Distributed</span>
                      <span className="font-bold">{models.reduce((sum, m) => sum + m.totalRevenue, 0).toFixed(2)} ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Successful Campaigns</span>
                      <span className="font-bold">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Raised</span>
                      <span className="font-bold">{campaigns.reduce((sum, c) => sum + c.raised, 0).toFixed(1)} ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Platform Fee Rate</span>
                      <span className="font-bold">2.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Features</CardTitle>
                <CardDescription>
                  Advanced features enabled by blockchain technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="h-6 w-6 text-blue-500" />
                      <h4 className="font-semibold">Trustless Execution</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Automated revenue distribution without intermediaries
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-6 w-6 text-green-500" />
                      <h4 className="font-semibold">Multi-Party Sharing</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Automatic distribution to developers, platform, and investors
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="h-6 w-6 text-orange-500" />
                      <h4 className="font-semibold">Escrow Protection</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Funds held securely until campaign goals are met
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="h-6 w-6 text-purple-500" />
                      <h4 className="font-semibold">Real-time Tracking</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Live updates of all transactions and distributions
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="h-6 w-6 text-indigo-500" />
                      <h4 className="font-semibold">Gas Optimization</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Efficient smart contracts with minimal transaction costs
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-950 dark:to-green-950 rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-6 w-6 text-teal-500" />
                      <h4 className="font-semibold">Verified Contracts</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Open source, audited smart contracts for maximum transparency
                    </p>
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