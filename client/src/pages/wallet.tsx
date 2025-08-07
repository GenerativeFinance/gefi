import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
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
  Star
} from "lucide-react";
import { useState } from "react";

export default function WalletPage() {
  const { user } = useAuth();
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isNewContractOpen, setIsNewContractOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Mock data for wallet contracts
  const contracts = [
    {
      id: 1,
      name: "AI Model Revenue Share",
      type: "Revenue Sharing",
      contractAddress: "0x1234...5678",
      status: "Active",
      balance: "$12,450.00",
      totalEarnings: "$45,230.00",
      participants: 5,
      createdDate: "2024-01-15",
      lastActivity: "2 hours ago",
      aiModel: "Sentiment Analysis Pro",
      sharePercentage: "15%",
      nextPayment: "Feb 15, 2025"
    },
    {
      id: 2,
      name: "Data Provider Partnership",
      type: "Data Licensing",
      contractAddress: "0xabcd...efgh",
      status: "Pending",
      balance: "$0.00",
      totalEarnings: "$0.00",
      participants: 2,
      createdDate: "2024-02-01",
      lastActivity: "1 day ago",
      dataProvider: "MarketData Corp",
      licenseTerms: "3 months",
      nextPayment: "Pending approval"
    },
    {
      id: 3,
      name: "Crowdfunding Campaign",
      type: "Crowdfunding",
      contractAddress: "0x9876...5432",
      status: "Completed",
      balance: "$25,000.00",
      totalEarnings: "$150,000.00",
      participants: 150,
      createdDate: "2023-12-01",
      lastActivity: "1 week ago",
      campaign: "Risk Assessment AI v2.0",
      fundingGoal: "$100,000",
      nextPayment: "Completed"
    },
    {
      id: 4,
      name: "Subscription Management",
      type: "Subscription",
      contractAddress: "0xfedc...ba98",
      status: "Active",
      balance: "$8,750.00",
      totalEarnings: "$32,100.00",
      participants: 12,
      createdDate: "2024-01-30",
      lastActivity: "5 minutes ago",
      service: "Premium Analytics API",
      subscriptionType: "Monthly",
      nextPayment: "Feb 1, 2025"
    }
  ];

  // Mock transaction history
  const transactions = [
    {
      id: 1,
      type: "Payment Received",
      amount: "+$1,250.00",
      contract: "AI Model Revenue Share",
      date: "2025-01-07",
      txHash: "0x123...789",
      status: "Confirmed"
    },
    {
      id: 2,
      type: "Contract Deployment",
      amount: "-$50.00",
      contract: "Data Provider Partnership",
      date: "2025-01-05",
      txHash: "0xabc...def",
      status: "Confirmed"
    },
    {
      id: 3,
      type: "Crowdfunding Payout",
      amount: "+$5,000.00",
      contract: "Crowdfunding Campaign",
      date: "2025-01-03",
      txHash: "0x456...012",
      status: "Confirmed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      case "Expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Revenue Sharing": return <TrendingUp className="w-4 h-4" />;
      case "Data Licensing": return <Building className="w-4 h-4" />;
      case "Crowdfunding": return <Users className="w-4 h-4" />;
      case "Subscription": return <RefreshCw className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const statusMatch = filterStatus === "all" || contract.status.toLowerCase() === filterStatus;
    const typeMatch = filterType === "all" || contract.type.toLowerCase().replace(/\s+/g, '-') === filterType;
    return statusMatch && typeMatch;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wallet className="w-8 h-8 text-primary" />
              Smart Contract Wallet
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your contracts, payments, and financial agreements
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsNewContractOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Wallet Settings
            </Button>
          </div>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold">$46,200.00</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Contracts</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Earnings</p>
                  <p className="text-2xl font-bold">$8,750.00</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold">169</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="contracts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Wallet Settings</TabsTrigger>
          </TabsList>

          {/* Smart Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search contracts..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="revenue-sharing">Revenue Sharing</SelectItem>
                  <SelectItem value="data-licensing">Data Licensing</SelectItem>
                  <SelectItem value="crowdfunding">Crowdfunding</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contracts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredContracts.map((contract) => (
                <Card key={contract.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(contract.type)}
                        <div>
                          <CardTitle className="text-lg">{contract.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{contract.type}</p>
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
                        <p className="text-muted-foreground">Participants</p>
                        <p className="font-semibold">{contract.participants}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Payment</p>
                        <p className="font-semibold">{contract.nextPayment}</p>
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
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Explorer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type.includes('Received') ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {tx.type.includes('Received') ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.contract}</p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Contract Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Revenue Sharing</span>
                      <span className="font-semibold">$45,230.00</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-semibold text-green-600">+15.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Month</span>
                      <span className="font-semibold">$7,620.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your wallet settings and security preferences
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Default Gas Fee</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow (Lower cost)</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="fast">Fast (Higher cost)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Auto-approve limit</Label>
                    <Input placeholder="$100.00" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Transactions below this amount will be auto-approved
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email alerts for contract activities
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* New Contract Dialog */}
        <Dialog open={isNewContractOpen} onOpenChange={setIsNewContractOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Smart Contract</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contract Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue-sharing">Revenue Sharing</SelectItem>
                      <SelectItem value="data-licensing">Data Licensing</SelectItem>
                      <SelectItem value="crowdfunding">Crowdfunding</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Contract Name</Label>
                  <Input placeholder="Enter contract name" />
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Describe the contract terms and conditions" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration (months)</Label>
                  <Input type="number" placeholder="12" />
                </div>
                <div>
                  <Label>Payment Schedule</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsNewContractOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  Create Contract
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Contract Details Dialog */}
        {selectedContract && (
          <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedContract.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contract Type</p>
                    <p className="font-semibold">{selectedContract.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedContract.status)}>
                      {selectedContract.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-semibold">{selectedContract.createdDate}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Contract Details</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Balance</p>
                        <p className="text-xl font-bold text-green-600">{selectedContract.balance}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                        <p className="text-lg font-semibold">{selectedContract.totalEarnings}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Participants</p>
                        <p className="text-lg font-semibold">{selectedContract.participants}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Next Payment</p>
                        <p className="text-lg font-semibold">{selectedContract.nextPayment}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Contract
                  </Button>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Execute Payment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}