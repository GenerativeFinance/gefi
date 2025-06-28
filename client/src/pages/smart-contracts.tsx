import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Coins, 
  TrendingUp, 
  Users, 
  Clock, 
  Shield,
  ArrowUpRight,
  Wallet,
  BarChart3,
  DollarSign
} from "lucide-react";
import type { SmartContract, ContractInvestment, UserTokenBalance } from "@shared/schema";

export default function SmartContracts() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all smart contracts
  const { data: contracts = [], isLoading: contractsLoading } = useQuery({
    queryKey: ["/api/smart-contracts"],
  });

  // Fetch user's investments if authenticated
  const { data: userInvestments = [] } = useQuery({
    queryKey: ["/api/user/investments"],
    enabled: isAuthenticated,
  });

  // Fetch user's token balances if authenticated
  const { data: tokenBalances = [] } = useQuery({
    queryKey: ["/api/user/token-balances"],
    enabled: isAuthenticated,
  });

  // Investment mutation
  const investMutation = useMutation({
    mutationFn: async ({ contractId, amount }: { contractId: number; amount: string }) => {
      return await apiRequest("POST", `/api/smart-contracts/${contractId}/invest`, {
        investmentAmount: amount,
        tokensReceived: (parseFloat(amount) * 100).toString(), // Simple token calculation
      });
    },
    onSuccess: () => {
      toast({
        title: "Investment Successful",
        description: "Your investment has been recorded and is being processed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/investments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/token-balances"] });
    },
    onError: (error: any) => {
      toast({
        title: "Investment Failed",
        description: error.message || "Failed to process investment",
        variant: "destructive",
      });
    },
  });

  const handleInvest = async (contractId: number, amount: string) => {
    if (!isAuthenticated) {
      window.location.href = '/api/login';
      return;
    }
    
    investMutation.mutate({ contractId, amount });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'revenue_sharing': return 'bg-green-100 text-green-800';
      case 'crowdfunding': return 'bg-blue-100 text-blue-800';
      case 'subscription': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'funded': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Smart Contracts</h1>
            <p className="text-gray-600 mb-8">Please log in to access smart contract features</p>
            <Button onClick={() => window.location.href = '/api/login'}>
              Log In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Contracts</h1>
          <p className="text-gray-600">Invest in AI financial models through transparent blockchain contracts</p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Contracts</TabsTrigger>
            <TabsTrigger value="investments">My Investments</TabsTrigger>
            <TabsTrigger value="balances">Token Balances</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            {contractsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : contracts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Smart Contracts Available</h3>
                  <p className="text-gray-600">Check back later for new investment opportunities.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contracts.map((contract: SmartContract) => (
                  <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{contract.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={getContractTypeColor(contract.contractType)}>
                            {contract.contractType.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{contract.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {contract.tokenPrice && (
                          <div>
                            <span className="text-gray-500">Token Price</span>
                            <p className="font-semibold">{formatCurrency(contract.tokenPrice)}</p>
                          </div>
                        )}
                        {contract.fundingGoal && (
                          <div>
                            <span className="text-gray-500">Funding Goal</span>
                            <p className="font-semibold">{formatCurrency(contract.fundingGoal)}</p>
                          </div>
                        )}
                        {contract.currentFunding && (
                          <div>
                            <span className="text-gray-500">Current Funding</span>
                            <p className="font-semibold">{formatCurrency(contract.currentFunding)}</p>
                          </div>
                        )}
                        {contract.revenueSharePercentage && (
                          <div>
                            <span className="text-gray-500">Revenue Share</span>
                            <p className="font-semibold">{contract.revenueSharePercentage}%</p>
                          </div>
                        )}
                      </div>
                      
                      {contract.fundingGoal && contract.currentFunding && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Funding Progress</span>
                            <span>{((parseFloat(contract.currentFunding) / parseFloat(contract.fundingGoal)) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min((parseFloat(contract.currentFunding) / parseFloat(contract.fundingGoal)) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleInvest(contract.id, "100")}
                          disabled={investMutation.isPending || contract.status !== 'active'}
                          className="flex-1"
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Invest $100
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleInvest(contract.id, "500")}
                          disabled={investMutation.isPending || contract.status !== 'active'}
                          className="flex-1"
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Invest $500
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="investments" className="space-y-4">
            {userInvestments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investments Yet</h3>
                  <p className="text-gray-600">Start investing in smart contracts to see your portfolio here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userInvestments.map((investment: ContractInvestment) => (
                  <Card key={investment.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Investment #{investment.id}</h3>
                          <p className="text-sm text-gray-600">Contract ID: {investment.contractId}</p>
                        </div>
                        <Badge className={getStatusColor(investment.status)}>
                          {investment.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-gray-500">Investment Amount</span>
                          <p className="font-semibold">{formatCurrency(investment.investmentAmount)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Tokens Received</span>
                          <p className="font-semibold">{investment.tokensReceived}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Invested At</span>
                          <p className="font-semibold">{new Date(investment.investedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="balances" className="space-y-4">
            {tokenBalances.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Token Balances</h3>
                  <p className="text-gray-600">Your token balances will appear here after you make investments.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tokenBalances.map((balance: UserTokenBalance) => (
                  <Card key={balance.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Coins className="h-8 w-8 text-blue-600" />
                        <span className="text-sm text-gray-500">Contract #{balance.contractId}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Token Balance</span>
                          <p className="text-xl font-bold">{balance.tokenBalance}</p>
                        </div>
                        {balance.totalEarnings !== "0" && (
                          <div>
                            <span className="text-sm text-gray-500">Total Earnings</span>
                            <p className="text-lg font-semibold text-green-600">
                              {formatCurrency(balance.totalEarnings)}
                            </p>
                          </div>
                        )}
                        {balance.lastClaimedAt && (
                          <div>
                            <span className="text-sm text-gray-500">Last Claimed</span>
                            <p className="text-sm">{new Date(balance.lastClaimedAt).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}