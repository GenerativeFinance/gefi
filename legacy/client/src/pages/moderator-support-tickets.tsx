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
  User,
  Mail,
  Phone,
  Eye,
  Reply,
  ArrowUp,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Activity
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";

interface ModeratorTicket {
  id: number;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'content_dispute' | 'account_restriction' | 'technical_support' | 'policy_violation' | 'user_report' | 'general_inquiry';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'escalated';
  assignedTo?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastResponseAt?: string;
  resolutionNotes?: string;
  responseTime?: number; // in hours
  userSatisfaction?: number; // 1-5
  isEscalated: boolean;
  relatedContent?: string;
  actionTaken?: string;
}

export default function ModeratorSupportTickets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<ModeratorTicket | null>(null);
  const [responseText, setResponseText] = useState("");

  // Mock data - in real implementation, these would come from API calls
  const moderatorTickets: ModeratorTicket[] = [
    {
      id: 1,
      ticketNumber: "MOD-2025-001",
      userId: "user_123",
      userName: "John Developer",
      userEmail: "john.dev@example.com",
      category: "content_dispute",
      subject: "My AI model review was unfairly rejected",
      description: "My model 'CryptoPredictor Pro' was rejected without proper explanation. I believe the review process was biased and request a re-evaluation.",
      priority: "high",
      status: "in_progress",
      assignedTo: "ModeratorTeam",
      tags: ["model_review", "dispute", "re_evaluation"],
      createdAt: "2025-07-14T10:30:00Z",
      updatedAt: "2025-07-14T13:45:00Z",
      lastResponseAt: "2025-07-14T12:15:00Z",
      responseTime: 2.5,
      isEscalated: false,
      relatedContent: "AI Model: CryptoPredictor Pro",
      actionTaken: "Under review by senior moderator"
    },
    {
      id: 2,
      ticketNumber: "MOD-2025-002",
      userId: "user_456",
      userName: "Sarah Investor",
      userEmail: "sarah.invest@example.com",
      category: "account_restriction",
      subject: "Account suspended without warning",
      description: "My account was suddenly suspended and I cannot access my subscribed AI models. I haven't violated any terms of service.",
      priority: "urgent",
      status: "escalated",
      assignedTo: "Senior Moderator",
      tags: ["suspension", "account_access", "urgent"],
      createdAt: "2025-07-14T09:15:00Z",
      updatedAt: "2025-07-14T14:20:00Z",
      lastResponseAt: "2025-07-14T11:30:00Z",
      responseTime: 1.8,
      isEscalated: true,
      relatedContent: "Account ID: user_456",
      actionTaken: "Escalated to admin team for review"
    },
    {
      id: 3,
      ticketNumber: "MOD-2025-003",
      userId: "user_789",
      userName: "Mike Trader",
      userEmail: "mike.trade@example.com",
      category: "user_report",
      subject: "Reporting inappropriate behavior in community",
      description: "User 'CryptoKing99' has been posting spam and harassment messages in the community forums. Multiple users are complaining.",
      priority: "medium",
      status: "open",
      tags: ["harassment", "spam", "community"],
      createdAt: "2025-07-14T08:45:00Z",
      updatedAt: "2025-07-14T08:45:00Z",
      responseTime: 5.2,
      isEscalated: false,
      relatedContent: "Reported User: CryptoKing99",
      actionTaken: "Pending investigation"
    },
    {
      id: 4,
      ticketNumber: "MOD-2025-004",
      userId: "user_321",
      userName: "Emma Analyst",
      userEmail: "emma.analyst@example.com",
      category: "policy_violation",
      subject: "Question about data usage policy",
      description: "I want to understand the data usage policy for my AI model. Can I use external datasets and what are the licensing requirements?",
      priority: "low",
      status: "resolved",
      assignedTo: "PolicyTeam",
      tags: ["policy", "data_usage", "licensing"],
      createdAt: "2025-07-13T16:20:00Z",
      updatedAt: "2025-07-14T09:30:00Z",
      lastResponseAt: "2025-07-14T09:30:00Z",
      resolutionNotes: "Provided comprehensive policy documentation and guidelines",
      responseTime: 1.2,
      userSatisfaction: 5,
      isEscalated: false,
      relatedContent: "Data Usage Policy",
      actionTaken: "Policy clarification provided"
    },
    {
      id: 5,
      ticketNumber: "MOD-2025-005",
      userId: "user_654",
      userName: "Alex Researcher",
      userEmail: "alex.research@example.com",
      category: "technical_support",
      subject: "Unable to upload model documentation",
      description: "I'm trying to upload documentation for my AI model but keep getting error messages. The upload fails every time.",
      priority: "medium",
      status: "waiting_response",
      assignedTo: "TechSupport",
      tags: ["upload", "documentation", "technical"],
      createdAt: "2025-07-14T11:10:00Z",
      updatedAt: "2025-07-14T12:45:00Z",
      lastResponseAt: "2025-07-14T12:45:00Z",
      responseTime: 3.1,
      isEscalated: false,
      relatedContent: "Model: ResearchAI v2.0",
      actionTaken: "Technical troubleshooting in progress"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      waiting_response: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      escalated: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return <Badge className={variants[status] || variants.open}>{status.replace('_', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return <Badge className={variants[priority]}>{priority}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      content_dispute: FileText,
      account_restriction: User,
      technical_support: Activity,
      policy_violation: AlertTriangle,
      user_report: MessageSquare,
      general_inquiry: Mail
    };
    const Icon = icons[category as keyof typeof icons] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  const filteredTickets = moderatorTickets.filter(ticket => {
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
    totalTickets: moderatorTickets.length,
    openTickets: moderatorTickets.filter(t => t.status === 'open').length,
    inProgressTickets: moderatorTickets.filter(t => t.status === 'in_progress').length,
    escalatedTickets: moderatorTickets.filter(t => t.status === 'escalated').length,
    urgentTickets: moderatorTickets.filter(t => t.priority === 'urgent').length,
    avgResponseTime: "2.6 hours"
  };

  const handleRespondToTicket = (ticketId: number) => {
    console.log("Responding to ticket:", ticketId);
    // In real implementation, make API call to respond
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
              <h1 className="text-3xl font-bold">Support Tickets</h1>
              <p className="text-muted-foreground mt-2">Manage moderator support requests and user issues</p>
            </div>
            <Button className="bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                <p className="text-xs text-muted-foreground">Need admin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.urgentTickets}</div>
                <p className="text-xs text-muted-foreground">High priority</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">Response time</p>
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="content_dispute">Content Dispute</SelectItem>
                  <SelectItem value="account_restriction">Account Restriction</SelectItem>
                  <SelectItem value="technical_support">Technical Support</SelectItem>
                  <SelectItem value="policy_violation">Policy Violation</SelectItem>
                  <SelectItem value="user_report">User Report</SelectItem>
                  <SelectItem value="general_inquiry">General Inquiry</SelectItem>
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
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredTickets.length} of {moderatorTickets.length} tickets
            </div>
          </div>

          {/* Support Tickets */}
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className={`hover:shadow-md transition-shadow ${ticket.isEscalated ? 'border-red-200 dark:border-red-800' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(ticket.category)}
                        <h3 className="font-medium text-lg">#{ticket.ticketNumber}</h3>
                        <Badge variant="outline">{ticket.category.replace('_', ' ')}</Badge>
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                        {ticket.isEscalated && (
                          <Badge variant="destructive">Escalated</Badge>
                        )}
                      </div>
                      
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <p className="text-sm text-muted-foreground">{ticket.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">User:</span>
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
                      
                      {ticket.relatedContent && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Related:</strong> {ticket.relatedContent}
                          </p>
                        </div>
                      )}
                      
                      {ticket.actionTaken && (
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            <strong>Action Taken:</strong> {ticket.actionTaken}
                          </p>
                        </div>
                      )}
                      
                      {ticket.resolutionNotes && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                          <p className="text-sm text-gray-800 dark:text-gray-200">
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
                                <label className="text-sm font-medium">User:</label>
                                <p className="text-sm">{ticket.userName} ({ticket.userEmail})</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Category:</label>
                                <p className="text-sm">{ticket.category.replace('_', ' ')}</p>
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
                              <Button variant="outline" onClick={() => handleRespondToTicket(ticket.id)}>
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
                        onClick={() => handleRespondToTicket(ticket.id)}
                        disabled={ticket.status === 'resolved'}
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