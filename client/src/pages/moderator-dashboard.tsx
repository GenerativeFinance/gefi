import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Flag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Users, 
  MessageSquare,
  AlertTriangle,
  Search,
  Filter,
  BarChart3
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";

interface ModeratorStats {
  pendingReviews: number;
  completedToday: number;
  openTickets: number;
  averageReviewTime: number;
  flaggedContent: number;
  escalations: number;
}

interface ContentReview {
  id: number;
  type: 'ai_model' | 'dataset' | 'user_profile' | 'comment';
  title: string;
  submittedBy: string;
  submittedAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_review' | 'flagged';
  description?: string;
  autoFlags?: string[];
  riskScore?: number;
}

interface SupportTicket {
  id: number;
  ticketNumber: string;
  userId: string;
  userName: string;
  category: 'technical' | 'billing' | 'dispute' | 'compliance';
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'waiting_response' | 'escalated';
  description: string;
  createdAt: string;
  lastResponseAt?: string;
  assignedTo?: string;
}

interface UserActivity {
  id: number;
  userId: string;
  userName: string;
  actionType: string;
  description: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high';
  flagged: boolean;
}

export default function ModeratorDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentFilter, setContentFilter] = useState("all");
  const [ticketFilter, setTicketFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ContentReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Mock data - in real implementation, these would come from API calls
  const moderatorStats: ModeratorStats = {
    pendingReviews: 12,
    completedToday: 8,
    openTickets: 15,
    averageReviewTime: 23, // minutes
    flaggedContent: 3,
    escalations: 2
  };

  const contentReviews: ContentReview[] = [
    {
      id: 1,
      type: "ai_model",
      title: "Volatility Shield Risk Model",
      submittedBy: "TechFinance Corp",
      submittedAt: "2025-07-14T09:30:00Z",
      priority: "high",
      status: "pending",
      description: "Advanced risk management model for portfolio protection",
      autoFlags: ["performance_claims_unverified", "licensing_unclear"],
      riskScore: 75
    },
    {
      id: 2,
      type: "dataset",
      title: "European Market Sentiment Data",
      submittedBy: "DataStream Analytics",
      submittedAt: "2025-07-14T08:15:00Z",
      priority: "medium",
      status: "in_review",
      description: "Real-time sentiment analysis dataset for European markets",
      autoFlags: ["data_quality_check_needed"],
      riskScore: 45
    },
    {
      id: 3,
      type: "user_profile",
      title: "Developer Profile Update",
      submittedBy: "Alex Johnson",
      submittedAt: "2025-07-14T07:45:00Z",
      priority: "low",
      status: "flagged",
      description: "Updated profile with new certifications",
      autoFlags: ["suspicious_credential_claims"],
      riskScore: 30
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 1,
      ticketNumber: "MOD-2025-001",
      userId: "github_55703540",
      userName: "Sarah Chen",
      category: "dispute",
      subject: "Model accuracy not as advertised",
      priority: "high",
      status: "in_progress",
      description: "Customer claims the Quantum Risk Predictor model performance is significantly lower than advertised.",
      createdAt: "2025-07-13T14:30:00Z",
      lastResponseAt: "2025-07-14T09:00:00Z",
      assignedTo: "current_moderator"
    },
    {
      id: 2,
      ticketNumber: "MOD-2025-002",
      userId: "google_123456789",
      userName: "Mike Rodriguez",
      category: "technical",
      subject: "Cannot access subscribed dataset",
      priority: "medium",
      status: "open",
      description: "User reports being unable to download the European Market Data after successful subscription.",
      createdAt: "2025-07-14T10:15:00Z"
    }
  ];

  const userActivities: UserActivity[] = [
    {
      id: 1,
      userId: "github_55703540",
      userName: "Alex Johnson",
      actionType: "model_upload",
      description: "Uploaded new AI model: Advanced Portfolio Optimizer",
      timestamp: "2025-07-14T11:30:00Z",
      riskLevel: "medium",
      flagged: false
    },
    {
      id: 2,
      userId: "google_123456789",
      userName: "Sarah Chen",
      actionType: "unusual_trading",
      description: "High-frequency trading pattern detected",
      timestamp: "2025-07-14T10:45:00Z",
      riskLevel: "high",
      flagged: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      in_review: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      flagged: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      waiting_response: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      escalated: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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

  const getRiskBadge = (level: string) => {
    const variants: Record<string, string> = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    
    return <Badge className={variants[level]}>{level} risk</Badge>;
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
    // In real implementation, make API call to flag for admin review
  };

  const handleEscalate = (ticketId: number) => {
    console.log("Escalated ticket:", ticketId);
    // In real implementation, make API call to escalate to admin
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Moderator Overview</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Daily Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderatorStats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">3 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderatorStats.completedToday}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderatorStats.openTickets}</div>
            <p className="text-xs text-muted-foreground">-4.8 days avg response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Review Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderatorStats.averageReviewTime}m</div>
            <p className="text-xs text-muted-foreground">-5m from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderatorStats.flaggedContent}</div>
            <p className="text-xs text-muted-foreground">Needs admin review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderatorStats.escalations}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content Review</TabsTrigger>
          <TabsTrigger value="support">Support Tickets</TabsTrigger>
          <TabsTrigger value="users">User Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Content Review Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Content Moderation Queue</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={contentFilter} onValueChange={setContentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="ai_model">AI Models</SelectItem>
                  <SelectItem value="dataset">Datasets</SelectItem>
                  <SelectItem value="user_profile">User Profiles</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            {contentReviews.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <Badge variant="outline">{item.type.replace('_', ' ')}</Badge>
                        {getPriorityBadge(item.priority)}
                        {getStatusBadge(item.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Submitted by {item.submittedBy} on {new Date(item.submittedAt).toLocaleDateString()}
                      </p>
                      
                      {item.description && (
                        <p className="text-sm">{item.description}</p>
                      )}
                      
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
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
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
                                Flag for Admin
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
        </TabsContent>

        {/* Support Tickets Tab */}
        <TabsContent value="support" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Support Tickets</h2>
            <Select value={ticketFilter} onValueChange={setTicketFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="dispute">Disputes</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {supportTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">#{ticket.ticketNumber}</h3>
                        <Badge variant="outline">{ticket.category}</Badge>
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                      </div>
                      
                      <p className="text-sm font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">{ticket.description}</p>
                      
                      <p className="text-sm text-muted-foreground">
                        By {ticket.userName} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                        {ticket.lastResponseAt && ` • Last response ${new Date(ticket.lastResponseAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Respond
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEscalate(ticket.id)}>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Escalate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* User Monitoring Tab */}
        <TabsContent value="users" className="space-y-4">
          <h2 className="text-xl font-semibold">User Activity Monitoring</h2>
          
          <div className="grid gap-4">
            {userActivities.map((activity) => (
              <Card key={activity.id} className={activity.flagged ? "border-orange-200 dark:border-orange-800" : ""}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{activity.userName}</h3>
                        <Badge variant="outline">{activity.actionType.replace('_', ' ')}</Badge>
                        {getRiskBadge(activity.riskLevel)}
                        {activity.flagged && <Badge variant="destructive">Flagged</Badge>}
                      </div>
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {activity.flagged && (
                        <Button size="sm" variant="outline">
                          <Flag className="h-4 w-4 text-orange-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-semibold">Moderation Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Review Efficiency</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-sm text-muted-foreground">completion rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Response Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">4.2h</div>
                <p className="text-sm text-muted-foreground">average first response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Satisfaction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">4.6/5</div>
                <p className="text-sm text-muted-foreground">rating from users</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </Layout>
  );
}