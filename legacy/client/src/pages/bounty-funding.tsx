import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  DollarSign, 
  Target, 
  Clock, 
  Users, 
  TrendingUp, 
  Award, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Eye
} from "lucide-react";

interface BountyFundingRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  fundingRequired: number;
  fundingRaised: number;
  timeline: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skills: string[];
  deliverables: string[];
  status: 'draft' | 'submitted' | 'approved' | 'funded' | 'in_progress' | 'completed';
  developerName: string;
  submittedAt: string;
  approvedAt?: string;
  fundedAt?: string;
  backers: number;
  estimatedReward: number;
}

export default function BountyFundingPage() {
  const [activeTab, setActiveTab] = useState("browse");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for creating new funding request
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    fundingRequired: "",
    timeline: "",
    difficulty: "",
    skills: "",
    deliverables: "",
  });

  // Fetch bounty funding requests
  const { data: fundingRequests = [], isLoading } = useQuery({
    queryKey: ["/api/bounty-funding"],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/bounty-categories"],
  });

  // Create funding request mutation
  const createFundingMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/bounty-funding", {
        ...data,
        fundingRequired: parseFloat(data.fundingRequired),
        skills: data.skills.split(',').map((s: string) => s.trim()),
        deliverables: data.deliverables.split('\n').filter((d: string) => d.trim()),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Funding request submitted successfully",
      });
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        fundingRequired: "",
        timeline: "",
        difficulty: "",
        skills: "",
        deliverables: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bounty-funding"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit funding request",
        variant: "destructive",
      });
    },
  });

  // Fund bounty mutation
  const fundBountyMutation = useMutation({
    mutationFn: async ({ bountyId, amount }: { bountyId: number; amount: number }) => {
      return apiRequest("POST", `/api/bounty-funding/${bountyId}/fund`, { amount });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bounty funded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bounty-funding"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fund bounty",
        variant: "destructive",
      });
    },
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    createFundingMutation.mutate(formData);
  };

  const handleFundBounty = (bountyId: number, amount: number) => {
    fundBountyMutation.mutate({ bountyId, amount });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'funded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'submitted': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = Array.isArray(fundingRequests) 
    ? fundingRequests.filter((request: any) => {
        if (selectedCategory !== "all" && request.category !== selectedCategory) return false;
        return true;
      }).sort((a: any, b: any) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case 'funding':
        return b.fundingRequired - a.fundingRequired;
      case 'progress':
        return (b.fundingRaised / b.fundingRequired) - (a.fundingRaised / a.fundingRequired);
      default:
        return 0;
    }
  }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Financial Bounty Funding</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Support and fund the development of AI financial models and tools
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Request Funding
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Total Funded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">$2.4M</p>
              <p className="text-sm text-muted-foreground">+15% this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Active Bounties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">47</p>
              <p className="text-sm text-muted-foreground">12 pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">1,247</p>
              <p className="text-sm text-muted-foreground">+23 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Award className="h-5 w-5 mr-2 text-orange-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">189</p>
              <p className="text-sm text-muted-foreground">94% success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Requests</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="funded">My Funding</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="risk-management">Risk Management</SelectItem>
                    <SelectItem value="trading-algorithms">Trading Algorithms</SelectItem>
                    <SelectItem value="portfolio-optimization">Portfolio Optimization</SelectItem>
                    <SelectItem value="market-prediction">Market Prediction</SelectItem>
                    <SelectItem value="sentiment-analysis">Sentiment Analysis</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="funding">Funding Amount</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Funding Requests Grid */}
            <div className="grid gap-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                filteredRequests.map((request: BountyFundingRequest) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            {request.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getDifficultyColor(request.difficulty)}>
                            {request.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Funding Progress</span>
                              <span className="text-sm text-muted-foreground">
                                ${request.fundingRaised.toLocaleString()} / ${request.fundingRequired.toLocaleString()}
                              </span>
                            </div>
                            <Progress 
                              value={(request.fundingRaised / request.fundingRequired) * 100} 
                              className="h-2"
                            />
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {request.backers} backers
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {request.timeline}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Required Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {request.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {request.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{request.skills.length - 3} more
                              </Badge>
                            )}
                          </div>

                          <div className="pt-2">
                            <h4 className="font-medium text-sm mb-1">Developer</h4>
                            <p className="text-sm text-muted-foreground">{request.developerName}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Estimated Reward</h4>
                            <p className="text-2xl font-bold text-green-600">
                              ${request.estimatedReward.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleFundBounty(request.id, 1000)}
                              disabled={request.status === 'completed' || fundBountyMutation.isPending}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Fund
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Funding Requests</CardTitle>
                <CardDescription>
                  Track the status of your submitted funding requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  No funding requests submitted yet. Click "Request Funding" to get started.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funded" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Funding Contributions</CardTitle>
                <CardDescription>
                  Bounties you've funded and their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  No funding contributions yet. Start by funding a bounty in the Browse tab.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Funding Request Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Request Bounty Funding</CardTitle>
                <CardDescription>
                  Submit a funding request for your AI financial model development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="AI Risk Assessment Model"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="risk-management">Risk Management</SelectItem>
                          <SelectItem value="trading-algorithms">Trading Algorithms</SelectItem>
                          <SelectItem value="portfolio-optimization">Portfolio Optimization</SelectItem>
                          <SelectItem value="market-prediction">Market Prediction</SelectItem>
                          <SelectItem value="sentiment-analysis">Sentiment Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Detailed description of your project and its goals..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="funding">Funding Required ($)</Label>
                      <Input
                        id="funding"
                        type="number"
                        value={formData.fundingRequired}
                        onChange={(e) => setFormData({...formData, fundingRequired: e.target.value})}
                        placeholder="25000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                        placeholder="3 months"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select 
                        value={formData.difficulty} 
                        onValueChange={(value) => setFormData({...formData, difficulty: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      placeholder="Python, Machine Learning, Financial Modeling, TensorFlow"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliverables">Deliverables (one per line)</Label>
                    <Textarea
                      id="deliverables"
                      value={formData.deliverables}
                      onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                      placeholder="Complete AI model implementation&#10;Documentation and API&#10;Testing suite&#10;Performance benchmarks"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      disabled={createFundingMutation.isPending}
                      className="flex-1"
                    >
                      {createFundingMutation.isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}