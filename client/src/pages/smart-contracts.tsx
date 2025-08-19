import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { smartContractService } from '@/lib/smartContractService';
import { Shield, Wallet, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/ui/button';

export default function SmartContracts() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const { toast } = useToast();
  
  // State
  const [pendingWithdrawal, setPendingWithdrawal] = useState<string>('0');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [userContributions, setUserContributions] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState({
    totalCampaigns: '0',
    totalRaised: '0',
    platformFee: '0'
  });

  const [loading, setLoading] = useState({
    connecting: false,
    loadingData: false,
    withdraw: false
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to use smart contracts.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(prev => ({ ...prev, connecting: true }));
      const accounts = await smartContractService.connectWallet();
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        await loadUserData();
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, connecting: false }));
    }
  };

  const loadUserData = async () => {
    if (!isConnected) return;

    try {
      setLoading(prev => ({ ...prev, loadingData: true }));
      
      // Load platform statistics
      const stats = await smartContractService.getPlatformStats();
      setPlatformStats(stats);

      // Mock some data for demonstration
      setCampaigns([
        {
          id: 'campaign_1',
          title: 'AI Stock Prediction Model',
          description: 'Advanced machine learning model for stock market predictions',
          creator: address,
          goal: '10.0',
          raised: '6.5',
          deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
          status: 0
        }
      ]);

      setUserContributions([
        {
          campaignId: 'campaign_1',
          amount: '2.5',
          timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000
        }
      ]);

      setPendingWithdrawal('1.25');
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast({
        title: "Data Load Failed",
        description: "Failed to load blockchain data",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, loadingData: false }));
    }
  };

  const handleWithdrawRevenue = async () => {
    try {
      setLoading(prev => ({ ...prev, withdraw: true }));
      
      // For demo purposes, simulate successful withdrawal
      toast({
        title: "Withdrawal Initiated",
        description: `Withdrawing ${pendingWithdrawal} ETH to your wallet`,
      });
      
      setTimeout(() => {
        setPendingWithdrawal('0');
        toast({
          title: "Withdrawal Complete",
          description: "Funds have been transferred to your wallet",
        });
      }, 3000);
    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast({
        title: "Withdrawal Failed",
        description: "Failed to withdraw revenue",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, withdraw: false }));
    }
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
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <Wallet className="h-16 w-16 mx-auto mb-6 text-blue-500" />
              <h1 className="text-3xl font-bold mb-4">Smart Contracts</h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Connect your wallet to interact with our transparent revenue sharing and crowdfunding smart contracts.
              </p>
              <Button 
                onClick={connectWallet} 
                size="lg"
                disabled={loading.connecting}
              >
                {loading.connecting ? (
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wallet className="mr-2 h-5 w-5" />
                )}
                {loading.connecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button 
                onClick={loadUserData} 
                variant="outline" 
                size="sm"
                disabled={loading.loadingData}
              >
                {loading.loadingData ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Campaigns</span>
                    <span className="font-bold">{platformStats.totalCampaigns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Raised</span>
                    <span className="font-bold">{parseFloat(platformStats.totalRaised).toFixed(4)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span className="font-bold">{platformStats.platformFee}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Pending Withdrawal</span>
                    <span className="font-bold">{pendingWithdrawal} ETH</span>
                  </div>
                  <Button 
                    onClick={handleWithdrawRevenue}
                    disabled={parseFloat(pendingWithdrawal) === 0 || loading.withdraw}
                    className="w-full"
                  >
                    {loading.withdraw ? 'Withdrawing...' : 'Withdraw Revenue'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Contributed</span>
                    <span className="font-bold">
                      {userContributions.reduce((sum, c) => sum + parseFloat(c.amount), 0).toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Campaigns</span>
                    <span className="font-bold">{campaigns.filter(c => c.status === 0).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{campaign.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400">{campaign.description}</p>
                        </div>
                        {getStatusBadge(campaign.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">Goal</span>
                          <div className="font-semibold">{campaign.goal} ETH</div>
                        </div>
                        <div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">Raised</span>
                          <div className="font-semibold">{campaign.raised} ETH</div>
                        </div>
                        <div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                          <div className="font-semibold">
                            {((parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">Deadline</span>
                          <div className="font-semibold">
                            {new Date(campaign.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                  No active campaigns found
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}