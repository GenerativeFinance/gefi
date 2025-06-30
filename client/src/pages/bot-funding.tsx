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
import { Separator } from "@/components/ui/separator";
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
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Heart,
  Code
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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
  requiredSkills: string[];
  deliverables: string[];
  timeline: string;
  category: string;
  tags: string[];
  developerExperience: string;
  fundingDeadline: string;
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
    requiredSkills: [],
    deliverables: [],
    timeline: "30 days",
    category: "",
    tags: [],
    developerExperience: "",
    fundingDeadline: ""
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

  // Fetch user's funding requests
  const { data: userRequests = [], isLoading: isLoadingUserRequests } = useQuery({
    queryKey: ["/api/bot-funding/my-requests"],
    enabled: !!user,
  });

  // Fetch user's contributions
  const { data: userContributions = [], isLoading: isLoadingContributions } = useQuery({
    queryKey: ["/api/bot-funding/my-contributions"],
    enabled: !!user,
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
        requiredSkills: [],
        deliverables: [],
        timeline: "30 days",
        category: "",
        tags: [],
        developerExperience: "",
        fundingDeadline: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bot-funding/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bot-funding/my-requests"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Request",
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
      queryClient.invalidateQueries({ queryKey: ["/api/bot-funding/my-contributions"] });
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
    { value: "spot_grid", label: "Spot Grid Trading", description: "Grid trading on spot markets" },
    { value: "futures_grid", label: "Futures Grid Trading", description: "Grid trading on futures markets" },
    { value: "arbitrage", label: "Arbitrage Bot", description: "Cross-exchange arbitrage opportunities" },
    { value: "dca", label: "DCA Bot", description: "Dollar-cost averaging strategy" },
    { value: "momentum", label: "Momentum Trading", description: "Trend-following strategies" },
    { value: "mean_reversion", label: "Mean Reversion", description: "Counter-trend strategies" }
  ];

  const categories = [
    "DeFi", "Grid Trading", "Arbitrage", "High Frequency", "Algorithmic", "Yield Farming"
  ];

  const riskLevels = [
    { value: "low", label: "Low Risk", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium Risk", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High Risk", color: "bg-red-100 text-red-800" }
  ];

  // Filter and sort requests
  const filteredRequests = fundingRequests
    .filter((request: BotFundingRequest) => {
      if (selectedCategory && request.category !== selectedCategory) return false;
      if (searchQuery && !request.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !request.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return request.status === "open";
    })
    .sort((a: BotFundingRequest, b: BotFundingRequest) => {
      switch (sortBy) {
        case "funding_progress":
          const aProgress = (parseFloat(a.fundingRaised) / parseFloat(a.fundingGoal)) * 100;
          const bProgress = (parseFloat(b.fundingRaised) / parseFloat(b.fundingGoal)) * 100;
          return bProgress - aProgress;
        case "funding_goal":
          return parseFloat(b.fundingGoal) - parseFloat(a.fundingGoal);
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: // trending
          return (b.contributions?.length || 0) - (a.contributions?.length || 0);
      }
    });

  const handleCreateRequest = () => {
    createRequestMutation.mutate(requestForm);
  };

  const handleContribute = () => {
    if (selectedRequest) {
      contributeMutation.mutate({
        ...contributionForm,
        requestId: selectedRequest.id
      });
    }
  };

  const calculateProgress = (raised: string, goal: string) => {
    return (parseFloat(raised) / parseFloat(goal)) * 100;
  };

  const totalFunded = fundingRequests.reduce((sum: number, req: BotFundingRequest) => 
    sum + parseFloat(req.fundingRaised), 0
  );

  const activeBots = fundingRequests.filter((req: BotFundingRequest) => req.status === "open").length;
  const totalContributors = fundingRequests.reduce((sum: number, req: BotFundingRequest) => 
    sum + (req.contributions?.length || 0), 0
  );
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
              <DollarSign className="h-5 w-5 text-green-600" />
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
              <Bot className="h-5 w-5 text-blue-600" />
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
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Contributors</p>
                <p className="text-2xl font-bold">{totalContributors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedBots}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Requests</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <TabsTrigger value="my-funding">My Contributions</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bot funding requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
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
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="funding_progress">Funding Progress</SelectItem>
                <SelectItem value="funding_goal">Funding Goal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Funding Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoadingRequests ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="mt-2 text-muted-foreground">Loading funding requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Funding Requests Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory ? "Try adjusting your filters" : "Be the first to create a funding request!"}
                </p>
              </div>
            ) : (
              filteredRequests.map((request: BotFundingRequest) => (
                <Card key={request.id} className="border border-border/50 hover:border-border transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {request.description.length > 100 
                            ? `${request.description.substring(0, 100)}...` 
                            : request.description}
                        </CardDescription>
                      </div>
                      <Badge className={riskLevels.find(r => r.value === request.riskLevel)?.color}>
                        {riskLevels.find(r => r.value === request.riskLevel)?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Bot Type:</span>
                        <p className="font-medium">{request.botType.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p className="font-medium">{request.category}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected Return:</span>
                        <p className="font-medium text-green-600">{request.expectedReturn}% APY</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timeline:</span>
                        <p className="font-medium">{request.timeline}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Funding Progress</span>
                        <span>{calculateProgress(request.fundingRaised, request.fundingGoal).toFixed(1)}%</span>
                      </div>
                      <Progress value={calculateProgress(request.fundingRaised, request.fundingGoal)} className="h-2" />
                      <div className="flex justify-between text-sm mt-1 text-muted-foreground">
                        <span>${parseFloat(request.fundingRaised).toLocaleString()} raised</span>
                        <span>Goal: ${parseFloat(request.fundingGoal).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {request.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm text-muted-foreground">
                        Min: ${parseFloat(request.minimumInvestment).toLocaleString()}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedRequest(request);
                          setContributionForm(prev => ({ ...prev, requestId: request.id }));
                          setIsContributeDialogOpen(true);
                        }}
                      >
                        Fund Bot
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-requests" className="space-y-4">
          {/* User's funding requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoadingUserRequests ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="mt-2 text-muted-foreground">Loading your requests...</p>
              </div>
            ) : userRequests.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Funding Requests</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any bot funding requests yet.
                </p>
                <Button onClick={() => setIsRequestDialogOpen(true)}>
                  Create First Request
                </Button>
              </div>
            ) : (
              userRequests.map((request: BotFundingRequest) => (
                <Card key={request.id} className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <CardDescription>{request.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className="ml-2">{request.status}</Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contributors:</span>
                        <p className="font-medium">{request.contributions?.length || 0}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Funding Progress</span>
                        <span>{calculateProgress(request.fundingRaised, request.fundingGoal).toFixed(1)}%</span>
                      </div>
                      <Progress value={calculateProgress(request.fundingRaised, request.fundingGoal)} className="h-2" />
                      <div className="flex justify-between text-sm mt-1 text-muted-foreground">
                        <span>${parseFloat(request.fundingRaised).toLocaleString()} raised</span>
                        <span>Goal: ${parseFloat(request.fundingGoal).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Manage Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-funding" className="space-y-4">
          {/* User's contributions */}
          <div className="space-y-4">
            {isLoadingContributions ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="mt-2 text-muted-foreground">Loading your contributions...</p>
              </div>
            ) : userContributions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Contributions Yet</h3>
                <p className="text-muted-foreground">
                  You haven't funded any bots yet. Explore the available funding requests!
                </p>
              </div>
            ) : (
              userContributions.map((contribution: any) => (
                <Card key={contribution.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{contribution.requestTitle}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Contributed ${parseFloat(contribution.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(contribution.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={contribution.status === "confirmed" ? "bg-green-100 text-green-800" : ""}>
                        {contribution.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Bot Funding Request</DialogTitle>
            <DialogDescription>
              Request funding for your innovative trading bot idea
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Bot Title</Label>
                <Input
                  id="title"
                  value={requestForm.title}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Advanced Grid Trading Bot"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={requestForm.category} 
                  onValueChange={(value) => setRequestForm(prev => ({ ...prev, category: value }))}
                >
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

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={requestForm.description}
                onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your trading bot concept, its unique features, and potential benefits..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="botType">Bot Type</Label>
                <Select 
                  value={requestForm.botType} 
                  onValueChange={(value) => setRequestForm(prev => ({ ...prev, botType: value }))}
                >
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
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select 
                  value={requestForm.riskLevel} 
                  onValueChange={(value) => setRequestForm(prev => ({ ...prev, riskLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
                <Input
                  id="fundingGoal"
                  type="number"
                  value={requestForm.fundingGoal}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, fundingGoal: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  value={requestForm.expectedReturn}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, expectedReturn: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Select 
                  value={requestForm.timeline} 
                  onValueChange={(value) => setRequestForm(prev => ({ ...prev, timeline: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 days">15 days</SelectItem>
                    <SelectItem value="30 days">30 days</SelectItem>
                    <SelectItem value="2 months">2 months</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="tradingStrategy">Trading Strategy</Label>
              <Textarea
                id="tradingStrategy"
                value={requestForm.tradingStrategy}
                onChange={(e) => setRequestForm(prev => ({ ...prev, tradingStrategy: e.target.value }))}
                placeholder="Explain your trading strategy, technical indicators, risk management approach..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="developerExperience">Your Experience</Label>
              <Textarea
                id="developerExperience"
                value={requestForm.developerExperience}
                onChange={(e) => setRequestForm(prev => ({ ...prev, developerExperience: e.target.value }))}
                placeholder="Describe your trading and development experience, past projects, track record..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRequest} 
                disabled={createRequestMutation.isPending || !requestForm.title || !requestForm.description}
              >
                {createRequestMutation.isPending ? "Creating..." : "Create Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contribute Dialog */}
      <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Bot Development</DialogTitle>
            <DialogDescription>
              Contribute to: {selectedRequest?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Bot Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Type: {selectedRequest.botType.replace('_', ' ').toUpperCase()}</div>
                  <div>Expected Return: {selectedRequest.expectedReturn}% APY</div>
                  <div>Risk Level: {selectedRequest.riskLevel}</div>
                  <div>Timeline: {selectedRequest.timeline}</div>
                </div>
              </div>

              <div>
                <Label htmlFor="amount">Contribution Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={contributionForm.amount}
                  onChange={(e) => setContributionForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  min={selectedRequest.minimumInvestment}
                  max={selectedRequest.maximumInvestment || undefined}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Min: ${parseFloat(selectedRequest.minimumInvestment).toLocaleString()}
                  {selectedRequest.maximumInvestment && ` | Max: $${parseFloat(selectedRequest.maximumInvestment).toLocaleString()}`}
                </p>
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={contributionForm.message}
                  onChange={(e) => setContributionForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Add a message for the developer..."
                  rows={3}
                />
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Your Investment:</span>
                    <span className="font-medium">${contributionForm.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Annual Return:</span>
                    <span className="font-medium text-green-600">{selectedRequest.expectedReturn}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Annual Profit:</span>
                    <span className="font-medium text-green-600">
                      ${(contributionForm.amount * selectedRequest.expectedReturn / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsContributeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleContribute} 
                  disabled={contributeMutation.isPending || contributionForm.amount < selectedRequest.minimumInvestment}
                >
                  {contributeMutation.isPending ? "Processing..." : "Confirm Funding"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
      <Footer />
    </div>
  );
}