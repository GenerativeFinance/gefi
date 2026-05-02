import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Flag,
  Eye,
  AlertTriangle,
  Clock,
  FileText,
  Database,
  User,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";

interface ContentModerationItem {
  id: number;
  type: 'ai_model' | 'dataset' | 'user_profile' | 'comment' | 'review';
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'critical';
  flaggedReason?: string;
  autoFlags?: string[];
  riskScore?: number;
  description: string;
  reviewerNotes?: string;
}

export default function AdminContentModeration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentFilter, setContentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ContentModerationItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Mock data - in real implementation, these would come from API calls
  const moderationItems: ContentModerationItem[] = [
    {
      id: 1,
      type: "ai_model",
      title: "Quantum Risk Predictor v2.0",
      submittedBy: "QuantumFinance Labs",
      submittedAt: "2025-07-14T08:30:00Z",
      status: "pending",
      priority: "high",
      description: "Advanced AI model for predicting market volatility using quantum computing principles",
      autoFlags: ["performance_claims_unverified", "licensing_unclear"],
      riskScore: 75
    },
    {
      id: 2,
      type: "dataset",
      title: "European Market Sentiment Data Q2 2025",
      submittedBy: "DataStream Analytics",
      submittedAt: "2025-07-14T07:15:00Z",
      status: "flagged",
      priority: "medium",
      description: "Comprehensive sentiment analysis dataset covering European financial markets",
      flaggedReason: "Data privacy compliance needs verification",
      autoFlags: ["gdpr_compliance_check", "data_quality_review"],
      riskScore: 45
    },
    {
      id: 3,
      type: "user_profile",
      title: "Alex Johnson - Developer Profile Update",
      submittedBy: "Alex Johnson",
      submittedAt: "2025-07-14T06:45:00Z",
      status: "under_review",
      priority: "low",
      description: "Profile update with new AI model certifications and performance metrics",
      autoFlags: ["credential_verification_needed"],
      riskScore: 20
    },
    {
      id: 4,
      type: "ai_model",
      title: "CryptoWave Portfolio Optimizer",
      submittedBy: "BlockchainAI Inc",
      submittedAt: "2025-07-13T16:20:00Z",
      status: "approved",
      priority: "medium",
      description: "AI-powered portfolio optimization for cryptocurrency investments",
      reviewerNotes: "Approved after successful verification of performance claims and security audit",
      riskScore: 35
    },
    {
      id: 5,
      type: "comment",
      title: "Review on High-Frequency Trading Bot",
      submittedBy: "Sarah Chen",
      submittedAt: "2025-07-13T14:10:00Z",
      status: "rejected",
      priority: "low",
      description: "User review claiming unrealistic returns from HFT bot",
      flaggedReason: "Contains misleading information about returns",
      reviewerNotes: "Rejected due to unsubstantiated performance claims",
      riskScore: 60
    },
    {
      id: 6,
      type: "dataset",
      title: "Real-time Options Flow Data",
      submittedBy: "MarketData Pro",
      submittedAt: "2025-07-13T12:30:00Z",
      status: "pending",
      priority: "critical",
      description: "Live options trading flow data with millisecond precision",
      autoFlags: ["market_data_licensing", "regulatory_compliance"],
      riskScore: 85
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      flagged: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      under_review: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    };
    return <Badge className={variants[status] || variants.pending}>{status.replace('_', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return <Badge className={variants[priority]}>{priority}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      ai_model: FileText,
      dataset: Database,
      user_profile: User,
      comment: MessageSquare,
      review: MessageSquare
    };
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const filteredItems = moderationItems.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = contentFilter === "all" || item.type === contentFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const stats = {
    totalItems: moderationItems.length,
    pendingItems: moderationItems.filter(i => i.status === 'pending').length,
    flaggedItems: moderationItems.filter(i => i.status === 'flagged').length,
    underReviewItems: moderationItems.filter(i => i.status === 'under_review').length,
    highPriorityItems: moderationItems.filter(i => i.priority === 'high' || i.priority === 'critical').length,
    avgProcessingTime: "2.3 hours"
  };

  const handleApprove = (itemId: number) => {
    console.log("Approved item:", itemId);
    // In real implementation, make API call to approve
  };

  const handleReject = (itemId: number) => {
    console.log("Rejected item:", itemId);
    // In real implementation, make API call to reject
  };

  const handleFlag = (itemId: number) => {
    console.log("Flagged item:", itemId);
    // In real implementation, make API call to flag
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Content Moderation</h1>
              <p className="text-muted-foreground mt-2">Review and moderate platform content</p>
            </div>
            <Button className="bg-primary text-primary-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Bulk Actions
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <p className="text-xs text-muted-foreground">All content</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingItems}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.flaggedItems}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.underReviewItems}</div>
                <p className="text-xs text-muted-foreground">Being processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.highPriorityItems}</div>
                <p className="text-xs text-muted-foreground">Urgent items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.avgProcessingTime}</div>
                <p className="text-xs text-muted-foreground">per item</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              
              <Select value={contentFilter} onValueChange={setContentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ai_model">AI Models</SelectItem>
                  <SelectItem value="dataset">Datasets</SelectItem>
                  <SelectItem value="user_profile">Profiles</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="review">Reviews</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {moderationItems.length} items
            </div>
          </div>

          {/* Content Items */}
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(item.type)}
                        <h3 className="font-medium text-lg">{item.title}</h3>
                        <Badge variant="outline">{item.type.replace('_', ' ')}</Badge>
                        {getPriorityBadge(item.priority)}
                        {getStatusBadge(item.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Submitted by <span className="font-medium">{item.submittedBy}</span> on{' '}
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </p>
                      
                      <p className="text-sm">{item.description}</p>
                      
                      {item.riskScore && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Risk Score:</span>
                          <Badge variant={item.riskScore > 70 ? "destructive" : item.riskScore > 40 ? "secondary" : "default"}>
                            {item.riskScore}/100
                          </Badge>
                        </div>
                      )}
                      
                      {item.autoFlags && item.autoFlags.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-orange-600">Auto-detected Issues:</span>
                          <div className="flex flex-wrap gap-1">
                            {item.autoFlags.map((flag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {flag.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.flaggedReason && (
                        <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <p className="text-sm text-orange-800 dark:text-orange-200">
                            <Flag className="h-4 w-4 inline mr-1" />
                            <strong>Flagged:</strong> {item.flaggedReason}
                          </p>
                        </div>
                      )}
                      
                      {item.reviewerNotes && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Reviewer Notes:</strong> {item.reviewerNotes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedItem(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review: {item.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Type:</label>
                                <p className="text-sm">{item.type.replace('_', ' ')}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Priority:</label>
                                <p className="text-sm">{item.priority}</p>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Description:</label>
                              <p className="text-sm mt-1">{item.description}</p>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Review Notes:</label>
                              <Textarea
                                placeholder="Add your review notes..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => handleFlag(item.id)}>
                                <Flag className="h-4 w-4 mr-2" />
                                Flag
                              </Button>
                              <Button variant="outline" onClick={() => handleReject(item.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button onClick={() => handleApprove(item.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => handleApprove(item.id)}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(item.id)}>
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleFlag(item.id)}>
                          <Flag className="h-4 w-4 text-orange-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}