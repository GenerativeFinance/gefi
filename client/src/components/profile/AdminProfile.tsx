import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Activity, 
  Settings, 
  FileText,
  Ban,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Database,
  Lock,
  Zap,
  MessageSquare,
  Calendar,
  ExternalLink,
  Download,
  Trash2,
  RefreshCw
} from "lucide-react";

interface AdminProfileProps {
  adminId: string;
  data?: any;
}

export default function AdminProfile({ adminId, data }: AdminProfileProps) {
  // Create complete admin data with proper defaults
  const defaultAdminData = {
    id: adminId,
    name: adminId === 'github_55703540' ? 'Guillaume Lauzier' :
          adminId === 'tech-lead' ? 'Alex Rodriguez' : 'Sarah Johnson',
    role: adminId === 'github_55703540' ? 'Platform Administrator' :
          adminId === 'tech-lead' ? 'Technical Lead' : 'Compliance Administrator',
    email: adminId === 'github_55703540' ? 'guillaumelauzier@gmail.com' :
           adminId === 'tech-lead' ? 'alex@gefi.com' : 'sarah@gefi.com',
    avatar: `/avatars/${adminId}.png`,
    verified: true,
    joinedDate: adminId === 'github_55703540' ? '2025-06-28' : '2024-01-15',
    lastActive: 'Active now',
    
    // Core Admin Fields
    adminRights: [
      'User Management',
      'Content Moderation',
      'System Configuration',
      'Data Management',
      'Security Oversight',
      'Emergency Actions'
    ],
    
    escalationHistory: [
      {
        id: 1,
        type: 'User Suspension',
        target: 'suspicious-trader-001',
        reason: 'Fraudulent trading activity detected',
        date: '2025-07-10',
        status: 'Resolved',
        severity: 'High'
      },
      {
        id: 2,
        type: 'Model Takedown',
        target: 'risky-prediction-model',
        reason: 'Non-compliance with regulatory standards',
        date: '2025-07-08',
        status: 'Resolved',
        severity: 'Medium'
      },
      {
        id: 3,
        type: 'Data Breach Response',
        target: 'dataset-provider-xyz',
        reason: 'Unauthorized data access attempt',
        date: '2025-07-05',
        status: 'In Progress',
        severity: 'Critical'
      }
    ],

    activityLog: [
      {
        id: 1,
        action: 'User Account Suspended',
        target: 'user-12345',
        timestamp: '2025-07-15 14:30:00',
        details: 'Suspended for violating terms of service'
      },
      {
        id: 2,
        action: 'AI Model Removed',
        target: 'model-risk-pred-v2',
        timestamp: '2025-07-15 12:15:00',
        details: 'Failed compliance review'
      },
      {
        id: 3,
        action: 'Data Access Revoked',
        target: 'dataset-financial-news',
        timestamp: '2025-07-14 16:45:00',
        details: 'Licensing violation detected'
      }
    ],

    systemMonitoring: {
      serverUptime: '99.9%',
      activeUsers: 15420,
      systemLoad: 'Normal',
      databaseHealth: 'Excellent',
      securityAlerts: 3,
      pendingTasks: 12
    },

    emergencyActions: [
      {
        id: 1,
        type: 'Emergency Suspension',
        description: 'Immediately suspend user account',
        lastUsed: '2025-07-10',
        usageCount: 5
      },
      {
        id: 2,
        type: 'Model Quarantine',
        description: 'Quarantine AI model from marketplace',
        lastUsed: '2025-07-08',
        usageCount: 3
      },
      {
        id: 3,
        type: 'Data Lockdown',
        description: 'Revoke all data access permissions',
        lastUsed: '2025-07-05',
        usageCount: 2
      }
    ],

    // Optional Admin Fields
    systemHealth: {
      cpu: '45%',
      memory: '67%',
      storage: '23%',
      network: 'Stable',
      apiResponse: '120ms',
      errorRate: '0.02%'
    },

    incidentReports: [
      {
        id: 1,
        title: 'Database Performance Degradation',
        severity: 'Medium',
        date: '2025-07-12',
        status: 'Resolved',
        resolution: 'Optimized query performance'
      },
      {
        id: 2,
        title: 'Authentication Service Outage',
        severity: 'High',
        date: '2025-07-09',
        status: 'Resolved',
        resolution: 'Failover to backup authentication server'
      },
      {
        id: 3,
        title: 'Suspicious Trading Activity',
        severity: 'Critical',
        date: '2025-07-07',
        status: 'Under Investigation',
        resolution: 'Ongoing investigation with compliance team'
      }
    ]
  };

  // Merge actual data with defaults to ensure all required fields exist
  const adminData = {
    ...defaultAdminData,
    ...data,
    // Ensure nested objects exist with defaults
    systemMonitoring: {
      ...defaultAdminData.systemMonitoring,
      ...(data?.systemMonitoring || {})
    },
    systemHealth: {
      ...defaultAdminData.systemHealth,
      ...(data?.systemHealth || {})
    },
    adminRights: data?.adminRights || defaultAdminData.adminRights,
    escalationHistory: data?.escalationHistory || defaultAdminData.escalationHistory,
    activityLog: data?.activityLog || defaultAdminData.activityLog,
    emergencyActions: data?.emergencyActions || defaultAdminData.emergencyActions,
    incidentReports: data?.incidentReports || defaultAdminData.incidentReports
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={adminData.avatar} />
                <AvatarFallback className="text-lg font-semibold">
                  {adminData.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminData.name}
                  </h1>
                  {adminData.verified && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Admin
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">{adminData.role}</p>
                {adminData.email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{adminData.email}</p>
                )}
                {adminData.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-md">{adminData.bio}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {adminData.joinedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    {adminData.lastActive}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Rights Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Admin Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {adminData.adminRights.map((right: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{right}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server Uptime</span>
                  <Badge className="bg-green-100 text-green-800">{adminData.systemMonitoring.serverUptime}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium">{adminData.systemMonitoring.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Load</span>
                  <Badge className="bg-blue-100 text-blue-800">{adminData.systemMonitoring.systemLoad}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Security Alerts</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{adminData.systemMonitoring.securityAlerts}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-600" />
                Emergency Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {adminData.emergencyActions.slice(0, 3).map((action: any) => (
                  <div key={action.id} className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{action.type}</span>
                      <span className="text-xs text-gray-500">Used: {action.usageCount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="escalations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="escalations">Escalation History</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
            <TabsTrigger value="incidents">Incident Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="escalations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Escalation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.escalationHistory.map((escalation: any) => (
                    <div key={escalation.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{escalation.type}</h4>
                          <p className="text-sm text-gray-600">Target: {escalation.target}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(escalation.severity)}>
                            {escalation.severity}
                          </Badge>
                          <Badge className={getStatusColor(escalation.status)}>
                            {escalation.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{escalation.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Date: {escalation.date}</span>
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Recent Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminData.activityLog.map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">{log.action}</p>
                          <p className="text-xs text-gray-600">Target: {log.target}</p>
                          <p className="text-xs text-gray-500">{log.details}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    System Health Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-400">CPU Usage</div>
                        <div className="text-2xl font-bold text-blue-600">{adminData.systemHealth.cpu}</div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-sm font-medium text-green-800 dark:text-green-400">Memory</div>
                        <div className="text-2xl font-bold text-green-600">{adminData.systemHealth.memory}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <div className="text-sm font-medium text-purple-800 dark:text-purple-400">Storage</div>
                        <div className="text-2xl font-bold text-purple-600">{adminData.systemHealth.storage}</div>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <div className="text-sm font-medium text-orange-800 dark:text-orange-400">API Response</div>
                        <div className="text-2xl font-bold text-orange-600">{adminData.systemHealth.apiResponse}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-600" />
                    Security Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded">
                      <div>
                        <div className="font-medium text-red-800 dark:text-red-400">Security Alerts</div>
                        <div className="text-sm text-red-600">{adminData.systemMonitoring.securityAlerts} active</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <div>
                        <div className="font-medium text-green-800 dark:text-green-400">Network Status</div>
                        <div className="text-sm text-green-600">{adminData.systemHealth.network}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <div>
                        <div className="font-medium text-yellow-800 dark:text-yellow-400">Error Rate</div>
                        <div className="text-sm text-yellow-600">{adminData.systemHealth.errorRate}</div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Incident Reports Archive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.incidentReports.map((incident: any) => (
                    <div key={incident.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{incident.title}</h4>
                          <p className="text-sm text-gray-600">Date: {incident.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{incident.resolution}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View Full Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}