import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Send, User, Bot } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface OnboardingQuestions {
  [key: string]: string[];
}

const ONBOARDING_QUESTIONS: OnboardingQuestions = {
  "Portfolio Manager": [
    "Are you an accredited investor?",
    "What is your primary investment strategy (Growth, Value, Income, etc.)?",
    "Do you comply with SEC regulations and have proper licenses?",
    "What is your typical portfolio size range?",
    "Which asset classes do you primarily focus on?"
  ],
  "Developer": [
    "Do you have experience with federated learning or AI model development?",
    "Are you familiar with data privacy laws (GDPR, CCPA, etc.)?",
    "Will you adhere to the platform's code of conduct and security standards?",
    "What programming languages are you most proficient in?",
    "Have you worked with financial data or trading systems before?"
  ],
  "Data Provider": [
    "What type of financial data do you specialize in providing?",
    "Is your data compliant with GDPR and other privacy regulations?",
    "Do you have data sharing agreements and proper licensing in place?",
    "What is the frequency and format of your data updates?",
    "Do you have experience with data quality assurance and validation?"
  ],
  "Regulator": [
    "Which regulatory body do you represent?",
    "What is your primary jurisdiction and regulatory scope?",
    "Are you authorized to access and monitor this type of platform?",
    "What specific compliance areas are you focused on?",
    "Do you require special access levels or reporting capabilities?"
  ]
};

const ROLE_DESCRIPTIONS = {
  "Portfolio Manager": "Manage investment portfolios using AI-powered insights and risk assessment tools",
  "Developer": "Build and deploy AI financial models, contribute to the marketplace ecosystem",
  "Data Provider": "Supply high-quality financial data to enhance AI model training and performance",
  "Regulator": "Monitor platform compliance and ensure regulatory standards are maintained"
};

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start the onboarding flow
    addBotMessage("Welcome to GeFi! I'm here to help set up your profile. Let's start by understanding your role on our platform.");
    setTimeout(() => {
      addBotMessage("Please select your primary role:");
      showRoleSelection();
    }, 1000);
  }, []);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (text: string) => {
    setTimeout(() => addMessage(text, 'bot'), 500);
  };

  const showRoleSelection = () => {
    const roles = Object.keys(ONBOARDING_QUESTIONS);
    roles.forEach((role, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `role-${index}`,
          text: `${role}: ${ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}`,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }, 300 * (index + 1));
    });
  };

  const selectRole = (role: string) => {
    setCurrentRole(role);
    addMessage(`I'm a ${role}`, 'user');
    
    setTimeout(() => {
      addBotMessage(`Great! As a ${role}, I'll ask you a few questions to customize your experience. Let's get started:`);
      setTimeout(() => {
        setCurrentQuestionIndex(0);
        askNextQuestion(role, 0);
      }, 1000);
    }, 500);
  };

  const askNextQuestion = (role: string, questionIndex: number) => {
    const questions = ONBOARDING_QUESTIONS[role];
    if (questionIndex < questions.length) {
      setTimeout(() => {
        addBotMessage(`${questionIndex + 1}/${questions.length}: ${questions[questionIndex]}`);
      }, 500);
    } else {
      completeOnboarding();
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentInput.trim() || !currentRole) return;

    const questions = ONBOARDING_QUESTIONS[currentRole];
    const currentQuestion = questions[currentQuestionIndex];
    
    addMessage(currentInput, 'user');
    
    // Store the answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: currentInput
    }));

    setCurrentInput("");
    
    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    
    if (nextIndex < questions.length) {
      askNextQuestion(currentRole, nextIndex);
    } else {
      setTimeout(() => {
        addBotMessage("Perfect! I have all the information I need. Let me set up your personalized dashboard...");
        setTimeout(() => completeOnboarding(), 2000);
      }, 500);
    }
  };

  const completeOnboarding = async () => {
    setIsSubmitting(true);
    setIsCompleted(true);

    try {
      // Submit the onboarding data to the backend
      await apiRequest('POST', '/api/complete-onboarding', {
        role: currentRole,
        answers: answers
      });

      addBotMessage("Your profile has been created successfully! Redirecting you to your personalized dashboard...");
      
      // Redirect to appropriate dashboard after a delay
      setTimeout(() => {
        const dashboardRoutes = {
          "Portfolio Manager": "/portfolio",
          "Developer": "/developer",
          "Data Provider": "/data-provider", 
          "Regulator": "/regulator"
        };
        
        const route = dashboardRoutes[currentRole as keyof typeof dashboardRoutes] || "/dashboard";
        setLocation(route);
      }, 3000);

    } catch (error) {
      console.error('Error completing onboarding:', error);
      addBotMessage("There was an error setting up your profile. Please try again or contact support.");
      setIsSubmitting(false);
      setIsCompleted(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GeFi</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome to GeFi</h1>
          <p className="text-muted-foreground mt-2">
            Let's set up your personalized experience
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="border border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Setup Assistant</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-muted/30">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 mb-4 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex-shrink-0">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Role Selection Buttons */}
            {!currentRole && messages.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {Object.keys(ONBOARDING_QUESTIONS).map((role) => (
                  <Button
                    key={role}
                    onClick={() => selectRole(role)}
                    variant="outline"
                    className="p-4 h-auto text-left"
                  >
                    <div>
                      <div className="font-medium">{role}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Input Field */}
            {currentRole && !isCompleted && (
              <div className="flex space-x-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer here..."
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!currentInput.trim() || isSubmitting}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Completion Status */}
            {isCompleted && (
              <div className="text-center py-4">
                <div className="inline-flex items-center space-x-2 text-green-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span>Setting up your dashboard...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        {currentRole && !isCompleted && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {ONBOARDING_QUESTIONS[currentRole]?.length}
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / ONBOARDING_QUESTIONS[currentRole]?.length) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}