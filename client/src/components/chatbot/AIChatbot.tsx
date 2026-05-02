import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Star,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: any;
}

interface ChatbotState {
  messages: Message[];
  sessionId: string | null;
  conversationId: number | null;
  userProfile: string | null;
  confidence: number;
  nextQuestion: string | null;
  recommendations: string[];
  isLoading: boolean;
  error: string | null;
}

export default function AIChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatState, setChatState] = useState<ChatbotState>({
    messages: [],
    sessionId: null,
    conversationId: null,
    userProfile: null,
    confidence: 0,
    nextQuestion: null,
    recommendations: [],
    isLoading: false,
    error: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const startConversation = async (message: string) => {
    setChatState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiRequest("POST", "/api/chatbot/conversation", {
        message,
        userId: user?.id
      });

      const data = await response.json();

      setChatState(prev => ({
        ...prev,
        messages: [
          { role: 'user', content: message, timestamp: new Date().toISOString() },
          { role: 'assistant', content: data.response, timestamp: new Date().toISOString() }
        ],
        sessionId: data.sessionId,
        conversationId: data.conversationId,
        userProfile: data.profileDetected,
        confidence: data.confidence,
        nextQuestion: data.nextQuestion,
        recommendations: data.recommendations,
        isLoading: false
      }));

    } catch (error) {
      console.error("Error starting conversation:", error);
      setChatState(prev => ({
        ...prev,
        error: "Failed to start conversation. Please try again.",
        isLoading: false
      }));
    }
  };

  const continueConversation = async (message: string) => {
    if (!chatState.sessionId) return;

    setChatState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiRequest("POST", `/api/chatbot/conversation/${chatState.sessionId}/message`, {
        message,
        userId: user?.id
      });

      const data = await response.json();

      setChatState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'user', content: message, timestamp: new Date().toISOString() },
          { role: 'assistant', content: data.response, timestamp: new Date().toISOString() }
        ],
        nextQuestion: data.nextQuestion,
        recommendations: data.recommendations,
        isLoading: false
      }));

    } catch (error) {
      console.error("Error continuing conversation:", error);
      setChatState(prev => ({
        ...prev,
        error: "Failed to send message. Please try again.",
        isLoading: false
      }));
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatState.isLoading) return;

    const message = inputMessage.trim();
    setInputMessage("");

    if (chatState.sessionId) {
      await continueConversation(message);
    } else {
      await startConversation(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getProfileBadgeColor = (profile: string) => {
    const colors = {
      beginner_investor: "bg-green-100 text-green-800",
      experienced_investor: "bg-blue-100 text-blue-800",
      saver: "bg-yellow-100 text-yellow-800",
      developer: "bg-purple-100 text-purple-800",
      data_provider: "bg-orange-100 text-orange-800"
    };
    return colors[profile as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatProfileName = (profile: string) => {
    return profile.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px]">
      <Card className="h-full flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">GeFi AI Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4 pt-0">
          {/* Profile Detection Display */}
          {chatState.userProfile && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Profile Detected:</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getProfileBadgeColor(chatState.userProfile)}>
                  {formatProfileName(chatState.userProfile)}
                </Badge>
                <span className="text-xs text-gray-600">
                  {chatState.confidence}% confidence
                </span>
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {chatState.messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Hi! I'm your GeFi AI Assistant</p>
                  <p className="text-sm text-gray-500">
                    Tell me about your financial goals or experience to get started!
                  </p>
                </div>
              )}

              {chatState.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Next Question Suggestion */}
              {chatState.nextQuestion && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Suggested Question:
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {chatState.nextQuestion}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {chatState.recommendations.length > 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Recommendations:
                    </span>
                  </div>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    {chatState.recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {chatState.isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {chatState.error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {chatState.error}
                  </p>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2 mt-4">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={chatState.isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || chatState.isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}