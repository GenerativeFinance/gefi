import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import {
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Handshake,
  Target,
  TrendingUp,
  Clock,
  Star,
  Plus,
  Send,
  Link,
  Eye,
  Edit,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Building,
  Shield,
  Globe,
  Zap,
  UserPlus,
  Search,
  Filter,
  Download,
  Share
} from "lucide-react";

interface Collaboration {
  id: number;
  title: string;
  description: string;
  type: 'partnership' | 'data-sharing' | 'joint-research' | 'syndication';
  status: 'draft' | 'active' | 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate?: string;
  participants: Participant[];
  datasets: string[];
  revenue: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

interface Participant {
  id: string;
  name: string;
  role: 'lead' | 'contributor' | 'observer';
  type: 'data_provider' | 'developer' | 'investor' | 'regulator';
  avatar?: string;
  email: string;
  joinedAt: string;
}

interface CollaborationRequest {
  id: number;
  from: Participant;
  title: string;
  description: string;
  type: string;
  proposedTerms: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Message {
  id: number;
  collaborationId: number;
  author: Participant;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export default function DataProviderCollaboration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Mock data for demonstration
  const collaborations: Collaboration[] = [
    {
      id: 1,
      title: "European ESG Data Syndication",
      description: "Joint initiative to provide comprehensive ESG data across European markets with standardized metrics and real-time updates.",
      type: 'syndication',
      status: 'active',
      priority: 'high',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      participants: [
        {
          id: 'dp_001',
          name: 'EuroData Analytics',
          role: 'lead',
          type: 'data_provider',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          email: 'contact@eurodata.com',
          joinedAt: '2024-01-15'
        },
        {
          id: 'dp_002',
          name: 'GreenMetrics Corp',
          role: 'contributor',
          type: 'data_provider',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b765?w=32&h=32&fit=crop&crop=face',
          email: 'partnerships@greenmetrics.com',
          joinedAt: '2024-01-20'
        },
        {
          id: 'dev_003',
          name: 'SustainableAI Labs',
          role: 'contributor',
          type: 'developer',
          email: 'collab@sustainableai.com',
          joinedAt: '2024-02-01'
        }
      ],
      datasets: ['ESG_Scores_EU', 'Carbon_Footprint_Data', 'Governance_Metrics'],
      revenue: 125000,
      progress: 75,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-07-14T14:30:00Z'
    },
    {
      id: 2,
      title: "Alternative Credit Risk Data Partnership",
      description: "Strategic partnership to combine traditional credit data with alternative data sources for enhanced risk assessment models.",
      type: 'partnership',
      status: 'active',
      priority: 'medium',
      startDate: '2024-03-01',
      participants: [
        {
          id: 'dp_004',
          name: 'CreditTech Solutions',
          role: 'lead',
          type: 'data_provider',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
          email: 'partnerships@credittech.com',
          joinedAt: '2024-03-01'
        },
        {
          id: 'dp_005',
          name: 'Alternative Data Co',
          role: 'contributor',
          type: 'data_provider',
          email: 'business@altdata.com',
          joinedAt: '2024-03-05'
        }
      ],
      datasets: ['Credit_Bureau_Data', 'Social_Media_Sentiment', 'Transaction_Patterns'],
      revenue: 89000,
      progress: 60,
      createdAt: '2024-03-01T09:00:00Z',
      updatedAt: '2024-07-13T16:45:00Z'
    },
    {
      id: 3,
      title: "Crypto Market Microstructure Research",
      description: "Academic collaboration to study cryptocurrency market microstructure using high-frequency trading data and order book analytics.",
      type: 'joint-research',
      status: 'pending',
      priority: 'low',
      startDate: '2024-08-01',
      endDate: '2025-02-28',
      participants: [
        {
          id: 'dp_006',
          name: 'CryptoData Institute',
          role: 'lead',
          type: 'data_provider',
          email: 'research@cryptodata.org',
          joinedAt: '2024-07-10'
        }
      ],
      datasets: ['HFT_OrderBook_Data', 'Liquidity_Metrics', 'Market_Impact_Measures'],
      revenue: 0,
      progress: 15,
      createdAt: '2024-07-10T11:30:00Z',
      updatedAt: '2024-07-14T10:00:00Z'
    }
  ];

  const collaborationRequests: CollaborationRequest[] = [
    {
      id: 1,
      from: {
        id: 'dev_007',
        name: 'QuantAI Research',
        role: 'contributor',
        type: 'developer',
        email: 'partnerships@quantai.com',
        joinedAt: '2024-07-14'
      },
      title: 'AI-Driven Fixed Income Analytics',
      description: 'Seeking partnership to develop next-generation fixed income analytics using your bond pricing data.',
      type: 'data-sharing',
      proposedTerms: 'Revenue sharing: 70/30 split, 2-year exclusive partnership, co-marketing rights',
      status: 'pending',
      createdAt: '2024-07-14T08:00:00Z'
    },
    {
      id: 2,
      from: {
        id: 'inv_008',
        name: 'Nordic Pension Fund',
        role: 'observer',
        type: 'investor',
        email: 'data@nordicpension.com',
        joinedAt: '2024-07-13'
      },
      title: 'ESG Investment Data Syndication',
      description: 'Interested in joining your ESG data syndication program for our sustainable investment strategies.',
      type: 'syndication',
      proposedTerms: 'Monthly subscription: $15K, quarterly data reviews, custom ESG scoring methodology',
      status: 'pending',
      createdAt: '2024-07-13T15:30:00Z'
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      collaborationId: 1,
      author: collaborations[0].participants[0],
      content: "Great progress on the ESG standardization framework! The latest metrics look comprehensive.",
      timestamp: '2024-07-14T12:00:00Z'
    },
    {
      id: 2,
      collaborationId: 1,
      author: collaborations[0].participants[1],
      content: "Agreed! Should we schedule a call to discuss the carbon footprint calculation methodology?",
      timestamp: '2024-07-14T12:30:00Z'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return variants[status] || variants.draft;
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      partnership: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: Handshake },
      'data-sharing': { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: Share },
      'joint-research': { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", icon: FileText },
      syndication: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", icon: Globe }
    };
    return variants[type] || variants.partnership;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return variants[priority] || variants.medium;
  };

  const handleAcceptRequest = async (requestId: number) => {
    toast({
      title: "Request Accepted",
      description: "The collaboration request has been accepted successfully."
    });
  };

  const handleRejectRequest = async (requestId: number) => {
    toast({
      title: "Request Rejected",
      description: "The collaboration request has been declined."
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCollaboration) return;
    
    // In a real app, this would make an API call
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the collaboration team."
    });
    setNewMessage("");
  };

  const filteredCollaborations = collaborations.filter(collab => {
    const matchesSearch = collab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collab.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || collab.type === typeFilter;
    const matchesStatus = statusFilter === "all" || collab.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Data Provider Collaboration</h1>
            <p className="text-muted-foreground">
              Manage partnerships, syndications, and joint research initiatives
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Collaboration
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Collaborations
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Requests
              {collaborationRequests.filter(r => r.status === 'pending').length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {collaborationRequests.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Active Collaborations Tab */}
          <TabsContent value="active">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search collaborations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="data-sharing">Data Sharing</SelectItem>
                      <SelectItem value="joint-research">Joint Research</SelectItem>
                      <SelectItem value="syndication">Syndication</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Collaboration List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCollaborations.map((collaboration) => {
                const typeInfo = getTypeBadge(collaboration.type);
                const TypeIcon = typeInfo.icon;
                
                return (
                  <Card key={collaboration.id} className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedCollaboration(collaboration)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4" />
                            <h3 className="font-semibold text-lg">{collaboration.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getStatusBadge(collaboration.status)}>
                              {collaboration.status}
                            </Badge>
                            <Badge className={typeInfo.color}>
                              {collaboration.type.replace('-', ' ')}
                            </Badge>
                            <Badge className={getPriorityBadge(collaboration.priority)}>
                              {collaboration.priority}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {collaboration.description}
                      </p>
                      
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{collaboration.progress}%</span>
                        </div>
                        <Progress value={collaboration.progress} className="h-2" />
                      </div>

                      {/* Participants */}
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Participants</span>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {collaboration.participants.slice(0, 3).map((participant, index) => (
                              <Avatar key={participant.id} className="h-8 w-8 border-2 border-background">
                                <AvatarImage src={participant.avatar} />
                                <AvatarFallback className="text-xs">
                                  {participant.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {collaboration.participants.length > 3 && (
                            <span className="text-sm text-muted-foreground">
                              +{collaboration.participants.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Revenue & Timeline */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="text-sm">
                          <span className="font-medium text-green-600">
                            ${collaboration.revenue.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground ml-1">revenue</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Started {new Date(collaboration.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <div className="space-y-6">
              {collaborationRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={request.from.avatar} />
                            <AvatarFallback className="text-xs">
                              {request.from.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              from {request.from.name} • {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{request.description}</p>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Proposed Terms:</h4>
                      <p className="text-sm text-muted-foreground">{request.proposedTerms}</p>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button onClick={() => handleAcceptRequest(request.id)} size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleRejectRequest(request.id)} 
                          size="sm"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Negotiate
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Collaborations</p>
                      <p className="text-2xl font-bold">{collaborations.filter(c => c.status === 'active').length}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">
                        ${collaborations.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                      <p className="text-2xl font-bold">
                        {collaborationRequests.filter(r => r.status === 'pending').length}
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Progress</p>
                      <p className="text-2xl font-bold">
                        {Math.round(collaborations.reduce((sum, c) => sum + c.progress, 0) / collaborations.length)}%
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collaboration Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Collaboration Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['partnership', 'data-sharing', 'joint-research', 'syndication'].map((type) => {
                      const count = collaborations.filter(c => c.type === type).length;
                      const percentage = (count / collaborations.length) * 100;
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                            <span className="text-sm text-muted-foreground">{count}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collaborations
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((collab) => (
                        <div key={collab.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{collab.title}</span>
                          <span className="text-sm font-mono">
                            ${collab.revenue.toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Collaboration Detail Modal */}
        {selectedCollaboration && (
          <Dialog open={!!selectedCollaboration} onOpenChange={() => setSelectedCollaboration(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const typeInfo = getTypeBadge(selectedCollaboration.type);
                    const TypeIcon = typeInfo.icon;
                    return <TypeIcon className="h-5 w-5" />;
                  })()}
                  {selectedCollaboration.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Status and Progress */}
                <div className="flex items-center gap-4">
                  <Badge className={getStatusBadge(selectedCollaboration.status)}>
                    {selectedCollaboration.status}
                  </Badge>
                  <Badge className={getPriorityBadge(selectedCollaboration.priority)}>
                    {selectedCollaboration.priority} priority
                  </Badge>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm">Progress:</span>
                    <Progress value={selectedCollaboration.progress} className="w-20 h-2" />
                    <span className="text-sm font-mono">{selectedCollaboration.progress}%</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedCollaboration.description}</p>
                </div>

                {/* Participants */}
                <div>
                  <h3 className="font-medium mb-3">Participants ({selectedCollaboration.participants.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCollaboration.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{participant.name}</p>
                          <p className="text-xs text-muted-foreground">{participant.email}</p>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {participant.role}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {participant.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Datasets */}
                <div>
                  <h3 className="font-medium mb-3">Datasets ({selectedCollaboration.datasets.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCollaboration.datasets.map((dataset, index) => (
                      <Badge key={index} variant="secondary">
                        {dataset}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div>
                  <h3 className="font-medium mb-3">Recent Messages</h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {messages
                      .filter(m => m.collaborationId === selectedCollaboration.id)
                      .map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.author.avatar} />
                            <AvatarFallback className="text-xs">
                              {message.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.author.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}