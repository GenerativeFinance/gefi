import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users,
  Search,
  Eye,
  Flag,
  Shield,
  Activity,
  AlertTriangle,
  Clock,
  MessageSquare,
  Ban,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";

interface UserActivity {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  userType: 'investor' | 'developer' | 'data_provider';
  activity: string;
  description: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category: 'content' | 'trading' | 'social' | 'security' | 'financial';
  flagged: boolean;
  autoDetected: boolean;
  reportCount: number;
  severity: number; // 1-10
  actionRequired: boolean;
  previousViolations: number;
  accountStatus: 'active' | 'warned' | 'restricted' | 'suspended';
  relatedContent?: string;
  ipAddress: string;
  location: string;
}

export default function ModeratorUserMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  // Mock data - in real implementation, these would come from API calls
  const userActivities: UserActivity[] = [
    {
      id: 1,
      userId: "user_456",
      userName: "CryptoTrader99",
      userEmail: "crypto.trader@example.com",
      userType: "investor",
      activity: "Rapid Trading Pattern",
      description: "Executed 50+ trades within 30 minutes using multiple AI models simultaneously",
      timestamp: "2025-07-14T14:30:00Z",
      riskLevel: "high",
      category: "trading",
      flagged: true,
      autoDetected: true,
      reportCount: 0,
      severity: 8,
      actionRequired: true,
      previousViolations: 2,
      accountStatus: "warned",
      relatedContent: "Trading Session #TS-4567",
      ipAddress: "192.168.1.45",
      location: "New York, USA"
    },
    {
      id: 2,
      userId: "dev_123",
      userName: "AIModelMaster",
      userEmail: "ai.master@example.com",
      userType: "developer",
      activity: "Suspicious Model Claims",
      description: "Posted AI model with unverified 98% accuracy claims and guaranteed returns",
      timestamp: "2025-07-14T13:15:00Z",
      riskLevel: "critical",
      category: "content",
      flagged: true,
      autoDetected: true,
      reportCount: 3,
      severity: 9,
      actionRequired: true,
      previousViolations: 1,
      accountStatus: "restricted",
      relatedContent: "AI Model: SuperPredictor Pro",
      ipAddress: "10.0.0.23",
      location: "London, UK"
    },
    {
      id: 3,
      userId: "user_789",
      userName: "SocialInvestor",
      userEmail: "social.invest@example.com",
      userType: "investor",
      activity: "Community Spam",
      description: "Posted multiple identical promotional messages across different discussion threads",
      timestamp: "2025-07-14T12:45:00Z",
      riskLevel: "medium",
      category: "social",
      flagged: true,
      autoDetected: false,
      reportCount: 5,
      severity: 6,
      actionRequired: true,
      previousViolations: 0,
      accountStatus: "warned",
      relatedContent: "Forum Posts #FP-3456, #FP-3457, #FP-3458",
      ipAddress: "172.16.0.12",
      location: "Toronto, Canada"
    },
    {
      id: 4,
      userId: "provider_321",
      userName: "DataStreamPro",
      userEmail: "data.stream@example.com",
      userType: "data_provider",
      activity: "Unusual Data Access",
      description: "Attempted to access restricted financial datasets outside normal business hours",
      timestamp: "2025-07-14T11:20:00Z",
      riskLevel: "high",
      category: "security",
      flagged: true,
      autoDetected: true,
      reportCount: 0,
      severity: 7,
      actionRequired: true,
      previousViolations: 0,
      accountStatus: "active",
      relatedContent: "Dataset Access Logs",
      ipAddress: "203.0.113.15",
      location: "Singapore"
    },
    {
      id: 5,
      userId: "user_654",
      userName: "RegularInvestor",
      userEmail: "regular.invest@example.com",
      userType: "investor",
      activity: "Normal Trading Activity",
      description: "Standard portfolio rebalancing and AI model subscription updates",
      timestamp: "2025-07-14T10:30:00Z",
      riskLevel: "low",
      category: "trading",
      flagged: false,
      autoDetected: false,
      reportCount: 0,
      severity: 2,
      actionRequired: false,
      previousViolations: 0,
      accountStatus: "active",
      relatedContent: "Portfolio Update #PU-1234",
      ipAddress: "198.51.100.8",
      location: "Sydney, Australia"
    }
  ];

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, string> = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return <Badge className={variants[risk]}>{risk}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      warned: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      restricted: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      content: MessageSquare,
      trading: TrendingUp,
      social: Users,
      security: Shield,
      financial: Activity
    };
    const Icon = icons[category as keyof typeof icons] || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const filteredActivities = userActivities.filter(activity => {
    const matchesSearch = searchTerm === "" || 
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === "all" || activity.riskLevel === riskFilter;
    const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || activity.accountStatus === statusFilter;
    
    return matchesSearch && matchesRisk && matchesCategory && matchesStatus;
  });

  const stats = {
    totalActivities: userActivities.length,
    flaggedActivities: userActivities.filter(a => a.flagged).length,
    criticalRisk: userActivities.filter(a => a.riskLevel === 'critical').length,
    actionRequired: userActivities.filter(a => a.actionRequired).length,
    autoDetected: userActivities.filter(a => a.autoDetected).length,
    userReports: userActivities.reduce((sum, a) => sum + a.reportCount, 0)
  };

  const handleInvestigateUser = (userId: string) => {
    console.log("Investigating user:", userId);
    // In real implementation, make API call to investigate
  };

  const handleWarnUser = (userId: string) => {
    console.log("Warning user:", userId);
    // In real implementation, make API call to warn
  };

  const handleRestrictUser = (userId: string) => {
    console.log("Restricting user:", userId);
    // In real implementation, make API call to restrict
  };

  const handleSuspendUser = (userId: string) => {
    console.log("Suspending user:", userId);
    // In real implementation, make API call to suspend
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">User Monitoring</h1>
              <p className="text-muted-foreground mt-2">Monitor user activities and detect suspicious behavior</p>
            </div>
            <Button className="bg-primary text-primary-foreground">
              <Activity className="h-4 w-4 mr-2" />
              Activity Report
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalActivities}</div>
                <p className="text-xs text-muted-foreground">Last 24h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.flaggedActivities}</div>
                <p className="text-xs text-muted-foreground">Need review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.criticalRisk}</div>
                <p className="text-xs text-muted-foreground">High priority</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Required</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.actionRequired}</div>
                <p className="text-xs text-muted-foreground">Need intervention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto-Detected</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.autoDetected}</div>
                <p className="text-xs text-muted-foreground">AI flagged</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Reports</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{stats.userReports}</div>
                <p className="text-xs text-muted-foreground">Community reports</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Account Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="warned">Warned</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredActivities.length} of {userActivities.length} activities
            </div>
          </div>

          {/* User Activities */}
          <div className="grid gap-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className={`hover:shadow-md transition-shadow ${activity.riskLevel === 'critical' ? 'border-red-200 dark:border-red-800' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(activity.category)}
                        <h3 className="font-medium text-lg">{activity.activity}</h3>
                        <Badge variant="outline">{activity.userType}</Badge>
                        {getRiskBadge(activity.riskLevel)}
                        {getStatusBadge(activity.accountStatus)}
                        {activity.flagged && (
                          <Badge variant="destructive">Flagged</Badge>
                        )}
                        {activity.autoDetected && (
                          <Badge variant="outline" className="text-blue-600">Auto-Detected</Badge>
                        )}
                        {activity.actionRequired && (
                          <Badge variant="outline" className="text-red-600">Action Required</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">User:</span> {activity.userName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {activity.userEmail}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      <p className="text-sm">{activity.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Severity:</span> {activity.severity}/10
                        </div>
                        <div>
                          <span className="font-medium">Reports:</span> {activity.reportCount}
                        </div>
                        <div>
                          <span className="font-medium">Previous Violations:</span> {activity.previousViolations}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {activity.location}
                        </div>
                      </div>
                      
                      {activity.relatedContent && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Related Content:</strong> {activity.relatedContent}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>IP: {activity.ipAddress}</span>
                        <span>Category: {activity.category}</span>
                        <span>User ID: {activity.userId}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleInvestigateUser(activity.userId)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Investigate
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWarnUser(activity.userId)}
                        disabled={activity.accountStatus === 'suspended'}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Warn
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRestrictUser(activity.userId)}
                        disabled={activity.accountStatus === 'suspended'}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Restrict
                      </Button>
                      
                      {activity.riskLevel === 'critical' && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleSuspendUser(activity.userId)}
                          disabled={activity.accountStatus === 'suspended'}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend
                        </Button>
                      )}
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