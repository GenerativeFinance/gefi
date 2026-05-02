import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "@/components/layout/Layout";
import {
  Search,
  MessageSquare,
  Send,
  Mail,
  Phone,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Reply,
  Forward
} from "lucide-react";

export default function Communications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("messages");

  const messages = [
    {
      id: "MSG-001",
      subject: "Model MOD-2024-015 Compliance Concerns",
      from: "sarah.chen@gefi.com",
      fromName: "Sarah Chen",
      fromRole: "Compliance Officer",
      to: ["developer@fintechinnovations.com"],
      toNames: ["FinTech Innovations Ltd"],
      type: "compliance",
      priority: "high",
      status: "pending-response",
      timestamp: "2025-01-14T10:30:00Z",
      preview: "We've identified potential data usage issues in your recently submitted AI model. Please review the attached compliance report...",
      thread: 3,
      attachments: ["Compliance_Report_MOD-2024-015.pdf"]
    },
    {
      id: "MSG-002",
      subject: "Dataset Privacy Assessment Update",
      from: "data.provider@creditdata.com",
      fromName: "CreditData Solutions",
      fromRole: "Data Provider",
      to: ["regulator@gefi.com"],
      toNames: ["Regulatory Team"],
      type: "data-privacy",
      priority: "medium",
      status: "responded",
      timestamp: "2025-01-13T15:45:00Z",
      preview: "Thank you for the privacy assessment feedback. We have implemented the requested anonymization improvements...",
      thread: 5,
      attachments: ["Updated_Privacy_Measures.docx"]
    },
    {
      id: "MSG-003",
      subject: "GDPR Compliance Query - EU Data Processing",
      from: "legal@quantumcapital.com",
      fromName: "Quantum Capital Partners",
      fromRole: "Developer",
      to: ["legal@gefi.com", "compliance@gefi.com"],
      toNames: ["Legal Team", "Compliance Team"],
      type: "legal",
      priority: "critical",
      status: "escalated",
      timestamp: "2025-01-12T09:15:00Z",
      preview: "We need clarification on GDPR requirements for cross-border data processing in our HFT algorithm...",
      thread: 2,
      attachments: ["GDPR_Query_Details.pdf", "Data_Flow_Diagram.png"]
    },
    {
      id: "MSG-004",
      subject: "Model Documentation Approved",
      from: "david.kim@gefi.com",
      fromName: "David Kim",
      fromRole: "Technical Reviewer",
      to: ["support@smartinvestai.com"],
      toNames: ["Smart Invest AI"],
      type: "approval",
      priority: "low",
      status: "closed",
      timestamp: "2024-12-27T16:20:00Z",
      preview: "Your model documentation has been approved and meets all regulatory requirements. Your model is now eligible for deployment...",
      thread: 1,
      attachments: ["Approval_Certificate.pdf"]
    }
  ];

  const announcements = [
    {
      id: "ANN-001",
      title: "Updated GDPR Compliance Guidelines",
      content: "New guidelines for AI model developers regarding GDPR compliance have been published. All developers must review and acknowledge these updates by January 31, 2025.",
      priority: "high",
      publishedDate: "2025-01-10",
      recipients: "All Platform Users",
      category: "Policy Update"
    },
    {
      id: "ANN-002",
      title: "Scheduled Maintenance - Compliance Portal",
      content: "The compliance portal will undergo scheduled maintenance on January 20, 2025, from 2:00 AM to 6:00 AM UTC. All compliance submissions will be temporarily unavailable.",
      priority: "medium",
      publishedDate: "2025-01-08",
      recipients: "Developers & Data Providers",
      category: "System Maintenance"
    },
    {
      id: "ANN-003",
      title: "New Algorithmic Bias Testing Requirements",
      content: "Effective February 1, 2025, all AI models must undergo enhanced bias testing before approval. Training sessions are available for developers.",
      priority: "critical",
      publishedDate: "2025-01-05",
      recipients: "AI Model Developers",
      category: "Regulatory Change"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending-response":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "responded":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "escalated":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "closed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-500";
      case "high":
        return "bg-orange-500/10 text-orange-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "low":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-muted";
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Communications</h1>
          <p className="text-muted-foreground">
            Manage regulatory communications, announcements, and stakeholder correspondence
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">+18 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Response</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Awaiting replies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">Within 48 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Ongoing conversations</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search messages by subject, sender, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending-response">Pending Response</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Compose Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Compose New Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipient type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="data-provider">Data Provider</SelectItem>
                            <SelectItem value="investor">Investor</SelectItem>
                            <SelectItem value="all-users">All Users</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Message subject" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Write your message..." rows={6} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => setIsComposeDialogOpen(false)}>
                      <Send className="h-4 w-4 mr-1" />
                      Send Message
                    </Button>
                    <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/api/placeholder/40/40`} />
                          <AvatarFallback>{message.fromName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{message.subject}</h3>
                            <Badge className={getStatusColor(message.status)}>
                              {message.status.replace('-', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(message.priority)}>
                              {message.priority.toUpperCase()}
                            </Badge>
                            {message.thread > 1 && (
                              <Badge variant="outline">
                                {message.thread} messages
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            <p><strong>From:</strong> {message.fromName} ({message.fromRole})</p>
                            <p><strong>To:</strong> {message.toNames.join(", ")}</p>
                            <p><strong>Date:</strong> {formatDate(message.timestamp)}</p>
                          </div>
                          <p className="text-sm">{message.preview}</p>
                          {message.attachments.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Attachments:</p>
                              <div className="flex flex-wrap gap-2">
                                {message.attachments.map((attachment, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {attachment}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Public Announcements</h2>
                <p className="text-muted-foreground">Platform-wide announcements and policy updates</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Announcement
              </Button>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{announcement.title}</h3>
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {announcement.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {announcement.category}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3">{announcement.content}</p>
                        <div className="text-sm text-muted-foreground">
                          <p><strong>Published:</strong> {announcement.publishedDate}</p>
                          <p><strong>Recipients:</strong> {announcement.recipients}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Forward className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Notification Center</h3>
              <p className="text-muted-foreground mb-4">
                Real-time notifications and alerts will appear here
              </p>
              <Button variant="outline">
                Configure Notifications
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {filteredMessages.length === 0 && activeTab === "messages" && (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages found</h3>
            <p className="text-muted-foreground mb-4">
              No messages match your current search criteria
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}