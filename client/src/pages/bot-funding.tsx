import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { 
  Bot, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  Search,
  BarChart3,
  Zap,
  Brain,
  Shield
} from "lucide-react";

interface BotFundingRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  contributors: number;
  daysLeft: number;
  status: 'active' | 'funded' | 'expired';
  createdBy: string;
  createdAt: string;
  botType: string;
  expectedROI: number;
  minContribution: number;
  features: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

// Sample bot funding data
const sampleBotFunding: BotFundingRequest[] = [
  {
    id: 1,
    title: "AI-Powered Grid Trading Bot",
    description: "Advanced grid trading bot with machine learning capabilities for volatile market conditions",
    category: "Grid Trading",
    targetAmount: 50000,
    currentAmount: 32500,
    contributors: 23,
    daysLeft: 15,
    status: 'active',
    createdBy: "Alex Chen",
    createdAt: "2025-06-15",
    botType: "Grid Trading",
    expectedROI: 15.5,
    minContribution: 100,
    features: ["Machine Learning", "Risk Management", "24/7 Monitoring", "Backtesting"],
    riskLevel: 'medium'
  },
  {
    id: 2,
    title: "High-Frequency Arbitrage Bot",
    description: "Ultra-fast arbitrage bot for cross-exchange opportunities",
    category: "Arbitrage",
    targetAmount: 75000,
    currentAmount: 68250,
    contributors: 41,
    daysLeft: 8,
    status: 'active',
    createdBy: "Sarah Kim",
    createdAt: "2025-06-10",
    botType: "Arbitrage",
    expectedROI: 22.3,
    minContribution: 250,
    features: ["High Frequency", "Multi-Exchange", "Real-time Analysis", "Low Latency"],
    riskLevel: 'high'
  },
  {
    id: 3,
    title: "DeFi Yield Farming Optimizer",
    description: "Automated yield farming strategy optimizer for maximum DeFi returns",
    category: "DeFi",
    targetAmount: 40000,
    currentAmount: 40000,
    contributors: 32,
    daysLeft: 0,
    status: 'funded',
    createdBy: "Michael Johnson",
    createdAt: "2025-05-28",
    botType: "Yield Farming",
    expectedROI: 18.7,
    minContribution: 150,
    features: ["DeFi Integration", "Yield Optimization", "Smart Contracts", "Gas Optimization"],
    riskLevel: 'medium'
  }
];

const categories = [
  "All Categories",
  "Grid Trading",
  "Arbitrage", 
  "DeFi",
  "Market Making",
  "Trend Following",
  "Mean Reversion"
];

const riskLevels = [
  { value: "all", label: "All Risk Levels" },
  { value: "low", label: "Low Risk" },
  { value: "medium", label: "Medium Risk" },
  { value: "high", label: "High Risk" }
];

export default function BotFunding() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [createRequestOpen, setCreateRequestOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch bot funding requests
  const { data: fundingRequests = [], isLoading } = useQuery({
    queryKey: ['/api/bot-funding/requests'],
    enabled: activeTab === 'browse'
  });

  // Fetch user's contributions
  const { data: myContributions = [] } = useQuery({
    queryKey: ['/api/bot-funding/my-contributions'],
    enabled: activeTab === 'my-contributions'
  });

  // Fetch user's funding requests
  const { data: myRequests = [] } = useQuery({
    queryKey: ['/api/bot-funding/my-requests'],
    enabled: activeTab === 'my-requests'
  });

  // Create funding request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/bot-funding/requests', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bot funding request created successfully!",
      });
      setCreateRequestOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/bot-funding/requests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create funding request",
        variant: "destructive",
      });
    }
  });

  // Contribute to funding mutation
  const contributeMutation = useMutation({
    mutationFn: async ({ requestId, amount }: { requestId: number; amount: number }) => {
      return apiRequest('POST', `/api/bot-funding/requests/${requestId}/contribute`, { amount });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contribution made successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bot-funding/requests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to make contribution",
        variant: "destructive",
      });
    }
  });

  const handleCreateRequest = (formData: FormData) => {
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      targetAmount: parseFloat(formData.get('targetAmount') as string),
      botType: formData.get('botType'),
      expectedROI: parseFloat(formData.get('expectedROI') as string),
      minContribution: parseFloat(formData.get('minContribution') as string),
      riskLevel: formData.get('riskLevel'),
      features: (formData.get('features') as string).split(',').map(f => f.trim())
    };
    createRequestMutation.mutate(data);
  };

  const handleContribute = (requestId: number, amount: number) => {
    contributeMutation.mutate({ requestId, amount });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><Clock className="h-3 w-3 mr-1" />Active</Badge>;
      case 'funded':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Funded</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const filteredRequests = (sampleBotFunding).filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || request.category === selectedCategory;
    const matchesRisk = selectedRiskLevel === 'all' || request.riskLevel === selectedRiskLevel;
    
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const totalFunded = sampleBotFunding.reduce((sum, req) => sum + req.currentAmount, 0);
  const totalTargeted = sampleBotFunding.reduce((sum, req) => sum + req.targetAmount, 0);
  const activeBots = sampleBotFunding.filter(req => req.status === 'active').length;
  const totalContributors = sampleBotFunding.reduce((sum, req) => sum + req.contributors, 0);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Bot Funding</h1>
            <p className="text-muted-foreground">
              Fund innovative trading bot development and earn from successful deployments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={createRequestOpen} onOpenChange={setCreateRequestOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Funding Request
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Bot Funding Request</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateRequest(formData);
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Bot Title</Label>
                    <Input id="title" name="title" placeholder="AI Trading Bot" required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetAmount">Target Amount ($)</Label>
                    <Input id="targetAmount" name="targetAmount" type="number" placeholder="50000" required />
                  </div>
                  <div>
                    <Label htmlFor="minContribution">Min Contribution ($)</Label>
                    <Input id="minContribution" name="minContribution" type="number" placeholder="100" required />
                  </div>
                  <div>
                    <Label htmlFor="botType">Bot Type</Label>
                    <Input id="botType" name="botType" placeholder="Grid Trading" required />
                  </div>
                  <div>
                    <Label htmlFor="expectedROI">Expected ROI (%)</Label>
                    <Input id="expectedROI" name="expectedROI" type="number" step="0.1" placeholder="15.5" required />
                  </div>
                  <div>
                    <Label htmlFor="riskLevel">Risk Level</Label>
                    <Select name="riskLevel">
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Input id="features" name="features" placeholder="AI, Risk Management, 24/7" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Detailed description of your trading bot..." required />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setCreateRequestOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createRequestMutation.isPending}>
                    {createRequestMutation.isPending ? 'Creating...' : 'Create Request'}
                  </Button>
                </div>
              </form>
            </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Funded</p>
                  <p className="text-2xl font-bold">${totalFunded.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                  <p className="text-2xl font-bold">{activeBots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Contributors</p>
                  <p className="text-2xl font-bold">{totalContributors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">84%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="browse">Browse Requests</TabsTrigger>
            <TabsTrigger value="my-contributions">My Contributions</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bot funding requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  {riskLevels.map(risk => (
                    <SelectItem key={risk.value} value={risk.value}>{risk.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Funding Requests Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusBadge(request.status)}
                          {getRiskBadge(request.riskLevel)}
                          <Badge variant="outline">{request.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${request.currentAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          of ${request.targetAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{request.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Funding Progress</span>
                          <span>{Math.round((request.currentAmount / request.targetAmount) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(request.currentAmount / request.targetAmount) * 100} 
                          className="h-2" 
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Contributors</p>
                          <p className="font-semibold">{request.contributors}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expected ROI</p>
                          <p className="font-semibold text-green-600">{request.expectedROI}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Days Left</p>
                          <p className="font-semibold">{request.daysLeft > 0 ? request.daysLeft : 'Ended'}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {request.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{feature}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Created by:</span> {request.createdBy}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Min Contribution:</span> ${request.minContribution}
                        </p>
                      </div>

                      {request.status === 'active' && (
                        <Button 
                          className="w-full gradient-primary" 
                          onClick={() => handleContribute(request.id, request.minContribution)}
                          disabled={contributeMutation.isPending}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Contribute ${request.minContribution}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-contributions" className="space-y-4">
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Contributions Yet</h3>
              <p className="text-muted-foreground">
                Start by contributing to a bot funding request in the Browse tab.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Funding Requests</h3>
              <p className="text-muted-foreground">
                Create your first bot funding request to get started.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}