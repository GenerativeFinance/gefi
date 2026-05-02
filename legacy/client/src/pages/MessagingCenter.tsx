import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Send, 
  Search, 
  Users, 
  MessageCircle, 
  Hash, 
  Plus,
  MoreVertical,
  AtSign,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info
} from "lucide-react";
import { Link } from "wouter";

interface Conversation {
  id: string;
  name: string;
  type: "direct" | "team" | "forum" | "group";
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string | null;
  }>;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  type: "text" | "file" | "system";
  createdAt: string;
  isOwn: boolean;
}

export default function MessagingCenter() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["/api/messaging/conversations"],
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messaging/conversations", selectedConversation, "messages"],
    enabled: !!selectedConversation,
  });

  // Type-safe array conversions
  const conversationsList = Array.isArray(conversations) ? conversations as Conversation[] : [];
  const messagesList = Array.isArray(messages) ? messages as Message[] : [];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const response = await fetch(`/api/messaging/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/messaging/conversations", conversationId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messaging/conversations"] });
      setMessageText("");
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesList]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedConversation && conversationsList.length > 0) {
      setSelectedConversation(conversationsList[0].id);
    }
  }, [conversationsList, selectedConversation]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    sendMessageMutation.mutate({
      conversationId: selectedConversation,
      content: messageText.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversationsList.filter((conv) => {
    if (activeTab !== "all" && conv.type !== activeTab) return false;
    if (searchQuery) {
      return conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  });

  const selectedConv = conversationsList.find((c) => c.id === selectedConversation);

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "team": return <Users className="h-4 w-4" />;
      case "forum": return <Hash className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Sign in to access messaging</h2>
          <p className="text-gray-600">Connect with other traders and developers in real-time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="direct">Direct</TabsTrigger>
            <TabsTrigger value="team">Teams</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Conversations List */}
        <ScrollArea className="flex-1 px-2">
          {conversationsLoading ? (
            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-2">
                    {getConversationIcon(conversation.type)}
                    {conversation.type === "direct" && conversation.participants.length > 0 ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.participants.find(p => p.id !== user?.id)?.avatar || undefined} />
                        <AvatarFallback className="text-sm">
                          {conversation.participants.find(p => p.id !== user?.id)?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        {getConversationIcon(conversation.type)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate text-sm">{conversation.name}</h3>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2 h-5 min-w-5 text-xs px-1.5">
                          {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    )}
                    {conversation.lastMessageAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {formatMessageTime(conversation.lastMessageAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getConversationIcon(selectedConv.type)}
                    <h2 className="text-lg font-semibold">{selectedConv.name}</h2>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedConv.participants.length} members
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="text-gray-500">Loading messages...</div>
                </div>
              ) : messagesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Start the conversation
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Be the first to send a message in this conversation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messagesList.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.isOwn ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.senderAvatar || undefined} />
                        <AvatarFallback className="text-sm">
                          {message.senderName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`flex-1 ${message.isOwn ? "text-right" : ""}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {message.senderName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                        <div
                          className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isOwn
                              ? "bg-blue-500 text-white"
                              : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-end space-x-2">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <AtSign className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <Textarea
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-10 max-h-32 resize-none"
                    rows={1}
                  />
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // No conversation selected
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to Messages
              </h2>
              <p className="text-gray-500 max-w-sm mb-6">
                Select a conversation from the sidebar to start messaging with other traders and developers.
              </p>
              <div className="space-y-2">
                <Link href="/community">
                  <Button variant="outline" className="mr-2">
                    <Hash className="h-4 w-4 mr-2" />
                    Community Hub
                  </Button>
                </Link>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}