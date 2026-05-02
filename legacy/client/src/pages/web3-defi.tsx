import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWeb3 } from "@/contexts/Web3Context";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
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
  Info,
  Zap,
  Shield,
  Link,
  Copy,
  CheckCircle,
  XCircle,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  PieChart,
  ChevronRight,
  Flame
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
  priceChange24h?: number;
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

const DEFI_PROTOCOLS = [
  {
    name: 'Uniswap',
    description: 'Decentralized exchange protocol',
    icon: '🦄',
    category: 'DEX',
    tvl: 4200000000,
    apy: 15.5
  },
  {
    name: 'Aave',
    description: 'Lending and borrowing protocol',
    icon: '👻',
    category: 'Lending',
    tvl: 6800000000,
    apy: 2.5
  },
  {
    name: 'Compound',
    description: 'Algorithmic money markets',
    icon: '🏛️',
    category: 'Lending',
    tvl: 2100000000,
    apy: 2.1
  },
  {
    name: 'Curve',
    description: 'Stablecoin exchange protocol',
    icon: '🌀',
    category: 'DEX',
    tvl: 3500000000,
    apy: 8.3
  }
];

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
  const [copiedAddress, setCopiedAddress] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock data for demonstration - in production this would come from APIs
  const mockHoldings = [
    { 
      id: 1, 
      tokenSymbol: 'ETH', 
      tokenName: 'Ethereum', 
      balance: '2.5', 
      usdValue: 8750, 
      chainId: 1, 
      priceChange24h: 3.2 
    },
    { 
      id: 2, 
      tokenSymbol: 'USDC', 
      tokenName: 'USD Coin', 
      balance: '1000', 
      usdValue: 1000, 
      chainId: 1, 
      priceChange24h: 0.1 
    },
    { 
      id: 3, 
      tokenSymbol: 'UNI', 
      tokenName: 'Uniswap', 
      balance: '150', 
      usdValue: 1350, 
      chainId: 1, 
      priceChange24h: -2.1 
    }
  ];

  const mockDefiPositions = [
    {
      id: 1,
      protocol: 'Uniswap',
      positionType: 'Liquidity',
      tokenPair: 'ETH/USDC',
      principal: '5000',
      currentValue: '5250',
      rewards: '125',
      apy: 12.3,
      chainId: 1
    },
    {
      id: 2,
      protocol: 'Aave',
      positionType: 'Lending',
      tokenPair: 'USDC',
      principal: '2000',
      currentValue: '2025',
      rewards: '25',
      apy: 3.2,
      chainId: 1
    }
  ];

  // Calculate portfolio totals
  const totalPortfolioValue = mockHoldings.reduce((sum, holding) => sum + (holding.usdValue || 0), 0);
  const totalDefiValue = mockDefiPositions.reduce((sum, pos) => sum + parseFloat(pos.currentValue || '0'), 0);
  const totalRewards = mockDefiPositions.reduce((sum, pos) => sum + parseFloat(pos.rewards || '0'), 0);

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopiedAddress(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  // Wallet Connection Card
  const WalletConnectionCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-4">
              Connect your Web3 wallet to access DeFi protocols and manage your crypto portfolio
            </p>
            <Button onClick={connectWallet} disabled={web3Loading} className="w-full">
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
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{web3Error}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Connected Wallet</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {formatAddress(account!)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-6 w-6 p-0"
                  >
                    {copiedAddress ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS]?.color || '#gray' }}
                />
                {SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS]?.name || 'Unknown'}
              </Badge>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="font-semibold">
                  {parseFloat(balance || '0').toFixed(4)} {SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS]?.symbol}
                </span>
              </div>
            </div>

            {/* Chain Switcher */}
            <div>
              <p className="text-sm font-medium mb-2">Switch Network</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(SUPPORTED_CHAINS).map(([id, chain]) => (
                  <Button
                    key={id}
                    variant={parseInt(id) === chainId ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchChain(parseInt(id))}
                    className="justify-start"
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: chain.color }}
                    />
                    {chain.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Portfolio Overview Card
  const PortfolioOverviewCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Portfolio</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+5.2% (24h)</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">DeFi Positions</p>
              <p className="text-2xl font-bold">{formatCurrency(totalDefiValue)}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+2.8% (24h)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Unclaimed Rewards</span>
              <div className="text-right">
                <p className="font-semibold text-green-600">{formatCurrency(totalRewards)}</p>
                <Button size="sm" variant="outline" className="mt-1">
                  Claim All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Crypto Holdings Card
  const CryptoHoldingsCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Crypto Holdings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockHoldings.map((holding) => (
            <div key={holding.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {holding.tokenSymbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold">{holding.tokenSymbol}</p>
                  <p className="text-sm text-muted-foreground">{holding.tokenName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(holding.usdValue || 0)}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">{holding.balance}</span>
                  {holding.priceChange24h && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${holding.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {holding.priceChange24h >= 0 ? '+' : ''}{holding.priceChange24h.toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // DeFi Positions Card
  const DefiPositionsCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          DeFi Positions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockDefiPositions.map((position) => (
            <div key={position.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{position.protocol}</Badge>
                  <span className="text-sm text-muted-foreground">{position.positionType}</span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {position.apy}% APY
                </Badge>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Token Pair:</span>
                <span className="font-medium">{position.tokenPair}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Principal</p>
                  <p className="text-sm font-semibold">{formatCurrency(parseFloat(position.principal))}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Value</p>
                  <p className="text-sm font-semibold">{formatCurrency(parseFloat(position.currentValue || '0'))}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rewards</p>
                  <p className="text-sm font-semibold text-green-600">{formatCurrency(parseFloat(position.rewards || '0'))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // DeFi Protocols Card
  const DefiProtocolsCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          DeFi Protocols
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFI_PROTOCOLS.map((protocol) => (
            <div key={protocol.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{protocol.icon}</span>
                  <div>
                    <p className="font-semibold">{protocol.name}</p>
                    <Badge variant="outline" className="text-xs">{protocol.category}</Badge>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{protocol.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">TVL</p>
                  <p className="font-semibold">{formatNumber(protocol.tvl)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">APY</p>
                  <p className="font-semibold text-green-600">{protocol.apy}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <h1 className="text-3xl font-bold">Web3 & DeFi</h1>
          </div>
          <p className="text-muted-foreground">
            Connect your wallet and manage your decentralized finance portfolio
          </p>
        </div>

        <div className="space-y-6">
          {/* Connection Status */}
          <WalletConnectionCard />

          {isConnected && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="holdings">Holdings</TabsTrigger>
                <TabsTrigger value="defi">DeFi Positions</TabsTrigger>
                <TabsTrigger value="protocols">Protocols</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PortfolioOverviewCard />
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Added liquidity to ETH/USDC pool</p>
                            <p className="text-xs text-muted-foreground">2 hours ago • Uniswap</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Claimed rewards from AAVE</p>
                            <p className="text-xs text-muted-foreground">1 day ago • Aave</p>
                          </div>
                          <ArrowDownRight className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Swapped USDC for ETH</p>
                            <p className="text-xs text-muted-foreground">2 days ago • Uniswap</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="holdings">
                <CryptoHoldingsCard />
              </TabsContent>

              <TabsContent value="defi">
                <DefiPositionsCard />
              </TabsContent>

              <TabsContent value="protocols">
                <DefiProtocolsCard />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
}