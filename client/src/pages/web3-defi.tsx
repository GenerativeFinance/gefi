import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWeb3 } from "@/contexts/Web3Context";
import { apiRequest } from "@/lib/queryClient";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  ExternalLink,
  Plus,
  AlertCircle,
  DollarSign,
  BarChart3,
  Activity,
  Clock,
  Info
} from "lucide-react";

interface WalletData {
  id: number;
  walletAddress: string;
  walletType: string;
  chainId: number;
  isActive: boolean;
}

interface CryptoHolding {
  id: number;
  tokenSymbol: string;
  tokenName: string;
  balance: string;
  usdValue?: number;
  chainId: number;
}

interface DefiPosition {
  id: number;
  protocol: string;
  positionType: string;
  tokenPair?: string;
  principal: string;
  currentValue?: string;
  rewards?: string;
  apy?: number;
  chainId: number;
}

interface ProtocolData {
  tvl: number;
  apy?: number;
  supplyApy?: number;
  borrowApy?: number;
  pools?: Array<{
    pair: string;
    apy: number;
    tvl: number;
  }>;
  assets?: Array<{
    symbol: string;
    supplyApy: number;
    borrowApy: number;
  }>;
}

// Chain configuration
const SUPPORTED_CHAINS = {
  1: { name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  56: { name: 'BSC', symbol: 'BNB', color: '#F3BA2F' },
  137: { name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
  43114: { name: 'Avalanche', symbol: 'AVAX', color: '#E84142' },
  250: { name: 'Fantom', symbol: 'FTM', color: '#1969FF' }
};

export default function Web3DeFi() {
  const { 
    isConnected, 
    account, 
    chainId, 
    balance, 
    connectWallet, 
    switchChain,
    isLoading: web3Loading,
    error: web3Error 
  } = useWeb3();
  
  const [selectedChain, setSelectedChain] = useState(1);
  const queryClient = useQueryClient();

  // Fetch user's connected wallets
  const { data: wallets = [], isLoading: walletsLoading } = useQuery({
    queryKey: ['/api/web3/wallets'],
    enabled: isConnected,
  });

  // Fetch crypto holdings
  const { data: holdings = [], isLoading: holdingsLoading } = useQuery({
    queryKey: ['/api/web3/holdings'],
    enabled: isConnected,
  });

  // Fetch DeFi positions
  const { data: defiPositions = [], isLoading: positionsLoading } = useQuery({
    queryKey: ['/api/web3/defi/positions'],
    enabled: isConnected,
  });

  // Fetch DeFi protocol data
  const { data: uniswapData } = useQuery({
    queryKey: ['/api/web3/defi/protocols/uniswap', { chainId: selectedChain }],
    queryFn: () => apiRequest('GET', `/api/web3/defi/protocols/uniswap?chainId=${selectedChain}`),
  });

  const { data: aaveData } = useQuery({
    queryKey: ['/api/web3/defi/protocols/aave', { chainId: selectedChain }],
    queryFn: () => apiRequest('GET', `/api/web3/defi/protocols/aave?chainId=${selectedChain}`),
  });

  // Add wallet mutation
  const addWalletMutation = useMutation({
    mutationFn: async (walletData: { walletAddress: string; walletType: string; chainId: number }) => {
      return apiRequest('POST', '/api/web3/wallets', walletData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/web3/wallets'] });
    },
  });

  // Sync wallet mutation
  const syncWalletMutation = useMutation({
    mutationFn: async (walletId: number) => {
      return apiRequest('POST', `/api/web3/wallets/${walletId}/sync`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/web3/holdings'] });
    },
  });

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleAddWallet = async () => {
    if (!account || !chainId) return;

    try {
      await addWalletMutation.mutateAsync({
        walletAddress: account,
        walletType: 'MetaMask',
        chainId: chainId,
      });
    } catch (error) {
      console.error('Failed to add wallet:', error);
    }
  };

  const handleSyncWallet = async (walletId: number) => {
    try {
      await syncWalletMutation.mutateAsync(walletId);
    } catch (error) {
      console.error('Failed to sync wallet:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 6,
    }).format(num);
  };

  // Calculate total portfolio value
  const totalPortfolioValue = holdings.reduce((total: number, holding: CryptoHolding) => {
    return total + (holding.usdValue || 0);
  }, 0);

  const totalDefiValue = defiPositions.reduce((total: number, position: DefiPosition) => {
    const currentValue = position.currentValue ? parseFloat(position.currentValue) : 0;
    return total + currentValue;
  }, 0);

  if (!isConnected) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Connect Your Web3 Wallet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Connect your cryptocurrency wallet to access DeFi features, view your portfolio, and manage your digital assets.
          </p>
          <Button 
            onClick={handleConnectWallet} 
            disabled={web3Loading}
            size="lg"
            className="min-w-[200px]"
          >
            {web3Loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
          {web3Error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center max-w-md mx-auto">
              <AlertCircle className="h-4 w-4 mr-2" />
              {web3Error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Web3 & DeFi Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your cryptocurrency portfolio and DeFi positions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
          </Badge>
          <Button variant="outline" onClick={handleAddWallet} disabled={addWalletMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Add Current Wallet
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalPortfolioValue + totalDefiValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Crypto Holdings</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">DeFi Positions</p>
                <p className="text-2xl font-bold">{formatCurrency(totalDefiValue)}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected Wallets</p>
                <p className="text-2xl font-bold">{wallets.length}</p>
              </div>
              <Wallet className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="defi">DeFi Positions</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cryptocurrency Holdings
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/web3/holdings'] })}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {holdingsLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading holdings...</p>
                </div>
              ) : holdings.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No holdings found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {holdings.map((holding: CryptoHolding) => (
                    <div key={holding.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {holding.tokenSymbol.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{holding.tokenName}</p>
                          <p className="text-sm text-muted-foreground">{holding.tokenSymbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatNumber(holding.balance)}</p>
                        {holding.usdValue && (
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(holding.usdValue)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DeFi Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {positionsLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading positions...</p>
                </div>
              ) : defiPositions.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No DeFi positions found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start using DeFi protocols to see your positions here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {defiPositions.map((position: DefiPosition) => (
                    <div key={position.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{position.protocol}</Badge>
                          <Badge variant="secondary">{position.positionType}</Badge>
                        </div>
                        {position.apy && (
                          <Badge variant="outline" className="text-green-600">
                            {position.apy}% APY
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Principal</p>
                          <p className="font-semibold">{formatNumber(position.principal)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Value</p>
                          <p className="font-semibold">
                            {position.currentValue ? formatNumber(position.currentValue) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rewards</p>
                          <p className="font-semibold text-green-600">
                            {position.rewards ? formatNumber(position.rewards) : '0'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Chain</p>
                          <p className="font-semibold">
                            {SUPPORTED_CHAINS[position.chainId as keyof typeof SUPPORTED_CHAINS]?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      {position.tokenPair && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Pool: {position.tokenPair}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Uniswap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      U
                    </div>
                    <span>Uniswap</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {uniswapData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">TVL</p>
                        <p className="text-lg font-semibold">{formatCurrency(uniswapData.tvl)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average APY</p>
                        <p className="text-lg font-semibold text-green-600">{uniswapData.apy}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Top Pools</p>
                      <div className="space-y-2">
                        {uniswapData.pools?.slice(0, 3).map((pool: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{pool.pair}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">{pool.apy}%</span>
                              <span className="text-muted-foreground">
                                {formatCurrency(pool.tvl)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading protocol data...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Aave */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                      A
                    </div>
                    <span>Aave</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aaveData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">TVL</p>
                        <p className="text-lg font-semibold">{formatCurrency(aaveData.tvl)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Supply APY</p>
                        <p className="text-lg font-semibold text-green-600">{aaveData.supplyApy}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Assets</p>
                      <div className="space-y-2">
                        {aaveData.assets?.slice(0, 3).map((asset: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{asset.symbol}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">{asset.supplyApy}%</span>
                              <span className="text-red-600">{asset.borrowApy}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading protocol data...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              {walletsLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading wallets...</p>
                </div>
              ) : wallets.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No wallets connected</p>
                  <Button 
                    onClick={handleAddWallet} 
                    disabled={addWalletMutation.isPending}
                    className="mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Current Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wallets.map((wallet: WalletData) => (
                    <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ 
                            backgroundColor: SUPPORTED_CHAINS[wallet.chainId as keyof typeof SUPPORTED_CHAINS]?.color || '#6B7280' 
                          }}
                        >
                          {SUPPORTED_CHAINS[wallet.chainId as keyof typeof SUPPORTED_CHAINS]?.symbol || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {wallet.walletAddress.slice(0, 6)}...{wallet.walletAddress.slice(-4)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {wallet.walletType} • {SUPPORTED_CHAINS[wallet.chainId as keyof typeof SUPPORTED_CHAINS]?.name || 'Unknown Chain'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={wallet.isActive ? "default" : "secondary"}>
                          {wallet.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSyncWallet(wallet.id)}
                          disabled={syncWalletMutation.isPending}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}