import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle,
  Send,
  Search,
  Plus,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Star,
  Users,
  Settings,
  PlusCircle,
  Hash,
  Bell,
  BellOff,
  Archive,
  Trash2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
  online: boolean;
  type: "group" | "direct";
  members?: number;
  onlineMembers?: number;
}

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
  avatar?: string;
  isOwn: boolean;
  type?: "text" | "file" | "system";
}

export default function TeamMessaging() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "AI Trading Team",
      lastMessage: "Let's review the latest algorithm performance...",
      timestamp: "2 min ago",
      unread: 3,
      online: true,
      type: "group",
      members: 12,
      onlineMembers: 8
    },
    {
      id: "2",
      name: "Sarah Chen",
      lastMessage: "The risk assessment model is ready for testing",
      timestamp: "15 min ago",
      unread: 0,
      online: true,
      type: "direct"
    },
    {
      id: "3",
      name: "ESG Investment Group",
      lastMessage: "New ESG scoring framework proposal attached",
      timestamp: "1 hour ago",
      unread: 1,
      online: false,
      type: "group",
      members: 8,
      onlineMembers: 3
    },
    {
      id: "4",
      name: "Mike Johnson",
      lastMessage: "Portfolio rebalancing complete",
      timestamp: "2 hours ago",
      unread: 0,
      online: false,
      type: "direct"
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      conversationId: "1",
      sender: "Sarah Chen",
      senderId: "sarah_chen",
      content: "The latest backtesting results look promising. ROI increased by 12% with the new algorithm.",
      timestamp: "10:30 AM",
      isOwn: false,
      type: "text"
    },
    {
      id: "2",
      conversationId: "1",
      sender: "You",
      senderId: (user as any)?.id || "current_user",
      content: "Excellent! Can we schedule a call to discuss the implementation strategy?",
      timestamp: "10:32 AM",
      isOwn: true,
      type: "text"
    },
    {
      id: "3",
      conversationId: "1",
      sender: "Mike Johnson",
      senderId: "mike_johnson",
      content: "I've uploaded the risk analysis report to the shared workspace. Please review when you have time.",
      timestamp: "10:35 AM",
      isOwn: false,
      type: "text"
    }
  ]);

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages.filter(m => m.conversationId === selectedConversation);

  // WebSocket connection for real-time messaging
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log("Connected to messaging WebSocket");
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "new_message") {
            setMessages(prev => [...prev, data.message]);
            // Update conversation last message
            setConversations(prev => 
              prev.map(conv => 
                conv.id === data.message.conversationId 
                  ? { ...conv, lastMessage: data.message.content, timestamp: "now" }
                  : conv
              )
            );
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentConversation || !user) return;
    
    try {
      // Send message via API
      const response = await fetch('/api/messaging/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: messageText.trim(),
          type: 'text'
        })
      });

      if (response.ok) {
        const apiMessage = await response.json();
        
        const newMessage: Message = {
          id: apiMessage.id,
          conversationId: selectedConversation,
          sender: `${user.firstName} ${user.lastName}` || "You",
          senderId: user.id,
          content: messageText.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
          type: "text"
        };

        setMessages(prev => [...prev, newMessage]);
        
        // Update conversation last message
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation 
              ? { ...conv, lastMessage: messageText, timestamp: "now" }
              : conv
          )
        );

        // Send via WebSocket if connected
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "send_message",
            message: apiMessage
          }));
        }

        setMessageText("");
      } else {
        console.error('Failed to send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to local update
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId: selectedConversation,
        sender: "You",
        senderId: user.id,
        content: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        type: "text"
      };

      setMessages(prev => [...prev, newMessage]);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, lastMessage: messageText, timestamp: "now" }
            : conv
        )
      );
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mobile-content-padding">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mobile-heading">Team Messaging</h1>
            <p className="text-muted-foreground mobile-body-text">
              Communicate with your investment teams and collaborators
            </p>
          </div>
          <Button className="mobile-button mobile-touch-target w-full lg:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="xl:col-span-1">
            <Card className="mobile-card h-full">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold mobile-subheading">Conversations</h2>
                  <Button variant="ghost" size="sm" className="mobile-touch-target">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-9 mobile-touch-target"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="space-y-1 p-2">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mobile-list-item mobile-touch-target",
                          selectedConversation === conversation.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="relative flex-shrink-0">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold",
                            conversation.type === "group" 
                              ? "bg-blue-500" 
                              : "bg-green-500"
                          )}>
                            {conversation.type === "group" ? (
                              <Users className="h-5 w-5" />
                            ) : (
                              getInitials(conversation.name)
                            )}
                          </div>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate mobile-body-text">
                              {conversation.name}
                            </p>
                            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground truncate flex-1">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unread > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center ml-2">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                          {conversation.type === "group" && conversation.members && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {conversation.members} members • {conversation.onlineMembers} online
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="xl:col-span-3">
            <Card className="mobile-card h-full flex flex-col">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="pb-4 border-b flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold",
                          currentConversation.type === "group" 
                            ? "bg-blue-500" 
                            : "bg-green-500"
                        )}>
                          {currentConversation.type === "group" ? (
                            <Users className="h-5 w-5" />
                          ) : (
                            getInitials(currentConversation.name)
                          )}
                        </div>
                        <div>
                          <p className="font-medium mobile-subheading">{currentConversation.name}</p>
                          {currentConversation.type === "group" ? (
                            <p className="text-sm text-muted-foreground">
                              {currentConversation.members} members • {currentConversation.onlineMembers} online
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {currentConversation.online ? "Online" : "Last seen recently"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="mobile-touch-target">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="mobile-touch-target">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="mobile-touch-target">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="mobile-touch-target">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {currentMessages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-3",
                              message.isOwn ? "flex-row-reverse" : ""
                            )}
                          >
                            <div className="flex-shrink-0">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                                message.isOwn ? "bg-blue-500" : "bg-gray-500"
                              )}>
                                {getInitials(message.sender)}
                              </div>
                            </div>
                            <div className={cn(
                              "max-w-[70%] space-y-1",
                              message.isOwn ? "text-right" : ""
                            )}>
                              <div className={cn(
                                "flex items-center gap-2 text-xs text-muted-foreground",
                                message.isOwn ? "flex-row-reverse" : ""
                              )}>
                                <span className="font-medium">{message.sender}</span>
                                <span>{message.timestamp}</span>
                              </div>
                              <div
                                className={cn(
                                  "p-3 rounded-lg text-sm mobile-body-text",
                                  message.isOwn
                                    ? "bg-blue-500 text-white rounded-br-sm"
                                    : "bg-muted rounded-bl-sm"
                                )}
                              >
                                {message.content}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="border-t p-4 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="mobile-touch-target">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 relative">
                          <Input 
                            placeholder="Type your message..." 
                            className="pr-12 mobile-touch-target"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          <Button 
                            size="sm" 
                            className="absolute right-1 top-1/2 -translate-y-1/2 mobile-touch-target"
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium mb-2">Select a conversation</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}