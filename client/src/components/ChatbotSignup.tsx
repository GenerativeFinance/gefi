import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Mail, MapPin, Briefcase, ArrowRight, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  message: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  role: string;
  company?: string;
  experience?: string;
  interests?: string[];
}

const ROLE_OPTIONS = [
  'Investor',
  'Developer',
  'Data Provider',
  'Regulator',
  'Admin',
  'Moderator'
];

const COUNTRY_OPTIONS = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
  'Japan', 'Australia', 'Singapore', 'Switzerland', 'Netherlands',
  'Sweden', 'Other'
];

export default function ChatbotSignup({ onComplete }: { onComplete: (userData: UserData) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const steps = [
    {
      question: "Hello! I'm GeFi AI, your personal assistant for setting up your account. What's your email address?",
      field: 'email',
      type: 'input',
      validation: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errorMessage: "Please enter a valid email address"
    },
    {
      question: "Great! What's your first name?",
      field: 'firstName',
      type: 'input',
      validation: (value: string) => value.trim().length >= 2,
      errorMessage: "First name must be at least 2 characters"
    },
    {
      question: "And your last name?",
      field: 'lastName',
      type: 'input',
      validation: (value: string) => value.trim().length >= 2,
      errorMessage: "Last name must be at least 2 characters"
    },
    {
      question: "Which country are you based in?",
      field: 'country',
      type: 'select',
      options: COUNTRY_OPTIONS,
      validation: (value: string) => COUNTRY_OPTIONS.includes(value),
      errorMessage: "Please select a valid country"
    },
    {
      question: "What's your primary role in the financial ecosystem?",
      field: 'role',
      type: 'select',
      options: ROLE_OPTIONS,
      validation: (value: string) => ROLE_OPTIONS.includes(value),
      errorMessage: "Please select a valid role"
    },
    {
      question: "Perfect! Let me create your account now...",
      field: 'complete',
      type: 'complete'
    }
  ];

  useEffect(() => {
    // Start conversation
    addBotMessage("Welcome to GeFi! I'll help you create your account with just a few questions. 🤖");
    setTimeout(() => {
      addBotMessage(steps[0].question);
      setShowOptions(steps[0].type === 'select');
    }, 1000);
  }, []);

  const addBotMessage = (message: string, isTyping = false) => {
    const newMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      message,
      timestamp: new Date(),
      isTyping
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (value?: string) => {
    const inputValue = value || currentInput;
    if (!inputValue.trim()) return;

    const currentStepData = steps[currentStep];
    
    // Validate input
    if (currentStepData.validation && !currentStepData.validation(inputValue)) {
      addBotMessage(currentStepData.errorMessage || "Invalid input. Please try again.");
      return;
    }

    // Add user message
    addUserMessage(inputValue);
    setCurrentInput('');
    setShowOptions(false);

    // Update user data
    const newUserData = { ...userData, [currentStepData.field]: inputValue };
    setUserData(newUserData);

    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentStep < steps.length - 1) {
        // Move to next step
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        if (nextStep < steps.length) {
          addBotMessage(steps[nextStep].question);
          setShowOptions(steps[nextStep].type === 'select');
        }
      } else {
        // Complete signup
        addBotMessage("Excellent! Your account is being created. Welcome to GeFi! 🎉");
        setTimeout(() => {
          onComplete(newUserData as UserData);
        }, 2000);
      }
    }, 1500);
  };

  const handleOptionSelect = (option: string) => {
    handleSubmit(option);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            GeFi Account Setup
          </CardTitle>
          <CardDescription className="text-lg">
            Let our AI assistant help you create your personalized account
          </CardDescription>
          <div className="flex justify-center space-x-2">
            {steps.slice(0, -1).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'bot' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-gray-600'
                    }`}>
                      {message.sender === 'bot' ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.sender === 'bot'
                        ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      {message.isTyping && (
                        <div className="flex space-x-1 mt-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="px-4 py-2 bg-white dark:bg-gray-600 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          {currentStep < steps.length - 1 && (
            <div className="space-y-4">
              {showOptions ? (
                <div className="grid grid-cols-2 gap-2">
                  {steps[currentStep].options?.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      onClick={() => handleOptionSelect(option)}
                      className="text-left justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Input
                    type={steps[currentStep].field === 'email' ? 'email' : 'text'}
                    placeholder={`Enter your ${steps[currentStep].field}...`}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1"
                    autoFocus
                  />
                  <Button 
                    onClick={() => handleSubmit()} 
                    disabled={!currentInput.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Progress Summary */}
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200 mb-2">Your Information:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {userData.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300">{userData.email}</span>
                  </div>
                )}
                {userData.firstName && (
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300">{userData.firstName} {userData.lastName}</span>
                  </div>
                )}
                {userData.country && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300">{userData.country}</span>
                  </div>
                )}
                {userData.role && (
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-3 h-3 text-blue-600" />
                    <Badge variant="secondary" className="text-xs">{userData.role}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}