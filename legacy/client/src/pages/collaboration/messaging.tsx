import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle,
  Send,
  Search,
  Plus,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Star
} from "lucide-react";

export default function CollaborationMessaging() {
  const conversations = [
    {
      id: 1,
      name: "AI Trading Team",
      lastMessage: "Let's review the latest algorithm performance...",
      timestamp: "2 min ago",
      unread: 3,
      avatar: "/api/placeholder/40/40",
      online: true,
      type: "group"
    },
    {
      id: 2,
      name: "Sarah Chen",
      lastMessage: "The risk assessment model is ready for testing",
      timestamp: "15 min ago",
      unread: 0,
      avatar: "/api/placeholder/40/40",
      online: true,
      type: "direct"
    },
    {
      id: 3,
      name: "ESG Investment Group",
      lastMessage: "New ESG scoring framework proposal attached",
      timestamp: "1 hour ago",
      unread: 1,
      avatar: "/api/placeholder/40/40",
      online: false,
      type: "group"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "The latest backtesting results look promising. ROI increased by 12% with the new algorithm.",
      timestamp: "10:30 AM",
      avatar: "/api/placeholder/32/32",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      content: "Excellent! Can we schedule a call to discuss the implementation strategy?",
      timestamp: "10:32 AM",
      avatar: "/api/placeholder/32/32",
      isOwn: true
    },
    {
      id: 3,
      sender: "Mike Johnson",
      content: "I've uploaded the risk analysis report to the shared workspace. Please review when you have time.",
      timestamp: "10:35 AM",
      avatar: "/api/placeholder/32/32",
      isOwn: false
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team Messaging</h1>
            <p className="text-muted-foreground">
              Communicate with your investment teams and collaborators
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search conversations..." className="pl-8" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-1 p-4">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.avatar} />
                            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{conversation.name}</p>
                            <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge className="bg-blue-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">AI Trading Team</p>
                      <p className="text-sm text-muted-foreground">12 members • 8 online</p>
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
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`max-w-[70%] ${message.isOwn ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{message.sender}</span>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          </div>
                          <div
                            className={`p-3 rounded-lg ${
                              message.isOwn
                                ? 'bg-blue-500 text-white'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input placeholder="Type your message..." className="pr-12" />
                      <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}