import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle,
  Send,
  Search,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Star,
  Archive,
  Trash2,
  Users,
  Building,
  Clock,
  CheckCircle,
  Circle,
  Edit,
  Settings,
  Filter,
  Calendar,
  AlertCircle,
  FileText,
  Image,
  Download,
  ExternalLink,
  Reply,
  Forward,
  Flag,
  Mute,
  Pin
} from "lucide-react";

export default function DeveloperCollaborationMessaging() {
  const conversations = [
    {
      id: 1,
      name: "Quantum Capital Project Team",
      type: "group",
      participants: ["Sarah Chen", "Mike Johnson", "You"],
      lastMessage: "The latest risk model updates are ready for review",
      lastMessageTime: "2 minutes ago",
      unreadCount: 3,
      avatar: "/api/placeholder/48/48",
      isOnline: true,
      isStarred: true,
      project: "AI Trading Bot Enterprise"
    },
    {
      id: 2,
      name: "Elena Rodriguez",
      type: "direct",
      participants: ["Elena Rodriguez", "You"],
      lastMessage: "Can we schedule a call to discuss the machine learning pipeline?",
      lastMessageTime: "1 hour ago",
      unreadCount: 1,
      avatar: "/api/placeholder/48/48",
      isOnline: true,
      isStarred: false,
      project: "Risk Assessment Model"
    },
    {
      id: 3,
      name: "Data Provider Support",
      type: "support",
      participants: ["Support Team", "You"],
      lastMessage: "Your API access has been upgraded successfully",
      lastMessageTime: "3 hours ago",
      unreadCount: 0,
      avatar: "/api/placeholder/48/48",
      isOnline: false,
      isStarred: false,
      project: "Data Integration"
    },
    {
      id: 4,
      name: "Green Capital ESG Team",
      type: "group",
      participants: ["Maria Garcia", "James Lee", "You"],
      lastMessage: "ESG scoring algorithm is performing well in tests",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      avatar: "/api/placeholder/48/48",
      isOnline: false,
      isStarred: false,
      project: "ESG Investment Platform"
    }
  ];

  const currentMessages = [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hey team! I've finished the preliminary analysis of the trading algorithm. The backtesting results look promising with a 15.2% annual return.",
      timestamp: "10:30 AM",
      isOwn: false,
      avatar: "/api/placeholder/32/32",
      attachments: [
        { name: "backtest_results.pdf", size: "2.4 MB", type: "pdf" }
      ]
    },
    {
      id: 2,
      sender: "You",
      content: "That's excellent news! The risk-adjusted returns are particularly impressive. Should we schedule a review meeting with the stakeholders?",
      timestamp: "10:35 AM",
      isOwn: true,
      avatar: "/api/placeholder/32/32",
      attachments: []
    },
    {
      id: 3,
      sender: "Mike Johnson",
      content: "I agree! I've also been working on optimizing the execution speed. We're now processing trades 23% faster than the previous version.",
      timestamp: "10:42 AM",
      isOwn: false,
      avatar: "/api/placeholder/32/32",
      attachments: []
    },
    {
      id: 4,
      sender: "Sarah Chen",
      content: "Perfect timing! I'll set up a meeting for tomorrow at 2 PM. We can present the complete performance metrics to Quantum Capital.",
      timestamp: "10:45 AM",
      isOwn: false,
      avatar: "/api/placeholder/32/32",
      attachments: []
    },
    {
      id: 5,
      sender: "You",
      content: "Sounds good! I'll prepare the technical documentation and deployment timeline. Looking forward to sharing our progress.",
      timestamp: "10:48 AM",
      isOwn: true,
      avatar: "/api/placeholder/32/32",
      attachments: [
        { name: "deployment_timeline.docx", size: "1.1 MB", type: "doc" }
      ]
    }
  ];

  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState("");

  const getConversationIcon = (type: string) => {
    switch (type) {
      case 'group': return <Users className="h-4 w-4" />;
      case 'support': return <Building className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'image': return <Image className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team Messaging</h1>
            <p className="text-muted-foreground">
              Communicate with project teams, stakeholders, and support
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Conversation Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct Message</SelectItem>
                      <SelectItem value="group">Group Chat</SelectItem>
                      <SelectItem value="support">Support Ticket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Recipients</label>
                  <Input placeholder="Enter email addresses..." />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Conversation subject" />
                </div>
                <div>
                  <label className="text-sm font-medium">Initial Message</label>
                  <Textarea placeholder="Type your message..." rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Start Conversation</Button>
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
                  <p className="text-sm font-medium text-muted-foreground">Active Chats</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Circle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">12m</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messaging Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conversation.id 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {conversation.name.charAt(0)}
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">
                                {conversation.name}
                              </span>
                              {conversation.isStarred && (
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              )}
                              {getConversationIcon(conversation.type)}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {conversation.lastMessageTime}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conversation.project}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    Q
                  </div>
                  <div>
                    <h3 className="font-medium">Quantum Capital Project Team</h3>
                    <p className="text-sm text-muted-foreground">3 members • Last seen 2m ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages */}
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {message.sender.charAt(0)}
                      </div>
                      <div className={`flex-1 max-w-[70%] ${message.isOwn ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.sender}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            message.isOwn
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center gap-2 p-2 rounded ${
                                    message.isOwn ? 'bg-primary-foreground/10' : 'bg-background'
                                  }`}
                                >
                                  {getAttachmentIcon(attachment.type)}
                                  <div className="flex-1">
                                    <p className="text-xs font-medium">{attachment.name}</p>
                                    <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Team Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Sarah Chen</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Elena Rodriguez</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Mike Johnson</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Away</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Scheduled Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Project Review</p>
                    <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Tech Sync</p>
                    <p className="text-xs text-muted-foreground">Friday, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">backtest_results.pdf</p>
                    <p className="text-xs text-muted-foreground">Shared 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">deployment_timeline.docx</p>
                    <p className="text-xs text-muted-foreground">Shared 1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}