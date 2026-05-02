import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserPlus,
  Send,
  Check,
  X,
  Clock,
  Mail,
  Calendar,
  Building,
  Star,
  Eye,
  MessageCircle,
  Search,
  Filter,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight,
  FileText,
  Globe,
  Award,
  Target,
  Code,
  Database,
  TrendingUp,
  Shield
} from "lucide-react";

export default function DeveloperCollaborationInvitations() {
  const receivedInvitations = [
    {
      id: 1,
      from: "Quantum Capital Partners",
      fromAvatar: "/api/placeholder/48/48",
      project: "High-Frequency Trading Algorithm",
      role: "Senior AI Developer",
      description: "Join our team to develop a cutting-edge HFT algorithm using machine learning for market prediction",
      budget: "$150,000",
      duration: "6 months",
      skills: ["Python", "TensorFlow", "Algorithmic Trading", "Real-time Processing"],
      deadline: "July 25, 2025",
      receivedDate: "July 10, 2025",
      status: "pending",
      priority: "high",
      companyRating: 4.8,
      teamSize: 8,
      projectType: "Trading Algorithms"
    },
    {
      id: 2,
      from: "Green Capital Fund",
      fromAvatar: "/api/placeholder/48/48",
      project: "ESG Investment Analytics Platform",
      role: "Full Stack Developer",
      description: "Build a comprehensive ESG analytics platform for sustainable investment decision making",
      budget: "$95,000",
      duration: "4 months",
      skills: ["React", "Node.js", "PostgreSQL", "Data Visualization"],
      deadline: "August 5, 2025",
      receivedDate: "July 8, 2025",
      status: "pending",
      priority: "medium",
      companyRating: 4.5,
      teamSize: 6,
      projectType: "ESG Analytics"
    },
    {
      id: 3,
      from: "CryptoTech Solutions",
      fromAvatar: "/api/placeholder/48/48",
      project: "DeFi Yield Optimization Engine",
      role: "Blockchain Developer",
      description: "Develop smart contracts and optimization algorithms for maximizing DeFi yields",
      budget: "$120,000",
      duration: "5 months",
      skills: ["Solidity", "Web3", "Smart Contracts", "DeFi Protocols"],
      deadline: "July 30, 2025",
      receivedDate: "July 5, 2025",
      status: "accepted",
      priority: "high",
      companyRating: 4.9,
      teamSize: 10,
      projectType: "Cryptocurrency"
    }
  ];

  const sentInvitations = [
    {
      id: 1,
      to: "Sarah Chen",
      toAvatar: "/api/placeholder/48/48",
      project: "Portfolio Risk Assessment Model",
      role: "Data Scientist",
      description: "Looking for an experienced data scientist to help develop advanced risk models",
      budget: "$80,000",
      duration: "4 months",
      sentDate: "July 12, 2025",
      status: "pending",
      responseDeadline: "July 20, 2025",
      skills: ["Python", "Statistics", "Risk Modeling", "Monte Carlo"],
      projectType: "Risk Management"
    },
    {
      id: 2,
      to: "Mike Johnson",
      toAvatar: "/api/placeholder/48/48",
      project: "Real-time Market Data Pipeline",
      role: "Backend Engineer",
      description: "Need a backend specialist for building high-performance data processing pipelines",
      budget: "$70,000",
      duration: "3 months",
      sentDate: "July 9, 2025",
      status: "declined",
      responseDate: "July 11, 2025",
      declineReason: "Schedule conflict with current project",
      skills: ["Node.js", "Apache Kafka", "Redis", "Microservices"],
      projectType: "Data Infrastructure"
    },
    {
      id: 3,
      to: "Elena Rodriguez",
      toAvatar: "/api/placeholder/48/48",
      project: "AI Model Deployment Platform",
      role: "DevOps Engineer",
      description: "Seeking DevOps expertise for automated AI model deployment and monitoring",
      budget: "$85,000",
      duration: "4 months",
      sentDate: "July 14, 2025",
      status: "accepted",
      responseDate: "July 15, 2025",
      startDate: "August 1, 2025",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      projectType: "Infrastructure"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Project Invitations</h1>
            <p className="text-muted-foreground">
              Manage incoming collaboration requests and track your sent invitations
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Collaboration Invitation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Recipient Email</label>
                    <Input placeholder="developer@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Project</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trading-bot">AI Trading Bot</SelectItem>
                        <SelectItem value="risk-model">Risk Assessment Model</SelectItem>
                        <SelectItem value="data-pipeline">Market Data Pipeline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Input placeholder="e.g., Senior Developer" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Budget</label>
                    <Input placeholder="$0" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Personal message to the developer..." rows={4} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Send Invitation</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Received</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">$365K</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Received Invitations</TabsTrigger>
            <TabsTrigger value="sent">Sent Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search invitations..." className="pl-10" />
                  </div>
                  <div className="flex gap-3">
                    <Select>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[150px]">
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
                </div>
              </CardContent>
            </Card>

            {/* Received Invitations */}
            <div className="space-y-6">
              {receivedInvitations.map((invitation) => (
                <Card key={invitation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {invitation.from.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{invitation.project}</CardTitle>
                            <Badge className={getStatusColor(invitation.status)}>
                              {invitation.status}
                            </Badge>
                            <Badge className={getPriorityColor(invitation.priority)}>
                              {invitation.priority} priority
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {invitation.from}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {invitation.companyRating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {invitation.teamSize} members
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Received</p>
                        <p className="text-sm font-medium">{invitation.receivedDate}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Role: {invitation.role}</h4>
                        <p className="text-sm text-muted-foreground">{invitation.description}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">{invitation.budget}</p>
                          <p className="text-xs text-muted-foreground">Budget</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-blue-600">{invitation.duration}</p>
                          <p className="text-xs text-muted-foreground">Duration</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-purple-600">{invitation.deadline}</p>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {invitation.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Code className="h-3 w-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {invitation.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Ask Questions
                          </Button>
                          <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                          <Button className="flex-1">
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                        </div>
                      )}

                      {invitation.status === 'accepted' && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Invitation accepted - Project collaboration starting soon
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="space-y-6">
            {/* Sent Invitations */}
            <div className="space-y-6">
              {sentInvitations.map((invitation) => (
                <Card key={invitation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {invitation.to.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{invitation.project}</CardTitle>
                            <Badge className={getStatusColor(invitation.status)}>
                              {invitation.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <UserPlus className="h-3 w-3" />
                              Invited: {invitation.to}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {invitation.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Sent</p>
                        <p className="text-sm font-medium">{invitation.sentDate}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{invitation.description}</p>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">{invitation.budget}</p>
                          <p className="text-xs text-muted-foreground">Budget</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-blue-600">{invitation.duration}</p>
                          <p className="text-xs text-muted-foreground">Duration</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-purple-600">
                            {invitation.status === 'pending' ? invitation.responseDeadline : 
                             invitation.status === 'accepted' ? invitation.startDate :
                             invitation.responseDate}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invitation.status === 'pending' ? 'Response Due' : 
                             invitation.status === 'accepted' ? 'Start Date' :
                             'Response Date'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {invitation.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {invitation.status === 'declined' && invitation.declineReason && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-red-600 mt-0.5" />
                            <div>
                              <span className="text-sm font-medium text-red-800">Declined</span>
                              <p className="text-sm text-red-700">{invitation.declineReason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {invitation.status === 'accepted' && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Invitation accepted - Project starting {invitation.startDate}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        {invitation.status === 'pending' && (
                          <Button variant="outline" className="flex-1">
                            <Send className="h-4 w-4 mr-2" />
                            Send Reminder
                          </Button>
                        )}
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}