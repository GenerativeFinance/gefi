import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Wallet,
  Plus,
  Copy,
  Trash2,
  Activity,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Key,
  Send,
  Zap,
  Network,
  Settings
} from "lucide-react";

interface WalletFormData {
  name: string;
  type: string;
}

export default function WalletManagement() {
  const { toast } = useToast();
  const [isCreateWalletOpen, setIsCreateWalletOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("wallets");
  const [showPrivateKey, setShowPrivateKey] = useState<Record<string, boolean>>({});
  const [walletForm, setWalletForm] = useState<WalletFormData>({
    name: "",
    type: ""
  });

  // Fetch wallets
  const { data: wallets = [], isLoading: walletsLoading } = useQuery({
    queryKey: ["/api/wallets"]
  });

  // Fetch wallet statistics
  const { data: walletStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/wallets/stats"]
  });

  // Create wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: async (walletData: WalletFormData) => {
      return apiRequest("POST", "/api/wallets", walletData);
    },
    onSuccess: () => {
      toast({
        title: "Wallet Created",
        description: "New wallet has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets/stats"] });
      setIsCreateWalletOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create wallet",
        variant: "destructive",
      });
    },
  });

  // Delete wallet mutation
  const deleteWalletMutation = useMutation({
    mutationFn: async (walletId: string) => {
      return apiRequest("DELETE", `/api/wallets/${walletId}`);
    },
    onSuccess: () => {
      toast({
        title: "Wallet Deleted",
        description: "Wallet has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete wallet",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setWalletForm({
      name: "",
      type: ""
    });
  };

  const handleCreateWallet = () => {
    if (!walletForm.name || !walletForm.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createWalletMutation.mutate(walletForm);
  };

  const handleDeleteWallet = (walletId: string) => {
    if (confirm("Are you sure you want to delete this wallet?")) {
      deleteWalletMutation.mutate(walletId);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const togglePrivateKeyVisibility = (walletId: string) => {
    setShowPrivateKey(prev => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case "federated_learning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "trading":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "defi":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getWalletTypeIcon = (type: string) => {
    switch (type) {
      case "federated_learning":
        return <Network className="h-4 w-4" />;
      case "trading":
        return <TrendingUp className="h-4 w-4" />;
      case "defi":
        return <Zap className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
    }).format(balance);
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((new Date(timestamp).getTime() - Date.now()) / (1000 * 60 * 60)),
      'hour'
    );
  };

  if (walletsLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              Wallet Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your federated learning and trading wallets
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateWalletOpen} onOpenChange={setIsCreateWalletOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Wallet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wallet-name">Wallet Name</Label>
                    <Input
                      id="wallet-name"
                      value={walletForm.name}
                      onChange={(e) => setWalletForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., FL Training Node 1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wallet-type">Wallet Type</Label>
                    <Select value={walletForm.type} onValueChange={(value) => 
                      setWalletForm(prev => ({ ...prev, type: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wallet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="federated_learning">🔗 Federated Learning</SelectItem>
                        <SelectItem value="trading">📈 Trading</SelectItem>
                        <SelectItem value="defi">⚡ DeFi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleCreateWallet} 
                    disabled={createWalletMutation.isPending}
                    className="w-full"
                  >
                    {createWalletMutation.isPending ? "Creating..." : "Create Wallet"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBalance(walletStats.totalBalance || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Across all wallets
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletStats.activeWallets || 0}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletStats.lastActivity || "Never"}</div>
              <p className="text-xs text-muted-foreground">
                Most recent transaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Wallets Tab */}
          <TabsContent value="wallets" className="space-y-6">
            {wallets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No wallets found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first wallet to start managing your crypto assets
                  </p>
                  <Button onClick={() => setIsCreateWalletOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Wallet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {wallets.map((wallet: any) => (
                  <Card key={wallet.id} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getWalletTypeIcon(wallet.type)}
                          <CardTitle className="text-lg">{wallet.name}</CardTitle>
                        </div>
                        <Badge className={getWalletTypeColor(wallet.type)}>
                          {wallet.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Public Address</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm bg-muted px-2 py-1 rounded font-mono flex-1">
                              {wallet.publicAddress}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(wallet.publicAddress, "Address")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Private Key</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm bg-muted px-2 py-1 rounded font-mono flex-1">
                              {showPrivateKey[wallet.id] ? wallet.privateKey : "••••••••••••••••••••••••••••••••"}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePrivateKeyVisibility(wallet.id)}
                            >
                              {showPrivateKey[wallet.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(wallet.privateKey, "Private Key")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Balance</Label>
                            <p className="text-lg font-bold text-green-600">{formatBalance(wallet.balance)}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <div className="flex items-center gap-1">
                              {wallet.isActive ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-600">Active</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm text-yellow-600">Inactive</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Last Transaction</Label>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(wallet.lastTransactionAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t">
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                        <Button size="sm" variant="outline">
                          <ArrowDownLeft className="h-4 w-4 mr-1" />
                          Receive
                        </Button>
                        <Button size="sm" variant="outline">
                          <Activity className="h-4 w-4 mr-1" />
                          History
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteWallet(wallet.id)}
                          disabled={deleteWalletMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground">
                    Your transaction history will appear here once you start using your wallets
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Security features coming soon</h3>
                  <p className="text-muted-foreground">
                    Advanced security features, 2FA, and wallet encryption options
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}