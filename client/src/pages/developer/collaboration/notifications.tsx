import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell,
  BellRing,
  Search,
  Filter,
  Settings,
  Check,
  CheckCircle,
  X,
  Trash2,
  Archive,
  Star,
  Clock,
  MessageCircle,
  Users,
  Building,
  Calendar,
  AlertTriangle,
  Info,
  TrendingUp,
  DollarSign,
  Code,
  Database,
  FileText,
  Mail,
  Phone,
  Smartphone,
  Globe,
  Shield,
  Activity,
  Target,
  Award,
  Briefcase,
  GitBranch,
  Eye,
  ExternalLink,
  Plus,
  Volume2,
  VolumeX
} from "lucide-react";

export default function DeveloperCollaborationNotifications() {
  const notifications = [
    {
      id: 1,
      title: "Project Milestone Completed",
      message: "AI Trading Bot Enterprise has reached 75% completion milestone",
      type: "project",
      priority: "high",
      timestamp: "2 minutes ago",
      isRead: false,
      isStarred: true,
      sender: "Quantum Capital Partners",
      actionUrl: "/developer/collaboration/projects",
      icon: "target"
    },
    {
      id: 2,
      title: "New Collaboration Invitation",
      message: "Elena Rodriguez invited you to join the Risk Assessment Model project",
      type: "invitation",
      priority: "high",
      timestamp: "1 hour ago",
      isRead: false,
      isStarred: false,
      sender: "Elena Rodriguez",
      actionUrl: "/developer/collaboration/invitations",
      icon: "users"
    },
    {
      id: 3,
      title: "Compliance Review Required",
      message: "SEC documentation needs review by July 25, 2025",
      type: "compliance",
      priority: "medium",
      timestamp: "3 hours ago",
      isRead: true,
      isStarred: false,
      sender: "Compliance Team",
      actionUrl: "/developer/collaboration/compliance",
      icon: "shield"
    },
    {
      id: 4,
      title: "New Message in Team Chat",
      message: "Sarah Chen: The latest risk model updates are ready for review",
      type: "message",
      priority: "low",
      timestamp: "5 hours ago",
      isRead: true,
      isStarred: false,
      sender: "Sarah Chen",
      actionUrl: "/developer/collaboration/messaging",
      icon: "message"
    },
    {
      id: 5,
      title: "Resource Access Granted",
      message: "You now have access to GPU Cluster A for model training",
      type: "resource",
      priority: "medium",
      timestamp: "1 day ago",
      isRead: true,
      isStarred: false,
      sender: "Infrastructure Team",
      actionUrl: "/developer/collaboration/resources",
      icon: "database"
    },
    {
      id: 6,
      title: "Payment Processed",
      message: "Monthly collaboration fee of $2,500 has been processed",
      type: "payment",
      priority: "low",
      timestamp: "2 days ago",
      isRead: true,
      isStarred: false,
      sender: "Billing Department",
      actionUrl: "/developer/portfolio/funding",
      icon: "dollar"
    },
    {
      id: 7,
      title: "Code Review Request",
      message: "Mike Johnson requested review for trading algorithm optimization",
      type: "code",
      priority: "medium",
      timestamp: "3 days ago",
      isRead: true,
      isStarred: false,
      sender: "Mike Johnson",
      actionUrl: "/developer/collaboration/projects",
      icon: "code"
    }
  ];

  const notificationSettings = {
    email: {
      projectUpdates: true,
      newInvitations: true,
      messageNotifications: false,
      complianceAlerts: true,
      paymentNotifications: true,
      weeklyDigest: true
    },
    push: {
      projectUpdates: true,
      newInvitations: true,
      messageNotifications: true,
      complianceAlerts: true,
      paymentNotifications: false,
      weeklyDigest: false
    },
    inApp: {
      projectUpdates: true,
      newInvitations: true,
      messageNotifications: true,
      complianceAlerts: true,
      paymentNotifications: true,
      weeklyDigest: true
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800';
      case 'invitation': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      case 'message': return 'bg-green-100 text-green-800';
      case 'resource': return 'bg-cyan-100 text-cyan-800';
      case 'payment': return 'bg-emerald-100 text-emerald-800';
      case 'code': return 'bg-yellow-100 text-yellow-800';
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

  const getNotificationIcon = (iconType: string) => {
    switch (iconType) {
      case 'target': return <Target className="h-4 w-4" />;
      case 'users': return <Users className="h-4 w-4" />;
      case 'shield': return <Shield className="h-4 w-4" />;
      case 'message': return <MessageCircle className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'dollar': return <DollarSign className="h-4 w-4" />;
      case 'code': return <Code className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const starredCount = notifications.filter(n => n.isStarred).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated on project progress, team communications, and important alerts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Project Updates</span>
                        <Switch defaultChecked={notificationSettings.email.projectUpdates} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Invitations</span>
                        <Switch defaultChecked={notificationSettings.email.newInvitations} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Message Notifications</span>
                        <Switch defaultChecked={notificationSettings.email.messageNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Compliance Alerts</span>
                        <Switch defaultChecked={notificationSettings.email.complianceAlerts} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment Notifications</span>
                        <Switch defaultChecked={notificationSettings.email.paymentNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Weekly Digest</span>
                        <Switch defaultChecked={notificationSettings.email.weeklyDigest} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Project Updates</span>
                        <Switch defaultChecked={notificationSettings.push.projectUpdates} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Invitations</span>
                        <Switch defaultChecked={notificationSettings.push.newInvitations} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Message Notifications</span>
                        <Switch defaultChecked={notificationSettings.push.messageNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Compliance Alerts</span>
                        <Switch defaultChecked={notificationSettings.push.complianceAlerts} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Quiet Hours</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="10:00 PM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="22:00">10:00 PM</SelectItem>
                            <SelectItem value="23:00">11:00 PM</SelectItem>
                            <SelectItem value="00:00">12:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="8:00 AM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="07:00">7:00 AM</SelectItem>
                            <SelectItem value="08:00">8:00 AM</SelectItem>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
                <BellRing className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Starred</p>
                  <p className="text-2xl font-bold">{starredCount}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="project">Projects</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search notifications..." className="pl-10" />
                  </div>
                  <div className="flex gap-3">
                    <Select>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="invitation">Invitation</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="message">Message</SelectItem>
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

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                  }`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getNotificationIcon(notification.icon)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-medium text-sm ${!notification.isRead ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h3>
                              <Badge className={getTypeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {notification.sender}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {notification.isStarred && (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            )}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Button variant="ghost" size="sm">
                              <Star className={`h-4 w-4 ${notification.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {notification.actionUrl && (
                            <Button size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Open
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button variant="outline" size="sm">
                              <Check className="h-4 w-4 mr-1" />
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unread" className="space-y-6">
            <div className="space-y-3">
              {notifications.filter(n => !n.isRead).map((notification) => (
                <Card 
                  key={notification.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500 bg-blue-50/50"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getNotificationIcon(notification.icon)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm">{notification.title}</h3>
                              <Badge className={getTypeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {notification.sender}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <Button variant="ghost" size="sm">
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                          <Button variant="outline" size="sm">
                            <Check className="h-4 w-4 mr-1" />
                            Mark Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="starred" className="space-y-6">
            <div className="space-y-3">
              {notifications.filter(n => n.isStarred).map((notification) => (
                <Card key={notification.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getNotificationIcon(notification.icon)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-sm">{notification.title}</h3>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Badge className={getTypeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {notification.sender}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="project" className="space-y-6">
            <div className="space-y-3">
              {notifications.filter(n => n.type === 'project').map((notification) => (
                <Card key={notification.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getNotificationIcon(notification.icon)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{notification.sender}</span>
                          <span>{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="space-y-3">
              {notifications.filter(n => n.type === 'compliance').map((notification) => (
                <Card key={notification.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getNotificationIcon(notification.icon)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{notification.sender}</span>
                          <span>{notification.timestamp}</span>
                        </div>
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