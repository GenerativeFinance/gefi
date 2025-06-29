import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/contexts/Web3Context';
import { smartContractService, type ModelInfo, type CampaignInfo, type RevenueDistribution, type Contribution } from '@/lib/smartContractService';
import { Wallet, DollarSign, TrendingUp, Users, Activity, ArrowUpRight, ArrowDownRight, Target, Clock, CheckCircle, XCircle, Zap, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function SmartContracts() {
  const { address, isConnected, connectWallet } = useWeb3();
  const { toast } = useToast();
  
  // Revenue Sharing State
  const [pendingWithdrawal, setPendingWithdrawal] = useState<string>('0');
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [revenueHistory, setRevenueHistory] = useState<RevenueDistribution[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  
  // Crowdfunding State
  const [campaigns, setCampaigns] = useState<CampaignInfo[]>([]);
  const [userContributions, setUserContributions] = useState<Contribution[]>([]);
  const [platformStats, setPlatformStats] = useState<{ totalCampaigns: number; totalRaised: string; platformFee: number }>({
    totalCampaigns: 0,
    totalRaised: '0',
    platformFee: 0
  });

  // Form States
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

  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isConnected && address) {
      loadUserData();
      loadPlatformStats();
    }
  }, [isConnected, address]);

  const loadUserData = async () => {
    if (!address) return;

    try {
      // Load pending withdrawal
      const pending = await smartContractService.getPendingWithdrawal(address);
      setPendingWithdrawal(pending);

      // Load user contributions
      const contributions = await smartContractService.getUserContributions(address);
      setUserContributions(contributions);

      // Load user campaigns
      const userCampaigns = await smartContractService.getUserCampaigns(address);
      const campaignInfos = await Promise.all(
        userCampaigns.map(id => smartContractService.getCampaignInfo(id))
      );
      setCampaigns(campaignInfos);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadPlatformStats = async () => {
    try {
      const stats = await smartContractService.getPlatformStats();
      setPlatformStats(stats);
    } catch (error) {
      console.error('Error loading platform stats:', error);
    }
  };

  const loadModelInfo = async (modelId: string) => {
    if (!modelId) return;

    try {
      const info = await smartContractService.getModelInfo(modelId);
      setModelInfo(info);

      const history = await smartContractService.getRevenueHistory(modelId);
      setRevenueHistory(history);
    } catch (error) {
      console.error('Error loading model info:', error);
      toast({
        title: "Error",
        description: "Failed to load model information",
        variant: "destructive"
      });
    }
  };

  const handleRegisterModel = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setLoading({ registerModel: true });
    try {
      const tx = await smartContractService.registerModel(
        newModelForm.modelId,
        newModelForm.developer,
        newModelForm.developerShare,
        newModelForm.platformShare
      );
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Model registered successfully!"
      });

      setNewModelForm({
        modelId: '',
        developer: '',
        developerShare: 70,
        platformShare: 30
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register model",
        variant: "destructive"
      });
    } finally {
      setLoading({ registerModel: false });
    }
  };

  const handleWithdrawRevenue = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setLoading({ withdraw: true });
    try {
      const tx = await smartContractService.withdrawRevenue();
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Revenue withdrawn successfully!"
      });

      setPendingWithdrawal('0');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to withdraw revenue",
        variant: "destructive"
      });
    } finally {
      setLoading({ withdraw: false });
    }
  };

  const handleCreateCampaign = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setLoading({ createCampaign: true });
    try {
      const tx = await smartContractService.createCampaign(
        newCampaignForm.campaignId,
        newCampaignForm.title,
        newCampaignForm.description,
        newCampaignForm.modelId,
        newCampaignForm.goal,
        newCampaignForm.durationInDays,
        newCampaignForm.minContribution,
        newCampaignForm.maxContribution,
        newCampaignForm.category
      );
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Campaign created successfully!"
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

      loadUserData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive"
      });
    } finally {
      setLoading({ createCampaign: false });
    }
  };

  const handleContribute = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setLoading({ contribute: true });
    try {
      const tx = await smartContractService.contributeToCampaign(
        contributeForm.campaignId,
        contributeForm.amount
      );
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Contribution made successfully!"
      });

      setContributeForm({ campaignId: '', amount: '' });
      loadUserData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to contribute",
        variant: "destructive"
      });
    } finally {
      setLoading({ contribute: false });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getStatusBadge = (status: number) => {
    const statusMap = {
      0: { label: 'Active', variant: 'default' as const },
      1: { label: 'Successful', variant: 'default' as const },
      2: { label: 'Failed', variant: 'destructive' as const },
      3: { label: 'Cancelled', variant: 'secondary' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: 'Unknown', variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <Wallet className="h-16 w-16 mx-auto mb-6 text-blue-500" />
            <h1 className="text-3xl font-bold mb-4">Smart Contracts</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Connect your wallet to interact with our transparent revenue sharing and crowdfunding smart contracts.
            </p>
            <Button onClick={connectWallet} size="lg">
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Smart Contracts Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transparent revenue sharing and crowdfunding powered by blockchain technology.
            All transactions are immutable and verifiable on the blockchain.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Withdrawal</p>
                  <p className="text-2xl font-bold">{parseFloat(pendingWithdrawal).toFixed(4)} ETH</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Campaigns</p>
                  <p className="text-2xl font-bold">{platformStats.totalCampaigns}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Raised</p>
                  <p className="text-2xl font-bold">{parseFloat(platformStats.totalRaised).toFixed(2)} ETH</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Platform Fee</p>
                  <p className="text-2xl font-bold">{platformStats.platformFee}%</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue Sharing</TabsTrigger>
            <TabsTrigger value="crowdfunding">Crowdfunding</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                    Register your AI model for transparent revenue sharing
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
                    {loading.registerModel ? 'Registering...' : 'Register Model'}
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
                    Withdraw your earned revenue from AI model subscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Available for Withdrawal</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {parseFloat(pendingWithdrawal).toFixed(6)} ETH
                      </p>
                      <p className="text-sm text-slate-500">
                        ≈ ${(parseFloat(pendingWithdrawal) * 2000).toFixed(2)} USD
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleWithdrawRevenue} 
                    className="w-full"
                    disabled={loading.withdraw || parseFloat(pendingWithdrawal) === 0}
                  >
                    {loading.withdraw ? 'Withdrawing...' : 'Withdraw Revenue'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Model Information */}
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
                <CardDescription>
                  View detailed information about registered AI models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter model ID"
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                  />
                  <Button onClick={() => loadModelInfo(selectedModelId)}>
                    Load Model
                  </Button>
                </div>

                {modelInfo && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
                        <p className="text-xl font-bold">{parseFloat(modelInfo.totalRevenue).toFixed(4)} ETH</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Developer Share</p>
                        <p className="text-xl font-bold">{modelInfo.developerShare}%</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Platform Share</p>
                        <p className="text-xl font-bold">{modelInfo.platformShare}%</p>
                      </div>
                    </div>

                    {revenueHistory.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Revenue History</h4>
                        <div className="space-y-2">
                          {revenueHistory.slice(0, 5).map((entry, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div>
                                <p className="font-medium">{parseFloat(entry.amount).toFixed(4)} ETH</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{formatDate(entry.timestamp)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">Dev: {parseFloat(entry.developerAmount).toFixed(4)} ETH</p>
                                <p className="text-sm">Platform: {parseFloat(entry.platformAmount).toFixed(4)} ETH</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                    Launch a crowdfunding campaign for your AI model
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
                    {loading.createCampaign ? 'Creating...' : 'Create Campaign'}
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
                    Support AI model development through crowdfunding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contributeCampaignId">Campaign ID</Label>
                    <Input
                      id="contributeCampaignId"
                      value={contributeForm.campaignId}
                      onChange={(e) => setContributeForm({ ...contributeForm, campaignId: e.target.value })}
                      placeholder="campaign-id"
                    />
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
                  <Button 
                    onClick={handleContribute} 
                    className="w-full"
                    disabled={loading.contribute}
                  >
                    {loading.contribute ? 'Contributing...' : 'Contribute'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* User Campaigns */}
            {campaigns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Campaigns</CardTitle>
                  <CardDescription>
                    Campaigns you've created or contributed to
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map((campaign, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{campaign.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{campaign.description}</p>
                          </div>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{parseFloat(campaign.raised).toFixed(2)} / {parseFloat(campaign.goal).toFixed(2)} ETH</span>
                          </div>
                          <Progress value={(parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100} />
                          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>{campaign.contributorCount} contributors</span>
                            <span>Ends: {formatDate(campaign.deadline)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Analytics</CardTitle>
                <CardDescription>
                  Comprehensive analytics for smart contract interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Your Contributions</h4>
                    {userContributions.length > 0 ? (
                      <div className="space-y-2">
                        {userContributions.slice(0, 5).map((contribution, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div>
                              <p className="font-medium">{contribution.campaignId}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{formatDate(contribution.timestamp)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{parseFloat(contribution.amount).toFixed(4)} ETH</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600 dark:text-slate-400">No contributions yet</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Platform Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Total Campaigns</span>
                        <span className="font-bold">{platformStats.totalCampaigns}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Total Raised</span>
                        <span className="font-bold">{parseFloat(platformStats.totalRaised).toFixed(4)} ETH</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Platform Fee</span>
                        <span className="font-bold">{platformStats.platformFee}%</span>
                      </div>
                    </div>
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