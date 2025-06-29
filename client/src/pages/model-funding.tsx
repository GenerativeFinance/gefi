import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users, Target, DollarSign, Calendar, Star, Filter, Search, Briefcase, Brain, BarChart3 } from "lucide-react";

interface DeveloperModel {
  id: number;
  name: string;
  description: string;
  status: string;
  fundingGoal: string;
  fundingRaised: string;
  category: string;
  tags: string[];
  developerId: string;
  createdAt: string;
  testResults?: any;
  performanceMetrics?: any;
  funding?: any[];
}

interface FundingInvestment {
  modelId: number;
  amount: number;
  expectedStake: number;
}

export default function ModelFunding() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [selectedModel, setSelectedModel] = useState<DeveloperModel | null>(null);
  const [fundingAmount, setFundingAmount] = useState("");
  const [isInvestmentDialogOpen, setIsInvestmentDialogOpen] = useState(false);

  // Fetch developer models available for funding
  const { data: fundableModels = [], isLoading: isLoadingModels } = useQuery({
    queryKey: ["/api/developer-models", { fundable: true }],
  });

  // Fetch user's funding history
  const { data: userFunding = [], isLoading: isLoadingFunding, error: fundingError } = useQuery({
    queryKey: ["/api/model-funding/my-investments"],
    retry: false,
  });

  // Fetch funding categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/developer-models/categories"],
  });

  // Fund model mutation
  const fundModelMutation = useMutation({
    mutationFn: async (investment: FundingInvestment) => {
      return apiRequest("POST", "/api/model-funding/invest", investment);
    },
    onSuccess: () => {
      toast({
        title: "Investment Successful",
        description: "Your funding has been pledged successfully!",
      });
      setIsInvestmentDialogOpen(false);
      setFundingAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/developer-models"] });
      queryClient.invalidateQueries({ queryKey: ["/api/model-funding/my-investments"] });
    },
    onError: (error) => {
      toast({
        title: "Investment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter and sort models
  const filteredModels = fundableModels
    .filter((model: DeveloperModel) => {
      if (selectedCategory && model.category !== selectedCategory) return false;
      if (searchQuery && !model.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !model.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return model.status === "approved" || model.status === "testing"; // Only fund approved/testing models
    })
    .sort((a: DeveloperModel, b: DeveloperModel) => {
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
          return (b.funding?.length || 0) - (a.funding?.length || 0);
      }
    });

  const calculateStake = (investment: number, totalGoal: number, currentRaised: number) => {
    const remainingGoal = totalGoal - currentRaised;
    return Math.min((investment / totalGoal) * 100, (investment / remainingGoal) * 30); // Max 30% stake
  };

  const handleInvestment = () => {
    if (!selectedModel || !fundingAmount) return;
    
    const amount = parseFloat(fundingAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount.",
        variant: "destructive",
      });
      return;
    }

    const expectedStake = calculateStake(
      amount, 
      parseFloat(selectedModel.fundingGoal), 
      parseFloat(selectedModel.fundingRaised)
    );

    fundModelMutation.mutate({
      modelId: selectedModel.id,
      amount,
      expectedStake,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "testing": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "deployed": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const totalInvested = userFunding.reduce((sum: number, investment: any) => sum + parseFloat(investment.amount), 0);
  const activeInvestments = userFunding.filter((investment: any) => investment.status === "confirmed").length;

  if (isLoadingModels) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Model Funding</h1>
          <p className="text-muted-foreground">
            Invest in the development of cutting-edge AI financial models and share in their success
          </p>
        </div>

        {/* Investment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{activeInvestments}</p>
                  <p className="text-xs text-muted-foreground">Active Investments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{filteredModels.length}</p>
                  <p className="text-xs text-muted-foreground">Available Models</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {userFunding.length > 0 ? 
                      `${(userFunding.filter((inv: any) => parseFloat(inv.expectedReturn || 0) > 0).length / userFunding.length * 100).toFixed(0)}%` 
                      : "0%"
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Models</TabsTrigger>
          <TabsTrigger value="my-investments">My Investments</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Models</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or description..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="funding_progress">Funding Progress</SelectItem>
                      <SelectItem value="funding_goal">Funding Goal</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => {
                    setSelectedCategory("");
                    setSearchQuery("");
                    setSortBy("trending");
                  }}>
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model: DeveloperModel) => {
              const fundingProgress = (parseFloat(model.fundingRaised) / parseFloat(model.fundingGoal)) * 100;
              const remainingGoal = parseFloat(model.fundingGoal) - parseFloat(model.fundingRaised);
              
              return (
                <Card key={model.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <Badge className={getStatusColor(model.status)}>
                          {model.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{fundingProgress.toFixed(0)}% funded</p>
                        <p className="text-xs text-muted-foreground">
                          {model.funding?.length || 0} investors
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {model.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Goal: ${parseFloat(model.fundingGoal).toLocaleString()}</span>
                        <span>Raised: ${parseFloat(model.fundingRaised).toLocaleString()}</span>
                      </div>
                      <Progress value={fundingProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        ${remainingGoal.toLocaleString()} remaining
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {model.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          onClick={() => setSelectedModel(model)}
                          disabled={fundingProgress >= 100}
                        >
                          {fundingProgress >= 100 ? "Fully Funded" : "Fund This Model"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Fund {model.name}</DialogTitle>
                          <DialogDescription>
                            Invest in this AI model's development and receive equity stake
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="amount">Investment Amount ($)</Label>
                              <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount..."
                                value={fundingAmount}
                                onChange={(e) => setFundingAmount(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Expected Stake</Label>
                              <div className="h-10 px-3 py-2 border rounded-md bg-muted">
                                {fundingAmount ? 
                                  `${calculateStake(
                                    parseFloat(fundingAmount), 
                                    parseFloat(model.fundingGoal), 
                                    parseFloat(model.fundingRaised)
                                  ).toFixed(2)}%` 
                                  : "0%"
                                }
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold">Model Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Category: {model.category}</div>
                              <div>Status: {model.status}</div>
                              <div>Goal: ${parseFloat(model.fundingGoal).toLocaleString()}</div>
                              <div>Raised: ${parseFloat(model.fundingRaised).toLocaleString()}</div>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsInvestmentDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleInvestment} 
                              disabled={fundModelMutation.isPending || !fundingAmount}
                            >
                              {fundModelMutation.isPending ? "Processing..." : "Confirm Investment"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredModels.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Models Found</h3>
                <p className="text-muted-foreground">
                  No AI models match your current filters. Try adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Investment Portfolio</CardTitle>
              <CardDescription>Track your AI model investments and returns</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFunding ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : userFunding.length > 0 ? (
                <div className="space-y-4">
                  {userFunding.map((investment: any) => (
                    <div key={investment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{investment.modelName}</h4>
                        <Badge variant={investment.status === "confirmed" ? "default" : "secondary"}>
                          {investment.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Investment</p>
                          <p className="font-medium">${parseFloat(investment.amount).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Stake</p>
                          <p className="font-medium">{parseFloat(investment.stake || 0).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Value</p>
                          <p className="font-medium text-green-600">
                            ${(parseFloat(investment.amount) * (1 + parseFloat(investment.expectedReturn || 0) / 100)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Return</p>
                          <p className={`font-medium ${parseFloat(investment.expectedReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {parseFloat(investment.expectedReturn || 0) >= 0 ? '+' : ''}{parseFloat(investment.expectedReturn || 0).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Investments Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start investing in AI models to build your portfolio
                  </p>
                  <Button onClick={() => document.querySelector('[data-state="active"][value="browse"]')?.click()}>
                    Browse Models
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trending AI Models</CardTitle>
              <CardDescription>Most popular models attracting investor attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredModels
                  .sort((a: DeveloperModel, b: DeveloperModel) => (b.funding?.length || 0) - (a.funding?.length || 0))
                  .slice(0, 5)
                  .map((model: DeveloperModel, index: number) => {
                    const fundingProgress = (parseFloat(model.fundingRaised) / parseFloat(model.fundingGoal)) * 100;
                    
                    return (
                      <div key={model.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-bold text-primary">#{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{model.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{model.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs">
                              <Users className="w-3 h-3 inline mr-1" />
                              {model.funding?.length || 0} investors
                            </span>
                            <span className="text-xs">
                              <TrendingUp className="w-3 h-3 inline mr-1" />
                              {fundingProgress.toFixed(0)}% funded
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Button size="sm" onClick={() => setSelectedModel(model)}>
                            View
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}