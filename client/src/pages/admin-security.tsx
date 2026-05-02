import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield,
  AlertTriangle,
  Eye,
  Search,
  MapPin,
  Clock,
  Monitor,
  Activity,
  Lock,
  Unlock,
  Ban,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";

interface SecurityAlert {
  id: number;
  type: 'suspicious_login' | 'multiple_failures' | 'unusual_activity' | 'potential_breach' | 'unauthorized_access' | 'malicious_request';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  userName?: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  metadata?: Record<string, any>;
}

export default function AdminSecurity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data - in real implementation, these would come from API calls
  const securityAlerts: SecurityAlert[] = [
    {
      id: 1,
      type: "suspicious_login",
      severity: "high",
      description: "Multiple failed login attempts from unusual IP address followed by successful login",
      userId: "github_55703540",
      userName: "Alex Johnson",
      ipAddress: "192.168.1.100",
      location: "Moscow, Russia",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: "2025-07-14T11:45:00Z",
      status: "investigating",
      assignedTo: "Security Team Alpha"
    },
    {
      id: 2,
      type: "unusual_activity",
      severity: "medium",
      description: "Abnormal trading pattern detected - high frequency trades outside normal hours",
      userId: "google_123456789",
      userName: "Sarah Chen",
      ipAddress: "10.0.0.45",
      location: "New York, USA",
      userAgent: "TradingBot/2.1 (automated)",
      timestamp: "2025-07-14T09:15:00Z",
      status: "open"
    },
    {
      id: 3,
      type: "potential_breach",
      severity: "critical",
      description: "Unauthorized API access attempt with elevated privileges",
      ipAddress: "203.0.113.42",
      location: "Unknown (VPN)",
      userAgent: "curl/7.68.0",
      timestamp: "2025-07-14T08:30:00Z",
      status: "investigating",
      assignedTo: "Security Team Beta"
    },
    {
      id: 4,
      type: "multiple_failures",
      severity: "medium",
      description: "Brute force attack detected - 50+ failed login attempts in 5 minutes",
      ipAddress: "198.51.100.23",
      location: "Frankfurt, Germany",
      userAgent: "Python-requests/2.28.1",
      timestamp: "2025-07-14T07:20:00Z",
      status: "resolved"
    },
    {
      id: 5,
      type: "unauthorized_access",
      severity: "high",
      description: "Access to admin panel from unrecognized device and location",
      userId: "admin_789",
      userName: "System Admin",
      ipAddress: "172.16.0.1",
      location: "Singapore",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      timestamp: "2025-07-13T22:15:00Z",
      status: "false_positive"
    },
    {
      id: 6,
      type: "malicious_request",
      severity: "low",
      description: "SQL injection attempt detected in search parameters",
      ipAddress: "192.0.2.146",
      location: "London, UK",
      userAgent: "sqlmap/1.6.12",
      timestamp: "2025-07-13T19:45:00Z",
      status: "resolved"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      investigating: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      false_positive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    };
    return <Badge className={variants[status] || variants.open}>{status.replace('_', ' ')}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, string> = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return <Badge className={variants[severity]}>{severity}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      suspicious_login: Lock,
      multiple_failures: Ban,
      unusual_activity: Activity,
      potential_breach: AlertTriangle,
      unauthorized_access: Unlock,
      malicious_request: Shield
    };
    const Icon = icons[type as keyof typeof icons] || AlertTriangle;
    return <Icon className="h-4 w-4" />;
  };

  const filteredAlerts = securityAlerts.filter(alert => {
    const matchesSearch = searchTerm === "" || 
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.ipAddress.includes(searchTerm) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });

  const stats = {
    totalAlerts: securityAlerts.length,
    openAlerts: securityAlerts.filter(a => a.status === 'open').length,
    investigatingAlerts: securityAlerts.filter(a => a.status === 'investigating').length,
    criticalAlerts: securityAlerts.filter(a => a.severity === 'critical').length,
    resolvedToday: securityAlerts.filter(a => a.status === 'resolved' && new Date(a.timestamp).toDateString() === new Date().toDateString()).length,
    avgResponseTime: "18 minutes"
  };

  const handleInvestigate = (alertId: number) => {
    console.log("Investigating alert:", alertId);
    // In real implementation, make API call to start investigation
  };

  const handleResolve = (alertId: number) => {
    console.log("Resolving alert:", alertId);
    // In real implementation, make API call to resolve
  };

  const handleMarkFalsePositive = (alertId: number) => {
    console.log("Marking as false positive:", alertId);
    // In real implementation, make API call to mark as false positive
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Security Monitoring</h1>
              <p className="text-muted-foreground mt-2">Monitor and respond to security threats</p>
            </div>
            <Button className="bg-primary text-primary-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Security Report
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAlerts}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.openAlerts}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investigating</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.investigatingAlerts}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</div>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">Average</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="suspicious_login">Suspicious Login</SelectItem>
                  <SelectItem value="multiple_failures">Multiple Failures</SelectItem>
                  <SelectItem value="unusual_activity">Unusual Activity</SelectItem>
                  <SelectItem value="potential_breach">Potential Breach</SelectItem>
                  <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
                  <SelectItem value="malicious_request">Malicious Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredAlerts.length} of {securityAlerts.length} alerts
            </div>
          </div>

          {/* Security Alerts */}
          <div className="grid gap-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`hover:shadow-md transition-shadow ${alert.severity === 'critical' ? 'border-red-200 dark:border-red-800' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(alert.type)}
                        <h3 className="font-medium text-lg">{alert.type.replace('_', ' ').toUpperCase()}</h3>
                        {getSeverityBadge(alert.severity)}
                        {getStatusBadge(alert.status)}
                        {alert.assignedTo && (
                          <Badge variant="outline">Assigned to {alert.assignedTo}</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm">{alert.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        {alert.userName && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">User:</span>
                            <span>{alert.userName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">IP:</span>
                          <span className="font-mono text-xs">{alert.ipAddress}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Location:</span>
                          <span>{alert.location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Time:</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>User Agent:</strong> {alert.userAgent}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleInvestigate(alert.id)}
                        disabled={alert.status === 'investigating' || alert.status === 'resolved'}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Investigate
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleResolve(alert.id)}
                        disabled={alert.status === 'resolved'}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMarkFalsePositive(alert.id)}
                        disabled={alert.status === 'false_positive' || alert.status === 'resolved'}
                      >
                        False Positive
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