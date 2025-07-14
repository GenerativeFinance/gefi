import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Settings,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Activity
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";

interface AdminStats {
  totalUsers: number;
  activeModels: number;
  totalRevenue: number;
  pendingReviews: number;
  securityAlerts: number;
  supportTickets: number;
  complianceRate: number;
  resolutionRate: number;
}

interface UserManagement {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  status: 'active' | 'suspended' | 'pending';
  verified: boolean;
  lastLogin: string;
  totalTrades: number;
  joinDate: string;
}

interface ContentModerationItem {
  id: number;
  type: 'ai_model' | 'dataset' | 'user_profile';
  title: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  priority: 'low' | 'medium' | 'high' | 'critical';
  submittedAt: string;
  flaggedReason?: string;
}

interface SecurityAlert {
  id: number;
  type: 'suspicious_login' | 'multiple_failures' | 'unusual_activity' | 'potential_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved';
}

interface SupportTicket {
  id: number;
  ticketNumber: string;
  userId: string;
  userName: string;
  category: 'technical' | 'billing' | 'dispute' | 'compliance' | 'legal';
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
  isLegalDispute: boolean;
  disputeAmount?: number;
  createdAt: string;
  lastResponseAt?: string;
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [contentFilter, setContentFilter] = useState("all");
  const [alertFilter, setAlertFilter] = useState("all");
  const [ticketFilter, setTicketFilter] = useState("all");

  // Mock data - in real implementation, these would come from API calls
  const adminStats: AdminStats = {
    totalUsers: 15847,
    activeModels: 234,
    totalRevenue: 683000,
    pendingReviews: 23,
    securityAlerts: 5,
    supportTickets: 18,
    complianceRate: 87.3,
    resolutionRate: 94.2
  };

  const users: UserManagement[] = [
    {
      id: "github_55703540",
      email: "developer@example.com",
      firstName: "Alex",
      lastName: "Johnson",
      userType: "Developer",
      status: "active",
      verified: true,
      lastLogin: "2025-07-14T12:30:00Z",
      totalTrades: 234,
      joinDate: "2024-03-15"
    },
    {
      id: "google_123456789",
      email: "investor@example.com",
      firstName: "Sarah",
      lastName: "Chen",
      userType: "Investor",
      status: "active",
      verified: true,
      lastLogin: "2025-07-14T10:15:00Z",
      totalTrades: 89,
      joinDate: "2024-05-22"
    }
  ];

  const moderationItems: ContentModerationItem[] = [
    {
      id: 1,
      type: "ai_model",
      title: "Quantum Risk Predictor",
      submittedBy: "QuantumFinance Labs",
      status: "pending",
      priority: "high",
      submittedAt: "2025-07-14T08:30:00Z",
      flaggedReason: "Performance claims need verification"
    },
    {
      id: 2,
      type: "dataset",
      title: "Market Sentiment Data 2024",
      submittedBy: "DataProvider Corp",
      status: "flagged",
      priority: "medium",
      submittedAt: "2025-07-13T15:20:00Z",
      flaggedReason: "Licensing documentation incomplete"
    }
  ];

  const securityAlerts: SecurityAlert[] = [
    {
      id: 1,
      type: "suspicious_login",
      severity: "high",
      description: "Multiple failed login attempts from unusual IP address",
      userId: "github_55703540",
      timestamp: "2025-07-14T11:45:00Z",
      status: "investigating"
    },
    {
      id: 2,
      type: "unusual_activity",
      severity: "medium",
      description: "Unusual trading pattern detected",
      userId: "google_123456789",
      timestamp: "2025-07-14T09:15:00Z",
      status: "open"
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 1,
      ticketNumber: "GF-2025-001",
      userId: "github_55703540",
      userName: "Alex Johnson",
      category: "dispute",
      subject: "Model performance not as advertised",
      priority: "high",
      status: "in_progress",
      isLegalDispute: false,
      disputeAmount: 2999.99,
      createdAt: "2025-07-13T14:30:00Z",
      lastResponseAt: "2025-07-14T09:00:00Z"
    },
    {
      id: 2,
      ticketNumber: "GF-2025-002",
      userId: "google_123456789",
      userName: "Sarah Chen",
      category: "technical",
      subject: "Unable to access subscribed model",
      priority: "medium",
      status: "waiting_response",
      isLegalDispute: false,
      createdAt: "2025-07-14T10:15:00Z"
    }
  ];

  const getStatusBadge = (status: string, type: 'user' | 'content' | 'alert' | 'ticket' = 'user') => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      flagged: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      investigating: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      waiting_response: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    };
    
    return <Badge className={variants[status] || variants.pending}>{status}</Badge>;
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.activeModels}</div>
            <p className="text-xs text-muted-foreground">{adminStats.pendingReviews} pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${adminStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">{adminStats.resolutionRate}% resolution rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Security Alerts</span>
              </div>
              <Badge variant="destructive">{adminStats.securityAlerts}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Support Tickets</span>
              </div>
              <Badge variant="secondary">{adminStats.supportTickets}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Pending Reviews</span>
              </div>
              <Badge variant="outline">{adminStats.pendingReviews}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Management</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="investor">Investors</SelectItem>
                  <SelectItem value="developer">Developers</SelectItem>
                  <SelectItem value="data_provider">Data Providers</SelectItem>
                  <SelectItem value="regulator">Regulators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Last Login</th>
                      <th className="text-left p-4 font-medium">Activity</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{user.userType}</Badge>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="p-4 text-sm">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm">
                          {user.totalTrades} trades
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Flag className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Moderation Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Content Moderation</h2>
            <Select value={contentFilter} onValueChange={setContentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {moderationItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <Badge variant="outline">{item.type.replace('_', ' ')}</Badge>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Submitted by {item.submittedBy} on {new Date(item.submittedAt).toLocaleDateString()}
                      </p>
                      {item.flaggedReason && (
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          Flagged: {item.flaggedReason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(item.status, 'content')}
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button size="sm" variant="outline">
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

        {/* Security Monitoring Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Security Monitoring</h2>
            <Select value={alertFilter} onValueChange={setAlertFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {securityAlerts.map((alert) => (
              <Card key={alert.id} className="border-orange-200 dark:border-orange-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <h3 className="font-medium">{alert.type.replace('_', ' ').toUpperCase()}</h3>
                        {getPriorityBadge(alert.severity)}
                      </div>
                      <p className="text-sm">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                        {alert.userId && ` • User: ${alert.userId}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(alert.status, 'alert')}
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Support & Litigation Tab */}
        <TabsContent value="support" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Support & Litigation</h2>
            <Select value={ticketFilter} onValueChange={setTicketFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="dispute">Disputes</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {supportTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">#{ticket.ticketNumber}</h3>
                        <Badge variant="outline">{ticket.category}</Badge>
                        {getPriorityBadge(ticket.priority)}
                        {ticket.isLegalDispute && (
                          <Badge variant="destructive">Legal Dispute</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        By {ticket.userName} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                        {ticket.disputeAmount && ` • Amount: $${ticket.disputeAmount.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(ticket.status, 'ticket')}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-semibold">Platform Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Revenue Growth</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
                <p className="text-sm text-muted-foreground">vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>User Engagement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">78.3%</div>
                <p className="text-sm text-muted-foreground">daily active users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Model Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">4.7/5</div>
                <p className="text-sm text-muted-foreground">average rating</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold">System Settings</h2>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Platform Fee (%)</label>
                    <Input defaultValue="2.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max File Size (MB)</label>
                    <Input defaultValue="100" />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Session Timeout (minutes)</label>
                    <Input defaultValue="30" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Login Attempts</label>
                    <Input defaultValue="5" />
                  </div>
                </div>
                <Button>Update Security</Button>
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