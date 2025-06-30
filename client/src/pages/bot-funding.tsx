import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Zap, 
  BarChart3,
  Shield,
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface BotFundingRequest {
  id: number;
  developerId: string;
  title: string;
  description: string;
  botType: string;
  fundingGoal: string;
  fundingRaised: string;
  expectedReturn: string;
  riskLevel: string;
  minimumInvestment: string;
  maximumInvestment: string;
  tradingStrategy: string;
  requiredSkills: string[];
  deliverables: string[];
  timeline: string;
  status: string;
  category: string;
  tags: string[];
  developerExperience: string;
  fundingDeadline: string;
  createdAt: string;
  updatedAt: string;
}

interface FundingRequestForm {
  title: string;
  description: string;
  botType: string;
  fundingGoal: number;
  expectedReturn: number;
  riskLevel: string;
  minimumInvestment: number;
  maximumInvestment: number;
  tradingStrategy: string;
  category: string;
  timeline: string;
}

interface ContributionForm {
  requestId: number;
  amount: number;
  message: string;
}

export default function BotFunding() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BotFundingRequest | null>(null);
  const [requestForm, setRequestForm] = useState<FundingRequestForm>({
    title: "",
    description: "",
    botType: "",
    fundingGoal: 5000,
    expectedReturn: 15,
    riskLevel: "medium",
    minimumInvestment: 100,
    maximumInvestment: 1000,
    tradingStrategy: "",
    category: "",
    timeline: "30 days"
  });
  const [contributionForm, setContributionForm] = useState<ContributionForm>({
    requestId: 0,
    amount: 100,
    message: ""
  });

  // Fetch funding requests
  const { data: fundingRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["/api/bot-funding/requests"],
  });

  // Create funding request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (data: FundingRequestForm) => {
      return apiRequest("POST", "/api/bot-funding/requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Funding Request Created",
        description: "Your bot funding request has been submitted successfully!",
      });
      setIsRequestDialogOpen(false);
      setRequestForm({
        title: "",
        description: "",
        botType: "",
        fundingGoal: 5000,
        expectedReturn: 15,
        riskLevel: "medium",
        minimumInvestment: 100,
        maximumInvestment: 1000,
        tradingStrategy: "",
        category: "",
        timeline: "30 days"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bot-funding/requests"] });
    },
    onError: (error) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Contribute to funding mutation
  const contributeMutation = useMutation({
    mutationFn: async (data: ContributionForm) => {
      return apiRequest("POST", "/api/bot-funding/contribute", data);
    },
    onSuccess: () => {
      toast({
        title: "Contribution Successful",
        description: "Your funding contribution has been submitted!",
      });
      setIsContributeDialogOpen(false);
      setContributionForm({
        requestId: 0,
        amount: 100,
        message: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bot-funding/requests"] });
    },
    onError: (error) => {
      toast({
        title: "Contribution Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const botTypes = [
    { value: "spot_grid", label: "Spot Grid Trading" },
    { value: "futures_grid", label: "Futures Grid Trading" },
    { value: "arbitrage", label: "Arbitrage Bot" },
    { value: "dca", label: "DCA Bot" },
    { value: "momentum", label: "Momentum Trading" },
    { value: "mean_reversion", label: "Mean Reversion" }
  ];

  const categories = [
    "Grid Trading",
    "DeFi",
    "Technical Analysis",
    "Arbitrage",
    "High Frequency",
    "Options Trading"
  ];

  const handleContribute = (request: BotFundingRequest) => {
    setSelectedRequest(request);
    setContributionForm({
      requestId: request.id,
      amount: parseFloat(request.minimumInvestment),
      message: ""
    });
    setIsContributeDialogOpen(true);
  };

  const filteredRequests = fundingRequests
    .filter((request: BotFundingRequest) => {
      const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           request.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || request.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a: BotFundingRequest, b: BotFundingRequest) => {
      if (sortBy === "trending") {
        return parseFloat(b.fundingRaised) - parseFloat(a.fundingRaised);
      } else if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return parseFloat(b.expectedReturn) - parseFloat(a.expectedReturn);
      }
    });

  // Calculate statistics
  const totalFunded = fundingRequests.reduce((sum: number, req: BotFundingRequest) => 
    sum + parseFloat(req.fundingRaised), 0
  );
  const activeBots = fundingRequests.filter((req: BotFundingRequest) => req.status === "open").length;
  const completedBots = fundingRequests.filter((req: BotFundingRequest) => req.status === "completed").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              Bot Funding
            </h1>
            <p className="text-muted-foreground mt-2">
              Fund innovative trading bots and automated strategies
            </p>
          </div>
          <Button onClick={() => setIsRequestDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Request Funding
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Funded</p>
                  <p className="text-2xl font-bold">${totalFunded.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Bots</p>
                  <p className="text-2xl font-bold">{activeBots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Investors</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedBots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search funding requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Most Funded</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="returns">Highest Returns</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Funding Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingRequests ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredRequests.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No funding requests found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters, or create a new funding request.
              </p>
            </div>
          ) : (
            filteredRequests.map((request: BotFundingRequest) => {
              const progressPercentage = (parseFloat(request.fundingRaised) / parseFloat(request.fundingGoal)) * 100;
              
              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{request.category}</Badge>
                          <Badge variant="outline">{request.riskLevel}</Badge>
                        </div>
                      </div>
                      <Badge className={
                        request.status === "open" ? "bg-green-500" :
                        request.status === "funded" ? "bg-blue-500" : "bg-gray-500"
                      }>
                        {request.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {request.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          ${parseFloat(request.fundingRaised).toLocaleString()} raised
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Goal: ${parseFloat(request.fundingGoal).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Expected Return</p>
                        <p className="font-semibold text-green-600">
                          {parseFloat(request.expectedReturn).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Timeline</p>
                        <p className="font-semibold">{request.timeline}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min Investment</p>
                        <p className="font-semibold">
                          ${parseFloat(request.minimumInvestment).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bot Type</p>
                        <p className="font-semibold">{request.botType.replace("_", " ")}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        onClick={() => handleContribute(request)}
                        className="w-full"
                        disabled={request.status !== "open"}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Fund This Bot
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Create Request Dialog */}
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Funding Request</DialogTitle>
              <DialogDescription>
                Submit your trading bot for community funding
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={requestForm.title}
                  onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                  placeholder="Advanced Grid Trading Bot"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                  placeholder="Describe your trading bot, its strategy, and expected performance..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="botType">Bot Type</Label>
                  <Select value={requestForm.botType} onValueChange={(value) => setRequestForm({ ...requestForm, botType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bot type" />
                    </SelectTrigger>
                    <SelectContent>
                      {botTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={requestForm.category} onValueChange={(value) => setRequestForm({ ...requestForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
                  <Input
                    id="fundingGoal"
                    type="number"
                    value={requestForm.fundingGoal}
                    onChange={(e) => setRequestForm({ ...requestForm, fundingGoal: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    step="0.1"
                    value={requestForm.expectedReturn}
                    onChange={(e) => setRequestForm({ ...requestForm, expectedReturn: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="riskLevel">Risk Level</Label>
                  <Select value={requestForm.riskLevel} onValueChange={(value) => setRequestForm({ ...requestForm, riskLevel: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="minInvestment">Min Investment ($)</Label>
                  <Input
                    id="minInvestment"
                    type="number"
                    value={requestForm.minimumInvestment}
                    onChange={(e) => setRequestForm({ ...requestForm, minimumInvestment: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxInvestment">Max Investment ($)</Label>
                  <Input
                    id="maxInvestment"
                    type="number"
                    value={requestForm.maximumInvestment}
                    onChange={(e) => setRequestForm({ ...requestForm, maximumInvestment: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tradingStrategy">Trading Strategy</Label>
                <Textarea
                  id="tradingStrategy"
                  value={requestForm.tradingStrategy}
                  onChange={(e) => setRequestForm({ ...requestForm, tradingStrategy: e.target.value })}
                  placeholder="Explain your trading strategy in detail..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="timeline">Development Timeline</Label>
                <Select value={requestForm.timeline} onValueChange={(value) => setRequestForm({ ...requestForm, timeline: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 days">30 days</SelectItem>
                    <SelectItem value="60 days">60 days</SelectItem>
                    <SelectItem value="90 days">90 days</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => createRequestMutation.mutate(requestForm)}
                  disabled={createRequestMutation.isPending}
                >
                  {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Contribute Dialog */}
        <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fund This Bot</DialogTitle>
              <DialogDescription>
                {selectedRequest && `Contribute to "${selectedRequest.title}"`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Investment Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={contributionForm.amount}
                  onChange={(e) => setContributionForm({ ...contributionForm, amount: Number(e.target.value) })}
                  min={selectedRequest ? parseFloat(selectedRequest.minimumInvestment) : 100}
                  max={selectedRequest ? parseFloat(selectedRequest.maximumInvestment) : 10000}
                />
                {selectedRequest && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Min: ${parseFloat(selectedRequest.minimumInvestment).toLocaleString()} - 
                    Max: ${parseFloat(selectedRequest.maximumInvestment).toLocaleString()}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={contributionForm.message}
                  onChange={(e) => setContributionForm({ ...contributionForm, message: e.target.value })}
                  placeholder="Leave a message for the developer..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsContributeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => contributeMutation.mutate(contributionForm)}
                  disabled={contributeMutation.isPending}
                >
                  {contributeMutation.isPending ? "Processing..." : "Contribute"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}