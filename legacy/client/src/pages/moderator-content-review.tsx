import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CheckCircle,
  XCircle,
  Eye,
  Flag,
  Search,
  Filter,
  Clock,
  User,
  FileText,
  MessageSquare,
  AlertTriangle,
  Star,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";

interface ContentReviewItem {
  id: number;
  type: 'comment' | 'review' | 'profile' | 'post' | 'model_description';
  content: string;
  author: string;
  authorId: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  priority: 'low' | 'medium' | 'high';
  reportCount: number;
  category: string;
  moderatorNotes?: string;
  relatedModel?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  autoFlags: string[];
}

export default function ModeratorContentReview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ContentReviewItem | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState("");

  // Mock data - in real implementation, these would come from API calls
  const contentItems: ContentReviewItem[] = [
    {
      id: 1,
      type: "review",
      content: "This AI model is absolutely terrible! Complete waste of money. The predictions are wrong 90% of the time and customer support is non-existent. AVOID AT ALL COSTS!",
      author: "DisgruntledTrader123",
      authorId: "user_456",
      submittedAt: "2025-07-14T13:20:00Z",
      status: "pending",
      priority: "high",
      reportCount: 3,
      category: "AI Model Review",
      relatedModel: "CryptoWave Predictor",
      sentiment: "negative",
      autoFlags: ["excessive_caps", "potentially_defamatory", "no_evidence"]
    },
    {
      id: 2,
      type: "comment",
      content: "Has anyone tried the new quantum trading bot? Looking for honest reviews before subscribing.",
      author: "InvestorSarah",
      authorId: "user_789",
      submittedAt: "2025-07-14T12:45:00Z",
      status: "approved",
      priority: "low",
      reportCount: 0,
      category: "Discussion",
      sentiment: "neutral",
      autoFlags: []
    },
    {
      id: 3,
      type: "profile",
      content: "Expert AI developer with 15+ years in quantitative finance. Former Goldman Sachs VP. Creator of award-winning trading algorithms generating 300% annual returns.",
      author: "QuantMaster Pro",
      authorId: "dev_123",
      submittedAt: "2025-07-14T11:30:00Z",
      status: "flagged",
      priority: "medium",
      reportCount: 2,
      category: "Developer Profile",
      sentiment: "positive",
      autoFlags: ["unverified_claims", "potential_exaggeration"]
    },
    {
      id: 4,
      type: "model_description",
      content: "Revolutionary AI model using advanced machine learning to predict market movements with 95% accuracy. Guaranteed profits or money back!",
      author: "AI Finance Labs",
      authorId: "dev_456",
      submittedAt: "2025-07-14T10:15:00Z",
      status: "pending",
      priority: "high",
      reportCount: 1,
      category: "Model Listing",
      relatedModel: "Market Prophet AI",
      sentiment: "positive",
      autoFlags: ["unrealistic_claims", "guarantee_warning", "accuracy_unverified"]
    },
    {
      id: 5,
      type: "comment",
      content: "The platform has been great for my portfolio management. Customer service is responsive and the AI models are performing well.",
      author: "HappyInvestor",
      authorId: "user_321",
      submittedAt: "2025-07-14T09:30:00Z",
      status: "approved",
      priority: "low",
      reportCount: 0,
      category: "Platform Feedback",
      sentiment: "positive",
      autoFlags: []
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      flagged: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    };
    return <Badge className={variants[status] || variants.pending}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return <Badge className={variants[priority]}>{priority}</Badge>;
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === "positive") return <ThumbsUp className="h-4 w-4 text-green-600" />;
    if (sentiment === "negative") return <ThumbsDown className="h-4 w-4 text-red-600" />;
    return <MessageSquare className="h-4 w-4 text-gray-600" />;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      comment: MessageSquare,
      review: Star,
      profile: User,
      post: FileText,
      model_description: FileText
    };
    const Icon = icons[type as keyof typeof icons] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const stats = {
    totalItems: contentItems.length,
    pendingItems: contentItems.filter(i => i.status === 'pending').length,
    flaggedItems: contentItems.filter(i => i.status === 'flagged').length,
    highPriorityItems: contentItems.filter(i => i.priority === 'high').length,
    reportedItems: contentItems.filter(i => i.reportCount > 0).length
  };

  const handleApprove = (itemId: number) => {
    console.log("Approved content:", itemId);
    // In real implementation, make API call to approve
  };

  const handleReject = (itemId: number) => {
    console.log("Rejected content:", itemId);
    // In real implementation, make API call to reject
  };

  const handleFlag = (itemId: number) => {
    console.log("Flagged content:", itemId);
    // In real implementation, make API call to flag
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Content Review</h1>
              <p className="text-muted-foreground mt-2">Review and moderate user-generated content</p>
            </div>
            <Button className="bg-primary text-primary-foreground">
              <Filter className="h-4 w-4 mr-2" />
              Bulk Actions
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <CardTitle className="text-sm font-medium">Reported</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.reportedItems}</div>
                <p className="text-xs text-muted-foreground">User reports</p>
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
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="review">Reviews</SelectItem>
                  <SelectItem value="profile">Profiles</SelectItem>
                  <SelectItem value="post">Posts</SelectItem>
                  <SelectItem value="model_description">Model Descriptions</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {contentItems.length} items
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
                        <Badge variant="outline">{item.type.replace('_', ' ')}</Badge>
                        {getPriorityBadge(item.priority)}
                        {getStatusBadge(item.status)}
                        {getSentimentIcon(item.sentiment)}
                        {item.reportCount > 0 && (
                          <Badge variant="destructive">{item.reportCount} reports</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Author:</span> {item.author}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {item.category}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {new Date(item.submittedAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm">{item.content}</p>
                      </div>
                      
                      {item.relatedModel && (
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">Related Model:</span>
                          <Badge variant="outline">{item.relatedModel}</Badge>
                        </div>
                      )}
                      
                      {item.autoFlags.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-orange-600">Auto-detected Issues:</span>
                          <div className="flex flex-wrap gap-1">
                            {item.autoFlags.map((flag, index) => (
                              <Badge key={index} variant="outline" className="text-xs text-orange-600">
                                {flag.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.moderatorNotes && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Moderator Notes:</strong> {item.moderatorNotes}
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
                            <DialogTitle>Review Content</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Author:</label>
                                <p className="text-sm">{item.author}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Type:</label>
                                <p className="text-sm">{item.type.replace('_', ' ')}</p>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Content:</label>
                              <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{item.content}</p>
                            </div>
                            
                            {item.autoFlags.length > 0 && (
                              <div>
                                <label className="text-sm font-medium">Auto-detected Issues:</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.autoFlags.map((flag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {flag.replace('_', ' ')}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <label className="text-sm font-medium">Moderator Notes:</label>
                              <Textarea
                                placeholder="Add your moderation notes..."
                                value={moderatorNotes}
                                onChange={(e) => setModeratorNotes(e.target.value)}
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