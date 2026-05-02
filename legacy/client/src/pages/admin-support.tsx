import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageSquare,
  Search,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  Reply,
  ArrowUp,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";

interface SupportTicket {
  id: number;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'technical' | 'billing' | 'dispute' | 'compliance' | 'legal' | 'account' | 'feature_request';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed' | 'escalated';
  assignedTo?: string;
  tags: string[];
  isLegalDispute: boolean;
  disputeAmount?: number;
  createdAt: string;
  updatedAt: string;
  lastResponseAt?: string;
  resolutionNotes?: string;
  escalationLevel: number;
  responseTime?: number; // in hours
  satisfactionRating?: number; // 1-5
}

export default function AdminSupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseText, setResponseText] = useState("");

  // Mock data - in real implementation, these would come from API calls
  const supportTickets: SupportTicket[] = [
    {
      id: 1,
      ticketNumber: "GF-2025-001",
      userId: "github_55703540",
      userName: "Alex Johnson",
      userEmail: "alex.johnson@example.com",
      category: "dispute",
      subject: "Model performance not as advertised",
      description: "I subscribed to the Quantum Risk Predictor model but the actual performance is significantly lower than the advertised 85% accuracy rate. I'm requesting a full refund.",
      priority: "high",
      status: "in_progress",
      assignedTo: "Sarah Wilson",
      tags: ["refund", "performance", "ai_model"],
      isLegalDispute: false,
      disputeAmount: 2999.99,
      createdAt: "2025-07-13T14:30:00Z",
      updatedAt: "2025-07-14T09:00:00Z",
      lastResponseAt: "2025-07-14T09:00:00Z",
      escalationLevel: 1,
      responseTime: 4.5
    },
    {
      id: 2,
      ticketNumber: "GF-2025-002",
      userId: "google_123456789",
      userName: "Sarah Chen",
      userEmail: "sarah.chen@example.com",
      category: "technical",
      subject: "Unable to access subscribed model API",
      description: "I'm getting 403 errors when trying to access the TradingBot Pro API despite having an active subscription. Please help resolve this issue.",
      priority: "medium",
      status: "waiting_response",
      assignedTo: "Mike Rodriguez",
      tags: ["api", "access", "subscription"],
      isLegalDispute: false,
      createdAt: "2025-07-14T10:15:00Z",
      updatedAt: "2025-07-14T12:30:00Z",
      lastResponseAt: "2025-07-14T11:45:00Z",
      escalationLevel: 0,
      responseTime: 1.5
    },
    {
      id: 3,
      ticketNumber: "GF-2025-003",
      userId: "linkedin_987654321",
      userName: "David Lee",
      userEmail: "david.lee@example.com",
      category: "legal",
      subject: "GDPR Data Deletion Request",
      description: "Under GDPR Article 17, I request the complete deletion of all my personal data from your platform. Please confirm when this has been completed.",
      priority: "critical",
      status: "escalated",
      assignedTo: "Legal Team",
      tags: ["gdpr", "privacy", "deletion"],
      isLegalDispute: true,
      createdAt: "2025-07-12T16:20:00Z",
      updatedAt: "2025-07-14T08:15:00Z",
      escalationLevel: 2,
      responseTime: 8.2
    },
    {
      id: 4,
      ticketNumber: "GF-2025-004",
      userId: "github_111222333",
      userName: "Emma Wilson",
      userEmail: "emma.wilson@example.com",
      category: "billing",
      subject: "Incorrect charge on credit card",
      description: "I was charged $199 for a premium subscription but I only signed up for the basic plan at $99. Please refund the difference.",
      priority: "medium",
      status: "resolved",
      assignedTo: "Billing Team",
      tags: ["billing", "refund", "overcharge"],
      isLegalDispute: false,
      disputeAmount: 100.00,
      createdAt: "2025-07-11T09:45:00Z",
      updatedAt: "2025-07-13T15:30:00Z",
      lastResponseAt: "2025-07-13T15:30:00Z",
      resolutionNotes: "Refunded $100 difference. Billing error corrected in system.",
      escalationLevel: 0,
      responseTime: 2.1,
      satisfactionRating: 5
    },
    {
      id: 5,
      ticketNumber: "GF-2025-005",
      userId: "google_444555666",
      userName: "John Smith",
      userEmail: "john.smith@example.com",
      category: "feature_request",
      subject: "Request for mobile app",
      description: "Please consider developing a mobile app for iOS and Android. It would be much more convenient to monitor portfolios on the go.",
      priority: "low",
      status: "open",
      tags: ["feature", "mobile", "app"],
      isLegalDispute: false,
      createdAt: "2025-07-14T13:20:00Z",
      updatedAt: "2025-07-14T13:20:00Z",
      escalationLevel: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      waiting_response: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      escalated: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return <Badge className={variants[status] || variants.open}>{status.replace('_', ' ')}</Badge>;
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

  const getCategoryIcon = (category: string) => {
    const icons = {
      technical: FileText,
      billing: DollarSign,
      dispute: AlertTriangle,
      compliance: CheckCircle,
      legal: FileText,
      account: User,
      feature_request: MessageSquare
    };
    const Icon = icons[category as keyof typeof icons] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = searchTerm === "" || 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const stats = {
    totalTickets: supportTickets.length,
    openTickets: supportTickets.filter(t => t.status === 'open').length,
    inProgressTickets: supportTickets.filter(t => t.status === 'in_progress').length,
    escalatedTickets: supportTickets.filter(t => t.status === 'escalated').length,
    legalDisputes: supportTickets.filter(t => t.isLegalDispute).length,
    avgResponseTime: "3.2 hours",
    avgSatisfaction: 4.2
  };

  const handleAssignTicket = (ticketId: number, assignee: string) => {
    console.log("Assigning ticket", ticketId, "to", assignee);
    // In real implementation, make API call to assign ticket
  };

  const handleEscalateTicket = (ticketId: number) => {
    console.log("Escalating ticket:", ticketId);
    // In real implementation, make API call to escalate
  };

  const handleResolveTicket = (ticketId: number) => {
    console.log("Resolving ticket:", ticketId);
    // In real implementation, make API call to resolve
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Support & Litigation</h1>
              <p className="text-muted-foreground mt-2">Manage customer support tickets and legal disputes</p>
            </div>
            <Button className="bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTickets}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.openTickets}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.inProgressTickets}</div>
                <p className="text-xs text-muted-foreground">Being worked on</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escalated</CardTitle>
                <ArrowUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.escalatedTickets}</div>
                <p className="text-xs text-muted-foreground">Need manager</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Legal Disputes</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.legalDisputes}</div>
                <p className="text-xs text-muted-foreground">Legal review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">Average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.avgSatisfaction}/5</div>
                <p className="text-xs text-muted-foreground">Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="dispute">Dispute</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="waiting_response">Waiting Response</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
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
              Showing {filteredTickets.length} of {supportTickets.length} tickets
            </div>
          </div>

          {/* Support Tickets */}
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className={`hover:shadow-md transition-shadow ${ticket.isLegalDispute ? 'border-red-200 dark:border-red-800' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(ticket.category)}
                        <h3 className="font-medium text-lg">#{ticket.ticketNumber}</h3>
                        <Badge variant="outline">{ticket.category.replace('_', ' ')}</Badge>
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                        {ticket.isLegalDispute && (
                          <Badge variant="destructive">Legal Dispute</Badge>
                        )}
                        {ticket.escalationLevel > 0 && (
                          <Badge variant="outline">Level {ticket.escalationLevel}</Badge>
                        )}
                      </div>
                      
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <p className="text-sm text-muted-foreground">{ticket.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Customer:</span>
                          <span>{ticket.userName}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Email:</span>
                          <span className="text-xs">{ticket.userEmail}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Created:</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {ticket.responseTime && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Response:</span>
                            <span>{ticket.responseTime}h</span>
                          </div>
                        )}
                      </div>
                      
                      {ticket.assignedTo && (
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">Assigned to:</span>
                          <Badge variant="outline">{ticket.assignedTo}</Badge>
                        </div>
                      )}
                      
                      {ticket.disputeAmount && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <DollarSign className="h-4 w-4 inline mr-1" />
                            <strong>Dispute Amount:</strong> ${ticket.disputeAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      {ticket.resolutionNotes && (
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            <strong>Resolution:</strong> {ticket.resolutionNotes}
                          </p>
                        </div>
                      )}
                      
                      {ticket.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ticket.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedTicket(ticket)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Ticket #{ticket.ticketNumber} - {ticket.subject}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Customer:</label>
                                <p className="text-sm">{ticket.userName} ({ticket.userEmail})</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Category:</label>
                                <p className="text-sm">{ticket.category}</p>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Description:</label>
                              <p className="text-sm mt-1">{ticket.description}</p>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Response:</label>
                              <Textarea
                                placeholder="Type your response..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                className="mt-1"
                                rows={4}
                              />
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => handleEscalateTicket(ticket.id)}>
                                <ArrowUp className="h-4 w-4 mr-2" />
                                Escalate
                              </Button>
                              <Button variant="outline">
                                <Reply className="h-4 w-4 mr-2" />
                                Send Response
                              </Button>
                              <Button onClick={() => handleResolveTicket(ticket.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Resolve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={ticket.status === 'resolved' || ticket.status === 'closed'}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Respond
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEscalateTicket(ticket.id)}
                        disabled={ticket.status === 'escalated' || ticket.status === 'resolved'}
                      >
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Escalate
                      </Button>
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