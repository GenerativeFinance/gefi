import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { 
  HelpCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Search,
  Filter,
  Plus,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  BarChart3,
  Zap,
  Star,
  Calendar,
  TrendingUp,
  Users,
  Target,
  Activity,
  Settings,
  Send,
  Paperclip,
  ChevronRight,
  ExternalLink,
  Download
} from "lucide-react";

export default function SupportDashboard() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Support statistics
  const supportStats = {
    totalTickets: 1247,
    openTickets: 89,
    avgResponseTime: "2.3 hours",
    satisfactionRate: 94.7,
    resolvedToday: 23,
    pendingEscalation: 5
  };

  // Support tickets data
  const supportTickets = [
    {
      id: "T-2025-001",
      title: "Unable to access AI Model subscription",
      user: "John Smith",
      email: "john@example.com",
      priority: "high",
      status: "open",
      category: "subscription",
      created: "2 hours ago",
      lastUpdate: "30 min ago",
      assignee: "Sarah Chen",
      description: "User reports that after purchasing a subscription to the Risk Assessment Model, they cannot access the model API endpoints.",
      messages: 3
    },
    {
      id: "T-2025-002",
      title: "Portfolio sync error with external wallet",
      user: "Maria Garcia",
      email: "maria@company.com",
      priority: "medium",
      status: "in-progress",
      category: "technical",
      created: "4 hours ago",
      lastUpdate: "1 hour ago",
      assignee: "Mike Johnson",
      description: "Web3 wallet connection shows incorrect portfolio balances. User has tried reconnecting multiple times.",
      messages: 5
    },
    {
      id: "T-2025-003",
      title: "Data export functionality not working",
      user: "David Wilson",
      email: "david@startup.io",
      priority: "low",
      status: "resolved",
      category: "feature",
      created: "1 day ago",
      lastUpdate: "2 hours ago",
      assignee: "Lisa Park",
      description: "CSV export button for portfolio data returns empty file. Issue has been resolved with server update.",
      messages: 7
    },
    {
      id: "T-2025-004",
      title: "Billing discrepancy for enterprise plan",
      user: "Robert Brown",
      email: "robert@enterprise.com",
      priority: "high",
      status: "escalated",
      category: "billing",
      created: "6 hours ago",
      lastUpdate: "3 hours ago",
      assignee: "Admin Team",
      description: "Enterprise customer reports being charged twice for monthly subscription. Requires immediate attention.",
      messages: 4
    },
    {
      id: "T-2025-005",
      title: "Feature request: Dark mode for mobile app",
      user: "Emma Davis",
      email: "emma@design.co",
      priority: "low",
      status: "open",
      category: "feature-request",
      created: "1 day ago",
      lastUpdate: "8 hours ago",
      assignee: "UI Team",
      description: "User requests dark mode support for mobile application to match desktop experience.",
      messages: 2
    }
  ];

  // FAQ categories and items
  const faqCategories = [
    {
      name: "Getting Started",
      items: [
        { question: "How do I create an account?", views: 1250, updated: "2 days ago" },
        { question: "What subscription plans are available?", views: 890, updated: "1 week ago" },
        { question: "How to connect my wallet?", views: 745, updated: "3 days ago" }
      ]
    },
    {
      name: "AI Models",
      items: [
        { question: "How do I subscribe to AI models?", views: 623, updated: "1 day ago" },
        { question: "What is model accuracy scoring?", views: 445, updated: "5 days ago" },
        { question: "How to integrate AI models via API?", views: 312, updated: "1 week ago" }
      ]
    },
    {
      name: "Billing & Payments",
      items: [
        { question: "How to update payment method?", views: 567, updated: "3 days ago" },
        { question: "Subscription cancellation policy", views: 423, updated: "1 week ago" },
        { question: "Enterprise billing options", views: 234, updated: "2 weeks ago" }
      ]
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-blue-500";
      case "in-progress": return "bg-orange-500";
      case "resolved": return "bg-green-500";
      case "escalated": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Support Dashboard</h1>
          <p className="text-muted-foreground">
            Manage customer support tickets, knowledge base, and user assistance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                  <p className="text-2xl font-bold">{supportStats.totalTickets.toLocaleString()}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                  <p className="text-2xl font-bold">{supportStats.openTickets}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">{supportStats.avgResponseTime}</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold">{supportStats.satisfactionRate}%</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold">{supportStats.resolvedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Escalated</p>
                  <p className="text-2xl font-bold">{supportStats.pendingEscalation}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tickets List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Support Tickets</CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Ticket
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Support Ticket</DialogTitle>
                            <DialogDescription>
                              Create a new support ticket for user assistance
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input placeholder="User email" />
                            <Input placeholder="Ticket subject" />
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="billing">Billing</SelectItem>
                                <SelectItem value="subscription">Subscription</SelectItem>
                                <SelectItem value="feature">Feature Request</SelectItem>
                              </SelectContent>
                            </Select>
                            <Textarea placeholder="Ticket description" rows={4} />
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Cancel</Button>
                              <Button>Create Ticket</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {/* Search and Filter */}
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          placeholder="Search tickets..." 
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="escalated">Escalated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTickets.map((ticket) => (
                        <div 
                          key={ticket.id}
                          className={`p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                            selectedTicket?.id === ticket.id ? 'border-primary bg-accent' : ''
                          }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {ticket.id}
                                </Badge>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`} />
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs text-white ${getStatusColor(ticket.status)}`}
                                >
                                  {ticket.status}
                                </Badge>
                              </div>
                              <h4 className="font-semibold mb-1">{ticket.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {ticket.user} • {ticket.email}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>Created {ticket.created}</span>
                                <span>Updated {ticket.lastUpdate}</span>
                                <span className="flex items-center">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  {ticket.messages}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ticket Details */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedTicket ? 'Ticket Details' : 'Select a Ticket'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTicket ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{selectedTicket.id}</Badge>
                            <Badge className={`text-white ${getStatusColor(selectedTicket.status)}`}>
                              {selectedTicket.status}
                            </Badge>
                          </div>
                          <h3 className="font-semibold mb-2">{selectedTicket.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {selectedTicket.description}
                          </p>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">User Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Name:</span> {selectedTicket.user}</p>
                            <p><span className="font-medium">Email:</span> {selectedTicket.email}</p>
                            <p><span className="font-medium">Category:</span> {selectedTicket.category}</p>
                            <p><span className="font-medium">Assignee:</span> {selectedTicket.assignee}</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">Quick Actions</h4>
                          <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Reply to User
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              <Phone className="h-4 w-4 mr-2" />
                              Schedule Call
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Escalate Ticket
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Resolved
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Select a ticket to view details and take actions
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>FAQ Categories</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add FAQ
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {faqCategories.map((category, index) => (
                      <div key={index}>
                        <h4 className="font-semibold mb-3">{category.name}</h4>
                        <div className="space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.question}</p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                  <span className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {item.views} views
                                  </span>
                                  <span>Updated {item.updated}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Articles</span>
                      <span className="text-2xl font-bold">247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Views</span>
                      <span className="text-2xl font-bold">12.4K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg Helpfulness</span>
                      <span className="text-2xl font-bold">4.6/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Articles Updated</span>
                      <span className="text-2xl font-bold">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Support Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Resolution Rate</span>
                        <span className="text-sm text-muted-foreground">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">First Response Rate</span>
                        <span className="text-sm text-muted-foreground">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Customer Satisfaction</span>
                        <span className="text-sm text-muted-foreground">94.7%</span>
                      </div>
                      <Progress value={94.7} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">SLA Compliance</span>
                        <span className="text-sm text-muted-foreground">96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ticket Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technical Issues</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Billing & Payments</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Subscriptions</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">18%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Feature Requests</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '9%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">9%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Support Settings</CardTitle>
                <CardDescription>
                  Configure support system preferences and automation rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Auto-Assignment Rules</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">High Priority Tickets</p>
                          <p className="text-sm text-muted-foreground">Auto-assign to senior support team</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Billing Issues</p>
                          <p className="text-sm text-muted-foreground">Route to billing specialist</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Notification Settings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">New Ticket Alerts</p>
                          <p className="text-sm text-muted-foreground">Email + Slack notifications</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Escalation Alerts</p>
                          <p className="text-sm text-muted-foreground">Immediate manager notification</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}