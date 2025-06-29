import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Target,
  Brain,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  BarChart3,
  Heart,
  Star,
  Code,
  Zap
} from 'lucide-react';

interface ModelFundingRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  deadline: Date;
  status: 'active' | 'funded' | 'expired' | 'cancelled';
  developerId: string;
  requiredSkills: string[];
  expectedROI: number;
  riskLevel: 'low' | 'medium' | 'high';
  backers: number;
  createdAt: Date;
  tags: string[];
}

interface ModelContribution {
  id: number;
  requestId: number;
  contributorId: string;
  amount: number;
  contributedAt: Date;
  requestTitle: string;
}

function ModelFunding() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Fetch model funding requests
  const { data: fundingRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['/api/model-funding/requests'],
    enabled: isAuthenticated,
  });

  // Fetch user's requests
  const { data: userRequests = [], isLoading: userRequestsLoading } = useQuery({
    queryKey: ['/api/model-funding/my-requests'],
    enabled: isAuthenticated,
  });

  // Fetch user's contributions
  const { data: userContributions = [], isLoading: contributionsLoading } = useQuery({
    queryKey: ['/api/model-funding/my-contributions'],
    enabled: isAuthenticated,
  });

  // Create funding request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/model-funding/requests', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Model funding request created successfully!",
      });
      setShowCreateDialog(false);
      queryClient.invalidateQueries({ queryKey: ['/api/model-funding'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create funding request",
        variant: "destructive",
      });
    },
  });

  // Fund model mutation
  const fundModelMutation = useMutation({
    mutationFn: async ({ requestId, amount }: { requestId: number, amount: number }) => {
      return await apiRequest('POST', '/api/model-funding/contribute', { requestId, amount });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully contributed to model funding!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/model-funding'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to contribute",
        variant: "destructive",
      });
    },
  });

  // Filter requests
  const filteredRequests = Array.isArray(fundingRequests) ? fundingRequests.filter((request: ModelFundingRequest) => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    const matchesRisk = selectedRisk === 'all' || request.riskLevel === selectedRisk;
    return matchesSearch && matchesCategory && matchesRisk;
  }) : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'funded': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'expired': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'cancelled': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to access Model Funding features.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => window.location.href = '/api/login'}>
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Model Funding</h1>
            <p className="text-muted-foreground">
              Fund AI model development and earn returns from successful implementations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Funding
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Model Funding Request</DialogTitle>
                  <DialogDescription>
                    Submit your AI model project for community funding
                  </DialogDescription>
                </DialogHeader>
                <CreateFundingForm 
                  onSubmit={(data) => createRequestMutation.mutate(data)}
                  isLoading={createRequestMutation.isPending}
                />
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
                  <p className="text-2xl font-bold">$2.4M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Models</p>
                  <p className="text-2xl font-bold">147</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Funders</p>
                  <p className="text-2xl font-bold">1,243</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg ROI</p>
                  <p className="text-2xl font-bold">18.4%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Projects</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="my-funding">My Funding</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search funding requests..."
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
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                  <SelectItem value="portfolio-optimization">Portfolio Optimization</SelectItem>
                  <SelectItem value="market-prediction">Market Prediction</SelectItem>
                  <SelectItem value="algorithmic-trading">Algorithmic Trading</SelectItem>
                  <SelectItem value="sentiment-analysis">Sentiment Analysis</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Funding Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requestsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="h-80">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                        <div className="h-2 bg-muted rounded w-full"></div>
                        <div className="h-8 bg-muted rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredRequests.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="p-12 text-center">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No funding requests found</h3>
                    <p className="text-muted-foreground">Try adjusting your search filters</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRequests.map((request: ModelFundingRequest) => (
                  <FundingRequestCard
                    key={request.id}
                    request={request}
                    onFund={(amount) => fundModelMutation.mutate({ requestId: request.id, amount })}
                    isLoading={fundModelMutation.isPending}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRequestsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="h-64">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-2 bg-muted rounded w-full"></div>
                        <div className="h-8 bg-muted rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : Array.isArray(userRequests) && userRequests.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="p-12 text-center">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No funding requests yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first model funding request to get started
                    </p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Request
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                Array.isArray(userRequests) && userRequests.map((request: ModelFundingRequest) => (
                  <MyFundingRequestCard key={request.id} request={request} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-funding" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contributionsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="h-48">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-8 bg-muted rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : Array.isArray(userContributions) && userContributions.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="p-12 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No contributions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start funding AI models to see your contributions here
                    </p>
                    <Button onClick={() => setActiveTab('browse')}>
                      Browse Projects
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                Array.isArray(userContributions) && userContributions.map((contribution: ModelContribution) => (
                  <ContributionCard key={contribution.id} contribution={contribution} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// Component for individual funding request cards
function FundingRequestCard({ 
  request, 
  onFund, 
  isLoading 
}: { 
  request: ModelFundingRequest, 
  onFund: (amount: number) => void,
  isLoading: boolean 
}) {
  const [showFundDialog, setShowFundDialog] = useState(false);
  const [fundAmount, setFundAmount] = useState('');

  const fundingProgress = (request.currentFunding / request.fundingGoal) * 100;
  const daysLeft = Math.max(0, Math.ceil((new Date(request.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const handleFund = () => {
    const amount = parseFloat(fundAmount);
    if (amount > 0) {
      onFund(amount);
      setShowFundDialog(false);
      setFundAmount('');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {request.description}
            </CardDescription>
          </div>
          <Badge className={`ml-2 ${getRiskColor(request.riskLevel)} shrink-0`}>
            {request.riskLevel} risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {formatCurrency(request.currentFunding)} / {formatCurrency(request.fundingGoal)}
            </span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(fundingProgress)}% funded</span>
            <span>{request.backers} backers</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {request.expectedROI}% ROI
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {request.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {request.tags?.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{request.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
            <DialogTrigger asChild>
              <Button className="flex-1" disabled={request.status !== 'active' || daysLeft === 0}>
                <DollarSign className="h-4 w-4 mr-2" />
                Fund Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fund Project</DialogTitle>
                <DialogDescription>
                  Contributing to: {request.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Funding Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    min="1"
                    step="1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleFund} disabled={isLoading || !fundAmount} className="flex-1">
                    {isLoading ? "Processing..." : "Confirm Funding"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowFundDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for user's own funding requests
function MyFundingRequestCard({ request }: { request: ModelFundingRequest }) {
  const fundingProgress = (request.currentFunding / request.fundingGoal) * 100;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'funded': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'expired': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'cancelled': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
          <Badge className={getStatusColor(request.status)}>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Funding Progress</span>
            <span className="font-medium">
              {formatCurrency(request.currentFunding)} / {formatCurrency(request.fundingGoal)}
            </span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(fundingProgress)}% funded</span>
            <span>{request.backers} backers</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Created {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{request.backers} backers</span>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </CardContent>
    </Card>
  );
}

// Component for user's contributions
function ContributionCard({ contribution }: { contribution: ModelContribution }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{contribution.requestTitle}</CardTitle>
        <CardDescription>
          Contributed on {new Date(contribution.contributedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            {formatCurrency(contribution.amount)}
          </span>
          <Badge variant="secondary">
            Active
          </Badge>
        </div>

        <Button variant="outline" className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Project
        </Button>
      </CardContent>
    </Card>
  );
}

// Component for creating new funding requests
function CreateFundingForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    fundingGoal: '',
    deadline: '',
    expectedROI: '',
    riskLevel: 'medium',
    requiredSkills: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      fundingGoal: parseFloat(formData.fundingGoal),
      expectedROI: parseFloat(formData.expectedROI),
      deadline: new Date(formData.deadline),
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
      tags: formData.tags.split(',').map(s => s.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
              <SelectItem value="portfolio-optimization">Portfolio Optimization</SelectItem>
              <SelectItem value="market-prediction">Market Prediction</SelectItem>
              <SelectItem value="algorithmic-trading">Algorithmic Trading</SelectItem>
              <SelectItem value="sentiment-analysis">Sentiment Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your AI model project..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
          <Input
            id="fundingGoal"
            type="number"
            placeholder="50000"
            value={formData.fundingGoal}
            onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
            min="1000"
            step="1000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expectedROI">Expected ROI (%)</Label>
          <Input
            id="expectedROI"
            type="number"
            placeholder="15"
            value={formData.expectedROI}
            onChange={(e) => setFormData({ ...formData, expectedROI: e.target.value })}
            min="0"
            max="100"
            step="0.1"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="riskLevel">Risk Level</Label>
          <Select value={formData.riskLevel} onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="requiredSkills">Required Skills (comma-separated)</Label>
          <Input
            id="requiredSkills"
            placeholder="Python, TensorFlow, Finance"
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          placeholder="machine learning, fintech, prediction"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating..." : "Create Request"}
        </Button>
      </div>
    </form>
  );
}

export default ModelFunding;