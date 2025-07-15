import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import {
  Users,
  MessageSquare,
  Handshake,
  Shield,
  FileText,
  Calendar,
  Globe,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Send,
  Eye,
  Download,
  Settings,
  Activity,
  Target,
  Zap
} from "lucide-react";

export default function DataProviderCollaboration() {
  const [isPartnershipDialogOpen, setIsPartnershipDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  // Sample partnerships data
  const partnerships = [
    {
      id: 1,
      partner: "QuantAI Labs",
      type: "AI Developer",
      status: "Active",
      startDate: "2023-11-15",
      projects: 3,
      revenue: "$45,230",
      contactPerson: "Dr. Sarah Chen",
      email: "sarah.chen@quantai.com",
      specialization: "Risk Management AI",
      location: "San Francisco, CA",
      rating: 4.8,
      complianceLevel: "SOC 2, ISO 27001",
      lastActivity: "2024-01-15"
    },
    {
      id: 2,
      partner: "Financial Conduct Authority",
      type: "Regulator",
      status: "Active",
      startDate: "2024-01-01",
      projects: 1,
      revenue: "$0",
      contactPerson: "James Morrison",
      email: "j.morrison@fca.org.uk",
      specialization: "Financial Regulation",
      location: "London, UK",
      rating: 4.9,
      complianceLevel: "Full Regulatory Authority",
      lastActivity: "2024-01-14"
    },
    {
      id: 3,
      partner: "Institutional Investor Corp",
      type: "Investor",
      status: "Pending",
      startDate: "2024-01-10",
      projects: 0,
      revenue: "$0",
      contactPerson: "Michael Rodriguez",
      email: "m.rodriguez@instinvest.com",
      specialization: "Portfolio Management",
      location: "New York, NY",
      rating: 4.6,
      complianceLevel: "FINRA, SEC",
      lastActivity: "2024-01-12"
    }
  ];

  const communications = [
    {
      id: 1,
      type: "Message",
      from: "Dr. Sarah Chen",
      organization: "QuantAI Labs",
      subject: "Dataset Integration for Risk Model v2.1",
      preview: "Hi, we're looking to integrate your S&P 500 historical data into our new risk assessment model...",
      timestamp: "2024-01-15 14:30",
      status: "Unread",
      priority: "High"
    },
    {
      id: 2,
      type: "Compliance Update",
      from: "James Morrison",
      organization: "Financial Conduct Authority",
      subject: "GDPR Compliance Review - Q1 2024",
      preview: "This is a quarterly review of your data processing practices under GDPR regulations...",
      timestamp: "2024-01-14 09:15",
      status: "Read",
      priority: "Medium"
    },
    {
      id: 3,
      type: "Partnership Request",
      from: "Michael Rodriguez",
      organization: "Institutional Investor Corp",
      subject: "Data Partnership Proposal",
      preview: "We're interested in establishing a data partnership for our ESG investment strategies...",
      timestamp: "2024-01-12 16:45",
      status: "Read",
      priority: "High"
    },
    {
      id: 4,
      type: "Technical Support",
      from: "Alex Kumar",
      organization: "CryptoInsight AI",
      subject: "API Rate Limiting Issues",
      preview: "We're experiencing some rate limiting issues with the crypto order book API endpoint...",
      timestamp: "2024-01-11 11:20",
      status: "Responded",
      priority: "Low"
    }
  ];

  const regulatoryUpdates = [
    {
      id: 1,
      title: "GDPR Data Processing Amendment",
      regulator: "European Commission",
      effectiveDate: "2024-03-01",
      impact: "High",
      description: "New requirements for data subject consent in AI model training datasets.",
      status: "Review Required",
      deadline: "2024-02-15"
    },
    {
      id: 2,
      title: "AI Model Transparency Guidelines",
      regulator: "Financial Conduct Authority",
      effectiveDate: "2024-04-15",
      impact: "Medium",
      description: "Enhanced disclosure requirements for AI models used in financial services.",
      status: "Compliant",
      deadline: "2024-04-01"
    },
    {
      id: 3,
      title: "Data Localization Requirements",
      regulator: "Securities and Exchange Commission",
      effectiveDate: "2024-06-01",
      impact: "High",
      description: "New requirements for data storage location for US financial institutions.",
      status: "Action Required",
      deadline: "2024-05-15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMessageStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "unread": return "bg-blue-100 text-blue-800";
      case "read": return "bg-gray-100 text-gray-800";
      case "responded": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Collaboration Platforms & Compliance Tools</h1>
            <p className="text-muted-foreground">
              Shared workspaces, messaging systems, version control, and automated compliance tools for seamless stakeholder collaboration
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quantai">Dr. Sarah Chen - QuantAI Labs</SelectItem>
                          <SelectItem value="fca">James Morrison - FCA</SelectItem>
                          <SelectItem value="investor">Michael Rodriguez - Institutional Investor</SelectItem>
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
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Enter message subject" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Enter your message..." rows={6} />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setIsMessageDialogOpen(false)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isPartnershipDialogOpen} onOpenChange={setIsPartnershipDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Partnership
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Initiate New Partnership</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="partner-name">Partner Name</Label>
                      <Input id="partner-name" placeholder="Enter partner organization" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partner-type">Partner Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="developer">AI Developer</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="regulator">Regulator</SelectItem>
                          <SelectItem value="data-provider">Data Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Input id="contact-person" placeholder="Primary contact name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proposal">Partnership Proposal</Label>
                    <Textarea id="proposal" placeholder="Describe the partnership opportunity..." rows={4} />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setIsPartnershipDialogOpen(false)}>
                    Send Proposal
                  </Button>
                  <Button variant="outline" onClick={() => setIsPartnershipDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Collaboration Tools Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shared Workspaces</p>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-blue-600">Git-like version control</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Message Threads</p>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-green-600">Real-time messaging</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p className="text-2xl font-bold">96%</p>
                  <p className="text-xs text-purple-600">Auto-compliance checks</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Audit Trails</p>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-xs text-orange-600">Complete documentation</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Collaboration Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Shared Workspaces
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Dataset Collaboration</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Model Development</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Funding Opportunities</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <Button size="sm" className="w-full">
                <Building className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication Systems
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Real-time Messaging</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Video Conferencing</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Document Sharing</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <Button size="sm" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Start Conversation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Version Control Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Git-like Dataset Control</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Branch Management</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Merge Requests</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <Button size="sm" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Manage Versions
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="partnerships" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Tools</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="partnerships" className="space-y-6">
            <div className="space-y-4">
              {partnerships.map((partnership) => (
                <Card key={partnership.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {partnership.type === "AI Developer" && <Users className="h-6 w-6 text-blue-600" />}
                          {partnership.type === "Regulator" && <Shield className="h-6 w-6 text-purple-600" />}
                          {partnership.type === "Investor" && <Building className="h-6 w-6 text-green-600" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{partnership.partner}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{partnership.type}</span>
                            <span>•</span>
                            <span>Since {partnership.startDate}</span>
                            <span>•</span>
                            <span>{partnership.projects} projects</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(partnership.status)}>
                        {partnership.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{partnership.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{partnership.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{partnership.location}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{partnership.rating}/5 Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{partnership.specialization}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Last: {partnership.lastActivity}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Revenue Generated</p>
                          <p className="text-lg font-semibold text-green-600">{partnership.revenue}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">{partnership.complianceLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Contracts
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <div className="space-y-4">
              {communications.map((communication) => (
                <Card key={communication.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-blue-500 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold">{communication.subject}</h3>
                            <Badge className={getPriorityColor(communication.priority)}>
                              {communication.priority}
                            </Badge>
                            <Badge className={getMessageStatusColor(communication.status)}>
                              {communication.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span>From: {communication.from}</span>
                            <span>•</span>
                            <span>{communication.organization}</span>
                            <span>•</span>
                            <span>{communication.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{communication.preview}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Read
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Automated Compliance Checks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">GDPR Compliance</h3>
                      <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">All datasets comply with GDPR data protection requirements</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">SOC 2 Type II</h3>
                      <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Security controls meet industry standards</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-semibold">ISO 27001</h3>
                      <Badge className="bg-yellow-100 text-yellow-800">⏳ In Progress</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Certification renewal in progress</p>
                  </div>
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Run Compliance Scan
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Audit Trails & Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Data Access Logs</p>
                        <p className="text-sm text-muted-foreground">Complete access history</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">100% Coverage</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Change Management</p>
                        <p className="text-sm text-muted-foreground">All modifications tracked</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Automated</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Compliance Reports</p>
                        <p className="text-sm text-muted-foreground">Quarterly assessments</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Audit Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Legal Standards Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Legal & Industry Standards Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">Data Protection</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>GDPR Compliance</span>
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>CCPA Compliance</span>
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Encryption</span>
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">Financial Regulations</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>SEC Requirements</span>
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>MiFID II</span>
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Basel III</span>
                        <Badge className="bg-yellow-100 text-yellow-800">⏳</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-purple-500" />
                      <h3 className="font-semibold">AI/ML Standards</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>AI Ethics Framework</span>
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Model Transparency</span>
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Bias Testing</span>
                        <Badge className="bg-green-100 text-green-800">✓</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regulatory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Updates & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regulatoryUpdates.map((update) => (
                    <div key={update.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{update.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {update.regulator} • Effective: {update.effectiveDate}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getImpactColor(update.impact)}>
                            {update.impact} Impact
                          </Badge>
                          <Badge className={
                            update.status === "Compliant" ? "bg-green-100 text-green-800" :
                            update.status === "Review Required" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }>
                            {update.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{update.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Deadline: {update.deadline}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Documentation
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Collaboration Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Risk Assessment Model Integration</h3>
                        <p className="text-sm text-muted-foreground">With QuantAI Labs • Started Dec 2023</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Integrating S&P 500 historical data and economic indicators into advanced risk assessment AI model.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Progress: </span>
                        <span className="font-semibold">75%</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Project</Button>
                        <Button variant="outline" size="sm">Documents</Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">GDPR Compliance Audit</h3>
                        <p className="text-sm text-muted-foreground">With Financial Conduct Authority • Started Jan 2024</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">In Review</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Quarterly review of data processing practices and compliance with GDPR regulations.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Progress: </span>
                        <span className="font-semibold">90%</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Project</Button>
                        <Button variant="outline" size="sm">Documents</Button>
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